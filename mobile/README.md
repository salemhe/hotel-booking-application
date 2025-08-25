# Mobile Interface Components

This folder contains mobile-optimized UI components for the hotel booking application, designed specifically for mobile devices based on the provided design mockups.

## Structure

```
mobile/
├── Users/           # Mobile components for end users
├── Vendor/          # Mobile components for vendors
├── Admin/           # Mobile components for administrators ✨ NEW
└── README.md        # This file
```

## Users Components

The Users folder contains a complete mobile interface for customers to:

### 🏠 **HomePage**
- Tabbed interface (Restaurant/Hotels/Clubs)
- Search functionality with date, time, and guest selection
- Popular and top-rated listings
- Responsive design with hero background

### 🍽️ **Restaurant Flow**
- **RestaurantProfile**: Restaurant details, menu, reviews, contact info
- **RestaurantReservationDetails**: Multi-step reservation process with preferences
- **ReservationSummary**: Premium add-ons and bottle service selection
- **MealPreSelection**: Pre-order meals with category filtering

### 🏨 **Hotel Flow**
- **HotelProfile**: Hotel details, room types, amenities, pricing
- **HotelBookingDetails**: Booking configuration with payment plans

### 💳 **Payment & Confirmation**
- **PaymentPage**: Multiple payment methods (Card, Bank Transfer, Paystack)
- **BookingConfirmation**: Success screens for both restaurant and hotel bookings

### 🧭 **Navigation**
- **BottomNavigation**: Consistent navigation across all screens

## Vendor Components ✨ NEW

The Vendor folder contains a complete mobile interface for restaurant/hotel vendors to manage their business:

### 📊 **VendorDashboard**
- Overview statistics (reservations, earnings, guests)
- Today's reservations with status tracking
- Customer frequency analytics (pie charts)
- Reservation source analytics
- Revenue breakdown by menu category
- Real-time data with trend indicators

### 🍽️ **Menu Management**
- Menu items list with toggle switches
- Search and filter functionality
- Category-based organization
- Pricing and availability controls
- Item status management (active/inactive)

### 📅 **Reservations**
- Comprehensive reservation list
- Status filters (All, Upcoming, Completed, Canceled, No shows)
- Customer details and contact info
- Payment status indicators
- Time-sensitive notifications
- Guest count and special requests

### 🏢 **Branches**
- Multi-location management
- Branch status monitoring (Open/Closed)
- Performance metrics per branch
- Ratings and review tracking
- Reservation count per location

### 💰 **Payments & Earnings**
- Transaction history with detailed records
- Payment method tracking
- Customer payment profiles
- Date-wise financial records
- Export and reporting capabilities

### ➕ **Form Components**
- **NewReservation**: Multi-step reservation creation
  - Customer details form
  - Meal preselection interface
  - Payment option selection
  - Order summary with special requests
- **CreateMenu**: Comprehensive menu creation
  - Menu details and categorization
  - Menu type selection (A la carte, Buffet, etc.)
  - Meal time availability
  - Pricing structure (fixed/per item)
  - Image upload functionality
  - Menu item management
- **AddBranch**: New branch registration
  - Location details and contact info
  - Operating hours configuration
  - Manager assignment
  - Menu assignment with import options

### 🧭 **Vendor Navigation**
- **VendorBottomNavigation**: Vendor-specific navigation (Search, Home, Reservations, Analytics, More)

## Admin Components ✨ NEW

The Admin folder contains a comprehensive mobile interface for administrators to manage the entire platform:

### 📊 **AdminDashboard**
- Welcome screen with admin greeting
- Key performance metrics (Active Vendors, Registered Users, Total Revenue, Pending Payments)
- Recent transaction history with detailed records
- Today's reservations with customer details
- Hotel bookings overview with revenue tracking
- Growth indicators and trend analytics
- Real-time data with percentage changes

### 🏢 **AdminVendorsList**
- Complete vendor directory
- Advanced search and filtering capabilities
- Vendor status management (Active/Inactive)
- Branch and reservation count tracking
- Contact information display
- Performance metrics per vendor
- Quick actions and vendor details

### 👥 **AdminUserManagement**
- User database with comprehensive details
- Search functionality across all user data
- Activity tracking (last active dates)
- Reservation history per user
- Contact information management
- User status monitoring
- Quick filtering and sorting options

### 📅 **AdminReservations**
- Platform-wide reservation monitoring
- Advanced filtering (All, Upcoming, Completed, Canceled, No shows)
- Real-time reservation status tracking
- Customer and reservation details
- Payment status indicators (Paid, Part Payment, Pay at Restaurant)
- Time remaining notifications
- Multi-status badge system

### 💰 **AdminPayments**
- Comprehensive payment dashboard with three main tabs:
  - **Overview**: Total earnings, weekly earnings, completed/pending payments
  - **Vendor's Earning**: Individual vendor financial tracking
  - **Payout History**: Complete transaction history
- Available balance tracking with bank account management
- Earnings trends with visual charts
- Transaction search and filtering
- Payment method tracking
- Revenue analytics and reporting
- Bank account verification system

### ⚙️ **AdminSettings**
- Multi-tab settings interface:
  - **General Info**: Business information and contact details
  - **Branch Settings**: Branch-specific configurations
  - **Reservation**: Platform reservation policies
- Business profile management
- Logo upload and branding
- Contact information updates
- System-wide configuration options
- Form validation and data management

### 🧭 **Admin Navigation**
- **AdminBottomNavigation**: Admin-specific navigation (Search, Home, Vendors, Analytics, Settings)

## Design Features

### 🎨 **UI/UX**
- Mobile-first responsive design
- Consistent color scheme (Teal primary, clean grays)
- Card-based layout for easy readability
- Intuitive navigation patterns
- Status indicators and badges
- Progress tracking for multi-step forms

### 🔧 **Technical**
- Built with React + TypeScript
- Uses Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui components
- State management with React hooks
- Form validation and data handling

### 📱 **Mobile Optimized**
- Touch-friendly interface
- Optimized for various screen sizes
- Fixed bottom navigation
- Swipe-friendly carousels
- Mobile-appropriate form inputs
- Gesture-based interactions

## Usage

```typescript
// User Components
import {
  HomePage,
  RestaurantProfile,
  HotelProfile,
  PaymentPage,
  BookingConfirmation
} from './mobile/Users';

// Vendor Components
import {
  VendorDashboard,
  MenuManagement,
  Reservations,
  Branches,
  Payments,
  NewReservation,
  CreateMenu,
  AddBranch
} from './mobile/Vendor';

// Admin Components
import {
  AdminDashboard,
  AdminVendorsList,
  AdminUserManagement,
  AdminReservations,
  AdminPayments,
  AdminSettings
} from './mobile/Admin';

// Use in your React app
<VendorDashboard />
<MenuManagement />
<AdminDashboard />
<AdminPayments />
```

## User Booking Flow

1. **HomePage** - Search and browse restaurants/hotels
2. **RestaurantProfile/HotelProfile** - View details, menu, location
3. **RestaurantReservationDetails/HotelBookingDetails** - Configure booking
4. **ReservationSummary** - Add premium extras (restaurants only)
5. **MealPreSelection** - Pre-order meals (optional)
6. **PaymentPage** - Complete payment
7. **BookingConfirmation** - View confirmation details

## Vendor Management Flow

### Dashboard Flow
1. **VendorDashboard** - Overview of business metrics and today's reservations

### Menu Management Flow  
1. **MenuManagement** - View and manage menu items
2. **CreateMenu** - Create new menus and items

### Reservation Management Flow
1. **Reservations** - View all reservations with filters
2. **NewReservation** - Create reservations for walk-ins

### Business Management Flow
1. **Branches** - Manage multiple locations
2. **AddBranch** - Add new business locations
3. **Payments** - Track earnings and transactions

## Components Status

### ✅ Completed (Users)
- [x] HomePage with search and listings
- [x] Restaurant profile and booking flow
- [x] Hotel profile and booking flow  
- [x] Payment processing screens
- [x] Confirmation screens
- [x] Bottom navigation
- [x] Meal pre-selection system
- [x] Premium add-ons interface

### ✅ Completed (Vendors) ✨ NEW
- [x] Vendor dashboard with analytics
- [x] Menu management system
- [x] Reservation management
- [x] Branch management
- [x] Payment & earnings tracking
- [x] New reservation creation
- [x] Menu creation wizard
- [x] Branch addition form
- [x] Vendor navigation

### 🚧 To Be Implemented
- [ ] Admin mobile interface
- [ ] Real API integration
- [ ] Authentication flows
- [ ] Profile management
- [ ] Search filters
- [ ] Map integration
- [ ] Push notifications
- [ ] Offline functionality

## Demo Pages

- **User Demo**: `/mobile-demo` - Showcase all user components
- **Vendor Demo**: `/vendor-mobile-demo` - Showcase all vendor components

## Design System

### Colors
- Primary: Teal-600 (#0891b2)
- Success: Green-500 (#10b981)
- Warning: Yellow-500 (#eab308)
- Error: Red-500 (#ef4444)
- Text: Gray-900 (#111827)
- Text Secondary: Gray-600 (#4b5563)

### Typography
- Font: Inter (sans-serif)
- Headings: font-bold, font-semibold
- Body: font-medium, font-normal
- Small text: text-sm, text-xs

### Components
- Cards with rounded-lg and subtle shadows
- Buttons with proper touch targets (py-3)
- Form inputs with focus states
- Consistent spacing using Tailwind scale
- Status badges with semantic colors
- Progress indicators for multi-step flows

## Notes

These mobile interfaces are designed to work alongside the existing web application. The components are self-contained and can be integrated into any React-based routing system.

The vendor components provide comprehensive business management capabilities specifically designed for mobile devices, enabling restaurant and hotel owners to manage their operations on-the-go.

For best results, these components should be used within a mobile viewport or responsive container that handles the mobile breakpoints appropriately.
