import { GameObjects } from "phaser";

const COLOR_TYPE = Object.freeze({
  NORMAL: "0xada594",
  FIGHTING: "0xa55239",
  FLYING: "0x9cadf7",
  POISON: "0xb55aa5",
  GROUND: "0xd6b55a",
  ROCK: "0xbda55a",
  BUG: "0xadbd21",
  GHOST: "0x6363b5",
  STEEL: "0xadadc6",
  FIRE: "0xf75231",
  WATER: "0x399cff",
  GRASS: "0x7bce52",
  ELECTRIC: "0xffc631",
  PSYCHIC: "0xff73a5",
  ICE: "0x5acee7",
  DRAGON: "0x7b63e7",
  DARK: "0x735a4a",
  FAIRY: "0xf7b5f7"
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
    this.background = new GameObjects.Rectangle(scene, 80, 0, 160, 80, COLOR_TYPE[pokemon.type]);
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