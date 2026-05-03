
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WelcomePage from './components/WelcomePage';
import LandingPage from './components/LandingPage';
import IntroScreen from './components/IntroScreen';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import PlansPage from './components/PlansPage';

import CommunityPage from './components/CommunityPage';
import ChatPage from './components/ChatPage';
import CallPage from './components/CallPage';
import ProfilePage from './components/ProfilePage';
import CalendarPage from './components/CalendarPage';
import SettingsPage from './components/SettingsPage';
import ExperiencesPage from './components/ExperiencesPage';
import QuestsPage from './components/QuestsPage';
import CouncilPage from './pages/CouncilPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EmotionalStateProvider } from './contexts/EmotionalStateContext';
import { ZenAudioProvider } from './contexts/ZenAudioContext';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const LandingWrapper: React.FC = () => {
  const [introDone, setIntroDone] = React.useState(
    !!localStorage.getItem('luminel_intro_seen')
  );

  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE') {
        localStorage.setItem('luminel_intro_seen', 'true');
        setIntroDone(true);
        // La navigazione reale viene gestita da LandingPage via postMessage
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  if (!introDone) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#000' }}>
        <iframe
          src="/luminel-intro.html?v=7"
          title="Luminel Awakening"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    );
  }

  return <LandingPage />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingWrapper />} />
      <Route path="/intro" element={<IntroScreen />} />
      <Route path="/onboarding" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/experiences"
        element={
          <RequireAuth>
            <Layout>
              <ExperiencesPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <Layout>
              <ChatPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/call"
        element={
          <RequireAuth>
            <Layout>
              <CallPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/quests"
        element={
          <RequireAuth>
            <Layout>
              <QuestsPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <Layout>
              <CoursesPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <RequireAuth>
            <Layout>
              <CourseDetailPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/community"
        element={
          <RequireAuth>
            <Layout>
              <CommunityPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Layout>
              <ProfilePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/calendar"
        element={
          <RequireAuth>
            <Layout>
              <CalendarPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/plans"
        element={
          <RequireAuth>
            <Layout>
              <PlansPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/my-journey"
        element={
          <RequireAuth>
            <Layout>
              <CalendarPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/council"
        element={
          <RequireAuth>
            <Layout>
              <CouncilPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Layout>
              <SettingsPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ZenAudioProvider>
            <EmotionalStateProvider>
              <ProgressProvider>
                <AppRoutes />
              </ProgressProvider>
            </EmotionalStateProvider>
          </ZenAudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
