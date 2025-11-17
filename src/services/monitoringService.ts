import { collection, addDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

export const monitoringService = {
  // ثبت رویداد مانیتورینگ
  async logSystemEvent(event: {
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    metadata?: any
  }): Promise<string> {
    const docRef = await addDoc(collection(db, 'systemEvents'), {
      ...event,
      timestamp: new Date(),
      resolved: false
    })
    return docRef.id
  },

  // دریافت رویدادهای اخیر
  async getRecentEvents(limitCount: number = 50) {
    const q = query(
      collection(db, 'systemEvents'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    // در حالت واقعی از getDocs استفاده می‌شود
    return []
  },

  // subscribe به رویدادهای real-time
  subscribeToEvents(callback: (events: any[]) => void) {
    const q = query(
      collection(db, 'systemEvents'),
      orderBy('timestamp', 'desc'),
      limit(20)
    )
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }))
      callback(events)
    })
  },

  // دریافت متریک‌های سیستم
  async getSystemMetrics(): Promise<any> {
    // در حالت واقعی از API سیستم گرفته می‌شود
    return {
      cpu: {
        usage: Math.random() * 100,
        cores: navigator.hardwareConcurrency || 8,
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2]
      },
      memory: {
        total: 16 * 1024,
        used: Math.random() * 12 * 1024,
        free: 0,
        usagePercentage: 0
      },
      disk: {
        total: 500 * 1024,
        used: Math.random() * 400 * 1024,
        free: 0,
        usagePercentage: 0
      },
      network: {
        incoming: Math.random() * 100,
        outgoing: Math.random() * 50,
        connections: Math.floor(Math.random() * 1000)
      }
    }
  },

  // بررسی وضعیت سرویس‌ها
  async checkServiceStatus(): Promise<any[]> {
    // در حالت واقعی از API سرویس‌ها گرفته می‌شود
    return [
      {
        name: 'Web Server',
        status: 'running',
        uptime: Math.floor(Math.random() * 86400 * 30),
        responseTime: Math.floor(Math.random() * 200),
        lastCheck: new Date()
      },
      {
        name: 'Database',
        status: Math.random() > 0.1 ? 'running' : 'warning',
        uptime: Math.floor(Math.random() * 86400 * 60),
        responseTime: Math.floor(Math.random() * 100),
        lastCheck: new Date()
      },
      {
        name: 'Cache Server',
        status: 'running',
        uptime: Math.floor(Math.random() * 86400 * 7),
        responseTime: Math.floor(Math.random() * 50),
        lastCheck: new Date()
      }
    ]
  },

  // دریافت فعالیت‌های زنده
  async getLiveActivities(): Promise<any[]> {
    const activities = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: ['user_login', 'todo_created', 'user_registered', 'system_alert'][Math.floor(Math.random() * 4)],
        user: `user${Math.floor(Math.random() * 100)}@example.com`,
        description: 'فعالیت سیستم',
        timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 30), // 0-30 minutes ago
      }
    ]
    return activities
  }
}