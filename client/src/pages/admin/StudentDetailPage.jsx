import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Loader from "../../components/common/Loader";
import studentsAPI from "../../api/students";

// Helper function to generate initials avatar as data URI
const getInitialsAvatar = (name) => {
  if (!name) {
    const defaultSvg = encodeURIComponent('<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" fill="#F0F4FA"/><text x="40" y="45" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#032746" text-anchor="middle">U</text></svg>');
    return `data:image/svg+xml,${defaultSvg}`;
  }
  
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Create SVG data URI with initials
  const svg = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" fill="#F0F4FA"/><text x="40" y="45" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#032746" text-anchor="middle">${initials}</text></svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const StudentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const response = await studentsAPI.getStudentById(id);
        if (response.success && response.data?.student) {
          setStudent(response.data.student);
        } else {
          setStudent(null);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStudentData();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/admin/students");
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    console.log("Edit student:", student);
  };

  const handleSuspend = async () => {
    try {
      const newStatus = student.status === "Active" ? "suspended" : "active";
      const action = newStatus === "suspended" ? "suspend" : "activate";
      
      if (window.confirm(
        `Are you sure you want to ${action} ${student.name}?`
      )) {
        await studentsAPI.updateStudentStatus(student.id, newStatus);
        
        // Refresh student data
        const response = await studentsAPI.getStudentById(id);
        if (response.success && response.data?.student) {
          setStudent(response.data.student);
        }
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      alert(error.response?.data?.message || "Failed to update student status");
    }
  };


  if (loading) {
    return (
      <Loader 
        fullScreen={true}
        size="lg" 
        color="oxford-blue" 
        text="Loading..."
        className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px]"
      />
    );
  }

  if (!student) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#EF4444] font-roboto text-lg">Student not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-oxford-blue text-white rounded-lg hover:bg-opacity-90 transition"
          >
            {t('admin.studentDetail.actions.back')}
          </button>
        </div>
      </div>
    );
  }

  // For activity trend, use 100 as max (scores are percentages 0-100)
  // This ensures 60% score shows as 60% of container height
  const maxActivityScore = 100;

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.studentDetail.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray mt-1">
              {t('admin.studentDetail.hero.subtitle')}
            </p>
          </div>
        </header>

        {/* Student Information Card */}
        <section className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              {/* Profile Picture */}
              <div className="w-20 h-20 rounded-full bg-[#F0F4FA] flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={student.profilePicture || getInitialsAvatar(student.name)}
                  alt={student.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = getInitialsAvatar(student.name);
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-archivo text-[28px] leading-[32px] font-bold text-oxford-blue break-words">
                      {student.name}
                    </h2>
                    <p className="font-roboto text-[16px] leading-[24px] text-dark-gray mt-1">
                      {t('admin.studentDetail.studentId')}: {student.studentId}
                    </p>
                  </div>
                  <span className="inline-flex h-[26px] min-w-[59px] font-roboto items-center justify-center rounded-md px-3 text-sm font-normal bg-[#FDF0D5] text-[#ED4122] flex-shrink-0">
                    {student.status === "Active" ? t('admin.studentManagement.status.active') : t('admin.studentManagement.status.suspended')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                {t('admin.studentDetail.emailAddress')}
              </p>
              <p className="font-roboto text-[16px] leading-[24px] text-oxford-blue">
                {student.email}
              </p>
            </div>
            <div>
              <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                {t('admin.studentDetail.subscriptionPlan')}
              </p>
              <p className="font-roboto text-[16px] leading-[24px] text-oxford-blue">
                <span className="font-semibold">{student.subscription}</span>
                <span className="text-dark-gray ml-1">({t('admin.studentDetail.exp')}: {student.subscriptionExpiry})</span>
              </p>
            </div>
            <div>
              <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                {t('admin.studentDetail.signupDate')}
              </p>
              <p className="font-roboto text-[16px] leading-[24px] text-oxford-blue">
                {student.signupDate}
              </p>
            </div>
          </div>

        </section>

        {/* Activity Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Activity Overview */}
          <section className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <h3 className="font-archivo text-[20px] leading-[24px] font-bold text-oxford-blue mb-4">
              {t('admin.studentDetail.activityOverview.title')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityOverview.avgScore')}
                </p>
                <p className="font-archivo text-[32px] leading-[40px] font-bold text-oxford-blue">
                  {student.avgScore}%
                </p>
              </div>
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityOverview.totalTest')}
                </p>
                <p className="font-archivo text-[32px] leading-[40px] font-bold text-oxford-blue">
                  {student.totalTest}
                </p>
              </div>
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityOverview.correctAnswer')}
                </p>
                <p className="font-archivo text-[24px] leading-[32px] font-bold text-[#10B981]">
                  {student.correctAnswers}
                </p>
              </div>
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityOverview.incorrect')}
                </p>
                <p className="font-archivo text-[24px] leading-[32px] font-bold text-[#EF4444]">
                  {student.incorrectAnswers}
                </p>
              </div>
            </div>
          </section>

          {/* Activity Trend */}
          <section className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            {/* <h3 className="font-archivo text-[20px] leading-[24px] font-bold text-oxford-blue mb-4">
              {t('admin.studentDetail.activityTrend.title')}
            </h3> */}
            <div className="space-y-4">
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityTrend.lastActive')}
                </p>
                <p className="font-roboto text-[16px] leading-[24px] font-semibold text-oxford-blue">
                  {student.lastActive}
                </p>
              </div>
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityTrend.averageScore')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-archivo text-[32px] leading-[40px] font-bold text-oxford-blue">
                    {student.avgScore}%
                  </p>
                  <span className="inline-flex h-[22px] font-roboto items-center justify-center rounded-md px-2 text-xs font-normal bg-[#FDF0D5] text-[#ED4122]">
                    {t('admin.studentDetail.activityTrend.good')}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-roboto text-[14px] leading-[20px] text-dark-gray mb-1">
                  {t('admin.studentDetail.activityTrend.activityLevel')}
                </p>
                <p className="font-roboto text-[16px] leading-[24px] font-semibold text-[#EF4444]">
                  {student.activityLevel}
                </p>
              </div>
            </div>
          </section>

          {/* Activity Trend Chart */}
          <section className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <h3 className="font-archivo text-[20px] leading-[24px] font-bold text-oxford-blue mb-4">
              {t('admin.studentDetail.activityTrend.title')}
            </h3>
            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-[150px] mt-6">
              {student.activityTrend.map((avgScore, index) => {
                // Container height is 150px, so calculate pixel height directly
                // 60% score = 60% of 150px = 90px
                const containerHeight = 150; // pixels
                const barHeight = (avgScore / 100) * containerHeight;
                
                // Find the highest score to highlight the peak
                const maxScore = Math.max(...student.activityTrend);
                const isPeak = avgScore === maxScore && avgScore > 0;
                
                // Get day label (last 7 days)
                const date = new Date();
                date.setDate(date.getDate() - (6 - index));
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end gap-1 relative"
                  >
                    {/* Show score value above the bar */}
                    {avgScore > 0 && (
                      <span className="text-[11px] font-roboto text-oxford-blue font-medium mb-1 absolute -top-5 whitespace-nowrap">
                        {avgScore}%
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        isPeak ? "bg-[#ED4122]" : "bg-[#E5E7EB]"
                      }`}
                      style={{ 
                        height: `${barHeight}px`, 
                        minHeight: avgScore > 0 ? '6px' : '0px'
                      }}
                      title={`${dayLabel}: ${avgScore}%`}
                    />
                    <span className="text-[10px] font-roboto text-dark-gray mt-1">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Progress Breakdown Table and Flag/Reported Issues Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Breakdown Table */}
          <section className="lg:col-span-2 w-full">
            <div className="p-6 pb-0">
              <h3 className="font-archivo text-[20px] leading-[24px] font-bold text-oxford-blue mb-4">
                {t('admin.studentDetail.progressBreakdown.title')}
              </h3>
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full rounded-[12px] overflow-hidden border border-[#E5E7EB] bg-white shadow-dashboard">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-oxford-blue text-center">
                    <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                      {t('admin.studentDetail.progressBreakdown.testName')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                      {t('admin.studentDetail.progressBreakdown.date')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                      {t('admin.studentDetail.progressBreakdown.score')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                      {t('admin.studentDetail.progressBreakdown.result')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.progress && student.progress.length > 0 ? (
                    student.progress.map((test, index) => (
                      <tr
                        key={index}
                        className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row"
                      >
                        <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                          {test.testName}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
                          {test.date}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
                          {test.score}/{test.total} ({test.percentage}%)
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${
                              test.result === "Passed"
                                ? "bg-[#FDF0D5] text-[#ED4122]"
                                : "bg-[#EF4444] text-white"
                            }`}
                          >
                            {test.result === "Passed" ? t('admin.studentDetail.progressBreakdown.passed') : t('admin.studentDetail.progressBreakdown.failed')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-sm text-dark-gray"
                      >
                        {t('admin.studentDetail.progressBreakdown.noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile view */}
            <div className="flex flex-col gap-4 p-2 md:hidden">
              {student.progress && student.progress.length > 0 ? (
                student.progress.map((test, index) => (
                  <div key={index} className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
                    <div className="space-y-2 text-oxford-blue">
                      <div>
                        <span className="text-[14px] font-semibold">{t('admin.studentDetail.progressBreakdown.testName')}: </span>
                        <span className="text-[14px]">{test.testName}</span>
                      </div>
                      <div>
                        <span className="text-[14px] font-semibold">{t('admin.studentDetail.progressBreakdown.date')}: </span>
                        <span className="text-[14px]">{test.date}</span>
                      </div>
                      <div>
                        <span className="text-[14px] font-semibold">{t('admin.studentDetail.progressBreakdown.score')}: </span>
                        <span className="text-[14px]">{test.score}/{test.total} ({test.percentage}%)</span>
                      </div>
                      <div>
                        <span className="text-[14px] font-semibold">{t('admin.studentDetail.progressBreakdown.result')}: </span>
                        <span
                          className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${
                            test.result === "Passed"
                              ? "bg-[#FDF0D5] text-[#ED4122]"
                              : "bg-[#EF4444] text-white"
                          }`}
                        >
                          {test.result === "Passed" ? t('admin.studentDetail.progressBreakdown.passed') : t('admin.studentDetail.progressBreakdown.failed')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
                  {t('admin.studentDetail.progressBreakdown.noData')}
                </div>
              )}
            </div>
          </section>

          {/* Reported and Flagged Questions */}
          <section className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <h3 className="font-archivo text-[20px] leading-[24px] font-bold text-oxford-blue mb-4">
              {t('admin.studentDetail.flaggedIssues.reportedAndFlagged')}
            </h3>
            {student.flags && student.flags.length > 0 ? (
              <div className="space-y-3">
                {student.flags.map((flag, index) => (
                  <div
                    key={flag.id || index}
                    className="rounded-[8px] bg-[#FEE2E2] border border-[#FECACA] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <path
                          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM9 14H11V12H9V14ZM9 10H11V6H9V10Z"
                          fill="#EF4444"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="font-roboto text-[14px] leading-[20px] font-semibold text-[#EF4444] mb-1">
                          {flag.exam} - {flag.subject} - {flag.topic}
                        </p>
                        <p className="font-roboto text-[12px] leading-[18px] text-oxford-blue mb-2 line-clamp-2">
                          {flag.questionText}
                        </p>
                        <p className="font-roboto text-[12px] leading-[18px] text-dark-gray mb-1">
                          <span className="font-medium">{t('admin.studentDetail.flaggedIssues.reason')}:</span> {flag.flagReason}
                        </p>
                        <p className="font-roboto text-[12px] leading-[18px] text-dark-gray">
                          {t('admin.studentDetail.flaggedIssues.flaggedOn')} {flag.date}
                          {flag.flagStatus && (
                            <span className="ml-2">
                              - {t('admin.studentDetail.flaggedIssues.status')}: 
                              <span className={`ml-1 ${
                                flag.flagStatus === 'approved' ? 'text-green-600' :
                                flag.flagStatus === 'rejected' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {flag.flagStatus === 'approved' ? t('admin.studentDetail.flaggedIssues.approved') :
                                 flag.flagStatus === 'rejected' ? t('admin.studentDetail.flaggedIssues.rejected') :
                                 t('admin.studentDetail.flaggedIssues.pending')}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-roboto text-[14px] leading-[20px] text-dark-gray">
                {t('admin.studentDetail.flaggedIssues.noIssues')}
              </p>
            )}
          </section>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pb-6">
          <button
            type="button"
            onClick={handleBack}
            className="h-[44px] w-full sm:w-[120px] rounded-[12px] border border-[#E5E7EB] bg-white text-[16px] font-archivo font-semibold text-oxford-blue transition hover:bg-[#F3F4F6]"
          >
            {t('admin.studentDetail.actions.back')}
          </button>
          <button
            type="button"
            onClick={handleSuspend}
            className={`h-[44px] w-full sm:w-[180px] rounded-[12px] text-[16px] font-archivo font-semibold text-white transition flex items-center justify-center gap-2 ${
              student.status === "Active"
                ? "bg-[#EF4444] hover:bg-[#DC2626]"
                : "bg-[#10B981] hover:bg-[#059669]"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM5 7H11V9H5V7Z"
                fill="white"
              />
            </svg>
            {student.status === "Active" 
              ? t('admin.studentDetail.actions.suspendAccount')
              : t('admin.studentDetail.actions.activateAccount')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;

