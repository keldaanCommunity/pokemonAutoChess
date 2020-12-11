const {ATTACK_TYPE, TYPE, EFFECTS} = require('../models/enum');
//const PokemonFactory = require('../models/pokemon-factory');

class AttackStrategy{

    constructor(){
    }

    process(pokemon, state, board, target){
        pokemon.setMana(0);
    }
}

class LeechSeedStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
    }
}

class BurnStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerBurn();
    }
}

class SilenceStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerSilence();
    }
}

class PoisonStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerPoison();
    }
}

class FreezeStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerFreeze();
    }
}


class ProtectStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       pokemon.triggerProtect();
    }
}

class SleepStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerSleep();
    }
}

class ConfusionStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
       target.triggerConfusion();
    }
}

class FireBlastStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class SeismicTossStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let damage = 0;
        board.forEach((x, y, value) => {
            if(value && pokemon.team == value.team){
                damage += pokemon.stars;
            }
        });
        damage = damage * 5;
        target.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
    }
}

class GuillotineStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let damage = pokemon.atk * pokemon.stars;
        const victim = target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
        if(victim){
            pokemon.setMana(Math.floor(pokemon.maxMana / 2));
        }
    }
}

class RockSlideStrategy extends AttackStrategy{
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        if(target.types.includes(TYPE.FLYING)){
            damage = damage * 2;
        }
        target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
}

class WheelOfFireStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let cells = board.getCellsBetween(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
        cells.forEach(cell=>{
            if(cell.value && cell.value != pokemon){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class HeatWaveStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let secondTarget = board.getValue(target.positionX, target.positionY + 1);
        let thirdTarget = board.getValue(target.positionX, target.positionY + 2);
        if(secondTarget && secondTarget != pokemon){
            secondTarget.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
        }
        if(thirdTarget && thirdTarget != pokemon){
            thirdTarget.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
        }
    }
}

class HydroPumpStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let secondTarget = board.getValue(target.positionX, target.positionY + 1);
        if(secondTarget && secondTarget != pokemon){
            secondTarget.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
        }
    }
}

class ThunderStrategy extends AttackStrategy{
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        target.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
    }
}

class DracoMeteorStrategy extends AttackStrategy{
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
            if(tg && pokemon.team != tg.team){
                tg.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class BlazeKickStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let damage = 30 * pokemon.stars;
        target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
}

class WishStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        const heal = 50;
        let count = pokemon.stars;
        
        board.forEach((x, y, ally) => {
            if(ally && pokemon.team == ally.team && count > 0){
                ally.life = Math.min(ally.hp, ally.life + heal);
                count -= 1;
            }
        });
    }
}

class CalmMindStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class IronDefenseStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class SoakStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
            if(ally && pokemon.team == ally.team){
                ally.setMana(ally.mana + 10);
            }
        });

        target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    }
}

class IronTailStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class BlastBurnStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let damage = 0;

        switch (pokemon.stars) {
            case 1:
                damage = 50;
                break;
            case 2:
                damage = 100;
                break;
            case 3:
                damage = 150;
                break;
            default:
                break;
        }

        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class ChargeStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
            if(ally && pokemon.team == ally.team && ally.types.includes(TYPE.ELECTRIC)){
                ally.atk = Math.ceil(pokemon.baseAtk * buff);
            }
        });
    }
}

class DischargeStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class BiteStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        pokemon.life += Math.floor(damage/2);
    }
}

class DragonTailStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class DragonBreathStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let secondTarget = board.getValue(target.positionX, target.positionY + 1);
        if(secondTarget && secondTarget != pokemon){
            secondTarget.handleDamage(damage, board, ATTACK_TYPE.TRUE, pokemon);
        }
    }
}

class IcicleCrashStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

        let cells = board.getAdjacentCells(target.positionX, target.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class RootStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.life += heal;

        cells.forEach((cell) => {
            if(cell.value && pokemon.team == cell.value.team){
                cell.value.life += heal;
            }
        });
    }
}

class TormentStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        pokemon.atkSpeed = Math.max(400,pokemon.atkSpeed * boost);
    
    }
}

class StompStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let damage = pokemon.atk * pokemon.stars * 2;
        target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
}

class DarkPulseStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        pokemon.life += damage;
        target.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
    }
}

class NightSlashStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.def = Math.max(0,cell.value.def - 1);
            }
        });
    }
}

class BugBuzzStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class PoisonStingStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        if(target.effects.includes(EFFECTS.POISON_GAS) || target.effects.includes(EFFECTS.TOXIC)){
            damage = damage * 2;
        }
        
        target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }
}

class LeechLifeStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

        let cells = board.getAdjacentCells(target.positionX, target.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
                pokemon.life += damage;
            }
        });
    }
}

class HappyHourStrategy extends AttackStrategy{
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
                buff = 15;
                break;
            default:
                break;
        }
        board.forEach((x, y, ally) => {
            if(ally && pokemon.team == ally.team){
                ally.atk += buff;
            }
        });
    }
}

class TeleportStrategy extends AttackStrategy{
   
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);

        let potentialCells = [[0,0],[0,5],[7,5],[7,0]];
        this.shuffleArray(potentialCells);

        for (let i = 0; i < potentialCells.length; i++) {
            let entity = board.getValue(potentialCells[i][0],potentialCells[i][1]);
            if(entity === undefined){
                board.moveValue(pokemon.positionX, pokemon.positionY, potentialCells[i][0], potentialCells[i][1]);
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

class NastyPlotStrategy extends AttackStrategy{
   
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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

class ThiefStrategy extends AttackStrategy{
   
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let items = target.items.getAllItems();
        items.forEach( item => {
            pokemon.items.add(item);
            target.items.remove(item);
        });
        target.handleDamage(damage, board, ATTACK_TYPE.PHYSICAL, pokemon);
    }

}

class StunSporeStrategy extends AttackStrategy{
   
    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let debuff = 0;
        switch (pokemon.stars) {
            case 1:
                debuff = 1.5;
                break;
            case 2:
                debuff = 2;
                break;
            case 3:
                debuff = 3;
                break;
            default:
                break;
        }

        target.atkSpeed = pokemon.atkSpeed * debuff;
    }
}

class MeteorMashStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
            if(cell.value && pokemon.team != cell.value.team){
                cell.value.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
        });
    }
}

class HurricaneStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
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
        let secondTarget = board.getValue(target.positionX, target.positionY + 1);
        if(secondTarget && secondTarget != pokemon){
            secondTarget.handleDamage(damage, board, ATTACK_TYPE.SPECIAL, pokemon);
        }
    }
}

class MetronomeStrategy extends AttackStrategy{

    constructor(){
        super();
    }

    process(pokemon, state, board, target){
        super.process(pokemon, state, board, target);
        let skills = [
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
            SilenceStrategy
        ];
        let strategy = new skills[Math.floor(Math.random() * skills.length)]();
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
    SilenceStrategy
}
