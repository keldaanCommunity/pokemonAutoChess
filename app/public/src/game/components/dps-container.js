import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';

export default class DpsContainer extends GameObjects.Container {
  constructor(scene, x, y, id, name, damage) {
    super(scene, x, y);

    this.typeColor = {
      NORMAL: 0x6d7050,
      GRASS: 0x395b2a,
      FIRE: 0x8f4b20,
      WATER: 0x38455f,
      ELECTRIC: 0x7a681f,
      FIGHTING: 0x521816,
      PSYCHIC: 0x672439,
      DARK: 0x0a0907,
      METAL: 0x4c4c52,
      GROUND: 0x5f5331,
      POISON: 0x4b2247,
      DRAGON: 0x353055,
      FIELD: 0x516d6b,
      MONSTER: 0x07210f,
      HUMAN: 0x000000,
      AQUATIC: 0x002c46,
      BUG: 0x5f6a24,
      FLYING: 0x3b3647,
      FLORA: 0x180d1c,
      MINERAL: 0x3f3817,
      AMORPH: 0x2d253b,
      FAIRY: 0x82525b
    };
    
    this.name = name;
    this.id = id;
    this.damage = damage;
    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'black',
      align: 'center'
    };
    this.pokemon = PokemonFactory.createPokemonFromName(this.name);
    const nameText = this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
    this.add(new GameObjects.Image(scene,25,0, this.pokemon.sheet, `${this.pokemon.index}/portrait`));
    this.add(new GameObjects.Text(scene,50,-25,nameText,this.textStyle));
    this.damageText = new GameObjects.Text(scene,150,0,this.damage,this.textStyle);
    this.damageBar = new GameObjects.Rectangle(scene,90,29,170,15,this.typeColor[this.pokemon.types[0]]);
    this.damageBar.setScale(0,1);
    this.add(this.damageText);
    this.add(this.damageBar);
  }

    updateDps(maxDamage){
          this.scene.tweens.add({
            targets: this.damageBar,
            scaleX: this.damage/maxDamage,
            scaleY: 1,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        //this.damageBar.setScale(this.damage/maxDamage,1);
        //this.damageBar.setDisplayOrigin(this.damageBar.displayWidth/2,7);
    }

}
