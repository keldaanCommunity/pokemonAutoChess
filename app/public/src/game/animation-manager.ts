/* eslint-disable max-len */
import { Orientation, PokemonActionState, SpriteType, PokemonTint } from '../../../types/enum/Game';
import { Ability } from '../../../types/enum/Ability';
import Pokemon from './components/pokemon';
import GameScene from './scenes/game-scene';
import durations from '../../dist/client/assets/pokemons/durations.json';
import indexList from '../../dist/client/assets/pokemons/indexList.json';
export default class AnimationManager {
  game: GameScene;

  constructor(game: GameScene) {
    this.game = game;

    indexList.forEach(index=>{
      (Object.values(PokemonTint) as PokemonTint[]).forEach(shiny=>{
        (Object.values(PokemonActionState) as PokemonActionState[]).forEach(action=>{
          (Object.values(SpriteType) as SpriteType[]).forEach(mode=>{
            const directionArray = action == PokemonActionState.SLEEP? [Orientation.DOWN] : Object.values(Orientation);
            directionArray.forEach(direction=>{
              const durationArray: number[] = durations[`${index}/${shiny}/${action}/${mode}`];
              if(durationArray){
                const frameArray = this.game.anims.generateFrameNames(index,{start: 0, end: durationArray.length -1, zeroPad: 4, prefix: `${shiny}/${action}/${mode}/${direction}/`})
                for (let i = 0; i < durationArray.length; i++) {
                  if(frameArray[i]){
                    frameArray[i]['duration'] = durationArray[i] * 10;
                  }
                }
                if(action == PokemonActionState.ATTACK){
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
      key: Ability[Ability.FIRE_BLAST],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 16, zeroPad: 3, prefix: `${Ability[Ability.FIRE_BLAST]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.WHEEL_OF_FIRE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${Ability[Ability.WHEEL_OF_FIRE]}/`}),
      duration: 1000,
      repeat: -1
    });

    this.game.anims.create({
      key: Ability[Ability.SEISMIC_TOSS],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${Ability[Ability.SEISMIC_TOSS]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.GUILLOTINE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${Ability[Ability.GUILLOTINE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ROCK_SLIDE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 79, zeroPad: 3, prefix: `${Ability[Ability.ROCK_SLIDE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HEAT_WAVE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 49, zeroPad: 3, prefix: `${Ability[Ability.HEAT_WAVE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.THUNDER],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${Ability[Ability.THUNDER]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HYDRO_PUMP],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${Ability[Ability.HYDRO_PUMP]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DRACO_METEOR],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 34, zeroPad: 3, prefix: `${Ability[Ability.DRACO_METEOR]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.BLAZE_KICK],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 15, zeroPad: 3, prefix: `${Ability[Ability.BLAZE_KICK]}/`}),
      duration: 1000,
      repeat: 2
    });

    this.game.anims.create({
      key: Ability[Ability.WISH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 14, zeroPad: 3, prefix: `${Ability[Ability.WISH]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.CALM_MIND],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${Ability[Ability.CALM_MIND]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.IRON_DEFENSE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 17, zeroPad: 3, prefix: `${Ability[Ability.IRON_DEFENSE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.METRONOME],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 36, zeroPad: 3, prefix: `${Ability[Ability.METRONOME]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.SOAK],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${Ability[Ability.SOAK]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.BLAST_BURN],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 16, zeroPad: 3, prefix: `${Ability[Ability.BLAST_BURN]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.CHARGE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 7, zeroPad: 3, prefix: `${Ability[Ability.CHARGE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DISCHARGE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 3, zeroPad: 3, prefix: `${Ability[Ability.DISCHARGE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.BITE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 11, zeroPad: 3, prefix: `${Ability[Ability.BITE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DRAGON_TAIL],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 25, zeroPad: 3, prefix: `${Ability[Ability.DRAGON_TAIL]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DRAGON_BREATH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 9, zeroPad: 3, prefix: `${Ability[Ability.DRAGON_BREATH]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ICICLE_CRASH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 26, zeroPad: 3, prefix: `${Ability[Ability.ICICLE_CRASH]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ROOT],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 48, zeroPad: 3, prefix: `${Ability[Ability.ROOT]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.TORMENT],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${Ability[Ability.TORMENT]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.STOMP],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${Ability[Ability.STOMP]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DARK_PULSE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 31, zeroPad: 3, prefix: `${Ability[Ability.DARK_PULSE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.NIGHT_SLASH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 6, zeroPad: 3, prefix: `${Ability[Ability.NIGHT_SLASH]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.BUG_BUZZ],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 28, zeroPad: 3, prefix: `${Ability[Ability.BUG_BUZZ]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.POISON_STING],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 12, zeroPad: 3, prefix: `${Ability[Ability.POISON_STING]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.LEECH_LIFE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 19, zeroPad: 3, prefix: `${Ability[Ability.LEECH_LIFE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HAPPY_HOUR],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 20, zeroPad: 3, prefix: `${Ability[Ability.HAPPY_HOUR]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.TELEPORT],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${Ability[Ability.TELEPORT]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.NASTY_PLOT],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 5, zeroPad: 3, prefix: `${Ability[Ability.NASTY_PLOT]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.THIEF],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 7, zeroPad: 3, prefix: `${Ability[Ability.THIEF]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.STUN_SPORE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 21, zeroPad: 3, prefix: `${Ability[Ability.STUN_SPORE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.METEOR_MASH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 45, zeroPad: 3, prefix: `${Ability[Ability.METEOR_MASH]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HURRICANE],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 51, zeroPad: 3, prefix: `${Ability[Ability.HURRICANE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.IRON_TAIL],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 6, zeroPad: 3, prefix: `${Ability[Ability.IRON_TAIL]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ORIGIN_PULSE],
      frames: this.game.anims.generateFrameNames('june', {start: 0, end: 6, prefix: `${Ability[Ability.ORIGIN_PULSE]}/`}),
      duration: 1000,
      repeat: -1,
      yoyo: true
    });

    this.game.anims.create({
      key: Ability[Ability.SEED_FLARE],
      frames: this.game.anims.generateFrameNames('june', {start: 0, end: 9, prefix: `${Ability[Ability.SEED_FLARE]}/`}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ROAR_OF_TIME],
      frames: this.game.anims.generateFrameNames('ROAR_OF_TIME', {start: 0, end: 28, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ROCK_TOMB],
      frames: this.game.anims.generateFrameNames('ROCK_TOMB', {start: 0, end: 21, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ROCK_SMASH],
      frames: this.game.anims.generateFrameNames('ROCK_SMASH', {start: 0, end: 8, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.VOLT_SWITCH],
      frames: this.game.anims.generateFrameNames(Ability[Ability.VOLT_SWITCH], {start: 0, end: 6}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.SHADOW_CLONE],
      frames: this.game.anims.generateFrameNames(Ability[Ability.SHADOW_CLONE], {start: 0, end: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HYPER_VOICE],
      frames: this.game.anims.generateFrameNames(Ability[Ability.HYPER_VOICE], {start: 0, end: 3}),
      duration: 300,
      repeat: 3
    });

    this.game.anims.create({
      key: Ability[Ability.PETAL_DANCE],
      frames: this.game.anims.generateFrameNames(Ability[Ability.PETAL_DANCE], {start: 0, end: 53, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.ECHO],
      frames: this.game.anims.generateFrameNames(Ability[Ability.ECHO], {start: 0, end: 36, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.EXPLOSION],
      frames: this.game.anims.generateFrameNames(Ability[Ability.EXPLOSION], {start: 0, end: 22, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.BONEMERANG],
      frames: this.game.anims.generateFrameNames(Ability[Ability.BONEMERANG], {start: 0, end: 7, zeroPad: 3}),
      duration: 1000,
      repeat: 3
    });

    this.game.anims.create({
      key: Ability[Ability.GROWL],
      frames: this.game.anims.generateFrameNames(Ability[Ability.GROWL], {start: 0, end: 19, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.HIGH_JUMP_KICK],
      frames: this.game.anims.generateFrameNames(Ability[Ability.HIGH_JUMP_KICK], {start: 0, end: 21, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.TRI_ATTACK],
      frames: this.game.anims.generateFrameNames(Ability[Ability.TRI_ATTACK], {start: 0, end: 20, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.DISARMING_VOICE],
      frames: this.game.anims.generateFrameNames(Ability[Ability.DISARMING_VOICE], {start: 0, end: 43, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.RELIC_SONG],
      frames: this.game.anims.generateFrameNames(Ability[Ability.RELIC_SONG], {start: 0, end: 34, zeroPad: 3}),
      duration: 1000,
      repeat: 0
    });

    this.game.anims.create({
      key: Ability[Ability.CLANGOROUS_SOUL],
      frames: this.game.anims.generateFrameNames(Ability[Ability.CLANGOROUS_SOUL], {start: 0, end: 18, zeroPad: 3}),
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
      key: Ability[Ability.HEAD_SMASH],
      frames: this.game.anims.generateFrameNames('specials', {start: 0, end: 79, zeroPad: 3, prefix: `${Ability[Ability.ROCK_SLIDE]}/`}),
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

  animatePokemon(entity: Pokemon, action: PokemonActionState) {
    const tint = entity.shiny ? PokemonTint.SHINY : PokemonTint.NORMAL;
    const animKey = `${entity.index}/${tint}/${action}/${SpriteType.ANIM}/${entity.orientation}`;
    const shadowKey = `${entity.index}/${tint}/${action}/${SpriteType.SHADOW}/${entity.orientation}`;

    entity.sprite.anims.play(animKey);
    entity.shadow.anims.play(shadowKey);
  }
}
