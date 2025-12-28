import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LostFound from './pages/LostFound';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BulkUploadPage from './pages/admin/BulkUploadPage';
import MeetingPage from './pages/admin/MeetingPage';
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildProgress from './pages/parent/ChildProgress';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AttendancePage from './pages/AttendancePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import TransportPage from './pages/TransportPage';
import HostelPage from './pages/HostelPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import AcademicsPage from './pages/AcademicsPage';
import FinancePage from './pages/FinancePage';
import UserManagementPage from './pages/UserManagementPage';
import MarksEntryPage from './pages/MarksEntryPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import StudentInsightsPage from './pages/StudentInsightsPage';
import FeeStatusPage from './pages/FeeStatusPage';
import StudentExamsPage from './pages/student/StudentExamsPage';
import CreateExamPage from './pages/admin/CreateExamPage';
import TakeExamPage from './pages/student/TakeExamPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import ManageApplicationsPage from './pages/admin/ManageApplicationsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import PlaceholderPage from './components/PlaceholderPage';
import { Users, BookOpen, Calendar, FileText, DollarSign, Bus, Home, Bell, Settings } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role-Based Redirect Component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'faculty':
      return <Navigate to="/dashboard/faculty" replace />;
    case 'parent':
      return <Navigate to="/dashboard/parent" replace />;
    case 'student':
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<RoleBasedRedirect />} />
              <Route path="student" element={<StudentDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/bulk-upload" element={<BulkUploadPage />} />
              <Route path="admin/meetings" element={<MeetingPage />} />
              <Route path="admin/gallery" element={<AdminGalleryPage />} />
              <Route path="parent" element={<ParentDashboard />} />
              <Route path="faculty" element={<FacultyDashboard />} />
              <Route path="lost-found" element={<LostFound />} />

              {/* Placeholder Routes */}
              <Route path="users" element={<UserManagementPage />} />
              <Route path="academics" element={<AcademicsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="marks" element={<MarksEntryPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="fees" element={<FeeStatusPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="transport" element={<TransportPage />} />
              <Route path="hostel" element={<HostelPage />} />
              <Route path="communication" element={<AnnouncementsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="notices" element={<AnnouncementsPage />} />
              <Route path="messages" element={<AnnouncementsPage />} />
              <Route path="materials" element={<StudyMaterialPage />} />
              <Route path="students" element={<StudentInsightsPage />} />
              <Route path="child" element={<ChildProgress />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="student/exams" element={<StudentExamsPage />} />
              <Route path="admin/create-exam" element={<CreateExamPage />} />
              <Route path="exam/:id" element={<TakeExamPage />} />
              <Route path="student/applications" element={<ApplicationsPage />} />
              <Route path="admin/applications" element={<ManageApplicationsPage />} />

              {/* Catch all for dashboard */}
              <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist." />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
