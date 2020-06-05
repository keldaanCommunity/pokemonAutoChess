
// import { Game, CANVAS, Scale } from "phaser";
import LoginScene from "./scenes/login-scene";
import GameScene from "./scenes/game-scene";

class GameContainer {
  constructor(room, div) {
    this.room = room;
    this.div = div;
    this.game = null;
    this.player = null;
    this.initialize();
  }

  initialize() {
    this.initializeGame();
    this.initializeEvents();
  }

  initializeGame() {
    // Create Phaser game
    let config = {
      type: Phaser.CANVAS,
      width: 2000,
      height: 1000,
      pixelArt: true,
      scene: [GameScene],
      scale: { mode: Phaser.Scale.FIT }
    };
    this.game = new Phaser.Game(config);
  }

  initializeEvents() {
    
    // Room event listener
    window.sessionId = this.room.sessionId;
    this.room.onStateChange.once(state => {
       window.state = state;
    });
    
    this.room.state.players.onAdd = player => this.initializePlayer(player);
    this.room.state.players.onRemove = (player, key) => this.onPlayerRemove(player, key);
    this.room.onMessage("DragDropFailed",(message) => this.handleDragDropFailed());
    this.room.onMessage("kick-out",(message) => this.handleKickOut());
    this.room.onLeave(client => this.handleRoomLeft(client));
    this.room.onError(err => console.log("room error", err));
    this.room.state.onChange = (changes) => {
      changes.forEach(change => {
        this.handleRoomStateChange(change);
      })
    }
    // Game event listener
    window.addEventListener("shop-click", e => this.onShopClick(e));
    window.addEventListener("player-click", e => this.onPlayerClick(e));
    window.addEventListener("refresh-click", e => this.onRefreshClick(e));
    window.addEventListener("level-click", e => this.onLevelClick(e));
    window.addEventListener("drag-drop", e => this.onDragDrop(e));
  }

  initializePlayer(player) {
    if(player.id == this.room.sessionId){
      this.player = player;
    }
    player.onChange = (changes => {
      changes.forEach(change => this.handlePlayerChange(change, player));
    });
    player.simulation.blueTeam.onAdd = (pokemon, key) =>{
      console.log(pokemon, "has been added at", key);
      this.handlePokemonAdd(pokemon);
      pokemon.onChange = function(changes) {
        changes.forEach(change => {this.handlePokemonChange(change, pokemon)});
      };
    };
    player.simulation.redTeam.onAdd = (pokemon, key) =>{
      console.log(pokemon, "has been added at", key);
      this.handlePokemonAdd(pokemon);
      pokemon.onChange = function(changes) {
        changes.forEach(change => {this.handlePokemonChange(change, pokemon)});
      };
    };
    player.simulation.blueTeam.onRemove = (pokemon, key) => {
      console.log(pokemon, "has been removed at", key);
      this.handlePokemonRemove(pokemon);
    };
    player.simulation.redTeam.onRemove = (pokemon, key) => {
      console.log(pokemon, "has been removed at", key);
      this.handlePokemonRemove(pokemon);
    };
    player.triggerAll();
  }

  handleRoomStateChange(change) {
    if (window.state == null || this.game.scene.getScene("gameScene").timeText == null) return;
    switch (change.field) {
      case "time":
        this.game.scene.getScene("gameScene").updateTime();
        break;
      case "phase":
        this.game.scene.getScene("gameScene").updatePhase();
        break;
      default:
        break;
    }
  }

  handlePokemonAdd(pokemon){

  }

  handlePokemonRemove(pokemon){

  }

  handlePokemonChange(change, pokemon){

  }

  handlePlayerChange(change, player) {
    if (this.game.scene.getScene("gameScene") == null || this.game.scene.getScene("gameScene").playerContainer == null) return;
    switch (change.field) {
      case "money":
        if (this.room.sessionId == player.id) {
          this.game.scene.getScene("gameScene").updateMoney();
        }
        break;
      case "shop":
        this.game.scene.getScene("gameScene").shopContainer.updatePortraits();
        break;
      case "board":
        this.game.scene.getScene("gameScene").boardManager.update();
        break;
      case "experienceManager":
        this.game.scene.getScene("gameScene").playerContainer.updatePortraits();
        break;
      case "life":
        this.game.scene.getScene("gameScene").playerContainer.updatePortraits();
        break;
    }
  }

  handleDragDropFailed() {
    this.game.scene.getScene("gameScene").boardManager.update();
  }

  handleKickOut(){
    console.log('kicked out');
    
    _client.joinOrCreate("lobby", {}).then(room => {
      this.room.leave();
      console.log("joined room:", room);
      window.dispatchEvent(new CustomEvent("render-lobby", { detail: { room: room } }));
    }).catch(e => {
      console.error("join error", e);
    });
  }

  handleRoomLeft(client) {
    //sessionStorage.setItem("PAC_Room_ID", room.id);
    //sessionStorage.setItem("PAC_Session_ID", room.sessionId);
    console.log(client.id, "left");
  }

  onPlayerClick(event) {
    var scene = this.game.scene.getScene("gameScene");
    scene.fade();
    scene.boardManager.clear();
    scene.boardManager.player = window.state.players[event.detail.id];
    scene.boardManager.buildPokemons();
  }

  onShopClick(event) {
    this.room.send("shop",{"id": event.detail.id });
  }

  onRefreshClick(event) {
    this.room.send("refresh");
  }

  onLevelClick(event) {
    this.room.send("levelUp");
  }

  onDragDrop(event) {
    this.room.send("dragDrop", {"detail": event.detail });
  }

  onPlayerRemove(player, key){
    console.log(player, "has been removed at", key);
    this.game.scene.getScene("gameScene").playerContainer.updatePortraits(key);
  }
}

export default GameContainer;
