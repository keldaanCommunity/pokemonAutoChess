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
      window.dispatchEvent(new CustomEvent("playerClick", {
        detail: { "id": player.id }
      }));
    });
    this.add(this.background);
    this.add(new GameObjects.Text(scene, -30, 0, player.facebookName, this.textStyle));
    this.add(new GameObjects.Text(scene, 50, -30, "Lvl " + player.experienceManager.level, this.textStyle));
  }
}