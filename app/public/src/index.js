import * as colyseus from "colyseus.js";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import LobbyPage from "./pages/lobby-page";
import GamePage from "./pages/game-page";

// define endpoint based on environment
let url = window.location.hostname.indexOf("localhost") != -1 ?
  "ws://localhost:9000" :
  `${window.location.protocol.replace("http", "ws")}//${window.location.host}`;

let endpoint = `${window.location.protocol.replace("http", "ws")}//${window.location.host}`;
console.log(endpoint);
window._client = new colyseus.Client(endpoint);

window.addEventListener("render-home", e => {
  HomePage.render();
});

window.addEventListener("render-login", e => {
  LoginPage.render();
});

window.addEventListener("render-lobby", e => {
  LobbyPage.render(e.room);
});

window.addEventListener("render-game", e => {
  GamePage.render(e.room);
});

window.onload = function() {
  HomePage.render();
}


// let lastRoomId = sessionStorage.getItem("PAC_Room_ID");
// let lastSessionId = sessionStorage.getItem("PAC_Session_ID");
// if (lastRoomId && lastSessionId) {
//   client.reconnect(lastRoomId, lastSessionId)
//     .then(room => {
//       console.log("Previous game found, reconnect ?");
//       console.log(room);
//     })
//     .catch(e => {
//       console.log("Reconnection error", e);
//       sessionStorage.removeItem("PAC_Room_ID");
//       sessionStorage.removeItem("PAC_Session_ID");
//       login();
//     });
// }