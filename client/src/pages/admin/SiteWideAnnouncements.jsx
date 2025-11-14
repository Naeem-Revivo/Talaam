import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState } from "react";

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


    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
                            Language Management
                        </h1>
                        <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
                            Manage available languages,set default and update translations.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            // onClick={handleAddNew}
                            className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            Add Language
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
                    onEdit={handleNotificationEdit}
                    emptyMessage="No notifications found"
                />
            </div>
        </div>
    );
};

export default SiteWideAnnouncements