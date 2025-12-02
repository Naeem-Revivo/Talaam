import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { resendOTP, verifyOTP } from '../../store/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'

const VerifyEmail = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
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
      return 'Please enter the complete 6-digit verification code'
    }
    return ''
  }

  const handleResend = async () => {
    if (!canResend) return

    if (!user?.email) {
      showErrorToast(
        t('verifyEmail.errors.missingEmail') || 'Missing email for verification.',
        { title: 'Verification Error' }
      )
      return;
    }

    setCanResend(false)
    setTimer(60)

    try {
      const resultAction = await dispatch(resendOTP({ email: user.email }))
      if (resendOTP.fulfilled.match(resultAction)) {
        const msg =
          resultAction.payload?.message ||
          t('verifyEmail.resendSuccess') ||
          'Verification code resent to your email.'
        showSuccessToast(msg, { title: 'Code Resent' })
      } else {
        const msg =
          resultAction.payload?.message ||
          t('verifyEmail.errors.resend') ||
          'Failed to resend verification code.'
        showErrorToast(msg, { title: 'Resend Failed' })
      }
    } catch {
      showErrorToast(
        t('verifyEmail.errors.resend') || 'Failed to resend verification code.',
        { title: 'Resend Failed' }
      )
    }
  }

  const handleVerify = async () => {
    // First validate the code
    const validationError = validateCode()
    if (validationError) {
      setCodeError(validationError)
      return
    }

    if (!user?.email) {
      showErrorToast(
        t('verifyEmail.errors.missingEmail') || 'Missing email for verification.',
        { title: 'Verification Error' }
      )
      return
    }

    try {
      const resultAction = await dispatch(
        verifyOTP({ email: user.email, otp: code.join('') })
      )

      if (verifyOTP.fulfilled.match(resultAction)) {
        const msg =
          resultAction.payload?.message ||
          t('verifyEmail.success') ||
          'Email verified successfully.'
        showSuccessToast(msg, { title: 'Email Verified' })
        navigate('/profile', { replace: true })
      } else {
        // Check if it's an invalid OTP error
        const errorMessage = resultAction.payload?.message || resultAction.error?.message || ''
        const isInvalidOTP = 
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('incorrect') ||
          errorMessage.toLowerCase().includes('wrong') ||
          errorMessage.toLowerCase().includes('expired') ||
          (resultAction.payload?.code && resultAction.payload.code === 'INVALID_OTP')
        
        if (isInvalidOTP) {
          // Show error under the OTP input fields
          setCodeError('The verification code is invalid or has expired. Please try again.')
        } else {
          const msg =
            errorMessage ||
            t('verifyEmail.errors.generic') ||
            'Failed to verify code.'
          showErrorToast(msg, { title: 'Verification Failed' })
        }
      }
    } catch {
      showErrorToast(
        t('verifyEmail.errors.generic') || 'Failed to verify code.',
        { title: 'Verification Failed' }
      )
    }
  }

  const handleSkip = () => {
    // Navigate to profile page when skipping verification
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-[14px] border border-[#03274633] shadow-lg p-4 lg:p-8 w-[382px] h-[486px] lg:w-[505px] lg:h-[486px] flex flex-col">
        <div className="w-full lg:w-[425px] lg:h-[337px] pt-10 lg:pt-3 flex flex-col mx-auto">
          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-6 lg:mb-6 text-[18px] lg:text-[30px] leading-none tracking-normal text-oxford-blue">
            {t('verifyEmail.title')}
          </h1>

          {/* Instructions */}
          <p className="font-roboto font-normal text-[16px] leading-[22px] tracking-normal text-dark-gray mb-7 lg:mb-8">
            {t('verifyEmail.instructions.text')}{' '}
            <span className="font-roboto font-medium text-[16px] leading-[22px] tracking-normal">
              {user?.email || 'email@xyz.com'}
            </span>
            {'. '}{t('verifyEmail.instructions.expiry')}
          </p>

          {/* Code Input Section */}
          <div className="flex flex-col gap-4 lg:gap-6 mb-2">
            <label className="block font-roboto font-normal text-[16px] leading-none tracking-normal text-oxford-blue ">
              {t('verifyEmail.enterCode')}
            </label>
            
            {/* 6 Input Boxes */}
            <div className="flex gap-2 lg:gap-3 justify-between">
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
                  className={`w-12 lg:w-14 h-12 lg:h-14 border ${
                    codeError ? 'border-red-500' : 'border-[#03274633]'
                  } rounded-lg text-center text-xl lg:text-2xl font-semibold focus:outline-none focus:border-cinnebar-red focus:ring-2 focus:ring-cinnebar-red/20 shadow-input`}
                />
              ))}
            </div>
            
            {/* Code Error Message */}
            {codeError && (
              <p className="mt-1 text-sm text-red-500 font-roboto">
                {codeError}
              </p>
            )}
          </div>

          {/* Resend Code Section */}
          <div className="flex justify-between sm:flex-row sm:justify-between items-start sm:items-center gap-3 mb-6 lg:mb-8">
            <span className="font-roboto font-normal text-[16px] leading-none tracking-normal text-dark-gray">
              {t('verifyEmail.dontReceive')}
            </span>
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
                t('verifyEmail.resendCode')
              ) : (
                <>
                  <span className="text-gray-400">{t('verifyEmail.resendCodeIn')} </span>
                  <span className="text-gray-600">{timer}s</span>
                </>
              )}
            </button>
          </div>

          {/* Verify Account Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`bg-cinnebar-red text-white font-roboto font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-5 w-full lg:w-[423px] h-[57px] mb-4 lg:mb-6 hover:bg-cinnebar-red/90 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? t('verifyEmail.verifying') || 'Verifying...' : t('verifyEmail.verifyAccount')}
          </button>

          {/* Skip for now */}
          <div className="text-center">
            <button 
              onClick={handleSkip}
              className="font-roboto font-normal pt-6 lg:pt-0 text-[16px] leading-none tracking-normal text-dark-gray hover:text-gray-700 hover:underline"
            >
              {t('verifyEmail.skipForNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail