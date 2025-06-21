import { SetSchema } from "@colyseus/schema"
import Phaser, { GameObjects, Geom } from "phaser"
import type MoveTo from "phaser3-rex-plugins/plugins/moveto"
import type MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import {
  AttackSprite,
  AttackSpriteScale,
  type Emotion,
  type IPokemon,
  type IPokemonEntity
} from "../../../../types"
import {
  CELL_VISUAL_HEIGHT,
  CELL_VISUAL_WIDTH,
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
  Team
} from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import type { Passive } from "../../../../types/enum/Passive"
import {
  AnimationConfig,
  Pkm,
  PkmByIndex
} from "../../../../types/enum/Pokemon"
import type { Synergy } from "../../../../types/enum/Synergy"
import { clamp, min } from "../../../../utils/number"
import { randomBetween } from "../../../../utils/random"
import { values } from "../../../../utils/schemas"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import { preference } from "../../preferences"
import type { DebugScene } from "../scenes/debug-scene"
import type GameScene from "../scenes/game-scene"
import { displayAbility } from "./abilities-animations"
import DraggableObject from "./draggable-object"
import ItemsContainer from "./items-container"
import Lifebar from "./life-bar"
import PokemonDetail from "./pokemon-detail"
import type { GameDialog } from "./game-dialog"
import { DEPTH } from "../depths"
import { logger } from "../../../../utils/logger"

const spriteCountPerPokemon = new Map<string, number>()

export default class PokemonSprite extends DraggableObject {
  scene: GameScene | DebugScene
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
  possessed: GameObjects.Sprite | undefined
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
  reflectShield: GameObjects.Sprite | undefined
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
    super(
      scene,
      x,
      y,
      CELL_VISUAL_WIDTH,
      CELL_VISUAL_HEIGHT,
      playerId !== scene.uid
    )
    this.scene = scene
    this.flip = flip
    this.playerId = playerId
    this.shouldShowTooltip = true
    this.stars = pokemon.stars
    this.stages = getPokemonData(pokemon.name).stages
    this.evolution = inBattle ? Pkm.DEFAULT : (pokemon as IPokemon).evolution
    this.emotion = pokemon.emotion
    this.shiny = pokemon.shiny
    this.width = CELL_VISUAL_WIDTH
    this.height = CELL_VISUAL_HEIGHT
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

    const isEntity = (
      pokemon: IPokemon | IPokemonEntity
    ): pokemon is IPokemonEntity => {
      return inBattle
    }

    if (isEntity(pokemon)) {
      this.orientation = pokemon.orientation
      this.action = pokemon.action
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
    this.itemsContainer = new ItemsContainer(
      scene,
      pokemon.items ?? new SetSchema(),
      this.sprite.width / 2 + 25,
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

    if (isEntity(pokemon)) {
      if (pokemon.status.light) {
        this.addLight()
      }
      if (pokemon.status.electricField) {
        this.addElectricField()
      }
      if (pokemon.status.psychicField) {
        this.addPsychicField()
      }
      if (pokemon.status.grassField) {
        this.addGrassField()
      }
      if (pokemon.status.fairyField) {
        this.addFairyField()
      }
    } else {
      if (pokemon.items.has(Item.SHINY_STONE)) {
        this.addLight()
      }
    }
    if (pokemon.items.has(Item.BERSERK_GENE)) {
      this.addBerserkEffect()
    }
    this.add(this.itemsContainer)

    if (isEntity(pokemon)) {
      this.setLifeBar(pokemon, scene)
      //this.setEffects(p, scene);
    } else {
      if (pokemon.meal !== "") {
        this.updateMeal(pokemon.meal)
      }
    }

    this.draggable =
      playerId === scene.uid &&
      !inBattle &&
      (scene as GameScene).spectate === false
    if (isEntity(pokemon)) {
      this.pp = pokemon.pp
      this.team = pokemon.team
      this.shield = pokemon.shield
      this.life = pokemon.life
      this.critPower = pokemon.critPower
      this.critChance = pokemon.critChance
    } else {
      this.critPower = DEFAULT_CRIT_POWER
      this.critChance = DEFAULT_CRIT_CHANCE
    }
    this.setDepth(DEPTH.POKEMON)

    // prevents persisting details between game transitions
    const isGameScene = (scene: Phaser.Scene): scene is GameScene =>
      "lastPokemonDetail" in scene
    if (isGameScene(this.scene) && this.scene.lastPokemonDetail) {
      this.scene.lastPokemonDetail.closeDetail()
      this.scene.lastPokemonDetail = null
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

      const absX = this.x + this.detail.width / 2 + 60
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
      this.itemsContainer.items,
      this.inBattle
    )
    this.detail
      .setPosition(
        this.detail.width / 2 + 60,
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

    if (startX != null && startY != null) {
      const coordinates = transformEntityCoordinates(startX, startY, this.flip)
      let scale = AttackSpriteScale[attackSprite]

      if (attackSprite === AttackSprite.DRAGON_GREEN_RANGE) {
        attackSprite = AttackSprite.DRAGON_RANGE
        scale = [1.5, 1.5]
        tint = 0x80ff60
      }

      const projectile = this.scene.add.sprite(
        coordinates[0] + randomBetween(-5, 5),
        coordinates[1] + randomBetween(-5, 5),
        "attacks",
        `${attackSprite}/000.png`
      )

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
        const coordinatesTarget = transformEntityCoordinates(
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
      this.lifebar.setLife(this.life)
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
      this.lifebar.setLife(0)
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
      !this.inBattle
        ? this.positionY - 1
        : this.team === Team.RED_TEAM
          ? 4 - this.positionY
          : this.positionY,
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

  specialAttackAnimation(pokemon: IPokemonEntity) {
    let anim = AnimationConfig[PkmByIndex[pokemon.index]].ability
    if (pokemon.skill === Ability.LASER_BLADE && pokemon.count.ult % 2 === 0) {
      anim = AnimationConfig[PkmByIndex[pokemon.index]].emote
    }
    if (pokemon.skill === Ability.GROWTH) {
      this.sprite.setScale(2 + 0.5 * pokemon.count.ult)
    }

    this.scene.animationManager?.play(this, anim, {
      flip: this.flip,
      lock: true,
      repeat: 0
    })
  }

  setLifeBar(pokemon: IPokemonEntity, scene: GameScene | DebugScene) {
    if (pokemon.life !== undefined) {
      this.lifebar = new Lifebar(
        scene,
        0,
        25,
        pokemon.life,
        pokemon.life,
        pokemon.shield,
        pokemon.team as Team,
        this.flip
      )
      this.lifebar.setShield(pokemon.shield)
      this.add(this.lifebar)

      if (pokemon.pp !== undefined && pokemon.maxPP > 0)
        this.lifebar.setMaxPP(pokemon.maxPP)
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

  addPossessed() {
    if (!this.possessed) {
      this.possessed = this.scene.add
        .sprite(-16, -24, "status", "POSSESSED/000.png")
        .setScale(2)
      this.possessed.anims.play("POSSESSED")
      this.sprite.setTint(0xff50ff)
      this.add(this.possessed)
      //this.bringToTop(this.sprite)
    }
  }

  removePossessed() {
    if (this.possessed) {
      this.sprite.clearTint()
      this.remove(this.possessed, true)
      this.possessed = undefined
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
      const landingCoordinates = transformEntityCoordinates(
        this.targetX ?? this.positionX,
        this.targetY ?? this.positionY,
        this.flip
      )
      const finalCoordinates = transformEntityCoordinates(
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

  addReflectShieldAnim(colorVariation = 0xffffff) {
    if (!this.reflectShield) {
      this.reflectShield = this.scene.add
        .sprite(0, -5, "abilities", `${Ability.SPIKY_SHIELD}/000.png`)
        .setScale(2)
        .setTint(colorVariation)
      this.reflectShield.anims.play(Ability.SPIKY_SHIELD)
      this.add(this.reflectShield)
    }
  }

  removeReflectShieldAnim() {
    if (this.reflectShield) {
      this.remove(this.reflectShield, true)
      this.reflectShield = undefined
    }
  }

  addLight() {
    if (this.light) return
    this.light = this.scene.add
      .sprite(0, 0, "abilities", "LIGHT_CELL/000.png")
      .setScale(1.5, 1.5)
      .setDepth(DEPTH.LIGHT_CELL)
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

  addBerserkEffect() {
    this.sprite.setTint(0x00ff00)
  }

  addFlowerTrick() {
    const flowerTrick = this.scene.add.container()

    for (let i = 0; i < 5; i++) {
      const flowerSprite = this.scene.add
        .sprite(0, 0, "abilities", `${Ability.FLOWER_TRICK}/000.png`)
        .setScale(2)
      flowerSprite.anims.play({
        key: Ability.FLOWER_TRICK,
        frameRate: 7,
        repeat: -1
      })
      flowerTrick.add(flowerSprite)
    }
    const circle = new Geom.Circle(0, 0, 48)
    Phaser.Actions.PlaceOnCircle(flowerTrick.getAll(), circle)

    this.add(flowerTrick)

    this.scene.tweens.add({
      targets: circle,
      radius: 50,
      ease: Phaser.Math.Easing.Quartic.Out,
      duration: 3000,
      onUpdate: function (tween) {
        Phaser.Actions.RotateAroundDistance(
          flowerTrick.getAll(),
          { x: 0, y: 0 },
          0.08,
          circle.radius
        )
      },
      onComplete: function () {
        flowerTrick.destroy(true)
      }
    })
  }
}
