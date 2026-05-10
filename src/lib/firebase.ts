import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// In AI Studio, this file is created after set_up_firebase succeeds.
// We use a dummy config if the file is missing to prevent build errors.
const dummyConfig = {
  apiKey: "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

let firebaseConfig = dummyConfig;
let hasConfig = false;

try {
  // @ts-ignore
  const config = import.meta.glob('../../firebase-applet-config.json', { eager: true, import: 'default' });
  const keys = Object.keys(config);
  if (keys.length > 0) {
    firebaseConfig = config[keys[0]] as any;
    hasConfig = true;
  }
} catch (e) {
  console.warn('Firebase config not found. Please accept Firebase terms in the UI.');
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => {
  if (!hasConfig) {
    alert('Fadlan sug inta Firebase laga diyaarinayo (Accept terms in UI).');
    return Promise.reject('No config');
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => signOut(auth);

// Test connection as required by integration instructions
async function testConnection() {
  if (!hasConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === "placeholder") return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
