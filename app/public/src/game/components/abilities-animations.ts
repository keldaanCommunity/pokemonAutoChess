import { Geom } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AttackSprite } from "../../../../types"
import {
  AnimationType,
  AttackSpriteScale,
  HitSprite
} from "../../../../types/Animation"
import { BOARD_HEIGHT } from "../../../../types/Config"
import { Ability } from "../../../../types/enum/Ability"
import {
  Orientation,
  PokemonActionState,
  PokemonTint,
  SpriteType
} from "../../../../types/enum/Game"
import { Sweets } from "../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../types/enum/Pokemon"
import { distanceE, distanceM } from "../../../../utils/distance"
import { logger } from "../../../../utils/logger"
import { angleBetween } from "../../../../utils/number"
import {
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

export function displayAbility(
  scene: GameScene | DebugScene,
  pokemonsOnBoard: PokemonSprite[],
  skill: Ability | string,
  orientation: Orientation,
  positionX: number,
  positionY: number,
  targetX: number,
  targetY: number,
  flip: boolean,
  delay?: number
) {
  const coordinates = transformEntityCoordinates(positionX, positionY, flip)
  const coordinatesTarget = transformEntityCoordinates(targetX, targetY, flip)

  function addAbilitySprite(
    skill: Ability | string,
    coordinates: number[],
    destroyOnComplete?: boolean
  ): Phaser.GameObjects.Sprite | null {
    const frame = `${skill}/000.png`

    if (
      !scene.textures.exists("abilities") ||
      !scene.textures.get("abilities").has(frame)
    ) {
      logger.warn(`Missing frame: ${frame} in abilities texture`)
      return null
    }

    if (!scene.anims.exists(skill)) {
      logger.warn(`Missing animation: ${skill}`)
      return null
    }

    const abilityFx = scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "abilities",
      frame
    )
    abilityFx.setOrigin(0.5, 0.5).setDepth(DEPTH.ABILITY).play(skill)
    if (destroyOnComplete) {
      abilityFx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        abilityFx.destroy()
      })
    }
    return abilityFx
  }

  // Helper function for simple static abilities
  function displayStatic(
    ability: Ability | string,
    position: number[],
    scale: number | [number, number] = 2,
    options: {
      origin?: [number, number]
      depth?: number
      tint?: number
      rotation?: number
    } = {}
  ) {
    const sprite = addAbilitySprite(ability, position, true)
    if (!sprite) return null

    if (Array.isArray(scale)) {
      sprite.setScale(scale[0], scale[1])
    } else {
      sprite.setScale(scale)
    }

    if (options.origin) sprite.setOrigin(options.origin[0], options.origin[1])
    if (options.depth) sprite.setDepth(options.depth)
    if (options.tint) sprite.setTint(options.tint)
    if (options.rotation !== undefined) sprite.setRotation(options.rotation)

    return sprite
  }

  // Helper function for moving sprites from one position to another (projectiles, moving abilities, etc.)
  function displayTween(
    ability: Ability | string,
    startPosition: number[],
    endPosition: number[],
    options: {
      scale?: number
      duration?: number
      ease?: string | ((v: number) => number)
      yoyo?: boolean
      tint?: number
      alpha?: number
      rotation?: number
      delay?: number
      depth?: number
      origin?: [number, number]
      onComplete?: () => void
      tweenProps?: Record<string, any>
    } = {}
  ) {
    const sprite = addAbilitySprite(ability, startPosition)
    if (!sprite) return null

    if (options.scale !== undefined) sprite.setScale(options.scale)
    if (options.tint !== undefined) sprite.setTint(options.tint)
    if (options.rotation !== undefined) sprite.setRotation(options.rotation)
    if (options.depth !== undefined) sprite.setDepth(options.depth)
    if (options.alpha !== undefined) sprite.setAlpha(options.alpha)
    if (options.origin) sprite.setOrigin(options.origin[0], options.origin[1])

    const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: sprite,
      x: endPosition[0],
      y: endPosition[1],
      duration: options.duration || 500,
      ease: options.ease || "linear",
      onComplete: () => {
        sprite?.destroy()
        if (options.onComplete) options.onComplete()
      }
    }

    if (options.yoyo) tweenConfig.yoyo = true
    if (options.delay !== undefined) tweenConfig.delay = options.delay
    if (options.tweenProps) Object.assign(tweenConfig, options.tweenProps)

    scene.tweens.add(tweenConfig)
    return sprite
  }

  // Helper function for directional movement abilities
  function displayDirectionalProjectile(
    ability: Ability | string,
    startPos: number[],
    orientation: Orientation,
    distance: number,
    scale: number = 2,
    duration: number = 1000,
    options: {
      positionX: number
      positionY: number
      flip: boolean
      tint?: number
      rotation?: number
    }
  ) {
    const [dx, dy] = OrientationVector[orientation]
    const finalCoordinates = transformEntityCoordinates(
      options.positionX + dx * distance,
      options.positionY + dy * distance,
      options.flip
    )

    displayTween(ability, startPos, finalCoordinates, {
      scale,
      duration,
      ease: "linear",
      tint: options.tint,
      rotation: options.rotation
    })
  }

  switch (skill) {
    case Ability.DIAMOND_STORM:
    case Ability.THRASH:
    case Ability.HELPING_HAND:
    case Ability.FLORAL_HEALING:
    case Ability.ILLUSION:
    case Ability.ROAR_OF_TIME:
    case Ability.HAPPY_HOUR:
    case Ability.TELEPORT:
    case Ability.PSYCHO_BOOST:
    case Ability.SHIELDS_UP:
    case Ability.AQUA_RING:
    case Ability.INGRAIN:
    case Ability.DEFENSE_CURL:
    case Ability.RECOVER:
    case Ability.METRONOME:
    case Ability.LUNAR_BLESSING:
    case Ability.MAGIC_POWDER:
    case Ability.LANDS_WRATH:
    case Ability.POWER_WHIP:
    case Ability.MEDITATE:
    case Ability.MUD_BUBBLE:
    case Ability.SOFT_BOILED:
    case Ability.FAKE_TEARS:
    case Ability.TEA_TIME:
    case Ability.FUTURE_SIGHT:
    case Ability.PETAL_DANCE:
    case Ability.AROMATHERAPY:
    case Ability.BOUNCE:
    case "FIELD_DEATH":
    case "FAIRY_CRIT":
    case "POWER_LENS":
    case "STAR_DUST":
    case "HEAL_ORDER":
    case "ATTACK_ORDER":
      displayStatic(skill, coordinates, 2)
      break

    case Ability.BUG_BUZZ:
    case Ability.VENOSHOCK:
    case Ability.LEECH_LIFE:
    case Ability.THIEF:
    case Ability.STUN_SPORE:
    case Ability.CRABHAMMER:
    case Ability.RAZOR_WIND:
    case Ability.SEISMIC_TOSS:
    case Ability.ASSURANCE:
    case Ability.CRUSH_GRIP:
    case Ability.METAL_BURST:
    case Ability.SHADOW_SNEAK:
    case Ability.IVY_CUDGEL:
    case Ability.FACADE:
    case Ability.SHIELDS_DOWN:
    case Ability.BRAVE_BIRD:
    case Ability.DYNAMIC_PUNCH:
    case Ability.ELECTRO_WEB:
    case Ability.PSYSHIELD_BASH:
    case Ability.LIQUIDATION:
    case Ability.AIR_SLASH:
    case Ability.DREAM_EATER:
    case Ability.BURN_UP:
    case Ability.ICE_HAMMER:
    case Ability.MANTIS_BLADES:
    case Ability.PSYCHIC_FANGS:
    case Ability.THUNDER_FANG:
    case Ability.ICE_FANG:
    case Ability.FIRE_FANG:
    case Ability.POPULATION_BOMB:
    case Ability.SCREECH:
    case Ability.SAND_TOMB:
    case Ability.PLAY_ROUGH:
    case Ability.ANCHOR_SHOT:
    case Ability.LEAF_BLADE:
    case Ability.SLASHING_CLAW:
    case Ability.HEX:
    case Ability.PLASMA_FIST:
    case Ability.LEECH_SEED:
    case Ability.LOCK_ON:
    case Ability.PSYCH_UP:
    case Ability.ROCK_SMASH:
    case Ability.BLAZE_KICK:
    case Ability.BITE:
    case Ability.DRAGON_TAIL:
    case Ability.SOAK:
    case Ability.IRON_TAIL:
    case Ability.ICICLE_CRASH:
    case Ability.DRAIN_PUNCH:
    case Ability.LICK:
    case Ability.SPIRIT_BREAK:
    case Ability.PSYSHOCK:
    case Ability.SHEER_COLD:
    case Ability.COTTON_SPORE:
    case "FIGHTING_KNOCKBACK":
      displayStatic(skill, coordinatesTarget, 2)
      break

    case Ability.FIRE_BLAST:
    case Ability.CLOSE_COMBAT:
    case Ability.SUPER_FANG:
    case Ability.VINE_WHIP:
    case Ability.STOMP:
    case Ability.GUILLOTINE:
    case Ability.CROSS_POISON:
      displayStatic(skill, coordinatesTarget, 3)
      break

    case Ability.FIERY_DANCE:
      displayStatic(Ability.FIRE_BLAST, coordinatesTarget, 2)
      break

    case Ability.FIRE_SPIN:
      displayStatic(Ability.MAGMA_STORM, coordinatesTarget, 2)
      break

    case Ability.DRACO_ENERGY:
      displayStatic(skill, coordinatesTarget, 2, {
        depth: DEPTH.ABILITY_BELOW_POKEMON
      })
      break

    case Ability.DYNAMAX_CANNON:
    case Ability.MOONGEIST_BEAM:
      displayStatic(skill, coordinates, 2, {
        origin: [0.5, 0],
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.FREEZING_GLARE:
      addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)
        ?.setScale(2)
        .setOrigin(0.5, 0.98)
        .setRotation(angleBetween(coordinates, coordinatesTarget) + Math.PI / 2)
      break

    case Ability.BLOOD_MOON: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = [
        coordinates[0] + dx * 16,
        coordinates[1] - dy * 16 - 24
      ]
      addAbilitySprite(Ability.DYNAMAX_CANNON, finalCoordinates, true)
        ?.setScale(2)
        .setTint(0xff5060)
        .setOrigin(0.5, 0)
        .setRotation(angleBetween(coordinates, coordinatesTarget) - Math.PI / 2)
      addAbilitySprite("COSMIC_POWER", coordinates, true)
        ?.setTint(0xff5060)
        .setOrigin(0.5, 1)
        .setScale(2)
      break
    }

    case Ability.MYSTICAL_FIRE:
      displayStatic(skill, [coordinatesTarget[0], coordinatesTarget[1] - 25], 2)
      break

    case Ability.FLAME_CHARGE:
      displayStatic(skill, coordinates, 2, {
        depth: DEPTH.ABILITY_BELOW_POKEMON,
        origin: [1, 1],
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI / 2
      })
      break

    case Ability.PASTEL_VEIL:
      displayStatic(skill, coordinates, 2, {
        depth: DEPTH.ABILITY_BELOW_POKEMON,
        origin: [1, 1],
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI
      })
      break

    case Ability.AQUA_JET:
      displayStatic(skill, coordinates, 2, {
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.EXTREME_SPEED:
      displayStatic(skill, coordinates, 2)
      displayStatic(skill, coordinatesTarget, 2)
      break

    case Ability.SILVER_WIND:
      displayTween(Ability.EXTREME_SPEED, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500,
        ease: "linear"
      })
      break


    case "POWER_WHIP/hit":
      displayStatic("POWER_WHIP/hit", coordinates, 3)
      break

    case "LANDS_WRATH/hit":
      displayStatic("LANDS_WRATH/hit", coordinates, 2)
      break

    case Ability.CORE_ENFORCER:
      {
        const topLeft = transformEntityCoordinates(
          targetX - 1,
          targetY + 1,
          flip
        )
        const topRight = transformEntityCoordinates(
          targetX + 1,
          targetY + 1,
          flip
        )
        const bottomLeft = transformEntityCoordinates(
          targetX - 1,
          targetY - 1,
          flip
        )
        addAbilitySprite(skill, topLeft, true)?.setOrigin(0, 0.5).setScale(2)
        setTimeout(
          () =>
            addAbilitySprite(skill, topRight, true)
              ?.setScale(2)
              .setOrigin(0, 0.5)
              .setRotation((Math.PI * 3) / 4),
          100
        )
        setTimeout(
          () =>
            addAbilitySprite(skill, bottomLeft, true)
              ?.setOrigin(0, 0.5)
              .setScale(2),
          200
        )
      }
      break

    case Ability.SALT_CURE:
      displayStatic(Ability.MAGIC_POWDER, coordinates, 2, {
        tint: 0xb0ff80
      })
      break

    case Ability.SPICY_EXTRACT:
      displayStatic(Ability.MAGIC_POWDER, coordinates, 3, {
        tint: 0xff9000
      })
      break

    case Ability.SWEET_SCENT:
      displayStatic(Ability.MAGIC_POWDER, coordinates, 3, {
        tint: 0xffc0c0
      })
      break

    case Ability.TWISTING_NETHER:
      displayStatic(skill, coordinatesTarget, 4, {
        origin: [0.5, 0.5]
      })
      break

    case Ability.DARK_VOID:
      displayStatic(Ability.TWISTING_NETHER, coordinatesTarget, 4)
      break

    case Ability.WHEEL_OF_FIRE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500,
        ease: "Power2",
        yoyo: true
      })
      break

    case Ability.INFERNAL_PARADE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500,
        ease: "Power2",
        yoyo: true
      })
      break

    case Ability.BLUE_FLARE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 500
      })
      break

    case Ability.GLACIATE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.SHADOW_BALL:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.FUSION_BOLT:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.ICY_WIND:
      displayDirectionalProjectile(skill, coordinates, orientation, 8, 1, 2000, {
        positionX,
        positionY,
        flip
      })
      break

    case Ability.SOLAR_BEAM:
      displayTween(skill, transformEntityCoordinates(targetX, targetY - 3, flip), coordinatesTarget, {
        scale: 2,
        duration: 500
      })
      break

    case Ability.ORIGIN_PULSE:
      displayTween(skill, transformEntityCoordinates(0, targetY, flip), transformEntityCoordinates(8, targetY, flip), {
        scale: 4,
        duration: 1000
      })
      break

    case Ability.SPACIAL_REND:
      displayStatic(skill, transformEntityCoordinates(4, targetY, flip), 4)
      break

    case Ability.SEED_FLARE:
      displayStatic(skill, coordinates, [3, 3])
      break

    case Ability.MULTI_ATTACK:
      displayStatic(skill, coordinates, 4)
      break

    case Ability.ROCK_SLIDE:
      displayStatic(skill, coordinatesTarget, 2, {
        origin: [0.5, 0.9]
      })
      break

    case Ability.FLAMETHROWER:
      displayStatic(skill, coordinates, 2, {
        origin: [0.5, 1],
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI / 2
      })
      break

    case Ability.FIERY_WRATH:
      displayStatic(Ability.FLAMETHROWER, coordinates, 2, {
        origin: [0.5, 1],
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI / 2,
        tint: 0xc000c0
      })
      break

    case Ability.PSYBEAM:
    case Ability.TWIN_BEAM:
      displayStatic(Ability.PSYBEAM, coordinates, [1, 2], {
        origin: [0.5, 0],
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.THUNDER_SHOCK:
      displayStatic(Ability.THUNDER, coordinatesTarget, 2, {
        origin: [0.5, 1]
      })
      break

    case Ability.HYDRO_PUMP:
      displayStatic(skill, coordinates, 2, {
        rotation: Math.PI / 2
      })
      break

    case Ability.SWALLOW:
      displayStatic(Ability.HYDRO_PUMP, coordinates, 2, {
        origin: [0.5, 1],
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI / 2,
        tint: 0x60ff60
      })
      break

    case Ability.DRACO_METEOR:
      displayStatic(skill, coordinatesTarget, 2, {
        origin: [0.5, 0.9]
      })
      break

    case Ability.WISH:
      displayStatic(skill, coordinates, 3)
      break

    case Ability.GRAVITY:
      displayStatic(Ability.MEDITATE, coordinates, 3, {
        tint: 0xccff33,
        depth: DEPTH.ABILITY_GROUND_LEVEL
      })
      break

    case Ability.COSMIC_POWER_MOON:
      displayStatic("COSMIC_POWER", coordinates, 2, {
        tint: 0xccb0ff,
        origin: [0.5, 1]
      })
      break

    case Ability.COSMIC_POWER_SUN:
      displayStatic("COSMIC_POWER", coordinates, 2, {
        tint: 0xffffd0,
        origin: [0.5, 1]
      })
      break

    case Ability.FORECAST:
      displayStatic(skill, coordinates, 2, {
        depth: DEPTH.ABILITY_BELOW_POKEMON
      })
      break

    case Ability.FOLLOW_ME:
    case Ability.AFTER_YOU: {
      const sprite = addAbilitySprite(
        skill,
        [coordinates[0], coordinates[1] - 50],
        true
      )
        ?.setScale(0.5)
        .setDepth(DEPTH.ABILITY)
      scene.tweens.add({
        targets: sprite,
        ease: Phaser.Math.Easing.Sine.InOut,
        alpha: { from: 0, to: 1 },
        yoyo: true,
        duration: 500,
        onComplete: () => {
          sprite?.destroy()
        }
      })

      break
    }

    case Ability.CHATTER:
    case Ability.BOOMBURST:
      displayStatic(Ability.CHATTER, coordinates, 2)
      break

    case Ability.BLAST_BURN:
      displayStatic(skill, coordinates, 3)
      break

    case Ability.CHARGE:
      displayStatic(skill, coordinates, 4, {
        depth: DEPTH.ABILITY_BELOW_POKEMON,
        origin: [0.5, 0.8]
      })
      break

    case Ability.DISCHARGE:
      displayStatic(skill, coordinates, 3)
      break

    case Ability.OVERDRIVE:
      displayStatic(skill, coordinates, 2, {
        origin: [0.5, 0.5]
      })
      break

    case Ability.SMOG:
      displayStatic(skill, coordinates, 4, {
        depth: DEPTH.ABILITY_MINOR
      })
      break

    case Ability.SLUDGE:
      displayStatic(Ability.SMOG, coordinatesTarget, [3, 3], {
        tint: 0xa0c020
      })
      break

    case Ability.CRUNCH:
      displayStatic(Ability.BITE, coordinatesTarget, 3)
      break

    case Ability.DRAGON_BREATH: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 1.5,
        positionY + dy * 1.5,
        flip
      )
      displayTween(skill, coordinates, finalCoordinates, {
        scale: 2,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case "SCALE_SHOT_CHARGE": {
      const charge = scene.add
        .sprite(
          coordinates[0],
          coordinates[1],
          "abilities",
          `${Ability.SCALE_SHOT}/000.png`
        )
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY)

      charge.anims.play({
        key: Ability.SCALE_SHOT,
        duration: 300,
        repeat: -1
      })

      scene.tweens.add({
        targets: charge,
        duration: delay,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        onComplete: () => {
          charge.destroy()
        }
      })
      break
    }

    case Ability.SCALE_SHOT:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 400
      })
      break

    case "SOLAR_BLADE_CHARGE": {
      const charge = scene.add
        .sprite(
          coordinates[0],
          coordinates[1],
          "abilities",
          `${Ability.RECOVER}/000.png`
        )
        ?.setScale(3)
        .setDepth(DEPTH.ABILITY)
      charge.anims.play({
        key: Ability.RECOVER,
        duration: 500,
        repeat: -1
      })
      scene.tweens.add({
        targets: charge,
        duration: 2000,
        x: coordinates[0],
        y: coordinates[1],
        onComplete: () => {
          charge.destroy()
        }
      })
      break
    }

    case Ability.SOLAR_BLADE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 1.5,
        positionY + dy * 1.5,
        flip
      )
      displayTween(skill, coordinates, finalCoordinates, {
        scale: 3,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) + Math.PI / 2
      })
      break
    }

    case Ability.FROST_BREATH:
      displayStatic(skill, [coordinates[0], coordinates[1] - 30], 4, {
        origin: [-0.1, 0.5],
        rotation: angleBetween(coordinates, coordinatesTarget)
      })
      break

    case Ability.TORMENT:
    case Ability.RAGE:
      displayStatic(Ability.TORMENT, [coordinates[0], coordinates[1] - 50], 2)
      break

    case Ability.NIGHT_SLASH:
    case Ability.KOWTOW_CLEAVE:
      displayStatic(Ability.NIGHT_SLASH, coordinatesTarget, 2)
      break

    case Ability.FELL_STINGER:
      displayStatic(Ability.VENOSHOCK, coordinatesTarget, 2)
      break

    case Ability.NASTY_PLOT:
      displayStatic(skill, [coordinates[0], coordinates[1] - 50], 2)
      break

    case Ability.HURRICANE:
      displayDirectionalProjectile(skill, coordinates, orientation, 8, 2, 2000, {
        positionX,
        positionY,
        flip
      })
      break

    case Ability.ROAR:
      displayDirectionalProjectile(
        Ability.WHIRLWIND,
        coordinates,
        orientation,
        8,
        2,
        1000,
        {
          positionX,
          positionY,
          flip
        }
      )
      break

    case Ability.FLEUR_CANNON:
      displayDirectionalProjectile(skill, coordinates, orientation, 8, 2, 2000, {
        positionX,
        positionY,
        flip
      })
      break

    case Ability.SANDSEAR_STORM:
    case Ability.WILDBOLT_STORM:
    case Ability.BLEAKWIND_STORM:
    case Ability.SPRINGTIDE_STORM:
      displayDirectionalProjectile(skill, coordinates, orientation, 8, 2, 2000, {
        positionX,
        positionY,
        flip
      })
      break



    case Ability.ROCK_TOMB:
      displayStatic(skill, coordinatesTarget, 1, {
        origin: [0.5, 0.9]
      })
      break

    case Ability.SLACK_OFF:
      displayStatic(Ability.ILLUSION, coordinates, 1)
      break

    case Ability.FISHIOUS_REND:
      displayStatic(skill, coordinates, 2, {
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.CUT:
      addAbilitySprite(Ability.FISHIOUS_REND, coordinates, true)
        ?.setScale(2)
        .setRotation(angleBetween(coordinates, coordinatesTarget) - Math.PI / 2)
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(3)
      break

    case Ability.GOLD_RUSH:
    case Ability.MAKE_IT_RAIN:
      displayTween(Ability.GOLD_RUSH, coordinates, coordinatesTarget, {
        scale: skill === Ability.MAKE_IT_RAIN ? 3 : 2,
        duration: 1000
      })
      break

    case Ability.MUD_SHOT:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 4,
        duration: 350
      })
      break

    case Ability.POLTERGEIST:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.ZAP_CANNON:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.ELECTRO_BALL:
      displayTween(Ability.ZAP_CANNON, coordinates, coordinatesTarget, {
        scale: 2,
        duration: delay ?? 300
      })
      break

    case Ability.SPARKLING_ARIA:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.SKY_ATTACK:
      displayTween(skill, transformEntityCoordinates(targetX, 9, false), coordinatesTarget, {
        scale: 1.5,
        duration: 500
      })
      break

    case Ability.SKY_ATTACK_SHADOW:
      displayTween(skill, transformEntityCoordinates(targetX, 9, false), coordinatesTarget, {
        scale: 1.5,
        duration: 500
      })
      break

    case Ability.FLYING_PRESS: {
      const startCoords = transformEntityCoordinates(targetX, 9, false)
      displayTween(skill, startCoords, coordinatesTarget, {
        scale: 2,
        duration: 500,
        onComplete: () => {
          addAbilitySprite(Ability.HEAVY_SLAM, coordinatesTarget, true)
        }
      })
      break
    }

    case Ability.SUNSTEEL_STRIKE: {
      const startCoords = transformEntityCoordinates(targetX, 9, false)
      displayTween(skill, startCoords, coordinatesTarget, {
        duration: 500,
        onComplete: () => {
          scene.shakeCamera(250, 0.01)
        }
      })
      break
    }

    case Ability.HEAT_CRASH: {
      displayTween(Ability.SUNSTEEL_STRIKE, coordinates, coordinatesTarget, {
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2,
        depth: DEPTH.ABILITY_BELOW_POKEMON,
        scale: 0.5,
        duration: 300
      })
      break
    }

    case "COMET_CRASH": {
      const startCoords = transformEntityCoordinates(targetX, 9, false)
      displayTween(Ability.SUNSTEEL_STRIKE, startCoords, coordinatesTarget, {
        scale: 0.5,
        duration: 500,
        tint: 0x2020ff
      })
      break
    }

    case Ability.ACROBATICS:
      displayTween(skill, transformEntityCoordinates(targetX + 1, targetY + 1, flip), coordinatesTarget, {
        scale: 2,
        duration: 300
      })
      break

    case Ability.ROLLOUT:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.ICE_BALL:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: (8 * 1000) / 15
      })
      break

    case Ability.PRESENT:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.TOPSY_TURVY:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500
      })
      break

    case Ability.WHIRLWIND:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.ACID_SPRAY:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.WATER_PULSE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.GRAV_APPLE: {
      const aboveTargetCoordinates = transformEntityCoordinates(
        targetX,
        targetY,
        flip
      )
      aboveTargetCoordinates[1] -= 400
      displayTween("NUTRIENTS", aboveTargetCoordinates, coordinatesTarget, {
        scale: 3,
        duration: 400,
        onComplete: () => {
          addAbilitySprite("PUFF_RED", coordinatesTarget, true)?.setScale(2)
        }
      })
      break
    }

    case Ability.NUTRIENTS:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 400,
        onComplete: () => {
          addAbilitySprite("PUFF_GREEN", coordinatesTarget, true)?.setScale(2)
        }
      })
      break

    case Ability.SYRUP_BOMB:
      displayTween("NUTRIENTS", coordinates, coordinatesTarget, {
        scale: 3,
        duration: 400,
        onComplete: () => {
          addAbilitySprite("PUFF_RED", coordinatesTarget, true)?.setScale(2)
        }
      })
      break

    case Ability.APPLE_ACID:
      displayTween("NUTRIENTS", coordinates, coordinatesTarget, {
        scale: 3,
        duration: 400,
        onComplete: () => {
          addAbilitySprite("PUFF_RED", coordinatesTarget, true)?.setScale(2)
        }
      })
      break

    case Ability.FICKLE_BEAM:
      displayTween(Ability.FICKLE_BEAM, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 400
      })
      break

    case Ability.POLLEN_PUFF:
      displayTween(Ability.HEAL_ORDER, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.PSYSTRIKE:
      displayTween(Ability.PSYSTRIKE, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.EGG_BOMB:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.SPARK:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 300,
        ease: "linear",
        delay: (delay || 0) * 400
      })
      break

    case Ability.SUCTION_HEAL:
      displayTween(skill, coordinatesTarget, coordinates, {
        scale: 3,
        duration: 500
      })
      break

    case Ability.PAYDAY:
      displayStatic(skill, coordinatesTarget, 2)
      displayStatic(Ability.FACADE, coordinatesTarget, 1)
      break

    case Ability.VOLT_SWITCH:
      displayStatic(skill, coordinatesTarget, 2, {
        origin: [0.5, 0],
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.BEHEMOTH_BLADE:
      displayStatic(Ability.VOLT_SWITCH, coordinates, 2, {
        origin: [0.5, 0],
        tint: 0x87ceeb,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.MUDDY_WATER:
      displayStatic(skill, coordinatesTarget, 2, {
        origin: [0.5, 1]
      })
      break

    case Ability.ANCIENT_POWER:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.MOON_DREAM: {
      const aboveTargetCoordinates = transformEntityCoordinates(
        positionX,
        positionY,
        flip
      )
      aboveTargetCoordinates[1] -= 100
      displayTween(skill, aboveTargetCoordinates, coordinates, {
        scale: 1.5,
        duration: 500,
        tweenProps: { scale: 0.5 }
      })
      break
    }

    case Ability.FAIRY_LOCK:
      displayStatic(skill, coordinatesTarget, 1)
      break

    case Ability.STEAM_ERUPTION:
      displayStatic(skill, coordinates, 2, {
        depth: 1
      })
      break

    case Ability.SEARING_SHOT:
      displayStatic(Ability.STEAM_ERUPTION, coordinates, [3, 3], {
        depth: DEPTH.ABILITY_BELOW_POKEMON
      })
      break

    case Ability.POWER_HUG:
      displayStatic(Ability.ANCHOR_SHOT, coordinatesTarget, 2)
      break

    case Ability.HEAVY_SLAM:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      scene.shakeCamera(250, 0.01)
      break

    case Ability.BODY_SLAM:
      scene.shakeCamera(250, 0.01)
      break

    case Ability.BULLDOZE:
      addAbilitySprite(Ability.HEAVY_SLAM, coordinates, true)?.setScale(2)
      scene.shakeCamera(250, 0.01)
      break

    case Ability.FAKE_OUT:
      displayStatic(Ability.FACADE, coordinates, 2)
      break

    case Ability.MAGICAL_LEAF: {
      addAbilitySprite("MAGICAL_LEAF_CHARGE", coordinates, true)?.setScale(2)
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500
      })
      break
    }

    case Ability.FILLET_AWAY:
      displayStatic(Ability.SHIELDS_UP, coordinates, 2)
      break

    case Ability.NATURAL_GIFT:
    case Ability.NIGHT_SHADE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 1000
      })
      break

    case Ability.ARMOR_CANNON: {
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2 - (delay ?? 0) * 0.5,
        duration: 400
      })
      break
    }

    case Ability.BITTER_BLADE:
      displayStatic(skill, coordinates, 3)
      break

    case Ability.MIND_BEND:
      displayStatic(
        Ability.ASSURANCE,
        [coordinatesTarget[0], coordinatesTarget[1] - 20],
        2
      )
      break

    case Ability.FISSURE: {
      displayTween(skill, coordinatesTarget, coordinatesTarget, {
        scale: 1,
        tweenProps: { scale: 3 },
        duration: 800,
        ease: Phaser.Math.Easing.Sine.InOut,
        yoyo: true
      })
      scene.shakeCamera(250, 0.01)
      break
    }

    case Ability.PARABOLIC_CHARGE:
      displayTween(skill, coordinates, coordinatesTarget, {
        duration: 1000
      })
      break

    case Ability.ATTRACT:
      displayStatic(skill, [coordinates[0], coordinates[1] - 70], 2)
      break

    case Ability.MAGNET_RISE:
      displayStatic(Ability.ELECTRO_BOOST, coordinates, 2)
      break

    case Ability.FORCE_PALM:
      displayStatic(Ability.ANCHOR_SHOT, coordinatesTarget, 2)
      break

    case Ability.HYPERSPACE_FURY: {
      const nbHits = Number(orientation) // orientation field is used to pass the number of hits for hyperspace fury
      for (let i = 0; i < nbHits; i++) {
        setTimeout(() => {
          addAbilitySprite(
            Ability.HYPERSPACE_FURY,
            [
              coordinatesTarget[0] + randomBetween(-30, +30),
              coordinatesTarget[1] + randomBetween(-30, +30)
            ],
            true
          )
            ?.setScale(1)
            .setRotation(-Math.PI / 2)
            .setTint(0xc080ff)
        }, i * 150)
      }
      break
    }


    case Ability.WATERFALL:
      displayStatic(skill, coordinates, 2, {
        depth: DEPTH.ABILITY_BELOW_POKEMON
      })
      break

    case Ability.ERUPTION: {
      const startCoords = transformEntityCoordinates(
        targetX + 3,
        targetY + 3,
        flip
      )
      displayTween(skill, startCoords, coordinatesTarget, {
        duration: 500
      })
      break
    }

    case Ability.THOUSAND_ARROWS:
      displayTween(
        skill,
        [coordinatesTarget[0], BOARD_HEIGHT - 1],
        coordinatesTarget,
        {
          scale: 4,
          duration: 300
        }
      )
      break

    case Ability.MAGMA_STORM:
      displayStatic(skill, coordinatesTarget, 1)
      break

    case Ability.ABSORB:
      displayStatic(skill, coordinates, 2, {
        depth: DEPTH.ABILITY_GROUND_LEVEL
      })
      break

    case Ability.GIGATON_HAMMER:
      displayStatic(skill, coordinatesTarget, 2)
      scene.shakeCamera(250, 0.01)
      break

    case Ability.COUNTER:
      displayStatic(skill, coordinates, 3)
      break

    case Ability.SPECTRAL_THIEF:
      displayStatic(skill, coordinatesTarget, 2)
      displayStatic(skill, coordinates, 2)
      break

    case Ability.SACRED_SWORD_IRON:
      displayStatic("SACRED_SWORD", coordinatesTarget, 2, {
        origin: [0.5, 0.2],
        rotation: Math.PI
      })
      break

    case Ability.SACRED_SWORD_GRASS:
      displayStatic("SACRED_SWORD", coordinatesTarget, 2, {
        origin: [0.5, 0.2],
        rotation: Math.PI,
        tint: 0xb0ffa0
      })
      break

    case Ability.SACRED_SWORD_CAVERN:
      displayStatic("SACRED_SWORD", coordinatesTarget, 2, {
        origin: [0.5, 0.2],
        rotation: Math.PI,
        tint: 0xe0c0a0
      })
      break

    case Ability.SECRET_SWORD: {
      const specialProjectile = addAbilitySprite(
        "SACRED_SWORD",
        [coordinatesTarget[0], coordinatesTarget[1] - 30],
        true
      )
        ?.setScale(2)
        .setOrigin(0.5, 0.5)
        .setTint(0xfff0b0)
      scene.tweens.add({
        targets: specialProjectile,
        angle: 540,
        duration: 400
      })
      break
    }

    case Ability.JUDGEMENT:
      displayStatic(skill, coordinatesTarget, 2, {
        origin: [0.5, 1]
      })
      break

    case Ability.DIVE:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(3)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.SMOKE_SCREEN:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(3)
      break

    case Ability.BARB_BARRAGE:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.OUTRAGE:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.KNOCK_OFF:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.SLASH:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.HYPER_VOICE: {
      const startCoords = transformEntityCoordinates(0, targetY, flip)
      const finalCoords = transformEntityCoordinates(8, targetY, flip)
      displayTween(skill, startCoords, finalCoords, {
        scale: 2,
        duration: 1000
      })
      break
    }

    case Ability.SHADOW_CLONE:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.ECHO:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setOrigin(0.5, 0.7)
      break

    case Ability.EXPLOSION:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      scene.shakeCamera(250, 0.01)
      break

    case Ability.CHLOROBLAST:
      addAbilitySprite(Ability.EXPLOSION, coordinates, true)
        ?.setScale(2)
        .setTint(0x90ffd0)
      scene.shakeCamera(250, 0.01)
      break

    case Ability.CLANGOROUS_SOUL:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.GROWL:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setRotation(angleBetween(coordinates, coordinatesTarget) - Math.PI / 2)
      break

    case Ability.FAIRY_WIND:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.RELIC_SONG:
    case Ability.SING:
    case Ability.DISARMING_VOICE:
      addAbilitySprite(Ability.RELIC_SONG, coordinates, true)?.setScale(2)
      break

    case Ability.HIGH_JUMP_KICK:
    case Ability.LUNGE:
      addAbilitySprite(
        Ability.HIGH_JUMP_KICK,
        coordinatesTarget,
        true
      )?.setScale(2)
      break

    case Ability.TROP_KICK:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.SHELL_TRAP:
      addAbilitySprite(Ability.COUNTER, coordinates, true)?.setScale(2)
      break

    case Ability.SHELL_SMASH:
      addAbilitySprite(Ability.COUNTER, coordinates, true)?.setScale(2)
      break

    case Ability.TRI_ATTACK:
      displayTween(skill, coordinates, coordinatesTarget, { duration: 500 })
      break

    case Ability.PSYCHIC:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 3,
        duration: 1000
      })
      break

    case Ability.PYRO_BALL:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 500,
        tweenProps: { scale: 2 }
      })
      break

    case Ability.SLUDGE_WAVE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 800,
        tweenProps: { scale: 2 },
        onComplete: () => {
          addAbilitySprite(Ability.DIVE, coordinatesTarget, true)
            ?.setScale(3)
            .setTint(0xf060a0)
            .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        }
      })
      break

    case Ability.LAVA_PLUME:
      displayTween(Ability.SLUDGE_WAVE, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 800,
        tint: 0xffc020,
        tweenProps: { scale: 2 },
        onComplete: () => {
          addAbilitySprite("FLAME_HIT", coordinatesTarget, true)?.setScale(2)
        }
      })
      break

    case Ability.WHIRLPOOL: {
      for (let i = 0; i < 4; i++) {
        displayTween(skill, coordinates, coordinatesTarget, {
          scale: 2,
          duration: 1000,
          delay: i * 100,
          ease: "Power1",
        })
      }
      break
    }

    case Ability.BONEMERANG: {
      const startCoords = transformEntityCoordinates(positionX, positionY, flip)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformEntityCoordinates(
        positionX + dx * 5,
        positionY + dy * 5,
        flip
      )
      displayTween(skill, startCoords, finalCoords, {
        scale: 2,
        duration: 1000,
        ease: "Power2",
        yoyo: true
      })
      break
    }

    case Ability.SHADOW_BONE: {
      const startCoords = transformEntityCoordinates(positionX, positionY, flip)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformEntityCoordinates(
        positionX + dx * 5,
        positionY + dy * 5,
        flip
      )
      displayTween(Ability.BONEMERANG, startCoords, finalCoords, {
        scale: 2,
        duration: 1000,
        tint: 0x301030
      })
      break
    }

    case Ability.PRISMATIC_LASER: {
      const startCoords = transformEntityCoordinates(
        targetX,
        flip ? 6 : 0,
        flip
      )
      const finalCoords = transformEntityCoordinates(
        targetX,
        flip ? 0 : 6,
        flip
      )
      displayTween(skill, startCoords, finalCoords, {
        scale: 5,
        duration: 500
      })
      break
    }

    case "GULP_MISSILE/pikachu": {
      const duration = distanceM(positionX, positionY, targetX, targetY) * 150
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case "GULP_MISSILE/arrokuda": {
      const duration = distanceM(positionX, positionY, targetX, targetY) * 150
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case Ability.AURORA_BEAM: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformEntityCoordinates(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      displayTween(skill, coordinates, finalCoords, {
        scale: 2,
        duration: 1500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case Ability.SONG_OF_DESIRE:
      addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 60],
        true
      )?.setScale(2)
      break

    case Ability.CONFUSING_MIND:
    case Ability.DOUBLE_SHOCK:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.MIND_BLOWN:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setOrigin(0.5, 0.8)
      addAbilitySprite("MIND_BLOWN/hit", coordinatesTarget, true)?.setScale(3)
      break

    case Ability.FIRE_LASH:
      displayStatic(skill, coordinatesTarget, 4)
      break

    case Ability.DRAGON_DARTS:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.SPIRIT_SHACKLE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      displayTween(skill, coordinates, finalCoordinates, {
        scale: 1,
        duration: 2000,
        rotation: angleBetween(coordinates, coordinatesTarget)
      })
      break
    }

    case Ability.ASTRAL_BARRAGE:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI
      })
      break

    case Ability.WATER_SHURIKEN: {
      const orientations = [
        orientation,
        OrientationArray[(OrientationArray.indexOf(orientation) + 1) % 8],
        OrientationArray[(OrientationArray.indexOf(orientation) + 7) % 8]
      ]
      orientations.forEach((orientation) => {
        const [dx, dy] = OrientationVector[orientation]
        const finalCoordinates = transformEntityCoordinates(
          positionX + dx * 8,
          positionY + dy * 8,
          flip
        )
        const projectile = addAbilitySprite(skill, coordinates)?.setScale(2)
        scene.tweens.add({
          targets: projectile,
          x: finalCoordinates[0],
          y: finalCoordinates[1],
          ease: "linear",
          yoyo: false,
          duration: 2000,
          onComplete: () => {
            projectile?.destroy()
          }
        })
      })
      break
    }

    case Ability.RAZOR_LEAF: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const projectile = addAbilitySprite(skill, coordinates)?.setScale(2)
      scene.tweens.add({
        targets: projectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          projectile?.destroy()
        }
      })
      break
    }

    case Ability.PSYCHO_CUT: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      for (let i = 0; i < 3; i++) {
        const projectile = addAbilitySprite(skill, coordinates)
          ?.setScale(2)
          .setAlpha(0)
          .setRotation(
            angleBetween(coordinates, finalCoordinates) - Math.PI / 2
          )
        scene.tweens.add({
          targets: projectile,
          x: finalCoordinates[0],
          y: finalCoordinates[1],
          alpha: { from: 1, to: 1 },
          ease: "linear",
          yoyo: false,
          duration: 1000,
          delay: i * 100,
          onComplete: () => {
            projectile?.destroy()
          }
        })
      }
      break
    }

    case Ability.SPIKY_SHIELD:
      OrientationArray.forEach((orientation) => {
        const [dx, dy] = OrientationVector[orientation]
        const finalCoordinates = transformEntityCoordinates(
          positionX + dx * 8,
          positionY + dy * 8,
          flip
        )
        const spike = addAbilitySprite("SPIKE", coordinates)?.setRotation(
          angleBetween(finalCoordinates, coordinates) + Math.PI / 2
        )
        scene.tweens.add({
          targets: spike,
          x: finalCoordinates[0],
          y: finalCoordinates[1],
          ease: "linear",
          duration: 1000,
          onComplete: () => {
            spike?.destroy()
          }
        })
      })
      break

    case Ability.MACH_PUNCH:
    case Ability.MEGA_PUNCH: {
      const specialProjectile = addAbilitySprite(
        "FIGHTING/FIST",
        coordinatesTarget
      )?.setScale(0.25)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 3,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.MAWASHI_GERI:
    case Ability.THUNDEROUS_KICK: {
      const specialProjectile = addAbilitySprite(
        "FIGHTING/FOOT",
        coordinatesTarget
      )?.setScale(0.25)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 3,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.TRIPLE_KICK:
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const projectile = addAbilitySprite("FIGHTING/PAW", [
            coordinates[0] + Math.round(50 * Math.cos((Math.PI * 2 * i) / 3)),
            coordinates[1] + Math.round(50 * Math.sin((Math.PI * 2 * i) / 3))
          ])?.setScale(1.5)
          setTimeout(() => projectile?.destroy(), 500)
        }, i * 250)
      }
      break

    case Ability.STRING_SHOT:
      displayTween(skill, coordinatesTarget, coordinatesTarget, {
        scale: 0.25,
        duration: 1000,
        ease: Phaser.Math.Easing.Cubic.Out,
        tweenProps: { scale: 2, alpha: 0.9 },
      })
      break

    case Ability.ENTANGLING_THREAD:
      displayTween(Ability.STRING_SHOT, coordinates, coordinates, {
        scale: 0.25,
        tint: 0x80a080,
        duration: 1200,
        tweenProps: { scale: 3, alpha: 0.9 },
        ease: Phaser.Math.Easing.Cubic.Out
      })
      break

    case Ability.WONDER_GUARD:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.X_SCISSOR:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.DEATH_WING:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.GEOMANCY:
      addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
      break

    case Ability.BLIZZARD:
      addAbilitySprite(Ability.BLIZZARD, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.OVERHEAT:
      addAbilitySprite(Ability.FIRE_BLAST, coordinates, true)
        ?.setScale(3)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.MIST_BALL:
    case Ability.LUSTER_PURGE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformEntityCoordinates(
        positionX + dx * 4,
        positionY + dy * 4,
        flip
      )
      displayTween(skill, coordinates, finalCoords, {
        scale: 1,
        ease: "Power2",
        yoyo: true,
        duration: 1000
      })
      break
    }

    case Ability.AERIAL_ACE: {
      const startCoords = transformEntityCoordinates(targetX, 8, false)
      displayTween(skill, startCoords, coordinatesTarget, {
        scale: 2,
        duration: 500
      })
      break
    }

    case Ability.STEALTH_ROCKS: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx,
        positionY + dy,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates, true)
        ?.setScale(3)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)

      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        duration: 500
      })
      break
    }

    case Ability.SPIKES:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case "TOXIC_SPIKES":
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2,
      })
      break

    case "LINK_CABLE_link": {
      const distance = distanceE(positionX, positionY, targetX, targetY)
      displayStatic(Ability.LINK_CABLE, coordinates, [2, distance * 0.36], {
        origin: [0.5, 0],
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case "LINK_CABLE_discharge":
      setTimeout(
        () =>
          addAbilitySprite(Ability.DISCHARGE, coordinates, true)?.setScale(2),
        delay
      )
      break

    case "GRASS_HEAL":
      addAbilitySprite("GRASS_HEAL", coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.BOOST_BACK)
      break

    case "FLAME_HIT":
      addAbilitySprite("FLAME_HIT", coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
      break

    case Ability.TORCH_SONG:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 2,
        duration: 500,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break

    case Ability.HIDDEN_POWER_A:
    case Ability.HIDDEN_POWER_B:
    case Ability.HIDDEN_POWER_C:
    case Ability.HIDDEN_POWER_D:
    case Ability.HIDDEN_POWER_E:
    case Ability.HIDDEN_POWER_F:
    case Ability.HIDDEN_POWER_G:
    case Ability.HIDDEN_POWER_H:
    case Ability.HIDDEN_POWER_I:
    case Ability.HIDDEN_POWER_J:
    case Ability.HIDDEN_POWER_K:
    case Ability.HIDDEN_POWER_L:
    case Ability.HIDDEN_POWER_M:
    case Ability.HIDDEN_POWER_N:
    case Ability.HIDDEN_POWER_O:
    case Ability.HIDDEN_POWER_P:
    case Ability.HIDDEN_POWER_Q:
    case Ability.HIDDEN_POWER_R:
    case Ability.HIDDEN_POWER_S:
    case Ability.HIDDEN_POWER_T:
    case Ability.HIDDEN_POWER_U:
    case Ability.HIDDEN_POWER_V:
    case Ability.HIDDEN_POWER_W:
    case Ability.HIDDEN_POWER_X:
    case Ability.HIDDEN_POWER_Y:
    case Ability.HIDDEN_POWER_Z:
    case Ability.HIDDEN_POWER_QM:
    case Ability.HIDDEN_POWER_EM:
      hiddenPowerAnimation(scene, skill, positionX, positionY, flip)
      break

    case Ability.ENTRAINMENT: {
      const target = pokemonsOnBoard.find(
        (pkmUI) => pkmUI.positionX === targetX && pkmUI.positionY === targetY
      )
      if (target) target.emoteAnimation()
      break
    }

    case Ability.TEETER_DANCE:
      pokemonsOnBoard.forEach((pkmUI) => {
        const coordinates = transformEntityCoordinates(
          pkmUI.positionX,
          pkmUI.positionY,
          flip
        )
        addAbilitySprite(skill, coordinates, true)
          ?.setScale(2)
          .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      })
      break

    case Ability.STRUGGLE_BUG:
      addAbilitySprite(Ability.PSYCHIC, coordinates, true)?.setScale(2)
      break

    case Ability.SNIPE_SHOT: {
      const targetAngle = angleBetween(coordinatesTarget, coordinates)
      const finalCoordinates = [
        coordinates[0] + Math.round(Math.cos(targetAngle) * 1000),
        coordinates[1] + Math.round(Math.sin(targetAngle) * 1000)
      ]
      displayTween(
        "SNIPE_SHOT/projectile",
        coordinates,
        finalCoordinates,
        {
          scale: 3,
          duration: 1000,
          rotation: targetAngle - Math.PI / 2
        }
      )

      displayStatic("SNIPE_SHOT/shoot", [
        coordinates[0] + Math.round(Math.cos(targetAngle) * 50),
        coordinates[1] + Math.round(Math.sin(targetAngle) * 50)
      ], 1, { rotation: targetAngle + Math.PI / 2 })
      break
    }

    case "CURSE_EFFECT": {
      const effect = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "status",
        "CURSE_EFFECT/000.png"
      )
      effect.anims.play("CURSE_EFFECT")
      scene.tweens.add({
        targets: effect,
        y: coordinates[1] - 80,
        ease: "linear",
        duration: 1500,
        onComplete: () => {
          effect.destroy()
        }
      })
      break
    }

    case Ability.AURASPHERE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      displayTween(skill, coordinates, finalCoordinates, {
        scale: 2,
        duration: 2000,
        rotation: angleBetween(coordinates, finalCoordinates)
      })
      break
    }

    case Ability.SPIN_OUT: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformEntityCoordinates(
        positionX + dx * 0.5,
        positionY + dy * 0.5,
        flip
      )
      displayStatic(skill, finalCoordinates, 4, {
        rotation: angleBetween(coordinates, finalCoordinates) - Math.PI / 2
      })
      break
    }

    case Ability.ULTRA_THRUSTERS: {
      displayStatic(Ability.LANDS_WRATH, coordinates, 2)

      const [dx, dy] = OrientationVector[orientation]
      const coordinatesThrusters = [
        coordinates[0] + dx * 32,
        coordinates[1] + dy * 32
      ]

      displayTween(Ability.MYSTICAL_FIRE, coordinatesThrusters, coordinatesTarget, {
        scale: 2,
        origin: [0.5, 1],
        duration: 750,
        rotation: angleBetween(coordinates, coordinatesTarget) - Math.PI / 2
      })
      break
    }

    case Ability.AURA_WHEEL:
      displayTween(skill, coordinates, coordinatesTarget, {
        scale: 1,
        duration: 500
      })
      break

    case Ability.PETAL_BLIZZARD:
      addAbilitySprite(skill, coordinates, true)?.setScale(3)
      break

    case Ability.NIGHTMARE:
      addAbilitySprite(skill, coordinates, true)?.setScale(2).setOrigin(0.5, 1)
      break

    case Ability.DARK_HARVEST:
      {
        const darkHarvestGroup = scene.add.group()
        const [x, y] = transformEntityCoordinates(positionX, positionY, flip)

        for (let i = 0; i < 5; i++) {
          const darkHarvestSprite = scene.add
            .sprite(0, 0, "abilities", `${Ability.DARK_HARVEST}/000.png`)
            ?.setScale(2)
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
      }
      break

    case Ability.DECORATE:
      {
        const decorateGroup = scene.add.group()
        const [x, y] = transformEntityCoordinates(targetX, targetY, flip)

        Sweets.forEach((sweet) => {
          const sweetSprite = scene.add
            .sprite(0, 0, "item", `${sweet}.png`)
            ?.setScale(0.3)
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
      }
      break

    case Ability.AQUA_TAIL:
      addAbilitySprite(
        AttackSprite.WATER_MELEE,
        coordinatesTarget,
        true
      )?.setScale(2)
      break

    case "HAIL_PROJECTILE": {
      const specialProjectile = addAbilitySprite(skill, [
        coordinatesTarget[0] + 60,
        coordinatesTarget[1] - 240
      ])?.setScale(1)
      const randomDelay = randomBetween(0, 300)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 800,
        delay: randomDelay,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })

      setTimeout(
        () =>
          addAbilitySprite(
            Ability.SHEER_COLD,
            coordinatesTarget,
            true
          )?.setScale(1),
        800 + randomDelay
      )
      break
    }

    case Ability.RAPID_SPIN:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(1.5)
      break

    case Ability.COTTON_GUARD:
      addAbilitySprite(Ability.COTTON_SPORE, coordinates, true)?.setScale(3)
      break

    case Ability.MAGNET_BOMB: {
      const bomb = addAbilitySprite(skill, coordinates, true)?.setScale(2)
      scene.tweens.add({
        targets: bomb,
        duration: 400,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        onComplete: () => {
          bomb?.destroy()
        }
      })
      break
    }

    case "ELECTRO_SHOT_CHARGE": {
      const charge = addAbilitySprite(
        Ability.MAGNET_BOMB,
        coordinates
      )?.setScale(2)
      scene.tweens.add({
        targets: charge,
        duration: 2000,
        x: coordinates[0],
        y: coordinates[1],
        onComplete: () => {
          charge?.destroy()
        }
      })
      break
    }

    case Ability.ELECTRO_SHOT:
      {
        const shot = addAbilitySprite(skill, coordinates)
          ?.setScale(4)
          .setOrigin(0, 0.5)
          .setRotation(angleBetween(coordinates, coordinatesTarget))

        scene.tweens.add({
          targets: shot,
          duration: 1000,
          x: coordinates[0],
          y: coordinates[1],
          onComplete: () => {
            shot?.destroy()
          }
        })
      }
      break

    case "FLOWER_TRICK_EXPLOSION":
      addAbilitySprite("PUFF_PINK", coordinates, true)?.setScale(3)
      break

    case Ability.FLOWER_TRICK:
      {
        const target = pokemonsOnBoard.find(
          (pkmUI) => pkmUI.positionX === targetX && pkmUI.positionY === targetY
        )
        target?.addFlowerTrick()
      }
      break

    case Ability.GUNK_SHOT: {
      const specialProjectile = addAbilitySprite(skill, coordinates)?.setScale(
        2
      )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        duration: 700,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.SCHOOLING:
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(4)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.STONE_AXE:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.CRUSH_CLAW:
    case Ability.METAL_CLAW:
      addAbilitySprite(Ability.CRUSH_CLAW, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.DRAGON_CLAW:
      addAbilitySprite(Ability.DRAGON_CLAW, coordinatesTarget, true)?.setScale(
        1
      )
      break

    case Ability.EARTHQUAKE:
      addAbilitySprite(skill, coordinates, true)?.setScale(3)
      scene.shakeCamera(350, 0.01)
      break

    case Ability.OCTAZOOKA:
      addAbilitySprite(Ability.SMOKE_SCREEN, coordinatesTarget, true)?.setScale(
        3
      )
      break

    case Ability.WOOD_HAMMER:
      addAbilitySprite(skill, coordinatesTarget, true)
        ?.setScale(1)
        .setOrigin(0.5, 1)
      break

    case Ability.TRICK_OR_TREAT:
      addAbilitySprite(skill, coordinatesTarget, true)
        ?.setScale(2)
        .setOrigin(0.5, 1)
      break

    case Ability.INFESTATION:
      {
        if (positionY === 8 || positionY === 0) {
          const duration =
            distanceM(positionX, positionY, targetX, targetY) * 150
          const projectile = addAbilitySprite(
            "HEAL_ORDER",
            coordinates,
            true
          )?.setScale(3)

          scene.tweens.add({
            targets: projectile,
            x: coordinatesTarget[0],
            y: coordinatesTarget[1],
            ease: "linear",
            yoyo: false,
            duration: duration,
            onComplete: () => {
              projectile?.destroy()
            }
          })
        } else {
          addAbilitySprite("ATTACK_ORDER", coordinatesTarget, true)?.setScale(2)
        }
      }
      break

    case "GROUND_GROW":
      addAbilitySprite(skill, coordinates, true)?.setScale(1.5)
      break

    case Ability.HEADBUTT:
      addAbilitySprite("FIGHTING_KNOCKBACK", coordinatesTarget, true)?.setScale(
        2
      )
      break

    case "FISHING":
      addAbilitySprite(Ability.DIVE, coordinates, true)
        ?.setScale(1)
        .setOrigin(0.5, -1)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
      break

    case "SPAWN":
      addAbilitySprite("SPAWN", coordinates, true)
        ?.setScale(2)
        .setOrigin(0.5, -0.5)
        .setDepth(DEPTH.BOOST_BACK)
      break

    case "EVOLUTION":
      addAbilitySprite("EVOLUTION", coordinates, true)
        ?.setScale(2)
        .setOrigin(0.5, 0.4)
        .setDepth(DEPTH.BOOST_BACK)
      break

    case "HATCH":
      addAbilitySprite("SOFT_BOILED", coordinates, true)
        ?.setScale(2)
        .setOrigin(0.5, 0.4)
        .setDepth(DEPTH.BOOST_BACK)
      break

    case "FLYING_TAKEOFF":
      addAbilitySprite("FLYING_TAKEOFF", coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case "FLYING_SKYDIVE":
      {
        const startCoords = transformEntityCoordinates(targetX, 9, false)
        const specialProjectile = addAbilitySprite(
          skill,
          startCoords
        )?.setScale(2)
        scene.tweens.add({
          targets: specialProjectile,
          x: coordinatesTarget[0],
          y: coordinatesTarget[1],
          ease: "linear",
          duration: 500,
          onComplete: () => {
            specialProjectile?.destroy()
          }
        })
      }
      break

    case "TIDAL_WAVE":
      {
        const down = orientation === (flip ? Orientation.UP : Orientation.DOWN)
        const startCoords = transformEntityCoordinates(3.6, -4, down)
        const endCoords = transformEntityCoordinates(3.6, 10, down)
        const wave = scene.add
          .sprite(
            startCoords[0],
            startCoords[1],
            "abilities",
            `TIDAL_WAVE/00${targetY}.png`
          )
          .setOrigin(0.5, 0.5)
          .setDepth(DEPTH.ABILITY_MINOR)
          ?.setScale(3)
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
      break

    case Ability.PURIFY:
      addAbilitySprite(Ability.SMOG, coordinatesTarget, true)?.setScale(1)
      addAbilitySprite(Ability.MUD_BUBBLE, coordinates, true)?.setScale(1)
      break

    case Ability.PSYCHO_SHIFT:
      {
        const pkmSprite = addAbilitySprite(
          Ability.PRESENT,
          coordinates
        )?.setScale(2)

        if (targetX !== undefined && targetY !== undefined) {
          const targetSprite = addAbilitySprite(
            Ability.PRESENT,
            coordinatesTarget
          )?.setScale(2)

          scene.tweens.add({
            targets: pkmSprite,
            x: coordinatesTarget[0],
            y: coordinatesTarget[1],
            ease: "linear",
            duration: 300,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
              pkmSprite?.destroy()
            }
          })

          scene.tweens.add({
            targets: targetSprite,
            x: coordinates[0],
            y: coordinates[1],
            ease: "linear",
            duration: 300,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
              targetSprite?.destroy()
            }
          })
        }
      }
      break

    case Ability.GLAIVE_RUSH: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        ?.setScale(3)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setRotation(angleBetween(coordinates, coordinatesTarget) - Math.PI / 2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.STEEL_WING:
      addAbilitySprite(Ability.STEEL_WING, coordinates, true)?.setScale(2)
      break

    case Ability.FOUL_PLAY:
      addAbilitySprite(Ability.NIGHT_SLASH, coordinatesTarget, true)?.setScale(
        2
      )
      break

    case Ability.WONDER_ROOM:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(4)
      break

    case Ability.DOUBLE_IRON_BASH:
      addAbilitySprite(Ability.DRAIN_PUNCH, coordinatesTarget, true)?.setScale(
        2
      )
      break

    case Ability.STONE_EDGE:
      addAbilitySprite(Ability.TORMENT, coordinates, true)?.setScale(2)
      break

    case Ability.THUNDER_CAGE:
      addAbilitySprite(Ability.THUNDER_CAGE, coordinatesTarget, true)?.setScale(
        2
      )
      break

    case Ability.MAGNET_PULL:
      addAbilitySprite(Ability.THUNDER_CAGE, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.BIDE:
      addAbilitySprite(Ability.COUNTER, coordinates, true)?.setScale(3)
      break

    case Ability.SHORE_UP:
      addAbilitySprite(Ability.EARTHQUAKE, coordinates, true)?.setScale(2)
      break

    case Ability.BONE_ARMOR: {
      const startCoords = transformEntityCoordinates(targetX, targetY, flip)
      Object.values(Orientation).forEach((o) => {
        const [dx, dy] = OrientationVector[o]
        const finalCoords = transformEntityCoordinates(
          positionX + dx * 1,
          positionY + dy * 1,
          flip
        )
        const specialProjectile = addAbilitySprite(
          Ability.BONEMERANG,
          startCoords
        )?.setScale(2)
        scene.tweens.add({
          targets: specialProjectile,
          x: finalCoords[0],
          y: finalCoords[1],
          yoyo: false,
          duration: 1000,
          onComplete: () => {
            specialProjectile?.destroy()
          }
        })
      })
      break
    }

    case Ability.FIRESTARTER: {
      const abilitySprite = addAbilitySprite(skill, [
        coordinatesTarget[0],
        coordinatesTarget[1] - 25
      ])?.setScale(2)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1] + 25,
        ease: "linear",
        duration: 800,
        onComplete: () => {
          abilitySprite?.destroy()
        }
      })
      break
    }

    case Ability.DARK_LARIAT: {
      const abilitySprite = addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500
      })
      break
    }

    case Ability.BOLT_BEAK: {
      const abilitySprite = addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 250
      })
      break
    }

    case Ability.FREEZE_DRY: {
      const abilitySprite = addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 250
      })
      break
    }

    case Ability.DRAGON_PULSE: {
      const abilitySprite = addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        scaleX: 4,
        scaleY: 4
      })
      break
    }

    case Ability.DRUM_BEATING:
      addAbilitySprite(
        Ability.DRUM_BEATING,
        [coordinates[0] - 20, coordinates[1] - 40],
        true
      )
        ?.setScale(2)
        .setAngle(-45)
      break

    case Ability.BRICK_BREAK:
    case Ability.BULK_UP:
    case Ability.FLASH:
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.TAUNT:
      addAbilitySprite(
        skill,
        [coordinates[0], coordinates[1] - 30],
        true
      )?.setScale(2)
      break

    case "TAUNT_HIT":
      addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 30],
        true
      )?.setScale(2)
      break

    case "SMOKE_BALL":
      addAbilitySprite(skill, coordinates, true)?.setScale(3)
      break

    case "FOSSIL_RESURRECT":
      addAbilitySprite(skill, coordinates, true)?.setScale(2)
      break

    case Ability.RETALIATE:
      addAbilitySprite(skill, coordinatesTarget, true)?.setScale(2)
      break

    case Ability.TAILWIND: {
      const angle = angleBetween(coordinates, coordinatesTarget)
      addAbilitySprite(skill, coordinates, true)
        ?.setScale(2)
        .setRotation(angle - Math.PI / 2)
      break
    }

    case Ability.STRENGTH: {
      const specialProjectile = addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 150],
        true
      )?.setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        y: coordinatesTarget[1],
        ease: Phaser.Math.Easing.Quadratic.In,
        duration: 450
      })
      break
    }

    case Ability.SURF: {
      const angle = angleBetween(coordinates, coordinatesTarget)
      const specialProjectile = addAbilitySprite(skill, coordinates)
        ?.setScale(2)
        .setRotation(angle - (3 / 4) * Math.PI)

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 600,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.COLUMN_CRUSH: {
      const distance = distanceE(
        coordinates[0],
        coordinates[1],
        coordinatesTarget[0],
        coordinatesTarget[1]
      )
      const pillarType =
        [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE][orientation] ??
        Pkm.PILLAR_WOOD
      const animKey = `${PkmIndex[pillarType]}/${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}/${Orientation.DOWN}`
      const specialProjectile = addAbilitySprite(
        animKey,
        coordinates
      )?.setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        angle: 270,
        ease: "linear",
        duration: distance * 2,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.MALIGNANT_CHAIN: {
      const angle = angleBetween(coordinates, coordinatesTarget)
      const distance = distanceE(
        coordinates[0],
        coordinates[1],
        coordinatesTarget[0],
        coordinatesTarget[1]
      )
      const specialProjectile = addAbilitySprite(skill, coordinates)
        ?.setScale(1, 0)
        .setOrigin(0.5, 0)
        .setRotation(angle - Math.PI / 2)

      scene.tweens.add({
        targets: specialProjectile,
        scaleY: distance / 80,
        ease: "linear",
        duration: 600,
        onComplete: () => {
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.ICICLE_MISSILE: {
      const specialProjectile = addAbilitySprite(skill, coordinates)?.setScale(
        2
      )
      const dx = delay === 1 ? -3 : delay === 2 ? +3 : 0
      const topCoords = transformEntityCoordinates(
        targetX + dx,
        positionY + 5,
        false
      )
      const angle1 = angleBetween(coordinates, topCoords) - Math.PI / 2
      const angle2 = angleBetween(topCoords, coordinatesTarget) - Math.PI / 2
      specialProjectile?.setRotation(angle1)

      scene.tweens.chain({
        targets: specialProjectile,
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
          specialProjectile?.destroy()
        }
      })
      break
    }

    case Ability.ARM_THRUST: {
      for (let i = 0; i < (delay ?? 2); i++) {
        setTimeout(() => {
          const anim = addAbilitySprite(
            Ability.BRICK_BREAK,
            [
              coordinatesTarget[0] + randomBetween(-30, 30),
              coordinatesTarget[1] + randomBetween(-30, 30)
            ],
            true
          )
          scene.tweens.add({
            targets: anim,
            alpha: 0,
            ease: "linear",
            onComplete: () => {
              anim?.destroy()
            }
          })
        }, i * 250)
      }
      break
    }

    case "PARTING_SHOT": {
      setTimeout(() => {
        const anim = addAbilitySprite(skill, coordinates, true)
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

      break
    }

    default:
      break
  }
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

export function hiddenPowerAnimation(
  scene: GameScene | DebugScene,
  skill: Ability,
  originX: number,
  originY: number,
  flip: boolean
) {
  const [x, y] = transformEntityCoordinates(originX, originY, flip)
  const unownsGroup = scene.add.group()
  const letters = UNOWNS_PER_ABILITY.get(skill)
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
