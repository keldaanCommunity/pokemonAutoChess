import { GameObjects } from "phaser";

export default class LifeBar extends GameObjects.Graphics {

    constructor (scene, x, y, life, color)
    {
        super(scene);
        this.x = x;
        this.y = y;
        this.value = life;
        this.color = color;
        this.p = 56 / this.value;

        this.draw();

        scene.add.existing(this);
    }

    setLife (amount)
    {
        this.value = amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.clear();

        //  BG
        this.fillStyle(0x000000);
        this.fillRect(this.x, this.y, 60, 10);

        //  Health

        this.fillStyle(0xffffff);
        this.fillRect(this.x + 2, this.y + 2, 56, 6);

        this.fillStyle(this.color);

        var d = Math.floor(this.p * this.value);

        this.fillRect(this.x + 2, this.y + 2, d, 6);
    }

}