import {GameObjects} from 'phaser';

export default class LifeBar extends GameObjects.Graphics {
  value: number;
  color: number;
  width: number;
  p: number;
  drawBg: boolean;
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, life: number, color: number, drawBg: boolean) {
    super(scene);
    this.x = x;
    this.y = y;
    this.value = life;
    this.color = color;
    this.width = width;
    this.p = (this.width - 4) / this.value;
    this.drawBg = drawBg;

    this.draw();

    scene.add.existing(this);
  }

  setLife(amount: number) {
    // console.log(this.objType, amount);
    this.value = amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  draw() {
    this.clear();

    if (this.drawBg) {
    //  BG
      this.fillStyle(0x000000);
      this.fillRect(this.x, this.y, this.width, 10);

      //  Health

      this.fillStyle(0xffffff);
      this.fillRect(this.x + 2, this.y + 2, this.width - 4, 6);
    }

    this.fillStyle(this.color);
    const d = Math.floor(this.p * this.value);
    this.fillRect(this.x + 2, this.y + 2, d, 6);
  }
}
