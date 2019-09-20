const jssim = require('js-simulator');
const Boid = require('./Boid');

class Simulation{
    constructor()
    {
        this.scheduler = new jssim.Scheduler();
        this.space = new jssim.Space2D();
        this.space.width = 1000;
        this.space.height = 1000;
        this.initialize();
    }

    initialize()
    {
        for(var i = 0; i < 10; ++i) 
        {
            let is_predator = i > 7;
            let boid = new Boid(i, 0, 0, this.space, is_predator);
            this.scheduler.scheduleRepeatingIn(boid, 1);
        }
    }
}

module.exports = Simulation;
