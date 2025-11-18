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
                className="relative flex h-[60px] cursor-pointer shadow-[0px_10px_15px_-3px_#0000001A] items-center justify-between rounded-[7px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-oxford-blue"
            >
                <span className="font-roboto text-[16px] leading-[100%] font-normal text-blue-dark">{displayValue}</span>
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
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F9FAFB] font-roboto text-[14px] leading-[20px] ${
                                    displayValue === option ? "font-medium text-oxford-blue bg-[#F9FAFB]" : "text-dark-gray"
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

const AddNewAnnouncements = () => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetAudience, setTargetAudience] = useState(t('admin.addNewAnnouncements.options.targetAudience.allUsers'));
    const [type, setType] = useState(t('admin.addNewAnnouncements.options.type.info'));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPublished, setIsPublished] = useState(true);

    const targetAudienceOptions = [
        t('admin.addNewAnnouncements.options.targetAudience.allUsers'),
        t('admin.addNewAnnouncements.options.targetAudience.administrators'),
        t('admin.addNewAnnouncements.options.targetAudience.members'),
        t('admin.addNewAnnouncements.options.targetAudience.guests')
    ];
    const typeOptions = [
        t('admin.addNewAnnouncements.options.type.info'),
        t('admin.addNewAnnouncements.options.type.warning'),
        t('admin.addNewAnnouncements.options.type.alert'),
        t('admin.addNewAnnouncements.options.type.success')
    ];


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
                        {t('admin.addNewAnnouncements.hero.title')}
                    </h2>
                </div>
                <div className="space-y-6 px-5 pt-5 pb-6">
                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                            {t('admin.addNewAnnouncements.fields.title')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('admin.addNewAnnouncements.placeholders.title')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[60px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                            {t('admin.addNewAnnouncements.fields.message')}
                        </label>
                        <textarea
                            placeholder={t('admin.addNewAnnouncements.placeholders.message')}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[280px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-dark-gray placeholder:text-dark-gray focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Target Audience and Type Row */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Dropdown
                            label={t('admin.addNewAnnouncements.fields.targetAudience')}
                            value={targetAudience}
                            options={targetAudienceOptions}
                            onChange={setTargetAudience}
                        />

                        <Dropdown
                            label={t('admin.addNewAnnouncements.fields.type')}
                            value={type}
                            options={typeOptions}
                            onChange={setType}
                        />
                    </div>

                    {/* Start Date and End Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-4">
                                {t('admin.addNewAnnouncements.fields.startDate')}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full shadow-[0px_10px_15px_-3px_#0000001A] px-4 py-3 h-[60px] [&::-webkit-calendar-picker-indicator]:opacity-0 bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[16px] placeholder:text-[16px] leading-[100%] text-blue-dark font-normal placeholder:text-blue-dark focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
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
                                {t('admin.addNewAnnouncements.fields.endDate')}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full shadow-[0px_10px_15px_-3px_#0000001A] px-4 py-3 h-[60px] [&::-webkit-calendar-picker-indicator]:opacity-0 bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[16px] placeholder:text-[16px] leading-[100%] text-blue-dark font-normal placeholder:text-blue-dark focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
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
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-roboto text-[16px] leading-[100%] flex items-center gap-1 font-normal text-oxford-blue">
                                {t('admin.addNewAnnouncements.fields.status')} <span className="text-[#6B7280] text-[12px] leading-[100%] mt-1 hidden sm:block">{t('admin.addNewAnnouncements.labels.statusDescription')}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPublished(!isPublished)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isPublished ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isPublished ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                            <span className="font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue">
                                {t('admin.addNewAnnouncements.labels.published')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 font-roboto text-[16px] leading-[24px] font-medium text-blue-dark bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        {t('admin.addNewAnnouncements.buttons.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 font-roboto text-[16px] leading-[100%] font-medium text-white bg-[#ED4122] rounded-lg hover:bg-[#DC2626] transition-colors"
                    >
                        {t('admin.addNewAnnouncements.buttons.saveAnnouncement')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewAnnouncements;