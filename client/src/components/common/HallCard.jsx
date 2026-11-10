import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Wind, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const HallCard = ({ hall }) => {
  const primaryImage =
    hall.images && hall.images.length > 0
      ? hall.images[0]
      : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group card-luxury overflow-hidden flex flex-col h-full border border-beige hover:border-gold-500/50 transition-all duration-300">
      {/* Image Container with Badges */}
      <div className="relative h-64 overflow-hidden bg-navy-900">
        <img
          src={primaryImage}
          alt={hall.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/30" />

        {/* Featured Tag */}
        {hall.featured && (
          <div className="absolute top-4 left-4 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            ★ Featured Venue
          </div>
        )}

        {/* Hall Type & AC Badge */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          <span className="bg-navy-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/20">
            {hall.hallType}
          </span>
          {hall.hasAC && (
            <span className="bg-blue-900/80 backdrop-blur-md text-blue-200 text-xs font-semibold px-2 py-1 rounded-lg border border-blue-400/30 flex items-center gap-1">
              <Wind className="w-3 h-3" /> AC
            </span>
          )}
        </div>

        {/* Location & Rating Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-200">
            <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span className="truncate">{hall.location}, {hall.city}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-gold-400 border border-gold-400/20">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>{hall.rating?.toFixed(1) || '4.8'}</span>
            <span className="text-gray-400 text-[10px]">({hall.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1 mb-2">
            {hall.name}
          </h3>
          <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed mb-4">
            {hall.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-beige/60 text-xs text-charcoal/80 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span>
                <strong className="text-navy-900 font-semibold">{hall.minCapacity} - {hall.maxCapacity}</strong> Guests
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="truncate">
                {hall.facilities?.[0] || 'Valet Parking'}
              </span>
            </div>
          </div>
        </div>

        {/* Price & CTA Actions */}
        <div className="pt-2 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-charcoal/60 block font-medium">
              Base Rental
            </span>
            <span className="text-xl font-extrabold text-navy-900">
              {formatINR(hall.hallPrice)}
            </span>
            <span className="text-[10px] text-charcoal/50 ml-1">/ event</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/halls/${hall._id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide text-navy-800 bg-beige hover:bg-beige-dark transition-colors"
            >
              Details
            </Link>
            <Link
              to={`/book?hall=${hall._id}`}
              className="btn-gold py-2 px-3.5 text-xs font-bold shadow-none hover:shadow-gold-sm"
            >
              Reserve
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallCard;

