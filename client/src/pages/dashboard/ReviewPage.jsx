import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';

const ReviewPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [loadingMarked, setLoadingMarked] = useState(true);
  const [markedQuestionsPage, setMarkedQuestionsPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    page: 1,
    limit: 3,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [markedQuestionsPagination, setMarkedQuestionsPagination] = useState({
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const itemsPerPage = 3;
  const markedQuestionsPerPage = 10;
  const hasMountedRef = useRef(false);
  const previousPathnameRef = useRef('');
  const isNavigatingRef = useRef(false);

  // Fetch sessions from API
  const fetchSessions = useCallback(async () => {
      try {
        setLoading(true);
        const response = await studentQuestionsAPI.getSessionHistory({
          mode: activeFilter,
          page: currentPage,
          limit: itemsPerPage,
        });

        if (response.success && response.data) {
          const formattedSessions = response.data.sessions.map((session) => {
            // Format date
            const date = new Date(session.attemptDate);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            // Format average time
            const avgTimeSeconds = session.averageTimeSeconds || 0;
            const avgTime = avgTimeSeconds > 0 
              ? `${Math.floor(avgTimeSeconds)}s` 
              : 'N/A';

            return {
              id: session.id,
              sessionCode: session.sessionCode || `S${session.id.slice(0, 8)}`,
              date: formattedDate,
              mode: session.mode === 'test' ? 'Test' : 'Study',
              questions: session.totalQuestions || 0,
              correct: Math.round(session.percentCorrect || 0),
              avgTime,
              status: session.status || 'completed', // Include status
            };
          });

          setSessions(formattedSessions);
          // Use pagination data from backend
          if (response.data.pagination) {
            setPagination({
              totalItems: response.data.pagination.totalItems || 0,
              page: response.data.pagination.page || currentPage,
              limit: response.data.pagination.limit || itemsPerPage,
              totalPages: response.data.pagination.totalPages || 0,
              hasNextPage: response.data.pagination.hasNextPage || false,
              hasPreviousPage: response.data.pagination.hasPreviousPage || false,
            });
          } else {
            // Fallback if pagination data is missing
            const totalItems = response.data.sessions?.length || 0;
            setPagination({
              totalItems,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: Math.ceil(totalItems / itemsPerPage),
              hasNextPage: false,
              hasPreviousPage: currentPage > 1,
            });
          }
        } else {
          console.error('Invalid response:', response);
          setSessions([]);
          setPagination({
            totalItems: 0,
            page: 1,
            limit: itemsPerPage,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          });
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        showErrorToast(error.message || 'Failed to load sessions');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }, [activeFilter, currentPage, itemsPerPage]);

  // Fetch marked questions with pagination
  const fetchMarkedQuestions = useCallback(async () => {
    try {
      setLoadingMarked(true);
      const response = await studentQuestionsAPI.getStudentMarkedQuestions({
        page: markedQuestionsPage,
        limit: markedQuestionsPerPage,
      });

      if (response.success && response.data) {
        const formattedQuestions = response.data.questions.map((question) => {
          // Format date
          const date = new Date(question.markedAt);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return {
            id: question.id,
            shortId: question.shortId || question.id.slice(0, 8),
            questionText: question.questionText || '',
            exam: question.exam?.name || 'N/A',
            subject: question.subject?.name || 'N/A',
            topic: question.topic?.name || 'N/A',
            markedDate: formattedDate,
          };
        });

        setMarkedQuestions(formattedQuestions);
        
        // Update pagination state
        if (response.data.pagination) {
          setMarkedQuestionsPagination({
            totalItems: response.data.pagination.totalItems || 0,
            page: response.data.pagination.page || markedQuestionsPage,
            limit: response.data.pagination.limit || markedQuestionsPerPage,
            totalPages: response.data.pagination.totalPages || 0,
            hasNextPage: response.data.pagination.hasNextPage || false,
            hasPreviousPage: response.data.pagination.hasPreviousPage || false,
          });
        }
      } else {
        setMarkedQuestions([]);
        setMarkedQuestionsPagination({
          totalItems: 0,
          page: 1,
          limit: markedQuestionsPerPage,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    } catch (error) {
      console.error('Error fetching marked questions:', error);
      showErrorToast(error.message || 'Failed to load marked questions');
      setMarkedQuestions([]);
      setMarkedQuestionsPagination({
        totalItems: 0,
        page: 1,
        limit: markedQuestionsPerPage,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoadingMarked(false);
    }
  }, [markedQuestionsPage, markedQuestionsPerPage]);

  // Fetch sessions when filter or page changes
  useEffect(() => {
    // Don't fetch if we're navigating away
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    fetchSessions();
  }, [fetchSessions]);

  // Fetch marked questions when page changes
  useEffect(() => {
    fetchMarkedQuestions();
  }, [fetchMarkedQuestions]);

  // Initial fetch on mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousPathnameRef.current = location.pathname;
      // Initial fetch is handled by the other useEffects
      return;
    }
  }, []);

  // Refresh data when page is focused (user returns to this page)
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh sessions on focus, not marked questions
      fetchSessions();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchSessions]);

  // Refresh when location changes (user navigates back to this page)
  // Only refresh if we're actually navigating TO this page (not just re-rendering)
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathnameRef.current;
    
    // Skip on initial mount
    if (previousPath === '') {
      previousPathnameRef.current = currentPath;
      return;
    }
    
    // Only refresh if we're navigating TO the review page from another page
    if (currentPath === '/dashboard/review' && previousPath !== currentPath) {
      // Only refresh marked questions when coming back from review-marked page
      // Don't refresh sessions - they don't change when viewing a marked question
      if (previousPath.startsWith('/dashboard/review-marked')) {
        fetchMarkedQuestions();
      }
    }
    
    // Update previous pathname after processing
    previousPathnameRef.current = currentPath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Handle filter change and reset page
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Handle review button click - navigate immediately without triggering re-renders
  const handleReviewClick = useCallback((questionId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Set flag to prevent unnecessary fetches during navigation
    isNavigatingRef.current = true;
    // Navigate immediately - React Router handles this efficiently
    navigate(`/dashboard/review-marked?questionId=${questionId}`);
  }, [navigate]);

  // Use pagination data from backend
  const { totalPages, hasNextPage, hasPreviousPage, totalItems } = pagination;
  const currentSessions = sessions;

  const getCorrectColor = (percentage) => {
    return percentage >= 80 ? 'text-[#EF4444]' : 'text-oxford-blue';
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
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
      {!loading && (
        <div className="lg:hidden space-y-4 mb-4 ">
          {currentSessions.length === 0 ? (
            <div className="p-8 text-center text-oxford-blue">
              {t('dashboard.review.noSessions')}
            </div>
          ) : (
            currentSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white  rounded-lg border border-[#E5E7EB] shadow-dashboard p-7 h-[143px] flex flex-col justify-between"
          >
            {/* Top Row: Session ID, Mode, Date */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%]">
                {session.sessionCode || session.id}
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
              {session.status === 'paused' ? (
                <button
                  className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#EF4444] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
                  onClick={() => navigate(`/dashboard/session?mode=${session.mode === 'Test' ? 'test' : 'study'}&resume=${session.id}`, {
                    state: { pausedSessionId: session.id }
                  })}
                >
                  {t('dashboard.review.table.actions.continue') || 'Continue'}
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
            ))
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-oxford-blue text-lg">Loading sessions...</div>
        </div>
      )}

      {/* Desktop Table Layout */}
      {!loading && (
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
            {currentSessions.length === 0 ? (
              <div className="p-8 text-center text-oxford-blue">
                {t('dashboard.review.noSessions') || 'No sessions found'}
              </div>
            ) : (
              currentSessions.map((session, index) => (
            <div
              key={session.id}
              className={`grid grid-cols-[repeat(6,1fr)_2fr] gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-[#E5E7EB] last:border-b-0 items-center ${
                index % 2 === 0 ? 'bg-white' : 'bg-white'
              }`}
            >
              {/* Session ID */}
              <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%] flex items-center justify-center">
                {session.sessionCode || session.id}
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
                {session.status === 'paused' ? (
                  <button
                    className="px-[10px] py-[5px] bg-[#EF4444] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
                    onClick={() => navigate(`/dashboard/session?mode=${session.mode === 'Test' ? 'test' : 'study'}&resume=${session.id}`, {
                      state: { pausedSessionId: session.id }
                    })}
                  >
                    {t('dashboard.review.table.actions.continue') || 'Continue'}
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Load More Button (Mobile/Tablet) */}
      {hasNextPage && (
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
      {!loading && totalPages > 0 && (
        <div className="hidden lg:flex bg-oxford-blue text-white rounded-lg px-4 md:px-6  items-center justify-between gap-4 w-full max-w-[1120px] min-h-[46.8px]">
          <div className="text-[12px] font-medium font-roboto text-white leading-[18px] tracking-[3%] whitespace-nowrap">
            {t('dashboard.review.pagination.showing').replace('{{from}}', ((currentPage - 1) * pagination.limit + 1).toString()).replace('{{to}}', Math.min(currentPage * pagination.limit, totalItems).toString()).replace('{{total}}', totalItems.toString())}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!hasPreviousPage}
              className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                !hasPreviousPage
                  ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                  : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
              }`}
            >
              {t('dashboard.review.pagination.previous')}
            </button>
            {(() => {
              // Calculate which page numbers to show based on backend pagination
              const pagesToShow = [];
              const maxPagesToShow = 5;
              
              if (totalPages <= maxPagesToShow) {
                // Show all pages if total is less than max
                for (let i = 1; i <= totalPages; i++) {
                  pagesToShow.push(i);
                }
              } else {
                // Show pages around current page
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                
                // Adjust start if we're near the end
                if (endPage - startPage < maxPagesToShow - 1) {
                  startPage = Math.max(1, endPage - maxPagesToShow + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pagesToShow.push(i);
                }
              }
              
              return pagesToShow.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-[32px] h-[32px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-[#EF4444] text-white border-[#EF4444]'
                      : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
                  }`}
                >
                  {pageNum}
                </button>
              ));
            })()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={!hasNextPage}
              className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                !hasNextPage
                  ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                  : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
              }`}
            >
              {t('dashboard.review.pagination.next')}
            </button>
          </div>
        </div>
      )}

      {/* Marked Questions Section */}
      <div className="mb-8 mt-8">
        <h2 className="font-archivo font-bold text-[24px] md:text-[28px] leading-[32px] text-oxford-blue mb-4">
          {t('dashboard.review.markedQuestions.title')}
        </h2>
        
        {loadingMarked ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-oxford-blue text-lg">{t('dashboard.review.markedQuestions.loading')}</div>
          </div>
        ) : (
          <>
            {/* Mobile/Tablet Card Layout for Marked Questions */}
            <div className="lg:hidden space-y-4 mb-4">
              {markedQuestions.length === 0 ? (
                <div className="p-8 text-center text-oxford-blue">
                  {t('dashboard.review.markedQuestions.noQuestions')}
                </div>
              ) : (
                markedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-lg border border-[#E5E7EB] shadow-dashboard p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[14px] font-normal text-oxford-blue font-roboto">
                        {question.shortId}
                      </div>
                      <div className="text-[14px] font-normal text-oxford-blue font-archivo">
                        {question.markedDate}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-[14px] font-normal text-oxford-blue font-roboto line-clamp-2">
                        {question.questionText}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-[12px] font-normal text-dark-gray font-roboto">
                      <span>{question.exam}</span>
                      <span>•</span>
                      <span>{question.subject}</span>
                      <span>•</span>
                      <span>{question.topic}</span>
                    </div>
                    <button
                      type="button"
                      className="w-full px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
                      onClick={(e) => handleReviewClick(question.id, e)}
                    >
                      {t('dashboard.review.markedQuestions.review')}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table Layout for Marked Questions */}
            <div className="hidden lg:block bg-white rounded-lg overflow-hidden border border-[#E5E7EB] shadow-dashboard w-full max-w-[1120px]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-oxford-blue text-center">
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.questionId')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.question')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.exam')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.subject')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.topic')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.markedDate')}
                      </th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                        {t('dashboard.review.markedQuestions.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {markedQuestions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 md:px-6 py-8 text-center text-oxford-blue">
                          {t('dashboard.review.markedQuestions.noQuestions')}
                        </td>
                      </tr>
                    ) : (
                      markedQuestions.map((question, index) => (
                        <tr
                          key={question.id}
                          className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition last:border-b-0"
                        >
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                            {question.shortId}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-oxford-blue">
                            <div className="line-clamp-2">{question.questionText}</div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                            {question.exam}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                            {question.subject}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                            {question.topic}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
                            {question.markedDate}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-[10px] flex-wrap justify-center">
                              <button
                                type="button"
                                className="px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
                                onClick={(e) => handleReviewClick(question.id, e)}
                              >
                                {t('dashboard.review.markedQuestions.review')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination for Marked Questions (Desktop) */}
            {!loadingMarked && markedQuestionsPagination.totalPages > 0 && (
              <div className="hidden lg:flex bg-oxford-blue text-white rounded-lg rounded-t-none px-4 md:px-6 items-center justify-between gap-4 w-full max-w-[1120px] min-h-[46.8px]">
                <div className="text-[12px] font-medium font-roboto text-white leading-[18px] tracking-[3%] whitespace-nowrap">
                  {t('dashboard.review.pagination.showing').replace('{{from}}', ((markedQuestionsPagination.page - 1) * markedQuestionsPagination.limit + 1).toString()).replace('{{to}}', Math.min(markedQuestionsPagination.page * markedQuestionsPagination.limit, markedQuestionsPagination.totalItems).toString()).replace('{{total}}', markedQuestionsPagination.totalItems.toString())}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setMarkedQuestionsPage(prev => Math.max(1, prev - 1))}
                    disabled={!markedQuestionsPagination.hasPreviousPage}
                    className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                      !markedQuestionsPagination.hasPreviousPage
                        ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                        : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
                    }`}
                  >
                    {t('dashboard.review.pagination.previous')}
                  </button>
                  {(() => {
                    // Calculate which page numbers to show
                    const pagesToShow = [];
                    const maxPagesToShow = 5;
                    const { totalPages, page } = markedQuestionsPagination;
                    
                    if (totalPages <= maxPagesToShow) {
                      // Show all pages if total is less than max
                      for (let i = 1; i <= totalPages; i++) {
                        pagesToShow.push(i);
                      }
                    } else {
                      // Show pages around current page
                      let startPage = Math.max(1, page - 2);
                      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                      
                      // Adjust start if we're near the end
                      if (endPage - startPage < maxPagesToShow - 1) {
                        startPage = Math.max(1, endPage - maxPagesToShow + 1);
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pagesToShow.push(i);
                      }
                    }
                    
                    return pagesToShow.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setMarkedQuestionsPage(pageNum)}
                        className={`w-[32px] h-[32px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                          page === pageNum
                            ? 'bg-[#EF4444] text-white border-[#EF4444]'
                            : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                  <button
                    onClick={() => setMarkedQuestionsPage(prev => Math.min(markedQuestionsPagination.totalPages, prev + 1))}
                    disabled={!markedQuestionsPagination.hasNextPage}
                    className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
                      !markedQuestionsPagination.hasNextPage
                        ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
                        : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
                    }`}
                  >
                    {t('dashboard.review.pagination.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Load More Button for Marked Questions (Mobile/Tablet) */}
            {markedQuestionsPagination.hasNextPage && (
              <div className="lg:hidden mb-4 mt-4">
                <button
                  onClick={() => setMarkedQuestionsPage(prev => prev + 1)}
                  className="w-full px-4 py-3 bg-[#EF4444] text-white rounded-lg text-[16px] font-normal font-roboto leading-[24px] tracking-[0%] text-center hover:opacity-90 transition-opacity"
                >
                  {t('dashboard.review.pagination.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default ReviewPage;
