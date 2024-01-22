/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable max-len */
import {
  Orientation,
  SpriteType,
  PokemonTint,
  PokemonActionState,
  OrientationFlip
} from "../../../types/enum/Game"
import { AnimationType, AnimationComplete } from "../../../types/Animation"
import { Ability } from "../../../types/enum/Ability"
import Pokemon from "./components/pokemon"
import durations from "../../dist/client/assets/pokemons/durations.json"
import indexList from "../../dist/client/assets/pokemons/indexList.json"
import { logger } from "../../../utils/logger"
import { AnimationConfig, Pkm, PkmIndex } from "../../../types/enum/Pokemon"
import { Berries } from "../../../types/enum/Item"
import { fpsToDuration } from "../../../utils/number"
import atlas from "../assets/atlas.json"

const DEFAULT_FPS = 20

export default class AnimationManager {
  game: Phaser.Scene

  constructor(game: Phaser.Scene) {
    this.game = game

    indexList.forEach((index) => {
      const tints = Object.values(PokemonTint) as PokemonTint[]
      tints.forEach((shiny) => {
        const actions: AnimationType[] = [
          AnimationType.Idle,
          AnimationType.Walk,
          AnimationType.Sleep,
          AnimationType.Hop,
          AnimationType.Hurt
        ]

        const conf = (Object.keys(PkmIndex) as Pkm[]).find(
          (p) => index === PkmIndex[p]
        )

        if (conf && AnimationConfig[conf]) {
          if (
            AnimationConfig[conf].shinyUnavailable &&
            shiny === PokemonTint.SHINY
          )
            return
          if (!actions.includes(AnimationConfig[conf as Pkm].attack)) {
            actions.push(AnimationConfig[conf as Pkm].attack)
          }
          if (!actions.includes(AnimationConfig[conf as Pkm].ability)) {
            actions.push(AnimationConfig[conf as Pkm].ability)
          }
          if (!actions.includes(AnimationConfig[conf as Pkm].emote)) {
            actions.push(AnimationConfig[conf as Pkm].emote)
          }
        } else {
          actions.push(AnimationType.Attack)
        }

        //logger.debug(`Init animations: ${index} => ${actions.join(",")}`)

        actions.forEach((action) => {
          const modes = Object.values(SpriteType) as SpriteType[]
          modes.forEach((mode) => {
            const directionArray =
              AnimationComplete[action] === false
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
                const shouldLoop = [
                  AnimationType.Idle,
                  AnimationType.Sleep,
                  AnimationType.Hop
                ].includes(action)

                this.game.anims.create({
                  key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                  frames: frameArray,
                  repeat: shouldLoop ? -1 : 0
                })
              } else {
                logger.warn(
                  "duration array missing for",
                  `${index}/${shiny}/${action}/${mode}`
                )
              }
            })
          })
        })
      })
    })

    for (let pack in atlas) {
      if (atlas[pack].anims) {
        const doesContainMultipleAnims =
          Object.keys(atlas[pack].anims).length > 1
        for (let anim in atlas[pack].anims) {
          const animConfig = atlas[pack].anims[anim]
          this.createAnimation({
            key: anim,
            atlas: atlas[pack].name,
            prefix: doesContainMultipleAnims ? anim + "/" : "",
            ...animConfig
          })
        }
      }
    }

    this.createMinigameAnimations()
    this.createEnvironmentAnimations()
    createStatusAnimations(this.game)
  }

  createAnimation({
    key,
    atlas,
    prefix = "",
    frames,
    repeat = 0,
    fps = DEFAULT_FPS
  }: {
    key: string
    atlas?: string
    prefix?: string
    frames: number
    repeat?: number
    fps?: number
  }) {
    this.game.anims.create({
      key,
      frames: this.game.anims.generateFrameNames(atlas ?? key, {
        start: 0,
        end: frames - 1,
        zeroPad: 3,
        prefix,
        suffix: ".png"
      }),
      duration: fpsToDuration(fps)(frames),
      repeat
    })
  }

  createMinigameAnimations() {
    this.game.anims.create({
      key: "portal",
      frames: this.game.anims.generateFrameNames("portal", {
        start: 0,
        end: 7,
        zeroPad: 3
      }),
      duration: 600,
      repeat: -1
    })

    this.game.anims.create({
      key: "open_chest",
      frames: this.game.anims.generateFrameNames("chest", {
        start: 1,
        end: 4,
        suffix: ".png"
      }),
      duration: 600,
      repeat: 0
    })

    this.game.anims.create({
      key: "shine",
      frames: this.game.anims.generateFrameNames("shine", {
        start: 0,
        end: 47,
        suffix: ".png"
      }),
      duration: 1000,
      repeat: -1
    })
  }

  createEnvironmentAnimations() {
    Berries.forEach((berryName) => {
      for (let step = 1; step <= 3; step++) {
        this.game.anims.create({
          key: `${berryName}_TREE_STEP_${step}`,
          frames: this.game.anims.generateFrameNames("berry_trees", {
            start: step * 2 - 1,
            end: step * 2,
            prefix: berryName + "_"
          }),
          duration: 600,
          repeat: -1
        })
      }
    })

    this.game.anims.create({
      key: `CROP`,
      frames: this.game.anims.generateFrameNames("berry_trees", {
        start: 1,
        end: 2,
        prefix: "CROP_"
      }),
      duration: 600,
      repeat: -1
    })
  }

  convertPokemonActionStateToAnimationType(
    state: PokemonActionState,
    entity: Pokemon
  ): AnimationType {
    switch (state) {
      case PokemonActionState.HOP:
      case PokemonActionState.FISH:
        return AnimationType.Hop
      case PokemonActionState.HURT:
        return AnimationType.Hurt
      case PokemonActionState.SLEEP:
        return AnimationType.Sleep
      case PokemonActionState.WALK:
        return AnimationType.Walk
      case PokemonActionState.ATTACK:
        return AnimationConfig[entity.name as Pkm].attack
      case PokemonActionState.EMOTE:
        return AnimationConfig[entity.name as Pkm].emote
      case PokemonActionState.IDLE:
      default:
        return AnimationType.Idle
    }
  }

  animatePokemon(entity: Pokemon, action: PokemonActionState, flip: boolean) {
    const animation = this.convertPokemonActionStateToAnimationType(
      action,
      entity
    )

    let lock = false
    let repeat: number | undefined
    if (
      action === PokemonActionState.HOP ||
      action === PokemonActionState.HURT
    ) {
      lock = true
      repeat = -1
    }

    try {
      this.play(entity, animation, { flip, lock, repeat })
    } catch (err) {
      logger.warn(`Can't play animation ${animation} for ${entity.name}`, err)
    }
  }

  play(
    entity: Pokemon,
    animation: AnimationType,
    config: { flip?: boolean; repeat?: number; lock?: boolean } = {}
  ) {
    if (entity.animationLocked) return

    const orientation = config.flip
      ? OrientationFlip[entity.orientation]
      : entity.orientation

    const orientationCorrected =
      AnimationComplete[animation] === true ? orientation : Orientation.DOWN

    const textureIndex =
      entity.scene && entity.scene.textures.exists(entity.index)
        ? entity.index
        : "0000"
    const tint =
      entity.shiny && !AnimationConfig[entity.name].shinyUnavailable
        ? PokemonTint.SHINY
        : PokemonTint.NORMAL
    const animKey = `${textureIndex}/${tint}/${animation}/${SpriteType.ANIM}/${orientationCorrected}`
    const shadowKey = `${textureIndex}/${tint}/${animation}/${SpriteType.SHADOW}/${orientationCorrected}`

    entity.sprite.anims.play({ key: animKey, repeat: config.repeat })
    entity.shadow.anims.play({ key: shadowKey, repeat: config.repeat })
    if (config.lock) {
      entity.animationLocked = true
    }
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

  game.anims.create({
    key: "RESURECT",
    frames: game.anims.generateFrameNames("RESURECT", {
      start: 0,
      end: 56,
      zeroPad: 3
    }),
    frameRate: 28,
    repeat: 0
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
    key: "charm",
    frames: game.anims.generateFrameNames("charm", {
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 8,
    repeat: -1
  })

  game.anims.create({
    key: "flinch",
    frames: game.anims.generateFrameNames("flinch", {
      start: 0,
      end: 8,
      zeroPad: 3
    }),
    frameRate: 8,
    repeat: -1
  })

  game.anims.create({
    key: "curse",
    frames: game.anims.generateFrameNames("curse", {
      start: 0,
      end: 5
    }),
    frameRate: 8,
    repeat: -1
  })
  game.anims.create({
    key: "CURSE_EFFECT",
    frames: game.anims.generateFrameNames("CURSE_EFFECT", {
      start: 0,
      end: 10
    }),
    frameRate: 8,
    repeat: 0
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
