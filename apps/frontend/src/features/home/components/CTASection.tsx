import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (<>
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
  </>);
}
