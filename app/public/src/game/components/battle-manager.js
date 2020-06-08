import Pokemon from "./pokemon";

export default class BattleManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  addPokemon(playerId, pokemon) {
    if(this.player.id == playerId){
      let pokemonUI = new Pokemon(this.scene, pokemon.positionX * 100 + 330, 710 - 80 * pokemon.positionY, pokemon);
      pokemonUI.setScale(3, 3);
      this.scene.add.existing(pokemonUI);
      window.animationManager.displayEntity(pokemonUI);
      this.group.add(pokemonUI);
    }
  }

  clear() {
    this.group.clear(false, true);
  }

  removePokemon(playerId, pokemon) {
    if(this.player.id == playerId){
      this.group.getChildren().forEach(pkm => {
        if (pkm.id == pokemon.id) {
          pkm.destroy();
        }
      });
    }
  }

  changePokemon(playerId, change, pokemon){
    if(this.player.id == playerId){
      this.group.getChildren().forEach(pkm => {
        if (pkm.id == pokemon.id) {
          switch(change.field){
            case "positionX":
              pkm.setX(pokemon.positionX * 100 +330);
              break;
            case "positionY":
              pkm.setY(710 - 80 * pokemon.positionY);
              break;
          }
        }
      })
    }
  }

  setPlayer(player) {
    if (player.id != this.player.id) {
      this.player = player;
      this.group.clear(true, true);
      this.buildPokemons();
    }
  }
}