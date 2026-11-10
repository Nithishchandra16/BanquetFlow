import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Heart, ShieldCheck, Clock, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-gray-300 pt-16 pb-12 border-t-2 border-gold-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
                <Crown className="w-5 h-5 text-navy-900" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                Banquet<span className="text-gold-400">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's premier banquet hall reservation and gourmet catering curation platform. 
              Connecting celebrations with royal heritage palaces and contemporary ballrooms.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30">
                <Award className="w-3.5 h-3.5" />
                SESD Capstone Project 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide mb-4">
              Explore BanquetFlow
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/halls" className="hover:text-gold-400 transition-colors">
                  Explore Luxury Venues
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:text-gold-400 transition-colors">
                  Catering Packages & Menus
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold-400 transition-colors">
                  Instant Availability Booking
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gold-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-400 transition-colors">
                  Sign In / Demo Accounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities / Venues */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide mb-4">
              Featured Venues
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/halls?city=Mumbai" className="hover:text-gold-400 transition-colors">
                  Marine Drive Ballrooms (Mumbai)
                </Link>
              </li>
              <li>
                <Link to="/halls?city=Udaipur" className="hover:text-gold-400 transition-colors">
                  Royal Heritage Havelis (Udaipur)
                </Link>
              </li>
              <li>
                <Link to="/halls?city=Bengaluru" className="hover:text-gold-400 transition-colors">
                  Emerald Glass Pavilions (Bengaluru)
                </Link>
              </li>
              <li>
                <Link to="/halls?city=New%20Delhi" className="hover:text-gold-400 transition-colors">
                  Connaught Imperial Suites (Delhi)
                </Link>
              </li>
              <li>
                <Link to="/halls?city=Hyderabad" className="hover:text-gold-400 transition-colors">
                  Jubilee Hills Horizon Decks (Hyderabad)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide mb-4">
              Concierge Desk
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>BanquetFlow Tower, Nariman Point, Marine Drive, Mumbai 400021</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>+91 98765 43210 (Toll Free 24/7)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>concierge@banquetflow.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>Mon - Sun: 9:00 AM - 11:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} BanquetFlow Technologies. Academic Project for Software Engineering & System Design.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              Simulated Payment & Double-Booking Protection Verified
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

