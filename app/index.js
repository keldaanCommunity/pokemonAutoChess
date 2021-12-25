require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Colyseus = require('colyseus');
const monitor = require('@colyseus/monitor').monitor;
const basicAuth = require('express-basic-auth');
const {WebSocketTransport} = require('@colyseus/ws-transport');
const admin = require('firebase-admin');


const port = process.env.PORT || 9000;

const firebaseKey = {
  'type': process.env.TYPE,
  'project_id': process.env.PROJECT_ID,
  'private_key_id': process.env.PRIVATE_KEY_ID,
  'private_key': process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  'client_email': process.env.CLIENT_EMAIL,
  'client_id': process.env.CLIENT_ID,
  'auth_uri': process.env.AUTH_URI,
  'token_uri': process.env.TOKEN_URI,
  'auth_provider_x509_cert_url': process.env.AUTH_PROVIDER_X509_CERT_URL,
  'client_x509_cert_url': process.env.CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey)
});

const app = express();
const httpServer = http.createServer(app);
const gameServer = new Colyseus.Server({
  transport: new WebSocketTransport({
    server: httpServer
  })
});

app.use(cors());
helmet({
  contentSecurityPolicy: false
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// set up rate limiter: maximum of five requests per minute
const rateLimit = require('express-rate-limit').default;

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
const AfterGameRoom = require('./rooms/after-game-room');
const LobbyRoom = require('./rooms/custom-lobby-room');
const PreprationRoom = require('./rooms/preparation-room');
const GameRoom = require('./rooms/game-room');

gameServer.define('after-game', AfterGameRoom);
gameServer.define('lobby', LobbyRoom);
gameServer.define('room', PreprationRoom).enableRealtimeListing();
gameServer.define('game', GameRoom);

// Start
gameServer.listen(port);
console.log(`Game server started, listening on port ${port}`);
