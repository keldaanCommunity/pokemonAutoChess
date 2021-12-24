import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';
import {SPECIAL_SKILL_DESCRIPTION, RARITY} from '../../../../models/enum';

export default class PokemonDetail extends GameObjects.Container {
  constructor(scene, x, y, name, hp, atk, def, speDef, attackType, range, atkSpeed, critChance) {
    super(scene, x, y);
    this.pokemonInformation = PokemonFactory.createPokemonFromName(name);

    this.textStyle = {
      fontSize: '20px',
      fontFamily: "'Press Start 2P'",
      color: '#000000',
      align: 'center',
      wordWrap: {width: 500, useAdvancedWrap: true}
    };
    this.greenTextStyle= {
      fontSize: '20px',
      fontFamily: "'Press Start 2P'",
      color: '#013220'
    };
    this.redTextStyle= {
      fontSize: '20px',
      fontFamily: "'Press Start 2P'",
      color: '#991701'
    };
    this.titleTextStyle = {
      fontSize: '20px',
      fontFamily: "'Press Start 2P'",
      color: '#013220',
      align: 'center',
      wordWrap: {width: 400, useAdvancedWrap: true}
    }

    let displayName;
    if(window.langage == 'fra'){
      displayName = this.pokemonInformation.frenchName.charAt(0).toUpperCase() + this.pokemonInformation.frenchName.slice(1);
    }
    else{
      displayName = this.pokemonInformation.name.charAt(0).toUpperCase() + this.pokemonInformation.name.slice(1);
    }

    this.objType = 'detail';
    this.add(new GameObjects.Rectangle(scene, 360, 100, 720, 200, 0xffffff, 0.7).setStrokeStyle(3,0x000000,1));
    this.add(new GameObjects.Text(scene, 45, 15, displayName, this.greenTextStyle));
    this.add(new GameObjects.Image(scene, 22, 22, this.pokemonInformation.sheet, `${this.pokemonInformation.index}/portrait`));
    for (let i = 0; i < this.pokemonInformation.types.length; i++) {
      this.add(new GameObjects.Image(scene, 40*i +25, 60, 'types', this.pokemonInformation.types[i]));
    }
    this.add(new GameObjects.Image(scene, 150, 60, attackType));
    this.hp = new GameObjects.Text(scene, 20, 90, hp, this.getColorStyle(this.pokemonInformation.hp, hp, false));
    this.add(this.hp);
    this.add(new GameObjects.Image(scene, 100, 100, 'icons', 'hp').setScale(2, 2));
    this.atk = new GameObjects.Text(scene, 130, 90, atk, this.getColorStyle(this.pokemonInformation.atk, atk, false));
    this.add(this.atk);
    this.add(new GameObjects.Image(scene, 200, 100, 'icons', 'atk').setScale(2, 2));
    this.def = new GameObjects.Text(scene, 20, 110, def, this.getColorStyle(this.pokemonInformation.def, def, false));
    this.add(this.def);
    this.add(new GameObjects.Image(scene, 100, 120, 'icons', 'def').setScale(2, 2));
    this.range = new GameObjects.Text(scene, 130, 110, range, this.getColorStyle(this.pokemonInformation.range, range, false));
    this.add(this.range);
    this.add(new GameObjects.Image(scene, 200, 120, 'icons', 'range').setScale(2, 2));
    this.atkSpeed = new GameObjects.Text(scene, 110, 130, atkSpeed, this.getColorStyle(this.pokemonInformation.atkSpeed, atkSpeed, true));
    this.add(this.atkSpeed);
    this.add(new GameObjects.Image(scene, 200, 140, 'icons', 'atkSpeed').setScale(2, 2));
    this.speDef = new GameObjects.Text(scene, 20, 130, speDef, this.getColorStyle(this.pokemonInformation.speDef, speDef, false));
    this.add(this.speDef);
    this.add(new GameObjects.Image(scene, 100, 140, 'icons', 'speDef').setScale(2, 2));
    this.critChance = new GameObjects.Text(scene, 130, 150, critChance, this.textStyle);
    this.add(this.critChance);
    this.add(new GameObjects.Image(scene,200, 160, 'icons', 'critChance').setScale(2,2));
    this.mana = new GameObjects.Text(scene, 10, 150, this.pokemonInformation.maxMana, this.textStyle);
    this.add(this.mana);
    this.add(new GameObjects.Image(scene, 100, 160, 'icons', 'mana').setScale(2, 2));
    this.add(new GameObjects.Text(scene, 380, 15, SPECIAL_SKILL_DESCRIPTION[this.pokemonInformation.skill].title[window.langage], this.titleTextStyle));
    this.add(new GameObjects.Text(scene, 230, 40, SPECIAL_SKILL_DESCRIPTION[this.pokemonInformation.skill].description[window.langage], this.textStyle));
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
