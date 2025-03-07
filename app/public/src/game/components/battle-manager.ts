import { GameObjects } from "phaser"
import { getAttackTimings } from "../../../../core/attacking-state"
import { getMoveSpeed } from "../../../../core/pokemon-entity"
import Simulation from "../../../../core/simulation"
import Count from "../../../../models/colyseus-models/count"
import Player from "../../../../models/colyseus-models/player"
import Status from "../../../../models/colyseus-models/status"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import { IBoardEvent, IPokemonEntity } from "../../../../types"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../types/Config"
import { Ability } from "../../../../types/enum/Ability"
import { Effect } from "../../../../types/enum/Effect"
import {
  AttackType,
  HealType,
  Orientation,
  PokemonActionState,
  Stat
} from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import { Passive } from "../../../../types/enum/Passive"
import { AnimationConfig, PkmByIndex } from "../../../../types/enum/Pokemon"
import { max } from "../../../../utils/number"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import { displayAbility } from "./abilities-animations"
import PokemonSprite from "./pokemon"
import PokemonDetail from "./pokemon-detail"
import { pickRandomIn } from "../../../../utils/random"
import { displayBoost } from "./boosts-animations"
import type { NonFunctionPropNames } from "../../../../types/HelperTypes"
import { DEPTH } from "../depths"

export default class BattleManager {
  group: GameObjects.Group
  scene: GameScene
  simulation: Simulation | undefined
  animationManager: AnimationManager
  player: Player
  boardEventSprites: Array<GameObjects.Sprite | null>
  pokemonSprites: Map<string, PokemonSprite> = new Map()

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
    this.pokemonSprites = new Map()
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
      this.pokemonSprites.has(pokemon.id) === false
    ) {
      const coordinates = transformAttackCoordinate(
        pokemon.positionX,
        pokemon.positionY,
        this.flip
      )
      const pokemonUI = new PokemonSprite(
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
        pokemon.status.tree ? PokemonActionState.IDLE : PokemonActionState.WALK,
        this.flip
      )
      this.group.add(pokemonUI)
      this.pokemonSprites.set(pokemon.id, pokemonUI)
    }
  }

  clear() {
    this.group.getChildren().forEach((p) => {
      const pkm = p as PokemonSprite
      if (pkm.projectile) {
        pkm.projectile.destroy()
      }
    })
    this.group.clear(true, true)
    this.boardEventSprites = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null)
    this.pokemonSprites.clear()
  }

  removePokemon(simulationId: string, pokemon: IPokemonEntity) {
    if (
      this.simulation?.id == simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pokemonSprite = this.pokemonSprites.get(pokemon.id)!
      if (pokemon.passive === Passive.INANIMATE && pokemon.life > 0) {
        // pillar is thrown, skip death animation
        setTimeout(() => pokemonSprite.destroy(), 500)
      } else {
        this.animationManager.animatePokemon(
          pokemonSprite,
          PokemonActionState.HURT,
          this.flip
        )
        pokemonSprite.deathAnimation()
      }
    }
  }

  updatePokemonItems(simulationId: string, pokemon: IPokemonEntity) {
    if (
      this.simulation?.id === simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pkm = this.pokemonSprites.get(pokemon.id)!
      pkm.itemsContainer.render(pokemon.items)
    }
  }

  changeStatus(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: NonFunctionPropNames<Status>
  ) {
    if (pokemon.passive === Passive.INANIMATE) return // No animation for statuses for inanimate pokemons
    if (
      this.simulation?.id == simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pkm = this.pokemonSprites.get(pokemon.id)!
      if (field === "poisonStacks") {
        if (pokemon.status.poisonStacks > 0) {
          pkm.addPoison()
        } else {
          pkm.removePoison()
        }
      } else if (field === "sleep") {
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
      } else if (field === "burn") {
        if (pokemon.status.burn) {
          pkm.addBurn()
        } else {
          pkm.removeBurn()
        }
      } else if (field === "silence") {
        if (pokemon.status.silence) {
          pkm.addSilence()
        } else {
          pkm.removeSilence()
        }
      } else if (field === "fatigue") {
        if (pokemon.status.fatigue) {
          pkm.addFatigue()
        } else {
          pkm.removeFatigue()
        }
      } else if (field === "confusion") {
        if (pokemon.status.confusion) {
          pkm.addConfusion()
        } else {
          pkm.removeConfusion()
        }
      } else if (field === "freeze") {
        if (pokemon.status.freeze) {
          pkm.addFreeze()
        } else {
          pkm.removeFreeze()
        }
      } else if (field === "protect") {
        if (pokemon.status.protect) {
          pkm.addProtect()
        } else {
          pkm.removeProtect()
        }
      } else if (field === "skydiving") {
        if (pokemon.status.skydiving) {
          pkm.skydiveUp()
        } else {
          pkm.skydiveDown()
        }
      } else if (field === "wound") {
        if (pokemon.status.wound) {
          pkm.addWound()
        } else {
          pkm.removeWound()
        }
      } else if (field === "resurection") {
        if (pokemon.status.resurection) {
          pkm.addResurection()
        } else {
          pkm.removeResurection()
        }
      } else if (field === "resurecting") {
        if (pokemon.status.resurecting) {
          pkm.resurectAnimation()
        } else {
          pkm.animationLocked = false
        }
      } else if (field === "paralysis") {
        if (pokemon.status.paralysis) {
          pkm.addParalysis()
        } else {
          pkm.removeParalysis()
        }
      } else if (field === "pokerus") {
        if (pokemon.status.pokerus) {
          pkm.addPokerus()
        } else {
          pkm.removePokerus()
        }
      } else if (field === "locked") {
        if (pokemon.status.locked) {
          pkm.addLocked()
        } else {
          pkm.removeLocked()
        }
      } else if (field === "blinded") {
        if (pokemon.status.blinded) {
          pkm.addBlinded()
        } else {
          pkm.removeBlinded()
        }
      } else if (field === "armorReduction") {
        if (pokemon.status.armorReduction) {
          pkm.addArmorReduction()
        } else {
          pkm.removeArmorReduction()
        }
      } else if (field === "charm") {
        if (pokemon.status.charm) {
          pkm.addCharm()
        } else {
          pkm.removeCharm()
        }
      } else if (field === "flinch") {
        if (pokemon.status.flinch) {
          pkm.addFlinch()
        } else {
          pkm.removeFlinch()
        }
      } else if (field === "runeProtect") {
        if (pokemon.status.runeProtect) {
          pkm.addRuneProtect()
        } else {
          pkm.removeRuneProtect()
        }
      } else if (field === "curse") {
        if (pokemon.status.curse) {
          pkm.addCurse()
        } else {
          pkm.removeCurse()
        }
      } else if (field === "curseVulnerability") {
        if (pokemon.status.curseVulnerability) {
          pkm.addCurseVulnerability()
        }
      } else if (field === "curseWeakness") {
        if (pokemon.status.curseWeakness) {
          pkm.addCurseWeakness()
        }
      } else if (field === "curseTorment") {
        if (pokemon.status.curseTorment) {
          pkm.addCurseTorment()
        }
      } else if (field === "curseFate") {
        if (pokemon.status.curseFate) {
          pkm.addCurseFate()
        }
      } else if (field === "spikeArmor") {
        if (pokemon.status.spikeArmor) {
          pkm.addSpikeArmor()
        } else {
          pkm.removeSpikeArmor()
        }
      } else if (field === "magicBounce") {
        if (pokemon.status.magicBounce) {
          pkm.addMagicBounce()
        } else {
          pkm.removeMagicBounce()
        }
      } else if (field === "electricField") {
        if (pokemon.status.electricField) {
          pkm.addElectricField()
        } else {
          pkm.removeElectricField()
        }
      } else if (field === "psychicField") {
        if (pokemon.status.psychicField) {
          pkm.addPsychicField()
        } else {
          pkm.removePsychicField()
        }
      } else if (field === "grassField") {
        if (pokemon.status.grassField) {
          pkm.addGrassField()
        } else {
          pkm.removeGrassField()
        }
      } else if (field === "fairyField") {
        if (pokemon.status.fairyField) {
          pkm.addFairyField()
        } else {
          pkm.removeFairyField()
        }
      } else if (field === "enraged") {
        if (pokemon.status.enraged) {
          pkm.addRageEffect()
        } else {
          pkm.removeRageEffect()
        }
      }
    }
  }

  changeCount(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: NonFunctionPropNames<Count>,
    value: number,
    previousValue: number
  ) {
    // logger.debug(field, value);
    if (
      this.simulation?.id == simulationId &&
      this.group &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pkm = this.pokemonSprites.get(pokemon.id)!
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
            AnimationConfig[PkmByIndex[pkm.index]].ability,
            { flip: this.flip, lock: true, repeat: 0 }
          )
          pkm.specialAttackAnimation(this.group, value)
        }
      } else if (field === "fieldCount") {
        if (value != 0) {
          displayAbility(
            this.scene,
            [],
            "FIELD_DEATH",
            pkm.orientation,
            pkm.positionX,
            pkm.positionY,
            pkm.targetX ?? -1,
            pkm.targetY ?? -1,
            this.flip
          )
        }
      } else if (field == "fightingBlockCount") {
        if (value > 0 && value % 10 === 0) {
          displayAbility(
            this.scene,
            [],
            "FIGHTING_KNOCKBACK",
            pkm.orientation,
            pkm.positionX,
            pkm.positionY,
            pkm.targetX ?? -1,
            pkm.targetY ?? -1,
            this.flip
          )
        }
      } else if (field === "fairyCritCount") {
        if (value != 0) {
          displayAbility(
            this.scene,
            [],
            "FAIRY_CRIT",
            pkm.orientation,
            pkm.positionX,
            pkm.positionY,
            pkm.targetX ?? -1,
            pkm.targetY ?? -1,
            this.flip
          )
        }
      } else if (field === "powerLensCount") {
        if (value != 0) {
          displayAbility(
            this.scene,
            [],
            "POWER_LENS",
            pkm.orientation,
            pkm.positionX,
            pkm.positionY,
            pkm.targetX ?? -1,
            pkm.targetY ?? -1,
            this.flip
          )
        }
      } else if (field === "starDustCount") {
        if (value != 0) {
          displayAbility(
            this.scene,
            [],
            "STAR_DUST",
            pkm.orientation,
            pkm.positionX,
            pkm.positionY,
            pkm.targetX ?? -1,
            pkm.targetY ?? -1,
            this.flip
          )
        }
      } else if (field === "spellBlockedCount") {
        if (value != 0) {
          this.displayBlockedSpell(pkm.x, pkm.y)
        }
      } else if (field === "manaBurnCount") {
        if (value != 0) {
          this.displayManaBurn(pkm.x, pkm.y)
        }
      } else if (field === "moneyCount") {
        if (value > 0) {
          this.moneyAnimation(pkm.x, pkm.y, value - previousValue)
        }
      } else if (field === "amuletCoinCount") {
        if (value > 0) {
          pkm.itemsContainer.updateCount(Item.AMULET_COIN, value)
        }
      } else if (field === "bottleCapCount") {
        if (value > 0) {
          pkm.itemsContainer.updateCount(Item.GOLD_BOTTLE_CAP, value)
        }
      } else if (field === "attackCount") {
        if (value !== 0) {
          if (
            pkm.action == PokemonActionState.ATTACK &&
            pkm.targetX !== null &&
            pkm.targetY !== null
          ) {
            const { delayBeforeShoot, travelTime } = getAttackTimings(pokemon)
            pkm.attackAnimation(
              pokemon.targetX,
              pokemon.targetY,
              delayBeforeShoot,
              travelTime
            )
          }
        }
      } else if (field === "tripleAttackCount") {
        if (value !== 0) {
          this.displayTripleAttack(pkm.x, pkm.y)
        }
      } else if (field === "upgradeCount") {
        pkm.itemsContainer.updateCount(Item.UPGRADE, value)
      } else if (field === "soulDewCount") {
        pkm.itemsContainer.updateCount(Item.SOUL_DEW, value)
      } else if (field === "defensiveRibbonCount") {
        pkm.itemsContainer.updateCount(Item.DEFENSIVE_RIBBON, value)
      } else if (field === "magmarizerCount") {
        pkm.itemsContainer.updateCount(Item.MAGMARIZER, value)
      }
    }
  }

  changePokemon<F extends keyof IPokemonEntity>(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: F,
    value: IPokemonEntity[F],
    previousValue: IPokemonEntity[F]
  ) {
    if (
      this.simulation?.id == simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pkm = this.pokemonSprites.get(pokemon.id)!
      if (field === "positionX" || field === "positionY") {
        // logger.debug(pokemon.positionX, pokemon.positionY);
        if (field === "positionX") {
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
        } else if (!pokemon.status.skydiving) {
          pkm.moveManager.setSpeed(
            3 *
              getMoveSpeed(pokemon) *
              Math.max(
                Math.abs(pkm.x - coordinates[0]),
                Math.abs(pkm.y - coordinates[1])
              )
          )
          pkm.moveManager.moveTo(coordinates[0], coordinates[1])
        }
      } else if (
        field === "orientation" &&
        pkm.orientation !== pokemon.orientation
      ) {
        pkm.orientation = pokemon.orientation
        if (pokemon.action !== PokemonActionState.SLEEP) {
          this.animationManager.animatePokemon(pkm, pokemon.action, this.flip)
        }
      } else if (field === "action" && pkm.action !== pokemon.action) {
        pkm.action = pokemon.action
        this.animationManager.animatePokemon(pkm, pokemon.action, this.flip)
      } else if (field == "critChance") {
        pkm.critChance = pokemon.critChance
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.critChance.textContent =
            pokemon.critChance.toString() + "%"
        }
      } else if (field === "critPower") {
        pkm.critPower = parseFloat(pokemon.critPower.toFixed(2))
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.critPower.textContent = pokemon.critPower.toFixed(2)
        }
      } else if (field === "ap") {
        if (value && value > (previousValue || 0)) {
          this.displayBoost(Stat.AP, pkm.positionX, pkm.positionY)
        }
        pkm.ap = pokemon.ap
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.ap,
            previousValue as IPokemonEntity["ap"],
            value as IPokemonEntity["ap"]
          )
          pkm.detail.updateAbilityDescription(pkm)
          if (pokemon.passive != Passive.NONE) {
            pkm.detail.updatePassiveDescription(pokemon)
          }
        }
      } else if (field === "luck") {
        pkm.luck = pokemon.luck
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.luck,
            previousValue as IPokemonEntity["luck"],
            value as IPokemonEntity["luck"]
          )
          pkm.detail.updateAbilityDescription(pkm)
          if (pokemon.passive != Passive.NONE) {
            pkm.detail.updatePassiveDescription(pokemon)
          }
        }
      } else if (field === "speed") {
        if (value && value > (previousValue || 0)) {
          this.displayBoost(Stat.SPEED, pkm.positionX, pkm.positionY)
        }
        pkm.speed = pokemon.speed
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.speed.textContent = pokemon.speed.toString()
        }
      } else if (field === "hp") {
        const baseHP = getPokemonData(pokemon.name).hp
        const sizeBuff = (pokemon.hp - baseHP) / baseHP
        pkm.sprite.setScale(2 + sizeBuff)
        pkm.lifebar?.setMaxAmount(pokemon.hp)
      } else if (field == "life") {
        pkm.life = pokemon.life
        pkm.lifebar?.setAmount(pkm.life)
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.hp.textContent = pokemon.life.toString()
        }
      } else if (field === "shield") {
        if (pokemon.shield >= 0) {
          if (value && value > (previousValue || 0)) {
            this.displayBoost(Stat.SHIELD, pkm.positionX, pkm.positionY)
          }
          pkm.shield = pokemon.shield
          pkm.lifebar?.setShieldAmount(pkm.shield)
        }
      } else if (field === "pp") {
        pkm.pp = pokemon.pp
        pkm.powerbar?.setAmount(max(pkm.maxPP)(pkm.pp))
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.pp,
            previousValue as IPokemonEntity["pp"],
            value as IPokemonEntity["pp"]
          )
        }
      } else if (field === "atk") {
        if (value && value > (previousValue || 0)) {
          this.displayBoost(Stat.ATK, pkm.positionX, pkm.positionY)
        }
        pkm.atk = pokemon.atk
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.atk,
            previousValue as IPokemonEntity["atk"],
            value as IPokemonEntity["atk"]
          )
        }
      } else if (field === "def") {
        if (value && value > (previousValue || 0)) {
          this.displayBoost(Stat.DEF, pkm.positionX, pkm.positionY)
        }
        pkm.def = pokemon.def
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.def,
            previousValue as IPokemonEntity["def"],
            value as IPokemonEntity["def"]
          )
        }
      } else if (field === "speDef") {
        if (value && value > (previousValue || 0)) {
          this.displayBoost(Stat.SPE_DEF, pkm.positionX, pkm.positionY)
        }
        pkm.speDef = pokemon.speDef
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.speDef,
            previousValue as IPokemonEntity["speDef"],
            value as IPokemonEntity["speDef"]
          )
        }
      } else if (field === "range") {
        pkm.range = pokemon.range
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateValue(
            pkm.detail.range,
            previousValue as IPokemonEntity["range"],
            value as IPokemonEntity["range"]
          )
        }
      } else if (field === "targetX") {
        if (pokemon.targetX >= 0) {
          pkm.targetX = pokemon.targetX
        } else {
          pkm.targetX = null
        }
      } else if (field === "targetY") {
        if (pokemon.targetY >= 0) {
          pkm.targetY = pokemon.targetY
        } else {
          pkm.targetY = null
        }
      } else if (field === "team") {
        if (pkm.lifebar) {
          pkm.lifebar.setTeam(value as IPokemonEntity["team"], this.flip)
        }
      } else if (field === "index") {
        if (pkm.index !== value) {
          pkm.lazyloadAnimations(this.scene, true) // unload previous index animations
          pkm.index = value as IPokemonEntity["index"]
          pkm.lazyloadAnimations(this.scene) // load the new ones
          pkm.displayAnimation("EVOLUTION")
          this.animationManager.animatePokemon(
            pkm,
            PokemonActionState.IDLE,
            this.flip,
            false
          )
        }
      } else if (field === "shiny") {
        if (pkm.shiny !== value) {
          pkm.shiny = value as IPokemonEntity["shiny"]
          this.animationManager.animatePokemon(
            pkm,
            PokemonActionState.IDLE,
            this.flip,
            false
          )
        }
      } else if (field === "skill") {
        pkm.skill = value as IPokemonEntity["skill"]
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateAbilityDescription(pkm)
        }
      } else if (field === "stars") {
        pkm.stars = value as IPokemonEntity["stars"]
        if (pkm.detail && pkm.detail instanceof PokemonDetail) {
          pkm.detail.updateAbilityDescription(pkm)
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
    crit.setDepth(DEPTH.TEXT_MAJOR)
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
    const coords = transformAttackCoordinate(positionX, positionY, this.flip)
    displayBoost(this.scene, coords[0], coords[1], stat)
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
    crit.setDepth(DEPTH.TEXT)
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
    crit.setDepth(DEPTH.TEXT)
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
    blockedSpell.setDepth(DEPTH.TEXT)
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
    manaBurn.setDepth(DEPTH.TEXT)
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
    tripleAttack.setDepth(DEPTH.TEXT_MINOR)
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
    targetY?: number,
    delay?: number
  ) {
    if (this.simulation?.id === id && skill) {
      displayAbility(
        this.scene,
        this.group.getChildren() as PokemonSprite[],
        skill,
        orientation,
        positionX,
        positionY,
        targetX ?? -1,
        targetY ?? -1,
        this.flip,
        delay ?? -1
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

    if (event.effect === Effect.LIGHTNING_STRIKE) {
      const thunderSprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Ability.THUNDER}/000.png`
      )
      thunderSprite.setDepth(DEPTH.WEATHER_FX)
      thunderSprite.setScale(2, 2)
      thunderSprite.anims.play(Ability.THUNDER)
      thunderSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        thunderSprite.destroy()
      })
    }

    if (event.effect === Effect.SMOKE) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        "SMOKE/000.png"
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_AIR_LEVEL)
      sprite.anims.play(Effect.SMOKE)
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

    if (event.effect === Effect.POISON_GAS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Effect.SMOKE}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_AIR_LEVEL)
      sprite.setScale(3, 3)
      sprite.anims.play(Effect.SMOKE)
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

    if (event.effect === Effect.STEALTH_ROCKS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        "STEALTH_ROCKS/013.png"
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
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

    if (event.effect === Effect.SPIKES) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1] + 16,
        "abilities",
        "SPIKES/001.png"
      )
      sprite
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setOrigin(0.5, 0.5)
        .setScale(0, 0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 500,
        scaleX: 1,
        scaleY: 1
      })
    }

    if (event.effect === Effect.TOXIC_SPIKES) {
      const spriteNumber = pickRandomIn([0, 1, 2]).toString()
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1] + 16,
        "abilities",
        "TOXIC_SPIKES/00" + spriteNumber + ".png"
      )
      sprite
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setOrigin(0.5, 0.5)
        .setScale(0, 0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 500,
        scaleX: 2,
        scaleY: 2
      })
    }

    if (event.effect === Effect.STICKY_WEB) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Effect.STICKY_WEB}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_POKEMON_LEVEL)
      sprite.setScale(3, 3)
      sprite.anims.play(Effect.STICKY_WEB)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0.4,
        duration: 1000,
        delay: (8 - coordinates[1]) * 100
      })
    }

    if (event.effect === Effect.HAIL) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Effect.HAIL}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(1).setAlpha(0)
      sprite.anims.play(Effect.HAIL)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 800
      })
    }

    if (event.effect === Effect.EMBER) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1] + 12,
        "abilities",
        `${Effect.EMBER}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(2).setAlpha(0)
      sprite.anims.play(Effect.EMBER)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 800
      })
    }
  }

  clearBoardEvents() {
    this.boardEventSprites.forEach((sprite, index) => {
      if (sprite != null) {
        this.group.remove(sprite, true, true)
        this.boardEventSprites[index] = null
      }
    })
  }

  displayHit(x: number, y: number) {
    const hitSprite = this.scene.add.sprite(
      x + (Math.random() - 0.5) * 30,
      y + (Math.random() - 0.5) * 30,
      "attacks",
      "NORMAL/hit/000.png"
    )
    hitSprite.setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    hitSprite.setScale(2, 2)
    hitSprite.anims.play("NORMAL/hit")
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
    image.setDepth(DEPTH.DAMAGE_PORTRAIT)
    text.setDepth(DEPTH.DAMAGE_TEXT)

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
        getEnd: () => 0.5
      },
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
        delay: 800
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
