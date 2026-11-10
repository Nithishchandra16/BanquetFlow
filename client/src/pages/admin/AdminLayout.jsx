import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  CalendarCheck,
  Users,
  BarChart3,
  Crown,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/halls', label: 'Hall Management', icon: Building2 },
    { to: '/admin/catering', label: 'Catering Packages', icon: UtensilsCrossed },
    { to: '/admin/bookings', label: 'Bookings Manager', icon: CalendarCheck },
    { to: '/admin/customers', label: 'Registered Customers', icon: Users },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-offwhite flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between border-b border-gold-500/20">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-gold-400" />
          <span className="font-serif font-bold text-lg text-white">
            BanquetFlow <span className="text-gold-400 text-xs uppercase">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gold-400 focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-72 bg-navy-950 text-white border-r border-gold-500/20 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Crown className="w-6 h-6 text-navy-950" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-white">
                  Banquet<span className="text-gold-400">Flow</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                  Management Console
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'text-gray-300 hover:text-white hover:bg-navy-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Return to Store */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-gold-400 hover:bg-navy-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold-400" />
              Customer View
            </span>
            <span className="text-[10px] text-gray-500">Live</span>
          </Link>

          <div className="p-3 rounded-xl bg-navy-900 border border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-500"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gold-400">SuperAdmin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;

