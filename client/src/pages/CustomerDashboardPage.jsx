import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UtensilsCrossed,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  ArrowRight,
  Filter,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../components/common/HallCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'confirmed', 'completed', 'cancelled'

  // Modals state
  const [selectedBookingForView, setSelectedBookingForView] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      toast.error('Failed to load your reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Compute Metrics
  const totalBookings = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' && b.eventDate >= todayStr
  );
  const completedBookings = bookings.filter(
    (b) => b.bookingStatus === 'completed' || (b.bookingStatus === 'confirmed' && b.eventDate < todayStr)
  );
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'cancelled');

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return b.bookingStatus === 'confirmed' && b.eventDate >= todayStr;
    if (activeFilter === 'completed') return b.bookingStatus === 'completed' || (b.bookingStatus === 'confirmed' && b.eventDate < todayStr);
    if (activeFilter === 'cancelled') return b.bookingStatus === 'cancelled';
    return b.bookingStatus === activeFilter;
  });

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    try {
      const res = await api.put(`/bookings/${selectedBookingForCancel._id}/cancel`, {
        cancellationReason: cancellationReason || 'Host schedule change'
      });
      if (res.success) {
        toast.success('Booking cancelled. Simulated refund initiated.');
        setSelectedBookingForCancel(null);
        setCancellationReason('');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving host profile & bookings..." />;
  }

  return (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Host Profile Banner */}
        <div className="card-luxury p-8 mb-10 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border-2 border-gold-500/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gold-400 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                    Host Portal
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span className="text-xs text-gray-300">Member since 2026</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Welcome, {user?.name}!
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gold-400" /> {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold-400" /> {user?.phone || 'Contact on file'}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/book"
              className="btn-gold py-3 px-6 text-xs uppercase font-extrabold tracking-wider shadow-gold-md"
            >
              + Reserve Another Venue
            </Link>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="card-luxury p-6 border border-beige/80">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block mb-1">
              Total Reservations
            </span>
            <p className="font-serif text-3xl font-extrabold text-navy-900">
              {totalBookings}
            </p>
            <span className="text-[11px] text-charcoal/50 mt-1 block">Lifetime event requests</span>
          </div>

          <div className="card-luxury p-6 border border-emerald-200 bg-emerald-50/30">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Upcoming Events
            </span>
            <p className="font-serif text-3xl font-extrabold text-emerald-900">
              {upcomingBookings.length}
            </p>
            <span className="text-[11px] text-emerald-700 mt-1 block">Confirmed upcoming dates</span>
          </div>

          <div className="card-luxury p-6 border border-beige/80">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block mb-1">
              Completed Events
            </span>
            <p className="font-serif text-3xl font-extrabold text-navy-900">
              {completedBookings.length}
            </p>
            <span className="text-[11px] text-charcoal/50 mt-1 block">Successfully hosted events</span>
          </div>

          <div className="card-luxury p-6 border border-rose-200 bg-rose-50/30">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-1">
              Cancelled Events
            </span>
            <p className="font-serif text-3xl font-extrabold text-rose-900">
              {cancelledBookings.length}
            </p>
            <span className="text-[11px] text-rose-700 mt-1 block">With simulated refunds</span>
          </div>

        </div>

        {/* MY BOOKINGS SECTION */}
        <div className="card-luxury p-6 sm:p-8 border border-beige/80 shadow-xl">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                My Bookings & Reservations
              </h2>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Manage your scheduled events, inspect invoices, and access cancellation policies.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All (${totalBookings})` },
                { id: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
                { id: 'completed', label: `Completed (${completedBookings.length})` },
                { id: 'cancelled', label: `Cancelled (${cancelledBookings.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeFilter === tab.id
                      ? 'bg-navy-900 text-gold-400 shadow-sm'
                      : 'bg-offwhite text-charcoal hover:bg-beige border border-beige'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-12 h-12 text-gold-500/40 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-navy-900 mb-1">
                No Bookings in this Category
              </h3>
              <p className="text-xs text-charcoal/60 mb-6 max-w-sm mx-auto">
                You don't have any reservations matching this status filter.
              </p>
              <Link to="/book" className="btn-gold py-2 px-6 text-xs uppercase font-bold">
                Reserve a Banquet Hall
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-beige/80">
              {filteredBookings.map((b) => {
                const isUpcoming = b.bookingStatus === 'confirmed' && b.eventDate >= todayStr;
                const isCancelled = b.bookingStatus === 'cancelled';

                let statusBadge = (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </span>
                );
                if (isCancelled) {
                  statusBadge = (
                    <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Cancelled
                    </span>
                  );
                } else if (b.bookingStatus === 'pending') {
                  statusBadge = (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Pending
                    </span>
                  );
                } else if (!isUpcoming && !isCancelled) {
                  statusBadge = (
                    <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Completed
                    </span>
                  );
                }

                return (
                  <div
                    key={b._id}
                    className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-offwhite/50 transition-colors p-3 rounded-2xl"
                  >
                    {/* Booking Details */}
                    <div className="flex gap-4 items-start">
                      <img
                        src={b.hall?.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80'}
                        alt={b.hall?.name}
                        className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-beige"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-gold-700 bg-gold-100/80 px-2 py-0.5 rounded">
                            {b.bookingId}
                          </span>
                          {statusBadge}
                          <span className="text-[11px] font-bold text-navy-900 bg-beige/60 px-2 py-0.5 rounded">
                            {b.eventType}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-navy-900">
                          {b.hall?.name || 'Grand Banquet Venue'}
                        </h3>
                        <p className="text-xs text-charcoal/70 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                          {b.hall?.location}, {b.hall?.city}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/70 mt-3">
                          <span className="flex items-center gap-1 font-semibold text-navy-900">
                            <Calendar className="w-3.5 h-3.5 text-gold-600" />
                            {b.eventDate} ({b.timeSlot?.split(' (')[0]})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gold-600" />
                            {b.guestCount} Guests
                          </span>
                          {b.package && (
                            <span className="flex items-center gap-1 text-gold-800 font-medium">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-gold-600" />
                              {b.package.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 min-w-[160px]">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-charcoal/60 block">
                          Total Price
                        </span>
                        <span className="text-lg font-extrabold text-navy-900">
                          {formatINR(b.totalPrice)}
                        </span>
                        <span className="text-[10px] text-emerald-700 block font-semibold">
                          Payment: {b.paymentStatus?.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBookingForView(b)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-navy-800 bg-beige hover:bg-beige-dark transition-colors flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Details
                        </button>

                        {isUpcoming && (
                          <button
                            onClick={() => setSelectedBookingForCancel(b)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: VIEW BOOKING DETAILS / INVOICE */}
      {selectedBookingForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-luxury p-8 max-w-lg w-full bg-white border border-beige shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-beige">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">
                  Reservation Invoice Receipt
                </p>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {selectedBookingForView.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForView(null)}
                className="w-8 h-8 rounded-full bg-offwhite hover:bg-beige flex items-center justify-center text-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Banquet Hall:</span>
                <span className="font-bold text-navy-900">{selectedBookingForView.hall?.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Event Occasion:</span>
                <span className="font-bold text-navy-900">{selectedBookingForView.eventType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Scheduled Date:</span>
                <span className="font-bold text-navy-900">{selectedBookingForView.eventDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Slot:</span>
                <span className="font-bold text-navy-900">{selectedBookingForView.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Guest Attendees:</span>
                <span className="font-bold text-navy-900">{selectedBookingForView.guestCount} Guests</span>
              </div>
              {selectedBookingForView.package && (
                <div className="flex justify-between py-1">
                  <span className="text-charcoal/70">Catering Package:</span>
                  <span className="font-bold text-navy-900">{selectedBookingForView.package.name}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown in Modal */}
            <div className="p-4 rounded-2xl bg-offwhite border border-beige space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Hall Rental Price:</span>
                <span className="font-bold">{formatINR(selectedBookingForView.hallPrice)}</span>
              </div>
              {selectedBookingForView.cateringTotal > 0 && (
                <div className="flex justify-between">
                  <span>Catering Total:</span>
                  <span className="font-bold">{formatINR(selectedBookingForView.cateringTotal)}</span>
                </div>
              )}
              {selectedBookingForView.additionalServicesTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-on Services:</span>
                  <span className="font-bold">{formatINR(selectedBookingForView.additionalServicesTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>5% GST Tax:</span>
                <span className="font-bold">{formatINR(selectedBookingForView.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-beige text-sm font-extrabold text-navy-900">
                <span>Total Amount Paid:</span>
                <span className="text-gold-600">{formatINR(selectedBookingForView.totalPrice)}</span>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="btn-outline py-2 px-5 text-xs font-bold"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedBookingForView(null)}
                className="btn-gold py-2 px-6 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL BOOKING CONFIRMATION */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-luxury p-8 max-w-md w-full bg-white border border-rose-200 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">
              Cancel Reservation?
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
              Are you sure you want to cancel booking <strong className="text-navy-900">{selectedBookingForCancel.bookingId}</strong> for {selectedBookingForCancel.eventDate}? 
              The hall slot will be immediately released back to the public pool and a simulated refund will be processed.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Rescheduled wedding date, venue change..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="btn-outline py-2 px-4 text-xs font-bold"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboardPage;

