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
  constructor(scene, x, y,name, hp, atk, def,speDef, attackType, range, atkSpeed) {
    super(scene, x, y);
    this.pokemonInformation = PokemonFactory.createPokemonFromName(name);
    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'white'
    };
    this.greenTextStyle= {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: '#00ff00'
    };
    this.redTextStyle= {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: '#ff0000'
    };
    this.objType = 'detail';
    this.add(new GameObjects.Rectangle(scene, 80, 80, 160, 120, COLOR_TYPE[this.pokemonInformation.rarity]));
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    this.add(new GameObjects.Text(scene, 5, 20, displayName, this.textStyle));
    this.add(new GameObjects.Image(scene, 140, 40, `${this.pokemonInformation.rarity}`, `${this.pokemonInformation.index}/portrait`));
    for (let i = 0; i < this.pokemonInformation.types.length; i++) {
      this.add(new GameObjects.Image(scene, 30*i +20, 60, 'hexagon').setScale(0.5, 0.5));
      this.add(new GameObjects.Image(scene, 30*i +20, 60, 'types', this.pokemonInformation.types[i]).setScale(0.5, 0.5));
    }
    this.add(new GameObjects.Image(scene,140,70, attackType).setScale(0.5,0.5));
    this.hp = new GameObjects.Text(scene, 20, 80, hp, this.getColorStyle(this.pokemonInformation.hp, hp, false))
    this.add(this.hp);
    this.add(new GameObjects.Image(scene, 60, 90, 'heart'));
    this.atk = new GameObjects.Text(scene, 100, 80, atk, this.getColorStyle(this.pokemonInformation.atk, atk, false));
    this.add(this.atk);
    this.add(new GameObjects.Image(scene, 140, 90, 'sword'));
    this.def = new GameObjects.Text(scene, 20, 100, def, this.getColorStyle(this.pokemonInformation.def, def, false));
    this.add(this.def);
    this.add(new GameObjects.Image(scene, 60, 110, 'shield'));
    this.range = new GameObjects.Text(scene, 100, 100, range, this.getColorStyle(this.pokemonInformation.range, range, false));
    this.add(this.range);
    this.add(new GameObjects.Image(scene, 140, 110, 'range'));
    this.atkSpeed = new GameObjects.Text(scene, 80, 120, atkSpeed, this.getColorStyle(this.pokemonInformation.atkSpeed, atkSpeed, true))
    this.add(this.atkSpeed);
    this.add(new GameObjects.Image(scene, 140, 130, 'range'));
    this.speDef = new GameObjects.Text(scene, 20, 120, speDef, this.getColorStyle(this.pokemonInformation.speDef, speDef, false));
    this.add(this.speDef);
    this.add(new GameObjects.Image(scene, 60, 130, 'shield'));
    this.setDepth(10);
  }



  getColorStyle(original, actual, isAtkSpeed){
    if(isAtkSpeed){
      if(actual > original){
        return this.redTextStyle;
      }
      else if(actual == original){
        return this.textStyle;
      }
      else{
        return this.greenTextStyle;
      }
    }
    else{
      if(original > actual){
        return this.redTextStyle;
      }
      else if(actual == original){
        return this.textStyle;
      }
      else{
        return this.greenTextStyle;
      }
    }
  }
}
