import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.warning('Please fill in all required fields (Name, Email, Password, Phone)');
      return;
    }

    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: 'customer'
      });
      toast.success(`Welcome to BanquetFlow, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-offwhite">
      <div className="max-w-lg w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-gold-sm mb-4">
            <Crown className="w-8 h-8 text-navy-950" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
            Create Host Account
          </h2>
          <p className="text-xs text-charcoal/70 mt-1">
            Join BanquetFlow to discover venues and reserve royal catering.
          </p>
        </div>

        {/* Register Card */}
        <div className="card-luxury p-8 border border-beige/80 shadow-2xl bg-white space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                Full Name of Host / Organiser *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Contact Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                City / Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Bandra West, Mumbai, MH"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 text-xs uppercase font-extrabold tracking-wider shadow-gold-sm hover:shadow-gold-md mt-4 flex items-center justify-center gap-2"
            >
              {loading ? 'Registering Account...' : 'Create Account & Access Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-beige text-center text-xs text-charcoal/70">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-navy-900 hover:text-gold-700 underline">
              Sign in to your account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

