/* eslint-disable max-len */
import { Orientation, PokemonActionState } from '../../../types/enum/Game';
import { Ability } from '../../../types/enum/Ability';
import Pokemon from './components/pokemon';
import GameScene from './scenes/game-scene';

export default class AnimationManager {
  game: GameScene;
  orientationTable: Object;
  actionTable: Object;
  flipxTable: Object;

  constructor(game: GameScene) {
    this.game = game;
    this.orientationTable = {
      [Orientation.DOWN] : 0,
      [Orientation.DOWNLEFT] : 1,
      [Orientation.LEFT] : 2,
      [Orientation.UPLEFT] : 3,
      [Orientation.UP] : 4,
      [Orientation.UPRIGHT] : 3,
      [Orientation.RIGHT] : 2,
      [Orientation.DOWNRIGHT] : 1
    };

    this.actionTable = {
      [PokemonActionState.MOVING]: 0,
      [PokemonActionState.ATTACKING]: 1
    };

    this.flipxTable = {
      [Orientation.DOWNRIGHT]: false,
      [Orientation.DOWNLEFT]: false,
      [Orientation.LEFT]: false,
      [Orientation.UPLEFT]: false,
      [Orientation.UP]: false,
      [Orientation.UPRIGHT]: true,
      [Orientation.RIGHT]: true
    };

    [10, 11, 12, 13, 14, 15, 16, 17, 18, 74, 75, 76, 298, 183, 184, 41, 42, 169, 179, 180, 181, 173, 35, 36, 174, 39, 40, 187, 188, 189, 273, 274, 275, 396, 397, 398].forEach((num) => {
      this.createAnimations(num, 'COMMON', false);
    });

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 29, 30, 31, 32, 33, 34, 133, 134, 135, 136, 152, 153, 154, 155, 156, 157, 158, 159, 160, 196, 197, 252, 253, 254, 255, 256, 257, 258, 259, 260, 387, 388, 389, 390, 391, 392, 393, 394, 395, 470, 700].forEach((num) => {
      this.createAnimations(num, 'UNCOMMON', false);
    });

    [25, 26, 60, 61, 66, 67, 68, 81, 82, 111, 112, 116, 117, 172, 175, 176, 186, 230, 270, 271, 272, 304, 305, 306, 328, 329, 330, 355, 356, 363, 364, 365, 403, 404, 405, 462, 464, 468, 477].forEach((num) => {
      this.createAnimations(num, 'RARE', false);
    });

    [63, 64, 65, 92, 93, 94, 125, 126, 147, 148, 149, 239, 240, 246, 247, 248, 280, 281, 282, 287, 288, 289, 371, 372, 373, 374, 375, 376, 443, 444, 445, 466, 467].forEach((num) => {
      this.createAnimations(num, 'EPIC', false);
    });

    [58, 59, 95, 123, 132, 143, 208, 212, 446, 447, 448, 2080, 2120, 4480, 322, 323, 3230, 307, 308, 3080].forEach((num) => {
      this.createAnimations(num, 'LEGENDARY', false);
    });

    [129, 130, 19, 20, 21, 22, 27, 249, 487, 144, 145, 146, 483, 484, 243, 244, 245, 377, 378, 379, 486, 382, 383, 384, 491].forEach((num) => {
      this.createAnimations(num, 'NEUTRAL', false);
    });

    [607, 608, 609].forEach((num) => {
      this.createAnimations(num, 'EPIC2', false);
    });

    [79, 80, 199].forEach((num) => {
      this.createAnimations(num, 'UNCOMMON2', false);
    });

    [69, 70, 71, 220, 221, 361, 362, 459, 460, 471, 473, 478, 582, 583, 584, 4600].forEach((num) => {
      this.createAnimations(num, 'december', false);
    });

    [551, 552, 553, 633, 634, 635, 52, 53, 3820, 3830, 228, 318, 637, 638, 639, 640, 641, 641, 642, 643, 644, 645, 646, 647, 490, 479, 480, 481, 482, 483, 484, 485, 488, 492, 493, 494, 442, 359, 142, 131, 380, 381, 150, 250, 251, 385, 386].forEach((num) => {
      this.createAnimations(num, 'february', false);
    });

    [577, 578, 579].forEach((num) => {
      this.createAnimations(num, 'april', false);
    });

    [333, 3840, 43, 44, 45, 182].forEach((num) => {
      this.createAnimations(num, 'september', false);
    });

    [138, 139, 140, 141, 345, 346, 347, 348, 408, 409, 410, 411, 564, 565, 566, 567, 696, 697, 698, 699].forEach((num) => {
      this.createAnimations(num, 'fossil', false);
    });

    [104, 105, 137, 233, 293, 294, 295, 309, 310, 315, 334, 353, 354, 406, 407, 427, 428, 474, 506, 507, 508, 535, 536, 537, 540, 541, 542, 543, 544, 545, 599, 600, 601, 610, 611, 612, 648, 661, 662, 663, 669, 670, 671, 679, 680, 681, 731, 732, 733, 782, 783, 784, 1050, 3100, 3340, 3540, 4280].forEach((num) => {
      this.createAnimations(num, 'sound', true);
      this.createSleepAnimations('sound', num);
    });

    [351, 3510, 3511, 3512].forEach((num) => {
      this.createAnimations(num, 'castform', true);
      this.createSleepAnimations('castform', num);
    });

    this.createAttacksAnimations();
    this.createSpecialAttacksAnimations();
    // this.createSpecialCellsAnimations();
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
  /*
  createSpecialCellsAnimations() {
    this.game.anims.create({
      key: `FIRE/cell`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 56, zeroPad: 3, prefix: 'FIRE/cell/'}),
      frameRate: 30,
      repeat: -1
    });

    this.game.anims.create({
      key: `GRASS/cell`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 19, zeroPad: 3, prefix: 'GRASS/cell/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `WATER/cell`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 6, zeroPad: 3, prefix: 'WATER/cell/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `NORMAL/cell`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 51, zeroPad: 3, prefix: 'NORMAL/cell/'}),
      frameRate: 15,
      repeat: -1
    });

    this.game.anims.create({
      key: `ICE/cell`,
      frames: this.game.anims.generateFrameNames('attacks', {start: 0, end: 14, zeroPad: 3, prefix: 'ICE/cell/'}),
      frameRate: 15,
      repeat: -1
    });
  }
*/
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

  createSleepAnimations(sheet, index) {
    this.game.anims.create({
      key: `${index}/2`,
      frames: this.game.anims.generateFrameNames(sheet, {frames: [0, 1], prefix: index + '/2/'}),
      duration: 2000,
      repeat: -1
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

  createAnimations(index: number, sheet: string, sleep: boolean) {
    /*
      0 : down
      1 : down left
      2 : left
      3 : up left
      4 : up
      */
    ['0', '1', '2', '3', '4'].forEach((orientation) => {
      this.game.anims.create({
        key: `${index}/0/${orientation}`,
        frames: this.game.anims.generateFrameNames(sheet, {frames: [0, 1, 2], prefix: index + '/0/' + orientation + '/'}),
        duration: 400,
        repeatDelay: 300,
        repeat: -1,
        yoyo: true
      });
      // attack
      this.game.anims.create({
        key: `${index}/1/${orientation}`,
        frames: this.game.anims.generateFrameNames(sheet, {frames: [0, 1, 2], prefix: index + '/1/' + orientation + '/'}).concat(
            this.game.anims.generateFrameNames(sheet, {frames: [0, 1, 2], prefix: index + '/0/' + orientation + '/'})
        ),
        duration: 1000,
        repeat: -1
      });
    });
    if (!sleep) {
      this.game.anims.create({
        key: `${index}/2`,
        frames: this.game.anims.generateFrameNames('sleep', {frames: [0, 1], prefix: index + '/2/'}),
        duration: 2000,
        repeat: -1
      });
    }
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
    entity.sprite.anims.play(`${entity.index}/2`);
  }

  getSpriteKey(entity: Pokemon) {
    return `${entity.index}/${this.actionTable[entity.action]}/${this.orientationTable[entity.orientation]}`;
  }
}
