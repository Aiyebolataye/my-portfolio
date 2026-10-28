import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app;

if (getApps().length) {
  app = getApps()[0];
} else {
  try {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key && key.trim().startsWith("{")) {
      try {
        const serviceAccount = JSON.parse(key);
        app = initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
      } catch {
        app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS.trim().startsWith("{")) {
      try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        app = initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
      } catch {
        app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
      }
    } else {
      app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    try {
      app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
    } catch {
      app = initializeApp();
    }
  }
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
