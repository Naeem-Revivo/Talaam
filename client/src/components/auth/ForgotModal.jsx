import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'
import { mailsent } from '../../assets/svg'

const ForgotModal = ({ onClose }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleBackToSignIn = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <AuthCard
      icon={mailsent}
      title={t('forgotModal.title')}
      description={t('forgotModal.description')}
      showBackToLogin={false}
      showTips={false}
    >
      {/* Back to Sign In Button */}
      <AuthButton
        onClick={handleBackToSignIn}
        iconPosition="left"
        className="w-full mt-6"
      >
        {t('forgotModal.backToSignIn')}
      </AuthButton>
    </AuthCard>
    </div>
  )
}

export default ForgotModal
