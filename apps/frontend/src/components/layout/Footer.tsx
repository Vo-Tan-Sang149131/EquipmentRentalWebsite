import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-xl font-bold mb-3">EquipRent</h2>
          <p className="text-sm text-slate-400">
            Nền tảng thuê thiết bị chuyên nghiệp, nhanh chóng và uy tín.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">Sản phẩm</Link></li>
            <li><Link to="/brands" className="hover:text-white">Thương hiệu</Link></li>
            <li><Link to="/about" className="hover:text-white">Về chúng tôi</Link></li>
            <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-white">Câu hỏi thường gặp</Link></li>
            <li><Link to="/policy" className="hover:text-white">Chính sách</Link></li>
            <li><Link to="/terms" className="hover:text-white">Điều khoản sử dụng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Liên hệ</h3>
          <p className="text-sm text-slate-400 mb-2">Email: support@equiprent.vn</p>
          <div className="flex gap-4 mt-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="h-5 w-5 hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="h-5 w-5 hover:text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="h-5 w-5 hover:text-white" />
            </a>
            <a href="mailto:support@equiprent.vn">
              <Mail className="h-5 w-5 hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 mt-10 pt-6 text-center text-xs text-slate-500">
        © 2026 EquipRent Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
