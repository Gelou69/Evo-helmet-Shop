# EVO Helmets - Professional E-commerce Platform

> A modern, responsive e-commerce platform for EVO Helmets with integrated order tracking and real-time status updates.

## ✨ Features

### 🛒 Core E-commerce
- Product catalog with search and filtering
- Shopping cart management
- User authentication (Login/Signup)
- User profile management
- Responsive design (mobile, tablet, desktop)

### 📦 **NEW - Order Tracking System** ⭐
- View complete order history
- **Click to track any order** with detailed information
- **Google Maps integration** showing delivery location
- Real-time order status timeline (Processing → Shipped → Out for Delivery → Delivered)
- Complete product details (name, color, size, quantity, image, price)
- Delivery address and contact information
- Itemized pricing breakdown
- Professional UI with smooth animations

### 🎨 Design
- Dark theme optimized for modern aesthetics
- Yellow accent color (#eab308) for CTAs
- Glass-morphism effects
- Smooth transitions and animations
- Mobile-first responsive design

## 🚀 Quick Start

### Installation
```bash
npm install
npm run dev
```

### Configuration
1. Create `.env` file with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

2. Add Google Maps API key to `index.html`:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=maps"></script>
   ```

## 📚 Documentation

Complete documentation for the **Order Tracking Feature**:

- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Start here! Navigation guide for all docs
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature overview and getting started
- **[ORDER_TRACKING_SETUP.md](./ORDER_TRACKING_SETUP.md)** - Setup and configuration guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed technical guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick customization guide
- **[CODE_CHANGES_REFERENCE.md](./CODE_CHANGES_REFERENCE.md)** - Exact code changes made
- **[WHATS_CHANGED.md](./WHATS_CHANGED.md)** - Visual guide of changes

## 🔧 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Google Maps API
- **Storage**: Supabase Storage

## 📁 Project Structure

```
src/
├── user/
│   ├── user.jsx          # Main user app with order tracking
│   └── user.css          # Styling with order tracking styles
├── admin/
│   ├── admin.jsx         # Admin dashboard
│   └── admin.css         # Admin styles
├── App.jsx
└── main.jsx
```

## 🎯 Order Tracking Features

### What Users See:
1. **Orders Page** - View all past orders with enhanced details
2. **Click "Track Order"** - Opens detailed tracking modal
3. **Tracking Modal Shows**:
   - Order ID and status
   - Delivery status timeline with current step highlighted
   - Google Map with delivery location marker
   - Full delivery address and contact info
   - Complete list of ordered items with:
     - Product image
     - Product name
     - Color and size
     - Quantity
     - Individual pricing
   - Order summary with subtotal, shipping, and total

### What Admins Control:
- Update order status in database
- Set delivery address and contact information
- Update product prices and sizes

## 🎨 Customization

### Change Colors
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick Styling Changes

### Change Map Location
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick Map Customization

### Add Features
See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Feature Addition Examples

## 🔐 Security

- Row-level security (RLS) policies recommended in Supabase
- API key restrictions via Google Cloud Console
- HTTPS enabled
- No credentials in version control

## 📱 Responsive Design

- **Desktop** (>1024px): Full-featured experience
- **Tablet** (768px - 1024px): Optimized layout
- **Mobile** (<768px): Touch-friendly interface

## ✅ Testing

1. Navigate to Orders section
2. Click "Track Order" on any past order
3. Verify modal opens with all details
4. Check map displays correctly
5. Test on mobile and desktop
6. Check browser console for errors (F12)

## 🚀 Deployment

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Deployment Checklist

## 🆘 Troubleshooting

### Map Not Displaying
- Verify Google Maps API key in index.html
- Check API key is enabled in Google Cloud Console
- Check browser console for errors (F12)

### Data Not Showing
- Verify database columns exist (delivery_address, delivery_contact, size, price)
- Check Supabase connection
- Verify product images in storage bucket

See [ORDER_TRACKING_SETUP.md](./ORDER_TRACKING_SETUP.md) - Troubleshooting section for more

## 📊 Performance

- Lazy-loaded Google Maps (only when modal opens)
- Optimized images via Supabase CDN
- Smooth 60fps animations
- Responsive design with no layout shifts

## 🎓 Learning

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript)

## 🎉 What's New

✅ Order Tracking System  
✅ Google Maps Integration  
✅ Enhanced Order Details  
✅ Professional Styling  
✅ Mobile Optimization  
✅ Real-time Status Updates  

## 📝 Version

**Version**: 1.0.0  
**Last Updated**: December 6, 2025  
**Status**: ✅ Production Ready

## 📞 Support

For questions or customization:
1. See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) for navigation
2. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common tasks
3. Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for details

## 📄 License

This project is part of the EVO Helmets e-commerce platform.

---

**Start with**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
