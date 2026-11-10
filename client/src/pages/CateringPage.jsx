import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Sparkles,
  Users,
  Check,
  X,
  Coffee,
  Salad,
  Flame,
  Cake,
  ArrowRight,
  Info
} from 'lucide-react';
import api from '../services/api';
import PackageCard from '../components/common/PackageCard';
import { formatINR } from '../components/common/HallCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CateringPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(250);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'Basic', 'Premium', 'Royal'

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/catering');
        if (res.success) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error('Failed to load catering packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSelectPackage = (pkg) => {
    navigate(`/book?package=${pkg._id}&guests=${guestCount}`);
  };

  const filteredPackages =
    activeTab === 'all'
      ? packages
      : packages.filter((p) => p.packageType === activeTab);

  if (loading) {
    return <LoadingSpinner text="Preparing gourmet menus..." />;
  }

  return (
    <div className="min-h-screen bg-offwhite py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-bold uppercase tracking-wider mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5 text-gold-600" />
            Royal Culinary Experiences
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Curated Catering Packages
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            From traditional pure vegetarian feasts to royal Awadhi non-vegetarian delicacies and interactive live counters.
          </p>
        </div>

        {/* Interactive Guest Count Estimator Bar */}
        <div className="card-luxury p-6 mb-16 border border-beige/80 max-w-3xl mx-auto bg-white/80 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-900">
                  Guest Count Estimator
                </h3>
                <p className="text-xs text-charcoal/60">
                  Slide or adjust your expected attendees for dynamic cost calculation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full sm:w-48 accent-gold-500 cursor-pointer"
              />
              <div className="px-4 py-2 rounded-xl bg-navy-900 text-gold-400 font-bold text-sm min-w-[90px] text-center border border-gold-500/40">
                {guestCount} Guests
              </div>
            </div>
          </div>
        </div>

        {/* 3 Sample Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              isSelected={false}
              onSelect={handleSelectPackage}
              guestCount={guestCount}
            />
          ))}
        </div>

        {/* DETAILED MENU COMPARISON MATRIX */}
        <div className="mt-16 pt-16 border-t border-beige">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
              Package Feature & Course Comparison
            </h2>
            <p className="text-xs text-charcoal/70">
              Side-by-side inspection of all course offerings, dishes, and live counters.
            </p>
          </div>

          <div className="card-luxury overflow-hidden border border-beige shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-navy-900 text-white">
                    <th className="p-4 sm:p-6 font-serif text-sm font-bold tracking-wider">Features & Course</th>
                    {packages.map((p) => (
                      <th key={p._id} className="p-4 sm:p-6 font-serif text-sm font-bold text-gold-400 text-center min-w-[200px]">
                        {p.name}
                        <div className="text-xs font-normal text-white mt-1">
                          {formatINR(p.pricePerPerson)} / plate
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/80">
                  
                  {/* Dietary Preference */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">Dietary Spread</td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center font-semibold">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] ${
                          p.isVegOnly ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.isVegOnly ? 'Pure Vegetarian' : 'Veg & Non-Veg'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Welcome Drinks */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-gold-600" />
                        Welcome Drinks
                      </div>
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        <span className="font-bold text-navy-900 block mb-1">
                          {p.menuItems?.welcomeDrinks?.length || 0} Varieties
                        </span>
                        <span className="text-[11px] text-charcoal/70 leading-tight block">
                          {p.menuItems?.welcomeDrinks?.join(', ')}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Starters */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <Salad className="w-4 h-4 text-gold-600" />
                        Gourmet Starters
                      </div>
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        {p.menuItems?.starters?.length > 0 ? (
                          <>
                            <span className="font-bold text-navy-900 block mb-1">
                              {p.menuItems.starters.length} Specialties
                            </span>
                            <span className="text-[11px] text-charcoal/70 leading-tight block">
                              {p.menuItems.starters.join(', ')}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">Not included in Basic</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Main Course */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-gold-600" />
                        Main Course Specialties
                      </div>
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        <span className="font-bold text-navy-900 block mb-1">
                          {p.menuItems?.mainCourse?.length || 0} Royal Dishes
                        </span>
                        <span className="text-[11px] text-charcoal/70 leading-tight block max-w-xs mx-auto">
                          {p.menuItems?.mainCourse?.slice(0, 3).join(', ')}...
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Desserts */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <Cake className="w-4 h-4 text-gold-600" />
                        Artisanal Desserts
                      </div>
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        <span className="font-bold text-navy-900 block mb-1">
                          {p.menuItems?.desserts?.length || 0} Selections
                        </span>
                        <span className="text-[11px] text-charcoal/70 leading-tight block">
                          {p.menuItems?.desserts?.join(', ')}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Live Food Counters */}
                  <tr className="hover:bg-offwhite">
                    <td className="p-4 sm:p-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-gold-600" />
                        Live Interactive Stations
                      </div>
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        {p.menuItems?.liveCounters?.length > 0 ? (
                          <div className="space-y-1">
                            {p.menuItems.liveCounters.map((cntr, i) => (
                              <span key={i} className="inline-block bg-gold-100 text-gold-900 px-2 py-0.5 rounded text-[10px] font-semibold mr-1 mb-1">
                                {cntr}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No live counters</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Total for Selected Guests */}
                  <tr className="bg-beige-light font-bold">
                    <td className="p-4 sm:p-6 text-navy-900 text-sm">
                      Total for {guestCount} Guests
                    </td>
                    {packages.map((p) => (
                      <td key={p._id} className="p-4 sm:p-6 text-center">
                        <span className="text-base text-navy-900 block">
                          {formatINR(p.pricePerPerson * guestCount)}
                        </span>
                        <button
                          onClick={() => handleSelectPackage(p)}
                          className="mt-2 btn-gold py-1.5 px-4 text-[11px] uppercase tracking-wider font-extrabold"
                        >
                          Choose Package
                        </button>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CateringPage;

