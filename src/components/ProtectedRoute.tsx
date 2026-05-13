import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'business' | 'admin';
}

const ADMIN_EMAIL = 'azizalipcff@gmail.com';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin route protection - only azizalipcff@gmail.com can access admin routes
  if (requiredRole === 'admin') {
    if (!profile || profile.role !== 'admin' || user.email !== ADMIN_EMAIL) {
      return <Navigate to="/" replace />;
    }
  }

  if (requiredRole) {
    if (requiredRole === 'business' && (!profile || profile.role !== 'business')) {
      return <Navigate to="/user-dashboard" replace />;
    }
    if (requiredRole === 'user' && (!profile || profile.role !== 'user')) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;