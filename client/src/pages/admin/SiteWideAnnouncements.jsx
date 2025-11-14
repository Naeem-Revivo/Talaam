import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const notificationData = [
    {
        id: 1,
        title: 'Important Update',
        message: "We've upload our privacy policy please review the ch...",
        schedule: 'Oct 26, 2023 - Nov 26, 2023',
        status: 'Scheduled',
    },
    {
        id: 2,
        title: 'System Maintenance',
        message: 'The platform will be down for maintenance on Nov 15,2024...',
        schedule: 'Nov 15, 2023 - Nov 15, 2023',
        status: 'Active',
    },
    {
        id: 3,
        title: 'Welcome to LearnHub',
        message: 'Welcome to our new learning platform! Explore courses...',
        schedule: 'Oct 1, 2023 - Oct 31, 2023',
        status: 'Expired',
    },
];


// Main Component
const SiteWideAnnouncements = () => {
    const [notificationPage, setNotificationPage] = useState(1);
    const pageSize = 4;
    const navigate = useNavigate();

    // Pagination for notifications
    const notificationStart = (notificationPage - 1) * pageSize;
    const notificationEnd = notificationStart + pageSize;
    const paginatedNotifications = notificationData.slice(notificationStart, notificationEnd);

    const handleNotificationView = (item) => {
        console.log('View notification:', item);
        alert(`Viewing: ${item.title}`);
    };

    const handleNotificationEdit = (item) => {
        console.log('Edit notification:', item);
        alert(`Editing: ${item.title}`);
    };

    const handleAddNew = () => {
        navigate("/admin/settings/add-announcements")
    };

    const handleEdit = () => {
        navigate("/admin/settings/edit-announcements")
    };


    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
                <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center w-full">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
                            Site-wide Announcements
                        </h1>
                    </div>
                    <div className="flex flex-wrap lg:justify-end gap-3">
                        <button
                            type="button"
                            // onClick={handleExport}
                            className="h-[36px] px-5 rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-[#032746] transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.6301 4.17854C12.6875 2.61796 10.5717 0 7 0C3.42834 0 1.31254 2.61796 0.36991 4.17854C-0.123303 4.99325 -0.123303 6.00604 0.36991 6.82146C1.31254 8.38204 3.42834 11 7 11C10.5717 11 12.6875 8.38204 13.6301 6.82146C14.1233 6.00604 14.1233 4.99396 13.6301 4.17854ZM12.706 6.275C11.8804 7.64184 10.0404 9.93548 7 9.93548C3.9596 9.93548 2.11957 7.64255 1.29395 6.275C1.00535 5.79667 1.00535 5.20263 1.29395 4.72431C2.11957 3.35747 3.9596 1.06382 7 1.06382C10.0404 1.06382 11.8804 3.35676 12.706 4.72431C12.9954 5.20334 12.9954 5.79667 12.706 6.275ZM7 2.48387C5.31719 2.48387 3.94883 3.83723 3.94883 5.5C3.94883 7.16277 5.31719 8.51613 7 8.51613C8.68281 8.51613 10.0512 7.16277 10.0512 5.5C10.0512 3.83723 8.68281 2.48387 7 2.48387ZM7 7.45161C5.91091 7.45161 5.02571 6.57658 5.02571 5.5C5.02571 4.42342 5.91091 3.54839 7 3.54839C8.08909 3.54839 8.97429 4.42342 8.97429 5.5C8.97429 6.57658 8.08909 7.45161 7 7.45161Z" fill="#25314C" />
                            </svg>
                            Preview Announcements
                        </button>
                        <button
                            type="button"
                            onClick={handleAddNew}
                            className="h-[36px] px-5 rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            + Add New Announcements
                        </button>
                    </div>
                </header>

                <DataTable
                    items={paginatedNotifications}
                    columns={['Title', 'Message', 'Schedule', 'Status', 'Actions']}
                    page={notificationPage}
                    pageSize={pageSize}
                    total={notificationData.length}
                    onPageChange={setNotificationPage}
                    onView={handleNotificationView}
                    onEdit={handleEdit}
                    emptyMessage="No notifications found"
                />
            </div>
        </div>
    );
};

export default SiteWideAnnouncements