
const PreGame = require('../pre-game');

class PreGamePage {
  constructor(args) {
    console.log("args", args);
    console.log("client", _client);
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var div = document.createElement("div");
    div.setAttribute("id", "pre-game");
    document.body.innerHTML = "";
    document.body.appendChild(div);
    this.preGame = new PreGame(this.room, div);
  }

  addEventListeners(){
    let self = this;
    document.getElementById("button-home").addEventListener("click", e => {
        self.room.leave();
      window.dispatchEvent(new CustomEvent("render-home"));
    });
  }
}

export default PreGamePage;