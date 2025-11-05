import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { downarrow } from '../../assets/svg/signup'

const Profile = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    country: 'United States',
    timeZone: '(GMT-08:00) Pacific Time',
    language: 'English'
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFinishSetup = () => {
    // Here you would typically validate the form and make an API call
    // For now, we'll just log the data
    console.log('Profile data:', formData)
    // Navigate to home or dashboard after completion
    // navigate('/')
  }

  const countries = ['United States', 'Canada', 'United Kingdom', 'Saudi Arabia', 'UAE', 'Egypt', 'Jordan']
  const timeZones = [
    '(GMT-08:00) Pacific Time',
    '(GMT-05:00) Eastern Time',
    '(GMT+00:00) GMT',
    '(GMT+03:00) Arabia Standard Time'
  ]
  const languages = ['English', 'العربية']

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
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-none placeholder:tracking-normal placeholder:text-[#6B7280] font-roboto shadow-input"
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
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] font-roboto shadow-input"
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
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto shadow-input"
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
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto shadow-input"
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
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] appearance-none bg-white pr-10 font-roboto shadow-input"
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
              className="bg-cinnebar-red text-white font-roboto font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('profile.finishSetup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
