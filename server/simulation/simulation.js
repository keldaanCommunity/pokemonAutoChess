const jssim = require('js-simulator');
(function(){
    var Boid = function(id, initial_x, initial_y, space, isPredator) {
            var rank = 1;
            jssim.SimEvent.call(this, rank);
            this.id = id;
            this.space = space;
            this.space.updateAgent(this, initial_x, initial_y);
            this.sight = 75;
            this.speed = 12;
            this.separation_space = 30;
            this.velocity = new jssim.Vector2D(Math.random(), Math.random());
            this.isPredator = isPredator;
            this.border = 30;
            this.boundary = 640;
            this.size = new jssim.Vector2D(8, 8);
            this.color = '#00aa00';
            if(isPredator){
                this.color = '#ff0000';
                this.size = new jssim.Vector2D(10, 10);
            }
        };

        Boid.prototype = Object.create(jssim.SimEvent);
        Boid.prototype.update = function(deltaTime) {
        var boids = this.space.findAllAgents();
        var pos = this.space.getLocation(this.id);

        if(this.isPredator) {
            var prey = null;
            var min_distance = 10000000;
            for (var boidId in boids)
            {
                var boid = boids[boidId];
                if(!boid.isPredator) {
                    var boid_pos = this.space.getLocation(boid.id);
                    var distance = pos.distance(boid_pos);
                    if(min_distance > distance){
                        min_distance = distance;
                        prey = boid;
                    }
                } else {
                    var boid_pos = this.space.getLocation(boid.id);
                    var distance = pos.distance(boid_pos);
                    if (distance < this.separation_space)
                    {
                        // Separation
                        this.velocity.x += pos.x - boid_pos.x;
                        this.velocity.y += pos.y - boid_pos.y;
                    }
                }
            }

            if(prey != null) {
                var prey_position = this.space.getLocation(prey.id);
                this.velocity.x += prey_position.x - pos.x;
                this.velocity.y += prey_position.y - pos.y;
            } 
            
        } else {
            for (var boidId in boids)
            {
                var boid = boids[boidId];
                var boid_pos = this.space.getLocation(boid.id);
                var distance = pos.distance(boid_pos);
                if (boid != this && !boid.isPredator)
                {
                    if (distance < this.separation_space)
                    {
                        // Separation
                        this.velocity.x += pos.x - boid_pos.x;
                        this.velocity.y += pos.y - boid_pos.y;
                    }
                    else if (distance < this.sight)
                    {
                        // Cohesion
                        this.velocity.x += (boid_pos.x - pos.x) * 0.05;
                        this.velocity.y += (boid_pos.y - pos.y) * 0.05;
                    }
                    if (distance < this.sight)
                    {
                        // Alignment
                        this.velocity.x += boid.velocity.x * 0.5;
                        this.velocity.y += boid.velocity.y * 0.5;
                    }
                }
                if (boid.isPredator && distance < this.sight)
                {
                    // Avoid predators.
                    this.velocity.x += pos.x - boid_pos.x;
                    this.velocity.y += pos.y - boid_pos.y;
                }
            }
        }




        // check speed
        var speed = this.velocity.length();
        if(speed > this.speed) {
            this.velocity.resize(this.speed);
        }
            

        

        pos.x += this.velocity.x;
        pos.y += this.velocity.y;
            
        // check boundary
        var val = this.boundary - this.border;
        if (pos.x < this.border) pos.x = this.boundary - this.border;
        if (pos.y < this.border) pos.y = this.boundary - this.border;
        if (pos.x > val) pos.x = this.border;
        if (pos.y > val) pos.y = this.border;


        console.log("boid [ " + this.id + "] is at (" + pos.x + ", " + pos.y + ") at time " + this.time);
        };

        var scheduler = new jssim.Scheduler();
        scheduler.reset();

        var space = new jssim.Space2D();
        space.reset();

        for(var i = 0; i < 30; ++i) {
            var is_predator = i > 27;
            var boid = new Boid(i, 0, 0, space, is_predator);
            scheduler.scheduleRepeatingIn(boid, 1);
        }


        
        //var canvas = document.getElementById("myCanvas");
        setInterval(function(){ 
            scheduler.update();
            
            //space.render(canvas);
            console.log('current simulation time: ' + scheduler.current_time);
        }, 100);
})();
