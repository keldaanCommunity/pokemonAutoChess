/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable max-len */
import {
  Orientation,
  PokemonActionState,
  SpriteType,
  PokemonTint
} from "../../../types/enum/Game"
import { Ability } from "../../../types/enum/Ability"
import Pokemon from "./components/pokemon"
import GameScene from "./scenes/game-scene"
import durations from "../../dist/client/assets/pokemons/durations.json"
import indexList from "../../dist/client/assets/pokemons/indexList.json"

export default class AnimationManager {
  game: GameScene

  constructor(game: GameScene) {
    this.game = game

    indexList.forEach((index) => {
      ;(Object.values(PokemonTint) as PokemonTint[]).forEach((shiny) => {
        ;(Object.values(PokemonActionState) as PokemonActionState[]).forEach(
          (action) => {
            ;(Object.values(SpriteType) as SpriteType[]).forEach((mode) => {
              const directionArray =
                action == PokemonActionState.SLEEP
                  ? [Orientation.DOWN]
                  : Object.values(Orientation)
              directionArray.forEach((direction) => {
                const durationArray: number[] =
                  durations[`${index}/${shiny}/${action}/${mode}`]
                if (durationArray) {
                  const frameArray = this.game.anims.generateFrameNames(index, {
                    start: 0,
                    end: durationArray.length - 1,
                    zeroPad: 4,
                    prefix: `${shiny}/${action}/${mode}/${direction}/`
                  })
                  for (let i = 0; i < durationArray.length; i++) {
                    if (frameArray[i]) {
                      frameArray[i]["duration"] = durationArray[i] * 10
                    }
                  }
                  if (
                    action == PokemonActionState.ATTACK ||
                    action == PokemonActionState.HURT
                  ) {
                    this.game.anims.create({
                      key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                      frames: frameArray,
                      repeat: 0
                    })
                  } else {
                    this.game.anims.create({
                      key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                      frames: frameArray,
                      repeat: -1
                    })
                  }
                } else {
                  console.log(
                    "duration array missing for ",
                    `${index}/${shiny}/${action}/${mode}`
                  )
                }
              })
            })
          }
        )
      })
    })
    this.createAttacksAnimations()
    this.createSpecialAttacksAnimations()
    createStatusAnimations(this.game)
  }

  createSpecialAttacksAnimations() {
    this.game.anims.create({
      key: Ability.SOFT_BOILED,
      frames: this.game.anims.generateFrameNames("SOFT_BOILED", {
        start: 0,
        end: 32,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DYNAMIC_PUNCH,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: `${Ability.DYNAMIC_PUNCH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CORRUPTED_NATURE,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 48,
        zeroPad: 3,
        prefix: `${Ability.CORRUPTED_NATURE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CRABHAMMER,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.CRABHAMMER}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DIAMOND_STORM,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 16,
        zeroPad: 3,
        prefix: `${Ability.DIAMOND_STORM}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DRACO_ENERGY,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 14,
        zeroPad: 3,
        prefix: `${Ability.DRACO_ENERGY}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DYNAMAX_CANNON,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 38,
        zeroPad: 3,
        prefix: `${Ability.DYNAMAX_CANNON}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ELECTRO_BOOST,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: `${Ability.ELECTRO_BOOST}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ELECTRO_WEB,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 10,
        zeroPad: 3,
        prefix: `${Ability.ELECTRO_WEB}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FIRE_TRICK,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 11,
        zeroPad: 3,
        prefix: `${Ability.FIRE_TRICK}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FLAME_CHARGE,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 40,
        zeroPad: 3,
        prefix: `${Ability.FLAME_CHARGE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.LEECH_SEED,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 10,
        zeroPad: 3,
        prefix: `${Ability.LEECH_SEED}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.LOCK_ON,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 26,
        zeroPad: 3,
        prefix: `${Ability.LOCK_ON}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.PSYCH_UP,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 26,
        zeroPad: 3,
        prefix: `${Ability.PSYCH_UP}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.RAZOR_WIND,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: `${Ability.RAZOR_WIND}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.TWISTING_NEITHER,
      frames: this.game.anims.generateFrameNames("pmd-replace", {
        start: 0,
        end: 59,
        zeroPad: 3,
        prefix: `${Ability.TWISTING_NEITHER}/`
      }),
      duration: 2000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FIRE_BLAST,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 16,
        zeroPad: 3,
        prefix: `${Ability.FIRE_BLAST}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.WHEEL_OF_FIRE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.WHEEL_OF_FIRE}/`
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: Ability.SEISMIC_TOSS,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.SEISMIC_TOSS}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.GUILLOTINE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.GUILLOTINE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ROCK_SLIDE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 79,
        zeroPad: 3,
        prefix: `${Ability.ROCK_SLIDE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HEAT_WAVE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 49,
        zeroPad: 3,
        prefix: `${Ability.HEAT_WAVE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.THUNDER,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: `${Ability.THUNDER}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HYDRO_PUMP,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 19,
        zeroPad: 3,
        prefix: `${Ability.HYDRO_PUMP}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DRACO_METEOR,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 34,
        zeroPad: 3,
        prefix: `${Ability.DRACO_METEOR}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BLAZE_KICK,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 15,
        zeroPad: 3,
        prefix: `${Ability.BLAZE_KICK}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.WISH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 14,
        zeroPad: 3,
        prefix: `${Ability.WISH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CALM_MIND,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 45,
        zeroPad: 3,
        prefix: `${Ability.CALM_MIND}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.IRON_DEFENSE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 17,
        zeroPad: 3,
        prefix: `${Ability.IRON_DEFENSE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.METRONOME,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 36,
        zeroPad: 3,
        prefix: `${Ability.METRONOME}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SOAK,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 45,
        zeroPad: 3,
        prefix: `${Ability.SOAK}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BLAST_BURN,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 16,
        zeroPad: 3,
        prefix: `${Ability.BLAST_BURN}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CHARGE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: `${Ability.CHARGE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DISCHARGE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 3,
        zeroPad: 3,
        prefix: `${Ability.DISCHARGE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BITE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 11,
        zeroPad: 3,
        prefix: `${Ability.BITE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DRAGON_TAIL,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 25,
        zeroPad: 3,
        prefix: `${Ability.DRAGON_TAIL}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DRAGON_BREATH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 9,
        zeroPad: 3,
        prefix: `${Ability.DRAGON_BREATH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ICICLE_CRASH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 26,
        zeroPad: 3,
        prefix: `${Ability.ICICLE_CRASH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ROOT,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 48,
        zeroPad: 3,
        prefix: `${Ability.ROOT}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.TORMENT,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 19,
        zeroPad: 3,
        prefix: `${Ability.TORMENT}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.STOMP,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: `${Ability.STOMP}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DARK_PULSE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 31,
        zeroPad: 3,
        prefix: `${Ability.DARK_PULSE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.NIGHT_SLASH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 6,
        zeroPad: 3,
        prefix: `${Ability.NIGHT_SLASH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BUG_BUZZ,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 28,
        zeroPad: 3,
        prefix: `${Ability.BUG_BUZZ}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.POISON_STING,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: `${Ability.POISON_STING}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.LEECH_LIFE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 19,
        zeroPad: 3,
        prefix: `${Ability.LEECH_LIFE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HAPPY_HOUR,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 20,
        zeroPad: 3,
        prefix: `${Ability.HAPPY_HOUR}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.TELEPORT,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.TELEPORT}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.NASTY_PLOT,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: `${Ability.NASTY_PLOT}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.THIEF,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: `${Ability.THIEF}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.STUN_SPORE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 21,
        zeroPad: 3,
        prefix: `${Ability.STUN_SPORE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.METEOR_MASH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 45,
        zeroPad: 3,
        prefix: `${Ability.METEOR_MASH}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HURRICANE,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 51,
        zeroPad: 3,
        prefix: `${Ability.HURRICANE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.IRON_TAIL,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 6,
        zeroPad: 3,
        prefix: `${Ability.IRON_TAIL}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ROAR_OF_TIME,
      frames: this.game.anims.generateFrameNames("ROAR_OF_TIME", {
        start: 0,
        end: 28,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ROCK_TOMB,
      frames: this.game.anims.generateFrameNames("ROCK_TOMB", {
        start: 0,
        end: 21,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ROCK_SMASH,
      frames: this.game.anims.generateFrameNames("ROCK_SMASH", {
        start: 0,
        end: 8,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.VOLT_SWITCH,
      frames: this.game.anims.generateFrameNames(Ability.VOLT_SWITCH, {
        start: 0,
        end: 6
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.STEAM_ERUPTION,
      frames: this.game.anims.generateFrameNames(Ability.STEAM_ERUPTION, {
        start: 0,
        end: 10,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.APPLE_ACID,
      frames: this.game.anims.generateFrameNames(Ability.APPLE_ACID, {
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SACRED_SWORD,
      frames: this.game.anims.generateFrameNames(Ability.SACRED_SWORD, {
        start: 0,
        end: 30,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SHADOW_SNEAK,
      frames: this.game.anims.generateFrameNames(Ability.SHADOW_SNEAK, {
        start: 0,
        end: 34,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DIVE,
      frames: this.game.anims.generateFrameNames(Ability.DIVE, {
        start: 0,
        end: 6,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.LIQUIDATION,
      frames: this.game.anims.generateFrameNames(Ability.LIQUIDATION, {
        start: 0,
        end: 17,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.PAYDAY,
      frames: this.game.anims.generateFrameNames(Ability.PAYDAY, {
        start: 0,
        end: 80,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SHADOW_CLONE,
      frames: this.game.anims.generateFrameNames(Ability.SHADOW_CLONE, {
        start: 0,
        end: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HYPER_VOICE,
      frames: this.game.anims.generateFrameNames(Ability.HYPER_VOICE, {
        start: 0,
        end: 3
      }),
      duration: 300,
      repeat: 3
    })

    this.game.anims.create({
      key: Ability.PETAL_DANCE,
      frames: this.game.anims.generateFrameNames(Ability.PETAL_DANCE, {
        start: 0,
        end: 53,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ECHO,
      frames: this.game.anims.generateFrameNames(Ability.ECHO, {
        start: 0,
        end: 36,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.EXPLOSION,
      frames: this.game.anims.generateFrameNames(Ability.EXPLOSION, {
        start: 0,
        end: 22,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SHADOW_BALL,
      frames: this.game.anims.generateFrameNames(Ability.SHADOW_BALL, {
        start: 0,
        end: 43,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SPIKE_ARMOR,
      frames: this.game.anims.generateFrameNames(Ability.SPIKE_ARMOR, {
        start: 0,
        end: 14,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: Ability.SEED_FLARE,
      frames: this.game.anims.generateFrameNames(Ability.SEED_FLARE, {
        start: 0,
        end: 30,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.ORIGIN_PULSE,
      frames: this.game.anims.generateFrameNames(Ability.ORIGIN_PULSE, {
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: -1,
      yoyo: true
    })

    this.game.anims.create({
      key: Ability.SONG_OF_DESIRE,
      frames: this.game.anims.generateFrameNames(Ability.SONG_OF_DESIRE, {
        start: 0,
        end: 43,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CONFUSING_MIND,
      frames: this.game.anims.generateFrameNames(Ability.CONFUSING_MIND, {
        start: 0,
        end: 36,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BONEMERANG,
      frames: this.game.anims.generateFrameNames(Ability.BONEMERANG, {
        start: 0,
        end: 7,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 3
    })

    this.game.anims.create({
      key: Ability.GROWL,
      frames: this.game.anims.generateFrameNames(Ability.GROWL, {
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HIGH_JUMP_KICK,
      frames: this.game.anims.generateFrameNames(Ability.HIGH_JUMP_KICK, {
        start: 0,
        end: 21,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.TRI_ATTACK,
      frames: this.game.anims.generateFrameNames(Ability.TRI_ATTACK, {
        start: 0,
        end: 20,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.BLUE_FLARE,
      frames: this.game.anims.generateFrameNames(Ability.BLUE_FLARE, {
        start: 0,
        end: 14,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FUSION_BOLT,
      frames: this.game.anims.generateFrameNames(Ability.FUSION_BOLT, {
        start: 0,
        end: 17,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CHATTER,
      frames: this.game.anims.generateFrameNames(Ability.CHATTER, {
        start: 0,
        end: 25,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.DISARMING_VOICE,
      frames: this.game.anims.generateFrameNames(Ability.DISARMING_VOICE, {
        start: 0,
        end: 43,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.RELIC_SONG,
      frames: this.game.anims.generateFrameNames(Ability.RELIC_SONG, {
        start: 0,
        end: 34,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.CLANGOROUS_SOUL,
      frames: this.game.anims.generateFrameNames(Ability.CLANGOROUS_SOUL, {
        start: 0,
        end: 18,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.EARTHQUAKE,
      frames: this.game.anims.generateFrameNames(Ability.EARTHQUAKE, {
        start: 0,
        end: 10,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.AQUA_JET,
      frames: this.game.anims.generateFrameNames(Ability.AQUA_JET, {
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.MIND_BLOWN,
      frames: this.game.anims.generateFrameNames(Ability.MIND_BLOWN, {
        start: 0,
        end: 12,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FUTURE_SIGHT,
      frames: this.game.anims.generateFrameNames(Ability.FUTURE_SIGHT, {
        start: 0,
        end: 10,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SMOG,
      frames: this.game.anims.generateFrameNames(Ability.SMOG, {
        start: 0,
        end: 10,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.AURORA_BEAM,
      frames: this.game.anims.generateFrameNames(Ability.AURORA_BEAM, {
        start: 0,
        end: 6,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 3
    })

    this.game.anims.create({
      key: "MIND_BLOWN_SELF",
      frames: this.game.anims.generateFrameNames("MIND_BLOWN_SELF", {
        start: 0,
        end: 11,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: "FIELD_DEATH",
      frames: this.game.anims.generateFrameNames("FIELD_DEATH", {
        start: 0,
        end: 8,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: "FAIRY_CRIT",
      frames: this.game.anims.generateFrameNames("FAIRY_CRIT", {
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.HEAD_SMASH,
      frames: this.game.anims.generateFrameNames("specials", {
        start: 0,
        end: 79,
        zeroPad: 3,
        prefix: `${Ability.ROCK_SLIDE}/`
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: "ground-grow",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 56,
        zeroPad: 3,
        prefix: "GROUND/cell/"
      }),
      duration: 800,
      repeat: 0
    })

    this.game.anims.create({
      key: "INCENSE_DAMAGE",
      frames: this.game.anims.generateFrameNames("INCENSE_DAMAGE", {
        start: 0,
        end: 6,
        zeroPad: 3
      }),
      duration: 500,
      repeat: 0
    })

    this.game.anims.create({
      key: "STATIC",
      frames: this.game.anims.generateFrameNames("STATIC", {
        start: 0,
        end: 13,
        zeroPad: 3
      }),
      duration: 500,
      repeat: 0
    })

    this.game.anims.create({
      key: "BRIGHT_POWDER",
      frames: this.game.anims.generateFrameNames("BRIGHT_POWDER", {
        start: 0,
        end: 18,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })
  }

  createAttacksAnimations() {
    this.game.anims.create({
      key: "GRASS/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 10,
        zeroPad: 3,
        prefix: "GRASS/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "GRASS/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 25,
        zeroPad: 3,
        prefix: "GRASS/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "WATER/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 18,
        zeroPad: 3,
        prefix: "WATER/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "WATER/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: "WATER/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FIRE/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 8,
        zeroPad: 3,
        prefix: "FIRE/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FIRE/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 30,
        zeroPad: 3,
        prefix: "FIRE/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "ROCK/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 10,
        zeroPad: 3,
        prefix: "ROCK/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FIGHTING/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: "FIGHTING/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FIGHTING/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 9,
        end: 39,
        zeroPad: 3,
        prefix: "FIGHTING/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "DRAGON/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 10,
        zeroPad: 3,
        prefix: "DRAGON/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "NORMAL/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: "NORMAL/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "DRAGON/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 45,
        zeroPad: 3,
        prefix: "DRAGON/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "POISON/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 27,
        zeroPad: 3,
        prefix: "POISON/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "POISON/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 12,
        zeroPad: 3,
        prefix: "POISON/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "ELECTRIC/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 3,
        zeroPad: 3,
        prefix: "ELECTRIC/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "GHOST/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 23,
        zeroPad: 3,
        prefix: "GHOST/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "PSYCHIC/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 38,
        zeroPad: 3,
        prefix: "PSYCHIC/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "ELECTRIC/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 5,
        zeroPad: 3,
        prefix: "ELECTRIC/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FAIRY/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 25,
        zeroPad: 3,
        prefix: "FAIRY/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FAIRY/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 13,
        zeroPad: 3,
        prefix: "FAIRY/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FLYING/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 24,
        zeroPad: 3,
        prefix: "FLYING/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "FLYING/range",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 7,
        zeroPad: 3,
        prefix: "FLYING/range/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "BUG/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 15,
        zeroPad: 3,
        prefix: "BUG/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "ICE/melee",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 8,
        zeroPad: 3,
        prefix: "ICE/melee/"
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "ICE/range",
      frames: this.game.anims.generateFrameNames("ICE_RANGE", {
        start: 0,
        end: 13,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: -1
    })

    this.game.anims.create({
      key: "WATER/cell",
      frames: this.game.anims.generateFrameNames("attacks", {
        start: 0,
        end: 6,
        zeroPad: 3,
        prefix: "WATER/cell/"
      }),
      duration: 200,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.FAKE_TEARS,
      frames: this.game.anims.generateFrameNames(Ability.FAKE_TEARS, {
        start: 0,
        end: 17,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SPARKLING_ARIA,
      frames: this.game.anims.generateFrameNames(Ability.SPARKLING_ARIA, {
        start: 0,
        end: 52,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SKY_ATTACK,
      frames: this.game.anims.generateFrameNames(Ability.SKY_ATTACK, {
        start: 0,
        end: 5,
        zeroPad: 3
      }),
      duration: 500,
      repeat: 2
    })

    this.game.anims.create({
      key: Ability.ILLUSION,
      frames: this.game.anims.generateFrameNames(Ability.ILLUSION, {
        start: 0,
        end: 14,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.SPIRIT_SHACKLE,
      frames: this.game.anims.generateFrameNames(Ability.SPIRIT_SHACKLE, {
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      duration: 160,
      repeat: -1
    })

    this.game.anims.create({
      key: Ability.WATER_SHURIKEN,
      frames: this.game.anims.generateFrameNames(Ability.WATER_SHURIKEN, {
        start: 0,
        end: 7,
        zeroPad: 3
      }),
      duration: 333,
      repeat: -1
    })

    this.game.anims.create({
      key: Ability.WONDER_GUARD,
      frames: this.game.anims.generateFrameNames(Ability.WONDER_GUARD, {
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      duration: 250,
      repeat: 0
    })

    this.game.anims.create({
      key: Ability.X_SCISSOR,
      frames: this.game.anims.generateFrameNames(Ability.X_SCISSOR, {
        start: 0,
        end: 9,
        zeroPad: 3
      }),
      duration: 1000,
      repeat: 0
    })
  }

  animatePokemon(entity: Pokemon, action: PokemonActionState) {
    const orientation =
      action === PokemonActionState.SLEEP
        ? Orientation.DOWN
        : entity.orientation
    const tint = entity.shiny ? PokemonTint.SHINY : PokemonTint.NORMAL
    const animKey = `${entity.index}/${tint}/${action}/${SpriteType.ANIM}/${orientation}`
    const shadowKey = `${entity.index}/${tint}/${action}/${SpriteType.SHADOW}/${orientation}`

    entity.sprite.anims.play(animKey)
    entity.shadow.anims.play(shadowKey)
  }
}

export function createStatusAnimations(game: Phaser.Scene) {
  game.anims.create({
    key: "poison",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 14,
      zeroPad: 3,
      prefix: "status/poison/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "sleep",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 9,
      zeroPad: 3,
      prefix: "status/sleep/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "silence",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 8,
      zeroPad: 3,
      prefix: "status/silence/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "protect",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 9,
      zeroPad: 3,
      prefix: "status/protect/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "freeze",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 5,
      zeroPad: 3,
      prefix: "status/freeze/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "confusion",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 3,
      zeroPad: 3,
      prefix: "status/confusion/"
    }),
    frameRate: 4,
    repeat: -1
  })

  game.anims.create({
    key: "burn",
    frames: game.anims.generateFrameNames("status", {
      start: 0,
      end: 6,
      zeroPad: 3,
      prefix: "status/burn/"
    }),
    frameRate: 15,
    repeat: -1
  })

  game.anims.create({
    key: "wound",
    frames: game.anims.generateFrameNames("wound", {
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 3,
    repeat: -1
  })

  game.anims.create({
    key: "resurection",
    frames: game.anims.generateFrameNames("resurection", {
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 3,
    repeat: -1
  })

  /*game.anims.create({
    key: "smoke",
    frames: game.anims.generateFrameNames("smoke", {
      start: 0,
      end: 9,
      zeroPad: 3
    }),
    frameRate: 3,
    repeat: -1
  })*/

  game.anims.create({
    key: "paralysis",
    frames: game.anims.generateFrameNames("paralysis", {
      start: 0,
      end: 4,
      zeroPad: 3
    }),
    frameRate: 8,
    repeat: -1,
    repeatDelay: 500
  })

  game.anims.create({
    key: "armorReduction",
    frames: game.anims.generateFrameNames("armorReduction", {
      start: 0,
      end: 1,
      zeroPad: 3
    }),
    frameRate: 3,
    repeat: -1
  })

  game.anims.create({
    key: "VOID_BOOST",
    frames: game.anims.generateFrameNames("VOID_BOOST", {
      start: 0,
      end: 7,
      zeroPad: 3
    }),
    frameRate: 9,
    repeat: -1
  })

  game.anims.create({
    key: "ELECTRIC_SURGE",
    frames: game.anims.generateFrameNames("ELECTRIC_SURGE", {
      start: 0,
      end: 6,
      zeroPad: 3
    }),
    frameRate: 9,
    repeat: -1
  })

  game.anims.create({
    key: "PSYCHIC_SURGE",
    frames: game.anims.generateFrameNames("PSYCHIC_SURGE", {
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 6,
    repeat: -1,
    yoyo: true
  })

  game.anims.create({
    key: Ability.MISTY_SURGE,
    frames: game.anims.generateFrameNames(Ability.MISTY_SURGE, {
      start: 0,
      end: 2,
      zeroPad: 3
    }),
    duration: 1000,
    repeat: -1
  })

  game.anims.create({
    key: Ability.GRASSY_SURGE,
    frames: game.anims.generateFrameNames(Ability.GRASSY_SURGE, {
      start: 0,
      end: 7,
      zeroPad: 3
    }),
    duration: 1000,
    repeat: -1,
    yoyo: false
  })

  game.anims.create({
    key: "rune_protect",
    frames: game.anims.generateFrameNames("rune_protect", {
      start: 0,
      end: 9,
      zeroPad: 3
    }),
    frameRate: 6,
    repeat: -1,
    yoyo: true
  })
}
