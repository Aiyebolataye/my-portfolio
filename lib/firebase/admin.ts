import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app;

try {
  if (getApps().length) {
    app = getApps()[0];
  } else {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        app = initializeApp({ credential: cert(serviceAccount) });
      } catch (e) {
        console.error("Failed to parse service account key, using default app");
        app = initializeApp();
      }
    } else {
      app = initializeApp();
    }
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  app = getApps().length ? getApps()[0] : initializeApp();
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
