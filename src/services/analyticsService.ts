import { collection, query, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { AnalyticsData, UserAnalytics } from '../types/analytics'

export const analyticsService = {
  // دریافت آمار روزانه
  async getDailyAnalytics(startDate: Date, endDate: Date): Promise<AnalyticsData[]> {
    try {
      const analytics: AnalyticsData[] = []
      
      // شبیه‌سازی داده‌های آنالیتیکس
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        analytics.push({
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * 50) + 10,
          newUsers: Math.floor(Math.random() * 10) + 1,
          totalTodos: Math.floor(Math.random() * 200) + 50,
          completedTodos: Math.floor(Math.random() * 150) + 20,
          loginCount: Math.floor(Math.random() * 100) + 30
        })
      }
      
      return analytics
    } catch (error) {
      console.error('Error getting daily analytics:', error)
      return []
    }
  },

  // دریافت آمار کاربران
  async getUserAnalytics(): Promise<UserAnalytics[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const todosSnapshot = await getDocs(collection(db, 'todos'))
      const loginLogsSnapshot = await getDocs(collection(db, 'loginLogs'))

      return usersSnapshot.docs.map(userDoc => {
        const userData = userDoc.data()
        const userTodos = todosSnapshot.docs.filter(doc => doc.data().userId === userDoc.id)
        const userLogins = loginLogsSnapshot.docs.filter(doc => doc.data().userId === userDoc.id)

        return {
          userId: userDoc.id,
          email: userData.email,
          todoStats: {
            total: userTodos.length,
            completed: userTodos.filter(todo => todo.data().completed).length,
            pending: userTodos.filter(todo => !todo.data().completed).length,
            averageCompletionTime: this.calculateAverageCompletionTime(userTodos)
          },
          activity: {
            lastLogin: userLogins[0]?.data().loginAt.toDate() || new Date(),
            loginCount: userLogins.length,
            averageSessionDuration: this.calculateAverageSessionDuration(userLogins)
          }
        }
      })
    } catch (error) {
      console.error('Error getting user analytics:', error)
      return []
    }
  },

  // ایجاد گزارش سفارشی
  async generateCustomReport(reportConfig: any) {
    try {
      // پیاده‌سازی ایجاد گزارش
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...reportConfig,
        createdAt: new Date(),
        data: [] // داده‌های گزارش
      }
    } catch (error) {
      console.error('Error generating custom report:', error)
      throw error
    }
  },

  // محاسبه میانگین زمان تکمیل
  calculateAverageCompletionTime(todos: any[]): number {
    const completedTodos = todos.filter(todo => todo.data().completed && todo.data().completedAt && todo.data().createdAt)
    if (completedTodos.length === 0) return 0
    
    const totalTime = completedTodos.reduce((sum, todo) => {
      const created = todo.data().createdAt.toDate()
      const completed = todo.data().completedAt.toDate()
      return sum + (completed.getTime() - created.getTime())
    }, 0)
    
    return totalTime / completedTodos.length
  },

  // محاسبه میانگین مدت session
  calculateAverageSessionDuration(loginLogs: any[]): number {
    const sessions = loginLogs.filter(log => log.data().logoutAt)
    if (sessions.length === 0) return 0
    
    const totalDuration = sessions.reduce((sum, log) => {
      const login = log.data().loginAt.toDate()
      const logout = log.data().logoutAt.toDate()
      return sum + (logout.getTime() - login.getTime())
    }, 0)
    
    return totalDuration / sessions.length
  }
}