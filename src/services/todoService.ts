import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Todo, TodoFilters } from '../types/todo'

export const todoService = {
  // ایجاد کار جدید
  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        ...todoData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  },

  // دریافت کار بر اساس ID
  async getTodoById(todoId: string): Promise<Todo | null> {
    try {
      const docRef = doc(db, 'todos', todoId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          dueDate: data.dueDate?.toDate(),
          completedAt: data.completedAt?.toDate(),
        } as Todo
      }
      
      return null
    } catch (error) {
      console.error('Error getting todo by id:', error)
      return null
    }
  },

  // دریافت کارهای کاربر
  async getUserTodos(userId: string, filters?: TodoFilters): Promise<Todo[]> {
    try {
      let q = query(
        collection(db, 'todos'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }

      if (filters?.priority) {
        q = query(q, where('priority', '==', filters.priority))
      }

      const querySnapshot = await getDocs(q)
      let todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      } as Todo))

      // فیلتر جستجو
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        todos = todos.filter(todo => 
          todo.title.toLowerCase().includes(searchTerm) ||
          todo.description?.toLowerCase().includes(searchTerm)
        )
      }

      return todos
    } catch (error) {
      console.error('Error getting user todos:', error)
      return []
    }
  },

  // آپدیت کار
  async updateTodo(todoId: string, updates: Partial<Todo>): Promise<void> {
    try {
      const todoRef = doc(db, 'todos', todoId)
      await updateDoc(todoRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  },

  // حذف کار
  async deleteTodo(todoId: string): Promise<void> {
    try {
      const todoRef = doc(db, 'todos', todoId)
      await deleteDoc(todoRef)
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  },

  // تغییر وضعیت
  async toggleTodoStatus(todoId: string, currentStatus: string): Promise<void> {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const todoRef = doc(db, 'todos', todoId)
      await updateDoc(todoRef, {
        status: newStatus,
        completedAt: newStatus === 'completed' ? Timestamp.now() : null,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error toggling todo status:', error)
      throw error
    }
  },

  // دریافت آمار کارها
  async getTodoStats(userId: string) {
    try {
      const todos = await this.getUserTodos(userId)
      
      const stats = {
        total: todos.length,
        completed: todos.filter(todo => todo.status === 'completed').length,
        pending: todos.filter(todo => todo.status === 'pending').length,
        inProgress: todos.filter(todo => todo.status === 'in-progress').length,
        overdue: todos.filter(todo => 
          todo.dueDate && todo.dueDate < new Date() && todo.status !== 'completed'
        ).length,
      }

      return stats
    } catch (error) {
      console.error('Error getting todo stats:', error)
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        overdue: 0,
      }
    }
  }
}