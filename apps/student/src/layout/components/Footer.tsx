import React from 'react';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  XOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="py-12 md:py-16">
        <div className="container-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Liên hệ
              </h3>
              <div className="space-y-3">
                <p className="flex items-start text-sm text-gray-600">
                  <EnvironmentOutlined className="mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>123 Đường ABC, TP. Hồ Chí Minh, Việt Nam</span>
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <PhoneOutlined className="mr-3 text-blue-600" />
                  +84 123 456 789
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <MailOutlined className="mr-3 text-blue-600" />
                  abcinterview@support.com
                </p>
              </div>
              <div className="flex space-x-4 mt-6">
                <FacebookOutlined className="text-lg cursor-pointer text-gray-600 hover:text-blue-600 transition-colors" />
                <XOutlined className="text-lg cursor-pointer text-gray-600 hover:text-blue-600 transition-colors" />
                <LinkedinOutlined className="text-lg cursor-pointer text-gray-600 hover:text-blue-600 transition-colors" />
                <YoutubeOutlined className="text-lg cursor-pointer text-gray-600 hover:text-red-600 transition-colors" />
              </div>
            </div>

            {/* Study Fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lĩnh vực học tập
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/linh-vuc/lap-trinh"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Công nghệ thông tin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/linh-vuc/khoa-hoc"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Khoa học máy tính
                  </Link>
                </li>
                <li>
                  <Link
                    to="/linh-vuc/su-pham"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Trí tuệ nhân tạo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/linh-vuc/kinh-te"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Kỹ thuật lập trình
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hỗ trợ
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/huong-dan"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Hướng dẫn sử dụng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chinh-sach"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Chính sách và Điều khoản
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cau-hoi-thuong-gap"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lien-he"
                    className="text-gray-600 hover:text-blue-600 hover:font-medium transition-all text-sm"
                  >
                    Liên hệ hỗ trợ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đăng ký nhận tin
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Nhận thông báo về các bài thi và tài liệu học tập mới nhất.
              </p>
              <div className="flex space-x-1">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="input-field rounded-r-none text-sm flex-1"
                />
                <button className="btn-accent btn-sm rounded-l-none px-4">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 ABC INTERVIEW SUPPORT. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
