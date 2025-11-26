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

    // Add callback_url for redirect after payment (if configured)
    // Note: callback_url is for redirect, webhook is configured separately in Moyassar dashboard
    if (MOYASSAR_CONFIG.webhookUrl) {
      const baseUrl = MOYASSAR_CONFIG.webhookUrl.split('?')[0];
      // Ensure callback_url points to the correct webhook endpoint
      // The webhook route is /api/payment/moyassar/webhook
      if (baseUrl.includes('/api/payment/moyassar/webhook')) {
        paymentData.callback_url = baseUrl;
      } else {
        // If webhook URL doesn't match, construct it properly
        const urlObj = new URL(baseUrl);
        paymentData.callback_url = `${urlObj.origin}/api/payment/moyassar/webhook`;
      }
    }

    try {
      // Try Invoice API first
      console.log('Moyassar Invoice API Request:', {
        url: `${MOYASSAR_CONFIG.apiUrl}/invoices`,
        amount: amountInHalalas,
        currency: MOYASSAR_CONFIG.currency,
        hasAuth: !!authHeader,
        secretKeyPrefix: MOYASSAR_CONFIG.secretKey?.substring(0, 10) + '...',
        invoiceData: JSON.stringify(paymentData, null, 2),
      });

      response = await axios.post(
        `${MOYASSAR_CONFIG.apiUrl}/invoices`,
        paymentData,
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
    } catch (invoiceError) {
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

        response = await axios.post(
          `${MOYASSAR_CONFIG.apiUrl}/payments`,
          paymentData,
          {
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );
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

    // Check payment/invoice status
    // Invoice API uses 'status' field, Payment API also uses 'status'
    // For invoices, also check if payments array has paid payments
    const status = payment.status || payment.invoice?.status;
    const hasPaidPayment = payment.payments && Array.isArray(payment.payments) && 
                          payment.payments.some(p => p.status === 'paid' || p.status === 'Paid');
    
    console.log('💳 Payment status check:', {
      status,
      hasPaidPayment,
      paymentsCount: payment.payments?.length || 0,
      payments: payment.payments,
      fullPayment: JSON.stringify(payment, null, 2),
    });
    
    // Invoice is paid if status is 'paid' OR if it has paid payments
    if (status === 'paid' || status === 'Paid' || hasPaidPayment) {
      // Update subscription
      subscription.paymentStatus = 'Paid';
      subscription.isActive = true;
      subscription.transactionId = paymentId;
      subscription.moyassarPaymentId = paymentId;
      subscription.moyassarPaymentStatus = 'paid';
      await subscription.save();

      return {
        success: true,
        subscription,
        message: 'Payment processed successfully',
      };
    } else if (status === 'failed' || status === 'Failed') {
      subscription.moyassarPaymentStatus = 'failed';
      await subscription.save();

      return {
        success: false,
        subscription,
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
    const paymentId = webhookData.id || 
                     webhookData.payment?.id || 
                     webhookData.invoice?.id ||
                     webhookData.invoice_id ||
                     webhookData.data?.id ||
                     webhookData.object?.id;

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
      
      // Try to find subscription by moyassarPaymentId
      const subscription = await Subscription.findOne({
        $or: [
          { moyassarPaymentId: paymentId },
          { transactionId: paymentId }
        ]
      });

      if (subscription) {
        subscriptionId = subscription._id.toString();
        console.log('✅ Found subscription by payment ID:', subscriptionId);
      } else {
        console.log('⚠️  Could not find subscription by payment ID');
      }
    }

    if (!paymentId) {
      console.error('❌ Payment/Invoice ID not found in webhook data');
      console.error('Webhook structure:', Object.keys(webhookData));
      throw new Error('Payment/Invoice ID not found in webhook data');
    }

    if (!subscriptionId) {
      console.error('❌ Subscription ID not found in webhook data');
      console.error('Available metadata:', webhookData.metadata);
      console.error('Payment ID:', paymentId);
      throw new Error('Subscription ID not found in webhook data. Please verify webhook is configured correctly.');
    }

    console.log('✅ Extracted from webhook:', { paymentId, subscriptionId });

    // Process the payment
    const result = await processPayment(paymentId, subscriptionId);

    console.log('✅ Webhook processed successfully:', {
      success: result.success,
      subscriptionId: result.subscription?._id,
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
    const subscription = await Subscription.findById(subscriptionId)
      .populate('planId');

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.paymentStatus === 'Paid') {
      throw new Error('Subscription is already paid');
    }

    const plan = subscription.planId;
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Create payment
    const paymentResult = await initiatePayment(
      subscriptionId,
      plan.price,
      `Subscription: ${subscription.planName}`,
      {
        user_id: subscription.userId.toString(),
        plan_id: plan._id.toString(),
        plan_name: subscription.planName,
      }
    );

    // Update subscription with payment info
    subscription.paymentMethod = 'moyassar';
    subscription.moyassarPaymentId = paymentResult.paymentId;
    subscription.moyassarPaymentStatus = 'initiated';
    subscription.paymentUrl = paymentResult.paymentUrl;
    await subscription.save();

    return {
      success: true,
      paymentId: paymentResult.paymentId,
      paymentUrl: paymentResult.paymentUrl,
      subscription,
    };
  } catch (error) {
    console.error('Create subscription payment error:', error);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  processPayment,
  handleWebhook,
  createSubscriptionPayment,
};

