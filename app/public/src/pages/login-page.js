import {insertScriptFile} from '../utils';
import * as uniqid from 'uniqid';

class LoginPage {
  constructor(args) {
    this.render();
    this.addEventListeners();
    insertScriptFile(document, 'https://connect.facebook.net/en_US/sdk.js').then(() => {
      this.initFBLogin();
    });
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'home');
    content.innerHTML = `
    <div id="play-panel" class="nes-container with-title is-centered" style="height:30%; margin-left:15%;margin-top:15%; background-color: rgba(255, 255, 255, .5);">
    <p class="title" style="">Game</p>
    <h1 style="font-size:50px; margin-bottom:40px;">Pokemon Auto Chess</h1>
    <button id="button-guest" type="button" class="nes-btn is-success">Login as guest</button>
    <button id="display-login" type="button" class="nes-btn is-warning">Log with email</button>
    <button id="button-fb" type="button" class="nes-btn is-primary">Log with Facebook</button>
    <div id="mail" style="display:none;">
      <div class="nes-field" style="margin-top:10px;">
        <label for="name_field">Email</label>
        <input id="input-username" type="text" id="name_field" class="nes-input">
      </div>
      <div class="nes-field" style="margin-top:10px;">
        <label for="name_field">Password</label>
        <input id="input-password" type="password" id="name_field" class="nes-input">
      </div>
      <button id="button-login" type="button" class="nes-btn is-warning" style="margin-top:20px;">Login</button>
    </div>
    </div>
    <div class="nes-container with-title is-centered" style="width:20%; height:40%; margin:10px; background-color: rgba(255, 255, 255, .5);">
    <p class="title">Media</p>
    
    <section class="icon-list" style="margin-bottom:15px;">
    <!-- facebook -->
    <a href="https://www.facebook.com/Pok%C3%A9mon-Auto-Chess-Espa%C3%B1ol-108035354419173">
    <i class="nes-icon facebook is-large"></i>
    </a>
    
    <!-- github -->
    <a href="https://github.com/arnaudgregoire/pokemonAutoChess">
    <i class="nes-icon github is-large"></i>
    </a>
    
    <!-- twitch -->
    <a href="https://www.twitch.tv/ag_interactive">
    <i class="nes-icon twitch is-large"></i>
    </a>
    
    <!-- youtube -->
    <a href="https://www.youtube.com/watch?v=sn68G5b-xkE">
    <i class="nes-icon youtube is-large"></i>
    </a>
    </i>
    </section>

    <button type="button" class="nes-btn is-error" onclick="location.href = 'https://discord.gg/6JMS7tr';">Join Discord</button>
    <button style="margin-top:10px;" type="button" class="nes-btn is-warning" onclick="location.href = 'https://fr.tipeee.com/pokemon-auto-chess';">Donate</button>
    <p style="margin-top:10px;">This is a non profit game. Only made by fans for fans.</p>
    </div>
    <img src="assets/ui/chrysacier.gif" style="position:absolute; top:160px; left:580px;"/>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById('display-login').addEventListener('click', this.handleDisplayLoginClick.bind(this));
    document.getElementById('button-login').addEventListener('click', this.handleLoginButtonClick.bind(this));
    document.getElementById('button-guest').addEventListener('click', this.handleGuestButtonClick.bind(this));
  }

  handleDisplayLoginClick(e) {
    if (document.getElementById('mail').style.display == 'none') {
      document.getElementById('play-panel').style.height = '50%';
      document.getElementById('mail').style.display = '';
    } else {
      document.getElementById('play-panel').style.height = '30%';
      document.getElementById('mail').style.display = 'none';
    }
  }

  handleLoginButtonClick(e) {
    const inputMail = document.getElementById('input-username').value;
    const inputPassword = document.getElementById('input-password').value;
    this.authenticateWithEmail(inputMail, inputPassword);
  }

  handleGuestButtonClick(e) {
    this.authenticateWithEmail(`guest${uniqid()}@test.test`, 'guest');
  }

  initFBLogin() {
    if (!!window.fbAsyncInit) {
      this.testFBLoginStatus();
    } else {
      window.fbAsyncInit = () => {
        FB.init({
          appId: '632593943940001',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v6.0'
        });
        this.testFBLoginStatus();
      };
    }
  }

  testFBLoginStatus() {
    FB.getLoginStatus((login) => {
      const button = document.getElementById('button-fb');
      if (login.status == 'connected') {
        button.textContent = 'Continue with Facebook';
        button.addEventListener('click', (e) => this.authenticateWithFB(login.authResponse.accessToken));
      } else {
        button.textContent = 'Log with Facebook';
        button.addEventListener('click', (e) => this.tryFBLogin());
      }
    });
  }

  tryFBLogin() {
    FB.login((login) => {
      if (login.status == 'connected') {
        this.authenticateWithFB(login.authResponse.accessToken);
      }
    }, {
      scope: 'public_profile,email'
    });
  }

  authenticateWithFB(accessToken) {
    _client.auth.login({accessToken: accessToken})
        .then((result) => {
          this.joinLobbyRoom();
        }, (error) => {
          console.log('error', error);
        });
  }

  authenticateWithEmail(email, password) {
    _client.auth.login({email: email, password: password})
        .then((result) => {
          this.joinLobbyRoom();
        }, (error) => {
          alert(error.data.error);
        });
  }

  joinLobbyRoom() {
    // console.log(_client);
    _client.joinOrCreate('lobby', {}).then((room) => {
      window.dispatchEvent(new CustomEvent('render-lobby', {detail: {room: room}}));
    }).catch((e) => {
      console.log('error', error);
    });
  }
}

/*
let lastRoomId = sessionStorage.getItem('PAC_Room_ID');
let lastSessionId = sessionStorage.getItem('PAC_Session_ID');
if (lastRoomId && lastSessionId) {
  client.reconnect(lastRoomId, lastSessionId)
    .then(room => {
      //console.log('Previous game found, reconnect ?');
      //console.log(room);
    })
    .catch(e => {
      //console.log('Reconnection error', e);
      sessionStorage.removeItem('PAC_Room_ID');
      sessionStorage.removeItem('PAC_Session_ID');
      login();
    });
}
*/

export default LoginPage;
