import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { user, notif } from '../../assets/svg/dashboard/header';
import { setting as settings, profile, logout } from '../../assets/svg/dashboard';
import { hamburger } from '../../assets/svg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction, fetchCurrentUser } from '../../store/slices/authSlice';
import { showLogoutToast } from '../../utils/toastConfig';
import { getUserAnnouncements, markAnnouncementAsRead } from '../../api/announcements';
import AnnouncementDropdown from './AnnouncementDropdown';
import AnnouncementAlertCard from './AnnouncementAlertCard';

const Header = ({ onToggleSidebar, showSidebarToggle = true }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newAnnouncements, setNewAnnouncements] = useState([]);
  // Initialize fetching state: if student doesn't have name, we'll fetch it
  const isStudent = authUser && (authUser?.role === 'user' || authUser?.role === 'student');
  const hasName = authUser?.name || authUser?.fullName;
  const [isFetchingUser, setIsFetchingUser] = useState(isStudent && !hasName);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const previousAnnouncementIdsRef = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch current user data on mount to ensure we have latest name information
  useEffect(() => {
    if (!authUser) return;
    
    const isStudent = authUser?.role === 'user' || authUser?.role === 'student';
    
    // For students, always fetch fresh user data to ensure we have the latest name
    // This prevents showing email-derived name from cached data
    if (isStudent) {
      const hasName = authUser?.name || authUser?.fullName;
      // If we don't have a name, set fetching state immediately
      if (!hasName) {
        setIsFetchingUser(true);
      }
      // Always fetch to get latest data, but only show loading if we don't have name
      dispatch(fetchCurrentUser())
        .finally(() => {
          setIsFetchingUser(false);
        });
    }
  }, []); // Only run once on mount

  // Fetch announcements and unread count
  useEffect(() => {
    if (!authUser) return;

    const fetchAnnouncements = async () => {
      try {
        const announcementsRes = await getUserAnnouncements();

        if (announcementsRes.success) {
          const fetchedAnnouncements = announcementsRes.data.announcements;
          setAnnouncements(fetchedAnnouncements);

          // Calculate unread count for exam-related announcements only
          // This must match the filter in AnnouncementDropdown exactly
          const examUnreadAnnouncements = fetchedAnnouncements.filter(
            (ann) => {
              if (!ann.title) return false;
              const titleLower = ann.title.toLowerCase();
              const isExam = titleLower.includes('exam');
              const isUnread = ann.isRead === false || ann.isRead === undefined;
              return isExam && isUnread;
            }
          );
          const examUnreadCount = examUnreadAnnouncements.length;
          setUnreadCount(examUnreadCount);
          
          // Debug log (can be removed later)
          console.log('Unread exam announcements count:', examUnreadCount, 'out of', fetchedAnnouncements.length, 'total');

          // Check for new announcements (unread ones that weren't in previous fetch)
          const currentIds = new Set(fetchedAnnouncements.map(a => a.id));
          const newUnreadAnnouncements = fetchedAnnouncements.filter(
            (ann) => !ann.isRead && !previousAnnouncementIdsRef.current.has(ann.id)
          );

          if (newUnreadAnnouncements.length > 0) {
            setNewAnnouncements((prev) => {
              const existingIds = prev.map((a) => a.id);
              const toAdd = newUnreadAnnouncements.filter(
                (a) => !existingIds.includes(a.id)
              );
              return [...prev, ...toAdd];
            });
          }

          // Update the ref with current announcement IDs
          previousAnnouncementIdsRef.current = currentIds;
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    // Initial fetch
    fetchAnnouncements();
  }, [authUser]);

  const handleNotificationClick = async () => {
    // Refresh announcements when opening the dropdown to get latest data
    if (!isNotificationOpen) {
      try {
        const announcementsRes = await getUserAnnouncements();
        if (announcementsRes.success) {
          const fetchedAnnouncements = announcementsRes.data.announcements;
          setAnnouncements(fetchedAnnouncements);
          
          // Recalculate unread count for exam-related announcements only
          // This must match the filter in AnnouncementDropdown exactly
          const examUnreadAnnouncements = fetchedAnnouncements.filter(
            (ann) => {
              if (!ann.title) return false;
              const titleLower = ann.title.toLowerCase();
              const isExam = titleLower.includes('exam');
              const isUnread = ann.isRead === false || ann.isRead === undefined;
              return isExam && isUnread;
            }
          );
          setUnreadCount(examUnreadAnnouncements.length);
        }
      } catch (error) {
        console.error('Error refreshing announcements:', error);
      }
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleAnnouncementRead = (announcementId) => {
    // Update local state
    setAnnouncements((prev) => {
      const updated = prev.map((ann) =>
        ann.id === announcementId ? { ...ann, isRead: true } : ann
      );
      // Recalculate exam unread count - must match filter exactly
      const examUnreadCount = updated.filter(
        (ann) => {
          if (!ann.title) return false;
          const titleLower = ann.title.toLowerCase();
          const isExam = titleLower.includes('exam');
          const isUnread = ann.isRead === false || ann.isRead === undefined;
          return isExam && isUnread;
        }
      ).length;
      setUnreadCount(examUnreadCount);
      return updated;
    });
    // Remove from new announcements if present
    setNewAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementId));
  };

  const handleDismissAlert = (announcementId) => {
    setNewAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementId));
  };

  const handleMenuItemClick = (action) => {
    if (action === 'Logout') {
      dispatch(logoutAction());
      setIsUserMenuOpen(false);
      showLogoutToast(t('toast.message.logoutSuccess') || 'You have been logged out successfully.', {
        title: t('toast.title.logout') || 'Logout Successful',
        isAuth: true
      });
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
      return;
    }
    setIsUserMenuOpen(false);
  };

  const handleSetting = () => {
  const currentPath = location.pathname;

  if (currentPath.startsWith("/gatherer")) {
    navigate("/gatherer/profile");
    return;
  }

  if (currentPath.startsWith("/creator")) {
    navigate("/creator/profile");
    return;
  }

  if (currentPath.startsWith("/processor")) {
    navigate("/processor/profile");
    return;
  }

  if (currentPath.startsWith("/explainer")) {
    navigate("/explainer/profile");
    return;
  }

  if (currentPath.startsWith("/admin")) {
    navigate("/admin/settings");
    return;
  }

  // Default: student dashboard
  navigate("/dashboard/setting");
};


  const getTitleByPath = (pathname) => {

    if (pathname.startsWith('/gatherer')) {
    if (pathname === '/gatherer') return t('header.titles.gatherer.dashboard');
    if (pathname.includes('question-bank')) return t('header.titles.gatherer.questionBank');
    if (pathname.includes('announcements')) return t('header.titles.gatherer.announcements');
    if (pathname.includes('profile')) return t('header.titles.gatherer.profile');
    return t('header.titles.gatherer.default');
  }
  
  // Creator routes
  if (pathname.startsWith('/creator')) {
    if (pathname === '/creator') return t('header.titles.creator.dashboard');
    if (pathname.includes('question-bank')) return t('header.titles.creator.questionBank');
    if (pathname.includes('announcements')) return t('header.titles.creator.announcements');
    if (pathname.includes('profile')) return t('header.titles.creator.profile');
    return t('header.titles.creator.default');
  }
  
  // Processor routes
  if (pathname.startsWith('/processor')) {
    if (pathname === '/processor') return t('header.titles.processor.dashboard');
    if (pathname === '/processor/question-bank') return t('header.titles.processor.questionBank');
    if (pathname.includes('gatherer-submission')) return t('header.titles.processor.gathererSubmission');
    if (pathname.includes('creator-submission')) return t('header.titles.processor.creatorSubmission');
    if (pathname.includes('explainer-submission')) return t('header.titles.processor.explainerSubmission');
    if (pathname.includes('admin-submission')) return t('header.titles.processor.adminSubmission');
    if (pathname.includes('announcements')) return t('header.titles.processor.announcements');
    if (pathname.includes('profile')) return t('header.titles.processor.profile');
    return t('header.titles.processor.default');
  }
  
  // Explainer routes
  if (pathname.startsWith('/explainer')) {
    if (pathname === '/explainer') return t('header.titles.explainer.dashboard');
    if (pathname.includes('question-bank')) return t('header.titles.explainer.questionBank');
    if (pathname.includes('announcements')) return t('header.titles.explainer.announcements');
    if (pathname.includes('profile')) return t('header.titles.explainer.profile');
    return t('header.titles.explainer.default');
  }
  
  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') return t('header.titles.admin.dashboard');
    if (pathname.startsWith('/admin/students')) return t('header.titles.admin.studentManagement');
    if (pathname.includes('add-announcements')) return t('header.titles.admin.addAnnouncements');
    if (pathname.includes('announcements')) return t('header.titles.admin.announcements');
    if (pathname.includes('language-management')) return t('header.titles.admin.languageManagement');
    if (pathname.includes('email-template')) return t('header.titles.admin.emailTemplate');
    if (pathname.includes('roles-permissions')) return t('header.titles.admin.rolesPermissions');
    if (pathname.startsWith('/admin/users')) return t('header.titles.admin.userManagement');
    if (pathname.includes('pending-processor/view')) return t('header.titles.admin.pendingProcessorView') || t('header.titles.admin.pendingProcessor');
    if (pathname.includes('pending-processor')) return t('header.titles.admin.pendingProcessor');
    if (pathname.includes('pending-creator/view')) return t('header.titles.admin.pendingCreatorView') || t('header.titles.admin.pendingCreator');
    if (pathname.includes('pending-creator')) return t('header.titles.admin.pendingCreator');
    if (pathname.includes('pending-explainer/view')) return t('header.titles.admin.pendingExplainerView') || t('header.titles.admin.pendingExplainer');
    if (pathname.includes('pending-explainer')) return t('header.titles.admin.pendingExplainer');
    if (pathname.includes('sent-back-questions/view')) return t('header.titles.admin.sentBackQuestionsView') || t('admin.sentBackQuestions.view.title');
    if (pathname.includes('sent-back-questions')) return t('header.titles.admin.sentBackQuestions') || t('admin.questionBank.sentBackQuestions.title');
    if (pathname.startsWith('/admin/question-bank')) return t('header.titles.admin.questionBank');
    if (pathname.startsWith('/admin/question-management')) return t('header.titles.admin.questionManagement');
    if (pathname.startsWith('/admin/add-question')) return t('header.titles.admin.addQuestion');
    if (pathname.startsWith('/admin/question-details')) return t('header.titles.admin.questionDetails');
    if (pathname.startsWith('/admin/create-variant')) return t('header.titles.admin.createVariant');
    if (pathname.startsWith('/admin/classification')) return t('header.titles.admin.classification');
    if (pathname.startsWith('/admin/subscriptions')) return t('header.titles.admin.subscriptions');
    if (pathname.startsWith('/admin/reports')) return t('header.titles.admin.reports');
    if (pathname.startsWith('/admin/moderation')) return t('header.titles.admin.moderation');
    if (pathname.startsWith('/admin/settings')) return t('header.titles.admin.settings');
    if (pathname.startsWith('/admin/security')) return t('header.titles.admin.security');
    if (pathname.startsWith('/admin/approved-questions')) return t("admin.approvedQuestion.heading");
    return t('header.titles.admin.default');
  }
    // User dashboard routes
   if (pathname === "/dashboard")
    return t("dashboard.sidebar.dashboard");

  if (pathname.startsWith("/dashboard/practice"))
    return t("dashboard.sidebar.practiceSession");

  if (pathname.startsWith("/dashboard/analytics"))
    return t("dashboard.sidebar.performanceAnalytics");

  if (pathname.startsWith("/dashboard/review-incorrect"))
    return t("dashboard.sidebar.reviewIncorrect");

  if (pathname.startsWith("/dashboard/review-all"))
    return t("dashboard.sidebar.reviewAll");

  if (pathname.startsWith("/dashboard/review"))
    return t("dashboard.sidebar.reviewSessions");

  if (pathname.startsWith("/dashboard/session-summary"))
    return t("dashboard.sidebar.sessionSummary");

  if (pathname.startsWith("/dashboard/session"))
    return t("dashboard.sidebar.questionSession");

  if (pathname.startsWith("/dashboard/subscription-billings"))
    return t("dashboard.sidebar.subscriptionsBilling");

  if (pathname.startsWith("/dashboard/announcements"))
    return t("dashboard.sidebar.announcements");

  if (pathname.startsWith("/question-banks"))
    return "Question Bank";

  return t("dashboard.header.title");
  };

  const headerTitle = getTitleByPath(location.pathname);

  // Helper function to extract name from email
  const getNameFromEmail = (email) => {
    if (!email) return null;
    const emailPart = email.split('@')[0];
    if (!emailPart) return null;
    
    // Replace dots, underscores, and hyphens with spaces
    let name = emailPart.replace(/[._-]/g, ' ');
    
    // Capitalize first letter of each word
    name = name.split(' ').map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    return name.trim() || null;
  };

  // Get display name: use name if available, otherwise extract from email for students
  const getDisplayName = () => {
    // For superadmin, show "Admin"
    if (authUser?.role === 'superadmin') {
      return 'Admin';
    }
    
    // Check for name first (prefer name over fullName)
    if (authUser?.name && authUser.name.trim()) {
      // If name exists, use it (could be first name or full name)
      return authUser.name.trim();
    }
    
    // Check for fullName and use first name if available
    if (authUser?.fullName && authUser.fullName.trim()) {
      const firstName = authUser.fullName.trim().split(/\s+/)[0];
      if (firstName && firstName.length > 0) {
        return firstName;
      }
      // If splitting didn't work, return the fullName as is
      return authUser.fullName.trim();
    }
    
    // For students, if we're fetching user data, don't show email-derived name yet
    // Wait for the fetch to complete to see if we have a real name
    const isStudent = authUser?.role === 'user' || authUser?.role === 'student';
    if (isStudent && isFetchingUser) {
      // Return empty or a placeholder while fetching
      return '';
    }
    
    // Only extract from email if we're not fetching and name truly isn't available
    if (isStudent && authUser?.email && !isFetchingUser) {
      // Only use email extraction as absolute last resort
      const nameFromEmail = getNameFromEmail(authUser.email);
      if (nameFromEmail) {
        return nameFromEmail;
      }
    }
    
    return 'User';
  };

  // Get role display text using translations
  const getRoleDisplay = () => {
    let roleKey = '';
    
    if (authUser?.role === 'admin' && authUser?.adminRole) {
      roleKey = authUser.adminRole; // gatherer, creator, processor, explainer
    } else if (authUser?.role) {
      roleKey = authUser.role; // superadmin, user, student
    } else {
      roleKey = 'user';
    }

    // Get translated role based on current language
    const translatedRole = t(`header.roles.${roleKey}`);
    
    // Fallback to capitalized role name if translation not found
    if (translatedRole === `header.roles.${roleKey}`) {
      return roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
    }
    
    return translatedRole;
  };

  return (
    <>
      {/* Alert Cards for New Announcements */}
      {newAnnouncements.map((announcement) => (
        <AnnouncementAlertCard
          key={announcement.id}
          announcement={announcement}
          onClose={() => handleDismissAlert(announcement.id)}
          onRead={handleAnnouncementRead}
        />
      ))}
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[70.8px]">
      <div className="flex items-center justify-between px-4 md:px-8 h-full">
        {/* Left Side - Hamburger Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button - Mobile Only */}
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Toggle sidebar"
            >
              <img src={hamburger} alt="Menu" className="w-6 h-6" />
            </button>
          )}
          
          {/* Title */}
          <h1 className="text-lg md:text-[20px] text-oxford-blue leading-[100%] tracking-[0%] font-archivo font-[600]">
            {headerTitle}
          </h1>
        </div>

        {/* Right Side - Language, User */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="relative flex items-center bg-white rounded-full border border-gray-200 overflow-hidden w-[66px] h-[28px]"
          >
            <span
              className={`flex-1 flex items-center justify-center h-full transition-all duration-300 text-[10px] leading-[100%] font-dm-sans font-[500] ${
                language === 'en'
                  ? 'text-white bg-bluewhite-gradient'
                  : 'text-gray-700'
              }`}
            >
              EN
            </span>
            <span
              className={`flex-1 flex items-center justify-center h-full transition-all duration-300 text-[10px] leading-[100%] font-dm-sans font-[500] ${
                language === 'ar'
                  ? 'text-white bg-bluewhite-gradient'
                  : 'text-gray-700'
              }`}
            >
              عربي
            </span>
          </button>

          {/* User Info */}
          <div className="flex items-center relative" ref={menuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <img src={user} alt="User" className="" />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-[14px] text-oxford-blue leading-[100%] tracking-[0px] font-archivo font-[700]">
                {getDisplayName() || (isFetchingUser ? '...' : 'User')}
              </p>
              <p className="text-[12px] leading-[100%] tracking-[0px] text-left pt-1 pl-1 font-roboto font-[400] text-dark-gray">
                {getRoleDisplay()}
              </p>
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-[192px] h-auto bg-white border border-[#E5E7EB] rounded-lg shadow-header-dropdown z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2">
                  <button
                    onClick={handleSetting}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={settings} alt="Settings" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">Settings</span>
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick('My Profile');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={profile} alt="My Profile" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">My Profile</span>
                  </button> */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick('Logout');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={logout} alt="Logout" className="w-5 h-5" />
                    <span className="text-[14px] text-[#EF4444] font-roboto font-[400]">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
