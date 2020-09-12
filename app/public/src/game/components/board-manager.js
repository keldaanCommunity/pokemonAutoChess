import Pokemon from './pokemon';

export default class BoardManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  addPokemon(pokemon) {
    const presence = false;
    this.group.getChildren().forEach((pkm) => {
      if (pkm.id == pokemon.id) {
        pkm.destroy();
      }
    });
    if (!presence) {
      const coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
      let pokemonUI;

      if (window.sessionId == this.player.id) {
        pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, true);
      } else {
        pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, false);
      }
      window.animationManager.animatePokemon(pokemonUI);
      this.group.add(pokemonUI);
    }
  }

  clear() {
    this.group.clear(false, true);
  }

  clearBoard() {
    for (const id in this.player.board) {
      const pokemon = this.player.board[id];
      if (pokemon.positionY != 0) {
        this.removePokemon(pokemon.id);
      }
    }
  }

  removePokemon(id) {
    this.group.getChildren().forEach((pokemon) => {
      if (pokemon.id == id) {
        pokemon.destroy();
      }
    });
  }

  buildPokemons() {
    for (const id in this.player.board) {
      const pokemon = this.player.board[id];
      if (window.state.phase == 'FIGHT') {
        if (pokemon.positionY == 0) {
          this.addPokemon(pokemon);
        }
      } else {
        this.addPokemon(pokemon);
      }
    }
  }

  setPlayer(player) {
    if (player.id != this.player.id) {
      this.player = player;
      this.group.clear(true, true);
      this.buildPokemons();
    }
  }

  update() {
    for (const id in this.player.board) {
      const pokemon = this.player.board[id];
      let found = false;
      this.group.getChildren().forEach((pokemonUI) => {
        if (pokemon.id == pokemonUI.id) {
          found = true;
          
          if(pokemon.items && Object.keys(pokemon.items).length != 0){
            pokemonUI.setItems(pokemon, this.scene);
          }

          if (pokemonUI.positionX != pokemon.positionX || pokemonUI.positionY != pokemon.positionY) {
            pokemonUI.positionX = pokemon.positionX;
            const coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
            pokemonUI.x = coordinates[0];
            pokemonUI.y = coordinates[1];
          }
          if (pokemonUI.x != pokemon.positionX || pokemonUI.y != pokemon.positionY) {
            const coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
            pokemonUI.x = coordinates[0];
            pokemonUI.y = coordinates[1];
          }
        }
      });
      if (!found) {
        if (window.state.phase =='FIGHT') {
          if (pokemon.positionY ==0) {
            this.addPokemon(pokemon);
          }
        } else {
          this.addPokemon(pokemon);
        }
      }
    }
    const ids = [];
    this.group.getChildren().forEach((pokemonUI) => {
      if (!(pokemonUI.id in this.player.board)) {
        ids.push(pokemonUI.id);
      }
    });
    ids.forEach((id) => {
      this.removePokemon(id);
    });
  }
}
