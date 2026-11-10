import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Building2,
  Wind,
  Users,
  IndianRupee,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import HallCard, { formatINR } from '../components/common/HallCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HallsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [hallType, setHallType] = useState(searchParams.get('hallType') || 'all');
  const [hasAC, setHasAC] = useState(searchParams.get('hasAC') || 'all');
  const [minGuests, setMinGuests] = useState(searchParams.get('minGuests') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (city !== 'all') params.city = city;
      if (hallType !== 'all') params.hallType = hallType;
      if (hasAC !== 'all') params.hasAC = hasAC;
      if (minGuests) params.minGuests = minGuests;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const response = await api.get('/halls', params);
      if (response.success) {
        setHalls(response.data);
      }
    } catch (err) {
      console.error('Error fetching halls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, [city, hallType, hasAC, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHalls();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('all');
    setHallType('all');
    setHasAC('all');
    setMinGuests('');
    setMaxPrice('');
    setSort('rating');
    setSearchParams({});
    setTimeout(() => {
      api.get('/halls').then((res) => {
        if (res.success) setHalls(res.data);
      });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Curated Venues Collection
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 tracking-tight mb-3">
            Discover Grand Banquet Halls
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Find the ideal venue tailored to your gathering size, ambiance preference, and location across India.
          </p>
        </div>

        {/* Filter & Search Bar Panel */}
        <div className="card-luxury p-6 mb-12 border border-beige/80">
          <form onSubmit={handleSearchSubmit}>
            
            {/* Top Row: Search Input + Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-beige">
              <div className="md:col-span-2 relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search by banquet hall name, landmark, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-offwhite border border-beige rounded-xl text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl px-3.5 py-3 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="rating">Top Rated Venues</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="capacity-high">Capacity: Largest First</option>
                  <option value="newest">Recently Added</option>
                </select>

                <button
                  type="submit"
                  className="btn-gold px-5 py-3 text-xs uppercase tracking-wider font-bold"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
              
              {/* City Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-600" /> City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="all">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Hall Type Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-gold-600" /> Venue Type
                </label>
                <select
                  value={hallType}
                  onChange={(e) => setHallType(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="all">Indoor & Outdoor</option>
                  <option value="Indoor">Indoor Only</option>
                  <option value="Outdoor">Outdoor Only</option>
                  <option value="Both">Both (Hall + Lawn)</option>
                </select>
              </div>

              {/* AC Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-gold-600" /> Climate Control
                </label>
                <select
                  value={hasAC}
                  onChange={(e) => setHasAC(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="all">Any AC / Non-AC</option>
                  <option value="true">Air Conditioned Only</option>
                  <option value="false">Non-AC / Open Air</option>
                </select>
              </div>

              {/* Min Capacity Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-gold-600" /> Min Guests
                </label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={minGuests}
                  onChange={(e) => setMinGuests(e.target.value)}
                  onBlur={fetchHalls}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {/* Max Rental Budget Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-gold-600" /> Max Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={fetchHalls}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

            </div>

            {/* Clear Filters Reset */}
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-beige/60 text-xs">
              <span className="text-charcoal/60 font-medium">
                Showing <strong className="text-navy-900 font-bold">{halls.length}</strong> banquet halls matching criteria
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-gold-700 hover:text-gold-900 font-bold tracking-wide"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>

          </form>
        </div>

        {/* Halls Grid View */}
        {loading ? (
          <LoadingSpinner text="Searching banquet halls..." />
        ) : halls.length === 0 ? (
          <div className="card-luxury p-16 text-center max-w-lg mx-auto">
            <Building2 className="w-16 h-16 text-gold-500/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">No Banquet Halls Found</h3>
            <p className="text-sm text-charcoal/70 mb-6">
              No venues currently match your exact filters. Try adjusting city, guest capacity, or price range.
            </p>
            <button onClick={handleResetFilters} className="btn-gold py-2.5 px-6 text-xs uppercase font-bold">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map((hall) => (
              <HallCard key={hall._id} hall={hall} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HallsPage;

