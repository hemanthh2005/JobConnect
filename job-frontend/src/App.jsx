import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationContainer from './components/NotificationContainer';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import UploadResume from './pages/UploadResume';
import ApplyJobLink from './pages/ApplyJobLink';
import StudentLogin from './pages/StudentLogin';
import StudentProfile from './pages/StudentProfile';

// Layout wrapper component
const Layout = ({ children, role }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { userRole } = useApp();

  if (!userRole) {
    return <Navigate to="/student/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  const { userRole } = useApp();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/student/login" element={<StudentLogin />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <Jobs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <Applications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <ApplyJobLink />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/upload-resume"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <UploadResume />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <Layout role="student">
                <StudentProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={userRole ? '/student/dashboard' : '/student/login'} replace />}
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      
    </AppProvider>
  );
}

export default App;
