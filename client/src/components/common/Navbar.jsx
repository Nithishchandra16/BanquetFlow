import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Crown,
  Calendar,
  UtensilsCrossed,
  Building2,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-all duration-200 py-1 border-b-2 ${
      isActive
        ? 'text-gold-500 border-gold-500 font-semibold'
        : 'text-gray-200 hover:text-gold-400 border-transparent hover:border-gold-400/50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-800/95 backdrop-blur-md border-b border-gold-500/20 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-sm group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 text-navy-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                Banquet<span className="text-gold-400">Flow</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-300 font-medium">
                Luxury Venues & Catering
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/halls" className={navLinkClasses}>
              Banquet Halls
            </NavLink>
            <NavLink to="/catering" className={navLinkClasses}>
              Catering Packages
            </NavLink>
            <NavLink to="/book" className={navLinkClasses}>
              Book Venue
            </NavLink>
          </nav>

          {/* User Controls / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-navy-900/60 border border-gold-500/30 hover:border-gold-500/60 transition-all text-left"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-500/50"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-tight max-w-[130px] truncate">
                      {user?.name}
                    </span>
                    <span className="text-[11px] font-medium text-gold-400 uppercase tracking-wider flex items-center gap-1">
                      {isAdmin ? (
                        <>
                          <ShieldAlert className="w-3 h-3 text-gold-400" />
                          Administrator
                        </>
                      ) : (
                        'Customer'
                      )}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gold-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-navy-900 border border-gold-500/30 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-white/10"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold-300 hover:bg-navy-800 hover:text-gold-200 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-gold-400" />
                          Admin Console
                        </Link>
                      ) : null}

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-navy-800 hover:text-gold-300 transition-colors"
                      >
                        <User className="w-4 h-4 text-gold-400" />
                        Customer Dashboard
                      </Link>

                      <Link
                        to="/dashboard?tab=bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-navy-800 hover:text-gold-300 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-gold-400" />
                        My Bookings
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gold-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-gold text-xs font-semibold uppercase tracking-wider py-2.5 px-5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gold-400 hover:text-white hover:bg-navy-700 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-gold-500/20 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:text-gold-400 hover:bg-navy-800"
            >
              Home
            </Link>
            <Link
              to="/halls"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:text-gold-400 hover:bg-navy-800"
            >
              Banquet Halls
            </Link>
            <Link
              to="/catering"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:text-gold-400 hover:bg-navy-800"
            >
              Catering Packages
            </Link>
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gold-400 bg-navy-800"
            >
              Book Venue
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-gold-400">{user?.role?.toUpperCase()}</p>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gold-400 hover:bg-navy-800"
                  >
                    Admin Console
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-navy-800"
                >
                  Customer Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-gold-500/40 text-gold-400 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-gold text-center py-2.5 text-sm"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

