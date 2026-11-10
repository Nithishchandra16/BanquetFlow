import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  Utensils,
  ChevronRight,
  Star,
  CheckCircle,
  Building2
} from 'lucide-react';
import api from '../services/api';
import HallCard from '../components/common/HallCard';
import PackageCard from '../components/common/PackageCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Search Form State
  const [searchParams, setSearchParams] = useState({
    city: '',
    date: '',
    guests: '',
    eventType: 'Wedding'
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [hallsRes, pkgsRes] = await Promise.all([
          api.get('/halls'),
          api.get('/catering')
        ]);
        if (hallsRes.success) setHalls(hallsRes.data.slice(0, 3));
        if (pkgsRes.success) setPackages(pkgsRes.data);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.city) query.append('city', searchParams.city);
    if (searchParams.guests) query.append('minGuests', searchParams.guests);
    if (searchParams.date) query.append('date', searchParams.date);
    if (searchParams.eventType) query.append('eventType', searchParams.eventType);

    navigate(`/halls?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-offwhite">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-navy-950 overflow-hidden">
        {/* Background Banquet Hall Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Banquet Hall Interior"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/80 to-navy-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-navy-950/40 to-navy-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Curated Grandeur & Exceptional Hospitality
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto">
            Find the Perfect Venue for Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600">
              Special Moments.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover India’s most prestigious banquet halls, palatial courtyards, and gourmet catering packages with real-time slot availability.
          </p>

          {/* Quick Search Floating Form */}
          <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-beige/60 text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Event Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-600" />
                  Event Location
                </label>
                <select
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2.5 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="">All Prominent Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-600" />
                  Event Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold-600" />
                  Guests
                </label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  min="20"
                  max="5000"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                  className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                />
              </div>

              {/* Event Type & Search Button */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold-600" />
                  Event Type
                </label>
                <div className="flex gap-2">
                  <select
                    value={searchParams.eventType}
                    onChange={(e) => setSearchParams({ ...searchParams, eventType: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other</option>
                  </select>

                  <button
                    type="submit"
                    className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
                    title="Search Venues"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-navy-900 border-y border-gold-500/20 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">100%</p>
              <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">Verified Luxury Venues</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">0%</p>
              <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">Double Booking Conflict Guarantee</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">50,000+</p>
              <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">Guests Catered Gracefully</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">4.9 ★</p>
              <p className="text-xs uppercase tracking-wider text-gray-300 mt-1">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE BANQUET HALLS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-gold-700 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Featured Locations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              Explore Our Handpicked Banquet Halls
            </h2>
            <p className="text-sm text-charcoal/70 mt-2 max-w-xl">
              From waterfront ocean-facing ballrooms to heritage Rajasthani havelis and contemporary glass pavilions.
            </p>
          </div>
          <Link
            to="/halls"
            className="btn-outline text-xs uppercase tracking-wider font-bold py-3 px-6 self-start md:self-auto"
          >
            View All Venues ({halls.length > 0 ? '6+' : '0'})
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <HallCard key={hall._id} hall={hall} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR CATERING PACKAGES */}
      <section className="py-24 bg-beige-light border-y border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-gold-700 uppercase mb-2">
              <Utensils className="w-3.5 h-3.5 text-gold-600" />
              Gourmet Dining Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-4">
              Curated Royal Catering Packages
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Every celebration deserves a royal culinary experience. Crafted by Master Chefs using pure ingredients, authentic dum-pukht recipes, and modern live food counters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                isSelected={false}
                onSelect={() => navigate(`/book?package=${pkg._id}`)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/catering"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-700 underline underline-offset-8 transition-colors"
            >
              Compare full course menus, custom dietary options and live counters →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE BANQUETFLOW */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-gold-700 uppercase mb-2 block">
            The BanquetFlow Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
            Why Host Your Events With Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-luxury p-8 border border-beige/60">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 flex items-center justify-center text-gold-600 mb-6 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">
              Zero Overlap & Real-Time Sync
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Our automated scheduling engine guarantees absolute double-booking prevention across morning, evening, and full-day slots.
            </p>
          </div>

          <div className="card-luxury p-8 border border-beige/60">
            <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-900 mb-6 shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">
              100% Transparent Price Breakdown
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              No hidden fees or unexpected post-event surcharges. Full itemized cost calculation for hall rental, catering per-person, and decor add-ons.
            </p>
          </div>

          <div className="card-luxury p-8 border border-beige/60">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 flex items-center justify-center text-gold-600 mb-6 shadow-sm">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">
              Dedicated Event Concierge
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              From audio-visual setup and bridal suite preparation to valet coordination, our hospitality team ensures perfection.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-gold-400 uppercase mb-2 block">
              Memories Cherished Forever
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Words From Our Hosts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-navy-800/80 border border-gold-500/20 backdrop-blur-md">
              <div className="flex items-center gap-1 text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                "Booking The Grand Crystal Ballroom on Marine Drive through BanquetFlow took all the stress out of our wedding planning. The price breakdown was clear and the royal catering was simply delicious!"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Priya Sharma"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
                />
                <div>
                  <h4 className="font-semibold text-sm text-white">Priya & Rohan Sharma</h4>
                  <p className="text-xs text-gold-400">Wedding Reception • Mumbai</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-navy-800/80 border border-gold-500/20 backdrop-blur-md">
              <div className="flex items-center gap-1 text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                "Our Annual Corporate Tech Summit for 300 delegates at Connaught Place was executed flawlessly. High-speed networking, LED wall integration, and seamless booking confirmations."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                  alt="Vikram Malhotra"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
                />
                <div>
                  <h4 className="font-semibold text-sm text-white">Vikram Malhotra</h4>
                  <p className="text-xs text-gold-400">Corporate Summit • New Delhi</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-navy-800/80 border border-gold-500/20 backdrop-blur-md">
              <div className="flex items-center gap-1 text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                "The Royal Heritage Haveli in Udaipur was dreamy! The fountain courtyard with live Rajasthani folk music and live chaat counters mesmerized our international guests."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Ananya Iyer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
                />
                <div>
                  <h4 className="font-semibold text-sm text-white">Ananya Iyer</h4>
                  <p className="text-xs text-gold-400">Sangeet Ceremony • Udaipur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-navy-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Plan an Unforgettable Gathering?
          </h2>
          <p className="text-base sm:text-lg font-medium text-navy-900/80 max-w-2xl mx-auto">
            Check real-time hall availability, configure catering packages, and reserve your dream banquet hall in minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto btn-navy py-4 px-8 text-sm uppercase tracking-widest font-extrabold shadow-2xl"
            >
              Start Instant Reservation
            </Link>
            <Link
              to="/halls"
              className="w-full sm:w-auto py-4 px-8 rounded-xl font-bold text-sm text-navy-950 bg-white/60 hover:bg-white transition-all border border-navy-950/20"
            >
              Browse All Banquet Halls
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

