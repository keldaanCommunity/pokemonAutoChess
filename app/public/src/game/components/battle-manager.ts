/* eslint-disable no-case-declarations */
import { GameObjects } from "phaser"
import Pokemon from "./pokemon"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import GameScene from "../scenes/game-scene"
import {
  IBoardEvent,
  IPokemonEntity,
  NonFunctionPropNames
} from "../../../../types"
import AnimationManager from "../animation-manager"
import {
  AttackType,
  PokemonActionState,
  HealType,
  Orientation,
  BoardEvent,
  Stat
} from "../../../../types/enum/Game"
import { Ability } from "../../../../types/enum/Ability"
import { Item } from "../../../../types/enum/Item"
import Count from "../../../../models/colyseus-models/count"
import { AnimationConfig, Pkm } from "../../../../types/enum/Pokemon"
import Status from "../../../../models/colyseus-models/status"
import Simulation from "../../../../core/simulation"
import Player from "../../../../models/colyseus-models/player"
import { Effect } from "../../../../types/enum/Effect"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../types/Config"
import { Passive } from "../../../../types/enum/Passive"
import { displayAbility } from "./abilities-animations"

export default class BattleManager {
  group: GameObjects.Group
  scene: GameScene
  simulation: Simulation | undefined
  animationManager: AnimationManager
  player: Player
  boardEventSprites: Array<GameObjects.Sprite | null>

  constructor(
    scene: GameScene,
    group: GameObjects.Group,
    simulation: Simulation | undefined,
    animationManager: AnimationManager,
    player: Player
  ) {
    this.group = group
    this.scene = scene
    this.animationManager = animationManager
    this.player = player
    this.boardEventSprites = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null)
    if (simulation) this.setSimulation(simulation)
  }

  get flip() {
    return this.player.id !== this.simulation?.bluePlayerId
  }

  buildPokemons() {
    this.simulation?.blueTeam.forEach((pkm, key) => {
      this.simulation?.id &&
        this.addPokemonEntitySprite(this.simulation.id, pkm)
    })

    this.simulation?.redTeam.forEach((pkm, key) => {
      this.simulation?.id &&
        this.addPokemonEntitySprite(this.simulation.id, pkm)
    })
  }

  addPokemonEntitySprite(simulationId: string, pokemon: IPokemonEntity) {
    if (
      this.simulation?.id === simulationId &&
      !(this.group.getChildren() as Pokemon[]).find(
        (child) => child.id === pokemon.id
      )
    ) {
      const coordinates = transformAttackCoordinate(
        pokemon.positionX,
        pokemon.positionY,
        this.flip
      )
      const pokemonUI = new Pokemon(
        this.scene,
        coordinates[0],
        coordinates[1],
        pokemon,
        simulationId,
        true,
        this.flip
      )
      this.animationManager.animatePokemon(
        pokemonUI,
        PokemonActionState.WALK,
        this.flip
      )
      this.group.add(pokemonUI)
    }
  }

  clear() {
    this.group.getChildren().forEach((p) => {
      const pkm = p as Pokemon
      if (pkm.projectile) {
        pkm.projectile.destroy()
      }
    })
    this.group.clear(true, true)
    this.boardEventSprites = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null)
  }

  removePokemon(simulationId: string, pokemon: IPokemonEntity) {
    if (this.simulation?.id == simulationId) {
      this.group.getChildren().forEach((p) => {
        const pkm = <Pokemon>p
        if (pkm.id == pokemon.id) {
          this.animationManager.animatePokemon(
            pkm,
            PokemonActionState.HURT,
            this.flip
          )
          pkm.deathAnimation()
        }
      })
    }
  }

  updatePokemonItems(simulationId: string, pokemon: IPokemonEntity) {
    // logger.debug(change);
    if (this.simulation?.id === simulationId) {
      const children = this.group.getChildren()
      for (let i = 0; i < children.length; i++) {
        const pkm = <Pokemon>children[i]
        if (pkm.id == pokemon.id) {
          pkm.itemsContainer.render(pokemon.items)
          return
        }
      }
    }
  }

  changeStatus(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: NonFunctionPropNames<Status>
  ) {
    if (this.simulation?.id == simulationId && this.group) {
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
                PokemonActionState.SLEEP,
                this.flip
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
            } else {
              pkm.animationLocked = false
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
          } else if (field == "charm") {
            if (pokemon.status.charm) {
              pkm.addCharm()
            } else {
              pkm.removeCharm()
            }
          } else if (field == "flinch") {
            if (pokemon.status.flinch) {
              pkm.addFlinch()
            } else {
              pkm.removeFlinch()
            }
          } else if (field == "runeProtect") {
            if (pokemon.status.runeProtect) {
              pkm.addRuneProtect()
            } else {
              pkm.removeRuneProtect()
            }
          } else if (field == "curse") {
            if (pokemon.status.curse) {
              pkm.addCurse()
            } else {
              pkm.removeCurse()
            }
          } else if (field == "spikeArmor") {
            if (pokemon.status.spikeArmor) {
              pkm.addSpikeArmor()
            } else {
              pkm.removeSpikeArmor()
            }
          } else if (field == "magicBounce") {
            if (pokemon.status.magicBounce) {
              pkm.addMagicBounce()
            } else {
              pkm.removeMagicBounce()
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
    simulationId: string,
    pokemon: IPokemonEntity,
    field: NonFunctionPropNames<Count>,
    value: any,
    previousValue: any
  ) {
    // logger.debug(field, value);
    if (this.simulation?.id == simulationId && this.group) {
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
                AnimationConfig[pkm.name as Pkm].ability,
                { flip: this.flip, lock: true, repeat: 0 }
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
            if (value > 0) {
              this.moneyAnimation(pkm.x, pkm.y, value - previousValue)
            }
          } else if (field == "amuletCoinCount") {
            if (value > 0) {
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
                  PokemonActionState.ATTACK,
                  this.flip
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
          } else if (field == "magmarizerCount") {
            pkm.itemsContainer.updateCount(Item.MAGMARIZER, value)
          }
        }
      }
    }
  }

  changePokemon(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: string,
    value: any,
    previousValue: any
  ) {
    if (this.simulation?.id == simulationId && this.group) {
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
              pokemon.positionY,
              this.flip
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
              this.animationManager.animatePokemon(
                pkm,
                pokemon.action,
                this.flip
              )
            }
          } else if (field == "action") {
            pkm.action = pokemon.action
            this.animationManager.animatePokemon(pkm, value, this.flip)
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
            value > previousValue &&
              this.displayBoost(Stat.AP, pkm.positionX, pkm.positionY)
            pkm.ap = pokemon.ap
            if (pkm.detail) {
              pkm.detail.ap.textContent = pokemon.ap.toString()
              pkm.detail.updateAbilityDescription(pkm.skill, pkm.stars, pkm.ap)
              if (pokemon.passive != Passive.NONE) {
                pkm.detail.updatePassiveDescription(
                  pokemon.passive,
                  pkm.stars,
                  pkm.ap
                )
              }
            }
          } else if (field == "atkSpeed") {
            value > previousValue &&
              this.displayBoost(Stat.ATK_SPEED, pkm.positionX, pkm.positionY)
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
              value > previousValue &&
                this.displayBoost(Stat.SHIELD, pkm.positionX, pkm.positionY)
              pkm.shield = pokemon.shield
              pkm.lifebar?.setShieldAmount(pkm.shield)
            }
          } else if (field == "pp") {
            pkm.pp = pokemon.pp
            pkm.powerbar?.setAmount(pkm.pp)
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.pp, previousValue, value)
            }
          } else if (field == "atk") {
            value > previousValue &&
              this.displayBoost(Stat.ATK, pkm.positionX, pkm.positionY)
            pkm.atk = pokemon.atk
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.atk, previousValue, value)
            }
          } else if (field == "def") {
            value > previousValue &&
              this.displayBoost(Stat.DEF, pkm.positionX, pkm.positionY)
            pkm.def = pokemon.def
            if (pkm.detail) {
              pkm.detail.updateValue(pkm.detail.def, previousValue, value)
            }
          } else if (field == "speDef") {
            value > previousValue &&
              this.displayBoost(Stat.SPE_DEF, pkm.positionX, pkm.positionY)
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
            if (pkm.lifebar) {
              pkm.lifebar.setTeam(value, this.flip)
            }
          } else if (field === "index") {
            pkm.index = value
            this.animationManager.animatePokemon(
              pkm,
              PokemonActionState.IDLE,
              this.flip
            )
          } else if (field === "skill") {
            pkm.skill = value
            if (pkm.detail) {
              pkm.detail.updateAbilityDescription(pkm.skill, pkm.stars, pkm.ap)
            }
          } else if (field === "stars") {
            pkm.stars = value
            if (pkm.detail) {
              pkm.detail.updateAbilityDescription(pkm.skill, pkm.stars, pkm.ap)
            }
          }
          break
        }
      }
    }
  }

  moneyAnimation(x: number, y: number, gain: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FFFF00",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const crit = this.scene.add.existing(
      new GameObjects.Text(
        this.scene,
        x - 40,
        y - 50,
        `${gain > 0 ? "+ " : ""}${gain} GOLD`,
        textStyle
      )
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
        crit.destroy()
      }
    })
  }

  displayBoost(stat: Stat, positionX: number, positionY: number) {
    const coordinates = transformAttackCoordinate(
      positionX,
      positionY,
      this.flip
    )
    const boost = this.scene.add
      .sprite(
        coordinates[0],
        coordinates[1] - 10,
        "boosts",
        `BOOST_${stat}/000.png`
      )
      .setDepth(7)
      .setScale(2, 2)
    boost.anims.play(`BOOST_${stat}`)
    boost.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      boost.destroy()
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
        crit.destroy()
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
        crit.destroy()
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
        blockedSpell.destroy()
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
        manaBurn.destroy()
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
        tripleAttack.destroy()
      }
    })
  }

  displayAbility(
    id: string,
    skill: Ability | string,
    orientation: Orientation,
    positionX: number,
    positionY: number,
    targetX?: number,
    targetY?: number
  ) {
    if (this.simulation?.id === id && skill) {
      displayAbility(
        this.scene,
        this.group.getChildren() as Pokemon[],
        skill,
        orientation,
        positionX,
        positionY,
        targetX ?? -1,
        targetY ?? -1,
        this.flip
      )
    }
  }

  displayBoardEvent(event: IBoardEvent) {
    const coordinates = transformAttackCoordinate(event.x, event.y, this.flip)
    const index = event.y * BOARD_WIDTH + event.x

    const existingBoardEventSprite = this.boardEventSprites[index]
    if (existingBoardEventSprite != null) {
      this.group.remove(existingBoardEventSprite, true, true)
      this.boardEventSprites[index] = null
    }

    if (event.type === BoardEvent.LIGHTNING) {
      const thunderSprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Ability.THUNDER}/000.png`
      )
      thunderSprite.setDepth(7)
      thunderSprite.setScale(2, 2)
      thunderSprite.anims.play(Ability.THUNDER)
      thunderSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        thunderSprite.destroy()
      })
    }

    if (event.type === BoardEvent.GAS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Effect.GAS,
        "000"
      )
      sprite.setDepth(7)
      sprite.anims.play(Effect.GAS)
      sprite.setScale(3, 3)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 500
      })
    }

    if (event.type === BoardEvent.POISON_GAS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Effect.GAS,
        "000"
      )
      sprite.setDepth(7)
      sprite.setScale(3, 3)
      sprite.anims.play(Effect.GAS)
      sprite.setTint(0xa0ff20)
      sprite.setFlipX(true)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0.5,
        duration: 500,
        delay: (8 - coordinates[1]) * 100
      })
    }

    if (event.type === BoardEvent.STEALTH_ROCKS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        Effect.STEALTH_ROCKS,
        "013"
      )
      sprite.setDepth(1)
      sprite.setScale(1, 1)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 1000
      })
    }
  }

  displayHit(x: number, y: number) {
    const hitSprite = this.scene.add.sprite(
      x + (Math.random() - 0.5) * 30,
      y + (Math.random() - 0.5) * 30,
      "HIT_NEUTRAL",
      "000"
    )
    hitSprite.setDepth(7)
    hitSprite.setScale(2, 2)
    hitSprite.anims.play("HIT_NEUTRAL")
    hitSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      hitSprite.destroy()
    })
  }

  displayDamage(
    positionX: number,
    positionY: number,
    damage: number,
    type: AttackType,
    index: string,
    id: string
  ) {
    if (this.simulation?.id === id) {
      const coordinates = transformAttackCoordinate(
        positionX,
        positionY,
        this.flip
      )
      const color =
        type === AttackType.PHYSICAL
          ? "#e76e55"
          : type === AttackType.SPECIAL
          ? "#209cee"
          : "#f7d51d"
      this.displayTween(color, coordinates, index, damage)
      this.displayHit(coordinates[0], coordinates[1])
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
    if (this.simulation?.id === id) {
      const coordinates = transformAttackCoordinate(
        positionX,
        positionY,
        this.flip
      )
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
    if (!this.scene.sys.displayList) return // prevents an exception
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
        container.destroy()
      }
    })
  }

  setSimulation(simulation: Simulation) {
    this.simulation = simulation
    this.clear()
    this.buildPokemons()
  }

  setPlayer(player: Player) {
    this.player = player
  }
}
