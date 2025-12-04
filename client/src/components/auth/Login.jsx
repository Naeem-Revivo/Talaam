import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { eye, openeye, google, linkedin } from '../../assets/svg/signup'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { getTranslatedAuthMessage } from '../../utils/authMessages'

const Login = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  
  const [showPassword, setShowPassword] = useState(false)
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
        login({ email: formData.email, password: formData.password })
      )

      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload?.data?.user
        const role = user?.role
        
        // Get success message from backend or translation
        const backendMessage = resultAction.payload?.message || 'Login successful'
        const successMessage = getTranslatedAuthMessage(backendMessage, t, 'login.success') || t('login.success') || 'Login successful!'
        
        showSuccessToast(successMessage, { 
          title: t('login.successTitle') || 'Login Successful',
          isAuth: true
        })

        // Map backend roles to routes
        if (role === 'superadmin') {
          navigate('/admin', { replace: true })
        } else if (role === 'student' || role === 'user') {
          navigate('/dashboard', { replace: true })
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full h-[842px] lg:h-[1038px] lg:w-[505px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-12 lg:h-[770px] flex flex-col mx-auto">
          {/* Welcome Text */}
          <p className="font-archivo font-bold text-[18px] lg:text-[24px] mb-1 lg:mb-2 text-oxford-blue">
            {t('login.welcome')}
          </p>

          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-6 pt-3 lg:mb-8 text-[26px] lg:text-[30px] leading-[100%] tracking-[0] text-oxford-blue">
            {t('login.title')}
          </h1>

          <div className="flex flex-col pt-10 gap-6 lg:gap-8">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder={t('login.emailPlaceholder')}
                className={`px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-[#03274633]'} rounded-lg text-[14px] outline-none w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray font-roboto font-normal leading-[100%] tracking-[0] text-oxford-blue shadow-input`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-roboto">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-5">
              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={t('login.passwordPlaceholder')}
                    className={`px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-[#03274633]'} rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray font-roboto font-normal text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <img src={showPassword ? openeye : eye} alt="toggle password visibility" className="" />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-roboto">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between sm:flex-row sm:justify-between items-start sm:items-center gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3 h-3 border border-gray-300 rounded text-cinnebar-red focus:ring-cinnebar-red mr-2"
                  />
                  <span className="font-roboto font-normal pt-0.5 text-[12px] leading-[100%] tracking-[0] text-oxford-blue">
                    {t('login.rememberMe')}
                  </span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="font-roboto font-medium text-[12px] leading-[100%] tracking-[0] text-cinnebar-red underline hover:no-underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`bg-cinnebar-red text-white font-archivo font-semibold text-[16px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? t('login.buttonLoading') || 'Signing in...' : t('login.buttonText')}
            </button>

            {/* Divider */}
            <div className="flex px-4 lg:px-9 pt-6 justify-center items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 font-roboto text-[16px] leading-[100%] tracking-[0] text-gray-500">{t('login.orContinueWith')}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]"
              >
                <img src={google} alt="Google" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">{t('login.continueWithGoogle')}</span>
              </button>

              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={handleLinkedInLogin}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]"
              >
                <img src={linkedin} alt="LinkedIn" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">{t('login.continueWithLinkedIn')}</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="font-roboto font-normal text-[14px] lg:text-[16px] leading-[100%] tracking-[0] text-center text-gray-500 mt-16 lg:mt-24">
            {t('login.noAccount')}{' '}
            <Link to="/signupfree" className="font-roboto font-bold text-[14px] lg:text-[16px] leading-[100%] tracking-[0] text-center underline text-cinnebar-red">
              {t('login.signUp')}
            </Link>
          </p>
        </div> 
      </div>
    </div>
  )
}

export default Login