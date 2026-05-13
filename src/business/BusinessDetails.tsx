import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, MapPin, Phone, Clock, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';

const BusinessDetails = () => {
  // const { id } = useParams(); // Would be used to fetch business data in real app

  // Mock data - in real app, fetch from API
  const business = {
    id: 1,
    name: 'Oujda Tech Repair',
    category: 'PC Repair',
    description: 'Expert computer repair services in Oujda. We specialize in laptop and desktop repairs, virus removal, data recovery, and hardware upgrades. Fast and reliable service with competitive pricing.',
    rating: 4.8,
    reviews: 127,
    location: 'Oujda, Morocco',
    address: '123 Tech Street, Oujda 60000',
    phone: '+212 600 000 000',
    whatsapp: '+212600000000',
    email: 'contact@oujdatech.ma',
    website: 'https://oujdatech.ma',
    verified: true,
    open: true,
    images: [
      'https://via.placeholder.com/800x400/071126/d4af37?text=Tech+Repair+1',
      'https://via.placeholder.com/800x400/071126/d4af37?text=Tech+Repair+2',
      'https://via.placeholder.com/800x400/071126/d4af37?text=Tech+Repair+3'
    ],
    services: [
      'Laptop Repair',
      'Desktop Repair',
      'Virus Removal',
      'Data Recovery',
      'Hardware Upgrades',
      'Software Installation'
    ],
    workingHours: [
      { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    socialLinks: {
      facebook: 'https://facebook.com/oujdatech',
      instagram: 'https://instagram.com/oujdatech'
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-[#d4af37] fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#071126]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="relative h-96 overflow-hidden">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-6"
              >
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">💻</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{business.name}</h1>
                    {business.verified && (
                      <CheckCircle className="w-6 h-6 text-[#d4af37]" />
                    )}
                  </div>
                  <p className="text-[#d4af37] text-lg mb-2">{business.category}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(business.rating)}
                      <span className="text-white ml-2">{business.rating} ({business.reviews} reviews)</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      business.open ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {business.open ? 'Open' : 'Closed'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{business.description}</p>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {business.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-[#d4af37]" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {business.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${business.name} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-[#071126] font-bold">
                        J
                      </div>
                      <div>
                        <p className="text-white font-medium">John Doe</p>
                        <div className="flex items-center gap-1">
                          {renderStars(5)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">Excellent service! Fixed my laptop in no time. Highly recommended.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-[#d4af37]" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-[#d4af37]" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-[#d4af37]" />
                    <span>Working Hours</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={`https://wa.me/${business.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${business.phone}`}
                    className="w-full bg-[#d4af37] text-[#071126] px-4 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </motion.div>

              {/* Working Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Working Hours</h3>
                <div className="space-y-2">
                  {business.workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-gray-300">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href={business.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a
                    href={business.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessDetails;