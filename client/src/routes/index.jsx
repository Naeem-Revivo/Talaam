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
import AuthCallbackPage from '../pages/AuthCallbackPage';
import MoyassarPaymentPage from '../pages/MoyassarPaymentPage';
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
import { PublicRoute } from './PublicRoute';
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
import SubscriptionTrendsPage from '../pages/admin/SubscriptionTrendsPage';
import SubscriptionPlanPage from '../pages/admin/SubscriptionPlanPage';
import AddNewPlanPage from '../pages/admin/AddNewPlanPage';
import ManageUserSubscriptionsPage from '../pages/admin/ManageUserSubscriptionsPage';
import SubscriptionDetailsPage from '../pages/admin/SubscriptionDetailsPage';
import PaymentHistoryPage from '../pages/admin/PaymentHistoryPage';
import CreateNewQuestionBankPage from '../pages/admin/CreateNewQuestionBankPage';
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
import GathererLayout from '../components/gatherer/GathererLayout';
import GathererDashboard from '../pages/Gatherer/GathererDashboard';
import GathererQuestionBank from '../pages/Gatherer/GathererQuestionBank';
import GathererAddNewQuestionPage from '../pages/Gatherer/GathererAddNewQuestion';
import GathererEditQuestionPage from '../pages/Gatherer/GathererEditQuestion';
import GathererQuestionDetailsPage from '../pages/Gatherer/GathererQuestionDetail';
import ProcessorDashboard from '../pages/Processor/ProcessorDashboard';
import ProcessorLayout from '../components/Processor/ProcessorLayout';
import AllProcessedQuestion from '../pages/Processor/AllProcessedQuestion';
import GathererSubmission from '../pages/Processor/GathererSubmission';
import ExplainerSubmission from '../pages/Processor/ExplainerSubmission';
import AdminSubmission from '../pages/Processor/AdminSubmission';
import CreaterSubmission from '../pages/Processor/CreatorSubmission';
import ProcessorViewQuestion from '../pages/Processor/ProcessorViewQuestion';
import CreatorLayout from '../components/creator/CreatorLayout';
import CreatorDashboard from '../pages/Creator/CreatorDashboard';
import CreatorQuestionBank from '../pages/Creator/CreatorQuestionBank';
import AssignedQuestionPage from '../pages/Creator/AssignedQuestionPage';
import CompletedQuestionPage from '../pages/Creator/CompletedQuestionPage';
import CreatorVariantsPage from '../pages/Creator/CreatorVariantsPage';
import ExplainerDashboard from '../pages/Explainer/ExplainerDashbaord';
import ExplainerLayout from '../components/explainer/ExplainerLayout';
import ExplainerQuestionBank from '../pages/Explainer/ExplainerQuestionBank';
import AddExplanationPage from '../pages/Explainer/AddExplanationPage';
import CompletedExplanationPage from '../pages/Explainer/CompletedExplanation';
import DraftExplanationPage from '../pages/Explainer/DraftExplanation';
import AccountSettingPage from '../pages/dashboard/AccountSettingPage';
import ProcessorQuestionBank from '../pages/Processor/ProcessorQuestionBank';
import SubscriptionBillingPage from '../pages/dashboard/SubscriptionBillingPage';
import GathererProfile from '../pages/Gatherer/GathererProfile';
import CreatorProfile from '../pages/Creator/CreatorProfile';
import ProcessorProfile from '../pages/Processor/ProcessorProfile';
import ExplainerProfile from '../pages/Explainer/ExplainerProfile';
import AddNewExam from '../pages/admin/AddNewExam';
import EditExam from '../pages/admin/EditExam';
import EditSubject from '../pages/admin/EditSubject';
import EditTopic from '../pages/admin/EditTopic';
import CreatorViewVariant from '../pages/Creator/CreatorViewVariant';
import CreatorVariantsListPage from '../pages/Creator/CreatorVariantsListPage';
import CreatorViewQuestion from '../pages/Creator/CreatorViewQuestion';
import ApprovedQuestions from '../pages/admin/ApprovedQuestions';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/question-banks" element={<QuestionBankPage />} />
      {/* Public Auth Routes - Redirect authenticated users to dashboard */}
      <Route element={<PublicRoute />}>
        <Route path="/signupfree" element={<SignUpFreePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-modal" element={<ForgotModalPage />} />
        <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
      </Route>
      
      {/* Profile page - can be accessed by authenticated users or during signup flow */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/moyassar-payment" element={<MoyassarPaymentPage />} />
      
      {/* Dashboard Routes (User) */}
      <Route element={<RoleRoute allow={['user']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="setting" element={<AccountSettingPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="subscription-billings" element={<SubscriptionBillingPage />} />
        </Route>
        {/* Review Pages - No sidebar */}
        <Route path="/dashboard/review-incorrect" element={<ReviewIncorrectPage />} />
        <Route path="/dashboard/review-all" element={<ReviewAllPage />} />
        <Route path="/dashboard/session" element={<QuestionSessionPage />} />
        <Route path="/dashboard/session-summary" element={<QuestionSessionSummaryPage />} />
      </Route>
      
      {/* Admin Routes - Only for admin/superadmin without adminRole */}
      <Route element={<RoleRoute allow={['admin', 'superadmin']} />}>
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
          <Route path="classification/add-exam" element={<AddNewExam />} />
          <Route path="classification/edit-exam/:examId" element={<EditExam />} />
          <Route path="classification/edit-subject/:subjectId" element={<EditSubject />} />
          <Route path="classification/edit-topic/:topicId" element={<EditTopic />} />
          <Route path="question-bank" element={<AdminQuestionBankPage />} />
          <Route path="question-management" element={<QuestionManagementPage />} />
          <Route path="question-bank/add-question" element={<AddNewQuestionPage />} />
          <Route path="question-bank/question-details" element={<QuestionDetailsPage />} />
          <Route path="create-variant" element={<CreateVariantPage />} />
          <Route path="variant-question-review" element={<VariantQuestionReviewPage />} />
          <Route path="subscriptions" element={<SubscriptionPlanPage />} />
          <Route path="reports" element={<ReportsAndAnalyticsPage />} />
          <Route path="reports/subscription-trends" element={<SubscriptionTrendsPage />} />
          <Route path="reports/export" element={<ExportReportsPage />} />
          <Route path="moderation" element={<ContentModerationPage />} />
          <Route path="moderation/details/:questionId" element={<ContentDetailsPage />} />
          <Route path="settings" element={<SystemSettingPlan />} />
          <Route path="settings/language-management" element={<LanguageManagement />} />
          <Route path="settings/roles-permissions" element={<AdminRolePermissions />} />
          <Route path="settings/announcements" element={<SiteWideAnnouncements />} />
          <Route path="settings/add-announcements" element={<AddNewAnnouncements />} />
          <Route path="settings/edit-announcements" element={<EditAnnouncementPage />} />
          <Route path="settings/email-template" element={<EmailTemplatePage />} />
          <Route path="security" element={<SecuritySettingsPage />} />
          <Route path="security/audit-logs" element={<AuditLogsPage />} />
          <Route path="security/view-logs" element={<ViewLogDetails />} />
          <Route path="security/roles-permissions" element={<RolesPermissionsPage />} />
          <Route path="approved-questions" element={<ApprovedQuestions />} />
        </Route>
      </Route>

      {/* Gatherer Routes - Allow gatherer role or admin with gatherer adminRole */}
      <Route element={<RoleRoute allow={['gatherer']} />}>
        <Route path="/gatherer" element={<GathererLayout />}>
          <Route index element={<GathererDashboard />} />
          <Route path="profile" element={<GathererProfile />} />
          <Route path="question-bank" element={<GathererQuestionBank />} />
          <Route path="question-bank/Gatherer-addQuestion" element={<GathererAddNewQuestionPage />} />
          <Route path="question-bank/Gatherer-editQuestion/:questionId" element={<GathererEditQuestionPage />} />
          <Route path="question-bank/Gatherer-QuestionDetail/:questionId" element={<GathererQuestionDetailsPage />} />
          <Route path="question-bank/Gatherer-QuestionDetail" element={<GathererQuestionDetailsPage />} />
          {/* Add gatherer specific routes here */}
        </Route>
      </Route>

      {/* Processor Routes - Allow processor role or admin with processor adminRole */}
      <Route element={<RoleRoute allow={['processor']} />}>
        <Route path="/processor" element={<ProcessorLayout />}>
          <Route index element={<ProcessorDashboard />} />
          <Route path="profile" element={<ProcessorProfile />} />
          <Route path="question-bank" element={<ProcessorQuestionBank />} />
          <Route path="question-bank/Processed-Question" element={<AllProcessedQuestion />} />
          <Route path="Processed-ViewQuestion" element={<ProcessorViewQuestion />} />
          <Route path="question-bank/gatherer-submission" element={<GathererSubmission />} />
          <Route path="question-bank/explainer-submission" element={<ExplainerSubmission />} />
          <Route path="question-bank/admin-submission" element={<AdminSubmission />} />
          <Route path="question-bank/creator-submission" element={<CreaterSubmission />} />
        </Route>
      </Route>

      {/* Creator Routes - Allow creator role or admin with creator adminRole */}
      <Route element={<RoleRoute allow={['creator']} />}>
        <Route path="/creator" element={<CreatorLayout />}>
          <Route index element={<CreatorDashboard />} />
          <Route path="profile" element={<CreatorProfile />} />
          <Route path="question-bank" element={<CreatorQuestionBank />} />
          <Route path="question-bank/assigned-question" element={<AssignedQuestionPage />} />
          <Route path="question-bank/completed-question" element={<CompletedQuestionPage />} />
          <Route path="question-bank/create-variants" element={<CreatorVariantsPage />} />
          <Route path="question-bank/edit-variant" element={<CreatorVariantsPage />} />
          <Route path="question-bank/view-variant" element={<CreatorViewVariant />} />
          <Route path="question-bank/variants-list" element={<CreatorVariantsListPage />} />
          <Route path="question-bank/question/:questionId" element={<CreatorViewQuestion />} />
        </Route>
      </Route>

      {/* Explainer Routes - Allow explainer role or admin with explainer adminRole */}
      <Route element={<RoleRoute allow={['explainer']} />}>
        <Route path="/explainer" element={<ExplainerLayout />}>
          <Route index element={<ExplainerDashboard />} />
          <Route path="profile" element={<ExplainerProfile />} />
          <Route path="question-bank" element={<ExplainerQuestionBank />} />
          <Route path="question-bank/add-explanation" element={<AddExplanationPage />} />
          <Route path="question-bank/completed-explanation" element={<CompletedExplanationPage />} />
          <Route path="question-bank/draft-explanation" element={<DraftExplanationPage />} />
        </Route>
      </Route>
      
    </Routes>
  );
};

