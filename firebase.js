// Firebase configuración completa con autenticación Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// Configuración segura con variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validación de configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('❌ Configuración de Firebase incompleta. Verifica tu archivo .env');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth Functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const onAuthStateChange = (callback) => onAuthStateChanged(auth, callback);

// User Profile Functions
export const createUserProfile = async (user) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        bio: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  
  return userRef;
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

// Posts Functions with Security
export const createPost = async (postData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  
  const post = {
    ...postData,
    authorId: user.uid,
    authorName: user.displayName,
    authorPhoto: user.photoURL,
    createdAt: new Date(),
    likes: [],
    comments: []
  };
  
  return await addDoc(collection(db, 'posts'), post);
};

export const getPosts = (callback) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, callback);
};

export const updatePost = async (postId, updates) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) throw new Error('Publicación no encontrada');
  if (postSnap.data().authorId !== user.uid) throw new Error('No tienes permisos para editar esta publicación');
  
  return await updateDoc(postRef, {
    ...updates,
    updatedAt: new Date()
  });
};

export const deletePost = async (postId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) throw new Error('Publicación no encontrada');
  if (postSnap.data().authorId !== user.uid) throw new Error('No tienes permisos para eliminar esta publicación');
  
  return await deleteDoc(postRef);
};