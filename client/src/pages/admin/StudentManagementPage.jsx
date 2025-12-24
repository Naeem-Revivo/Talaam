import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StudentSummaryCards from "../../components/admin/studentManagement/StudentSummaryCards";
import StudentFilterBar from "../../components/admin/studentManagement/StudentFilterBar";
import StudentTable from "../../components/admin/studentManagement/StudentTable";
import { useLanguage } from "../../context/LanguageContext";
import Loader from "../../components/common/Loader";
import useDebounce from "../../hooks/useDebounce";
import studentsAPI from "../../api/students";
import {
  usermanage1,
  usermanage2,
  usermanage3,
  usermanage4,
} from "../../assets/svg/dashboard/admin";

// Using existing icons - you can replace with student-specific icons later
const studentIcons = {
  total: usermanage1,
  active: usermanage2,
  suspended: usermanage3,
  verified: usermanage4,
};

const pageSize = 5; // Match UserManagementPage

const StudentManagementPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Local state for all filters and pagination
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Debounce the search input (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedStudentId = useDebounce(studentIdInput, 500);
  
  // Use ref to track previous values and prevent unnecessary API calls
  const prevParamsRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);


  console.log("Students:", students);

  // Load statistics from API
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setStatsLoading(true);
        const response = await studentsAPI.getStudentManagementStatistics();
        if (response.success && response.data?.statistics) {
          setStatistics(response.data.statistics);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Set default values on error
        setStatistics({
          totalStudents: 0,
          activeStudents: 0,
          suspended: 0,
          verified: 0,
          unverified: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };
    loadStatistics();
  }, []);

  // Load students based on filters and debounced search
  useEffect(() => {
    const isFirstLoad = prevParamsRef.current === null;
    
    const paramsChanged = isFirstLoad ||
      prevParamsRef.current.page !== page ||
      prevParamsRef.current.planFilter !== planFilter ||
      prevParamsRef.current.statusFilter !== statusFilter ||
      prevParamsRef.current.dateFilter !== dateFilter ||
      prevParamsRef.current.debouncedSearch !== debouncedSearch ||
      prevParamsRef.current.debouncedStudentId !== debouncedStudentId;
    
    if (!paramsChanged) {
      return;
    }
    
    const isFilterOnly = !isFirstLoad && 
                         prevParamsRef.current.page === page &&
                         (prevParamsRef.current.debouncedSearch !== debouncedSearch ||
                          prevParamsRef.current.debouncedStudentId !== debouncedStudentId ||
                          prevParamsRef.current.planFilter !== planFilter ||
                          prevParamsRef.current.statusFilter !== statusFilter ||
                          prevParamsRef.current.dateFilter !== dateFilter);
    
    const isPageOnly = !isFirstLoad &&
                       prevParamsRef.current.page !== page &&
                       prevParamsRef.current.debouncedSearch === debouncedSearch &&
                       prevParamsRef.current.debouncedStudentId === debouncedStudentId &&
                       prevParamsRef.current.planFilter === planFilter &&
                       prevParamsRef.current.statusFilter === statusFilter &&
                       prevParamsRef.current.dateFilter === dateFilter;
    
    prevParamsRef.current = { page, planFilter, statusFilter, dateFilter, debouncedSearch, debouncedStudentId };
    
    const loadStudents = async () => {
      try {
        if (!isFilterOnly && !isPageOnly) {
          setLoading(true);
        }
        
        const currentPage = (debouncedSearch || debouncedStudentId || planFilter || statusFilter || dateFilter) ? 1 : page;
        
        // Map filter values to API format
        // Normalize date filter: "Today" -> "today", "This Week" -> "thisWeek", etc.
        let normalizedDate = null;
        if (dateFilter && dateFilter.toLowerCase() !== 'all') {
          const dateLower = dateFilter.toLowerCase();
          if (dateLower === 'today') {
            normalizedDate = 'today';
          } else if (dateLower === 'this week') {
            normalizedDate = 'thisWeek';
          } else if (dateLower === 'this month') {
            normalizedDate = 'thisMonth';
          } else if (dateLower === 'this year') {
            normalizedDate = 'thisYear';
          } else {
            normalizedDate = dateLower;
          }
        }
        
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(statusFilter && statusFilter.toLowerCase() !== 'all' && { status: statusFilter.toLowerCase() }),
          ...(planFilter && planFilter.toLowerCase() !== 'all' && { plan: planFilter }),
          ...(normalizedDate && { date: normalizedDate }),
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(debouncedStudentId && { studentId: debouncedStudentId }),
        };
        
        const response = await studentsAPI.getAllStudents(params);
        
        if (response.success && response.data) {
          setStudents(response.data.students || []);
          setPagination(response.data.pagination || null);
        } else {
          setStudents([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
        setPagination(null);
      } finally {
        if (!isFilterOnly && !isPageOnly) {
          setLoading(false);
        }
      }
    };
    
    loadStudents();
  }, [page, planFilter, statusFilter, dateFilter, debouncedSearch]);

  const summaries = useMemo(() => {
    if (!statistics) return [];
    
    return [
      {
        label: t('admin.studentManagement.summary.totalStudents'),
        value: statistics.totalStudents?.toLocaleString() || '0',
        icon: studentIcons.total,
      },
      {
        label: t('admin.studentManagement.summary.activeStudents'),
        value: statistics.activeStudents?.toLocaleString() || '0',
        icon: studentIcons.active,
      },
      {
        label: t('admin.studentManagement.summary.suspended'),
        value: statistics.suspended?.toLocaleString() || '0',
        icon: studentIcons.suspended,
      },
      {
        label: t('admin.studentManagement.summary.verifiedUnverified'),
        value: `${statistics.verified || 0} / ${statistics.unverified || 0}`,
        icon: studentIcons.verified,
      },
    ];
  }, [statistics, t]);

  const handleView = (student) => {
    navigate(`/admin/students/${student.id}`);
  };

  const handleSuspend = async (student) => {
    try {
      const newStatus = student.status === "Active" ? "suspended" : "active";
      const action = newStatus === "suspended" ? "suspend" : "activate";
      
      if (window.confirm(
        `Are you sure you want to ${action} ${student.name}?`
      )) {
        await studentsAPI.updateStudentStatus(student.id, newStatus);
        
        // Refresh the students list
        const currentPage = (debouncedSearch || planFilter || statusFilter || dateFilter) ? 1 : page;
        
        // Normalize date filter
        let normalizedDate = null;
        if (dateFilter && dateFilter.toLowerCase() !== 'all') {
          const dateLower = dateFilter.toLowerCase();
          if (dateLower === 'today') {
            normalizedDate = 'today';
          } else if (dateLower === 'this week') {
            normalizedDate = 'thisWeek';
          } else if (dateLower === 'this month') {
            normalizedDate = 'thisMonth';
          } else if (dateLower === 'this year') {
            normalizedDate = 'thisYear';
          } else {
            normalizedDate = dateLower;
          }
        }
        
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(statusFilter && statusFilter.toLowerCase() !== 'all' && { status: statusFilter.toLowerCase() }),
          ...(planFilter && planFilter.toLowerCase() !== 'all' && { plan: planFilter }),
          ...(normalizedDate && { date: normalizedDate }),
          ...(debouncedSearch && { search: debouncedSearch }),
        };
        
        const response = await studentsAPI.getAllStudents(params);
        if (response.success && response.data) {
          setStudents(response.data.students || []);
          setPagination(response.data.pagination || null);
        }
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      alert(error.response?.data?.message || "Failed to update student status");
    }
  };

  if (loading || statsLoading) {
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

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px] overflow-x-hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 w-full">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.studentManagement.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t('admin.studentManagement.hero.subtitle')}
            </p>
          </div>
        </header>

        <StudentSummaryCards summaries={summaries} />

        <StudentFilterBar
          searchValue={searchInput}
          planValue={planFilter}
          statusValue={statusFilter}
          dateValue={dateFilter}
          onSearchChange={(value) => {
            setSearchInput(value);
          }}
          studentIdValue={studentIdInput}
          onStudentIdChange={(value) => {
            setStudentIdInput(value);
          }}
          onPlanChange={(value) => {
            setPlanFilter(value);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
          }}
          onDateChange={(value) => {
            setDateFilter(value);
          }}
        />

        <StudentTable
          students={students}
          page={page}
          pageSize={pageSize}
          total={pagination?.totalItems || 0}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
          onView={handleView}
          onSuspend={handleSuspend}
        />
      </div>
    </div>
  );
};

export default StudentManagementPage;

