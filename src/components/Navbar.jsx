import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiTool, FiPlus, FiSettings, FiMenu, FiX } = FiIcons;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: FiHome },
    { name: 'الخدمات', path: '/services', icon: FiTool },
    { name: 'طلب خدمة', path: '/request', icon: FiPlus },
    { name: 'الإدارة', path: '/admin/login', icon: FiSettings },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-sudan-red to-sudan-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ن</span>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-800 font-arabic">نعمر بلدنا</h1>
              <p className="text-xs text-gray-500">Sudan Reconstruction</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path || 
                  (item.path === '/admin/login' && location.pathname.startsWith('/admin'))
                    ? 'bg-sudan-red text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg mx-2 mb-2 transition-all duration-200 ${
                  location.pathname === item.path || 
                  (item.path === '/admin/login' && location.pathname.startsWith('/admin'))
                    ? 'bg-sudan-red text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;