import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionReady(!!data.session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords must match', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      if (data.user) {
        setSuccess(true);
        showToast('Password updated successfully', 'success');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to reset password';
      showToast(message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-300">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold">Password Reset Complete</h1>
                <p className="text-gray-300">Your account password has been updated successfully. You can now sign in with your new password.</p>
                <button onClick={() => navigate('/login')} className="mt-4 w-full rounded-2xl bg-[#d4af37] py-3 text-[#071126] font-semibold hover:bg-[#b8941f] transition-colors">Go to Login</button>
              </div>
            ) : (
              <div className="space-y-6">
                <Link to="/login" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#b8941f]">
                  <ArrowLeft className="w-5 h-5" /> Back to Sign In
                </Link>
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Reset Password</h1>
                  <p className="mt-2 text-gray-400">Set a new password for your account.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 rounded-2xl bg-[#071126] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        placeholder="Create a new password"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 rounded-2xl bg-[#071126] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        placeholder="Confirm your new password"
                      />
                      <button type="button" onClick={() => setShowConfirm((value) => !value)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#d4af37] py-3 text-[#071126] font-semibold hover:bg-[#b8941f] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save New Password'}
                </button>
                {!sessionReady && (
                  <p className="text-sm text-gray-400">You may need to open the reset link from your email to continue. If you do not have an active session, log in again or request another password reset.</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
