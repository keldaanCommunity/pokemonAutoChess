import { AnimationComplete, AnimationType } from "../../../types/Animation"
import {
  Orientation,
  OrientationFlip,
  PokemonActionState,
  PokemonTint,
  SpriteType
} from "../../../types/enum/Game"
import { Berries } from "../../../types/enum/Item"
import { AnimationConfig, PkmByIndex } from "../../../types/enum/Pokemon"
import { logger } from "../../../utils/logger"
import { fpsToDuration } from "../../../utils/number"
import atlas from "../assets/atlas.json"
import delays from "../../../types/delays.json"
import durations from "../assets/pokemons/durations.json"
import PokemonSprite from "./components/pokemon"
import { getPokemonData } from "../../../models/precomputed/precomputed-pokemon-data"
import { Passive } from "../../../types/enum/Passive"

const FPS_EFFECTS = 20
const FPS_POKEMON_ANIMS = 36

export default class AnimationManager {
  game: Phaser.Scene

  constructor(game: Phaser.Scene) {
    this.game = game

    for (const pack in atlas.packs) {
      if (atlas.packs[pack].anims) {
        const doesContainMultipleAnims =
          Object.keys(atlas.packs[pack].anims).length > 1
        for (const anim in atlas.packs[pack].anims) {
          const animConfig = atlas.packs[pack].anims[anim]
          this.createAnimation({
            key: anim,
            atlas: atlas.packs[pack].name,
            prefix: doesContainMultipleAnims ? anim + "/" : "",
            ...animConfig
          })
        }
      }
    }

    this.createMinigameAnimations()
    this.createEnvironmentAnimations()
  }

  createPokemonAnimations(index: string, shiny: PokemonTint) {
    const pkm = PkmByIndex[index]

    if (!pkm && !AnimationConfig[pkm]) {
      logger.warn(`No animation config for ${pkm}`)
      return
    }
    const pokemonData = getPokemonData(pkm)
    const config = AnimationConfig[pkm]

    if (config.shinyUnavailable && shiny === PokemonTint.SHINY) return

    const actions: Set<AnimationType> = new Set([AnimationType.Idle])
    actions.add(config.hurt ?? AnimationType.Hurt)

    if (pokemonData.passive !== Passive.INANIMATE) {
      actions.add(AnimationType.Walk)
      actions.add(config.sleep ?? AnimationType.Sleep)
      actions.add(config.eat ?? AnimationType.Eat)
      actions.add(config.hop ?? AnimationType.Hop)
      actions.add(config.attack ?? AnimationType.Attack)
      actions.add(config.ability ?? AnimationType.SpAttack)
      actions.add(config.emote ?? AnimationType.Pose)
    }

    //logger.debug(`Init animations: ${index} => ${actions.join(",")}`)

    actions.forEach((action) => {
      const spriteTypes = config.noShadow
        ? [SpriteType.ANIM]
        : [SpriteType.ANIM, SpriteType.SHADOW]
      spriteTypes.forEach((mode) => {
        const directionArray =
          AnimationComplete[action] === false
            ? [Orientation.DOWN]
            : Object.values(Orientation)
        directionArray.forEach((direction) => {
          const durationArray: number[] =
            durations[`${index}/${shiny}/${action}/${mode}`]
          if (!durationArray && action === AnimationType.Eat) {
            // Very few pokemons have eat animations, so we use sleep animations instead as a fallback
            config.eat = AnimationType.Sleep
            return
          }
          if (durationArray) {
            const frameArray = this.game.anims.generateFrameNames(index, {
              start: 0,
              end: durationArray.length - 1,
              zeroPad: 4,
              prefix: `${shiny}/${action}/${mode}/${direction}/`
            })
            for (let i = 0; i < durationArray.length; i++) {
              if (frameArray[i]) {
                frameArray[i]["duration"] =
                  durationArray[i] * (1000 / FPS_POKEMON_ANIMS)
              }
            }
            const shouldLoop = [
              AnimationType.Idle,
              AnimationType.Sleep,
              AnimationType.Eat,
              AnimationType.Hop
            ].includes(action)

            const key = `${index}/${shiny}/${action}/${mode}/${direction}`
            if (!this.game.anims.exists(key)) {
              this.game.anims.create({
                key: `${index}/${shiny}/${action}/${mode}/${direction}`,
                frames: frameArray,
                repeat: shouldLoop ? -1 : 0
              })
            }
          } else {
            logger.warn(
              "duration array missing for",
              `${index}/${shiny}/${action}/${mode}`
            )
          }
        })
      })
    })
  }

  unloadPokemonAnimations(index: string, shiny: PokemonTint) {
    const pkm = PkmByIndex[index]

    if (!pkm && !AnimationConfig[pkm]) {
      logger.warn(`No animation config for ${pkm}`)
      return
    }
    const pokemonData = getPokemonData(pkm)
    const config = AnimationConfig[pkm]

    if (config.shinyUnavailable && shiny === PokemonTint.SHINY) return

    const actions: Set<AnimationType> = new Set([AnimationType.Idle])
    actions.add(config.hurt ?? AnimationType.Hurt)

    if (pokemonData.passive !== Passive.INANIMATE) {
      actions.add(AnimationType.Walk)
      actions.add(config.sleep ?? AnimationType.Sleep)
      actions.add(config.eat ?? AnimationType.Eat)
      actions.add(config.hop ?? AnimationType.Hop)
      actions.add(config.attack ?? AnimationType.Attack)
      actions.add(config.ability ?? AnimationType.SpAttack)
      actions.add(config.emote ?? AnimationType.Pose)
    }

    //logger.debug(`Remove animations: ${index} => ${actions.join(",")}`)

    actions.forEach((action) => {
      const spriteTypes = config.noShadow
        ? [SpriteType.ANIM]
        : [SpriteType.ANIM, SpriteType.SHADOW]
      spriteTypes.forEach((mode) => {
        const directionArray =
          AnimationComplete[action] === false
            ? [Orientation.DOWN]
            : Object.values(Orientation)
        directionArray.forEach((direction) => {
          this.game.anims.remove(
            `${index}/${shiny}/${action}/${mode}/${direction}`
          )
        })
      })
    })
  }

  createAnimation({
    key,
    atlas,
    prefix = "",
    frames,
    repeat = 0,
    fps = FPS_EFFECTS,
    yoyo = false
  }: {
    key: string
    atlas?: string
    prefix?: string
    frames: number
    repeat?: number
    fps?: number
    yoyo?: boolean
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
      repeat,
      yoyo
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
    entity: PokemonSprite
  ): AnimationType {
    const config = AnimationConfig[PkmByIndex[entity.index]]
    switch (state) {
      case PokemonActionState.HOP:
      case PokemonActionState.FISH:
        return config?.hop ?? AnimationType.Hop
      case PokemonActionState.HURT:
        return config?.hurt ?? AnimationType.Hurt
      case PokemonActionState.SLEEP:
        return config?.sleep ?? AnimationType.Sleep
      case PokemonActionState.EAT:
        return config?.eat ?? AnimationType.Eat
      case PokemonActionState.WALK:
        return AnimationType.Walk
      case PokemonActionState.ATTACK:
        return config?.attack ?? AnimationType.Attack
      case PokemonActionState.EMOTE:
        return config?.emote ?? AnimationType.Pose
      case PokemonActionState.IDLE:
      default:
        return AnimationType.Idle
    }
  }

  animatePokemon(
    entity: PokemonSprite,
    action: PokemonActionState,
    flip: boolean,
    loop: boolean = true
  ) {
    const animation = this.convertPokemonActionStateToAnimationType(
      action,
      entity
    )

    const shouldLock =
      action === PokemonActionState.HOP ||
      action === PokemonActionState.HURT ||
      action === PokemonActionState.EMOTE

    const timeScale =
      action === PokemonActionState.ATTACK
        ? getAttackAnimTimeScale(entity.index, entity.speed)
        : 1

    try {
      this.play(entity, animation, {
        flip,
        lock: shouldLock,
        repeat: loop ? -1 : 0,
        timeScale
      })
    } catch (err) {
      logger.warn(`Can't play animation ${animation} for ${entity?.name}`, err)
    }
  }

  play(
    entity: PokemonSprite,
    animation: AnimationType,
    config: {
      flip?: boolean
      repeat?: number
      lock?: boolean
      timeScale?: number
    } = {}
  ) {
    if (entity.animationLocked || !entity.sprite?.anims) return

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
      entity.shiny &&
      !AnimationConfig[PkmByIndex[entity.index]].shinyUnavailable
        ? PokemonTint.SHINY
        : PokemonTint.NORMAL
    const animKey = `${textureIndex}/${tint}/${animation}/${SpriteType.ANIM}/${orientationCorrected}`
    const shadowKey = `${textureIndex}/${tint}/${animation}/${SpriteType.SHADOW}/${orientationCorrected}`

    if (
      entity.sprite.anims.currentAnim?.key === animKey &&
      entity.sprite.anims.currentAnim?.repeat === -1
    )
      return

    entity.sprite.anims.play({
      key: animKey,
      repeat: config.repeat,
      timeScale: config.timeScale
    })
    if (entity.shadow) {
      entity.shadow.anims.play({
        key: shadowKey,
        repeat: config.repeat,
        timeScale: config.timeScale
      })
    }
    if (config.lock) {
      entity.animationLocked = true
    }
  }
}

export function getAttackAnimTimeScale(pokemonIndex: string, speed: number) {
  const t = delays[pokemonIndex]?.t || 36 // total number of frames in the animation

  const timeScale = (t * (0.4 + speed * 0.007)) / FPS_POKEMON_ANIMS
  return timeScale
}
