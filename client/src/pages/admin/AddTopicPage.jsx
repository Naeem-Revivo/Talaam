import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { fetchSubjects } from "../../store/slices/subjectsSlice";
import { createTopic, clearError, clearSuccess } from "../../store/slices/topicsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

export default function AddTopicPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjects: subjectsData, loading: subjectsLoading } = useSelector((state) => state.subjects);
    const { loading, error, success } = useSelector((state) => state.topics);
    
    const [topicName, setTopicName] = useState("");
    const [parentSubject, setParentSubject] = useState("");
    const [description, setDescription] = useState("");

    // Fetch subjects on component mount
    useEffect(() => {
        dispatch(fetchSubjects());
    }, [dispatch]);

    // Handle success
    useEffect(() => {
        if (success) {
            showSuccessToast("Topic created successfully");
            dispatch(clearSuccess());
            navigate("/admin/classification?tab=Topics");
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
        if (!parentSubject) {
            showErrorToast("Please select a subject");
            return;
        }
        const topicData = {
            parentSubject: parentSubject,
            name: topicName,
            description: description,
        };
        dispatch(createTopic(topicData));
    };

    const handleCancel = () => {
        navigate("/admin/classification");
    };

    return (
        <div className=" bg-gray-50">
            <div className="flex flex-col justify-center max-w-[1200px] mx-auto p-6">
            <div className="mb-12">
            <h1 className="text-4xl font-bold text-blue-dark">
                {t('admin.addTopic.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                {t('admin.addTopic.hero.subtitle')}
            </p>
            </div>

            <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
                <h3 className="text-[20px] leading-[100%] font-bold text-blue-dark mb-10">
                    {t('admin.addTopic.sections.addNewTopic')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Subject Dropdown */}
                    <div>
                        <label className="block text-base font-normal text-blue-dark mb-3">
                            {t('admin.addTopic.fields.parentSubject')}
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

                     <div>
                        <label className="block text-base font-normal text-blue-dark mb-3">
                            {t('admin.addTopic.fields.topicName')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('admin.addTopic.placeholders.topicName')}
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                            className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-base font-normal text-blue-dark mb-3">
                            {t('admin.addTopic.fields.description')}
                        </label>
                        <textarea
                            placeholder={t('admin.addTopic.placeholders.description')}
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
                            {t('admin.addTopic.buttons.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || subjectsLoading}
                            className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : t('admin.addTopic.buttons.create')}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}
