import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Receipt
} from 'lucide-react';
import api from '../../services/api';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling administrative metrics..." />;
  }

  const { stats, recentBookings = [], recentCustomers = [] } = data || {};

  return (
    <div className="space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            BanquetFlow Central Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            System Operations Dashboard
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            Real-time tracking of venue bookings, customer spend, and catering revenues.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/halls"
            className="btn-navy py-2 px-4 text-xs font-bold"
          >
            + Add Banquet Hall
          </Link>
          <Link
            to="/admin/catering"
            className="btn-gold py-2 px-4 text-xs font-extrabold"
          >
            + Manage Catering
          </Link>
        </div>
      </div>

      {/* 6 Core Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <div className="card-luxury p-6 border-2 border-gold-500/40 bg-gradient-to-br from-gold-50/50 to-white shadow-gold-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-900">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-navy-900">
            {formatINR(stats?.totalRevenue || 0)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Confirmed & Completed Bookings
          </span>
        </div>

        {/* Total Bookings */}
        <div className="card-luxury p-6 border border-beige">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-navy-900">
            {stats?.totalBookings || 0}
          </p>
          <span className="text-[11px] text-charcoal/60 mt-1 block">
            Across all locations
          </span>
        </div>

        {/* Total Banquet Halls */}
        <div className="card-luxury p-6 border border-beige">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Banquet Halls
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-800 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-navy-900">
            {stats?.totalHalls || 0}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {stats?.activeHalls || 0} Active for online reservation
          </span>
        </div>

        {/* Confirmed Bookings */}
        <div className="card-luxury p-6 border border-emerald-200 bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Confirmed Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-emerald-950">
            {stats?.confirmedBookings || 0}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Slot guaranteed & active
          </span>
        </div>

        {/* Pending Bookings */}
        <div className="card-luxury p-6 border border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-amber-950">
            {stats?.pendingBookings || 0}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Awaiting admin status confirmation
          </span>
        </div>

        {/* Total Customers */}
        <div className="card-luxury p-6 border border-beige">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Registered Hosts
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-extrabold text-navy-900">
            {stats?.totalCustomers || 0}
          </p>
          <span className="text-[11px] text-charcoal/60 mt-1 block">
            Host accounts registered
          </span>
        </div>

      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="card-luxury p-6 sm:p-8 border border-beige shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-beige mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-900">
              Recent Reservations
            </h2>
            <p className="text-xs text-charcoal/60">
              Latest transactions and venue bookings submitted to the platform.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1"
          >
            View All ({stats?.totalBookings || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-beige text-charcoal/60 uppercase tracking-wider font-bold">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Host / Customer</th>
                <th className="pb-3">Banquet Hall</th>
                <th className="pb-3">Event Date & Slot</th>
                <th className="pb-3">Guests</th>
                <th className="pb-3">Total (₹)</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-offwhite/80">
                  <td className="py-3.5 font-mono font-bold text-navy-900">
                    {b.bookingId}
                  </td>
                  <td className="py-3.5">
                    <div className="font-bold text-navy-900">{b.customerName}</div>
                    <div className="text-[10px] text-charcoal/50">{b.customerEmail}</div>
                  </td>
                  <td className="py-3.5 font-medium text-navy-900">
                    {b.hall?.name || 'Grand Venue'}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-navy-900">{b.eventDate}</span>
                    <span className="block text-[10px] text-charcoal/60">{b.timeSlot?.split(' (')[0]}</span>
                  </td>
                  <td className="py-3.5 font-semibold">
                    {b.guestCount}
                  </td>
                  <td className="py-3.5 font-extrabold text-navy-900">
                    {formatINR(b.totalPrice)}
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.bookingStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;

