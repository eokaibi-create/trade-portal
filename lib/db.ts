import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

// Types
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  moq: number;
  oemAvailable: boolean;
  status: 'active' | 'inactive';
  images: string[];
  specifications: Record<string, string>;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  visible: boolean;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  notes: string;
  status: 'new' | 'contacted' | 'negotiating' | 'closed';
  createdAt: Date;
}

export interface Inquiry {
  id: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  productId: string | null;
  productName: string;
  message: string;
  status: 'new' | 'reviewed' | 'replied';
  createdAt: Date;
}

export interface Content {
  id: string;
  key: string;
  titleEn: string;
  titleZh: string;
  contentEn: string;
  contentZh: string;
  updatedAt: Date;
}

// Products
export async function getProducts(): Promise<Product[]> {
  try {
    const ref = collection(db, 'products');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Product> {
  const ref = collection(db, 'products');
  const now = Timestamp.now();
  const docRef = await addDoc(ref, {
    ...product,
    views: 0,
    createdAt: now,
    updatedAt: now
  });
  return { id: docRef.id, ...product, views: 0, createdAt: now.toDate(), updatedAt: now.toDate() };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'products', id), { ...updates, updatedAt: Timestamp.now() });
    return true;
  } catch { return false; }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch { return false; }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const ref = collection(db, 'categories');
    const q = query(ref, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Category[];
  } catch { return []; }
}

export async function addCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
  const ref = collection(db, 'categories');
  const docRef = await addDoc(ref, { ...category, createdAt: Timestamp.now() });
  return { id: docRef.id, ...category, createdAt: new Date() };
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'categories', id), updates);
    return true;
  } catch { return false; }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'categories', id));
    return true;
  } catch { return false; }
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
  try {
    const ref = collection(db, 'customers');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Customer[];
  } catch { return []; }
}

export async function addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
  const ref = collection(db, 'customers');
  const docRef = await addDoc(ref, { ...customer, createdAt: Timestamp.now() });
  return { id: docRef.id, ...customer, createdAt: new Date() };
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'customers', id), updates);
    return true;
  } catch { return false; }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'customers', id));
    return true;
  } catch { return false; }
}

// Inquiries
export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const ref = collection(db, 'inquiries');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Inquiry[];
  } catch { return []; }
}

export async function addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> {
  const ref = collection(db, 'inquiries');
  const docRef = await addDoc(ref, { ...inquiry, createdAt: Timestamp.now() });
  return { id: docRef.id, ...inquiry, createdAt: new Date() };
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'inquiries', id), updates);
    return true;
  } catch { return false; }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'inquiries', id));
    return true;
  } catch { return false; }
}

// Content
export async function getContent(): Promise<Content[]> {
  try {
    const ref = collection(db, 'content');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Content[];
  } catch { return []; }
}

export async function updateContent(key: string, updates: Partial<Content>): Promise<boolean> {
  try {
    const ref = doc(db, 'content', key);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
    } else {
      await addDoc(collection(db, 'content'), { key, ...updates, updatedAt: Timestamp.now() });
    }
    return true;
  } catch { return false; }
}

// Initialize default data
export async function initializeDatabase(): Promise<void> {
  const categories = await getCategories();
  if (categories.length === 0) {
    const defaultCategories = [
      { name: 'Electronics', parentId: null, order: 1, visible: true },
      { name: 'Machinery', parentId: null, order: 2, visible: true },
      { name: 'Textiles', parentId: null, order: 3, visible: true },
      { name: 'Agricultural Products', parentId: null, order: 4, visible: true }
    ];
    for (const cat of defaultCategories) {
      await addCategory(cat);
    }
  }
}
