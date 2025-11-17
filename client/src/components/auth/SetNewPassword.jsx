import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { eye, openeye, lock } from '../../assets/svg/signup'

const SetNewPassword = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSetNewPassword = () => {
    // Here you would typically validate the form and make an API call
    // Navigate to password reset success page after successful reset
    navigate('/password-reset')
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
              className="bg-cinnebar-red text-white font-roboto font-semibold text-base mt-6 mb-7 lg:mb-0 leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('setNewPassword.buttonText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetNewPassword

