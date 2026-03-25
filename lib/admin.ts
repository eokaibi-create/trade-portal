import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'eokaibi@gmail.com';
const ADMIN_PASSWORD = '12138Ekke';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'staff';
  name: string;
  createdAt: Date;
}

export async function initializeAdmin(): Promise<void> {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', 'main'));
    if (!adminDoc.exists()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        await setDoc(doc(db, 'admins', 'main'), {
          uid: userCredential.user.uid,
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Admin',
          createdAt: serverTimestamp()
        });
      } catch (createError: any) {
        if (createError.code === 'auth/email-already-in-use') {
          const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          await setDoc(doc(db, 'admins', 'main'), {
            uid: userCredential.user.uid,
            email: ADMIN_EMAIL,
            role: 'admin',
            name: 'Admin',
            createdAt: serverTimestamp()
          });
          await firebaseSignOut(auth);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const adminDoc = await getDoc(doc(db, 'admins', 'main'));
    
    if (adminDoc.exists() && adminDoc.data().uid === userCredential.user.uid) {
      return { success: true };
    } else {
      await firebaseSignOut(auth);
      return { success: false, error: 'Access denied' };
    }
  } catch (error: any) {
    let errorMessage = 'Login failed';
    switch (error.code) {
      case 'auth/invalid-email': errorMessage = 'Invalid email'; break;
      case 'auth/user-not-found': errorMessage = 'Account not found'; break;
      case 'auth/wrong-password': errorMessage = 'Wrong password'; break;
      case 'auth/invalid-credential': errorMessage = 'Invalid credentials'; break;
    }
    return { success: false, error: errorMessage };
  }
}

export async function adminLogout(): Promise<void> {
  await firebaseSignOut(auth);
}

export function getCurrentAdmin(callback: (admin: AdminUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const adminDoc = await getDoc(doc(db, 'admins', 'main'));
      if (adminDoc.exists() && adminDoc.data().uid === user.uid) {
        callback({
          uid: user.uid,
          email: user.email || '',
          role: adminDoc.data().role || 'admin',
          name: adminDoc.data().name || 'Admin',
          createdAt: adminDoc.data().createdAt?.toDate() || new Date()
        });
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
