import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import paymentAPI from '../api/payment';
import subscriptionAPI from '../api/subscription';
import plansAPI from '../api/plans';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import Loader from '../components/common/Loader';

const MoyassarPaymentPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedRef = useRef(false);

  // Helper function to get value from either localStorage or sessionStorage
  const getStorageValue = (key) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessedRef.current) {
      return;
    }

    // Check if user is logged in - check both localStorage and sessionStorage
    const token = getStorageValue('authToken');
    if (!token) {
      // Store the intended destination in both storage locations
      sessionStorage.setItem('redirectAfterLogin', '/moyassar-payment');
      localStorage.setItem('redirectAfterLogin', '/moyassar-payment');
      navigate('/login');
      return;
    }
    
    // Clear any redirectAfterLogin values since user is already logged in and on the payment page
    localStorage.removeItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    
    console.log("token in moyassar payment page", token);
    // console.log("user in moyassar payment page", user);

    // Check if returning from payment (has subscriptionId in URL)
    const subscriptionId = searchParams.get('subscriptionId');
    const paymentStatus = searchParams.get('payment');
    
    if (subscriptionId) {
      // User returned from Moyassar payment page
      hasProcessedRef.current = true;
      handlePaymentReturn(subscriptionId, paymentStatus);
      return;
    }

    // Prevent duplicate processing
    if (isProcessing) {
      return;
    }

    // Mark as processing
    hasProcessedRef.current = true;

    // Get plan ID from URL or find Taalam plan
    const planId = searchParams.get('planId');
    if (planId) {
      loadPlanAndCreateSubscription(planId);
    } else {
      // Find Taalam plan
      findTaalamPlan();
    }
  }, [searchParams]);

  const handlePaymentReturn = async (subscriptionId, paymentStatus) => {
    try {
      setLoading(true);
      
      // Sync payment status from Moyassar
      const syncResponse = await paymentAPI.syncPaymentStatus(subscriptionId);
      
      if (syncResponse.success) {
        if (syncResponse.data?.subscription?.paymentStatus === 'Paid') {
          showSuccessToast('Payment successful! Your subscription is now active.');
          navigate('/dashboard');
        } else {
          showErrorToast(`Payment status: ${syncResponse.data?.subscription?.paymentStatus || 'Pending'}`);
          navigate('/dashboard/subscription-billings');
        }
      } else {
        showErrorToast('Failed to verify payment status. Please check your subscription.');
        navigate('/dashboard/subscription-billings');
      }
    } catch (error) {
      console.error('Error handling payment return:', error);
      showErrorToast('Failed to verify payment. Please check your subscription.');
      navigate('/dashboard/subscription-billings');
    } finally {
      setLoading(false);
    }
  };

  const findTaalamPlan = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setLoading(true);
      console.log('Finding active plan...');
      // Fetch all plans (students will only see active plans from backend)
      // The backend automatically filters to show only active plans for non-superadmin users
      const response = await plansAPI.getAllPlans();
      console.log('Plans response:', response);
      if (response.success && response.data?.plans && response.data.plans.length > 0) {
        // Get the first active plan (or you could sort by price/date and get the first one)
        // Since students can only see active plans, we'll use the first available active plan
        const activePlan = response.data.plans[0];
        console.log('Found active plan:', activePlan);
        if (activePlan) {
          await loadPlanAndCreateSubscription(activePlan.id);
        } else {
          console.error('No active plan found in plans:', response.data.plans);
          showErrorToast('No active subscription plan found. Please contact support.');
        }
      } else {
        console.error('Failed to get plans or no plans available:', response);
        showErrorToast('No subscription plans available. Please contact support.');
      }
    } catch (error) {
      console.error('Error finding plan:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load plan';
      showErrorToast(errorMessage);
      // Reset processing flag on error so user can retry
      setIsProcessing(false);
      hasProcessedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const loadPlanAndCreateSubscription = async (planId) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      // First, check if user has an existing pending subscription
      const existingSubscription = await subscriptionAPI.getMySubscription();
      
      // Handle case where subscription exists
      if (existingSubscription.success && existingSubscription.data?.subscription) {
        const sub = existingSubscription.data.subscription;
        // If there's a pending subscription, use it instead of creating a new one
        if (sub.paymentStatus === 'Pending' && sub.planId === planId) {
          console.log('Using existing pending subscription:', sub.id);
          setSubscription(sub);
          
          // Check if it already has a payment URL
          if (sub.moyassarPaymentId && sub.paymentUrl) {
            // Use existing payment URL
            setPaymentUrl(sub.paymentUrl);
            window.location.href = sub.paymentUrl;
            return;
          } else if (sub.moyassarPaymentId) {
            // Has payment ID but no URL, try to initiate payment
            try {
              const frontendUrl = window.location.origin;
              const successUrl = `${frontendUrl}/moyassar-payment?subscriptionId=${sub.id}&payment=success`;
              const backUrl = `${frontendUrl}/dashboard/subscription-billings`;
              
              const paymentResponse = await paymentAPI.initiateMoyassarPayment(sub.id, {
                success_url: successUrl,
                back_url: backUrl,
              });
              if (paymentResponse.success && paymentResponse.data.paymentUrl) {
                setPaymentUrl(paymentResponse.data.paymentUrl);
                window.location.href = paymentResponse.data.paymentUrl;
                return;
              }
            } catch (error) {
              console.error('Error initiating payment for existing subscription:', error);
              // Continue to create new subscription if payment initiation fails
            }
          }
        } else if (sub.paymentStatus === 'Paid' && sub.isActive) {
          // User already has an active paid subscription
          showSuccessToast('You already have an active subscription!');
          navigate('/dashboard/subscription-billings');
          return;
        }
      }
      // If no subscription found (404) or subscription doesn't match, continue to create new one
      // This is normal behavior, no error needed
      
      // Get plan details
      const planResponse = await plansAPI.getPlanById(planId);
      if (planResponse.success) {
        setPlan(planResponse.data.plan);
      }

      // Create subscription
      console.log('Creating subscription for plan:', planId);
      const subscriptionResponse = await subscriptionAPI.subscribeToPlan(planId);
      console.log('Subscription response:', subscriptionResponse);
      if (subscriptionResponse.success) {
        setSubscription(subscriptionResponse.data.subscription);
        
        // Initiate payment with success_url and back_url
        console.log('Initiating Moyassar payment for subscription:', subscriptionResponse.data.subscription.id);
        const frontendUrl = window.location.origin;
        const successUrl = `${frontendUrl}/moyassar-payment?subscriptionId=${subscriptionResponse.data.subscription.id}&payment=success`;
        const backUrl = `${frontendUrl}/dashboard/subscription-billings`;
        
        const paymentResponse = await paymentAPI.initiateMoyassarPayment(
          subscriptionResponse.data.subscription.id,
          {
            success_url: successUrl,
            back_url: backUrl,
          }
        );
        console.log('Payment response:', paymentResponse);
        
        if (paymentResponse.success && paymentResponse.data?.paymentUrl) {
          const url = paymentResponse.data.paymentUrl;
          setPaymentUrl(url);
          console.log('✅ Payment URL received, redirecting to Moyassar payment page:', url);
          // Redirect to Moyassar payment page
          window.location.href = url;
        } else {
          console.error('❌ Failed to initiate payment - Response:', paymentResponse);
          console.error('❌ Payment URL missing:', {
            success: paymentResponse.success,
            hasData: !!paymentResponse.data,
            paymentUrl: paymentResponse.data?.paymentUrl,
            fullResponse: paymentResponse
          });
          showErrorToast(paymentResponse.message || paymentResponse.data?.message || 'Failed to initiate payment. Payment URL not received.');
        }
      } else {
        console.error('Failed to create subscription:', subscriptionResponse);
        showErrorToast(subscriptionResponse.message || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create subscription';
      showErrorToast(errorMessage);
      // Reset processing flag on error so user can retry
      setIsProcessing(false);
      hasProcessedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader 
        fullScreen={true}
        size="lg" 
        color="red" 
        text={t('payment.loading') || 'Processing your subscription...'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-oxford-blue mb-4">
          {t('payment.title') || 'Moyassar Payment'}
        </h1>
        {paymentUrl ? (
          <div className="text-center">
            <p className="text-oxford-blue mb-4">
              {t('payment.redirecting') || 'Redirecting to payment page...'}
            </p>
            <a
              href={paymentUrl}
              className="inline-block bg-[#ED4122] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d43a1f] transition"
            >
              {t('payment.continue') || 'Continue to Payment'}
            </a>
          </div>
        ) : (
          <p className="text-oxford-blue">
            {t('payment.settingUp') || 'Setting up your payment...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MoyassarPaymentPage;

