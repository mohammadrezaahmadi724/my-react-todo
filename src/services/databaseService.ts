import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const databaseService = {
  // ایجاد سند جدید
  async create(collectionName: string, data: any) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  },

  // خواندن سند بر اساس ID
  async read(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    
    return null
  },

  // آپدیت سند
  async update(collectionName: string, id: string, data: any) {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    })
  },

  // حذف سند
  async delete(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  },

  // دریافت تمام اسناد یک مجموعه
  async getAll(collectionName: string, filters?: any, sortBy?: string) {
    let q = query(collection(db, collectionName))
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          q = query(q, where(key, '==', value))
        }
      })
    }
    
    if (sortBy) {
      q = query(q, orderBy(sortBy, 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // جستجو در مجموعه
  async search(collectionName: string, field: string, value: string) {
    const q = query(
      collection(db, collectionName),
      where(field, '>=', value),
      where(field, '<=', value + '\uf8ff'),
      limit(10)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // حذف دسته‌ای
  async batchDelete(collectionName: string, ids: string[]) {
    const batch = writeBatch(db)
    
    ids.forEach(id => {
      const docRef = doc(db, collectionName, id)
      batch.delete(docRef)
    })
    
    await batch.commit()
  }
}