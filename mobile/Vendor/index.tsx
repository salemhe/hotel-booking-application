// Mobile Vendor Components
// These components are built specifically for mobile vendor interfaces
// based on the provided designs

// Main Dashboard
export { default as VendorDashboard } from './VendorDashboard';

// Management Pages
export { default as MenuManagement } from './MenuManagement';
export { default as Reservations } from './Reservations';
export { default as Branches } from './Branches';
export { default as Payments } from './Payments';

// Forms and Modals
export { default as AddBranch } from './AddBranch';
export { default as CreateMenu } from './CreateMenu';
export { default as NewReservation } from './NewReservation';

// Shared Components
export { default as VendorBottomNavigation } from './VendorBottomNavigation';

// Usage Examples:
// 
// For Vendor Flow:
// 1. VendorDashboard -> Main dashboard with stats and reservations
// 2. MenuManagement -> Manage menu items and categories
// 3. Reservations -> View and manage reservations
// 4. Branches -> Manage restaurant branches
// 5. Payments -> Payment history and earnings
//
// All components include VendorBottomNavigation for consistent navigation
