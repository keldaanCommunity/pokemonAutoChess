import { GameObjects } from "phaser";

export default class PlayerPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    this.id = player.id;
    this.textStyle = {
      fontSize: "30px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.background = new GameObjects.Image(scene, 70, 0, "user");
    this.background.setInteractive().on("pointerdown", () => {
      window.dispatchEvent(new CustomEvent("player-click", {
        detail: { "id": player.id }
      }));
    });
    this.add(this.background);
    this.add(new GameObjects.Text(scene, -30, -30, player.life, this.textStyle));
    this.add(new GameObjects.Image(scene, 50, -15, "life"));
    this.add(new GameObjects.Text(scene, -30, 0, player.facebookName, this.textStyle));
    this.add(new GameObjects.Text(scene, 120, -30, "Lvl " + player.experienceManager.level, this.textStyle));
  }
}