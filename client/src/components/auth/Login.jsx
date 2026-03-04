import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { google, linkedin } from '../../assets/svg/signup'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { getTranslatedAuthMessage } from '../../utils/authMessages'
import subscriptionAPI from '../../api/subscription'
import { isProfileComplete } from '../../utils/profileUtils'
import Input from '../common/Input'

const Login = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  // Email validation function
  const validateEmail = (email) => {
    if (!email.trim()) {
      return t('login.validation.emailRequired')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t('login.validation.emailInvalid')
    }
    return ''
  }

  // Password validation function
  const validatePassword = (password) => {
    if (!password.trim()) {
      return t('login.validation.passwordRequired')
    }
    return ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''
    
    switch (name) {
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      default:
        break
    }
    
    setErrors({
      ...errors,
      [name]: error
    })
  }

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    }
    
    setErrors(newErrors)
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleLogin = async () => {
    // First validate the form
    if (!validateForm()) {
      return
    }

    try {
      const resultAction = await dispatch(
        login({ 
          email: formData.email, 
          password: formData.password,
          rememberMe: rememberMe 
        })
      )

      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload?.data?.user
        const role = user?.role
        const adminRole = user?.adminRole
        
        // Get success message from backend or translation
        const backendMessage = resultAction.payload?.message || 'Login successful'
        const successMessage = getTranslatedAuthMessage(backendMessage, t, 'login.success') || t('login.success') || 'Login successful!'
        
        showSuccessToast(successMessage, { 
          title: t('login.successTitle') || 'Login Successful',
          isAuth: true
        })

        // Check if there's a redirect destination stored (check both localStorage and sessionStorage)
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin') || sessionStorage.getItem('redirectAfterLogin')
        if (redirectAfterLogin) {
          // Clear from both storage locations
          localStorage.removeItem('redirectAfterLogin')
          sessionStorage.removeItem('redirectAfterLogin')
          navigate(redirectAfterLogin, { replace: true })
          return
        }

        // Helper to cache subscription status for subsequent guards
        const cacheSubscriptionStatus = (isActive) => {
          localStorage.setItem('hasActiveSubscription', isActive ? 'true' : 'false')
          sessionStorage.setItem('hasActiveSubscription', isActive ? 'true' : 'false')
        }

        // Map backend roles to routes
        if (role === 'superadmin') {
          navigate('/admin', { replace: true })
        } else if (role === 'admin') {
          // For admin users, use adminRole to determine the dashboard
          if (adminRole === 'gatherer') {
            navigate('/gatherer', { replace: true })
          } else if (adminRole === 'creator') {
            navigate('/creator', { replace: true })
          } else if (adminRole === 'processor') {
            navigate('/processor', { replace: true })
          } else if (adminRole === 'explainer') {
            navigate('/explainer', { replace: true })
          } else {
            // Default admin users to admin dashboard
            navigate('/admin', { replace: true })
          }
        } else if (role === 'student' || role === 'user') {
          // Profile completeness check first
          if (!isProfileComplete(user)) {
            navigate('/complete-profile', { replace: true })
          } else {
            // Redirect to subscription bridge page - it will check subscription and route accordingly
            navigate('/dashboard', { replace: true })
          }
        } else if (role === 'gatherer') {
          navigate('/gatherer', { replace: true })
        } else if (role === 'creator') {
          navigate('/creator', { replace: true })
        } else if (role === 'processor') {
          navigate('/processor', { replace: true })
        } else if (role === 'explainer') {
          navigate('/explainer', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } else if (login.rejected.match(resultAction)) {
        // Extract error message from API response
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          resultAction.error?.message ||
          null
        
        // Get translated message or fallback
        const errorMessage = backendMessage 
          ? getTranslatedAuthMessage(backendMessage, t, 'login.errors.generic')
          : t('login.errors.generic') || 'Login failed. Please check your credentials and try again.'
        
        showErrorToast(errorMessage, { title: t('login.errors.title') || 'Login Failed', isAuth: true })
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.'
      showErrorToast(defaultError, { title: t('login.errors.title') || 'Login Failed', isAuth: true })
    }
  }

  const handleGoogleLogin = () => {
    // Direct redirect to backend OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api suffix if present, since we're adding it explicitly
    const apiUrl = baseUrl.replace(/\/api$/, '');
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleLinkedInLogin = () => {
    // Direct redirect to backend OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api suffix if present, since we're adding it explicitly
    const apiUrl = baseUrl.replace(/\/api$/, '');
    window.location.href = `${apiUrl}/api/auth/linkedin`;
  };

  return (
    <div className="w-full max-w-[480px] mx-auto px-6 py-8 lg:py-12" dir={dir}>
      {/* Header with Create Account link */}
      {/* <div className="flex justify-end mb-8">
        <Link
          to="/create-account"
          className="font-roboto text-[13px] text-oxford-blue hover:text-cinnebar-red transition-colors"
        >
          {t('login.createNewAccount')}
        </Link>
      </div> */}

      {/* Title */}
      <h1 className="font-archivo font-bold text-[28px] lg:text-[32px] leading-[45px] text-text-dark mb-2">
        {t('login.title')}
      </h1>

      {/* Subtitle */}
      <p className="font-roboto font-normal text-base text-text-gray mb-8">
        {t('login.subtitle')}
      </p>

      {/* Form */}
      <div className="flex flex-col gap-5">
        {/* Email Field */}
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={t('login.emailPlaceholder')}
          label={t('login.emailLabel')}
          required
          error={errors.email}
          icon="email"
          maxLength={50}
        />
        
        {/* Password Field */}
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={t('login.passwordPlaceholder')}
          label={t('login.passwordLabel')}
          required
          error={errors.password}
          icon="password"
          showPasswordToggle
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center">
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 border-gray-300 rounded text-oxford-blue focus:ring-oxford-blue"
            />
            <span className="font-roboto text-[13px] text-gray-600">
              {t('login.rememberMe')}
            </span>
          </label>
          <Link 
            to="/forgot-password" 
            className="font-roboto font-medium text-[13px] text-cinnebar-red hover:underline"
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`bg-oxford-blue text-white font-archivo font-semibold text-[15px] rounded-lg transition-all duration-200 py-3 w-full h-[48px] hover:bg-oxford-blue/90 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? t('login.buttonLoading') || 'Signing in...' : t('login.buttonText')}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-1">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="font-roboto text-[13px] text-gray-400">{t('login.orContinueWith')}</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full h-[48px]"
          >
            <img src={google} alt="Google" className="w-5 h-5" />
            <span className="font-roboto font-medium text-[14px] text-gray-700">{t('login.continueWithGoogle')}</span>
          </button>

          {/* LinkedIn Button */}
          <button
            type="button"
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full h-[48px]"
          >
            <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
            <span className="font-roboto font-medium text-[14px] text-gray-700">{t('login.continueWithLinkedIn')}</span>
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <p className="font-roboto text-[14px] text-center text-gray-500 mt-8">
        {t('login.noAccount')}{' '}
        <Link to="/create-account" className="font-roboto font-semibold text-[14px] text-cinnebar-red hover:underline">
          {t('login.signUp')}
        </Link>
      </p>
    </div>
  )
}

export default Login