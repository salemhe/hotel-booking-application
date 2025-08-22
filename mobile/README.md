# Mobile Interface Components

This folder contains mobile-optimized UI components for the hotel booking application, designed specifically for mobile devices based on the provided design mockups.

## Structure

```
mobile/
├── Users/           # Mobile components for end users
├── Vendor/          # Mobile components for vendors (to be implemented)
├── Admin/           # Mobile components for administrators (to be implemented)
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

## Design Features

### 🎨 **UI/UX**
- Mobile-first responsive design
- Consistent color scheme (Teal primary, clean grays)
- Card-based layout for easy readability
- Intuitive navigation patterns

### 🔧 **Technical**
- Built with React + TypeScript
- Uses Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui components
- State management with React hooks

### 📱 **Mobile Optimized**
- Touch-friendly interface
- Optimized for various screen sizes
- Fixed bottom navigation
- Swipe-friendly carousels
- Mobile-appropriate form inputs

## Usage

```typescript
import { 
  HomePage, 
  RestaurantProfile, 
  HotelProfile,
  PaymentPage,
  BookingConfirmation 
} from './mobile/Users';

// Use in your React app
<HomePage />
```

## Restaurant Booking Flow

1. **HomePage** - Search and browse restaurants
2. **RestaurantProfile** - View details, menu, location
3. **RestaurantReservationDetails** - Set preferences and special requests
4. **ReservationSummary** - Add premium extras and bottle service
5. **MealPreSelection** - Pre-order meals (optional)
6. **PaymentPage** - Complete payment
7. **BookingConfirmation** - View confirmation details

## Hotel Booking Flow

1. **HomePage** - Search and browse hotels
2. **HotelProfile** - View rooms, amenities, pricing
3. **HotelBookingDetails** - Configure dates and payment plan
4. **PaymentPage** - Complete payment
5. **BookingConfirmation** - View confirmation details

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

### 🚧 To Be Implemented
- [ ] Vendor mobile interface
- [ ] Admin mobile interface
- [ ] Real API integration
- [ ] Authentication flows
- [ ] Profile management
- [ ] Booking history
- [ ] Search filters
- [ ] Map integration
- [ ] Push notifications

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

## Notes

This mobile interface is designed to work alongside the existing web application. The components are self-contained and can be integrated into any React-based routing system.

For best results, these components should be used within a mobile viewport or responsive container that handles the mobile breakpoints appropriately.
