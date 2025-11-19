import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import languageData from "../../data/languageData.json";


// Main Component
const LanguageManagement = () => {
    const { t } = useLanguage();
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
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                            {t('admin.languageManagement.hero.title')}
                        </h1>
                        <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                            {t('admin.languageManagement.hero.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            // onClick={handleAddNew}
                            className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            {t('admin.languageManagement.buttons.addLanguage')}
                        </button>
                    </div>
                </header>

                <DataTable
                    items={paginatedLanguages}
                    columns={[
                       {label: t('admin.languageManagement.table.columns.languageName'), key: "languagename"},
                       {label: t('admin.languageManagement.table.columns.code'), key: "code"},
                       {label: t('admin.languageManagement.table.columns.default'), key: "default"},
                       {label: t('admin.languageManagement.table.columns.status'), key: "status"},
                       {label: t('admin.languageManagement.table.columns.actions'), key: "actions"},
                    ]}
                    page={languagePage}
                    pageSize={pageSize}
                    total={languageData.length}
                    onPageChange={setLanguagePage}
                    onView={handleLanguageView}
                    onEdit={handleLanguageEdit}
                    emptyMessage={t('admin.languageManagement.table.emptyMessage')}
                />
            </div>
        </div>
    );
};

export default LanguageManagement