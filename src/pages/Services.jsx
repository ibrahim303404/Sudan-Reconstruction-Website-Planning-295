import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiDroplet, FiCamera, FiTool, FiZap, FiCheck, FiArrowLeft } = FiIcons;

const Services = () => {
  const services = [
    {
      icon: FiTool,
      title: 'ترميم المنازل',
      description: 'إعادة بناء وترميم المنازل المتضررة من الحرب بأعلى المعايير المهنية',
      features: [
        'إصلاح الأضرار الهيكلية',
        'تجديد الأسقف والجدران',
        'استبدال الأبواب والنوافذ',
        'إعادة تأهيل الأنظمة الكهربائية'
      ],
      price: 'حسب حجم العمل',
      duration: '1-4 أسابيع',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiDroplet,
      title: 'التنظيف والتعقيم',
      description: 'خدمات تنظيف شاملة وتعقيم للمنازل والمرافق باستخدام أحدث التقنيات',
      features: [
        'تنظيف عميق للمنزل',
        'تعقيم ضد الجراثيم والفيروسات',
        'إزالة الأتربة والغبار',
        'تنظيف الأثاث والمفروشات'
      ],
      price: '200-500 جنيه',
      duration: '1-2 أيام',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FiCamera,
      title: 'التوثيق المرئي',
      description: 'تصوير احترافي للمنزل قبل وبعد العمل لضمان الشفافية والجودة',
      features: [
        'تصوير عالي الدقة',
        'توثيق كامل للأضرار',
        'تقرير مرئي مفصل',
        'أرشيف رقمي للمشروع'
      ],
      price: '100-200 جنيه',
      duration: '1 يوم',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiHome,
      title: 'الصيانة العامة',
      description: 'صيانة شاملة للمنازل تشمل السباكة والكهرباء والنجارة',
      features: [
        'صيانة أنظمة السباكة',
        'إصلاح الأعطال الكهربائية',
        'صيانة النجارة والحدادة',
        'فحص دوري للمنزل'
      ],
      price: '150-400 جنيه',
      duration: '1-3 أيام',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FiZap,
      title: 'الطاقة المتجددة',
      description: 'تركيب أنظمة الطاقة الشمسية والحلول البديلة للطاقة',
      features: [
        'تركيب الألواح الشمسية',
        'بطاريات تخزين الطاقة',
        'أنظمة الإضاءة الموفرة',
        'استشارات الطاقة'
      ],
      price: '1000-3000 جنيه',
      duration: '3-5 أيام',
      color: 'from-yellow-500 to-yellow-600'
    }
    // Removed security service as requested
  ];

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-arabic">خدماتنا</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات المتخصصة لإعادة إعمار وتأهيل المنازل والمرافق في السودان
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                <SafeIcon icon={service.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 font-arabic">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <div className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">السعر</p>
                    <p className="font-bold text-gray-800">{service.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">المدة</p>
                    <p className="font-bold text-gray-800">{service.duration}</p>
                  </div>
                </div>
                <Link
                  to="/request"
                  className={`w-full bg-gradient-to-r ${service.color} text-white py-3 rounded-xl font-bold text-center block hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  اطلب الخدمة
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-sudan-red to-sudan-blue rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6 font-arabic">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">ضمان الجودة</h3>
              <p className="text-white/90">نضمن جودة العمل لمدة عام كامل</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCamera} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">شفافية كاملة</h3>
              <p className="text-white/90">توثيق مرئي لكل مرحلة من مراحل العمل</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiZap} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">سرعة التنفيذ</h3>
              <p className="text-white/90">فريق عمل محترف وسريع الاستجابة</p>
            </div>
          </div>
          <Link
            to="/request"
            className="inline-flex items-center space-x-3 space-x-reverse bg-white text-sudan-red px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8"
          >
            <span>احجز خدمتك الآن</span>
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default Services;