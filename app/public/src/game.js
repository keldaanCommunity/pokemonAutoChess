
import Gameview from "./game/game-view";

class GameContainer {
  constructor(room) {
    this.room = room;
    this.view = new Gameview();
    this.player = null;
    this.initialState = null;
  }

  initialize() {
    // Room event listener
    this.room.onStateChange.once(state => { this.initialState = state; });
    this.room.state.onChange(changes => {
      changes.forEach(change => this.handleRoomStateChange(change));
    });
    this.room.players.onAdd(player => this.handleNewPlayer(player));
    this.room.onMessage(msg => this.handleRoomMessage(msg));
    this.room.onError(err => this.handleRoomError(err));
    this.room.onLeave(client => this.handleRoomLeft(client));
    // Game event listener
    window.addEventListener("shop-click", e => this.onShopClick(e));
    window.addEventListener("player-click", e => this.onPlayerClick(e));
    window.addEventListener("refresh-click", e => this.onRefreshClick(e));
    window.addEventListener("level-click", e => this.onLevelClick(e));
    window.addEventListener("drag-drop", e => this.onDragDrop(e));
    // Start game
    this.view.game.scene.stop("loginScene");
    this.view.game.scene.start("gameScene");
  }

  handleRoomStateChange(change) {
    if (!(window.initialized && this.initialState != null)) return;
    switch (change.field) {
      case "time":
        this.view.game.scene.getScene("gameScene").updateTime();
        break;
      case "phase":
        this.view.game.scene.getScene("gameScene").updatePhase();
        break;
    }
  }

  handleNewPlayer(player) {
    this.player = player;
    if (this.view && window.initialized) {
      this.view.game.scene.getScene("gameScene").playerContainer.updatePortraits();
    }
    this.player.onChange = (changes => {
      changes.forEach(change => this.handlePlayerChange(change));
    });
    // force "onChange" to be called immediatelly
    this.player.triggerAll();
  }

  handlePlayerChange(change) {
    if (!(this.view && window.initialized)) return;
    switch (change.field) {
      case "money":
        if (this.room.sessionId == this.player.id) {
          this.view.game.scene.getScene("gameScene").updateMoney();
        }
        break;
      case "shop":
        this.view.game.scene.getScene("gameScene").shopContainer.updatePortraits();
        break;
      case "board":
        this.view.game.scene.getScene("gameScene").boardManager.update();
        break;
      case "experienceManager":
        this.view.game.scene.getScene("gameScene").playerContainer.updatePortraits();
        break;
      case "simulationResult":
        console.log(player.simulationResult);
        break;
    }
  }

  handleRoomMessage(message) {
    console.log("room message", message);
    switch (message.message) {
      case "DragDropFailed":
        this.view.game.scene.getScene("gameScene").boardManager.update();
        break;
    }
  }

  handleRoomError(error) {
    console.log("room error", error);
  }

  handleRoomLeft(client) {
    sessionStorage.setItem("PAC_Room_ID", room.id);
    sessionStorage.setItem("PAC_Session_ID", room.sessionId);
    console.log(client.id, "left", room.name);
  }

  onPlayerClick(event) {
    var scene = this.view.game.scene.getScene("gameScene");
    scene.fade();
    scene.boardManager.clear();
    scene.boardManager.player = window.state.players[e.detail.id];
    scene.boardManager.buildPokemons();
  }

  onShopClick(event) {
    this.room.send({ "event": "shop", "id": e.detail.id });
  }

  onRefreshClick(event) {
    this.room.send({ "event": "refresh" });
  }

  onLevelClick(event) {
    this.room.send({ "event": "levelUp" });
  }

  onDragDrop(event) {
    room.send({ "event": "dragDrop", "detail": event.detail });
  }
}

export default GameContainer;