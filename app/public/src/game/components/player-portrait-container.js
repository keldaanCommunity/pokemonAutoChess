import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';

export default class PlayerPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.id = player.id;
    this.textStyle = {
      fontSize: '30px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    };
    this.playerStyle={
      fontSize: '30px',
      fontFamily: "Verdana",
      color: '#ADFF2F',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    }
    let textStyle = this.textStyle;
    if(player.id == window.sessionId){
      textStyle = this.playerStyle;
    }
    const pokemon = PokemonFactory.createPokemonFromName(player.avatar);
    this.background = new GameObjects.Image(scene, -50, 0, pokemon.sheet, `${pokemon.index}/portrait`).setScale(1.5, 1.5);
    this.background.setInteractive({cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`}).on('pointerdown', () => {
      document.getElementById('game').dispatchEvent(new CustomEvent('player-click', {
        detail: {'id': player.id}
      }));
    });
    this.add(this.background);
    this.life = new GameObjects.Text(scene, -20, -30, player.life, textStyle);
    this.add(this.life);
    this.lifeAsset = new GameObjects.Image(scene, 60, -15, 'life', 'life100');
    this.add(this.lifeAsset);
    this.money = new GameObjects.Text(scene, 130, -30, player.money, textStyle);
    this.add(this.money);
    this.add(new GameObjects.Image(scene, 180, -15, 'money').setScale(0.5, 0.5));
    this.add(new GameObjects.Text(scene, 130, 0, 'Lvl ', textStyle));
    this.level = new GameObjects.Text(scene, 180, 0, player.experienceManager.level, textStyle);
    this.add(this.level);
    this.add(new GameObjects.Text(scene, -20, 0, player.name.slice(0, 8), textStyle));
    this.moveManager = scene.plugins.get('rexMoveTo').add(this, {
      speed: 500,
      rotateToTarget: false
    });
  }

  onLifeChange(value) {
    this.life.setText(value);
    let lifeLevel = 'life100';
    if (value <= 80) {
      lifeLevel = 'life80';
    }
    if (value <= 60) {
      lifeLevel = 'life60';
    }
    if (value <= 40) {
      lifeLevel = 'life40';
    }
    if (value <= 20) {
      lifeLevel = 'life20';
    }
    if (value <= 0) {
      lifeLevel = 'life0';
    }
    this.lifeAsset.setTexture('life', lifeLevel);
  }

  onMoneyChange(value) {
    this.money.setText(value);
  }

  onLevelChange(value) {
    this.level.setText(value);
  }

  onRankChange(value){
    this.moveManager.moveTo(0, 102 * value);
  }
}
