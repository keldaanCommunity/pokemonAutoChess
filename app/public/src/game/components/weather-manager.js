export default class WeatherManager{
    constructor(scene){
        this.scene = scene;
        this.offscreen = new Phaser.Geom.Rectangle(300, 0, 900, 400);
        this.screen = new Phaser.Geom.Rectangle(300, 0, 900, 800);
    }

    addRain(){
        this.particles = this.scene.add.particles('rain', [
            {
                emitZone: { source: this.offscreen },
                deathZone: { source: this.screen, type: 'onLeave' },
                frequency: 400,
                speedY: { min: 80, max: 120 },
                lifespan: 30000,
                scale: 0.5
            },
            {
                emitZone: { source: this.offscreen },
                deathZone: { source: this.screen, type: 'onLeave' },
                frequency: 600,
                speedY: { min: 180, max: 220 },
                lifespan: 30000,
                scale: 0.8
            },
            {
                emitZone: { source: this.offscreen },
                deathZone: { source: this.screen, type: 'onLeave' },
                frequency: 2000,
                quantity: 4,
                speedY: { min: 280, max: 320 },
                lifespan: 30000
            },
        ]);
    }

    clearWeather(){
        if(this.particles){
            this.particles.destroy();
        }
    }
}