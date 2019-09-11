import * as PIXI from 'pixi.js'
import SceneManager from './core/SceneManager'

import Clock from '@gamestdio/timer'
window.clock = new Clock();

import Tweener from 'tweener'
window.Tweener = Tweener
window.tweener = new Tweener();

// define endpoint based on environment
const endpoint = (window.location.hostname.indexOf("herokuapp") === -1)
  ? "ws://localhost:3553" // development (local)
  : `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}` // production (remote)

import { Client } from 'colyseus.js'
window.colyseus = new Client(endpoint);

export default class Application {

  constructor () {
    this.background = new PIXI.Sprite.fromImage('images/background.jpg')
    this.background.pivot.x = this.background.width / 2
    this.background.pivot.y = this.background.height / 2

    this.width = 640;
    this.height = 640;

    this.scale = this.getMaxScale();

    // canvas size
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    this.scaledWidth = this.screenWidth / this.scale
    this.scaledHeight = this.screenHeight / this.scale

    // this.renderer = new PIXI.WebGLRenderer(width, height, {
    this.renderer = new PIXI.WebGLRenderer(this.screenWidth, this.screenHeight, {
      // resolution: window.devicePixelRatio,
      antialias: false
    })
    this.renderer.backgroundColor = 0xffffff
    document.body.appendChild(this.renderer.view)

    this.stage = new SceneManager(Application.SCALE_RATIO)
    this.stage.scale.set(this.scale);

    this.container = new PIXI.Container()
    this.background.x = this.screenWidth / 2
    this.background.y = this.screenHeight / 2
    this.container.addChild(this.background)
    this.container.addChild(this.stage)

    tweener.add(this.background).from({ alpha: 0 }, 4000, Tweener.ease.quadOut)

    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()

    // if (this.renderer.view.width > window.innerWidth) {
    //   this.renderer.view.style.position = "absolute"
    //   this.stage.x = (window.innerWidth - this.renderer.view.width) / 2
    // }
  }

  onResize (e) {
    this.background.x = window.innerWidth / 2
    this.background.y = window.innerHeight / 2

    this.scale = this.getMaxScale()

    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    this.scaledWidth = this.screenWidth / this.scale
    this.scaledHeight = this.screenHeight / this.scale

    this.renderer.resize(this.screenWidth, this.screenHeight)

    // this.stage.x = this.screenWidth / 2
    // this.stage.y = this.screenHeight / 2
    this.stage.scale.set(this.scale)

    Application.WIDTH = this.scaledWidth
    Application.HEIGHT = this.scaledHeight
    Application.MARGIN = (this.scaledHeight / 100) * 10

  }

  gotoScene (sceneClass) {
    this.stage.goTo(sceneClass)
  }

  getMaxScale () {
    return Math.min(window.innerWidth / this.width, 1)
  }

  update () {
    window.requestAnimationFrame( this.update.bind( this) )
    clock.tick()

    tweener.update(clock.deltaTime)

    this.renderer.render(this.container)
  }

}
