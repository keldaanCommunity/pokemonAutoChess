import Utils from "../utils";

class LoginPage {
  static render() {
    Utils.addScript(document, "https://connect.facebook.net/en_US/sdk.js");
    createContent();
    document.getElementById("button-home").addEventListener("click", e => {
      window.dispatchEvent(new CustomEvent("render-home"));
    });
    initFBLogin();
  }
}

function createContent() {
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
    <label for="tab-1">Email</label>
    <input name="radio-group1" id="tab-2" type="radio">
    <label for="tab-2">Facebook</label>
    <div class="tab-row">
      <div><div id="login-email">
        <label>Email</label><input type="email">
        <label>Password</label><input type="password">
        <button id="button-email">Log in</button>
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

let initFB = false;

function initFBLogin() {
  if (initFB) {
    testFBLoginStatus();
  }
  else {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "632593943940001",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v6.0"
      });
      initFB = true;
      testFBLoginStatus();
    };
  }
}

function testFBLoginStatus() {
  console.log("fetching login status...");
  FB.getLoginStatus(login => {
    console.log("login:", login);
    var button = document.getElementById("button-fb");
    if (login.status == "connected") {
      console.log("already connected");
      button.textContent = "Continue with Facebook";
      button.addEventListener("click", e => {
        getFBUserInfo(login.authResponse);
      });
    }
    else {
      console.log("need login");
      button.textContent = "Login with Facebook";
      button.addEventListener("click", e => {
        tryFBLogin();
      });
    }
  });
}

function tryFBLogin() {
  console.log("starting login...");
  FB.login(login => {
    console.log("login:", login);
    if (login.status == "connected") {
      console.log("login successful");
      getFBUserInfo(login.authResponse);
    }
    else {
      console.log("login failed");
    }
  }, {
    scope: "public_profile,email"
  });
}

function getFBUserInfo(authInfo) {
  console.log("fetching information...");
  FB.api("/me", info => {
    console.log("info:", info);
    joinLobby(authInfo.accessToken, info.name);
  });
}

function joinLobby(token, name) {
  console.log("trying to join room", token, name);
  window._client.joinOrCreate("lobby", {
    type: "fb",
    token: token,
    name: name
  }).then(room => {
    console.log("joined room", room);
    // window.dispatchEvent(new CustomEvent("render-game", {room: room}));
  }).catch(e => {
    console.error("join error", e);
  });
}

export default LoginPage;