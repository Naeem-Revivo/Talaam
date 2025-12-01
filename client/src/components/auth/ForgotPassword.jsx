import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'

const ForgotPassword = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  
  const [email, setEmail] = useState('')

  const handleInputChange = (e) => {
    setEmail(e.target.value)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    if (!email) {
      showErrorToast(t('forgotPassword.errors.required') || 'Please enter your email.')
      return
    }

    try {
      const resultAction = await dispatch(forgotPassword({ email }))

      if (forgotPassword.fulfilled.match(resultAction)) {
        const msg =
          resultAction.payload?.message ||
          t('forgotPassword.success') ||
          'If an account exists, a reset link has been sent.'
        showSuccessToast(msg)
        // Keep your existing UX: show modal page after submission
        navigate('/forgot-modal')
      } else {
        const msg =
          resultAction.payload?.message ||
          t('forgotPassword.errors.generic') ||
          'Failed to request password reset.'
        showErrorToast(msg)
      }
    } catch {
      showErrorToast(t('forgotPassword.errors.generic') || 'Failed to request password reset.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full lg:w-[505px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-12 lg:pb-14 flex flex-col mx-auto">
          {/* Main Heading */}
          <h1 className="font-archivo font-bold mb-2 text-[24px] lg:text-[24px] leading-[100%] tracking-[0] text-oxford-blue text-center">
            {t('forgotPassword.title')}
          </h1>

          {/* Instructional Text */}
          <p className="font-roboto font-normal pt-5 text-[16px] leading-[140%] tracking-[0] text-dark-gray text-center mb-6 lg:mb-8">
            {t('forgotPassword.instruction')}
          </p>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('forgotPassword.email')}
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder={t('forgotPassword.emailPlaceholder')}
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto text-[16px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray shadow-input"
              />
            </div>

            {/* Send Verification Code Button */}
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className={`bg-cinnebar-red text-white font-archivo font-semibold text-[16px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? t('forgotPassword.buttonLoading') || 'Sending...' : t('forgotPassword.buttonText')}
            </button>
          </div>

          {/* Back to Login Link */}
          <p className="font-roboto font-normal text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center text-dark-gray mt-6 lg:mt-8">
            <Link to="/login" className="hover:underline">
              {t('forgotPassword.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
