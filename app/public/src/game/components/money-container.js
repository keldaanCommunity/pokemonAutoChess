import {GameObjects} from 'phaser';
import {WORDS} from '../../../../models/enum';

export default class MoneyContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.bigTextStyle = {
      fontSize: '30px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    };


    this.add(new GameObjects.Text(scene, 0, 0, `${WORDS.MONEY[window.langage]}`, this.bigTextStyle));
    this.money = new GameObjects.Text(scene, 120, 0, player.money, this.bigTextStyle);
    this.add(new GameObjects.Image(scene, 185, 15, 'money').setScale(0.5, 0.5));
    this.add(this.money);

    this.add(new GameObjects.Text(scene, 0, 40, `${WORDS.BASE[window.langage]}`, this.bigTextStyle));
    this.add(new GameObjects.Text(scene, 120, 40, '+5', this.bigTextStyle));
    this.add(new GameObjects.Image(scene, 185, 58, 'money').setScale(0.5, 0.5));

    this.add(new GameObjects.Text(scene, 0, 80, `${WORDS.STREAK[window.langage]}`, this.bigTextStyle));
    this.streak = new GameObjects.Text(scene, 120, 80, `+${player.streak}`, this.bigTextStyle);
    this.add(new GameObjects.Image(scene, 185, 98, 'money').setScale(0.5, 0.5));
    this.add(this.streak);

    this.add(new GameObjects.Text(scene, 0, 120, `${WORDS.INTEREST[window.langage]}`, this.bigTextStyle));
    this.interest = new GameObjects.Text(scene, 120, 120, `+${player.interest}`, this.bigTextStyle);
    this.add(new GameObjects.Image(scene, 185, 138, 'money').setScale(0.5, 0.5));
    this.add(this.interest);

    this.add(new GameObjects.Text(scene, 0, 160, `${WORDS.WIN[window.langage]}`, this.bigTextStyle));
    this.won = new GameObjects.Text(scene, 120, 160, '+0', this.bigTextStyle);
    this.add(new GameObjects.Image(scene, 185, 178, 'money').setScale(0.5, 0.5));
    this.add(this.won);

    scene.add.existing(this);
  }

  onMoneyChange(value) {
    this.money.setText(value);
  }

  onStreakChange(value) {
    this.streak.setText(`+ ${value}`);
  }

  onInterestChange(value) {
    this.interest.setText(`+ ${value}`);
  }

  onWonChange(value) {
    if (value == 'Win') {
      this.won.setText('+ 1');
    } else {
      this.won.setText('+ 0');
    }
  }
}
