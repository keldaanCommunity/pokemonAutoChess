import Phaser, { GameObjects } from "phaser"
import { SetSchema } from "@colyseus/schema"
import Lifebar from "./life-bar"
import DraggableObject from "./draggable-object"
import PokemonDetail from "./pokemon-detail"
import ItemsContainer from "./items-container"
import { Effect } from "../../../../types/enum/Effect"
import {
  transformAttackCoordinate,
  getAttackScale,
  transformCoordinate
} from "../../pages/utils/utils"
import {
  IPokemon,
  IPokemonEntity,
  instanceofPokemonEntity,
  Emotion,
  AttackSprite
} from "../../../../types"
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin"
import MoveTo from "phaser3-rex-plugins/plugins/moveto"
import GameScene from "../scenes/game-scene"
import {
  AttackType,
  Orientation,
  PokemonActionState,
  SpriteType,
  PokemonTint,
  Rarity
} from "../../../../types/enum/Game"
import { Ability } from "../../../../types/enum/Ability"
import { Passive } from "../../../../types/enum/Passive"
import ManaBar from "./mana-bar"
import { Synergy } from "../../../../types/enum/Synergy"
import { Pkm } from "../../../../types/enum/Pokemon"
import { clamp } from "../../../../utils/number"
import {
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_DAMAGE
} from "../../../../types/Config"
import { loadPreferences } from "../../preferences"

export default class Pokemon extends DraggableObject {
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
  atkSpeed: number
  targetX: number | null
  targetY: number | null
  skill: Ability
  passive: Passive
  positionX: number
  positionY: number
  attackSprite: AttackSprite
  team: number | undefined
  critDamage: number
  ap: number
  life: number | undefined
  shield: number | undefined
  projectile: GameObjects.Sprite | undefined
  itemsContainer: ItemsContainer
  orientation: Orientation
  action: PokemonActionState
  moveManager: MoveTo
  rangeType: string
  types: Synergy[]
  lifebar: Lifebar | undefined
  detail: PokemonDetail | undefined
  mana: number | undefined
  maxMana: number
  manabar: ManaBar | undefined
  sprite: GameObjects.Sprite
  shadow: GameObjects.Sprite
  wound: GameObjects.Sprite | undefined
  burn: GameObjects.Sprite | undefined
  sleep: GameObjects.Sprite | undefined
  silence: GameObjects.Sprite | undefined
  freeze: GameObjects.Sprite | undefined
  confusion: GameObjects.Sprite | undefined
  paralysis: GameObjects.Sprite | undefined
  armorReduction: GameObjects.Sprite | undefined
  magmaStorm: GameObjects.Sprite | undefined
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
  stars: number
  playerId: string
  shouldShowTooltipOnHover: boolean
  shouldShowTooltip: boolean

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    pokemon: IPokemonEntity | IPokemon,
    playerId: string,
    inBattle: boolean
  ) {
    super(scene, x, y, 75, 75, playerId !== scene.uid)
    this.playerId = playerId
    this.shouldShowTooltip = true
    this.stars = pokemon.stars
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
    this.types = pokemon.types
    this.maxMana = pokemon.maxMana
    this.atkSpeed = pokemon.atkSpeed
    this.targetX = null
    this.targetY = null
    this.skill = pokemon.skill
    this.passive = pokemon.passive
    this.positionX = pokemon.positionX
    this.positionY = pokemon.positionY
    this.attackSprite = pokemon.attackSprite
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

    const p = <IPokemonEntity>pokemon
    if (p.orientation) {
      this.orientation = p.orientation
      this.action = p.action
    } else {
      this.orientation = Orientation.DOWNLEFT
      this.action = PokemonActionState.WALK
    }

    const textureIndex = scene.textures.exists(this.index) ? this.index : "0000"
    this.sprite = new GameObjects.Sprite(
      scene,
      0,
      0,
      textureIndex,
      `${PokemonTint.NORMAL}/${PokemonActionState.IDLE}/${SpriteType.ANIM}/${Orientation.DOWN}/0000`
    )
    this.sprite.setDepth(3)
    //this.sprite.setOrigin(0,0);
    this.sprite.setScale(2, 2)
    this.sprite.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (animation, frame, gameObject, frameKey: string) => {
        const g = <GameScene>scene
        // go back to idle anim if no more animation in queue
        if (pokemon.action !== PokemonActionState.HURT) {
          g.animationManager?.animatePokemon(this, PokemonActionState.IDLE)
        }
      }
    )
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
    this.shadow = new GameObjects.Sprite(scene, 0, 5, textureIndex)
    //this.shadow.setOrigin(0,0);
    this.shadow.setScale(2, 2)
    scene.add.existing(this.shadow)
    this.add(this.shadow)
    if (instanceofPokemonEntity(pokemon)) {
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
    }
    scene.add.existing(this.sprite)
    this.add(this.itemsContainer)

    if (instanceofPokemonEntity(pokemon)) {
      if (
        p.effects &&
        (p.effects.includes(Effect.IRON_DEFENSE) ||
          p.effects.includes(Effect.AUTOMATE))
      ) {
        this.sprite.setScale(3, 3)
      }
      if (p.effects && p.effects.includes(Effect.STEEL_SURGE)) {
        this.sprite.setScale(4, 4)
      }

      this.setLifeBar(p, scene)
      this.setManaBar(p, scene)
      //this.setEffects(p, scene);
    }
    this.add(this.sprite)
    this.draggable = playerId === scene.uid && !inBattle
    if (instanceofPokemonEntity(pokemon)) {
      const p = <IPokemonEntity>pokemon
      this.mana = p.mana
      this.team = p.team
      this.shield = p.shield
      this.life = p.life
      this.critDamage = p.critDamage
      this.ap = p.ap
      this.critChance = p.critChance
    } else {
      this.critDamage = DEFAULT_CRIT_DAMAGE
      this.ap = 0
      this.critChance = DEFAULT_CRIT_CHANCE
    }
    this.setDepth(5)

    this.shouldShowTooltipOnHover = loadPreferences().pokemonDetailsOnHover

    // prevents persisting details between game transitions
    const s = <GameScene>this.scene
    if (s.lastPokemonDetail) {
      s.lastPokemonDetail.closeDetail()
      s.lastPokemonDetail = undefined
    }
  }

  get isOnBench(): boolean {
    return this.positionY === 0
  }

  updateTooltipPosition() {
    if (this.detail) {
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

  closeDetail() {
    if (this.detail) {
      this.detail.dom.remove()
      this.remove(this.detail, true)
      this.detail = undefined
    }
  }

  openDetail() {
    const s = <GameScene>this.scene
    if (s.lastPokemonDetail && s.lastPokemonDetail != this) {
      s.lastPokemonDetail.closeDetail()
      s.lastPokemonDetail = undefined
    }

    this.detail = new PokemonDetail(
      this.scene,
      0,
      0,
      this.name,
      this.rarity,
      this.life || this.hp,
      this.atk,
      this.def,
      this.speDef,
      this.range,
      this.atkSpeed,
      this.critChance,
      this.critDamage,
      this.ap,
      this.mana || this.maxMana,
      this.types,
      this.skill,
      this.passive,
      this.emotion,
      this.shiny,
      this.index,
      this.rarity === Rarity.MYTHICAL ? 3 : this.stars,
      this.evolution
    )
    this.detail.setPosition(
      this.detail.width / 2 + 40,
      -this.detail.height / 2 - 40
    )
    this.add(this.detail)
    s.lastPokemonDetail = this
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    super.onPointerDown(pointer)

    if (!this.shouldShowTooltip) {
      return;
    }

    if (pointer.rightButtonDown()) {
      if (this.scene && !this.detail) {
        this.openDetail()
      } else {
        this.closeDetail()
      }
    } else {
      // close detail when dragging
      this.closeDetail()
    }
  }

  onPointerOut(): void {
    super.onPointerOut()
    if (this.shouldShowTooltipOnHover) {
      this.closeDetail()
    }
  }

  onPointerOver() {
    super.onPointerOver()

    if (!this.shouldShowTooltip) {
      return
    }

    // recheck preferences
    this.shouldShowTooltipOnHover = loadPreferences().pokemonDetailsOnHover

    if (this.shouldShowTooltipOnHover && this.shouldShowTooltip) {
      this.openDetail()
    }
  }

  attackAnimation() {
    let x: number | null
    let y: number | null
    if (this.range > 1) {
      x = this.positionX
      y = this.positionY
    } else {
      x = this.targetX
      y = this.targetY
    }

    if (this.projectile) {
      this.projectile.destroy()
    }

    if (x && y) {
      const coordinates = transformAttackCoordinate(x, y)

      this.projectile = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "attacks",
        `${this.attackSprite}/000`
      )
      const scale = getAttackScale(this.attackSprite)
      this.projectile.setScale(scale[0], scale[1])
      this.projectile.anims.play(`${this.attackSprite}`)
      this.addTween()
    }
  }

  petalDanceAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      Ability.PETAL_DANCE,
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play(Ability.PETAL_DANCE)
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  futureSightAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      Ability.FUTURE_SIGHT,
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play(Ability.FUTURE_SIGHT)
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  fieldDeathAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "FIELD_DEATH",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("FIELD_DEATH")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  fairyCritAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "FAIRY_CRIT",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("FAIRY_CRIT")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  soundAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "ECHO",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("ECHO")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  growGroundAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "attacks",
      "GROUND/cell/000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(1.5, 1.5)
    specialProjectile.anims.play("ground-grow")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  powerLensAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "INCENSE_DAMAGE",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("INCENSE_DAMAGE")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  starDustAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "BRIGHT_POWDER",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("BRIGHT_POWDER")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  staticAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "STATIC",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(3, 3)
    specialProjectile.anims.play("STATIC")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  healOrderAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "HEAL_ORDER",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("HEAL_ORDER")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  attackOrderAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "ATTACK_ORDER",
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(2, 2)
    specialProjectile.anims.play("ATTACK_ORDER")
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  earthquakeAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      Ability.EARTHQUAKE,
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(3, 3)
    specialProjectile.anims.play(Ability.EARTHQUAKE)
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  mindBlownAnimation() {
    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      Ability.MIND_BLOWN,
      "000"
    )
    specialProjectile.setDepth(7)
    specialProjectile.setScale(3, 3)
    specialProjectile.anims.play(Ability.MIND_BLOWN)
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
  }

  deathAnimation() {
    this.life = 0
    if (this.lifebar) {
      this.lifebar.setAmount(this.life)
    }

    if (this.projectile) {
      this.projectile.destroy()
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
        this.destroy(true)
      }
    })
  }

  resurectAnimation() {
    if (this.lifebar) {
      this.lifebar.setAmount(0)
    }

    const coordinates = transformAttackCoordinate(
      this.positionX,
      this.positionY
    )
    const resurectAnim = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "RESURECT",
      "000"
    )
    resurectAnim.setDepth(7)
    resurectAnim.setScale(2, 2)
    resurectAnim.anims.play("RESURECT")
    resurectAnim.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      resurectAnim.destroy()
    })
  }

  fishingAnimation() {
    const coordinates = transformCoordinate(this.positionX, this.positionY)
    const specialProjectile = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      Ability.DIVE,
      "000"
    )
    specialProjectile.setDepth(this.sprite.depth - 1)
    specialProjectile.setScale(1, 1)
    specialProjectile.anims.play(Ability.DIVE)
    specialProjectile.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      specialProjectile.destroy()
    })
    this.sprite.once(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
      const g = <GameScene>this.scene
      g.animationManager?.animatePokemon(this, PokemonActionState.IDLE)
    })
  }

  specialAttackAnimation(group: Phaser.GameObjects.Group, ultCount: number) {
    if (this.skill && this.skill === Ability.GROWTH) {
      this.sprite.setScale(2 + 0.5 * ultCount)
    }
  }

  addTween() {
    if (
      this.targetX &&
      this.targetY &&
      this.targetX != -1 &&
      this.targetY != -1
    ) {
      const coordinates = transformAttackCoordinate(this.targetX, this.targetY)

      if (this.scene) {
        // logger.debug(`Shooting a projectile to (${this.targetX},${this.targetY})`);
        this.scene.tweens.add({
          targets: this.projectile,
          x: coordinates[0],
          y: coordinates[1],
          ease: "Linear",
          duration: this.atkSpeed ? 1000 / this.atkSpeed : 1500,
          onComplete: () => {
            if (this.projectile) {
              this.projectile.destroy()
            }
          }
        })
      } else {
        if (this.projectile) {
          this.projectile.destroy()
        }
      }
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
        pokemon.team
      )
      this.lifebar.setAmount(pokemon.life)
      this.lifebar.setShieldAmount(pokemon.shield)
      this.add(this.lifebar)
    }
  }

  setManaBar(pokemon: IPokemonEntity, scene: Phaser.Scene) {
    if (pokemon.mana !== undefined) {
      this.manabar = new ManaBar(
        scene,
        0,
        this.height / 2 + 12,
        60,
        pokemon.maxMana
      )
      this.manabar.setAmount(pokemon.mana)
      this.add(this.manabar)
    }
  }

  addWound() {
    if (!this.wound) {
      this.wound = new GameObjects.Sprite(this.scene, 0, -30, "wound", "000")
      this.wound.setScale(2, 2)
      this.scene.add.existing(this.wound)
      this.wound.anims.play("wound")
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
      this.burn = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/burn/000"
      )
      this.burn.setScale(2, 2)
      this.scene.add.existing(this.burn)
      this.burn.anims.play("burn")
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
      this.sleep = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/sleep/000"
      )
      this.sleep.setScale(2, 2)
      this.scene.add.existing(this.sleep)
      this.sleep.anims.play("sleep")
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
      this.silence = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/silence/000"
      )
      this.silence.setScale(2, 2)
      this.scene.add.existing(this.silence)
      this.silence.anims.play("silence")
      this.add(this.silence)
    }
  }

  removeSilence() {
    if (this.silence) {
      this.remove(this.silence, true)
      this.silence = undefined
    }
  }

  addFreeze() {
    if (!this.freeze) {
      this.freeze = new GameObjects.Sprite(
        this.scene,
        0,
        0,
        "status",
        "status/freeze/000"
      )
      this.freeze.setScale(2, 2)
      this.scene.add.existing(this.freeze)
      this.freeze.anims.play("freeze")
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
      this.confusion = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/confusion/000"
      )
      this.confusion.setScale(2, 2)
      this.scene.add.existing(this.confusion)
      this.confusion.anims.play("confusion")
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
      this.paralysis = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "paralysis",
        "000"
      )
      this.paralysis.setScale(2, 2)
      this.scene.add.existing(this.paralysis)
      this.paralysis.anims.play("paralysis")
      this.add(this.paralysis)
    }
  }

  removeParalysis() {
    if (this.paralysis) {
      this.remove(this.paralysis, true)
      this.paralysis = undefined
    }
  }

  addArmorReduction() {
    if (!this.armorReduction) {
      this.armorReduction = new GameObjects.Sprite(
        this.scene,
        0,
        -40,
        "armorReduction",
        "000"
      )
      this.armorReduction.setScale(2, 2)
      this.scene.add.existing(this.armorReduction)
      this.armorReduction.anims.play("armorReduction")
      this.add(this.armorReduction)
    }
  }

  removeArmorReduction() {
    if (this.armorReduction) {
      this.remove(this.armorReduction, true)
      this.armorReduction = undefined
    }
  }

  addPoison() {
    if (!this.poison) {
      this.poison = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/poison/000"
      )
      this.poison.setScale(2, 2)
      this.scene.add.existing(this.poison)
      this.poison.anims.play("poison")
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
      this.protect = new GameObjects.Sprite(
        this.scene,
        0,
        -30,
        "status",
        "status/protect/000"
      )
      this.protect.setScale(2, 2)
      this.scene.add.existing(this.protect)
      this.protect.anims.play("protect")
      this.add(this.protect)
    }
  }

  removeProtect() {
    if (this.protect) {
      this.remove(this.protect, true)
      this.protect = undefined
    }
  }

  addResurection() {
    if (!this.resurection) {
      this.resurection = new GameObjects.Sprite(
        this.scene,
        0,
        -45,
        "resurection",
        "000"
      )
      this.resurection.setScale(2, 2)
      this.scene.add.existing(this.resurection)
      this.resurection.anims.play("resurection")
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
      this.runeProtect = new GameObjects.Sprite(
        this.scene,
        0,
        -45,
        "rune_protect",
        "000"
      )
      this.runeProtect.setScale(2, 2)
      this.scene.add.existing(this.runeProtect)
      this.runeProtect.anims.play("rune_protect")
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
      this.spikeArmor = new GameObjects.Sprite(
        this.scene,
        0,
        0,
        Ability.SPIKE_ARMOR,
        "000"
      )
      this.spikeArmor.setScale(2, 2)
      this.scene.add.existing(this.spikeArmor)
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
      this.magicBounce = new GameObjects.Sprite(
        this.scene,
        0,
        0,
        Ability.SPIKE_ARMOR,
        "000"
      )
      this.magicBounce.setScale(2, 2)
      this.scene.add.existing(this.magicBounce)
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

  addElectricField() {
    if (!this.electricField) {
      this.electricField = new GameObjects.Sprite(
        this.scene,
        0,
        10,
        "ELECTRIC_SURGE",
        "000"
      )
      this.electricField.setDepth(0)
      this.electricField.setScale(1.5, 1.5)
      this.scene.add.existing(this.electricField)
      this.electricField.anims.play("ELECTRIC_SURGE")
      this.add(this.electricField)
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
      this.grassField = new GameObjects.Sprite(
        this.scene,
        0,
        10,
        Ability.GRASSY_SURGE,
        "000"
      )
      this.grassField.setDepth(0)
      this.grassField.setScale(2, 2)
      this.scene.add.existing(this.grassField)
      this.grassField.anims.play(Ability.GRASSY_SURGE)
      this.add(this.grassField)
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
      this.fairyField = new GameObjects.Sprite(
        this.scene,
        0,
        10,
        Ability.MISTY_SURGE,
        "000"
      )
      this.fairyField.setDepth(0)
      this.fairyField.setScale(1, 1)
      this.scene.add.existing(this.fairyField)
      this.fairyField.anims.play(Ability.MISTY_SURGE)
      this.add(this.fairyField)
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
      this.psychicField = new GameObjects.Sprite(
        this.scene,
        0,
        10,
        "PSYCHIC_SURGE",
        "000"
      )
      this.psychicField.setDepth(0)
      this.scene.add.existing(this.psychicField)
      this.psychicField.anims.play("PSYCHIC_SURGE")
      this.add(this.psychicField)
    }
  }

  removePsychicField() {
    if (this.psychicField) {
      this.remove(this.psychicField, true)
      this.psychicField = undefined
    }
  }
}
