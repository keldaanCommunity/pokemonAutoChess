export default class SceneManager extends PIXI.Container {

  constructor (ratio) {
    super()

    this.scale.x = ratio
    this.scale.y = ratio

    this.currentScene = null
    this.nextScene = null

    this.sceneInstanceMap = {}
  }

  goTo (screenClass, options = {}) {
    var screenName = screenClass.name

    if (!this.sceneInstanceMap[ screenName ]) {
      this.sceneInstanceMap[ screenName ] = new screenClass(options)
      this.sceneInstanceMap[ screenName ].__callbacks = {}

      this.bindEvents( this.sceneInstanceMap[ screenName ] )
    }

    if (this.currentScene) {
      this.nextScene = this.sceneInstanceMap[ screenName ]

      let transitionOut = (!this.currentScene.transitionOut)
        ? this.defaultTransitionOut(this.currentScene)
        : this.currentScene.transitionOut()

      transitionOut.then(() => {
        this.transitionOutCallback(this.currentScene)

        let transitionIn = (!this.nextScene.transitionIn)
          ? this.defaultTransitionIn(this.nextScene)
          : this.nextScene.transitionIn()

        // add next scene to display list
        this.addChild(this.nextScene)
        this.currentScene = this.nextScene
        this.nextScene = null
      })

    } else {
      this.currentScene = this.sceneInstanceMap[ screenName ]
      let transitionIn = (!this.currentScene.transitionIn)
        ? this.defaultTransitionIn(this.currentScene)
        : this.currentScene.transitionIn()

      // add next scene to display list
      this.addChild(this.currentScene)
    }
  }

  bindEvents (scene) {
    if (scene.onResize) {
      let resizeCallback = scene.onResize.bind(scene)
      window.addEventListener('resize', resizeCallback)
      this.sceneInstanceMap[ scene.constructor.name ].__callbacks['resize'] = resizeCallback
      resizeCallback()
    }

    scene.on('goto', (...args) => this.goTo.apply(this, args))
  }

  defaultTransitionIn (scene) {
    return tweener.add(scene).
      from({ alpha: 0 }, 800, Tweener.ease.quintOut)
  }

  defaultTransitionOut (scene) {
    return tweener.add(scene).
      to({ alpha: 0 }, 800, Tweener.ease.quintOut)
  }

  transitionOutCallback (scene) {
    // dispose & remove all scene references on transition-out
    scene.emit('dispose')

    let instance = this.sceneInstanceMap[ scene.constructor.name ]
    if (instance) {
      // callbacks
      let callbacks = instance.__callbacks
      for (let event in callbacks) {
        window.removeEventListener(event, callbacks[event])
      }
      delete this.sceneInstanceMap[ scene.constructor.name ]
    }

    scene.off()
    this.removeChild(scene)
  }

}
