# Mobile App Features Setup Guide

This guide covers the setup and configuration of mobile-specific features including offline support, push notifications, and routing.

## 🚀 Features Implemented

### ✅ Mobile Routing System
- **User Routes**: `/(mobile)/user/*` - Customer-facing mobile app
- **Vendor Routes**: `/(mobile)/vendor/*` - Business management mobile app  
- **Admin Routes**: `/(mobile)/admin/*` - Administrative mobile app
- **Navigation Hook**: `useMobileNavigation()` for programmatic navigation

### ✅ Offline Support
- **Service Worker**: Caches static assets and API responses
- **Background Sync**: Queues actions when offline, syncs when online
- **Offline Storage**: Uses localStorage with IndexedDB fallback
- **Offline Indicator**: Shows connection status and pending sync actions

### ✅ Push Notifications
- **VAPID Support**: Web Push protocol implementation
- **Permission Management**: User-friendly permission requests
- **Notification Types**: Booking confirmations, reminders, updates
- **Background Notifications**: Works even when app is closed

### ✅ PWA Features
- **Web App Manifest**: Installable as native app
- **App Icons**: Multiple sizes for different devices
- **Standalone Mode**: Full-screen mobile experience
- **Install Prompts**: Encourage users to install

## 📋 Environment Setup

Create a `.env.local` file with these variables:

```env
# PWA and Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# App Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

This will output:
```
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLUGpLLuaHJa7lmKVqRDshTUJeB1pK93IILBcRUKJXUCF8YS2cEJPE
Private Key:
rAnBi2TdNNK4OYP2bFHCwI3Eg5fqxhz4R9P8g7Y0G1E
=======================================
```

Add these to your environment variables.

## 🛠 Installation & Configuration

### 1. Dependencies Already Installed
```bash
npm install web-push  # Already installed
```

### 2. Service Worker Registration
The service worker is automatically registered in production. For development testing:

```javascript
// Force service worker registration in development
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 3. Icon Setup
Create these icon files in `/public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png` 
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## 📱 Usage Examples

### Navigation Between Screens

```typescript
import { useMobileNavigation } from '@/lib/hooks/useMobileNavigation';

function MyComponent() {
  const { navigateToRestaurant, navigateToPayment } = useMobileNavigation();
  
  const handleRestaurantClick = (id: string) => {
    navigateToRestaurant(id);
  };
  
  const handleCheckout = (paymentData: any) => {
    navigateToPayment(paymentData);
  };
}
```

### Offline Data Storage

```typescript
import { useOfflineStorage, offlineStorageUtils } from '@/lib/hooks/useOfflineStorage';

function BookingComponent() {
  const { saveOfflineData, isOnline } = useOfflineStorage();
  
  const makeBooking = async (bookingData: any) => {
    if (!isOnline) {
      // Save for later sync
      saveOfflineData(offlineStorageUtils.saveBooking(bookingData));
      return;
    }
    
    // Normal API call
    await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  };
}
```

### Push Notifications

```typescript
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';

function NotificationSettings() {
  const { 
    pushNotificationsEnabled, 
    requestNotificationPermission,
    subscribeToPushNotifications 
  } = usePushNotifications();
  
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPushNotifications();
    }
  };
}
```

## 🗂 File Structure

```
app/
├── (mobile)/
│   ├── layout.tsx              # Mobile-specific layout
│   ├── user/                   # User mobile routes
│   ├── vendor/                 # Vendor mobile routes
│   └── admin/                  # Admin mobile routes
├── api/push/                   # Push notification APIs
├── components/mobile/          # Mobile UI components
└── offline/                    # Offline fallback page

lib/
├── hooks/
│   ├── useMobileNavigation.ts  # Navigation utilities
│   ├── useServiceWorker.ts     # Service worker management
│   ├── useOfflineStorage.ts    # Offline data handling
│   └── usePushNotifications.ts # Push notification management
└── providers/
    └── MobileProvider.tsx      # Mobile context provider

public/
├── sw.js                       # Service worker
├── manifest.json               # PWA manifest
└── icons/                      # App icons
```

## 🧪 Testing

### Test Offline Functionality
1. Open Chrome DevTools
2. Go to Network tab
3. Set throttling to "Offline"
4. Verify offline indicator appears
5. Try making actions (they should queue)
6. Go back online and verify sync

### Test Push Notifications
1. Grant notification permissions
2. Subscribe to push notifications
3. Use browser DevTools Application tab
4. Send test notification in Service Workers section

### Test PWA Installation
1. Open in Chrome mobile
2. Look for "Add to Home Screen" prompt
3. Install and verify standalone behavior

## 🚀 Deployment Considerations

### Production Service Worker
- Service worker only registers in production
- Ensure HTTPS for push notifications
- Configure proper caching headers

### Performance
- Icons optimized for different screen densities
- Service worker caches critical resources
- Background sync reduces perceived latency

### Analytics
- Track offline usage patterns
- Monitor push notification engagement
- Measure PWA installation rates

## 🔧 Troubleshooting

### Service Worker Issues
```javascript
// Clear service worker cache
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

### Push Notification Issues
- Check VAPID key configuration
- Verify HTTPS in production
- Test notification permissions

### Offline Sync Issues  
- Check localStorage quota
- Verify network connectivity detection
- Test background sync registration

## 📊 Demo Pages

Access these demo pages to see the mobile features:

- **User Mobile**: `/mobile-demo`
- **Vendor Mobile**: `/vendor-mobile-demo` 
- **Admin Mobile**: `/admin-mobile-demo`

Each demo showcases the complete mobile experience with all features enabled.
