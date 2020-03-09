
const Lobby = require('../lobby');

class LobbyPage {
  constructor(args) {
    console.log("args", args);
    console.log("client", _client);
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var div = document.createElement("div");
    div.setAttribute("id", "lobby");
    document.body.innerHTML = "";
    document.body.appendChild(div);
    this.lobby = new Lobby(this.room, div);
  }

  addEventListeners(){
    let self = this;
    document.getElementById("button-home").addEventListener("click", e => {
      self.room.leave();
      window.dispatchEvent(new CustomEvent("render-home"));
    });
  }

}


export default LobbyPage;