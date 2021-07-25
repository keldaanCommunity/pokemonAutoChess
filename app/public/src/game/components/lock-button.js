import {GameObjects} from 'phaser';
import Button from './button';

export default class LockButton extends Button {
  constructor(scene, player, x, y) {
    super(scene, x, y, 50, 50);
    this.textStyle = {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center'
    };
    this.player = player;
    this.lock = new GameObjects.Image(scene, 0, 0, 'lock', 'unlocked').setScale(0.5, 0.5);
    this.add(this.lock);

    const graphics = new GameObjects.Graphics(scene);
    const color = 0x000000;
    const thickness = 1;
    const alpha = 1;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(-25, -25, 50, 50);
    this.add(graphics);

    this.updateState();
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    document.getElementById('game').dispatchEvent(new CustomEvent('lock-click'));
  }

  updateState() {
    if (this.player.shopLocked) {
      this.lock.setTexture('lock', 'locked');
    } else {
      this.lock.setTexture('lock', 'unlocked');
    }
  }
}
