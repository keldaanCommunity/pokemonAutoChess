import {GameObjects} from 'phaser';
import {TYPE_TRADUCTION, RARITY} from '../../../../models/enum';

const COLOR_TYPE = Object.freeze({
  COMMON: 0x686d7d,
  UNCOMMON: 0x478a41,
  RARE: 0x5062ab,
  EPIC: 0x7b469c,
  LEGENDARY: 0xa6802e,
  MYTHICAL: 0xffdeff,
  SUMMON: 0x991f1f
});

export default class ShopPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, pokemon) {
    super(scene, x, y);
    let color = 'white';
    if(pokemon.rarity == RARITY.MYTHICAL){
      color = '#1f1f1f';
    }
    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: color,
      align: 'center'
    };

    const self = this;
    this.background = new GameObjects.Rectangle(scene, 80, 25, 200, 120, COLOR_TYPE[pokemon.rarity]);
    this.background.setInteractive({cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`}).on('pointerdown', () => {
      document.getElementById('game').dispatchEvent(new CustomEvent('shop-click', {
        detail: {'id': self.positionInShop}
      }));
    });
    let name;
    if(window.langage == 'fra'){
      name = pokemon.frenchName.charAt(0).toUpperCase() + pokemon.frenchName.slice(1);
    }
    else{
      name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    }
    this.add(this.background);
    for (let i = 0; i < pokemon.types.length; i++) {
      this.add(new GameObjects.Image(scene, 80 + 40*i, 15, 'types', pokemon.types[i]));
    }
    this.add(new GameObjects.Image(scene, 20, 5, pokemon.sheet, `${pokemon.index}/portrait`).setScale(2, 2));
    this.add(new GameObjects.Image(scene, 160, -24, pokemon.attackType));
    if (pokemon.rarity != 'COMMON') {
      this.add(new GameObjects.Image(scene, 80, -28, 'rarity', pokemon.rarity));
    }
    this.add(new GameObjects.Text(scene, -10, 55, name, this.textStyle));
    this.add(new GameObjects.Text(scene, 130, 55, pokemon.cost, this.textStyle));
    this.add(new GameObjects.Image(scene, 160, 67, 'money').setScale(0.5, 0.5));
  }
}
