import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  deleteDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Comment, TodoCollaborator, ActivityLog } from '../types/collaboration'

export const collaborationService = {
  // اضافه کردن کامنت
  async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...commentData,
        replies: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      
      // ثبت فعالیت
      await this.logActivity({
        todoId: commentData.todoId,
        userId: commentData.userId,
        userEmail: commentData.userEmail,
        action: 'commented',
        description: `کامنت جدید اضافه کرد`,
        metadata: { 
          commentId: docRef.id,
          content: commentData.content.substring(0, 100) + (commentData.content.length > 100 ? '...' : '')
        }
      })
      
      return docRef.id
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  },

  // پاسخ به کامنت
  async addReply(commentId: string, replyData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<string> {
    try {
      const replyDocRef = await addDoc(collection(db, 'comments'), {
        ...replyData,
        parentId: commentId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })

      // آپدیت کامنت اصلی برای اضافه کردن reply
      const commentRef = doc(db, 'comments', commentId)
      await updateDoc(commentRef, {
        updatedAt: Timestamp.now()
      })

      // ثبت فعالیت
      await this.logActivity({
        todoId: replyData.todoId,
        userId: replyData.userId,
        userEmail: replyData.userEmail,
        action: 'replied',
        description: `به کامنت پاسخ داد`,
        metadata: { 
          commentId: commentId,
          replyId: replyDocRef.id
        }
      })
      
      return replyDocRef.id
    } catch (error) {
      console.error('Error adding reply:', error)
      throw error
    }
  },

  // آپدیت کامنت
  async updateComment(commentId: string, content: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId)
      await updateDoc(commentRef, {
        content,
        updatedAt: Timestamp.now(),
        edited: true
      })

      // ثبت فعالیت
      const commentDoc = await getDocs(query(collection(db, 'comments'), where('__name__', '==', commentId)))
      if (!commentDoc.empty) {
        const commentData = commentDoc.docs[0].data()
        await this.logActivity({
          todoId: commentData.todoId,
          userId: commentData.userId,
          userEmail: commentData.userEmail,
          action: 'updated',
          description: `کامنت را ویرایش کرد`,
          metadata: { 
            commentId,
            content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          }
        })
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  // حذف کامنت
  async deleteComment(commentId: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId)
      
      // دریافت اطلاعات کامنت قبل از حذف
      const commentDoc = await getDocs(query(collection(db, 'comments'), where('__name__', '==', commentId)))
      if (!commentDoc.empty) {
        const commentData = commentDoc.docs[0].data()
        
        // حذف کامنت
        await deleteDoc(commentRef)
        
        // ثبت فعالیت
        await this.logActivity({
          todoId: commentData.todoId,
          userId: commentData.userId,
          userEmail: commentData.userEmail,
          action: 'deleted',
          description: `کامنت را حذف کرد`,
          metadata: { 
            commentId,
            content: commentData.content.substring(0, 100) + (commentData.content.length > 100 ? '...' : '')
          }
        })
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  // دریافت کامنت‌های یک کار
  async getTodoComments(todoId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, 'comments'),
        where('todoId', '==', todoId),
        where('parentId', '==', null), // فقط کامنت‌های اصلی
        orderBy('createdAt', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      const comments = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const commentData = doc.data()
          
          // دریافت پاسخ‌ها
          const repliesQuery = query(
            collection(db, 'comments'),
            where('parentId', '==', doc.id),
            orderBy('createdAt', 'asc')
          )
          const repliesSnapshot = await getDocs(repliesQuery)
          const replies = repliesSnapshot.docs.map(replyDoc => ({
            id: replyDoc.id,
            ...replyDoc.data(),
            createdAt: replyDoc.data().createdAt.toDate(),
            updatedAt: replyDoc.data().updatedAt.toDate()
          } as Comment))

          return {
            id: doc.id,
            ...commentData,
            createdAt: commentData.createdAt.toDate(),
            updatedAt: commentData.updatedAt.toDate(),
            replies
          } as Comment
        })
      )
      
      return comments
    } catch (error) {
      console.error('Error getting todo comments:', error)
      return []
    }
  },

  // اضافه کردن همکار
  async addCollaborator(collaborator: Omit<TodoCollaborator, 'id' | 'addedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'todoCollaborators'), {
        ...collaborator,
        addedAt: Timestamp.now()
      })
      
      // ثبت فعالیت
      await this.logActivity({
        todoId: collaborator.todoId,
        userId: collaborator.addedBy,
        userEmail: collaborator.userEmail,
        action: 'shared',
        description: `کار را با کاربر دیگر به اشتراک گذاشت`,
        metadata: { 
          collaboratorId: collaborator.userId,
          role: collaborator.role
        }
      })
      
      return docRef.id
    } catch (error) {
      console.error('Error adding collaborator:', error)
      throw error
    }
  },

  // دریافت همکاران یک کار
  async getTodoCollaborators(todoId: string): Promise<TodoCollaborator[]> {
    try {
      const q = query(
        collection(db, 'todoCollaborators'),
        where('todoId', '==', todoId),
        orderBy('addedAt', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt.toDate()
      } as TodoCollaborator))
    } catch (error) {
      console.error('Error getting todo collaborators:', error)
      return []
    }
  },

  // ثبت فعالیت
  async logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'activityLogs'), {
        ...activity,
        timestamp: Timestamp.now()
      })
      
      return docRef.id
    } catch (error) {
      console.error('Error logging activity:', error)
      throw error
    }
  },

  // دریافت فعالیت‌های یک کار
  async getTodoActivities(todoId: string): Promise<ActivityLog[]> {
    try {
      const q = query(
        collection(db, 'activityLogs'),
        where('todoId', '==', todoId),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      } as ActivityLog))
    } catch (error) {
      console.error('Error getting todo activities:', error)
      return []
    }
  }
}