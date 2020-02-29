const schema = require("@colyseus/schema");
const Simulation = require("./simulation");
const Grid = require("./grid");

class SimulationState extends schema.Schema {
  constructor(pokemons) {
    super();
    this.simulation = new Simulation();

    this.simulation.setInitializer(function (ctx) {
      let grid = new Grid(9, 6);
      for (let i = 0; i < pokemons.length; i++) {
        grid.setValue(pokemons[i].positionX, pokemons[i].positionY, pokemons[i]);
      }
      return {
        grid: grid,
        pokemons: pokemons,
        log: []
      };
    });

    this.simulation.setEndIf(function (simulation) {
      var emptyTeamA = true;
      var emptyTeamB = true;

      for (var i = 0; i < simulation.state.pokemons.length; i++) {
        if (simulation.state.pokemons[i].stats.HP > 0) {
          if (simulation.state.pokemons[i].group == 0) emptyTeamA = false;
          if (simulation.state.pokemons[i].group == 1) emptyTeamB = false;
        }
      }
      if (emptyTeamA || emptyTeamB) return true;
      if (simulation.ctx.time > 10000) return true;
      return false;
    });

    function moveEvent(simulation, pkmn) {
      if (pkmn.stats.HP > 0) {
        var grid = simulation.state.grid;
        var hasTarget = pkmn.chooseTarget(grid);
        if (hasTarget) {
          var targetInRange = pkmn.isTargetInRange(grid);
          if (targetInRange) {
            // wait a bit before attacking target (attack delay)
            simulation.addEvent({ delay: 200 }, attackEvent, pkmn);
          }
          else {
            pkmn.moveTowardTarget(grid);
            simulation.addEvent({ delay: 100 }, moveEvent, pkmn);
            simulation.state.log.push([
              simulation.ctx.time,
              pkmn.toString() + " move"
            ]);
          }
        }
        else {
          // check very fast to get new target
          simulation.addEvent({ delay: 5 }, moveEvent, pkmn);
        }
      }
    }

    function attackEvent(simulation, pkmn) {
      if (pkmn.stats.HP > 0) {
        var grid = simulation.state.grid;
        var hasTarget = pkmn.chooseTarget(grid);
        if (hasTarget) {
          var targetInRange = pkmn.isTargetInRange(grid);
          if (targetInRange) {
            var move = pkmn.chooseAttackMove();
            var damage = pkmn.getBaseDamage(
              pkmn.stats.level
              , pkmn.stats.attack
              , pkmn.target.stats.defense
              , move.power
              , 1);
            var modifier = pkmn.getModifiers(/* ??? */);
            pkmn.target.stats.HP -= damage * modifier;
            pkmn.target.stats.energy += 10;
            simulation.state.log.push(
              [
                simulation.ctx.time,
                pkmn.toString() + " / " + pkmn.target.toString()
              ]
            );
            if (pkmn.target.stats.HP <= 0) {
              simulation.state.pokemons.splice(simulation.state.pokemons.indexOf(pkmn.target), 1);
              pkmn.target = null;
            }
            pkmn.stats.energy += 10;
            simulation.addEvent({ delay: 200 }, attackEvent, pkmn);
          }
          else {
            // target has moved, move instantly
            simulation.addEvent({ delay: 0 }, moveEvent, pkmn);
          }
        }
        else {
          // check very fast to get new target
          simulation.addEvent({ delay: 10 }, moveEvent, pkmn);
        }
      }
    }

    this.simulation.addEvent({ time: 0 }, function (simulation) {
      simulation.ctx.random.shuffle(simulation.state.pokemons);
      for (var i = 0; i < simulation.state.pokemons.length; i++) {
        simulation.addEvent({ delay: 10 }, moveEvent, simulation.state.pokemons[i]);
      }
    });
  }
}

module.exports = SimulationState;