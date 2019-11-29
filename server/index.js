require("dotenv").config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const Monitor = require("@colyseus/monitor");
const socialRoutes = require("@colyseus/social/express").default;
const GameRoom = require('./rooms/GameRoom');

const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
  express: app,
});

// register your room handlers
gameServer.define('gameRoom', GameRoom);

// register @colyseus/social routes
app.use("/", socialRoutes);

//colyseus game server monitor panel
app.use("/colyseus", Monitor.monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
