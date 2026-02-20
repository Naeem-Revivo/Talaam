import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { lock } from '../../assets/svg/signup'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { getTranslatedAuthMessage } from '../../utils/authMessages'
import Input from '../common/Input'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'
import resetpassword from '../../assets/svg/signup/signup-resetpassword.svg'

const SetNewPassword = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token') || ''

  // Password validation function
  const validateNewPassword = (password) => {
    if (!password.trim()) {
      return t('setNewPassword.validation.newPasswordRequired')
    }
    
    // Optional: Add password strength validation if needed
    // For now, just check if it's not empty
    return ''
  }

  // Confirm password validation function
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword.trim()) {
      return t('setNewPassword.validation.confirmPasswordRequired')
    }
    if (confirmPassword !== formData.newPassword) {
      return t('setNewPassword.validation.passwordsMismatch')
    }
    return ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)

    // Real-time validation for confirm password
    if (name === 'confirmPassword' && value && newFormData.newPassword) {
      if (value !== newFormData.newPassword) {
        setErrors({
          ...errors,
          confirmPassword: t('setNewPassword.validation.passwordsMismatch') || 'Must Match Password'
        })
      } else {
        setErrors({
          ...errors,
          confirmPassword: ''
        })
      }
    } else if (name === 'newPassword' && formData.confirmPassword) {
      // If new password changes and confirm password has value, revalidate confirm password
      if (value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: t('setNewPassword.validation.passwordsMismatch') || 'Must Match Password'
        })
      } else {
        setErrors({
          ...errors,
          confirmPassword: ''
        })
      }
    } else if (errors[name]) {
      // Clear error when user starts typing
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''
    
    switch (name) {
      case 'newPassword':
        error = validateNewPassword(value)
        break
      case 'confirmPassword':
        error = validateConfirmPassword(value)
        break
      default:
        break
    }
    
    setErrors({
      ...errors,
      [name]: error
    })
  }

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      newPassword: validateNewPassword(formData.newPassword),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    }
    
    setErrors(newErrors)
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSetNewPassword = async () => {
    // Check if token exists
    if (!token) {
      showErrorToast(
        t('setNewPassword.errors.missingToken') || 'Reset link is invalid or expired.',
        { title: 'Invalid Reset Link', isAuth: true }
      )
      return
    }

    // First validate the form
    if (!validateForm()) {
      return
    }

    try {
      const resultAction = await dispatch(
        resetPassword({ token, password: formData.newPassword })
      )

      if (resetPassword.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'Password reset successfully'
        const msg = getTranslatedAuthMessage(backendMessage, t, 'setNewPassword.success') || t('setNewPassword.success') || 'Password reset successfully.'
        showSuccessToast(msg, { title: t('setNewPassword.successTitle') || 'Password Reset', isAuth: true })
        navigate('/password-reset', { replace: true })
      } else {
        // Extract error message from API response
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          ''
        
        // Check if it's a token-related error
        const isTokenError = backendMessage && (
          backendMessage.toLowerCase().includes('invalid token') ||
          backendMessage.toLowerCase().includes('expired') ||
          backendMessage.toLowerCase().includes('invalid reset link') ||
          (resultAction.payload?.code && 
           (resultAction.payload.code === 'INVALID_TOKEN' || 
            resultAction.payload.code === 'TOKEN_EXPIRED'))
        )
        
        if (isTokenError) {
          const msg = getTranslatedAuthMessage(backendMessage, t, 'setNewPassword.errors.invalidToken') || t('setNewPassword.errors.invalidToken') || 'Reset link is invalid or expired.'
          showErrorToast(msg, { title: t('setNewPassword.errors.tokenTitle') || 'Invalid Reset Link', isAuth: true })
        } else if (backendMessage) {
          const msg = getTranslatedAuthMessage(backendMessage, t, 'setNewPassword.errors.generic') || t('setNewPassword.errors.generic') || 'Failed to reset password. Please try again.'
          showErrorToast(msg, { title: t('setNewPassword.errors.title') || 'Reset Failed', isAuth: true })
        } else {
          showErrorToast(t('setNewPassword.errors.generic') || 'Failed to reset password. Please try again.', { title: t('setNewPassword.errors.title') || 'Reset Failed', isAuth: true })
        }
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.'
      showErrorToast(defaultError, { title: t('setNewPassword.errors.title') || 'Reset Failed', isAuth: true })
    }
  }

  return (
    <AuthCard
      icon={resetpassword}
      title={t('setNewPassword.title')}
      description={t('setNewPassword.description')}
      showBackToLogin={true}
      showTips={true}
      tipText="Check your spam folder if you don't see the email in your inbox."
    >
      <div className="flex flex-col gap-6 w-full">
        {/* New Password Field */}
        <Input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={t('setNewPassword.newPasswordPlaceholder')}
          label={t('setNewPassword.newPassword')}
          error={errors.newPassword}
          hint="Must be at least 8 characters with letters and numbers."
          icon="password"
          className="w-full lg:w-[423px]"
          required
        />

        {/* Confirm New Password Field */}
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={t('setNewPassword.confirmPasswordPlaceholder')}
          label={t('setNewPassword.confirmPassword')}
          error={errors.confirmPassword}
          icon="password"
          className="w-full lg:w-[423px]"
          required
        />

        {/* Set New Password Button */}
        <AuthButton
          onClick={handleSetNewPassword}
          disabled={loading}
          className="w-full mb-6"
        >
          {loading ? t('setNewPassword.buttonLoading') || 'Saving...' : t('setNewPassword.buttonText')}
        </AuthButton>
      </div>
    </AuthCard>
  )
}

export default SetNewPassword