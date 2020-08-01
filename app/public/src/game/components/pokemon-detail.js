import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';


const COLOR_TYPE = Object.freeze({
  COMMON: 0x686d7d,
  NEUTRAL: 0x686d7d,
  UNCOMMON: 0x478a41,
  RARE: 0x5062ab,
  EPIC: 0x7b469c,
  LEGENDARY: 0xa6802e
});

export default class PokemonDetail extends GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.pokemonInformation = PokemonFactory.createPokemonFromName(name);
    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'white'
    };
    this.objType = 'detail';
    this.add(new GameObjects.Rectangle(scene, 80, 60, 160, 120, COLOR_TYPE[this.pokemonInformation.rarity]));
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    this.add(new GameObjects.Text(scene, 10, 20, displayName, this.textStyle));
    this.add(new GameObjects.Image(scene, 120, 40, `${this.pokemonInformation.rarity}`, `${this.pokemonInformation.index}/portrait`));
    for (let i = 0; i < this.pokemonInformation.types.length; i++) {
      this.add(new GameObjects.Image(scene, 30*i +20, 60, 'hexagon').setScale(0.5, 0.5));
      this.add(new GameObjects.Image(scene, 30*i +20, 60, 'types', this.pokemonInformation.types[i]).setScale(0.5, 0.5));
    }

    this.add(new GameObjects.Text(scene, 20, 80, this.pokemonInformation.hp, this.textStyle));
    this.add(new GameObjects.Image(scene, 60, 90, 'heart'));
    this.add(new GameObjects.Text(scene, 100, 80, this.pokemonInformation.atk, this.textStyle));
    this.add(new GameObjects.Image(scene, 140, 90, 'sword'));
    this.add(new GameObjects.Text(scene, 20, 100, this.pokemonInformation.def, this.textStyle));
    this.add(new GameObjects.Image(scene, 60, 110, 'shield'));
    this.add(new GameObjects.Text(scene, 100, 100, this.pokemonInformation.range, this.textStyle));
    this.add(new GameObjects.Image(scene, 140, 110, 'range'));
  }
}
