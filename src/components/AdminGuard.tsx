import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'azizalipcff@gmail.com';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
