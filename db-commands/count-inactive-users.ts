import dotenv from "dotenv"
import admin from "firebase-admin"
import { connect } from "mongoose"

async function countInactiveUsers() {
  dotenv.config()
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
      })
    })

    await connect(process.env.MONGO_URI!)

    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 1)

    let inactiveCount = 0
    let totalProcessed = 0
    let nextPageToken: string | undefined

    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken)

      for (const userRecord of listUsersResult.users) {
        const lastSignIn = userRecord.metadata.lastSignInTime
        if (!lastSignIn || new Date(lastSignIn) < twoYearsAgo) {
          inactiveCount++
        }
        totalProcessed++
      }

      console.log(`Processed: ${totalProcessed} | Inactive: ${inactiveCount}`)
      nextPageToken = listUsersResult.pageToken
    } while (nextPageToken)

    console.log(`Users inactive for 2+ years: ${inactiveCount}`)
    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

countInactiveUsers()
