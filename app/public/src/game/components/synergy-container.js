import {GameObjects} from 'phaser';
import Button from './button';
import SynergyDetail from './synergy-detail';

export default class SynergyContainer extends Button {
  constructor(scene, x, y, type) {
    super(scene, x, y, 130, 62);
    this.textStyle = {
      fontSize: '30px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center'
    };

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

    this.textColor = {
      NORMAL: '#6d7050',
      GRASS: '#395b2a',
      FIRE: '#8f4b20',
      WATER: '#38455f',
      ELECTRIC: '#7a681f',
      FIGHTING: '#521816',
      PSYCHIC: '#672439',
      DARK: '#0a0907',
      METAL: '#4c4c52',
      GROUND: '#5f5331',
      POISON: '#4b2247',
      DRAGON: '#353055',
      FIELD: '#516d6b',
      MONSTER: '#07210f',
      HUMAN: '#000000',
      AQUATIC: '#002c46',
      BUG: '#5f6a24',
      FLYING: '#3b3647',
      FLORA: '#180d1c',
      MINERAL: '#3f3817',
      AMORPH: '#2d253b',
      FAIRY: '#82525b'
    };

    this.typeActivation = {
      NORMAL: 3,
      GRASS: 3,
      FIRE: 3,
      WATER: 3,
      ELECTRIC: 1,
      FIGHTING: 2,
      PSYCHIC: 2,
      DARK: 2,
      METAL: 2,
      GROUND: 2,
      POISON: 3,
      DRAGON: 2,
      FIELD: 3,
      MONSTER: 3,
      HUMAN: 2,
      AQUATIC: 3,
      BUG: 2,
      FLYING: 2,
      FLORA: 2,
      MINERAL: 2,
      AMORPH: 2,
      FAIRY: 2
    };


    this.type = type;
    this.color = this.typeColor[type];
    this.colorText = this.textColor[type];
    this.threshold = this.typeActivation[type];
    this.background = new GameObjects.Rectangle(scene, 0, 0, 110, 62, this.color).setVisible(false);
    this.add(this.background);
    this.synergyCount = new GameObjects.Text(scene, 20, -20, '0', this.textStyle);
    this.synergyCount.setColor(this.colorText);
    this.add(this.synergyCount);
    this.add(new GameObjects.Image(scene, -30, 0, 'types', type));
    this.detail = new SynergyDetail(scene, -380, 0, type);
    this.add(this.detail);
    this.setDepth(999);
  }

  updateSynergy(value) {
    this.synergyCount.setText(value);
    if (value >= this.threshold) {
      this.background.setVisible(true);
      this.synergyCount.setColor('#ffffff');
    } else {
      this.background.setVisible(false);
      this.synergyCount.setColor(this.colorText);
    }
  }

  enterButtonHoverState() {
    this.detail.setScale(2, 2);
  }

  enterButtonRestState() {
    this.detail.setScale(0, 0);
  }

  enterButtonActiveState() {
  }
}
