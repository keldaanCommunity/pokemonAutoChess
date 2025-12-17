import dotenv from "dotenv"
import admin from "firebase-admin"
import { connect } from "mongoose"
import UserMetadata from "../app/models/mongo-models/user-metadata"

async function deleteInactiveUsers() {
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
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    let deletedCount = 0
    let totalProcessed = 0
    let nextPageToken: string | undefined

    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken)

      for (const userRecord of listUsersResult.users) {
        const lastSignIn = userRecord.metadata.lastSignInTime
        if (!lastSignIn || new Date(lastSignIn) < twoYearsAgo) {
          await admin.auth().deleteUser(userRecord.uid)
          await UserMetadata.deleteOne({ uid: userRecord.uid })
          deletedCount++
        }
        totalProcessed++
      }

      console.log(`Processed: ${totalProcessed} | Deleted: ${deletedCount}`)
      nextPageToken = listUsersResult.pageToken
    } while (nextPageToken)

    console.log(`Total users deleted: ${deletedCount}`)
    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

deleteInactiveUsers()
