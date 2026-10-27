import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app;

if (getApps().length) {
  app = getApps()[0];
} else {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        app = initializeApp({ credential: cert(serviceAccount) });
      } catch (e) {
        console.error("Failed to parse service account key");
        app = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    } else {
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    app = initializeApp();
  }
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
