import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Upload,
  Check,
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  Plus,
  X,
  Star,
  Save,
  Trash2,
  ChevronRight,
  Wifi,
  Zap,
  Wrench,
  Coffee,
  Shield,
  Crown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import { businessService } from '../services/businessService';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

interface BusinessFormData {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory: string;
  tags: string[];
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  coverUrl: string;
  galleryUrls: string[];
  services: Service[];
  workingHours: WorkingHours;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
}

interface WorkingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

const AddBusiness = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BusinessFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    subcategory: '',
    tags: [],
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    city: '',
    neighborhood: '',
    latitude: 0,
    longitude: 0,
    logoUrl: '',
    coverUrl: '',
    galleryUrls: [],
    services: [],
    workingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    },
  });

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

  const moroccanCities = [
    'Oujda', 'Nador', 'Berkane', 'Casablanca', 'Rabat', 'Marrakech',
    'Tangier', 'Agadir', 'Fes', 'Meknes', 'Tetouan', 'Kenitra',
    'El Jadida', 'Sale', 'Temara', 'Skhirat', 'Beni Mellal', 'Khouribga',
    'Ouarzazate', 'Errachidia', 'Settat', 'Larache', 'Ksar el Kebir',
    'Taza', 'Al Hoceima', 'Tamegroute', 'Beni Mellal', 'Mohammedia',
    'Safi', 'Jerada', 'Youssoufia', 'Guercif', 'Tan-Tan', 'Bouznika',
    'Taroudant', 'Essaouira', 'Sidi Ifni', 'Guelmim', 'Oualidi',
    'Azemmour', 'Tiznit', 'Tinghir', 'Midelt', 'El Ouidane',
    'Rissani', 'Imzouren', 'Bouarfa', 'Missour', 'Erfoud',
    'Figuiq', 'Zagora', 'Tata', 'Akka', 'Tarfaya',
    'Es-Semara', 'Layoune', 'Boujdour', 'Sidi Bennour', 'Sidi Smail',
    'Guelmim', 'Ait Ourir', 'Ait Baha', 'Tamegroute', 'Chefchaouen',
    'Boulemane', 'Fquih Ben Salah', 'Sidi Yahya', 'Sidi Bennour',
  ];

  const suggestedTags = [
    'wifi', 'fiber', 'gaming', 'mechanic', 'brakes', 'engine', 'pc repair',
    'restaurant', 'coffee', 'electrician', 'plumbing', 'security', 'cleaning',
    'delivery', 'repair', 'installation', 'maintenance', '24h', 'emergency',
  ];

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BusinessFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(0[5-7]\d{8}|06\d{8})$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Moroccan phone number';
    }
    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid Moroccan WhatsApp number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      duration: ''
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const updateWorkingHours = (day: keyof WorkingHours, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleDayClosed = (day: keyof WorkingHours) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          closed: !prev.workingHours[day].closed
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    if (!user) {
      showToast('Please log in to add a business', 'error');
      return;
    }

    setLoading(true);

    try {
      // Map form data to Business type structure
      const businessData = {
        owner_id: user.id,
        name: formData.name,
        slug: formData.slug,
        description: formData.fullDescription,
        category: formData.category,
        city: formData.city,
        address: formData.neighborhood,
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        website: formData.website || null,
        logo_url: formData.logoUrl || null,
        cover_url: formData.coverUrl || null,
        gallery_urls: formData.galleryUrls.length > 0 ? formData.galleryUrls : null,
        rating: 0,
        reviews_count: 0,
        verified: false,
        featured: false,
        approved: false,
        price_range: '$$' as const,
        coordinates_lat: formData.latitude || null,
        coordinates_lng: formData.longitude || null,
        social_facebook: formData.facebook || null,
        social_instagram: formData.instagram || null,
        opening_hours: Object.entries(formData.workingHours)
          .filter(([_, hours]) => !(hours as any).closed)
          .map(([day, hours]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            hours: `${(hours as any).open} - ${(hours as any).close}`,
          })),
      };

      const { data, error } = await businessService.create(businessData, user.id);

      if (error) {
        throw error;
      }

      setSubmitted(true);
      showToast('Business submitted successfully! It will be reviewed by our admin team.', 'success');
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Failed to submit business. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 0, title: 'Basic Info', icon: Building2 },
    { id: 1, title: 'Contact', icon: Phone },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Images', icon: Upload },
    { id: 4, title: 'Services', icon: Star },
    { id: 5, title: 'Hours', icon: Clock },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#071126] flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Business Submitted!</h1>
          <p className="text-xl text-gray-300 mb-2">Your business has been submitted successfully</p>
          <p className="text-gray-400">It will be reviewed by our admin team and published once approved.</p>
          <div className="mt-8 space-y-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
              <div className="space-y-3 text-gray-300">
                <p>• Admin will review your business within 24-48 hours</p>
                <p>• You'll receive an email once it's approved</p>
                <p>• Your business will be visible to customers immediately after approval</p>
                <p>• You can track the status in your dashboard</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/user-dashboard')}
              className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">Add Your Business</h1>
            <p className="text-xl text-gray-400">Reach local customers and grow your business</p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-gray-400">{currentSection + 1} / {sections.length}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-[#d4af37] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSection === 0 ? 0 : 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                currentSection === 0 ? 'ring-2 ring-[#d4af37]/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#071126]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Business Info</h2>
                  <p className="text-gray-400">Tell us about your business</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your business name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Slug <span className="text-gray-500">(auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400"
                    placeholder="business-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.category ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="e.g., WiFi Installation"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    rows={2}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors resize-none ${
                      errors.shortDescription ? 'border-red-500' : ''
                    }`}
                    placeholder="Brief description of your business (max 150 characters)"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                    rows={6}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors resize-none ${
                      errors.fullDescription ? 'border-red-500' : ''
                    }`}
                    placeholder="Detailed description of your business, services offered, and what makes you unique..."
                  />
                  {errors.fullDescription && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullDescription}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {formData.tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-[#d4af37] text-[#071126] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:bg-[#b8941f] rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-white/20 text-gray-500 cursor-not-allowed'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection(1)}
                  className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] rounded-lg transition-colors flex items-center gap-2"
                >
                  Next: Contact
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Section 2: Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSection === 1 ? 0 : 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                currentSection === 1 ? 'ring-2 ring-[#d4af37]/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#071126]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                  <p className="text-gray-400">How customers can reach your business</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="06XXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    WhatsApp Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.whatsapp ? 'border-red-500' : ''
                    }`}
                    placeholder="06XXXXXXXX"
                  />
                  {errors.whatsapp && (
                    <p className="text-red-400 text-sm mt-1">{errors.whatsapp}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="business@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://your-business.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">TikTok</label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="https://tiktok.com/@yourbusiness"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentSection(0)}
                  className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection(2)}
                  className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] rounded-lg transition-colors flex items-center gap-2"
                >
                  Next: Location
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Section 3: Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSection === 2 ? 0 : 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                currentSection === 2 ? 'ring-2 ring-[#d4af37]/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#071126]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Location</h2>
                  <p className="text-gray-400">Help customers find your business</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37] transition-colors ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a city</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Neighborhood / Area
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="e.g., Hay Al Qods, Centre Ville"
                  />
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 mb-2">Map Location (Coming Soon)</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-gray-400">Interactive map picker will be available soon</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentSection(1)}
                  className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection(3)}
                  className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] rounded-lg transition-colors flex items-center gap-2"
                >
                  Next: Images
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Section 4: Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSection === 3 ? 0 : 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                currentSection === 3 ? 'ring-2 ring-[#d4af37]/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#071126]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Images</h2>
                  <p className="text-gray-400">Showcase your business with photos</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <ImageUpload
                  type="logo"
                  onImageUpload={(imageUrl, file) => setFormData(prev => ({ ...prev, logoUrl: imageUrl }))}
                  onImageRemove={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                  existingImages={formData.logoUrl ? [formData.logoUrl] : []}
                  maxFiles={1}
                  maxSize={5}
                  aspectRatio="square"
                />

                {/* Cover Upload */}
                <ImageUpload
                  type="cover"
                  onImageUpload={(imageUrl, file) => setFormData(prev => ({ ...prev, coverUrl: imageUrl }))}
                  onImageRemove={() => setFormData(prev => ({ ...prev, coverUrl: '' }))}
                  existingImages={formData.coverUrl ? [formData.coverUrl] : []}
                  maxFiles={1}
                  maxSize={5}
                  aspectRatio="landscape"
                />

                {/* Gallery Upload */}
                <ImageUpload
                  type="gallery"
                  onImageUpload={(imageUrl, file) => setFormData(prev => ({ ...prev, galleryUrls: [...prev.galleryUrls, imageUrl] }))}
                  onImageRemove={(imageUrl) => setFormData(prev => ({ ...prev, galleryUrls: prev.galleryUrls.filter(url => url !== imageUrl) }))}
                  existingImages={formData.galleryUrls}
                  maxFiles={10}
                  maxSize={5}
                  aspectRatio="free"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentSection(2)}
                  className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection(4)}
                  className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] rounded-lg transition-colors flex items-center gap-2"
                >
                  Next: Services
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Section 5: Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentSection === 4 ? 0 : 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                currentSection === 4 ? 'ring-2 ring-[#d4af37]/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#071126]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Services</h2>
                  <p className="text-gray-400">List what services you offer</p>
                </div>
              </div>

              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={service.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-white">Service {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Service Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                          placeholder="e.g., WiFi Installation"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                        <input
                          type="text"
                          value={service.price || ''}
                          onChange={(e) => updateService(service.id, 'price', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                          placeholder="e.g., 200 MAD/hour"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                        <input
                          type="text"
                          value={service.duration || ''}
                          onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                          placeholder="e.g., 2-3 hours"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                        placeholder="Describe this service in detail..."
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addService}
                  className="w-full py-3 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Service
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentSection(3)}
                  className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#071126] border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit Business
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddBusiness;
