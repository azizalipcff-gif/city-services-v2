import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Star, Bell, Settings, LogOut, MapPin, Calendar, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'saved', label: 'Saved Businesses', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const savedBusinesses = [
    {
      id: 1,
      name: 'Oujda Tech Repair',
      category: 'PC Repair',
      rating: 4.8,
      location: 'Oujda, Morocco',
      image: 'https://via.placeholder.com/150x100/071126/d4af37?text=Tech+Repair'
    },
    {
      id: 2,
      name: 'Smart WiFi Oujda',
      category: 'WiFi & Internet',
      rating: 4.9,
      location: 'Oujda, Morocco',
      image: 'https://via.placeholder.com/150x100/071126/d4af37?text=WiFi'
    }
  ];

  const reviews = [
    {
      id: 1,
      business: 'Oujda Tech Repair',
      rating: 5,
      comment: 'Excellent service! Fixed my laptop quickly and professionally.',
      date: '2024-01-15'
    },
    {
      id: 2,
      business: 'Atlas Phone Repair',
      rating: 4,
      comment: 'Good service, but took a bit longer than expected.',
      date: '2024-01-10'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'review',
      message: 'Oujda Tech Repair responded to your review',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'update',
      message: 'New businesses added in your area',
      time: '1 day ago',
      unread: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#d4af37] fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">John Doe</h3>
                  <p className="text-gray-400">john.doe@example.com</p>
                  <p className="text-[#d4af37]">User Account</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+212 600 000 000"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    defaultValue="Oujda"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
              </div>
              <button className="mt-6 bg-[#d4af37] text-[#071126] px-6 py-2 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors">
                Save Changes
              </button>
            </div>
          </motion.div>
        );

      case 'saved':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Saved Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedBusinesses.map((business) => (
                <div key={business.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <img src={business.image} alt={business.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{business.name}</h3>
                  <p className="text-[#d4af37] mb-2">{business.category}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(business.rating)}
                    <span className="text-white">{business.rating}</span>
                  </div>
                  <p className="text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {business.location}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'reviews':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">My Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{review.business}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 ${notification.unread ? 'border-[#d4af37]' : 'border-white/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-[#d4af37]' : 'bg-gray-600'}`} />
                    <div className="flex-1">
                      <p className="text-white">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-1">{notification.time}</p>
                    </div>
                    {notification.type === 'review' && (
                      <MessageCircle className="w-5 h-5 text-[#d4af37]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-[#d4af37] bg-white/5 border-white/10 rounded focus:ring-[#d4af37]" />
                      <span className="ml-3 text-gray-300">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#d4af37] bg-white/5 border-white/10 rounded focus:ring-[#d4af37]" />
                      <span className="ml-3 text-gray-300">Push notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#d4af37] bg-white/5 border-white/10 rounded focus:ring-[#d4af37]" />
                      <span className="ml-3 text-gray-300">SMS notifications</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                      Privacy Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#071126]">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#d4af37] text-[#071126]'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>

                <div className="border-t border-white/10 mt-6 pt-6">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;