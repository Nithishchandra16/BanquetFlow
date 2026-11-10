import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminBookingsPage = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Selected booking modal view
  const [viewBooking, setViewBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await api.get('/bookings', params);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.success) {
        toast.success(`Booking status changed to ${newStatus}`);
        fetchBookings();
        if (viewBooking && viewBooking._id === bookingId) {
          setViewBooking(res.data);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving central bookings register..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            Schedule Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            Reservations & Bookings Manager
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            Confirm pending requests, enforce schedule exclusivity, and handle customer status changes.
          </p>
        </div>

        <span className="text-xs font-bold text-navy-900 bg-beige/60 px-4 py-2 rounded-xl border border-beige">
          Showing {bookings.length} Bookings
        </span>
      </div>

      {/* Filter Bar */}
      <div className="card-luxury p-5 border border-beige/80">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Booking ID, host name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-beige rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-offwhite border border-beige rounded-xl py-2.5 px-3 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-offwhite border border-beige rounded-xl py-2 px-3 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="card-luxury overflow-hidden border border-beige shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-navy-900 text-white uppercase tracking-wider font-bold">
                <th className="p-4 font-serif">Booking ID</th>
                <th className="p-4 font-serif">Host Details</th>
                <th className="p-4 font-serif">Venue</th>
                <th className="p-4 font-serif">Occasion & Date</th>
                <th className="p-4 font-serif">Guests</th>
                <th className="p-4 font-serif">Total (₹)</th>
                <th className="p-4 font-serif">Status</th>
                <th className="p-4 font-serif text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/80">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-offwhite/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-navy-900">
                    {b.bookingId}
                  </td>
                  <td className="p-4">
                    <strong className="text-navy-900 block">{b.customerName}</strong>
                    <span className="text-[10px] text-charcoal/60 block">{b.customerEmail}</span>
                    <span className="text-[10px] text-charcoal/60 block">{b.customerPhone}</span>
                  </td>
                  <td className="p-4 font-semibold text-navy-900">
                    {b.hall?.name || 'Grand Venue'}
                    <span className="block text-[10px] text-charcoal/50 font-normal">
                      {b.hall?.city}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-navy-900">{b.eventType}</span>
                    <span className="block text-[11px] text-gold-800 font-semibold">{b.eventDate}</span>
                    <span className="block text-[10px] text-charcoal/50">{b.timeSlot?.split(' (')[0]}</span>
                  </td>
                  <td className="p-4 font-bold text-navy-900">
                    {b.guestCount}
                  </td>
                  <td className="p-4 font-extrabold text-navy-900">
                    {formatINR(b.totalPrice)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.bookingStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : b.bookingStatus === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewBooking(b)}
                        className="p-1.5 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-900"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {b.bookingStatus === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white"
                          title="Confirm Booking"
                        >
                          Confirm
                        </button>
                      )}

                      {b.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'completed')}
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600 hover:bg-blue-700 text-white"
                          title="Mark Event Completed"
                        >
                          Complete
                        </button>
                      )}

                      {b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-rose-100 hover:bg-rose-200 text-rose-800"
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-luxury p-8 max-w-lg w-full bg-white border border-beige shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-beige mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">
                  Administrative Booking Dossier
                </p>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {viewBooking.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="w-8 h-8 rounded-full bg-offwhite hover:bg-beige flex items-center justify-center text-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Host Name:</span>
                <strong className="text-navy-900">{viewBooking.customerName}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Host Contact:</span>
                <span className="text-navy-900 font-semibold">{viewBooking.customerPhone} ({viewBooking.customerEmail})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Banquet Hall:</span>
                <strong className="text-navy-900">{viewBooking.hall?.name}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Event & Date:</span>
                <strong className="text-navy-900">{viewBooking.eventType} on {viewBooking.eventDate}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Time Slot:</span>
                <span className="text-navy-900 font-semibold">{viewBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/70">Guests:</span>
                <span className="text-navy-900 font-semibold">{viewBooking.guestCount} Guests</span>
              </div>
              {viewBooking.specialRequests && (
                <div className="p-3 rounded-xl bg-offwhite border border-beige">
                  <span className="text-[10px] font-bold text-navy-900 uppercase block mb-1">Special Instructions:</span>
                  <p className="text-charcoal/80 italic">{viewBooking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Pricing details */}
            <div className="p-4 rounded-xl bg-offwhite border border-beige space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span>Hall Rental Base:</span>
                <span className="font-bold">{formatINR(viewBooking.hallPrice)}</span>
              </div>
              {viewBooking.cateringTotal > 0 && (
                <div className="flex justify-between">
                  <span>Catering Total:</span>
                  <span className="font-bold">{formatINR(viewBooking.cateringTotal)}</span>
                </div>
              )}
              {viewBooking.additionalServicesTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-on Services:</span>
                  <span className="font-bold">{formatINR(viewBooking.additionalServicesTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>5% GST:</span>
                <span className="font-bold">{formatINR(viewBooking.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-beige text-sm font-extrabold text-navy-900">
                <span>Total Amount:</span>
                <span className="text-gold-600">{formatINR(viewBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-beige">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                viewBooking.bookingStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                Current: {viewBooking.bookingStatus}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(viewBooking._id, 'confirmed')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewBooking._id, 'cancelled')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookingsPage;

