import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Plus } from 'lucide-react';
import { trendingSearches } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleTrendingSearch = (searchTerm: string) => {
    // Parse the search term to extract city and category
    const lowerSearch = searchTerm.toLowerCase();
    
    if (lowerSearch.includes('oujda')) {
      navigate('/search?q=oujda');
    } else if (lowerSearch.includes('wifi')) {
      navigate('/search?q=wifi');
    } else if (lowerSearch.includes('mechanic')) {
      navigate('/search?q=mechanic');
    } else {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-[#071126] to-[#0a1a2e] text-white min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-[#d4af37] opacity-10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4af37] opacity-5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#d4af37] opacity-5 rounded-full blur-lg"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Find Trusted Local Services In Your City
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Discover the best technicians, restaurants, WiFi services, electricians, repair shops, and local businesses near you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button
            onClick={() => navigate('/add-business')}
            className="bg-[#d4af37] text-[#071126] px-8 py-4 rounded-xl font-semibold hover:bg-[#b8941f] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#d4af37]/25"
          >
            <Plus className="w-5 h-5" />
            Add Your Business
          </button>
          <button
            onClick={handleSearch}
            className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
          >
            <Search className="w-5 h-5" />
            Browse Services
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search businesses, categories, or cities..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg hover:bg-[#b8941f] transition-colors"
            >
              Search
            </button>
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-[#d4af37] mb-2">500+</div>
            <div className="text-gray-300">Businesses</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-[#d4af37] mb-2">1,200+</div>
            <div className="text-gray-300">Happy Users</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-[#d4af37] mb-2">50+</div>
            <div className="text-gray-300">Categories</div>
          </div>
        </motion.div>

        {/* Trending Searches */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Trending Searches</h3>
                <p className="text-gray-400">Popular searches from local users across Morocco.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleTrendingSearch(search)}
                  className="bg-white/10 text-white px-4 py-2 rounded-full text-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-[#d4af37] rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;