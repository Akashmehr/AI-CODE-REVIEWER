import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Layout/Navbar'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'

// ─── PROTECTED ROUTE ─────────────────────────────────────────
// Wraps pages that require login
// If not logged in → redirect to /login
// If logged in → show the page
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
    // Navigate = immediate redirect, no page shown
  }

  return children; // User is logged in, show the page
};

// ─── APP ROUTES ───────────────────────────────────────────────
// Separated so we can use useAuth() inside
// (useAuth needs to be inside AuthProvider)
const AppRoutes = () => (
  <>
    {/* Navbar shows on ALL pages */}
    <Navbar />

    <Routes>
      {/* / → redirect to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Public routes — anyone can access */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes — must be logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all — redirect unknown URLs to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </>
);

// ─── MAIN APP ─────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    {/* AuthProvider wraps everything so all components */}
    {/* can access user/login/logout via useAuth() */}
    <AuthProvider>
      {/* Toaster shows toast notifications anywhere in app */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,  // Auto dismiss after 3 seconds
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;