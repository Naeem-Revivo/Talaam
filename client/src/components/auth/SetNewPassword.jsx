import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { eye, openeye, lock } from '../../assets/svg/signup'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'

const SetNewPassword = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token') || ''

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSetNewPassword = async () => {
    if (!token) {
      showErrorToast(t('setNewPassword.errors.missingToken') || 'Reset link is invalid or expired.')
      return
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      showErrorToast(t('setNewPassword.errors.requiredFields') || 'Please fill all fields.')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showErrorToast(t('setNewPassword.errors.passwordMismatch') || 'Passwords do not match.')
      return
    }

    try {
      const resultAction = await dispatch(
        resetPassword({ token, password: formData.newPassword })
      )

      if (resetPassword.fulfilled.match(resultAction)) {
        const msg =
          resultAction.payload?.message ||
          t('setNewPassword.success') ||
          'Password reset successfully.'
        showSuccessToast(msg)
        navigate('/password-reset', { replace: true })
      } else {
        const msg =
          resultAction.payload?.message ||
          t('setNewPassword.errors.generic') ||
          'Failed to reset password.'
        showErrorToast(msg)
      }
    } catch {
      showErrorToast(t('setNewPassword.errors.generic') || 'Failed to reset password.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full lg:w-[505px] lg:h-[640px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-10 flex flex-col mx-auto">
          {/* Lock Icon */}
          <div className="flex justify-center mb-8">
            <img src={lock} alt="lock" className="" />
          </div>

          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-2 text-[18px] lg:text-[30px] leading-none tracking-normal text-oxford-blue lg:text-start text-center pl-1 pb-3">
            {t('setNewPassword.title')}
          </h1>

          {/* Description Text */}
          <p className="font-roboto font-normal text-base leading-[100%] tracking-normal text-dark-gray mb-6 lg:mb-8 text-center">
            {t('setNewPassword.description')}
          </p>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* New Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('setNewPassword.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder={t('setNewPassword.newPasswordPlaceholder')}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-none placeholder:tracking-normal placeholder:text-dark-gray font-roboto shadow-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <img src={showPassword ? openeye : eye} alt="toggle password visibility" className="" />
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base text-oxford-blue mb-2 leading-none tracking-normal">
                {t('setNewPassword.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('setNewPassword.confirmPasswordPlaceholder')}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-none placeholder:tracking-normal placeholder:text-dark-gray font-roboto shadow-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <img src={showConfirmPassword ? openeye : eye} alt="toggle password visibility" className="" />
                </button>
              </div>
            </div>

            {/* Set New Password Button */}
            <button 
              onClick={handleSetNewPassword}
              disabled={loading}
              className={`bg-cinnebar-red text-white font-roboto font-semibold text-base mt-6 mb-7 lg:mb-0 leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? t('setNewPassword.buttonLoading') || 'Saving...' : t('setNewPassword.buttonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetNewPassword

