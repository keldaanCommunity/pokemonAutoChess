import { GameObjects } from "phaser";

export default class MoneyContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.bigTextStyle = {
        fontSize: "30px",
        fontFamily: "Verdana",
        color: "white",
        align: "center"
      };
    this.textStyle = {
        fontSize: "20px",
        fontFamily: "Verdana",
        color: "white",
        align: "center"
      };

    this.add(new GameObjects.Text(scene,0,0,"Money:", this.bigTextStyle));
    this.money = new GameObjects.Text(scene, 120, 0, player.money, this.bigTextStyle);
    this.add(new GameObjects.Image(scene,180,15,"money").setScale(0.5,0.5));
    this.add(this.money);

    this.add(new GameObjects.Text(scene,0, 40,"Base :", this.textStyle));
    this.add(new GameObjects.Text(scene,120, 40,"+ 5", this.textStyle));
    this.add(new GameObjects.Image(scene,180,53,"money").setScale(0.5,0.5));

    this.add(new GameObjects.Text(scene,0, 80,"Streak :", this.textStyle));
    this.streak = new GameObjects.Text(scene, 120, 80, `+ ${player.streak}`, this.textStyle);
    this.add(new GameObjects.Image(scene,180,93,"money").setScale(0.5,0.5));
    this.add(this.streak);

    this.add(new GameObjects.Text(scene,0, 120,"Interest :", this.textStyle));
    this.interest = new GameObjects.Text(scene, 120, 120, `+ ${player.interest}`, this.textStyle);
    this.add(new GameObjects.Image(scene,180,133,"money").setScale(0.5,0.5));
    this.add(this.interest);

    this.add(new GameObjects.Text(scene,0,160,"Win :", this.textStyle));
    this.won = new GameObjects.Text(scene, 120, 160, "+ 0", this.textStyle);
    this.add(new GameObjects.Image(scene,180,173,"money").setScale(0.5,0.5));
    this.add(this.won);

    scene.add.existing(this);
  }

  onMoneyChange(value){
    this.money.setText(value);
  }

  onStreakChange(value){
    this.streak.setText(`+ ${value}`);
  }

  onInterestChange(value){
    this.interest.setText(`+ ${value}`);
  }

  onWonChange(value){
      if(value == "Win"){
        this.won.setText("+ 1");
      }
      else{
        this.won.setText("+ 0");
      }

  }
}