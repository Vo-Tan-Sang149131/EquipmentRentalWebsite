# Quick Start Guide - Phase 4 Features

## 🚀 **Getting Started**

### **Prerequisites**
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm or yarn

---

## 📦 **Installation & Setup**

### **1. Backend Setup**
```bash
cd apps/backend

# Install dependencies and compile
mvn clean install -DskipTests

# Build JAR (optional)
mvn clean package -DskipTests

# Run the application
mvn spring-boot:run
# or
java -jar target/backend.jar
```

**Backend runs on:** `http://localhost:8080`

### **2. Frontend Setup**
```bash
cd apps/frontend

# Install dependencies
npm install

# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Frontend runs on:** `http://localhost:5173` (dev) or `http://localhost` (production)

---

## 🧪 **Testing Phase 4 Features**

### **Test 1: Owner Order Management**

#### Prerequisites:
- Create at least 1 device as Owner
- Create 1 rental order as Renter (checkout to PAID status)

#### Steps:
1. **Login as OWNER**
   - Visit http://localhost:5173/login
   - Use owner credentials

2. **Go to Orders Dashboard**
   - Click `/dashboard/orders` in sidebar
   - Should see the rental order with status **PAID**

3. **Test Accept/Confirm**
   - Click **"Confirm"** button on PAID order
   - Wait for success message
   - Order status should change to **CONFIRMED**

4. **Create another order and test Reject**
   - (Repeat from Prerequisites if needed)
   - Click **"Reject"** button on PAID order
   - Confirm in dialog
   - Order status should change to **CANCELLED**

#### Expected Results:
- ✅ Buttons visible only for PAID orders
- ✅ Renter contact info (email, phone) displayed
- ✅ Loading spinner during action
- ✅ Success notification after action
- ✅ Order status updates instantly

---

### **Test 2: Owner Calendar with Device Picker**

#### Prerequisites:
- Create at least 2 devices as Owner

#### Steps:
1. **Login as OWNER**

2. **Go to Calendar Dashboard**
   - Click `/dashboard/calendar` in sidebar
   - Device dropdown should populate with all owned devices

3. **Test Device Selection**
   - Select different devices from dropdown
   - Calendar should load blocked dates for each device

4. **Test Block Dates**
   - Select a device
   - Pick a date range (e.g., 2024-08-01 to 2024-08-10)
   - Click **"Block Dates"**
   - Dates should appear in the "Blocked Dates" list

5. **Test Unblock Dates**
   - Select same date range
   - Click **"Unblock Dates"**
   - Dates should disappear from list

#### Expected Results:
- ✅ Device dropdown loads automatically
- ✅ No need to enter Device ID manually
- ✅ Calendar updates when device changes
- ✅ Blocked dates display as colored pills
- ✅ Block/Unblock buttons work correctly
- ✅ Validation prevents invalid date ranges

---

### **Test 3: Owner Dashboard with Statistics**

#### Steps:
1. **Login as OWNER**

2. **Go to Owner Dashboard**
   - Visit http://localhost:5173/dashboard
   - Should see stat cards showing:
     - Total Orders
     - Pending Orders (PAID orders awaiting confirmation)
     - Confirmed Orders
     - Active Rentals (PICKED_UP orders)
     - Total Revenue (sum of non-cancelled orders)

3. **Verify Statistics Accuracy**
   - Create several orders (different statuses)
   - Refresh dashboard
   - Stats should update accordingly

#### Expected Results:
- ✅ Stat cards load with correct data
- ✅ Loading state shows while fetching
- ✅ Colors are visually distinct
- ✅ Quick action cards visible
- ✅ Links to main pages work

---

### **Test 4: Admin Dashboard**

#### Steps:
1. **Login as ADMIN**

2. **Go to Admin Dashboard**
   - Visit http://localhost:5173/admin
   - Should see stat cards showing:
     - Total Users
     - Total Owners (users with OWNER role)
     - Total Renters (users with RENTER role)
     - Active Users

3. **Test Quick Links**
   - Click "Manage Users" → goes to `/admin/users`
   - Click "Device Approval" → goes to `/admin/devices`

#### Expected Results:
- ✅ Stat cards show correct numbers
- ✅ Stats update when users/roles change
- ✅ Quick links navigate correctly
- ✅ Responsive layout on mobile

---

## 🔍 **API Testing (Optional - Postman/curl)**

### **Test Owner Order Confirm Endpoint**
```bash
# Prerequisites: Replace {orderId} and {token} with actual values

curl -X POST http://localhost:8080/equipment_rental/orders/1/owner/confirm \
  -H "Authorization: Bearer {your_jwt_token}" \
  -H "Content-Type: application/json"

# Expected Response (200 OK):
{
  "code": 1000,
  "message": "Order confirmed successfully",
  "result": {
    "orderId": 1,
    "status": "CONFIRMED",
    "renterUsername": "renter_user",
    "renterEmail": "renter@example.com",
    "renterPhone": "+1234567890",
    ...
  }
}
```

### **Test Owner Stats Endpoint**
```bash
curl -X GET http://localhost:8080/equipment_rental/orders/owner/overview \
  -H "Authorization: Bearer {your_jwt_token}"

# Expected Response (200 OK):
{
  "code": 1000,
  "message": "Owner overview retrieved",
  "result": {
    "totalOrders": 5,
    "pendingOrders": 2,
    "confirmedOrders": 2,
    "activeRentals": 1,
    "totalRevenue": 1500000
  }
}
```

### **Test Admin Stats Endpoint**
```bash
curl -X GET http://localhost:8080/equipment_rental/admin/overview \
  -H "Authorization: Bearer {your_jwt_token}"

# Expected Response (200 OK):
{
  "code": 1000,
  "message": "Admin overview retrieved",
  "result": {
    "totalUsers": 10,
    "totalOwners": 3,
    "totalRenters": 6,
    "activeUsers": 9
  }
}
```

---

## 📋 **Verification Checklist**

### **Backend**
- [ ] Backend compiles without errors (`mvn clean compile -DskipTests`)
- [ ] Spring Boot application starts successfully
- [ ] Database migrations applied correctly
- [ ] New endpoints accessible at correct URLs
- [ ] Authorization checks working (role-based access)

### **Frontend**
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Development server starts (`npm run dev`)
- [ ] No console errors when pages load
- [ ] TypeScript compilation successful
- [ ] All new pages accessible via routes

### **Integration**
- [ ] Owner can view orders and confirm/reject
- [ ] Owner can manage device calendar with picker
- [ ] Owner dashboard shows correct statistics
- [ ] Admin can view admin dashboard
- [ ] Admin can access device approval and user management
- [ ] All API calls work (check Network tab in DevTools)
- [ ] Loading states appear during async operations
- [ ] Error messages display correctly

### **Data Integrity**
- [ ] Order status updates persist in database
- [ ] Calendar blocked dates save correctly
- [ ] Owner statistics calculate accurately
- [ ] No data loss or corruption

---

## 🐛 **Troubleshooting**

### **Backend Issues**

**Problem:** `mvn clean compile` fails with compilation errors
- **Solution:** Check Java version (`java -version`), should be 17+
- Ensure all imports are correct in modified files

**Problem:** Application won't start (port already in use)
- **Solution:** Change port in `application.yaml` (default: 8080)
- Or kill existing process: `lsof -i :8080` / `kill -9 <PID>`

**Problem:** API returns 401 Unauthorized
- **Solution:** Ensure JWT token is valid and not expired
- Check `Authorization: Bearer {token}` header is included

### **Frontend Issues**

**Problem:** `npm install` fails
- **Solution:** Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

**Problem:** Pages show "Loading..." but never load
- **Solution:** Check browser console for errors
- Verify backend is running and accessible
- Check VITE_API_BASE_URL in `.env.local`

**Problem:** API calls fail with CORS error
- **Solution:** Backend CORS configuration issue
- Check `application.yaml` for CORS allowed origins

### **General Issues**

**Problem:** Database not initialized
- **Solution:** Check `application.yaml` for database configuration
- Ensure MySQL/PostgreSQL is running
- Run migrations manually if needed

**Problem:** Authentication not working
- **Solution:** Verify JWT secret in `application.yaml`
- Check token is being stored in localStorage
- Verify token format: `Bearer {jwt_token}`

---

## 📱 **Browser Compatibility**

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔐 **Security Notes**

1. **JWT Tokens**: Keep tokens secure, don't expose in logs
2. **CORS**: Only allow trusted origins in production
3. **Passwords**: Always hash passwords (already implemented)
4. **Authorization**: All protected endpoints verify user roles

---

## 📞 **Support & Documentation**

- **IMPLEMENTATION_GUIDE.md** - Full feature documentation
- **CHANGELOG.md** - Detailed list of changes
- **Backend README** - Java/Spring Boot specifics
- **Frontend README** - React/TypeScript specifics

---

## ✅ **Next Steps**

1. **Deploy Backend**: Build JAR and deploy to server
2. **Deploy Frontend**: Build and deploy to CDN or web server
3. **Test in Production**: Run full workflow tests
4. **Monitor**: Setup logging and error tracking
5. **Plan Phase 5**: Consider messaging/chat feature

---

**Last Updated:** July 1, 2026
**Version:** 1.4.0

