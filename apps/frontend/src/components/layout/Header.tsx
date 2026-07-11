// components/layout/Header.tsx
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { SearchInput } from '@/components/layout/SearchInput.tsx';
import { HeaderActions } from '@/components/layout/HeaderActions';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/shared_components/ui/sheet';
import { useAuthStore } from '@/store/useAuthStore';

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.roles || 'GUEST'];
  const isOwner = userRoles.includes('OWNER');
  const isAdmin = userRoles.includes('ADMIN');

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-xs">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4 max-w-[1920px] mx-auto w-full">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle>
                  <Logo width={150} height={200} />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col py-4">
                <Link
                  to="/home"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-blue-600 transition-all"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-blue-600 transition-all"
                >
                  Sản phẩm
                </Link>
                <div className="mt-4 px-4 space-y-2">
                  {isOwner && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                      Khu vực Chủ máy 🛠️
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full bg-slate-800 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-500/25"
                    >
                      Hệ thống Admin 🛡️
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo width={160} height={40} />
        </Link>

        {/* Navigation + Search (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center max-w-2xl">
          <Navigation />
          {showSearch && (
            <div className="w-full max-w-sm">
              <SearchInput />
            </div>
          )}
        </div>

        {/* Mobile Search Icon / Actions */}
        <div className="flex items-center gap-2">
          <HeaderActions />
        </div>
      </div>
      {/* Mobile Search Bar - Optional, shows under header on small screens if requested */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-3 border-b bg-white">
          <SearchInput />
        </div>
      )}
    </header>
  );
}
