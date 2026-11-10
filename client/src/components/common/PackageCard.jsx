import React from 'react';
import { Check, UtensilsCrossed, Sparkles, Flame, Coffee, Salad, Cake } from 'lucide-react';
import { formatINR } from './HallCard';

const PackageCard = ({ pkg, isSelected, onSelect, guestCount = 100 }) => {
  const isRoyal = pkg.packageType === 'Royal';
  const isPremium = pkg.packageType === 'Premium';

  return (
    <div
      className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'ring-4 ring-gold-500 shadow-gold-lg scale-[1.02] bg-white'
          : isRoyal
          ? 'border-2 border-gold-500/60 bg-gradient-to-b from-navy-900 to-navy-800 text-white shadow-xl'
          : 'border border-beige/80 bg-white shadow-luxury hover:border-gold-500/40 text-charcoal'
      }`}
    >
      {/* Popular or Recommended Tag */}
      {(pkg.popular || isRoyal) && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-extrabold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {isRoyal ? 'Most Luxurious' : 'Chef Recommended'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isRoyal
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                : 'bg-gold-100 text-gold-800 border border-gold-300'
            }`}
          >
            {pkg.packageType} Package
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              pkg.isVegOnly
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {pkg.isVegOnly ? 'Pure Veg' : 'Veg & Non-Veg'}
          </span>
        </div>

        <h3
          className={`font-serif text-2xl font-bold mb-2 ${
            isRoyal ? 'text-white' : 'text-navy-900'
          }`}
        >
          {pkg.name}
        </h3>
        <p
          className={`text-xs leading-relaxed mb-6 ${
            isRoyal ? 'text-gray-300' : 'text-charcoal/70'
          }`}
        >
          {pkg.description}
        </p>

        {/* Pricing */}
        <div className="pb-6 border-b border-beige/40">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl font-extrabold ${
                isRoyal ? 'text-gold-400' : 'text-navy-900'
              }`}
            >
              {formatINR(pkg.pricePerPerson)}
            </span>
            <span className={`text-xs ${isRoyal ? 'text-gray-300' : 'text-charcoal/60'}`}>
              / plate (per guest)
            </span>
          </div>
          {guestCount > 0 && (
            <p className={`text-xs mt-1 font-medium ${isRoyal ? 'text-gold-300/80' : 'text-charcoal/60'}`}>
              Estimated catering: <strong className={isRoyal ? 'text-gold-300' : 'text-navy-900'}>{formatINR(pkg.pricePerPerson * guestCount)}</strong> for {guestCount} guests
            </p>
          )}
        </div>
      </div>

      {/* Menu Courses & Features */}
      <div className="p-8 pt-4 flex-1">
        <h4 className={`text-xs uppercase tracking-wider font-bold mb-3 ${isRoyal ? 'text-gold-400' : 'text-navy-900'}`}>
          Included Highlights
        </h4>
        <ul className="space-y-2.5 text-xs mb-6">
          {pkg.features?.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isRoyal ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-50 text-gold-600'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className={isRoyal ? 'text-gray-200' : 'text-charcoal/80'}>
                {feat}
              </span>
            </li>
          ))}
        </ul>

        {/* Sample Menu Course counts */}
        <div className={`p-4 rounded-2xl text-xs space-y-2 ${isRoyal ? 'bg-navy-950/60 border border-gold-500/20' : 'bg-offwhite border border-beige'}`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 opacity-80">
              <Coffee className="w-3.5 h-3.5 text-gold-500" /> Welcome Drinks
            </span>
            <span className="font-semibold">{pkg.menuItems?.welcomeDrinks?.length || 2} Varieties</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 opacity-80">
              <Salad className="w-3.5 h-3.5 text-gold-500" /> Starters / Appetizers
            </span>
            <span className="font-semibold">{pkg.menuItems?.starters?.length || 0} Specialties</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 opacity-80">
              <UtensilsCrossed className="w-3.5 h-3.5 text-gold-500" /> Main Course Dishes
            </span>
            <span className="font-semibold">{pkg.menuItems?.mainCourse?.length || 4} Dishes</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 opacity-80">
              <Cake className="w-3.5 h-3.5 text-gold-500" /> Desserts & Sweets
            </span>
            <span className="font-semibold">{pkg.menuItems?.desserts?.length || 2} Selections</span>
          </div>

          {pkg.menuItems?.liveCounters?.length > 0 && (
            <div className="flex items-center justify-between text-gold-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Live Food Stations
              </span>
              <span>{pkg.menuItems.liveCounters.length} Counters</span>
            </div>
          )}
        </div>
      </div>

      {/* Select Action Button */}
      {onSelect && (
        <div className="p-8 pt-0">
          <button
            type="button"
            onClick={() => onSelect(pkg)}
            className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isSelected
                ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                : isRoyal
                ? 'bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold'
                : 'bg-navy-800 hover:bg-navy-900 text-white'
            }`}
          >
            {isSelected ? '✓ Package Selected' : `Select ${pkg.name}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageCard;

