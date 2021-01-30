import {GameObjects} from 'phaser';
import PokemonFactory from '../../../../models/pokemon-factory';

export default class PlayerPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.id = player.id;
    this.textStyle = {
      fontSize: '30px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    };
    const pokemon = PokemonFactory.createPokemonFromName(player.avatar);
    this.background = new GameObjects.Image(scene, -50, 0, pokemon.rarity, `${pokemon.index}/portrait`).setScale(1.5, 1.5);
    this.background.setInteractive({useHandCursor: true}).on('pointerdown', () => {
      window.dispatchEvent(new CustomEvent('player-click', {
        detail: {'id': player.id}
      }));
    });
    this.add(this.background);
    this.life = new GameObjects.Text(scene, -20, -30, player.life, this.textStyle);
    this.add(this.life);
    this.lifeAsset = new GameObjects.Image(scene, 60, -15, 'life', 'life100');
    this.add(this.lifeAsset);
    this.money = new GameObjects.Text(scene, 130, -30, player.money, this.textStyle);
    this.add(this.money);
    this.add(new GameObjects.Image(scene, 180, -12, 'money').setScale(0.5, 0.5));
    this.add(new GameObjects.Text(scene, 130, 0, 'Lvl ', this.textStyle));
    this.level = new GameObjects.Text(scene, 180, 0, player.experienceManager.level, this.textStyle);
    this.add(this.level);
    this.add(new GameObjects.Text(scene, -20, 0, player.name.slice(0, 8), this.textStyle));
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
}
