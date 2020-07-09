import GameScene from "./scenes/game-scene";
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';

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
      scale: { mode: Phaser.Scale.FIT },
      plugins: {
        global: [{
            key: 'rexMoveTo',
            plugin: MoveToPlugin,
            start: true
        }]
    }
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
    };
    // Game event listener
    window.addEventListener("shop-click", e => this.onShopClick(e));
    window.addEventListener("player-click", e => this.onPlayerClick(e));
    window.addEventListener("refresh-click", e => this.onRefreshClick(e));
    window.addEventListener("lock-click", e => this.onLockClick(e));
    window.addEventListener("level-click", e => this.onLevelClick(e));
    window.addEventListener("drag-drop", e => this.onDragDrop(e));
    window.addEventListener("sell-drop", e => this.onSellDrop(e));
  }

  initializePlayer(player) {
    let self = this;
    if(player.id == self.room.sessionId){
      self.player = player;
    }
    player.onChange = (changes => {
      changes.forEach(change => self.handlePlayerChange(change, player));
    });
    
    player.experienceManager.onChange = (changes => {
      changes.forEach(change => self.handleExperienceChange(change, player));
    });

    player.synergies.onChange = (changes => {
      changes.forEach(change => self.handleSynergiesChange(change, player));
    });

    player.simulation.blueTeam.onAdd = (pokemon, key) =>{
      self.handlePokemonAdd(player.id, pokemon);
      pokemon.onChange = function(changes) {
        changes.forEach(change => {self.handlePokemonChange(player.id, change, pokemon)});
      };
    };
    player.simulation.redTeam.onAdd = (pokemon, key) =>{
      self.handlePokemonAdd(player.id, pokemon);
      pokemon.onChange = function(changes) {
        changes.forEach(change => {self.handlePokemonChange(player.id, change, pokemon)});
      };
    };
    player.simulation.blueTeam.onRemove = (pokemon, key) => {
      self.handlePokemonRemove(player.id, pokemon);
    };
    player.simulation.redTeam.onRemove = (pokemon, key) => {
      self.handlePokemonRemove(player.id, pokemon);
    };
    player.triggerAll();
    this.onPlayerAdd(player);
  }

  handleRoomStateChange(change) {
    if (window.state == null || this.game.scene.getScene("gameScene").timeText == null) return;
    switch (change.field) {
      case "roundTime":
        this.game.scene.getScene("gameScene").updateTime();
        break;

      case "phase":
        this.game.scene.getScene("gameScene").updatePhase();
        break;

      default:
        break;
    }
  }

  handlePokemonAdd(playerId, pokemon){
    this.game.scene.getScene("gameScene").battleManager.addPokemon(playerId, pokemon);
  }

  handlePokemonRemove(playerId, pokemon){
    this.game.scene.getScene("gameScene").battleManager.removePokemon(playerId, pokemon);
  }

  handlePokemonChange(playerId, change, pokemon){
    this.game.scene.getScene("gameScene").battleManager.changePokemon(playerId, change, pokemon);
  }

  handleSynergiesChange(change, player){
    if(player.id == this.player.id){
      this.game.scene.getScene("gameScene").synergiesContainer.updateSynergy(change.field, change.value);
    }
  }

  handleExperienceChange(change, player){
    if(player.id == this.player.id){
      switch (change.field) {
        case "level":
          this.game.scene.getScene("gameScene").shopContainer.levelUpButton.changeLevel(change.value);
          break;
  
        case "experience":
          this.game.scene.getScene("gameScene").shopContainer.levelUpButton.changeExperience(change.value);
          break;
  
        case "expNeeded":
          this.game.scene.getScene("gameScene").shopContainer.levelUpButton.changeExpNeeded(change.value);
          break;
      
        default:
          break;
      }
    }
    if(change.field == "level"){
      this.game.scene.getScene("gameScene").playerContainer.onLevelChange(player.id, change.value);
    }
  }
  

   handlePlayerChange(change, player) {
    if (this.game.scene.getScene("gameScene") == null || this.game.scene.getScene("gameScene").playerContainer == null) return;
    switch (change.field) {
      case "money":
        if (this.room.sessionId == player.id) {
          this.game.scene.getScene("gameScene").moneyContainer.onMoneyChange(change.value);
        }
        this.game.scene.getScene("gameScene").playerContainer.onMoneyChange(player.id, change.value);
        break;
      
      case "streak":
        if (this.room.sessionId == player.id) {
          this.game.scene.getScene("gameScene").moneyContainer.onStreakChange(change.value);
        }
        break;

      case "interest":
        if (this.room.sessionId == player.id) {
          this.game.scene.getScene("gameScene").moneyContainer.onInterestChange(change.value);
        }
        break;
      
      case "lastBattleResult":
        if (this.room.sessionId == player.id) {
          this.game.scene.getScene("gameScene").moneyContainer.onWonChange(change.value);
          this.game.scene.getScene("gameScene").lastBattleResult.setText(change.value);
        }
        break;

      case "shop":
        if (this.room.sessionId == player.id) {
        this.game.scene.getScene("gameScene").shopContainer.updatePortraits();
        }
        break;

      case "board":
        if(this.game.scene.getScene("gameScene").boardManager.player.id == player.id){
          this.game.scene.getScene("gameScene").boardManager.update(player.id);
        }
        break;

      case "life":
        this.game.scene.getScene("gameScene").playerContainer.onLifeChange(player.id, change.value);
        break;

      case "shopLocked":
        if(this.room.sessionId == player.id){
          this.game.scene.getScene("gameScene").shopContainer.lockButton.updateState();
        }
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
    scene.battleManager.setPlayer(window.state.players[event.detail.id]);
    scene.boardManager.buildPokemons();
  }

  onShopClick(event) {
    this.room.send("shop",{"id": event.detail.id });
  }

  onRefreshClick(event) {
    this.room.send("refresh");
  }

  onLockClick(event){
    this.room.send("lock");
  }

  onLevelClick(event) {
    this.room.send("levelUp");
  }

  onDragDrop(event) {
    this.room.send("dragDrop", {"detail": event.detail });
  }

  onSellDrop(event){
    this.room.send("sellDrop", {"detail": event.detail });
  }

  onPlayerRemove(player, key){
    if (this.game.scene.getScene("gameScene") == null || this.game.scene.getScene("gameScene").playerContainer == null) return;
    this.game.scene.getScene("gameScene").playerContainer.removePlayer(key);
  }

  onPlayerAdd(player){
    if (this.game.scene.getScene("gameScene") == null || this.game.scene.getScene("gameScene").playerContainer == null) return;
    this.game.scene.getScene("gameScene").playerContainer.addPlayer(player);
  }
}

export default GameContainer;
