import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { createExam, clearError, clearSuccess } from "../../store/slices/examsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

export default function AddNewExam() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.exams);
    
    const [examName, setExamName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");

    // Handle success
    useEffect(() => {
        if (success) {
            showSuccessToast("Exam created successfully");
            dispatch(clearSuccess());
            navigate("/admin/classification?tab=Exams");
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
        const examData = {
            name: examName,
            description: description,
            status: status,
        };
        
        dispatch(createExam(examData));
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
                        {t('admin.addExam.hero.title')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('admin.addExam.hero.subtitle')}
                    </p>
                </div>

                <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-blue-dark mb-10">
                        {t('admin.addExam.hero.title')}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Exam Name Input */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.addExam.fields.examName')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('admin.addExam.placeholders.examName')}
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.addExam.fields.description')}
                            </label>
                            <textarea
                                placeholder={t('admin.addExam.placeholders.description')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full h-[160px] border border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                            ></textarea>
                        </div>

                        {/* Status Toggle */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.addExam.fields.status') || 'Status'}
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
                                    {t('admin.addExam.status.active') || 'Active'}
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
                                    {t('admin.addExam.status.suspend') || 'Suspend'}
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
                                {t('admin.addExam.buttons.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : t('admin.addExam.buttons.saveExam')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}