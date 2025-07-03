import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPhone, FiMail, FiMapPin, FiHeart } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-sudan-red to-sudan-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ن</span>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold font-arabic">نعمر بلدنا</h3>
                <p className="text-xs text-gray-400">Sudan Reconstruction</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              معاً نعيد بناء السودان بعد الحرب. نقدم خدمات شاملة لترميم وتنظيف وصيانة المنازل بأعلى معايير الجودة والشفافية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-arabic">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-gray-400 hover:text-white transition-colors">
                  طلب خدمة
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                  الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-arabic">خدماتنا</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">ترميم المنازل</li>
              <li className="text-gray-400">التنظيف والتعقيم</li>
              <li className="text-gray-400">التوثيق المرئي</li>
              <li className="text-gray-400">الصيانة العامة</li>
              <li className="text-gray-400">الحماية والأمان</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-arabic">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-sudan-red" />
                <span className="text-gray-400">+249 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-sudan-red" />
                <span className="text-gray-400">info@naamer-baldana.sd</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiMapPin} className="w-5 h-5 text-sudan-red" />
                <span className="text-gray-400">الخرطوم، السودان</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 نعمر بلدنا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
            <span>صُنع بـ</span>
            <SafeIcon icon={FiHeart} className="w-4 h-4 text-sudan-red" />
            <span>للسودان</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;