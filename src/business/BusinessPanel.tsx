import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { businessService } from '../lib/businessService';

interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  whatsapp: string;
  image?: string;
  rating: number;
  reviews_count: number;
  approved: boolean;
  created_at: string;
}

const BusinessPanel = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Business>>({});

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a proper owner-based query
      // In a real implementation, you'd filter by owner_id
      const mockBusinesses: Business[] = [
        {
          id: '1',
          name: 'Plombier Oujda',
          category: 'Plumbing',
          city: 'Oujda',
          description: 'Professional plumbing services',
          whatsapp: '0659785764',
          image: '/api/placeholder/business1.jpg',
          rating: 4.5,
          reviews_count: 12,
          approved: true,
          created_at: '2024-01-15T10:30:00Z'
        }
      ];
      setBusinesses(mockBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      showToast('Failed to fetch your businesses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setEditForm(business);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBusiness || !editForm) return;

    try {
      const updatedBusiness = { ...selectedBusiness, ...editForm };
      // In a real implementation, you'd update the database
      setBusinesses(prev => 
        prev.map(b => b.id === selectedBusiness.id ? updatedBusiness : b)
      );
      setShowEditModal(false);
      showToast('Business updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update business', 'error');
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      // In a real implementation, you'd delete from the database
      setBusinesses(prev => prev.filter(b => b.id !== businessId));
      showToast('Business deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete business', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Signed out successfully', 'success');
    } catch (error) {
      showToast('Failed to sign out', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading your businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Business Dashboard</h1>
                <p className="text-gray-300">Manage your business listings</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-[#d4af37]" />
                <span className="text-3xl font-bold">{businesses.length}</span>
              </div>
              <p className="text-gray-400">Total Businesses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold">{businesses.filter(b => b.approved).length}</span>
              </div>
              <p className="text-gray-400">Approved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold">
                  {businesses.length > 0 
                    ? (businesses.reduce((acc, b) => acc + b.rating, 0) / businesses.length).toFixed(1)
                    : '0.0'
                  }
                </span>
              </div>
              <p className="text-gray-400">Avg Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold">
                  {businesses.reduce((acc, b) => acc + b.reviews_count, 0)}
                </span>
              </div>
              <p className="text-gray-400">Total Reviews</p>
            </div>
          </motion.div>

          {/* Businesses List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {businesses.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Businesses Yet</h3>
                <p className="text-gray-400 mb-4">You haven't added any businesses to your dashboard.</p>
                <button className="bg-[#d4af37] text-[#071126] px-6 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors">
                  Add Your First Business
                </button>
              </div>
            ) : (
              businesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                >
                  <div className="flex items-start gap-6">
                    {/* Business Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {business.image ? (
                        <img 
                          src={business.image} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/business-default.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Business Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{business.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {business.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {business.category}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{business.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <StarRating rating={business.rating} showCount reviewCount={business.reviews_count} size="sm" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              business.approved 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                            }`}>
                              {business.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditBusiness(business)}
                            className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business.id)}
                            className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {business.whatsapp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Added {new Date(business.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#071126] border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Edit Business</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={editForm.whatsapp || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-[#d4af37] text-[#071126] py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-white/10 border border-white/20 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BusinessPanel;
