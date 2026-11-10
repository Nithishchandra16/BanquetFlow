import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading BanquetFlow...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-gold-200 border-t-gold-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-navy-800" />
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-navy-800 tracking-wide uppercase font-serif">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

