import { createClient } from '@supabase/supabase-js'

// Project credentials
const SUPABASE_URL = 'https://apejsnufhvkutbhiyhmz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWpzbnVmaHZrdXRiaGl5aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTY1MjksImV4cCI6MjA2NjUzMjUyOX0.2VOSq1QlwEFCT2fa_7tB7eao6EZYMO3SdVnL4F1dQ6k'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase

// Service requests functions
export const serviceRequestsAPI = {
  // Get all service requests
  async getAll() {
    try {
      console.log('🔄 جاري جلب جميع الطلبات...');
      
      const { data, error } = await supabase
        .from('service_requests_sr2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في جلب الطلبات:', error);
        throw error;
      }

      console.log('✅ تم جلب الطلبات بنجاح:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في getAll:', error);
      throw error;
    }
  },

  // Get service requests by status
  async getByStatus(status) {
    try {
      console.log('🔄 جاري جلب الطلبات بحالة:', status);
      
      const { data, error } = await supabase
        .from('service_requests_sr2024')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ خطأ في جلب الطلبات بحالة:', error);
        throw error;
      }

      console.log('✅ تم جلب الطلبات بنجاح:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ خطأ في getByStatus:', error);
      throw error;
    }
  },

  // Create new service request
  async create(requestData) {
    try {
      console.log('🚀 بدء إنشاء طلب جديد...');
      console.log('📋 البيانات المُرسلة:', requestData);

      // التحقق من الاتصال أولاً
      const connectionTest = await testConnection();
      if (!connectionTest) {
        throw new Error('فشل في الاتصال بقاعدة البيانات');
      }

      // إنشاء رقم طلب فريد
      const requestId = `REQ-${Date.now().toString().slice(-8)}`;
      console.log('🔢 رقم الطلب المُنشأ:', requestId);

      // التحقق من صحة البيانات المطلوبة
      const requiredFields = ['name', 'phone', 'location', 'address', 'serviceType', 'urgency', 'description'];
      const missingFields = requiredFields.filter(field => !requestData[field] || requestData[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        throw new Error(`الحقول المطلوبة مفقودة: ${missingFields.join(', ')}`);
      }

      // إعداد البيانات للإرسال
      const payload = {
        request_id: requestId,
        name: requestData.name.toString().trim(),
        phone: requestData.phone.toString().trim(),
        email: requestData.email ? requestData.email.toString().trim() : null,
        location: requestData.location.toString().trim(),
        address: requestData.address.toString().trim(),
        service_type: requestData.serviceType.toString().trim(),
        urgency: requestData.urgency.toString().trim(),
        preferred_date: requestData.preferredDate || null,
        description: requestData.description.toString().trim(),
        photo_names: null,
        status: 'جديد',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📦 البيانات النهائية للإرسال:', payload);

      // إرسال البيانات
      const { data, error } = await supabase
        .from('service_requests_sr2024')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في إدراج البيانات:', error);
        console.error('❌ تفاصيل الخطأ:', error.message);
        console.error('❌ كود الخطأ:', error.code);
        throw new Error(`خطأ في قاعدة البيانات: ${error.message}`);
      }

      if (!data) {
        throw new Error('لم يتم إرجاع أي بيانات من قاعدة البيانات');
      }

      console.log('✅ تم إنشاء الطلب بنجاح!');
      console.log('📄 بيانات الطلب المُنشأ:', data);
      
      return data;
    } catch (error) {
      console.error('💥 خطأ في إنشاء الطلب:', error);
      throw error;
    }
  },

  // Update service request status
  async updateStatus(requestId, newStatus) {
    try {
      console.log('🔄 تحديث حالة الطلب:', requestId, 'إلى:', newStatus);
      
      const { data, error } = await supabase
        .from('service_requests_sr2024')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId)
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في تحديث الحالة:', error);
        throw error;
      }

      console.log('✅ تم تحديث الحالة بنجاح:', data);
      return data;
    } catch (error) {
      console.error('❌ خطأ في updateStatus:', error);
      throw error;
    }
  },

  // Delete service request
  async delete(requestId) {
    try {
      console.log('🗑️ حذف الطلب:', requestId);
      
      const { error } = await supabase
        .from('service_requests_sr2024')
        .delete()
        .eq('request_id', requestId);

      if (error) {
        console.error('❌ خطأ في حذف الطلب:', error);
        throw error;
      }

      console.log('✅ تم حذف الطلب بنجاح:', requestId);
      return true;
    } catch (error) {
      console.error('❌ خطأ في delete:', error);
      throw error;
    }
  },

  // Get statistics
  async getStats() {
    try {
      console.log('📊 جاري حساب الإحصائيات...');
      
      const { data, error } = await supabase
        .from('service_requests_sr2024')
        .select('status');

      if (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        throw error;
      }

      const stats = {
        total: data.length,
        new: data.filter(req => req.status === 'جديد').length,
        inProgress: data.filter(req => req.status === 'قيد التنفيذ').length,
        completed: data.filter(req => req.status === 'مكتمل').length,
        rejected: data.filter(req => req.status === 'مرفوض').length
      };

      console.log('📈 الإحصائيات:', stats);
      return stats;
    } catch (error) {
      console.error('❌ خطأ في getStats:', error);
      throw error;
    }
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback) {
    console.log('🔄 تفعيل التحديثات الفورية...');
    
    const channel = supabase
      .channel('service_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests_sr2024' },
        (payload) => {
          console.log('🔄 تحديث فوري:', payload);
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  },

  // Unsubscribe from real-time changes
  unsubscribeFromChanges(channel) {
    if (channel) {
      console.log('🔄 إلغاء التحديثات الفورية...');
      supabase.removeChannel(channel);
    }
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
    
    const { data, error } = await supabase
      .from('service_requests_sr2024')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      return false;
    }

    console.log('✅ تم اختبار الاتصال بنجاح');
    return true;
  } catch (error) {
    console.error('💥 خطأ في اختبار الاتصال:', error);
    return false;
  }
};

// Test function to verify database setup
export const testDatabaseSetup = async () => {
  try {
    console.log('🧪 اختبار إعداد قاعدة البيانات...');
    
    // Test connection
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error('فشل في الاتصال');
    }

    // Test insert
    const testData = {
      name: 'اختبار النظام',
      phone: '+249999999999',
      location: 'الخرطوم',
      address: 'عنوان تجريبي',
      serviceType: 'ترميم المنازل',
      urgency: 'متوسط',
      description: 'طلب تجريبي لاختبار النظام'
    };

    const result = await serviceRequestsAPI.create(testData);
    console.log('✅ تم إنشاء طلب تجريبي:', result.request_id);

    // Test delete
    await serviceRequestsAPI.delete(result.request_id);
    console.log('✅ تم حذف الطلب التجريبي');

    console.log('🎉 جميع الاختبارات نجحت!');
    return true;
  } catch (error) {
    console.error('💥 فشل في اختبار النظام:', error);
    return false;
  }
};