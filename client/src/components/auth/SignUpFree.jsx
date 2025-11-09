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
        <h1 className="font-archivo font-bold pt-3 text-[20px] md:text-[24px] leading-[100%] tracking-[0] text-oxford-blue mb-4">
          {t('signUpFree.title')}
        </h1>

        <div className="flex flex-col items-center justify-center gap-9 md:gap-9">
        {/* Descriptive Text */}
        <p className="font-roboto font-normal text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue w-full max-w-[280px] md:max-w-[423px]">
          {t('signUpFree.description')}
        </p>
        
        {/* Sign Up Button */}
        <div className="flex justify-center w-full">
          <Link
            to="/create-account"
            className="bg-cinnebar-red text-white font-archivo font-bold text-[24px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 w-[280px] md:w-[423px] h-12 md:h-[57px] flex items-center justify-center"
          >
            {t('signUpFree.buttonText')}
          </Link>
        </div>
        
        {/* Agreement Text */}
        <p className="font-roboto font-normal text-[14px] md:text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue mb-4">
          {t('signUpFree.agreement.text')}{' '}
          <a href="#" className="font-roboto font-bold text-[14px] md:text-[16px] leading-[140%] tracking-[0] text-center underline text-cinnebar-red">
            {t('signUpFree.agreement.terms')}
          </a>
          {' '}{t('signUpFree.agreement.and')}{' '}
          <a href="#" className="font-roboto font-bold text-[14px] md:text-[16px] leading-[140%] tracking-[0] text-center underline text-cinnebar-red">
            {t('signUpFree.agreement.privacy')}
          </a>
        </p>
        </div>
        
        {/* Login Prompt */}
        <p className="font-roboto font-normal text-[14px] md:text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue pb-1">
          {t('signUpFree.loginPrompt.text')}{' '}
          <a href="#" className="font-roboto font-bold text-[14px] md:text-[16px] leading-[140%] tracking-[0] underline text-cinnebar-red">
            {t('signUpFree.loginPrompt.link')}
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpFree