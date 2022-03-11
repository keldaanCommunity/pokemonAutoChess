require('dotenv').config();
import path from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import basicAuth from 'express-basic-auth';
import { WebSocketTransport } from '@colyseus/ws-transport';
import admin from 'firebase-admin';


const port = Number(process.env.PORT) || 9000;


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const app = express();
const httpServer = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer
  })
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// set up rate limiter: maximum of five requests per minute
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/preparation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/after', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const basicAuthMiddleware = basicAuth({
  // list of users and passwords
  users: {
    'admin': process.env.ADMIN_PASSWORD
  },
  challenge: true
});

app.use('/colyseus', basicAuthMiddleware, monitor());

// Room
import AfterGameRoom from './rooms/after-game-room';
import LobbyRoom from './rooms/custom-lobby-room';
import PreprationRoom from './rooms/preparation-room';
import GameRoom from './rooms/game-room';

gameServer.define('after-game', AfterGameRoom);
gameServer.define('lobby', LobbyRoom);
gameServer.define('room', PreprationRoom).enableRealtimeListing();
gameServer.define('game', GameRoom);

// Start
gameServer.listen(port);
console.log(`Game server started, listening on port ${port}`);
