import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { tick } from '../../assets/svg/signup'

const PasswordReset = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const handleContinueToSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-6 lg:p-8 w-full max-w-md flex flex-col items-start">
        <div className="relative mb-6 pt-5 lg:pt-8">
          <div className="relative w-20 h-20 lg:w-24 lg:h-24 ">
              <img src={tick} alt="checkmark" className="" />
          </div>
        </div>
        {/* Checkmark Icon with Circle */}

        {/* Heading */}
        <h2 className="font-archivo font-bold text-2xl lg:text-[36px] leading-none tracking-normal text-oxford-blue mb-4 text-center">
          {t('passwordReset.title')}
        </h2>

        {/* Description */}
        <p className="font-roboto font-normal text-base leading-[100%] tracking-normal text-dark-gray mb-8 text-start">
          {t('passwordReset.description')}
        </p>

        {/* Continue to Sign In Button */}
        <button
          onClick={handleContinueToSignIn}
          className="bg-cinnebar-red text-white font-roboto mb-10 font-bold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full h-[57px] hover:bg-cinnebar-red/90 shadow-button"
        >
          {t('passwordReset.buttonText')}
        </button>
      </div>
    </div>
  )
}

export default PasswordReset
