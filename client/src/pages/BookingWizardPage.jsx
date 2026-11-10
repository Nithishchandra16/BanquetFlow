import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Building2,
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  UserCheck,
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Download,
  Printer
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../components/common/HallCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EVENT_TYPES = [
  'Wedding',
  'Reception',
  'Engagement',
  'Birthday',
  'Corporate Event',
  'Anniversary',
  'Other'
];

const TIME_SLOTS = [
  {
    id: 'Morning (9:00 AM - 3:00 PM)',
    name: 'Morning Session',
    time: '9:00 AM - 3:00 PM',
    desc: 'Ideal for traditional ceremonies, breakfast/lunch receptions & conferences'
  },
  {
    id: 'Evening (5:00 PM - 11:30 PM)',
    name: 'Evening Grand Gala',
    time: '5:00 PM - 11:30 PM',
    desc: 'Prime slot for cocktail nights, sangeet, dinners & royal receptions'
  },
  {
    id: 'Full Day (9:00 AM - 11:00 PM)',
    name: 'Full Day Extravaganza',
    time: '9:00 AM - 11:00 PM',
    desc: 'Exclusive full-day private palace access for all rituals and parties'
  }
];

const ADDON_SERVICES = [
  { id: 'stage_decor', name: 'Royal Stage Floral Decor & Grand Arch', price: 45000 },
  { id: 'dj_lighting', name: 'Concert Grade JBL DJ & Moving Beam Lights', price: 25000 },
  { id: 'photo_drone', name: 'Cinematic 4K Photography & Drone Coverage', price: 38000 },
  { id: 'valet_crew', name: 'Dedicated Valet Chauffeurs & Security Team', price: 15000 }
];

const BookingWizardPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [halls, setHalls] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking Form State
  const [selectedHallId, setSelectedHallId] = useState(searchParams.get('hall') || '');
  const [eventType, setEventType] = useState(searchParams.get('eventType') || 'Wedding');
  const [eventDate, setEventDate] = useState(
    searchParams.get('date') ||
      new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('Evening (5:00 PM - 11:30 PM)');
  const [guestCount, setGuestCount] = useState(
    Number(searchParams.get('guests')) || 250
  );
  const [selectedPackageId, setSelectedPackageId] = useState(searchParams.get('package') || '');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Payment Simulation State
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVV, setCardCVV] = useState('789');
  const [upiId, setUpiId] = useState('');

  // Live Availability Check State
  const [slotAvailability, setSlotAvailability] = useState(null);
  const [checkingSlot, setCheckingSlot] = useState(false);

  // Completed Booking Result State
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Fetch initial halls & packages
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [hallsRes, pkgsRes] = await Promise.all([
          api.get('/halls'),
          api.get('/catering')
        ]);
        if (hallsRes.success) {
          setHalls(hallsRes.data);
          if (!selectedHallId && hallsRes.data.length > 0) {
            setSelectedHallId(hallsRes.data[0]._id);
          }
        }
        if (pkgsRes.success) {
          setPackages(pkgsRes.data);
          if (!selectedPackageId && pkgsRes.data.length > 1) {
            setSelectedPackageId(pkgsRes.data[1]._id); // Default to Premium package
          }
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Sync user details if authenticated
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Check date & slot availability whenever hallId or eventDate changes
  useEffect(() => {
    if (selectedHallId && eventDate) {
      checkAvailability(selectedHallId, eventDate);
    }
  }, [selectedHallId, eventDate]);

  const checkAvailability = async (hallId, date) => {
    setCheckingSlot(true);
    try {
      const res = await api.get(`/halls/${hallId}/availability`, { date });
      if (res.success) {
        setSlotAvailability(res);
      }
    } catch (err) {
      console.error('Slot check error:', err);
    } finally {
      setCheckingSlot(false);
    }
  };

  const selectedHall = halls.find((h) => h._id === selectedHallId);
  const selectedPackage = packages.find((p) => p._id === selectedPackageId);

  // Calculate Prices in INR
  const hallRentalPrice = selectedHall?.hallPrice || 0;
  const cateringPerPerson = selectedPackage?.pricePerPerson || 0;
  const cateringTotal = guestCount * cateringPerPerson;
  const addonsTotal = selectedAddons.reduce((acc, item) => acc + item.price, 0);
  const subtotal = hallRentalPrice + cateringTotal + addonsTotal;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const totalPrice = subtotal + taxAmount;

  // Toggle Addon service
  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Step Validation
  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!selectedHallId) {
        toast.warning('Please select a banquet hall');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!eventType) {
        toast.warning('Please select an event type');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!eventDate) {
        toast.warning('Please select an event date');
        return false;
      }
      // Check slot availability
      if (slotAvailability) {
        const matchingSlot = slotAvailability.slots.find((s) => s.name === timeSlot);
        if (matchingSlot && !matchingSlot.isAvailable) {
          toast.error(`The selected time slot (${timeSlot}) is already booked on this date.`);
          return false;
        }
      }
    }
    if (currentStep === 4) {
      if (!guestCount || guestCount < 10) {
        toast.warning('Please enter a valid guest count (minimum 10)');
        return false;
      }
      if (selectedHall) {
        if (guestCount < selectedHall.minCapacity) {
          toast.warning(`Guest count (${guestCount}) is below the hall minimum capacity (${selectedHall.minCapacity})`);
          return false;
        }
        if (guestCount > selectedHall.maxCapacity) {
          toast.warning(`Guest count (${guestCount}) exceeds the hall maximum capacity (${selectedHall.maxCapacity})`);
          return false;
        }
      }
    }
    if (currentStep === 6) {
      if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
        toast.warning('Please fill in your name, email, and contact phone number');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 8));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Booking Confirmation & Simulated Payment
  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in or register to complete your reservation');
      navigate('/login', { state: { returnTo: '/book' } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hallId: selectedHallId,
        packageId: selectedPackageId || null,
        eventType,
        eventDate,
        timeSlot,
        guestCount,
        additionalServices: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
        specialRequests,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '8812',
        upiId: upiId || 'customer@oksbi'
      };

      const response = await api.post('/bookings', payload);
      if (response.success) {
        setConfirmedBookingData(response.data);
        setStep(8); // Success confirmation step

        // Fire festive celebration confetti!
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D4AF77', '#14213D', '#EDE5D8', '#BE9452']
          });
        } catch (e) {
          // Confetti silent fail if unsupported
        }

        toast.success(`Booking Confirmed! Reference: ${response.data.booking.bookingId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Booking reservation could not be completed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Initializing booking concierge..." />;
  }

  return (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wizard Header & Stepper */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Seamless 8-Step Reservation Workflow
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
            Banquet Hall & Catering Reservation
          </h1>

          {/* Stepper Dots (1 to 8) */}
          {step < 8 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 overflow-x-auto pb-2">
              {[
                { s: 1, label: 'Hall' },
                { s: 2, label: 'Event' },
                { s: 3, label: 'Date/Slot' },
                { s: 4, label: 'Guests' },
                { s: 5, label: 'Catering' },
                { s: 6, label: 'Details' },
                { s: 7, label: 'Review & Pay' }
              ].map(({ s, label }) => (
                <div key={s} className="flex items-center gap-1 sm:gap-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s
                        ? 'bg-gold-500 text-navy-950 ring-4 ring-gold-200'
                        : step > s
                        ? 'bg-navy-800 text-gold-400'
                        : 'bg-beige text-charcoal/50'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-[11px] font-semibold hidden md:inline ${
                    step === s ? 'text-navy-900' : 'text-charcoal/50'
                  }`}>
                    {label}
                  </span>
                  {s < 7 && <div className="w-3 sm:w-6 h-0.5 bg-beige" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WIZARD CONTAINER */}
        <div className="card-luxury p-6 sm:p-10 border border-beige/80 shadow-2xl bg-white">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SELECT BANQUET HALL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-gold-600" />
                    Step 1: Choose Your Banquet Hall
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Select from our verified luxury palaces, ballrooms, and garden pavilions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {halls.map((hall) => {
                    const isSelected = hall._id === selectedHallId;
                    return (
                      <div
                        key={hall._id}
                        onClick={() => setSelectedHallId(hall._id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 items-center ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/40 shadow-gold-sm'
                            : 'border-beige hover:border-gold-300 bg-offwhite'
                        }`}
                      >
                        <img
                          src={hall.images[0]}
                          alt={hall.name}
                          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base font-bold text-navy-900 truncate">
                            {hall.name}
                          </h3>
                          <p className="text-xs text-charcoal/70 truncate">{hall.location}, {hall.city}</p>
                          <p className="text-xs text-charcoal/60 mt-1">
                            Capacity: <strong className="text-navy-900">{hall.minCapacity}-{hall.maxCapacity}</strong> guests
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-extrabold text-navy-900">
                              {formatINR(hall.hallPrice)}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              isSelected ? 'bg-gold-500 text-navy-950' : 'bg-beige text-charcoal/70'
                            }`}>
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE EVENT TYPE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-gold-600" />
                    Step 2: What Occasion Are You Celebrating?
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    We tailor venue aesthetics, setup protocols, and catering layout to match your event type.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {EVENT_TYPES.map((type) => {
                    const isSelected = eventType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEventType(type)}
                        className={`p-6 rounded-2xl border-2 text-center transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-navy-900 text-white shadow-xl scale-[1.02]'
                            : 'border-beige hover:border-gold-300 bg-offwhite text-navy-900'
                        }`}
                      >
                        <span className="block font-serif text-lg font-bold mb-1">
                          {type}
                        </span>
                        <span className={`text-[11px] font-medium ${
                          isSelected ? 'text-gold-400' : 'text-charcoal/60'
                        }`}>
                          {isSelected ? '✓ Selected' : 'Choose'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: SELECT EVENT DATE & TIME SLOT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-gold-600" />
                    Step 3: Select Date & Time Slot
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Live schedule verification guarantees zero double-booking conflicts.
                  </p>
                </div>

                <div className="max-w-md">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-offwhite border border-beige rounded-xl py-3 px-4 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Slots selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
                    Available Time Slots for {eventDate}
                  </label>
                  
                  <div className="space-y-3">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = timeSlot === slot.id;
                      const availabilityInfo = slotAvailability?.slots?.find((s) => s.name === slot.id);
                      const isAvailable = availabilityInfo ? availabilityInfo.isAvailable : true;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => {
                            if (isAvailable) setTimeSlot(slot.id);
                          }}
                          className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            !isAvailable
                              ? 'border-gray-200 bg-gray-100/70 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'border-gold-500 bg-gold-50/50 shadow-md cursor-pointer'
                              : 'border-beige hover:border-gold-300 bg-offwhite cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Clock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              isSelected ? 'text-gold-600' : 'text-charcoal/60'
                            }`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-base font-bold text-navy-900">
                                  {slot.name}
                                </h4>
                                <span className="text-xs font-semibold text-charcoal/70 bg-beige/60 px-2 py-0.5 rounded">
                                  {slot.time}
                                </span>
                              </div>
                              <p className="text-xs text-charcoal/60 mt-0.5">
                                {slot.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {isAvailable ? (
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                isSelected ? 'bg-gold-500 text-navy-950' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isSelected ? '✓ Selected' : 'Available'}
                              </span>
                            ) : (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                                Booked
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: GUEST COUNT & CAPACITY VALIDATION */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-gold-600" />
                    Step 4: Expected Number of Guests
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    We strictly validate hall guest capacity to guarantee comfortable seating and dining flow.
                  </p>
                </div>

                {selectedHall && (
                  <div className="p-4 rounded-2xl bg-offwhite border border-beige flex items-center justify-between text-xs font-medium">
                    <span>
                      Selected Hall: <strong className="text-navy-900">{selectedHall.name}</strong>
                    </span>
                    <span>
                      Allowed Range: <strong className="text-navy-900">{selectedHall.minCapacity} to {selectedHall.maxCapacity} Guests</strong>
                    </span>
                  </div>
                )}

                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min={selectedHall?.minCapacity || 10}
                      max={selectedHall?.maxCapacity || 5000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-offwhite border border-beige rounded-xl py-3 px-4 text-base font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={selectedHall?.minCapacity || 50}
                    max={selectedHall?.maxCapacity || 1000}
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-gold-500 cursor-pointer"
                  />

                  {selectedHall && (guestCount < selectedHall.minCapacity || guestCount > selectedHall.maxCapacity) && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Guest count must be between {selectedHall.minCapacity} and {selectedHall.maxCapacity} for this hall.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 5: SELECT CATERING PACKAGE & ADD-ONS */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-gold-600" />
                    Step 5: Select Catering Package & Add-ons
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Choose from Basic, Premium, or Royal spreads, or proceed with hall rental only.
                  </p>
                </div>

                {/* 3 Sample Packages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg) => {
                    const isSelected = pkg._id === selectedPackageId;
                    return (
                      <div
                        key={pkg._id}
                        onClick={() => setSelectedPackageId(pkg._id)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/40 shadow-gold-sm ring-2 ring-gold-400'
                            : 'border-beige hover:border-gold-300 bg-offwhite'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-full">
                              {pkg.packageType}
                            </span>
                            <span className="text-[10px] font-semibold text-charcoal/60">
                              {pkg.isVegOnly ? 'Pure Veg' : 'Veg & Non-Veg'}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-navy-900 mb-1">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-charcoal/70 mb-4 line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-beige flex items-baseline justify-between">
                          <div>
                            <span className="text-xl font-extrabold text-navy-900">
                              {formatINR(pkg.pricePerPerson)}
                            </span>
                            <span className="text-[10px] text-charcoal/60 block">/ guest</span>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                            isSelected ? 'bg-gold-500 text-navy-950' : 'bg-beige text-charcoal/70'
                          }`}>
                            {isSelected ? '✓ Selected' : 'Choose'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Option for Hall Only */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackageId('')}
                    className={`text-xs font-bold underline transition-colors ${
                      !selectedPackageId ? 'text-gold-700' : 'text-charcoal/60 hover:text-navy-900'
                    }`}
                  >
                    {!selectedPackageId ? '✓ No catering package selected (Hall Rental Only)' : 'Opt out of catering (Hall Rental Only)'}
                  </button>
                </div>

                {/* Additional Services Add-ons */}
                <div className="pt-6 border-t border-beige">
                  <h3 className="font-serif text-lg font-bold text-navy-900 mb-3">
                    Optional Stage & Hospitality Add-ons
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ADDON_SERVICES.map((addon) => {
                      const isAdded = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                            isAdded
                              ? 'border-gold-500 bg-gold-50/50 text-navy-950 font-semibold'
                              : 'border-beige hover:border-gold-300 bg-offwhite text-charcoal'
                          }`}
                        >
                          <span className="text-xs">{addon.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-900">+{formatINR(addon.price)}</span>
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                              isAdded ? 'bg-gold-500 text-navy-950 font-bold' : 'bg-beige text-transparent'
                            }`}>
                              ✓
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: CUSTOMER CONTACT DETAILS */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-gold-600" />
                    Step 6: Customer Details & Special Requests
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Provide the primary host contact information for coordination and entry passes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                      Full Name of Host / Organiser
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya & Rohan Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-offwhite border border-beige rounded-xl py-2.5 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                      Email Address (for Confirmation & Invoices)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priya@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-offwhite border border-beige rounded-xl py-2.5 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                      Contact Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98112 34567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-offwhite border border-beige rounded-xl py-2.5 px-3.5 text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                      Special Hospitality Requests or Setup Instructions
                    </label>
                    <textarea
                      rows="3"
                      placeholder="e.g., Jain vegetarian dishes counter required, specific flower preferences, grand bridal hydraulic ramp entry, etc."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-offwhite border border-beige rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: PRICE BREAKDOWN & SIMULATED CHECKOUT */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-gold-600" />
                    Step 7: Itemized Price Breakdown & Simulated Checkout
                  </h2>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Review your complete reservation cost in Indian Rupees (₹) before confirming.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Detailed Price Breakdown Table */}
                  <div className="p-6 rounded-2xl bg-offwhite border border-beige space-y-4">
                    <h3 className="font-serif text-lg font-bold text-navy-900 pb-3 border-b border-beige">
                      Reservation Summary
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-charcoal/70">Selected Venue:</span>
                        <span className="font-bold text-navy-900">{selectedHall?.name}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-charcoal/70">Event & Date:</span>
                        <span className="font-bold text-navy-900">{eventType} on {eventDate}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-charcoal/70">Time Slot:</span>
                        <span className="font-bold text-navy-900">{timeSlot}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-charcoal/70">Guest Count:</span>
                        <span className="font-bold text-navy-900">{guestCount} Guests</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-beige space-y-2 text-xs">
                      {/* Hall Cost */}
                      <div className="flex justify-between">
                        <span className="font-medium text-charcoal/80">Hall Rental Base Price:</span>
                        <span className="font-bold text-navy-900">{formatINR(hallRentalPrice)}</span>
                      </div>

                      {/* Catering Cost */}
                      {selectedPackage && (
                        <div className="flex justify-between">
                          <span className="font-medium text-charcoal/80">
                            Catering ({guestCount} × {formatINR(cateringPerPerson)}):
                          </span>
                          <span className="font-bold text-navy-900">{formatINR(cateringTotal)}</span>
                        </div>
                      )}

                      {/* Addon Services */}
                      {selectedAddons.map((addon) => (
                        <div key={addon.id} className="flex justify-between text-charcoal/70">
                          <span>{addon.name}:</span>
                          <span className="font-semibold text-navy-900">{formatINR(addon.price)}</span>
                        </div>
                      ))}

                      {/* Subtotal */}
                      <div className="flex justify-between pt-2 border-t border-beige font-bold text-navy-900">
                        <span>Subtotal:</span>
                        <span>{formatINR(subtotal)}</span>
                      </div>

                      {/* GST */}
                      <div className="flex justify-between text-charcoal/70">
                        <span>Applicable GST (5% Itemized):</span>
                        <span className="font-semibold text-navy-900">{formatINR(taxAmount)}</span>
                      </div>

                      {/* Grand Total */}
                      <div className="flex justify-between pt-3 border-t-2 border-navy-900/10 text-base font-extrabold text-navy-900">
                        <span>Total Payable:</span>
                        <span className="text-xl text-gold-600">{formatINR(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Payment Gateway Card */}
                  <div className="card-luxury p-6 border-2 border-gold-500/40 shadow-xl bg-white space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-beige">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gold-600" />
                        <h3 className="font-serif text-base font-bold text-navy-900">
                          Academic Payment Gateway
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800 px-2.5 py-1 rounded-full border border-gold-300">
                        <Lock className="w-3 h-3" /> Sandbox Mode
                      </span>
                    </div>

                    {/* Method Selector */}
                    <div className="grid grid-cols-3 gap-2">
                      {['Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                            paymentMethod === method
                              ? 'bg-navy-900 text-gold-400 border-navy-900'
                              : 'bg-offwhite text-charcoal border-beige hover:border-gold-300'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    {/* Card inputs */}
                    {paymentMethod === 'Credit/Debit Card' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-charcoal/70 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-charcoal/70 mb-1">
                              Expiry
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-charcoal/70 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'UPI' && (
                      <div className="space-y-3 pt-2">
                        <label className="block text-[11px] font-bold uppercase text-charcoal/70 mb-1">
                          Virtual Payment Address (VPA / UPI ID)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. host@okaxis or host@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    )}

                    {paymentMethod === 'Net Banking' && (
                      <div className="space-y-3 pt-2">
                        <label className="block text-[11px] font-bold uppercase text-charcoal/70 mb-1">
                          Select Banking Partner
                        </label>
                        <select className="w-full bg-offwhite border border-beige rounded-xl p-2.5 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500">
                          <option>HDFC Bank Corporate & Retail</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                        </select>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-beige-light border border-beige text-[11px] text-charcoal/70 leading-relaxed">
                      * Academic Demonstration Notice: This is a simulated checkout. No real financial credit or debit occurs.
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      disabled={submitting}
                      className="w-full btn-gold py-4 text-xs font-extrabold uppercase tracking-widest shadow-gold-md hover:shadow-gold-lg flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Confirming with Database...' : `Pay & Confirm ${formatINR(totalPrice)}`}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 8: CONFIRMATION RECEIPT */}
            {step === 8 && confirmedBookingData && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6 max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-1 block">
                    Reservation Successfully Recorded
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
                    Booking Confirmed!
                  </h2>
                  <p className="text-sm text-charcoal/70 mt-2">
                    Your banquet hall reservation has been saved in the system with verified slot exclusivity.
                  </p>
                </div>

                {/* Printable Receipt Card */}
                <div className="p-6 rounded-3xl bg-offwhite border border-beige text-left space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-beige">
                    <div>
                      <p className="text-[11px] text-charcoal/60 uppercase font-bold">Booking Reference ID</p>
                      <p className="font-mono text-xl font-extrabold text-navy-900">
                        {confirmedBookingData.booking.bookingId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-charcoal/60 uppercase font-bold">Status</p>
                      <span className="inline-block bg-emerald-200 text-emerald-950 font-extrabold text-xs px-3 py-0.5 rounded-full uppercase">
                        {confirmedBookingData.booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-charcoal/60 block">Banquet Hall:</span>
                      <strong className="text-navy-900">{confirmedBookingData.booking.hall?.name}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal/60 block">Occasion:</span>
                      <strong className="text-navy-900">{confirmedBookingData.booking.eventType}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal/60 block">Event Date:</span>
                      <strong className="text-navy-900">{confirmedBookingData.booking.eventDate}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal/60 block">Time Slot:</span>
                      <strong className="text-navy-900">{confirmedBookingData.booking.timeSlot}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal/60 block">Guests:</span>
                      <strong className="text-navy-900">{confirmedBookingData.booking.guestCount} Attendees</strong>
                    </div>
                    <div>
                      <span className="text-charcoal/60 block">Total Amount Paid:</span>
                      <strong className="text-gold-600 text-sm">{formatINR(confirmedBookingData.booking.totalPrice)}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-beige text-[11px] text-charcoal/60 flex items-center justify-between">
                    <span>Transaction ID: {confirmedBookingData.payment?.transactionId}</span>
                    <span>Simulated Gateway: {confirmedBookingData.payment?.paymentMethod}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto btn-outline py-3 px-6 text-xs uppercase font-bold flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto btn-gold py-3 px-8 text-xs uppercase font-extrabold tracking-wider"
                  >
                    View in Customer Dashboard →
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Wizard Back / Next Buttons (Hidden on final step) */}
          {step < 7 && (
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-beige">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="btn-outline py-2.5 px-6 text-xs uppercase font-bold disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-gold py-2.5 px-8 text-xs uppercase font-extrabold tracking-wider"
              >
                Continue to Step {step + 1}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="pt-6 mt-6 border-t border-beige">
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline py-2.5 px-6 text-xs uppercase font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Edit Details
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookingWizardPage;

