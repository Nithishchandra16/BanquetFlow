import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Wind,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  Share2,
  AlertTriangle,
  Send
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../components/common/HallCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [hall, setHall] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Date Availability Checker
  const [checkDate, setCheckDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await api.get(`/halls/${id}`);
        if (response.success) {
          setHall(response.data);
          // Auto check default date availability
          checkDateAvailability(response.data._id, checkDate);
        }
      } catch (err) {
        toast.error('Failed to load banquet hall details');
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  const checkDateAvailability = async (hallId, date) => {
    if (!date) return;
    setCheckingAvailability(true);
    try {
      const res = await api.get(`/halls/${hallId}/availability`, { date });
      if (res.success) {
        setAvailability(res);
      }
    } catch (err) {
      console.error('Availability check failed:', err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to submit a review');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.warning('Please enter your review comments');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/halls/${id}/reviews`, { rating, comment });
      if (res.success) {
        toast.success('Your review has been published!');
        setHall(res.data);
        setComment('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading luxury venue details..." />;
  }

  if (!hall) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-offwhite">
        <div className="card-luxury p-12 text-center max-w-md">
          <Building2 className="w-16 h-16 text-gold-500/40 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Venue Not Found</h2>
          <p className="text-sm text-charcoal/70 mb-6">The requested banquet hall may have been archived or removed.</p>
          <Link to="/halls" className="btn-gold py-2.5 px-6 text-xs uppercase font-bold">
            Back to Banquet Halls
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pb-24">
      
      {/* 1. HERO BREADCRUMB & TITLE BAR */}
      <div className="bg-navy-900 text-white py-10 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gold-400 mb-2">
                <Link to="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link to="/halls" className="hover:underline">Banquet Halls</Link>
                <span>/</span>
                <span className="text-gray-300 truncate">{hall.name}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {hall.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-300">
                <span className="flex items-center gap-1.5 text-gold-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {hall.location}, {hall.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  Capacity: {hall.minCapacity} to {hall.maxCapacity} Guests
                </span>
                <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-md text-gold-400 font-bold border border-gold-500/30">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  {hall.rating?.toFixed(1) || '4.8'} ({hall.reviewCount || 0} Reviews)
                </span>
              </div>
            </div>

            {/* Quick Booking CTA */}
            <div className="flex items-center gap-3">
              <Link
                to={`/book?hall=${hall._id}`}
                className="btn-gold py-3.5 px-8 text-sm uppercase tracking-wider font-extrabold shadow-gold-md"
              >
                Book This Hall
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* 2. IMAGE GALLERY (Main + Thumbnails) */}
        <div className="mb-12">
          <div className="relative h-[420px] sm:h-[520px] rounded-3xl overflow-hidden bg-navy-900 shadow-2xl border border-beige">
            <img
              src={hall.images[selectedImage] || hall.images[0]}
              alt={hall.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-navy-900/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-gold-500/40">
                {hall.hallType} Venue
              </span>
              {hall.hasAC && (
                <span className="bg-blue-950/90 backdrop-blur-md text-blue-200 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-blue-400/40 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> Centralized Air Conditioning
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {hall.images.length > 1 && (
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {hall.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'ring-4 ring-gold-500 scale-95 shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${hall.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. MAIN CONTENT LAYOUT: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column (2 Cols): Details, Facilities, Rules, Reviews */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description & Overview */}
            <div className="card-luxury p-8 border border-beige">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">
                Venue Overview
              </h2>
              <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-line mb-6">
                {hall.description}
              </p>

              {/* Complete Address Box */}
              <div className="p-4 rounded-2xl bg-offwhite border border-beige flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                    Full Venue Address
                  </h4>
                  <p className="text-xs text-charcoal/80 mt-0.5">{hall.address}</p>
                </div>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="card-luxury p-8 border border-beige">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                Available Facilities & Equipment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hall.facilities?.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-offwhite border border-beige text-xs font-semibold text-navy-900"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hall Rules & Guidelines */}
            <div className="card-luxury p-8 border border-beige">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                Venue Rules & Regulations
              </h2>
              <ul className="space-y-3 text-xs text-charcoal/80">
                {hall.rules?.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 flex-shrink-0 mt-1.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Reviews Section */}
            <div className="card-luxury p-8 border border-beige">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-beige">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900">
                    Customer Reviews
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-1">
                    Based on verified host feedback and guest experiences.
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-2xl font-extrabold text-navy-900">
                    <Star className="w-6 h-6 fill-gold-500 text-gold-500" />
                    {hall.rating?.toFixed(1) || '4.8'}
                  </div>
                  <span className="text-[11px] text-charcoal/50">
                    {hall.reviews?.length || 0} Total Reviews
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6 mb-10">
                {hall.reviews && hall.reviews.length > 0 ? (
                  hall.reviews.map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-offwhite border border-beige">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-navy-800 text-gold-400 font-bold text-xs flex items-center justify-center">
                            {rev.userName?.[0] || 'U'}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-navy-900">{rev.userName}</h4>
                            <p className="text-[10px] text-charcoal/50">
                              {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gold-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-charcoal/80 leading-relaxed italic pl-10">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-charcoal/60 italic text-center py-6">
                    No reviews yet. Be the first to share your experience hosting here!
                  </p>
                )}
              </div>

              {/* Submit Review Box */}
              <div className="p-6 rounded-2xl bg-beige-light border border-beige">
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">
                  Write a Review
                </h3>
                <p className="text-xs text-charcoal/70 mb-4">
                  Share your event review to help other prospective hosts.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= rating
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-gray-300 hover:text-gold-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-navy-900 ml-2">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">
                      Your Experience / Comments
                    </label>
                    <textarea
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the venue ambiance, acoustics, staff hospitality, and overall experience..."
                      className="w-full bg-white border border-beige rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* Right Column (1 Col Sticky): Availability & Price Card */}
          <div className="space-y-8 sticky top-28">
            
            {/* Booking Summary Box */}
            <div className="card-luxury p-8 border-2 border-gold-500/40 shadow-xl bg-white">
              
              <div className="pb-6 border-b border-beige">
                <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-bold block">
                  Hall Base Rental
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-navy-900">
                    {formatINR(hall.hallPrice)}
                  </span>
                  <span className="text-xs text-charcoal/60 font-medium">/ event day</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Includes venue rental & primary facilities
                </p>
              </div>

              {/* Guest Capacity Badge */}
              <div className="py-4 border-b border-beige flex items-center justify-between text-xs">
                <span className="text-charcoal/70 flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-gold-600" /> Guest Capacity:
                </span>
                <span className="font-bold text-navy-900">
                  {hall.minCapacity} - {hall.maxCapacity} Guests
                </span>
              </div>

              {/* Live Date Availability Checker */}
              <div className="py-6 border-b border-beige space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold-600" />
                  Check Date Slot Availability
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkDate}
                    onChange={(e) => {
                      setCheckDate(e.target.value);
                      checkDateAvailability(hall._id, e.target.value);
                    }}
                    className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    type="button"
                    onClick={() => checkDateAvailability(hall._id, checkDate)}
                    className="btn-gold px-3 py-2 text-xs font-bold flex-shrink-0"
                    title="Check Availability"
                  >
                    Check
                  </button>
                </div>

                {/* Slot Status List */}
                {availability && (
                  <div className="mt-4 space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider">
                      Slots for {new Date(availability.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}:
                    </p>
                    {availability.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border ${
                          slot.isAvailable
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900 line-through opacity-75'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-current opacity-70" />
                          {slot.name.split(' (')[0]}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          slot.isAvailable ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
                        }`}>
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Big Booking Button */}
              <div className="pt-6">
                <Link
                  to={`/book?hall=${hall._id}&date=${checkDate}`}
                  className="w-full btn-gold py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest text-center shadow-gold-md hover:shadow-gold-lg flex items-center justify-center gap-2"
                >
                  Proceed to Book This Hall
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-charcoal/60 mt-3 font-medium">
                  Instant price calculation with catering & decor add-ons.
                </p>
              </div>

            </div>

            {/* Support / Need Assistance Box */}
            <div className="p-6 rounded-2xl bg-navy-900 text-white border border-gold-500/20">
              <h4 className="font-serif text-base font-bold text-gold-400 mb-2">
                Need Custom Event Planning?
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Our hospitality executives can assist with custom stage fabrication, liquor licensing, and multi-day packages.
              </p>
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Call +91 98765 43210 (24/7 Concierge)
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HallDetailPage;

