import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { tick } from '../../assets/svg/signup'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'
import success from '../../assets/svg/signup/signup-success.svg'

const PasswordReset = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleContinueToSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <AuthCard
      icon={success}
      title={t('passwordReset.title')}
      description={t('passwordReset.description')}
      showBackToLogin={false}
      showTips={false}
    >
      {/* Continue to Sign In Button */}
      <AuthButton
        onClick={handleContinueToSignIn}
        iconPosition="left"
        className="w-full mt-6"
      >
        {t('passwordReset.buttonText')}
      </AuthButton>
    </AuthCard>
    </div>
  )
}

export default PasswordReset
