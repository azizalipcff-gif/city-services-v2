import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessService } from '../lib/businessService';

const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const fetchPromise = businessService.getPublic();
        
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error fetching businesses:', error);
        } else if (data) {
          console.log('Fetched businesses for home:', data.length);
          setBusinesses(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#d4af37] fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#071126] to-[#0a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Businesses</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Loading featured businesses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#071126] to-[#0a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Businesses</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">No featured businesses available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="businesses" className="py-20 bg-gradient-to-br from-[#071126] to-[#0a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Businesses</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover top-rated local businesses in your area. All verified and trusted by our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-300 group"
            >
              {/* Business Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{business.logo}</span>
                  </div>
                </div>
                {business.verified && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#d4af37] text-[#071126] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    business.open
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {business.open ? 'Open' : 'Closed'}
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[#d4af37] transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-[#d4af37] text-sm font-medium">{business.category}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{business.description}</p>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(business.rating)}
                    </div>
                    <span className="text-white text-sm font-medium">{business.rating}</span>
                    <span className="text-gray-400 text-sm">({business.reviewsCount})</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{business.city}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/business/${business.id}`}
                    className="flex-1 bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg text-center font-semibold hover:bg-[#b8941f] transition-colors text-sm"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://wa.me/${business.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4af37] hover:text-[#071126] transition-all duration-300">
            View All Businesses
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;