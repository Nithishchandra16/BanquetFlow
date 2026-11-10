import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  Wind,
  Search,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../components/common/HallCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminHallsPage = () => {
  const toast = useToast();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    location: '',
    city: 'Mumbai',
    address: '',
    description: '',
    minCapacity: 100,
    maxCapacity: 500,
    hallPrice: 120000,
    hallType: 'Indoor',
    hasAC: true,
    facilities: 'Centralized Air Conditioning, Valet Parking, Bridal Suite, Audio System, Generator Backup',
    images: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    featured: false
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchHalls = async () => {
    try {
      const res = await api.get('/halls', { status: 'all', search });
      if (res.success) {
        setHalls(res.data);
      }
    } catch (err) {
      toast.error('Failed to load banquet halls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingHall(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEditModal = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      location: hall.location,
      city: hall.city,
      address: hall.address,
      description: hall.description,
      minCapacity: hall.minCapacity,
      maxCapacity: hall.maxCapacity,
      hallPrice: hall.hallPrice,
      hallType: hall.hallType,
      hasAC: hall.hasAC,
      facilities: Array.isArray(hall.facilities) ? hall.facilities.join(', ') : hall.facilities,
      images: Array.isArray(hall.images) ? hall.images.join(', ') : hall.images,
      status: hall.status,
      featured: hall.featured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        minCapacity: Number(formData.minCapacity),
        maxCapacity: Number(formData.maxCapacity),
        hallPrice: Number(formData.hallPrice),
        facilities: formData.facilities.split(',').map((f) => f.trim()).filter(Boolean),
        images: formData.images.split(',').map((i) => i.trim()).filter(Boolean)
      };

      if (editingHall) {
        const res = await api.put(`/halls/${editingHall._id}`, payload);
        if (res.success) {
          toast.success('Banquet hall updated successfully');
        }
      } else {
        const res = await api.post('/halls', payload);
        if (res.success) {
          toast.success('New banquet hall created successfully');
        }
      }

      setShowModal(false);
      fetchHalls();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (hallId) => {
    if (!window.confirm('Are you sure you want to delete this banquet hall?')) return;
    try {
      const res = await api.delete(`/halls/${hallId}`);
      if (res.success) {
        toast.success('Banquet hall deleted');
        fetchHalls();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete hall');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading halls administration..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
            Venue Inventory
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight mt-2">
            Banquet Hall Management
          </h1>
          <p className="text-xs text-charcoal/70 mt-0.5">
            Add new venues, update pricing, manage guest limits, and toggle public availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider shadow-gold-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Banquet Hall
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search halls by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-beige rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-charcoal/60 font-semibold">
          Total Halls in Database: <strong className="text-navy-900">{halls.length}</strong>
        </span>
      </div>

      {/* Halls Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall._id} className="card-luxury p-5 border border-beige flex flex-col justify-between">
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-navy-900">
                <img
                  src={hall.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  hall.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-200'
                }`}>
                  {hall.status}
                </span>
                {hall.featured && (
                  <span className="absolute top-3 left-3 bg-gold-500 text-navy-950 font-bold text-[10px] px-2 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-navy-900 mb-1 line-clamp-1">
                {hall.name}
              </h3>
              <p className="text-xs text-charcoal/70 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                {hall.location}, {hall.city}
              </p>

              <div className="space-y-1.5 py-3 border-y border-beige text-xs text-charcoal/80 mb-4">
                <div className="flex justify-between">
                  <span>Guest Capacity:</span>
                  <strong className="text-navy-900">{hall.minCapacity} - {hall.maxCapacity}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Venue Type:</span>
                  <span className="font-semibold text-navy-900">{hall.hallType} ({hall.hasAC ? 'AC' : 'Non-AC'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Rental:</span>
                  <strong className="text-navy-900 font-extrabold">{formatINR(hall.hallPrice)}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-charcoal/50">
                Rating: {hall.rating} ★ ({hall.reviewCount})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(hall)}
                  className="p-2 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-900 transition-colors"
                  title="Edit Banquet Hall"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(hall._id)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  title="Delete Hall"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT BANQUET HALL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-luxury p-8 max-w-2xl w-full bg-white border border-beige shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-beige mb-6">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {editingHall ? 'Edit Banquet Hall' : 'Add New Banquet Hall'}
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
                    Banquet Hall Name *
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
                    Locality / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Minimum Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.minCapacity}
                    onChange={(e) => setFormData({ ...formData, minCapacity: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Maximum Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Base Rental Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.hallPrice}
                    onChange={(e) => setFormData({ ...formData, hallPrice: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Venue Type & Climate
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.hallType}
                      onChange={(e) => setFormData({ ...formData, hallType: e.target.value })}
                      className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Both">Both</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-navy-900 px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasAC}
                        onChange={(e) => setFormData({ ...formData, hasAC: e.target.checked })}
                        className="rounded accent-gold-500"
                      />
                      AC
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Facilities (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-navy-900 mb-1">
                    Image URLs (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                      className="rounded accent-gold-500"
                    />
                    Active for Reservations
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded accent-gold-500"
                    />
                    Feature on Homepage
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
                  {submitting ? 'Saving...' : editingHall ? 'Update Hall' : 'Create Hall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHallsPage;

