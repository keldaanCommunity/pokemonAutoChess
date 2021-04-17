import * as colyseus from 'colyseus.js';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import LobbyPage from './pages/lobby-page';
import RoomPage from './pages/room-page';
import GamePage from './pages/game-page';
import AfterGamePage from './pages/after-game-page';
import BotCreationPage from './pages/bot-creation-page';

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;
window._client = new colyseus.Client(endpoint);
window.page = null;


window.listAllEventListeners = function listAllEventListeners() {
  const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
  allElements.push(document);
  allElements.push(window);

  const types = [];

  for (let ev in window) {
    if (/^on/.test(ev)) types[types.length] = ev;
  }

  let elements = [];
  for (let i = 0; i < allElements.length; i++) {
    const currentElement = allElements[i];
    for (let j = 0; j < types.length; j++) {
      if (typeof currentElement[types[j]] === 'function') {
        elements.push({
          "node": currentElement,
          "type": types[j],
          "func": currentElement[types[j]].toString(),
        });
      }
    }
  }

  return elements.sort(function(a,b) {
    return a.type.localeCompare(b.type);
  });
}

window.addEventListener('render-creation-bot', (e)=> {window.page = new BotCreationPage(e.detail)});
window.addEventListener('render-home', (e) => {window.page = new HomePage(e.detail)});
window.addEventListener('render-login', (e) =>{window.page =  new LoginPage(e.detail)});
window.addEventListener('render-lobby', (e) =>{window.page =  new LobbyPage(e.detail)});
window.addEventListener('render-room', (e) =>{window.page =  new RoomPage(e.detail)});
window.addEventListener('render-game', (e) =>{
  window.page =  new GamePage(e.detail);
  document.getElementById('game').addEventListener('render-after-game', (e) =>{
    window.page =  new AfterGamePage(e.detail)
  });
});

window.addEventListener('switch-lang', (e) => {
  window._client.auth.lang = e.detail.lang;
  // console.log(e.detail);
  window._client.auth.save().then(function() {
    switch (e.detail.render) {
      case 'home':
        window.page = new HomePage(e.detail);
        break;

      case 'login':
        window.page = new LoginPage(e.detail);
        break;

      case 'lobby':
        window.page = new LobbyPage(e.detail);
        break;

      case 'room':
        window.page = new RoomPage(e.detail);
        break;

      case 'game':
        window.page = new GamePage(e.detail);
        break;

      case 'bot-creation':
        window.page = new BotCreationPage(e.detail);
        break;
        
      default:
        break;
    }
  });
});

window.onload = () => new HomePage();