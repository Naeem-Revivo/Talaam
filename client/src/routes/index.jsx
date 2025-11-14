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
import QuestionManagementPage from '../pages/admin/QuestionManagementPage';
import AddNewQuestionPage from '../pages/admin/AddNewQuestionPage';
import QuestionDetailsPage from '../pages/admin/QuestionDetailsPage';
import CreateVariantPage from '../pages/admin/CreateVariantPage';
import VariantQuestionReviewPage from '../pages/admin/VariantQuestionReviewPage';
import AddSubjectPage from '../pages/admin/AddSubjectPage';
import AddTopicPage from '../pages/admin/AddTopicPage';
import AddSubTopicPage from '../pages/admin/AddSubTopicPage';
import AddConceptPage from '../pages/admin/AddConceptPage';
import ReportsAndAnalyticsPage from '../pages/admin/ReportsAndAnalyticsPage';
import UserGrowthAnalyticsPage from '../pages/admin/UserGrowthAnalyticsPage';
import SubscriptionTrendsPage from '../pages/admin/SubscriptionTrendsPage';
import SubscriptionPlanPage from '../pages/admin/SubscriptionPlanPage';
import AddNewPlanPage from '../pages/admin/AddNewPlanPage';
import ManageUserSubscriptionsPage from '../pages/admin/ManageUserSubscriptionsPage';
import SubscriptionDetailsPage from '../pages/admin/SubscriptionDetailsPage';
import PaymentHistoryPage from '../pages/admin/PaymentHistoryPage';
import CreateNewQuestionBankPage from '../pages/admin/CreateNewQuestionBankPage';
import PerformanceAnalyticsPage from '../pages/admin/PerformanceAnalyticsPage';
import ExportReportsPage from '../pages/admin/ExportReportsPage';
import ContentModerationPage from '../pages/admin/ContentModerationPage';
import ContentDetailsPage from '../pages/admin/ContentDetailsPage';
import SystemSettingPlan from '../pages/admin/SystemSettingPage';
import SiteWideAnnouncements from '../pages/admin/SiteWideAnnouncements';
import AdminRolePermissions from '../pages/admin/AdminRolePermissionsPage';
import LanguageManagement from '../pages/admin/LanguageManagement';
import EmailTemplatePage from '../pages/admin/EmailTemplatePage';
import AddNewAnnouncements from '../pages/admin/AddNewAnnouncements';
import EditAnnouncementPage from '../pages/admin/EditAnnouncementPage';
import SecuritySettingsPage from '../pages/admin/SecurityPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';
import RolesPermissionsPage from '../pages/admin/RolesPermissionsPage';
import ViewLogDetails from '../pages/admin/ViewLogsDetailPage';

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
          <Route path="classification" element={<ClassificationManagement />} />
          <Route path="subscriptions/add-subject" element={<AddSubjectPage/>} />
          <Route path="subscriptions/add-topic" element={<AddTopicPage />} />
          <Route path="subscriptions/add-subtopic" element={<AddSubTopicPage />} />
          <Route path="subscriptions/add-concept" element={<AddConceptPage />} />
          <Route path="subscriptions/add-plan" element={<AddNewPlanPage />} />
          <Route path="subscriptions/edit-plan" element={<AddNewPlanPage />} />
          <Route path="subscriptions/new-plan" element={<AddNewPlanPage />} />
          <Route path="subscriptions/manage-users" element={<ManageUserSubscriptionsPage />} />
          <Route path="subscriptions/details" element={<SubscriptionDetailsPage />} />
          <Route path="subscriptions/payment-history" element={<PaymentHistoryPage />} />
          <Route path="subscriptions/new-question-bank" element={<CreateNewQuestionBankPage />} />
          <Route path="classification/add-subject" element={<AddSubjectPage/>} />
          <Route path="classification/add-topic" element={<AddTopicPage />} />
          <Route path="classification/add-subtopic" element={<AddSubTopicPage />} />
          <Route path="classification/add-concept" element={<AddConceptPage />} />
          <Route path="question-bank" element={<AdminQuestionBankPage />} />
          <Route path="question-management" element={<QuestionManagementPage />} />
          <Route path="add-question" element={<AddNewQuestionPage />} />
          <Route path="question-details" element={<QuestionDetailsPage />} />
          <Route path="create-variant" element={<CreateVariantPage />} />
          <Route path="variant-question-review" element={<VariantQuestionReviewPage />} />
          <Route path="subscriptions" element={<SubscriptionPlanPage />} />
          <Route path="reports" element={<ReportsAndAnalyticsPage />} />
          <Route path="reports/user-growth" element={<UserGrowthAnalyticsPage />} />
          <Route path="reports/subscription-trends" element={<SubscriptionTrendsPage />} />
          <Route path="reports/performance-analytics" element={<PerformanceAnalyticsPage />} />
          <Route path="reports/export" element={<ExportReportsPage />} />
          <Route path="subscriptions" element={<AdminDashboardPage />} />
          <Route path="reports" element={<ReportsAndAnalyticsPage />} />
          <Route path="moderation" element={<ContentModerationPage />} />
          <Route path="moderation/details" element={<ContentDetailsPage />} />
          <Route path="reports" element={<AdminDashboardPage />} />
          <Route path="moderation" element={<AdminDashboardPage />} />
          <Route path="settings" element={<SystemSettingPlan />} />
          <Route path="settings/language-management" element={<LanguageManagement />} />
          <Route path="settings/roles-permissions" element={<AdminRolePermissions />} />
          <Route path="settings/announcements" element={<SiteWideAnnouncements />} />
          <Route path="settings/add-announcements" element={<AddNewAnnouncements />} />
          <Route path="settings/edit-announcements" element={<EditAnnouncementPage />} />
          <Route path="settings/email-template" element={<EmailTemplatePage />} />
          <Route path="security" element={<AdminDashboardPage />} />
          <Route path="security" element={<SecuritySettingsPage />} />
          <Route path="security/audit-logs" element={<AuditLogsPage />} />
          <Route path="security/view-logs" element={<ViewLogDetails />} />
          <Route path="security/roles-permissions" element={<RolesPermissionsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

