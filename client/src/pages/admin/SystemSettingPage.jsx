import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SystemSettingPlan = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const handleLanguageManagement = () => {
        navigate('/admin/settings/language-management')
    };

    const handleAnnouncements = () => {
        navigate('/admin/settings/announcements')
    };

    const handleEmailTemplates = () => {
        navigate('/admin/settings/email-template')
    };

    const handleRolesPermissions = () => {
        navigate('/admin/settings/roles-permissions')
    };

    const GlobeIcon = () => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.75 0C4.822 0 0 4.823 0 10.75C0 16.677 4.822 21.5 10.75 21.5C16.678 21.5 21.5 16.677 21.5 10.75C21.5 4.823 16.678 0 10.75 0ZM19.962 10H15.912C15.781 7.257 14.937 4.46201 13.477 1.91101C17.02 3.00701 19.653 6.18 19.962 10ZM11.48 1.53699C13.236 4.14799 14.259 7.11 14.412 10H7.08801C7.24001 7.11 8.26399 4.14799 10.02 1.53699C10.262 1.51799 10.504 1.5 10.75 1.5C10.996 1.5 11.239 1.51799 11.48 1.53699ZM8.02301 1.91101C6.56301 4.46201 5.71901 7.257 5.58801 10H1.53799C1.84699 6.18 4.48001 3.00701 8.02301 1.91101ZM1.53799 11.5H5.58801C5.71901 14.243 6.56301 17.038 8.02301 19.589C4.48001 18.493 1.84699 15.32 1.53799 11.5ZM10.02 19.963C8.26399 17.352 7.24101 14.39 7.08801 11.5H14.412C14.26 14.39 13.236 17.352 11.48 19.963C11.238 19.982 10.996 20 10.75 20C10.504 20 10.261 19.982 10.02 19.963ZM13.477 19.589C14.937 17.038 15.781 14.243 15.912 11.5H19.962C19.653 15.32 17.02 18.493 13.477 19.589Z" fill="white" />
        </svg>

    );

    const MegaphoneIcon = () => (
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.2692 0H12.1062L7.1437 2.72438H3.5569C1.59566 2.72438 0 4.31995 0 6.28127C0 8.03547 1.27741 9.49329 2.94988 9.7829L1.79995 13.8258H5.76744L6.9015 9.83883H7.1437L12.1063 12.5628H12.2694C13.32 12.5628 14.175 11.708 14.175 10.6572V1.90555C14.1748 0.854974 13.3198 0 12.2692 0ZM4.8081 12.5552H3.48218L4.17946 10.1037H5.50537L4.8081 12.5552ZM9.13825 9.48419L7.46954 8.56818H3.5569C2.29602 8.56818 1.2704 7.54215 1.2704 6.28127C1.2704 5.02039 2.29602 3.99477 3.5569 3.99477H7.46954L9.13825 3.07861V9.48419ZM12.9044 10.6572C12.9044 10.9608 12.6901 11.2151 12.4053 11.2775L10.4087 10.1816V2.38134L12.4053 1.28517C12.6903 1.34762 12.9044 1.60217 12.9044 1.9058V10.6572Z" fill="white" />
            <path d="M16.6128 3.53906L15.7042 4.44763C16.1736 5.0979 16.4536 5.8936 16.4536 6.75492C16.4536 7.61649 16.1736 8.41219 15.7042 9.0622L16.6128 9.97077C17.3079 9.08341 17.724 7.96713 17.724 6.75492C17.724 5.54271 17.3079 4.42651 16.6128 3.53906Z" fill="white" />
            <path d="M18.2297 1.92188L17.3285 2.82302C18.2036 3.8963 18.7296 5.26513 18.7296 6.75468C18.7296 8.24447 18.2036 9.61305 17.3285 10.6863L18.2297 11.5875C19.333 10.2811 20 8.59461 20 6.75468C20 4.91474 19.333 3.22825 18.2297 1.92188Z" fill="white" />
        </svg>

    );

    const MailIcon = () => (
        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 16.5H3.75C1.332 16.5 0 15.168 0 12.75V3.75C0 1.332 1.332 0 3.75 0H15.75C18.168 0 19.5 1.332 19.5 3.75V12.75C19.5 15.168 18.168 16.5 15.75 16.5ZM3.75 1.5C2.173 1.5 1.5 2.173 1.5 3.75V12.75C1.5 14.327 2.173 15 3.75 15H15.75C17.327 15 18 14.327 18 12.75V3.75C18 2.173 17.327 1.5 15.75 1.5H3.75ZM10.7791 8.929L15.6909 5.35699C16.0259 5.11399 16.1 4.64401 15.856 4.30901C15.613 3.97501 15.1451 3.899 14.8081 4.144L9.896 7.716C9.808 7.78 9.69103 7.78 9.60303 7.716L4.69092 4.144C4.35292 3.899 3.88607 3.97601 3.64307 4.30901C3.39907 4.64401 3.47311 5.11299 3.80811 5.35699L8.71997 8.92999C9.02797 9.15399 9.38902 9.265 9.74902 9.265C10.109 9.265 10.4721 9.153 10.7791 8.929Z" fill="white" />
        </svg>

    );

    const ShieldIcon = () => (
        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75598 8.30005C5.43298 8.30005 4.35699 7.22302 4.35699 5.90002C4.35699 4.57702 5.43298 3.5 6.75598 3.5C8.07898 3.5 9.15601 4.57702 9.15601 5.90002C9.15601 7.22302 8.07898 8.30005 6.75598 8.30005ZM6.75598 5C6.25998 5 5.85699 5.40402 5.85699 5.90002C5.85699 6.39602 6.25998 6.80005 6.75598 6.80005C7.25198 6.80005 7.65601 6.39602 7.65601 5.90002C7.65601 5.40402 7.25198 5 6.75598 5ZM9.75 13C9.336 13 9 12.664 9 12.25V11.947C9 11.227 8.50303 10.5 7.39203 10.5H6.10901C4.99801 10.5 4.50098 11.227 4.50098 11.947V12.25C4.50098 12.664 4.16498 13 3.75098 13C3.33698 13 3.00098 12.664 3.00098 12.25V11.947C3.00098 10.483 4.06801 9 6.10901 9H7.39203C9.43303 9 10.5 10.482 10.5 11.947V12.25C10.5 12.664 10.164 13 9.75 13ZM15.75 16.5H3.75C1.332 16.5 0 15.168 0 12.75V3.75C0 1.332 1.332 0 3.75 0H15.75C18.168 0 19.5 1.332 19.5 3.75V12.75C19.5 15.168 18.168 16.5 15.75 16.5ZM3.75 1.5C2.173 1.5 1.5 2.173 1.5 3.75V12.75C1.5 14.327 2.173 15 3.75 15H15.75C17.327 15 18 14.327 18 12.75V3.75C18 2.173 17.327 1.5 15.75 1.5H3.75ZM16.5 6.18799C16.5 5.77399 16.164 5.43799 15.75 5.43799H11.75C11.336 5.43799 11 5.77399 11 6.18799C11 6.60199 11.336 6.93799 11.75 6.93799H15.75C16.164 6.93799 16.5 6.60199 16.5 6.18799ZM16.45 10.25C16.45 9.836 16.114 9.5 15.7 9.5H12.7C12.286 9.5 11.95 9.836 11.95 10.25C11.95 10.664 12.286 11 12.7 11H15.7C16.114 11 16.45 10.664 16.45 10.25Z" fill="white" />
        </svg>

    );

    const cards = [
        {
            icon: GlobeIcon,
            title: t('admin.systemSettings.cards.languageManagement.title'),
            description: t('admin.systemSettings.cards.languageManagement.description'),
            linkText: t('admin.systemSettings.cards.languageManagement.linkText'),
            onClick: handleLanguageManagement
        },
        {
            icon: MegaphoneIcon,
            title: t('admin.systemSettings.cards.announcements.title'),
            description: t('admin.systemSettings.cards.announcements.description'),
            linkText: t('admin.systemSettings.cards.announcements.linkText'),
            onClick: handleAnnouncements
        },
        {
            icon: MailIcon,
            title: t('admin.systemSettings.cards.emailTemplates.title'),
            description: t('admin.systemSettings.cards.emailTemplates.description'),
            linkText: t('admin.systemSettings.cards.emailTemplates.linkText'),
            onClick: handleEmailTemplates
        },
        {
            icon: ShieldIcon,
            title: t('admin.systemSettings.cards.rolesPermissions.title'),
            description: t('admin.systemSettings.cards.rolesPermissions.description'),
            linkText: t('admin.systemSettings.cards.rolesPermissions.linkText'),
            onClick: handleRolesPermissions
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                            {t('admin.systemSettings.hero.title')}
                        </h1>
                        <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                            {t('admin.systemSettings.hero.subtitle')}
                        </p>
                    </div>
                </header>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 cursor-pointer"
                            onClick={card.onClick}
                        >
                            <div className="flex flex-col items-start gap-4">
                                <div className='flex items-center gap-3'>
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#ED4122] rounded-lg flex items-center justify-center">
                                        <card.icon />
                                    </div>
                                    <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
                                        {card.title}
                                    </h2>
                                </div>
                                <div className="flex-1">
                                    <p className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280] mb-4">
                                        {card.description}
                                    </p>
                                    <button
                                        className="font-roboto text-[14px] leading-[100%] font-normal text-[#ED4122] hover:text-[#DC2626] inline-flex items-center gap-2 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            card.onClick();
                                        }}
                                    >
                                        {card.linkText}
                                        <span className="text-lg">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemSettingPlan;