import Bar from "./bar"

export default class PowerBar extends Bar {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    max: number
  ) {
    super(scene, x, y, width, 5, max, 0, "#209cee")
    this.wrap.style.borderTop = "none"
  }
}
