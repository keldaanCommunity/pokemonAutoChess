import path from "path"
import { monitor } from "@colyseus/monitor"
import config from "@colyseus/tools"
import { RedisDriver, RedisPresence } from "colyseus"
import cors from "cors"
import express, { ErrorRequestHandler } from "express"
import basicAuth from "express-basic-auth"
import admin from "firebase-admin"
import { connect } from "mongoose"
import { initTilemap } from "./core/design"
import ItemsStatistics from "./models/mongo-models/items-statistic"
import Meta from "./models/mongo-models/meta"
import PokemonsStatistics from "./models/mongo-models/pokemons-statistic-v2"
import TitleStatistic from "./models/mongo-models/title-statistic"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "./models/precomputed/precomputed-types"
import AfterGameRoom from "./rooms/after-game-room"
import CustomLobbyRoom from "./rooms/custom-lobby-room"
import GameRoom from "./rooms/game-room"
import PreparationRoom from "./rooms/preparation-room"
import { Title } from "./types"
import { SynergyTriggers } from "./types/Config"
import { DungeonPMDO } from "./types/enum/Dungeon"
import { Item } from "./types/enum/Item"
import { Pkm, PkmIndex } from "./types/enum/Pokemon"
import { logger } from "./utils/logger"

const viewsSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "..", "..", "views", "index.html")
  : path.join(__dirname, "views", "index.html")
const clientSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "client")
  : path.join(__dirname, "public", "dist", "client")

/**
 * Import your Room files
 */

let gameOptions = {}

if (process.env.NODE_APP_INSTANCE) {
  const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
  const port = 2567 + processNumber
  gameOptions = {
    presence: new RedisPresence(process.env.REDIS_URI),
    driver: new RedisDriver(process.env.REDIS_URI),
    publicAddress: `${process.env.SERVER_NAME}/${port}`
  }

  logger.info(gameOptions)
}

export default config({
  options: gameOptions,
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

    app.get("/pokemons", (req, res) => {
      res.send(Pkm)
    })

    app.get("/title-names", (req, res) => {
      res.send(Title)
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
      res.send(await TitleStatistic.find())
    })

    app.get("/meta/items", async (req, res) => {
      res.send(await ItemsStatistics.find())
    })

    app.get("/meta/pokemons", async (req, res) => {
      res.send(await PokemonsStatistics.find())
    })

    app.get("/tilemap/:map", async (req, res) => {
      const tilemap = initTilemap(req.params.map as DungeonPMDO)
      res.send(tilemap)
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
    connect(process.env.MONGO_URI!)
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
      })
    })
  }
})
