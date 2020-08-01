import {GameObjects} from 'phaser';

export default class PlayerPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.id = player.id;
    this.textStyle = {
      fontSize: '30px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center'
    };
    this.background = new GameObjects.Image(scene, 70, 0, 'user');
    this.background.setInteractive({useHandCursor: true}).on('pointerdown', () => {
      window.dispatchEvent(new CustomEvent('player-click', {
        detail: {'id': player.id}
      }));
    });
    this.add(this.background);
    this.life = new GameObjects.Text(scene, -30, -30, player.life, this.textStyle);
    this.add(this.life);
    this.add(new GameObjects.Image(scene, 30, -15, 'life'));
    this.money = new GameObjects.Text(scene, 60, -30, player.money, this.textStyle);
    this.add(this.money);
    this.add(new GameObjects.Image(scene, 120, -12, 'money').setScale(0.5, 0.5));
    this.add(new GameObjects.Text(scene, 150, -30, 'Lvl ', this.textStyle));
    this.level = new GameObjects.Text(scene, 200, -30, player.experienceManager.level, this.textStyle);
    this.add(this.level);
    this.add(new GameObjects.Text(scene, -30, 0, player.name, this.textStyle));
  }

  onLifeChange(value) {
    this.life.setText(value);
  }

  onMoneyChange(value) {
    this.money.setText(value);
  }

  onLevelChange(value) {
    this.level.setText(value);
  }
}
