/**
 * Training mode entry point.
 *
 * Usage:
 *   npx ts-node app/training/index.ts
 *
 * This starts a headless training server without any Colyseus/Firebase
 * dependencies. The Python PPO trainer connects to the HTTP API.
 *
 * Environment variables:
 *   TRAINING_PORT - HTTP port (default: 9100)
 *   MONGO_URI     - MongoDB connection string (needed for bot definitions)
 */
import { Encoder } from "@colyseus/schema"
import { connect } from "mongoose"
import { startTrainingServer } from "./training-server"
import { logger } from "../utils/logger"

// Increase buffer for schema encoding (same as main server)
Encoder.BUFFER_SIZE = 512 * 1024

async function main() {
  const mongoUri =
    process.env.MONGO_URI ??
    process.env.MONGO_URI ??
    "mongodb://localhost:27017/pokemon-auto-chess"

  logger.info("Connecting to MongoDB...")
  try {
    await connect(mongoUri)
    logger.info("Connected to MongoDB")
  } catch (err) {
    logger.warn(
      "Could not connect to MongoDB. Bot opponents will not be available.",
      err
    )
    logger.warn("Starting with empty bot pool - games may have fewer opponents.")
  }

  logger.info("Starting training server...")
  await startTrainingServer()
}

main().catch((err) => {
  logger.error("Fatal error:", err)
  process.exit(1)
})
