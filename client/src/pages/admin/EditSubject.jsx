import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { fetchSubjectById, updateSubject, clearError, clearSuccess } from "../../store/slices/subjectsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

export default function EditSubject() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectId } = useParams();
    const { currentSubject, loading, error, success } = useSelector((state) => state.subjects);
    
    const [subjectName, setSubjectName] = useState("");
    const [description, setDescription] = useState("");

    // Fetch subject data on mount
    useEffect(() => {
        if (subjectId) {
            dispatch(fetchSubjectById(subjectId));
        }
    }, [dispatch, subjectId]);

    // Populate form when subject data is loaded
    useEffect(() => {
        if (currentSubject) {
            setSubjectName(currentSubject.name || "");
            setDescription(currentSubject.description || "");
        }
    }, [currentSubject]);

    // Handle success
    useEffect(() => {
        if (success) {
            showSuccessToast("Subject updated successfully");
            dispatch(clearSuccess());
            navigate("/admin/classification");
        }
    }, [success, navigate, dispatch]);

    // Handle error
    useEffect(() => {
        if (error) {
            showErrorToast(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subjectId) return;
        
        const subjectData = {
            name: subjectName,
            description: description,
        };
        
        dispatch(updateSubject({ subjectId, subjectData }));
    };

    const handleCancel = () => {
        navigate("/admin/classification");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex flex-col justify-center max-w-[1200px] mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-blue-dark mb-4">
                        {t('admin.editSubject.hero.title') || 'Edit Subject'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('admin.editSubject.hero.subtitle') || 'Update subject information'}
                    </p>
                </div>

                <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-blue-dark mb-10">
                        {t('admin.editSubject.hero.title') || 'Edit Subject'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Subject Name Input */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editSubject.fields.subjectName') || t('admin.addSubject.fields.subjectName') || 'Subject Name'}
                            </label>
                            <input
                                type="text"
                                placeholder={t('admin.editSubject.placeholders.subjectName') || t('admin.addSubject.placeholders.subjectName') || 'Enter subject name'}
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editSubject.fields.description') || t('admin.addSubject.fields.description') || 'Description'}
                            </label>
                            <textarea
                                placeholder={t('admin.editSubject.placeholders.description') || t('admin.addSubject.placeholders.description') || 'Enter description'}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full h-[160px] border border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 sm:w-[120px] py-2 border border-[#E5E7EB] w-full rounded-lg text-base text-blue-dark font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('admin.editSubject.buttons.cancel') || t('admin.addSubject.buttons.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : (t('admin.editSubject.buttons.updateSubject') || t('admin.addSubject.buttons.create') || 'Update Subject')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

