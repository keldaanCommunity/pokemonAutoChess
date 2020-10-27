
export default class WeatherManager {
  constructor(scene) {
    this.scene = scene;
    this.offscreen = new Phaser.Geom.Rectangle(0, 0, 2000, 100);
    this.screen = new Phaser.Geom.Rectangle(0, 0, 2000, 1000);
    this.leftscreen = new Phaser.Geom.Rectangle(0, 500, 100, 1000);
    this.rightscreen = new Phaser.Geom.Rectangle(0, 0, 2000, 4000);
  }

  addRain() {
    this.rectangle = this.scene.add.existing(new Phaser.GameObjects.Rectangle(this.scene, 1000, 500, 2000, 1000, 0x296383, 0.3).setDepth(8));
    this.particles = this.scene.add.particles('rain', [
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 50,
        speedY: {min: 260, max: 280},
        lifespan: 5000,
        scale: 0.5
      },
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 100,
        speedY: {min: 360, max: 380},
        lifespan: 5000,
        scale: 0.8
      },
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 200,
        quantity: 4,
        speedY: {min: 460, max: 480},
        lifespan: 5000
      }
    ]);
  }

  addSnow() {

    this.rectangle = this.scene.add.existing(new Phaser.GameObjects.Rectangle(this.scene, 1000, 500, 2000, 1000, 0xa7cade, 0.3).setDepth(8));
    this.particles = this.scene.add.particles('snowflakes', [
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 10,
        speedY: {min: 70, max: 80},
        lifespan: 5000,
        scale: 0.5
      },
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 20,
        speedY: {min: 100, max: 110},
        lifespan: 5000,
        scale: 0.8
      },
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.screen, type: 'onLeave'},
        frequency: 40,
        speedY: {min: 200, max: 210},
        lifespan: 5000
      }
    ]);
  }

  addSun() {
    this.image = this.scene.add.existing(new Phaser.GameObjects.Image(this.scene, 550, 250, 'sun').setScale(4, 4).setDepth(8));
    this.rectangle = this.scene.add.existing(new Phaser.GameObjects.Rectangle(this.scene, 1000, 500, 2000, 1000, 0xffe800, 0.15).setDepth(8));
  }

  addSandstorm() {
    this.particles = this.scene.add.particles('sand', [
      {
        emitZone: {source: this.leftscreen},
        deathZone: {source: this.rightscreen, type: 'onLeave'},
        frequency: 50,
        speedX: {min: 260, max: 280},
        speedY: {min: -260, max: -280},
        lifespan: 5000,
        scale: 0.8
      },
      {
        emitZone: {source: this.leftscreen},
        deathZone: {source: this.rightscreen, type: 'onLeave'},
        frequency: 100,
        speedX: {min: 360, max: 380},
        speedY: {min: -260, max: -280},
        lifespan: 5000,
        scale: 1.2
      },
      {
        emitZone: {source: this.offscreen},
        deathZone: {source: this.rightscreen, type: 'onLeave'},
        frequency: 200,
        quantity: 4,
        scale: 1.5,
        speedX: {min: 460, max: 480},
        speedY: {min: -260, max: -280},
        lifespan: 5000
      }
    ]);
    this.rectangle = this.scene.add.existing(new Phaser.GameObjects.Rectangle(this.scene, 1000, 500, 2000, 1000, 0x9a791a, 0.2).setDepth(8));
  }

  clearWeather() {
    if (this.particles) {
      this.particles.destroy();
    }
    if (this.rectangle) {
      this.rectangle.destroy();
    }
    if (this.image) {
      this.image.destroy();
    }
  }
}
