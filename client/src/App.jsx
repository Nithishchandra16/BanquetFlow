import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Common
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import HallsPage from './pages/HallsPage';
import HallDetailPage from './pages/HallDetailPage';
import CateringPage from './pages/CateringPage';
import BookingWizardPage from './pages/BookingWizardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminHallsPage from './pages/admin/AdminHallsPage';
import AdminCateringPage from './pages/admin/AdminCateringPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Scroll to Top Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center p-8 bg-offwhite text-center">
    <div className="card-luxury p-12 max-w-md">
      <h1 className="font-serif text-6xl font-extrabold text-navy-900 mb-2">404</h1>
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">Page Not Found</h2>
      <p className="text-xs text-charcoal/70 mb-6">
        The luxury venue or page you are seeking does not exist or has moved.
      </p>
      <a href="/" className="btn-gold py-2.5 px-6 text-xs uppercase font-bold">
        Return to Home
      </a>
    </div>
  </div>
);

// Public / Customer Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">
      {children}
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public & Customer Routes with Standard Header & Footer */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/halls"
          element={
            <PublicLayout>
              <HallsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/halls/:id"
          element={
            <PublicLayout>
              <HallDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/catering"
          element={
            <PublicLayout>
              <CateringPage />
            </PublicLayout>
          }
        />
        <Route
          path="/book"
          element={
            <PublicLayout>
              <BookingWizardPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        {/* Protected Customer Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <CustomerDashboardPage />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Console Routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="halls" element={<AdminHallsPage />} />
          <Route path="catering" element={<AdminCateringPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>

        {/* 404 Catch All */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;

