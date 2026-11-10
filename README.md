# BanquetFlow 👑
### Banquet Hall Reservation, Catering Package & Management System
**Software Engineering and System Design (SESD) Academic Capstone Project**

---

## 1. Executive Summary

**BanquetFlow** is an enterprise-grade full-stack web application developed to modernize banquet hall discovery, event scheduling, gourmet catering customization, and venue operations. 

In traditional hospitality operations, customers face disjointed pricing, ambiguous calendar availability, and risk of double-booking errors. Venue managers struggle with manual spreadsheets, catering reconciliation, and payment tracking. BanquetFlow resolves these challenges through a unified platform featuring **real-time conflict detection**, **itemized price calculation in Indian Rupees (₹)**, **role-based access control (RBAC)**, and **comprehensive administrative dashboards**.

---

## 2. Technology Stack

### Frontend
- **Framework:** React.js (v18.3) with Vite tooling
- **Styling & Theme:** Tailwind CSS with custom hospitality palette:
  - *Primary Dark Navy:* `#14213D`
  - *Secondary Champagne Gold:* `#D4AF77`
  - *Background Off-White:* `#FAF9F6`
  - *Text Charcoal:* `#252525`
  - *Accent Soft Beige:* `#EDE5D8`
- **Iconography:** Lucide React icons
- **Animations:** Framer Motion & Canvas Confetti celebration effects
- **Routing & State:** React Router DOM v6, Context API for Authentication & Toast Notifications

### Backend
- **Runtime & Framework:** Node.js & Express.js REST API
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js password hashing
- **Middleware:** CORS, Morgan logging, central error handling, role-based guard middleware

### Database
- **Engine:** MongoDB with Mongoose ODM
- **Architecture:** Indexed relational schemas, compound unique index checks for slot conflict prevention, aggregation pipelines for analytical reporting

---

## 3. System Architecture & Database Design

The system implements 5 core Mongoose collections with relational ObjectId references:

```
                  +-----------------------------------+
                  |               User                |
                  |-----------------------------------|
                  | _id, name, email, password, role, |
                  | phone, address, avatar, createdAt |
                  +-----------------+-----------------+
                                    | 1
                                    |
                                    | N
+-----------------------------------+-----------------------------------+
|                              Booking                                  |
|-----------------------------------------------------------------------|
| _id, bookingId (BF-2026-XXXXX), customer (ref User),                  |
| hall (ref BanquetHall), package (ref CateringPackage),                |
| eventType, eventDate, timeSlot, guestCount, hallPrice,                |
| cateringPricePerPerson, cateringTotal, additionalServices,            |
| additionalServicesTotal, subtotal, taxAmount (5% GST), totalPrice,   |
| bookingStatus, paymentStatus, specialRequests, cancellationDate       |
+-------------------+-------------------------------+-------------------+
                    | N                             | N
                    |                               |
                    | 1                             | 1
+-------------------+---------------+   +-----------+-----------------------+
|            BanquetHall            |   |            CateringPackage            |
|-----------------------------------|   |-----------------------------------|
| _id, name, location, city,        |   | _id, name, packageType (Basic /   |
| address, description, minCapacity,|   | Premium / Royal), description,    |
| maxCapacity, hallPrice, hallType, |   | pricePerPerson, isVegOnly,        |
| hasAC, facilities, images, rules, |   | menuItems (welcomeDrinks, starters|
| rating, reviews, status, featured |   | mainCourse, desserts, liveCounters|
+-----------------------------------+   +-----------------------------------+
```

### Double-Booking Prevention Logic
Every reservation is verified against existing non-cancelled bookings using a compound index query:
```javascript
const conflict = await Booking.findOne({
  hall: hallId,
  eventDate: eventDate,
  timeSlot: { $in: [timeSlot, 'Full Day (9:00 AM - 11:00 PM)'] },
  bookingStatus: { $in: ['confirmed', 'pending'] }
});
```
If a conflicting slot or full-day reservation exists, the API rejects the request with HTTP 400 and an explicit notification.

### Pricing Calculation Formula
All costs are calculated in Indian Rupees (₹):
$$\text{Hall Cost} = \text{Hall Base Rental}$$
$$\text{Catering Cost} = \text{Guest Count} \times \text{Catering Price Per Person}$$
$$\text{Additional Services Total} = \sum \text{Selected Add-on Service Prices}$$
$$\text{Subtotal} = \text{Hall Cost} + \text{Catering Cost} + \text{Additional Services Total}$$
$$\text{Tax (GST 5\%)} = \text{Round}(\text{Subtotal} \times 0.05)$$
$$\text{Total Payable} = \text{Subtotal} + \text{Tax}$$

---

## 4. Key Functional Modules

### Customer Module
1. **Interactive Landing Page:** Hero section, multi-criteria quick search (City, Date, Guests, Occasion), explore banquet halls, curated packages, testimonials.
2. **Hall Discovery & Filters:** Filter by city, budget slider (₹), capacity requirements, indoor/outdoor preference, and AC availability.
3. **Venue Details & Dynamic Availability:** Lightbox photo gallery, facilities list with icons, house rules, real-time date availability checker, reviews with submission form.
4. **Catering Packages Showcase:** Three tiered sample packages:
   - **Basic Package:** Traditional vegetarian menu, welcome drinks, main course, desserts (₹750/guest).
   - **Premium Package:** Royal vegetarian gourmet menu, mocktails, starters, main course, desserts (₹1,350/guest).
   - **Royal Package:** Awadhi & multi-cuisine veg/non-veg menu, 4 signature drinks, 6 starters, main course, desserts, 3 interactive live counters (₹2,150/guest).
   - Dynamic guest count cost slider and side-by-side course matrix.
5. **8-Step Booking Workflow:**
   - Step 1: Select banquet hall
   - Step 2: Choose occasion type (Wedding, Reception, Birthday, Corporate, etc.)
   - Step 3: Pick date and time slot (Morning, Evening, Full Day) with live slot validation
   - Step 4: Validate guest count within min/max hall capacity
   - Step 5: Select catering package & optional add-on services (Stage floral decor, DJ & lights, Photography)
   - Step 6: Enter host details & special setup instructions
   - Step 7: View itemized cost breakdown & test simulated gateway (Card/UPI/NetBanking)
   - Step 8: Confirmed reservation receipt with unique ID (`BF-2026-XXXXX`) and printable invoice.
6. **Customer Dashboard:** Metric counters (Total, Upcoming, Completed, Cancelled), scheduled event list, receipt modals, and self-service cancellation with simulated refund.

### Administrator Module
1. **Administrative Operations Dashboard:** Key performance metrics (Total Halls, Registered Customers, Total Bookings, Pending Approvals, Confirmed Slots, Gross Revenue in ₹).
2. **Hall Inventory Management:** Full CRUD (Add, Edit, Delete, Image URLs, Pricing in ₹, Minimum/Maximum Capacity, Facilities, Status toggling).
3. **Catering Package Management:** Full CRUD (Add/Edit packages, update course items, live counters, per-person pricing).
4. **Bookings Manager:** Search by ID/host/phone, filter by date and status, confirm, reject, cancel, or mark events completed.
5. **Customer Directory:** Registered host profiles, individual booking frequencies, and lifetime platform spend.
6. **Analytical Reports:** Monthly revenue charts, top performing banquet halls, popular catering package distributions, and event occasion ratios.

---

## 5. Default Demonstration Accounts

For academic evaluation and demonstration, the database includes pre-configured credentials:

| Role | Email Address | Password | Name | Access Level |
|---|---|---|---|---|
| **Administrator** | `admin@banquetflow.com` | `admin123` | BanquetFlow SuperAdmin | Full System Access |
| **Customer / Host** | `customer@banquetflow.com` | `customer123` | Priya & Rohan Sharma | Customer Host Portal |
| **Customer 2** | `vikram@gmail.com` | `customer123` | Vikram Malhotra | Customer Host Portal |
| **Customer 3** | `ananya@gmail.com` | `customer123` | Ananya Iyer | Customer Host Portal |

*Tip: The Sign In page includes **One-Click Demo Login** buttons for instant testing without typing.*

---

## 6. Installation & Execution Guide

### Prerequisites
- **Node.js:** v18.0 or higher (v22 tested)
- **MongoDB:** v6.0 or higher running on `127.0.0.1:27017`

### Step 1: Clone or Navigate to Project Directory
```powershell
cd "c:\Users\reeth\OneDrive\Desktop\webs\sesd project"
```

### Step 2: Install Server Dependencies & Seed Database
```powershell
cd server
npm install
node seed.js
```
*(The seed script populates 4 users, 6 luxury banquet halls across Mumbai, Delhi, Bengaluru, Udaipur, Hyderabad, 3 tiered catering packages, and sample historical bookings).*

### Step 3: Install Client Dependencies
```powershell
cd ../client
npm install
```

### Step 4: Run the Application
In **Terminal 1** (Backend API Server):
```powershell
cd server
npm start
```
*Server starts on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)*

In **Terminal 2** (Frontend Client):
```powershell
cd client
npm run dev
```
*Vite launches on `http://localhost:5173`*

Open `http://localhost:5173` in your browser.

---

## 7. REST API Reference Summary

### Authentication
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Authenticate user & issue JWT
- `GET /api/auth/me` - Get profile (Protected)
- `PUT /api/auth/me` - Update profile (Protected)

### Banquet Halls
- `GET /api/halls` - List halls with filters (city, type, hasAC, minGuests, maxPrice, sort)
- `GET /api/halls/:id` - Single hall details
- `GET /api/halls/:id/availability?date=YYYY-MM-DD` - Check slot availability
- `POST /api/halls/:id/reviews` - Add review (Customer)
- `POST /api/halls` - Create hall (Admin)
- `PUT /api/halls/:id` - Update hall (Admin)
- `DELETE /api/halls/:id` - Delete hall (Admin)

### Catering Packages
- `GET /api/catering` - List catering packages
- `GET /api/catering/:id` - Single package details
- `POST /api/catering` - Create package (Admin)
- `PUT /api/catering/:id` - Update package (Admin)
- `DELETE /api/catering/:id` - Delete package (Admin)

### Bookings & Reservations
- `POST /api/bookings` - Create reservation with conflict checks & pricing calculation
- `GET /api/bookings/my-bookings` - Host reservations (Customer)
- `GET /api/bookings/:id` - Single booking details (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel reservation (Customer)
- `GET /api/bookings` - All bookings with search & status filters (Admin)
- `PUT /api/bookings/:id/status` - Change status (Admin)

### Admin Operations & Reports
- `GET /api/admin/dashboard-stats` - Aggregate metrics & recent records
- `GET /api/admin/customers` - Customer directory with spend analytics
- `GET /api/admin/reports` - Monthly cohorts, hall popularity & event distribution

---

## 8. Academic Evaluation Verification

An automated workflow validation suite is included. You can verify all 10 core system requirements by running:
```powershell
cd server
node test-workflows.js
```

### Verified Criteria:
- [x] JWT Authentication & Role-Based Access Control (Customer & Admin)
- [x] Conflict-free booking engine preventing overlapping slots on identical dates
- [x] Hall guest capacity boundaries enforcement
- [x] Transparent pricing calculation formula with 5% GST itemization in INR (₹)
- [x] Responsive hospitality UI/UX designed in Dark Navy & Champagne Gold
- [x] Complete Administrative CRUD for venues and catering packages
- [x] Analytical reporting with revenue aggregation

