import Pokemon from './pokemon';

export default class BoardManager {
  constructor(scene, player) {
    this.pokemons = new Map();
    this.scene = scene;
    this.player = player;
    this.buildPokemons();
  }

  addPokemon(pokemon) {
    const coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
    let pokemonUI;

    if (window.sessionId == this.player.id) {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, true, true);
    } else {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, false, true);
    }
    window.animationManager.animatePokemon(pokemonUI);
    this.pokemons.set(pokemonUI.id, pokemonUI);
  }


  removePokemon(pokemonToRemove) {
    let pokemonUI = this.pokemons.get(pokemonToRemove.id);
    if(pokemonUI){
      pokemonUI.destroy(true);
    }
  }

  buildPokemons() {
    this.player.board.forEach((pokemon, key) => {
      this.addPokemon(pokemon);
    });
  }
  
  battleMode(){
    this.pokemons.forEach(pokemon => {
      if(pokemon.positionY != 0){
        pokemon.setVisible(false);
      }
    });
  }

  pickMode(){
    this.pokemons.forEach(pokemon => {
      pokemon.setVisible(true);
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
    //console.log('change', change.field, pokemon.name);
    let pokemonUI = this.pokemons.get(pokemon.id);
    let coordinates;
    switch (change.field) {
      case 'positionX':
        pokemonUI.positionX = change.value;
        pokemonUI.positionY = pokemon.positionY;
        coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        break;
    
      case 'positionY':
        pokemonUI.positionY = change.value;
        pokemonUI.positionX = pokemon.positionX;
        coordinates = window.transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        break;
      
      case 'item0':
        if(change.value != '' && change.previousValue !== undefined && change.previousValue != change.value){
          pokemonUI.setItem0(change.value);
        }
        break;
      
      case 'item1':
        if(change.value != '' && change.previousValue !== undefined && change.previousValue != change.value){
          pokemonUI.setItem1(change.value);
        }
        break;
      
      case 'item2':
        if(change.value != '' && change.previousValue !== undefined && change.previousValue != change.value){
          pokemonUI.setItem2(change.value);
        }
        break;

      default:
        pokemonUI[change.field] = change.value;
        break;
    }
  }
  
}
