import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { Ability } from "../../../../types/enum/Ability"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import { distanceE } from "../../../../utils/distance"
import {
  OrientationVector,
  OrientationArray
} from "../../../../utils/orientation"
import { randomBetween } from "../../../../utils/random"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import { DebugScene } from "../scenes/debug-scene"
import GameScene from "../scenes/game-scene"
import Pokemon from "./pokemon"
import { UNOWNS_PER_ABILITY } from "./unown-manager"

export function displayAbility(
  scene: GameScene | DebugScene,
  pokemonsOnBoard: Pokemon[],
  skill: Ability | string,
  orientation: Orientation,
  positionX: number,
  positionY: number,
  targetX: number,
  targetY: number,
  flip: boolean
) {
  let coordinates: number[]
  let specialProjectile: GameObjects.Sprite
  let additionalProjectile: GameObjects.Sprite
  let selfCoordinates: number[]
  let selfAnimation: GameObjects.Sprite
  let coordinatesTarget: number[]

  switch (skill) {
    case Ability.FIRE_BLAST:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.FIRE_BLAST}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.FIRE_BLAST)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FIRE_SPIN:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.FIRE_BLAST}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.FIRE_BLAST)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CORRUPTED_NATURE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.CORRUPTED_NATURE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CORRUPTED_NATURE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CRABHAMMER:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.CRABHAMMER}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CRABHAMMER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DIAMOND_STORM:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.DIAMOND_STORM}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DIAMOND_STORM)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DRACO_ENERGY:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.DRACO_ENERGY}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DRACO_ENERGY)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DYNAMAX_CANNON:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.DYNAMAX_CANNON}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) +
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.DYNAMAX_CANNON)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DYNAMIC_PUNCH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.DYNAMIC_PUNCH}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DYNAMIC_PUNCH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ELECTRO_WEB:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.ELECTRO_WEB}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ELECTRO_WEB)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FIRE_TRICK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.FIRE_TRICK}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.FIRE_TRICK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FLAME_CHARGE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.FLAME_CHARGE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) -
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.FLAME_CHARGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.AQUA_JET:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AQUA_JET,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) -
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.AQUA_JET)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.LEECH_SEED:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.LEECH_SEED}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.LEECH_SEED)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.LOCK_ON:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.LOCK_ON}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.LOCK_ON)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.PSYCH_UP:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.PSYCH_UP}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PSYCH_UP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MAGIC_POWDER:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.MAGIC_POWDER,
        `magic-powder-0.png`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.MAGIC_POWDER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.RAZOR_WIND:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.RAZOR_WIND}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.RAZOR_WIND)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.TWISTING_NETHER:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.TWISTING_NETHER}/000`
      )
      specialProjectile.setDepth(7).setScale(4, 4).setOrigin(0.5)
      specialProjectile.anims.play(Ability.TWISTING_NETHER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DARK_VOID:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "pmd-replace",
        `${Ability.TWISTING_NETHER}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(4, 4)
      specialProjectile.anims.play(Ability.TWISTING_NETHER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.WHEEL_OF_FIRE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.WHEEL_OF_FIRE,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.WHEEL_OF_FIRE)
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

    case Ability.INFERNAL_PARADE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.INFERNAL_PARADE,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.INFERNAL_PARADE)
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

    case Ability.BLUE_FLARE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "BLUE_FLARE",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BLUE_FLARE)
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

    case Ability.SHADOW_BALL:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "SHADOW_BALL",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SHADOW_BALL)
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

    case Ability.FUSION_BOLT:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "FUSION_BOLT",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.FUSION_BOLT)
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

    case Ability.ICY_WIND:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ICY_WIND,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1, 1)
      specialProjectile.anims.play(Ability.ICY_WIND)
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

    case Ability.SOLAR_BEAM:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(targetX, targetY - 3, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SOLAR_BEAM,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SOLAR_BEAM)
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

    case Ability.ORIGIN_PULSE:
      coordinatesTarget = transformAttackCoordinate(0, targetY, flip)
      coordinates = transformAttackCoordinate(8, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ORIGIN_PULSE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(4, 4)
      specialProjectile.anims.play(Ability.ORIGIN_PULSE)
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

    case Ability.SEED_FLARE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SEED_FLARE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.SEED_FLARE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SEISMIC_TOSS:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.SEISMIC_TOSS}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SEISMIC_TOSS)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.GUILLOTINE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.GUILLOTINE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.GUILLOTINE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ROCK_SLIDE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.ROCK_SLIDE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROCK_SLIDE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HEAT_WAVE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinatesTarget[0],
        coordinatesTarget[1],
        "specials",
        `${Ability.HEAT_WAVE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        )
      )
      specialProjectile.anims.play(Ability.HEAT_WAVE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.PSYBEAM:
      coordinates = transformAttackCoordinate(positionX, positionY, this.flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, this.flip)
      specialProjectile = this.scene.add.sprite(
        coordinatesTarget[0],
        coordinatesTarget[1],
        Ability.PSYBEAM,
        `${Ability.PSYBEAM}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) +
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.PSYBEAM)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.THUNDER:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.THUNDER}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.THUNDER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HYDRO_PUMP:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.HYDRO_PUMP}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HYDRO_PUMP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DRACO_METEOR:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DRACO_METEOR}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DRACO_METEOR)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.BLAZE_KICK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.BLAZE_KICK}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BLAZE_KICK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.WISH:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.WISH}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.WISH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CALM_MIND:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.CALM_MIND}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CALM_MIND)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.COSMIC_POWER:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.COSMIC_POWER,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.COSMIC_POWER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CHATTER:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CHATTER,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CHATTER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DEFENSE_CURL:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DEFENSE_CURL}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DEFENSE_CURL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.METRONOME:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.METRONOME}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.METRONOME)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SOAK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.SOAK}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SOAK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.IRON_TAIL:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.IRON_TAIL}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.IRON_TAIL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.BLAST_BURN:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.BLAST_BURN}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.BLAST_BURN)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CHARGE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.CHARGE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CHARGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DISCHARGE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DISCHARGE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.DISCHARGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.OVERDRIVE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.OVERDRIVE,
        `000.png`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setOrigin(0.5, 0.5)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.OVERDRIVE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SMOG:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SMOG,
        `000`
      )
      specialProjectile.setDepth(1)
      specialProjectile.setScale(4, 4)
      specialProjectile.anims.play(Ability.SMOG)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SLUDGE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SMOG,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.setTint(0xa0c020)
      specialProjectile.anims.play(Ability.SMOG)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.BITE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.BITE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BITE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DRAGON_TAIL:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DRAGON_TAIL}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DRAGON_TAIL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DRAGON_BREATH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DRAGON_BREATH}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DRAGON_BREATH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ICICLE_CRASH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.ICICLE_CRASH}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.ICICLE_CRASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ROOT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.ROOT}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROOT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.TORMENT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.TORMENT}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.TORMENT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.STOMP:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.STOMP}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.STOMP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.PAYBACK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.PAYBACK}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PAYBACK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.NIGHT_SLASH:
    case Ability.KOWTOW_CLEAVE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.NIGHT_SLASH,
        `000.png`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.NIGHT_SLASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.BUG_BUZZ:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.BUG_BUZZ}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BUG_BUZZ)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.VENOSHOCK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.VENOSHOCK}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.VENOSHOCK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.LEECH_LIFE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.LEECH_LIFE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.LEECH_LIFE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HAPPY_HOUR:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.HAPPY_HOUR}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HAPPY_HOUR)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.TELEPORT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.TELEPORT}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.TELEPORT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.NASTY_PLOT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.NASTY_PLOT}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.NASTY_PLOT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.THIEF:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.THIEF}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.THIEF)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.STUN_SPORE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.STUN_SPORE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.STUN_SPORE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.METEOR_MASH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.METEOR_MASH}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.METEOR_MASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HURRICANE: {
      const [dx, dy] = OrientationVector[orientation]
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.HURRICANE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HURRICANE)

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

      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break
    }

    case Ability.ROAR_OF_TIME:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "ROAR_OF_TIME",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROAR_OF_TIME)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ROCK_TOMB:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "ROCK_TOMB",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROCK_TOMB)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ILLUSION:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ILLUSION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ILLUSION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SLACK_OFF:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ILLUSION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ILLUSION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ROCK_SMASH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "ROCK_SMASH",
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROCK_SMASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.LIQUIDATION:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.LIQUIDATION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.LIQUIDATION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FISHIOUS_REND:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.LIQUIDATION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.FISHIOUS_REND)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.GOLD_RUSH:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.GOLD_RUSH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.GOLD_RUSH)
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

    case Ability.MAKE_IT_RAIN:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.GOLD_RUSH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.GOLD_RUSH)
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

    case Ability.POLTERGEIST:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.POLTERGEIST,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.POLTERGEIST)
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

    case Ability.SPARKLING_ARIA:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SPARKLING_ARIA,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.SPARKLING_ARIA)
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

    case Ability.SKY_ATTACK:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(targetX, 9, false)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SKY_ATTACK,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1.5, 1.5)
      specialProjectile.anims.play(Ability.SKY_ATTACK)
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

    case Ability.ACROBATICS:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(targetX + 1, targetY + 1, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ACROBATICS,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ACROBATICS)
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

    case Ability.ROLLOUT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ROLLOUT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ROLLOUT)
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

    case Ability.PRESENT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PRESENT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PRESENT)
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

    case Ability.WHIRLWIND:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.WHIRLWIND,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.WHIRLWIND)
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

    case Ability.EMPTY_LIGHT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.EMPTY_LIGHT,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.EMPTY_LIGHT)
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

    case Ability.WATER_PULSE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.WATER_PULSE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.WATER_PULSE)
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

    case Ability.EGGSPLOSION:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.EGGSPLOSION,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.EGGSPLOSION)
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

    case Ability.PAYDAY:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PAYDAY,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PAYDAY)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.AIR_SLASH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AIR_SLASH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.AIR_SLASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.VINE_WHIP:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AIR_SLASH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.VINE_WHIP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.VOLT_SWITCH:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.VOLT_SWITCH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) -
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.VOLT_SWITCH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.STEAM_ERUPTION:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.STEAM_ERUPTION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.STEAM_ERUPTION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SEARING_SHOT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SEARING_SHOT,
        "000"
      )
      specialProjectile.setDepth(0)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.STEAM_ERUPTION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.APPLE_ACID:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.APPLE_ACID,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.APPLE_ACID)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.PSYCHIC_FANGS:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PSYCHIC_FANGS,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PSYCHIC_FANGS)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.POPULATION_BOMB:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.POPULATION_BOMB,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.POPULATION_BOMB)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SCREECH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SCREECH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SCREECH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SAND_TOMB:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SAND_TOMB,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SAND_TOMB)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MAGICAL_LEAF:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "MAGICAL_LEAF_CHARGE",
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play("MAGICAL_LEAF_CHARGE")
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      const charge = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.MAGICAL_LEAF,
        "0"
      )
      charge.setDepth(7)
      charge.setScale(2, 2)
      charge.anims.play(Ability.MAGICAL_LEAF)
      scene.tweens.add({
        targets: charge,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "linear",
        duration: 500,
        onComplete: () => {
          charge.destroy()
        }
      })
      break

    case Ability.BRAVE_BIRD:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.BRAVE_BIRD,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BRAVE_BIRD)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.AQUA_RING:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AQUA_RING,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.AQUA_RING)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.NATURAL_GIFT:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, false)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.NATURAL_GIFT,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.NATURAL_GIFT)
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

    case Ability.NIGHT_SHADE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, false)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.NIGHT_SHADE,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.NIGHT_SHADE)
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

    case Ability.ASSURANCE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ASSURANCE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ASSURANCE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CRUSH_GRIP:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CRUSH_GRIP,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CRUSH_GRIP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FISSURE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.FISSURE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1, 1)
      specialProjectile.anims.play(Ability.FISSURE)
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

    case Ability.CLOSE_COMBAT:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CLOSE_COMBAT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.CLOSE_COMBAT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SUPER_FANG:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SUPER_FANG,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.SUPER_FANG)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.PARABOLIC_CHARGE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PARABOLIC_CHARGE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.anims.play(Ability.PARABOLIC_CHARGE)
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

    case Ability.PLAY_ROUGH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PLAY_ROUGH,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PLAY_ROUGH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ATTRACT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ATTRACT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ATTRACT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MAGNET_RISE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ELECTRO_BOOST,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ELECTRO_BOOST)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ANCHOR_SHOT:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ANCHOR_SHOT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ANCHOR_SHOT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HYPERSPACE_FURY:
      const nbHits = Number(orientation) // orientation field is used to pass the number of hits for hyperspace fury
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      for (let i = 0; i < nbHits; i++) {
        setTimeout(() => {
          const fist = scene.add.sprite(
            coordinates[0] + randomBetween(-20, +20),
            coordinates[1] + randomBetween(-20, +20),
            Ability.ANCHOR_SHOT,
            "000"
          )
          fist.setDepth(7)
          fist.setScale(1, 1)
          fist.setTint(0xc080ff)
          fist.anims.play(Ability.HYPERSPACE_FURY)
          fist.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            fist.destroy()
          })
        }, i * 150)
      }
      break

    case Ability.LEAF_BLADE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.LEAF_BLADE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.LEAF_BLADE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.WATERFALL:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.WATERFALL,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.WATERFALL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HELPING_HAND:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.HELPING_HAND,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HELPING_HAND)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MUD_BUBBLE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.MUD_BUBBLE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.MUD_BUBBLE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ERUPTION:
      coordinates = transformAttackCoordinate(targetX + 3, targetY + 3, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ERUPTION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.anims.play(Ability.ERUPTION)
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

    case Ability.SLASHING_CLAW:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SLASHING_CLAW,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SLASHING_CLAW)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MAGMA_STORM:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.MAGMA_STORM,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.MAGMA_STORM)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.THRASH:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.THRASH,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.THRASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ABSORB:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ABSORB,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ABSORB)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.GIGATON_HAMMER:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.GIGATON_HAMMER,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.GIGATON_HAMMER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.COUNTER:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.COUNTER,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.COUNTER)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HEX:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.HEX,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HEX)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SPECTRAL_THIEF:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SPECTRAL_THIEF,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SPECTRAL_THIEF)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )

      selfCoordinates = transformAttackCoordinate(positionX, positionY, flip)
      selfAnimation = scene.add.sprite(
        selfCoordinates[0],
        selfCoordinates[1],
        Ability.SPECTRAL_THIEF,
        "000"
      )
      selfAnimation.setDepth(7)
      selfAnimation.setScale(2, 2)
      selfAnimation.anims.play(Ability.SPECTRAL_THIEF)
      selfAnimation.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        selfAnimation.destroy()
      })
      break

    case Ability.PLASMA_FIST:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PLASMA_FIST,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PLASMA_FIST)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SACRED_SWORD:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SACRED_SWORD,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SACRED_SWORD)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.JUDGEMENT:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.JUDGEMENT,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.JUDGEMENT)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SHADOW_SNEAK:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SHADOW_SNEAK,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SHADOW_SNEAK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DIVE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.DIVE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.DIVE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SMOKE_SCREEN:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SMOKE_SCREEN,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.SMOKE_SCREEN)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.BARB_BARRAGE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.BARB_BARRAGE,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.BARB_BARRAGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.OUTRAGE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.OUTRAGE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.OUTRAGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.KNOCK_OFF:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.KNOCK_OFF,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.KNOCK_OFF)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SLASH:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SLASH,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SLASH)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HYPER_VOICE:
      coordinatesTarget = transformAttackCoordinate(8, targetY, flip)
      coordinates = transformAttackCoordinate(0, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.HYPER_VOICE,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HYPER_VOICE)
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

    case Ability.SHADOW_CLONE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SHADOW_CLONE,
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SHADOW_CLONE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.ECHO:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ECHO,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.ECHO)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.EXPLOSION:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.EXPLOSION,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.EXPLOSION)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.CLANGOROUS_SOUL:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CLANGOROUS_SOUL,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CLANGOROUS_SOUL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.GROWL:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.GROWL,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.GROWL)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DISARMING_VOICE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.DISARMING_VOICE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DISARMING_VOICE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.RELIC_SONG:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.RELIC_SONG,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.RELIC_SONG)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.HIGH_JUMP_KICK:
    case Ability.LUNGE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.HIGH_JUMP_KICK,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.HIGH_JUMP_KICK)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case "SHELL_TRAP_trigger":
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SHELL_TRAP,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SHELL_TRAP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SHELL_SMASH:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SHELL_TRAP,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SHELL_TRAP)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.TRI_ATTACK:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.TRI_ATTACK,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.anims.play(Ability.TRI_ATTACK)
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

    case Ability.PSYCHIC:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PSYCHIC,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.PSYCHIC)
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

    case Ability.PYRO_BALL:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PYRO_BALL,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.anims.play(Ability.PYRO_BALL)
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

    case Ability.WHIRLPOOL:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)

      for (let i = 0; i < 4; i++) {
        const whirlpool = scene.add.sprite(
          coordinates[0],
          coordinates[1],
          Ability.WHIRLPOOL,
          "000"
        )
        whirlpool.setDepth(7)
        whirlpool.anims.play(Ability.WHIRLPOOL)
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

    case Ability.BONEMERANG:
      coordinatesTarget = transformAttackCoordinate(targetX, 6, flip)
      coordinates = transformAttackCoordinate(targetX, 0, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.BONEMERANG,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.BONEMERANG)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break

    case Ability.PRISMATIC_LASER:
      coordinatesTarget = transformAttackCoordinate(positionX, 6, flip)
      coordinates = transformAttackCoordinate(positionX, 0, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PRISMATIC_LASER,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(5, 5)
      specialProjectile.anims.play(Ability.PRISMATIC_LASER)
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

    case Ability.AURORA_BEAM: {
      const [dx, dy] = OrientationVector[orientation]
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AURORA_BEAM,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) -
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.AURORA_BEAM)
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

    case Ability.SONG_OF_DESIRE:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SONG_OF_DESIRE,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SONG_OF_DESIRE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      additionalProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SONG_OF_DESIRE,
        "000"
      )
      additionalProjectile.setDepth(7)
      additionalProjectile.setScale(2, 2)
      additionalProjectile.anims.play(Ability.SONG_OF_DESIRE)
      additionalProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          additionalProjectile.destroy()
        }
      )
      break

    case Ability.CONFUSING_MIND:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CONFUSING_MIND,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.CONFUSING_MIND)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      additionalProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.CONFUSING_MIND,
        "000"
      )
      additionalProjectile.setDepth(7)
      additionalProjectile.setScale(2, 2)
      additionalProjectile.anims.play(Ability.CONFUSING_MIND)
      additionalProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          additionalProjectile.destroy()
        }
      )
      break

    case Ability.MIND_BLOWN:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      additionalProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "MIND_BLOWN_SELF",
        "000"
      )
      additionalProjectile.setDepth(7)
      additionalProjectile.setScale(2, 2)
      additionalProjectile.anims.play("MIND_BLOWN_SELF")
      additionalProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          additionalProjectile.destroy()
        }
      )
      break

    case Ability.SOFT_BOILED:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SOFT_BOILED,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.SOFT_BOILED)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.FAKE_TEARS:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.FAKE_TEARS,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.FAKE_TEARS)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DRAGON_DARTS:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.VENOSHOCK}/002`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1, 1)
      specialProjectile.setRotation(
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

    case Ability.SPIRIT_SHACKLE: {
      const [dx, dy] = OrientationVector[orientation]
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.SPIRIT_SHACKLE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1)
      specialProjectile.anims.play(Ability.SPIRIT_SHACKLE)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
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

    case Ability.ASTRAL_BARRAGE: {
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.ASTRAL_BARRAGE,
        `${Ability.ASTRAL_BARRAGE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1)
      specialProjectile.anims.play(Ability.ASTRAL_BARRAGE)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        )
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
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
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
        const projectile = scene.add.sprite(
          coordinates[0],
          coordinates[1],
          "specials",
          `${Ability.WATER_SHURIKEN}/000`
        )
        projectile.setDepth(7)
        projectile.setScale(2)
        projectile.anims.play(Ability.WATER_SHURIKEN)
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

    case Ability.MACH_PUNCH:
    case Ability.UPPERCUT:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "FIGHTING",
        "FIST"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(0.25)
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

    case Ability.MAWASHI_GERI:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "FIGHTING",
        "FOOT"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(0.25)
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

    case Ability.TRIPLE_KICK:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const projectile = scene.add.sprite(
            coordinates[0] + Math.round(50 * Math.cos((Math.PI * 2 * i) / 3)),
            coordinates[1] + Math.round(50 * Math.sin((Math.PI * 2 * i) / 3)),
            "FIGHTING",
            "PAW"
          )
          projectile.setDepth(7)
          projectile.setScale(1.5)
          setTimeout(() => projectile.destroy(), 500)
        }, i * 250)
      }
      break

    case Ability.STRING_SHOT:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "STRING_SHOT"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(0.25)
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

    case Ability.STICKY_WEB:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "STRING_SHOT"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(0.25)
      specialProjectile.setTint(0x80a080)
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

    case Ability.WONDER_GUARD:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.WONDER_GUARD,
        `${Ability.WONDER_GUARD}/000`
      )
      specialProjectile.setDepth(2)
      specialProjectile.setScale(2)
      specialProjectile.anims.play(Ability.WONDER_GUARD)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.X_SCISSOR:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.X_SCISSOR,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.X_SCISSOR)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.DEATH_WING:
      coordinates = transformAttackCoordinate(targetX, targetY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.DEATH_WING,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DEATH_WING)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.GEOMANCY:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1] - 50,
        Ability.GEOMANCY,
        "000"
      )
      specialProjectile.setDepth(1)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.GEOMANCY)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.OVERHEAT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.FIRE_BLAST}/000`
      )
      specialProjectile.setDepth(0)
      specialProjectile.setScale(3)
      specialProjectile.anims.play(Ability.FIRE_BLAST)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.MIST_BALL:
      coordinatesTarget = transformAttackCoordinate(targetX, 6, false)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.MIST_BALL,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1.5, 1.5)
      specialProjectile.anims.play(Ability.MIST_BALL)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break

    case Ability.LUSTER_PURGE:
      coordinatesTarget = transformAttackCoordinate(targetX, 6, false)
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.LUSTER_PURGE,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(1.5, 1.5)
      specialProjectile.anims.play(Ability.LUSTER_PURGE)
      scene.tweens.add({
        targets: specialProjectile,
        x: coordinatesTarget[0],
        y: coordinatesTarget[1],
        ease: "Power2",
        yoyo: true,
        duration: 1000,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break

    case Ability.AERIAL_ACE:
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, false)
      coordinates = transformAttackCoordinate(targetX, 8, false)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AERIAL_ACE,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.AERIAL_ACE)
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

    case Ability.STEALTH_ROCKS:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.STEALTH_ROCKS,
        `000`
      )
      specialProjectile.setDepth(1)
      specialProjectile.setScale(1, 1)
      specialProjectile.anims.play(Ability.STEALTH_ROCKS)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case "LINK_CABLE_link": {
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      const distance = distanceE(positionX, positionY, targetX, targetY)
      const coordinatesTarget = transformAttackCoordinate(
        targetX,
        targetY,
        flip
      )
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.LINK_CABLE,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, distance * 0.36)
      specialProjectile.setOrigin(0.5, 0)
      specialProjectile.setRotation(
        Math.atan2(
          coordinatesTarget[1] - coordinates[1],
          coordinatesTarget[0] - coordinates[0]
        ) -
          Math.PI / 2
      )
      specialProjectile.anims.play(Ability.LINK_CABLE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break
    }

    case "LINK_CABLE_discharge": {
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "specials",
        `${Ability.DISCHARGE}/000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.DISCHARGE)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break
    }

    case "GRASS_HEAL": {
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "GRASS_HEAL",
        "000"
      )
      specialProjectile.setDepth(1)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play("GRASS_HEAL")
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break
    }

    case "FLAME_HIT": {
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "FLAME_HIT",
        "0"
      )
      specialProjectile.setDepth(1)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play("FLAME_HIT")
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
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

    case Ability.TEETER_DANCE:
      pokemonsOnBoard.forEach((pkmUI) => {
        coordinates = transformAttackCoordinate(
          pkmUI.positionX,
          pkmUI.positionY,
          flip
        )
        const s = scene.add.sprite(
          coordinates[0],
          coordinates[1],
          Ability.TEETER_DANCE,
          "000"
        )
        s.setDepth(1)
        s.setScale(2, 2)
        s.anims.play(Ability.TEETER_DANCE)
        s.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          s.destroy()
        })
      })
      break

    case Ability.STRUGGLE_BUG:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.PSYCHIC,
        "000"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.anims.play(Ability.PSYCHIC)
      specialProjectile.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          specialProjectile.destroy()
        }
      )
      break

    case Ability.SNIPE_SHOT:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      coordinatesTarget = transformAttackCoordinate(targetX, targetY, flip)

      const targetAngle = Math.atan2(
        coordinatesTarget[1] - coordinates[1],
        coordinatesTarget[0] - coordinates[0]
      )

      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.SNIPE_SHOT,
        "projectile1.png"
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(3, 3)
      specialProjectile.anims.play(Ability.SNIPE_SHOT + "_projectile")
      specialProjectile.setRotation(targetAngle - Math.PI / 2)
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

      const shot = scene.add.sprite(
        coordinates[0] + Math.round(Math.cos(targetAngle) * 50),
        coordinates[1] + Math.round(Math.sin(targetAngle) * 50),
        Ability.SNIPE_SHOT,
        "shot1.png"
      )
      shot.setDepth(7)
      shot.setScale(1, 1)
      shot.setRotation(targetAngle + Math.PI / 2)
      shot.anims.play(Ability.SNIPE_SHOT + "_shot")
      shot.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        shot.destroy()
      })
      break

    case "CURSE_EFFECT":
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "CURSE_EFFECT",
        "0"
      )
      specialProjectile.setDepth(7)
      specialProjectile.anims.play("CURSE_EFFECT")
      scene.tweens.add({
        targets: specialProjectile,
        y: coordinates[1] - 80,
        ease: "linear",
        duration: 1500,
        onComplete: () => {
          specialProjectile.destroy()
        }
      })
      break

    case Ability.AURASPHERE:
      coordinates = transformAttackCoordinate(positionX, positionY, flip)
      const [dx, dy] = OrientationVector[orientation]
      const finalCoordinates = transformAttackCoordinate(
        positionX + dx * 8,
        positionY + dy * 8,
        flip
      )
      specialProjectile = scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Ability.AURASPHERE,
        `000`
      )
      specialProjectile.setDepth(7)
      specialProjectile.setScale(2, 2)
      specialProjectile.setRotation(
        Math.atan2(
          finalCoordinates[1] - coordinates[1],
          finalCoordinates[0] - coordinates[0]
        )
      )
      specialProjectile.anims.play(Ability.AURASPHERE)
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
      const unown = new Pokemon(
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
