/* eslint-disable max-len */
import {SPECIAL_SKILL} from '../../../models/enum';
import Pokemon from './components/pokemon';
import GameScene from './scenes/game-scene';
import durations from '../../dist/client/assets/pokemons/durations.json';
export default class AnimationManager {
  game: GameScene;
  orientationTable: { DOWN: number; DOWNLEFT: number; LEFT: number; UPLEFT: number; UP: number; UPRIGHT: number; RIGHT: number; DOWNRIGHT: number; };
  actionTable: { MOVING: string; ATTACKING: string; };
  flipxTable: { DOWNRIGHT: boolean; DOWNLEFT: boolean; LEFT: boolean; UPLEFT: boolean; UP: boolean; UPRIGHT: boolean; RIGHT: boolean; };

  constructor(game: GameScene) {
    this.game = game;
    this.orientationTable = {
      'DOWN': 0,
      'DOWNLEFT': 7,
      'LEFT': 6,
      'UPLEFT': 5,
      'UP': 4,
      'UPRIGHT': 3,
      'RIGHT': 2,
      'DOWNRIGHT': 1
    };

    this.actionTable ={
      'MOVING': 'Walk',
      'ATTACKING': 'Attack'
    };

    this.flipxTable = {
      'DOWNRIGHT': false,
      'DOWNLEFT': false,
      'LEFT': false,
      'UPLEFT': false,
      'UP': false,
      'UPRIGHT': true,
      'RIGHT': true
    };

    ["0132","0001","0002","0003","0004","0005","0006","0007","0008","0009","0074","0075","0076","0298","0183","0184","0041","0042","0169","0179","0180","0181","0173","0035","0036","0174","0040","0039","0010","0011","0012","0013","0014","0015","0016","0017","0018","0187","0188","0189","0273","0274","0275","0396","0397","0398","0152","0153","0154","0155","0156","0157","0158","0159","0160","0252","0253","0254","0255","0256","0257","0258","0259","0260","0387","0388","0389","0390","0391","0392","0393","0394","0395","0029","0030","0031","0032","0033","0034","0172","0025","0026","0066","0067","0068","0116","0117","0230","0328","0329","0330","0363","0364","0129","0365","0304","0305","0306","0081","0082","0462","0111","0112","0464","0175","0176","0468","0355","0356","0477","0270","0271","0272","0403","0404","0405","0060","0061","0186","0063","0064","0065","0092","0093","0094","0147","0148","0149","0246","0247","0248","0287","0288","0289","0280","0281","0282","0371","0372","0373","0374","0375","0376","0443","0444","0445","0239","0125","0466","0240","0126","0467","0446","0143","0058","0059","0095","0208","0123","0212","0447","0448","0019","0020","0021","0022","0130","0249","0487","0145","0146","0144","0483","0484","0245","0243","0244","0378","0377","0379","0382","0383","0384","0486","0133","0134","0135","0136","0196","0197","0470","0700","0307","0308","0322","0323","0027","0491","0607","0609","0079","0080","0199","0069","0070","0071","0318","0220","0221","0473","0361","0362","0478","0459","0460","0582","0583","0471","0637","0641","0647","0638","0490","0479","0442","0359","0131","0380","0381","0481","0482","0480","0150","0251","0494","0385","0493","0386","0492","0488","0485","0250","0142","0052","0053","0578","0333","0043","0044","0045","0182","0698","0699","0347","0348","0566","0410","0411","0345","0346","0408","0409","0140","0141","0138","0139","0406","0315","0407","0427","0428","0610","0137","0233","0474","0309","0310","0353","0354","0679","0104","0105","0293","0294","0295","0542","0669","0670","0671","0648","0334","0506","0508","0228","0351"].forEach(index=>{
      ["Normal","Shiny"].forEach(shiny=>{
        ["Attack","Walk"].forEach(anim=>{ // TODO add sleep
          ["Anim","Shadow"].forEach(mode=>{
            [0,1,2,3,4,5,6,7].forEach(direction=>{
              const durationArray: number[] = durations[`${index}/${shiny}/${anim}/${mode}`];
              if(durationArray){
                const frameArray = this.game.anims.generateFrameNames(index,{start: 0, end: durationArray.length -1, zeroPad: 4, prefix: `${shiny}/${anim}/${mode}/${direction}/`})
                for (let i = 0; i < durationArray.length; i++) {
                  if(frameArray[i]){
                    frameArray[i]['duration'] = durationArray[i] * 10;
                  }
                }
                this.game.anims.create({
                  key: `${index}/${shiny}/${anim}/${mode}/${direction}`,
                  frames: frameArray,
                  repeat: -1
                });
              }
              else{
                console.log('duration array missing for ', `${index}/${shiny}/${anim}/${mode}`);
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

  animatePokemon(entity: Pokemon) {
    const key = this.getSpriteKey(entity);
    this.playAnimation(entity, key);
  }

  playAnimation(entity: Pokemon, spriteKey: string) {
    entity.sprite.flipX = this.flipxTable[entity.orientation];
    entity.sprite.anims.play(spriteKey);
  }

  playSleepAnimation(entity: Pokemon) {
    entity.sprite.anims.play(`${entity.padIndex}/2`);
  }

  getSpriteKey(entity: Pokemon) {
    return `${entity.padIndex}/Normal/${this.actionTable[entity.action]}/Anim/${this.orientationTable[entity.orientation]}`;
  }
}
