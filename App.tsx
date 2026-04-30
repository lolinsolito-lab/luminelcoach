
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WelcomePage from './components/WelcomePage';
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
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/"
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
