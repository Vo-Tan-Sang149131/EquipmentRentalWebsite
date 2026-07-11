// @/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppBreadcrumb } from '@/components/layout/AppBreadcrumb.tsx';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={true} />

      <main className="flex-1 bg-gray-50">
        <AppBreadcrumb />
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
