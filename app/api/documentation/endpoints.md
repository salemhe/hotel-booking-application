# Backend API Endpoints for Hotel & Restaurant Dashboards

This document provides all the necessary API endpoints required for the hotel and restaurant dashboards to function properly with real-time data.

## Base URL

All API endpoints should be prefixed with:
```
https://your-api-domain.com/api
```

## Dashboard Endpoints

### 1. Dashboard Stats
**Endpoint:** `/dashboard/stats`  
**Method:** GET  
**Description:** Returns key metrics for the dashboard.  
**Response Format:**
```json
{
  "reservationsToday": 24,
  "prepaidReservations": 16,
  "expectedGuests": 78,
  "pendingPayments": 45000,
  "pendingPaymentsTrend": 5,
  "reservationsTrend": 12,
  "prepaidTrend": 8,
  "guestsTrend": 15
}
```

### 2. Today's Reservations
**Endpoint:** `/dashboard/reservations/today`  
**Method:** GET  
**Description:** Returns all reservations for the current day.  
**Response Format:**
```json
[
  {
    "id": "res123",
    "customerName": "John Smith",
    "customerInitials": "JS",
    "date": "2023-06-15T18:00:00Z",
    "time": "7:00 PM",
    "guests": 4,
    "status": "Confirmed"
  },
  {
    "id": "res124",
    "customerName": "Sarah Johnson",
    "customerInitials": "SJ",
    "date": "2023-06-15T20:30:00Z",
    "time": "8:30 PM",
    "guests": 2,
    "status": "Pending"
  }
]
```

### 3. Reservation Trends
**Endpoint:** `/dashboard/trends`  
**Method:** GET  
**Parameters:**
- `period`: weekly, monthly (default: weekly)  

**Description:** Returns reservation trend data for the specified period.  
**Response Format:**
```json
{
  "chartData": [
    { "day": "Mon", "value1": 12, "value2": 10, "value3": 8 },
    { "day": "Tue", "value1": 18, "value2": 15, "value3": 10 },
    { "day": "Wed", "value1": 15, "value2": 12, "value3": 9 },
    { "day": "Thu", "value1": 20, "value2": 18, "value3": 12 },
    { "day": "Fri", "value1": 25, "value2": 22, "value3": 15 },
    { "day": "Sat", "value1": 30, "value2": 28, "value3": 20 },
    { "day": "Sun", "value1": 28, "value2": 25, "value3": 18 }
  ]
}
```

### 4. Customer Frequency
**Endpoint:** `/dashboard/customers/frequency`  
**Method:** GET  
**Parameters:**
- `period`: weekly, monthly (default: weekly)  

**Description:** Returns data about new vs. returning customers.  
**Response Format:**
```json
{
  "newCustomers": 45,
  "returningCustomers": 55,
  "totalCustomers": 100
}
```

### 5. Revenue by Category
**Endpoint:** `/dashboard/revenue/by-category`  
**Method:** GET  
**Parameters:**
- `period`: weekly, monthly (default: weekly)  

**Description:** Returns revenue breakdown by menu categories.  
**Response Format:**
```json
{
  "categories": [
    { "name": "Main Course", "percentage": 45, "amount": 315000, "color": "bg-blue-500" },
    { "name": "Desserts", "percentage": 20, "amount": 140000, "color": "bg-green-500" },
    { "name": "Beverages", "percentage": 25, "amount": 175000, "color": "bg-yellow-500" },
    { "name": "Appetizers", "percentage": 10, "amount": 70000, "color": "bg-purple-500" }
  ]
}
```

### 6. Reservation Sources
**Endpoint:** `/dashboard/reservations/sources`  
**Method:** GET  
**Parameters:**
- `period`: weekly, monthly (default: weekly)  

**Description:** Returns data about reservation sources (website, mobile, walk-in).  
**Response Format:**
```json
{
  "website": 60,
  "mobile": 30,
  "walkIn": 10,
  "total": 100
}
```

### 7. Upcoming Reservations
**Endpoint:** `/reservations/upcoming`  
**Method:** GET  
**Description:** Returns reservations starting in the next 30 minutes.  
**Response Format:**
```json
[
  {
    "id": "res126",
    "customerName": "David Wilson",
    "customerInitials": "DW",
    "date": "2023-06-15T18:30:00Z",
    "time": "6:30 PM",
    "guests": 3,
    "status": "Upcoming"
  }
]
```

### 8. User Profile
**Endpoint:** `/user/profile`  
**Method:** GET  
**Description:** Returns the current user's profile information.  
**Response Format:**
```json
{
  "id": "12345",
  "businessName": "Delicious Restaurant",
  "role": "vendor",
  "email": "owner@restaurant.com",
  "businessType": "restaurant",
  "onboarded": true,
  "profileImage": "https://example.com/image.jpg"
}
```

## Hotel-Specific Endpoints

### 9. Hotel Revenue Breakdown
**Endpoint:** `/dashboard/hotel/revenue-breakdown`  
**Method:** GET  
**Parameters:**
- `period`: weekly, monthly (default: weekly)  

**Description:** Returns hotel revenue breakdown by room type, service, etc.  
**Response Format:**
```json
{
  "roomTypes": [
    { "type": "Standard", "revenue": 150000, "percentage": 30 },
    { "type": "Deluxe", "revenue": 200000, "percentage": 40 },
    { "type": "Suite", "revenue": 150000, "percentage": 30 }
  ],
  "services": [
    { "type": "Room Service", "revenue": 50000, "percentage": 10 },
    { "type": "Spa", "revenue": 30000, "percentage": 6 },
    { "type": "Restaurant", "revenue": 70000, "percentage": 14 }
  ],
  "totalRevenue": 500000
}
```

### 10. Room Availability
**Endpoint:** `/hotel/rooms/availability`  
**Method:** GET  
**Parameters:**
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD  

**Description:** Returns room availability for the specified date range.  
**Response Format:**
```json
{
  "totalRooms": 50,
  "availableRooms": 35,
  "occupancyRate": 30,
  "roomTypes": [
    {
      "type": "Standard",
      "total": 25,
      "available": 18
    },
    {
      "type": "Deluxe",
      "total": 15,
      "available": 10
    },
    {
      "type": "Suite",
      "total": 10,
      "available": 7
    }
  ]
}
```

### 11. Room Types
**Endpoint:** `/hotel/room-types`  
**Method:** GET  
**Description:** Returns all room types.  
**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Standard",
    "description": "Standard room with one queen bed",
    "basePrice": 100,
    "capacity": 2,
    "amenities": ["TV", "WiFi", "AC"]
  },
  {
    "id": 2,
    "name": "Deluxe",
    "description": "Deluxe room with one king bed",
    "basePrice": 150,
    "capacity": 2,
    "amenities": ["TV", "WiFi", "AC", "Mini Bar"]
  }
]
```

### 12. Hotel Bookings
**Endpoint:** `/hotel/bookings`  
**Method:** GET  
**Parameters:**
- `status`: confirmed, pending, cancelled, all (default: all)  

**Description:** Returns hotel bookings.  
**Response Format:**
```json
[
  {
    "id": "booking123",
    "guestName": "John Smith",
    "checkIn": "2023-06-20",
    "checkOut": "2023-06-25",
    "roomType": "Deluxe",
    "guests": 2,
    "status": "Confirmed",
    "totalAmount": 750,
    "paymentStatus": "Paid"
  }
]
```

## Restaurant-Specific Endpoints

### 13. Menu Categories
**Endpoint:** `/restaurant/menu/categories`  
**Method:** GET  
**Description:** Returns all menu categories.  
**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Appetizers",
    "description": "Starters and small plates"
  },
  {
    "id": 2,
    "name": "Main Course",
    "description": "Main dishes"
  }
]
```

### 14. Menu Items
**Endpoint:** `/restaurant/menu/items`  
**Method:** GET  
**Parameters:**
- `categoryId`: (optional) Filter by category ID  

**Description:** Returns menu items, optionally filtered by category.  
**Response Format:**
```json
[
  {
    "id": 101,
    "name": "Grilled Salmon",
    "description": "Fresh salmon with lemon and herbs",
    "price": 24.99,
    "categoryId": 2,
    "popular": true,
    "image": "https://example.com/salmon.jpg"
  },
  {
    "id": 102,
    "name": "Caesar Salad",
    "description": "Classic Caesar salad with croutons",
    "price": 12.99,
    "categoryId": 1,
    "popular": false,
    "image": "https://example.com/caesar.jpg"
  }
]
```

### 15. Restaurant Reservations
**Endpoint:** `/restaurant/reservations`  
**Method:** GET  
**Parameters:**
- `status`: confirmed, pending, cancelled, all (default: all)  

**Description:** Returns restaurant reservations.  
**Response Format:**
```json
[
  {
    "id": "res789",
    "customerName": "Emily Johnson",
    "date": "2023-06-18",
    "time": "7:30 PM",
    "partySize": 4,
    "status": "Confirmed",
    "specialRequests": "Window table if possible",
    "contactNumber": "+1234567890"
  }
]
```

## Branch Management Endpoints

### 16. Branches
**Endpoint:** `/branches`  
**Method:** GET  
**Description:** Returns all branches for the current vendor.  
**Response Format:**
```json
[
  {
    "id": 1,
    "branchName": "Downtown Branch",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "phone": "+1234567890",
    "opensAt": "08:00",
    "closesAt": "22:00",
    "selectedDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "manager": "John Smith"
  },
  {
    "id": 2,
    "branchName": "Uptown Branch",
    "address": "456 Park Ave",
    "city": "New York",
    "state": "NY",
    "phone": "+1987654321",
    "opensAt": "09:00",
    "closesAt": "23:00",
    "selectedDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "manager": "Sarah Johnson"
  }
]
```

### 17. Branch by ID
**Endpoint:** `/branches/{id}`  
**Method:** GET  
**Description:** Returns a specific branch by ID.  
**Response Format:** Same as a single item in the branches array.

### 18. Create Branch
**Endpoint:** `/branches`  
**Method:** POST  
**Body:**
```json
{
  "branchName": "New Branch",
  "address": "789 Side St",
  "city": "Chicago",
  "state": "IL",
  "phone": "+1122334455",
  "opensAt": "08:00",
  "closesAt": "22:00",
  "selectedDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "manager": "Michael Brown"
}
```
**Response:** The created branch object.

### 19. Update Branch
**Endpoint:** `/branches/{id}`  
**Method:** PUT  
**Body:** Same as Create Branch  
**Response:** The updated branch object.

### 20. Delete Branch
**Endpoint:** `/branches/{id}`  
**Method:** DELETE  
**Response:** Success message.

## Implementation Notes for Backend Developer

1. All endpoints should return proper HTTP status codes:
   - 200 OK for successful requests
   - 201 Created for successful resource creation
   - 400 Bad Request for invalid input
   - 401 Unauthorized for authentication issues
   - 403 Forbidden for authorization issues
   - 404 Not Found for non-existent resources
   - 500 Internal Server Error for server errors

2. Authentication should be handled via JWT tokens in the Authorization header:
   ```
   Authorization: Bearer <token>
   ```

3. All endpoints should support CORS for the frontend domain.

4. Rate limiting should be implemented to prevent abuse.

5. Response data should be paginated where appropriate (especially for large collections).

6. For real-time updates, consider implementing WebSockets for critical dashboards.

7. All timestamps should be in ISO 8601 format and use UTC timezone.

8. Monetary values should be returned as numbers (not strings with currency symbols).

9. Ensure proper input validation on all endpoints that accept parameters or request bodies.

10. Implement appropriate caching headers to improve performance.