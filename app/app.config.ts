import { monitor } from "@colyseus/monitor"
import {
  defineRoom,
  defineServer,
  matchMaker,
  RedisDriver,
  RedisPresence,
  ServerOptions
} from "colyseus"
import cors from "cors"
import express, { ErrorRequestHandler } from "express"
import basicAuth from "express-basic-auth"
import admin from "firebase-admin"
import { UserRecord } from "firebase-admin/auth"
import helmet from "helmet"
import { connect } from "mongoose"
import path from "path"
import pkg from "../package.json"
import {
  MAX_CONCURRENT_PLAYERS_ON_SERVER,
  SynergyTriggers,
  USERNAME_REGEXP
} from "./config"
import { migrateShardsOfAltForms } from "./core/collection"
import { initTilemap } from "./core/design"
import { GameRecord } from "./models/colyseus-models/game-record"
import chatV2 from "./models/mongo-models/chat-v2"
import DetailledStatistic from "./models/mongo-models/detailled-statistic-v2"
import TitleStatistic from "./models/mongo-models/title-statistic"
import UserMetadata, {
  toUserMetadataJSON
} from "./models/mongo-models/user-metadata"
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
import { buyBoosterForUser, openBoosterForUser } from "./services/booster"
import { getLeaderboard } from "./services/leaderboard"
import {
  computeSynergyAverages,
  getDendrogram,
  getMetadata,
  getMetaItems,
  getMetaPokemons,
  getMetaRegions,
  getMetaV2
} from "./services/meta"
import {
  addTwitchBlacklistEntry,
  completeTwitchAccountVerification,
  getTwitchStreamsPayload,
  listTwitchBlacklist,
  removeTwitchBlacklistEntry,
  startTwitchAccountVerification,
  unlinkTwitchAccount
} from "./services/twitch"
import { ISuggestionUser, Role } from "./types"
import { DungeonPMDO } from "./types/enum/Dungeon"
import { Item } from "./types/enum/Item"
import { Pkm, PkmIndex } from "./types/enum/Pokemon"
import { logger } from "./utils/logger"

const clientSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "client")
  : path.join(__dirname, "public", "dist", "client")
const viewsSrc = path.join(clientSrc, "index.html")
const isDevelopment = process.env.MODE === "dev"
const setCacheControl = (res: any, maxAge: number = 86400) => {
  if (!isDevelopment) {
    res.set("Cache-Control", `max-age=${maxAge}`)
  } else {
    res.set("Cache-Control", "no-cache")
  }
}

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

export const server = defineServer({
  ...gameOptions,

  /* uWebSockets turned out to be unstable in production, so we are using the default transport
  2025-06-29T16:50:08: Error: Invalid access of closed uWS.WebSocket/SSLWebSocket.
  
  initializeTransport: function () {
    return new uWebSocketsTransport({
      compression: uWebSockets.SHARED_COMPRESSOR,
      idleTimeout: 0, // disable idle timeout
    })
  },*/

  rooms: {
    "after-game": defineRoom(AfterGameRoom),
    lobby: defineRoom(CustomLobbyRoom),
    preparation: defineRoom(PreparationRoom).enableRealtimeListing(),
    game: defineRoom(GameRoom).enableRealtimeListing()
  },

  express: (app) => {
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
              "https://*.doubleclick.net", // google ads, required for youtube embedded
              "https://*.githubusercontent.com",
              "http://raw.githubusercontent.com",
              "https://api.github.com",
              "https://*.youtube.com",
              "https://pokemon.darkatek7.com",
              "https://eternara.site",
              "https://www.penumbra-autochess.com",
              "https://pokechess.com.br",
              "https://uruwhy.online",
              "https://koala-pac.com",
              "https://pokev9.52kx.net",
              "https://www.john-auto-chess.com/"
            ],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              "https://apis.google.com",
              "https://*.googleapis.com",
              "https://*.doubleclick.net" // google ads, required for youtube embedded
            ],
            imgSrc: [
              "'self'",
              "data:",
              "blob:",
              "https://www.gstatic.com",
              "http://raw.githubusercontent.com",
              "https://static-cdn.jtvnw.net"
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

    app.get("/translations", (req, res) => {
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

    app.get("/titles", async (req, res) => {
      res.send(await TitleStatistic.find().sort({ name: 1 }).exec()) // Ensure a consistent order by sorting on a unique field
    })

    app.get("/meta/metadata", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getMetadata())
    })

    app.get("/meta/items", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getMetaItems())
    })

    app.get("/meta/pokemons", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getMetaPokemons())
    })

    app.get("/meta/regions", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getMetaRegions())
    })

    app.get("/meta-v2", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getMetaV2())
    })

    app.get("/dendrogram", async (req, res) => {
      // Set Cache-Control header for 24 hours (86400 seconds)
      setCacheControl(res, 86400)
      res.send(getDendrogram())
    })

    app.get("/meta/types", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const user = await UserMetadata.findOne({ uid: userAuth.uid })
      if (!user || user.role !== Role.ADMIN) {
        res.status(403).send("Unauthorized")
        return
      }

      res.send(computeSynergyAverages())
    })

    app.get("/tilemap/:map", async (req, res) => {
      try {
        if (
          !req.params.map ||
          !Object.values(DungeonPMDO).includes(req.params.map as DungeonPMDO)
        ) {
          return res.status(400).send({ error: "Invalid map parameter" })
        }
        const tilemap = initTilemap(req.params.map as DungeonPMDO)
        res.send(tilemap)
      } catch (error) {
        logger.error("Error generating tilemap", { error, map: req.params.map })
        res.status(500).send({ error: "Error generating tilemap" })
      }
    })

    app.get("/leaderboards", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      res.send(getLeaderboard())
    })

    app.get("/leaderboards/bots", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      res.send(getLeaderboard()?.botLeaderboard)
    })

    app.get("/leaderboards/elo", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      res.send(getLeaderboard()?.leaderboard)
    })

    app.get("/leaderboards/level", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      res.send(getLeaderboard()?.levelLeaderboard)
    })

    app.get("/leaderboards/event", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      res.send(getLeaderboard()?.eventLeaderboard)
    })

    app.get("/twitch/streams", async (req, res) => {
      setCacheControl(res, 120)
      res.send(getTwitchStreamsPayload())
    })

    app.post("/twitch/verify/start", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return

      try {
        const payload = await startTwitchAccountVerification(userAuth.uid)
        res.status(200).json(payload)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        logger.error("Error starting Twitch verification", { error: message })
        if (
          message.includes("not configured") ||
          message.includes("REDIRECT") ||
          message.includes("STATE_SECRET")
        ) {
          res.status(503).json({ error: message })
          return
        }
        res.status(400).json({ error: message })
      }
    })

    app.get("/auth/twitch/callback", async (req, res) => {
      const state = req.query.state?.toString()
      const code = req.query.code?.toString()
      const successRedirect =
        process.env.TWITCH_VERIFY_SUCCESS_REDIRECT || "/auth"
      const errorRedirect = process.env.TWITCH_VERIFY_ERROR_REDIRECT || "/auth"

      if (!state || !code) {
        return res.redirect(`${errorRedirect}?twitchVerify=missing_params`)
      }

      try {
        await completeTwitchAccountVerification(code, state)
        return res.redirect(`${successRedirect}?twitchVerify=success`)
      } catch (error) {
        const message =
          error instanceof Error
            ? encodeURIComponent(error.message)
            : "verification_failed"
        logger.error("Error completing Twitch verification", { error: message })
        return res.redirect(`${errorRedirect}?twitchVerify=${message}`)
      }
    })

    app.post("/twitch/verify/unlink", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return

      try {
        await unlinkTwitchAccount(userAuth.uid)
        res.status(200).send()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        if (message === "User not found") {
          res.status(404).json({ error: message })
          return
        }
        logger.error("Error unlinking Twitch verification", { error: message })
        res.status(500).json({ error: "Error unlinking Twitch account" })
      }
    })

    app.get("/game-history/:playerUid", async (req, res) => {
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
      const { playerUid } = req.params
      const { page = 1, gameMode } = req.query
      const limit = 10
      const skip = (Number(page) - 1) * limit
      const params: any = { playerId: playerUid }
      if (gameMode) {
        params.gameMode = gameMode
      }

      const stats = await DetailledStatistic.find(
        params,
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
      if (!isDevelopment) {
        res.set("Cache-Control", "no-cache")
      }
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

    app.get("/players", async (req, res) => {
      try {
        const searchTerm = req.query?.name?.toString().trim() || ""
        // Escape regex special chars to prevent injection/ReDoS
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

        const userAuth = await authUser(req, res)
        if (!userAuth) return
        const user = await UserMetadata.findOne({ uid: userAuth.uid })
        const showBanned =
          user?.role === Role.ADMIN || user?.role === Role.MODERATOR

        const users = await UserMetadata.find(
          {
            displayName: { $regex: `^${escapedTerm}` }, // ^ makes it a prefix match, enabling index use
            ...(showBanned ? {} : { banned: false })
          },
          [
            "uid",
            "elo",
            "displayName",
            "level",
            "avatar",
            ...(showBanned ? ["banned"] : [])
          ],
          {
            limit: 100,
            sort: { level: -1 },
            collation: { locale: "en", strength: 2 } // must match the index collation
          }
        )

        if (users) {
          const suggestions: Array<ISuggestionUser> = users.map((u) => {
            return {
              id: u.uid,
              elo: u.elo,
              name: u.displayName,
              level: u.level,
              avatar: u.avatar,
              banned: u.banned
            }
          })
          res.status(200).json(suggestions)
        }
      } catch (error) {
        logger.error(error)
        res.status(500).json({ error: "Error fetching players" })
      }
    })

    app.get("/bots", async (req, res) => {
      const approved =
        req.query.approved === "true"
          ? true
          : req.query.approved === "false"
            ? false
            : undefined
      const botsData = await fetchBotsList(approved, req.query.pkm?.toString())
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
        await migrateShardsOfAltForms(mongoUser) // TEMPORARY migration; to be removed in future
        if (!isDevelopment) {
          res.set("Cache-Control", "no-cache")
        }
        res.send(toUserMetadataJSON(mongoUser))
      } catch (error) {
        logger.error("Error fetching profile", error)
        res.status(500).send("Error fetching profile")
      }
    })

    app.post("/boosters/open", async (req, res) => {
      try {
        const userAuth = await authUser(req, res)
        if (!userAuth) return

        const result = await openBoosterForUser(userAuth.uid)
        if (!result) {
          res.status(409).json({ error: "No boosters available" })
          return
        }

        res.status(200).json({
          boosterContent: result.boosterContent,
          user: toUserMetadataJSON(result.userDoc)
        })
      } catch (error) {
        logger.error("Error opening booster", error)
        res.status(500).json({ error: "Error opening booster" })
      }
    })

    app.post("/boosters/buy", async (req, res) => {
      try {
        const userAuth = await authUser(req, res)
        if (!userAuth) return

        const index = req.body?.index
        if (!index || typeof index !== "string") {
          res.status(400).json({ error: "index is required" })
          return
        }

        const result = await buyBoosterForUser(userAuth.uid, index)
        if (!result) {
          res.status(409).json({ error: "Not enough dust or invalid pokemon" })
          return
        }

        res.status(200).json({
          user: toUserMetadataJSON(result.userDoc)
        })
      } catch (error) {
        logger.error("Error buying booster", error)
        res.status(500).json({ error: "Error buying booster" })
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

    app.get("/moderation/chat-search", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const user = await UserMetadata.findOne({ uid: userAuth.uid })
      if (!user || (user.role !== Role.ADMIN && user.role !== Role.MODERATOR)) {
        res.status(403).send("Unauthorized")
        return
      }
      const query = req.query.query?.toString().trim()
      if (!query || query.length < 2) {
        return res
          .status(400)
          .json({ error: "Query must be at least 2 characters" })
      }
      // Escape regex special chars to prevent injection/ReDoS
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      try {
        const messages = await chatV2
          .find({ payload: { $regex: escapedQuery } }, undefined, {
            limit: 50,
            sort: { time: -1 }
          })
          .lean()
        res.status(200).json(messages)
      } catch (error) {
        logger.error("Error searching chat messages", error)
        res.status(500).json({ error: "Error searching messages" })
      }
    })

    app.get("/moderation/twitch-blacklist", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const user = await UserMetadata.findOne({ uid: userAuth.uid })
      if (!user || (user.role !== Role.ADMIN && user.role !== Role.MODERATOR)) {
        res.status(403).send("Unauthorized")
        return
      }

      try {
        const blacklist = await listTwitchBlacklist()
        res.status(200).json(blacklist)
      } catch (error) {
        logger.error("Error listing twitch blacklist", error)
        res.status(500).json({ error: "Error listing twitch blacklist" })
      }
    })

    app.post("/moderation/twitch-blacklist", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const user = await UserMetadata.findOne({ uid: userAuth.uid })
      if (!user || (user.role !== Role.ADMIN && user.role !== Role.MODERATOR)) {
        res.status(403).send("Unauthorized")
        return
      }

      const streamerLogin = req.body?.streamerLogin
      const reason = req.body?.reason

      if (!streamerLogin || typeof streamerLogin !== "string") {
        res.status(400).json({ error: "streamerLogin is required" })
        return
      }

      if (reason !== undefined && typeof reason !== "string") {
        res.status(400).json({ error: "reason must be a string" })
        return
      }

      if (typeof reason === "string" && reason.length > 300) {
        res.status(400).json({ error: "reason is too long" })
        return
      }

      try {
        await addTwitchBlacklistEntry(streamerLogin, user.displayName, reason)
        logger.info(
          `${user.displayName} added twitch blacklist entry for ${streamerLogin}`
        )
        res.status(201).send()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        if (message === "Streamer is already blacklisted") {
          res.status(409).json({ error: message })
          return
        }
        if (message === "Invalid streamerLogin") {
          res.status(400).json({ error: message })
          return
        }
        logger.error("Error adding twitch blacklist entry", error)
        res.status(500).json({ error: "Error adding twitch blacklist entry" })
      }
    })

    app.delete(
      "/moderation/twitch-blacklist/:streamerLogin",
      async (req, res) => {
        const userAuth = await authUser(req, res)
        if (!userAuth) return
        const user = await UserMetadata.findOne({ uid: userAuth.uid })
        if (
          !user ||
          (user.role !== Role.ADMIN && user.role !== Role.MODERATOR)
        ) {
          res.status(403).send("Unauthorized")
          return
        }

        try {
          const wasDeleted = await removeTwitchBlacklistEntry(
            req.params.streamerLogin
          )
          if (!wasDeleted) {
            res.status(404).json({ error: "Streamer is not blacklisted" })
            return
          }
          logger.info(
            `${user.displayName} removed twitch blacklist entry for ${req.params.streamerLogin}`
          )
          res.status(200).send()
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error"
          if (message === "Invalid streamerLogin") {
            res.status(400).json({ error: message })
            return
          }
          logger.error("Error removing twitch blacklist entry", error)
          res
            .status(500)
            .json({ error: "Error removing twitch blacklist entry" })
        }
      }
    )

    app.post("/moderation/rename-account", async (req, res) => {
      const userAuth = await authUser(req, res)
      if (!userAuth) return
      const caller = await UserMetadata.findOne({ uid: userAuth.uid })
      if (
        !caller ||
        (caller.role !== Role.ADMIN && caller.role !== Role.MODERATOR)
      ) {
        res.status(403).send("Unauthorized")
        return
      }
      const { uid, newName } = req.body
      if (!uid || typeof uid !== "string") {
        return res.status(400).json({ error: "uid is required" })
      }
      if (!newName || typeof newName !== "string") {
        return res.status(400).json({ error: "newName is required" })
      }
      if (!USERNAME_REGEXP.test(newName)) {
        return res.status(400).json({ error: "Invalid name format" })
      }
      try {
        const target = await UserMetadata.findOne({ uid })
        if (!target) return res.status(404).json({ error: "User not found" })
        target.displayName = newName
        await target.save()
        logger.info(
          `${userAuth.displayName} renamed account ${uid} to ${newName}`
        )
        res.status(200).json({ displayName: newName })
      } catch (error) {
        logger.error("Error renaming account", error)
        res.status(500).json({ error: "Error renaming account" })
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
