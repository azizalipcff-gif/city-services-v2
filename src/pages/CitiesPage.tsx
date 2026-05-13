import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Star, Users } from 'lucide-react';
import { businessService } from '../lib/businessService';
import { moroccanCities, getPopularCities } from '../data/moroccanCities';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CitiesPage = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (selectedCity) {
        setLoading(true);
        try {
          const { data } = await businessService.getByCategory('', selectedCity);
          setBusinesses(data || []);
        } catch (error) {
          console.error('Error fetching businesses:', error);
          setBusinesses([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBusinesses();
  }, [selectedCity]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    navigate(`/search?city=${encodeURIComponent(cityName)}`);
  };

  const getCityBusinessCount = (cityName: string) => {
    return businesses.filter(b => b.city === cityName).length;
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Explore Services by City
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find trusted local businesses and services across Morocco's major cities
            </p>
          </motion.div>

          {/* Popular Cities Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Popular Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getPopularCities().map((city) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => handleCitySelect(city.name)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{city.nameAr}</p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{city.region}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Building2 className="w-4 h-4" />
                        <span>{getCityBusinessCount(city.name)} businesses</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample Businesses */}
                  {selectedCity === city.name && businesses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Featured Businesses in {city.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {businesses.slice(0, 6).map((business) => (
                          <motion.div
                            key={business.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                                  {business.name}
                                </h3>
                                <p className="text-[#d4af37] text-sm font-medium mb-2">{business.category}</p>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{business.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-[#d4af37]" />
                                    <span>{business.rating?.toFixed(1) || '0.0'}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{business.reviews_count || 0} reviews</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{business.city}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {businesses.length > 6 && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => navigate(`/search?city=${encodeURIComponent(city.name)}`)}
                            className="bg-[#d4af37] text-[#071126] px-6 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
                          >
                            View All Businesses in {city.name}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Cities Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">All Moroccan Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {moroccanCities.map((city) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => handleCitySelect(city.name)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{city.name}</h3>
                      <p className="text-gray-400 text-sm">{city.nameAr}</p>
                      <p className="text-gray-500 text-xs">{city.region}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Building2 className="w-4 h-4" />
                        <span>Explore</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CitiesPage;
