import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, ShieldAlert, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsCustomer, loginAsAdmin } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'

  const from = location.state?.from?.pathname || (activeTab === 'admin' ? '/admin/dashboard' : '/dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    try {
      const user = await loginAsCustomer();
      toast.success(`Signed in as Demo Host (${user.name})`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      const user = await loginAsAdmin();
      toast.success(`Signed in as System Administrator (${user.name})`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Demo admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-offwhite">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-gold-sm mb-4">
            <Crown className="w-8 h-8 text-navy-950" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
            Sign In to BanquetFlow
          </h2>
          <p className="text-xs text-charcoal/70 mt-1">
            Access your reservations, invoices, or administrative console.
          </p>

          {/* Quick Role Switcher Tabs */}
          <div className="flex bg-beige/60 p-1 rounded-xl max-w-xs mx-auto mt-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setEmail('customer@banquetflow.com');
                setPassword('customer123');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-charcoal/70 hover:text-navy-900'
              }`}
            >
              Host / Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setEmail('admin@banquetflow.com');
                setPassword('admin123');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-navy-900 text-gold-400 shadow-sm'
                  : 'text-charcoal/70 hover:text-navy-900'
              }`}
            >
              Administrator
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="card-luxury p-8 border border-beige/80 shadow-2xl bg-white space-y-6">
          
          {/* One-Click Fast Demo Credentials Buttons */}
          <div className="p-3.5 rounded-xl bg-gold-50 border border-gold-300/80">
            <span className="text-[11px] font-bold text-gold-900 flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Fast Academic Demo Login:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="py-1.5 px-2 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-[11px] font-bold transition-colors shadow-xs"
              >
                Host Demo Login
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-1.5 px-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 text-[11px] font-extrabold transition-colors shadow-xs"
              >
                Admin Demo Login
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-offwhite border border-beige rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 text-xs uppercase font-extrabold tracking-wider shadow-gold-sm hover:shadow-gold-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : `Sign In as ${activeTab === 'admin' ? 'Administrator' : 'Customer'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-beige text-center text-xs text-charcoal/70">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-navy-900 hover:text-gold-700 underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

