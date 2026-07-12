// @/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppBreadcrumb } from '@/components/layout/AppBreadcrumb.tsx';
import { AnimatePresence, motion } from 'motion/react';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={true} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-1 bg-gray-50"
        >
          <AppBreadcrumb />
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
