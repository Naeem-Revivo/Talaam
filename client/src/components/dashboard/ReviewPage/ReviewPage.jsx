import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import studentQuestionsAPI from '../../../api/studentQuestions';
import { showErrorToast } from '../../../utils/toastConfig';
import { Loader } from '../../../components/common/Loader';
import ReviewPageHeader from './components/ReviewPageHeader';
import FilterButtons from './components/FilterButtons';
import SessionCard from './components/SessionCard';
import MarkedQuestionCard from './components/MarkedQuestionCard';
import ReviewTable from './components/ReviewTable';
import Pagination from './components/Pagination';

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
            status: session.status || 'completed',
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

  const getCorrectColor = (percentage) => {
    return percentage >= 80 ? 'text-[#EF4444]' : 'text-oxford-blue';
  };

  // Render function for sessions table rows
  const renderSessionRow = (session, index, navigate, t, getCorrectColor) => {
    return (
      <>
        <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
          {session.sessionCode || session.id}
        </td>
        <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
          {session.date}
        </td>
        <td className="px-4 md:px-6 py-3 md:py-4">
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
        </td>
        <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
          {session.questions}
        </td>
        <td className={`px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center ${getCorrectColor(session.correct)}`}>
          {session.correct}%
        </td>
        <td className="px-4 md:px-6 py-3 md:py-4 text-[14px] font-roboto font-normal leading-[100%] tracking-[0%] text-center text-oxford-blue">
          {session.avgTime}
        </td>
        <td className="px-4 md:px-6 py-3 md:py-4">
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
        </td>
      </>
    );
  };

  // Render function for marked questions table rows
  const renderMarkedQuestionRow = (question, index, navigate, t) => {
    return (
      <>
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
      </>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className='p-4 md:p-6 lg:p-8 2xl:px-6 max-w-[1200px] mx-auto'>
        <ReviewPageHeader />

        <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Mobile/Tablet Card Layout for Sessions */}
        {!loading && (
          <div className="lg:hidden space-y-4 mb-4">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-oxford-blue">
                {t('dashboard.review.noSessions')}
              </div>
            ) : (
              sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  getCorrectColor={getCorrectColor}
                />
              ))
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        )}

        {/* Desktop Table Layout for Sessions */}
        {!loading && (
          <ReviewTable
            columns={[
              t('dashboard.review.table.columns.number'),
              t('dashboard.review.table.columns.date'),
              t('dashboard.review.table.columns.mode'),
              t('dashboard.review.table.columns.questions'),
              t('dashboard.review.table.columns.correct'),
              t('dashboard.review.table.columns.avgTime'),
              t('dashboard.review.table.columns.actions'),
            ]}
            data={sessions}
            emptyMessage={t('dashboard.review.noSessions') || 'No sessions found'}
            renderRow={renderSessionRow}
            getCorrectColor={getCorrectColor}
          />
        )}

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />

        {/* Marked Questions Section */}
        <div className="mb-8 mt-8">
          <h2 className="font-archivo font-bold text-[24px] md:text-[28px] leading-[32px] text-oxford-blue mb-4">
            {t('dashboard.review.markedQuestions.title')}
          </h2>
          
          {loadingMarked ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader size="lg" />
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
                    <MarkedQuestionCard
                      key={question.id}
                      question={question}
                      onReviewClick={handleReviewClick}
                    />
                  ))
                )}
              </div>

              {/* Desktop Table Layout for Marked Questions */}
              <ReviewTable
                columns={[
                  t('dashboard.review.markedQuestions.table.questionId'),
                  t('dashboard.review.markedQuestions.table.question'),
                  t('dashboard.review.markedQuestions.table.exam'),
                  t('dashboard.review.markedQuestions.table.subject'),
                  t('dashboard.review.markedQuestions.table.topic'),
                  t('dashboard.review.markedQuestions.table.markedDate'),
                  t('dashboard.review.markedQuestions.table.actions'),
                ]}
                data={markedQuestions}
                emptyMessage={t('dashboard.review.markedQuestions.noQuestions')}
                renderRow={renderMarkedQuestionRow}
              />

              {/* Pagination for Marked Questions */}
              <Pagination
                pagination={markedQuestionsPagination}
                onPageChange={setMarkedQuestionsPage}
                className="rounded-t-none"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
