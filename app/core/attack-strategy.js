const {ATTACK_TYPE, TYPE, EFFECTS} = require('../models/enum');

class AttackStrategy {
  constructor() {
  }

  process(pokemon, state, board, target) {
    pokemon.setMana(0);
  }
}

class LeechSeedStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
  }
}

class RockSmashStrategy extends AttackStrategy{
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);

    let d = 0;
    let s = 0;
    switch (pokemon.stars) {
      case 1:
        d = 20;
        s = 3000;
        break;
      case 2:
        d = 40;
        s = 6000;
        break;
      case 3:
        d = 60;
        s= 9000;
        break;
      default:
        break;
    }

    target.handleDamage(d, board, ATTACK_TYPE.PHYSICAL, pokemon);
    target.triggerSilence(s);
  }
}

class RockTombStrategy extends AttackStrategy{
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);

    let factor=0;
    switch (pokemon.stars) {
      case 1:
        factor = 30;
        break;
      case 2:
        factor = 60;
        break;
      case 3:
        factor = 90;
        break;
      default:
        break;
    }

    target.handleDamage(factor, board, ATTACK_TYPE.PHYSICAL, pokemon);
    target.atkSpeed = Math.max(400,pokemon.atkSpeed + factor * 10);
  }
}

class RoarOfTimeStrategy extends AttackStrategy{
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);

    let candidate = pokemon;
    board.forEach((x, y, pkm) => {
      if (pkm && pokemon.team == pkm.team && pkm.items.length > candidate.items.length && !pkm.resurection) {
        candidate = pkm;
      }
    });
  
    candidate.resurection = true;
  }
}

class HealBlockStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);

    let timer=0;
    switch (pokemon.stars) {
      case 1:
        timer = 5000;
        break;
      case 2:
        timer = 10000;
        break;
      case 3:
        timer = 15000;
        break;
      default:
        break;
    }
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.triggerWound(timer);
      }
    });
  }
}


class OriginPulseStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 60;

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class SeedFlareStrategy extends AttackStrategy{
  constructor(){
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 30;

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team) {
        tg.speDef -= 1;
        tg.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class BurnStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 2000;
        break;
      case 2:
        timer = 4000;
        break;
      case 3:
        timer = 8000;
        break;
      default:
        break;
    }
    board.forEach((x, y, value) => {
      if (value && pokemon.team != value.team) {
        value.triggerBurn(timer);
      }
    });
  }
}

class SilenceStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 2000;
        break;
      case 2:
        timer = 4000;
        break;
      case 3:
        timer = 8000;
        break;
      default:
        break;
    }
    board.forEach((x, y, value) => {
      if (value && pokemon.team != value.team) {
        value.triggerSilence(timer);
      }
    });
  }
}

class PoisonStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 5000;
        break;
      case 2:
        timer = 10000;
        break;
      case 3:
        timer = 20000;
        break;
      default:
        break;
    }
    target.triggerPoison(timer);
  }
}

class FreezeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 1000;
        break;
      case 2:
        timer = 2000;
        break;
      case 3:
        timer = 4000;
        break;
      default:
        break;
    }
    board.forEach((x, y, value) => {
      if (value && pokemon.team != value.team) {
        value.triggerFreeze(timer);
      }
    });
  }
}


class ProtectStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 3000;
        break;
      case 2:
        timer = 5000;
        break;
      case 3:
        timer = 7000;
        break;
      default:
        break;
    }
    pokemon.triggerProtect(timer);
  }
}

class SleepStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 3000;
        break;
      case 2:
        timer = 5000;
        break;
      case 3:
        timer = 7000;
        break;
      default:
        break;
    }
    target.triggerSleep(timer);
  }
}

class ConfusionStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let timer = 0;
    switch (pokemon.stars) {
      case 1:
        timer = 1000;
        break;
      case 2:
        timer = 2000;
        break;
      case 3:
        timer = 4000;
        break;
      default:
        break;
    }

    board.forEach((x, y, value) => {
      if (value && pokemon.team != value.team) {
        value.triggerConfusion(timer);
      }
    });
  }
}

class FireBlastStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 100;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
  }
}

class SeismicTossStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    board.forEach((x, y, value) => {
      if (value && pokemon.team == value.team) {
        damage += pokemon.stars;
      }
    });
    damage = damage * 5;
    target.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
  }
}

class GuillotineStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    const damage = pokemon.atk * pokemon.stars;
    const victim = target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    if (victim) {
      pokemon.setMana(Math.floor(pokemon.maxMana / 2));
    }
  }
}

class RockSlideStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 40;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 60;
        break;
      default:
        break;
    }
    if (target.types.includes(TYPE.FLYING)) {
      damage = damage * 2;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
  }
}

class WheelOfFireStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    const cells = board.getCellsBetween(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
    cells.forEach((cell)=>{
      if (cell.value && cell.value != pokemon) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class HeatWaveStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    const secondTarget = board.getValue(target.positionX, target.positionY + 1);
    const thirdTarget = board.getValue(target.positionX, target.positionY + 2);
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
    if (thirdTarget && thirdTarget != pokemon) {
      thirdTarget.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
  }
}

class HydroPumpStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    const secondTarget = board.getValue(target.positionX, target.positionY + 1);
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    }
  }
}

class ThunderStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 70;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
  }
}

class DracoMeteorStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 10;
        break;
      case 2:
        damage = 20;
        break;
      case 3:
        damage = 40;
        break;
      default:
        break;
    }
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class BlazeKickStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    const damage = 30 * pokemon.stars;
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
  }
}

class WishStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    const heal = 50;
    let count = pokemon.stars;

    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team && count > 0 && ally.life < ally.hp) {
        ally.handleHeal(heal);
        count -= 1;
      }
    });
  }
}

class CalmMindStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        buff = 0.5;
        break;
      case 2:
        buff = 1;
        break;
      case 3:
        buff = 1.5;
        break;
      default:
        break;
    }

    pokemon.atk += Math.ceil(pokemon.baseAtk * buff);
  }
}

class IronDefenseStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        buff = 4;
        break;
      case 2:
        buff = 6;
        break;
      case 3:
        buff = 8;
        break;
      default:
        break;
    }
    pokemon.def += buff;
    pokemon.speDef += buff;
  }
}

class SoakStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 20;
        break;
      case 2:
        damage = 30;
        break;
      case 3:
        damage = 40;
        break;
      default:
        break;
    }

    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.setMana(ally.mana + 10);
      }
    });

    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
  }
}

class IronTailStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 20;
        buff = 1;
        break;
      case 2:
        damage = 30;
        buff = 3;
        break;
      case 3:
        damage = 40;
        buff = 5;
        break;
      default:
        break;
    }
    pokemon.def += buff;
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
  }
}

class BlastBurnStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 80;
        break;
      default:
        break;
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class ChargeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        buff = 0.1;
        break;
      case 2:
        buff = 0.2;
        break;
      case 3:
        buff = 0.3;
        break;
      default:
        break;
    }

    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team && ally.types.includes(TYPE.ELECTRIC)) {
        ally.atk += Math.ceil(pokemon.baseAtk * buff);
      }
    });
  }
}

class DischargeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 40;
        break;
      case 2:
        damage = 60;
        break;
      case 3:
        damage = 80;
        break;
      default:
        break;
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class BiteStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 70;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    pokemon.handleHeal(Math.floor(damage/2));
  }
}

class DragonTailStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    pokemon.def += pokemon.stars;
    pokemon.speDef += pokemon.stars;
  }
}

class DragonBreathStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
    const secondTarget = board.getValue(target.positionX, target.positionY + 1);
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
    }
  }
}

class IcicleCrashStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }

    const cells = board.getAdjacentCells(target.positionX, target.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class RootStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let heal = 0;

    switch (pokemon.stars) {
      case 1:
        heal = 20;
        break;
      case 2:
        heal = 30;
        break;
      case 3:
        heal = 40;
        break;
      default:
        break;
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
    pokemon.handleHeal(heal);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal);
      }
    });
  }
}

class TormentStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let boost = 1;

    switch (pokemon.stars) {
      case 1:
        boost = 0.8;
        break;
      case 2:
        boost = 0.7;
        break;
      case 3:
        boost = 0.6;
        break;
      default:
        break;
    }
    pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * boost);
  }
}

class StompStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    const damage = pokemon.atk * pokemon.stars * 2;
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
  }
}

class DarkPulseStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 70;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    pokemon.handleHeal(damage);
  }
}

class NightSlashStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 40;
        break;
      case 2:
        damage = 60;
        break;
      case 3:
        damage = 80;
        break;
      default:
        break;
    }

    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.def = Math.max(0, cell.value.def - 1);
      }
    });
  }
}

class BugBuzzStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 20;
        break;
      case 2:
        damage = 30;
        break;
      case 3:
        damage = 40;
        break;
      default:
        break;
    }

    target.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
  }
}

class PoisonStingStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 40;
        break;
      case 3:
        damage = 50;
        break;
      default:
        break;
    }
    if (pokemon.effects.includes(EFFECTS.POISON_GAS) || pokemon.effects.includes(EFFECTS.TOXIC)) {
      damage = damage * 2;
    }

    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
  }
}

class LeechLifeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 10;
        break;
      case 2:
        damage = 20;
        break;
      case 3:
        damage = 30;
        break;
      default:
        break;
    }

    const cells = board.getAdjacentCells(target.positionX, target.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
        pokemon.handleHeal(damage);
      }
    });
  }
}

class HappyHourStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        buff = 3;
        break;
      case 2:
        buff = 6;
        break;
      case 3:
        buff = 9;
        break;
      default:
        break;
    }
    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.atk += buff;
      }
    });
  }
}

class TeleportStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);

    const potentialCells = [[0, 0], [0, 5], [7, 5], [7, 0]];
    this.shuffleArray(potentialCells);

    for (let i = 0; i < potentialCells.length; i++) {
      const entity = board.getValue(potentialCells[i][0], potentialCells[i][1]);
      if (entity === undefined) {
        board.swapValue(pokemon.positionX, pokemon.positionY, potentialCells[i][0], potentialCells[i][1]);
        pokemon.positionX = potentialCells[i][0];
        pokemon.positionY = potentialCells[i][1];
        break;
      }
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

class NastyPlotStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let buff = 0;
    switch (pokemon.stars) {
      case 1:
        buff = 5;
        break;
      case 2:
        buff = 10;
        break;
      case 3:
        buff = 20;
        break;
      default:
        break;
    }
    pokemon.atk += buff;
  }
}

class ThiefStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 5;
        break;
      case 2:
        damage = 10;
        break;
      case 3:
        damage = 20;
        break;
      default:
        break;
    }
    const items = target.items.getAllItems();
    items.forEach( (item) => {
      pokemon.items.add(item);
      target.items.remove(item);
    });
    target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
  }
}

class StunSporeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let debuff = 0;
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        debuff = 1.5;
        damage = 5;
        break;
      case 2:
        debuff = 2;
        damage = 10;
        break;
      case 3:
        debuff = 3;
        damage = 20;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    target.atkSpeed = Math.max(400,pokemon.atkSpeed * debuff);
  }
}

class MeteorMashStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;

    switch (pokemon.stars) {
      case 1:
        damage = 30;
        break;
      case 2:
        damage = 50;
        break;
      case 3:
        damage = 70;
        break;
      default:
        break;
    }

    pokemon.atk += 5;
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
      }
    });
  }
}

class HurricaneStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    let damage = 0;
    switch (pokemon.stars) {
      case 1:
        damage = 10;
        break;
      case 2:
        damage = 20;
        break;
      case 3:
        damage = 30;
        break;
      default:
        break;
    }
    target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    const secondTarget = board.getValue(target.positionX, target.positionY + 1);
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    }
  }
}

class MetronomeStrategy extends AttackStrategy {
  constructor() {
    super();
  }

  process(pokemon, state, board, target) {
    super.process(pokemon, state, board, target);
    const skills = [
      LeechSeedStrategy,
      FireBlastStrategy,
      WheelOfFireStrategy,
      SeismicTossStrategy,
      GuillotineStrategy,
      RockSlideStrategy,
      HeatWaveStrategy,
      ThunderStrategy,
      HydroPumpStrategy,
      DracoMeteorStrategy,
      BlazeKickStrategy,
      WishStrategy,
      CalmMindStrategy,
      IronDefenseStrategy,
      SoakStrategy,
      IronTailStrategy,
      BlastBurnStrategy,
      ChargeStrategy,
      DischargeStrategy,
      BiteStrategy,
      DragonTailStrategy,
      DragonBreathStrategy,
      IcicleCrashStrategy,
      RootStrategy,
      TormentStrategy,
      StompStrategy,
      DarkPulseStrategy,
      NightSlashStrategy,
      BugBuzzStrategy,
      PoisonStingStrategy,
      LeechLifeStrategy,
      HappyHourStrategy,
      TeleportStrategy,
      NastyPlotStrategy,
      ThiefStrategy,
      StunSporeStrategy,
      MeteorMashStrategy,
      HurricaneStrategy,
      BurnStrategy,
      SleepStrategy,
      FreezeStrategy,
      ConfusionStrategy,
      ProtectStrategy,
      PoisonStrategy,
      SilenceStrategy,
      OriginPulseStrategy,
      SeedFlareStrategy,
      HealBlockStrategy,
      RoarOfTimeStrategy,
      RockTombStrategy,
      RockSmashStrategy
    ];
    const strategy = new skills[Math.floor(Math.random() * skills.length)]();
    strategy.process(pokemon, state, board, target);
  }
}


module.exports = {
  AttackStrategy,
  LeechSeedStrategy,
  FireBlastStrategy,
  WheelOfFireStrategy,
  SeismicTossStrategy,
  GuillotineStrategy,
  RockSlideStrategy,
  HeatWaveStrategy,
  ThunderStrategy,
  HydroPumpStrategy,
  DracoMeteorStrategy,
  BlazeKickStrategy,
  WishStrategy,
  CalmMindStrategy,
  IronDefenseStrategy,
  MetronomeStrategy,
  SoakStrategy,
  IronTailStrategy,
  BlastBurnStrategy,
  ChargeStrategy,
  DischargeStrategy,
  BiteStrategy,
  DragonTailStrategy,
  DragonBreathStrategy,
  IcicleCrashStrategy,
  RootStrategy,
  TormentStrategy,
  StompStrategy,
  DarkPulseStrategy,
  NightSlashStrategy,
  BugBuzzStrategy,
  PoisonStingStrategy,
  LeechLifeStrategy,
  HappyHourStrategy,
  TeleportStrategy,
  NastyPlotStrategy,
  ThiefStrategy,
  StunSporeStrategy,
  MeteorMashStrategy,
  HurricaneStrategy,
  BurnStrategy,
  SleepStrategy,
  FreezeStrategy,
  ConfusionStrategy,
  ProtectStrategy,
  PoisonStrategy,
  SilenceStrategy,
  OriginPulseStrategy,
  SeedFlareStrategy,
  HealBlockStrategy,
  RoarOfTimeStrategy,
  RockTombStrategy,
  RockSmashStrategy
};
