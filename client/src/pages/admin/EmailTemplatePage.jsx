import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const EmailTemplateForm = ({ title, subjectPlaceholder, bodyPlaceholder, onSave, onPreview, t }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSave = () => {
        onSave({ subject, body });
    };

    const handlePreview = () => {
        onPreview({ subject, body });
    };

    return (
        <div className='border border-[#E5E7EB] sm:border-none bg-white sm:bg-transparent'>
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className='border-b w-full px-5 pt-4 pb-4'>
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
                {title}
            </h2>
            </div>
            
            <div className="space-y-6 px-5 pt-5 pb-12">
                <div>
                    <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                        {t('admin.emailTemplates.fields.subject')}
                    </label>
                    <input
                        type="text"
                        placeholder={subjectPlaceholder}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-[#E5E7EB] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                        {t('admin.emailTemplates.fields.body')}
                    </label>
                    <textarea
                        placeholder={bodyPlaceholder}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-[#E5E7EB] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent resize-none"
                    />
                </div>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:mt-10 p-4 sm:p-0">
                    <button
                        onClick={handlePreview}
                        className="px-6 py-2.5 font-roboto text-[14px] leading-[20px] font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        {t('admin.emailTemplates.buttons.preview')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 font-archivo text-[16px] leading-[16px] font-semibold text-white bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-colors"
                    >
                        {t('admin.emailTemplates.buttons.save')}
                    </button>
                </div>
        </div>
    );
};

const EmailTemplatePage = () => {
    const { t } = useLanguage();
    const handleWelcomeEmailSave = (data) => {
        console.log('Saving Welcome Email:', data);
        // Add your save logic here
    };

    const handleWelcomeEmailPreview = (data) => {
        console.log('Previewing Welcome Email:', data);
        // Add your preview logic here
    };

    const handleResetPasswordSave = (data) => {
        console.log('Saving Reset Password Email:', data);
        // Add your save logic here
    };

    const handleResetPasswordPreview = (data) => {
        console.log('Previewing Reset Password Email:', data);
        // Add your preview logic here
    };

    const handleSubscriptionReminderSave = (data) => {
        console.log('Saving Subscription Reminder Email:', data);
        // Add your save logic here
    };

    const handleSubscriptionReminderPreview = (data) => {
        console.log('Previewing Subscription Reminder Email:', data);
        // Add your preview logic here
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                            {t('admin.emailTemplates.hero.title')}
                        </h1>
                        <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                            {t('admin.emailTemplates.hero.subtitle')}
                        </p>
                    </div>
                </header>

                <div className="space-y-6 sm:space-y-[73px]">
                    <EmailTemplateForm
                        title={t('admin.emailTemplates.forms.welcomeEmail.title')}
                        subjectPlaceholder={t('admin.emailTemplates.forms.welcomeEmail.subjectPlaceholder')}
                        bodyPlaceholder={t('admin.emailTemplates.forms.welcomeEmail.bodyPlaceholder')}
                        onSave={handleWelcomeEmailSave}
                        onPreview={handleWelcomeEmailPreview}
                        t={t}
                    />

                    <EmailTemplateForm
                        title={t('admin.emailTemplates.forms.resetPasswordEmail.title')}
                        subjectPlaceholder={t('admin.emailTemplates.forms.resetPasswordEmail.subjectPlaceholder')}
                        bodyPlaceholder={t('admin.emailTemplates.forms.resetPasswordEmail.bodyPlaceholder')}
                        onSave={handleResetPasswordSave}
                        onPreview={handleResetPasswordPreview}
                        t={t}
                    />

                    <EmailTemplateForm
                        title={t('admin.emailTemplates.forms.subscriptionReminderEmail.title')}
                        subjectPlaceholder={t('admin.emailTemplates.forms.subscriptionReminderEmail.subjectPlaceholder')}
                        bodyPlaceholder={t('admin.emailTemplates.forms.subscriptionReminderEmail.bodyPlaceholder')}
                        onSave={handleSubscriptionReminderSave}
                        onPreview={handleSubscriptionReminderPreview}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailTemplatePage;