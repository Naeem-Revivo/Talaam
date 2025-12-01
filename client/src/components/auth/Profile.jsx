import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { downarrow } from '../../assets/svg/signup'
import profileData from '../../data/profileData.json'
import { useDispatch, useSelector } from 'react-redux'
import { completeProfile, fetchCurrentUser } from '../../store/slices/authSlice'
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig'
import { useNavigate } from 'react-router-dom'

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFinishSetup = async () => {
    try {
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        timezone: formData.timeZone,
        language: formData.language,
      }

      const resultAction = await dispatch(completeProfile(payload))

      if (completeProfile.fulfilled.match(resultAction)) {
        showSuccessToast(t('profile.success') || 'Profile completed successfully.')
        // Navigate to dashboard after completion
        navigate('/dashboard', { replace: true })
      } else {
        const msg =
          resultAction.payload?.message ||
          t('profile.errors.generic') ||
          'Failed to complete profile.'
        showErrorToast(msg)
      }
    } catch (e) {
      showErrorToast(t('profile.errors.generic') || 'Failed to complete profile.')
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
                placeholder={t('profile.fullNamePlaceholder')}
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray shadow-input"
              />
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
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <img 
                  src={downarrow} 
                  alt="dropdown" 
                  className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${dir === 'rtl' ? 'left-6' : 'right-6'}`}
                />
              </div>
            </div>

            {/* Time Zone Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.timeZone')}
              </label>
              <div className="relative">
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input"
                >
                  {timeZones.map((timeZone) => (
                    <option key={timeZone} value={timeZone}>
                      {timeZone}
                    </option>
                  ))}
                </select>
                <img 
                  src={downarrow} 
                  alt="dropdown" 
                  className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${dir === 'rtl' ? 'left-6' : 'right-6'}`}
                />
              </div>
            </div>

            {/* Language Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-base mb-2 leading-none tracking-normal text-oxford-blue">
                {t('profile.language')}
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <img 
                  src={downarrow} 
                  alt="dropdown" 
                  className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${dir === 'rtl' ? 'left-6' : 'right-6'}`}
                />
              </div>
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
