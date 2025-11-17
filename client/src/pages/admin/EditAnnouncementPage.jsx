import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { dropdownArrow } from '../../assets/svg';


const Dropdown = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Automatically show default if value is empty
    const displayValue = value && value.trim() !== "" ? value : (placeholder || options[0]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full" ref={dropdownRef}>
            {label && (
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                    {label}
                </label>
            )}

            {/* Dropdown Box */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex h-[60px] cursor-pointer items-center justify-between rounded-[7px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-oxford-blue"
            >
                <span className="font-roboto text-[14px] leading-[20px]">{displayValue}</span>
                <img 
                    src={dropdownArrow} 
                    alt=""
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />

                {/* Dropdown Menu */}
                {isOpen && (
                    <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-[7px] border border-[#E5E7EB] bg-white shadow-lg max-h-[200px] overflow-y-auto">
                        {options.map((option) => (
                            <li
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F9FAFB] font-roboto text-[14px] leading-[20px] ${displayValue === option ? "font-medium text-oxford-blue bg-[#F9FAFB]" : "text-dark-gray"
                                    }`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const EditAnnouncementPage = () => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetAudience, setTargetAudience] = useState(t('admin.editAnnouncement.options.targetAudience.allUsers'));
    const [type, setType] = useState(t('admin.editAnnouncement.options.type.info'));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);


    const targetAudienceOptions = [
        t('admin.editAnnouncement.options.targetAudience.allUsers'),
        t('admin.editAnnouncement.options.targetAudience.administrators'),
        t('admin.editAnnouncement.options.targetAudience.members'),
        t('admin.editAnnouncement.options.targetAudience.guests')
    ];
    const typeOptions = [
        t('admin.editAnnouncement.options.type.info'),
        t('admin.editAnnouncement.options.type.warning'),
        t('admin.editAnnouncement.options.type.alert'),
        t('admin.editAnnouncement.options.type.success')
    ];

    const handleFileUpload = (uploadedFile) => {
        if (!uploadedFile) return;

        const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(uploadedFile.type)) {
            alert("Only PNG, JPG, or PDF files are allowed.");
            return;
        }

        if (uploadedFile.size > maxSize) {
            alert("File size must be less than 5MB.");
            return;
        }

        setFile(uploadedFile);
    };



    const handleSave = () => {
        console.log('Saving announcement:', {
            title,
            body,
            targetAudience,
            type,
            startDate,
            endDate,
            isPublished
        });
    };

    const handleCancel = () => {
        console.log('Cancelling');
    };

    return (
        <div className='max-w-[1200px] mx-auto py-10 px-12'>
            <div className="bg-white rounded-lg border border-[#E5E7EB]">
                <div className='border-b w-full px-5 pt-4 pb-4'>
                    <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
                        {t('admin.editAnnouncement.hero.title')}
                    </h2>
                </div>
                <div className="space-y-6 px-5 pt-5 pb-6">
                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                            {t('admin.editAnnouncement.fields.title')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('admin.editAnnouncement.placeholders.title')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[60px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                            {t('admin.editAnnouncement.fields.message')}
                        </label>
                        <textarea
                            placeholder={t('admin.editAnnouncement.placeholders.message')}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[280px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Target Audience and Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Dropdown
                            label={t('admin.editAnnouncement.fields.targetAudience')}
                            value={targetAudience}
                            options={targetAudienceOptions}
                            onChange={setTargetAudience}
                        />

                        <Dropdown
                            label={t('admin.editAnnouncement.fields.type')}
                            value={type}
                            options={typeOptions}
                            onChange={setType}
                        />
                    </div>

                    {/* Start Date and End Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                                {t('admin.editAnnouncement.fields.startDate')}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 [&::-webkit-calendar-picker-indicator]:opacity-0 h-[60px] bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                                />
                                <img 
                                    src={dropdownArrow} 
                                    alt=""
                                    className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                                {t('admin.editAnnouncement.fields.endDate')}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 h-[60px] [&::-webkit-calendar-picker-indicator]:opacity-0 bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                                />
                                <img 
                                    src={dropdownArrow} 
                                    alt=""
                                    className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-5">
                        <div>
                            <span className="font-roboto text-[16px] leading-[20px] font-normal text-oxford-blue">
                                {t('admin.editAnnouncement.fields.status')} <span className="text-dark-gray text-[12px] ">{t('admin.editAnnouncement.labels.statusDescription')}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPublished(!isPublished)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublished ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className="font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue">
                                {t('admin.editAnnouncement.labels.published')}
                            </span>
                        </div>
                    </div>

                    {/* Upload Box */}
                    <div
                        className="w-full border-2 border-dashed border-[#D1D5DB] rounded-md py-10 px-4 flex flex-col items-center justify-center gap-4 cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFileUpload(e.dataTransfer.files[0]);
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.pdf"
                        />

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-md bg-[#C6D8D3] flex items-center justify-center">
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.9393 12.0458C19.9393 12.0427 19.9413 12.0397 19.9413 12.0366C19.9413 12.0274 19.9363 12.0202 19.9363 12.011C19.924 11.9382 19.9097 11.8655 19.8922 11.7928C19.884 11.7682 19.8799 11.7436 19.8697 11.7201C19.8205 11.5285 19.7711 11.3379 19.6922 11.1536L17.6624 6.42497C17.1486 5.22746 16.6634 4.09652 14.127 4.09652C13.7024 4.09652 13.3578 4.44072 13.3578 4.86482C13.3578 5.28891 13.7024 5.63311 14.127 5.63311C15.6491 5.63311 15.7877 5.95683 16.2482 7.03039L18.0666 11.2673H15.1762C13.8942 11.2673 12.7056 11.9894 11.9949 13.2003C11.5836 13.903 10.8194 14.3404 10.002 14.3404C9.18452 14.3404 8.4203 13.903 8.00902 13.1993C7.29928 11.9895 6.10974 11.2673 4.8277 11.2673H1.93734L3.75574 7.03039C4.21625 5.95683 4.35483 5.63311 5.87687 5.63311C6.30149 5.63311 6.6461 5.28891 6.6461 4.86482C6.6461 4.44072 6.30149 4.09652 5.87687 4.09652C3.33945 4.09652 2.85533 5.22746 2.34148 6.42497L0.311747 11.1525C0.232773 11.3369 0.182443 11.5285 0.133212 11.7211C0.123982 11.7415 0.120885 11.7641 0.11268 11.7856C0.0952439 11.8604 0.0799395 11.9352 0.0666062 12.011C0.0666062 12.0192 0.0615982 12.0263 0.0615982 12.0345C0.0615982 12.0376 0.0625998 12.0397 0.0625998 12.0427C0.0287539 12.2476 0 12.4545 0 12.6656V17.1585C0 19.6355 1.36615 21 3.84613 21H16.1538C18.6337 21 19.9999 19.6355 19.9999 17.1585V12.6676C20.0019 12.4566 19.9731 12.2507 19.9393 12.0458ZM16.1558 19.4634H3.84814C2.23071 19.4634 1.54046 18.774 1.54046 17.1585V12.8049H4.8277C5.55795 12.8049 6.25014 13.2433 6.6809 13.9768C7.36706 15.1497 8.63991 15.878 10.002 15.878C11.364 15.878 12.6368 15.1497 13.323 13.9778C13.7538 13.2433 14.446 12.8049 15.1762 12.8049H18.4634V17.1585C18.4634 18.774 17.7732 19.4634 16.1558 19.4634ZM7.40706 3.35999C7.10655 3.05985 7.10655 2.57326 7.40706 2.27311L9.45833 0.224329C9.5291 0.153646 9.61438 0.0973171 9.70873 0.0583903C9.89643 -0.0194634 10.1087 -0.0194634 10.2964 0.0583903C10.3908 0.0973171 10.4758 0.153646 10.5466 0.224329L12.5978 2.27311C12.8984 2.57326 12.8984 3.05985 12.5978 3.35999C12.4481 3.50955 12.2511 3.58536 12.0542 3.58536C11.8573 3.58536 11.6604 3.51058 11.5106 3.35999L10.7722 2.62243V8.96341C10.7722 9.38751 10.4276 9.7317 10.003 9.7317C9.57834 9.7317 9.23373 9.38751 9.23373 8.96341V2.62346L8.4953 3.36102C8.19376 3.66015 7.70757 3.66014 7.40706 3.35999Z" fill="white" />
                            </svg>

                        </div>

                        {/* Text */}
                        {!file ? (
                            <div className="text-center">
                                <p className="font-roboto text-[18px] leading-[20px] font-medium text-oxford-blue mb-4">
                                    {t('admin.editAnnouncement.upload.clickToUpload')}
                                </p>
                                <p className="font-roboto text-[16px] leading-[20px] font-normal text-dark-gray mb-2">
                                    {t('admin.editAnnouncement.upload.dragAndDrop')}
                                </p>
                                <p className="font-roboto text-[16px] leading-[20px] font-normal text-dark-gray">
                                    {t('admin.editAnnouncement.upload.fileTypes')}
                                </p>
                            </div>
                        ) : (
                            <p className="font-roboto text-[14px] leading-[20px] text-oxford-blue">
                                {t('admin.editAnnouncement.upload.uploaded')} <span className="font-medium">{file.name}</span>
                            </p>
                        )}
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 font-roboto text-[14px] leading-[20px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        {t('admin.editAnnouncement.buttons.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 font-roboto text-[14px] leading-[20px] font-medium text-white bg-[#ED4122] rounded-lg hover:bg-[#DC2626] transition-colors"
                    >
                        {t('admin.editAnnouncement.buttons.saveAnnouncement')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAnnouncementPage;