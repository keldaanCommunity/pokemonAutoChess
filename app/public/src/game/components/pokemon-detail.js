import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';
import {SPECIAL_SKILL_DESCRIPTION, RARITY} from '../../../../models/enum';


const COLOR_TYPE = Object.freeze({
  COMMON: 0x686d7d,
  NEUTRAL: 0x686d7d,
  UNCOMMON: 0x478a41,
  RARE: 0x5062ab,
  EPIC: 0x7b469c,
  LEGENDARY: 0xa6802e,
  MYTHICAL: 0xffdeff,
  SUMMON: 0x991f1f
});

export default class PokemonDetail extends GameObjects.Container {
  constructor(scene, x, y, name, hp, atk, def, speDef, attackType, range, atkSpeed, critChance) {
    super(scene, x, y);
    this.pokemonInformation = PokemonFactory.createPokemonFromName(name);
    let color = 'white';
    if(this.pokemonInformation.rarity == RARITY.MYTHICAL){
      color = '#1f1f1f';
    }
    this.textStyle = {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: color,
      align: 'center',
      wordWrap: {width: 200, useAdvancedWrap: true}
    };
    this.greenTextStyle= {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: '#00ff00'
    };
    this.redTextStyle= {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: '#ff0000'
    };
    this.titleTextStyle = {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: '#06ec88',
      align: 'center',
      wordWrap: {width: 200, useAdvancedWrap: true}
    }

    let displayName;
    if(window.langage == 'fra'){
      displayName = this.pokemonInformation.frenchName.charAt(0).toUpperCase() + this.pokemonInformation.frenchName.slice(1);
    }
    else{
      displayName = this.pokemonInformation.name.charAt(0).toUpperCase() + this.pokemonInformation.name.slice(1);
    }

    this.objType = 'detail';
    this.add(new GameObjects.Rectangle(scene, 190, 90, 370, 140, COLOR_TYPE[this.pokemonInformation.rarity]));
    this.add(new GameObjects.Text(scene, 5, 20, displayName, this.textStyle));
    this.add(new GameObjects.Image(scene, 140, 40, this.pokemonInformation.sheet, `${this.pokemonInformation.index}/portrait`));
    for (let i = 0; i < this.pokemonInformation.types.length; i++) {
      this.add(new GameObjects.Image(scene, 30*i +20, 60, 'types', this.pokemonInformation.types[i]));
    }
    this.add(new GameObjects.Image(scene, 140, 70, attackType).setScale(0.5, 0.5));
    this.hp = new GameObjects.Text(scene, 20, 80, hp, this.getColorStyle(this.pokemonInformation.hp, hp, false));
    this.add(this.hp);
    this.add(new GameObjects.Image(scene, 60, 90, 'icons', 'hp').setScale(2, 2));
    this.atk = new GameObjects.Text(scene, 100, 80, atk, this.getColorStyle(this.pokemonInformation.atk, atk, false));
    this.add(this.atk);
    this.add(new GameObjects.Image(scene, 140, 90, 'icons', 'atk').setScale(2, 2));
    this.def = new GameObjects.Text(scene, 20, 100, def, this.getColorStyle(this.pokemonInformation.def, def, false));
    this.add(this.def);
    this.add(new GameObjects.Image(scene, 60, 110, 'icons', 'def').setScale(2, 2));
    this.range = new GameObjects.Text(scene, 100, 100, range, this.getColorStyle(this.pokemonInformation.range, range, false));
    this.add(this.range);
    this.add(new GameObjects.Image(scene, 140, 110, 'icons', 'range').setScale(2, 2));
    this.atkSpeed = new GameObjects.Text(scene, 80, 120, atkSpeed, this.getColorStyle(this.pokemonInformation.atkSpeed, atkSpeed, true));
    this.add(this.atkSpeed);
    this.add(new GameObjects.Image(scene, 140, 130, 'icons', 'atkSpeed').setScale(2, 2));
    this.speDef = new GameObjects.Text(scene, 20, 120, speDef, this.getColorStyle(this.pokemonInformation.speDef, speDef, false));
    this.add(this.speDef);
    this.add(new GameObjects.Image(scene, 60, 130, 'icons', 'speDef').setScale(2, 2));
    this.critChance = new GameObjects.Text(scene, 100, 140, critChance, this.textStyle);
    this.add(this.critChance);
    this.add(new GameObjects.Image(scene,140, 150, 'icons', 'critChance').setScale(2,2));
    this.mana = new GameObjects.Text(scene, 10, 140, this.pokemonInformation.maxMana, this.textStyle);
    this.add(this.mana);
    this.add(new GameObjects.Image(scene, 60, 150, 'icons', 'mana').setScale(2, 2));
    this.add(new GameObjects.Text(scene, 180, 20, SPECIAL_SKILL_DESCRIPTION[this.pokemonInformation.skill].title[window.langage], this.titleTextStyle));
    this.add(new GameObjects.Text(scene, 180, 40, SPECIAL_SKILL_DESCRIPTION[this.pokemonInformation.skill].description[window.langage], this.textStyle));
  }


  getColorStyle(original, actual, isAtkSpeed) {
    if (isAtkSpeed) {
      if (actual > original) {
        return this.redTextStyle;
      } else if (actual == original) {
        return this.textStyle;
      } else {
        return this.greenTextStyle;
      }
    } else {
      if (original > actual) {
        return this.redTextStyle;
      } else if (actual == original) {
        return this.textStyle;
      } else {
        return this.greenTextStyle;
      }
    }
  }
}
