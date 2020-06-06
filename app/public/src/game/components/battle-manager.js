import Pokemon from "./pokemon";

export default class BattleManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  addPokemon(pokemon) {
    let pokemonUI = new Pokemon(this.scene, pokemon.positionX * 100 + 330, 790 - 80 * pokemon.positionY, pokemon);
    pokemonUI.setScale(3, 3);
    this.scene.add.existing(pokemonUI);
    window.animationManager.displayEntity(pokemonUI);
    this.group.add(pokemonUI);
  }

  clear() {
    this.group.clear(false, true);
  }

  removePokemon(id) {
    this.group.getChildren().forEach(pokemon => {
      if (pokemon.id == id) {
        pokemon.destroy();
      }
    });
  }

  buildPokemons() {
    for (let id in this.player.simulation.blueTeam) {
        let pokemon = this.player.simulation.blueTeam[id];
        
        this.addPokemon(pokemon);
    }
    for (let id in this.player.simulation.redTeam) {
        let pokemon = this.player.simulation.redTeam[id];
        this.addPokemon(pokemon);
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