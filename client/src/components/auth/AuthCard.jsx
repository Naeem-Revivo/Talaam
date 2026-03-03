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
 * @param {string} tipLabel - Label text for tip (e.g., "Quick Tip:")
 * @param {string} tipText - Main text to display in tips section
 * @param {string} tipBgColor - Background color for tip section (default: '#FEF3E2')
 * @param {string} tipTextColor - Text color for tip section (default: '#D97706')
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
  tipLabel = '',
  tipText = '',
  tipBgColor = '#FEF3E2',
  tipTextColor = '#D97706',
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
              <p className="font-roboto font-normal text-center text-[16px] leading-[24px] text-[#6CA6C1] mb-8 w-full">
                {description}
              </p>
            )}
          </div>

          {/* Children Content */}
          {children}

          {/* Tips Section */}
          {showTips && (tipLabel || tipText) && (
            <div className='rounded-[14px] pb-[13px] p-4 text-dark-gray font-roboto w-full flex items-start' style={{ backgroundColor: tipBgColor }}>
              {tipLabel && (
                <span className="font-roboto font-semibold text-[12px] leading-[20px] tracking-normal" style={{ color: tipTextColor }}>
                  {tipLabel}
                </span>
              )}
              {tipText && (
                <p className="font-roboto font-normal text-[12px] leading-[20px] tracking-normal" style={{ color: tipTextColor }}>
                  {tipText}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCard
