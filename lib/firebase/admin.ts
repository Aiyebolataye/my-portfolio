import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app;

if (getApps().length) {
  app = getApps()[0];
} else {
  try {
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfolio-aiyebola",
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    app = initializeApp();
  }
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
