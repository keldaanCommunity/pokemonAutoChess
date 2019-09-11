import * as PIXI from 'pixi.js'

export default class Board extends PIXI.Container {

  constructor () {
    super()

    this.size = 190

    this.background = new PIXI.Sprite.fromImage('images/board.png')
    this.addChild(this.background)

    let slot = new PIXI.Graphics()
    slot.beginFill(0x000000, 0.0)
    slot.drawRect(0, 0, this.size, this.size)

    for (let y=0; y<3; y++) {
      for (let x=0; x<3; x++) {
        let s = slot.clone()
        s.x = x * this.size
        s.y = y * this.size
        s.interactive = true
        s.on('click', this.onSelect.bind(this, x, y))
        s.on('touchend', this.onSelect.bind(this, x, y))
        this.addChild(s)
      }
    }
  }

  set (x, y, value) {
    var label = "";

    if (value === 1) {
      label = "x";

    } else if (value === 2) {
      label = "o"
    }

    var move = new PIXI.Text(label, {
      font: "150px JennaSue",
      fill: '#000',
      textAlign: 'center'
    })
    move.pivot.x = move.width / 2
    move.pivot.y = move.height / 2
    move.x = (x * this.size) + (this.size / 2)
    move.y = (y * this.size) + (this.size / 2) - (move.height * 0.1)

    this.addChild(move)
    tweener.add(move).from({ alpha: 0 }, 300, Tweener.ease.quintOut)
    tweener.add(move.scale).from({x: 2, y: 2}, 500, Tweener.ease.quintOut)
  }

  onSelect (x, y) {
    console.log(x, y)
    this.emit('select', x, y)
  }

}
