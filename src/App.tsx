import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/Toast';
import AdminGuard from './components/AdminGuard';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./auth/ResetPassword'));
const UserDashboard = lazy(() => import('./dashboard/UserDashboard'));
const BusinessDashboard = lazy(() => import('./business/BusinessDashboard'));
const BusinessManagement = lazy(() => import('./business/BusinessManagement'));
const BusinessDetails = lazy(() => import('./business/BusinessDetails'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminControl = lazy(() => import('./admin/AdminControl'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const BottomNav = lazy(() => import('./components/BottomNav'));
const FloatingActions = lazy(() => import('./components/FloatingActions'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#071126] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-[#071126] text-white">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/business/:id" element={<BusinessDetails />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminGuard>
                        <AdminDashboard />
                      </AdminGuard>
                    }
                  />
                  <Route
                    path="/admin-control"
                    element={
                      <AdminGuard>
                        <AdminControl />
                      </AdminGuard>
                    }
                  />
                  <Route
                    path="/user-dashboard"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business-dashboard"
                    element={
                      <ProtectedRoute requiredRole="business">
                        <BusinessDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business-management"
                    element={
                      <ProtectedRoute requiredRole="business">
                        <BusinessManagement />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <BottomNav />
                <FloatingActions />
              </Suspense>
            </div>
          </Router>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
