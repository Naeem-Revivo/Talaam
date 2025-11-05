import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const SignUpFree = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg mb-20 p-6 md:p-10 w-[352px] py-14 md:w-[505px] h-[464px] md:h-[464px] flex flex-col justify-between" >
        {/* Main Heading */}
        <h1 className="font-archivo font-bold pt-3 text-[18px] md:text-2xl leading-none tracking-normal text-gray-900 mb-4">
          {t('signUpFree.title')}
        </h1>

        <div className="flex flex-col items-center justify-center gap-9 md:gap-9">
        {/* Descriptive Text */}
        <p className="font-roboto font-normal text-sm md:text-base leading-none tracking-normal text-center text-gray-500 w-full max-w-[280px] md:max-w-[423px]">
          {t('signUpFree.description')}
        </p>
        
        {/* Sign Up Button */}
        <div className="flex justify-center w-full">
          <Link
            to="/create-account"
            className="bg-cinnebar-red text-white font-roboto font-semibold text-sm md:text-base leading-none tracking-normal rounded-lg transition-colors duration-200 w-[280px] md:w-[423px] h-12 md:h-[57px] flex items-center justify-center"
          >
            {t('signUpFree.buttonText')}
          </Link>
        </div>
        
        {/* Agreement Text */}
        <p className="font-roboto font-normal text-xs md:text-base leading-none tracking-normal text-center text-gray-500 mb-4">
          {t('signUpFree.agreement.text')}{' '}
          <a href="#" className="font-roboto font-bold text-xs md:text-base leading-none tracking-normal text-center underline text-cinnebar-red">
            {t('signUpFree.agreement.terms')}
          </a>
          {' '}{t('signUpFree.agreement.and')}{' '}
          <a href="#" className="font-roboto font-bold text-xs md:text-base leading-none tracking-normal text-center underline text-cinnebar-red">
            {t('signUpFree.agreement.privacy')}
          </a>
        </p>
        </div>
        
        {/* Login Prompt */}
        <p className="font-roboto font-normal text-xs md:text-base leading-none tracking-normal text-center text-gray-500 pb-1">
          {t('signUpFree.loginPrompt.text')}{' '}
          <a href="#" className="font-roboto font-bold text-xs md:text-base leading-none tracking-normal underline text-cinnebar-red">
            {t('signUpFree.loginPrompt.link')}
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpFree