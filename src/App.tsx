import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessDetails from './pages/BusinessDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminControl from './pages/AdminControl';
import SearchResults from './pages/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import FloatingActions from './components/FloatingActions';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-[#071126] text-white">
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
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-control"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminControl />
                  </ProtectedRoute>
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
            </Routes>
            <BottomNav />
            <FloatingActions />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
