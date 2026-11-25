import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { FIREBASE_CONFIG } from "../../config"

export const authEmulatorUrl = process.env.FIREBASE_AUTH_EMULATOR_URL

export function initializeFirebase() {
  if (!firebase.apps.length) {
    if (authEmulatorUrl && !FIREBASE_CONFIG.projectId?.startsWith("demo-")) {
      throw new Error("The Firebase Auth emulator requires a demo- project ID")
    }
    firebase.initializeApp(FIREBASE_CONFIG)
    if (authEmulatorUrl) {
      firebase.auth().useEmulator(authEmulatorUrl)
    }
  }
}
