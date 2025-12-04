import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import profileData from '../../data/profileData.json'
import { useDispatch, useSelector } from 'react-redux'
import { completeProfile, fetchCurrentUser } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { useNavigate } from 'react-router-dom'
import ProfileDropdown from '../common/ProfileDropdown'
import { getTranslatedAuthMessage } from '../../utils/authMessages'

const Profile = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    country: 'United States',
    timeZone: '(GMT-08:00) Pacific Time',
    language: 'English'
  })

  const [errors, setErrors] = useState({
    fullName: ''
  })

  // Initialize from current user/profile if available
  useEffect(() => {
    const init = async () => {
      // If we don't have user details yet, try fetching from /auth/me
      if (!user) {
        try {
          const result = await dispatch(fetchCurrentUser())
          const fetched = result.payload?.data?.user
          if (fetched) {
            setFormData((prev) => ({
              ...prev,
              fullName: fetched.fullName || fetched.name || '',
              dateOfBirth: fetched.dateOfBirth ? fetched.dateOfBirth.substring(0, 10) : '',
              country: fetched.country || prev.country,
              timeZone: fetched.timezone || prev.timeZone,
              language: fetched.language || prev.language,
            }))
          }
        } catch {
          // ignore; user might not be fully loaded yet
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || user.name || '',
          dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).substring(0, 10) : '',
          country: user.country || prev.country,
          timeZone: user.timezone || prev.timeZone,
          language: user.language || prev.language,
        }))
      }
    }
    init()
  }, [user, dispatch])

  // Validate full name
  const validateFullName = (name) => {
    if (!name.trim()) {
      return t('profile.validation.fullNameRequired')
    }
    if (name.trim().length < 2) {
      return t('profile.validation.fullNameMinLength')
    }
    return ''
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing
    if (errors[name]) {
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
    
    if (name === 'fullName') {
      error = validateFullName(value)
    }
    
    setErrors({
      ...errors,
      [name]: error
    })
  }

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName)
    }
    
    setErrors(newErrors)
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleFinishSetup = async () => {
    // First validate the form
    if (!validateForm()) {
      return
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
        country: formData.country,
        timezone: formData.timeZone,
        language: formData.language,
      }

      const resultAction = await dispatch(completeProfile(payload))

      if (completeProfile.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'Profile completed successfully'
        const msg = getTranslatedAuthMessage(backendMessage, t, 'profile.success') || t('profile.success') || 'Profile completed successfully.'
        showSuccessToast(msg, { title: t('profile.successTitle') || 'Profile Saved', isAuth: true })
        navigate('/dashboard', { replace: true })
      } else {
        // Extract error message from API response
        const errorMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          ''
        
        const msg =
          errorMessage ||
          t('profile.errors.generic') ||
          'Failed to complete profile.'
        showErrorToast(msg, { title: t('profile.errors.title') || 'Save Failed', isAuth: true })
      }
    } catch (e) {
      showErrorToast(
        t('profile.errors.generic') || 'An unexpected error occurred. Please try again.',
        { title: t('profile.errors.title') || 'Save Failed', isAuth: true }
      )
    }
  }

  const countries = profileData.countries
  const timeZones = profileData.timeZones
  const languages = profileData.languages

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full lg:h-[922px] lg:w-[505px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-14 lg:h-[770px] flex flex-col mx-auto">
          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-2 lg:mb-4 text-[18px] lg:text-[30px] lg:leading-none tracking-normal text-oxford-blue">
            {t('profile.title')}
          </h1>

          {/* Subtitle */}
          <p className="font-roboto font-normal text-[16px] leading-none tracking-normal text-gray-500 mb-6 pt-2 lg:mb-8">
            {t('profile.subtitle')}
          </p>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.fullName')}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder={t('profile.fullNamePlaceholder')}
                className={`px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-[#03274633]'} rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray shadow-input`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500 font-roboto">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.dateOfBirth')}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray shadow-input"
              />
            </div>

            {/* Country Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.country')}
              </label>
              <ProfileDropdown
                value={formData.country}
                options={countries}
                onChange={(value) => setFormData({ ...formData, country: value })}
              />
            </div>

            {/* Time Zone Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.timeZone')}
              </label>
              <ProfileDropdown
                value={formData.timeZone}
                options={timeZones}
                onChange={(value) => setFormData({ ...formData, timeZone: value })}
              />
            </div>

            {/* Language Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.language')}
              </label>
              <ProfileDropdown
                value={formData.language}
                options={languages}
                onChange={(value) => setFormData({ ...formData, language: value })}
              />
            </div>

            {/* Finish Setup Button */}
            <button
              onClick={handleFinishSetup}
              disabled={loading}
              className={`bg-cinnebar-red text-white font-archivo font-semibold text-[20px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? t('profile.buttonLoading') || 'Saving...' : t('profile.finishSetup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile