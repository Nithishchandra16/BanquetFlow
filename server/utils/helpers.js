/**
 * Utility functions for BanquetFlow Server
 */

// Format currency to INR format string
const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Check if a date string is a valid future date
const isValidFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !isNaN(date.getTime()) && date >= today;
};

// Generate unique booking code
const generateUniqueBookingId = (prefix = 'BF') => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${randomSuffix}`;
};

module.exports = {
  formatCurrencyINR,
  isValidFutureDate,
  generateUniqueBookingId
};

