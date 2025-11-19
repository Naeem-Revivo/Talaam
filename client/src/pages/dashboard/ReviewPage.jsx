import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ReviewPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalItems = 25;

  // Sample session data matching the image
  const sessions = [
    { id: 'S001', date: 'Des 15,2024', mode: 'Test', questions: 25, correct: 84, avgTime: '45s' },
    { id: 'S002', date: 'Des 14,2024', mode: 'Study', questions: 30, correct: 68, avgTime: '25s' },
    { id: 'S003', date: 'Des 13,2024', mode: 'Test', questions: 20, correct: 92, avgTime: '60s' },
    { id: 'S004', date: 'Des 12,2024', mode: 'Study', questions: 15, correct: 52, avgTime: '50s' },
    { id: 'S005', date: 'Des 11,2024', mode: 'Test', questions: 35, correct: 78, avgTime: '15s' },
  ];

  // Filter sessions based on active filter
  const filteredSessions = activeFilter === 'all' 
    ? sessions 
    : sessions.filter(s => s.mode.toLowerCase() === activeFilter.toLowerCase());

  // Handle filter change and reset page
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  const getCorrectColor = (percentage) => {
    return percentage >= 80 ? 'text-[#EF4444]' : 'text-oxford-blue';
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className=' p-4 md:p-6 lg:p-8 2xl:px-6 max-w-[1200px] mx-auto'>
      {/* Page Title and Subtitle */}
      <div className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="font-archivo font-bold text-[32px] md:text-[36px] leading-[36px] md:leading-[40px] text-oxford-blue mb-2">
          {t('dashboard.review.hero.title')}
        </h1>
        <p className="font-roboto font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-dark-gray">
          {t('dashboard.review.hero.subtitle')}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 md:mb-6 lg:mb-8 pt-2 md:pt-4">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
            activeFilter === 'all'
              ? 'bg-[#EF4444] text-white'
              : 'bg-white border border-[#E5E7EB] text-blue-dark'
          }`}
        >
          {t('dashboard.review.filters.all')}
        </button>
        <button
          onClick={() => handleFilterChange('test')}
          className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
            activeFilter === 'test'
              ? 'bg-[#EF4444] text-white'
              : 'bg-white border border-[#E5E7EB] text-blue-dark'
          }`}
        >
          {t('dashboard.review.filters.testMode')}
        </button>
        <button
          onClick={() => handleFilterChange('study')}
          className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
            activeFilter === 'study'
              ? 'bg-[#EF4444] text-white'
              : 'bg-white border border-[#E5E7EB] text-blue-dark'
          }`}
        >
          {t('dashboard.review.filters.studyMode')}
        </button>
      </div>

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden space-y-4 mb-4 ">
        {currentSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white  rounded-lg border border-[#E5E7EB] shadow-dashboard p-7 h-[143px] flex flex-col justify-between"
          >
            {/* Top Row: Session ID, Mode, Date */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%]">
                {session.id}
              </div>
              <div className="flex-1 flex justify-center">
                <span
                  className={`px-[10px] py-[5px] rounded-[6px] text-[14px] font-normal font-roboto whitespace-nowrap leading-[100%] tracking-[0%] text-center ${
                    session.mode === 'Test'
                      ? 'bg-[#FEEBC8] text-[#ED4122]'
                      : 'bg-[#C6D8D3] text-oxford-blue'
                  }`}
                >
                  {session.mode}
                </span>
              </div>
              <div className="text-[14px] font-normal text-oxford-blue font-archivo leading-[100%] tracking-[0%]">
                {session.date}
              </div>
            </div>

            {/* Middle Row: Questions, Correct, Avg Time */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-[14px] font-normal font-roboto leading-[100%] tracking-[0%]">
              <div className="text-oxford-blue">
                {t('dashboard.review.table.mobile.questions')} {session.questions}
              </div>
              <div className={`${getCorrectColor(session.correct)}`}>
                {t('dashboard.review.table.mobile.correct')} {session.correct}%
              </div>
              <div className="text-oxford-blue">
                {t('dashboard.review.table.mobile.avgTime')} {session.avgTime}
              </div>
            </div>

            {/* Bottom Row: Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/dashboard/review-all?sessionId=${session.id}`)}
              >
                {t('dashboard.review.table.actions.reviewAll')}
              </button>
              <button
                className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#C6D8D3] text-oxford-blue rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${session.id}`)}
              >
                {t('dashboard.review.table.actions.reviewIncorrect')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block bg-white rounded-lg overflow-hidden border border-[#E5E7EB] shadow-dashboard w-full max-w-[1120px]">
        {/* Table Header */}
        <div className="bg-oxford-blue text-white w-full">
          <div className="grid grid-cols-[repeat(6,1fr)_2fr] gap-4 px-4 md:px-6 py-3 md:py-4 items-center">
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.number')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.date')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.mode')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.questions')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.correct')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.avgTime')}</div>
            <div className="text-[16px] font-medium font-archivo text-white leading-[16px] tracking-[0%] flex items-center justify-center">{t('dashboard.review.table.columns.actions')}</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="bg-white w-full">
          {currentSessions.map((session, index) => (
            <div
              key={session.id}
              className={`grid grid-cols-[repeat(6,1fr)_2fr] gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-[#E5E7EB] last:border-b-0 items-center ${
                index % 2 === 0 ? 'bg-white' : 'bg-white'
              }`}
            >
              {/* Session ID */}
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%] flex items-center justify-center">
                {session.id}
              </div>

              {/* Date */}
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%] flex items-center justify-center">
                {session.date}
              </div>

              {/* Mode Badge */}
              <div className="flex items-center justify-center">
                <span
                  className={`px-[10px] py-[5px] rounded-[6px] text-[14px] font-normal font-roboto whitespace-nowrap leading-[100%] tracking-[0%] text-center ${
                    session.mode === 'Test'
                      ? 'bg-[#FEEBC8] text-[#ED4122]'
                      : 'bg-[#C6D8D3] text-oxford-blue'
                  }`}
                >
                  {session.mode}
                </span>
              </div>

              {/* Number of Questions */}
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%] flex items-center justify-center">
                {session.questions}
              </div>

              {/* Percentage Correct */}
              <div className={`text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] flex items-center justify-center ${getCorrectColor(session.correct)}`}>
                {session.correct}%
              </div>

              {/* Average Time */}
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%] flex items-center justify-center">
                {session.avgTime}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-[10px] flex-wrap justify-center">
                <button
                  className="px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
                  onClick={() => navigate(`/dashboard/review-all?sessionId=${session.id}`)}
                >
                  {t('dashboard.review.table.actions.reviewAll')}
                </button>
                <button
                  className="px-[10px] py-[5px] bg-[#C6D8D3] text-oxford-blue rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
                  onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${session.id}`)}
                >
                  {t('dashboard.review.table.actions.reviewIncorrect')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More Button (Mobile/Tablet) */}
      {currentPage < totalPages && (
        <div className="lg:hidden mb-4">
          <button
            onClick={handleLoadMore}
            className="w-full px-4 py-3 bg-[#EF4444] text-white rounded-lg text-[16px] font-normal font-roboto leading-[24px] tracking-[0%] text-center hover:opacity-90 transition-opacity"
          >
            {t('dashboard.review.pagination.loadMore')}
          </button>
        </div>
      )}

      {/* Pagination (Desktop) */}
      <div className="hidden lg:flex bg-oxford-blue text-white rounded-lg px-4 md:px-6  items-center justify-between gap-4 w-full max-w-[1120px] min-h-[46.8px]">
        <div className="text-[12px] font-medium font-roboto text-white leading-[18px] tracking-[3%] whitespace-nowrap">
          {t('dashboard.review.pagination.showing').replace('{{from}}', (startIndex + 1).toString()).replace('{{to}}', Math.min(endIndex, totalItems).toString()).replace('{{total}}', totalItems.toString())}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
              currentPage === 1
                ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
            }`}
          >
            {t('dashboard.review.pagination.previous')}
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[32px] h-[32px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                currentPage === page
                  ? 'bg-[#EF4444] text-white border-[#EF4444]'
                  : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
              currentPage === totalPages
                ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
            }`}
          >
            {t('dashboard.review.pagination.next')}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ReviewPage;
