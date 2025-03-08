import { SetSchema } from "@colyseus/schema"
import Phaser, { GameObjects } from "phaser"
import type MoveTo from "phaser3-rex-plugins/plugins/moveto"
import type MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin"
import PokemonFactory from "../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import {
  AttackSprite,
  AttackSpriteScale,
  type Emotion,
  type IPokemon,
  type IPokemonEntity,
  instanceofPokemonEntity
} from "../../../../types"
import {
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_POWER
} from "../../../../types/Config"
import { Ability } from "../../../../types/enum/Ability"
import {
  type AttackType,
  Orientation,
  PokemonActionState,
  PokemonTint,
  type Rarity,
  SpriteType,
  type Team
} from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import type { Passive } from "../../../../types/enum/Passive"
import { AnimationConfig, Pkm } from "../../../../types/enum/Pokemon"
import type { Synergy } from "../../../../types/enum/Synergy"
import { clamp, min } from "../../../../utils/number"
import { chance } from "../../../../utils/random"
import { values } from "../../../../utils/schemas"
import { transformAttackCoordinate } from "../../pages/utils/utils"
import { preference } from "../../preferences"
import type { DebugScene } from "../scenes/debug-scene"
import type GameScene from "../scenes/game-scene"
import { displayAbility } from "./abilities-animations"
import DraggableObject from "./draggable-object"
import ItemsContainer from "./items-container"
import Lifebar from "./life-bar"
import PokemonDetail from "./pokemon-detail"
import type { GameDialog } from "./game-dialog"
import PowerBar from "./power-bar"
import { DEPTH } from "../depths"
import { logger } from "../../../../utils/logger"

const spriteCountPerPokemon = new Map<string, number>()

export default class PokemonSprite extends DraggableObject {
  evolution: Pkm
  rarity: Rarity
  emotion: Emotion
  shiny: boolean
  index: string
  id: string
  hp: number
  range: number
  critChance: number
  atk: number
  def: number
  speDef: number
  attackType: AttackType
  speed: number
  targetX: number | null
  targetY: number | null
  skill: Ability
  passive: Passive
  positionX: number
  positionY: number
  attackSprite: AttackSprite
  team: number | undefined
  critPower: number
  ap: number
  life: number | undefined
  shield: number | undefined
  projectile: GameObjects.Sprite | undefined
  itemsContainer: ItemsContainer
  orientation: Orientation
  action: PokemonActionState
  moveManager: MoveTo
  rangeType: string
  types = new Set<Synergy>()
  lifebar: Lifebar | undefined
  detail: PokemonDetail | GameDialog | null = null
  pp: number | undefined
  maxPP: number
  luck: number
  powerbar: PowerBar | undefined
  sprite: GameObjects.Sprite
  shadow?: GameObjects.Sprite
  wound: GameObjects.Sprite | undefined
  burn: GameObjects.Sprite | undefined
  sleep: GameObjects.Sprite | undefined
  silence: GameObjects.Sprite | undefined
  fatigue: GameObjects.Sprite | undefined
  freeze: GameObjects.Sprite | undefined
  confusion: GameObjects.Sprite | undefined
  paralysis: GameObjects.Sprite | undefined
  pokerus: GameObjects.Sprite | undefined
  locked: GameObjects.Sprite | undefined
  blinded: GameObjects.Sprite | undefined
  armorReduction: GameObjects.Sprite | undefined
  charm: GameObjects.Sprite | undefined
  flinch: GameObjects.Sprite | undefined
  curse: GameObjects.Sprite | undefined
  poison: GameObjects.Sprite | undefined
  protect: GameObjects.Sprite | undefined
  resurection: GameObjects.Sprite | undefined
  runeProtect: GameObjects.Sprite | undefined
  spikeArmor: GameObjects.Sprite | undefined
  magicBounce: GameObjects.Sprite | undefined
  electricField: GameObjects.Sprite | undefined
  psychicField: GameObjects.Sprite | undefined
  grassField: GameObjects.Sprite | undefined
  fairyField: GameObjects.Sprite | undefined
  curseVulnerability: GameObjects.Sprite | undefined
  curseWeakness: GameObjects.Sprite | undefined
  curseTorment: GameObjects.Sprite | undefined
  curseFate: GameObjects.Sprite | undefined
  light: GameObjects.Sprite | undefined
  stars: number
  stages: number
  playerId: string
  shouldShowTooltip: boolean
  flip: boolean
  animationLocked: boolean /* will prevent another anim to play before current one is completed */ = false
  skydiving: boolean = false
  meal: Item | "" = ""
  mealSprite: GameObjects.Sprite | undefined
  inBattle: boolean = false

  constructor(
    scene: GameScene | DebugScene,
    x: number,
    y: number,
    pokemon: IPokemonEntity | IPokemon,
    playerId: string,
    inBattle: boolean,
    flip: boolean
  ) {
    super(scene, x, y, 75, 75, playerId !== scene.uid)
    this.flip = flip
    this.playerId = playerId
    this.shouldShowTooltip = true
    this.stars = pokemon.stars
    this.stages = getPokemonData(pokemon.name).stages
    this.evolution = instanceofPokemonEntity(pokemon)
      ? Pkm.DEFAULT
      : (pokemon as IPokemon).evolution
    this.emotion = pokemon.emotion
    this.shiny = pokemon.shiny
    this.height = 0
    this.width = 0
    this.index = pokemon.index
    this.name = pokemon.name
    this.rarity = pokemon.rarity
    this.id = pokemon.id
    this.hp = pokemon.hp
    this.range = pokemon.range
    this.critChance = DEFAULT_CRIT_CHANCE
    this.atk = pokemon.atk
    this.def = pokemon.def
    this.speDef = pokemon.speDef
    this.attackType = pokemon.attackType
    this.types = new Set(values(pokemon.types))
    this.maxPP = pokemon.maxPP
    this.speed = pokemon.speed
    this.targetX = null
    this.targetY = null
    this.skill = pokemon.skill
    this.passive = pokemon.passive
    this.positionX = pokemon.positionX
    this.positionY = pokemon.positionY
    this.attackSprite = pokemon.attackSprite
    this.ap = pokemon.ap
    this.luck = pokemon.luck
    this.inBattle = inBattle
    if (this.range > 1) {
      this.rangeType = "range"
    } else {
      this.rangeType = "melee"
    }
    const m = <MoveToPlugin>scene.plugins.get("rexMoveTo")
    this.moveManager = m.add(this, {
      speed: 300,
      rotateToTarget: false
    })

    this.lazyloadAnimations(scene)

    const p = <IPokemonEntity>pokemon
    if (p.orientation) {
      this.orientation = p.orientation
      this.action = p.action
    } else {
      this.orientation = Orientation.DOWNLEFT
      this.action = PokemonActionState.IDLE
    }

    const textureIndex = scene.textures.exists(this.index) ? this.index : "0000"
    this.sprite = new GameObjects.Sprite(
      scene,
      0,
      0,
      textureIndex,
      `${PokemonTint.NORMAL}/${PokemonActionState.IDLE}/${SpriteType.ANIM}/${Orientation.DOWN}/0000`
    )
    const baseHP = getPokemonData(pokemon.name).hp
    const sizeBuff = (pokemon.hp - baseHP) / baseHP
    this.sprite.setScale(2 + sizeBuff).setDepth(DEPTH.POKEMON)
    this.sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.animationLocked = false
      // go back to idle anim if no more animation in queue
      scene.animationManager?.animatePokemon(this, pokemon.action, this.flip)
    })
    this.height = this.sprite.height
    this.width = this.sprite.width
    this.itemsContainer = new ItemsContainer(
      scene,
      p.items ?? new SetSchema(),
      this.width / 2 + 25,
      -35,
      this.id,
      playerId
    )
    const hasShadow = AnimationConfig[pokemon.name]?.noShadow !== true
    if (hasShadow) {
      this.shadow = new GameObjects.Sprite(scene, 0, 5, textureIndex)
      this.shadow.setScale(2, 2).setDepth(DEPTH.POKEMON_SHADOW)
      this.add(this.shadow)
    }
    this.add(this.sprite)

    if (instanceofPokemonEntity(pokemon)) {
      if (p.status.light) {
        this.addLight()
      }
      if (p.status.electricField) {
        this.addElectricField()
      }
      if (p.status.psychicField) {
        this.addPsychicField()
      }
      if (p.status.grassField) {
        this.addGrassField()
      }
      if (p.status.fairyField) {
        this.addFairyField()
      }
    } else {
      if (pokemon.items.has(Item.SHINY_STONE)) {
        this.addLight()
      }
    }
    this.add(this.itemsContainer)

    if (instanceofPokemonEntity(pokemon)) {
      this.setLifeBar(p, scene)
      if (pokemon.maxPP > 0) this.setPowerBar(p, scene)
      //this.setEffects(p, scene);
    } else {
      if (pokemon.meal !== "") {
        this.updateMeal(pokemon.meal)
      }
    }

    this.draggable = playerId === scene.uid && !inBattle
    if (instanceofPokemonEntity(pokemon)) {
      const p = <IPokemonEntity>pokemon
      this.pp = p.pp
      this.team = p.team
      this.shield = p.shield
      this.life = p.life
      this.critPower = p.critPower
      this.critChance = p.critChance
    } else {
      this.critPower = DEFAULT_CRIT_POWER
      this.critChance = DEFAULT_CRIT_CHANCE
    }
    this.setDepth(DEPTH.POKEMON)

    // prevents persisting details between game transitions
    const s = <GameScene>this.scene
    if (s.lastPokemonDetail) {
      s.lastPokemonDetail.closeDetail()
      s.lastPokemonDetail = null
    }
  }

  lazyloadAnimations(
    scene: GameScene | DebugScene | undefined,
    unload: boolean = false
  ) {
    const tint = this.shiny ? PokemonTint.SHINY : PokemonTint.NORMAL
    const pokemonSpriteKey = `${this.index}/${tint}`
    let spriteCount = spriteCountPerPokemon.get(pokemonSpriteKey) ?? 0
    if (unload) {
      spriteCount = min(0)(spriteCount - 1)
      if (spriteCount === 0 && scene?.animationManager) {
        //logger.debug("unloading anims for", this.index)
        scene.animationManager?.unloadPokemonAnimations(this.index, tint)
      }
    } else {
      scene?.animationManager
      if (spriteCount === 0 && scene?.animationManager) {
        //logger.debug("loading anims for", this.index)
        scene.animationManager?.createPokemonAnimations(this.index, tint)
      }
      spriteCount++
    }
    //logger.debug("sprite count for", this.index, spriteCount)
    spriteCountPerPokemon.set(pokemonSpriteKey, spriteCount)
  }

  updateTooltipPosition() {
    if (this.detail) {
      if (this.input && preference("showDetailsOnHover")) {
        this.detail.setPosition(
          this.input.localX + 200,
          min(0)(this.input.localY - 175)
        )
        return
      }

      const absX = this.x + this.detail.width / 2 + 40
      const minX = this.detail.width / 2
      const maxX = window.innerWidth - this.detail.width / 2
      const absY = this.y - this.detail.height / 2 - 40
      const minY = this.detail.height / 2
      const maxY = window.innerHeight - this.detail.height / 2
      const [x, y] = [
        clamp(absX, minX, maxX) - this.x,
        clamp(absY, minY, maxY) - this.y
      ]
      this.detail.setPosition(x, y)
    }
  }

  destroy(fromScene?: boolean | undefined): void {
    const g = <GameScene>this.scene
    super.destroy(fromScene)
    this.closeDetail()
    this.lazyloadAnimations(g, true)
  }

  closeDetail() {
    if (this.detail) {
      this.detail.dom.remove()
      this.remove(this.detail, true)
      this.detail = null
    }
  }

  openDetail() {
    const s = <GameScene>this.scene
    if (s.lastPokemonDetail && s.lastPokemonDetail !== this) {
      s.lastPokemonDetail.closeDetail()
      s.lastPokemonDetail = null
    }

    this.detail = new PokemonDetail(
      this.scene,
      0,
      0,
      this.name as Pkm,
      this.rarity,
      this.life || this.hp,
      this.atk,
      this.def,
      this.speDef,
      this.range,
      this.speed,
      this.critChance,
      this.critPower,
      this.ap,
      this.pp || this.maxPP,
      this.luck,
      this.types,
      this.skill,
      this.passive,
      this.emotion,
      this.shiny,
      this.index,
      this.stars,
      getPokemonData(this.name as Pkm).stages,
      this.evolution,
      this.inBattle
    )
    this.detail
      .setPosition(
        this.detail.width / 2 + 40,
        min(0)(-this.detail.height / 2 - 40)
      )
      .setDepth(DEPTH.TOOLTIP)

    this.detail.removeInteractive()
    this.add(this.detail)
    s.lastPokemonDetail = this
  }

  onPointerDown(
    pointer: Phaser.Input.Pointer,
    event: Phaser.Types.Input.EventData
  ) {
    super.onPointerDown(pointer, event)
    if (
      this.shouldShowTooltip &&
      !preference("showDetailsOnHover") &&
      pointer.rightButtonDown() &&
      this.scene &&
      !this.detail
    ) {
      this.openDetail()
    } else {
      this.closeDetail()
    }
  }

  onPointerUp(): void {
    super.onPointerUp()
    if (
      this.shouldShowTooltip &&
      preference("showDetailsOnHover") &&
      !this.detail
    ) {
      this.openDetail()
    }
  }

  onPointerOut(): void {
    super.onPointerOut()
    if (this.shouldShowTooltip && preference("showDetailsOnHover")) {
      this.closeDetail()
    }
  }

  onPointerOver(pointer) {
    super.onPointerOver(pointer)

    if (
      preference("showDetailsOnHover") &&
      this.shouldShowTooltip &&
      this.detail == null &&
      !pointer.leftButtonDown() // we're dragging another pokemon
    ) {
      this.openDetail()
    }
  }

  attackAnimation(
    targetX: number,
    targetY: number,
    delayBeforeShoot: number,
    travelTime: number
  ) {
    const isRange = this.attackSprite.endsWith("/range")
    const startX = isRange ? this.positionX : targetX
    const startY = isRange ? this.positionY : targetY
    const LATENCY_COMPENSATION = 20
    let attackSprite = this.attackSprite
    let tint = 0xffffff

    if (attackSprite === AttackSprite.DRAGON_GREEN_RANGE) {
      attackSprite = AttackSprite.DRAGON_RANGE
      tint = 0x80ff80
    }

    if (startX != null && startY != null) {
      const coordinates = transformAttackCoordinate(startX, startY, this.flip)
      const projectile = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "attacks",
        `${attackSprite}/000.png`
      )
      const scale = AttackSpriteScale[attackSprite]
      projectile
        .setScale(scale[0], scale[1])
        .setTint(tint)
        .setDepth(DEPTH.PROJECTILE)
        .setVisible(false)

      if (!isRange) {
        projectile.anims.play({
          key: attackSprite,
          showOnStart: true,
          delay: delayBeforeShoot - LATENCY_COMPENSATION
        })
        projectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
          projectile.destroy()
        )
      } else {
        projectile.anims.play({ key: attackSprite })
        const coordinatesTarget = transformAttackCoordinate(
          targetX,
          targetY,
          this.flip
        )

        /*logger.debug(
          `Shooting a projectile to (${this.targetX},${this.targetY}) travel time ${travelTime}ms delay ${delayBeforeShoot}ms`
        )*/
        this.scene.tweens.add({
          targets: projectile,
          x: coordinatesTarget[0],
          y: coordinatesTarget[1],
          ease: "Linear",
          duration: min(250)(travelTime),
          delay: delayBeforeShoot - LATENCY_COMPENSATION,
          onComplete: () => projectile.destroy(),
          onStop: () => projectile.destroy(),
          onStart: () => projectile.setVisible(true)
        })
      }
    }
  }

  deathAnimation() {
    this.life = 0
    if (this.lifebar) {
      this.lifebar.setAmount(this.life)
    }

    this.scene.add.tween({
      targets: [this],
      ease: "Linear",
      duration: 1500,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: () => {
        this.destroy()
      }
    })
  }

  resurectAnimation() {
    if (this.lifebar) {
      this.lifebar.setAmount(0)
    }

    const resurectAnim = this.scene.add.sprite(0, -10, "RESURECT", "000")
    resurectAnim.setDepth(DEPTH.BOOST_FRONT)
    resurectAnim.setScale(2, 2)
    resurectAnim.anims.play("RESURECT")
    resurectAnim.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      resurectAnim.destroy()
    })

    this.add(resurectAnim)
  }

  displayAnimation(anim: string) {
    return displayAbility(
      this.scene as GameScene,
      [],
      anim,
      this.orientation,
      this.positionX,
      this.positionY,
      this.targetX ?? -1,
      this.targetY ?? -1,
      this.flip
    )
  }

  fishingAnimation() {
    this.displayAnimation("FISHING")
    this.sprite.once(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
      const g = <GameScene>this.scene
      g.animationManager?.animatePokemon(
        this,
        PokemonActionState.IDLE,
        this.flip
      )
    })
  }

  emoteAnimation() {
    const g = <GameScene>this.scene
    g.animationManager?.animatePokemon(
      this,
      PokemonActionState.EMOTE,
      this.flip,
      false
    )
  }

  evolutionAnimation() {
    this.displayAnimation("EVOLUTION")
    this.emoteAnimation()
  }

  spawnAnimation() {
    this.displayAnimation("SPAWN")
    this.emoteAnimation()
  }

  hatchAnimation() {
    this.displayAnimation("HATCH")
    const g = <GameScene>this.scene
    g.animationManager?.animatePokemon(
      this,
      PokemonActionState.EMOTE,
      this.flip,
      false
    )
  }

  cookAnimation(dishes: Item[]) {
    this.emoteAnimation()
    dishes.forEach((item, i) => {
      const itemSprite = this.scene.add.sprite(
        this.x,
        this.y,
        "item",
        item + ".png"
      )
      itemSprite.setScale(0.5)
      const shinyEffect = this.scene.add.sprite(this.x, this.y, "shine")
      shinyEffect.setScale(2)
      shinyEffect.play("shine")
      this.scene.tweens.add({
        targets: [itemSprite, shinyEffect],
        ease: Phaser.Math.Easing.Quadratic.Out,
        duration: 1000,
        y: this.y - 70,
        x: this.x + (i - (dishes.length - 1) / 2) * 70,
        onComplete: () => {
          setTimeout(() => {
            itemSprite.destroy()
            shinyEffect.destroy()
          }, 1000)
        }
      })
    })
  }

  updateMeal(meal: Item | "") {
    this.meal = meal
    this.mealSprite?.destroy()
    if (meal) {
      this.mealSprite = this.scene.add
        .sprite(0, 20, "item", meal + ".png")
        .setScale(0.25)
      this.add(this.mealSprite)
    }
  }

  specialAttackAnimation(group: Phaser.GameObjects.Group, ultCount: number) {
    if (this.skill && this.skill === Ability.GROWTH) {
      this.sprite.setScale(2 + 0.5 * ultCount)
    }
  }

  setLifeBar(pokemon: IPokemonEntity, scene: Phaser.Scene) {
    if (pokemon.life !== undefined) {
      this.lifebar = new Lifebar(
        scene,
        0,
        this.height / 2 + 6,
        60,
        pokemon.life + pokemon.shield,
        pokemon.shield,
        pokemon.team as Team,
        this.flip
      )
      this.lifebar.setAmount(pokemon.life)
      this.lifebar.setShieldAmount(pokemon.shield)
      this.lifebar.setDepth(DEPTH.POKEMON_HP_BAR)
      this.add(this.lifebar)
    }
  }

  setPowerBar(pokemon: IPokemonEntity, scene: Phaser.Scene) {
    if (pokemon.pp !== undefined) {
      this.powerbar = new PowerBar(
        scene,
        0,
        this.height / 2 + 12,
        60,
        pokemon.maxPP
      )
      this.powerbar.setAmount(pokemon.pp)
      this.powerbar.setDepth(DEPTH.POKEMON_HP_BAR)
      this.add(this.powerbar)
    }
  }

  addWound() {
    if (!this.wound) {
      this.wound = this.scene.add
        .sprite(0, -30, "status", "WOUND/000.png")
        .setScale(2)
      this.wound.anims.play("WOUND")
      this.add(this.wound)
    }
  }

  removeWound() {
    if (this.wound) {
      this.remove(this.wound, true)
      this.wound = undefined
    }
  }

  addBurn() {
    if (!this.burn) {
      this.burn = this.scene.add
        .sprite(0, -30, "status", "BURN/000.png")
        .setScale(2)
      this.burn.anims.play("BURN")
      this.add(this.burn)
    }
  }

  removeBurn() {
    if (this.burn) {
      this.remove(this.burn, true)
      this.burn = undefined
    }
  }

  addSleep() {
    if (!this.sleep) {
      this.sleep = this.scene.add
        .sprite(0, -30, "status", "SLEEP/000.png")
        .setScale(2)
      this.sleep.anims.play("SLEEP")
      this.add(this.sleep)
    }
  }

  removeSleep() {
    if (this.sleep) {
      this.remove(this.sleep, true)
      this.sleep = undefined
    }
  }

  addSilence() {
    if (!this.silence) {
      this.silence = this.scene.add
        .sprite(0, -30, "status", "SILENCE/000.png")
        .setScale(2)
      this.silence.anims.play("SILENCE")
      this.add(this.silence)
    }
  }

  removeSilence() {
    if (this.silence) {
      this.remove(this.silence, true)
      this.silence = undefined
    }
  }

  addFatigue() {
    if (!this.fatigue) {
      this.fatigue = this.scene.add
        .sprite(0, -10, "status", "FATIGUE/000.png")
        .setScale(2)
      this.fatigue.anims.play("FATIGUE")
      this.add(this.fatigue)
    }
  }

  removeFatigue() {
    if (this.fatigue) {
      this.remove(this.fatigue, true)
      this.fatigue = undefined
    }
  }

  addFreeze() {
    if (!this.freeze) {
      this.freeze = this.scene.add
        .sprite(0, 0, "status", "FREEZE/000.png")
        .setScale(2)
      this.freeze.anims.play("FREEZE")
      this.add(this.freeze)
    }
  }

  removeFreeze() {
    if (this.freeze) {
      this.remove(this.freeze, true)
      this.freeze = undefined
    }
  }

  addConfusion() {
    if (!this.confusion) {
      this.confusion = this.scene.add
        .sprite(0, -30, "status", "CONFUSION/000.png")
        .setScale(2)
      this.confusion.anims.play("CONFUSION")
      this.add(this.confusion)
    }
  }

  removeConfusion() {
    if (this.confusion) {
      this.remove(this.confusion, true)
      this.confusion = undefined
    }
  }

  addParalysis() {
    if (!this.paralysis) {
      this.paralysis = this.scene.add
        .sprite(0, -30, "status", "PARALYSIS/000.png")
        .setScale(2)
      this.paralysis.anims.play("PARALYSIS")
      this.add(this.paralysis)
    }
  }

  removeParalysis() {
    if (this.paralysis) {
      this.remove(this.paralysis, true)
      this.paralysis = undefined
    }
  }

  addPokerus() {
    if (!this.pokerus) {
      this.pokerus = this.scene.add
        .sprite(0, -50, "status", "POKERUS/000.png")
        .setScale(2)
      this.pokerus.anims.play("POKERUS")
      this.add(this.pokerus)
    }
  }

  removePokerus() {
    if (this.pokerus) {
      this.remove(this.pokerus, true)
      this.pokerus = undefined
    }
  }

  addLocked() {
    if (!this.locked) {
      this.locked = this.scene.add
        .sprite(0, -30, "status", "LOCKED/000.png")
        .setScale(2)
      this.locked.anims.play("LOCKED")
      this.add(this.locked)
    }
  }

  removeLocked() {
    if (this.locked) {
      this.remove(this.locked, true)
      this.locked = undefined
    }
  }

  addBlinded() {
    if (!this.blinded) {
      this.blinded = this.scene.add
        .sprite(0, -30, "status", "BLINDED/000.png")
        .setScale(3)
      this.blinded.anims.play("BLINDED")
      this.add(this.blinded)
    }
  }

  removeBlinded() {
    if (this.blinded) {
      this.remove(this.blinded, true)
      this.blinded = undefined
    }
  }

  addArmorReduction() {
    if (!this.armorReduction) {
      this.armorReduction = this.scene.add
        .sprite(0, -40, "status", "ARMOR_BREAK/000.png")
        .setScale(2)
      this.armorReduction.anims.play("ARMOR_BREAK")
      this.add(this.armorReduction)
    }
  }

  removeArmorReduction() {
    if (this.armorReduction) {
      this.remove(this.armorReduction, true)
      this.armorReduction = undefined
    }
  }

  addCharm() {
    if (!this.charm) {
      this.charm = this.scene.add
        .sprite(0, -40, "status", "CHARM/000.png")
        .setScale(2)
      this.charm.anims.play("CHARM")
      this.add(this.charm)
    }
  }

  removeCharm() {
    if (this.charm) {
      this.remove(this.charm, true)
      this.charm = undefined
    }
  }

  addFlinch() {
    if (!this.flinch) {
      this.flinch = this.scene.add
        .sprite(0, -40, "status", "FLINCH/000.png")
        .setScale(2)
      this.flinch.anims.play("FLINCH")
      this.add(this.flinch)
    }
  }

  removeFlinch() {
    if (this.flinch) {
      this.remove(this.flinch, true)
      this.flinch = undefined
    }
  }

  addCurse() {
    if (!this.curse) {
      this.curse = this.scene.add
        .sprite(0, -65, "status", "CURSE/000.png")
        .setScale(1.5)
      this.curse.anims.play("CURSE")
      this.add(this.curse)
    }
  }

  removeCurse() {
    if (this.curse) {
      this.remove(this.curse, true)
      this.curse = undefined
    }
  }

  addCurseVulnerability() {
    if (!this.curseVulnerability) {
      this.curseVulnerability = this.scene.add
        .sprite(0, 15, "abilities", "CURSE_OF_VULNERABILITY/000.png")
        .setScale(1)
      this.curseVulnerability.anims.play("CURSE_OF_VULNERABILITY")
      this.add(this.curseVulnerability)
    }
  }

  addCurseWeakness() {
    if (!this.curseWeakness) {
      this.curseWeakness = this.scene.add
        .sprite(-30, -15, "abilities", "CURSE_OF_WEAKNESS/000.png")
        .setScale(1)
      this.curseWeakness.anims.play("CURSE_OF_WEAKNESS")
      this.add(this.curseWeakness)
    }
  }

  addCurseTorment() {
    if (!this.curseTorment) {
      this.curseTorment = this.scene.add
        .sprite(30, -15, "abilities", "CURSE_OF_TORMENT/000.png")
        .setScale(1)
      this.curseTorment.anims.play("CURSE_OF_TORMENT")
      this.add(this.curseTorment)
    }
  }

  addCurseFate() {
    if (!this.curseFate) {
      this.curseFate = this.scene.add
        .sprite(0, -45, "abilities", "CURSE_OF_FATE/000.png")
        .setScale(1)
      this.curseFate.anims.play("CURSE_OF_FATE")
      this.add(this.curseFate)
    }
  }

  addPoison() {
    if (!this.poison) {
      this.poison = this.scene.add
        .sprite(0, -30, "status", "POISON/000.png")
        .setScale(2)
      this.poison.anims.play("POISON")
      this.add(this.poison)
    }
  }

  removePoison() {
    if (this.poison) {
      this.remove(this.poison, true)
      this.poison = undefined
    }
  }

  addProtect() {
    if (!this.protect) {
      this.protect = this.scene.add
        .sprite(0, -30, "status", "PROTECT/000.png")
        .setScale(2)
      this.protect.anims.play("PROTECT")
      this.add(this.protect)
    }
  }

  removeProtect() {
    if (this.protect) {
      this.remove(this.protect, true)
      this.protect = undefined
    }
  }

  skydiveUp() {
    if (!this.skydiving) {
      // animation where pokemon is flying up out of the screen for a screen dive animation. Should take <= 500 milliseconds
      this.skydiving = true
      this.moveManager.setSpeed(800)
      this.moveManager.moveTo(this.x, -100)
    }
  }

  skydiveDown() {
    if (this.skydiving) {
      // animation after a skydiving attack where pokemon moves from its target cell to its final reserved adjacent cell
      const landingCoordinates = transformAttackCoordinate(
        this.targetX ?? this.positionX,
        this.targetY ?? this.positionY,
        this.flip
      )
      const finalCoordinates = transformAttackCoordinate(
        this.positionX,
        this.positionY,
        this.flip
      )

      this.x = landingCoordinates[0]
      this.y = landingCoordinates[1]
      this.moveManager.setSpeed(3)
      this.moveManager.moveTo(finalCoordinates[0], finalCoordinates[1])
      this.skydiving = false
    }
  }

  addResurection() {
    if (!this.resurection) {
      this.resurection = this.scene.add
        .sprite(0, -45, "status", "RESURECTION/000.png")
        .setScale(2)
      this.resurection.anims.play("RESURECTION")
      this.add(this.resurection)
    }
  }

  removeResurection() {
    if (this.resurection) {
      this.remove(this.resurection, true)
      this.resurection = undefined
    }
  }

  addRuneProtect() {
    if (!this.runeProtect) {
      this.runeProtect = this.scene.add
        .sprite(0, -40, "status", "RUNE_PROTECT/000.png")
        .setScale(2)
      this.runeProtect.anims.play("RUNE_PROTECT")
      this.add(this.runeProtect)
    }
  }

  removeRuneProtect() {
    if (this.runeProtect) {
      this.remove(this.runeProtect, true)
      this.runeProtect = undefined
    }
  }

  addSpikeArmor() {
    if (!this.spikeArmor) {
      this.spikeArmor = this.scene.add
        .sprite(0, -5, "abilities", `${Ability.SPIKE_ARMOR}/000.png`)
        .setScale(2)
      this.spikeArmor.anims.play(Ability.SPIKE_ARMOR)
      this.add(this.spikeArmor)
    }
  }

  removeSpikeArmor() {
    if (this.spikeArmor) {
      this.remove(this.spikeArmor, true)
      this.spikeArmor = undefined
    }
  }

  addMagicBounce() {
    if (!this.magicBounce) {
      this.magicBounce = this.scene.add
        .sprite(0, -5, "abilities", `${Ability.SPIKE_ARMOR}/000.png`)
        .setScale(2)
        .setTint(0xffa0ff)
      this.magicBounce.anims.play(Ability.MAGIC_BOUNCE)
      this.add(this.magicBounce)
    }
  }

  removeMagicBounce() {
    if (this.magicBounce) {
      this.remove(this.magicBounce, true)
      this.magicBounce = undefined
    }
  }

  addLight() {
    if (this.light) return
    this.light = this.scene.add
      .sprite(0, 0, "abilities", "LIGHT_CELL/000.png")
      .setScale(1.5, 1.5)
    this.light.anims.play("LIGHT_CELL")
    this.add(this.light)
    this.sendToBack(this.light)
  }

  addElectricField() {
    if (!this.electricField) {
      this.electricField = this.scene.add
        .sprite(0, 10, "status", "ELECTRIC_FIELD/000.png")
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setScale(1.5)
      this.electricField.anims.play("ELECTRIC_FIELD")
      this.add(this.electricField)
      this.bringToTop(this.sprite)
    }
  }

  removeElectricField() {
    if (this.electricField) {
      this.remove(this.electricField, true)
      this.electricField = undefined
    }
  }

  addGrassField() {
    if (!this.grassField) {
      this.grassField = this.scene.add
        .sprite(0, 10, "abilities", "GRASSY_FIELD/000.png")
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setScale(2)
      this.scene.add.existing(this.grassField)
      this.grassField.anims.play("GRASSY_FIELD")
      this.add(this.grassField)
      this.bringToTop(this.sprite)
    }
  }

  removeGrassField() {
    if (this.grassField) {
      this.remove(this.grassField, true)
      this.grassField = undefined
    }
  }

  addFairyField() {
    if (!this.fairyField) {
      this.fairyField = this.scene.add
        .sprite(0, 10, "status", "FAIRY_FIELD/000.png")
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setScale(1)
      this.fairyField.anims.play("FAIRY_FIELD")
      this.add(this.fairyField)
      this.bringToTop(this.sprite)
    }
  }

  removeFairyField() {
    if (this.fairyField) {
      this.remove(this.fairyField, true)
      this.fairyField = undefined
    }
  }

  addPsychicField() {
    if (!this.psychicField) {
      this.psychicField = this.scene.add
        .sprite(0, 10, "status", "PSYCHIC_FIELD/000.png")
        .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
        .setScale(1)
      this.psychicField.anims.play("PSYCHIC_FIELD")
      this.add(this.psychicField)
      this.bringToTop(this.sprite)
    }
  }

  removePsychicField() {
    if (this.psychicField) {
      this.remove(this.psychicField, true)
      this.psychicField = undefined
    }
  }

  addRageEffect() {
    this.sprite.setTint(0xff0000)
  }

  removeRageEffect() {
    this.sprite.clearTint()
  }
}

export function addWanderingPokemon(
  scene: GameScene,
  id: string,
  pkm: Pkm,
  onClick: (
    pokemon: PokemonSprite,
    id: string,
    pointer: Phaser.Input.Pointer,
    tween: Phaser.Tweens.Tween
  ) => void
) {
  const fromLeft = chance(1 / 2)
  const [startX, endX] = fromLeft
    ? [-100, +window.innerWidth + 100]
    : [+window.innerWidth + 100, -100]
  const [startY, endY] = [
    100 + Math.round(Math.random() * 500),
    100 + Math.round(Math.random() * 500)
  ]

  const SPEED = 0.3

  const pokemon = new PokemonSprite(
    scene,
    startX,
    startY,
    PokemonFactory.createPokemonFromName(pkm),
    "wanderer",
    false,
    false
  )
  pokemon.orientation = fromLeft ? Orientation.RIGHT : Orientation.LEFT
  scene.animationManager?.animatePokemon(
    pokemon,
    PokemonActionState.WALK,
    false
  )

  const tween = scene.tweens.add({
    targets: pokemon,
    x: endX,
    y: endY,
    ease: "Linear",
    duration: window.innerWidth / SPEED,
    onComplete: () => {
      if (pokemon) {
        pokemon.destroy()
      }
    }
  })

  pokemon.draggable = false
  pokemon.sprite.setInteractive()
  pokemon.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    onClick(pokemon, id, pointer, tween)
  })
}
