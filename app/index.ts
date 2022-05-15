import dotenv from 'dotenv'
import path from 'path'
import http from 'http'
import express, {ErrorRequestHandler, Request, Response} from 'express'
import cors from 'cors'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import basicAuth from 'express-basic-auth'
import { WebSocketTransport } from '@colyseus/ws-transport'
import * as bodyParser from 'body-parser'
import admin from 'firebase-admin'
import { initialize } from 'express-openapi'
import fs from 'fs'
import OperationHandler from './api-v1/operationHandler'

dotenv.config()

const port = Number(process.env.PORT) || 9000

admin.initializeApp({
  credential: admin.credential.cert({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectId: process.env.PROJECT_ID!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    clientEmail: process.env.CLIENT_EMAIL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n')
  })
})

const app = express()
const httpServer = http.createServer(app)
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer
  })
})

app.use(bodyParser.json())

const viewsSrc = __dirname.includes('server') ? path.join(__dirname, '..', '..', '..', '..', 'views', 'index.html') : path.join(__dirname, 'views', 'index.html')
const clientSrc = __dirname.includes('server') ? path.join(__dirname, '..', '..', 'client') : path.join(__dirname,  'public', 'dist', 'client')
const apiSrc = __dirname.includes('server') ? path.resolve(__dirname, '..', '..', '..', '..', 'api-v1', 'api-doc.yaml') : path.resolve(__dirname, 'api-v1', 'api-doc.yaml')

initialize({
  apiDoc: fs.readFileSync(apiSrc).toString(),
  app,
  operations: {
    getGameById: [function get(req: Request, res: Response) {OperationHandler.getGameById(req, res)}],
    getGamesByName: [function get(req: Request, res: Response) {OperationHandler.getGamesByName(req, res)}],
    getGamesByTime: [function get(req: Request, res: Response) {OperationHandler.getGamesByTime(req, res)}],
    createGame: [function get(req: Request, res: Response) {OperationHandler.createGame(req, res)}],
    getGameStatus: [function get(req: Request, res: Response) {OperationHandler.getGameStatus(req, res)}]
  }
})

app.use(((err, req, res, next) => {
  res.status(err.status).json(err)
}) as ErrorRequestHandler)


app.use(cors())
app.use(express.json())
app.use(express.static(clientSrc))

// set up rate limiter: maximum of five requests per minute
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.get('/', (req, res) => {
  res.sendFile(viewsSrc)
})

app.get('/auth', (req, res) => {
  res.sendFile(viewsSrc)
})

app.get('/lobby', (req, res) => {
  res.sendFile(viewsSrc)
})

app.get('/preparation', (req, res) => {
  res.sendFile(viewsSrc)
})

app.get('/game', (req, res) => {
  res.sendFile(viewsSrc)
})

app.get('/after', (req, res) => {
  res.sendFile(viewsSrc)
})

const basicAuthMiddleware = basicAuth({
  // list of users and passwords
  users: {
    'admin': process.env.ADMIN_PASSWORD? process.env.ADMIN_PASSWORD: 'Default Admin Password'
  },
  challenge: true
})

app.use('/colyseus', basicAuthMiddleware, monitor())

// Room
import AfterGameRoom from './rooms/after-game-room'
import CustomLobbyRoom from './rooms/custom-lobby-room'
import PreprationRoom from './rooms/preparation-room'
import GameRoom from './rooms/game-room'

gameServer.define('after-game', AfterGameRoom)
gameServer.define('lobby', CustomLobbyRoom)
gameServer.define('room', PreprationRoom).enableRealtimeListing()
gameServer.define('game', GameRoom)

// Start
gameServer.listen(port)
console.log(`Game server started, listening on port ${port}`)
