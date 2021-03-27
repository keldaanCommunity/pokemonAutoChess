const {EFFECTS, ATTACK_TYPE, TYPE, CLIMATE, ITEMS, PKM} = require('../models/enum');
const PokemonFactory = require('../models/pokemon-factory');

class PokemonState {
  constructor() {
  }

  handleHeal(pokemon, heal) {
    if (pokemon.life > 0) {
      pokemon.life = Math.min(pokemon.hp, pokemon.life + heal);
    }
  }

  handleDamage(pokemon, damage, board, attackType, attacker) {
    let death;
    if (attacker && attacker.items.count(ITEMS.RAZOR_CLAW) != 0) {
      attackType = ATTACK_TYPE.TRUE;
    }
    if(pokemon.life == 0){
      death = true;
    }
    else{
      death = false;
      if (!pokemon.protect) {
        let reducedDamage = damage;
        const armorFactor = 0.1;
        if (attackType == ATTACK_TYPE.PHYSICAL) {
          const ritodamage = damage * (pokemon.life / (pokemon.life * (1 + (armorFactor * pokemon.def))));
          reducedDamage = Math.max(0, Math.round(ritodamage));
        } else if (attackType == ATTACK_TYPE.SPECIAL) {
          const ritodamage = damage * (pokemon.life / (pokemon.life * (1 + (armorFactor * pokemon.speDef))));
          reducedDamage = Math.max(0, Math.round(ritodamage));
        } else if (attackType == ATTACK_TYPE.TRUE) {
          reducedDamage = damage;
        }
  
        if (attacker && attacker.burn) {
          reducedDamage = reducedDamage / 2;
        }
  
        if (attacker && attacker.effects.includes(EFFECTS.PURSUIT) && pokemon.life/pokemon.hp < 0.3) {
          reducedDamage = pokemon.life + 1;
        }
  
        if(!reducedDamage){
          reducedDamage = 0;
          console.log(`error calculating damage, damage: ${damage}, defenseur: ${pokemon.name}, attaquant: ${attacker.name}, attack type: ${attackType}, defense : ${pokemon.def}, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`);
        }
  
        if (attacker && attacker.team == 0) {
          attacker.damageDone += reducedDamage;
        }
  
        pokemon.life = Math.max(0, pokemon.life - reducedDamage);
        // console.log(`${pokemon.id} took ${damage} and has now ${pokemon.life} life`);
        if (pokemon.effects.includes(EFFECTS.RAGE)) {
          pokemon.attack += Math.ceil(pokemon.baseAtk * 0.05);
        }
  
        if (pokemon) {
          pokemon.setMana(pokemon.mana + Math.ceil(reducedDamage / 10));
        }
  
        if (attacker) {
          attacker.setMana(attacker.mana + 5);
        }
  
        if (!pokemon.life || pokemon.life <= 0) {
          if(pokemon.items.count(ITEMS.REVIVER_SEED) != 0){
            pokemon.life = pokemon.hp;
            pokemon.items.remove(ITEMS.REVIVER_SEED);
          }
          else{
            board.setValue(pokemon.positionX, pokemon.positionY, undefined);
            death = true;
          }
        }
      }
    }
    
    return death;
  }

  update(pokemon, dt, board, climate) {
    let updateEffects = false;
    if (pokemon.burn) {
      pokemon.updateBurn(dt);
    }

    if (pokemon.poison) {
      pokemon.updatePoison(dt);
    }

    if (pokemon.sleep) {
      pokemon.updateSleep(dt);
    }

    if (pokemon.silence) {
      pokemon.updateSilence(dt);
    }

    if (pokemon.protect) {
      pokemon.updateProtect(dt);
    }

    if (pokemon.freeze) {
      pokemon.updateFreeze(dt);
    }

    if (pokemon.confusion) {
      pokemon.updateConfusion(dt);
    }

    if (pokemon.manaCooldown <= 0) {
      pokemon.setMana(pokemon.mana + 10);

      pokemon.manaCooldown = 1000;
      if (pokemon.mana >= pokemon.maxMana) {
        if(pokemon.items.count(ITEMS.RED_ORB) != 0){
          for (let i = 0; i < pokemon.items.count(ITEMS.RED_ORB); i++) {
            let created = false;
            const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
            cells.forEach((cell) => {
              if (!cell.value && !created) {
                pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.HOUNDOUR),cell.row, cell.column, pokemon.team);
                created = true;
              }
            });
          }
        }
        if(pokemon.items.count(ITEMS.BLUE_ORB) != 0){
          for (let i = 0; i < pokemon.items.count(ITEMS.BLUE_ORB); i++) {
            let created = false;
            const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
            cells.forEach((cell) => {
              if (!cell.value && !created) {
                pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.CARVANHA),cell.row, cell.column, pokemon.team);
                created = true;
              }
            });
          }
        }

        if (pokemon.targetX == -1 || pokemon.targetY == -1) {
          const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board);
          if (targetCoordinate[0] !== undefined && targetCoordinate[1] !== undefined) {
            pokemon.targetX = targetCoordinate[0];
            pokemon.targetY = targetCoordinate[1];
          }
        }
        const target = board.getValue(pokemon.targetX, pokemon.targetY);
        if (target) {
          pokemon.strategy.process(pokemon, this, board, target);
          updateEffects = true;
        }
      }
    } else {
      pokemon.manaCooldown = Math.max(0, pokemon.manaCooldown - dt);
    }

    if (pokemon.cooldown <= 0) {
      if (pokemon.burn) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp / 5), board, ATTACK_TYPE.TRUE);
      }

      if (pokemon.poison) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp *0.15), board, ATTACK_TYPE.TRUE);
      }

      if (climate == CLIMATE.SANDSTORM) {
        if (!pokemon.types.includes(TYPE.GROUND) && !pokemon.types.includes(TYPE.METAL) &&!pokemon.types.includes(TYPE.MINERAL)) {
          this.handleDamage(pokemon, Math.ceil(pokemon.hp / 20), board, ATTACK_TYPE.TRUE);
        }
      }
      if (pokemon.effects.includes(EFFECTS.BLAZE)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.05);
      }

      if (pokemon.effects.includes(EFFECTS.DRAGON_DANCE) && pokemon.types.includes(TYPE.DRAGON)) {
        pokemon.atkSpeed = Math.max(400, Math.round(pokemon.atkSpeed * 0.95));
      }

      if (pokemon.effects.includes(EFFECTS.INGRAIN)) {
        pokemon.handleHeal(Math.ceil(pokemon.hp / 20));
      }

      if (pokemon.effects.includes(EFFECTS.GROWTH)) {
        pokemon.handleHeal(Math.ceil(pokemon.hp / 10));
      }

      if (pokemon.effects.includes(EFFECTS.GRASS)) {
        pokemon.handleHeal(Math.ceil(pokemon.hp / 20));
      }

      if (pokemon.items.count(ITEMS.METRONOME) != 0) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.05) * pokemon.items.count(ITEMS.METRONOME);
      }

      if (pokemon.items.count(ITEMS.SALAC_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2) {
          pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed / 2);
          pokemon.items.remove(ITEMS.SALAC_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.LIECHI_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2 && pokemon.attackType == ATTACK_TYPE.PHYSICAL) {
          pokemon.atk = Math.ceil(pokemon.atk * 2);
          pokemon.items.remove(ITEMS.LIECHI_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.GANLON_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2) {
          pokemon.def = Math.ceil(pokemon.def * 2);
          pokemon.items.remove(ITEMS.GANLON_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.PETAYA_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2 && pokemon.attackType == ATTACK_TYPE.SPECIAL) {
          pokemon.atk = Math.ceil(pokemon.atk * 2);
          pokemon.items.remove(ITEMS.PETAYA_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.APRICOT_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2) {
          pokemon.speDef = Math.ceil(pokemon.speDef * 2);
          pokemon.items.remove(ITEMS.APRICOT_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.ORAN_BERRY) != 0) {
        if (pokemon.life <= pokemon.hp / 2) {
          pokemon.handleHeal(Math.ceil(pokemon.hp / 2));
          pokemon.items.remove(ITEMS.ORAN_BERRY);
        }
      }

      if (pokemon.items.count(ITEMS.BIG_ROOT) != 0) {
        pokemon.handleHeal(Math.ceil(pokemon.hp / 20));
      }

      if (pokemon.effects.includes(EFFECTS.RAIN_DISH)) {
        pokemon.handleHeal(Math.ceil(pokemon.hp / 20));
      }

      if (pokemon.effects.includes(EFFECTS.POISON_GAS)) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp / 20), board, ATTACK_TYPE.TRUE);
      }

      if (pokemon.effects.includes(EFFECTS.TOXIC) && (!pokemon.types.includes(TYPE.POISON) && !pokemon.types.includes(TYPE.METAL))) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp / 20), board, ATTACK_TYPE.TRUE);
      }
    }
    return updateEffects;
  }

  onEnter(pokemon) {
  }

  onExit(pokemon) {
  }

  isTarget(pokemon, board) {
    let target = false;
    board.forEach((x, y, value) => {
      if (value && value.team != pokemon.team) {
        target = true;
      }
    });
    return target;
  }

  getNearestTargetCoordinate(pokemon, board) {
    let x = undefined;
    let y = undefined;
    let distance = 999;
    board.forEach((r, c, value) => {
      if (value !== undefined && value.team != pokemon.team) {
        const candidateDistance = board.distance(pokemon.positionX, pokemon.positionY, r, c);
        if (candidateDistance < distance) {
          distance = candidateDistance;
          x = r;
          y = c;
        }
      }
    });
    return [x, y];
  }
};

module.exports = PokemonState;
