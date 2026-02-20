import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { navlogo } from '../../assets/svg'

/**
 * Reusable Auth Card Component
 * 
 * @param {ReactNode} children - Content to render inside the card
 * @param {string|ReactNode} icon - Icon image source (string) or React component (ReactNode)
 * @param {string} title - Main heading text
 * @param {string} description - Description text below title
 * @param {boolean} showBackToLogin - Show "Back to Login" link in header (default: true)
 * @param {function} customBackHandler - Custom back button handler function (optional)
 * @param {string} customBackText - Custom back button text (optional)
 * @param {boolean} showTips - Show tips section at bottom (default: false)
 * @param {string} tipText - Text to display in tips section
 * @param {string} className - Additional CSS classes for the card
 */
const AuthCard = ({
  children,
  icon,
  title,
  description,
  showBackToLogin = true,
  customBackHandler = null,
  customBackText = null,
  showTips = false,
  tipText = '',
  className = ''
}) => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const renderBackButton = () => {
    if (!showBackToLogin) return <div></div>

    if (customBackHandler) {
      return (
        <button
          onClick={customBackHandler}
          className="font-roboto font-medium text-[14px] leading-[20px] tracking-[0] text-center text-[#6CA6C1] hover:underline flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99992 12.6663L3.33325 7.99967L7.99992 3.33301" stroke="#6CA6C1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.6666 8H3.33325" stroke="#6CA6C1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span>{customBackText || t('common.back') || 'Back'}</span>
        </button>
      )
    }

    return (
      <Link 
        to="/login" 
        className="font-roboto font-medium text-[14px] leading-[20px] tracking-[0] text-center text-[#6CA6C1] hover:underline flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99992 12.6663L3.33325 7.99967L7.99992 3.33301" stroke="#6CA6C1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.6666 8H3.33325" stroke="#6CA6C1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{t('forgotPassword.backToLogin') || 'Back to Login'}</span>
      </Link>
    )
  }

  // Extract max-width classes from className prop
  const maxWidthClass = className.match(/max-w-[\w-]+/)?.[0] || ''
  const otherClasses = className.replace(/max-w-[\w-]+/g, '').trim()

  return (
    <div className={`bg-white my-10 flex items-center justify-center p-4`} dir={dir}>
      <div className={`bg-white rounded-[24px] border-2 border-[#F3F4F6] shadow-xl p-4 lg:py-[50px] lg:px-[48px] flex flex-col ${maxWidthClass} ${otherClasses}`}>
        {/* Header with Back to Login and Logo */}
        <div className='flex justify-between items-center w-full'>
          {renderBackButton()}
          <img
            src={navlogo}
            alt="Taalam Logo"
            className="w-[106px] h-[88px]"
          />
        </div>

        {/* Main Content */}
        <div className={`w-full ${maxWidthClass ? 'lg:max-w-xl' : 'lg:w-[430px]'} flex flex-col items-center justify-center mx-auto`}>
          {/* Icon */}
          {icon && (
            typeof icon === 'string' ? (
              <img src={icon} alt='icon' className='w-[80px] h-[80px] mb-6' />
            ) : (
              <div className='flex items-center justify-center mb-6'>
                {icon}
              </div>
            )
          )}

          {/* Title and Description */}
          <div className='space-y-3 w-full'>
            {title && (
              <h1 className="font-archivo font-bold text-[26px] lg:text-[32px] text-center leading-[45px] text-text-dark mb-3">
                {title}
              </h1>
            )}

            {description && (
              <p className="font-roboto font-normal text-center text-[16px] leading-[26px] text-[#6CA6C1] mb-6 w-full">
                {description}
              </p>
            )}
          </div>

          {/* Children Content */}
          {children}

          {/* Tips Section */}
          {showTips && tipText && (
            <div className='bg-orange-50 rounded-[14px] pb-[13px] px-4 pt-4 text-dark-gray font-roboto text-[14px] leading-[140%] font-normal w-full flex items-start gap-3'>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500 flex-shrink-0 mt-0.5">
                <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 14C9.45 14 9 13.55 9 13C9 12.45 9.45 12 10 12C10.55 12 11 12.45 11 13C11 13.55 10.55 14 10 14ZM11 10H9V6H11V10Z" fill="currentColor" />
              </svg>
              <p className="font-roboto font-normal text-[14px] leading-[140%] tracking-normal text-dark-gray">
                {tipText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCard
