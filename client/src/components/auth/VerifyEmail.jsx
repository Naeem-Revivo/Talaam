import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const VerifyEmail = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
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
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResend = () => {
    if (canResend) {
      setCanResend(false)
      // Reset timer to 60 - this will trigger the useEffect to start countdown
      setTimer(60)
      // Here you would trigger the resend API call
    }
  }

  const handleVerify = () => {
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      // Here you would trigger the verify API call
      console.log('Verifying code:', fullCode)
      // Navigate to profile page after verification
      navigate('/profile')
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
            <span className="font-roboto font-medium text-[16px] leading-[22px] tracking-normal">email@xyz.com</span>
            {'. '}{t('verifyEmail.instructions.expiry')}
          </p>

          {/* Code Input Section */}
          <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-6">
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
                  className="w-12 lg:w-14 h-12 lg:h-14 border border-[#03274633] rounded-lg text-center text-xl lg:text-2xl font-semibold focus:outline-none focus:border-cinnebar-red focus:ring-2 focus:ring-cinnebar-red/20 shadow-input"
                />
              ))}
            </div>
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
            className="bg-cinnebar-red text-white font-roboto font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-5 w-full lg:w-[423px] h-[57px] mb-4 lg:mb-6"
          >
            {t('verifyEmail.verifyAccount')}
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
