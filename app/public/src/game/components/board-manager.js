import Pokemon from './pokemon';

export default class BoardManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  addPokemon(pokemon) {

    this.group.getChildren().forEach((pkm) => {
      if (pkm.id == pokemon.id) {
        pkm.destroy();
      }
    });

    const coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
    let pokemonUI;

    if (window.sessionId == this.player.id) {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, true, true);
    } else {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, false, true);
    }
    window.animationManager.animatePokemon(pokemonUI);
    this.group.add(pokemonUI);
    
  }

  clear() {
    this.group.clear(false, true);
  }

  buildMode(){
    this.group.getChildren().forEach((pokemonUI) => {
      pokemonUI.setVisible(true);
    })
  }

  battleMode(){
    this.group.getChildren().forEach((pokemonUI) => {
      if(pokemonUI.positionY != 0){
        pokemonUI.setVisible(false);
      }
    })
  }

  clearBoard() {

    this.player.board.forEach((pokemon, key) => {
      if (pokemon.positionY != 0) {
        this.removePokemon(pokemon.id);
      }
    });
  }

  removePokemon(id) {
    this.group.getChildren().forEach((pokemon) => {
      if (pokemon.id == id) {
        pokemon.destroy();
      }
    });
  }

  buildPokemons() {
    this.player.board.forEach((pokemon, key) => {
      if (window.state.phase == 'FIGHT') {
        if (pokemon.positionY == 0) {
          this.addPokemon(pokemon);
        }
      } else {
        this.addPokemon(pokemon);
      }
    });
  }

  setPlayer(player) {
    if (player.id != this.player.id) {
      this.player = player;
      this.group.clear(true, true);
      this.buildPokemons();
    }
  }

  changePokemon(pokemon, change){
    let pokemonUI;
    let coordinates;
    switch (change.field) {
      case 'positionX':
        pokemonUI = this.group.getFirst('id',pokemon.id);
        pokemonUI.positionX = change.value;
        pokemonUI.positionY = pokemon.positionY;
        coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        break;
    
      case 'positionY':
        pokemonUI = this.group.getFirst('id',pokemon.id);
        pokemonUI.positionY = change.value;
        pokemonUI.positionX = pokemon.positionX;
        coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        break;

      default:
        break;
    }
  }

  update() {

    this.player.board.$items.forEach((pokemon, key) => {
      let found = false;
      this.group.getChildren().forEach((pokemonUI) => {
        if (pokemon.id == pokemonUI.id) {
          found = true;
          
          if(pokemon.items){
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
    });
    let ids = [];
    this.group.getChildren().forEach((pokemonUI) => {
      if (!this.player.board.has(pokemonUI.id)) {
        ids.push(pokemonUI.id);
      }
    });
    ids.forEach((id) => {
      this.removePokemon(id);
    });
  }
  
}
