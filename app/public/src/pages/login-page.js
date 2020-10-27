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
    content.setAttribute('id', 'login');
    content.innerHTML = `
    <header>
      <h1>Game Login</h1>
      <button id="button-home" type="button" class="btn btn-secondary">Home</button>
    </header>
    <main>
    <div id="login-container">
      <div class="tab-container">
      <input name="radio-group1" id="tab-1" type="radio" checked>
      <label for="tab-1">Guest</label>
      <input name="radio-group1" id="tab-2" type="radio">
      <label for="tab-2">Account</label>
      <input name="radio-group1" id="tab-3" type="radio">
      <label for="tab-3">Facebook</label>
      <div class="tab-row">
        <div>
        <div id="login-guest">
          <button id="button-guest" type="button" class="btn btn-secondary">Log as guest</button>
        </div>
        </div>
        <div>
        <div id="login-account">
          <label>Email</label><input type="string" id="input-username">
          <label>Password</label><input type="password" id="input-password">
          <button id="button-login" type="button" class="btn btn-secondary">Log in</button>
        </div>
        </div>
        <div><div id="login-fb">
          <button id="button-fb" type="button" class="btn btn-secondary"></button>
        </div></div>
      </div>
      </div>
    </div>
    </main>`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById('button-home').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('render-home'));
    });
    document.getElementById('button-login').addEventListener('click', this.handleLoginButtonClick.bind(this));
    document.getElementById('button-guest').addEventListener('click', this.handleGuestButtonClick.bind(this));
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
        button.textContent = 'Login with Facebook';
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
    //console.log(_client);
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
