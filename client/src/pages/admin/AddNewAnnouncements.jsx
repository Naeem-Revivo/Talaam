import React, { useState, useRef, useEffect } from 'react';


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
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-[#032746] mb-4">
                    {label}
                </label>
            )}

            {/* Dropdown Box */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex h-[60px] cursor-pointer items-center justify-between rounded-[7px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#032746]"
            >
                <span className="font-roboto text-[14px] leading-[20px]">{displayValue}</span>
                <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

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
                                    displayValue === option ? "font-medium text-[#032746] bg-[#F9FAFB]" : "text-[#6B7280]"
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
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetAudience, setTargetAudience] = useState('All users');
    const [type, setType] = useState('Info');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPublished, setIsPublished] = useState(true);

    const targetAudienceOptions = ['All users', 'Administrators', 'Members', 'Guests'];
    const typeOptions = ['Info', 'Warning', 'Alert', 'Success'];


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
                    <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-[#032746]">
                        Add New Announcement
                    </h2>
                </div>
                <div className="space-y-6 px-5 pt-5 pb-6">
                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-[#032746] mb-4">
                            Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter announcement title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[60px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block font-roboto text-[16px] leading-[100%] font-normal text-[#032746] mb-4">
                            Message
                        </label>
                        <textarea
                            placeholder="Type your message here"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-[#E5E7EB] h-[280px] border border-[#03274633] rounded-lg font-roboto text-[14px] leading-[20px] text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Target Audience and Type Row */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Dropdown
                            label="Target Audience"
                            value={targetAudience}
                            options={targetAudienceOptions}
                            onChange={setTargetAudience}
                        />

                        <Dropdown
                            label="Type"
                            value={type}
                            options={typeOptions}
                            onChange={setType}
                        />
                    </div>

                    {/* Start Date and End Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-roboto text-[16px] leading-[100%] font-normal text-[#032746] mb-4">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 [&::-webkit-calendar-picker-indicator]:opacity-0 h-[60px] bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[14px] leading-[20px] text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                                />
                                 <svg
                                    className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label className="block font-roboto text-[16px] leading-[100%] font-normal text-[#032746] mb-4">
                                End Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 h-[60px] [&::-webkit-calendar-picker-indicator]:opacity-0 bg-white border border-[#E5E7EB] rounded-lg font-roboto text-[14px] leading-[20px] text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-[1px] focus:ring-[#032746] focus:border-transparent"
                                />
                                 <svg
                                    className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-roboto text-[16px] leading-[20px] font-normal text-[#032746]">
                                Status: <span className="text-[#6B7280] text-[12px] hidden sm:block">Set the announcement active or Inactive</span>
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
                            <span className="font-roboto text-[16px] leading-[100%] font-normal text-[#032746]">
                                Published
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 font-roboto text-[14px] leading-[20px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 font-roboto text-[14px] leading-[20px] font-medium text-white bg-[#ED4122] rounded-lg hover:bg-[#DC2626] transition-colors"
                    >
                        Save Announcement
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewAnnouncements;