import * as colyseus from 'colyseus.js';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import LobbyPage from './pages/lobby-page';
import RoomPage from './pages/room-page';
import GamePage from './pages/game-page';

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;
window._client = new colyseus.Client(endpoint);

window.addEventListener('render-home', (e) => new HomePage(e.detail));
window.addEventListener('render-login', (e) => new LoginPage(e.detail));
window.addEventListener('render-lobby', (e) => new LobbyPage(e.detail));
window.addEventListener('render-room', (e) => new RoomPage(e.detail));
window.addEventListener('render-game', (e) => new GamePage(e.detail));
window.addEventListener('switch-lang', (e) => {
  window._client.auth.lang = e.detail.lang;
  // console.log(e.detail);
  window._client.auth.save().then(function() {
    switch (e.detail.render) {
      case 'home':
        new HomePage(e.detail);
        break;

      case 'login':
        new LoginPage(e.detail);
        break;

      case 'lobby':
        new LobbyPage(e.detail);
        break;

      case 'room':
        new RoomPage(e.detail);
        break;

      case 'game':
        new GamePage(e.detail);
        break;

      default:
        break;
    }
  });
});

window.onload = () => new HomePage();

/*
window.onload = () => {
  Utils.addScript(document, "https://connect.facebook.net/en_US/sdk.js");
  window.fbAsyncInit = function () {
    console.log("init fb...");
    FB.init({
      appId: "632593943940001",
      autoLogAppEvents: true,
      xfbml: true,
      version: "v6.0"
    });
    var b = document.createElement("button");
    b.addEventListener("click", () => {
      console.log("starting login...");
      FB.login(login => {
        if (login.status == "connected") {
          console.log("authenticate client...");
          _client.auth.login({ accessToken: login.authResponse.accessToken }).then(r => {
            console.log("joining room...");
            _client.joinOrCreate("game", {}).then(room => {
              new GamePage({ room: room });
            }).catch(e => {
              console.error("join error:", e);
            });
          }, e => {
            console.log("authentication error:", e);
          });
        }
        else {
          console.log("login failed:", login);
        }
      }, {
        scope: "public_profile,email"
      });
    });
    try {
      b.dispatchEvent(new MouseEvent("click"));
    }
    catch (e) {
      var evt = document.createEvent("MouseEvent");
      evt.initMouseEvent("true", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      b.dispatchEvent(evt);
    }
  }
};
*/
