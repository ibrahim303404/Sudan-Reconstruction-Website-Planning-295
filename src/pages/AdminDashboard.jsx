import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import SafeIcon from '../common/SafeIcon';
import { serviceRequestsAPI, testConnection } from '../lib/supabase';

const { FiBarChart3, FiUsers, FiCheckCircle, FiClock, FiAlertCircle, FiMapPin, FiPhone, FiCalendar, FiEye, FiEdit, FiTrash2, FiX, FiLogOut, FiPrinter, FiRefreshCw, FiWifi, FiImage } = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [realtimeChannel, setRealtimeChannel] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // Initialize connection and load data
    initializeConnection();
    
    // Cleanup on unmount
    return () => {
      if (realtimeChannel) {
        serviceRequestsAPI.unsubscribeFromChanges(realtimeChannel);
      }
    };
  }, [navigate]);

  const initializeConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      
      // Test connection first
      const connectionTest = await testConnection();
      if (!connectionTest) {
        setConnectionStatus('error');
        setError('فشل في الاتصال بقاعدة البيانات');
        return;
      }
      
      setConnectionStatus('connected');
      
      // Load initial data
      await loadRequests();
      
      // Set up real-time subscription
      setupRealtimeSubscription();
      
    } catch (error) {
      console.error('Initialization error:', error);
      setConnectionStatus('error');
      setError('حدث خطأ في تهيئة الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = serviceRequestsAPI.subscribeToChanges((payload) => {
      console.log('Real-time update received:', payload);
      
      // Reload data when changes occur
      loadRequests();
    });
    
    setRealtimeChannel(channel);
  };

  const loadRequests = async () => {
    try {
      setError('');
      
      console.log('Loading requests...');
      const [requestsData, statsData] = await Promise.all([
        serviceRequestsAPI.getAll(),
        serviceRequestsAPI.getStats()
      ]);

      console.log('Loaded requests data:', requestsData);
      console.log('Loaded stats data:', statsData);

      // Transform data to match component expectations
      const transformedRequests = requestsData.map(req => ({
        id: req.request_id,
        name: req.name,
        phone: req.phone,
        email: req.email,
        location: req.location,
        address: req.address,
        serviceType: req.service_type,
        urgency: req.urgency,
        status: req.status,
        date: new Date(req.created_at),
        description: req.description,
        preferredDate: req.preferred_date,
        photoNames: req.photo_names // Add photo names
      }));

      console.log('Transformed requests:', transformedRequests);

      setRequests(transformedRequests);
      setFilteredRequests(transformedRequests);
      setStats(statsData);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading requests:', error);
      setConnectionStatus('error');
      setError('حدث خطأ في تحميل الطلبات. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleLogout = () => {
    if (realtimeChannel) {
      serviceRequestsAPI.unsubscribeFromChanges(realtimeChannel);
    }
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const handleStatClick = (status) => {
    setActiveTab('requests');
    setStatusFilter(status);
    
    let filtered = requests;
    if (status !== 'all') {
      filtered = requests.filter(req => req.status === status);
    }
    setFilteredRequests(filtered);
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      let newStatus;
      switch (action) {
        case 'accept':
          newStatus = 'قيد التنفيذ';
          break;
        case 'complete':
          newStatus = 'مكتمل';
          break;
        case 'reject':
          newStatus = 'مرفوض';
          break;
        default:
          return;
      }

      console.log(`Updating request ${requestId} to status: ${newStatus}`);
      
      // Update in database
      await serviceRequestsAPI.updateStatus(requestId, newStatus);
      
      // Update local state immediately for better UX
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      setFilteredRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      setSelectedRequest(null);
      
      // Reload stats
      const updatedStats = await serviceRequestsAPI.getStats();
      setStats(updatedStats);
      
    } catch (error) {
      console.error('Error updating request status:', error);
      setError('حدث خطأ في تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  const handlePrintRequest = (request) => {
    try {
      const printContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب خدمة - ${request.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              direction: rtl;
              text-align: right;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #d32f2f;
            }
            
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #d32f2f;
              margin-bottom: 10px;
            }
            
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }
            
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 30px;
              text-align: center;
            }
            
            .info-section {
              margin-bottom: 25px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .info-item {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e9ecef;
            }
            
            .info-label {
              font-weight: bold;
              color: #495057;
              font-size: 14px;
              margin-bottom: 5px;
            }
            
            .info-value {
              color: #212529;
              font-size: 16px;
              font-weight: 500;
            }
            
            .full-width {
              grid-column: 1 / -1;
            }
            
            .description {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #d32f2f;
              margin: 20px 0;
            }
            
            .description-title {
              font-weight: bold;
              color: #495057;
              margin-bottom: 10px;
              font-size: 16px;
            }
            
            .description-text {
              color: #212529;
              line-height: 1.8;
              font-size: 15px;
            }
            
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
            }
            
            .status-new { background: #e3f2fd; color: #1976d2; }
            .status-progress { background: #fff3e0; color: #f57c00; }
            .status-completed { background: #e8f5e8; color: #388e3c; }
            .status-rejected { background: #ffebee; color: #d32f2f; }
            
            .urgency-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
            }
            
            .urgency-high { background: #ffebee; color: #d32f2f; }
            .urgency-medium { background: #fff3e0; color: #f57c00; }
            .urgency-low { background: #e8f5e8; color: #388e3c; }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e9ecef;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
            
            .footer p {
              margin: 5px 0;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              
              .container {
                max-width: none;
                margin: 0;
              }
              
              .no-print {
                display: none !important;
              }
              
              .header {
                break-inside: avoid;
              }
              
              .info-section {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">نعمر بلدنا</div>
              <div class="subtitle">Sudan Reconstruction - جمهورية السودان</div>
            </div>
            
            <div class="title">تفاصيل طلب الخدمة</div>
            
            <div class="info-section">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">رقم الطلب:</div>
                  <div class="info-value">${request.id}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">تاريخ الطلب:</div>
                  <div class="info-value">${format(request.date, 'dd/MM/yyyy', { locale: ar })}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">اسم العميل:</div>
                  <div class="info-value">${request.name}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">رقم الهاتف:</div>
                  <div class="info-value">${request.phone}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">الولاية:</div>
                  <div class="info-value">${request.location}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">نوع الخدمة:</div>
                  <div class="info-value">${request.serviceType}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">الأولوية:</div>
                  <div class="info-value">
                    <span class="urgency-badge ${request.urgency === 'عاجل' ? 'urgency-high' : request.urgency === 'متوسط' ? 'urgency-medium' : 'urgency-low'}">
                      ${request.urgency}
                    </span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">حالة الطلب:</div>
                  <div class="info-value">
                    <span class="status-badge ${request.status === 'جديد' ? 'status-new' : request.status === 'قيد التنفيذ' ? 'status-progress' : request.status === 'مكتمل' ? 'status-completed' : 'status-rejected'}">
                      ${request.status}
                    </span>
                  </div>
                </div>
                
                <div class="info-item full-width">
                  <div class="info-label">العنوان التفصيلي:</div>
                  <div class="info-value">${request.address}</div>
                </div>
                
                ${request.photoNames ? `
                <div class="info-item full-width">
                  <div class="info-label">الصور المرفقة:</div>
                  <div class="info-value">${request.photoNames}</div>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div class="description">
              <div class="description-title">وصف المشكلة والمتطلبات:</div>
              <div class="description-text">${request.description}</div>
            </div>
            
            <div class="footer">
              <p><strong>© 2024 نعمر بلدنا - جميع الحقوق محفوظة</strong></p>
              <p>تم إنشاء هذا التقرير في: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ar })}</p>
              <p>للاستفسار: info@naamer-baldana.sd | +249 123 456 789</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            // Close window after printing
            setTimeout(() => {
              printWindow.close();
            }, 1000);
          }, 500);
        };
      } else {
        // Fallback: create a temporary element and print
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = printContent;
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        
        document.body.appendChild(tempDiv);
        
        // Create print styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
          @media print {
            body * { visibility: hidden; }
            .print-content, .print-content * { visibility: visible; }
            .print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `;
        document.head.appendChild(printStyles);
        
        tempDiv.className = 'print-content';
        
        // Print
        window.print();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(tempDiv);
          document.head.removeChild(printStyles);
        }, 1000);
      }
    } catch (error) {
      console.error('خطأ في الطباعة:', error);
      alert('حدث خطأ أثناء الطباعة. يرجى المحاولة مرة أخرى.');
    }
  };

  // Calculate stats for display
  const statsDisplay = [
    { 
      title: 'إجمالي الطلبات', 
      value: stats.total, 
      icon: FiBarChart3, 
      color: 'from-blue-500 to-blue-600', 
      change: '+12%',
      status: 'all'
    },
    { 
      title: 'الطلبات الجديدة', 
      value: stats.new, 
      icon: FiClock, 
      color: 'from-yellow-500 to-yellow-600', 
      change: '+5%',
      status: 'جديد'
    },
    { 
      title: 'قيد التنفيذ', 
      value: stats.inProgress, 
      icon: FiUsers, 
      color: 'from-orange-500 to-orange-600', 
      change: '+8%',
      status: 'قيد التنفيذ'
    },
    { 
      title: 'مكتملة', 
      value: stats.completed, 
      icon: FiCheckCircle, 
      color: 'from-green-500 to-green-600', 
      change: '+15%',
      status: 'مكتمل'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'مرفوض': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'عاجل': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'عادي': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['الطلبات الجديدة', 'قيد التنفيذ', 'مكتملة']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'الطلبات الجديدة',
        type: 'bar',
        stack: 'Total',
        data: [stats.new, stats.new + 2, stats.new - 1, stats.new + 3, stats.new - 2, stats.new + 1]
      },
      {
        name: 'قيد التنفيذ',
        type: 'bar',
        stack: 'Total',
        data: [stats.inProgress, stats.inProgress + 1, stats.inProgress - 1, stats.inProgress + 2, stats.inProgress, stats.inProgress + 1]
      },
      {
        name: 'مكتملة',
        type: 'bar',
        stack: 'Total',
        data: [stats.completed, stats.completed + 3, stats.completed + 1, stats.completed - 1, stats.completed + 2, stats.completed + 4]
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: FiBarChart3 },
    { id: 'requests', name: 'الطلبات', icon: FiUsers },
    { id: 'analytics', name: 'التحليلات', icon: FiBarChart3 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sudan-red mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
          <p className="text-sm text-gray-500 mt-2">حالة الاتصال: {connectionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 font-arabic">لوحة الإدارة</h1>
            <div className="flex items-center space-x-2 space-x-reverse">
              <p className="text-gray-600">إدارة ومتابعة جميع الطلبات والخدمات</p>
              <div className="flex items-center space-x-1 space-x-reverse">
                <SafeIcon 
                  icon={FiWifi} 
                  className={`w-4 h-4 ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'connecting' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`} 
                />
                <span className={`text-xs ${
                  connectionStatus === 'connected' ? 'text-green-600' : 
                  connectionStatus === 'connecting' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? 'متصل' : 
                   connectionStatus === 'connecting' ? 'جاري الاتصال' : 
                   'غير متصل'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={loadRequests}
              disabled={loading}
              className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiRefreshCw} className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 space-x-reverse bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 space-x-reverse">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError('')}
              className="mr-auto text-red-600 hover:text-red-800"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Connection Status */}
        {connectionStatus !== 'connected' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center space-x-3 space-x-reverse">
            <SafeIcon icon={FiWifi} className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">
              {connectionStatus === 'connecting' ? 'جاري الاتصال بقاعدة البيانات...' : 'مشكلة في الاتصال بقاعدة البيانات'}
            </span>
            <button
              onClick={initializeConnection}
              className="mr-auto text-yellow-600 hover:text-yellow-800 text-sm underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-sudan-red text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsDisplay.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleStatClick(stat.status)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-arabic">إحصائيات الطلبات الشهرية</h3>
              <ReactECharts option={chartOptions} style={{ height: '400px' }} />
            </div>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 font-arabic">
                  قائمة الطلبات ({filteredRequests.length})
                </h3>
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    let filtered = requests;
                    if (e.target.value !== 'all') {
                      filtered = requests.filter(req => req.status === e.target.value);
                    }
                    setFilteredRequests(filtered);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-sudan-red focus:ring-2 focus:ring-sudan-red/20"
                >
                  <option value="all">جميع الطلبات ({requests.length})</option>
                  <option value="جديد">الطلبات الجديدة ({stats.new})</option>
                  <option value="قيد التنفيذ">قيد التنفيذ ({stats.inProgress})</option>
                  <option value="مكتمل">مكتملة ({stats.completed})</option>
                  <option value="مرفوض">مرفوضة ({stats.rejected})</option>
                </select>
              </div>
              
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-500">
                    {statusFilter === 'all' 
                      ? 'لم يتم إرسال أي طلبات بعد' 
                      : `لا توجد طلبات بحالة "${statusFilter}"`
                    }
                  </p>
                  <button
                    onClick={loadRequests}
                    className="mt-4 bg-sudan-red text-white px-6 py-2 rounded-lg hover:bg-sudan-red/90 transition-colors"
                  >
                    تحديث البيانات
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الخدمة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.name}</div>
                              <div className="text-sm text-gray-500 flex items-center space-x-1 space-x-reverse">
                                <SafeIcon icon={FiPhone} className="w-4 h-4" />
                                <span>{request.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center space-x-1 space-x-reverse">
                              <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400" />
                              <span>{request.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="max-w-xs truncate" title={request.serviceType}>
                              {request.serviceType}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                              <span>{format(request.date, 'dd/MM/yyyy', { locale: ar })}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="عرض التفاصيل"
                              >
                                <SafeIcon icon={FiEye} className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handlePrintRequest(request)}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                                title="طباعة"
                              >
                                <SafeIcon icon={FiPrinter} className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRequestAction(request.id, 'accept')}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                title="قبول"
                              >
                                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRequestAction(request.id, 'reject')}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                title="رفض"
                              >
                                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-arabic">توزيع الخدمات</h3>
              <ReactECharts 
                option={{
                  tooltip: {
                    trigger: 'item'
                  },
                  legend: {
                    orient: 'vertical',
                    left: 'left'
                  },
                  series: [
                    {
                      name: 'الخدمات',
                      type: 'pie',
                      radius: '50%',
                      data: [
                        { value: requests.filter(r => r.serviceType && r.serviceType.includes('ترميم المنازل')).length, name: 'ترميم المنازل' },
                        { value: requests.filter(r => r.serviceType && r.serviceType.includes('التنظيف والتعقيم')).length, name: 'التنظيف والتعقيم' },
                        { value: requests.filter(r => r.serviceType && r.serviceType.includes('الصيانة العامة')).length, name: 'الصيانة العامة' },
                        { value: requests.filter(r => r.serviceType && r.serviceType.includes('التوثيق المرئي')).length, name: 'التوثيق المرئي' },
                        { value: requests.filter(r => r.serviceType && r.serviceType.includes('الطاقة المتجددة')).length, name: 'الطاقة المتجددة' }
                      ]
                    }
                  ]
                }} 
                style={{ height: '300px' }} 
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-arabic">توزيع الطلبات حسب الولاية</h3>
              <div className="space-y-4">
                {[
                  { state: 'الخرطوم', count: requests.filter(r => r.location === 'الخرطوم').length },
                  { state: 'الجزيرة', count: requests.filter(r => r.location === 'الجزيرة').length },
                  { state: 'كسلا', count: requests.filter(r => r.location === 'كسلا').length },
                  { state: 'القضارف', count: requests.filter(r => r.location === 'القضارف').length },
                  { state: 'أخرى', count: requests.filter(r => !['الخرطوم', 'الجزيرة', 'كسلا', 'القضارف'].includes(r.location)).length }
                ].map((item, index) => {
                  const percentage = requests.length > 0 ? Math.round((item.count / requests.length) * 100) : 0;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-gradient-to-r from-sudan-red to-sudan-blue rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{item.state.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{item.state}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-gray-600">{item.count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-sudan-red to-sudan-blue h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 font-arabic">تفاصيل الطلب</h3>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => handlePrintRequest(selectedRequest)}
                    className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                    title="طباعة"
                  >
                    <SafeIcon icon={FiPrinter} className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الطلب</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                    <p className="text-gray-900">{format(selectedRequest.date, 'dd/MM/yyyy', { locale: ar })}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <p className="text-gray-900">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                    <p className="text-gray-900">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخدمة</label>
                    <p className="text-gray-900">{selectedRequest.serviceType}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان التفصيلي</label>
                  <p className="text-gray-900">{selectedRequest.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وصف المشكلة</label>
                  <p className="text-gray-900 leading-relaxed">{selectedRequest.description}</p>
                </div>

                {selectedRequest.photoNames && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2 space-x-reverse">
                      <SafeIcon icon={FiImage} className="w-4 h-4" />
                      <span>الصور المرفقة</span>
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-sm">{selectedRequest.photoNames}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4 space-x-reverse pt-6 border-t">
                  <button 
                    onClick={() => handleRequestAction(selectedRequest.id, 'accept')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    قبول الطلب
                  </button>
                  <button 
                    onClick={() => handleRequestAction(selectedRequest.id, 'complete')}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    تعديل الحالة
                  </button>
                  <button 
                    onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    رفض الطلب
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;