import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { eye, openeye, google, linkedin } from '../../assets/svg/signup'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const { language, t } = useLanguage()
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const { login } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = () => {
    setError('')
    const { ok, message } = login(formData.email, formData.password)
    if (!ok) {
      setError(message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full h-[842px] lg:h-[1038px] lg:w-[505px] flex flex-col">
        <div className="w-full lg:w-[430px] pt-8 lg:pt-12 lg:h-[770px] flex flex-col mx-auto">
          {/* Welcome Text */}
          <p className="font-archivo font-bold text-[18px] lg:text-[24px] mb-1 lg:mb-2 text-oxford-blue">
            {t('login.welcome')}
          </p>

          {/* Main Heading */}
          <h1 className="font-archivo font-semibold mb-6 pt-3 lg:mb-8 text-[26px] lg:text-[30px] leading-[100%] tracking-[0] text-oxford-blue">
            {t('login.title')}
          </h1>

          <div className="flex flex-col pt-10 gap-6 lg:gap-8">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('login.emailPlaceholder')}
                className="px-4 py-3 border border-[#03274633] rounded-lg text-[14px] outline-none w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#6B7280] font-roboto font-normal leading-[100%] tracking-[0] text-oxford-blue shadow-input"
              />
            </div>
            <div className="flex flex-col gap-5">
            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('login.passwordPlaceholder')}
                  className="px-4 py-3 border border-[#03274633] rounded-lg outline-none pr-12 w-full lg:w-[423px] h-[59px] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#6B7280] font-roboto font-normal text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between sm:flex-row sm:justify-between items-start sm:items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 border border-gray-300 rounded text-cinnebar-red focus:ring-cinnebar-red mr-2"
                />
                <span className="font-roboto font-normal pt-0.5 text-[12px] leading-[100%] tracking-[0] text-oxford-blue">
                  {t('login.rememberMe')}
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="font-roboto font-medium text-[12px] leading-[100%] tracking-[0] text-cinnebar-red underline hover:no-underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-roboto">{error}</div>
            )}

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              className="bg-cinnebar-red text-white font-archivo font-semibold text-[16px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full lg:w-[423px] h-[57px] hover:bg-cinnebar-red/90"
            >
              {t('login.buttonText')}
            </button>

            {/* Quick fill helpers for demo */}
            <div className="flex gap-3 justify-between">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@talaam.com', password: 'Admin@123' })}
                className="text-xs text-gray-600 underline"
              >
                Use Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'user@talaam.com', password: 'User@123' })}
                className="text-xs text-gray-600 underline"
              >
                Use User
              </button>
            </div>

            {/* Divider */}
            <div className="flex px-4 lg:px-9 pt-6 justify-center items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 font-roboto text-[16px] leading-[100%] tracking-[0] text-gray-500">{t('login.orContinueWith')}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-4">
              {/* Google Button */}
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]">
                <img src={google} alt="Google" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">{t('login.continueWithGoogle')}</span>
              </button>

              {/* LinkedIn Button */}
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full lg:w-[423px] h-[57px]">
                <img src={linkedin} alt="LinkedIn" className="" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">{t('login.continueWithLinkedIn')}</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="font-roboto font-normal text-[14px] lg:text-[16px] leading-[100%] tracking-[0] text-center text-gray-500 mt-16 lg:mt-24">
            {t('login.noAccount')}{' '}
            <Link to="/signupfree" className="font-roboto font-bold text-[14px] lg:text-[16px] leading-[100%] tracking-[0] text-center underline text-cinnebar-red">
              {t('login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
