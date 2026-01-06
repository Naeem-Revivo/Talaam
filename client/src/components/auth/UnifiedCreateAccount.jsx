import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyOTP, resendOTP } from '../../store/slices/authSlice';
import { eye, openeye, google, linkedin } from '../../assets/svg/signup';
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig';
import { getTranslatedAuthMessage } from '../../utils/authMessages';
import ProfileDropdown from '../common/ProfileDropdown';

const UnifiedCreateAccount = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, user } = useSelector((state) => state.auth);
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'Saudi Arabia',
    language: 'English'
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });

  const countries = ['Saudi Arabia', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Pakistan', 'India'];
  const languages = ['English', 'العربية'];

  // Password requirement validation functions
  const checkPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      maxLength: password.length <= 25,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
  };

  const isPasswordValid = () => {
    const requirements = checkPasswordRequirements(formData.password);
    return Object.values(requirements).every(Boolean);
  };

  // Get password error message based on requirements
  const getPasswordErrorMessage = (password) => {
    if (!password.trim()) {
      return t('createAccount.validation.passwordRequired') || 'Password is required';
    }
    
    if (password.length > 25) {
      return t('createAccount.validation.passwordMaxLength') || 'Password must not exceed 25 characters';
    }
    
    if (password.length < 8) {
      return t('createAccount.validation.passwordMinLength') || 'Password must be at least 8 characters';
    }
    
    const requirements = checkPasswordRequirements(password);
    
    if (!requirements.hasUppercase) {
      return t('createAccount.validation.passwordUppercase') || 'Password must contain at least one uppercase letter';
    }
    
    if (!requirements.hasLowercase) {
      return t('createAccount.validation.passwordLowercase') || 'Password must contain at least one lowercase letter';
    }
    
    if (!requirements.hasNumber) {
      return t('createAccount.validation.passwordNumber') || 'Password must contain at least one number';
    }
    
    if (!requirements.hasSpecial) {
      return t('createAccount.validation.passwordSpecial') || 'Password must contain at least one special character';
    }
    
    return '';
  };

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend]);

  // Validate individual fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = t('profile.validation.fullNameRequired') || 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = t('profile.validation.fullNameMinLength') || 'Full name must be at least 2 characters';
        } else {
          newErrors.fullName = '';
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = t('createAccount.validation.emailRequired') || 'Email is required';
        } else if (value.length > 50) {
          newErrors.email = t('createAccount.validation.emailMaxLength') || 'Email must not exceed 50 characters';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = t('createAccount.validation.emailInvalid') || 'Please enter a valid email address';
        } else {
          newErrors.email = '';
        }
        break;

      case 'password':
        // Get error message
        const passwordError = getPasswordErrorMessage(value);
        newErrors.password = passwordError;
        
        // If confirmPassword is filled, validate it again
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = t('createAccount.validation.passwordsMismatch') || 'Passwords do not match';
          } else {
            newErrors.confirmPassword = '';
          }
        }
        break;

      case 'confirmPassword':
        if (!value.trim()) {
          newErrors.confirmPassword = t('createAccount.validation.confirmPasswordRequired') || 'Please confirm your password';
        } else if (value.length > 25) {
          newErrors.confirmPassword = t('createAccount.validation.passwordMaxLength') || 'Password must not exceed 25 characters';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = t('createAccount.validation.passwordsMismatch') || 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
        break;

      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Handle dropdown changes
  const handleDropdownChange = (fieldName) => (value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('profile.validation.fullNameRequired') || 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t('profile.validation.fullNameMinLength') || 'Full name must be at least 2 characters';
      isValid = false;
    } else {
      newErrors.fullName = '';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('createAccount.validation.emailRequired') || 'Email is required';
      isValid = false;
    } else if (formData.email.length > 50) {
      newErrors.email = t('createAccount.validation.emailMaxLength') || 'Email must not exceed 50 characters';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('createAccount.validation.emailInvalid') || 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Password validation
    const passwordError = getPasswordErrorMessage(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    } else {
      newErrors.password = '';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('createAccount.validation.confirmPasswordRequired') || 'Please confirm your password';
      isValid = false;
    } else if (formData.confirmPassword.length > 25) {
      newErrors.confirmPassword = t('createAccount.validation.passwordMaxLength') || 'Password must not exceed 25 characters';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('createAccount.validation.passwordsMismatch') || 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const resultAction = await dispatch(
        signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          language: formData.language
        })
      );

      if (signup.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'Account created successfully.';
        const message = getTranslatedAuthMessage(backendMessage, t, 'createAccount.success') || 
                       t('createAccount.success') || 
                       'Account created successfully.';

        showSuccessToast(message, { 
          title: t('createAccount.successTitle') || 'Account Created', 
          isAuth: true 
        });
        
        // Show verification modal
        setShowVerificationModal(true);
        setTimer(60);
        setCanResend(false);
        setVerificationCode(['', '', '', '', '', '']);
        
      } else {
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          null;
        
        const msg = backendMessage
          ? getTranslatedAuthMessage(backendMessage, t, 'createAccount.errors.generic')
          : t('createAccount.errors.generic') || 'Signup failed. Please try again.';
        
        showErrorToast(msg, { 
          title: t('createAccount.errors.title') || 'Signup Failed', 
          isAuth: true 
        });
      }
    } catch (e) {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.';
      showErrorToast(defaultError, { 
        title: t('createAccount.errors.title') || 'Signup Failed', 
        isAuth: true 
      });
    }
  };

  const handleGoogleSignup = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const apiUrl = baseUrl.replace(/\/api$/, '');
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleLinkedInSignup = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const apiUrl = baseUrl.replace(/\/api$/, '');
    window.location.href = `${apiUrl}/api/auth/linkedin`;
  };

  // Verification modal handlers
  const handleVerificationInput = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Clear error when user starts typing
    if (errors.verificationCode) {
      setErrors({ ...errors, verificationCode: '' });
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerificationPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...verificationCode];
    
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6 && /^\d$/.test(char)) {
        newCode[idx] = char;
      }
    });
    
    setVerificationCode(newCode);
    
    if (errors.verificationCode) {
      setErrors({ ...errors, verificationCode: '' });
    }
    
    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyEmail = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setErrors({ ...errors, verificationCode: t('verifyEmail.validation.codeRequired') || 'Please enter the complete verification code' });
      return;
    }

    try {
      const resultAction = await dispatch(
        verifyOTP({ email: formData.email, otp: code })
      );

      if (verifyOTP.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'Email verified successfully';
        const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.success') || 
                    t('verifyEmail.success') || 
                    'Email verified successfully.';
        
        showSuccessToast(msg, { 
          title: t('verifyEmail.successTitle') || 'Email Verified', 
          isAuth: true 
        });
        
        // Close modal and navigate to dashboard
        setShowVerificationModal(false);
        navigate('/dashboard');
        
      } else {
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          '';
        
        const isInvalidOTP = backendMessage && (
          backendMessage.toLowerCase().includes('invalid') ||
          backendMessage.toLowerCase().includes('incorrect') ||
          backendMessage.toLowerCase().includes('wrong') ||
          backendMessage.toLowerCase().includes('expired') ||
          backendMessage.toLowerCase().includes('otp')
        );
        
        if (isInvalidOTP) {
          const errorMsg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.invalidOtp') || 
                          t('verifyEmail.errors.invalidOtp') || 
                          'The verification code is invalid or has expired. Please try again.';
          setErrors({ ...errors, verificationCode: errorMsg });
        } else if (backendMessage) {
          const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.generic') || 
                     t('verifyEmail.errors.generic') || 
                     'Failed to verify code.';
          showErrorToast(msg, { 
            title: t('verifyEmail.errors.title') || 'Verification Failed', 
            isAuth: true 
          });
        }
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.';
      showErrorToast(defaultError, { 
        title: t('verifyEmail.errors.title') || 'Verification Failed', 
        isAuth: true 
      });
    }
  };

  const handleSkipVerification = () => {
    // Redirect to dashboard without verification
    setShowVerificationModal(false);
    navigate('/dashboard');
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(60);

    try {
      const resultAction = await dispatch(resendOTP({ email: formData.email }));
      if (resendOTP.fulfilled.match(resultAction)) {
        const backendMessage = resultAction.payload?.message || 'OTP resent to your email';
        const msg = getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.resendSuccess') || 
                    t('verifyEmail.resendSuccess') || 
                    'Verification code has been resent to your email.';
        
        showSuccessToast(msg, { 
          title: t('verifyEmail.resendTitle') || 'Code Resent', 
          isAuth: true 
        });
      } else {
        const backendMessage = 
          (typeof resultAction.payload === 'string' ? resultAction.payload : null) ||
          resultAction.payload?.message ||
          null;
        
        const msg = backendMessage
          ? getTranslatedAuthMessage(backendMessage, t, 'verifyEmail.errors.resend')
          : t('verifyEmail.errors.resend') || 'Failed to resend verification code. Please try again.';
        
        showErrorToast(msg, { 
          title: t('verifyEmail.errors.resendTitle') || 'Resend Failed', 
          isAuth: true 
        });
      }
    } catch {
      const defaultError = t('auth.errors.default') || 'An unexpected error occurred. Please try again.';
      showErrorToast(defaultError, { 
        title: t('verifyEmail.errors.resendTitle') || 'Resend Failed', 
        isAuth: true 
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg border border-[#03274633] shadow-lg p-4 lg:p-8 w-full max-w-2xl">
        <div className="w-full max-w-xl mx-auto pt-8 lg:pt-16">
          {/* Header */}
          <h1 className="font-archivo font-semibold mb-6 lg:mb-8 text-[26px] lg:text-[30px] leading-[100%] tracking-[0] text-oxford-blue">
            {t('createAccount.title')}
          </h1>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col gap-1">
                <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                  {t('profile.fullName')}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t('profile.fullNamePlaceholder')}
                  className={`px-4 py-3 border ${
                    errors.fullName ? 'border-red-500' : 'border-[#03274633]'
                  } rounded-lg outline-none w-full h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500 font-roboto">{errors.fullName}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                  {t('createAccount.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  placeholder={t('createAccount.emailPlaceholder')}
                  className={`px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-[#03274633]'
                  } rounded-lg outline-none w-full h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-roboto">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                    onBlur={handleBlur}
                    maxLength={25}
                    placeholder={t('createAccount.passwordPlaceholder')}
                    className={`px-4 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-[#03274633]'
                    } rounded-lg outline-none pr-12 w-full h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <img src={showPassword ? openeye : eye} alt="toggle password visibility" className="w-5 h-5" />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-roboto">{errors.password}</p>
                )}
              </div>

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
                    onBlur={handleBlur}
                    maxLength={25}
                    placeholder={t('createAccount.confirmPasswordPlaceholder')}
                    className={`px-4 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[#03274633]'
                    } rounded-lg outline-none pr-12 w-full h-[59px] shadow-input font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <img src={showConfirmPassword ? openeye : eye} alt="toggle password visibility" className="w-5 h-5" />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 font-roboto">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Country & Language Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col gap-1 w-full">
                <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                  {t('profile.country')}
                </label>
                <ProfileDropdown
                  value={formData.country}
                  options={countries}
                  onChange={handleDropdownChange('country')}
                  placeholder={t('profile.countryPlaceholder') || 'Select country'}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="block font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                  {t('profile.language')}
                </label>
                <ProfileDropdown
                  value={formData.language}
                  options={languages}
                  onChange={handleDropdownChange('language')}
                  placeholder={t('profile.languagePlaceholder') || 'Select language'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className={`bg-cinnebar-red text-white font-archivo font-semibold text-[20px] leading-[100%] tracking-[0] rounded-lg transition-colors duration-200 py-3 w-full h-[57px] hover:bg-cinnebar-red/90 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('createAccount.buttonLoading') || 'Creating account...' : t('createAccount.buttonText')}
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
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full h-[57px]"
              >
                <img src={google} alt="Google" className="w-5 h-5" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                  {t('createAccount.continueWithGoogle')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLinkedInSignup}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full h-[57px]"
              >
                <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                  {t('createAccount.continueWithLinkedIn')}
                </span>
              </button>
            </div>

            {/* Terms & Privacy */}
            <p className="font-roboto font-normal text-[14px] lg:text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue pt-4">
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

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir={dir}>
          <div className="bg-white rounded-[14px] border border-[#03274633] shadow-lg p-6 lg:p-8 w-full max-w-md">
            <h2 className="font-archivo font-semibold mb-4 text-[18px] lg:text-[30px] leading-none tracking-normal text-oxford-blue">
              {t('verifyEmail.title')}
            </h2>

            <p className="font-roboto font-normal text-[16px] leading-[22px] tracking-normal text-dark-gray mb-6">
              {t('verifyEmail.instructions.text')}{' '}
              <span className="font-roboto font-medium text-[16px] leading-[22px] tracking-normal">
                {formData.email}
              </span>
              {'. '}{t('verifyEmail.instructions.expiry')}
            </p>

            <div className="mb-6">
              <label className="block font-roboto font-normal text-[16px] leading-none tracking-normal text-oxford-blue mb-4">
                {t('verifyEmail.enterCode')}
              </label>
              <div className="flex gap-2 justify-between">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleVerificationInput(index, e.target.value)}
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    onPaste={handleVerificationPaste}
                    className={`w-12 lg:w-14 h-12 lg:h-14 border ${
                      errors.verificationCode ? 'border-red-500' : 'border-[#03274633]'
                    } rounded-lg text-center text-xl lg:text-2xl font-semibold focus:outline-none focus:border-cinnebar-red focus:ring-2 focus:ring-cinnebar-red/20 shadow-input`}
                  />
                ))}
              </div>
              {errors.verificationCode && (
                <p className="mt-2 text-sm text-red-500 font-roboto">{errors.verificationCode}</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-roboto font-normal text-[16px] leading-none tracking-normal text-dark-gray">
                {t('verifyEmail.dontReceive')}
              </span>
              <button
                onClick={handleResendCode}
                disabled={!canResend}
                className={`font-roboto font-medium text-sm leading-none tracking-normal ${
                  canResend
                    ? 'text-cinnebar-red underline hover:no-underline cursor-pointer'
                    : 'cursor-not-allowed text-gray-400'
                }`}
              >
                {canResend ? (
                  t('verifyEmail.resendCode')
                ) : (
                  <>
                    <span className="text-gray-400">{t('verifyEmail.resendCodeIn')} </span>
                    <span className="text-gray-600">{timer}s</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className={`bg-cinnebar-red text-white font-roboto font-semibold text-base leading-none tracking-normal rounded-lg transition-colors duration-200 py-5 w-full h-[57px] hover:bg-cinnebar-red/90 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? t('verifyEmail.verifying') || 'Verifying...' : t('verifyEmail.verifyAccount')}
              </button>

              <button
                onClick={handleSkipVerification}
                className="w-full font-roboto font-normal text-[16px] leading-normal tracking-normal text-dark-gray hover:text-gray-700 hover:underline"
              >
                {t('verifyEmail.skipForNow')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedCreateAccount;