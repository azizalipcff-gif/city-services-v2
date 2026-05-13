import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Edit,
  Trash2,
  Plus,
  Upload,
  Phone,
  Mail,
  Globe,
  Clock,
  Tag,
  Star,
  Camera,
  Save,
  X,
  MapPin,
  Wifi,
  Zap,
  Wrench,
  Coffee,
  Shield,
  Crown,
  DollarSign,
  Check,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { businessService } from '../services/businessService';
import type { Business } from '../types';

const BusinessManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Business>>({});

  const categories = [
    { value: 'technology', label: 'Technology', icon: Wifi },
    { value: 'services', label: 'Services', icon: Zap },
    { value: 'automotive', label: 'Automotive', icon: Wrench },
    { value: 'food', label: 'Food & Restaurant', icon: Coffee },
    { value: 'health', label: 'Healthcare', icon: Shield },
    { value: 'education', label: 'Education', icon: Star },
    { value: 'retail', label: 'Retail', icon: Building2 },
    { value: 'professional', label: 'Professional Services', icon: Crown },
  ];

  const suggestedTags = [
    'wifi', 'fiber', 'gaming', 'mechanic', 'brakes', 'engine', 'pc repair',
    'restaurant', 'coffee', 'electrician', 'plumbing', 'security', 'cleaning',
    'delivery', 'repair', 'installation', 'maintenance', '24h', 'emergency',
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchBusinesses();
  }, [user, navigate]);

  const fetchBusinesses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await businessService.getByOwner(user.id);
      
      if (error) {
        showToast('Failed to fetch businesses', 'error');
      } else {
        setBusinesses(data || []);
      }
    } catch (error) {
      showToast('Error loading businesses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      slug: '',
      category: 'services',
      description: '',
      city: '',
      address: '',
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
      logo_url: '',
      cover_url: '',
      gallery_urls: [],
      rating: 0,
      reviews_count: 0,
      verified: false,
      featured: false,
      approved: false,
      price_range: '$',
      coordinates_lat: null,
      coordinates_lng: null,
      social_facebook: '',
      social_instagram: '',
      opening_hours: [],
    });
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setIsEditing(true);
    setFormData(business);
  };

  const handleSaveBusiness = async () => {
    if (!user) return;

    try {
      if (isEditing && selectedBusiness) {
        const { error } = await businessService.update(selectedBusiness.id, formData, user.id);
        if (error) {
          showToast('Failed to update business', 'error');
        } else {
          showToast('Business updated successfully', 'success');
          setIsEditing(false);
          setSelectedBusiness(null);
          fetchBusinesses();
        }
      } else if (isCreating) {
        const { error } = await businessService.create(formData as any, user.id);
        if (error) {
          showToast('Failed to create business', 'error');
        } else {
          showToast('Business created successfully', 'success');
          setIsCreating(false);
          setFormData({});
          fetchBusinesses();
        }
      }
    } catch (error) {
      showToast('Error saving business', 'error');
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!user) return;

    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await businessService.delete(businessId, user.id);
      if (error) {
        showToast('Failed to delete business', 'error');
      } else {
        showToast('Business deleted successfully', 'success');
        fetchBusinesses();
      }
    } catch (error) {
      showToast('Error deleting business', 'error');
    }
  };

  const handleImageUpload = (type: 'logo' | 'cover' | 'gallery', files: FileList) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please upload only JPEG, PNG, or WebP images', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    // Create preview URL (in real app, upload to cloud storage)
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo_url: imageUrl }));
      } else if (type === 'cover') {
        setFormData(prev => ({ ...prev, cover_url: imageUrl }));
      } else if (type === 'gallery') {
        const currentGallery = formData.gallery_urls || [];
        setFormData(prev => ({ 
          ...prev, 
          gallery_urls: [...currentGallery, imageUrl] 
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (index: number) => {
    const currentGallery = formData.gallery_urls || [];
    setFormData(prev => ({
      ...prev,
      gallery_urls: currentGallery.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
    if (!currentTags.includes(tag) && currentTags.length < 10) {
      const updatedTags = [...currentTags, tag];
      setFormData(prev => ({ ...prev, tags: updatedTags.join(', ') }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: updatedTags.join(', ') }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#d4af37]">Business Management</h1>
            <div className="flex items-center gap-4">
              <Link
                to="/add-business"
                className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Business
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business List */}
        {!isEditing && !isCreating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#d4af37]/50 transition-all"
              >
                {/* Business Card Header */}
                <div className="relative h-48 bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5">
                  {business.logo_url && (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071126]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{business.name}</h3>
                    <p className="text-sm text-gray-300">{business.city}</p>
                  </div>
                </div>

                {/* Business Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#d4af37] text-[#071126] px-2 py-1 rounded text-xs font-medium">
                      {categories.find(c => c.value === business.category)?.label || business.category}
                    </span>
                    {business.verified && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{business.description}</p>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {business.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4" />
                        {business.phone}
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        {business.email}
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-4 h-4" />
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37]">
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        business.approved 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {business.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                      {business.featured && (
                        <span className="bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBusiness(business)}
                        className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBusiness(business.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Form */}
        {(isEditing || isCreating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit Business' : 'Create New Business'}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveBusiness}
                  className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Update Business' : 'Create Business'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                    setSelectedBusiness(null);
                    setFormData({});
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                    placeholder="Describe your business..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter WhatsApp number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://your-business.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData.social_facebook || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData.social_instagram || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Images</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    {formData.logo_url ? (
                      <div className="relative">
                        <img
                          src={formData.logo_url}
                          alt="Business logo"
                          className="w-24 h-24 object-cover rounded-lg mx-auto"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, logo_url: null }))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('logo', e.target.files!)}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      {formData.cover_url ? (
                        <div className="relative">
                          <img
                            src={formData.cover_url}
                            alt="Business cover"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, cover_url: null }))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload('cover', e.target.files!)}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label
                            htmlFor="cover-upload"
                            className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Cover
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gallery</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      {formData.gallery_urls && formData.gallery_urls.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {formData.gallery_urls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload('gallery', e.target.files!)}
                            className="hidden"
                            id="gallery-upload"
                          />
                          <label
                            htmlFor="gallery-upload"
                            className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Add Gallery Images
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && businesses.length === 0 && !isEditing && !isCreating && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Businesses Yet</h3>
            <p className="text-gray-400 mb-6">Create your first business to get started</p>
            <button
              onClick={handleCreateBusiness}
              className="bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Business
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessManagement;
