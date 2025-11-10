import { GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../config"
import { getAttackTimings } from "../../../../core/attacking-state"
import { getMoveSpeed } from "../../../../core/pokemon-entity"
import Simulation from "../../../../core/simulation"
import Count from "../../../../models/colyseus-models/count"
import Player from "../../../../models/colyseus-models/player"
import { FalinksTrooper } from "../../../../models/colyseus-models/pokemon"
import Status from "../../../../models/colyseus-models/status"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import { IBoardEvent, IPokemonEntity } from "../../../../types"
import { Ability } from "../../../../types/enum/Ability"
import { EffectEnum } from "../../../../types/enum/Effect"
import {
  AttackType,
  HealType,
  Orientation,
  PokemonActionState,
  PokemonTint,
  Stat
} from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import { Passive } from "../../../../types/enum/Passive"
import { Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import type { NonFunctionPropNames } from "../../../../types/HelperTypes"
import { isOnBench } from "../../../../utils/board"
import { max } from "../../../../utils/number"
import { OrientationVector } from "../../../../utils/orientation"
import { pickRandomIn } from "../../../../utils/random"
import { GamePokemonDetailDOMWrapper } from "../../pages/component/game/game-pokemon-detail"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import { DEPTH } from "../depths"
import GameScene from "../scenes/game-scene"
import { displayAbility, displayHit } from "./abilities-animations"
import PokemonSprite from "./pokemon"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "./pokemon-animations"

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
        this.addPokemonEntitySprite(
          this.simulation.id,
          pkm,
          this.simulation.bluePlayerId
        )
    })

    this.simulation?.redTeam.forEach((pkm, key) => {
      this.simulation?.id &&
        this.addPokemonEntitySprite(
          this.simulation.id,
          pkm,
          this.simulation.redPlayerId
        )
    })
  }

  addPokemonEntitySprite(
    simulationId: string,
    pokemon: IPokemonEntity,
    playerId: string
  ) {
    if (
      this.simulation?.id === simulationId &&
      this.pokemonSprites.has(pokemon.id) === false
    ) {
      const coordinates = transformEntityCoordinates(
        pokemon.positionX,
        pokemon.positionY,
        this.flip
      )
      const pokemonUI = new PokemonSprite(
        this.scene,
        coordinates[0],
        coordinates[1],
        pokemon,
        playerId,
        true,
        this.flip
      )
      pokemonUI.setVisible(this.simulation?.started ?? false)

      this.group.add(pokemonUI)
      this.pokemonSprites.set(pokemon.id, pokemonUI)
      if (pokemon.name === Pkm.FALINKS_BRASS) {
        this.addTroopers(pokemon, pokemonUI, simulationId)
      }
      if (pokemon.action === PokemonActionState.BLOSSOM) {
        pokemonUI.blossomAnimation()
      } else {
        this.animationManager.animatePokemon(
          pokemonUI,
          pokemon.status.tree
            ? PokemonActionState.IDLE
            : PokemonActionState.WALK,
          this.flip
        )
      }
    }
  }

  clear() {
    this.group.clear(true, true)
    this.boardEventSprites = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null)
    this.pokemonSprites.clear()
    this.closeTooltips()
  }

  closeTooltips() {
    this.pokemonSprites.forEach((pokemon) => {
      if (pokemon.detail) {
        pokemon.closeDetail()
      }
    })
  }

  removePokemon(simulationId: string, pokemon: IPokemonEntity) {
    if (
      this.simulation?.id == simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pokemonSprite = this.pokemonSprites.get(pokemon.id)!
      if (pokemon.passive === Passive.INANIMATE && pokemon.hp > 0) {
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
    field: NonFunctionPropNames<Status>,
    previousValue: any
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
      } else if (field === "resurrection") {
        if (pokemon.status.resurrection) {
          pkm.addResurrection()
        } else {
          pkm.removeResurrection()
        }
      } else if (field === "resurrecting") {
        if (pokemon.status.resurrecting) {
          pkm.resurrectAnimation()
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
      } else if (field === "possessed") {
        if (pokemon.status.possessed) {
          pkm.addPossessed()
        } else if (previousValue === true) {
          pkm.removePossessed()
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
          pkm.addReflectShieldAnim()
        } else {
          pkm.removeReflectShieldAnim()
        }
      } else if (field === "magicBounce") {
        if (pokemon.status.magicBounce) {
          pkm.addReflectShieldAnim(0xffa0ff)
        } else {
          pkm.removeReflectShieldAnim()
        }
      } else if (field === "reflect") {
        if (pokemon.status.reflect) {
          pkm.addReflectShieldAnim(0xff3030)
        } else {
          pkm.removeReflectShieldAnim()
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
        } else if (previousValue === true) {
          pkm.removeRageEffect(pokemon.items.has(Item.BERSERK_GENE))
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
      this.scene.sys.isActive() &&
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
          pkm.specialAttackAnimation(pokemon)
        }
        pkm.itemsContainer.updateCount(Item.AQUA_EGG, value)
      } else if (field === "fieldCount") {
        if (value != 0) {
          this.displayAbilityOnPokemon("FIELD_DEATH", pkm)
        }
      } else if (field == "fightingBlockCount") {
        if (value > 0 && value % 10 === 0) {
          this.displayAbilityOnPokemon("FIGHTING_KNOCKBACK", pkm)
        }
      } else if (field === "fairyCritCount") {
        if (value != 0) {
          this.displayAbilityOnPokemon("FAIRY_CRIT", pkm)
        }
      } else if (field === "starDustCount") {
        if (value !== 0) {
          this.displayAbilityOnPokemon("STAR_DUST", pkm)
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
          this.scene.displayMoneyGain(pkm.x, pkm.y, value - previousValue)
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
        pkm.itemsContainer.updateCount(Item.MUSCLE_BAND, value)
      }
    }
  }

  changePokemon<F extends keyof IPokemonEntity>(
    simulationId: string,
    pokemon: IPokemonEntity,
    field: F,
    value: IPokemonEntity[F],
    previousValue?: IPokemonEntity[F]
  ) {
    if (
      this.scene.sys.isActive() &&
      this.simulation?.id == simulationId &&
      this.pokemonSprites.has(pokemon.id)
    ) {
      const pkmSprite = this.pokemonSprites.get(pokemon.id)!
      if (field === "positionX" || field === "positionY") {
        // logger.debug(pokemon.positionX, pokemon.positionY);
        if (field === "positionX") {
          pkmSprite.positionX = pokemon.positionX
        } else if (field == "positionY") {
          pkmSprite.positionY = pokemon.positionY
        }
        const coordinates = transformEntityCoordinates(
          pokemon.positionX,
          pokemon.positionY,
          this.flip
        )
        if (pokemon.skill == Ability.TELEPORT) {
          pkmSprite.x = coordinates[0]
          pkmSprite.y = coordinates[1]
          pkmSprite.specialAttackAnimation(pokemon)
        } else if (!pokemon.status.skydiving) {
          const walkingSpeed =
            2 *
            getMoveSpeed(pokemon) *
            Math.max(
              Math.abs(pkmSprite.x - coordinates[0]),
              Math.abs(pkmSprite.y - coordinates[1])
            )
          pkmSprite.moveManager.setSpeed(walkingSpeed)
          pkmSprite.moveManager.moveTo(coordinates[0], coordinates[1])
          if (pkmSprite.troopers) {
            const [dx, dy] = OrientationVector[pkmSprite.orientation]
            pkmSprite.troopers.forEach((trooper, i) => {
              trooper.moveManager.setSpeed(walkingSpeed)
              trooper.moveManager.moveTo(
                coordinates[0] - dx * (i + 1) * 20,
                coordinates[1] - dy * (i + 1) * 20
              )
            })
          }
        }
      } else if (
        field === "orientation" &&
        pkmSprite.orientation !== pokemon.orientation
      ) {
        pkmSprite.orientation = pokemon.orientation
        if (pokemon.action !== PokemonActionState.SLEEP) {
          this.animationManager.animatePokemon(
            pkmSprite,
            pokemon.action,
            this.flip
          )
        }
        if (pkmSprite.troopers) {
          const [dx, dy] = OrientationVector[pkmSprite.orientation]
          const coordinates = transformEntityCoordinates(
            pokemon.positionX,
            pokemon.positionY,
            this.flip
          )
          pkmSprite.troopers.forEach((trooper, i) => {
            trooper.moveManager.setSpeed(5)
            trooper.moveManager.moveTo(
              coordinates[0] - dx * (i + 1) * 20,
              coordinates[1] - dy * (i + 1) * 20
            )
          })
        }
      } else if (field === "action" && pkmSprite.action !== pokemon.action) {
        pkmSprite.action = pokemon.action
        this.animationManager.animatePokemon(
          pkmSprite,
          pokemon.action,
          this.flip
        )
      } else if (field === "ap") {
        if (previousValue != null && value && value > previousValue) {
          pkmSprite.displayBoost(Stat.AP)
        }
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "speed") {
        if (previousValue != null && value && value > previousValue) {
          pkmSprite.displayBoost(Stat.SPEED)
        }
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "maxHP") {
        const baseHP = getPokemonData(pokemon.name).hp
        const sizeBuff = (pokemon.maxHP - baseHP) / baseHP
        pkmSprite.sprite.setScale(2 + sizeBuff)
        pkmSprite.lifebar?.setMaxHp(pokemon.maxHP)
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field == "hp") {
        pkmSprite.lifebar?.setHp(Number(value))
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "shield") {
        if (pokemon.shield >= 0) {
          if (previousValue != null && value && value > previousValue) {
            pkmSprite.displayBoost(Stat.SHIELD)
          }
          pkmSprite.lifebar?.setShield(Number(value))
          if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
            pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
          }
        }
      } else if (field === "pp") {
        pkmSprite.lifebar?.setPP(
          max(pokemon.maxPP)(value as IPokemonEntity["pp"])
        )
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "atk") {
        if (previousValue != null && value && value > previousValue) {
          pkmSprite.displayBoost(Stat.ATK)
        }
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "def") {
        if (previousValue != null && value && value > previousValue) {
          pkmSprite.displayBoost(Stat.DEF)
        }
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "speDef") {
        if (previousValue != null && value && value > previousValue) {
          pkmSprite.displayBoost(Stat.SPE_DEF)
        }
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      } else if (field === "targetX") {
        if (pokemon.targetX >= 0) {
          pkmSprite.targetX = pokemon.targetX
        } else {
          pkmSprite.targetX = null
        }
      } else if (field === "targetY") {
        if (pokemon.targetY >= 0) {
          pkmSprite.targetY = pokemon.targetY
        } else {
          pkmSprite.targetY = null
        }
      } else if (field === "team") {
        if (pkmSprite.lifebar) {
          pkmSprite.lifebar.setTeam(value as IPokemonEntity["team"], this.flip)
        }
      } else if (field === "index") {
        if (pkmSprite.pokemon.index !== value) {
          // transformation or evolution mid-fight
          // unload previous index animations
          pkmSprite.unloadAnimations(
            this.scene,
            previousValue as IPokemonEntity["index"],
            pkmSprite.pokemon.shiny ? PokemonTint.SHINY : PokemonTint.NORMAL // previous tint is still used here, this is the one we need to unload
          )
          pkmSprite.attackSprite =
            PokemonAnimations[PkmByIndex[value as string]]?.attackSprite ??
            pkmSprite.attackSprite
          // load the new ones
          pkmSprite.lazyloadAnimations(this.scene).then(() => {
            pkmSprite.displayAnimation("EVOLUTION")
            this.animationManager.animatePokemon(
              pkmSprite,
              pkmSprite.pokemon.action,
              this.flip,
              false
            )
          })
        }
      } else if (field === "shiny") {
        if (pkmSprite.pokemon.shiny !== value) {
          this.animationManager.animatePokemon(
            pkmSprite,
            PokemonActionState.IDLE,
            this.flip,
            false
          )
        }
      } else if (
        field === "skill" ||
        field === "stars" ||
        field === "critChance" ||
        field === "critPower" ||
        field === "luck" ||
        field === "range" ||
        field === "stacks" ||
        field === "stacksRequired"
      ) {
        if (pkmSprite.detail instanceof GamePokemonDetailDOMWrapper) {
          pkmSprite.detail.updatePokemon(pkmSprite.pokemon)
        }
      }
    }
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

  displayAbility(args: {
    id: string
    skill: Ability | string
    ap?: number
    orientation: Orientation
    positionX: number
    positionY: number
    targetX?: number
    targetY?: number
    delay?: number
  }) {
    if (this.simulation?.id === args.id && args.skill) {
      displayAbility({
        scene: this.scene,
        pokemonsOnBoard: this.group.getChildren() as PokemonSprite[],
        ability: args.skill,
        ap: args.ap ?? 0,
        orientation: args.orientation,
        positionX: args.positionX,
        positionY: args.positionY,
        targetX: args.targetX ?? -1,
        targetY: args.targetY ?? -1,
        flip: this.flip,
        delay: args.delay ?? -1
      })
    }
  }

  displayAbilityOnPokemon(ability: Ability | string, pkmSprite: PokemonSprite) {
    displayAbility({
      scene: this.scene,
      pokemonsOnBoard: [],
      ability,
      ap: pkmSprite.pokemon.ap,
      orientation: pkmSprite.orientation,
      positionX: pkmSprite.positionX,
      positionY: pkmSprite.positionY,
      targetX: pkmSprite.targetX ?? -1,
      targetY: pkmSprite.targetY ?? -1,
      flip: this.flip
    })
  }

  displayBoardEvent(event: IBoardEvent) {
    const coordinates = transformEntityCoordinates(event.x, event.y, this.flip)
    const index = event.y * BOARD_WIDTH + event.x

    const existingBoardEventSprite = this.boardEventSprites[index]
    if (existingBoardEventSprite != null) {
      this.group.remove(existingBoardEventSprite, true, true)
      this.boardEventSprites[index] = null
    }

    if (event.effect === EffectEnum.LIGHTNING_STRIKE) {
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

    if (event.effect === EffectEnum.SMOKE) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        "SMOKE/000.png"
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_AIR_LEVEL)
      sprite.anims.play(EffectEnum.SMOKE)
      sprite.setScale(3, 3)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0.8,
        duration: 500
      })
    }

    if (event.effect === EffectEnum.POISON_GAS) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${EffectEnum.SMOKE}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_AIR_LEVEL)
      sprite.setScale(3, 3)
      sprite.anims.play(EffectEnum.SMOKE)
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

    if (event.effect === EffectEnum.STEALTH_ROCKS) {
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

    if (event.effect === EffectEnum.SPIKES) {
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

    if (event.effect === EffectEnum.TOXIC_SPIKES) {
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

    if (event.effect === EffectEnum.STICKY_WEB) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${EffectEnum.STICKY_WEB}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_POKEMON_LEVEL)
      sprite.setScale(3, 3)
      sprite.anims.play(EffectEnum.STICKY_WEB)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0.4,
        duration: 1000
      })
    }

    if (event.effect === EffectEnum.COTTON_BALL) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${Ability.COTTON_SPORE}/025.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
      sprite.setScale(2, 2)
      sprite.setAlpha(0)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0.5,
        duration: 1000
      })
    }

    if (event.effect === EffectEnum.HAIL) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        `${EffectEnum.HAIL}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(1).setAlpha(0)
      sprite.anims.play(EffectEnum.HAIL)
      this.boardEventSprites[index] = sprite
      this.group.add(sprite)

      this.scene.tweens.add({
        targets: sprite,
        alpha: 1,
        duration: 200,
        delay: 800
      })
    }

    if (event.effect === EffectEnum.EMBER) {
      const sprite = this.scene.add.sprite(
        coordinates[0],
        coordinates[1] + 12,
        "abilities",
        `${EffectEnum.EMBER}/000.png`
      )
      sprite.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(2).setAlpha(0)
      sprite.anims.play(EffectEnum.EMBER)
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

  displayDamage({
    x,
    y,
    amount,
    type,
    index,
    id
  }: {
    x: number
    y: number
    amount: number
    type: AttackType
    index: string
    id: string
  }) {
    if (this.simulation?.id === id) {
      const coordinates = transformEntityCoordinates(x, y, this.flip)
      const color =
        type === AttackType.PHYSICAL
          ? "#e76e55" // should be the same than var(--color-physical) but phaser cant use css variables
          : type === AttackType.SPECIAL
            ? "#5f9ff9" // should be the same than var(--color-special) but phaser cant use css variables
            : "#f7d51d" // should be the same than var(--color-true) but phaser cant use css variables
      this.displayTween(color, coordinates, index, amount)
      displayHit(
        this.scene,
        PokemonAnimations[PkmByIndex[index]]?.hitSprite ??
          DEFAULT_POKEMON_ANIMATION_CONFIG.hitSprite,
        coordinates[0],
        coordinates[1],
        this.flip
      )
    }
  }

  displayHeal({
    x,
    y,
    amount,
    type,
    index,
    id
  }: {
    type: HealType
    id: string
    x: number
    y: number
    index: string
    amount: number
  }) {
    if (this.simulation?.id === id) {
      const coordinates = transformEntityCoordinates(x, y, this.flip)
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

  onSimulationStart() {
    this.pokemonSprites.forEach((pkm) => {
      pkm.setVisible(true)
    })
  }

  setPlayer(player: Player) {
    this.player = player
  }

  addTroopers(
    trooperBrass: IPokemonEntity,
    trooperBrassSprite: PokemonSprite,
    simulationId: string
  ) {
    const troopersBenchSprites = [
      ...this.scene.board!.pokemons.values()
    ].filter((p) => p.name === Pkm.FALINKS_TROOPER && isOnBench(p))

    if (trooperBrassSprite.troopers) {
      trooperBrassSprite.troopers?.forEach((s) => s.destroy())
    }
    trooperBrassSprite.troopers = []
    troopersBenchSprites.forEach((sprite, i) => {
      sprite.setAlpha(0.5)

      const coordinates = transformEntityCoordinates(
        trooperBrass.positionX,
        trooperBrass.positionY,
        this.flip
      )
      const trooperInBattle = new FalinksTrooper(
        Pkm.FALINKS_TROOPER,
        trooperBrass.shiny,
        trooperBrass.emotion
      )
      const trooperSprite = new PokemonSprite(
        this.scene,
        coordinates[0] + (i + 1) * 20,
        coordinates[1],
        trooperInBattle,
        simulationId,
        true,
        this.flip
      )
      trooperSprite.setDepth(DEPTH.POKEMON_TROOPER)
      trooperBrassSprite.troopers?.push(trooperSprite)
      trooperSprite.setScale(0)
      this.scene.tweens.add({
        targets: trooperSprite,
        scale: 1,
        duration: 500,
        ease: "Power2"
      })

      this.scene.animationManager?.animatePokemon(
        trooperSprite,
        PokemonActionState.IDLE,
        this.flip
      )
      this.group.add(trooperSprite)
      this.pokemonSprites.set(trooperInBattle.id, trooperSprite)
    })
  }
}
