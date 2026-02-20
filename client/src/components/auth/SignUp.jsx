import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../store/slices/authSlice';
import { google, linkedin } from '../../assets/svg/signup';
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig';
import { getTranslatedAuthMessage } from '../../utils/authMessages';
import Input from '../common/Input';

const SignUp = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    const [selectedRole, setSelectedRole] = useState('student'); // 'student' or 'admin'

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

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

    // Validate individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
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
                const passwordError = getPasswordErrorMessage(value);
                newErrors.password = passwordError;

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

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    // Validate all fields before submission
    const validateForm = () => {
        const newErrors = { ...errors };
        let isValid = true;

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

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const resultAction = await dispatch(
                signup({
                    email: formData.email,
                    password: formData.password,
                    role: selectedRole,
                    country: 'Saudi Arabia', // Default, will be updated in profile
                    language: 'English' // Default, will be updated in profile
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

                // Store email in localStorage for verification page
                localStorage.setItem('signupEmail', formData.email);
                // Navigate to email verification page
                navigate('/verify-email', { replace: true });

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

    // Role selection icons (using simple SVG placeholders - you can replace with actual icons)
    const StudentIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.42 10.9224C21.5991 10.8434 21.751 10.7136 21.857 10.5492C21.963 10.3847 22.0184 10.1927 22.0164 9.99709C22.0143 9.80144 21.955 9.61068 21.8456 9.44844C21.7362 9.2862 21.5817 9.15961 21.401 9.08436L12.83 5.18036C12.5695 5.06151 12.2864 5 12 5C11.7137 5 11.4306 5.06151 11.17 5.18036L2.60004 9.08036C2.42201 9.15833 2.27056 9.28649 2.16421 9.44917C2.05786 9.61185 2.00122 9.802 2.00122 9.99636C2.00122 10.1907 2.05786 10.3809 2.16421 10.5435C2.27056 10.7062 2.42201 10.8344 2.60004 10.9124L11.17 14.8204C11.4306 14.9392 11.7137 15.0007 12 15.0007C12.2864 15.0007 12.5695 14.9392 12.83 14.8204L21.42 10.9224Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 10V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 12.5V16C6 16.7956 6.63214 17.5587 7.75736 18.1213C8.88258 18.6839 10.4087 19 12 19C13.5913 19 15.1174 18.6839 16.2426 18.1213C17.3679 17.5587 18 16.7956 18 16V12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );

    const AdminIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 13.0004C20 18.0004 16.5 20.5005 12.34 21.9505C12.1222 22.0243 11.8855 22.0207 11.67 21.9405C7.5 20.5005 4 18.0004 4 13.0004V6.00045C4 5.73523 4.10536 5.48088 4.29289 5.29334C4.48043 5.10581 4.73478 5.00045 5 5.00045C7 5.00045 9.5 3.80045 11.24 2.28045C11.4519 2.09945 11.7214 2 12 2C12.2786 2 12.5481 2.09945 12.76 2.28045C14.51 3.81045 17 5.00045 19 5.00045C19.2652 5.00045 19.5196 5.10581 19.7071 5.29334C19.8946 5.48088 20 5.73523 20 6.00045V13.0004Z" stroke="#6697B7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4" dir={dir}>
            <div className="bg-white p-4 lg:p-8 2xl:p-0 w-full max-w-2xl">
                <div className="w-full max-w-[448px] mx-auto pt-8 lg:pt-16">
                    {/* Header */}
                    <h1 className="font-archivo font-bold mb-2 lg:mb-4 text-[26px] lg:text-[32px] leading-[45px] text-text-dark">
                        {t('createAccount.title')}
                    </h1>
                    <p className="font-roboto font-normal text-base text-text-gray mb-6 lg:mb-8">
                        {t('createAccount.subtitle') || 'Create an account to access thousands of questions and unlock your potential.'}
                    </p>

                    <div className="flex flex-col gap-6 lg:gap-8">
                        {/* Role Selection */}
                        <div className="flex flex-col gap-1 mb-2">
                            <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
                                {t('createAccount.roleLabel') || 'I am a *'}
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Student Card */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('student')}
                                    className={`p-4 h-[156px] w-[216px] flex flex-col justify-center items-center rounded-[16px] border-2 transition-all relative ${selectedRole === 'student'
                                        ? 'border-[#032746] bg-[#F8FAFC]'
                                        : 'border-[#E5E7EB] bg-white'
                                        }`}
                                >
                                    {selectedRole === 'student' && (
                                        <div className="absolute top-2 right-2">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10" cy="10" r="10" fill="#032746" />
                                                <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`${selectedRole === 'student' ? 'text-white bg-oxford-blue' : ' bg-[#F3F4F6]'} h-12 w-12 flex items-center justify-center rounded-[14px]`}>
                                            <StudentIcon />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`font-roboto font-bold text-[16px] leading-[100%] tracking-[0] ${selectedRole === 'student' ? 'text-oxford-blue' : 'text-gray-600'
                                                }`}>
                                                {t('createAccount.roleStudent') || 'Student'}
                                            </span>
                                            <span className={`font-roboto font-normal text-[14px] leading-[100%] tracking-[0] ${selectedRole === 'student' ? 'text-oxford-blue/70' : 'text-gray-400'
                                                }`}>
                                                {t('createAccount.roleStudentDesc') || 'Learn & Practice'}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {/* Admin Card - Disabled for now */}
                                <button
                                    type="button"
                                    onClick={() => { }}
                                    disabled
                                    className={`p-4 rounded-lg border-2 transition-all relative cursor-not-allowed ${selectedRole === 'admin'
                                        ? 'border-oxford-blue bg-oxford-blue/5'
                                        : 'border-[#03274633] bg-white'
                                        }`}
                                >
                                    {selectedRole === 'admin' && (
                                        <div className="absolute top-2 right-2">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10" cy="10" r="10" fill="#032746" />
                                                <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`${selectedRole === 'admin' ? 'text-oxford-blue' : 'text-gray-400 bg-[#F3F4F6]'} h-12 w-12 flex items-center justify-center rounded-[14px]`}>
                                            <AdminIcon />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`font-roboto font-bold text-[16px] leading-[100%] tracking-[0] ${selectedRole === 'admin' ? 'text-oxford-blue' : 'text-gray-600'
                                                }`}>
                                                {t('createAccount.roleAdmin') || 'Admin'}
                                            </span>
                                            <span className={`font-roboto font-normal text-[14px] leading-[100%] tracking-[0] ${selectedRole === 'admin' ? 'text-oxford-blue/70' : 'text-gray-400'
                                                }`}>
                                                {t('createAccount.roleAdminDesc') || 'Manage & Monitor'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Email Field */}
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t('createAccount.emailPlaceholder')}
                            label={t('createAccount.email')}
                            required
                            error={errors.email}
                            icon="email"
                            maxLength={50}
                        />

                        {/* Password Field */}
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t('createAccount.passwordPlaceholder')}
                            label={t('createAccount.password')}
                            required
                            error={errors.password}
                            hint={t('createAccount.passwordHint')}
                            icon="password"
                            maxLength={25}
                            showPasswordToggle
                        />

                        {/* Confirm Password Field */}
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t('createAccount.confirmPasswordPlaceholder')}
                            label={t('createAccount.confirmPassword')}
                            required
                            error={errors.confirmPassword}
                            hint={t('createAccount.passwordHint')}
                            icon="password"
                            maxLength={25}
                            showPasswordToggle
                        />

                        {/* Terms & Privacy */}
                        <p className="font-roboto font-normal text-[12px] leading-[20px] tracking-[0] text-start text-[#6CA6C1]">
                            {t('createAccount.terms.text')}{' '}
                            <a href="#" className="font-roboto font-semibold text-[12px] leading-[20px] tracking-[0] text-start underline text-cinnebar-red">
                                {t('createAccount.terms.terms')}
                            </a>
                            {' '}{t('createAccount.terms.and')}{' '}
                            <a href="#" className="font-roboto font-semibold text-[12px] leading-[20px] tracking-[0] text-center underline text-cinnebar-red">
                                {t('createAccount.terms.privacy')}
                            </a>
                            .
                        </p>

                        {/* Sign Up Button */}
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className={`bg-gradient-to-b from-[#032746] to-[#0A4B6E] text-white font-archivo font-semibold text-[20px] leading-[100%] tracking-[0] rounded-[14px] transition-colors duration-200 py-3 w-full h-[57px] hover:bg-oxford-blue/90 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? t('createAccount.buttonLoading') || 'Creating account...' : t('createAccount.buttonText') || 'Sign Up Free'}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16663 10H15.8333" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10 4.16699L15.8333 10.0003L10 15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </button>

                        {/* Divider */}
                        <div className="flex justify-center items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 font-roboto text-[14px] leading-[100%] tracking-[0] text-[#6CA6C1]">
                                {t('createAccount.orContinueWith')}
                            </span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-[14px] hover:bg-gray-50 transition-colors w-full h-[57px]"
                            >
                                <img src={google} alt="Google" className="w-5 h-5" />
                                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                                    {t('login.continueWithGoogle')}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleLinkedInSignup}
                                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-[14px] hover:bg-gray-50 transition-colors w-full h-[57px]"
                            >
                                <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
                                <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-gray-900">
                                    {t('login.continueWithLinkedIn')}
                                </span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="font-roboto font-normal text-sm tracking-[0] text-center text-[#6CA6C1] pt-4">
                            {t('createAccount.alreadyHaveAccount') || 'Already have an account?'}{' '}
                            <a href="/login" className="font-roboto font-semibold text-sm tracking-[0] text-center underline text-cinnebar-red">
                                {t('createAccount.login') || 'Log in'}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
