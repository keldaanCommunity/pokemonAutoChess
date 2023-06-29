import { GameObjects } from "phaser"
import Pokemon from "./pokemon"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import GameScene from "../scenes/game-scene"
import {
  ICount,
  IPlayer,
  IPokemonEntity,
  NonFunctionPropNames
} from "../../../../types"
import AnimationManager from "../animation-manager"
import {
  AttackType,
  PokemonActionState,
  HealType,
  Rarity,
  Orientation
} from "../../../../types/enum/Game"
import { Ability } from "../../../../types/enum/Ability"
import { Item } from "../../../../types/enum/Item"
import Count from "../../../../models/colyseus-models/count"
import { AnimationConfig, Pkm } from "../../../../types/enum/Pokemon"
import {
  OrientationVector,
  OrientationArray
} from "../../../../utils/orientation"

export default class BattleManager {
  group: GameObjects.Group
  scene: GameScene
  player: IPlayer
  animationManager: AnimationManager

  constructor(
    scene: GameScene,
    group: GameObjects.Group,
    player: IPlayer,
    animationManager: AnimationManager
  ) {
    this.group = group
    this.scene = scene
    this.player = player
    this.animationManager = animationManager
  }

  buildPokemons() {
    this.player.simulation.blueTeam.forEach((pkm, key) => {
      this.addPokemon(this.player.id, pkm)
    })

    this.player.simulation.redTeam.forEach((pkm, key) => {
      this.addPokemon(this.player.id, pkm)
    })
  }

  addPokemon(playerId: string, pokemon: IPokemonEntity) {
    if (this.player.id == playerId) {
      const coordinates = transformAttackCoordinate(
        pokemon.positionX,
        pokemon.positionY
      )
      const pokemonUI = new Pokemon(
        this.scene,
        coordinates[0],
        coordinates[1],
        pokemon,
        playerId,
        true
      )
      this.animationManager.animatePokemon(pokemonUI, PokemonActionState.WALK)
      this.group.add(pokemonUI)
    }
  }

  clear() {
    this.group.clear(true, true)
  }

  removePokemon(playerId: string, pokemon: IPokemonEntity) {
    if (this.player.id == playerId) {
      this.group.getChildren().forEach((p) => {
        const pkm = <Pokemon>p
        if (pkm.id == pokemon.id) {
          this.animationManager.animatePokemon(pkm, PokemonActionState.HURT)
          pkm.deathAnimation()
        }
      })
    }
  }

  addPokemonItem(playerId: string, value: Item, pokemon: IPokemonEntity) {
    // logger.debug(change);
    if (this.player.id === playerId) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]
        if (pkm.id == pokemon.id && !pkm.itemsContainer.findItem(value)) {
          pkm.itemsContainer.addItem(value)
          break
        }
      }
    }
  }

  removePokemonItem(playerId: string, value: Item, pokemon: IPokemonEntity) {
    if (this.player.id == playerId && this.group) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]
        if (pkm.id == pokemon.id) {
          pkm.itemsContainer.removeItem(value)
          break
        }
      }
    }
  }

  changeStatus(playerId: string, pokemon: IPokemonEntity, field: string) {
    if (this.player.id == playerId && this.group) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]

        if (pkm.id == pokemon.id) {
          if (field == "poisonStacks") {
            if (pokemon.status.poisonStacks > 0) {
              pkm.addPoison()
            } else {
              pkm.removePoison()
            }
          } else if (field == "sleep") {
            if (pokemon.status.sleep) {
              pkm.addSleep()
              this.animationManager.animatePokemon(
                pkm,
                PokemonActionState.SLEEP
              )
            } else {
              pkm.removeSleep()
            }
          } else if (field == "burn") {
            if (pokemon.status.burn) {
              pkm.addBurn()
            } else {
              pkm.removeBurn()
            }
          } else if (field == "silence") {
            if (pokemon.status.silence) {
              pkm.addSilence()
            } else {
              pkm.removeSilence()
            }
          } else if (field == "confusion") {
            if (pokemon.status.confusion) {
              pkm.addConfusion()
            } else {
              pkm.removeConfusion()
            }
          } else if (field == "freeze") {
            if (pokemon.status.freeze) {
              pkm.addFreeze()
            } else {
              pkm.removeFreeze()
            }
          } else if (field == "protect") {
            if (pokemon.status.protect) {
              pkm.addProtect()
            } else {
              pkm.removeProtect()
            }
          } else if (field == "wound") {
            if (pokemon.status.wound) {
              pkm.addWound()
            } else {
              pkm.removeWound()
            }
          } else if (field == "resurection") {
            if (pokemon.status.resurection) {
              pkm.addResurection()
            } else {
              pkm.removeResurection()
            }
          } else if (field == "resurecting") {
            if (pokemon.status.resurecting) {
              pkm.resurectAnimation()
            }
          } else if (field == "paralysis") {
            if (pokemon.status.paralysis) {
              pkm.addParalysis()
            } else {
              pkm.removeParalysis()
            }
          } else if (field == "armorReduction") {
            if (pokemon.status.armorReduction) {
              pkm.addArmorReduction()
            } else {
              pkm.removeArmorReduction()
            }
          } else if (field == "runeProtect") {
            if (pokemon.status.runeProtect) {
              pkm.addRuneProtect()
            } else {
              pkm.removeRuneProtect()
            }
          } else if (field == "spikeArmor") {
            if (pokemon.status.spikeArmor) {
              pkm.addSpikeArmor()
            } else {
              pkm.removeSpikeArmor()
            }
          } else if (field == "electricField") {
            if (pokemon.status.electricField) {
              pkm.addElectricField()
            } else {
              pkm.removeElectricField()
            }
          } else if (field == "psychicField") {
            if (pokemon.status.psychicField) {
              pkm.addPsychicField()
            } else {
              pkm.removePsychicField()
            }
          } else if (field == "grassField") {
            if (pokemon.status.grassField) {
              pkm.addGrassField()
            } else {
              pkm.removeGrassField()
            }
          } else if (field == "fairyField") {
            if (pokemon.status.fairyField) {
              pkm.addFairyField()
            } else {
              pkm.removeFairyField()
            }
          }
        }
      }
    }
  }

  changeCount(
    playerId: string,
    pokemon: IPokemonEntity,
    field: NonFunctionPropNames<Count>,
    value: any
  ) {
    // logger.debug(field, value);
    if (this.player.id == playerId && this.group) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]

        if (pkm.id == pokemon.id) {
          if (field == "crit") {
            if (value != 0) {
              this.displayCriticalHit(pkm.x, pkm.y)
            }
          } else if (field == "dodgeCount") {
            if (value != 0) {
              this.displayDodge(pkm.x, pkm.y)
            }
          } else if (field == "ult") {
            if (value != 0) {
              this.animationManager.play(
                pkm,
                AnimationConfig[pkm.name as Pkm].ability
              )
              pkm.specialAttackAnimation(this.group, value)
            }
          } else if (field == "petalDanceCount") {
            if (value != 0) {
              pkm.petalDanceAnimation()
            }
          } else if (field == "futureSightCount") {
            if (value != 0) {
              pkm.futureSightAnimation()
            }
          } else if (field == "earthquakeCount") {
            if (value != 0) {
              pkm.earthquakeAnimation()
            }
          } else if (field == "fieldCount") {
            if (value != 0) {
              pkm.fieldDeathAnimation()
            }
          } else if (field == "soundCount") {
            if (value != 0) {
              pkm.soundAnimation()
            }
          } else if (field == "growGroundCount") {
            if (value != 0) {
              pkm.growGroundAnimation()
            }
          } else if (field == "fairyCritCount") {
            if (value != 0) {
              pkm.fairyCritAnimation()
            }
          } else if (field == "powerLensCount") {
            if (value != 0) {
              pkm.powerLensAnimation()
            }
          } else if (field == "starDustCount") {
            if (value != 0) {
              pkm.starDustAnimation()
            }
          } else if (field == "mindBlownCount") {
            if (value != 0) {
              pkm.mindBlownAnimation()
            }
          } else if (field == "spellBlockedCount") {
            if (value != 0) {
              this.displayBlockedSpell(pkm.x, pkm.y)
            }
          } else if (field == "manaBurnCount") {
            if (value != 0) {
              this.displayManaBurn(pkm.x, pkm.y)
            }
          } else if (field == "staticCount") {
            if (value != 0) {
              pkm.staticAnimation()
            }
          } else if (field === "healOrderCount") {
            if (value != 0) {
              pkm.healOrderAnimation()
            }
          } else if (field === "attackOrderCount") {
            if (value != 0) {
              pkm.attackOrderAnimation()
            }
          } else if (field == "moneyCount") {
            if (value != 0) {
              this.moneyAnimation(pkm.x, pkm.y)
              pkm.itemsContainer.updateCount(Item.AMULET_COIN, value)
            }
          } else if (field == "attackCount") {
            if (value != 0) {
              // logger.debug(value, pkm.action, pkm.targetX, pkm.targetY);
              if (
                pkm.action == PokemonActionState.ATTACK &&
                pkm.targetX !== null &&
                pkm.targetY !== null
              ) {
                this.animationManager.animatePokemon(
                  pkm,
                  PokemonActionState.ATTACK
                )
                pkm.attackAnimation()
              }
            }
          } else if (field == "tripleAttackCount") {
            if (value != 0) {
              this.displayTripleAttack(pkm.x, pkm.y)
            }
          } else if (field == "monsterExecutionCount") {
            if (value != 0) {
              pkm.sprite.setScale(2 + 0.5 * value)
            }
          } else if (field == "upgradeCount") {
            pkm.itemsContainer.updateCount(Item.UPGRADE, value)
          } else if (field == "soulDewCount") {
            pkm.itemsContainer.updateCount(Item.SOUL_DEW, value)
          } else if (field == "defensiveRibbonCount") {
            pkm.itemsContainer.updateCount(Item.DEFENSIVE_RIBBON, value)
          }
        }
      }
    }
  }

  changePokemon(
    playerId: string,
    pokemon: IPokemonEntity,
    field: string,
    value: any,
    previousValue: any
  ) {
    if (this.player.id == playerId && this.group) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]
        if (pkm.id == pokemon.id) {
          if (field == "positionX" || field == "positionY") {
            // logger.debug(pokemon.positionX, pokemon.positionY);
            if (field == "positionX") {
              pkm.positionX = pokemon.positionX
            } else if (field == "positionY") {
              pkm.positionY = pokemon.positionY
            }
            const coordinates = transformAttackCoordinate(
              pokemon.positionX,
              pokemon.positionY
            )
            if (pokemon.skill == Ability.TELEPORT) {
              pkm.x = coordinates[0]
              pkm.y = coordinates[1]
              pkm.specialAttackAnimation(this.group, pokemon.count.ult)
            } else {
              pkm.moveManager.setSpeed(
                3 *
                  Math.max(
                    Math.abs(pkm.x - coordinates[0]),
                    Math.abs(pkm.y - coordinates[1])
                  )
              )
              pkm.moveManager.moveTo(coordinates[0], coordinates[1])
            }
          } else if (field == "orientation") {
            pkm.orientation = pokemon.orientation
            if (pokemon.action !== PokemonActionState.SLEEP) {
              this.animationManager.animatePokemon(pkm, pokemon.action)
            }
          } else if (field == "action") {
            pkm.action = pokemon.action
            this.animationManager.animatePokemon(pkm, value)
          } else if (field == "critChance") {
            pkm.critChance = pokemon.critChance
            if (pkm.detail) {
              pkm.detail.critChance.textContent =
                pokemon.critChance.toString() + "%"
            }
          } else if (field == "critDamage") {
            pkm.critDamage = parseFloat(pokemon.critDamage.toFixed(2))
            if (pkm.detail) {
              pkm.detail.critDamage.textContent = pokemon.critDamage.toFixed(2)
            }
          } else if (field == "ap") {
            pkm.ap = pokemon.ap
            if (pkm.detail) {
              const abilityTier = pkm.rarity === Rarity.MYTHICAL ? 3 : pkm.stars
              pkm.detail.ap.textContent = pokemon.ap.toString()
              pkm.detail.updateAbilityDescription(
                pkm.skill,
                abilityTier,
                pkm.ap
              )
            }
          } else if (field == "atkSpeed") {
            pkm.atkSpeed = pokemon.atkSpeed
            if (pkm.detail) {
              pkm.detail.atkSpeed.textContent = pokemon.atkSpeed.toFixed(2)
            }
          } else if (field == "life") {
            pkm.life = pokemon.life
            pkm.lifebar?.setAmount(pkm.life)
            if (pkm.detail) {
              pkm.detail.hp.textContent = pokemon.life.toString()
            }
          } else if (field == "shield") {
            if (value >= 0) {
              pkm.shield = pokemon.shield
              pkm.lifebar?.setShieldAmount(pkm.shield)
            }
          } else if (field == "mana") {
            pkm.mana = pokemon.mana
            pkm.manabar?.setAmount(pkm.mana)
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.mana, previousValue, value)
            }
          } else if (field == "atk") {
            pkm.atk = pokemon.atk
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.atk, previousValue, value)
            }
          } else if (field == "def") {
            pkm.def = pokemon.def
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.def, previousValue, value)
            }
          } else if (field == "speDef") {
            pkm.speDef = pokemon.speDef
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.speDef, previousValue, value)
            }
          } else if (field == "range") {
            pkm.range = pokemon.range
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.range, previousValue, value)
            }
          } else if (field == "targetX") {
            if (pokemon.targetX >= 0) {
              pkm.targetX = pokemon.targetX
            } else {
              pkm.targetX = null
            }
          } else if (field == "targetY") {
            if (pokemon.targetY >= 0) {
              pkm.targetY = pokemon.targetY
            } else {
              pkm.targetY = null
            }
          } else if (field == "team") {
            if (pkm.lifebar && pkm.lifebar.progress) {
              pkm.lifebar.progress.style.backgroundColor =
                value === 1 ? "#e76e55" : "#76c442"
            }
          } else if (field === "index") {
            pkm.index = value
            this.animationManager.animatePokemon(pkm, PokemonActionState.IDLE)
          }
          break
        }
      }
    }
  }

  moneyAnimation(x: number, y: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FFFF00",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const crit = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 40, y - 50, "+ 1 GOLD", textStyle)
    )
    crit.setDepth(9)
    this.scene.add.tween({
      targets: [crit],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        crit.destroy(true)
      }
    })
  }

  displayDodge(x: number, y: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FFFFFF",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const crit = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 40, y - 50, "DODGE !", textStyle)
    )
    crit.setDepth(9)
    this.scene.add.tween({
      targets: [crit],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        crit.destroy(true)
      }
    })
  }

  displayCriticalHit(x: number, y: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FF0000",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const crit = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 25, y - 50, "CRIT !", textStyle)
    )
    crit.setDepth(9)
    this.scene.add.tween({
      targets: [crit],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        crit.destroy(true)
      }
    })
  }

  displayBlockedSpell(x: number, y: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#007BA7",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const blockedSpell = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 30, y - 50, "Block!", textStyle)
    )
    blockedSpell.setDepth(9)
    this.scene.add.tween({
      targets: [blockedSpell],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        blockedSpell.destroy(true)
      }
    })
  }

  displayManaBurn(x: number, y: number) {
    const textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "#9f40ff",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const manaBurn = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 30, y - 50, "Burn!", textStyle)
    )
    manaBurn.setDepth(9)
    this.scene.add.tween({
      targets: [manaBurn],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        manaBurn.destroy(true)
      }
    })
  }

  displayTripleAttack(x: number, y: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FFFF00",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const tripleAttack = this.scene.add.existing(
      new GameObjects.Text(this.scene, x - 30, y - 50, "ZAP!", textStyle)
    )
    tripleAttack.setDepth(9)
    this.scene.add.tween({
      targets: [tripleAttack],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        tripleAttack.destroy(true)
      }
    })
  }

  displayAbility(
    id: string,
    skill: Ability,
    orientation: Orientation,
    positionX: number,
    positionY: number,
    targetX_?: number,
    targetY_?: number
  ) {
    const targetX = targetX_ ? targetX_ : -1
    const targetY = targetY_ ? targetY_ : -1
    if (this.player.id === id) {
      if (skill) {
        let coordinates: number[]
        let specialProjectile: GameObjects.Sprite
        let additionalProjectile: GameObjects.Sprite
        let selfCoordinates: number[]
        let selfAnimation: GameObjects.Sprite
        let coordinatesTarget: number[]

        switch (skill) {
          case Ability.FIRE_BLAST:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "pmd-replace",
              `${Ability.DYNAMAX_CANNON}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.DYNAMAX_CANNON)
            specialProjectile.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                specialProjectile.destroy()
              }
            )
            break

          case Ability.DYNAMIC_PUNCH:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.RAZOR_WIND:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.TWISTING_NEITHER:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "pmd-replace",
              `${Ability.TWISTING_NEITHER}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(4, 4)
            specialProjectile.anims.play(Ability.TWISTING_NEITHER)
            specialProjectile.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                specialProjectile.destroy()
              }
            )
            break

          case Ability.DARK_VOID:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "pmd-replace",
              `${Ability.TWISTING_NEITHER}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(4, 4)
            specialProjectile.anims.play(Ability.TWISTING_NEITHER)
            specialProjectile.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                specialProjectile.destroy()
              }
            )
            break

          case Ability.WHEEL_OF_FIRE:
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "specials",
              `${Ability.WHEEL_OF_FIRE}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.WHEEL_OF_FIRE)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "BLUE_FLARE",
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.BLUE_FLARE)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "SHADOW_BALL",
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(4, 4)
            specialProjectile.anims.play(Ability.SHADOW_BALL)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "FUSION_BOLT",
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.FUSION_BOLT)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.ICY_WIND,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(1, 1)
            specialProjectile.anims.play(Ability.ICY_WIND)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(targetX, targetY - 3)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.SOLAR_BEAM,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.SOLAR_BEAM)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(0, targetY)
            coordinates = transformAttackCoordinate(8, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.ORIGIN_PULSE,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(4, 4)
            specialProjectile.anims.play(Ability.ORIGIN_PULSE)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.THUNDER:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.IRON_DEFENSE:
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "specials",
              `${Ability.IRON_DEFENSE}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.IRON_DEFENSE)
            specialProjectile.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                specialProjectile.destroy()
              }
            )
            break

          case Ability.METRONOME:
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.SMOG:
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.SMOG,
              `000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(3, 3)
            specialProjectile.anims.play(Ability.SMOG)
            specialProjectile.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                specialProjectile.destroy()
              }
            )
            break

          case Ability.BITE:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "specials",
              `${Ability.NIGHT_SLASH}/000`
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            const finalCoordinates = transformAttackCoordinate(
              positionX + dx * 8,
              positionY + dy * 8
            )
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "specials",
              `${Ability.HURRICANE}/000`
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.HURRICANE)

            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.SPARKLING_ARIA:
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.SPARKLING_ARIA,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(3, 3)
            specialProjectile.anims.play(Ability.SPARKLING_ARIA)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(targetX, 9)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.SKY_ATTACK,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(1.5, 1.5)
            specialProjectile.anims.play(Ability.SKY_ATTACK)
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(targetX + 1, targetY + 1)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.ACROBATICS,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.ACROBATICS)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.ROLLOUT,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.ROLLOUT)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.VOLT_SWITCH:
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.MUD_BUBBLE:
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX + 3, targetY + 3)
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.ERUPTION,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.anims.play(Ability.ERUPTION)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

            selfCoordinates = transformAttackCoordinate(positionX, positionY)
            selfAnimation = this.scene.add.sprite(
              selfCoordinates[0],
              selfCoordinates[1],
              Ability.SPECTRAL_THIEF,
              "000"
            )
            selfAnimation.setDepth(7)
            selfAnimation.setScale(2, 2)
            selfAnimation.anims.play(Ability.SPECTRAL_THIEF)
            selfAnimation.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                selfAnimation.destroy()
              }
            )
            break

          case Ability.PLASMA_FIST:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.HYPER_VOICE:
            coordinatesTarget = transformAttackCoordinate(8, targetY)
            coordinates = transformAttackCoordinate(0, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.HYPER_VOICE,
              "0"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(2, 2)
            specialProjectile.anims.play(Ability.HYPER_VOICE)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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

          case Ability.SHELL_TRAP:
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.TRI_ATTACK,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.anims.play(Ability.TRI_ATTACK)
            this.scene.tweens.add({
              targets: specialProjectile,
              x: coordinatesTarget[0],
              y: coordinatesTarget[1],
              duration: 500,
              onComplete: () => {
                specialProjectile.destroy()
              }
            })
            break

          case Ability.BONEMERANG:
            coordinatesTarget = transformAttackCoordinate(targetX, 6)
            coordinates = transformAttackCoordinate(targetX, 0)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.BONEMERANG,
              "000"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(3, 3)
            specialProjectile.anims.play(Ability.BONEMERANG)
            this.scene.tweens.add({
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

          case Ability.AURORA_BEAM: {
            const [dx, dy] = OrientationVector[orientation]
            coordinates = transformAttackCoordinate(positionX, positionY)
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            const finalCoordinates = transformAttackCoordinate(
              positionX + dx * 8,
              positionY + dy * 8
            )
            specialProjectile = this.scene.add.sprite(
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
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            additionalProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            additionalProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            additionalProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            this.scene.tweens.add({
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
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            const finalCoordinates = transformAttackCoordinate(
              positionX + dx * 8,
              positionY + dy * 8
            )
            specialProjectile = this.scene.add.sprite(
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

            this.scene.tweens.add({
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

          case Ability.WATER_SHURIKEN: {
            coordinates = transformAttackCoordinate(positionX, positionY)
            const orientations = [
              orientation,
              OrientationArray[(OrientationArray.indexOf(orientation) + 1) % 8],
              OrientationArray[(OrientationArray.indexOf(orientation) + 7) % 8]
            ]
            orientations.forEach((orientation) => {
              const [dx, dy] = OrientationVector[orientation]
              const finalCoordinates = transformAttackCoordinate(
                positionX + dx * 8,
                positionY + dy * 8
              )
              const projectile = this.scene.add.sprite(
                coordinates[0],
                coordinates[1],
                "specials",
                `${Ability.WATER_SHURIKEN}/000`
              )
              projectile.setDepth(7)
              projectile.setScale(2)
              projectile.anims.play(Ability.WATER_SHURIKEN)
              this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "FIGHTING",
              "FIST"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(0.25)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "FIGHTING",
              "FOOT"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(0.25)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                const projectile = this.scene.add.sprite(
                  coordinates[0] +
                    Math.round(50 * Math.cos((Math.PI * 2 * i) / 3)),
                  coordinates[1] +
                    Math.round(50 * Math.sin((Math.PI * 2 * i) / 3)),
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "STRING_SHOT"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(0.25)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              "STRING_SHOT"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(0.25)
            specialProjectile.setTint(0x80a080)
            this.scene.tweens.add({
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(targetX, targetY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
            coordinates = transformAttackCoordinate(positionX, positionY)
            specialProjectile = this.scene.add.sprite(
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
          case Ability.LUSTER_PURGE: {
            const [dx, dy] = OrientationVector[orientation]
            coordinatesTarget = transformAttackCoordinate(targetX, targetY)
            coordinates = transformAttackCoordinate(positionX, positionY)
            const finalCoordinates = transformAttackCoordinate(
              positionX + dx * 8,
              positionY + dy * 8
            )
            specialProjectile = this.scene.add.sprite(
              coordinates[0],
              coordinates[1],
              Ability.MIST_BALL,
              "003"
            )
            specialProjectile.setDepth(7)
            specialProjectile.setScale(0.5)
            specialProjectile.anims.play(Ability.MIST_BALL)
            specialProjectile.setTint(
              skill === Ability.MIST_BALL ? 0xf0b0ff : 0xffffff
            )

            this.scene.tweens.add({
              targets: specialProjectile,
              x: finalCoordinates[0],
              y: finalCoordinates[1],
              ease: "linear",
              yoyo: false,
              duration: 1500,
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
    }
  }

  displayDamage(
    positionX: number,
    positionY: number,
    damage: number,
    type: AttackType,
    index: string,
    id: string
  ) {
    if (this.player.id === id) {
      const coordinates = transformAttackCoordinate(positionX, positionY)
      const color =
        type === AttackType.PHYSICAL
          ? "#e76e55"
          : type === AttackType.SPECIAL
          ? "#209cee"
          : "#f7d51d"
      this.displayTween(color, coordinates, index, damage)
    }
  }

  displayHeal(
    positionX: number,
    positionY: number,
    amount: number,
    type: HealType,
    index: string,
    id: string
  ) {
    if (this.player.id === id) {
      const coordinates = transformAttackCoordinate(positionX, positionY)
      const color = type === HealType.HEAL ? "#92cc41" : "#8d8d8d"
      this.displayTween(color, coordinates, index, amount)
    }
  }

  displayTween(
    color: string,
    coordinates: number[],
    index: string,
    amount: number
  ) {
    const fontSize =
      amount < 10
        ? "20px"
        : amount < 20
        ? "25px"
        : amount < 30
        ? "30px"
        : amount < 50
        ? "35px"
        : "40px"
    const textStyle = {
      fontSize: fontSize,
      fontFamily: "Verdana",
      color: color,
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const dy = Math.round(50 * (Math.random() - 0.5))

    const image = this.scene.add.existing(
      new GameObjects.Image(this.scene, 0, 0, `portrait-${index}`)
        .setScale(0.5, 0.5)
        .setOrigin(0, 0)
    )
    const text = this.scene.add.existing(
      new GameObjects.Text(this.scene, 25, 0, amount.toFixed(0), textStyle)
    )
    image.setDepth(9)
    text.setDepth(10)

    const container = this.scene.add.existing(
      new GameObjects.Container(
        this.scene,
        coordinates[0] + 30,
        coordinates[1] + dy,
        [text, image]
      )
    )

    this.scene.add.tween({
      targets: [container],
      ease: "linear",
      duration: 1500,
      delay: 0,
      x: {
        getStart: () => container.x,
        getEnd: () => container.x + Math.random() * 50
      },
      y: {
        getStart: () => container.y,
        getEnd: () => container.y + Math.random() * 50
      },
      scale: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: () => {
        container.destroy(true)
      }
    })
  }

  setPlayer(player: IPlayer) {
    if (player.id != this.player.id) {
      this.player = player
      this.group.getChildren().forEach((p) => {
        const pkm = p as Pokemon
        if (pkm.projectile) {
          pkm.projectile.destroy(true)
        }
      })
      this.group.clear(true, true)
      this.buildPokemons()
    }
  }
}
