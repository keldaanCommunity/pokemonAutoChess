import {GameObjects} from 'phaser';
import Button from './button';
import LifeBar from './life-bar';
import {WORDS} from '../../../../models/enum';

export default class LevelUpButton extends Button {
  constructor(scene, x, y, manager) {
    super(scene, x, y, 200, 50);
    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center'
    };


    const graphics = new GameObjects.Graphics(scene);
    const color = 0xffffff;
    const thickness = 1;
    const alpha = 1;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(-100, -25, 200, 50);

    this.manager = manager;
    this.add(new GameObjects.Rectangle(scene, 0, 0, 200, 50, 0x484331));
    this.add(graphics);
    this.add(new GameObjects.Text(scene, -80, -25, WORDS.BUY_XP[window.langage], this.textStyle));
    this.add(new GameObjects.Text(scene, 57, -25, '4', this.textStyle));
    this.add(new GameObjects.Image(scene, 85, -12, 'money').setScale(0.5, 0.5));
    this.lifebar = new LifeBar(scene, 20, 8, 100, 0x5062ab);
    this.add(this.lifebar);
    this.level = new GameObjects.Text(scene, -100, 0, `Lvl ${manager.level}`, this.textStyle);
    this.experience = new GameObjects.Text(scene, 43, -5, ` ${manager.experience}`, this.textStyle);
    this.expNeeded = new GameObjects.Text(scene, 75, -5, ` ${manager.expNeeded}`, this.textStyle);
    this.add(new GameObjects.Text(scene, 65, -5, '/', this.textStyle));
    this.add(this.level);
    this.add(this.experience);
    this.add(this.expNeeded);
    this.updateLifeBar();
  }

  changeLevel() {
    this.level.setText(`Lvl ${this.manager.level}`);
  }

  changeExperience() {
    this.experience.setText(`${this.manager.experience}`);
    this.updateLifeBar();
  }

  changeExpNeeded() {
    this.expNeeded.setText(`${this.manager.expNeeded}`);
    this.updateLifeBar();
  }

  updateLifeBar() {
    this.lifebar.setLife(Math.round(this.manager.experience * 100 / this.manager.expNeeded));
  }

  enterButtonHoverState() {

  }

  enterButtonRestState() {

  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent('level-click'));
  }
}
