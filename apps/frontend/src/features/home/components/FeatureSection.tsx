import { Camera, ShieldCheck, Zap } from 'lucide-react';

export function FeatureSection() {

  return (
    <>
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
    </>
  );
}
