import React, { useState } from "react";
import { LoginHistoryTable } from "../../components/admin/SecurityAndPermissions/LoginHistoryTable";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function SecuritySettingsPage() {
    const [passwordPolicy, setPasswordPolicy] = useState({});
    const [twoFactor, setTwoFactor] = useState(false);
    const [sensitiveOps, setSensitiveOps] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();

    const loginData = [
        {
            id: 1,
            user: 'Admin',
            ipaddress: '192.168.1.1',
            date: '27-16-2023 10:30 AM',
            status: 'Success'
        },
        {
            id: 2,
            user: 'John Dee',
            ipaddress: '203.0.113.25',
            date: '26-19-2023 09:15 AM',
            status: 'Success'
        },
        {
            id: 3,
            user: 'Jane Smith',
            ipaddress: '198.5.1.100.10',
            date: '04-95-2023 08:00 AM',
            status: 'Failure'
        },
        {
            id: 4,
            user: 'Admin',
            ipaddress: '192.168.1.1',
            date: '16-11-2023 07:00 PM',
            status: 'Success'
        }
    ];

    const loginColumns = [
        'User',
        'IP Address',
        'Date',
        'Status'
    ];

    const OpenAuditLogs = () => {
        navigate("/admin/security/audit-logs")
    }

    const handleRoles = () => {
        navigate("/admin/security/roles-permissions")
    }


    return (
        <div className="max-w-[1200px] mx-auto py-10 px-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-[30px]">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                            {t('admin.security.hero.title')}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleRoles}
                            className="h-[36px] px-5 rounded-md border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
                        >
                            + Roles and Permissions
                        </button>
                        <button
                            type="button"
                            onClick={OpenAuditLogs}
                            className="h-[36px] w-[180px] rounded-md bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            Audit Logs
                        </button>
                    </div>
                </header>

            <div className="bg-white border border-[#E5E7EB] rounded-xl pt-8 pb-10 space-y-10">

                {/* Security & Authentication */}
                <section className="px-8 ">
                    <h2 className="text-[20px] leading-[100%] font-semibold text-oxford-blue mb-3">Security & Authentication</h2>
                    <p className="text-[14px] leading-[100%] text-oxford-blue">Manage password rules, two-factor authentication, and sensitive action controls.</p>
                </section>

                {/* Password Policy */}
                <section className="border-t pt-6 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-oxford-blue mb-3">Password Policy</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] text-[16px] font-normal leading-[100%] text-blue-dark">
                        <label className="flex items-center gap-2"><input type="checkbox" /> Minimum 8 characters</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> At least 1 uppercase</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> At least 1 lowercase</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> At least 1 number</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> At least 1 special character</label>
                    </div>

                    <div className="flex items-center justify-between mt-[65px] text-[14px] leading-[100%] text-blue-dark">
                        <span>Force password change every 90 days</span>
                        <button
                            onClick={() => setPasswordPolicy(!passwordPolicy)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${passwordPolicy ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${passwordPolicy ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </section>

                {/* 2FA */}
                <section className="border-t pt-6 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-oxford-blue mb-9">Two Factor Authentication (2FA)</h3>

                    <div className="flex items-center justify-between mb-10">
                        <p className="text-[16px] leading-[100%] font-normal text-oxford-blue">Enable 2FA (Email / Authenticator App)</p>
                        <button
                            onClick={() => setTwoFactor(!twoFactor)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-[16px] leading-[100%] font-normal text-oxford-blue">View or reset trusted devices</p>
                        <button className="text-[14px] leading-[100%] font-normal text-[#ED4122] bg-[#FDF0D5] px-[10px] py-[5px] rounded-md">Manage</button>
                    </div>

                </section>

                {/* Sensitive Operations */}
                <section className="border-t pt-6 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-oxford-blue mb-[30px]">Sensitive Operations Confirmation</h3>
                    <div className="flex items-center justify-between">
                        <p className="max-w-[390px] text-[16px] font-roboto text-wrap leading-[100%] text-blue-dark font-normal">
                            Require Super Admin confirmation for billing, deletions,
                            and role changes.
                        </p>
                        <button
                            onClick={() => setSensitiveOps(!sensitiveOps)}
                            className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${sensitiveOps ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sensitiveOps ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="text-[14px] leading-[400%] text-dark-gray">
                        <span>This prevents unauthorized changes.</span>
                    </div>
                </section>

                {/* Login History */}
                <section className="border-t pt-6 px-8">
                    <div className="flex items-center justify-between mb-[30px]">
                        <h3 className="text-[20px] leading-[100%] font-bold text-oxford-blue ">Login History</h3>
                        <button className="px-3 py-2 rounded-md text-[16px] leading-4 font-bold w-[98px] h-9 border border-[#E5E7EB] flex gap-2 items-center justify-center">
                            <span><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.85 16.25C8.7228 16.25 8.59644 16.2082 8.49004 16.1269L5.29004 13.6654C5.13964 13.5489 5.05 13.3667 5.05 13.1731V9.89103C5.05 9.72692 4.98762 9.57184 4.87402 9.45533L0.777246 5.25348C0.437246 4.90394 0.25 4.44117 0.25 3.94804V2.09615C0.25 1.0779 1.058 0.25 2.05 0.25H12.45C13.442 0.25 14.25 1.0779 14.25 2.09615V3.94804C14.25 4.44117 14.0628 4.90476 13.7228 5.25348L9.62598 9.45533C9.51238 9.57184 9.45 9.7261 9.45 9.89103V15.6346C9.45 15.8676 9.32197 16.081 9.11797 16.1852C9.03317 16.2287 8.9412 16.25 8.85 16.25ZM6.25 12.8654L8.25 14.4038V9.89103C8.25 9.3979 8.43725 8.93431 8.77725 8.58559L12.874 4.38374C12.9876 4.26723 13.05 4.11297 13.05 3.94804V2.09615C13.05 1.75646 12.7804 1.48077 12.45 1.48077H2.05C1.7196 1.48077 1.45 1.75646 1.45 2.09615V3.94804C1.45 4.11214 1.51238 4.26723 1.62598 4.38374L5.72275 8.58559C6.06275 8.93513 6.25 9.3979 6.25 9.89103V12.8654Z" fill="#032746" stroke="#032746" stroke-width="0.5" />
                            </svg>
                            </span>
                            Filter
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <input placeholder="Filter by User" className="border border-[#E5E7EB] px-3 py-2 rounded-md text-[14px] w-[344px] h-[50px]" />
                        <input placeholder="mm/dd/yyyy" className="border border-[#E5E7EB] px-3 py-2 rounded-md text-[14px] w-[202px]" />
                    </div>
                    <LoginHistoryTable
                        items={loginData}
                        columns={loginColumns}
                    />
                </section>

                {/* Save + Cancel */}
                <div className="flex justify-end gap-3 pt-6 px-8">
                    <button className="border border-[#E5E7EB] rounded-md h-9 w-[120px] text-blue-dark">Cancel</button>
                    <button className=" bg-[#ED4122] rounded-md h-9 w-[158px] text-white">Save Changes</button>
                </div>
            </div>
        </div>
    );
}