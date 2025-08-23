import { Geom } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import {
  AbilityAnimation,
  AbilityAnimationArgs,
  AbilityAnimationMaker,
  AbilityAnimationOptions,
  AnimationType,
  AttackSprite,
  AttackSpriteScale,
  HitSprite
} from "../../../../types/Animation"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../types/Config"
import { Ability } from "../../../../types/enum/Ability"
import {
  Orientation,
  OrientationFlip,
  PokemonActionState,
  PokemonTint,
  SpriteType
} from "../../../../types/enum/Game"
import { Sweets } from "../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../types/enum/Pokemon"
import { range } from "../../../../utils/array"
import { distanceE, distanceM } from "../../../../utils/distance"
import { logger } from "../../../../utils/logger"
import { angleBetween, max, min } from "../../../../utils/number"
import {
  getOrientation,
  OrientationAngle,
  OrientationArray,
  OrientationVector
} from "../../../../utils/orientation"
import { pickRandomIn, randomBetween } from "../../../../utils/random"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import { DEPTH } from "../depths"
import { DebugScene } from "../scenes/debug-scene"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"

export function displayHit(
  scene: GameScene | DebugScene,
  hitSpriteTypes: HitSprite | HitSprite[],
  x: number,
  y: number,
  flip: boolean
) {
  const hitSpriteType = Array.isArray(hitSpriteTypes)
    ? pickRandomIn(hitSpriteTypes)
    : hitSpriteTypes
  const frame = `${hitSpriteType}/000.png`

  if (
    !scene.textures.exists("attacks") ||
    !scene.textures.get("attacks").has(frame)
  ) {
    logger.warn(`Missing frame: ${frame} in attacks texture`)
    return null
  }

  if (!scene.anims.exists(hitSpriteType)) {
    logger.warn(`Missing animation: ${hitSpriteType}`)
    return null
  }

  const hitSprite = scene.add.sprite(
    x + (Math.random() - 0.5) * 30,
    y + (Math.random() - 0.5) * 30,
    "attacks",
    `${hitSpriteType}/000.png`
  )
  hitSprite
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(...(AttackSpriteScale[hitSpriteType] ?? [1, 1]))
  hitSprite.anims.play(hitSpriteType)
  hitSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    hitSprite.destroy()
  })
}

function tidalWaveAnimation(args: AbilityAnimationArgs) {
  const { scene, targetY, orientation, flip } = args
  const down = orientation === Orientation.DOWN
  const startCoords = transformEntityCoordinates(3.6, -4, flip)
  const endCoords = transformEntityCoordinates(3.6, 10, flip)
  const wave = scene.add
    .sprite(
      startCoords[0],
      startCoords[1],
      "abilities",
      `TIDAL_WAVE/00${targetY}.png` // targetY is used to store the tidal wave level
    )
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH.ABILITY_MINOR)
    .setScale(3)
    .setAlpha(0)
    .setRotation(down ? Math.PI : 0)
  scene.tweens.add({
    targets: wave,
    x: endCoords[0],
    y: endCoords[1],
    ease: "linear",
    duration: 1800,
    onComplete: () => {
      wave.destroy()
    },
    onUpdate: function (tween) {
      if (tween.progress < 0.2) {
        wave.setAlpha(tween.progress * 5)
      } else if (tween.progress > 0.8) {
        wave.setAlpha((1 - tween.progress) * 5)
      }
    }
  })
}

const UNOWNS_PER_ABILITY = new Map([
  [
    Ability.HIDDEN_POWER_A,
    [Pkm.UNOWN_A, Pkm.UNOWN_B, Pkm.UNOWN_R, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_B,
    [Pkm.UNOWN_B, Pkm.UNOWN_U, Pkm.UNOWN_R, Pkm.UNOWN_N]
  ],
  [
    Ability.HIDDEN_POWER_C,
    [Pkm.UNOWN_C, Pkm.UNOWN_O, Pkm.UNOWN_I, Pkm.UNOWN_N]
  ],
  [
    Ability.HIDDEN_POWER_D,
    [Pkm.UNOWN_D, Pkm.UNOWN_I, Pkm.UNOWN_T, Pkm.UNOWN_O]
  ],
  [
    Ability.HIDDEN_POWER_E,
    [Pkm.UNOWN_E, Pkm.UNOWN_G, Pkm.UNOWN_G, Pkm.UNOWN_S]
  ],
  [
    Ability.HIDDEN_POWER_F,
    [Pkm.UNOWN_F, Pkm.UNOWN_I, Pkm.UNOWN_S, Pkm.UNOWN_H]
  ],
  [
    Ability.HIDDEN_POWER_G,
    [Pkm.UNOWN_G, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_D]
  ],
  [
    Ability.HIDDEN_POWER_H,
    [Pkm.UNOWN_H, Pkm.UNOWN_E, Pkm.UNOWN_A, Pkm.UNOWN_L]
  ],
  [
    Ability.HIDDEN_POWER_I,
    [Pkm.UNOWN_I, Pkm.UNOWN_T, Pkm.UNOWN_E, Pkm.UNOWN_M]
  ],
  [
    Ability.HIDDEN_POWER_J,
    [Pkm.UNOWN_J, Pkm.UNOWN_A, Pkm.UNOWN_W, Pkm.UNOWN_S]
  ],
  [
    Ability.HIDDEN_POWER_K,
    [Pkm.UNOWN_K, Pkm.UNOWN_I, Pkm.UNOWN_C, Pkm.UNOWN_K]
  ],
  [
    Ability.HIDDEN_POWER_L,
    [Pkm.UNOWN_L, Pkm.UNOWN_O, Pkm.UNOWN_C, Pkm.UNOWN_K]
  ],
  [
    Ability.HIDDEN_POWER_M,
    [Pkm.UNOWN_M, Pkm.UNOWN_A, Pkm.UNOWN_N, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_N,
    [Pkm.UNOWN_N, Pkm.UNOWN_U, Pkm.UNOWN_K, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_O,
    [Pkm.UNOWN_O, Pkm.UNOWN_V, Pkm.UNOWN_E, Pkm.UNOWN_N]
  ],
  [
    Ability.HIDDEN_POWER_P,
    [Pkm.UNOWN_P, Pkm.UNOWN_E, Pkm.UNOWN_S, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_Q,
    [Pkm.UNOWN_Q, Pkm.UNOWN_U, Pkm.UNOWN_I, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_R,
    [Pkm.UNOWN_R, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_L]
  ],
  [
    Ability.HIDDEN_POWER_S,
    [Pkm.UNOWN_S, Pkm.UNOWN_U, Pkm.UNOWN_R, Pkm.UNOWN_F]
  ],
  [
    Ability.HIDDEN_POWER_T,
    [Pkm.UNOWN_T, Pkm.UNOWN_R, Pkm.UNOWN_E, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_U,
    [Pkm.UNOWN_U, Pkm.UNOWN_X, Pkm.UNOWN_I, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_V,
    [Pkm.UNOWN_V, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_W,
    [Pkm.UNOWN_W, Pkm.UNOWN_I, Pkm.UNOWN_S, Pkm.UNOWN_H]
  ],
  [
    Ability.HIDDEN_POWER_X,
    [Pkm.UNOWN_X, Pkm.UNOWN_R, Pkm.UNOWN_A, Pkm.UNOWN_Y]
  ],
  [
    Ability.HIDDEN_POWER_Y,
    [Pkm.UNOWN_Y, Pkm.UNOWN_O, Pkm.UNOWN_G, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_Z,
    [Pkm.UNOWN_Z, Pkm.UNOWN_E, Pkm.UNOWN_R, Pkm.UNOWN_O]
  ],
  [
    Ability.HIDDEN_POWER_EM,
    [
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION
    ]
  ],
  [
    Ability.HIDDEN_POWER_QM,
    [
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION
    ]
  ]
])

export function hiddenPowerAnimation(args: AbilityAnimationArgs) {
  const { scene, ability, positionX, positionY, flip } = args
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const unownsGroup = scene.add.group()
  const letters = UNOWNS_PER_ABILITY.get(ability as Ability)
  for (let n = 0; n < 8; n++) {
    letters?.forEach((letter, i) => {
      const unown = new PokemonSprite(
        scene,
        x,
        y,
        PokemonFactory.createPokemonFromName(letter),
        "unown",
        false,
        flip
      )
      unown.draggable = false
      unownsGroup.add(unown)
      scene.animationManager?.animatePokemon(
        unown,
        PokemonActionState.IDLE,
        flip
      )
    })
  }

  const circle = new Phaser.Geom.Circle(x, y, 10)
  Phaser.Actions.PlaceOnCircle(unownsGroup.getChildren(), circle)

  scene.tweens.add({
    targets: circle,
    radius: 500,
    ease: Phaser.Math.Easing.Quartic.Out,
    duration: 2500,
    onUpdate: function (tween) {
      Phaser.Actions.RotateAroundDistance(
        unownsGroup.getChildren(),
        { x, y },
        -0.02 * (1 - tween.progress),
        circle.radius
      )
      if (tween.progress > 0.8) {
        unownsGroup.setAlpha((1 - tween.progress) * 5)
      }
    },
    onComplete() {
      unownsGroup.destroy(true, true)
    }
  })
}

function addAbilitySprite(
  scene: GameScene | DebugScene,
  ability: Ability | string,
  ap: number,
  position: number[],
  options: AbilityAnimationOptions = {}
) {
  const frame = options.frame ?? `${ability}/000.png`
  const textureKey = options.textureKey ?? "abilities"

  if (
    !scene.textures.exists(textureKey) ||
    !scene.textures.get(textureKey).has(frame)
  ) {
    logger.warn(`Missing frame "${frame}" in texture "${textureKey}"`)
    return null
  }

  if (!scene.anims.exists(ability)) {
    logger.warn(`Missing animation: ${ability}`)
    return null
  }

  const sprite = scene.add.sprite(position[0], position[1], textureKey, frame)

  const {
    origin,
    scale,
    depth,
    tint,
    rotation,
    angle,
    alpha,
    flipX,
    flipY,
    destroyOnComplete = true,
    animOptions = {}
  } = options
  sprite.setOrigin(
    ...(Array.isArray(origin)
      ? origin
      : origin !== undefined
        ? [origin]
        : [0.5, 0.5])
  )
  const scaleX =
    (Array.isArray(scale) ? scale[0] : (scale ?? 2)) * (1 + ap / 200)
  const scaleY =
    (Array.isArray(scale) ? scale[1] : (scale ?? 2)) * (1 + ap / 200)
  sprite.setScale(scaleX, scaleY)
  sprite.setDepth(depth ?? DEPTH.ABILITY)
  if (tint) sprite.setTint(tint)
  if (rotation !== undefined) sprite.setRotation(rotation)
  if (angle !== undefined) sprite.setAngle(angle)
  if (alpha !== undefined) sprite.setAlpha(alpha)
  if (flipX) sprite.flipX = true
  if (flipY) sprite.flipY = true
  if (destroyOnComplete) {
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      sprite.destroy()
    })
  }

  sprite.play({ key: ability, ...animOptions })
  return sprite
}

const staticAnimation: AbilityAnimationMaker<{ x: number; y: number }> =
  (options) => (args) => {
    if (options?.oriented) {
      const coordinates = transformEntityCoordinates(
        args.positionX,
        args.positionY,
        args.flip
      )
      const coordinatesTarget = transformEntityCoordinates(
        args.targetX,
        args.targetY,
        args.flip
      )
      options.rotation =
        angleBetween(coordinates, coordinatesTarget) + (options.rotation ?? 0)
    }

    const delay = options.delay ?? args.delay ?? 0
    setTimeout(() => {
      addAbilitySprite(
        args.scene,
        options.ability ?? args.ability,
        args.ap,
        [
          options.x + (options?.positionOffset?.[0] ?? 0),
          options.y + (options?.positionOffset?.[1] ?? 0)
        ],
        options
      )
    }, delay)
  }

const onCaster: AbilityAnimationMaker = (options) => (args) => {
  const [x, y] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  return staticAnimation({ x, y, ...options })(args)
}

const onTarget: AbilityAnimationMaker = (options) => (args) => {
  const [x, y] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  return staticAnimation({ x, y, ...options })(args)
}

const onCasterScale1 = onCaster({ scale: 1 })
const onCasterScale2 = onCaster({ scale: 2 })
const onCasterScale3 = onCaster({ scale: 3 })
const onCasterScale4 = onCaster({ scale: 4 })
const onTargetScale1 = onTarget({ scale: 1 })
const onTargetScale2 = onTarget({ scale: 2 })
const onTargetScale3 = onTarget({ scale: 3 })
const onTargetScale4 = onTarget({ scale: 4 })

const onSprite =
  (
    handler: (
      args: AbilityAnimationArgs & {
        casterSprite?: PokemonSprite
        targetSprite?: PokemonSprite
      }
    ) => void
  ) =>
    (args) => {
      const casterSprite = args.pokemonsOnBoard.find(
        (pkmUI) =>
          pkmUI.positionX === args.positionX && pkmUI.positionY === args.positionY
      )
      const targetSprite = args.pokemonsOnBoard.find(
        (pkmUI) =>
          pkmUI.positionX === args.targetX && pkmUI.positionY === args.targetY
      )
      handler({ casterSprite, targetSprite, ...args })
    }

type TweenAnimationMakerOptions = {
  duration?: number
  ease?: string | ((v: number) => number)
  hitAnim?: AbilityAnimation
  tweenProps?: Record<string, any>
  startCoords?: [number, number, boolean?] | "target"
  endCoords?: [number, number, boolean?] | "caster"
  startPositionOffset?: [number, number]
  endPositionOffset?: [number, number]
  destroyOnTweenComplete?: boolean
}

const tweenAnimation: AbilityAnimationMaker<TweenAnimationMakerOptions> =
  (options = {}) =>
    (args) => {
      const { scene, flip } = args
      const [startRow, startCol, startFlip] =
        options.startCoords === "target"
          ? [args.targetX, args.targetY, args.flip]
          : (options.startCoords ?? [args.positionX, args.positionY, args.flip])
      const delay = options.delay ?? args.delay ?? 0
      setTimeout(() => {
        const startPosition = transformEntityCoordinates(
          startRow,
          startCol,
          startFlip ?? flip
        )
        startPosition[0] += options.startPositionOffset?.[0] ?? 0
        startPosition[1] += options.startPositionOffset?.[1] ?? 0

        if (options?.oriented) {
          const coordinates = transformEntityCoordinates(
            args.positionX,
            args.positionY,
            args.flip
          )
          const coordinatesTarget = transformEntityCoordinates(
            args.targetX,
            args.targetY,
            args.flip
          )
          options.rotation =
            angleBetween(coordinates, coordinatesTarget) + (options.rotation ?? 0)
        }

        const sprite = addAbilitySprite(
          scene,
          options.ability ?? args.ability,
          args.ap,
          startPosition,
          {
            destroyOnComplete: false,
            ...options
          }
        )
        if (!sprite) return null

        const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
          targets: sprite,
          duration: options.duration || 500,
          ease: options.ease || "linear",
          onComplete: () => {
            if (options.destroyOnTweenComplete !== false) sprite?.destroy()
            if (options.hitAnim) options.hitAnim(args)
          },
          ...(options.tweenProps ?? {})
        }

        scene.tweens.add(tweenConfig)
      }, delay)
    }

const projectile: AbilityAnimationMaker<TweenAnimationMakerOptions> =
  (options = {}) =>
    (args) => {
      const [endRow, endCol, endFlip] =
        options.endCoords === "caster"
          ? [args.positionX, args.positionY, args.flip]
          : (options.endCoords ?? [args.targetX, args.targetY, args.flip])
      const endPosition = transformEntityCoordinates(
        endRow,
        endCol,
        endFlip ?? args.flip
      )
      endPosition[0] += options.endPositionOffset?.[0] ?? 0
      endPosition[1] += options.endPositionOffset?.[1] ?? 0
      return tweenAnimation({
        startCoords: [args.positionX, args.positionY, args.flip],
        ...options,
        tweenProps: {
          x: endPosition[0],
          y: endPosition[1],
          ...(options.tweenProps ?? {})
        }
      })(args)
    }

const skyfall: AbilityAnimationMaker<TweenAnimationMakerOptions> =
  (options) => (args) => {
    return projectile({
      ...options,
      startCoords: [args.targetX, 9, false]
    })(args)
  }

const shakeCamera: AbilityAnimationMaker<{
  duration?: number
  intensity?: number
}> =
  (options) =>
    ({ scene }) =>
      scene.shakeCamera(options)

const poppingIcon: AbilityAnimationMaker<
  TweenAnimationMakerOptions & { maxScale: number }
> = (options) => (args) =>
  tweenAnimation({
    ...options,
    startCoords:
      options.startCoords === "target"
        ? [args.targetX, args.targetY]
        : [args.positionX, args.positionY],
    ease: Phaser.Math.Easing.Cubic.Out,
    scale: options.scale ?? 0.25,
    tweenProps: { scale: options?.maxScale ?? 3, ...(options.tweenProps ?? {}) }
  })(args)

const orientedProjectile: AbilityAnimationMaker<
  TweenAnimationMakerOptions & { orientation?: Orientation; distance?: number }
> = (options) => (args) => {
  const [dx, dy] = OrientationVector[options.orientation ?? args.orientation]
  let ox: number, oy: number
  if (options.endCoords !== undefined) {
    ;[ox, oy] =
      options.endCoords === "caster"
        ? [args.positionX, args.positionY]
        : options.endCoords
  } else {
    ;[ox, oy] =
      options.startCoords === "target"
        ? [args.targetX, args.targetY]
        : (options.startCoords ?? [args.positionX, args.positionY])
  }
  const finalCoordinates = transformEntityCoordinates(
    ox + dx * (options.distance ?? 8),
    oy + dy * (options.distance ?? 8),
    args.flip
  )
  if (options?.oriented) {
    options.rotation = angleBetween([dx, -dy], [0, 0]) + (options.rotation ?? 0)
    delete options.oriented
  }
  return tweenAnimation({
    ...options,
    tweenProps: {
      x: finalCoordinates[0],
      y: finalCoordinates[1],
      ...(options.tweenProps ?? {})
    }
  })(args)
}

export const AbilitiesAnimations: {
  [animKey: string]: AbilityAnimation | AbilityAnimation[]
} = {
  [Ability.DIAMOND_STORM]: onCasterScale2,
  [Ability.THRASH]: onCasterScale2,
  [Ability.HELPING_HAND]: onCasterScale2,
  [Ability.ENCORE]: onCaster({ ability: Ability.HELPING_HAND }),
  [Ability.FLORAL_HEALING]: onCasterScale2,
  [Ability.ILLUSION]: onCasterScale2,
  [Ability.ROAR_OF_TIME]: onCasterScale2,
  [Ability.HAPPY_HOUR]: onCasterScale2,
  [Ability.TELEPORT]: onCasterScale2,
  [Ability.PSYCHO_BOOST]: onCasterScale2,
  [Ability.SHIELDS_UP]: onCasterScale2,
  [Ability.AQUA_RING]: onCasterScale2,
  [Ability.INGRAIN]: onCasterScale2,
  [Ability.DEFENSE_CURL]: onCasterScale2,
  [Ability.RECOVER]: onCasterScale2,
  [Ability.METRONOME]: onCasterScale2,
  [Ability.LUNAR_BLESSING]: onCasterScale2,
  [Ability.MAGIC_POWDER]: onCasterScale2,
  [Ability.LANDS_WRATH]: onCasterScale2,
  [Ability.POWER_WHIP]: onCasterScale2,
  [Ability.STORED_POWER]: onCaster({
    ability: Ability.POWER_WHIP,
    tint: 0xff80ff
  }),
  [Ability.MEDITATE]: onCasterScale2,
  [Ability.MUD_BUBBLE]: onCasterScale2,
  [Ability.SOFT_BOILED]: onCasterScale2,
  [Ability.FAKE_TEARS]: onCasterScale2,
  [Ability.TEA_TIME]: onCasterScale2,
  [Ability.FUTURE_SIGHT]: onCaster({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.PETAL_DANCE]: onCasterScale2,
  [Ability.AROMATHERAPY]: onCasterScale2,
  [Ability.BOUNCE]: onCasterScale2,
  [Ability.BRICK_BREAK]: onCasterScale2,
  [Ability.BULK_UP]: onCasterScale2,
  [Ability.FLASH]: onCasterScale2,
  [Ability.METEOR_MASH]: onTarget({ ability: Ability.FLASH }),
  [Ability.STEEL_WING]: onCasterScale2,
  [Ability.HYPNOSIS]: orientedProjectile({
    oriented: true,
    textureKey: "attacks",
    ability: AttackSprite.PSYCHIC_RANGE,
    scale: 2,
    distance: 1
  }),
  ["FIELD_DEATH"]: onCasterScale2,
  ["FAIRY_CRIT"]: onCasterScale2,
  ["POWER_LENS"]: onCasterScale2,
  ["STAR_DUST"]: onCasterScale2,
  ["HEAL_ORDER"]: onCasterScale2,
  ["ATTACK_ORDER"]: onCasterScale2,
  ["FOSSIL_RESURRECT"]: onCasterScale2,
  ["LANDS_WRATH/hit"]: onCasterScale2,
  [Ability.BUG_BUZZ]: onTargetScale2,
  [Ability.VENOSHOCK]: onTarget({ scale: 2, origin: [0.5, 1] }),
  [Ability.LEECH_LIFE]: onTargetScale2,
  [Ability.THIEF]: onTargetScale2,
  [Ability.STUN_SPORE]: onTargetScale2,
  [Ability.CRABHAMMER]: onTargetScale2,
  [Ability.RAZOR_WIND]: onTargetScale2,
  [Ability.SEISMIC_TOSS]: onTargetScale2,
  [Ability.ASSURANCE]: onTargetScale2,
  [Ability.CRUSH_GRIP]: onTargetScale2,
  [Ability.METAL_BURST]: onTargetScale2,
  [Ability.SHADOW_SNEAK]: onTargetScale2,
  [Ability.IVY_CUDGEL]: onTargetScale2,
  [Ability.FACADE]: onTargetScale2,
  [Ability.SHIELDS_DOWN]: onTargetScale2,
  [Ability.BRAVE_BIRD]: onTargetScale2,
  [Ability.DYNAMIC_PUNCH]: onTargetScale2,
  [Ability.ELECTRO_WEB]: onTargetScale2,
  [Ability.PSYSHIELD_BASH]: onTargetScale2,
  [Ability.LIQUIDATION]: onTargetScale2,
  [Ability.AIR_SLASH]: onTargetScale2,
  [Ability.DREAM_EATER]: onTargetScale2,
  [Ability.BURN_UP]: onTargetScale3,
  [Ability.ICE_HAMMER]: onTargetScale2,
  [Ability.MANTIS_BLADES]: onTargetScale2,
  [Ability.PSYCHIC_FANGS]: onTargetScale2,
  [Ability.THUNDER_FANG]: onTargetScale2,
  [Ability.ICE_FANG]: onTargetScale2,
  [Ability.FIRE_FANG]: onTargetScale2,
  [Ability.POPULATION_BOMB]: onTargetScale2,
  [Ability.SCREECH]: onTargetScale2,
  [Ability.SAND_TOMB]: onTargetScale2,
  [Ability.PLAY_ROUGH]: onTargetScale2,
  [Ability.ANCHOR_SHOT]: onTargetScale1,
  [Ability.LEAF_BLADE]: onTargetScale2,
  [Ability.SLASHING_CLAW]: onTargetScale2,
  [Ability.DIRE_CLAW]: onTarget({ ability: Ability.SLASHING_CLAW, scale: 3 }),
  [Ability.HEX]: onTargetScale2,
  [Ability.PLASMA_FIST]: onTargetScale2,
  [Ability.LEECH_SEED]: onTargetScale2,
  [Ability.LOCK_ON]: onTargetScale2,
  [Ability.PSYCH_UP]: onTargetScale2,
  [Ability.ROCK_SMASH]: onTargetScale2,
  [Ability.BLAZE_KICK]: onTarget({ positionOffset: [0, -35] }),
  [Ability.BITE]: onTargetScale2,
  [Ability.DRAGON_TAIL]: onTargetScale2,
  [Ability.SOAK]: onTargetScale2,
  [Ability.IRON_TAIL]: onTargetScale2,
  [Ability.ICICLE_CRASH]: onTargetScale2,
  [Ability.DRAIN_PUNCH]: onTargetScale2,
  [Ability.LICK]: onTargetScale2,
  [Ability.SPIRIT_BREAK]: onTargetScale2,
  [Ability.PSYSHOCK]: onTargetScale2,
  [Ability.SHEER_COLD]: onTargetScale2,
  [Ability.COTTON_SPORE]: onTargetScale2,
  [Ability.RETALIATE]: onTargetScale2,
  [Ability.THUNDER_CAGE]: onTargetScale2,
  ["FIGHTING_KNOCKBACK"]: onTargetScale2,
  [Ability.FIRE_BLAST]: onTargetScale3,
  [Ability.CLOSE_COMBAT]: onTargetScale3,
  [Ability.SUPER_FANG]: onTargetScale3,
  [Ability.VINE_WHIP]: onTargetScale3,
  [Ability.STOMP]: onTargetScale3,
  [Ability.GUILLOTINE]: onTargetScale3,
  [Ability.CROSS_POISON]: onTargetScale3,
  [Ability.FIERY_DANCE]: onTarget({ ability: Ability.FIRE_BLAST, scale: 2 }),
  [Ability.FIRE_SPIN]: onTarget({ ability: Ability.MAGMA_STORM, scale: 2 }),
  [Ability.DRACO_ENERGY]: onTarget({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.DYNAMAX_CANNON]: onCaster({
    origin: [0.5, 0],
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.MOONGEIST_BEAM]: onCaster({
    origin: [0.5, 0],
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.FREEZING_GLARE]: onCaster({
    origin: [0.5, 0.98],
    positionOffset: [0, -50],
    oriented: true,
    rotation: +Math.PI / 2
  }),
  [Ability.MYSTICAL_FIRE]: onTarget({ positionOffset: [0, -50] }),
  [Ability.FLAME_CHARGE]: onCaster({
    oriented: true,
    rotation: +Math.PI / 2,
    origin: [0.5, 1],
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.PASTEL_VEIL]: onCaster({
    oriented: true,
    rotation: +Math.PI,
    origin: [1, 1],
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.AQUA_JET]: onCaster({ oriented: true, rotation: -Math.PI / 2 }),
  [Ability.EXTREME_SPEED]: [onCaster({}), onTarget({})],
  ["POWER_WHIP/hit"]: onCasterScale3,
  [Ability.SALT_CURE]: onCaster({
    ability: Ability.MAGIC_POWDER,
    tint: 0xb0ff80,
    scale: 2
  }),
  [Ability.SPICY_EXTRACT]: onCaster({
    ability: Ability.MAGIC_POWDER,
    tint: 0xff9000,
    scale: 3
  }),
  [Ability.SWEET_SCENT]: onCaster({
    ability: Ability.MAGIC_POWDER,
    tint: 0xffc0c0,
    scale: 3
  }),
  [Ability.DARK_VOID]: onTargetScale4,
  [Ability.SEED_FLARE]: onCasterScale3,
  [Ability.MULTI_ATTACK]: onCasterScale4,
  [Ability.ROCK_SLIDE]: onTarget({ scale: 2, origin: [0.5, 0.9] }),
  [Ability.FLAMETHROWER]: onCaster({
    oriented: true,
    rotation: +Math.PI / 2,
    origin: [0.5, 1]
  }),
  [Ability.FIERY_WRATH]: onCaster({
    ability: Ability.FLAMETHROWER,
    oriented: true,
    rotation: +Math.PI / 2,
    origin: [0.5, 1],
    scale: 2,
    tint: 0xc000c0
  }),
  [Ability.BLOOD_MOON]: [
    onCaster({ ability: "COSMIC_POWER", tint: 0xff5060, origin: [0.5, 1] }),
    (args) => {
      const coordinates = transformEntityCoordinates(
        args.positionX,
        args.positionY,
        args.flip
      )
      const [dx, dy] = OrientationVector[args.orientation]
      return staticAnimation({
        ability: Ability.DYNAMAX_CANNON,
        x: coordinates[0] + dx * 16,
        y: coordinates[1] - dy * 16 - 24,
        tint: 0xff5060,
        origin: [0.5, 0],
        oriented: true,
        rotation: -Math.PI / 2
      })(args)
    }
  ],
  [Ability.PSYBEAM]: onCaster({
    oriented: true,
    rotation: -Math.PI / 2,
    origin: [0.5, 0],
    scale: [1, 2]
  }),
  [Ability.TWIN_BEAM]: onCaster({
    ability: Ability.PSYBEAM,
    oriented: true,
    rotation: -Math.PI / 2,
    origin: [0.5, 0],
    scale: [1, 2]
  }),
  [Ability.THUNDER_SHOCK]: onTarget({
    ability: Ability.THUNDER,
    scale: 2,
    origin: [0.5, 1]
  }),
  [Ability.HYDRO_PUMP]: onCaster({
    oriented: true,
    rotation: Math.PI / 2,
    origin: [0.5, 1]
  }),
  [Ability.SWALLOW]: onCaster({
    ability: Ability.HYDRO_PUMP,
    oriented: true,
    rotation: +Math.PI / 2,
    origin: [0.5, 1],
    tint: 0x60ff60
  }),
  [Ability.DRACO_METEOR]: onTarget({ origin: [0.5, 0.9] }),
  [Ability.WISH]: onCasterScale3,
  [Ability.GRAVITY]: onCaster({
    ability: Ability.MEDITATE,
    scale: 3,
    tint: 0xccff33,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.COSMIC_POWER_MOON]: onCaster({
    ability: "COSMIC_POWER",
    tint: 0xccb0ff,
    origin: [0.5, 1]
  }),
  [Ability.COSMIC_POWER_SUN]: onCaster({
    ability: "COSMIC_POWER",
    tint: 0xffffd0,
    origin: [0.5, 1]
  }),
  [Ability.FORECAST]: onCaster({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.CHATTER]: onCasterScale2,
  [Ability.BOOMBURST]: onCaster({ ability: Ability.CHATTER, scale: 3 }),
  [Ability.BLAST_BURN]: onCasterScale3,
  [Ability.CHARGE]: onCaster({
    scale: 4,
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    origin: [0.5, 0.8]
  }),
  [Ability.DISCHARGE]: onCasterScale3,
  [Ability.OVERDRIVE]: onCasterScale2,
  [Ability.SMOG]: onCaster({ scale: 4, depth: DEPTH.ABILITY_MINOR }),
  [Ability.POISON_GAS]: onCaster({
    ability: Ability.SMOG,
    scale: 3,
    tint: 0xa0f0f0,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.SLUDGE]: onTarget({
    ability: Ability.SMOG,
    scale: 3,
    tint: 0xa0c020
  }),
  [Ability.CRUNCH]: onTarget({ ability: Ability.BITE, scale: 3 }),
  [Ability.FROST_BREATH]: onCaster({
    oriented: true,
    positionOffset: [0, -30],
    origin: [-0.1, 0.5],
    scale: 4
  }),
  [Ability.TORMENT]: onCaster({ positionOffset: [0, -50] }),
  [Ability.RAGE]: onCaster({
    ability: Ability.TORMENT,
    positionOffset: [0, -50],
    tint: 0xff0000
  }),
  [Ability.NIGHT_SLASH]: onTargetScale2,
  [Ability.KOWTOW_CLEAVE]: onTarget({ ability: Ability.NIGHT_SLASH, scale: 3 }),
  [Ability.FELL_STINGER]: onTarget({
    ability: Ability.VENOSHOCK,
    tint: 0xc0ffc0,
    origin: [0.5, 1]
  }),
  [Ability.NASTY_PLOT]: onCaster({ positionOffset: [0, -50] }),
  [Ability.ROCK_TOMB]: onTarget({ origin: [0.5, 0.9], scale: 1 }),
  [Ability.SLACK_OFF]: onCaster({ ability: Ability.ILLUSION, scale: 1 }),
  [Ability.FISHIOUS_REND]: onCaster({ oriented: true, rotation: -Math.PI / 2 }),
  [Ability.HORN_ATTACK]: onTarget({ ability: Ability.CUT, scale: 3 }),
  [Ability.HORN_DRILL]: onTarget({ ability: Ability.CUT, scale: 4 }),
  [Ability.CUT]: [
    onTargetScale3,
    onCaster({
      ability: Ability.FISHIOUS_REND,
      oriented: true,
      rotation: -Math.PI / 2
    })
  ],
  [Ability.PAYDAY]: [
    onTargetScale2,
    onTarget({ ability: Ability.FACADE, scale: 1 })
  ],
  [Ability.VOLT_SWITCH]: onTarget({
    origin: [0.5, 0],
    oriented: true,
    rotation: -Math.PI / 2,
    scale: 2
  }),
  [Ability.BEHEMOTH_BLADE]: onCaster({
    ability: Ability.VOLT_SWITCH,
    origin: [0.5, 0],
    oriented: true,
    rotation: -Math.PI / 2,
    tint: 0xffc0ff
  }),
  [Ability.MUDDY_WATER]: onTarget({ origin: [0.5, 1] }),
  [Ability.FAIRY_LOCK]: onTargetScale1,
  [Ability.STEAM_ERUPTION]: onTargetScale3,
  [Ability.SEARING_SHOT]: onCaster({
    ability: Ability.STEAM_ERUPTION,
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    scale: 3
  }),
  [Ability.POWER_HUG]: onTarget({ ability: Ability.ANCHOR_SHOT }),
  [Ability.HEAVY_SLAM]: [onCasterScale2, shakeCamera({})],
  [Ability.MORTAL_SPIN]: onCaster({
    ability: Ability.HEAVY_SLAM,
    scale: 1.5,
    tint: 0xa0ff90
  }),
  [Ability.BODY_SLAM]: shakeCamera({}),
  [Ability.BULLDOZE]: [
    onCaster({ ability: Ability.HEAVY_SLAM, scale: 1.5 }),
    shakeCamera({})
  ],
  [Ability.FAKE_OUT]: onCaster({ ability: Ability.FACADE }),
  [Ability.FILLET_AWAY]: onCaster({ ability: Ability.SHIELDS_UP }),
  [Ability.BITTER_BLADE]: onCasterScale3,
  [Ability.MIND_BEND]: onTarget({
    ability: Ability.ASSURANCE,
    positionOffset: [0, -20]
  }),
  [Ability.ATTRACT]: onCaster({ positionOffset: [0, -70] }),
  [Ability.MAGNET_RISE]: onCaster({ ability: Ability.ELECTRO_BOOST }),
  [Ability.FORCE_PALM]: onTarget({ ability: Ability.ANCHOR_SHOT }),
  [Ability.WATERFALL]: onCaster({
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    positionOffset: [0, -50]
  }),
  [Ability.MAGMA_STORM]: onTargetScale1,
  [Ability.ABSORB]: onCaster({ depth: DEPTH.ABILITY_GROUND_LEVEL }),
  [Ability.GIGATON_HAMMER]: [
    onTarget({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
    shakeCamera({})
  ],
  [Ability.COUNTER]: onCasterScale2,
  [Ability.SPECTRAL_THIEF]: [onTargetScale2, onCasterScale2],
  [Ability.SACRED_SWORD_IRON]: onTarget({
    ability: "SACRED_SWORD",
    origin: [0.5, 0.2],
    rotation: Math.PI
  }),
  [Ability.SACRED_SWORD_GRASS]: onTarget({
    ability: "SACRED_SWORD",
    origin: [0.5, 0.2],
    rotation: Math.PI,
    tint: 0xb0ffa0
  }),
  [Ability.SACRED_SWORD_CAVERN]: onTarget({
    ability: "SACRED_SWORD",
    origin: [0.5, 0.2],
    rotation: Math.PI,
    tint: 0xe0c0a0
  }),
  [Ability.SECRET_SWORD]: projectile({
    ability: "SACRED_SWORD",
    startCoords: "target",
    startPositionOffset: [0, -30],
    tint: 0xfff0b0,
    tweenProps: {
      angle: 540,
      duration: 400
    }
  }),
  [Ability.JUDGEMENT]: onTarget({ origin: [0.5, 1] }),
  [Ability.DIVE]: onCaster({ scale: 3, depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.SMOKE_SCREEN]: onTargetScale3,
  [Ability.BARB_BARRAGE]: onTargetScale2,
  [Ability.OUTRAGE]: onTargetScale2,
  [Ability.KNOCK_OFF]: onTargetScale2,
  [Ability.SLASH]: onTargetScale2,
  [Ability.SHADOW_CLONE]: onCasterScale2,
  [Ability.ECHO]: onCaster({ origin: [0.5, 0.7] }),
  [Ability.EXPLOSION]: [
    onCasterScale2,
    shakeCamera({ duration: 400, intensity: 0.01 })
  ],
  [Ability.CHLOROBLAST]: [
    onCaster({ ability: Ability.EXPLOSION, tint: 0x90ffd0 }),
    shakeCamera({ duration: 300, intensity: 0.015 })
  ],
  [Ability.CLANGOROUS_SOUL]: onCasterScale2,
  [Ability.GROWL]: onCaster({ oriented: true, rotation: -Math.PI / 2 }),
  [Ability.FAIRY_WIND]: onCasterScale2,
  [Ability.TAKE_HEART]: onCaster({
    ability: Ability.FAIRY_WIND,
    tint: 0xc0c0ff
  }),
  [Ability.GRASSY_SURGE]: onCaster({
    ability: Ability.FAIRY_WIND,
    tint: 0x80ff80
  }),
  [Ability.ELECTRIC_SURGE]: onCaster({
    ability: Ability.FAIRY_WIND,
    tint: 0xffff80
  }),
  [Ability.PSYCHIC_SURGE]: onCaster({
    ability: Ability.FAIRY_WIND,
    tint: 0xc050ff
  }),
  [Ability.MISTY_SURGE]: onCaster({
    ability: Ability.FAIRY_WIND,
    tint: 0xffa0ff
  }),
  [Ability.RELIC_SONG]: onCasterScale2,
  [Ability.SING]: poppingIcon({ ability: Ability.RELIC_SONG, maxScale: 2 }),
  [Ability.DISARMING_VOICE]: onCaster({ ability: Ability.RELIC_SONG }),
  [Ability.LOVELY_KISS]: poppingIcon({
    textureKey: "attacks",
    ability: AttackSprite.FAIRY_MELEE,
    maxScale: 2,
    startPositionOffset: [0, -50]
  }),
  [Ability.CHARM]: poppingIcon({
    textureKey: "attacks",
    ability: AttackSprite.FAIRY_MELEE,
    maxScale: 3,
    startPositionOffset: [0, -50]
  }),
  [Ability.HIGH_JUMP_KICK]: onTargetScale2,
  [Ability.LUNGE]: onTarget({ ability: Ability.HIGH_JUMP_KICK }),
  [Ability.TROP_KICK]: onTargetScale2,
  [Ability.SHELL_TRAP]: onCaster({ ability: Ability.COUNTER }),
  [Ability.SHELL_SMASH]: onCaster({ ability: Ability.COUNTER }),
  [Ability.SONG_OF_DESIRE]: onTarget({ positionOffset: [0, -60] }),
  [Ability.CONFUSING_MIND]: [onTargetScale2, onCasterScale2],
  [Ability.DOUBLE_SHOCK]: [onTargetScale1, onCasterScale1],
  [Ability.MIND_BLOWN]: [
    onCaster({ origin: [0.5, 0.8] }),
    onTarget({ ability: "MIND_BLOWN/hit", scale: 3 })
  ],
  [Ability.FIRE_LASH]: onCaster({
    ability: Ability.FISHIOUS_REND,
    tint: 0xff6000,
    oriented: true,
    rotation: -Math.PI / 2,
    scale: 3
  }),
  [Ability.WONDER_GUARD]: onCaster({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.X_SCISSOR]: onTargetScale2,
  [Ability.DEATH_WING]: onTargetScale2,
  [Ability.GEOMANCY]: onCaster({
    positionOffset: [0, -50],
    depth: DEPTH.ABILITY_GROUND_LEVEL
  }),
  [Ability.BLIZZARD]: onCaster({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.OVERHEAT]: onCaster({
    ability: Ability.FIRE_BLAST,
    scale: 3,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  ["LINK_CABLE_link"]: (args) => {
    const distance = distanceE(
      args.positionX,
      args.positionY,
      args.targetX,
      args.targetY
    )
    return onCaster({
      ability: Ability.LINK_CABLE,
      origin: [0.5, 0],
      oriented: true,
      rotation: -Math.PI / 2,
      scale: [2, distance * 0.36]
    })(args)
  },
  ["LINK_CABLE_discharge"]: onCaster({ ability: Ability.DISCHARGE }),
  ["GRASS_HEAL"]: onCaster({ depth: DEPTH.BOOST_BACK }),
  ["FLAME_HIT"]: onCaster({ depth: DEPTH.HIT_FX_BELOW_POKEMON }),
  [Ability.TEETER_DANCE]: (args) => {
    args.pokemonsOnBoard.forEach((pkmUI) => {
      const coordinates = transformEntityCoordinates(
        pkmUI.positionX,
        pkmUI.positionY,
        args.flip
      )
      addAbilitySprite(args.scene, Ability.TEETER_DANCE, args.ap, coordinates, {
        depth: DEPTH.ABILITY_BELOW_POKEMON
      })
    })
  },
  [Ability.STRUGGLE_BUG]: onCaster({ ability: Ability.PSYCHIC }),
  [Ability.SPIN_OUT]: orientedProjectile({
    distance: 1,
    duration: 400,
    rotation: -Math.PI / 2,
    scale: 4,
    destroyOnComplete: true
  }),
  [Ability.SPACIAL_REND]: (args) =>
    addAbilitySprite(
      args.scene,
      args.ability,
      args.ap,
      transformEntityCoordinates(4, args.targetY, args.flip),
      { scale: 4 }
    ),
  [Ability.PETAL_BLIZZARD]: onCasterScale3,
  [Ability.NIGHTMARE]: onCaster({ origin: [0.5, 1] }),
  [Ability.AQUA_TAIL]: orientedProjectile({
    ability: Ability.SPIN_OUT,
    tint: 0x80ddff,
    distance: 1,
    duration: 400,
    rotation: -Math.PI / 2,
    scale: 3,
    destroyOnComplete: true
  }),
  [Ability.RAPID_SPIN]: onTarget({ scale: 1.5 }),
  [Ability.COTTON_GUARD]: onCaster({ ability: Ability.COTTON_SPORE, scale: 3 }),
  ["FLOWER_TRICK_EXPLOSION"]: onCaster({ ability: "PUFF_PINK", scale: 3 }),
  [Ability.FLOWER_TRICK]: onSprite(({ targetSprite }) =>
    targetSprite?.addFlowerTrick()
  ),
  [Ability.ENTRAINMENT]: onSprite(({ targetSprite }) =>
    targetSprite?.emoteAnimation()
  ),
  [Ability.SCHOOLING]: onCaster({
    scale: 4,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.STONE_AXE]: onTargetScale2,
  [Ability.CRUSH_CLAW]: onTargetScale2,
  [Ability.METAL_CLAW]: onTarget({ ability: Ability.CRUSH_CLAW, scale: 2 }),
  [Ability.DRAGON_CLAW]: onTargetScale1,
  [Ability.EARTHQUAKE]: [onCasterScale3, shakeCamera({ duration: 350 })],
  [Ability.OCTAZOOKA]: projectile({
    ability: Ability.ARMOR_CANNON,
    scale: 1,
    tint: 0x303030,
    hitAnim: onTarget({
      ability: Ability.SMOKE_SCREEN,
      tint: 0x303030,
      scale: 3
    })
  }),
  [Ability.WOOD_HAMMER]: onTarget({ scale: 1, origin: [0.5, 1] }),
  [Ability.TRICK_OR_TREAT]: onTarget({ origin: [0.5, 1] }),
  [Ability.HEADBUTT]: onTarget({ ability: "FIGHTING_KNOCKBACK" }),
  [Ability.HEAD_SMASH]: onTarget({
    ability: "FIGHTING_KNOCKBACK",
    tint: 0xffffa0
  }),
  [Ability.IRON_HEAD]: onTarget({
    ability: "FIGHTING_KNOCKBACK",
    tint: 0x8090a0
  }),
  [Ability.DOUBLE_EDGE]: onTarget({
    ability: "FIGHTING_KNOCKBACK",
    scale: 2,
    tint: 0x606060
  }),
  ["GROUND_GROW"]: onCaster({ scale: 1.5 }),
  ["FISHING"]: onCaster({
    ability: Ability.DIVE,
    scale: 1,
    origin: [0.5, -1],
    depth: DEPTH.ABILITY_GROUND_LEVEL
  }),
  ["SPAWN"]: onCaster({ origin: [0.5, -0.5], depth: DEPTH.BOOST_BACK }),
  ["EVOLUTION"]: onCaster({ origin: [0.5, 0.4], depth: DEPTH.BOOST_BACK }),
  ["HATCH"]: onCaster({
    ability: "SOFT_BOILED",
    origin: [0.5, 0.4],
    depth: DEPTH.BOOST_BACK
  }),
  ["FLYING_TAKEOFF"]: onCaster({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  ["DIG"]: [
    onCaster({
      ability: "DIG",
      origin: [0, 1],
      scale: [1, 2],
      depth: DEPTH.ABILITY_BELOW_POKEMON
    }),
    onCaster({
      ability: "DIG",
      origin: [1, 1],
      flipX: true,
      delay: 250,
      scale: [1, 2],
      depth: DEPTH.ABILITY_BELOW_POKEMON
    })
  ],
  [Ability.PURIFY]: [
    onTarget({ ability: Ability.SMOG, scale: 1 }),
    onCaster({ ability: Ability.MUD_BUBBLE, scale: 1 })
  ],
  [Ability.FOUL_PLAY]: onTarget({ ability: Ability.NIGHT_SLASH }),
  [Ability.WONDER_ROOM]: onTargetScale4,
  [Ability.DOUBLE_IRON_BASH]: onTarget({ ability: Ability.DRAIN_PUNCH }),
  [Ability.STONE_EDGE]: onCaster({ ability: Ability.TORMENT }),
  [Ability.MAGNET_PULL]: onCaster({
    ability: Ability.THUNDER_CAGE,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.BIDE]: onCaster({ ability: Ability.COUNTER, scale: 3 }),
  [Ability.SHORE_UP]: onCaster({ ability: Ability.EARTHQUAKE }),
  [Ability.DRUM_BEATING]: onCaster({ positionOffset: [-20, -40], angle: -45 }),
  [Ability.TAUNT]: onCaster({ positionOffset: [0, -30] }),
  ["TAUNT_HIT"]: onTarget({ positionOffset: [0, -30] }),
  ["SMOKE_BALL"]: onCasterScale3,
  [Ability.TAILWIND]: onCaster({
    oriented: true,
    rotation: -Math.PI / 2,
    scale: 4,
    alpha: 0.5
  }),
  [Ability.SILVER_WIND]: projectile({ ability: Ability.EXTREME_SPEED }),
  [Ability.INFERNAL_PARADE]: projectile({
    ease: "Power2",
    tweenProps: { yoyo: true }
  }),
  [Ability.BLUE_FLARE]: projectile({ scale: 3 }),
  [Ability.GLACIATE]: projectile({ scale: 3, duration: 1000 }),
  [Ability.WHEEL_OF_FIRE]: projectile({
    ease: "Power2",
    tweenProps: { yoyo: true }
  }),
  [Ability.SHADOW_BALL]: projectile({ duration: 1000 }),
  [Ability.FUSION_BOLT]: projectile({ duration: 750, scale: 3 }),
  [Ability.SOLAR_BEAM]: projectile({
    startCoords: "target",
    startPositionOffset: [0, -300],
    alpha: 0.5,
    tweenProps: { alpha: 1 }
  }),
  [Ability.ORIGIN_PULSE]: (args) =>
    projectile({
      startCoords: [0, args.targetY],
      endCoords: [8, args.targetY],
      scale: 4,
      duration: 1000
    })(args),
  ["SCALE_SHOT_CHARGE"]: (args) =>
    projectile({
      duration: args.delay,
      animOptions: { repeat: -1, duration: 300 }
    })(args),
  [Ability.SCALE_SHOT]: projectile({ duration: 400 }),
  ["SOLAR_BLADE_CHARGE"]: projectile({
    ability: Ability.RECOVER,
    animOptions: { repeat: -1, duration: 500 },
    duration: 2000,
    scale: 3
  }),
  [Ability.GOLD_RUSH]: projectile({ duration: 1000 }),
  [Ability.MAKE_IT_RAIN]: projectile({
    ability: Ability.GOLD_RUSH,
    duration: 1000,
    scale: 3
  }),
  [Ability.MUD_SHOT]: projectile({ scale: 4, duration: 350 }),
  [Ability.POLTERGEIST]: projectile({
    scale: 3,
    duration: 750,
    animOptions: { repeat: -1 },
    startPositionOffset: [0, -50]
  }),
  [Ability.ZAP_CANNON]: projectile({ scale: 3, duration: 500 }),
  [Ability.ELECTRO_BALL]: (args) =>
    projectile({
      ability: Ability.ZAP_CANNON,
      duration: args.delay ?? 300,
      hitAnim: onTarget({ ability: Ability.DISCHARGE, scale: 1 })
    })(args),
  [Ability.SPARKLING_ARIA]: projectile({ scale: 3, duration: 1000 }),
  ["FLYING_SKYDIVE"]: skyfall({}),
  [Ability.SKY_ATTACK]: skyfall({ scale: 1.5, duration: 500 }),
  [Ability.SKY_ATTACK_SHADOW]: skyfall({ scale: 1.5, duration: 500 }),
  [Ability.FLYING_PRESS]: skyfall({
    hitAnim: onTarget({ ability: Ability.HEAVY_SLAM })
  }),
  [Ability.SUNSTEEL_STRIKE]: skyfall({ hitAnim: shakeCamera({}), scale: 1 }),
  ["COMET_CRASH"]: skyfall({
    ability: Ability.SUNSTEEL_STRIKE,
    scale: 0.5,
    duration: 500,
    tint: 0x2020ff
  }),
  [Ability.ACROBATICS]: (args) =>
    projectile({
      startCoords: [args.targetX + 1, args.targetY + 1],
      duration: 300
    })(args),
  [Ability.ROLLOUT]: projectile({ duration: 1000 }),
  [Ability.ICE_BALL]: projectile({ duration: (8 * 1000) / 15 }),
  [Ability.PRESENT]: projectile({ duration: 1000 }),
  [Ability.TOPSY_TURVY]: projectile({}),
  [Ability.WHIRLWIND]: projectile({ duration: 1000 }),
  [Ability.ACID_SPRAY]: projectile({ duration: 1000 }),
  [Ability.WATER_PULSE]: projectile({ duration: 1000, scale: 3 }),
  [Ability.GRAV_APPLE]: skyfall({
    ability: Ability.NUTRIENTS,
    scale: 3,
    duration: 400,
    hitAnim: onTarget({ ability: "PUFF_RED" })
  }),
  [Ability.NUTRIENTS]: projectile({
    scale: 2,
    duration: 400,
    hitAnim: onTarget({ ability: "PUFF_GREEN" })
  }),
  [Ability.SYRUP_BOMB]: projectile({
    ability: Ability.NUTRIENTS,
    scale: 2,
    duration: 400,
    hitAnim: onTarget({ ability: "PUFF_RED" })
  }),
  [Ability.APPLE_ACID]: projectile({
    ability: Ability.NUTRIENTS,
    scale: 2,
    duration: 400,
    hitAnim: onTarget({ ability: "PUFF_RED" })
  }),
  [Ability.FICKLE_BEAM]: projectile({ duration: 400 }),
  [Ability.POLLEN_PUFF]: projectile({
    ability: Ability.HEAL_ORDER,
    duration: 1000
  }),
  [Ability.PSYSTRIKE]: projectile({ duration: 1000 }),
  [Ability.EGG_BOMB]: projectile({ duration: 800, scale: 3 }),
  [Ability.SPARK]: (args) =>
    projectile({
      duration: 300,
      tweenProps: { delay: (args.delay || 0) * 400 }
    })(args),
  [Ability.SUCTION_HEAL]: projectile({
    scale: 3,
    startCoords: "target",
    endCoords: "caster"
  }),
  [Ability.HORN_LEECH]: [
    projectile({
      ability: Ability.SUCTION_HEAL,
      tint: 0x80ff90,
      scale: 3,
      startCoords: "target",
      endCoords: "caster"
    }),
    onTarget({ ability: "FIGHTING_KNOCKBACK", scale: 2, tint: 0x80ff90 })
  ],
  [Ability.ANCIENT_POWER]: projectile({ duration: 1000 }),
  [Ability.MOON_DREAM]: projectile({
    startPositionOffset: [0, -100],
    endCoords: "caster",
    scale: 1.5,
    duration: 500,
    tweenProps: { scale: 0.5 }
  }),
  [Ability.MAGICAL_LEAF]: [
    projectile({}),
    onCaster({ ability: "MAGICAL_LEAF_CHARGE" })
  ],
  [Ability.NATURAL_GIFT]: projectile({ duration: 1000 }),
  [Ability.NIGHT_SHADE]: projectile({ duration: 1000 }),
  [Ability.PARABOLIC_CHARGE]: projectile({ duration: 750 }),
  [Ability.ARMOR_CANNON]: (args) =>
    projectile({ duration: 400, scale: 2 - (args.delay ?? 0) * 0.5 })(args),
  [Ability.FISSURE]: [
    projectile({
      scale: 1,
      tweenProps: { scale: 3, yoyo: true },
      duration: 800,
      ease: Phaser.Math.Easing.Sine.InOut
    }),
    shakeCamera({})
  ],
  [Ability.ERUPTION]: projectile({
    startCoords: "target",
    startPositionOffset: [72, 72]
  }),

  [Ability.THOUSAND_ARROWS]: (args) =>
    projectile({
      startCoords: [args.targetX, BOARD_HEIGHT - 1, false],
      scale: 4,
      duration: 300
    })(args),
  [Ability.TRI_ATTACK]: projectile({}),
  [Ability.AURA_WHEEL]: projectile({ scale: 1 }),
  [Ability.PSYCHIC]: projectile({ duration: 1000, scale: 3 }),
  [Ability.PYRO_BALL]: projectile({
    scale: 1,
    tweenProps: { scale: 2 },
    duration: 500
  }),
  [Ability.SLUDGE_WAVE]: projectile({
    scale: 1,
    duration: 800,
    tweenProps: { scale: 2 },
    hitAnim: onTarget({
      ability: Ability.DIVE,
      scale: 3,
      tint: 0xf060a0,
      depth: DEPTH.ABILITY_GROUND_LEVEL
    })
  }),
  [Ability.LAVA_PLUME]: projectile({
    ability: Ability.SLUDGE_WAVE,
    scale: 1,
    duration: 800,
    tint: 0xffc020,
    tweenProps: { scale: 2 },
    hitAnim: onTarget({ ability: "FLAME_HIT", scale: 2 })
  }),
  [Ability.PRISMATIC_LASER]: (args) =>
    projectile({
      startCoords: [args.targetX, args.flip ? BOARD_HEIGHT : 0, args.flip],
      endCoords: [args.targetX, args.flip ? 0 : BOARD_HEIGHT, args.flip],
      scale: 5
    })(args),
  ["GULP_MISSILE/pikachu"]: (args) =>
    projectile({
      duration:
        distanceM(args.positionX, args.positionY, args.targetX, args.targetY) *
        150,
      oriented: true,
      rotation: -Math.PI / 2
    })(args),
  ["GULP_MISSILE/arrokuda"]: (args) =>
    projectile({
      duration:
        distanceM(args.positionX, args.positionY, args.targetX, args.targetY) *
        150,
      oriented: true,
      rotation: -Math.PI / 2
    })(args),
  [Ability.DRAGON_DARTS]: projectile({
    scale: 1,
    oriented: true,
    positionOffset: [0, -30],
    duration: 400,
    rotation: -Math.PI / 2,
    hitAnim: onTarget({ ability: "PUFF_PINK", scale: 1 })
  }),
  [Ability.ASTRAL_BARRAGE]: projectile({
    scale: 1,
    oriented: true,
    rotation: -Math.PI
  }),
  [Ability.MACH_PUNCH]: poppingIcon({
    ability: "FIGHTING/FIST",
    maxScale: 2,
    startCoords: "target"
  }),
  [Ability.MEGA_PUNCH]: poppingIcon({
    ability: "FIGHTING/FIST",
    maxScale: 3,
    startCoords: "target"
  }),
  [Ability.MAWASHI_GERI]: poppingIcon({
    ability: "FIGHTING/FOOT",
    maxScale: 2,
    startCoords: "target"
  }),
  [Ability.THUNDEROUS_KICK]: poppingIcon({
    ability: "FIGHTING/FOOT",
    maxScale: 3,
    startPositionOffset: [0, -20],
    startCoords: "target"
  }),
  [Ability.TRIPLE_KICK]: [
    poppingIcon({
      ability: "FIGHTING/PAW",
      scale: 1.5,
      maxScale: 2,
      duration: 250,
      startPositionOffset: [50, 0],
      startCoords: "target"
    }),
    poppingIcon({
      ability: "FIGHTING/PAW",
      scale: 1.5,
      maxScale: 2,
      duration: 250,
      delay: 200,
      startPositionOffset: [-25, 43],
      startCoords: "target"
    }),
    poppingIcon({
      ability: "FIGHTING/PAW",
      scale: 1.5,
      maxScale: 2,
      duration: 250,
      delay: 400,
      startPositionOffset: [-25, -43],
      startCoords: "target"
    })
  ],
  [Ability.STRING_SHOT]: projectile({
    duration: 1000,
    ease: Phaser.Math.Easing.Cubic.Out,
    alpha: 0.5,
    scale: 0.25,
    tweenProps: { scale: 2, alpha: 0.9 }
  }),
  [Ability.STICKY_WEB]: projectile({
    duration: 1000,
    ease: Phaser.Math.Easing.Cubic.Out,
    alpha: 0.5,
    scale: 0.25,
    tint: 0xccffcc,
    tweenProps: { scale: 2, alpha: 1 }
  }),
  [Ability.ENTANGLING_THREAD]: projectile({
    ability: Ability.STICKY_WEB,
    duration: 1200,
    ease: Phaser.Math.Easing.Cubic.Out,
    alpha: 0.5,
    scale: 0.25,
    tweenProps: { scale: 3, alpha: 0.9 }
  }),
  [Ability.AERIAL_ACE]: (args) =>
    projectile({ startCoords: [args.targetX, 8, false] })(args),
  [Ability.SPIKES]: projectile({
    scale: 1,
    oriented: true,
    rotation: -Math.PI / 2
  }),
  ["TOXIC_SPIKES"]: projectile({
    scale: 2,
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.TORCH_SONG]: projectile({ oriented: true, rotation: -Math.PI / 2 }),
  ["CURSE_EFFECT"]: tweenAnimation({
    textureKey: "status",
    duration: 1500,
    endCoords: "caster",
    endPositionOffset: [0, -80]
  }),
  [Ability.MAGNET_BOMB]: projectile({ duration: 400 }),
  ["ELECTRO_SHOT_CHARGE"]: onCaster({
    ability: Ability.MAGNET_BOMB,
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    animOptions: { repeat: 5 }
  }),
  [Ability.ELECTRO_SHOT]: onCaster({
    scale: 4,
    origin: [0, 0.5],
    oriented: true,
    animOptions: { repeat: 3 }
  }),
  [Ability.GUNK_SHOT]: projectile({
    duration: 700,
    ease: "Power2",
    hitAnim: onTarget({
      ability: Ability.DIVE,
      scale: 1.5,
      tint: 0xf060a0,
      depth: DEPTH.ABILITY_GROUND_LEVEL
    })
  }),
  [Ability.TOXIC]: projectile({
    ability: Ability.GUNK_SHOT,
    scale: 1.5,
    duration: 500,
    tint: 0xc0ffa0,
    hitAnim: onTarget({
      ability: Ability.DIVE,
      scale: 1.5,
      tint: 0xc06080,
      depth: DEPTH.ABILITY_GROUND_LEVEL
    })
  }),
  [Ability.CHAIN_CRAZED]: onCaster({
    ability: Ability.STUN_SPORE,
    tint: 0xff60ff,
    scale: 2
  }),
  [Ability.MALIGNANT_CHAIN]: (args) => {
    const distance = distanceE(
      args.positionX,
      args.positionY,
      args.targetX,
      args.targetY
    )
    return tweenAnimation({
      scale: [1, 0],
      origin: [0.5, 0],
      oriented: true,
      rotation: -Math.PI / 2,
      duration: 600,
      tweenProps: {
        scaleY: distance * 1.2
      }
    })(args)
  },
  [Ability.SURF]: projectile({
    duration: 600,
    oriented: true,
    rotation: -(3 / 4) * Math.PI
  }),
  [Ability.STRENGTH]: projectile({
    duration: 450,
    startCoords: "target",
    startPositionOffset: [0, -150],
    ease: Phaser.Math.Easing.Quadratic.In
  }),
  [Ability.DRAGON_PULSE]: projectile({
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    tweenProps: { scale: 4 }
  }),
  [Ability.FREEZE_DRY]: projectile({
    duration: 250,
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    destroyOnComplete: true,
    destroyOnTweenComplete: false
  }),
  [Ability.BOLT_BEAK]: projectile({
    duration: 250,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.DARK_LARIAT]: projectile({ depth: DEPTH.ABILITY_BELOW_POKEMON }),
  [Ability.FIRESTARTER]: projectile({
    duration: 800,
    startCoords: "target",
    startPositionOffset: [0, -25],
    endPositionOffset: [0, +25]
  }),
  [Ability.GLAIVE_RUSH]: projectile({
    scale: 3,
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.PSYCHO_SHIFT]: [
    projectile({
      ability: Ability.PRESENT,
      duration: 300,
      tweenProps: { yoyo: true, repeat: 1 }
    }),
    projectile({
      ability: Ability.PRESENT,
      duration: 300,
      tweenProps: { yoyo: true, repeat: 1 },
      startCoords: "target",
      endCoords: "caster"
    })
  ],
  [Ability.HYPER_VOICE]: (args) =>
    projectile({
      startCoords: [0, args.targetY, args.flip],
      endCoords: [BOARD_WIDTH, args.targetY, args.flip],
      duration: 1000
    })(args),
  [Ability.WHIRLPOOL]: range(1, 3).map((i) =>
    projectile({
      duration: 1000,
      delay: i * 100,
      scale: 0.5,
      ease: "Power1",
      tweenProps: { scale: 2 }
    })
  ),
  [Ability.HEAT_CRASH]: projectile({
    ability: Ability.SUNSTEEL_STRIKE,
    oriented: true,
    rotation: -Math.PI / 2,
    scale: 0.5,
    duration: 300,
    depth: DEPTH.ABILITY_BELOW_POKEMON
  }),
  [Ability.HIDDEN_POWER_A]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_B]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_C]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_D]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_E]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_F]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_G]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_H]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_I]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_J]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_K]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_L]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_M]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_N]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_O]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_P]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_Q]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_R]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_S]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_T]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_U]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_V]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_W]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_X]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_Y]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_Z]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_QM]: hiddenPowerAnimation,
  [Ability.HIDDEN_POWER_EM]: hiddenPowerAnimation,
  [Ability.ICY_WIND]: orientedProjectile({ duration: 2000 }),
  [Ability.HURRICANE]: orientedProjectile({ duration: 1000, distance: 4 }),
  [Ability.DRILL_RUN]: orientedProjectile({
    ability: Ability.HURRICANE,
    duration: 500,
    distance: 1,
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.ROAR]: orientedProjectile({
    ability: Ability.WHIRLWIND,
    duration: 400,
    distance: 2
  }),
  [Ability.FLEUR_CANNON]: orientedProjectile({ duration: 2000 }),
  [Ability.SANDSEAR_STORM]: orientedProjectile({ duration: 2000 }),
  [Ability.WILDBOLT_STORM]: orientedProjectile({ duration: 2000 }),
  [Ability.BLEAKWIND_STORM]: orientedProjectile({ duration: 2000 }),
  [Ability.SPRINGTIDE_STORM]: orientedProjectile({ duration: 2000 }),
  [Ability.SOLAR_BLADE]: orientedProjectile({
    distance: 1,
    scale: 2,
    oriented: true,
    rotation: -Math.PI / 2,
    duration: 400
  }),
  [Ability.DRAGON_BREATH]: orientedProjectile({
    distance: 1.5,
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.BONEMERANG]: orientedProjectile({
    distance: 5,
    duration: 1000,
    ease: "Power2",
    tweenProps: { yoyo: true }
  }),
  [Ability.SHADOW_BONE]: orientedProjectile({
    ability: Ability.BONEMERANG,
    distance: 5,
    duration: 1000,
    tint: 0x301030
  }),
  [Ability.AURORA_BEAM]: onCaster({
    ability: Ability.MOONGEIST_BEAM,
    origin: [0.5, 0],
    scale: [1, 2],
    oriented: true,
    rotation: -Math.PI / 2
  }),
  [Ability.SPIRIT_SHACKLE]: orientedProjectile({
    distance: 8,
    scale: 1,
    duration: 2000,
    oriented: true
  }),
  [Ability.RAZOR_LEAF]: orientedProjectile({ distance: 8, duration: 2000 }),
  [Ability.PSYCHO_CUT]: range(1, 3).map((i) =>
    orientedProjectile({
      distance: 8,
      duration: 1000,
      oriented: true,
      rotation: +Math.PI / 2,
      tweenProps: { delay: i * 100 }
    })
  ),
  [Ability.MIST_BALL]: orientedProjectile({
    distance: 4,
    duration: 1000,
    scale: 1,
    ease: "Power2",
    tweenProps: { yoyo: true }
  }),
  [Ability.LUSTER_PURGE]: orientedProjectile({
    distance: 4,
    duration: 1000,
    scale: 1,
    ease: "Power2",
    tweenProps: { yoyo: true }
  }),
  [Ability.STEALTH_ROCKS]: orientedProjectile({
    distance: 1,
    scale: 3,
    depth: DEPTH.ABILITY_GROUND_LEVEL
  }),
  [Ability.SPIKY_SHIELD]: OrientationArray.map((orientation) =>
    orientedProjectile({
      orientation,
      distance: 8,
      ability: "SPIKE",
      oriented: true,
      rotation: -Math.PI / 2,
      duration: 1000
    })
  ),
  [Ability.SHELTER]: onCaster({
    ability: Ability.REFLECT,
    tint: 0xa080ff,
    positionOffset: [0, -15],
    scale: 2.5,
    animOptions: { repeat: 1 }
  }),
  [Ability.AURASPHERE]: orientedProjectile({
    distance: 8,
    duration: 2000,
    oriented: true
  }),
  [Ability.ULTRA_THRUSTERS]: [
    onCaster({ ability: Ability.LANDS_WRATH }),
    (args) => {
      const [dx, dy] = OrientationVector[args.orientation]
      // target is used to pass the new destination coordinates
      const coordinatesTarget = transformEntityCoordinates(
        args.targetX,
        args.targetY,
        args.flip
      )
      return tweenAnimation({
        ability: Ability.MYSTICAL_FIRE,
        startCoords: [args.positionX, args.positionY, args.flip],
        startPositionOffset: [dx * 32, dy * 32],
        tweenProps: { x: coordinatesTarget[0], y: coordinatesTarget[1] },
        scale: 2,
        origin: [0.5, 1],
        duration: 750,
        oriented: true,
        rotation: -Math.PI / 2
      })(args)
    }
  ],
  [Ability.BONE_ARMOR]: OrientationArray.map((orientation) =>
    orientedProjectile({
      orientation,
      distance: 0.5,
      ability: Ability.BONEMERANG,
      startCoords: "target",
      endCoords: "caster",
      duration: 1000
    })
  ),
  [Ability.CORE_ENFORCER]: [
    onTarget({ positionOffset: [-96, -96], origin: [0, 0.5] }),
    onTarget({
      positionOffset: [+100, -90],
      origin: [0, 0.5],
      rotation: (Math.PI * 3) / 4,
      delay: 100
    }),
    onTarget({ positionOffset: [-96, +96], origin: [0, 0.5], delay: 200 })
  ],
  [Ability.FOLLOW_ME]: poppingIcon({ maxScale: 1, tweenProps: { yoyo: true } }),
  [Ability.AFTER_YOU]: poppingIcon({ maxScale: 1, tweenProps: { yoyo: true } }),

  [Ability.HYPERSPACE_FURY]: (args) => {
    let nbHits = Number(args.orientation)
    if (isNaN(nbHits) || nbHits < 1 || nbHits > 12) {
      nbHits = 4 // default to 4 hits if orientation is not a valid number
    }
    for (let i = 0; i < nbHits; i++) {
      onTarget({
        scale: 1,
        positionOffset: [randomBetween(-30, +30), randomBetween(-30, +30)],
        rotation: -Math.PI / 2,
        tint: 0xc080ff,
        delay: i * 150
      })(args)
    }
  },

  [Ability.WATER_SHURIKEN]: (args) => {
    const orientations = [
      args.orientation,
      OrientationArray[(OrientationArray.indexOf(args.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(args.orientation) + 7) % 8]
    ]
    orientations.forEach((orientation) => {
      orientedProjectile({ orientation, distance: 8, duration: 1000 })(args)
    })
  },

  [Ability.SNIPE_SHOT]: (args) => {
    const targetAngle = angleBetween(
      [args.positionX, args.positionY],
      [args.targetX, args.targetY]
    )
    const orientationAngle = OrientationAngle[args.orientation] ?? 0
    const coordinates = transformEntityCoordinates(
      args.positionX,
      args.positionY,
      args.flip
    )
    projectile({
      ability: "SNIPE_SHOT/projectile",
      scale: 3,
      duration: 1000,
      rotation: targetAngle + Math.PI,
      endCoords: [
        args.positionX + Math.round(Math.cos(targetAngle) * 10),
        args.positionY + Math.round(Math.sin(targetAngle) * 10),
        args.flip
      ]
    })(args)
    staticAnimation({
      ability: "SNIPE_SHOT/shoot",
      x: coordinates[0] + Math.round(Math.cos(orientationAngle) * 30),
      y: coordinates[1] - Math.round(Math.sin(orientationAngle) * 50) - 10,
      scale: 1,
      oriented: true,
      rotation: Math.PI / 2,
      origin: [0.5, 1]
    })(args)
  },

  [Ability.DARK_HARVEST]: ({ scene, positionX, positionY, flip, ap }) => {
    const darkHarvestGroup = scene.add.group()
    const [x, y] = transformEntityCoordinates(positionX, positionY, flip)

    for (let i = 0; i < 5; i++) {
      const darkHarvestSprite = scene.add
        .sprite(0, 0, "abilities", `${Ability.DARK_HARVEST}/000.png`)
        ?.setScale(2 * (1 + ap / 200))
      darkHarvestSprite.anims.play({
        key: Ability.DARK_HARVEST,
        frameRate: 8
      })
      darkHarvestGroup.add(darkHarvestSprite)
    }

    const circle = new Geom.Circle(x, y, 48)
    Phaser.Actions.PlaceOnCircle(darkHarvestGroup.getChildren(), circle)

    scene.tweens.add({
      targets: circle,
      radius: 96,
      ease: Phaser.Math.Easing.Quartic.Out,
      duration: 1000,
      onUpdate: function (tween) {
        Phaser.Actions.RotateAroundDistance(
          darkHarvestGroup.getChildren(),
          { x, y },
          0.08,
          circle.radius
        )
      },
      onComplete: function () {
        darkHarvestGroup.destroy(true, true)
      }
    })
  },

  [Ability.DECORATE]: ({ scene, targetX, targetY, flip, ap }) => {
    const decorateGroup = scene.add.group()
    const [x, y] = transformEntityCoordinates(targetX, targetY, flip)

    Sweets.forEach((sweet) => {
      const sweetSprite = scene.add
        .sprite(0, 0, "item", `${sweet}.png`)
        ?.setScale(0.3 * (1 + ap / 200))
      decorateGroup.add(sweetSprite)
    })

    const circle = new Geom.Circle(x, y, 30)
    Phaser.Actions.PlaceOnCircle(decorateGroup.getChildren(), circle)

    scene.tweens.add({
      targets: circle,
      radius: 60,
      ease: Phaser.Math.Easing.Quartic.Out,
      duration: 1000,
      onUpdate: function (tween) {
        Phaser.Actions.RotateAroundDistance(
          decorateGroup.getChildren(),
          { x, y },
          0.08,
          circle.radius
        )
      },
      onComplete: function () {
        decorateGroup.destroy(true, true)
      }
    })
  },

  ["HAIL_PROJECTILE"]: projectile({
    startCoords: "target",
    startPositionOffset: [+60, -240],
    scale: 1,
    duration: 800,
    delay: randomBetween(0, 300),
    hitAnim: onTarget({ ability: Ability.SHEER_COLD, scale: 1 })
  }),

  [Ability.INFESTATION]: (args) => {
    const { positionX, positionY, targetX, targetY } = args
    if (positionY === 8 || positionY === 0) {
      const duration = distanceM(positionX, positionY, targetX, targetY) * 150
      projectile({ ability: "HEAL_ORDER", scale: 3, duration })(args)
    } else {
      onTarget({ ability: "ATTACK_ORDER" })(args)
    }
  },

  ["TIDAL_WAVE"]: tidalWaveAnimation,

  [Ability.COLUMN_CRUSH]: (args) => {
    const distance = min(1)(
      distanceE(args.positionX, args.positionY, args.targetX, args.targetY)
    )
    // orientation field is used to pass the type of the pillar
    const pillarType =
      [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE][
      args.orientation
      ] ?? Pkm.PILLAR_WOOD
    const animKey = `${PkmIndex[pillarType]}/${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}/${Orientation.DOWN}`
    const frame = `${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}/${Orientation.DOWN}/0000`
    return projectile({
      textureKey: PkmIndex[pillarType],
      frame,
      ability: animKey,
      duration: distance * 200,
      tweenProps: { angle: 270 }
    })(args)
  },

  ["ZYGARDE_CELL"]: (args) => {
    let orientation = getOrientation(
      args.targetX,
      args.targetY,
      args.positionX,
      args.positionY
    )
    if (!args.flip) orientation = OrientationFlip[orientation]
    const distance = min(1)(
      distanceE(args.positionX, args.positionY, args.targetX, args.targetY)
    )
    const animName = `ZYGARDE_CELL/${orientation}`
    const duration = max(2000)(Math.round(distance * 400))
    return projectile({
      frame: `${animName}/000.png`,
      ability: animName,
      duration,
      delay: randomBetween(0, max(500)(2000 - duration)),
      depth: DEPTH.ABILITY_BELOW_POKEMON,
      startCoords: "target",
      endCoords: "caster",
      scale: 1
    })(args)
  },

  [Ability.ICICLE_MISSILE]: (args) => {
    const {
      scene,
      ability,
      ap,
      delay,
      positionX,
      positionY,
      targetX,
      targetY,
      flip
    } = args
    const coordinates = transformEntityCoordinates(positionX, positionY, flip)
    const coordinatesTarget = transformEntityCoordinates(targetX, targetY, flip)
    const dx = delay === 1 ? -3 : delay === 2 ? +3 : 0 // delay is used to determine the index of the projectile
    const topCoords = transformEntityCoordinates(
      targetX + dx,
      positionY + 5,
      false
    )
    const angle1 = angleBetween(coordinates, topCoords) - Math.PI / 2
    const angle2 = angleBetween(topCoords, coordinatesTarget) - Math.PI / 2

    const missile = addAbilitySprite(scene, ability, ap, coordinates, {
      rotation: angle1
    })

    scene.tweens.chain({
      targets: missile,
      tweens: [
        {
          x: topCoords[0],
          y: topCoords[1],
          rotation: angle2,
          duration: 750,
          ease: Phaser.Math.Easing.Quadratic.Out
        },
        {
          x: coordinatesTarget[0],
          y: coordinatesTarget[1],
          duration: 750,
          ease: Phaser.Math.Easing.Quadratic.In
        }
      ],
      onComplete: () => {
        missile?.destroy()
      }
    })
  },

  [Ability.ARM_THRUST]: (args) => {
    // delay is used to pass the info of the number of hits
    for (let i = 0; i < (args.delay ?? 2); i++) {
      tweenAnimation({
        ability: Ability.BRICK_BREAK,
        startCoords: "target",
        startPositionOffset: [randomBetween(-30, 30), randomBetween(-30, 30)],
        tweenProps: { alpha: 0, delay: i * 250 }
      })(args)
    }
  },

  ["PARTING_SHOT"]: ({ scene, ability, ap, positionX, positionY, flip }) => {
    setTimeout(() => {
      const coordinates = transformEntityCoordinates(positionX, positionY, flip)
      const anim = addAbilitySprite(scene, ability, ap, coordinates)
      //add tween chain to make it bouncy (scale 120% with quad easing before scaling back to 100M) before fading out
      scene.tweens.chain({
        targets: anim,
        tweens: [
          {
            scaleX: 1.2,
            scaleY: 1.2,
            ease: Phaser.Math.Easing.Quadratic.Out,
            duration: 100
          },
          {
            scaleX: 1,
            scaleY: 1,
            ease: Phaser.Math.Easing.Quadratic.In,
            duration: 200
          },
          {
            alpha: 0,
            duration: 200
          }
        ],
        onComplete: () => {
          anim?.destroy()
        }
      })
    }, 750)
  },
  [Ability.ROCK_ARTILLERY]: skyfall({
    frame: "ROCK_ARTILLERY/001.png",
    duration: 200,
    scale: 0.75,
    hitAnim: onTarget({ ability: "ROCK_ARTILLERY", scale: 0.75 })
  }),
  [Ability.ZING_ZAP]: onCaster({
    depth: DEPTH.ABILITY_BELOW_POKEMON,
    ability: Ability.DISCHARGE
  })
}

export function displayAbility(args: AbilityAnimationArgs) {
  const anims = AbilitiesAnimations[args.ability]
  if (Array.isArray(anims)) {
    anims.forEach((anim) => anim(args))
  } else if (anims) {
    anims(args)
  }
}
