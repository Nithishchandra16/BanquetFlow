import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Coffee,
  Salad,
  Flame,
  Cake,
  IndianRupee,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCateringPage = () => {
  const toast = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '',
    packageType: 'Basic',
    description: '',
    pricePerPerson: 850,
    isVegOnly: true,
    welcomeDrinks: 'Fresh Mint Cooler, Kesar Panna',
    starters: 'Paneer Tikka, Crispy Corn',
    mainCourse: 'Paneer Butter Masala, Dal Makhani, Dum Biryani, Assorted Breads',
    desserts: 'Gulab Jamun with Rabdi, Malai Kulfi',
    liveCounters: '',
    features: 'Standard Menu, 2 Welcome Drinks, Traditional Main Course, 2 Desserts',
    status: 'active',
    popular: false
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/catering', { status: 'all' });
      if (res.success) {
        setPackages(res.data);
      }
    } catch (err) {
      toast.error('Failed to load catering packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      packageType: pkg.packageType,
      description: pkg.description,
      pricePerPerson: pkg.pricePerPerson,
      isVegOnly: pkg.isVegOnly,
      welcomeDrinks: pkg.menuItems?.welcomeDrinks?.join(', ') || '',
      starters: pkg.menuItems?.starters?.join(', ') || '',
      mainCourse: pkg.menuItems?.mainCourse?.join(', ') || '',
      desserts: pkg.menuItems?.desserts?.join(', ') || '',
      liveCounters: pkg.menuItems?.liveCounters?.join(', ') || '',
      features: pkg.features?.join(', ') || '',
      status: pkg.status,
      popular: pkg.popular
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        packageType: formData.packageType,
        description: formData.description,
        pricePerPerson: Number(formData.pricePerPerson),
        isVegOnly: formData.isVegOnly,
        menuItems: {
          welcomeDrinks: formData.welcomeDrinks.split(',').map((s) => s.trim()).filter(Boolean),
          starters: formData.starters.split(',').map((s) => s.trim()).filter(Boolean),
          mainCourse: formData.mainCourse.split(',').map((s) => s.trim()).filter(Boolean),
          desserts: formData.desserts.split(',').map((s) => s.trim()).filter(Boolean),
          liveCounters: formData.liveCounters.split(',').map((s) => s.trim()).filter(Boolean)
        },
        features: formData.features.split(',').map((s) => s.trim()).filter(Boolean),
        status: formData.status,
        popular: formData.popular
      };

      if (editingPackage) {
        const res = await api.put(`/catering/${editingPackage._id}`, payload);
        if (res.success) {
          toast.success('Catering package updated successfully');
        }
      } else {
        const res = await api.post('/catering', payload);
        if (res.success) {
          toast.success('New catering package created');
        }
      }

      setShowModal(false);
      fetchPackages();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pkgId) => {
    if (!window.confirm('Delete this catering package?')) return;
    try {
      const res = await api.delete(`/catering/${pkgId}`);
      if (res.success) {
        toast.success('Package deleted');
        fetchPackages();
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading catering menu manager..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            Culinary Packages
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            Catering Package Management
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            Configure menu courses, customize live counters, and update per-person pricing in INR.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider shadow-gold-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Catering Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="card-luxury p-6 border border-beige flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gold-800 bg-gold-100 px-2.5 py-0.5 rounded-full">
                  {pkg.packageType}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  pkg.isVegOnly ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {pkg.isVegOnly ? 'Veg' : 'Non-Veg'}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-navy-900 mb-1">
                {pkg.name}
              </h3>
              <p className="text-xs text-charcoal/70 line-clamp-2 mb-4">
                {pkg.description}
              </p>

              <div className="p-3.5 rounded-xl bg-offwhite border border-beige mb-4">
                <span className="text-[10px] uppercase font-bold text-charcoal/60 block">Price Per Person</span>
                <span className="text-2xl font-extrabold text-navy-900">{formatINR(pkg.pricePerPerson)}</span>
                <span className="text-xs text-charcoal/50 ml-1">/ plate</span>
              </div>

              {/* Course Counts */}
              <div className="space-y-1.5 text-xs text-charcoal/80 mb-4">
                <div className="flex justify-between">
                  <span>Welcome Drinks:</span>
                  <strong>{pkg.menuItems?.welcomeDrinks?.length || 0} items</strong>
                </div>
                <div className="flex justify-between">
                  <span>Starters:</span>
                  <strong>{pkg.menuItems?.starters?.length || 0} items</strong>
                </div>
                <div className="flex justify-between">
                  <span>Main Course:</span>
                  <strong>{pkg.menuItems?.mainCourse?.length || 0} items</strong>
                </div>
                <div className="flex justify-between">
                  <span>Desserts:</span>
                  <strong>{pkg.menuItems?.desserts?.length || 0} items</strong>
                </div>
                {pkg.menuItems?.liveCounters?.length > 0 && (
                  <div className="flex justify-between text-gold-700 font-semibold">
                    <span>Live Counters:</span>
                    <strong>{pkg.menuItems.liveCounters.length} counters</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-beige flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                pkg.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {pkg.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(pkg)}
                  className="p-2 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-900 transition-colors"
                  title="Edit Package"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT PACKAGE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-luxury p-8 max-w-2xl w-full bg-white border border-beige shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-beige mb-6">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {editingPackage ? 'Edit Catering Package' : 'Add New Catering Package'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-offwhite hover:bg-beige flex items-center justify-center text-charcoal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Package Tier *
                  </label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Basic">Basic Package</option>
                    <option value="Premium">Premium Package</option>
                    <option value="Royal">Royal Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Price Per Person (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Course Items */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Welcome Drinks (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeDrinks}
                    onChange={(e) => setFormData({ ...formData, welcomeDrinks: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Starters / Appetizers (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.starters}
                    onChange={(e) => setFormData({ ...formData, starters: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Main Course Dishes (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.mainCourse}
                    onChange={(e) => setFormData({ ...formData, mainCourse: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Desserts (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.desserts}
                    onChange={(e) => setFormData({ ...formData, desserts: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Live Food Counters (Optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chaat Counter, Wood-fired Pizza"
                    value={formData.liveCounters}
                    onChange={(e) => setFormData({ ...formData, liveCounters: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVegOnly}
                      onChange={(e) => setFormData({ ...formData, isVegOnly: e.target.checked })}
                      className="rounded accent-gold-500"
                    />
                    Pure Vegetarian Only
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded accent-gold-500"
                    />
                    Mark as Chef Recommended
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-beige flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline py-2 px-5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold py-2 px-6 text-xs font-extrabold"
                >
                  {submitting ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCateringPage;

