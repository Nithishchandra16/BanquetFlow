const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const BanquetHall = require('./models/BanquetHall');
const CateringPackage = require('./models/CateringPackage');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/banquetflow';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await BanquetHall.deleteMany();
    await CateringPackage.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    console.log('[Seed] Cleared existing database records.');

    // 1. Create Users
    console.log('[Seed] Seeding Users...');
    const adminUser = await User.create({
      name: 'BanquetFlow SuperAdmin',
      email: 'admin@banquetflow.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'BanquetFlow Corporate HQ, Nariman Point, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    });

    const customerUser = await User.create({
      name: 'Priya & Rohan Sharma',
      email: 'customer@banquetflow.com',
      password: 'customer123',
      role: 'customer',
      phone: '+91 98112 34567',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    });

    const customer2 = await User.create({
      name: 'Vikram Malhotra',
      email: 'vikram@gmail.com',
      password: 'customer123',
      role: 'customer',
      phone: '+91 99201 88321',
      address: 'Vasant Vihar, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    });

    const customer3 = await User.create({
      name: 'Ananya Iyer',
      email: 'ananya@gmail.com',
      password: 'customer123',
      role: 'customer',
      phone: '+91 94451 90812',
      address: 'Indiranagar, Bengaluru, Karnataka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });

    // 2. Create Catering Packages
    console.log('[Seed] Seeding Catering Packages...');
    const packages = await CateringPackage.create([
      {
        name: 'Classic Vegetarian Feast',
        packageType: 'Basic',
        description: 'An authentic traditional vegetarian feast designed with refined culinary craftsmanship for memorable gatherings.',
        pricePerPerson: 750,
        isVegOnly: true,
        features: [
          'Standard Vegetarian Menu',
          '2 Refreshing Welcome Drinks',
          'Traditional Main Course (Paneer & Dal specialties)',
          '2 Delectable Artisanal Desserts',
          'Assorted Indian Breads & Basmati Rice',
          'Professional Uniformed Serving Crew'
        ],
        menuItems: {
          welcomeDrinks: [
            'Fresh Mint Lime Cooler',
            'Alphonso Mango Kesar Panna'
          ],
          starters: [],
          mainCourse: [
            'Shahi Paneer Butter Masala',
            'Amritsari Dal Makhani (Simmered 18 hours)',
            'Subz Diwani Handi (Seasonal vegetables in rich gravy)',
            'Kashmiri Dum Pulao',
            'Tandoori Butter Naan, Missi Roti & Laccha Paratha',
            'Boondi Raita & Fresh Green Garden Salad'
          ],
          desserts: [
            'Hot Gulab Jamun with Pistachio Rabdi',
            'Royal Malai Kulfi'
          ],
          liveCounters: []
        },
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        popular: false
      },
      {
        name: 'Grand Heritage Gourmet',
        packageType: 'Premium',
        description: 'An elevated dining experience featuring handpicked royal delicacies, gourmet appetizers, and rich gravies.',
        pricePerPerson: 1350,
        isVegOnly: true,
        features: [
          'Premium Royal Vegetarian Menu',
          '3 Crafted Welcome Mocktails',
          '4 Gourmet Appetizers (Tandoori & Crispy)',
          'Grand Royal Main Course Selection',
          '4 Decadent Desserts & Ice Cream Bar',
          'Chafing Dish Presentation & Mineral Water setup'
        ],
        menuItems: {
          welcomeDrinks: [
            'Blueberry Lavender Mojito',
            'Spiced Raw Mango Shikanji',
            'Royal Rose Almond Sharbat'
          ],
          starters: [
            'Paneer Tikka Angara with Mint Chutney',
            'Crispy Lotus Stem in Sweet Chili Glaze',
            'Hara Bhara Kebab infused with Cashews',
            'Corn Cheese Croquettes'
          ],
          mainCourse: [
            'Paneer Lababdar with Smoked Gravy',
            'Signature Dal Bukhara',
            'Methi Malai Matar (Mild & aromatic cream gravy)',
            'Awadhi Dum Biryani with Burani Raita',
            'Penne Arrabbiata / Alfredo Pasta Counter',
            'Bread Basket: Chur Chur Naan, Garlic Naan & Kulcha'
          ],
          desserts: [
            'Warm Moong Dal Halwa with Khoya',
            'Angoori Rasmalai in Saffron Milk',
            'Vanilla Bean Ice Cream with Chocolate Lava Cake',
            'Assorted Fresh Fruit Carvings'
          ],
          liveCounters: []
        },
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        popular: true
      },
      {
        name: 'Royal Nizam & Maharaja Banquet',
        packageType: 'Royal',
        description: 'The pinnacle of luxury catering. Includes multi-cuisine non-veg and vegetarian spread, interactive live food counters, and royal dessert pavilion.',
        pricePerPerson: 2150,
        isVegOnly: false,
        features: [
          'Premium Vegetarian & Non-Vegetarian Options',
          '4 Signature Exotic Welcome Drinks',
          '6 Interactive Hors D’oeuvres & Starters',
          'Extensive Multi-Cuisine Main Course',
          '3 Active Live Food Counters (Chaat, Pasta & Tandoor)',
          'Grand 5-Course Dessert & Gelato Pavilion'
        ],
        menuItems: {
          welcomeDrinks: [
            'Passion Fruit & Basil Sparkler',
            'Tender Coconut Berry Punch',
            'Rose Pomegranate Sparkle',
            'Belgian Chocolate Cold Brew Shots'
          ],
          starters: [
            'Murgh Malai Tikka (Melt-in-mouth chicken kebab)',
            'Mutton Galouti Kebab on Mini Ulte Tawe Ka Paratha',
            'Bhatti Da Paneer Tikka',
            'Panko Crusted Butter Garlic Prawns',
            'Dahi Ke Kebab with Berry Compote',
            'Truffle Mushroom Bruschetta'
          ],
          mainCourse: [
            'Nalli Nihari slow-cooked with Royal Spices',
            'Dum Pukht Hyderabadi Mutton Biryani',
            'Butter Chicken Delicacy (Old Delhi style)',
            'Paneer Pasanda with Pistachio & Khoya Stuffing',
            'Dal Maharani infused with Clarified Butter',
            'Exotic Asian Wok Greens in Ginger Soy Glaze',
            'Assorted Artisanal Breads (Bakarkhani, Sheermal, Garlic Naan)'
          ],
          desserts: [
            'Shahi Tukda with Saffron Rabdi & Silver Vark',
            'Hot Kesari Jalebi with Creamy Rabdi',
            'Saffron Pistachio Rasmalai',
            'Gourmet Tiramisu & Belgian Dark Chocolate Mousse',
            'Artisanal Nitrogen Ice Cream Station'
          ],
          liveCounters: [
            'Dilli 6 Live Chaat Counter (Pani Puri, Papdi Chaat, Dahi Bhalla)',
            'Live Neapolitan Wood-Fired Pizza & Pasta Station',
            'Live Charcoal Sigri Tandoor'
          ]
        },
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        popular: false
      }
    ]);

    // 3. Create Banquet Halls
    console.log('[Seed] Seeding Banquet Halls...');
    const halls = await BanquetHall.create([
      {
        name: 'The Grand Crystal Ballroom & Palace',
        location: 'Marine Drive, Nariman Point',
        city: 'Mumbai',
        address: 'Plot 42, Seaface Promenade, Marine Drive, South Mumbai, MH 400021',
        description: 'A breathtaking waterfront ballroom with 24-foot crystal chandeliers, panoramic Arabian Sea views, and world-class royal acoustic sound insulation. Ideal for grand weddings, elite receptions, and prestigious corporate galas.',
        minCapacity: 250,
        maxCapacity: 1200,
        hallPrice: 185000,
        hallType: 'Indoor',
        hasAC: true,
        facilities: [
          'Centralized Air Conditioning',
          'Valet Parking for 350+ Cars',
          '2 Ultra-Luxury Bridal Changing Suites',
          'Grand Elevated Stage & Hydraulic Ramp',
          'Concert Grade Bose Line-Array Sound System',
          'Intelligent Dynamic Moving Beam Lighting',
          '100% Dual Generator Power Backup',
          'Wheelchair Accessible with Dedicated Elevators'
        ],
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Loud music permitted until 10:30 PM per municipal regulations',
          'Outside certified decorators allowed upon prior administrative review',
          'Liquor license must be acquired from excise department for bar service',
          'Strict zero-firecracker safety protocol indoors'
        ],
        rating: 4.9,
        reviewCount: 48,
        reviews: [
          {
            user: customerUser._id,
            userName: 'Priya & Rohan Sharma',
            rating: 5,
            comment: 'We hosted our wedding reception here and guests are still talking about the grand chandeliers and spectacular sea view! The staff hospitality was second to none.',
            createdAt: new Date('2026-09-15')
          },
          {
            user: customer2._id,
            userName: 'Vikram Malhotra',
            rating: 5,
            comment: 'Unbelievable ambiance. Audio systems and lighting presets made our international tech awards ceremony effortless.',
            createdAt: new Date('2026-10-02')
          }
        ],
        status: 'active',
        featured: true
      },
      {
        name: 'The Royal Heritage Haveli & Courtyard',
        location: 'Aravali Hills / Fatehsagar Lake Road',
        city: 'Udaipur',
        address: 'Heritage Enclave, Old Palace Road, Near Fatehsagar Lake, Udaipur, Rajasthan 313001',
        description: 'Immerse your guests in Rajputana royalty. Features hand-carved jharokhas, illuminated lotus ponds, marble arches, and a combination of air-conditioned indoor banquet hall with an open-air starlit courtyard.',
        minCapacity: 150,
        maxCapacity: 850,
        hallPrice: 155000,
        hallType: 'Both',
        hasAC: true,
        facilities: [
          'Air Conditioned Durbar Hall + Starlit Courtyard',
          'Valet Parking for 200 Cars',
          'Royal Rajputana Bridal Suite & Groom Lounge',
          'Traditional Sheesh Mahal Photo Booth',
          'Fountain & Lotus Pond Ambiance Lighting',
          'Full Generator Backup',
          'Dedicated Fireworks Display Launch Area'
        ],
        images: [
          'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Traditional dhol & folk music permitted until 11:00 PM in the courtyard',
          'Decor installations must preserve historic stone craftsmanship',
          'Professional security mandatory for guest count exceeding 500'
        ],
        rating: 4.8,
        reviewCount: 32,
        reviews: [
          {
            user: customer3._id,
            userName: 'Ananya Iyer',
            rating: 5,
            comment: 'Pure magic! The fountain lighting and royal palace feel made our sangeet night feel like a Bollywood movie.',
            createdAt: new Date('2026-10-18')
          }
        ],
        status: 'active',
        featured: true
      },
      {
        name: 'Emerald Meadows Glass Pavilion & Lawn',
        location: 'Whitefield - ITPL Main Road',
        city: 'Bengaluru',
        address: 'Survey 88, Near Prestige Tech Park, Whitefield, Bengaluru, KA 560066',
        description: 'A contemporary European-inspired glass house surrounded by two acres of manicured emerald green lawns, majestic palms, and ambient fairy-light canopies. Perfect for romantic engagements, open-air cocktail evenings, and modern weddings.',
        minCapacity: 200,
        maxCapacity: 1000,
        hallPrice: 110000,
        hallType: 'Both',
        hasAC: true,
        facilities: [
          'All-Weather AC Glass Pavilion (350 capacity)',
          'Extensive 2-Acre Manicured Garden Lawn (700 capacity)',
          'Valet Parking for 300+ Vehicles',
          'Modern Bridal Dressing Suite',
          'Integrated Fairy Lighting & Tree Uplighting',
          'High Output Silent Power Generators',
          'Wheelchair Friendly Level Access'
        ],
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Outdoor amplified sound must taper down after 10:00 PM per city noise limits',
          'Lawn sports equipment and high heel spikes caution near glass panels',
          'Outside catering permitted with eco-friendly disposables policy'
        ],
        rating: 4.7,
        reviewCount: 26,
        reviews: [
          {
            user: customerUser._id,
            userName: 'Priya & Rohan Sharma',
            rating: 4,
            comment: 'The glass house is stunning at twilight. Guests enjoyed having both indoor AC comfort and the open lawn breeze.',
            createdAt: new Date('2026-08-20')
          }
        ],
        status: 'active',
        featured: true
      },
      {
        name: 'Sapphire Imperial Banquet & Suites',
        location: 'Barakhamba Road, Connaught Place',
        city: 'New Delhi',
        address: '18 Tolstoy Marg, Connaught Place, New Delhi, DL 110001',
        description: 'Located in the prestigious heart of Delhi, Sapphire Imperial features gold-leaf pillar accents, Italian marble flooring, and state-of-the-art motorized truss lighting. Renowned for corporate summit banquets and lavish receptions.',
        minCapacity: 100,
        maxCapacity: 550,
        hallPrice: 135000,
        hallType: 'Indoor',
        hasAC: true,
        facilities: [
          'Central Chilled-Water AC Conditioning',
          'Underground Covered Valet Parking for 180 Cars',
          'VIP Green Room & Executive Lounge',
          '4K Ultra HD P2.5 Curved LED Backdrop Video Wall',
          'Shure Wireless Microphones & Yamaha Digital Console',
          'Dedicated High-Speed Fiber Internet for Live Streaming'
        ],
        images: [
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Decor installations to start 4 hours prior to booking slot',
          'Designated smoking rooms only; zero smoking in banquet hall',
          'Valet parking service compulsory during peak evening hours'
        ],
        rating: 4.8,
        reviewCount: 19,
        reviews: [],
        status: 'active',
        featured: false
      },
      {
        name: 'Opal Symphony Horizon Deck & Banquet',
        location: 'Road No. 36, Jubilee Hills',
        city: 'Hyderabad',
        address: 'Plot 710, Hill Ridge Vista, Jubilee Hills, Hyderabad, TS 500033',
        description: 'Perched over Jubilee Hills with an unobstructed skyline view. Features double-height French windows, sleek minimalist aesthetics, and an open deck that transitions into a starlit cocktail party lounge.',
        minCapacity: 120,
        maxCapacity: 650,
        hallPrice: 140000,
        hallType: 'Both',
        hasAC: true,
        facilities: [
          'Climate Controlled Main Hall + Open Sky Horizon Terrace',
          'Valet Parking for 220 Vehicles',
          'Designer Bridal Suite with Vanity Mirrors',
          'Pioneer Pro DJ Console & Intelligent Lighting Rig',
          'Multi-Cuisine Commercial Prep Kitchen',
          '100% Uninterrupted Power Supply'
        ],
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Terrace area requires sound moderation after 10:30 PM',
          'No glitter or confetti bombs permitted in the open deck area',
          'Event organizers must sign off on damage deposit checklist'
        ],
        rating: 4.9,
        reviewCount: 38,
        reviews: [],
        status: 'active',
        featured: true
      },
      {
        name: 'Golden Petal Celebration Banquet',
        location: 'Koregaon Park Annex',
        city: 'Pune',
        address: 'Sector 5, North Main Road, Koregaon Park, Pune, MH 411001',
        description: 'An elegant, cost-effective boutique banquet hall designed for intimate celebrations, anniversary bashes, birthday milestones, and pre-wedding mehendi ceremonies.',
        minCapacity: 50,
        maxCapacity: 350,
        hallPrice: 75000,
        hallType: 'Indoor',
        hasAC: true,
        facilities: [
          'High Efficiency Daikin Air Conditioning',
          'Valet Parking for 100 Cars',
          'Bridal Makeup Room with Attached Washroom',
          'Pre-Installed Flower Arch Stage & Fairy Backdrop',
          'Bluetooth Connected Sound System & Wireless Mics',
          'Power Backup Inverter & Generator'
        ],
        images: [
          'https://images.unsplash.com/photo-1519225424988-8255979c5c96?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80'
        ],
        rules: [
          'Outside decorators permitted with standard setup fee',
          'Alcohol requires 1-day excise license',
          'Music volume inside hall to follow neighborhood guidelines'
        ],
        rating: 4.6,
        reviewCount: 15,
        reviews: [],
        status: 'active',
        featured: false
      }
    ]);

    // 4. Create Initial Bookings & Payments
    console.log('[Seed] Seeding Sample Bookings & Payments...');

    // Booking 1: Confirmed Wedding
    const b1Guests = 450;
    const b1Hall = halls[0]; // Grand Crystal Ballroom
    const b1Package = packages[2]; // Royal Nizam
    const b1HallPrice = b1Hall.hallPrice;
    const b1CateringPrice = b1Package.pricePerPerson;
    const b1CateringTotal = b1Guests * b1CateringPrice;
    const b1AddServices = [
      { name: 'Royal Stage Floral Decor & Chandelier Draping', price: 45000 },
      { name: 'Concert DJ & Intelligent Light System', price: 25000 }
    ];
    const b1AddTotal = 70000;
    const b1Subtotal = b1HallPrice + b1CateringTotal + b1AddTotal;
    const b1Tax = Math.round(b1Subtotal * 0.05);
    const b1Total = b1Subtotal + b1Tax;

    const booking1 = await Booking.create({
      bookingId: 'BF-2026-10492',
      customer: customerUser._id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      customerPhone: customerUser.phone,
      hall: b1Hall._id,
      package: b1Package._id,
      eventType: 'Wedding',
      eventDate: '2026-12-18',
      timeSlot: 'Evening (5:00 PM - 11:30 PM)',
      startTime: '17:00',
      endTime: '23:30',
      guestCount: b1Guests,
      hallPrice: b1HallPrice,
      cateringPricePerPerson: b1CateringPrice,
      cateringTotal: b1CateringTotal,
      additionalServices: b1AddServices,
      additionalServicesTotal: b1AddTotal,
      subtotal: b1Subtotal,
      taxAmount: b1Tax,
      totalPrice: b1Total,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      specialRequests: 'Traditional shehnai players at reception entrance and specific jaimala rose petals stage setup.'
    });

    await Payment.create({
      paymentId: 'PAY-BF-900214',
      booking: booking1._id,
      bookingIdString: booking1.bookingId,
      customer: customerUser._id,
      amount: b1Total,
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'success',
      transactionId: 'TXN-SESD-48921849',
      paymentDetails: {
        cardLast4: '8812',
        upiId: ''
      },
      paymentDate: new Date('2026-10-15')
    });

    // Booking 2: Corporate Gala (Customer 2)
    const b2Guests = 300;
    const b2Hall = halls[3]; // Sapphire Imperial
    const b2Package = packages[1]; // Grand Heritage Gourmet
    const b2HallPrice = b2Hall.hallPrice;
    const b2CateringPrice = b2Package.pricePerPerson;
    const b2CateringTotal = b2Guests * b2CateringPrice;
    const b2AddServices = [
      { name: '4K LED Video Backdrop & Live Webcast Station', price: 35000 }
    ];
    const b2AddTotal = 35000;
    const b2Subtotal = b2HallPrice + b2CateringTotal + b2AddTotal;
    const b2Tax = Math.round(b2Subtotal * 0.05);
    const b2Total = b2Subtotal + b2Tax;

    const booking2 = await Booking.create({
      bookingId: 'BF-2026-11843',
      customer: customer2._id,
      customerName: customer2.name,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      hall: b2Hall._id,
      package: b2Package._id,
      eventType: 'Corporate Event',
      eventDate: '2026-12-24',
      timeSlot: 'Morning (9:00 AM - 3:00 PM)',
      startTime: '09:00',
      endTime: '15:00',
      guestCount: b2Guests,
      hallPrice: b2HallPrice,
      cateringPricePerPerson: b2CateringPrice,
      cateringTotal: b2CateringTotal,
      additionalServices: b2AddServices,
      additionalServicesTotal: b2AddTotal,
      subtotal: b2Subtotal,
      taxAmount: b2Tax,
      totalPrice: b2Total,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      specialRequests: 'High speed WiFi SSID for all 300 delegates and podium presentation timer.'
    });

    await Payment.create({
      paymentId: 'PAY-BF-910482',
      booking: booking2._id,
      bookingIdString: booking2.bookingId,
      customer: customer2._id,
      amount: b2Total,
      paymentMethod: 'UPI',
      paymentStatus: 'success',
      transactionId: 'TXN-SESD-99410283',
      paymentDetails: {
        cardLast4: '',
        upiId: 'vikram.corp@oksbi'
      },
      paymentDate: new Date('2026-10-20')
    });

    // Booking 3: Reception (Customer 3)
    const b3Guests = 350;
    const b3Hall = halls[1]; // Royal Heritage Haveli
    const b3Package = packages[1];
    const b3Subtotal = b3Hall.hallPrice + (b3Guests * b3Package.pricePerPerson);
    const b3Tax = Math.round(b3Subtotal * 0.05);
    const b3Total = b3Subtotal + b3Tax;

    const booking3 = await Booking.create({
      bookingId: 'BF-2026-12904',
      customer: customer3._id,
      customerName: customer3.name,
      customerEmail: customer3.email,
      customerPhone: customer3.phone,
      hall: b3Hall._id,
      package: b3Package._id,
      eventType: 'Reception',
      eventDate: '2027-01-14',
      timeSlot: 'Evening (5:00 PM - 11:30 PM)',
      startTime: '17:00',
      endTime: '23:30',
      guestCount: b3Guests,
      hallPrice: b3Hall.hallPrice,
      cateringPricePerPerson: b3Package.pricePerPerson,
      cateringTotal: b3Guests * b3Package.pricePerPerson,
      additionalServices: [],
      additionalServicesTotal: 0,
      subtotal: b3Subtotal,
      taxAmount: b3Tax,
      totalPrice: b3Total,
      bookingStatus: 'pending',
      paymentStatus: 'paid',
      specialRequests: 'Traditional Rajasthani welcome folk dancers near the fountain courtyard.'
    });

    await Payment.create({
      paymentId: 'PAY-BF-915631',
      booking: booking3._id,
      bookingIdString: booking3.bookingId,
      customer: customer3._id,
      amount: b3Total,
      paymentMethod: 'Net Banking',
      paymentStatus: 'success',
      transactionId: 'TXN-SESD-77192043',
      paymentDetails: {
        bankName: 'HDFC Bank NetBanking'
      },
      paymentDate: new Date('2026-11-01')
    });

    console.log('[Seed] Database successfully seeded with:');
    console.log(` - 4 Users (1 Admin: admin@banquetflow.com / admin123, 3 Customers: customer@banquetflow.com / customer123)`);
    console.log(` - ${halls.length} Luxury Banquet Halls`);
    console.log(` - ${packages.length} Tiered Catering Packages (Basic, Premium, Royal)`);
    console.log(` - 3 Initial Bookings & Simulated Payments`);
    console.log('===========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();

