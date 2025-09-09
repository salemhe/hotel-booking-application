# TODO: Fix Vendor Dashboard Issues

## 1. Fix Payments and Financial Details on Vendor-Dashboard
- [x] Update hotel payments page API endpoints to use /api/vendors/accounts, /api/vendors/payments/stats, /api/vendors/payments/transactions
- [x] Ensure restaurant payments page uses real-time socket with correct auth headers
- [ ] Add real-time socket integration to hotel payments page for live updates
- [ ] Verify stats and transactions display correctly

## 2. Fix Users Cannot Make Reservations
- [x] Verify reservation creation API call in booking forms
- [x] Check reservation service uses correct endpoints
- [ ] Ensure reservation confirmation and completion flows work

## 3. Fix Vendors Do Not See Reservations
- [x] Update hotel reservations page to use /api/vendors/reservations endpoint
- [x] Ensure restaurant reservations use real-time socket correctly
- [ ] Add real-time socket integration to hotel reservations page
- [ ] Verify reservation filters and table display work

## 4. Fix Cannot Add Menu or Room
- [x] Verify menu add page uses /api/vendors/menus endpoint
- [x] Verify rooms management uses /api/vendors/rooms endpoint
- [ ] Ensure add/edit/delete operations work with real-time updates
- [ ] Add socket integration for menu and room updates

## 5. Ensure Real-Time Data Fetching
- [ ] Implement socket connections for real-time updates where needed
- [ ] Add proper auth headers to all API calls
- [ ] Test all flows for real-time data updates

## 6. Backend API Changes Needed
- [ ] Identify any missing backend endpoints and inform user
