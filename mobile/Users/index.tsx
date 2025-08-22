// Mobile User Components
// These components are built specifically for mobile interfaces
// based on the provided designs

// Main Pages
export { default as HomePage } from './HomePage';
export { default as RestaurantProfile } from './RestaurantProfile';
export { default as HotelProfile } from './HotelProfile';

// Booking and Reservation Flows
export { default as RestaurantReservationDetails } from './RestaurantReservationDetails';
export { default as HotelBookingDetails } from './HotelBookingDetails';
export { default as ReservationSummary } from './ReservationSummary';
export { default as MealPreSelection } from './MealPreSelection';

// Payment and Confirmation
export { default as PaymentPage } from './PaymentPage';
export { default as BookingConfirmation } from './BookingConfirmation';

// Shared Components
export { default as BottomNavigation } from './BottomNavigation';

// Usage Examples:
// 
// For Restaurant Flow:
// 1. HomePage -> Search and browse restaurants
// 2. RestaurantProfile -> View restaurant details and menu
// 3. RestaurantReservationDetails -> Configure reservation
// 4. ReservationSummary -> Add premium extras
// 5. MealPreSelection -> Pre-select meals (optional)
// 6. PaymentPage -> Make payment
// 7. BookingConfirmation -> Confirmation screen
//
// For Hotel Flow:
// 1. HomePage -> Search and browse hotels  
// 2. HotelProfile -> View hotel details and rooms
// 3. HotelBookingDetails -> Configure booking
// 4. PaymentPage -> Make payment
// 5. BookingConfirmation -> Confirmation screen
//
// All components include BottomNavigation for consistent navigation
