import { GameObjects } from "phaser";

const COLOR_TYPE = Object.freeze({
  COMMON: 0x686d7d,
  UNCOMMON: 0x478a41,
  RARE: 0x5062ab,
  EPIC: 0x7b469c,
  LEGENDARY: 0xa6802e
});

export default class PokemonDetail extends GameObjects.Container {
  constructor(scene, x, y, pokemon) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.background = new GameObjects.Rectangle(scene, 80, 25, 200, 120, COLOR_TYPE[pokemon.rarity]);
    this.add(this.background);
  }
}