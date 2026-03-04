import React from 'react'
import { rightarrow } from '../../assets/svg'

/**
 * Reusable Auth Button Component
 * 
 * @param {string} children - Button text
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {string} variant - Button variant: 'primary' (default) or 'secondary'
 * @param {string} iconPosition - Icon position: 'left' or 'right' (default: 'right')
 * @param {boolean} showIcon - Show arrow icon (default: true)
 * @param {string} className - Additional CSS classes
 */
const AuthButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  iconPosition = 'right',
  showIcon = true,
  className = ''
}) => {
  const baseClasses = 'text-white font-archivo font-bold text-[16px] leading-[24px] tracking-[0] rounded-[14px] transition-colors duration-200 h-[56px] flex items-center justify-center gap-2'

  const variantClasses = {
    primary: 'bg-gradient-to-b from-[#032746] to-[#0A4B6E] hover:from-[#032746]/90 hover:to-[#0A4B6E]/90',
    secondary: 'bg-gradient-to-b from-[#032746] to-[#0A4B6E] hover:from-[#032746]/90 hover:to-[#0A4B6E]/90'
  }

  const disabledClasses = disabled ? 'opacity-70 cursor-not-allowed' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {showIcon && iconPosition === 'left' && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.833 10H4.16634" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 4.16699L4.16667 10.0003L10 15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
      )}
      <span>{children}</span>
      {showIcon && iconPosition === 'right' && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.16675 10H15.8334" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10 4.16699L15.8333 10.0003L10 15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      )}
    </button>
  )
}

export default AuthButton
