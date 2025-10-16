import { getPokemonData } from "../../../models/precomputed/precomputed-pokemon-data"
import { AnimationOriented, AnimationType } from "../../../types/Animation"
import delays from "../../../types/delays.json"
import {
  Orientation,
  OrientationFlip,
  PokemonActionState,
  PokemonTint,
  SpriteType
} from "../../../types/enum/Game"
import { Berries } from "../../../types/enum/Item"
import { Passive } from "../../../types/enum/Passive"
import { PkmByIndex } from "../../../types/enum/Pokemon"
import { logger } from "../../../utils/logger"
import { fpsToDuration } from "../../../utils/number"
import atlas from "../assets/atlas.json"
import durations from "../assets/pokemons/durations.json"
import PokemonSprite from "./components/pokemon"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "./components/pokemon-animations"

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

    if (!pkm && !PokemonAnimations[pkm]) {
      logger.warn(`No animation config declared for ${pkm}`)
      return
    }
    const pokemonData = getPokemonData(pkm)
    const config = {
      ...DEFAULT_POKEMON_ANIMATION_CONFIG,
      ...(PokemonAnimations[pkm] ?? {})
    }

    if (config.shinyUnavailable && shiny === PokemonTint.SHINY) return

    const actions: Set<AnimationType> = new Set([AnimationType.Idle])
    actions.add(config.hurt ?? AnimationType.Hurt)

    if (pokemonData.passive !== Passive.INANIMATE) {
      actions.add(config.walk)
      actions.add(config.sleep)
      actions.add(config.eat)
      actions.add(config.hop)
      actions.add(config.attack)
      actions.add(config.ability)
      actions.add(config.emote)
    }

    //logger.debug(`Init animations: ${index} => ${actions.join(",")}`)

    actions.forEach((action) => {
      const spriteTypes = config.noShadow
        ? [SpriteType.ANIM]
        : [SpriteType.ANIM, SpriteType.SHADOW]
      spriteTypes.forEach((mode) => {
        const directionArray =
          AnimationOriented[action] === false &&
          PokemonAnimations[PkmByIndex[index]]?.animationsOriented?.includes(
            action
          ) !== true
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
    const pokemonData = getPokemonData(pkm)
    const config = {
      ...DEFAULT_POKEMON_ANIMATION_CONFIG,
      ...(PokemonAnimations[pkm] ?? {})
    }

    if (config.shinyUnavailable && shiny === PokemonTint.SHINY) return

    const actions: Set<AnimationType> = new Set([AnimationType.Idle])
    actions.add(config.hurt)

    if (pokemonData.passive !== Passive.INANIMATE) {
      actions.add(AnimationType.Walk)
      actions.add(config.sleep)
      actions.add(config.eat)
      actions.add(config.hop)
      actions.add(config.attack)
      actions.add(config.ability)
      actions.add(config.emote)
    }

    //logger.debug(`Remove animations: ${index} => ${actions.join(",")}`)

    actions.forEach((action) => {
      const spriteTypes = config.noShadow
        ? [SpriteType.ANIM]
        : [SpriteType.ANIM, SpriteType.SHADOW]
      spriteTypes.forEach((mode) => {
        const directionArray =
          AnimationOriented[action] === false &&
          PokemonAnimations[PkmByIndex[index]]?.animationsOriented?.includes(
            action
          ) !== true
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
    pkmSprite: PokemonSprite
  ): AnimationType {
    const config = {
      ...DEFAULT_POKEMON_ANIMATION_CONFIG,
      ...(PokemonAnimations[PkmByIndex[pkmSprite.pokemon.index]] ?? {})
    }
    switch (state) {
      case PokemonActionState.HOP:
      case PokemonActionState.FISH:
      case PokemonActionState.BLOSSOM:
        return config.hop
      case PokemonActionState.HURT:
        return config.hurt
      case PokemonActionState.SLEEP:
        return config.sleep
      case PokemonActionState.EAT:
        return config.eat
      case PokemonActionState.WALK:
        return config.walk
      case PokemonActionState.ATTACK:
        return config.attack
      case PokemonActionState.EMOTE:
        return config.emote
      case PokemonActionState.IDLE:
      default:
        return config.idle
    }
  }

  animatePokemon(
    pokemonSprite: PokemonSprite,
    action: PokemonActionState,
    flip: boolean,
    loop: boolean = true
  ) {
    let animation = this.convertPokemonActionStateToAnimationType(
      action,
      pokemonSprite
    )

    const shouldLock =
      action === PokemonActionState.HOP ||
      action === PokemonActionState.HURT ||
      action === PokemonActionState.EMOTE

    const timeScale =
      action === PokemonActionState.ATTACK
        ? getAttackAnimTimeScale(
            pokemonSprite.pokemon.index,
            pokemonSprite.pokemon.speed
          )
        : 1

    if (
      pokemonSprite.pokemon.passive === Passive.DRUMMER &&
      pokemonSprite.targetY == null &&
      action === PokemonActionState.WALK
    ) {
      animation =
        PokemonAnimations[PkmByIndex[pokemonSprite.pokemon.index]].emote ??
        DEFAULT_POKEMON_ANIMATION_CONFIG.emote // use drumming animation instead of attack
      pokemonSprite.orientation = Orientation.DOWN
    }

    try {
      this.play(pokemonSprite, animation, {
        flip,
        lock: shouldLock,
        repeat: loop ? -1 : 0,
        timeScale
      })
    } catch (err) {
      logger.warn(
        `Can't play animation ${animation} for ${pokemonSprite?.name}`,
        err
      )
    }

    if (pokemonSprite.troopers) {
      pokemonSprite.troopers.forEach((trooper) => {
        trooper.orientation = pokemonSprite.orientation
        this.animatePokemon(trooper, action, flip, loop)
      })
    }
  }

  play(
    pkmSprite: PokemonSprite,
    animation: AnimationType,
    config: {
      flip?: boolean
      repeat?: number
      lock?: boolean
      timeScale?: number
    } = {}
  ) {
    if (pkmSprite.animationLocked || !pkmSprite.sprite?.anims) return

    let orientation = config.flip
      ? OrientationFlip[pkmSprite.orientation]
      : pkmSprite.orientation

    if (
      AnimationOriented[animation] === false &&
      PokemonAnimations[
        PkmByIndex[pkmSprite.pokemon.index]
      ]?.animationsOriented?.includes(animation) !== true
    ) {
      orientation = Orientation.DOWN
    }

    const textureIndex =
      pkmSprite.scene &&
      pkmSprite.scene.textures.exists(pkmSprite.pokemon.index)
        ? pkmSprite.pokemon.index
        : "0000"
    const tint =
      pkmSprite.pokemon.shiny &&
      !PokemonAnimations[PkmByIndex[pkmSprite.pokemon.index]].shinyUnavailable
        ? PokemonTint.SHINY
        : PokemonTint.NORMAL
    const animKey = `${textureIndex}/${tint}/${animation}/${SpriteType.ANIM}/${orientation}`
    const shadowKey = `${textureIndex}/${tint}/${animation}/${SpriteType.SHADOW}/${orientation}`

    if (
      pkmSprite.sprite.anims.currentAnim?.key === animKey &&
      pkmSprite.sprite.anims.currentAnim?.repeat === -1
    )
      return

    pkmSprite.sprite.anims.play({
      key: animKey,
      repeat: config.repeat,
      timeScale: config.timeScale
    })
    if (pkmSprite.shadow) {
      pkmSprite.shadow.anims.play({
        key: shadowKey,
        repeat: config.repeat,
        timeScale: config.timeScale
      })
    }
    if (config.lock) {
      pkmSprite.animationLocked = true
    }
  }
}

export function getAttackAnimTimeScale(pokemonIndex: string, speed: number) {
  const t = delays[pokemonIndex]?.t || 36 // total number of frames in the animation

  const timeScale = (t * (0.4 + speed * 0.007)) / FPS_POKEMON_ANIMS
  return timeScale
}
