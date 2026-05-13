import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import Notifications from './Notifications';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Logged out successfully', 'success');
      navigate('/');
    } catch {
      showToast('Error signing out', 'error');
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#categories', label: 'Categories' },
    { href: '#businesses', label: 'Businesses' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.hash === href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#071126]/80 backdrop-blur-lg border-b border-white/10 shadow-lg'
          : 'bg-[#071126]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#d4af37]">CityServices</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                    isActive(item.href) ? 'text-[#d4af37]' : 'text-white hover:text-[#d4af37]'
                  }`}
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#d4af37] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isActive(item.href) ? '100%' : 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Notifications />

                {/* User Avatar */}
                <div className="relative">
                  <button className="flex items-center space-x-2 text-white hover:text-[#d4af37] transition-colors">
                    <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  </button>
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-[#d4af37] transition-colors p-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="text-white hover:text-[#d4af37] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/register"
                  className="bg-[#d4af37] text-[#071126] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b8941f] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-[#d4af37] p-2 rounded-md transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#071126]/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href) ? 'text-[#d4af37] bg-white/10' : 'text-white hover:text-[#d4af37] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/10 mt-4 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] font-bold mr-3">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white">{user.email?.split('@')[0]}</span>
                    </div>
                    <Link
                      to={user.user_metadata?.role === 'business' ? '/business-dashboard' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-white hover:text-[#d4af37] hover:bg-white/5 rounded-md transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-white hover:text-[#d4af37] hover:bg-white/5 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 bg-[#d4af37] text-[#071126] rounded-md text-center font-medium hover:bg-[#b8941f] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;