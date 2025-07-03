import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { serviceRequestsAPI, testConnection, testDatabaseSetup } from '../lib/supabase';

const { FiUser, FiPhone, FiMapPin, FiHome, FiTool, FiDroplet, FiCamera, FiZap, FiCalendar, FiMessageCircle, FiSend, FiCheckCircle, FiAlertCircle, FiX, FiWifi, FiRefreshCw } = FiIcons;

const RequestService = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    serviceTypes: [],
    urgency: '',
    preferredDate: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedRequestId, setSubmittedRequestId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  const services = [
    { id: 'renovation', name: 'ترميم المنازل', icon: FiTool },
    { id: 'cleaning', name: 'التنظيف والتعقيم', icon: FiDroplet },
    { id: 'documentation', name: 'التوثيق المرئي', icon: FiCamera },
    { id: 'maintenance', name: 'الصيانة العامة', icon: FiHome },
    { id: 'energy', name: 'الطاقة المتجددة', icon: FiZap }
  ];

  const urgencyLevels = [
    { id: 'low', name: 'عادي', color: 'text-green-600' },
    { id: 'medium', name: 'متوسط', color: 'text-yellow-600' },
    { id: 'high', name: 'عاجل', color: 'text-red-600' }
  ];

  // Test connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      
      if (!isConnected) {
        setError('لا يمكن الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.');
      }
    } catch (error) {
      console.error('خطأ في فحص الاتصال:', error);
      setConnectionStatus('error');
      setError('حدث خطأ في فحص الاتصال بقاعدة البيانات.');
    }
  };

  const runDatabaseTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('🧪 بدء اختبار شامل للنظام...');
      const testResult = await testDatabaseSetup();
      
      if (testResult) {
        setError('');
        alert('✅ تم اختبار النظام بنجاح! يمكنك الآن إرسال طلبك.');
        setConnectionStatus('connected');
      } else {
        setError('❌ فشل في اختبار النظام. يرجى المحاولة لاحقاً.');
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('خطأ في اختبار النظام:', error);
      setError('حدث خطأ في اختبار النظام.');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleServiceTypeChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceId)
        ? prev.serviceTypes.filter(id => id !== serviceId)
        : [...prev.serviceTypes, serviceId]
    }));
    // Clear error when user selects service
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('الاسم الكامل مطلوب');
    if (!formData.phone.trim()) errors.push('رقم الهاتف مطلوب');
    if (!formData.location) errors.push('الولاية مطلوبة');
    if (!formData.address.trim()) errors.push('العنوان التفصيلي مطلوب');
    if (formData.serviceTypes.length === 0) errors.push('يجب اختيار نوع الخدمة');
    if (!formData.urgency) errors.push('مستوى الأولوية مطلوب');
    if (!formData.description.trim()) errors.push('وصف المشكلة مطلوب');
    
    // Phone validation
    if (formData.phone.trim() && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      errors.push('رقم الهاتف غير صحيح');
    }
    
    // Email validation (if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check connection first
    if (connectionStatus !== 'connected') {
      setError('لا يمكن إرسال الطلب. يرجى التحقق من الاتصال بقاعدة البيانات.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 بدء عملية إرسال الطلب...');

      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(' • '));
        return;
      }

      // Map service IDs to Arabic names
      const serviceTypeMap = {
        'renovation': 'ترميم المنازل',
        'cleaning': 'التنظيف والتعقيم',
        'documentation': 'التوثيق المرئي',
        'maintenance': 'الصيانة العامة',
        'energy': 'الطاقة المتجددة'
      };

      const urgencyMap = {
        'low': 'عادي',
        'medium': 'متوسط',
        'high': 'عاجل'
      };

      // Convert selected service types to Arabic names
      const selectedServices = formData.serviceTypes.map(id => serviceTypeMap[id]).join(', ');

      // Prepare data for submission
      const requestData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        location: formData.location,
        address: formData.address,
        serviceType: selectedServices,
        urgency: urgencyMap[formData.urgency],
        preferredDate: formData.preferredDate || null,
        description: formData.description
      };

      console.log('📋 البيانات المُعدة للإرسال:', requestData);

      // Submit to Supabase
      const result = await serviceRequestsAPI.create(requestData);

      console.log('✅ تم إرسال الطلب بنجاح:', result);

      if (result && result.request_id) {
        setSubmittedRequestId(result.request_id);
        setIsSubmitted(true);

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmittedRequestId('');
          setFormData({
            name: '',
            phone: '',
            email: '',
            location: '',
            address: '',
            serviceTypes: [],
            urgency: '',
            preferredDate: '',
            description: ''
          });
        }, 5000);
      } else {
        throw new Error('لم يتم إرجاع رقم الطلب من الخادم');
      }

    } catch (error) {
      console.error('💥 خطأ في إرسال الطلب:', error);
      setError(`حدث خطأ في إرسال الطلب: ${error.message}`);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4"
      >
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheckCircle} className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-arabic">تم إرسال الطلب بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            شكراً لك على ثقتك. سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب وتحديد موعد الزيارة.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-800 font-medium">
              رقم الطلب: #{submittedRequestId}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            احتفظ برقم الطلب للمراجعة
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-arabic">طلب خدمة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            املأ النموذج أدناه وسيتواصل معك فريقنا لتقديم أفضل الخدمات لك
          </p>
          
          {/* Connection Status */}
          <div className="mt-6 flex items-center justify-center space-x-2 space-x-reverse">
            <SafeIcon 
              icon={FiWifi} 
              className={`w-5 h-5 ${
                connectionStatus === 'connected' ? 'text-green-600' : 
                connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`} 
            />
            <span className={`text-sm font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {connectionStatus === 'connected' ? 'متصل بقاعدة البيانات' : 
               connectionStatus === 'error' ? 'مشكلة في الاتصال' : 'جاري فحص الاتصال...'}
            </span>
          </div>
        </motion.div>

        {/* Connection Error */}
        {connectionStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <SafeIcon icon={FiAlertCircle} className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-800">مشكلة في الاتصال</h3>
            </div>
            <p className="text-red-700 mb-4">
              لا يمكن الاتصال بقاعدة البيانات حالياً. يرجى المحاولة لاحقاً أو الاتصال بالدعم الفني.
            </p>
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={checkConnection}
                disabled={isLoading}
                className="flex items-center space-x-2 space-x-reverse bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
              <button
                onClick={() => setShowConnectionTest(!showConnectionTest)}
                className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiTool} className="w-4 h-4" />
                <span>اختبار النظام</span>
              </button>
            </div>
            
            {showConnectionTest && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 mb-3">
                  سيتم اختبار الاتصال وإعداد قاعدة البيانات:
                </p>
                <button
                  onClick={runDatabaseTest}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'جاري الاختبار...' : 'تشغيل اختبار شامل'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 space-x-reverse">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">
                {error.includes('•') ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.split(' • ').map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{error}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="mr-auto text-red-600 hover:text-red-800"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-arabic flex items-center space-x-3 space-x-reverse">
              <SafeIcon icon={FiUser} className="w-6 h-6 text-sudan-red" />
              <span>المعلومات الشخصية</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                  placeholder="249xxxxxxxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-arabic flex items-center space-x-3 space-x-reverse">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-sudan-red" />
              <span>معلومات الموقع</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">الولاية *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                >
                  <option value="">اختر الولاية</option>
                  <option value="الخرطوم">الخرطوم</option>
                  <option value="الجزيرة">الجزيرة</option>
                  <option value="كسلا">كسلا</option>
                  <option value="القضارف">القضارف</option>
                  <option value="النيل الأبيض">النيل الأبيض</option>
                  <option value="النيل الأزرق">النيل الأزرق</option>
                  <option value="شمال كردفان">شمال كردفان</option>
                  <option value="جنوب كردفان">جنوب كردفان</option>
                  <option value="شمال دارفور">شمال دارفور</option>
                  <option value="جنوب دارفور">جنوب دارفور</option>
                  <option value="غرب دارفور">غرب دارفور</option>
                  <option value="وسط دارفور">وسط دارفور</option>
                  <option value="شرق دارفور">شرق دارفور</option>
                  <option value="الشمالية">الشمالية</option>
                  <option value="نهر النيل">نهر النيل</option>
                  <option value="البحر الأحمر">البحر الأحمر</option>
                  <option value="سنار">سنار</option>
                  <option value="غرب كردفان">غرب كردفان</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">العنوان التفصيلي *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                  placeholder="المربع، الشارع، رقم المنزل"
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-arabic flex items-center space-x-3 space-x-reverse">
              <SafeIcon icon={FiTool} className="w-6 h-6 text-sudan-red" />
              <span>تفاصيل الخدمة</span>
            </h2>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">نوع الخدمة المطلوبة * (يمكن اختيار أكثر من خدمة)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.serviceTypes.includes(service.id)
                        ? 'border-sudan-red bg-sudan-red/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="serviceTypes"
                      value={service.id}
                      checked={formData.serviceTypes.includes(service.id)}
                      onChange={() => handleServiceTypeChange(service.id)}
                      className="sr-only"
                    />
                    <SafeIcon icon={service.icon} className="w-5 h-5 text-sudan-red" />
                    <span className="font-medium text-gray-800">{service.name}</span>
                    {formData.serviceTypes.includes(service.id) && (
                      <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sudan-red mr-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">مستوى الأولوية *</label>
                <div className="space-y-2">
                  {urgencyLevels.map((level) => (
                    <label
                      key={level.id}
                      className={`flex items-center space-x-3 space-x-reverse p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        formData.urgency === level.id
                          ? 'border-sudan-red bg-sudan-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={level.id}
                        checked={formData.urgency === level.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full ${level.color.replace('text-', 'bg-')}`}></div>
                      <span className={`font-medium ${level.color}`}>{level.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">التاريخ المفضل</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-arabic flex items-center space-x-3 space-x-reverse">
              <SafeIcon icon={FiMessageCircle} className="w-6 h-6 text-sudan-red" />
              <span>وصف المشكلة</span>
            </h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20 transition-all duration-200"
              placeholder="اكتب وصفاً تفصيلياً للمشكلة أو الخدمة المطلوبة..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || connectionStatus !== 'connected'}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-sudan-red to-sudan-blue text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>جاري الإرسال...</span>
              </>
            ) : connectionStatus !== 'connected' ? (
              <>
                <SafeIcon icon={FiAlertCircle} className="w-5 h-5" />
                <span>يرجى فحص الاتصال أولاً</span>
              </>
            ) : (
              <>
                <span>إرسال الطلب</span>
                <SafeIcon icon={FiSend} className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default RequestService;