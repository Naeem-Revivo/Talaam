import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const PracticePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState('study'); // 'test' or 'study'
  const [questionStatus, setQuestionStatus] = useState('new'); 
  const [selectedStatuses, setSelectedStatuses] = useState({
    incorrect: false,
    flagged: false,
    correct: false,
  });
  const [selectedAllQuestions, setSelectedAllQuestions] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState({
    quantitative: true,
    language: false,
    logical: false,
    general: false,
  });
  const [selectedSubtopics, setSelectedSubtopics] = useState({});
  const [sessionSize, setSessionSize] = useState('20');

  const selectedSubtopicCount = Object.values(selectedSubtopics).filter(Boolean).length;
  const parsedSessionSize = Number(sessionSize);
  const isSessionSizeValid =
    Number.isInteger(parsedSessionSize) && parsedSessionSize >= 1 && parsedSessionSize <= 50;
  const canStartTestSession =
    sessionMode === 'test' && selectedSubtopicCount > 0 && isSessionSizeValid;
  const canStartSession = sessionMode === 'study' || canStartTestSession;
  const handleStartSession = () => {
    if (!canStartSession) return;
    const mode = sessionMode === 'test' ? 'test' : 'study';
    navigate(`/dashboard/session?mode=${mode}`);
  };


  const domains = [
  { id: 'quantitative', name: t('dashboard.practice.questionPool.domainsOptions.quantitative') },
    { id: 'language', name: t('dashboard.practice.questionPool.domainsOptions.language') },
    { id: 'logical', name: t('dashboard.practice.questionPool.domainsOptions.logical') },
    { id: 'general', name: t('dashboard.practice.questionPool.domainsOptions.general') },
  ];

  const subtopics = [
    { id: 'algebra', name: t('dashboard.practice.questionPool.subtopicsOptions.algebra'), count: 150 },
    { id: 'geometry', name: t('dashboard.practice.questionPool.subtopicsOptions.geometry'), count: 120 },
    { id: 'arithmetic', name: t('dashboard.practice.questionPool.subtopicsOptions.arithmetic'), count: 180 },
    { id: 'statistics', name: t('dashboard.practice.questionPool.subtopicsOptions.statistics'), count: 90 },
    { id: 'verbal', name: t('dashboard.practice.questionPool.subtopicsOptions.verbal'), count: 200 },
  ];

  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const toggleSubtopic = (subtopicId) => {
    setSelectedSubtopics(prev => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Handle session mode selection - automatically set question status based on mode
  const handleSessionModeChange = (mode) => {
    setSessionMode(mode);
    if (mode === 'study') {
      // Study mode: automatically select 'new' and clear checkboxes
      setQuestionStatus('new');
      setSelectedStatuses({
        incorrect: false,
        flagged: false,
        correct: false,
      });
    } else if (mode === 'test') {
      // Test mode: automatically select 'solved'
      setQuestionStatus('solved');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:px-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Title and Subtitle */}
      <div className="mb-8">
        <h1 className="font-archivo font-bold text-[32px] md:text-[36px] leading-[36px] md:leading-[40px] text-oxford-blue mb-1 md:mb-2">
          {t('dashboard.practice.hero.title')}
        </h1>
        <p className="font-roboto font-normal text-[18px] leading-[28px] tracking-[0%] text-dark-gray">
          {t('dashboard.practice.hero.subtitle')}
        </p>
      </div>

      {/* Session Mode and Question Status Cards - Flexed */}
      <div className="flex flex-col xl:flex-row justify-start gap-2 mb-6">
        {/* Session Mode Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-[266px]">
        <h2 className="font-archivo font-bold text-lg md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.sessionMode.title')}
        </h2>
          <div className="flex flex-row gap-2 md:gap-4 mb-4">
            <button
              onClick={() => handleSessionModeChange('test')}
              className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
                sessionMode === 'test'
                  ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
                  : 'bg-white border border-[#E5E7EB]'
              }`}
            >
              <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
                sessionMode === 'test' ? 'text-white' : 'text-black'
              }`}>
                {t('dashboard.practice.sessionMode.testMode')}
              </p>
              <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
                sessionMode === 'test' ? 'text-white' : 'text-gray-600'
              }`}>
                {t('dashboard.practice.sessionMode.testModeDescription')}
              </p>
            </button>
            <button
              onClick={() => handleSessionModeChange('study')}
              className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
                sessionMode === 'study'
                  ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
                  : 'bg-white border border-[#E5E7EB]'
              }`}
            >
              <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
                sessionMode === 'study' ? 'text-white' : 'text-black'
              }`}>
                {t('dashboard.practice.sessionMode.studyMode')}
              </p>
              <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
                sessionMode === 'study' ? 'text-white' : 'text-gray-600'
              }`}>
                {t('dashboard.practice.sessionMode.studyModeDescription')}
              </p>
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-lg w-full lg:w-[544px] h-auto lg:h-[45px] bg-papaya-whip border border-[#FFE5B0] p-3 mt-6 lg:mt-10">
            <svg className="w-5 h-5 text-oxford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.sessionMode.timeLimitNote')}
            </p>
          </div>
        </div>

        {/* Question Status Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-[266px]">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.questionStatus.title')}
        </h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setQuestionStatus('new')}
            className={`px-4 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] text-center transition-all duration-200 ${
              questionStatus === 'new'
                ? 'bg-cinnebar-red text-white'
                : 'bg-white text-oxford-blue border border-[#E5E7EB]'
            }`}
          >
            {t('dashboard.practice.questionStatus.new')}
          </button>
          <button
            onClick={() => setQuestionStatus('solved')}
            className={`px-4 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] text-center transition-all duration-200 ${
              questionStatus === 'solved'
                ? 'bg-cinnebar-red text-white'
                : 'bg-white text-oxford-blue border border-[#E5E7EB]'
            }`}
          >
            {t('dashboard.practice.questionStatus.solved')}
          </button>
        </div>
        {questionStatus === 'solved' && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStatuses.incorrect}
                onChange={() => handleStatusChange('incorrect')}
                className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
              />
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                {t('dashboard.practice.questionStatus.incorrect')}
              </span>
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
                45
              </span>
            </label>
            {/* <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStatuses.flagged}
                onChange={() => handleStatusChange('flagged')}
                className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
              />
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                {t('dashboard.practice.questionStatus.flagged')}
              </span>
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
                12
              </span>
            </label> */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStatuses.correct}
                onChange={() => handleStatusChange('correct')}
                className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
              />
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                {t('dashboard.practice.questionStatus.correct')}
              </span>
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
                128
              </span>
            </label>
          </div>
        )}
        </div>
      </div>

      {/* Question Pool Section */}
      <div className="mb-6 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.questionPool.title')}
        </h2>
        
        <div className="mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedAllQuestions}
              onChange={() => setSelectedAllQuestions(!selectedAllQuestions)}
              className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
            />
            <span className="font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.questionPool.allQuestions')}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domains */}
          <div>
            <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
              {t('dashboard.practice.questionPool.domains')}
            </h3>
            <div className="space-y-2">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => toggleDomain(domain.id)}
                  className="w-full flex items-center justify-between rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border border-[#E5E7EB]"
                >
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                    {domain.name}
                  </span>
                  <svg
                    className={`w-5 h-5 text-oxford-blue transition-transform ${
                      expandedDomains[domain.id] ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Subtopics */}
          <div>
            <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
              {t('dashboard.practice.questionPool.subtopics')}
            </h3>
            <div className="space-y-2">
              {subtopics.map((subtopic) => (
                <label 
                  key={subtopic.id} 
                  className="w-full flex items-center gap-3 cursor-pointer rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border border-[#E5E7EB]"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubtopics[subtopic.id] || false}
                    onChange={() => toggleSubtopic(subtopic.id)}
                    className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
                  />
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                    {subtopic.name}
                  </span>
                  <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
                    {subtopic.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-4 flex items-center gap-2 rounded-lg w-full bg-papaya-whip border border-[#FFE5B0] p-3">
          <p className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue text-center">
            {t('dashboard.practice.questionPool.noQuestionsMatch')}
          </p>
        </div>
      </div>

      {/* Session Size Section */}
      <div className="mb-8 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.sessionSize.title')}
        </h2>
        <div className="mb-2">
          <label className="block font-archivo font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
            {t('dashboard.practice.sessionSize.numberOfQuestions')}
          </label>
          <input
            type="number"
            value={sessionSize}
            onChange={(e) => setSessionSize(e.target.value)}
            min="1"
            max="50"
            className="w-full max-w-[200px] px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnebar-red focus:border-transparent font-roboto font-medium text-[16px] leading-[24px] text-black placeholder:text-[16px] placeholder:text-black"
          />
        </div>
        <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-gray-500 mb-4">
          {t('dashboard.practice.sessionSize.enterRange')}
        </p>
        <div className="rounded-lg flex items-center gap-2 w-full h-auto lg:h-[47px] bg-papaya-whip border border-cinnebar-red px-4 py-3">
          <svg className="w-5 h-5 text-cinnebar-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-cinnebar-red">
            {t('dashboard.practice.sessionSize.onlyQuestionsAvailable')}
          </p>
        </div>
      </div>

      {/* Begin Session Button */}
      <div className="flex justify-center">
        <button
          // disabled={!canStartSession}
          onClick={handleStartSession}
          className={`font-archivo font-bold text-[20px] leading-[28px] tracking-[0%] text-oxford-blue text-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full lg:w-[1120px] h-[50px] md:h-[60px] ${
            canStartSession ? 'bg-cinnebar-red text-white' : 'bg-ash-gray text-oxford-blue cursor-not-allowed'
          }`}
        >
          {t('dashboard.practice.beginSession')}
        </button>
      </div>
    </div>
  );
};

export default PracticePage;

