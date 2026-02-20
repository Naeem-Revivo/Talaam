import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import profileData from '../../data/profileData.json'
import { useDispatch, useSelector } from 'react-redux'
import { completeProfile, fetchCurrentUser } from '../../store/slices/authSlice'
import { isProfileComplete } from '../../utils/profileUtils'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { useNavigate } from 'react-router-dom'
import ProfileDropdown from '../common/ProfileDropdown'
import { getTranslatedAuthMessage } from '../../utils/authMessages'
import languagesAPI from '../../api/languages'
import AuthCard from './AuthCard'
import AuthButton from './AuthButton'
import Input from '../common/Input'

const Profile = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)
  
  // Profile icon component
  const ProfileIcon = () => (
    <div className="w-[80px] h-[80px] bg-cinnebar-red rounded-[14px] flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    country: 'United States',
    timeZone: '(GMT-08:00) Pacific Time',
    language: 'English'
  })

  const [errors, setErrors] = useState({
    fullName: '',
    dateOfBirth: ''
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

  // Validate date of birth
  const validateDateOfBirth = (date) => {
    if (!date) {
      return '' // Date of birth is optional, no error if empty
    }
    
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to compare dates only
    
    if (selectedDate > today) {
      return t('profile.validation.dateOfBirthFuture') || 'Date of birth cannot be in the future'
    }
    
    return ''
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // For dateOfBirth, validate immediately to prevent future dates
    if (name === 'dateOfBirth' && value) {
      const error = validateDateOfBirth(value)
      if (error) {
        setErrors({
          ...errors,
          [name]: error
        })
        return // Don't update formData if validation fails
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing (if no validation error)
    if (errors[name] && (name !== 'dateOfBirth' || !value || !validateDateOfBirth(value))) {
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
    } else if (name === 'dateOfBirth') {
      error = validateDateOfBirth(value)
    }
    
    setErrors({
      ...errors,
      [name]: error
    })
  }

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      dateOfBirth: validateDateOfBirth(formData.dateOfBirth)
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
        
        // Refresh user data to get updated profile
        await dispatch(fetchCurrentUser())
        
        // Redirect to subscription bridge - it will check subscription and route accordingly
        navigate('/question-banks', { replace: true })
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
  const [languages, setLanguages] = useState(profileData.languages) // Fallback to static data

  // Fetch active languages from API
  useEffect(() => {
    const fetchActiveLanguages = async () => {
      try {
        const response = await languagesAPI.getActiveLanguages()
        if (response.success && response.data.languages && response.data.languages.length > 0) {
          // Transform API languages to match ProfileDropdown format (array of strings)
          const transformedLanguages = response.data.languages.map(lang => lang.name)
          setLanguages(transformedLanguages)
          
          // If current language is not in active languages, update to default or first active
          setFormData(prev => {
            const currentLang = prev.language
            if (currentLang && !transformedLanguages.includes(currentLang)) {
              const defaultLang = response.data.languages.find(lang => lang.isDefault)
              if (defaultLang) {
                return { ...prev, language: defaultLang.name }
              } else if (transformedLanguages.length > 0) {
                return { ...prev, language: transformedLanguages[0] }
              }
            }
            return prev
          })
        }
      } catch (error) {
        console.error('Error fetching active languages:', error)
        // Keep using static data as fallback
      }
    }
    fetchActiveLanguages()
  }, [])

  // Calculate profile completion percentage
  const calculateProgress = () => {
    let completed = 0;
    const total = 5; // fullName, dateOfBirth, country, timeZone, language
    
    if (formData.fullName.trim()) completed++;
    if (formData.dateOfBirth) completed++;
    if (formData.country) completed++;
    if (formData.timeZone) completed++;
    if (formData.language) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <AuthCard
      icon={<ProfileIcon />}
      title={t('profile.title') || 'Complete Your Profile'}
      description={t('profile.subtitle') || 'Find interesting stuff across the web'}
      showBackToLogin={false}
      showTips={true}
      tipText={t('profile.quickTip') || 'Quick Tip: Completing your profile helps us to personalize your learning experience!'}
      className="lg:max-w-2xl"
    >
      <div className="w-full flex flex-col gap-6">
        {/* Profile Completion Progress */}
        <div className="mb-2 mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-roboto font-normal text-[14px] leading-[100%] tracking-[0] text-oxford-blue">
              {t('profile.completion') || 'Profile Completion'}
            </label>
            <span className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0] text-oxford-blue">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-oxford-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Full Name Field */}
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t('profile.fullNamePlaceholder') || 'Enter your full name'}
            label={t('profile.fullName')}
            error={errors.fullName}
            icon="person"
            className="w-full"
            required
          />

          {/* Date of Birth Field */}
          <div className="flex flex-col gap-1">
            <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
              {t('profile.dateOfBirth')} ({t('profile.optional') || 'Optional'})
            </label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split('T')[0]}
                placeholder={t('profile.dateOfBirthPlaceholder') || 'Enter your date of birth'}
                className={`px-4 py-3 pl-12 border-2 ${errors.dateOfBirth ? 'border-[red-500]' : 'border-[#E5E7EB]'} rounded-[14px] outline-none w-full h-[56px] font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray focus:border-[#6CA6C1] transition-colors`}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 1.5V4.5" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 1.5V4.5" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 7.5H15.75" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </div>
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs font-normal text-[#6CA6C1] font-roboto">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Country and Time Zone in Same Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Country Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
                {t('profile.country')} <span className="text-cinnebar-red">*</span>
              </label>
              <ProfileDropdown
                value={formData.country}
                options={countries}
                onChange={(value) => setFormData({ ...formData, country: value })}
                placeholder={t('profile.countryPlaceholder') || 'Select your country'}
                icon="location"
                className="w-full"
              />
            </div>

            {/* Time Zone Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
                {t('profile.timeZone')} <span className="text-cinnebar-red">*</span>
              </label>
              <ProfileDropdown
                value={formData.timeZone}
                options={timeZones}
                onChange={(value) => setFormData({ ...formData, timeZone: value })}
                placeholder={t('profile.timeZonePlaceholder') || '(GMT-08:00) Pacific Time'}
                icon="clock"
                className="w-full"
              />
            </div>
          </div>

          {/* Language Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
              {t('profile.language')} <span className="text-cinnebar-red">*</span>
            </label>
            <ProfileDropdown
              value={formData.language}
              options={languages}
              onChange={(value) => setFormData({ ...formData, language: value })}
              placeholder={t('profile.languagePlaceholder') || 'English'}
              icon="globe"
              className="w-full"
            />
          </div>
        </div>

        {/* Finish Setup Button */}
        <AuthButton
          onClick={handleFinishSetup}
          disabled={loading}
          className="w-full mb-6"
        >
          {loading ? t('profile.buttonLoading') || 'Saving...' : t('profile.finishSetup') || 'Finish Setup'}
        </AuthButton>
      </div>
    </AuthCard>
  )
}

export default Profile