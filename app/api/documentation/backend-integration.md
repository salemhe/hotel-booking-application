# Real-Time Backend Integration for Dashboard

This document outlines the necessary implementation details for enabling real-time updates on the hotel and restaurant dashboards.

## API Requirements

### 1. REST API Endpoints

The following REST API endpoints should be implemented for basic data fetching:

#### Common Endpoints
- `GET /api/dashboard/stats` - Basic dashboard statistics
- `GET /api/dashboard/trends?period={weekly|monthly}` - Reservation trends
- `GET /api/dashboard/reservations/today` - Today's reservations
- `GET /api/dashboard/customers/frequency?period={weekly|monthly}` - Customer frequency stats
- `GET /api/dashboard/revenue/by-category?period={weekly|monthly}` - Revenue by category
- `GET /api/dashboard/reservations/sources?period={weekly|monthly}` - Reservation sources
- `GET /api/reservations/upcoming` - Upcoming reservations
- `GET /api/user/profile` - User profile information

#### Hotel-Specific Endpoints
- `GET /api/hotel/rooms/availability?startDate={date}&endDate={date}` - Room availability
- `GET /api/hotel/room-types` - Room types
- `GET /api/hotel/bookings?status={status}` - Hotel bookings

#### Restaurant-Specific Endpoints
- `GET /api/restaurant/menu/categories` - Menu categories
- `GET /api/restaurant/menu/items?categoryId={id}` - Menu items
- `GET /api/restaurant/reservations?status={status}` - Restaurant reservations

### 2. WebSocket Integration

For real-time updates, implement a WebSocket server with the following features:

#### WebSocket Endpoint
- `wss://api.example.com/ws` or appropriate URL for your environment

#### Connection Protocol
1. Client establishes WebSocket connection
2. Client sends subscription message:
   ```json
   {
     "action": "subscribe",
     "channels": ["hotel_stats", "hotel_reservations", "hotel_notifications"]
   }
   ```
   or for restaurant:
   ```json
   {
     "action": "subscribe",
     "channels": ["restaurant_stats", "restaurant_reservations", "restaurant_notifications"]
   }
   ```
3. Server acknowledges subscription:
   ```json
   {
     "status": "subscribed",
     "channels": ["hotel_stats", "hotel_reservations", "hotel_notifications"]
   }
   ```

#### Message Format
Messages should follow this standard format:
```json
{
  "type": "stats_update",
  "timestamp": "2023-07-24T14:32:10Z",
  "stats": {
    "reservationsToday": 24,
    "prepaidReservations": 16,
    "expectedGuests": 78,
    "pendingPayments": 45000
  }
}
```

#### Supported Message Types

**1. Stats Update**
```json
{
  "type": "stats_update",
  "timestamp": "2023-07-24T14:32:10Z",
  "stats": {
    "reservationsToday": 24,
    "prepaidReservations": 16,
    "expectedGuests": 78,
    "pendingPayments": 45000,
    "pendingPaymentsTrend": 5,
    "reservationsTrend": 12,
    "prepaidTrend": 8,
    "guestsTrend": 15
  }
}
```

**2. New Reservation**
```json
{
  "type": "new_reservation",
  "timestamp": "2023-07-24T14:35:22Z",
  "reservation": {
    "id": "res123",
    "customerName": "John Smith",
    "customerInitials": "JS",
    "date": "2023-07-24T19:00:00Z",
    "time": "7:00 PM",
    "guests": 4,
    "status": "Confirmed"
  }
}
```

**3. Upcoming Reservation**
```json
{
  "type": "upcoming_reservation",
  "timestamp": "2023-07-24T14:40:00Z",
  "reservation": {
    "id": "res126",
    "customerName": "David Wilson",
    "customerInitials": "DW",
    "date": "2023-07-24T15:00:00Z",
    "time": "3:00 PM",
    "guests": 3,
    "status": "Upcoming"
  }
}
```

**4. Room Availability Update (Hotel Only)**
```json
{
  "type": "room_availability_update",
  "timestamp": "2023-07-24T14:45:00Z",
  "availability": {
    "totalRooms": 50,
    "availableRooms": 35,
    "occupancyRate": 30
  }
}
```

#### Error Handling
- Socket will reconnect automatically if disconnected
- Client should implement exponential backoff for reconnection attempts
- Server should maintain subscription state to restore subscriptions on reconnection

## Implementation Notes for Backend Developers

### Technology Options
1. **WebSocket Framework Options**:
   - Node.js: socket.io, ws
   - Python: FastAPI with WebSockets, Django Channels
   - Go: Gorilla WebSocket
   - Java: Spring WebSocket

2. **Architecture Suggestions**:
   - Use a pub/sub pattern (Redis, RabbitMQ, Kafka) behind WebSockets
   - Implement connection pooling for efficient scaling
   - Consider using a load balancer with sticky sessions

### Security Considerations
1. **Authentication**:
   - Implement JWT token validation for WebSocket connections
   - Include token in the initial connection query params or headers
   - Validate permissions for subscribed channels

2. **Rate Limiting**:
   - Implement rate limiting per connection
   - Limit number of concurrent connections per user
   - Protect against DOS attacks

### Performance Optimization
1. **Message Batching**:
   - Batch multiple updates together when possible
   - Implement message compression for large payloads
   - Set appropriate message size limits

2. **Connection Management**:
   - Implement heartbeat mechanism to detect dead connections
   - Use connection pools to manage backend resources
   - Set appropriate timeouts for idle connections

### Testing
1. **Load Testing**:
   - Test with multiple concurrent connections
   - Verify performance under high message throughput
   - Simulate connection drops and reconnections

2. **Validation**:
   - Verify message format and data integrity
   - Test error scenarios and error message handling
   - Validate reconnection logic

## Fallback Strategy

If WebSockets are not available or face implementation challenges, the frontend will automatically fall back to polling the REST API endpoints with the following frequencies:

- Upcoming reservations: Every 15 seconds
- Dashboard statistics: Every 30 seconds

This ensures the dashboard will still receive updates even without WebSocket support.

## Expected Benefits of Real-Time Updates

1. **Immediate Visibility**: Staff see new reservations and changes instantly
2. **Operational Efficiency**: Quick response to booking changes without refresh
3. **Better Customer Service**: Faster notification of upcoming guests
4. **Reduced Server Load**: WebSockets reduce the need for frequent API polling
5. **Enhanced User Experience**: Modern, dynamic interface with live updates