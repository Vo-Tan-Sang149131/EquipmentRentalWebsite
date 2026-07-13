// @/pages/home/HomePage.tsx
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/features/product/services/product.service';
import { homeService } from '@/features/home/services/home.services.ts';
import { HeroSection } from '@/features/home/components/HeroSection.tsx';
import { CategoriesSection } from '@/features/home/components/CategoriesSection.tsx';
import { FeatureProducts } from '@/features/home/components/FeatureProducts.tsx';
import { FeatureSection } from '@/features/home/components/FeatureSection.tsx';
import { CTASection } from '@/features/home/components/CTASection.tsx';
import { BrandsSection } from '@/features/home/components/BrandsSection.tsx';

export function HomePage() {
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: () => productService.getProducts({ page: 1, size: 8, sortField: 'id', sortDirection: 'DESC' }),
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: () => productService.getCategories(),
  });

  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryKey: ['homeBrands'],
    queryFn: () => homeService.getTopBrands(10),
  });

  const products = productsData?.content || [];
  const categories = categoriesData || [];
  const brands = brandsData || [];


  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}

      <CategoriesSection
        categories={categories}
        isLoading={isLoadingCategories}
      />

      {/* Featured Products */}
      <FeatureProducts
        products={products}
        isLoading={isLoadingProducts}
      />

      {/* Feature Section */}
      <FeatureSection />


      {/* CTA Section */}
      <CTASection />

      {/* Brands Section */}
      <BrandsSection brands={brands} isLoading={isLoadingBrands} />


    </div>
  );
}
