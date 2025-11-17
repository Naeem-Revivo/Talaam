import React from 'react'
import { useNavigate} from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { message } from '../../assets/svg/signup'

const ForgotModal = ({ onClose }) => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const handleBackToSignIn = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-6 lg:p-8 w-full lg:w-[505px] lg:h-[436px] max-w-md flex flex-col items-center">
        {/* Message Icon with Checkmark */}
        <div className="mb-6 pt-5 lg:pt-8">
          <img src={message} alt="message" className="" />
        </div>

        {/* Heading */}
        <h2 className="font-archivo font-bold text-2xl  py-3 leading-none tracking-normal text-oxford-blue mb-4 text-center">
          {t('forgotModal.title')}
        </h2>

        {/* Description */}
        <p className="font-roboto font-normal text-base pt-3 leading-[100%] tracking-normal text-dark-gray mb-4 text-center">
          {t('forgotModal.description')}
        </p>

        {/* Back to Sign In Button */}
        <button
          onClick={handleBackToSignIn}
          className="bg-cinnebar-red text-white mt-2 mb-5 lg:mb-0 font-roboto font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-3 w-full h-[57px] hover:bg-cinnebar-red/90"
        >
          {t('forgotModal.backToSignIn')}
        </button>
      </div>
    </div>
  )
}

export default ForgotModal
