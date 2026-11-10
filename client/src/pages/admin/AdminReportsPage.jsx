import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Building2,
  UtensilsCrossed,
  Sparkles,
  Calendar,
  IndianRupee,
  PieChart,
  Download
} from 'lucide-react';
import api from '../../services/api';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Generating analytical intelligence..." />;
  }

  const {
    monthlyStats = [],
    popularHalls = [],
    popularPackages = [],
    eventTypeDistribution = []
  } = data || {};

  const totalReportRevenue = monthlyStats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalReportBookings = monthlyStats.reduce((acc, curr) => acc + curr.bookingsCount, 0);

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            Executive Intelligence
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            Revenue & Performance Reports
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            Statistical breakdown of monthly revenues, hall popularity index, and catering package demand.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-outline py-2 px-5 text-xs font-bold flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Print / Export Report
        </button>
      </div>

      {/* Monthly Revenue & Trend Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Metric Card */}
        <div className="card-luxury p-6 border-2 border-gold-500/30 bg-white space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
            Total Aggregate Platform Volume
          </span>
          <div>
            <p className="text-xs text-charcoal/60">Total Confirmed Event Value</p>
            <p className="font-serif text-3xl font-extrabold text-navy-900">
              {formatINR(totalReportRevenue)}
            </p>
          </div>

          <div className="pt-4 border-t border-beige flex items-center justify-between text-xs">
            <span className="text-charcoal/70">Scheduled Events:</span>
            <strong className="text-navy-900">{totalReportBookings} Gatherings</strong>
          </div>
        </div>

        {/* Monthly Trend Visualizer */}
        <div className="lg:col-span-2 card-luxury p-6 border border-beige bg-white">
          <h3 className="font-serif text-base font-bold text-navy-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-600" />
            Monthly Revenue Trajectory
          </h3>
          <p className="text-xs text-charcoal/60 mb-6">
            Gross booking values partitioned by event scheduled month.
          </p>

          <div className="space-y-4">
            {monthlyStats.length === 0 ? (
              <p className="text-xs text-charcoal/50 italic py-6 text-center">
                Monthly trend metrics will appear as additional events are confirmed.
              </p>
            ) : (
              monthlyStats.map((item, idx) => {
                const maxRev = Math.max(...monthlyStats.map((m) => m.revenue), 1);
                const percent = Math.min(Math.round((item.revenue / maxRev) * 100), 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-navy-900 font-mono">{item._id}</span>
                      <span className="text-navy-900">{formatINR(item.revenue)} ({item.bookingsCount} events)</span>
                    </div>
                    <div className="w-full bg-offwhite h-3 rounded-full overflow-hidden border border-beige">
                      <div
                        className="bg-gradient-to-r from-gold-400 to-gold-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 2 Grids: Most Popular Halls & Most Popular Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Popular Banquet Halls */}
        <div className="card-luxury p-6 sm:p-8 border border-beige bg-white">
          <h3 className="font-serif text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-600" />
            Most Popular Banquet Halls
          </h3>
          <p className="text-xs text-charcoal/60 mb-6">
            Ranked by total host booking frequency and revenue generated.
          </p>

          <div className="space-y-4">
            {popularHalls.map((hall, idx) => (
              <div key={hall._id} className="p-4 rounded-2xl bg-offwhite border border-beige flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="truncate">
                    <h4 className="font-serif text-sm font-bold text-navy-900 truncate">{hall.hallName}</h4>
                    <p className="text-xs text-charcoal/60">{hall.city} • Base {formatINR(hall.hallPrice)}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-navy-900 block">{hall.totalBookings} Bookings</span>
                  <span className="text-[11px] text-gold-700 font-semibold">{formatINR(hall.revenueGenerated)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Catering Packages */}
        <div className="card-luxury p-6 sm:p-8 border border-beige bg-white">
          <h3 className="font-serif text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-gold-600" />
            Popular Catering Packages
          </h3>
          <p className="text-xs text-charcoal/60 mb-6">
            Distribution of host culinary preferences across Basic, Premium, and Royal menus.
          </p>

          <div className="space-y-4">
            {popularPackages.map((pkg, idx) => (
              <div key={pkg._id} className="p-4 rounded-2xl bg-offwhite border border-beige flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="truncate">
                    <h4 className="font-serif text-sm font-bold text-navy-900 truncate">{pkg.packageName}</h4>
                    <p className="text-xs text-charcoal/60">{pkg.packageType} Tier • {formatINR(pkg.pricePerPerson)} / plate</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-navy-900 block">{pkg.totalBookings} Selections</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{formatINR(pkg.cateringRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Event Type Distribution */}
      <div className="card-luxury p-6 sm:p-8 border border-beige bg-white">
        <h3 className="font-serif text-xl font-bold text-navy-900 mb-1 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-gold-600" />
          Event Occasion Distribution
        </h3>
        <p className="text-xs text-charcoal/60 mb-6">
          Classification of events booked on BanquetFlow (Weddings, Receptions, Corporate, Birthdays).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {eventTypeDistribution.map((item) => (
            <div key={item._id} className="p-4 rounded-2xl bg-offwhite border border-beige text-center">
              <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                {item._id}
              </span>
              <p className="font-serif text-2xl font-extrabold text-navy-900">
                {item.count}
              </p>
              <span className="text-[11px] text-gold-700 font-bold mt-1 block">
                {formatINR(item.totalRevenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminReportsPage;

