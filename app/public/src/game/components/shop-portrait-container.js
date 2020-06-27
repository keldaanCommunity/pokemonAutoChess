import { GameObjects } from "phaser";

const COLOR_TYPE = Object.freeze({
  COMMON: 0x646464,
  UNCOMMON: 0x2eab30,
  RARE: 0x3355b0,
  EPIC: 0x7933b0,
  LEGENDARY: 0xffa200
});

export default class ShopPortraitContainer extends GameObjects.Container {
  constructor(scene, x, y, pokemon) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.background = new GameObjects.Rectangle(scene, 80, 0, 160, 80, COLOR_TYPE[pokemon.rarity]);
    this.background.setInteractive().on("pointerdown", () => {
      window.dispatchEvent(new CustomEvent("shop-click", {
        detail: { "id": pokemon.id }
      }));
    });
    this.add(this.background);
    this.add(new GameObjects.Image(scene, 0, 0, `${pokemon.rarity}`, `${pokemon.index}/portrait`).setScale(2, 2));
    this.add(new GameObjects.Text(scene, 40, 0, pokemon.name, this.textStyle));
    this.add(new GameObjects.Text(scene, 110, -33, pokemon.cost, this.textStyle));
    this.add(new GameObjects.Image(scene, 140, -20, "money").setScale(0.5, 0.5));
  }
}