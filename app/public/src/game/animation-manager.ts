/* eslint-disable max-len */
import {SPECIAL_SKILL, PKM_ORIENTATION, PKM_ACTION, PKM_ANIM, PKM_TINT} from '../../../models/enum';
import Pokemon from './components/pokemon';
import GameScene from './scenes/game-scene';
import durations from '../../dist/client/assets/pokemons/durations.json';
import indexList from '../../dist/client/assets/pokemons/indexList.json';
export default class AnimationManager {
  game: GameScene;


  constructor(game: GameScene) {
    this.game = game;

    indexList.forEach(index=>{
      Object.values(PKM_TINT).forEach(shiny=>{
        Object.values(PKM_ACTION).forEach(action=>{
          Object.values(PKM_ANIM).forEach(mode=>{
            const directionArray = action == PKM_ACTION.SLEEP? [PKM_ORIENTATION.DOWN] : Object.values(PKM_ORIENTATION);
            directionArray.forEach(direction=>{
              const durationArray: number[] = durations[`${index}/${shiny}/${action}/${mode}`];
              if(durationArray){
                const frameArray = this.game.anims.generateFrameNames(index,{start: 0, end: durationArray.length -1, zeroPad: 4, prefix: `${shiny}/${action}/${mode}/${direction}/`})
                for (let i = 0; i < durationArray.length; i++) {
                  if(frameArray[i]){
                    frameArray[i]['duration'] = durationArray[i] * 10;
                  }
                }
                if(action == PKM_ACTION.ATTACK){
                  this.game.anims.create({
                    key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                    frames: frameArray,
                    repeat: 0,
                  });
                }
                else{
                  this.game.anims.create({
                    key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                    frames: frameArray,
                    repeat: -1
                  });
                }
              }
              else{
                console.log('duration array missing for ', `${index}/${shiny}/${action}/${mode}`);
              }
            })
          })
        })
      })
    })
    this.createAttacksAnimations();
    this.createSpecialAttacksAnimations();
    this.createStatusAnimations();
  }

  createStatusAnimations() {
    this.game.anims.create({
      key: `poison`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 14, zeroPad: 3, prefix: 'status/poison/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `sleep`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 9, zeroPad: 3, prefix: 'status/sleep/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `silence`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 8, zeroPad: 3, prefix: 'status/silence/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `protect`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 9, zeroPad: 3, prefix: 'status/protect/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `freeze`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 5, zeroPad: 3, prefix: 'status/freeze/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `confusion`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 3, zeroPad: 3, prefix: 'status/confusion/'}),
      frameRate: 4,
      repeat: -1
    });

    this.game.anims.create({
      key: `burn`,
      frames: this.game.anims.generateFrameNames('status', {start: 0, end: 7, zeroPad: 3, prefix: 'status/burn/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `wound`,
      frames: this.game.anims.generateFrameNames('wound', {start: 0, end: 3, zeroPad: 3}),
      frameRate: 3,
      repeat: -1
    });

    this.game.anims.create({
      key: `resurection`,
      frames: this.game.anims.generateFrameNames('resurection', {start: 0, end: 3, zeroPad: 3}),
      frameRate: 3,
      repeat: -1
    });

    this.game.anims.create({
      key: `smoke`,
      frames: this.game.anims.generateFrameNames('smoke', {start: 0, end: 9, zeroPad: 3}),
      frameRate: 3,
      repeat: -1
    });

    this.game.anims.create({
      key: `armorReduction`,
      frames: this.game.anims.generateFrameNames('armorReduction', {start: 0, end: 1, zeroPad: 3}),
      frameRate: 3,
      repeat: -1
    });

    this.game.anims.create({
      key: `rune_protect`,
      frames: this.game.anims.generateFrameNames('rune_protect', {start: 0, end: 9, zeroPad: 3}),
      frameRate: 6,
      repeat: -1
    });
  }

  createSpecialAttacksAnimations() {
    this.game.anims.create({
      key: SPECIAL_SKILL.FIRE_BLAST,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 16, zeroPad: 3, prefix: `${SPECIAL_SKILL.FIRE_BLAST}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.WHEEL_OF_FIRE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${SPECIAL_SKILL.WHEEL_OF_FIRE}/`}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.SEISMIC_TOSS,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${SPECIAL_SKILL.SEISMIC_TOSS}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.GUILLOTINE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${SPECIAL_SKILL.GUILLOTINE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ROCK_SLIDE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 79, zeroPad: 3, prefix: `${SPECIAL_SKILL.ROCK_SLIDE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HEAT_WAVE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 49, zeroPad: 3, prefix: `${SPECIAL_SKILL.HEAT_WAVE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.THUNDER,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${SPECIAL_SKILL.THUNDER}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HYDRO_PUMP,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${SPECIAL_SKILL.HYDRO_PUMP}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DRACO_METEOR,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 34, zeroPad: 3, prefix: `${SPECIAL_SKILL.DRACO_METEOR}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.BLAZE_KICK,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 15, zeroPad: 3, prefix: `${SPECIAL_SKILL.BLAZE_KICK}/`}),
      duration: 1000,
      repeat: 2
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.WISH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 14, zeroPad: 3, prefix: `${SPECIAL_SKILL.WISH}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.CALM_MIND,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${SPECIAL_SKILL.CALM_MIND}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.IRON_DEFENSE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 17, zeroPad: 3, prefix: `${SPECIAL_SKILL.IRON_DEFENSE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.METRONOME,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 36, zeroPad: 3, prefix: `${SPECIAL_SKILL.METRONOME}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.SOAK,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${SPECIAL_SKILL.SOAK}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.BLAST_BURN,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 16, zeroPad: 3, prefix: `${SPECIAL_SKILL.BLAST_BURN}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.CHARGE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 7, zeroPad: 3, prefix: `${SPECIAL_SKILL.CHARGE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DISCHARGE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 3, zeroPad: 3, prefix: `${SPECIAL_SKILL.DISCHARGE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.BITE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 11, zeroPad: 3, prefix: `${SPECIAL_SKILL.BITE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DRAGON_TAIL,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 25, zeroPad: 3, prefix: `${SPECIAL_SKILL.DRAGON_TAIL}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DRAGON_BREATH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 9, zeroPad: 3, prefix: `${SPECIAL_SKILL.DRAGON_BREATH}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ICICLE_CRASH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 26, zeroPad: 3, prefix: `${SPECIAL_SKILL.ICICLE_CRASH}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ROOT,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 48, zeroPad: 3, prefix: `${SPECIAL_SKILL.ROOT}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.TORMENT,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${SPECIAL_SKILL.TORMENT}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.STOMP,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${SPECIAL_SKILL.STOMP}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DARK_PULSE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 31, zeroPad: 3, prefix: `${SPECIAL_SKILL.DARK_PULSE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.NIGHT_SLASH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 6, zeroPad: 3, prefix: `${SPECIAL_SKILL.NIGHT_SLASH}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.BUG_BUZZ,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 28, zeroPad: 3, prefix: `${SPECIAL_SKILL.BUG_BUZZ}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.POISON_STING,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${SPECIAL_SKILL.POISON_STING}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.LEECH_LIFE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${SPECIAL_SKILL.LEECH_LIFE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HAPPY_HOUR,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 20, zeroPad: 3, prefix: `${SPECIAL_SKILL.HAPPY_HOUR}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.TELEPORT,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${SPECIAL_SKILL.TELEPORT}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.NASTY_PLOT,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${SPECIAL_SKILL.NASTY_PLOT}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.THIEF,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 7, zeroPad: 3, prefix: `${SPECIAL_SKILL.THIEF}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.STUN_SPORE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 21, zeroPad: 3, prefix: `${SPECIAL_SKILL.STUN_SPORE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.METEOR_MASH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${SPECIAL_SKILL.METEOR_MASH}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HURRICANE,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 51, zeroPad: 3, prefix: `${SPECIAL_SKILL.HURRICANE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.IRON_TAIL,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 6, zeroPad: 3, prefix: `${SPECIAL_SKILL.IRON_TAIL}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ORIGIN_PULSE,
      frames: this.game.anims.generateFrameNames('june', {start: 0, end: 6, prefix: `${SPECIAL_SKILL.ORIGIN_PULSE}/`}),
      duration: 1000,
      repeat: -1,
      yoyo: true
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.SEED_FLARE,
      frames: this.game.anims.generateFrameNames('june', {start: 0, end: 9, prefix: `${SPECIAL_SKILL.SEED_FLARE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ROAR_OF_TIME,
      frames: this.game.anims.generateFrameNames('ROAR_OF_TIME', {start: 0, end: 28, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ROCK_TOMB,
      frames: this.game.anims.generateFrameNames('ROCK_TOMB', {start: 0, end: 21, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ROCK_SMASH,
      frames: this.game.anims.generateFrameNames('ROCK_SMASH', {start: 0, end: 8, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.VOLT_SWITCH,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.VOLT_SWITCH, {start: 0, end: 6}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.SHADOW_CLONE,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.SHADOW_CLONE, {start: 0, end: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HYPER_VOICE,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.HYPER_VOICE, {start: 0, end: 3}),
      duration: 300,
      repeat: 3
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.PETAL_DANCE,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.PETAL_DANCE, {start: 0, end: 53, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.ECHO,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.ECHO, {start: 0, end: 36, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.EXPLOSION,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.EXPLOSION, {start: 0, end: 22, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.BONEMERANG,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.BONEMERANG, {start: 0, end: 7, zeroPad: 3}),
      duration: 1000,
      repeat: 3
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.GROWL,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.GROWL, {start: 0, end: 19, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HIGH_JUMP_KICK,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.HIGH_JUMP_KICK, {start: 0, end: 21, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.TRI_ATTACK,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.TRI_ATTACK, {start: 0, end: 20, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.DISARMING_VOICE,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.DISARMING_VOICE, {start: 0, end: 43, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.RELIC_SONG,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.RELIC_SONG, {start: 0, end: 34, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.CLANGOROUS_SOUL,
      frames: this.game.anims.generateFrameNames(SPECIAL_SKILL.CLANGOROUS_SOUL, {start: 0, end: 18, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: 'FIELD_DEATH',
      frames: this.game.anims.generateFrameNames('FIELD_DEATH', {start: 0, end: 8, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: 'FAIRY_CRIT',
      frames: this.game.anims.generateFrameNames('FAIRY_CRIT', {start: 0, end: 19, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: SPECIAL_SKILL.HEAD_SMASH,
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 79, zeroPad: 3, prefix: `${SPECIAL_SKILL.ROCK_SLIDE}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: `ground-grow`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 56, zeroPad: 3, prefix: 'GROUND/cell/'}),
      duration: 800,
      repeat: 0
    });

    this.game.anims.create({
      key: `INCENSE_DAMAGE`,
      frames: this.game.anims.generateFrameNames('INCENSE_DAMAGE', {start: 0, end: 6, zeroPad: 3}),
      duration: 500,
      repeat: 0
    });

    this.game.anims.create({
      key: `STATIC`,
      frames: this.game.anims.generateFrameNames('STATIC', {start: 0, end: 13, zeroPad: 3}),
      duration: 500,
      repeat: 0
    });

    this.game.anims.create({
      key: `BRIGHT_POWDER`,
      frames: this.game.anims.generateFrameNames('BRIGHT_POWDER', {start: 0, end: 18, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });
  }

  createAttacksAnimations() {
    this.game.anims.create({
      key: `GRASS/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 10, zeroPad: 3, prefix: 'GRASS/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `GRASS/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 25, zeroPad: 3, prefix: 'GRASS/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `WATER/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 18, zeroPad: 3, prefix: 'WATER/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `WATER/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 7, zeroPad: 3, prefix: 'WATER/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FIRE/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 8, zeroPad: 3, prefix: 'FIRE/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FIRE/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 30, zeroPad: 3, prefix: 'FIRE/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `ROCK/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 10, zeroPad: 3, prefix: 'ROCK/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FIGHTING/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 12, zeroPad: 3, prefix: 'FIGHTING/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FIGHTING/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 9, end: 39, zeroPad: 3, prefix: 'FIGHTING/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `DRAGON/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 10, zeroPad: 3, prefix: 'DRAGON/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `NORMAL/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 7, zeroPad: 3, prefix: 'NORMAL/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `DRAGON/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 45, zeroPad: 3, prefix: 'DRAGON/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `POISON/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 27, zeroPad: 3, prefix: 'POISON/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `POISON/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 12, zeroPad: 3, prefix: 'POISON/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `ELECTRIC/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 3, zeroPad: 3, prefix: 'ELECTRIC/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `GHOST/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 23, zeroPad: 3, prefix: 'GHOST/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `PSYCHIC/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 38, zeroPad: 3, prefix: 'PSYCHIC/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `ELECTRIC/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 5, zeroPad: 3, prefix: 'ELECTRIC/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FAIRY/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 25, zeroPad: 3, prefix: 'FAIRY/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FAIRY/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 13, zeroPad: 3, prefix: 'FAIRY/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FLYING/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 24, zeroPad: 3, prefix: 'FLYING/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `FLYING/range`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 7, zeroPad: 3, prefix: 'FLYING/range/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `BUG/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 15, zeroPad: 3, prefix: 'BUG/melee/'}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: `ICE/melee`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 8, zeroPad: 3, prefix: 'ICE/melee/'}),
      duration: 1000,
      repeat: -1
    });
  }

  animatePokemon(entity: Pokemon, action: PKM_ACTION) {
    const tint = entity.shiny ? PKM_TINT.SHINY : PKM_TINT.NORMAL;
    const animKey = `${entity.index}/${tint}/${action}/${PKM_ANIM.ANIM}/${PKM_ORIENTATION[entity.orientation]}`;
    const shadowKey = `${entity.index}/${tint}/${action}/${PKM_ANIM.SHADOW}/${PKM_ORIENTATION[entity.orientation]}`;

    entity.sprite.anims.play(animKey);
    entity.shadow.anims.play(shadowKey);
  }
}
