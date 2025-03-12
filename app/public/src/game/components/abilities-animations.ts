import { Geom } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AttackSprite } from "../../../../types"
import { AnimationType } from "../../../../types/Animation"
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
import {
  OrientationArray,
  OrientationVector
} from "../../../../utils/orientation"
import { randomBetween } from "../../../../utils/random"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import { DebugScene } from "../scenes/debug-scene"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { UNOWNS_PER_ABILITY } from "./unown-manager"
import { DEPTH } from "../depths"

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
  const coordinates = transformAttackCoordinate(positionX, positionY, flip)
  const coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)

  function addAbilitySprite(
    skill: Ability | string,
    coordinates: number[],
    destroyOnComplete?: boolean
  ) {
    const abilityFx = scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "abilities",
      skill + `/000.png`
    )
    abilityFx.setOrigin(0.5, 0.5).setDepth(DEPTH.ABILITY).play(skill)
    if (destroyOnComplete) {
      abilityFx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        abilityFx.destroy()
      })
    }
    return abilityFx
  }

  switch (skill) {
    case Ability.FIRE_BLAST:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.FIERY_DANCE:
      addAbilitySprite(Ability.FIRE_BLAST, coordinatesTarget, true).setScale(2)
      break

    case Ability.FIRE_SPIN:
      addAbilitySprite(Ability.MAGMA_STORM, coordinatesTarget, true).setScale(2)
      break

    case Ability.CRABHAMMER:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DIAMOND_STORM:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.DRACO_ENERGY:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DYNAMAX_CANNON:
    case Ability.MOONGEIST_BEAM:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setOrigin(0.5, 0)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break

    case Ability.FREEZING_GLARE:
      addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)
        .setScale(2)
        .setOrigin(0.5, 0.98)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.BLOOD_MOON: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = [
        coordinates[0] + dx * 16,
        coordinates[1] - dy * 16 - 24
      ]
      addAbilitySprite(Ability.DYNAMAX_CANNON, finalCoordinates, true)
        .setScale(2)
        .setTint(0xff5060)
        .setOrigin(0.5, 0)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      addAbilitySprite("COSMIC_POWER", coordinates, true)
        .setTint(0xff5060)
        .setOrigin(0.5, 1)
        .setScale(2)
      break
    }

    case Ability.DYNAMIC_PUNCH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.ELECTRO_WEB:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.MYSTICAL_FIRE:
      addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 25],
        true
      ).setScale(2)
      break

    case Ability.FLAME_CHARGE:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setOrigin(1, 1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.PASTEL_VEIL:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setOrigin(1, 1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) + Math.PI
        )
      break

    case Ability.AQUA_JET:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break

    case Ability.EXTREME_SPEED:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.PSYSHIELD_BASH:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.POWER_WHIP:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "POWER_WHIP/hit":
      addAbilitySprite("POWER_WHIP/hit", coordinates, true).setScale(3)
      break

    case Ability.LANDS_WRATH:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "LANDS_WRATH/hit":
      addAbilitySprite("LANDS_WRATH/hit", coordinates, true).setScale(2)
      break

    case Ability.CORE_ENFORCER:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "CORE_ENFORCER/hit":
      addAbilitySprite("CORE_ENFORCER/hit", coordinates, true).setScale(3)
      break

    case Ability.LEECH_SEED:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.LOCK_ON:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.PSYCH_UP:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.MAGIC_POWDER:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.SALT_CURE:
      addAbilitySprite(Ability.MAGIC_POWDER, coordinates, true)
        .setScale(2)
        .setTint(0xb0ff80)
      break

    case Ability.SPICY_EXTRACT:
      addAbilitySprite(Ability.MAGIC_POWDER, coordinates, true)
        .setScale(3)
        .setTint(0xff9000)
      break

    case Ability.SWEET_SCENT:
      addAbilitySprite(Ability.MAGIC_POWDER, coordinates, true)
        .setScale(3)
        .setTint(0xffc0c0)
      break

    case Ability.RAZOR_WIND:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.TWISTING_NETHER:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(4)
        .setOrigin(0.5)
      break

    case Ability.DARK_VOID:
      addAbilitySprite(
        Ability.TWISTING_NETHER,
        coordinatesTarget,
        true
      ).setScale(4)
      break

    case Ability.WHEEL_OF_FIRE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        yoyo: true,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.INFERNAL_PARADE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        yoyo: true,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.BLUE_FLARE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.GLACIATE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1350,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SHADOW_BALL: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.FUSION_BOLT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ICY_WIND: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )

      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SOLAR_BEAM: {
      const specialProjectile = addAbilitySprite(
        skill,
        transformAttackCoordinate(targetX, targetY - 3, flip)
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ORIGIN_PULSE: {
      const startCoords = transformAttackCoordinate(0, targetY, flip)
      const finalCoords = transformAttackCoordinate(8, targetY, flip)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(4)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SPACIAL_REND: {
      const coords = transformAttackCoordinate(4, targetY, flip)
      addAbilitySprite(skill, coords, true).setScale(4)
      break
    }

    case Ability.SEED_FLARE:
      addAbilitySprite(skill, coordinates, true).setScale(3, 3)
      break

    case Ability.MULTI_ATTACK:
      addAbilitySprite(skill, coordinates, true).setScale(4)
      break

    case Ability.SEISMIC_TOSS:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.GUILLOTINE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.ROCK_SLIDE:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 0.9)
      break

    case Ability.FLAMETHROWER:
      addAbilitySprite(skill, coordinates, true)
        .setOrigin(0.5, 1)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.FIERY_WRATH:
      addAbilitySprite(Ability.FLAMETHROWER, coordinates, true)
        .setScale(2)
        .setTint(0xc000c0)
      break

    case Ability.PSYBEAM:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.THUNDER_SHOCK:
      addAbilitySprite(Ability.THUNDER, coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 1)
      break

    case Ability.HYDRO_PUMP:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.SWALLOW:
      addAbilitySprite(Ability.HYDRO_PUMP, coordinates, true)
        .setScale(2)
        .setTint(0x60ff60)
        .setOrigin(0.5, 1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
      break

    case Ability.DRACO_METEOR:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setOrigin(0.5, 0.9)
        .setScale(2)
      break

    case Ability.BLAZE_KICK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.WISH:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.LUNAR_BLESSING:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.CALM_MIND:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.GRAVITY:
      addAbilitySprite(Ability.CALM_MIND, coordinates, true)
        .setScale(3)
        .setTint(0xccff33)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
      break

    case Ability.COSMIC_POWER_MOON:
      addAbilitySprite("COSMIC_POWER", coordinates, true)
        .setTint(0xccb0ff)
        .setOrigin(0.5, 1)
        .setScale(2)
      break

    case Ability.COSMIC_POWER_SUN:
      addAbilitySprite("COSMIC_POWER", coordinates, true)
        .setTint(0xffffd0)
        .setOrigin(0.5, 1)
        .setScale(2)
      break

    case Ability.FORECAST:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(2)
      break

    case Ability.CHATTER:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.DEFENSE_CURL:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.RECOVER:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.METRONOME:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.SOAK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.IRON_TAIL:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.BLAST_BURN:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.CHARGE:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setOrigin(0.5, 0.8)
        .setScale(4)
      break

    case Ability.DISCHARGE:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.OVERDRIVE:
      addAbilitySprite(skill, coordinates, true).setOrigin(0.5).setScale(2)
      break

    case Ability.SMOG:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_MINOR)
        .setScale(4)
      break

    case Ability.SLUDGE:
      addAbilitySprite(Ability.SMOG, coordinatesTarget, true)
        .setScale(3, 3)
        .setTint(0xa0c020)
      break

    case Ability.BITE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.CRUNCH:
      addAbilitySprite(Ability.BITE, coordinatesTarget, true).setScale(3)
      break

    case Ability.DRAGON_TAIL:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DRAGON_BREATH: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 1.5,
        positionY + dy * 1.5,
        flip
      )

      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.FROST_BREATH:
      addAbilitySprite(skill, [coordinates[0], coordinates[1] - 30], true)
        .setOrigin(-0.1, 0.5)
        .setScale(4)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          )
        )
      break

    case Ability.ICICLE_CRASH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.ROOT:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.TORMENT:
    case Ability.RAGE:
      addAbilitySprite(
        Ability.TORMENT,
        [coordinates[0], coordinates[1] - 50],
        true
      ).setScale(2)
      break

    case Ability.STOMP:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.PAYBACK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.NIGHT_SLASH:
    case Ability.KOWTOW_CLEAVE:
      addAbilitySprite(Ability.NIGHT_SLASH, coordinatesTarget, true).setScale(2)
      break

    case Ability.BUG_BUZZ:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.VENOSHOCK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FELL_STINGER:
      addAbilitySprite(Ability.VENOSHOCK, coordinatesTarget, true).setScale(2)
      break

    case Ability.LEECH_LIFE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.HAPPY_HOUR:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.TELEPORT:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.NASTY_PLOT:
      addAbilitySprite(
        skill,
        [coordinates[0], coordinates[1] - 50],
        true
      ).setScale(2)
      break

    case Ability.THIEF:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.STUN_SPORE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.HURRICANE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ROAR: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(
        Ability.WHIRLWIND,
        coordinates
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.FLEUR_CANNON: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SANDSEAR_STORM:
    case Ability.WILDBOLT_STORM:
    case Ability.BLEAKWIND_STORM:
    case Ability.SPRINGTIDE_STORM: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ROAR_OF_TIME:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.ROCK_TOMB:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setOrigin(0.5, 0.9)
        .setScale(1)
      break

    case Ability.ILLUSION:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.SLACK_OFF:
      addAbilitySprite(Ability.ILLUSION, coordinates, true).setScale(1)
      break

    case Ability.ROCK_SMASH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.LIQUIDATION:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FISHIOUS_REND:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break

    case Ability.CUT:
      addAbilitySprite(Ability.FISHIOUS_REND, coordinates, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.GOLD_RUSH:
    case Ability.MAKE_IT_RAIN: {
      const specialProjectile = addAbilitySprite(
        Ability.GOLD_RUSH,
        coordinates
      ).setScale(skill === Ability.MAKE_IT_RAIN ? 3 : 2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.MUD_SHOT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(4)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 350,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.POLTERGEIST: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ZAP_CANNON: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SPARKLING_ARIA: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SKY_ATTACK: {
      const startCoords = transformAttackCoordinate(targetX, 9, false)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(
        1.5
      )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SKY_ATTACK_SHADOW: {
      const startCoords = transformAttackCoordinate(targetX, 9, false)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(
        1.5
      )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.FLYING_PRESS: {
      const startCoords = transformAttackCoordinate(targetX, 9, false)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite(Ability.HEAVY_SLAM, coordinatesTarget, true)
        }
      })
      break
    }

    case Ability.SUNSTEEL_STRIKE: {
      const startCoords = transformAttackCoordinate(targetX, 9, false)
      const specialProjectile = addAbilitySprite(skill, startCoords)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case "COMET_CRASH": {
      const startCoords = transformAttackCoordinate(targetX, 9, false)
      const specialProjectile = addAbilitySprite(
        Ability.SUNSTEEL_STRIKE,
        startCoords
      )
        .setScale(0.5)
        .setTint(0x2020ff)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ACROBATICS: {
      const startCoords = transformAttackCoordinate(
        targetX + 1,
        targetY + 1,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 300,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ROLLOUT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ICE_BALL: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: (8 * 1000) / 15,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PRESENT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.TOPSY_TURVY: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.WHIRLWIND: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.EMPTY_LIGHT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.WATER_PULSE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.GRAV_APPLE: {
      const aboveTargetCoordinates = transformAttackCoordinate(
        targetX,
        targetY,
        flip
      )
      aboveTargetCoordinates[1] -= 400
      const apple = addAbilitySprite(
        "NUTRIENTS",
        aboveTargetCoordinates
      ).setScale(3)
      scene.tweens.add({
        targets: apple,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 400,
        onComplete: () => {
          apple.destroy()
          addAbilitySprite("PUFF_RED", coordinatesTarget, true).setScale(2)
        }
      })
      break
    }

    case Ability.NUTRIENTS: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 400,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite("PUFF_GREEN", coordinatesTarget, true).setScale(2)
        }
      })
      break
    }

    case Ability.SYRUP_BOMB: {
      const specialProjectile = addAbilitySprite(
        "NUTRIENTS",
        coordinates
      ).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 400,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite("PUFF_RED", coordinatesTarget, true).setScale(2)
        }
      })
      break
    }

    case Ability.APPLE_ACID: {
      const specialProjectile = addAbilitySprite(
        "NUTRIENTS",
        coordinates
      ).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 400,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite("PUFF_RED", coordinatesTarget, true).setScale(2)
        }
      })
      break
    }

    case Ability.FICKLE_BEAM: {
      const specialProjectile = addAbilitySprite(
        Ability.FICKLE_BEAM,
        coordinates
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 400,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.POLLEN_PUFF: {
      const specialProjectile = addAbilitySprite(
        Ability.HEAL_ORDER,
        coordinates
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PSYSTRIKE: {
      const specialProjectile = addAbilitySprite(
        Ability.PSYSTRIKE,
        coordinates
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.EGGSPLOSION: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SPARK: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 300,
        delay: (delay || 0) * 400,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PAYDAY:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      addAbilitySprite(Ability.FACADE, coordinatesTarget, true).setScale(1)
      break

    case Ability.AIR_SLASH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DREAM_EATER:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.VINE_WHIP:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.VOLT_SWITCH:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setOrigin(0.5, 0)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break

    case Ability.MUDDY_WATER:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 1)
      break

    case Ability.ANCIENT_POWER: {
      const rock = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: rock,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          rock.destroy()
        }
      })
      break
    }

    case Ability.MOON_DREAM: {
      const aboveTargetCoordinates = transformAttackCoordinate(
        positionX,
        positionY,
        flip
      )
      aboveTargetCoordinates[1] -= 100
      const moon = addAbilitySprite(skill, aboveTargetCoordinates).setScale(1.5)
      scene.tweens.add({
        targets: moon,
        scale: 0.5,
        x: coordinates[0],
        y: coordinates[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          moon.destroy()
        }
      })
      break
    }

    case Ability.FAIRY_LOCK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(1)
      break

    case Ability.STEAM_ERUPTION:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SEARING_SHOT:
      addAbilitySprite(Ability.STEAM_ERUPTION, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(3, 3)
      break

    case Ability.POWER_HUG:
      addAbilitySprite(Ability.ANCHOR_SHOT, coordinatesTarget, true).setScale(2)
      break

    case Ability.BURN_UP:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.IVY_CUDGEL:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.PSYCHO_BOOST:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.HEAVY_SLAM:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.FACADE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FAKE_OUT:
      addAbilitySprite(Ability.FACADE, coordinates, true).setScale(2)
      break

    case Ability.ICE_HAMMER:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.MANTIS_BLADES:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.PSYCHIC_FANGS:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.THUNDER_FANG:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.ICE_FANG:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FIRE_FANG:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.POPULATION_BOMB:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SCREECH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SAND_TOMB:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.MAGICAL_LEAF: {
      addAbilitySprite("MAGICAL_LEAF_CHARGE", coordinates, true).setScale(2)
      const leaf = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: leaf,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          leaf.destroy()
        }
      })
      break
    }

    case Ability.SHIELDS_DOWN:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SHIELDS_UP:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.BRAVE_BIRD:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.AQUA_RING:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.NATURAL_GIFT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.NIGHT_SHADE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ASSURANCE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.CRUSH_GRIP:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FISSURE: {
      const specialProjectile = addAbilitySprite(
        skill,
        coordinatesTarget
      ).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        scaleX: 3,
        scaleY: 3,
        yoyo: true,
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.CLOSE_COMBAT:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.SUPER_FANG:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.PARABOLIC_CHARGE: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PLAY_ROUGH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.ATTRACT:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.MAGNET_RISE:
      addAbilitySprite(Ability.ELECTRO_BOOST, coordinates, true).setScale(2)
      break

    case Ability.ANCHOR_SHOT:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.FORCE_PALM:
      addAbilitySprite(Ability.ANCHOR_SHOT, coordinatesTarget, true).setScale(2)
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
            .setScale(1)
            .setRotation(-Math.PI / 2)
            .setTint(0xc080ff)
        }, i * 150)
      }
      break
    }

    case Ability.FLORAL_HEALING:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.LEAF_BLADE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.WATERFALL:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      break

    case Ability.HELPING_HAND:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.MUD_BUBBLE:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.ERUPTION: {
      const startCoords = transformAttackCoordinate(
        targetX + 3,
        targetY + 3,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, startCoords)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.THOUSAND_ARROWS: {
      const specialProjectile = addAbilitySprite(skill, [
        coordinatesTarget[0],
        BOARD_HEIGHT - 1
      ]).setScale(4)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 300,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SLASHING_CLAW:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.MAGMA_STORM:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(1)
      break

    case Ability.THRASH:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.ABSORB:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        .setScale(2)
      break

    case Ability.GIGATON_HAMMER:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.COUNTER:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.HEX:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SPECTRAL_THIEF:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.PLASMA_FIST:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SACRED_SWORD_IRON:
      addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 0.2)
        .setRotation(Math.PI)
      break

    case Ability.SACRED_SWORD_GRASS:
      addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 0.2)
        .setRotation(Math.PI)
        .setTint(0xb0ffa0)
      break

    case Ability.SACRED_SWORD_CAVERN:
      addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)
        .setScale(2)
        .setOrigin(0.5, 0.2)
        .setRotation(Math.PI)
        .setTint(0xe0c0a0)
      break

    case Ability.SECRET_SWORD: {
      const specialProjectile = addAbilitySprite(
        "SACRED_SWORD",
        [coordinatesTarget[0], coordinatesTarget[1] - 30],
        true
      )
        .setScale(2)
        .setOrigin(0.5, 0.5)
        .setTint(0xfff0b0)
      scene.tweens.add({
        targets: specialProjectile,
        angle: 540,
        duration: 400
      })
      break
    }

    case Ability.METAL_BURST:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.JUDGEMENT:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setOrigin(0.5, 1)
        .setScale(2)
      break

    case Ability.SHADOW_SNEAK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DIVE:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.SMOKE_SCREEN:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.BARB_BARRAGE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.OUTRAGE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.KNOCK_OFF:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SLASH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.HYPER_VOICE: {
      const startCoords = transformAttackCoordinate(0, targetY, flip)
      const finalCoords = transformAttackCoordinate(8, targetY, flip)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SHADOW_CLONE:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.ECHO:
      addAbilitySprite(skill, coordinates, true).setOrigin(0.5, 0.7).setScale(2)
      break

    case Ability.EXPLOSION:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.CHLOROBLAST:
      addAbilitySprite(Ability.EXPLOSION, coordinates, true)
        .setScale(2)
        .setTint(0x90ffd0)
      break

    case Ability.CLANGOROUS_SOUL:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.GROWL:
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break

    case Ability.FAIRY_WIND:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.RELIC_SONG:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.HIGH_JUMP_KICK:
    case Ability.LUNGE:
      addAbilitySprite(
        Ability.HIGH_JUMP_KICK,
        coordinatesTarget,
        true
      ).setScale(2)
      break

    case Ability.TROP_KICK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SHELL_TRAP:
      addAbilitySprite(Ability.COUNTER, coordinates, true).setScale(2)
      break

    case Ability.SHELL_SMASH:
      addAbilitySprite(Ability.COUNTER, coordinates, true).setScale(2)
      break

    case Ability.TRI_ATTACK: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PSYCHIC: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(3)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PYRO_BALL: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 500,
        scale: 2,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SLUDGE_WAVE: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 800,
        scale: 2,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite(Ability.DIVE, coordinatesTarget, true)
            .setTint(0xf060a0)
            .setScale(3)
            .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        }
      })
      break
    }

    case Ability.LAVA_PLUME: {
      const specialProjectile = addAbilitySprite(
        Ability.SLUDGE_WAVE,
        coordinates
      )
        .setScale(1)
        .setTint(0xffc020)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 800,
        scale: 2,
        onComplete: () => {
          specialProjectile.destroy()
          addAbilitySprite("FLAME_HIT", coordinatesTarget, true).setScale(2)
        }
      })
      break
    }

    case Ability.WHIRLPOOL: {
      for (let i = 0; i < 4; i++) {
        const whirlpool = addAbilitySprite(skill, coordinates)
        scene.tweens.add({
          targets: whirlpool,
          x: coordinatesTarget[0],
          y: coordinatesTarget[1],
          duration: 1000,
          scale: 2,
          delay: i * 100,
          ease: "Power1",
          onComplete: () => {
            whirlpool.destroy()
          }
        })
      }
      break
    }

    case Ability.BONEMERANG: {
      const startCoords = transformAttackCoordinate(positionX, positionY, flip)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformAttackCoordinate(
        positionX + dx * 5,
        positionY + dy * 5,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SHADOW_BONE: {
      const startCoords = transformAttackCoordinate(positionX, positionY, flip)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformAttackCoordinate(
        positionX + dx * 5,
        positionY + dy * 5,
        flip
      )
      const specialProjectile = addAbilitySprite(
        Ability.BONEMERANG,
        startCoords
      )
        .setTint(0x301030)
        .setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.PRISMATIC_LASER: {
      const startCoords = transformAttackCoordinate(positionX, 0, flip)
      const finalCoords = transformAttackCoordinate(positionX, 6, flip)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(5)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case "GULP_MISSILE/pikachu": {
      const duration = distanceM(positionX, positionY, targetX, targetY) * 150

      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: duration,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case "GULP_MISSILE/arrokuda": {
      const duration = distanceM(positionX, positionY, targetX, targetY) * 150

      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: duration,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.AURORA_BEAM: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        ease: "linear",
        yoyo: false,
        duration: 1500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SONG_OF_DESIRE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.CONFUSING_MIND:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.DOUBLE_SHOCK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.MIND_BLOWN:
      addAbilitySprite(skill, coordinates, true).setOrigin(0.5, 0.8).setScale(2)
      addAbilitySprite("MIND_BLOWN/hit", coordinatesTarget, true).setScale(3)
      break

    case Ability.FIRE_LASH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(4)
      break

    case Ability.DRAIN_PUNCH:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SOFT_BOILED:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.FAKE_TEARS:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.TEA_TIME:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.DRAGON_DARTS: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SPIRIT_SHACKLE: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          )
        )

      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )

      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })

      break
    }

    case Ability.ASTRAL_BARRAGE: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) - Math.PI
        )

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })

      break
    }

    case Ability.WATER_SHURIKEN: {
      const orientations = [
        orientation,
        OrientationArray[(OrientationArray.indexOf(orientation) + 1) % 8],
        OrientationArray[(OrientationArray.indexOf(orientation) + 7) % 8]
      ]
      orientations.forEach((orientation) => {
        const [dx, dy] = OrientationVector[orientation]
        const finalCoordinates = transformAttackCoordinate(
          positionX + dx * 8,
          positionY + dy * 8,
          flip
        )
        const projectile = addAbilitySprite(skill, coordinates).setScale(2)
        scene.tweens.add({
          targets: projectile,
          x: finalCoordinates[0],
          y: finalCoordinates[1],
          ease: "linear",
          yoyo: false,
          duration: 2000,
          onComplete: () => {
            projectile.destroy()
          }
        })
      })
      break
    }

    case Ability.SPIKE_ARMOR:
      OrientationArray.forEach((orientation) => {
        const [dx, dy] = OrientationVector[orientation]
        const finalCoordinates = transformAttackCoordinate(
          positionX + dx * 8,
          positionY + dy * 8,
          flip
        )
        const spike = addAbilitySprite("SPIKE", coordinates).setRotation(
          Math.atan2(
            finalCoordinates[1] - coordinates[1],
            finalCoordinates[0] - coordinates[0]
          ) +
            Math.PI / 2
        )
        scene.tweens.add({
          targets: spike,
          x: finalCoordinates[0],
          y: finalCoordinates[1],
          ease: "linear",
          duration: 1000,
          onComplete: () => {
            spike.destroy()
          }
        })
      })
      break

    case Ability.MACH_PUNCH:
    case Ability.UPPERCUT: {
      const specialProjectile = addAbilitySprite(
        "FIGHTING/FIST",
        coordinatesTarget
      ).setScale(0.25)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 3,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.MAWASHI_GERI:
    case Ability.THUNDEROUS_KICK: {
      const specialProjectile = addAbilitySprite(
        "FIGHTING/FOOT",
        coordinatesTarget
      ).setScale(0.25)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 3,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
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
          ]).setScale(1.5)
          setTimeout(() => projectile.destroy(), 500)
        }, i * 250)
      }
      break

    case Ability.STRING_SHOT: {
      const specialProjectile = addAbilitySprite(
        skill,
        coordinatesTarget
      ).setScale(0.25)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 2,
        alpha: 0.9,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.ENTANGLING_THREAD: {
      const specialProjectile = addAbilitySprite("STRING_SHOT", coordinates)
        .setScale(0.25)
        .setTint(0x80a080)
      scene.tweens.add({
        targets: specialProjectile,
        scale: 3,
        alpha: 0.9,
        ease: Phaser.Math.Easing.Cubic.Out,
        yoyo: false,
        duration: 1200,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.WONDER_GUARD:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(2)
      break

    case Ability.X_SCISSOR:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DEATH_WING:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.GEOMANCY:
      addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        .setScale(2)
      break

    case Ability.BLIZZARD:
      addAbilitySprite(Ability.BLIZZARD, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(2)
      break

    case Ability.OVERHEAT:
      addAbilitySprite(Ability.FIRE_BLAST, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(3)
      break

    case Ability.MIST_BALL: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformAttackCoordinate(
        positionX + dx * 4,
        positionY + dy * 4,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.LUSTER_PURGE: {
      const [dx, dy] = OrientationVector[orientation]
      const finalCoords = transformAttackCoordinate(
        positionX + dx * 5,
        positionY + dy * 5,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoords[0],
        y: finalCoords[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.AERIAL_ACE: {
      const startCoords = transformAttackCoordinate(targetX, 8, false)
      const specialProjectile = addAbilitySprite(skill, startCoords).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.STEALTH_ROCKS:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        .setScale(2)
      break

    case Ability.SPIKES: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(1)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case "TOXIC_SPIKES": {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        yoyo: false,
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case "LINK_CABLE_link": {
      const distance = distanceE(positionX, positionY, targetX, targetY)
      addAbilitySprite(Ability.LINK_CABLE, coordinates, true)
        .setScale(2, distance * 0.36)
        .setOrigin(0.5, 0)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      break
    }

    case "LINK_CABLE_discharge":
      addAbilitySprite(Ability.DISCHARGE, coordinates, true).setScale(2)
      break

    case "GRASS_HEAL":
      addAbilitySprite("GRASS_HEAL", coordinates, true)
        .setDepth(DEPTH.BOOST_BACK)
        .setScale(2)
      break

    case "FLAME_HIT":
      addAbilitySprite("FLAME_HIT", coordinates, true)
        .setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
        .setScale(2)
      break

    case Ability.TORCH_SONG: {
      const specialProjectile = addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500
      })
      break
    }

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
        const coordinates = transformAttackCoordinate(
          pkmUI.positionX,
          pkmUI.positionY,
          flip
        )
        addAbilitySprite(skill, coordinates, true)
          .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
          .setScale(2)
      })
      break

    case Ability.STRUGGLE_BUG:
      addAbilitySprite(Ability.PSYCHIC, coordinates, true).setScale(2)
      break

    case Ability.SNIPE_SHOT: {
      const targetAngle = Math.atan2(
        coordinatesTarget[1] - coordinates[1],
        coordinatesTarget[0] - coordinates[0]
      )

      const specialProjectile = addAbilitySprite(
        "SNIPE_SHOT/projectile",
        coordinates
      )
        .setScale(3)
        .setRotation(targetAngle - Math.PI / 2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinates[0] + Math.round(Math.cos(targetAngle) * 1000),
        y: coordinates[1] + Math.round(Math.sin(targetAngle) * 1000),
        ease: "linear",
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })

      addAbilitySprite(
        "SNIPE_SHOT/shoot",
        [
          coordinates[0] + Math.round(Math.cos(targetAngle) * 50),
          coordinates[1] + Math.round(Math.sin(targetAngle) * 50)
        ],
        true
      )
        .setScale(1, 1)
        .setRotation(targetAngle + Math.PI / 2)
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
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(
          Math.atan2(
            finalCoordinates[1] - coordinates[1],
            finalCoordinates[0] - coordinates[0]
          )
        )
      scene.tweens.add({
        targets: specialProjectile,
        x: finalCoordinates[0],
        y: finalCoordinates[1],
        ease: "linear",
        yoyo: false,
        duration: 2000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.FUTURE_SIGHT:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.LICK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.SPIRIT_BREAK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.AURA_WHEEL: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(1)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.CROSS_POISON:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(3)
      break

    case Ability.PSYSHOCK:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.PETAL_DANCE:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.PETAL_BLIZZARD:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.NIGHTMARE:
      addAbilitySprite(skill, coordinates, true).setOrigin(0.5, 1).setScale(2)
      break

    case Ability.AROMATHERAPY:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.SHEER_COLD:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.DARK_HARVEST:
      {
        const darkHarvestGroup = scene.add.group()
        const [x, y] = transformAttackCoordinate(positionX, positionY, flip)

        for (let i = 0; i < 5; i++) {
          const darkHarvestSprite = scene.add
            .sprite(0, 0, "abilities", `${Ability.DARK_HARVEST}/000.png`)
            .setScale(2)
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
        const [x, y] = transformAttackCoordinate(targetX, targetY, flip)

        Sweets.forEach((sweet) => {
          const sweetSprite = scene.add
            .sprite(0, 0, "item", `${sweet}.png`)
            .setScale(0.3)
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
      ).setScale(2)
      break

    case "HAIL_PROJECTILE": {
      const specialProjectile = addAbilitySprite(skill, [
        coordinatesTarget[0] + 60,
        coordinatesTarget[1] - 240
      ]).setScale(1)
      const randomDelay = randomBetween(0, 300)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        duration: 800,
        delay: randomDelay,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })

      setTimeout(
        () =>
          addAbilitySprite(
            Ability.SHEER_COLD,
            coordinatesTarget,
            true
          ).setScale(1),
        800 + randomDelay
      )
      break
    }

    case Ability.RAPID_SPIN:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(1.5)
      break

    case Ability.BOUNCE:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.MAGNET_BOMB:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.GUNK_SHOT: {
      const specialProjectile = addAbilitySprite(skill, coordinates).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        duration: 700,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.SCHOOLING:
      addAbilitySprite(skill, coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(4)
      break

    case Ability.STONE_AXE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.CRUSH_CLAW:
    case Ability.METAL_CLAW:
      addAbilitySprite(Ability.CRUSH_CLAW, coordinatesTarget, true).setScale(2)
      break

    case Ability.DRAGON_CLAW:
      addAbilitySprite(Ability.DRAGON_CLAW, coordinatesTarget, true).setScale(1)
      break

    case Ability.EARTHQUAKE:
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.OCTAZOOKA:
      addAbilitySprite(Ability.SMOKE_SCREEN, coordinatesTarget, true).setScale(
        3
      )
      break

    case Ability.WOOD_HAMMER:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(1)
        .setOrigin(0.5, 1)
      break

    case Ability.TRICK_OR_TREAT:
      addAbilitySprite(skill, coordinatesTarget, true)
        .setScale(2)
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
          ).setScale(3)

          scene.tweens.add({
            targets: projectile,
            x: coordinatesTarget[0],
            y: coordinatesTarget[1],
            ease: "linear",
            yoyo: false,
            duration: duration,
            onComplete: () => {
              projectile.destroy()
            }
          })
        } else {
          addAbilitySprite("ATTACK_ORDER", coordinatesTarget, true).setScale(2)
        }
      }
      break

    case "FIELD_DEATH":
      addAbilitySprite("FIELD_DEATH", coordinates, true).setScale(2)
      break

    case "GROUND_GROW":
      addAbilitySprite(skill, coordinates, true).setScale(1.5)
      break

    case "FIGHTING_KNOCKBACK":
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.HEADBUTT:
      addAbilitySprite("FIGHTING_KNOCKBACK", coordinatesTarget, true).setScale(
        2
      )
      break

    case "FAIRY_CRIT":
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "POWER_LENS":
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "STAR_DUST":
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "HEAL_ORDER":
    case "ATTACK_ORDER":
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case "FISHING":
      addAbilitySprite(Ability.DIVE, coordinates, true)
        .setOrigin(0.5, -2)
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        .setScale(1)
      break

    case "SPAWN":
      addAbilitySprite("SPAWN", coordinates, true)
        .setOrigin(0.5, -1.5)
        .setDepth(DEPTH.BOOST_BACK)
        .setScale(2)
      break

    case "EVOLUTION":
      addAbilitySprite("EVOLUTION", coordinates, true)
        .setOrigin(0.5, -0.4)
        .setDepth(DEPTH.BOOST_BACK)
        .setScale(2)
      break

    case "HATCH":
      addAbilitySprite("SOFT_BOILED", coordinates, true)
        .setOrigin(0.5, -0.4)
        .setDepth(DEPTH.BOOST_BACK)
        .setScale(2)
      break

    case "FLYING_TAKEOFF":
      addAbilitySprite("FLYING_TAKEOFF", coordinates, true)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(2)
      break

    case "FLYING_SKYDIVE":
      {
        const startCoords = transformAttackCoordinate(targetX, 9, false)
        const specialProjectile = addAbilitySprite(skill, startCoords).setScale(
          2
        )
        scene.tweens.add({
          targets: specialProjectile,
          x: coordinatesTarget[0],
          y: coordinatesTarget[1],
          ease: "linear",
          duration: 500,
          onComplete: () => {
            specialProjectile.destroy()
          }
        })
      }
      break

    case "TIDAL_WAVE":
      {
        const down = orientation === (flip ? Orientation.UP : Orientation.DOWN)
        const startCoords = transformAttackCoordinate(3.6, -4, down)
        const endCoords = transformAttackCoordinate(3.6, 10, down)
        const wave = scene.add
          .sprite(
            startCoords[0],
            startCoords[1],
            "abilities",
            `TIDAL_WAVE/00${targetY}.png`
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
      break

    case Ability.PURIFY:
      addAbilitySprite(Ability.SMOG, coordinatesTarget, true).setScale(1)
      addAbilitySprite(Ability.MUD_BUBBLE, coordinates, true).setScale(1)
      break

    case Ability.PSYCHO_SHIFT:
      {
        const pkmSprite = addAbilitySprite(
          Ability.PRESENT,
          coordinates
        ).setScale(2)

        if (targetX !== undefined && targetY !== undefined) {
          const targetSprite = addAbilitySprite(
            Ability.PRESENT,
            coordinatesTarget
          ).setScale(2)

          scene.tweens.add({
            targets: pkmSprite,
            x: coordinatesTarget[0],
            y: coordinatesTarget[1],
            ease: "linear",
            duration: 300,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
              pkmSprite.destroy()
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
              targetSprite.destroy()
            }
          })
        }
      }
      break

    case Ability.GLAIVE_RUSH: {
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(3)
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setRotation(
          Math.atan2(
            coordinatesTarget[1] - coordinates[1],
            coordinatesTarget[0] - coordinates[0]
          ) -
            Math.PI / 2
        )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    case Ability.STEEL_WING:
      addAbilitySprite(Ability.STEEL_WING, coordinates, true).setScale(2)
      break

    case Ability.FOUL_PLAY:
      addAbilitySprite(Ability.NIGHT_SLASH, coordinatesTarget, true).setScale(2)
      break

    case Ability.WONDER_ROOM:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(4)
      break

    case Ability.DOUBLE_IRON_BASH:
      addAbilitySprite(Ability.DRAIN_PUNCH, coordinatesTarget, true).setScale(2)
      break

    case Ability.STONE_EDGE:
      addAbilitySprite(Ability.TORMENT, coordinates, true).setScale(2)
      break

    case Ability.THUNDER_CAGE:
      addAbilitySprite(Ability.THUNDER_CAGE, coordinatesTarget, true).setScale(
        2
      )
      break

    case Ability.BIDE:
      addAbilitySprite(Ability.COUNTER, coordinates, true).setScale(3)
      break

    case Ability.SHORE_UP:
      addAbilitySprite(Ability.EARTHQUAKE, coordinates, true).setScale(2)
      break

    case Ability.BONE_ARMOR: {
      const startCoords = transformAttackCoordinate(targetX, targetY, flip)
      Object.values(Orientation).forEach((o) => {
        const [dx, dy] = OrientationVector[o]
        const finalCoords = transformAttackCoordinate(
          positionX + dx * 1,
          positionY + dy * 1,
          flip
        )
        const specialProjectile = addAbilitySprite(
          Ability.BONEMERANG,
          startCoords
        ).setScale(2)
        scene.tweens.add({
          targets: specialProjectile,
          x: finalCoords[0],
          y: finalCoords[1],
          yoyo: false,
          duration: 1000,
          onComplete: () => {
            specialProjectile.destroy()
          }
        })
      })
      break
    }

    case Ability.FIRESTARTER: {
      const abilitySprite = addAbilitySprite(skill, [
        coordinatesTarget[0],
        coordinatesTarget[1] - 25
      ]).setScale(2)
      scene.tweens.add({
        targets: abilitySprite,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1] + 25,
        ease: "linear",
        duration: 800,
        onComplete: () => {
          abilitySprite.destroy()
        }
      })
      break
    }

    case Ability.DARK_LARIAT: {
      const abilitySprite = addAbilitySprite(skill, coordinates, true)
        .setScale(2)
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
        .setScale(2)
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
        .setScale(2)
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
        .setScale(2)
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

    case Ability.BRICK_BREAK:

    case Ability.BULK_UP:
    case Ability.FLASH:
      addAbilitySprite(skill, coordinates, true).setScale(2)
      break

    case Ability.TAUNT:
      addAbilitySprite(
        skill,
        [coordinates[0], coordinates[1] - 30],
        true
      ).setScale(2)
      break

    case "TAUNT_HIT":
      addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 30],
        true
      ).setScale(2)
      break

    case "SMOKE_BALL":
      addAbilitySprite(skill, coordinates, true).setScale(3)
      break

    case Ability.RETALIATE:
      addAbilitySprite(skill, coordinatesTarget, true).setScale(2)
      break

    case Ability.TAILWIND: {
      const angle = Math.atan2(
        coordinatesTarget[1] - coordinates[1],
        coordinatesTarget[0] - coordinates[0]
      )
      addAbilitySprite(skill, coordinates, true)
        .setScale(2)
        .setRotation(angle - Math.PI / 2)
      break
    }

    case Ability.STRENGTH: {
      const specialProjectile = addAbilitySprite(
        skill,
        [coordinatesTarget[0], coordinatesTarget[1] - 150],
        true
      ).setScale(2)
      scene.tweens.add({
        targets: specialProjectile,
        y: coordinatesTarget[1],
        ease: Phaser.Math.Easing.Quadratic.In,
        duration: 450
      })
      break
    }

    case Ability.SURF: {
      const angle = Math.atan2(
        coordinatesTarget[1] - coordinates[1],
        coordinatesTarget[0] - coordinates[0]
      )
      const specialProjectile = addAbilitySprite(skill, coordinates)
        .setScale(2)
        .setRotation(angle - (3 / 4) * Math.PI)

      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 600,
        onComplete: () => {
          specialProjectile.destroy()
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
      const specialProjectile = addAbilitySprite(animKey, coordinates).setScale(
        2
      )
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        angle: 270,
        ease: "linear",
        duration: distance * 2,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break
    }

    default:
      break
  }
}

export function hiddenPowerAnimation(
  scene: GameScene | DebugScene,
  skill: Ability,
  originX: number,
  originY: number,
  flip: boolean
) {
  const [x, y] = transformAttackCoordinate(originX, originY, flip)
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
