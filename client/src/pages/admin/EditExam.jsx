import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { fetchExamById, updateExam, clearError, clearSuccess } from "../../store/slices/examsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

export default function EditExam() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { examId } = useParams();
    const { currentExam, loading, error, success } = useSelector((state) => state.exams);
    
    const [examName, setExamName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");

    // Fetch exam data on mount
    useEffect(() => {
        if (examId) {
            dispatch(fetchExamById(examId));
        }
    }, [dispatch, examId]);

    // Populate form when exam data is loaded
    useEffect(() => {
        if (currentExam) {
            setExamName(currentExam.name || "");
            setDescription(currentExam.description || "");
            setStatus(currentExam.status || "active");
        }
    }, [currentExam]);

    // Handle success
    useEffect(() => {
        if (success) {
            showSuccessToast("Exam updated successfully");
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
        if (!examId) return;
        
        const examData = {
            name: examName,
            description: description,
            status: status,
        };
        
        dispatch(updateExam({ examId, examData }));
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
                        {t('admin.editExam.hero.title') || 'Edit Exam'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('admin.editExam.hero.subtitle') || 'Update exam information'}
                    </p>
                </div>

                <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-blue-dark mb-10">
                        {t('admin.editExam.hero.title') || 'Edit Exam'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Exam Name Input */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editExam.fields.examName') || t('admin.addExam.fields.examName') || 'Exam Name'}
                            </label>
                            <input
                                type="text"
                                placeholder={t('admin.editExam.placeholders.examName') || t('admin.addExam.placeholders.examName') || 'Enter exam name'}
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editExam.fields.description') || t('admin.addExam.fields.description') || 'Description'}
                            </label>
                            <textarea
                                placeholder={t('admin.editExam.placeholders.description') || t('admin.addExam.placeholders.description') || 'Enter description'}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full h-[160px] border border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                            ></textarea>
                        </div>

                        {/* Status Toggle */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editExam.fields.status') || 'Status'}
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStatus("active")}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                        status === "active"
                                            ? "bg-[#ED4122] text-white border-[#ED4122]"
                                            : "bg-white text-oxford-blue border-[#E5E7EB] hover:border-[#ED4122]"
                                    }`}
                                >
                                    {t('admin.editExam.status.active') || 'Active'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus("inactive")}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                        status === "inactive"
                                            ? "bg-[#ED4122] text-white border-[#ED4122]"
                                            : "bg-white text-oxford-blue border-[#E5E7EB] hover:border-[#ED4122]"
                                    }`}
                                >
                                    {t('admin.editExam.status.suspend') || 'Suspend'}
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 sm:w-[120px] py-2 border border-[#E5E7EB] w-full rounded-lg text-base text-blue-dark font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('admin.editExam.buttons.cancel') || t('admin.addExam.buttons.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : (t('admin.editExam.buttons.updateExam') || t('admin.addExam.buttons.saveExam') || 'Update Exam')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

