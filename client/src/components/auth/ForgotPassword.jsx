import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { getTranslatedAuthMessage } from '../../utils/authMessages'
import { lockicon } from '../../assets/svg'
import Input from '../common/Input'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'

const ForgotPassword = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  // Email validation function
  const validateEmail = (email) => {
    if (!email.trim()) {
      return t('forgotPassword.validation.emailRequired')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t('forgotPassword.validation.emailInvalid')
    }
    return ''
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setEmail(value)

    // Clear error when user starts typing
    if (emailError) {
      setEmailError('')
    }
  }

  // Validate email on blur
  const handleBlur = () => {
    const error = validateEmail(email)
    setEmailError(error)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    // Validate email
    const validationError = validateEmail(email)
    if (validationError) {
      setEmailError(validationError)
      return
    }

    try {
      const resultAction = await dispatch(forgotPassword({ email }))

      if (forgotPassword.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'If an account with that email exists, a reset link was sent.'
        const msg = getTranslatedAuthMessage(backendMessage, t, 'forgotPassword.success') || t('forgotPassword.success') || 'If an account exists for that email, a reset link has been sent.'
        showSuccessToast(msg, { title: t('forgotPassword.successTitle') || 'Reset Email Sent', isAuth: true })
        navigate('/forgot-modal')
      } else {
        const backendMessage =
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          null

        const msg = backendMessage
          ? getTranslatedAuthMessage(backendMessage, t, 'forgotPassword.errors.generic')
          : t('forgotPassword.errors.generic') || 'Failed to request password reset. Please try again.'

        showErrorToast(msg, { title: t('forgotPassword.errors.title') || 'Reset Failed', isAuth: true })
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.'
      showErrorToast(defaultError, { title: t('forgotPassword.errors.title') || 'Reset Failed', isAuth: true })
    }
  }

  return (
    <AuthCard
      icon={lockicon}
      title={t('forgotPassword.title')}
      description={t('forgotPassword.instruction')}
      showBackToLogin={true}
      showTips={true}
      tipText="If an account exists for the email you entered, Please check your inbox and spam folder."
    >
      {/* Email Field */}
      <Input
        type="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={t('forgotPassword.emailPlaceholder')}
        label={t('forgotPassword.email')}
        error={emailError}
        icon="email"
        maxLength={50}
        className="w-full mt-6"
      />

      {/* Send Verification Code Button */}
      <AuthButton
        onClick={handleForgotPassword}
        disabled={loading}
        className="w-full mb-6 mt-6"
      >
        {loading ? t('forgotPassword.buttonLoading') || 'Sending...' : t('forgotPassword.buttonText')}
      </AuthButton>
    </AuthCard>
  )
}

export default ForgotPassword