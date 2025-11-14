import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import HowItWorksPage from '../pages/HowItWorksPage';
import ProductsPage from '../pages/ProductsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import QuestionBankPage from '../pages/QuestionBankPage';
import SignUpFreePage from '../pages/SignUpFreePage';
import CreateAccountPage from '../pages/CreateAccountPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotModalPage from '../pages/ForgotModalPage';
import SetNewPasswordPage from '../pages/SetNewPasswordPage';
import PasswordResetPage from '../pages/PasswordResetPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import PracticePage from '../pages/dashboard/PracticePage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import ReviewPage from '../pages/dashboard/ReviewPage';
import ReviewIncorrectPage from '../pages/dashboard/ReviewIncorrectPage';
import ReviewAllPage from '../pages/dashboard/ReviewAllPage';
import QuestionSessionPage from '../pages/dashboard/QuestionSessionPage';
import QuestionSessionSummaryPage from '../pages/dashboard/QuestionSessionSummaryPage';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import AddUserPage from '../pages/admin/AddUserPage';
import EditUserPage from '../pages/admin/EditUserPage';
import UserDetailPage from '../pages/admin/UserDetailPage';
import { RoleRoute } from './ProtectedRoute';
import ClassificationManagement from '../pages/admin/ClassificationManagementPage';
import AdminQuestionBankPage from '../pages/admin/QuestionBankPage';
import AddSubjectPage from '../pages/admin/AddSubjectPage';
import AddTopicPage from '../pages/admin/AddTopicPage';
import AddSubTopicPage from '../pages/admin/AddSubTopicPage';
import AddConceptPage from '../pages/admin/AddConceptPage';
import SystemSettingPlan from '../pages/admin/SystemSettingPage';
import SiteWideAnnouncements from '../pages/admin/SiteWideAnnouncements';
import AdminRolePermissions from '../pages/admin/AdminRolePermissionsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/question-banks" element={<QuestionBankPage />} />
      <Route path="/signupfree" element={<SignUpFreePage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/forgot-modal" element={<ForgotModalPage />} />
      <Route path="/set-new-password" element={<SetNewPasswordPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      
      {/* Dashboard Routes (User) */}
      <Route element={<RoleRoute allow={['user']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
        {/* Review Pages - No sidebar */}
        <Route path="/dashboard/review-incorrect" element={<ReviewIncorrectPage />} />
        <Route path="/dashboard/review-all" element={<ReviewAllPage />} />
        <Route path="/dashboard/session" element={<QuestionSessionPage />} />
        <Route path="/dashboard/session-summary" element={<QuestionSessionSummaryPage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<RoleRoute allow={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          {/* Placeholder child routes for the admin sidebar items */}
          <Route path="users" element={<UserManagementPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="users/:id/edit" element={<EditUserPage />} />
          <Route path="question-bank" element={<AdminDashboardPage />} />
          <Route path="classification" element={<ClassificationManagement />} />
          <Route path="subscriptions/add-subject" element={<AddSubjectPage/>} />
          <Route path="subscriptions/add-topic" element={<AddTopicPage />} />
          <Route path="subscriptions/add-subtopic" element={<AddSubTopicPage />} />
          <Route path="subscriptions/add-concept" element={<AddConceptPage />} />
          <Route path="question-bank" element={<AdminQuestionBankPage />} />
          <Route path="subscriptions" element={<AdminDashboardPage />} />
          <Route path="reports" element={<AdminDashboardPage />} />
          <Route path="moderation" element={<AdminDashboardPage />} />
          <Route path="settings" element={<SystemSettingPlan />} />
          <Route path="rolesandpermissions" element={<AdminRolePermissions />} />
          <Route path="announcements" element={<SiteWideAnnouncements />} />
          <Route path="security" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

