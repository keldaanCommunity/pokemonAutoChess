import Pokemon from './pokemon';
import {transformCoordinate} from '../../pages/utils/utils';
import { IPlayer, IPokemon } from '../../../../types';
import { DataChange } from '@colyseus/schema';
import AnimationManager from '../animation-manager';
import GameScene from '../scenes/game-scene';
import { PKM_ACTION } from '../../../../models/enum';

export default class BoardManager {

  pokemons: Map<string, Pokemon>;
  uid: string;
  scene: GameScene;
  player: IPlayer;
  mode: string;
  animationManager: AnimationManager;

  constructor(scene: GameScene, player: IPlayer, animationManager: AnimationManager, uid: string) {
    this.pokemons = new Map<string, Pokemon>();
    this.uid = uid;
    this.scene = scene;
    this.player = player;
    this.mode = 'pick';
    this.animationManager = animationManager;
    this.buildPokemons();
  }

  addPokemon(pokemon: IPokemon) {
    // console.log(pokemon.name, this.mode);
    const coordinates = transformCoordinate(pokemon.positionX, pokemon.positionY);
    let pokemonUI;

    if (this.uid == this.player.id) {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, true, true);
    } else {
      pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, false, true);
    }
    this.animationManager.animatePokemon(pokemonUI, PKM_ACTION.IDLE);
    this.pokemons.set(pokemonUI.id, pokemonUI);
    if (pokemon.positionY != 0 && this.mode == 'battle') {
      pokemonUI.setVisible(false);
    }
  }


  removePokemon(pokemonToRemove: IPokemon) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id);
    if (pokemonUI) {
      pokemonUI.destroy(true);
    }
  }

  buildPokemons() {
    this.player.board.forEach((pokemon, key) => {
      this.addPokemon(pokemon);
    });
  }

  battleMode() {
    // console.log('battleMode');
    this.mode = 'battle';
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false);
      }
    });
  }

  pickMode() {
    // console.log('pickMode');
    this.mode = 'pick';
    this.pokemons.forEach((pokemon) => {
      pokemon.setVisible(true);
    });
  }

  setPlayer(player: IPlayer) {
    if(this.mode == 'battle'){
      return
    }

    if (player.id != this.player.id) {
      this.pokemons.forEach((pokemon, key) => {
        pokemon.destroy(true);
      });
      this.player = player;
      this.buildPokemons();
    }
  }

  addPokemonItem(playerId: string, value: string, pokemon: IPokemon) {
    // console.log(change);
    if (this.player.id == playerId) {
      const pkm = this.pokemons.get(pokemon.id);
      if (pkm && !pkm.itemsContainer.findItem(value)) {
        pkm.itemsContainer.addItem(value);
      }
    }
  }

  removePokemonItem(playerId: string, value: string, pokemon: IPokemon) {
    if (this.player.id == playerId) {
      if (this.player.id == playerId) {
        const pkm = this.pokemons.get(pokemon.id);
        if (pkm) {
          pkm.itemsContainer.removeItem(value);
        }
      }
    }
  }

  changePokemon(pokemon: IPokemon, change: DataChange<any>) {
    // console.log('change', change.field, pokemon.name);
    const pokemonUI = this.pokemons.get(pokemon.id);
    let coordinates;
    switch (change.field) {
      case 'positionX':
        pokemonUI.positionX = change.value;
        pokemonUI.positionY = pokemon.positionY;
        coordinates = transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        break;

      case 'positionY':
        pokemonUI.positionY = change.value;
        pokemonUI.positionX = pokemon.positionX;
        coordinates = transformCoordinate(pokemon.positionX, pokemon.positionY);
        pokemonUI.x = coordinates[0];
        pokemonUI.y = coordinates[1];
        if (pokemonUI.positionY != 0 && this.mode == 'battle') {
          pokemonUI.setVisible(false);
        }
        break;

      default:
        pokemonUI[change.field] = change.value;
        break;
    }
  }
}
