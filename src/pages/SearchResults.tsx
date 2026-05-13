/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Building2,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { businessService } from '../services/businessService';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

interface Filters {
  category: string;
  city: string;
  sortBy: 'rating' | 'newest' | 'name';
  priceRange: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // URL parameters
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const cityParam = searchParams.get('city') || '';

  // State
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: categoryParam,
    city: cityParam,
    sortBy: 'rating',
    priceRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);

  // Fetch categories and cities for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: businesses } = await businessService.getPublic();
        if (businesses) {
          const categories = [...new Set(businesses.map((b: any) => b.category))];
          const cities = [...new Set(businesses.map((b: any) => b.city))];
          setAllCategories(categories);
          setAllCities(cities);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let searchQuery = query || categoryParam || cityParam;

        if (searchQuery) {
          const { data, error } = await businessService.search(
            searchQuery,
            filters.city || cityParam
          );

          if (error) throw error;
          
          // Apply intelligent ranking for search results
          let rankedResults = data || [];
          
          if (searchQuery.toLowerCase() === 'oujda' || searchQuery.toLowerCase() === 'oujda') {
            // Priority 1: Exact city match - Oujda businesses first
            rankedResults = rankedResults.sort((a, b) => {
              const aIsOujda = a.city?.toLowerCase() === 'oujda';
              const bIsOujda = b.city?.toLowerCase() === 'oujda';
              
              if (aIsOujda && !bIsOujda) return -1;
              if (!aIsOujda && bIsOujda) return 1;
              if (aIsOujda && bIsOujda) return b.rating - a.rating;
              return 0;
            });
          } else {
            // Priority 2: Exact business name match
            // Priority 3: Category match
            // Priority 4: Tags match
            // Priority 5: Description match
            rankedResults = rankedResults.sort((a, b) => {
              const aExactName = a.name?.toLowerCase() === searchQuery.toLowerCase();
              const bExactName = b.name?.toLowerCase() === searchQuery.toLowerCase();
              const aExactCategory = a.category?.toLowerCase() === searchQuery.toLowerCase();
              const bExactCategory = b.category?.toLowerCase() === searchQuery.toLowerCase();
              
              // Exact name match gets highest priority
              if (aExactName && !bExactName) return -1;
              if (!aExactName && bExactName) return 1;
              
              // Category match gets next priority
              if (aExactCategory && !bExactCategory) return -1;
              if (!aExactCategory && bExactCategory) return 1;
              
              // Otherwise sort by rating
              return b.rating - a.rating;
            });
          }
          
          setResults(rankedResults);
        } else {
          // If no search query, get all businesses with filters
          const { data, error } = await businessService.getPublic({
            category: filters.category || categoryParam,
            city: filters.city || cityParam,
          });

          if (error) throw error;
          setResults(data || []);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Search failed';
        showToast(message, 'error');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, categoryParam, cityParam, filters.category, filters.city]);

  // Apply sorting and additional filtering
  const filteredResults = useMemo(() => {
    let sorted = [...results];

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Apply price range filter if set
    if (filters.priceRange) {
      // This would need to be implemented based on your price_range field
      // For now, we'll just return sorted results
    }

    return sorted;
  }, [results, filters.sortBy, filters.priceRange]);

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (key === 'category' && value) {
      params.set('category', value);
      params.delete('q');
      params.delete('city');
    } else if (key === 'city' && value) {
      params.set('city', value);
      params.delete('q');
      params.delete('category');
    } else if (key === 'sortBy') {
      // Don't add sort to URL, just apply it
    } else {
      params.delete(key);
    }

    const newUrl = `/search?${params.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      sortBy: 'rating',
      priceRange: '',
    });
    navigate('/search');
  };

  const getSearchTitle = () => {
    if (query) return `Search results for "${query}"`;
    if (categoryParam) return `${categoryParam} Services`;
    if (cityParam) return `Services in ${cityParam}`;
    return 'All Services';
  };

  if (loading && results.length === 0) {
    return (
      <div className="min-h-screen bg-[#071126] text-white">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-xl text-gray-300">Searching...</p>
              <p className="text-gray-400 mt-2">Finding the best services for you</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      <Navbar />

      {/* Search Section */}
      <div className="sticky top-16 z-40 bg-[#071126] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar />
        </div>
      </div>

      <main className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {getSearchTitle()}
                </h1>
                <p className="text-gray-400">
                  {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
                </p>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Sort: {filters.sortBy}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-4 py-3 bg-[#071126] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className="w-full px-4 py-3 bg-[#071126] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    <option value="">All Cities</option>
                    {allCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full px-4 py-3 bg-[#071126] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => updateFilter('priceRange', e.target.value)}
                    className="w-full px-4 py-3 bg-[#071126] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    <option value="">Any Price</option>
                    <option value="$">$</option>
                    <option value="$$">$$</option>
                    <option value="$$$">$$$</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {filteredResults.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No results found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#d4af37] text-[#071126] rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={business.image || '/api/placeholder/300/200'}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-xl">🏢</span>
                      </div>
                    </div>
                    {business.verified && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-[#d4af37] text-[#071126] px-2 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-[#d4af37] text-sm font-medium mb-2">{business.category}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{business.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(business.rating)
                                ? 'text-[#d4af37]'
                                : 'text-gray-600'
                            }`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({business.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{business.city}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/business/${business.slug || business.id}`}
                        className="flex-1 bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
                      >
                        View Details
                      </Link>
                      <a
                        href={`https://wa.me/${business.whatsapp?.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
