# Backend API Endpoints for Real-Time Data

This document provides all the necessary API endpoints to replace mock data with real-time backend data.

## Base URL
```
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 1. Dashboard Endpoints

### GET /api/dashboard/stats
**Real-time dashboard statistics**
- **Query Parameters**: 
  - `businessType`: 'restaurant' | 'hotel'
  - `businessId`: string
- **Response**:
```json
{
  "reservationsToday": 24,
  "prepaidReservations": 16,
  "expectedGuests": 78,
  "pendingPayments": 45000,
  "pendingPaymentsTrend": 5,
  "reservationsTrend": 12,
  "prepaidTrend": 8,
  "guestsTrend": 15,
  "totalRevenue": 125000,
  "averageOrderValue": 85.50
}
```

### GET /api/dashboard/reservations/today
**Today's reservations**
- **Query Parameters**: 
  - `businessType`: 'restaurant' | 'hotel'
  - `businessId`: string
- **Response**: Array of reservation objects

### GET /api/dashboard/trends
**Reservation trends**
- **Query Parameters**: 
  - `businessType`: 'restaurant' | 'hotel'
  - `businessId`: string
  - `period`: 'daily' | 'weekly' | 'monthly'
- **Response**:
```json
{
  "chartData": [
    {
      "day": "Mon",
      "reservations": 12,
      "revenue": 1200,
      "guests": 24
    }
  ]
}
```

### GET /api/dashboard/customers/frequency
**Customer frequency analytics**
- **Query Parameters**: 
  - `businessType`: 'restaurant' | 'hotel'
  - `businessId`: string
- **Response**:
```json
{
  "newCustomers": 45,
  "returningCustomers": 55,
  "totalCustomers": 100
}
```

## 2. Branch Management Endpoints

### GET /api/branches
**Get all branches**
- **Query Parameters**: 
  - `businessId`: string (optional)
- **Response**: Array of branch objects

### GET /api/branches/:id
**Get specific branch**
- **Response**: Single branch object

### POST /api/branches
**Create new branch**
- **Request Body**:
```json
{
  "branchName": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "phone": "string",
  "opensAt": "08:00",
  "closesAt": "22:00",
  "selectedDays": ["Monday", "Tuesday"],
  "manager": "string"
}
```

### PUT /api/branches/:id
**Update branch**
- **Request Body**: Same as POST

### DELETE /api/branches/:id
**Delete branch**

## 3. Restaurant-Specific Endpoints

### GET /api/restaurant/menu/categories
**Get menu categories**
- **Query Parameters**: `restaurantId`: string
- **Response**: Array of category objects

### GET /api/restaurant/menu/items
**Get menu items**
- **Query Parameters**: 
  - `restaurantId`: string
  - `categoryId`: string (optional)
- **Response**: Array of menu item objects

### GET /api/restaurant/reservations
**Get restaurant reservations**
- **Query Parameters**: 
  - `restaurantId`: string
  - `status`: 'confirmed' | 'pending' | 'cancelled' | 'all'
- **Response**: Array of reservation objects

## 4. Hotel-Specific Endpoints

### GET /api/hotel/room-types
**Get room types**
- **Query Parameters**: `hotelId`: string
- **Response**: Array of room type objects

### GET /api/hotel/rooms/availability
**Get room availability**
- **Query Parameters**: 
  - `hotelId`: string
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
- **Response**:
```json
{
  "totalRooms": 50,
  "availableRooms": 35,
  "occupancyRate": 30,
  "roomTypes": [...]
}
```

### GET /api/hotel/bookings
**Get hotel bookings**
- **Query Parameters**: 
  - `hotelId`: string
  - `status`: 'confirmed' | 'pending' | 'cancelled' | 'all'
- **Response**: Array of booking objects

## 5. User Profile Endpoints

### GET /api/user/profile
**Get user profile**
- **Response**:
```json
{
  "id": "12345",
  "businessName": "Delicious Restaurant",
  "role": "vendor",
  "email": "owner@restaurant.com",
  "businessType": "restaurant"
}
```

## 6. Real-Time WebSocket

### WebSocket Endpoint: /ws/dashboard
**Real-time updates**
- **Connection**: `ws://your-api-domain.com/ws/dashboard`
- **Authentication**: Send token in query: `?token=<jwt_token>`

## Implementation Checklist

- [ ] Set up database tables
- [ ] Implement authentication middleware
- [ ] Create all API endpoints
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Set up WebSocket for real-time updates
- [ ] Add rate limiting
- [ ] Configure CORS
- [ ] Add database indexes for performance

## Database Schema

### Branches Table
```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  phone VARCHAR(20),
  opens_at TIME,
  closes_at TIME,
  working_days JSONB,
  manager_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  special_requests TEXT,
  total_amount DECIMAL(10,2),
  prepaid_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```