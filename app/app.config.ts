import { monitor } from "@colyseus/monitor"
import config from "@colyseus/tools"
import {
  matchMaker,
  RedisDriver,
  RedisPresence,
  ServerOptions
} from "colyseus"
import cors from "cors"
import express, { ErrorRequestHandler } from "express"
import basicAuth from "express-basic-auth"
import admin from "firebase-admin"
import { UserRecord } from "firebase-admin/lib/auth/user-record"
import helmet from "helmet"
import { connect } from "mongoose"
import path from "path"
import pkg from "../package.json"
import { initTilemap } from "./core/design"
import { GameRecord } from "./models/colyseus-models/game-record"
import chatV2 from "./models/mongo-models/chat-v2"
import DetailledStatistic from "./models/mongo-models/detailled-statistic-v2"
import Meta from "./models/mongo-models/meta"
import TitleStatistic from "./models/mongo-models/title-statistic"
import UserMetadata, { toUserMetadataJSON } from "./models/mongo-models/user-metadata"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "./models/precomputed/precomputed-types"
import AfterGameRoom from "./rooms/after-game-room"
import CustomLobbyRoom from "./rooms/custom-lobby-room"
import GameRoom from "./rooms/game-room"
import PreparationRoom from "./rooms/preparation-room"
import {
  addBotToDatabase,
  approveBot,
  deleteBotFromDatabase,
  fetchBot,
  fetchBotsList
} from "./services/bots"
import { getLeaderboard } from "./services/leaderboard"
import { getMetadata, getMetaItems, getMetaPokemons } from "./services/meta"
import { Role } from "./types"
import {
  MAX_CONCURRENT_PLAYERS_ON_SERVER,
  MAX_POOL_CONNECTIONS_SIZE,
  SynergyTriggers
} from "./types/Config"
import { DungeonPMDO } from "./types/enum/Dungeon"
import { Item } from "./types/enum/Item"
import { Pkm, PkmIndex } from "./types/enum/Pokemon"
import { logger } from "./utils/logger"

const clientSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "client")
  : path.join(__dirname, "public", "dist", "client")
const viewsSrc = path.join(clientSrc, "index.html")

/**
 * Import your Room files
 */

let gameOptions: ServerOptions = {}

if (process.env.NODE_APP_INSTANCE) {
  const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
  const port = (Number(process.env.PORT) || 2569) + processNumber
  gameOptions = {
    presence: new RedisPresence(process.env.REDIS_URI),
    driver: new RedisDriver(process.env.REDIS_URI),
    publicAddress: `${port}.${process.env.SERVER_NAME}`,
    selectProcessIdToCreateRoom: async function (
      roomName: string,
      clientOptions: any
    ) {
      if (roomName === "lobby") {
        const lobbies = await matchMaker.query({ name: "lobby" })
        if (lobbies.length !== 0) {
          throw "Attempt to create one lobby"
        }
      }
      const stats = await matchMaker.stats.fetchAll()
      stats.sort((p1, p2) =>
        p1.roomCount !== p2.roomCount
          ? p1.roomCount - p2.roomCount
          : p1.ccu - p2.ccu
      )
      if (stats.length === 0) {
        throw "No process available"
      } else {
        return stats[0]?.processId
      }
    }
  }
  gameOptions.presence?.setMaxListeners(100) // extend max listeners to avoid memory leak warning
}

/*if (process.env.MODE === "dev") {
  gameOptions.devMode = true
}*/

export default config({
  options: gameOptions,

  /* uWebSockets turned out to be unstable in production, so we are using the default transport
  2025-06-29T16:50:08: Error: Invalid access of closed uWS.WebSocket/SSLWebSocket.
  
  initializeTransport: function () {
    return new uWebSocketsTransport({
      compression: uWebSockets.SHARED_COMPRESSOR,
      idleTimeout: 0, // disable idle timeout
    })
  },*/

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("after-game", AfterGameRoom)
    gameServer.define("lobby", CustomLobbyRoom)
    gameServer.define("preparation", PreparationRoom).enableRealtimeListing()
    gameServer.define("game", GameRoom).enableRealtimeListing()
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */

    app.use(
      helmet({
        crossOriginOpenerPolicy: false, // required for firebase auth
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [
              "'self'",
              "https://*.pokemon-auto-chess.com",
              "wss://*.pokemon-auto-chess.com",
              "https://*.firebaseapp.com",
              "https://apis.google.com",
              "https://*.googleapis.com",
              "https://*.githubusercontent.com",
              "http://raw.githubusercontent.com",
              "https://*.youtube.com",
              "https://pokemon.darkatek7.com",
              "https://eternara.site",
              "https://www.penumbra-autochess.com",
              "https://pokechess.com.br",
              "https://uruwhy.online",
              "https://koala-pac.com",
              "https://pokev9.52kx.net"
            ],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              "https://apis.google.com",
              "https://*.googleapis.com"
            ],
            imgSrc: [
              "'self'",
              "data:",
              "blob:",
              "https://www.gstatic.com",
              "http://raw.githubusercontent.com"
            ]
          }
        }
      })
    )

    app.use(((err, req, res, next) => {
      res.status(err.status).json(err)
    }) as ErrorRequestHandler)

    app.use(cors())
    app.use(express.json())
    app.use(express.static(clientSrc))

    app.get("/", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/auth", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/lobby", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/preparation", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/game", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/after", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/bot-builder", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/bot-admin", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/sprite-viewer", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/map-viewer", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/gameboy", (req, res) => {
      res.sendFile(viewsSrc)
    })

    app.get("/pokemons", (req, res) => {
      res.send(Pkm)
    })

    app.get("/pokemons-index", (req, res) => {
      res.send(PkmIndex)
    })

    app.get("/types", (req, res) => {
      res.send(PRECOMPUTED_POKEMONS_PER_TYPE)
    })

    app.get("/items", (req, res) => {
      res.send(Item)
    })

    app.get("/types-trigger", (req, res) => {
      res.send(SynergyTriggers)
    })

    app.get("/meta", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(
        await Meta.find({}, [
          "cluster_id",
          "count",
          "ratio",
          "winrate",
          "mean_rank",
          "types",
          "pokemons",
          "x",
          "y"
        ])
      )
    })

    app.get("/titles", async (req, res) => {
      res.send(await TitleStatistic.find().sort({ name: 1 }).exec()) // Ensure a consistent order by sorting on a unique field
    })

    app.get("/meta/metadata", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      res.set("Cache-Control", "max-age=86400")
      res.send(getMetadata())
    })

    app.get("/meta/items", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      res.set("Cache-Control", "max-age=86400")
      res.send(getMetaItems())
    })

    app.get("/meta/pokemons", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      res.set("Cache-Control", "max-age=86400")
      res.send(getMetaPokemons())
    })

    app.get("/tilemap/:map", async (req, res) => {
      const tilemap = initTilemap(req.params.map as DungeonPMDO)
      res.send(tilemap)
    })

    app.get("/leaderboards", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(getLeaderboard())
    })

    app.get("/leaderboards/bots", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(getLeaderboard()?.botLeaderboard)
    })

    app.get("/leaderboards/elo", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(getLeaderboard()?.leaderboard)
    })

    app.get("/leaderboards/level", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(getLeaderboard()?.levelLeaderboard)
    })

    app.get("/leaderboards/event", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      res.send(getLeaderboard()?.eventLeaderboard)
    })

    app.get("/game-history/:playerUid", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      const { playerUid } = req.params
      const { page = 1 } = req.query
      const limit = 10
      const skip = (Number(page) - 1) * limit

      const stats = await DetailledStatistic.find(
        { playerId: playerUid },
        ["pokemons", "time", "rank", "elo", "gameMode"],
        { limit: limit, skip: skip, sort: { time: -1 } }
      )
      if (stats) {
        const records = stats.map(
          (record) =>
            new GameRecord(
              record.time,
              record.rank,
              record.elo,
              record.pokemons,
              record.gameMode
            )
        )

        // Return the records as the response
        return res.status(200).json(records)
      }

      // If no records found, return an empty array
      return res.status(200).json([])
    })

    app.get("/chat-history/:playerUid", async (req, res) => {
      res.set("Cache-Control", "no-cache")
      const { playerUid } = req.params
      const { page = 1 } = req.query
      const limit = 30
      const skip = (Number(page) - 1) * limit
      const messages = await chatV2.find({ authorId: playerUid }, undefined, {
        limit: limit,
        skip: skip,
        sort: { time: -1 }
      })
      return res.status(200).json(messages ?? [])
    })

    app.get("/bots", async (req, res) => {
      const botsData = await fetchBotsList(
        req.query.approved === "true"
          ? true
          : req.query.approved === "false"
            ? false
            : undefined
      )
      res.send(botsData)
    })

    app.get("/bots/:id", async (req, res) => {
      res.send(await fetchBot(req.params.id))
    })

    const authUser = async (req, res): Promise<UserRecord | null> => {
      let user
      try {
        //get header Authorization
        const authHeader = req.headers.authorization
        if (!authHeader) throw new Error("Unauthorized")
        const token = authHeader.split(" ")[1]
        if (!token) throw new Error("Unauthorized")
        // get user from firebase
        const decodedToken = await admin.auth().verifyIdToken(token)
        user = await admin.auth().getUser(decodedToken.uid)
        if (!user || !user.displayName) throw new Error("Unauthorized")
        return user
      } catch (error) {
        res.status(401).send(error)
        return null
      }
    }

    app.get("/profile", async (req, res) => {
      try {
        const userAuth = await authUser(req, res)
        if (!userAuth) return
        const mongoUser = await UserMetadata.findOne({ uid: userAuth.uid })
        if (!mongoUser) return res.status(404).send("User not found")
        res.send(toUserMetadataJSON(mongoUser))
      } catch (error) {
        logger.error("Error fetching profile", error)
        res.status(500).send("Error fetching profile")
      }
    })

    app.post("/bots", async (req, res) => {
      try {
        const userAuth = await authUser(req, res)
        if (!userAuth) return
        const user = await UserMetadata.findOne({ uid: userAuth.uid })
        if (!user) return
        const bot = req.body
        bot.author = user.displayName
        const botAdded = addBotToDatabase(bot)
        res.status(201).send(botAdded)
      } catch (error) {
        logger.error("Error submitting bot", error)
        res.status(500).send("Error submitting bot")
      }
    })

    app.delete("/bots/:id", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const user = await UserMetadata.findOne({ uid: userAuth.uid })
      if (
        !user ||
        (user.role !== Role.BOT_MANAGER && user.role !== Role.ADMIN)
      ) {
        res.status(403).send("Unauthorized")
        return
      }

      try {
        const deleteResult = await deleteBotFromDatabase(req.params.id, user)
        res.status(deleteResult.deletedCount > 0 ? 200 : 404).send()
      } catch (error) {
        logger.error("Error deleting bot", error)
        res.status(500).send("Error deleting bot")
      }
    })

    app.post("/bots/:id/approve", async (req, res) => {
      const userRecord = await authUser(req, res)
      if (!userRecord) return
      const user = await UserMetadata.findOne({ uid: userRecord.uid })
      if (
        !user ||
        (user.role !== Role.BOT_MANAGER && user.role !== Role.ADMIN)
      ) {
        res.status(403).send("Unauthorized")
        return
      }

      try {
        const approved = req.body.approved
        const updateResult = await approveBot(req.params.id, approved, user)
        if (updateResult.modifiedCount === 0) {
          res.status(404).send("Bot not found")
          return
        }
        res.status(200).send()
      } catch (error) {
        logger.error("Error approving bot", error)
        res.status(500).send("Error approving bot")
      }
    })

    app.get("/status", async (req, res) => {
      const ccu = await matchMaker.stats.getGlobalCCU()
      const version = pkg.version
      res.send({ ccu, maxCcu: MAX_CONCURRENT_PLAYERS_ON_SERVER, version })
    })

    const basicAuthMiddleware = basicAuth({
      // list of users and passwords
      users: {
        admin: process.env.ADMIN_PASSWORD
          ? process.env.ADMIN_PASSWORD
          : "Default Admin Password"
      },
      challenge: true
    })

    app.use("/colyseus", basicAuthMiddleware, monitor())

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", monitor())
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
    connect(process.env.MONGO_URI!, {
      maxPoolSize: MAX_POOL_CONNECTIONS_SIZE,
      socketTimeoutMS: 45000
    })
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
      })
    })
  }
})
