// Mobile Admin Components
// These components are built specifically for mobile admin interfaces
// based on the provided designs

// Main Dashboard
export { default as AdminDashboard } from './AdminDashboard';

// Management Pages
export { default as AdminVendorsList } from './AdminVendorsList';
export { default as AdminUserManagement } from './AdminUserManagement';
export { default as AdminReservations } from './AdminReservations';
export { default as AdminPayments } from './AdminPayments';
export { default as AdminSettings } from './AdminSettings';

// Shared Components
export { default as AdminBottomNavigation } from './AdminBottomNavigation';

// Usage Examples:
// 
// For Admin Flow:
// 1. AdminDashboard -> Main dashboard with metrics and recent transactions
// 2. AdminVendorsList -> Manage vendors and their branches
// 3. AdminUserManagement -> View and manage users
// 4. AdminReservations -> Monitor all reservations
// 5. AdminPayments -> Payments overview and earnings tracking
// 6. AdminSettings -> Administrative settings
//
// All components include AdminBottomNavigation for consistent navigation
