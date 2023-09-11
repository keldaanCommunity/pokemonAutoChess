import dotenv from "dotenv"
import path from "path"
import http from "http"
import express, { ErrorRequestHandler } from "express"
import cors from "cors"
import { RedisDriver, RedisPresence, Server, ServerOptions } from "colyseus"
import { monitor } from "@colyseus/monitor"
import basicAuth from "express-basic-auth"
import { WebSocketTransport } from "@colyseus/ws-transport"
import * as bodyParser from "body-parser"
import admin from "firebase-admin"
import PRECOMPUTED_TYPE_POKEMONS_ALL from "./models/precomputed/type-pokemons-all.json"
import AfterGameRoom from "./rooms/after-game-room"
import CustomLobbyRoom from "./rooms/custom-lobby-room"
import PreparationRoom from "./rooms/preparation-room"
import GameRoom from "./rooms/game-room"
import { Pkm } from "./types/enum/Pokemon"
import { Item } from "./types/enum/Item"
import { SynergyTriggers } from "./types/Config"
import { logger } from "./utils/logger"
import { connect } from "mongoose"

process.env.NODE_ENV === "production"
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
import rateLimit from "express-rate-limit"

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

app.get("/sprite-debug", (req, res) => {
  res.sendFile(viewsSrc)
})

app.get("/pokemons", (req, res) => {
  res.send(Pkm)
})

app.get("/types", (req, res) => {
  res.send(PRECOMPUTED_TYPE_POKEMONS_ALL)
})

app.get("/items", (req, res) => {
  res.send(Item)
})

app.get("/types-trigger", (req, res) => {
  res.send(SynergyTriggers)
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
gameServer.define("room", PreparationRoom).enableRealtimeListing()
gameServer.define("game", GameRoom).enableRealtimeListing()

// Start
async function main() {
  await connect(process.env.MONGO_URI!)
  gameServer.listen(port)
  logger.info(`Game server started, listening on port ${port}`)
}
main()
