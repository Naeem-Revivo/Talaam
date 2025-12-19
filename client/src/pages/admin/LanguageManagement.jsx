import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import languagesAPI from "../../api/languages";
import LanguageModal from "../../components/admin/LanguageModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

// Main Component
const LanguageManagement = () => {
    const { t } = useLanguage();
    const [languages, setLanguages] = useState([]);
    const [languagePage, setLanguagePage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [languageToDelete, setLanguageToDelete] = useState(null);
    const [deletingLanguage, setDeletingLanguage] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const pageSize = 10;

    // Fetch languages from API
    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const response = await languagesAPI.getAllLanguages({
                page: languagePage,
                pageSize: pageSize
            });
            
            if (response.success) {
                // Transform API data to match table format
                const transformedLanguages = response.data.languages.map(lang => ({
                    id: lang.id,
                    languagename: lang.name,
                    code: lang.code,
                    default: lang.isDefault,
                    status: lang.status.charAt(0).toUpperCase() + lang.status.slice(1)
                }));
                
                setLanguages(transformedLanguages);
                setTotal(response.data.pagination?.total || transformedLanguages.length);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
            showErrorToast(error.message || 'Failed to fetch languages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, [languagePage]);

    const handleAddNew = () => {
        setEditingLanguage(null);
        setIsModalOpen(true);
    };

    const handleLanguageEdit = (item) => {
        // Find the full language object from API response format
        const fullLanguage = languages.find(l => l.id === item.id);
        if (fullLanguage) {
            // Convert back to API format
            setEditingLanguage({
                id: fullLanguage.id,
                name: fullLanguage.languagename,
                code: fullLanguage.code,
                isDefault: fullLanguage.default,
                status: fullLanguage.status.toLowerCase()
            });
            setIsModalOpen(true);
        }
    };

    const handleLanguageDelete = (item) => {
        setLanguageToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!languageToDelete) return;

        setDeletingLanguage(languageToDelete.id);
        try {
            const response = await languagesAPI.deleteLanguage(languageToDelete.id);
            if (response.success) {
                showSuccessToast(`Language "${languageToDelete.languagename}" deleted successfully`);
                fetchLanguages();
            }
        } catch (error) {
            console.error('Error deleting language:', error);
            showErrorToast(error.message || 'Failed to delete language');
        } finally {
            setDeletingLanguage(null);
            setIsDeleteModalOpen(false);
            setLanguageToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setLanguageToDelete(null);
    };

    const handleSave = async (formData) => {
        try {
            if (editingLanguage) {
                // Update existing language
                const response = await languagesAPI.updateLanguage(editingLanguage.id, formData);
                if (response.success) {
                    showSuccessToast('Language updated successfully');
                    fetchLanguages();
                }
            } else {
                // Create new language
                const response = await languagesAPI.createLanguage(formData);
                if (response.success) {
                    showSuccessToast('Language created successfully');
                    fetchLanguages();
                }
            }
        } catch (error) {
            console.error('Error saving language:', error);
            const errorMessage = error.errors?.[0]?.message || error.message || 'Failed to save language';
            showErrorToast(errorMessage);
            throw error; // Re-throw to prevent modal from closing
        }
    };

    const handleLanguageView = (item) => {
        // Find the full language object
        const fullLanguage = languages.find(l => l.id === item.id);
        if (fullLanguage) {
            setSelectedLanguage({
                id: fullLanguage.id,
                name: fullLanguage.languagename,
                code: fullLanguage.code,
                isDefault: fullLanguage.default,
                status: fullLanguage.status
            });
            setShowViewModal(true);
        }
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
                            onClick={handleAddNew}
                            className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            {t('admin.languageManagement.buttons.addLanguage')}
                        </button>
                    </div>
                </header>

                <DataTable
                    items={languages}
                    columns={[
                       {label: t('admin.languageManagement.table.columns.languageName'), key: "languagename"},
                       {label: t('admin.languageManagement.table.columns.code'), key: "code"},
                       {label: t('admin.languageManagement.table.columns.default'), key: "default"},
                       {label: t('admin.languageManagement.table.columns.status'), key: "status"},
                       {label: t('admin.languageManagement.table.columns.actions'), key: "actions"},
                    ]}
                    page={languagePage}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setLanguagePage}
                    onView={handleLanguageView}
                    onEdit={handleLanguageEdit}
                    onDelete={handleLanguageDelete}
                    emptyMessage={t('admin.languageManagement.table.emptyMessage')}
                    loading={loading}
                />
            </div>

            <LanguageModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingLanguage(null);
                }}
                onSave={handleSave}
                language={editingLanguage}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Language"
                message={`Are you sure you want to delete "${languageToDelete?.languagename}"?`}
                subMessage="This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* View Modal */}
            {showViewModal && selectedLanguage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowViewModal(false)}>
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
                            <h2 className="font-archivo text-[24px] leading-[100%] font-bold text-oxford-blue">
                                Language Details
                            </h2>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-oxford-blue hover:text-[#ED4122] transition"
                                aria-label="Close"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-6 space-y-4">
                            <div>
                                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Language Name</label>
                                <p className="font-roboto text-[16px] text-oxford-blue">{selectedLanguage.name}</p>
                            </div>
                            <div>
                                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Language Code</label>
                                <p className="font-roboto text-[16px] text-oxford-blue uppercase">{selectedLanguage.code}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Default Language</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue">
                                        {selectedLanguage.isDefault ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Status</label>
                                    <span className={`inline-block px-[12px] py-[5px] rounded-md text-[14px] font-normal font-roboto ${
                                        selectedLanguage.status?.toLowerCase() === 'active' ? 'bg-[#FDF0D5] text-[#ED4122]' :
                                        'bg-[#C6D8D3] text-oxford-blue'
                                    }`}>
                                        {selectedLanguage.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-[#E5E7EB] px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2.5 font-roboto text-[16px] leading-[24px] font-medium text-oxford-blue bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageManagement;
