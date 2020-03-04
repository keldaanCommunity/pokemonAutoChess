import Utils from "../utils";

class LoginPage {
  constructor(args) {
    this.initFB = false;
    this.render();
    this.addEventListeners();
    this.initFBLogin();
    Utils.addScript(document, "https://connect.facebook.net/en_US/sdk.js");
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "home");
    content.innerHTML = `
    <header>
      <h1>Game Login</h1>
      <button id="button-home">Home</button>
    </header>
    <main>
    <div id="login-container">
      <div class="tab-container">
      <input name="radio-group1" id="tab-1" type="radio" checked>
      <label for="tab-1">Account</label>
      <input name="radio-group1" id="tab-2" type="radio">
      <label for="tab-2">Facebook</label>
      <div class="tab-row">
        <div><div id="login-account">
          <label>Username</label><input type="string" id="input-username">
          <label>Password</label><input type="password" id="input-password">
          <button id="button-login">Log in</button>
        </div></div>
        <div><div id="login-fb">
          <button id="button-fb"></button>
        </div></div>
      </div>
      </div>
    </div>
    </main>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById("button-home").addEventListener("click", e => {
      window.dispatchEvent(new CustomEvent("render-home"));
    });
    document.getElementById("button-login").addEventListener("click", this.handleLoginButtonClick);
  }

  handleLoginButtonClick(e) {
    var inputMail = document.getElementById("input-username").value;
    var inputPassword = document.getElementById("input-password").value;
    this.joinLobbyWithAccount(inputMail, inputPassword);
  }

  initFBLogin() {
    if (this.initFB) {
      this.testFBLoginStatus();
    }
    else {
      window.fbAsyncInit = function () {
        FB.init({
          appId: "632593943940001",
          autoLogAppEvents: true,
          xfbml: true,
          version: "v6.0"
        });
        this.initFB = true;
        this.testFBLoginStatus();
      }.bind(this);
    }
  }

  testFBLoginStatus() {
    console.log("fetching login status...");
    FB.getLoginStatus(login => {
      console.log("login:", login);
      var button = document.getElementById("button-fb");
      if (login.status == "connected") {
        console.log("already connected");
        button.textContent = "Continue with Facebook";
        button.addEventListener("click", e => {
          this.getFBUserInfo(login.authResponse);
        });
      }
      else {
        console.log("need login");
        button.textContent = "Login with Facebook";
        button.addEventListener("click", e => {
          this.tryFBLogin();
        });
      }
    });
  }

  tryFBLogin() {
    console.log("starting login...");
    FB.login(login => {
      console.log("login:", login);
      if (login.status == "connected") {
        console.log("login successful");
        this.getFBUserInfo(login.authResponse);
      }
      else {
        console.log("login failed");
      }
    }, {
      scope: "public_profile,email"
    });
  }

  getFBUserInfo(authInfo) {
    console.log("fetching information...");
    FB.api("/me", info => {
      console.log("info:", info);
      this.joinLobbyWithFB(authInfo.accessToken, info.name);
    });
  }

  joinLobbyWithFB(token, name) {
    console.log("trying to join room", token, name);
    window._client.joinOrCreate("lobby", {
      type: "fb",
      token: token,
      name: name
    }).then(room => {
      window.dispatchEvent(new CustomEvent("render-lobby", { detail: { room: room } }));
    }).catch(e => {
      console.error("join error", e);
    });
  }

  joinLobbyWithAccount(username, password) {
    window._client.joinOrCreate("lobby", {
      type: "user",
      username: username,
      password: password
    }).then(room => {
      window.dispatchEvent(new CustomEvent("render-lobby", { detail: { room: room } }));
    }).catch(e => {
      console.error("join error", e);
    });
  }
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

export default LoginPage;