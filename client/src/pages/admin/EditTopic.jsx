import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { fetchTopicById, updateTopic, clearError, clearSuccess } from "../../store/slices/topicsSlice";
import { fetchSubjects } from "../../store/slices/subjectsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

export default function EditTopic() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { topicId } = useParams();
    const { currentTopic, loading, error, success } = useSelector((state) => state.topics);
    const { subjects: subjectsData, loading: subjectsLoading } = useSelector((state) => state.subjects);
    
    const [topicName, setTopicName] = useState("");
    const [parentSubject, setParentSubject] = useState("");
    const [description, setDescription] = useState("");

    // Fetch topic data and subjects on mount
    useEffect(() => {
        if (topicId) {
            dispatch(fetchTopicById(topicId));
        }
        dispatch(fetchSubjects());
    }, [dispatch, topicId]);

    // Populate form when topic data is loaded
    useEffect(() => {
        if (currentTopic) {
            setTopicName(currentTopic.name || "");
            setDescription(currentTopic.description || "");
            // Set parent subject ID (could be from parentSubject.id or subject.id)
            const subjectId = currentTopic.parentSubject?.id || currentTopic.subject?.id || "";
            setParentSubject(subjectId);
        }
    }, [currentTopic]);

    // Handle success
    useEffect(() => {
        if (success) {
            showSuccessToast("Topic updated successfully");
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
        if (!topicId) return;
        if (!parentSubject) {
            showErrorToast("Please select a subject");
            return;
        }
        
        const topicData = {
            parentSubject: parentSubject,
            name: topicName,
            description: description,
        };
        
        dispatch(updateTopic({ topicId, topicData }));
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
                        {t('admin.editTopic.hero.title') || 'Edit Topic'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('admin.editTopic.hero.subtitle') || 'Update topic information'}
                    </p>
                </div>

                <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
                    <h3 className="text-[20px] leading-[100%] font-bold text-blue-dark mb-10">
                        {t('admin.editTopic.hero.title') || 'Edit Topic'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Subject Dropdown */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editTopic.fields.parentSubject') || t('admin.addTopic.fields.parentSubject') || 'Parent Subject'}
                            </label>
                            <select
                                value={parentSubject}
                                onChange={(e) => setParentSubject(e.target.value)}
                                className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark bg-white"
                                required
                                disabled={subjectsLoading}
                            >
                                <option value="">
                                    {subjectsLoading ? t('admin.addTopic.placeholders.loadingSubjects') || 'Loading subjects...' : t('admin.addTopic.placeholders.selectSubject') || 'Select a subject'}
                                </option>
                                {subjectsData.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Topic Name Input */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editTopic.fields.topicName') || t('admin.addTopic.fields.topicName') || 'Topic Name'}
                            </label>
                            <input
                                type="text"
                                placeholder={t('admin.editTopic.placeholders.topicName') || t('admin.addTopic.placeholders.topicName') || 'Enter topic name'}
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-base font-normal text-blue-dark mb-3">
                                {t('admin.editTopic.fields.description') || t('admin.addTopic.fields.description') || 'Description'}
                            </label>
                            <textarea
                                placeholder={t('admin.editTopic.placeholders.description') || t('admin.addTopic.placeholders.description') || 'Enter description'}
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
                                {t('admin.editTopic.buttons.cancel') || t('admin.addTopic.buttons.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={loading || subjectsLoading}
                                className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : (t('admin.editTopic.buttons.updateTopic') || t('admin.addTopic.buttons.create') || 'Update Topic')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

