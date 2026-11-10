import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCustomersPage = () => {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers', { search });
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      toast.error('Failed to retrieve registered hosts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  if (loading) {
    return <LoadingSpinner text="Compiling registered host directory..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            Client Registry
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            Registered Host & Customer Directory
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            View customer contact records, individual reservation volume, and lifetime platform spend.
          </p>
        </div>

        <span className="text-xs font-bold text-navy-900 bg-beige/60 px-4 py-2 rounded-xl border border-beige">
          {customers.length} Hosts Registered
        </span>
      </div>

      {/* Search Input */}
      <div className="card-luxury p-5 border border-beige/80">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search host by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-beige rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-luxury overflow-hidden border border-beige shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-navy-900 text-white uppercase tracking-wider font-bold">
                <th className="p-4 font-serif">Customer / Host</th>
                <th className="p-4 font-serif">Contact Information</th>
                <th className="p-4 font-serif">Address / City</th>
                <th className="p-4 font-serif">Registered On</th>
                <th className="p-4 font-serif text-center">Reservations</th>
                <th className="p-4 font-serif text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/80">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-offwhite/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy-800 text-gold-400 font-bold flex items-center justify-center text-xs">
                        {c.name?.[0] || 'U'}
                      </div>
                      <div>
                        <strong className="text-navy-900 text-sm block">{c.name}</strong>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Host
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-navy-900 font-semibold block">{c.email}</span>
                    <span className="text-charcoal/60 block">{c.phone || 'N/A'}</span>
                  </td>
                  <td className="p-4 text-charcoal/80">
                    {c.address || 'Address on file'}
                  </td>
                  <td className="p-4 text-charcoal/60">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block bg-navy-100 text-navy-950 font-extrabold px-3 py-1 rounded-full text-xs">
                      {c.bookingCount}
                    </span>
                  </td>
                  <td className="p-4 text-right font-extrabold text-navy-900 text-sm">
                    {formatINR(c.totalSpent)}
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

export default AdminCustomersPage;

