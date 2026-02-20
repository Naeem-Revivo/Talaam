import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { resendOTP, verifyOTP } from '../../store/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { getTranslatedAuthMessage } from '../../utils/authMessages'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'
import { shield } from '../../assets/svg'

const VerifyEmail = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60) // 60 seconds
  const [canResend, setCanResend] = useState(false)
  const [codeError, setCodeError] = useState('')
  const inputRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    let interval = null
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer, canResend])

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Clear error when user starts typing
    if (codeError) {
      setCodeError('')
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newCode = [...code]
    
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6 && /^\d$/.test(char)) {
        newCode[idx] = char
      }
    })
    
    setCode(newCode)
    
    // Clear error when user pastes code
    if (codeError) {
      setCodeError('')
    }
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  // Validate the OTP code
  const validateCode = () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      return t('verifyEmail.validation.codeRequired')
    }
    return ''
  }

  const handleResend = async () => {
    if (!canResend) return

    // Get email from user state or localStorage (for signup flow)
    const emailToUse = user?.email || localStorage.getItem('signupEmail');
    
    if (!emailToUse) {
      showErrorToast(
        t('verifyEmail.errors.missingEmail') || 'Missing email for verification.',
        { title: 'Verification Error', isAuth: true }
      )
      return;
    }

    setCanResend(false)
    setTimer(60) // Reset to 60 seconds

    try {
      const resultAction = await dispatch(resendOTP({ email: emailToUse }))
      if (resendOTP.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'OTP resent to your email'
        const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.resendSuccess') || t('verifyEmail.resendSuccess') || 'Verification code has been resent to your email.'
        showSuccessToast(msg, { title: t('verifyEmail.resendTitle') || 'Code Resent', isAuth: true })
      } else {
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          null
        
        const msg = backendMessage
          ? getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.resend')
          : t('verifyEmail.errors.resend') || 'Failed to resend verification code. Please try again.'
        
        showErrorToast(msg, { title: t('verifyEmail.errors.resendTitle') || 'Resend Failed', isAuth: true })
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.'
      showErrorToast(defaultError, { title: t('verifyEmail.errors.resendTitle') || 'Resend Failed', isAuth: true })
    }
  }

  const handleVerify = async () => {
    // First validate the code
    const validationError = validateCode()
    if (validationError) {
      setCodeError(validationError)
      return
    }

    // Get email from user state or localStorage (for signup flow)
    const emailToUse = user?.email || localStorage.getItem('signupEmail');
    
    if (!emailToUse) {
      showErrorToast(
        t('verifyEmail.errors.missingEmail') || 'Missing email for verification.',
        { title: 'Verification Error', isAuth: true }
      )
      return
    }

    try {
      const resultAction = await dispatch(
        verifyOTP({ email: emailToUse, otp: code.join('') })
      )

      if (verifyOTP.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'Email verified successfully'
        const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.success') || t('verifyEmail.success') || 'Email verified successfully.'
        showSuccessToast(msg, { title: t('verifyEmail.successTitle') || 'Email Verified', isAuth: true })
        navigate('/complete-profile', { replace: true })
      } else {
        // Extract error message from API response
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          ''
        
        // Check if it's an OTP-related error (invalid, expired, etc.)
        const isInvalidOTP = backendMessage && (
          backendMessage.toLowerCase().includes('invalid') ||
          backendMessage.toLowerCase().includes('incorrect') ||
          backendMessage.toLowerCase().includes('wrong') ||
          backendMessage.toLowerCase().includes('expired') ||
          backendMessage.toLowerCase().includes('otp')
        )
        
        if (isInvalidOTP) {
          // Use translation utility for OTP errors
          const errorMsg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.invalidOtp') || t('verifyEmail.errors.invalidOtp') || 'The verification code is invalid or has expired. Please try again.'
          setCodeError(errorMsg)
        } else if (backendMessage) {
          // Use translation utility for other errors
          const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.generic') || t('verifyEmail.errors.generic') || 'Failed to verify code.'
          showErrorToast(msg, { title: t('verifyEmail.errors.title') || 'Verification Failed', isAuth: true })
        } else {
          // No message, use generic
          showErrorToast(t('verifyEmail.errors.generic') || 'Failed to verify code.', { title: t('verifyEmail.errors.title') || 'Verification Failed', isAuth: true })
        }
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.'
      showErrorToast(defaultError, { title: t('verifyEmail.errors.title') || 'Verification Failed', isAuth: true })
    }
  }

  const handleSkip = () => {
    // Navigate to complete profile page when skipping verification
    navigate('/complete-profile')
  }

  const emailToDisplay = user?.email || localStorage.getItem('signupEmail') || 'your.email@xyz.com'
  const instructionText = t('verifyEmail.instructions.text') || 'Please enter the 6-digit code we sent to'

  return (
    <AuthCard
      icon={shield}
      title={t('verifyEmail.title')}
      description={instructionText}
      showBackToLogin={true}
      customBackHandler={() => navigate('/create-account')}
      customBackText={t('common.back') || 'Back'}
      showTips={true}
      tipText={t('verifyEmail.tip') || "Tip: Check your spam folder if you don't see the email in your inbox."}
    >
      <p className="font-roboto font-semibold text-[16px] leading-[26px] tracking-[0px] text-oxford-blue text-center mb-3">
          {emailToDisplay}
        </p>
      <div className="w-full flex flex-col gap-6">
        {/* Email Display */}
        {/* Timer Badge */}
        <div className="flex justify-center">
          <div className="bg-[#FEF2F2] rounded-[10px] px-4 py-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#ED4122" strokeWidth="1.5"/>
              <path d="M8 4V8L10.5 10.5" stroke="#ED4122" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-roboto font-semibold text-[12px] leading-[16px] tracking-[0px] text-cinnebar-red">
              {t('verifyEmail.codeExpires')}
            </span>
          </div>
        </div>

        {/* Code Input Section */}
        <div className="flex flex-col gap-4">
          <label className="block font-roboto font-semibold text-[14px] leading-[20px] tracking-[0px] text-oxford-blue text-center">
            {t('verifyEmail.enterCode')}
          </label>
          
          {/* 6 Input Boxes */}
          <div className="flex gap-2 justify-between mx-auto w-full">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 lg:w-14 h-12 lg:h-14 border-2 rounded-[14px] ${
                  codeError ? 'border-[#6CA6C1]' : 'border-[#E5E7EB]'
                } rounded-[14px] text-center text-xl lg:text-2xl font-semibold focus:outline-none focus:border-[#6CA6C1] focus:ring-2 focus:ring-[#6CA6C1]/20`}
              />
            ))}
          </div>
          
          {/* Code Error Message */}
          {codeError && (
            <p className="mt-1 text-xs font-normal text-[#6CA6C1] font-roboto text-center">
              {codeError}
            </p>
          )}
        </div>

        {/* Verify Account Button */}
        <AuthButton
          onClick={handleVerify}
          disabled={loading}
          className="w-full"
        >
          {loading ? t('verifyEmail.verifying') || 'Verifying...' : t('verifyEmail.verifyAccount') || 'Verify & Continue'}
        </AuthButton>

        {/* Resend Code Section */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0px] text-[#6CA6C1]">
            {t('verifyEmail.dontReceive') || "Don't receive the code?"}
          </span>
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0px] text-[#6CA6C1] hover:text-gray-700 hover:underline"
            >
              {t('verifyEmail.skipForNow') || 'Skip for now'}
            </button>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-roboto font-medium text-sm leading-none tracking-normal ${
                canResend
                  ? 'text-cinnebar-red underline hover:no-underline cursor-pointer'
                  : 'cursor-not-allowed text-gray-400'
              }`}
            >
              {canResend ? (
                t('verifyEmail.resendCode') || 'Resend code'
              ) : (
                <>
                  <span className="text-gray-400">{t('verifyEmail.resendCodeIn') || 'Resend code in'} </span>
                  <span className="text-gray-600">{timer}s</span>
                </>
              )}
            </button>

          </div>
            <div className="w-full h-[2px] bg-[#F3F4F6] mt-6 mb-6"></div>
        </div>
      </div>
    </AuthCard>
  )
}

export default VerifyEmail