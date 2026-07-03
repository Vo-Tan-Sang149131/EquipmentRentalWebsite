// @/pages/home/HomePage.tsx
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/features/product/services/product.service';

export function HomePage() {
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: () => productService.getProducts({ page: 1, size: 8, sortField: 'id', sortDirection: 'DESC' }),
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: () => productService.getCategories(),
  });


  const products = productsData?.content || [];
  console.log('products', products);
  const categories = categoriesData || [];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2070"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 to-slate-900"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Thuê Thiết Bị Nhiếp Ảnh <br />
            <span className="text-blue-500">Chuyên Nghiệp Giá Tốt</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Khám phá kho máy ảnh, ống kính và phụ kiện chất lượng cao sẵn sàng đồng hành cùng mọi dự án sáng tạo của
            bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 group"
            >
              Bắt đầu thuê ngay
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register-device"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Cho thuê thiết bị của bạn
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Danh mục nổi bật</h2>
            <p className="text-slate-500 text-sm md:text-base">Tìm kiếm theo loại thiết bị bạn cần</p>
          </div>
          <Link to="/products"
                className="text-blue-600 font-semibold flex items-center hover:underline text-sm md:text-base">
            Tất cả <span className="hidden sm:inline ml-1">danh mục</span> <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.name}`}
                className="group bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-center"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Camera className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <span
                  className="font-bold text-sm md:text-base text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Thiết bị mới nhất</h2>
              <p className="text-slate-500 text-sm md:text-base">Những thiết bị vừa được đăng tải gần đây</p>
            </div>
            <Link to="/products"
                  className="text-blue-600 font-semibold flex items-center hover:underline text-sm md:text-base">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-4/5 bg-slate-200 animate-pulse rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-4/5 overflow-hidden">
                    <img
                      src={product.primaryImageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-4">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-slate-400 text-xs ml-1">(0)</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Giá từ</p>
                        <p className="text-lg font-extrabold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(product.minPricePerDay)}
                          <span className="text-xs text-slate-400 font-normal">/ngày</span>
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trải nghiệm dịch vụ chuyên nghiệp
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Chúng tôi cam kết mang lại giá trị tốt nhất cho cộng đồng nhiếp ảnh gia và những người yêu nghệ thuật.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Tính năng 1 */}
          <div className="relative group">
            <div
              className="mb-6 w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Thiết bị chính hãng</h3>
            <p className="text-slate-500 leading-relaxed">
              Toàn bộ máy ảnh và ống kính đều được kiểm định chất lượng, vệ sinh sạch sẽ trước khi bàn giao.
            </p>
          </div>

          {/* Tính năng 2 */}
          <div className="relative group">
            <div
              className="mb-6 w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Bảo hiểm an tâm</h3>
            <p className="text-slate-500 leading-relaxed">
              Chính sách bảo vệ và hỗ trợ người thuê rõ ràng, giảm thiểu rủi ro tối đa trong quá trình sử dụng.
            </p>
          </div>

          {/* Tính năng 3 */}
          <div className="relative group">
            <div
              className="mb-6 w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Thủ tục nhanh gọn</h3>
            <p className="text-slate-500 leading-relaxed">
              Đặt lịch online, duyệt hồ sơ nhanh chóng, nhận máy trong ngày không tốn thời gian chờ đợi.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div
          className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
          <div
            className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div
            className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn có thiết bị nhàn rỗi?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Hãy biến chiếc máy ảnh của bạn thành nguồn thu nhập thụ động ngay hôm nay. Tham gia cùng cộng đồng chủ
              thiết bị của chúng tôi.
            </p>
            <Link
              to="/register-device"
              className="inline-flex items-center bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-lg"
            >
              Bắt đầu cho thuê <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
