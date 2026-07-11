import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared_components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { DeviceDetail } from '@/features/product/types/product.types';

const pathNameMap: Record<string, string> = {
  home: 'Home',
  products: 'Products',
  lenses: 'Lenses',
  cameras: 'Cameras',
  profile: 'Profile',
};

export function AppBreadcrumb() {
  const location = useLocation();
  const queryClient = useQueryClient(); // Init queryClient
  const pathNames = location.pathname.split('/').filter(Boolean);

  if (pathNames.length === 0 || pathNames[0] === 'home') {
    return null;
  }

  return (
    <Breadcrumb className="bg-blue-300 text-white px-4 py-2 rounded w-fit">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={(props) => (
              <Link to="/home" {...props}>
                <HomeIcon className="inline-block mr-1" /> Home
              </Link>
            )}
          />
        </BreadcrumbItem>
        {pathNames.length > 0 && <BreadcrumbSeparator />}

        {pathNames.map((segment, index) => {
          const routeTo = '/' + pathNames.slice(0, index + 1).join('/');
          const isLast = index === pathNames.length - 1;

          // 3. Logic handling dynamic segments
          let label = pathNameMap[segment] || segment;

          const isIdSegment = index > 0 && pathNames[index - 1] === 'products' && !isNaN(Number(segment));

          if (isIdSegment) {
            const cachedData = queryClient.getQueryData<DeviceDetail>(['deviceDetail', segment]);
            if (cachedData?.product?.name) {
              const productName = cachedData.product.name;
              label = productName.length > 25 ? `${productName.substring(0, 25)}...` : productName;
            }
          }

          return (
            <React.Fragment key={routeTo}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-yellow-200 font-bold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={(props) => (
                      <Link to={routeTo} {...props}>
                        {label}
                      </Link>
                    )}
                  />
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
