import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiLock, FiEye, FiEyeOff, FiShield } = FiIcons;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '606707606'
  };

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      const { username, password, remember } = JSON.parse(savedCredentials);
      if (remember) {
        setFormData({ username, password });
        setRememberMe(true);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.username === ADMIN_CREDENTIALS.username && 
        formData.password === ADMIN_CREDENTIALS.password) {
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('adminCredentials', JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember: true
        }));
      } else {
        localStorage.removeItem('adminCredentials');
      }

      // Store admin session
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sudan-red/10 via-white to-sudan-blue/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-sudan-red to-sudan-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-arabic">دخول الإدارة</h1>
          <p className="text-gray-600">يرجى إدخال بيانات الدخول للوصول إلى لوحة الإدارة</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">اسم المستخدم</label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pr-12 pl-12 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-sudan-red focus:ring-sudan-red border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="mr-3 text-gray-700 text-sm">
              تذكر بيانات الدخول
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-sudan-red to-sudan-blue text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>جاري التحقق...</span>
              </>
            ) : (
              <span>دخول</span>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 نعمر بلدنا - جميع الحقوق محفوظة</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;