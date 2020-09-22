import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';

export default class DpsContainer extends GameObjects.Container {
  constructor(scene, x, y, id, name, damage) {
    super(scene, x, y);
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
    this.add(new GameObjects.Image(scene,40,0, this.pokemon.rarity, `${this.pokemon.index}/portrait`));
    this.add(new GameObjects.Text(scene,70,0,this.name,this.textStyle));
    this.damageText = new GameObjects.Text(scene,150,0,this.damage,this.textStyle);
    this.add(this.damageText);
  }

    changeDamage(damage){
        this.damageText.setText(damage);
    }

}
