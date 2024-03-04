import { monitor } from "@colyseus/monitor"
import { WebSocketTransport } from "@colyseus/ws-transport"
import * as bodyParser from "body-parser"
import { RedisDriver, RedisPresence, Server, ServerOptions } from "colyseus"
import compression from "compression"
import cors from "cors"
import dotenv from "dotenv"
import express, { ErrorRequestHandler } from "express"
import basicAuth from "express-basic-auth"
import rateLimit from "express-rate-limit"
import admin from "firebase-admin"
import http from "http"
import { connect } from "mongoose"
import path from "path"
import { initTilemap } from "./core/design"
import ItemsStatistics from "./models/mongo-models/items-statistic"
import Meta from "./models/mongo-models/meta"
import PokemonsStatistics from "./models/mongo-models/pokemons-statistic"
import TitleStatistic from "./models/mongo-models/title-statistic"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "./models/precomputed"
import AfterGameRoom from "./rooms/after-game-room"
import CustomLobbyRoom from "./rooms/custom-lobby-room"
import GameRoom from "./rooms/game-room"
import PreparationRoom from "./rooms/preparation-room"
import { DungeonPMDO, SynergyTriggers } from "./types/Config"
import { Item } from "./types/enum/Item"
import { Pkm, PkmIndex } from "./types/enum/Pokemon"
import { logger } from "./utils/logger"

process.env.NODE_APP_INSTANCE
  ? dotenv.config({ path: path.join(__dirname, "../../../../../.env") })
  : dotenv.config()
// console.log(path.join(__dirname, "../../../../../.env"))
// console.log(process.env)

let port = Number(process.env.PORT) || 9000
if (process.env.NODE_APP_INSTANCE) {
  port = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE) // pm2 mode
}

admin.initializeApp({
  credential: admin.credential.cert({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectId: process.env.FIREBASE_PROJECT_ID!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
  })
})

const app = express()
const httpServer = http.createServer(app)

// compress all responses
app.use(compression())

const properties: ServerOptions = {
  transport: new WebSocketTransport({
    server: httpServer
  })
}

if (process.env.NODE_APP_INSTANCE) {
  properties.publicAddress = `localhost:${port}`
  properties.presence = new RedisPresence({ host: process.env.REDIS_URI })
  properties.driver = new RedisDriver({ host: process.env.REDIS_URI })
}
const gameServer = new Server(properties)

app.use(bodyParser.json())

const viewsSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "..", "..", "views", "index.html")
  : path.join(__dirname, "views", "index.html")
const clientSrc = __dirname.includes("server")
  ? path.join(__dirname, "..", "..", "client")
  : path.join(__dirname, "public", "dist", "client")
const apiSrc = __dirname.includes("server")
  ? path.resolve(__dirname, "..", "..", "..", "..", "api-v1", "api-doc.yaml")
  : path.resolve(__dirname, "api-v1", "api-doc.yaml")

/*
initialize({
  apiDoc: fs.readFileSync(apiSrc).toString(),
  app,
  operations: {
    getGameById: [
      function get(req: Request, res: Response) {
        OperationHandler.getGameById(req, res)
      }
    ],
    getGamesByName: [
      function get(req: Request, res: Response) {
        OperationHandler.getGamesByName(req, res)
      }
    ],
    getGamesByTime: [
      function get(req: Request, res: Response) {
        OperationHandler.getGamesByTime(req, res)
      }
    ],
    createGame: [
      function get(req: Request, res: Response) {
        OperationHandler.createGame(req, res)
      }
    ],
    getGameStatus: [
      function get(req: Request, res: Response) {
        OperationHandler.getGameStatus(req, res)
      }
    ]
  }
})
*/

app.use(((err, req, res, next) => {
  res.status(err.status).json(err)
}) as ErrorRequestHandler)

app.use(cors())
app.use(express.json())
app.use(express.static(clientSrc))

// set up rate limiter: maximum of five requests per minute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

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

// Room

gameServer.define("after-game", AfterGameRoom)
gameServer.define("lobby", CustomLobbyRoom)
gameServer.define("preparation", PreparationRoom).enableRealtimeListing()
gameServer.define("game", GameRoom).enableRealtimeListing()

// Start
async function main() {
  await connect(process.env.MONGO_URI!)
  gameServer.listen(port)
  logger.info(`Game server started, listening on port ${port}`)
}
main()
