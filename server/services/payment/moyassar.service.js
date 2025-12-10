const axios = require('axios');
const { MOYASSAR_CONFIG } = require('../../config/moyassar');
const Subscription = require('../../models/subscription');
const Plan = require('../../models/plan');

/**
 * Create Base64 encoded authorization header for Moyassar API
 */
const getAuthHeader = () => {
  if (!MOYASSAR_CONFIG.secretKey) {
    throw new Error('Moyassar secret key is not configured. Please check your .env file.');
  }
  
  // Moyassar uses Basic Auth: Base64(secretKey:)
  const credentials = Buffer.from(`${MOYASSAR_CONFIG.secretKey}:`).toString('base64');
  return `Basic ${credentials}`;
};

/**
 * Initiate payment with Moyassar
 * @param {String} subscriptionId - Subscription ID
 * @param {Number} amount - Payment amount in halalas (1 SAR = 100 halalas)
 * @param {String} description - Payment description
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Payment response with payment URL
 */
const initiatePayment = async (subscriptionId, amount, description, metadata = {}) => {
  try {
    // Validate configuration
    if (!MOYASSAR_CONFIG.secretKey) {
      throw new Error('Moyassar secret key is not configured');
    }
    if (!MOYASSAR_CONFIG.apiUrl) {
      throw new Error('Moyassar API URL is not configured');
    }

    // Test DNS resolution before making the request (non-blocking)
    // Note: This test may fail even if the actual request works, so we don't throw on failure
    console.log('🔍 Testing connection to Moyassar API:', MOYASSAR_CONFIG.apiUrl);
    try {
      const urlObj = new URL(MOYASSAR_CONFIG.apiUrl);
      const hostname = urlObj.hostname;
      const dns = require('dns').promises;
      await dns.lookup(hostname);
      console.log('✅ DNS resolution successful for:', hostname);
    } catch (dnsError) {
      console.warn('⚠️  DNS resolution test failed (will still attempt API request):', dnsError.message);
      console.warn('💡 If the API request also fails, check:');
      console.warn('   1. Internet connection');
      console.warn('   2. DNS settings');
      console.warn('   3. Firewall configuration');
      console.warn('   4. Try using a different DNS server (e.g., 8.8.8.8)');
      // Don't throw - continue to attempt the actual API request
      // Sometimes DNS test fails but axios request works due to different DNS resolution
    }

    // Convert SAR to halalas (Moyassar uses halalas as the smallest unit)
    const amountInHalalas = Math.round(amount * 100);

    const authHeader = getAuthHeader();

    // Try Invoice API first (for payment links)
    // If that fails, fall back to Payment API without source (creates payment link)
    let response;
    let useInvoiceAPI = true;

    const paymentData = {
      amount: amountInHalalas,
      currency: MOYASSAR_CONFIG.currency,
      description: description || MOYASSAR_CONFIG.description,
      metadata: {
        subscription_id: subscriptionId.toString(),
        ...metadata,
      },
    };

    // Add callback_url for redirect after payment
    // This is where users are redirected after completing payment on Moyassar
    // Note: This should be the BACKEND URL, not frontend, as it's an API endpoint
    try {
      // Use backend URL (ngrok or server URL) for the callback
      const backendUrl = process.env.BACKEND_URL || 
                        process.env.MOYASSAR_WEBHOOK_URL?.replace('/api/payment/moyassar/webhook', '') ||
                        process.env.BASE_URL || 
                        'http://localhost:5000';
      const urlObj = new URL(backendUrl);
      // Redirect to our callback endpoint with subscription ID
      paymentData.callback_url = `${urlObj.origin}/api/payment/moyassar/callback?subscriptionId=${subscriptionId}`;
      console.log('✅ Set callback URL:', paymentData.callback_url);
    } catch (error) {
      console.warn('Error setting callback URL:', error);
    }

    try {
      // Try Invoice API first
      const invoiceUrl = `${MOYASSAR_CONFIG.apiUrl}/invoices`;
      console.log('Moyassar Invoice API Request:', {
        url: invoiceUrl,
        amount: amountInHalalas,
        currency: MOYASSAR_CONFIG.currency,
        hasAuth: !!authHeader,
        secretKeyPrefix: MOYASSAR_CONFIG.secretKey?.substring(0, 10) + '...',
        invoiceData: JSON.stringify(paymentData, null, 2),
      });

      // Retry logic for network errors
      let lastError = null;
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 Attempt ${attempt}/${maxRetries} to connect to Moyassar API...`);
          response = await axios.post(
            invoiceUrl,
            paymentData,
            {
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              timeout: 30000,
              // Add DNS lookup options
              family: 4, // Force IPv4
            }
          );
          console.log('✅ Successfully connected to Moyassar API');
          break; // Success, exit retry loop
        } catch (attemptError) {
          lastError = attemptError;
          // Handle DNS/network errors
          if (attemptError.code === 'ENOTFOUND' || attemptError.code === 'ECONNREFUSED' || attemptError.code === 'ETIMEDOUT') {
            if (attempt < maxRetries) {
              const waitTime = attempt * 1000; // Exponential backoff: 1s, 2s, 3s
              console.warn(`⚠️  Network error (attempt ${attempt}/${maxRetries}), retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // Retry
            } else {
              console.error('❌ All retry attempts failed');
              throw new Error(`Cannot connect to Moyassar API after ${maxRetries} attempts (${attemptError.code}). Please check your internet connection and DNS settings.`);
            }
          } else {
            // Not a network error, don't retry
            throw attemptError;
          }
        }
      }
    } catch (invoiceError) {
      // Handle DNS/network errors
      if (invoiceError.code === 'ENOTFOUND' || invoiceError.code === 'ECONNREFUSED' || invoiceError.code === 'ETIMEDOUT') {
        console.error('❌ Network error connecting to Moyassar API:', {
          code: invoiceError.code,
          message: invoiceError.message,
          apiUrl: MOYASSAR_CONFIG.apiUrl,
        });
        throw new Error(`Cannot connect to Moyassar API (${invoiceError.code}). Please check your internet connection and API URL: ${MOYASSAR_CONFIG.apiUrl}`);
      }
      
      // If Invoice API doesn't exist (404) or fails, try Payment API without source
      if (invoiceError.response?.status === 404 || invoiceError.response?.status === 400) {
        console.log('Invoice API not available, trying Payment API without source...');
        useInvoiceAPI = false;
        
        // Try Payment API - some Moyassar implementations allow creating payment without source
        // This creates a payment link that user can complete later
        console.log('Moyassar Payment API Request (no source):', {
          url: `${MOYASSAR_CONFIG.apiUrl}/payments`,
          amount: amountInHalalas,
          currency: MOYASSAR_CONFIG.currency,
          hasAuth: !!authHeader,
          secretKeyPrefix: MOYASSAR_CONFIG.secretKey?.substring(0, 10) + '...',
          paymentData: JSON.stringify(paymentData, null, 2),
        });

        try {
          response = await axios.post(
            `${MOYASSAR_CONFIG.apiUrl}/payments`,
            paymentData,
            {
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              timeout: 30000,
              family: 4, // Force IPv4
            }
          );
        } catch (paymentError) {
          // Handle DNS/network errors
          if (paymentError.code === 'ENOTFOUND' || paymentError.code === 'ECONNREFUSED' || paymentError.code === 'ETIMEDOUT') {
            console.error('❌ Network error connecting to Moyassar Payment API:', {
              code: paymentError.code,
              message: paymentError.message,
              apiUrl: MOYASSAR_CONFIG.apiUrl,
            });
            throw new Error(`Cannot connect to Moyassar API (${paymentError.code}). Please check your internet connection and API URL: ${MOYASSAR_CONFIG.apiUrl}`);
          }
          throw paymentError;
        }
      } else {
        // Re-throw if it's a different error
        throw invoiceError;
      }
    }

    // Extract payment URL from response
    let paymentUrl = null;
    
    // Log full response for debugging
    const apiType = useInvoiceAPI ? 'Invoice' : 'Payment';
    console.log(`Moyassar ${apiType} API Response:`, JSON.stringify(response.data, null, 2));
    
    // Try different possible locations for payment URL
    // Invoice API typically returns URL directly
    if (response.data.url) {
      paymentUrl = response.data.url;
    } else if (response.data.invoice_url) {
      paymentUrl = response.data.invoice_url;
    } else if (response.data.payment_url) {
      paymentUrl = response.data.payment_url;
    } else if (response.data.link) {
      paymentUrl = response.data.link;
    } else if (response.data.invoice?.url) {
      paymentUrl = response.data.invoice.url;
    } else if (response.data.source?.transaction_url) {
      paymentUrl = response.data.source.transaction_url;
    } else if (response.data.transaction_url) {
      paymentUrl = response.data.transaction_url;
    } else if (response.data.redirect_url) {
      paymentUrl = response.data.redirect_url;
    }
    
    // If still no URL, log warning
    if (!paymentUrl) {
      console.warn(`⚠️  Payment URL not found in ${apiType} API response. Response structure:`, Object.keys(response.data));
      console.warn('⚠️  Full response:', JSON.stringify(response.data, null, 2));
    }

    return {
      success: true,
      payment: response.data,
      paymentId: response.data.id,
      paymentUrl: paymentUrl,
    };
  } catch (error) {
    console.error('Moyassar payment initiation error:', {
      message: error.response?.data?.message || error.message,
      type: error.response?.data?.type,
      errors: error.response?.data?.errors,
      status: error.response?.status,
      statusText: error.response?.statusText,
      fullError: JSON.stringify(error.response?.data, null, 2),
    });
    
    // Provide more helpful error messages
    if (error.response?.status === 401 || error.response?.data?.type === 'authentication_error') {
      throw new Error(
        'Invalid Moyassar credentials. Please check your MOYASSAR_SECRET_KEY in .env file. ' +
        'Make sure you are using the correct secret key from your Moyassar dashboard.'
      );
    }
    
    // Handle validation errors with more details
    if (error.response?.data?.errors) {
      let errorMessages = '';
      
      // Handle object format errors (from Moyassar)
      if (typeof error.response.data.errors === 'object' && !Array.isArray(error.response.data.errors)) {
        const errorObj = error.response.data.errors;
        errorMessages = Object.keys(errorObj).map(field => {
          const fieldErrors = Array.isArray(errorObj[field]) ? errorObj[field] : [errorObj[field]];
          return `${field}: ${fieldErrors.join(', ')}`;
        }).join('; ');
      } else if (Array.isArray(error.response.data.errors)) {
        errorMessages = error.response.data.errors.map(err => 
          `${err.field || 'field'}: ${err.message || err}`
        ).join(', ');
      }
      
      if (errorMessages) {
        throw new Error(`Moyassar validation error: ${errorMessages}`);
      }
    }
    
    throw new Error(
      error.response?.data?.message || 
      (error.response?.data?.errors && typeof error.response.data.errors === 'object' 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : 'Failed to initiate payment with Moyassar')
    );
  }
};

/**
 * Verify payment/invoice status with Moyassar
 * @param {String} paymentId - Moyassar payment/invoice ID
 * @returns {Promise<Object>} Payment/Invoice details
 */
const verifyPayment = async (paymentId) => {
  try {
    // Try Invoice API first (for invoice payments)
    let response;
    try {
      response = await axios.get(
        `${MOYASSAR_CONFIG.apiUrl}/invoices/${paymentId}`,
        {
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (invoiceError) {
      // If invoice not found, try Payment API
      if (invoiceError.response?.status === 404) {
        response = await axios.get(
          `${MOYASSAR_CONFIG.apiUrl}/payments/${paymentId}`,
          {
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        throw invoiceError;
      }
    }

    return {
      success: true,
      payment: response.data,
    };
  } catch (error) {
    console.error('Moyassar payment verification error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to verify payment with Moyassar'
    );
  }
};

/**
 * Process payment and update subscription
 * @param {String} paymentId - Moyassar payment ID
 * @param {String} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Updated subscription
 */
const processPayment = async (paymentId, subscriptionId) => {
  try {
    // Verify payment with Moyassar
    const paymentResult = await verifyPayment(paymentId);
    const payment = paymentResult.payment;

    // Find subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Check payment/invoice status (case-insensitive)
    // Invoice API uses 'status' field, Payment API also uses 'status'
    // For invoices, also check if payments array has paid payments
    const status = (payment.status || payment.invoice?.status || '').toLowerCase();
    const hasPaidPayment = payment.payments && Array.isArray(payment.payments) && 
                          payment.payments.some(p => {
                            const pStatus = (p.status || '').toLowerCase();
                            return pStatus === 'paid';
                          });
    
    // Also check invoice paid status
    const invoicePaid = payment.invoice && (
      (payment.invoice.status || '').toLowerCase() === 'paid' ||
      payment.invoice.paid === true ||
      payment.invoice.paid_at !== null
    );
    
    console.log('💳 Payment status check:', {
      status,
      hasPaidPayment,
      invoicePaid,
      paymentsCount: payment.payments?.length || 0,
      payments: payment.payments,
      invoice: payment.invoice,
    });
    
    // Invoice is paid if status is 'paid' OR if it has paid payments OR invoice is marked as paid
    const isPaid = status === 'paid' || hasPaidPayment || invoicePaid;
    
    if (isPaid) {
      // Update subscription
      const updatedSubscription = await Subscription.update(subscriptionId, {
        paymentStatus: 'Paid',
        isActive: true,
        transactionId: paymentId,
        moyassarPaymentId: paymentId,
        moyassarPaymentStatus: 'paid',
      });

      return {
        success: true,
        subscription: updatedSubscription,
        message: 'Payment processed successfully',
      };
    } else if (status === 'failed' || status === 'Failed') {
      const updatedSubscription = await Subscription.update(subscriptionId, {
        moyassarPaymentStatus: 'failed',
      });

      return {
        success: false,
        subscription: updatedSubscription,
        message: 'Payment failed',
      };
    } else {
      return {
        success: false,
        subscription,
        message: `Payment status: ${status || 'unknown'}`,
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

/**
 * Handle webhook from Moyassar
 * @param {Object} webhookData - Webhook payload from Moyassar
 * @returns {Promise<Object>} Processing result
 */
const handleWebhook = async (webhookData) => {
  try {
    console.log('🔔 Processing Moyassar webhook...');
    console.log('📦 Full webhook payload:', JSON.stringify(webhookData, null, 2));

    // Extract payment/invoice information from webhook
    // Moyassar can send either payment or invoice webhooks in different formats
    // Priority: invoice_id from data (most reliable) > data.id > top-level id
    const paymentId = webhookData.data?.invoice_id ||
                     webhookData.data?.id || 
                     webhookData.invoice_id ||
                     webhookData.payment?.id || 
                     webhookData.invoice?.id ||
                     webhookData.id ||
                     webhookData.object?.id ||
                     webhookData.payment_id;

    console.log('🔍 Extracting webhook data:', {
      hasId: !!webhookData.id,
      hasPayment: !!webhookData.payment,
      hasInvoice: !!webhookData.invoice,
      hasData: !!webhookData.data,
      paymentId: paymentId,
      metadata: webhookData.metadata,
      fullKeys: Object.keys(webhookData)
    });

    // Try multiple ways to extract subscription_id from metadata
    let subscriptionId = webhookData.metadata?.subscription_id || 
                        webhookData.payment?.metadata?.subscription_id ||
                        webhookData.invoice?.metadata?.subscription_id ||
                        webhookData.data?.metadata?.subscription_id ||
                        webhookData.metadata?.subscriptionId ||
                        webhookData.payment?.metadata?.subscriptionId ||
                        webhookData.invoice?.metadata?.subscriptionId;

    // If subscription_id not in metadata, try to find subscription by payment/invoice ID
    if (!subscriptionId && paymentId) {
      console.log('⚠️  Subscription ID not in webhook metadata, searching by payment/invoice ID...');
      console.log('🔍 Searching for payment ID:', paymentId);
      
      // Try to find subscription by moyassarPaymentId
      const { prisma } = require('../../config/db/prisma');
      
      // Try exact match first
      let subscription = await prisma.subscription.findFirst({
        where: {
          OR: [
            { moyassarPaymentId: paymentId },
            { transactionId: paymentId }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // If not found, try case-insensitive search (some payment IDs might have different casing)
      if (!subscription) {
        const allSubs = await prisma.subscription.findMany({
          where: {
            OR: [
              { moyassarPaymentId: { not: null } },
              { transactionId: { not: null } }
            ]
          },
          select: {
            id: true,
            moyassarPaymentId: true,
            transactionId: true,
            planName: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        });
        
        // Try to find by partial match or case-insensitive match
        subscription = allSubs.find(sub => 
          (sub.moyassarPaymentId && sub.moyassarPaymentId.toLowerCase() === paymentId.toLowerCase()) ||
          (sub.transactionId && sub.transactionId.toLowerCase() === paymentId.toLowerCase())
        );
        
        if (!subscription) {
          console.log('⚠️  Could not find subscription by payment ID:', paymentId);
          console.log('📋 Recent subscriptions with payment IDs (last 20):', allSubs.map(sub => ({
            id: sub.id,
            moyassarPaymentId: sub.moyassarPaymentId,
            transactionId: sub.transactionId,
            planName: sub.planName
          })));
        }
      }

      if (subscription) {
        subscriptionId = subscription.id;
        console.log('✅ Found subscription by payment ID:', subscriptionId);
      }
    }

    if (!paymentId) {
      console.error('❌ Payment/Invoice ID not found in webhook data');
      console.error('Webhook structure:', Object.keys(webhookData));
      console.error('Full webhook data:', JSON.stringify(webhookData, null, 2));
      throw new Error('Payment/Invoice ID not found in webhook data');
    }

    if (!subscriptionId) {
      console.error('❌ Subscription ID not found in webhook data');
      console.error('Available metadata:', webhookData.metadata);
      console.error('Payment ID:', paymentId);
      console.error('Full webhook data:', JSON.stringify(webhookData, null, 2));
      
      // Don't throw error - instead log and return gracefully
      // The payment status can still be synced manually via the callback
      console.warn('⚠️  Webhook received but cannot process - subscription will be synced on user return');
      return {
        success: false,
        message: 'Subscription ID not found in webhook. Payment will be synced when user returns.',
        paymentId: paymentId
      };
    }

    console.log('✅ Extracted from webhook:', { paymentId, subscriptionId });

    // Process the payment
    const result = await processPayment(paymentId, subscriptionId);

    console.log('✅ Webhook processed successfully:', {
      success: result.success,
      subscriptionId: result.subscription?.id,
      paymentStatus: result.subscription?.paymentStatus,
      isActive: result.subscription?.isActive,
    });

    return result;
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

/**
 * Create payment for subscription
 * @param {String} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Payment initiation result
 */
const createSubscriptionPayment = async (subscriptionId) => {
  try {
    // Get subscription with plan details
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.paymentStatus === 'Paid') {
      throw new Error('Subscription is already paid');
    }

    // Get plan details
    const Plan = require('../../models/plan');
    const plan = await Plan.findById(subscription.planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Create payment
    const paymentResult = await initiatePayment(
      subscriptionId,
      plan.price,
      `Subscription: ${subscription.planName}`,
      {
        user_id: subscription.userId,
        plan_id: plan.id,
        plan_name: subscription.planName,
      }
    );

    // Update subscription with payment info
    const updatedSubscription = await Subscription.update(subscriptionId, {
      paymentMethod: 'moyassar',
      moyassarPaymentId: paymentResult.paymentId,
      moyassarPaymentStatus: 'initiated',
      paymentUrl: paymentResult.paymentUrl,
    });

    return {
      success: true,
      paymentId: paymentResult.paymentId,
      paymentUrl: paymentResult.paymentUrl,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.error('Create subscription payment error:', error);
    throw error;
  }
};

/**
 * Sync payment status from Moyassar for a subscription
 * This is useful when webhook fails or payment status needs to be manually updated
 * @param {String} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Updated subscription
 */
const syncPaymentStatus = async (subscriptionId) => {
  try {
    const subscription = await Subscription.findById(subscriptionId);
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // If no Moyassar payment ID, nothing to sync
    if (!subscription.moyassarPaymentId) {
      return {
        success: false,
        message: 'No Moyassar payment ID found for this subscription',
        subscription,
      };
    }

    // Verify payment status with Moyassar
    const paymentResult = await verifyPayment(subscription.moyassarPaymentId);
    const payment = paymentResult.payment;

    // Check payment/invoice status (case-insensitive)
    const status = (payment.status || payment.invoice?.status || '').toLowerCase();
    const hasPaidPayment = payment.payments && Array.isArray(payment.payments) && 
                          payment.payments.some(p => {
                            const pStatus = (p.status || '').toLowerCase();
                            return pStatus === 'paid';
                          });
    
    // Also check if invoice has paid status
    const invoicePaid = payment.invoice && (
      (payment.invoice.status || '').toLowerCase() === 'paid' ||
      payment.invoice.paid === true ||
      payment.invoice.paid_at !== null
    );
    
    console.log('🔄 Syncing payment status:', {
      subscriptionId,
      moyassarPaymentId: subscription.moyassarPaymentId,
      currentStatus: subscription.paymentStatus,
      moyassarStatus: status,
      hasPaidPayment,
      invoicePaid,
      fullPayment: JSON.stringify(payment, null, 2),
    });

    // If payment is paid in Moyassar but not in our DB, update it
    const isPaidInMoyassar = status === 'paid' || hasPaidPayment || invoicePaid;
    
    if (isPaidInMoyassar && subscription.paymentStatus !== 'Paid') {
      const updatedSubscription = await Subscription.update(subscriptionId, {
        paymentStatus: 'Paid',
        isActive: true,
        transactionId: subscription.moyassarPaymentId,
        moyassarPaymentStatus: 'paid',
      });

      return {
        success: true,
        message: 'Payment status synced successfully',
        subscription: updatedSubscription,
        wasUpdated: true,
      };
    } else if (subscription.paymentStatus === 'Paid') {
      // Already paid, no update needed
      return {
        success: true,
        message: 'Payment status is already up to date',
        subscription,
        wasUpdated: false,
      };
    } else {
      // Payment not paid in Moyassar
      return {
        success: false,
        message: `Payment status in Moyassar: ${status || 'unknown'}`,
        subscription,
        wasUpdated: false,
      };
    }
  } catch (error) {
    console.error('Sync payment status error:', error);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  processPayment,
  handleWebhook,
  createSubscriptionPayment,
  syncPaymentStatus,
};

