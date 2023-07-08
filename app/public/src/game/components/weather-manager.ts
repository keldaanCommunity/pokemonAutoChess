import Phaser from "phaser"

export default class WeatherManager {
  scene: Phaser.Scene
  screen: Phaser.Geom.Rectangle
  colorFilter: Phaser.GameObjects.Rectangle | undefined
  particlesEmitters: Phaser.GameObjects.Particles.ParticleEmitter[]
  image: Phaser.GameObjects.Image | undefined

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.screen = new Phaser.Geom.Rectangle(0, 0, 2000, 1000)
    this.particlesEmitters = []
    this.scene.cameras.main.initPostPipeline()
  }

  addRain() {
    const offscreenSource = { x: { min: 0, max: 2000 }, y: { min: 0, max: 100 } }

    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0x296383,
        0.3
      ).setDepth(8)
    )
    
    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "rain", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 50,
        speedY: { min: 260, max: 280 },
        lifespan: 5000,
        scale: 0.5
      })
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "rain", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 100,
        speedY: { min: 360, max: 380 },
        lifespan: 5000,
        scale: 0.8
      })
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "rain", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 200,
        quantity: 4,
        speedY: { min: 460, max: 480 },
        lifespan: 5000
      })
    )
  }

  addSnow() {
    const offscreenSource = { x: { min: 0, max: 2000 }, y: { min: 0, max: 100 } }
    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0xa7cade,
        0.3
      ).setDepth(8)
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "snowflakes", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 10,
        speedY: { min: 70, max: 80 },
        lifespan: 5000,
        scale: 0.5
      })
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "snowflakes", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 20,
        speedY: { min: 100, max: 110 },
        lifespan: 5000,
        scale: 0.8
      })
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "snowflakes", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 40,
        speedY: { min: 200, max: 210 },
        lifespan: 5000
      })
    )
  }

  addSun() {
    this.image = this.scene.add.existing(
      new Phaser.GameObjects.Image(this.scene, 550, 250, "sun")
        .setScale(4, 4)
        .setDepth(8)
    )
    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0xffe800,
        0.15
      ).setDepth(8)
    )
  }

  addSandstorm() {
    const leftScreenSource = { x: { min: 0, max: 100 }, y: { min: 500, max: 1500 } }
    const deathZoneSource = new Phaser.Geom.Rectangle(0, 0, 2000, 4000)

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "sand", {
        ...leftScreenSource,
        deathZone: { source: deathZoneSource, type: "onLeave" },
        frequency: 50,
        speedX: { min: 260, max: 280 },
        speedY: { min: -260, max: -280 },
        lifespan: 5000,
        scale: 0.8
      }),
      this.scene.add.particles(0, 0, "sand", {
        ...leftScreenSource,
        deathZone: { source: deathZoneSource, type: "onLeave" },
        frequency: 100,
        speedX: { min: 360, max: 380 },
        speedY: { min: -260, max: -280 },
        lifespan: 5000,
        scale: 1.2
      }),
      this.scene.add.particles(0, 0, "sand", {
        ...leftScreenSource,
        deathZone: { source: deathZoneSource, type: "onLeave" },
        frequency: 200,
        quantity: 4,
        scale: 1.5,
        speedX: { min: 460, max: 480 },
        speedY: { min: -260, max: -280 },
        lifespan: 5000
      })
    )

    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0x9a791a,
        0.2
      ).setDepth(8)
    )
  }

  addNight() {
    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0x141346,
        0.6
      ).setDepth(8)
    )
  }

  addWind(){
    const leftScreenSource = { x: { min: 0, max: 100 }, y: { min: 0, max: 1000 } }
    const deathZoneSource = new Phaser.Geom.Rectangle(0, 0, 2000, 4000)

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "wind", {
        ...leftScreenSource,
        deathZone: { source: deathZoneSource, type: "onLeave" },
        frequency: 100,
        speedX: { min: 500, max: 800 },
        speedY: { min: -100, max: 100 },
        lifespan: 2000,
        scale: 1
      }),
      this.scene.add.particles(0, 0, "wind", {
        ...leftScreenSource,
        deathZone: { source: deathZoneSource, type: "onLeave" },
        frequency: 100,
        speedX: { min: 1000, max: 1400 },
        speedY: { min: -100, max: 100 },
        lifespan: 2000,
        scale: .5
      })
    )
  }

  addMist(){
    const offscreenSource = { x: { min: 0, max: 2000 }, y: { min: 900, max: 1000 } }
    this.image = this.scene.add.existing(
      new Phaser.GameObjects.Image(this.scene, 1000, 500, "clouds")
        .setScale(2, 2)
        .setOrigin(0.5)
        .setDepth(8)
        .setAlpha(0.4)
    )
    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0x994C6E,
        0.15
      ).setDepth(8)
    )
    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "snowflakes", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 20,
        speedY: { min: -60, max: -40 },
        lifespan: 5000,
        scale: 1,
        tint: 0xFF80AE,
        alpha: { start: 1, end: 0 }
      }),
      this.scene.add.particles(0, 0, "snowflakes", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 40,
        speedY: { min: -60, max: -40 },
        lifespan: 5000,
        scale: 2,
        tint: 0xFF80BE,
        alpha: { start: 1, end: 0 }
      })
    )
  }

  addStorm(){
    const offscreenSource = { x: { min: 0, max: 2000 }, y: { min: 0, max: 100 } }
    this.colorFilter = this.scene.add.existing(
      new Phaser.GameObjects.Rectangle(
        this.scene,
        1000,
        500,
        2000,
        1000,
        0x2B3838,
        0.4
      ).setDepth(8)
    )

    this.particlesEmitters.push(
      this.scene.add.particles(0, 0, "rain", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 200,
        quantity: 12,
        speedY: { min: 700, max: 800 },
        speedX: { min: 900, max: 1000 },
        lifespan: 5000,
        scale: 0.8,
        tint: 0xa0a0a0
      }),

      this.scene.add.particles(0, 0, "rain", {
        ...offscreenSource,
        deathZone: { source: this.screen, type: "onLeave" },
        frequency: 200,
        quantity: 8,
        speedY: { min: 800, max: 1000 },
        speedX: { min: 1000, max: 1200 },
        lifespan: 5000,
        scale: 1,
        tint: 0xa0a0a0
      })
    )
  }

  clearWeather() {
    this.particlesEmitters.forEach((emitter) => emitter.destroy())
    this.particlesEmitters = []
    if (this.colorFilter) {
      this.colorFilter.destroy()
    }
    if (this.image) {
      this.image.destroy()
    }
  }
}
