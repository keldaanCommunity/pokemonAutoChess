const jssim = require('js-simulator');
const Boid = require('./Boid');

class Simulation{
    constructor()
    {
        this.scheduler = new jssim.Scheduler();
        this.space = new jssim.Space2D();
        this.initialize();
    }

    initialize()
    {
        for(var i = 0; i < 20; ++i) 
        {
            let is_predator = i > 15;
            let boid = new Boid(i, 0, 0, this.space, is_predator);
            this.scheduler.scheduleRepeatingIn(boid, 1);
        }
    }
}

module.exports = Simulation;
