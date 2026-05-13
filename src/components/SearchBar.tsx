import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Building2, Tag, ChevronDown, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { businessService } from '../lib/businessService';
// import type { City } from '../data/moroccanCities';
import { moroccanCities } from '../data/moroccanCities';

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  rating: number;
  type: 'business' | 'category' | 'city';
  image?: string;
  verified?: boolean;
  reviews_count?: number;
  relevanceScore?: number;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Enhanced mock data with more realistic business information
  const mockBusinesses = [
    {
      id: '1',
      name: 'Plombier Oujda',
      category: 'Plumbing',
      city: 'Oujda',
      description: 'Professional plumbing services - repairs, installations, and maintenance',
      rating: 4.5,
      type: 'business',
      image: '/api/placeholder/business1.jpg',
      verified: true,
      tags: ['plumbing', 'repairs', 'emergency', 'water heater']
    },
    {
      id: '2',
      name: 'Electricien Berkane',
      category: 'Electrical',
      city: 'Berkane',
      description: 'Complete electrical solutions for homes and businesses',
      rating: 4.8,
      type: 'business',
      image: '/api/placeholder/business2.jpg',
      verified: true,
      tags: ['electrical', 'wiring', 'lighting', 'circuit breaker']
    },
    {
      id: '3',
      name: 'Mécanicien Auto Casablanca',
      category: 'Automotive',
      city: 'Casablanca',
      description: 'Car repair, maintenance, and detailing services',
      rating: 4.2,
      type: 'business',
      image: '/api/placeholder/business3.jpg',
      verified: false,
      tags: ['car repair', 'oil change', 'brake service', 'engine repair']
    },
    {
      id: '4',
      name: 'Restaurant Al Fes',
      category: 'Restaurant',
      city: 'Fes',
      description: 'Traditional Moroccan cuisine and modern dining experience',
      rating: 4.7,
      type: 'business',
      image: '/api/placeholder/business4.jpg',
      verified: true,
      tags: ['moroccan food', 'traditional', 'restaurant', 'cuisine']
    },
    {
      id: '5',
      name: 'Salle de Sport Marrakech',
      category: 'Fitness',
      city: 'Marrakech',
      description: 'Modern fitness equipment and personal training services',
      rating: 4.3,
      type: 'business',
      image: '/api/placeholder/business5.jpg',
      verified: true,
      tags: ['fitness', 'gym', 'personal training', 'sports equipment']
    }
  ];

  const categories = [
    'Plumbing',
    'Electrical',
    'Automotive',
    'Restaurant',
    'Healthcare',
    'Education',
    'Technology',
    'Construction',
    'Cleaning',
    'Beauty',
    'Legal',
    'Fitness',
    'Hotel',
    'Shopping'
  ];

  const suggestedTags = [
    'wifi', 'fiber', 'gaming', 'mechanic', 'brakes', 'engine', 'pc repair',
    'restaurant', 'coffee', 'electrician', 'plumbing', 'security', 'cleaning',
    'delivery', 'repair', 'installation', 'maintenance', '24h', 'emergency',
  ];

  // Fuzzy matching function for typo tolerance (Levenshtein distance)
  const calculateFuzzyMatch = (query: string, text: string): number => {
    if (!query || !text) return 0;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match already handled, skip
    if (queryLower === textLower) return 0;
    
    // Calculate Levenshtein distance
    const matrix: number[][] = [];
    const queryLen = queryLower.length;
    const textLen = textLower.length;
    
    for (let i = 0; i <= queryLen; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= textLen; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= queryLen; i++) {
      for (let j = 1; j <= textLen; j++) {
        const cost = queryLower[i - 1] === textLower[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const distance = matrix[queryLen][textLen];
    const maxLen = Math.max(queryLen, textLen);
    
    // Convert distance to score (closer match = higher score)
    // Allow up to 2 typos for short queries, more for longer ones
    const maxTypos = Math.min(2, Math.floor(maxLen / 3));
    
    if (distance <= maxTypos) {
      return Math.max(0, 50 - (distance * 10));
    }
    
    return 0;
  };

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  // Enhanced search suggestions with intelligent matching
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Filter mock businesses with intelligent matching
        let filteredBusinesses = mockBusinesses;
        
        // Apply city filter with exact matching
        if (selectedCity) {
          filteredBusinesses = filteredBusinesses.filter(b => 
            b.city.toLowerCase() === selectedCity.toLowerCase()
          );
        }
        
        // Apply category filter with exact matching
        if (selectedCategory) {
          filteredBusinesses = filteredBusinesses.filter(b => 
            b.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        
        // Apply text search with improved matching logic and relevance scoring
        if (query) {
          const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
          
          filteredBusinesses = filteredBusinesses.map((business: any) => {
            const searchText = `${business.name} ${business.description} ${business.category} ${business.city} ${business.tags?.join(' ')}`.toLowerCase();
            
            // Calculate relevance score
            let relevanceScore = 0;
            
            // Exact name match gets highest score (100)
            if (business.name.toLowerCase() === query.toLowerCase()) {
              relevanceScore += 100;
            }
            
            // Name starts with query (80)
            if (business.name.toLowerCase().startsWith(query.toLowerCase())) {
              relevanceScore += 80;
            }
            
            // Category match (60)
            if (business.category.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 60;
            }
            
            // City match (50)
            if (business.city.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 50;
            }
            
            // Tag matches (40 per tag)
            business.tags?.forEach((tag: string) => {
              if (tag.toLowerCase().includes(query.toLowerCase())) {
                relevanceScore += 40;
              }
            });
            
            // Description match (30)
            if (business.description.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 30;
            }
            
            // Partial word matches (10 per term)
            searchTerms.forEach((term: string) => {
              if (business.name.toLowerCase().includes(term)) relevanceScore += 10;
              if (business.category.toLowerCase().includes(term)) relevanceScore += 10;
              if (business.city.toLowerCase().includes(term)) relevanceScore += 10;
            });
            
            // Fuzzy matching for typos (calculate Levenshtein distance)
            const fuzzyScore = calculateFuzzyMatch(query.toLowerCase(), business.name.toLowerCase());
            relevanceScore += fuzzyScore;
            
            return { ...business, relevanceScore };
          }).filter((business: any) => business.relevanceScore > 0)
            .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
        }

        // Get business suggestions with relevance-based ordering
        const businessSuggestions = filteredBusinesses.slice(0, 5).map((business: any) => ({
          id: business.id,
          name: business.name,
          category: business.category,
          city: business.city,
          description: business.description,
          rating: business.rating,
          type: 'business' as const,
          image: business.image,
          verified: business.verified,
          relevanceScore: business.relevanceScore
        }));

        // Get category suggestions with better matching
        const matchingCategories = categories
          .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .map(cat => ({
            id: cat,
            name: cat,
            category: cat,
            city: '',
            description: `Browse ${cat} services`,
            rating: 0,
            type: 'category' as const
          }));

        // Get city suggestions with improved matching
        const matchingCities = moroccanCities
          .filter(city => 
            city.name.toLowerCase().includes(query.toLowerCase()) ||
            city.nameAr.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .map(city => ({
            id: city.id,
            name: city.name,
            category: '',
            city: city.name,
            description: `Services in ${city.name}, ${city.region}`,
            rating: 0,
            type: 'city' as const
          }));

        const allSuggestions: SearchSuggestion[] = [...businessSuggestions, ...matchingCategories, ...matchingCities];
        setSuggestions(allSuggestions);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedCity, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node) &&
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node) &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowCityDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Navigate to search results with filters
      const params = new URLSearchParams();
      params.set('q', query);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedCategory) params.set('category', selectedCategory);
      
      navigate(`/search?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'business') {
      navigate(`/business/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.name);
      setQuery('');
      setIsOpen(false);
    } else if (suggestion.type === 'city') {
      setSelectedCity(suggestion.name);
      setQuery('');
      setIsOpen(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Building2 className="w-4 h-4" />;
      case 'category':
        return <Tag className="w-4 h-4" />;
      case 'city':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-center gap-3">
        {/* City Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {selectedCity || 'All Cities'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* City Dropdown */}
          {showCityDropdown && (
            <div
              ref={cityDropdownRef}
              className="absolute top-full left-0 mt-2 w-64 bg-[#071126] border border-white/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedCity('');
                    setShowCityDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  All Cities
                </button>
                {moroccanCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.name);
                      setShowCityDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-gray-400">{city.nameAr}</div>
                    </div>
                    <span className="text-xs text-gray-400">{city.region}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span className="text-sm">
              {selectedCategory || 'All Categories'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div
              ref={categoryDropdownRef}
              className="absolute top-full left-0 mt-2 w-56 bg-[#071126] border border-white/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              } else if (e.key === 'ArrowDown' && isOpen) {
                e.preventDefault();
              }
            }}
            onFocus={() => {
              if (query.length >= 2) setIsOpen(true);
            }}
            placeholder="Search businesses, categories, or cities..."
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCity || selectedCategory) && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          {selectedCity && (
            <div className="flex items-center gap-1 px-3 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded-full">
              <MapPin className="w-3 h-3" />
              <span>{selectedCity}</span>
            </div>
          )}
          {selectedCategory && (
            <div className="flex items-center gap-1 px-3 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded-full">
              <Tag className="w-3 h-3" />
              <span>{selectedCategory}</span>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Suggestions Dropdown */}
      {isOpen && !loading && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#071126] border border-white/10 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {/* Search history */}
            {query.length === 0 && searchHistory.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">Recent Searches</div>
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(term);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Enhanced Suggestions */}
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.id}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-start gap-3"
              >
                {/* Business Image */}
                {suggestion.type === 'business' && suggestion.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                    <img 
                      src={suggestion.image} 
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/business-default.jpg';
                      }}
                    />
                  </div>
                )}

                <div className="mt-1">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white">{suggestion.name}</div>
                      <div className="text-xs text-gray-400">
                        {suggestion.type === 'business' && (
                          <>
                            {suggestion.category} · {suggestion.city}
                            {suggestion.verified && (
                              <CheckCircle className="w-3 h-3 inline ml-1 text-green-400" />
                            )}
                          </>
                        )}
                        {suggestion.type !== 'business' && suggestion.description}
                      </div>
                    </div>
                    
                    {suggestion.type === 'business' && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#d4af37]" />
                          <span>{suggestion.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{suggestion.reviews_count || 0} reviews</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isOpen && loading && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#071126] border border-white/10 rounded-2xl shadow-xl z-50"
        >
          <div className="p-4 text-center">
            <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Searching...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
