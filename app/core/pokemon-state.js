const {EFFECTS, ATTACK_TYPE, TYPE, CLIMATE, ITEMS, PKM, FLYING_PROTECT_THRESHOLD} = require('../models/enum');
const PokemonFactory = require('../models/pokemon-factory');

class PokemonState {
  constructor() {
  }

  handleHeal(pokemon, heal) {
    if (pokemon.life > 0 && pokemon.life < pokemon.hp && !pokemon.wound) {
      pokemon.life = Math.min(pokemon.hp, pokemon.life + heal);
    }
  }

  handleDamage(pokemon, damage, board, attackType, attacker) {
    let death;

    if (pokemon.life == 0) {
      death = true;
    } else {
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

        if (attacker && attacker.effects.includes(EFFECTS.PURSUIT) && pokemon.life/pokemon.hp < 0.3) {
          reducedDamage = pokemon.life + 1;
        }

        if (!reducedDamage) {
          reducedDamage = 0;
          // console.log(`error calculating damage, damage: ${damage}, defenseur: ${pokemon.name}, attaquant: ${attacker.name}, attack type: ${attackType}, defense : ${pokemon.def}, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`);
        }

        if (attacker && attacker.team == 0) {
          attacker.damageDone += reducedDamage;
        }
        let residualDamage = reducedDamage;

        if (pokemon.shield > 0) {
          residualDamage = Math.max(0, reducedDamage - pokemon.shield);
          pokemon.shield = Math.max(0, pokemon.shield - reducedDamage);
        }

        pokemon.life = Math.max(0, pokemon.life - residualDamage);
        // console.log(`${pokemon.name} took ${damage} and has now ${pokemon.life} life shield ${pokemon.shield}`);

        if (pokemon) {
          pokemon.setMana(pokemon.mana + Math.ceil(reducedDamage / 10));

          if (pokemon.life && pokemon.life > 0) {
            if (pokemon.flyingProtection) {
              if (pokemon.effects.includes(EFFECTS.TAILWIND)) {
                if (pokemon.life/pokemon.hp < FLYING_PROTECT_THRESHOLD[EFFECTS.TAILWIND].threshold) {
                  pokemon.status.triggerProtect(FLYING_PROTECT_THRESHOLD[EFFECTS.TAILWIND].duration);
                  pokemon.flyingProtection = false;
                }
              } else if (pokemon.effects.includes(EFFECTS.FEATHER_DANCE)) {
                if (pokemon.life/pokemon.hp < FLYING_PROTECT_THRESHOLD[EFFECTS.FEATHER_DANCE].threshold) {
                  pokemon.status.triggerProtect(FLYING_PROTECT_THRESHOLD[EFFECTS.FEATHER_DANCE].duration);
                  pokemon.flyingProtection = false;
                }
              } else if (pokemon.effects.includes(EFFECTS.MAX_AIRSTREAM)) {
                if (pokemon.life/pokemon.hp < FLYING_PROTECT_THRESHOLD[EFFECTS.MAX_AIRSTREAM].threshold) {
                  pokemon.status.triggerProtect(FLYING_PROTECT_THRESHOLD[EFFECTS.MAX_AIRSTREAM].duration);
                  pokemon.flyingProtection = false;
                }
              } else if (pokemon.effects.includes(EFFECTS.MAX_GUARD)) {
                if (pokemon.life/pokemon.hp < FLYING_PROTECT_THRESHOLD[EFFECTS.MAX_GUARD].threshold) {
                  pokemon.status.triggerProtect(FLYING_PROTECT_THRESHOLD[EFFECTS.MAX_GUARD].duration);
                  pokemon.flyingProtection = false;
                }
              }
            }
          }
        }

        if (attacker) {
          attacker.setMana(attacker.mana + 5);
        }

        if (!pokemon.life || pokemon.life <= 0) {
          if (pokemon.items.count(ITEMS.REVIVER_SEED) != 0) {
            pokemon.life = pokemon.hp;
            pokemon.items.remove(ITEMS.REVIVER_SEED);
          } else if (pokemon.effects.includes(EFFECTS.SWIFT_SWIM)) {
            pokemon.life = pokemon.hp * 0.4;
            pokemon.atk += pokemon.baseAtk * 0.3;
            pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.SWIFT_SWIM), 1);
          } else if (pokemon.effects.includes(EFFECTS.HYDRO_CANNON)) {
            pokemon.life = pokemon.hp * 0.8;
            pokemon.atk += pokemon.baseAtk *0.6;
            pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.HYDRO_CANNON), 1);
          } else if (pokemon.status.resurection) {
            pokemon.status.resurection = false;
            pokemon.life = pokemon.hp;
          } else {
            board.setValue(pokemon.positionX, pokemon.positionY, undefined);
            death = true;
          }
        }
      }
    }

    if (death && pokemon) {
      if (pokemon.effects.includes(EFFECTS.ODD_FLOWER) ||
      pokemon.effects.includes(EFFECTS.GLOOM_FLOWER) ||
      pokemon.effects.includes(EFFECTS.VILE_FLOWER)) {
        if (!pokemon.simulation.flowerSpawn[pokemon.team]) {
          pokemon.simulation.flowerSpawn[pokemon.team] = true;
          if (pokemon.effects.includes(EFFECTS.ODD_FLOWER)) {
            pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.ODDISH), pokemon.positionX, pokemon.positionY, pokemon.team);
          } else if (pokemon.effects.includes(EFFECTS.GLOOM_FLOWER)) {
            pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.GLOOM), pokemon.positionX, pokemon.positionY, pokemon.team);
          } else if (pokemon.effects.includes(EFFECTS.VILE_FLOWER)) {
            pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.VILEPLUME), pokemon.positionX, pokemon.positionY, pokemon.team);
          }
        }
      }
    }

    return death;
  }

  update(pokemon, dt, board, climate) {
    let updateEffects = false;
    if (pokemon.status.burn) {
      pokemon.status.updateBurn(dt);
    }

    if (pokemon.status.poison) {
      pokemon.status.updatePoison(dt);
    }

    if (pokemon.status.sleep) {
      pokemon.status.updateSleep(dt);
    }

    if (pokemon.status.silence) {
      pokemon.status.updateSilence(dt);
    }

    if (pokemon.status.protect) {
      pokemon.status.updateProtect(dt);
    }

    if (pokemon.status.freeze) {
      pokemon.status.updateFreeze(dt);
    }

    if (pokemon.status.confusion) {
      pokemon.status.updateConfusion(dt);
    }

    if (pokemon.status.wound) {
      pokemon.status.updateWound(dt);
    }

    if (pokemon.manaCooldown <= 0) {
      pokemon.setMana(pokemon.mana + 10);

      pokemon.manaCooldown = 1000;
      if (pokemon.mana >= pokemon.maxMana) {
        if (pokemon.targetX == -1 || pokemon.targetY == -1) {
          const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board);
          if (targetCoordinate[0] !== undefined && targetCoordinate[1] !== undefined) {
            pokemon.targetX = targetCoordinate[0];
            pokemon.targetY = targetCoordinate[1];
          }
        }
        const target = board.getValue(pokemon.targetX, pokemon.targetY);
        if (target) {
          if (pokemon.items.count(ITEMS.RED_ORB) != 0) {
            for (let i = 0; i < pokemon.items.count(ITEMS.RED_ORB); i++) {
              let created = false;
              const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
              cells.forEach((cell) => {
                if (!cell.value && !created) {
                  pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.HOUNDOUR), cell.row, cell.column, pokemon.team);
                  created = true;
                }
              });
            }
          }
          if (pokemon.items.count(ITEMS.BLUE_ORB) != 0) {
            for (let i = 0; i < pokemon.items.count(ITEMS.BLUE_ORB); i++) {
              let created = false;
              const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
              cells.forEach((cell) => {
                if (!cell.value && !created) {
                  pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.CARVANHA), cell.row, cell.column, pokemon.team);
                  created = true;
                }
              });
            }
          }

          if (pokemon.items.count(ITEMS.DELTA_ORB) != 0) {
            for (let i = 0; i < pokemon.items.count(ITEMS.DELTA_ORB); i++) {
              let created = false;
              const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
              cells.forEach((cell) => {
                if (!cell.value && !created) {
                  pokemon.simulation.addPokemon(PokemonFactory.createPokemonFromName(PKM.FEAROW), cell.row, cell.column, pokemon.team);
                  created = true;
                }
              });
            }
          }
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
        if (pokemon.effects.includes(EFFECTS.SANDSTORM)) {
          this.handleDamage(pokemon, Math.ceil(pokemon.hp / 20), board, ATTACK_TYPE.TRUE);
        }
      }
      if (pokemon.effects.includes(EFFECTS.BLAZE)) {
        pokemon.atk += 1;
      }
      if (pokemon.effects.includes(EFFECTS.DROUGHT)) {
        pokemon.atk += 2;
      }
      if (pokemon.effects.includes(EFFECTS.DESOLATE_LAND)) {
        pokemon.atk += 3;
      }
      if (pokemon.effects.includes(EFFECTS.DRAGON_DANCE) && pokemon.types.includes(TYPE.DRAGON)) {
        pokemon.atkSpeed = Math.max(400, Math.round(pokemon.atkSpeed * 0.95));
      }

      if (pokemon.effects.includes(EFFECTS.INGRAIN)) {
        pokemon.handleHeal(Math.ceil(0.05 * pokemon.hp));
      }

      if (pokemon.effects.includes(EFFECTS.GROWTH)) {
        pokemon.handleHeal(Math.ceil(0.1 * pokemon.hp));
      }

      if (pokemon.effects.includes(EFFECTS.SPORE)) {
        pokemon.handleHeal(Math.ceil(0.15 * pokemon.hp));
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
        } else if (candidateDistance == distance) {
          if (pokemon.team == 0 && c > y) {
            x = r;
            y = c;
          } else if (pokemon.team == 1 && c < y) {
            x = r;
            y = c;
          }
        }
      }
    });
    return [x, y];
  }

  getFarthestTargetCoordinateAvailablePlace(pokemon, board) {
    let x = undefined;
    let y = undefined;
    const pokemons = [];

    board.forEach((r, c, value)=>{
      if (value !== undefined && value.team != pokemon.team) {
        const d = board.distance(pokemon.positionX, pokemon.positionY, r, c);
        pokemons.push({distance: d, x: r, y: c});
      }
    });

    pokemons.sort((a, b)=>{
      return b.distance-a.distance;
    });

    for (let i = 0; i < pokemons.length; i++) {
      const p = pokemons[i];
      const around = board.getAdjacentCells(p.x, p.y);

      around.sort((a, b)=>{
        return board.distance(b.row, b.column, pokemon.positionX, pokemon.positionY) -
        board.distance(a.row, a.column, pokemon.positionX, pokemon.positionY);
      });
      around.forEach((cell) => {
        if (!cell.value && x === undefined && y === undefined) {
          x = cell.row;
          y = cell.column;
        }
      });
      if (x !== undefined && y !== undefined) {
        break;
      }
    }
    return [x, y];
  }
};

module.exports = PokemonState;
