import { GameObjects, Game } from "phaser";

const COLOR_TYPE = Object.freeze({
  COMMON: 0x686d7d,
  UNCOMMON: 0x478a41,
  RARE: 0x5062ab,
  EPIC: 0x7b469c,
  LEGENDARY: 0xa6802e
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
    this.background = new GameObjects.Rectangle(scene, 80, 25, 200, 120, COLOR_TYPE[pokemon.rarity]);
    this.background.setInteractive().on("pointerdown", () => {
      window.dispatchEvent(new CustomEvent("shop-click", {
        detail: { "id": pokemon.id }
      }));
    });
    let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    this.add(this.background);
    for (let i = 0; i < pokemon.types.length; i++) {
      this.add(new GameObjects.Text(scene,90,23 * i -10, pokemon.types[i].charAt(0) + pokemon.types[i].slice(1).toLowerCase(),this.textStyle));
      this.add(new GameObjects.Image(scene,75, 23 * i, "hexagon").setScale(0.5,0.5));
      this.add(new GameObjects.Image(scene,75,23 * i, "types", pokemon.types[i]).setScale(0.5,0.5));
    }
    this.add(new GameObjects.Image(scene, 20, 5, `${pokemon.rarity}`, `${pokemon.index}/portrait`).setScale(2, 2));

    if(pokemon.rarity != "COMMON"){
      this.add(new GameObjects.Image(scene,80,-28,"rarity", pokemon.rarity));
    }
    this.add(new GameObjects.Text(scene, -10, 55, name, this.textStyle));
    this.add(new GameObjects.Text(scene, 130, 55, pokemon.cost, this.textStyle));
    this.add(new GameObjects.Image(scene, 160, 67, "money").setScale(0.5, 0.5));
  }
}