# Quick Reference: Order Tracking Customization

## 🎨 Quick Styling Changes

### Change Primary Color (Yellow to Different Color)

Find this in `user.jsx` and update:
```javascript
// Search for "bg-yellow-500" and replace with your color
// Yellow examples:
bg-yellow-500     // Current (bright yellow)
bg-blue-500       // Blue
bg-green-500      // Green
bg-purple-500     // Purple
bg-pink-500       // Pink
bg-red-500        // Red
bg-amber-500      // Amber
bg-orange-500     // Orange

// Also update shadows:
shadow-yellow-500/20  → shadow-blue-500/20
```

### Change Modal Width

In `OrderTrackingModal`:
```javascript
// Current: max-w-2xl (42rem)
<div className="... max-w-2xl ...">

// Change to:
max-w-3xl   // Wider
max-w-4xl   // Very wide
max-w-full  // Full screen
max-w-lg    // Smaller
```

### Change Status Colors

In `OrderTrackingModal`:
```javascript
const colors = {
  processing: 'bg-yellow-500 text-black',
  shipped: 'bg-blue-500 text-white',
  delivery: 'bg-orange-500 text-white',
  delivered: 'bg-green-500 text-white',
  cancelled: 'bg-red-500 text-white'
};
```

---

## 🗺️ Quick Map Customization

### Change Default Location

Find in `OrderTrackingModal`:
```javascript
// Current: Manila, Philippines
const deliveryLat = 14.5995;
const deliveryLng = 120.9842;

// Popular locations:
// New York: 40.7128, -74.0060
// London: 51.5074, -0.1278
// Tokyo: 35.6762, 139.6503
// Sydney: -33.8688, 151.2093
// Dubai: 25.2048, 55.2708
// Singapore: 1.3521, 103.8198
```

### Change Map Zoom Level

In `OrderTrackingModal`:
```javascript
const newMap = new window.google.maps.Map(mapRef.current, {
  zoom: 15,  // Current (street level)
  // zoom: 10 = city level
  // zoom: 5 = country level
  // zoom: 20 = building level
  center: { lat: deliveryLat, lng: deliveryLng },
  ...
});
```

### Change Marker Color

In `OrderTrackingModal`:
```javascript
icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

// Other options:
// Red: red-dot.png
// Blue: blue-dot.png
// Green: green-dot.png
// Purple: purple-dot.png
```

---

## 📊 Quick Database Queries

### View All Orders
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Update Single Order Status
```sql
UPDATE orders 
SET status = 'Shipped' 
WHERE id = 'order-id-here';
```

### Update Multiple Orders
```sql
UPDATE orders 
SET status = 'Out for Delivery', 
    delivery_address = '123 New St, City'
WHERE created_at > '2025-12-01';
```

### View Order with Items
```sql
SELECT 
  o.id, o.status, o.total_amount,
  oi.quantity, oi.size, oi.price,
  p.name, p.color
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = 'order-id-here';
```

### Count Orders by Status
```sql
SELECT 
  status, 
  COUNT(*) as count
FROM orders
GROUP BY status;
```

---

## 🎯 Quick Feature Additions

### Add SMS Notification on Status Change
```javascript
// Install: npm install twilio

const sendStatusUpdate = async (phone, orderStatus) => {
  const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
  await client.messages.create({
    body: `Your order status: ${orderStatus}`,
    from: '+1234567890',
    to: phone
  });
};
```

### Add Email Notification
```javascript
// Install: npm install nodemailer

const sendEmailUpdate = async (email, orderData) => {
  const transporter = nodemailer.createTransport(config);
  await transporter.sendMail({
    to: email,
    subject: `Order ${orderData.id} - ${orderData.status}`,
    html: `<h1>Order Update</h1><p>Status: ${orderData.status}</p>`
  });
};
```

### Add Order Rating After Delivery
```javascript
const RatingComponent = ({ orderId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  
  return (
    <div className="p-4 space-y-3">
      <p className="font-bold">Rate your order:</p>
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? 'text-yellow-500 text-2xl' : 'text-gray-400 text-2xl'}
        >
          ★
        </button>
      ))}
      <button onClick={() => onSubmit(rating)} className="w-full bg-yellow-500 text-black font-bold py-2 rounded">
        Submit Rating
      </button>
    </div>
  );
};
```

---

## 🔔 Quick Status Update Workflow

### Backend: Auto-update Status (Example with cron)
```javascript
// Runs every 6 hours to auto-update orders
const autoUpdateOrderStatus = async () => {
  // Get all "Shipped" orders older than 3 days
  const { data } = await supabase
    .from('orders')
    .select('id')
    .eq('status', 'Shipped')
    .lt('created_at', new Date(Date.now() - 3*24*60*60*1000).toISOString());
  
  // Update them to "Out for Delivery"
  for (const order of data) {
    await supabase
      .from('orders')
      .update({ status: 'Out for Delivery' })
      .eq('id', order.id);
  }
};

// Or move to "Delivered" after 5 days
```

### Frontend: Real-time Status Poll
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    // Refresh order data every 30 seconds
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId);
    
    setOrder(data[0]);
  }, 30000);
  
  return () => clearInterval(interval);
}, [orderId]);
```

---

## 🎬 Quick Animation Customizations

### Speed up Modal Animation
```javascript
// In user.jsx - change duration
animation: modalSlideIn 0.1s  // Faster (was 0.3s)
```

In user.css:
```css
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Change Timeline Animation
```css
.status-timeline-item::before {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: 100%;
    opacity: 1;
  }
}
```

---

## 📱 Quick Mobile Fixes

### Make Modal Full Screen on Mobile
```javascript
// In OrderTrackingModal className:
// Change: max-w-2xl w-full
// To: w-full h-full sm:max-w-2xl sm:h-auto

<div className="w-full h-full sm:max-w-2xl sm:h-auto bg-zinc-900 ...">
```

### Adjust Font Sizes for Mobile
```javascript
// Add responsive classes
<h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
<p className="text-xs sm:text-sm">Delivery Address</p>
```

### Stack Elements Vertically on Mobile
```javascript
// Use flex-col on mobile, flex-row on larger screens
<div className="flex flex-col sm:flex-row gap-4">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

---

## 🔧 Quick Variable Reference

### Color Variables (in user.css)
```css
--accent: #f7b731;           /* Yellow */
--green: #2ecc71;             /* Green */
--red: #e74c3c;               /* Red */
--yellow: #f1c40f;            /* Yellow alt */
--text: rgba(255, 255, 255, 0.9);  /* White text */
--bg: #242424;                /* Dark background */
--surface: #3a3a3a;           /* Card background */
```

### Component Sizing
```javascript
Modal: max-w-2xl (672px)
Map height: h-64 (256px)
Product image: h-24 w-24 (96px)
Button padding: py-3 px-4
Border radius: rounded-xl (12px)
```

---

## 💡 Quick Performance Tips

### 1. Lazy Load Map
```javascript
useEffect(() => {
  // Only initialize map when modal opens
  if (selectedOrder && mapRef.current && !map) {
    initializeMap();
  }
}, [selectedOrder]);
```

### 2. Memoize Order Data
```javascript
const OrderTrackingModal = memo(({ order, onClose }) => {
  // Component only re-renders if order changes
});
```

### 3. Cache Images
```javascript
// Store image URLs in state to avoid re-fetching
const [imageUrls, setImageUrls] = useState({});

const getImage = useCallback((imagePath) => {
  if (!imageUrls[imagePath]) {
    const url = getPublicProductImageUrl(imagePath);
    setImageUrls(prev => ({ ...prev, [imagePath]: url }));
  }
  return imageUrls[imagePath];
}, [imageUrls]);
```

---

## 🚀 Quick Deployment Checklist

- [ ] Google Maps API key configured
- [ ] All database columns added
- [ ] Product images in storage bucket
- [ ] Supabase RLS policies set
- [ ] Environment variables set
- [ ] No console errors (F12)
- [ ] Tested on mobile
- [ ] Tested on different browsers
- [ ] API keys hidden (not in code)
- [ ] All external APIs responding

---

**Quick Links**:
- [Google Maps API Setup](https://console.cloud.google.com/)
- [Supabase Dashboard](https://app.supabase.io/)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [React Documentation](https://react.dev/)

