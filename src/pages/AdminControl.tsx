import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Trash2,
  Building2,
  MapPin,
  Star,
  Calendar,
  Shield,
  Crown,
  RefreshCcw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adminService } from '../lib/businessService';
import { useToast } from '../components/Toast';

interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  approved: boolean;
  verified: boolean;
  featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  owner_id: string;
  image?: string;
  whatsapp?: string;
  address?: string;
}

const AdminControl = () => {
  const { loading } = useAuth();
  const { showToast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoadingData(true);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const fetchPromise = adminService.getAllBusinesses();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const businesses = data || [];
      console.log('Fetched businesses:', businesses.length);
      setBusinesses(businesses);
      setFilteredBusinesses(businesses);
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch businesses';
      showToast(message, 'error');
      // Set empty arrays on error to prevent infinite loading
      setBusinesses([]);
      setFilteredBusinesses([]);
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    let filtered = businesses;

    // Filter by status
    if (statusFilter === 'pending') {
      filtered = filtered.filter(b => !b.approved);
    } else if (statusFilter === 'approved') {
      filtered = filtered.filter(b => b.approved);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approve(id);
      showToast('Business approved successfully', 'success');
      await fetchBusinesses();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to approve business';
      showToast(message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.reject(id);
      showToast('Business deleted successfully', 'success');
      await fetchBusinesses();
      if (showDetailsModal) {
        setShowDetailsModal(false);
        setSelectedBusiness(null);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to delete business';
      showToast(message, 'error');
    }
  };

  const handleToggleVerified = async (id: string) => {
    try {
      await adminService.toggleVerified(id);
      showToast('Verified status updated', 'success');
      await fetchBusinesses();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update verified status';
      showToast(message, 'error');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await adminService.toggleFeatured(id);
      showToast('Featured status updated', 'success');
      await fetchBusinesses();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update featured status';
      showToast(message, 'error');
    }
  };

  const viewBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowDetailsModal(true);
  };

  const getStatusColor = (approved: boolean) => {
    return approved ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10';
  };

  const getStatusIcon = (approved: boolean) => {
    return approved ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    total: businesses.length,
    pending: businesses.filter(b => !b.approved).length,
    approved: businesses.filter(b => b.approved).length,
    verified: businesses.filter(b => b.verified).length,
    featured: businesses.filter(b => b.featured).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading admin control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Admin Control Panel</h1>
                <p className="text-gray-400">Manage all business listings and approvals</p>
              </div>
              <button
                onClick={fetchBusinesses}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-[#071126] rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Businesses</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">{stats.pending}</span>
              </div>
              <p className="text-gray-400 text-sm">Pending Approval</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold">{stats.approved}</span>
              </div>
              <p className="text-gray-400 text-sm">Approved</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold">{stats.verified}</span>
              </div>
              <p className="text-gray-400 text-sm">Verified</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Crown className="w-5 h-5 text-[#d4af37]" />
                <span className="text-2xl font-bold">{stats.featured}</span>
              </div>
              <p className="text-gray-400 text-sm">Featured</p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search businesses by name, category, city, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071126] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[#d4af37] text-[#071126]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-[#d4af37] text-[#071126]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    statusFilter === 'approved'
                      ? 'bg-[#d4af37] text-[#071126]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Approved ({stats.approved})
                </button>
              </div>
            </div>
          </motion.div>

          {/* Businesses List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {loadingData ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading businesses...</p>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No businesses found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'No businesses have been added yet'}
                </p>
              </div>
            ) : (
              filteredBusinesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Business Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {business.image && (
                          <img
                            src={business.image}
                            alt={business.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white truncate">
                              {business.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                business.approved
                              )}`}
                            >
                              {getStatusIcon(business.approved)}
                              {business.approved ? 'Approved' : 'Pending'}
                            </span>
                            {business.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                                <Shield className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                            {business.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#d4af37]/10 text-[#d4af37]">
                                <Crown className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {business.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {business.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#d4af37]" />
                              {business.rating} ({business.reviews_count} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(business.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-300 line-clamp-2">{business.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                      <button
                        onClick={() => viewBusinessDetails(business)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {!business.approved && (
                        <button
                          onClick={() => handleApprove(business.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleVerified(business.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        {business.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(business.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#b8941f] transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        {business.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#071126] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Business Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {selectedBusiness.image && (
                <img
                  src={selectedBusiness.image}
                  alt={selectedBusiness.name}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedBusiness.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedBusiness.approved
                      )}`}
                    >
                      {getStatusIcon(selectedBusiness.approved)}
                      {selectedBusiness.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                    {selectedBusiness.verified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-400/10 text-purple-400">
                        <Shield className="w-4 h-4" />
                        Verified Business
                      </span>
                    )}
                    {selectedBusiness.featured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-[#d4af37]/10 text-[#d4af37]">
                        <Crown className="w-4 h-4" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white font-medium">{selectedBusiness.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">City</p>
                    <p className="text-white font-medium">{selectedBusiness.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Rating</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#d4af37]" />
                      {selectedBusiness.rating} ({selectedBusiness.reviews_count} reviews)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Created</p>
                    <p className="text-white font-medium">{formatDate(selectedBusiness.created_at)}</p>
                  </div>
                  {selectedBusiness.whatsapp && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">WhatsApp</p>
                      <p className="text-white font-medium">{selectedBusiness.whatsapp}</p>
                    </div>
                  )}
                  {selectedBusiness.address && (
                    <div className="md:col-span-2">
                      <p className="text-gray-400 text-sm mb-1">Address</p>
                      <p className="text-white font-medium">{selectedBusiness.address}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Description</p>
                  <p className="text-white">{selectedBusiness.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  {!selectedBusiness.approved && (
                    <button
                      onClick={() => {
                        handleApprove(selectedBusiness.id);
                        setShowDetailsModal(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Approve Business
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleToggleVerified(selectedBusiness.id);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    {selectedBusiness.verified ? 'Remove Verification' : 'Verify Business'}
                  </button>
                  <button
                    onClick={() => {
                      handleToggleFeatured(selectedBusiness.id);
                    }}
                    className="px-6 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#b8941f] transition-colors font-medium"
                  >
                    <Crown className="w-4 h-4 inline mr-2" />
                    {selectedBusiness.featured ? 'Remove from Featured' : 'Add to Featured'}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedBusiness.id);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Delete Business
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminControl;
