import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app: any;

function getApp() {
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }
  try {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key && key.trim().startsWith("{")) {
      try {
        const serviceAccount = JSON.parse(key);
        app = initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
        return app;
      } catch {}
    }
    const gkey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (gkey && gkey.trim().startsWith("{")) {
      try {
        const serviceAccount = JSON.parse(gkey);
        app = initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
        return app;
      } catch {}
    }
    app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
    return app;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    try {
      app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola" });
      return app;
    } catch {
      app = initializeApp();
      return app;
    }
  }
}

const appInstance = getApp();
export const adminAuth = getAuth(appInstance);
export const adminDb = getFirestore(appInstance);
export default appInstance;
