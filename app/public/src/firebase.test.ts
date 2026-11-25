import assert from "node:assert/strict"
import { test } from "node:test"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "../../config/server/firebase"

test("Firebase connects once to the emulator and rejects non-demo projects", async () => {
  const previousConfig = { ...FIREBASE_CONFIG }
  const previousUrl = process.env.FIREBASE_AUTH_EMULATOR_URL
  FIREBASE_CONFIG.apiKey = "local-demo-api-key"
  FIREBASE_CONFIG.projectId = "demo-test"
  FIREBASE_CONFIG.appId = "local-demo-app"
  process.env.FIREBASE_AUTH_EMULATOR_URL = "http://127.0.0.1:9099"

  const { initializeFirebase } = await import("./firebase")
  try {
    FIREBASE_CONFIG.projectId = "real-project"
    assert.throws(initializeFirebase, /demo- project ID/)
    assert.equal(firebase.apps.length, 0)

    FIREBASE_CONFIG.projectId = "demo-test"
    initializeFirebase()
    initializeFirebase()
    assert.equal(firebase.apps.length, 1)
    assert.equal(firebase.auth().emulatorConfig?.host, "127.0.0.1")
    assert.equal(firebase.auth().emulatorConfig?.port, 9099)
  } finally {
    await Promise.all(firebase.apps.map((app) => app?.delete()))
    Object.assign(FIREBASE_CONFIG, previousConfig)
    if (previousUrl === undefined) delete process.env.FIREBASE_AUTH_EMULATOR_URL
    else process.env.FIREBASE_AUTH_EMULATOR_URL = previousUrl
  }
})
