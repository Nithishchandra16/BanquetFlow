const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('  BANQUETFLOW END-TO-END WORKFLOW VERIFICATION TEST');
  console.log('====================================================');

  try {
    // 1. Health check
    console.log('\n[TEST 1] Verifying API Server Health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✓ Health Status:', health.status);

    // 2. Halls endpoint
    console.log('\n[TEST 2] Verifying Banquet Halls Listing & Filtering...');
    const hallsRes = await fetch(`${BASE_URL}/halls`);
    const hallsData = await hallsRes.json();
    console.log(`✓ Fetched ${hallsData.count} Banquet Halls successfully.`);
    if (hallsData.count === 0) throw new Error('No halls found');
    const sampleHall = hallsData.data[0];
    console.log(`✓ Sample Hall: "${sampleHall.name}" in ${sampleHall.city} (Base: ₹${sampleHall.hallPrice})`);

    // 3. Catering Packages endpoint
    console.log('\n[TEST 3] Verifying Catering Packages (Basic, Premium, Royal)...');
    const cateringRes = await fetch(`${BASE_URL}/catering`);
    const cateringData = await cateringRes.json();
    console.log(`✓ Fetched ${cateringData.count} Catering Packages.`);
    cateringData.data.forEach((p) => {
      console.log(`  - [${p.packageType}] ${p.name}: ₹${p.pricePerPerson}/guest (${p.isVegOnly ? 'Veg' : 'Veg & Non-Veg'})`);
    });

    // 4. Authenticate Customer
    console.log('\n[TEST 4] Authenticating Customer (customer@banquetflow.com)...');
    const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@banquetflow.com',
        password: 'customer123'
      })
    });
    const customerAuth = await customerLoginRes.json();
    if (!customerAuth.success) throw new Error(`Customer login failed: ${customerAuth.message}`);
    const customerToken = customerAuth.token;
    console.log(`✓ Customer Authenticated: ${customerAuth.user.name} (Role: ${customerAuth.user.role})`);

    // 5. Authenticate Admin
    console.log('\n[TEST 5] Authenticating Admin (admin@banquetflow.com)...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@banquetflow.com',
        password: 'admin123'
      })
    });
    const adminAuth = await adminLoginRes.json();
    if (!adminAuth.success) throw new Error(`Admin login failed: ${adminAuth.message}`);
    const adminToken = adminAuth.token;
    console.log(`✓ Admin Authenticated: ${adminAuth.user.name} (Role: ${adminAuth.user.role})`);

    // 6. Test Booking Creation & Double Booking Prevention
    const testDate = '2027-04-20';
    const testSlot = 'Evening (5:00 PM - 11:30 PM)';
    const testGuests = 300;

    console.log(`\n[TEST 6] Testing Booking Creation for "${sampleHall.name}" on ${testDate}...`);
    const bookingPayload = {
      hallId: sampleHall._id,
      packageId: cateringData.data[1]._id, // Premium
      eventType: 'Wedding',
      eventDate: testDate,
      timeSlot: testSlot,
      guestCount: testGuests,
      additionalServices: [{ name: 'Royal Stage Floral Decor', price: 45000 }],
      customerName: 'Aarav Patel',
      customerEmail: 'aarav@patel.com',
      customerPhone: '+91 98220 12345',
      paymentMethod: 'Simulated Academic Gateway'
    };

    const bookRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(bookingPayload)
    });
    const bookData = await bookRes.json();
    if (!bookData.success) throw new Error(`Initial booking failed: ${bookData.message}`);
    const createdBooking = bookData.data.booking;
    console.log(`✓ Booking Successfully Created! Booking ID: ${createdBooking.bookingId}`);
    console.log(`  - Hall Rental: ₹${createdBooking.hallPrice}`);
    console.log(`  - Catering Total: ₹${createdBooking.cateringTotal} (${testGuests} guests × ₹${createdBooking.cateringPricePerPerson})`);
    console.log(`  - Addons: ₹${createdBooking.additionalServicesTotal}`);
    console.log(`  - 5% GST: ₹${createdBooking.taxAmount}`);
    console.log(`  - Grand Total: ₹${createdBooking.totalPrice}`);

    // 7. Test Double Booking Prevention
    console.log(`\n[TEST 7] Testing Double Booking Prevention (Attempting identical booking on ${testDate} / ${testSlot})...`);
    const duplicateRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(bookingPayload)
    });
    const duplicateData = await duplicateRes.json();
    if (duplicateRes.status === 400 && !duplicateData.success) {
      console.log(`✓ DOUBLE BOOKING PREVENTED AS EXPECTED!`);
      console.log(`  Server response: "${duplicateData.message}"`);
    } else {
      throw new Error(`Double booking prevention failed! Server allowed duplicate.`);
    }

    // 8. Test Capacity Validation
    console.log(`\n[TEST 8] Testing Hall Guest Capacity Boundary Validation...`);
    const overflowGuests = sampleHall.maxCapacity + 500;
    const capacityRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        ...bookingPayload,
        eventDate: '2027-05-10',
        guestCount: overflowGuests
      })
    });
    const capacityData = await capacityRes.json();
    if (capacityRes.status === 400 && !capacityData.success) {
      console.log(`✓ CAPACITY OVERFLOW BLOCKED AS EXPECTED!`);
      console.log(`  Server response: "${capacityData.message}"`);
    } else {
      throw new Error(`Capacity validation failed! Server accepted ${overflowGuests} guests.`);
    }

    // 9. Customer Bookings Retrieval & Cancellation
    console.log('\n[TEST 9] Verifying Customer My-Bookings and Cancellation Workflow...');
    const myBookingsRes = await fetch(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const myBookings = await myBookingsRes.json();
    console.log(`✓ Customer has ${myBookings.count} bookings on file.`);

    const cancelRes = await fetch(`${BASE_URL}/bookings/${createdBooking._id}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ cancellationReason: 'Test schedule adjustment' })
    });
    const cancelData = await cancelRes.json();
    if (cancelData.success && cancelData.data.bookingStatus === 'cancelled') {
      console.log(`✓ Booking ${createdBooking.bookingId} cancelled successfully with simulated refund!`);
    } else {
      throw new Error(`Cancellation failed: ${cancelData.message}`);
    }

    // 10. Admin Dashboard Metrics & Reports
    console.log('\n[TEST 10] Verifying Admin Dashboard & Reports Endpoints...');
    const adminStatsRes = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminStats = await adminStatsRes.json();
    console.log('✓ Admin Dashboard Metrics:');
    console.log(`  - Total Halls: ${adminStats.data.stats.totalHalls}`);
    console.log(`  - Total Customers: ${adminStats.data.stats.totalCustomers}`);
    console.log(`  - Confirmed Bookings: ${adminStats.data.stats.confirmedBookings}`);
    console.log(`  - Total Revenue: ₹${adminStats.data.stats.totalRevenue}`);

    const adminReportsRes = await fetch(`${BASE_URL}/admin/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminReports = await adminReportsRes.json();
    console.log(`✓ Admin Reports Generated (${adminReports.data.monthlyStats.length} monthly cohorts, ${adminReports.data.popularHalls.length} popular halls)`);

    console.log('\n====================================================');
    console.log('  ALL 10 VERIFICATION WORKFLOWS PASSED WITH 100% SUCCESS!');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ WORKFLOW VERIFICATION ERROR:', err.message);
    process.exit(1);
  }
}

// Start server and run tests
const app = require('./server');
setTimeout(runTests, 1500);

