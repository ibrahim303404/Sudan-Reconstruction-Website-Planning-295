import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SudanFlag from '../components/SudanFlag';

const { FiHome, FiDroplet, FiCamera, FiTool, FiArrowLeft, FiUsers, FiStar, FiMapPin, FiZap } = FiIcons;

const Home = () => {
  const services = [
    {
      icon: FiTool,
      title: 'ترميم المنازل',
      description: 'إعادة بناء وترميم المنازل المتضررة بأعلى المعايير',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiDroplet,
      title: 'التنظيف والتعقيم',
      description: 'خدمات تنظيف شاملة وتعقيم للمنازل والمرافق',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FiCamera,
      title: 'التوثيق المرئي',
      description: 'تصوير المنزل قبل وبعد العمل لضمان الشفافية',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiHome,
      title: 'الصيانة العامة',
      description: 'صيانة شاملة للمنازل والمرافق العامة',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FiZap,
      title: 'الطاقة المتجددة',
      description: 'تركيب أنظمة الطاقة الشمسية والحلول البديلة',
      color: 'from-yellow-500 to-yellow-600'
    }
    // Removed security service as requested
  ];

  const stats = [
    { icon: FiHome, number: '500+', label: 'منزل تم ترميمه' },
    { icon: FiUsers, number: '1000+', label: 'عائلة استفادت' },
    { icon: FiStar, number: '4.9', label: 'تقييم العملاء' },
    { icon: FiMapPin, number: '18', label: 'ولاية نخدمها' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-sudan-red/10 via-white to-sudan-blue/10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Sudan Flag */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <SudanFlag className="w-24 h-16" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sudan-red to-sudan-blue bg-clip-text text-transparent font-arabic"
          >
            نعمر بلدنا
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-4 space-x-reverse mb-6"
          >
            <SudanFlag className="w-8 h-6" />
            <p className="text-xl md:text-2xl text-gray-700 font-bold">
              جمهورية السودان
            </p>
            <SudanFlag className="w-8 h-6" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            معاً نعيد بناء السودان بعد الحرب. خدمات شاملة لترميم وتنظيف وصيانة المنازل بأعلى معايير الجودة والشفافية
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/request"
              className="bg-gradient-to-r from-sudan-red to-sudan-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 space-x-reverse"
            >
              <span>اطلب خدمة الآن</span>
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            </Link>
            <Link
              to="/services"
              className="bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-sudan-red transition-all duration-300 transform hover:scale-105"
            >
              تصفح الخدمات
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-arabic">خدماتنا</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم خدمات متكاملة لإعادة إعمار وترميم المنازل بأحدث التقنيات وأفضل الممارسات
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
                <h3 className="text-xl font-bold text-gray-800 mb-3 font-arabic">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sudan-red to-sudan-blue">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-arabic">إنجازاتنا</h2>
            <div className="flex justify-center mb-4">
              <SudanFlag className="w-16 h-12" />
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              أرقام تعكس التزامنا بخدمة الشعب السوداني وإعادة بناء الوطن
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <SudanFlag className="w-20 h-14" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-arabic">
              هل تحتاج مساعدة في ترميم منزلك؟
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              لا تتردد في التواصل معنا. فريقنا جاهز لتقديم أفضل الخدمات لك ولعائلتك
            </p>
            <Link
              to="/request"
              className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-sudan-red to-sudan-blue text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>ابدأ الآن</span>
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;