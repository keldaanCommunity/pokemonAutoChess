import * as PIXI from 'pixi.js'
import Application from '../Application'
import GameScreen from './GameScreen'

export default class TitleScreen extends PIXI.Container {

  constructor () {
    super()

    this.title = new PIXI.Sprite.fromImage("images/logo.png")
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("touch to start", {
      font: "62px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    this.studio = new PIXI.Sprite.fromImage('images/arnaudgregoireInteractive.png')
    this.studio.pivot.x = this.studio.width / 2;
    this.addChild(this.studio);

    this.colyseus = new PIXI.Sprite.fromImage('images/colyseus.png')
    this.colyseus.pivot.x = this.colyseus.width / 2;
    this.addChild(this.colyseus)


    this.interactive = true
    this.once('click', this.startGame.bind(this))
    this.once('touchstart', this.startGame.bind(this))
    this.on('dispose', this.onDispose.bind(this))
  }

  transitionIn () {
    tweener.add(this.title).from({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quadOut)
    tweener.add(this.colyseus).from({ y: this.colyseus.y + 10, alpha: 0 }, 300, Tweener.ease.quadOut)
    tweener.add(this.studio).from({ y: this.studio.y + 10, alpha: 0 }, 300, Tweener.ease.quadOut)
    return tweener.add(this.instructionText).from({ alpha: 0 }, 300, Tweener.ease.quadOut)
  }

  transitionOut () {
    tweener.remove(this.title)
    tweener.remove(this.colyseus)
    tweener.remove(this.instructionText)
    tweener.remove(this.studio);

    tweener.add(this.title).to({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
    tweener.add(this.colyseus).to({ y: this.colyseus.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)
    tweener.add(this.studio).to({ y: this.studio.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)
    return tweener.add(this.instructionText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
  }

  startGame () {
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.title.x = Application.WIDTH / 2;
    this.title.y = Application.MARGIN

    this.instructionText.x = Application.WIDTH / 2
    this.instructionText.y = Application.HEIGHT / 2 - this.instructionText.height / 3.8

    this.colyseus.x =  3 * Application.WIDTH /  4
    this.colyseus.y = Application.HEIGHT - this.colyseus.height - Application.MARGIN

    this.studio.x = Application.WIDTH / 4
    this.studio.y = Application.HEIGHT - this.colyseus.height - Application.MARGIN
  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}




