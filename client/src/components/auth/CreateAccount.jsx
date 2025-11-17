import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { eye, openeye, google, linkedin } from '../../assets/svg/signup'

const CreateAccount = () => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Password requirement validation functions
  const checkPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    }
  }

  const passwordRequirements = checkPasswordRequirements(formData.password)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCreateAccount = () => {
    // Here you would typically validate the form and make an API call
    // For now, we'll navigate to verify email page
    // You can add validation logic before navigating
    navigate('/verify-email')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full lg:h-[1038px] lg:w-[505px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-16 lg:h-[770px] flex flex-col mx-auto">
          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-6 lg:mb-8 text-[26px] lg:text-[30px] leading-[100%] tracking-[0] text-oxford-blue">
            {t('createAccount.title')}
          </h1>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('createAccount.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('createAccount.emailPlaceholder')}
                className="px-4 py-3 border border-[#03274633] rounded-lg outline-none w-full lg:w-[423px] h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('createAccount.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('createAccount.passwordPlaceholder')}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray"
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

            {/* Password Requirements */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <span className={`mr-2 w-[10px] h-[10px] rounded-full ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-[#D9D9D9]'}`}></span>
                <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] text-dark-gray">
                  {t('createAccount.passwordRequirements.8chars')}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 w-[10px] h-[10px] rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-500' : 'bg-[#D9D9D9]'}`}></span>
                <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] text-dark-gray">
                  {t('createAccount.passwordRequirements.1uppercase')}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 w-[10px] h-[10px] rounded-full ${passwordRequirements.hasSpecial ? 'bg-green-500' : 'bg-[#D9D9D9]'}`}></span>
                <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] text-dark-gray">
                  {t('createAccount.passwordRequirements.1special')}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 w-[10px] h-[10px] rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-500' : 'bg-[#D9D9D9]'}`}></span>
                <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] text-dark-gray">
                  {t('createAccount.passwordRequirements.1lowercase')}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 w-[10px] h-[10px] rounded-full ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-[#D9D9D9]'}`}></span>
                <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] text-dark-gray">
                  {t('createAccount.passwordRequirements.1number')}
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('createAccount.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('createAccount.confirmPasswordPlaceholder')}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray"
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

            {/* Create Account Button */}
            <button
              onClick={handleCreateAccount}
              className="bg-cinnebar-red text-white font-archivo font-semibold text-[20px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('createAccount.buttonText')}
            </button>

            {/* Divider */}
            <div className="flex px-4 lg:px-9 justify-center items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 font-roboto text-[14px] leading-[100%] tracking-[0] text-gray-500">
                {t('createAccount.orContinueWith')}
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-4">
              {/* Google Button */}
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]">
                <img src={google} alt="Google" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                  {t('createAccount.continueWithGoogle')}
                </span>
              </button>

              {/* LinkedIn Button */}
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]">
                <img src={linkedin} alt="LinkedIn" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                  {t('createAccount.continueWithLinkedIn')}
                </span>
              </button>
            </div>
          </div>

          {/* Terms & Privacy */}
          <p className="font-roboto font-normal mb-5 text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue pt-8 lg:pt-20">
            {t('createAccount.terms.text')}{' '}
            <a href="#" className="font-roboto font-bold text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center underline text-cinnebar-red">
              {t('createAccount.terms.terms')}
            </a>
            {' '}{t('createAccount.terms.and')}{' '}
            <a href="#" className="font-roboto font-bold text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center underline text-cinnebar-red">
              {t('createAccount.terms.privacy')}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount