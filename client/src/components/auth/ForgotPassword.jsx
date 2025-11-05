import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <div className="w-full lg:w-[430px] pt-8 lg:py-14 flex flex-col mx-auto">
          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-6 lg:mb-8 text-[18px] lg:text-[30px] leading-none tracking-normal text-oxford-blue">
            {t('forgotPassword.title')}
          </h1>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('forgotPassword.email')}
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder={t('forgotPassword.emailPlaceholder')}
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-none placeholder:tracking-normal placeholder:text-[#6B7280] font-roboto shadow-input"
              />
            </div>

            {/* Forgot Password Button */}
            <button
              onClick={handleForgotPassword}
              className="bg-cinnebar-red text-white font-roboto mb-10 lg:mb-0 font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('forgotPassword.buttonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
