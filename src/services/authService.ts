import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../config/firebase'

export const authService = {
  // ورود کاربر
  async login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  // ثبت نام کاربر
  async register(email: string, password: string, displayName: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // آپدیت پروفایل کاربر
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName
      })
    }
    
    return result.user
  },

  // خروج کاربر
  async logout() {
    await signOut(auth)
  },

  // ارسال ایمیل تأیید
  async sendVerificationEmail() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  },

  // بازنشانی رمز عبور
  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  // آپدیت پروفایل
  async updateProfile(updates: { displayName?: string; photoURL?: string }) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates)
    }
  }
}