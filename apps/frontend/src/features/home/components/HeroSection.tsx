import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (<>
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
  </>);
}
