import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState } from "react";

const languageData = [
    { id: 1, languagename: 'English', code: 'EN', default: true, status: 'Inactive' },
    { id: 2, languagename: 'Arabic', code: 'AR', default: false, status: 'Active' },
    { id: 3, languagename: 'Spanish', code: 'ES', default: false, status: 'Inactive' },
    { id: 4, languagename: 'French', code: 'FR', default: true, status: 'Active' },
    { id: 5, languagename: 'German', code: 'DE', default: false, status: 'Active' },
    { id: 6, languagename: 'Italian', code: 'IT', default: true, status: 'Inactive' },
    { id: 7, languagename: 'Portuguese', code: 'PT', default: false, status: 'Active' },
    { id: 8, languagename: 'Russian', code: 'RU', default: false, status: 'Inactive' },
    { id: 9, languagename: 'Chinese', code: 'ZH', default: false, status: 'Active' },
    { id: 10, languagename: 'Japanese', code: 'JA', default: false, status: 'Inactive' },
];


// Main Component
const LanguageManagement = () => {
    const [languagePage, setLanguagePage] = useState(1);
    const pageSize = 4;

    // Pagination for languages
    const languageStart = (languagePage - 1) * pageSize;
    const languageEnd = languageStart + pageSize;
    const paginatedLanguages = languageData.slice(languageStart, languageEnd);

    const handleLanguageView = (item) => {
        console.log('View language:', item);
        alert(`Viewing: ${item.languagename}`);
    };

    const handleLanguageEdit = (item) => {
        console.log('Edit language:', item);
        alert(`Editing: ${item.languagename}`);
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
                    items={paginatedLanguages}
                    columns={['Language Name', 'Code', 'Default', 'Status', 'Actions']}
                    page={languagePage}
                    pageSize={pageSize}
                    total={languageData.length}
                    onPageChange={setLanguagePage}
                    onView={handleLanguageView}
                    onEdit={handleLanguageEdit}
                    emptyMessage="No languages found"
                />
            </div>
        </div>
    );
};

export default LanguageManagement