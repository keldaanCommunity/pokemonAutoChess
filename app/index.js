require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Colyseus = require("colyseus");
const Monitor = require("@colyseus/monitor");
const socialMiddleware = require("@colyseus/social/express").default;

const port = process.env.PORT || 9000;

const app = express();
const httpServer = http.createServer(app);
const gameServer = new Colyseus.Server({server: httpServer, express: app });

// Middleware

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "dist")));

// Routing

app.use("/", socialMiddleware);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Monitoring
// https://github.com/colyseus/colyseus-monitor
// https://www.npmjs.com/package/express-basic-auth
// set admin name/password in .env, then use process.env.ADMIN_NAME/ADMIN_PASS

app.get("/colyseus", Monitor.monitor(gameServer)); // colyseus monitor panel

// Room

const LobbyRoom = require("./rooms/lobby-room");
const PreprationRoom = require("./rooms/preparation-room");
const GameRoom = require("./rooms/game-room");
gameServer.define("lobby", LobbyRoom);
gameServer.define("room", PreprationRoom);
gameServer.define("game", GameRoom);


// Start

gameServer.listen(port);
console.log(`Game server started, listening on port ${port}`);
