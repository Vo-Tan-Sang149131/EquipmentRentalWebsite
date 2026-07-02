// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/home/pages/HomePage.tsx';
import { LoginPage } from '@/features/auth/pages/LoginPage.tsx';
import { RegisterPage } from '@/features/auth/pages/RegisterPage.tsx';
import { ForgotPassword } from '@/features/auth/pages/ForgotPassword.tsx';
import { ResetPassword } from '@/features/auth/pages/ResetPassword.tsx';
import ProductCatalogPage from '@/features/product/pages/ProductCatalogPage.tsx';
import RegisterDevicePage from '@/features/device-registration/pages/RegisterDevicePage.tsx';
import OwnerDashboard from '@/features/owner/pages/OwnerDashboard.tsx';
import InventoryPage from '@/features/owner/pages/InventoryPage.tsx';
import OwnerOrdersPage from '@/features/owner/pages/OwnerOrdersPage.tsx';
import OwnerCalendarPage from '@/features/owner/pages/OwnerCalendarPage.tsx';
import OwnerDeviceEditPage from '@/features/owner/pages/OwnerDeviceEditPage.tsx';
import OwnerReviewsPage from '@/features/owner/pages/OwnerReviewsPage.tsx';
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage.tsx';
import AdminDevicesPage from '@/features/admin/pages/AdminDevicesPage.tsx';
import AdminUserDetailPage from '@/features/admin/pages/AdminUserDetailPage.tsx';
import { OAuth2RedirectHandler } from '@/features/auth/components/OAuth2RedirectHandler.tsx';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoutes';
import { ProfilePage } from '@/features/profile/pages/ProfilePage.tsx';
import { ProductDetailPage } from '@/features/product/pages/ProductDetailPage.tsx';
import { CartPage } from '@/features/cart/pages/CartPage.tsx';
import { BankTransferPage } from '@/features/checkout/pages/BankTransferPage.tsx';
import { CheckoutSuccessPage } from '@/features/checkout/pages/Checkout SuccessPage.tsx';
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage.tsx';
import { VnPayCallbackPage } from '@/features/checkout/pages/VnPayCallbackPage.tsx';
import { DashboardLayout } from '@/components/layout/DashboardLayout.tsx';
import AdminDashboard from '@/features/admin/pages/AdminDashboard.tsx';
import AdminCategoriesPage from '@/features/admin/pages/AdminCategoriesPage.tsx';
import AdminBrandsPage from '@/features/admin/pages/AdminBrandsPage.tsx';
import AdminOrdersPage from '@/features/admin/pages/AdminOrdersPage.tsx';
import AdminPaymentsPage from '@/features/admin/pages/AdminPaymentsPage.tsx';
import AdminIssuesPage from '@/features/admin/pages/AdminIssuesPage.tsx';
import { MessagePage } from '@/features/chat/pages/MessagePage.tsx';


function App() {
  return (
    <Routes>
      {/* 1. Standard Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>

      {/* 2. Protected Routes RENTER */}
      <Route element={<ProtectedRoute allowedRoles={['RENTER', 'OWNER', 'ADMIN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/bank-transfer" element={<BankTransferPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/vnpay-callback" element={<VnPayCallbackPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagePage />} />
        </Route>
      </Route>

      {/* 3. Protected Routes áp dụng MENU SIDEBAR cho OWNER & ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN']} />}>
        <Route element={<DashboardLayout />}> {/* Thay SimpleLayout bằng DashboardLayout */}
          <Route path="/register-device" element={<RegisterDevicePage />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/dashboard/inventory" element={<InventoryPage />} />
          <Route path="/dashboard/device/:id/edit" element={<OwnerDeviceEditPage />} />
          <Route path="/dashboard/orders" element={<OwnerOrdersPage />} />
          <Route path="/dashboard/calendar" element={<OwnerCalendarPage />} />
          <Route path="/dashboard/reviews" element={<OwnerReviewsPage />} />
        </Route>
      </Route>

      {/* 4. Protected Routes áp dụng MENU SIDEBAR riêng cho ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}> {/* Thay SimpleLayout bằng DashboardLayout */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
          <Route path="/admin/devices" element={<AdminDevicesPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/brands" element={<AdminBrandsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/issues" element={<AdminIssuesPage />} />
        </Route>
      </Route>

      {/* 5. Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
}

export default App;
