import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { User } from '../types/user'

export const userService = {
  // دریافت تمام کاربران (برای ادمین)
  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      )
      
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLoginAt: doc.data().lastLoginAt?.toDate(),
      } as User))
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  },

  // آپدیت پروفایل کاربر
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // فعال/غیرفعال کردن کاربر
  async toggleUserStatus(userId: string, currentStatus: boolean): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        isActive: !currentStatus,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },

  // دریافت فعالیت‌های کاربر
  async getUserActivities(userId: string, limitCount: number = 50) {
    try {
      const q = query(
        collection(db, 'userActivities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      }))
    } catch (error) {
      console.error('Error getting user activities:', error)
      return []
    }
  },

  // جستجوی کاربران
  async searchUsers(queryText: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '>=', queryText),
        where('email', '<=', queryText + '\uf8ff'),
        limit(10)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as User))
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }
}