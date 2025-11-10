import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const ForgotPassword = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [email, setEmail] = useState('')

  const handleInputChange = (e) => {
    setEmail(e.target.value)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    // Here you would typically validate the email and make an API call
    // Navigate to forgot modal page after submission
    navigate('/forgot-modal')
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
          <p className="font-roboto font-normal pt-5 text-[16px] leading-[140%] tracking-[0] text-[#6B7280] text-center mb-6 lg:mb-8">
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
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto text-[16px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#6B7280] shadow-input"
              />
            </div>

            {/* Send Verification Code Button */}
            <button
              onClick={handleForgotPassword}
              className="bg-cinnebar-red text-white font-archivo font-semibold text-[16px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('forgotPassword.buttonText')}
            </button>
          </div>

          {/* Back to Login Link */}
          <p className="font-roboto font-normal text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center text-[#6B7280] mt-6 lg:mt-8">
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
