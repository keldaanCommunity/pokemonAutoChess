import * as colyseus from "colyseus.js";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import LobbyPage from "./pages/lobby-page";
import GamePage from "./pages/game-page";

let endpoint = `${window.location.protocol.replace("http", "ws")}//${window.location.host}`;
window._client = new colyseus.Client(endpoint);

window.addEventListener("render-home", e => new HomePage(e.detail));
window.addEventListener("render-login", e => new LoginPage(e.detail));
window.addEventListener("render-lobby", e => new LobbyPage(e.detail));
window.addEventListener("render-game", e => new GamePage(e.detail));

window.onload = () => new HomePage();
