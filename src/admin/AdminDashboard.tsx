import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckCircle2,
  Building2,
  Users,
  Star,
  Settings,
  Search,
  Clock,
  MessageSquare,
  MapPin,
  Crown,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Filter,
  Eye,
  Trash2,
  Shield,
  Calendar,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/businessService';
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
  whatsapp?: string;
  email?: string;
  address?: string;
  logo_url?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  pendingApprovals: number;
  verifiedBusinesses: number;
  featuredBusinesses: number;
  totalReviews: number;
  recentActivity: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingApprovals: 0,
    verifiedBusinesses: 0,
    featuredBusinesses: 0,
    totalReviews: 0,
    recentActivity: 0,
  });
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<Business[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Businesses', icon: Clock },
    { id: 'approved', label: 'Approved Businesses', icon: CheckCircle2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'categories', label: 'Categories', icon: Building2 },
    { id: 'cities', label: 'Cities', icon: MapPin },
    { id: 'featured', label: 'Featured Businesses', icon: Crown },
    { id: 'notifications', label: 'Notifications', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');

      const [
        { data: pending },
        { data: approved },
        { data: allUsers },
        { data: featured },
        { data: allReviews },
      ] = await Promise.all([
        adminService.getPending(),
        adminService.getAllBusinesses(),
        adminService.getAllUsers(),
        adminService.getFeatured(),
        adminService.getAllReviews(),
      ]);

      const businesses = approved || [];
      const pendingList = pending || [];
      const userList = allUsers || [];
      const featuredList = featured || [];
      const reviewsList = allReviews || [];

      console.log('Data fetched:', {
        pending: pendingList.length,
        approved: businesses.length,
        users: userList.length,
        featured: featuredList.length,
        reviews: reviewsList.length,
      });

      setPendingBusinesses(pendingList);
      setApprovedBusinesses(businesses);
      setUsers(userList);
      setReviews(reviewsList);

      // Calculate stats
      const newStats: AdminStats = {
        totalUsers: userList.length,
        totalBusinesses: businesses.length,
        pendingApprovals: pendingList.length,
        verifiedBusinesses: businesses.filter(b => b.verified).length,
        featuredBusinesses: featuredList.length,
        totalReviews: businesses.reduce((sum, b) => sum + (b.reviews_count || 0), 0),
        recentActivity: pendingList.length, // Simplified for now
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (businessId: string) => {
    try {
      await adminService.approve(businessId);
      showToast('Business approved successfully', 'success');
      fetchAdminData();
    } catch (error) {
      showToast('Failed to approve business', 'error');
    }
  };

  const handleReject = async (businessId: string) => {
    try {
      await adminService.reject(businessId);
      showToast('Business rejected', 'success');
      fetchAdminData();
    } catch (error) {
      showToast('Failed to reject business', 'error');
    }
  };

  const handleVerify = async (businessId: string) => {
    try {
      await adminService.toggleVerified(businessId);
      showToast('Business verification updated', 'success');
      fetchAdminData();
    } catch (error) {
      showToast('Failed to update verification', 'error');
    }
  };

  const handleFeature = async (businessId: string) => {
    try {
      await adminService.toggleFeatured(businessId);
      showToast('Business featured status updated', 'success');
      fetchAdminData();
    } catch (error) {
      showToast('Failed to update featured status', 'error');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Businesses</p>
              <p className="text-3xl font-bold">{stats.totalBusinesses}</p>
            </div>
            <Building2 className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Verified Businesses</p>
              <p className="text-3xl font-bold">{stats.verifiedBusinesses}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {stats.pendingApprovals > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-yellow-400 font-semibold">New Business Submissions</h3>
              <p className="text-yellow-200 text-sm">
                {stats.pendingApprovals} businesses waiting for approval
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {pendingBusinesses.slice(0, 5).map((business) => (
              <div key={business.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{business.name}</p>
                  <p className="text-gray-400 text-sm">{business.category}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Featured Businesses</span>
              <span className="text-white font-semibold">{stats.featuredBusinesses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Reviews</span>
              <span className="text-white font-semibold">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Recent Activity</span>
              <span className="text-white font-semibold">{stats.recentActivity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPendingBusinesses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pending Business Approvals</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            {pendingBusinesses.length} pending
          </span>
        </div>
      </div>

      {pendingBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No pending approvals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingBusinesses.map((business) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                {business.logo_url && (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{business.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{business.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>{business.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{business.city}</span>
                    </div>
                    {business.whatsapp && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{business.whatsapp}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{business.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted {new Date(business.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(business.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(business.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            {users.length} users
          </span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] font-bold">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {user.name || 'Unknown'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      // View user details
                      setSelectedBusiness(null);
                      setShowDetailsModal(true);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApprovedBusinesses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Approved Businesses</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            {approvedBusinesses.length} approved
          </span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Business</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">City</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {approvedBusinesses.map((business) => (
              <tr key={business.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-white">{business.name}</div>
                    <div className="text-sm text-gray-400">{business.email || 'No email'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{business.category}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{business.city}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{business.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {business.verified && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                    {business.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(business.id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                    >
                      {business.verified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleFeature(business.id)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                    >
                      {business.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Review Management</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            {reviews.length} reviews
          </span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Business</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Comment</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">
                    {review.user?.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-400">{review.user?.email || ''}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {review.business?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">{review.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                  {review.comment}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      // Delete review
                      if (confirm('Are you sure you want to delete this review?')) {
                        // Implement delete review logic
                        showToast('Review deleted', 'success');
                      }
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Business Growth</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-semibold">+12%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Last Month</span>
                <span className="text-white font-semibold">+8%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Active Users</span>
                <span className="text-white font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Reviews</span>
                <span className="text-white font-semibold">{stats.totalReviews}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Approval Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Approved</span>
                <span className="text-white font-semibold">
                  {stats.totalBusinesses > 0
                    ? Math.round((stats.totalBusinesses / (stats.totalBusinesses + stats.pendingApprovals)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Pending</span>
                <span className="text-white font-semibold">{stats.pendingApprovals}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
          <div className="space-y-3">
            {approvedBusinesses.slice(0, 5).map((business, index) => (
              <div key={business.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-white">{business.category}</span>
                </div>
                <span className="text-gray-400 text-sm">{business.reviews_count} reviews</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Cities</h3>
          <div className="space-y-3">
            {approvedBusinesses.slice(0, 5).map((business, index) => (
              <div key={business.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-white">{business.city}</span>
                </div>
                <span className="text-gray-400 text-sm">{business.rating} avg rating</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'pending':
        return renderPendingBusinesses();
      case 'approved':
        return renderApprovedBusinesses();
      case 'users':
        return renderUsers();
      case 'reviews':
        return renderReviews();
      case 'analytics':
        return renderAnalytics();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Section coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a1929] border-r border-white/10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#d4af37] text-[#071126]'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[#0a1929] border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white capitalize">{activeSection}</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Welcome, {user?.email}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
