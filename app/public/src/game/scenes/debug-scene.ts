import { DesignTiled } from "../../../../core/design"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AnimationType } from "../../../../types/Animation"
import { DungeonDetails, DungeonPMDO } from "../../../../types/enum/Dungeon"
import { Orientation, Stat } from "../../../../types/enum/Game"
import { Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import { Status } from "../../../../types/enum/Status"
import { logger } from "../../../../utils/logger"
import { max } from "../../../../utils/number"
import { OrientationVector } from "../../../../utils/orientation"
import { playMusic, preloadMusic } from "../../pages/utils/audio"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import { displayAbility, displayHit } from "../components/abilities-animations"
import LoadingManager from "../components/loading-manager"
import PokemonSprite from "../components/pokemon"
import { DEFAULT_POKEMON_ANIMATION_CONFIG, PokemonAnimations } from "../components/pokemon-animations"
import { DEPTH } from "../depths"

type Boost =
  | "BOOST/ATK"
  | "BOOST/AP"
  | "BOOST/DEF"
  | "BOOST/SPE_DEF"
  | "BOOST/SHIELD"
  | "BOOST/SPEED"

export class DebugScene extends Phaser.Scene {
  height: number
  width: number
  animationManager: AnimationManager | null = null
  loadingManager: LoadingManager | null = null
  onProgress: (value: number) => void
  onComplete: () => void
  pokemon?: PokemonSprite
  target?: PokemonSprite
  uid = "debug"
  tilemap: DesignTiled | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  colorFilter: Phaser.GameObjects.Rectangle | null = null
  music: Phaser.Sound.WebAudioSound | null = null
  attackAnimInterval: ReturnType<typeof setInterval> | undefined

  constructor(
    height: number,
    width: number,
    onProgress: (value: number) => void,
    onComplete: () => void
  ) {
    super()
    this.height = height
    this.width = width
    this.onProgress = onProgress
    this.onComplete = onComplete
  }

  preload() {
    this.loadingManager = new LoadingManager(this)

    this.load.on("progress", (value: number) => {
      this.onProgress(value)
    })
    this.load.once("complete", () => {
      this.animationManager = new AnimationManager(this)
      this.onComplete()
    })
  }

  create() { }

  updateSprite(
    pkm: Pkm,
    orientation: Orientation,
    animationType: string,
    status: Status | "",
    shiny: boolean
  ) {
    if (this.pokemon) {
      this.pokemon.destroy()
    }
    if (this.target) {
      this.target.destroy()
      clearInterval(this.attackAnimInterval)
    }
    const [px, py] = transformEntityCoordinates(3, 3, false)
    this.pokemon = new PokemonSprite(
      this,
      px,
      py,
      PokemonFactory.createPokemonFromName(pkm, { shiny }),
      "debug",
      false,
      false
    )
    this.pokemon.orientation = orientation
    this.pokemon.positionX = 3
    this.pokemon.positionY = 3
    let animationName = AnimationType[animationType]
    const anims = { ...DEFAULT_POKEMON_ANIMATION_CONFIG, ...(PokemonAnimations[pkm] ?? {}) }
    if (animationType === "Attack") {
      animationName = anims.attack
      this.showTarget()
      this.addAttackAnim()
    }
    if (animationType === "Ability") {
      animationName = anims.ability
      this.showTarget()
      this.addAbilityAnim()
    }
    if (animationType === "Emote") {
      animationName = anims.emote
    }
    if (animationType === "Hop") {
      animationName = anims.hop
    }
    if (animationType === "Hurt") {
      animationName = anims.hurt
    }
    if (animationType === "Sleep") {
      animationName = anims.sleep
    }
    if (animationType === "Eat") {
      animationName = anims.eat
    }

    try {
      this.animationManager?.play(this.pokemon, animationName, { repeat: -1 })
    } catch (err) {
      logger.error(
        `Error playing animation ${this.pokemon.name} ${animationType}: ${animationName}`,
        err
      )
    }
    this.applyStatusAnimation(status)
  }

  updateMap(mapName: DungeonPMDO | "town"): Promise<void> {
    if (this.map) this.map.destroy()

    if (mapName === "town") {
      return new Promise((resolve) => {
        this.map = this.add.tilemap("town")
        const tileset = this.map.addTilesetImage(
          "town_tileset",
          "town_tileset"
        )!
        this.map.createLayer("layer0", tileset, 0, 0)?.setScale(2, 2)
        this.map.createLayer("layer1", tileset, 0, 0)?.setScale(2, 2)
        this.map.createLayer("layer2", tileset, 0, 0)?.setScale(2, 2)
        const sys = this.sys as any
        if (sys.animatedTiles) {
          sys.animatedTiles.pause()
        }
        playMusic(this as any, DungeonDetails[mapName].music)
        resolve()
      })
    }

    return fetch(`/tilemap/${mapName}`)
      .then((res) => res.json())
      .then((tilemap: DesignTiled) => {
        this.tilemap = tilemap
        return new Promise((resolve) => {
          this.load.reset()
          tilemap.tilesets.forEach((t) => {
            //logger.debug(`loading tileset ${t.image}`)
            this.load.image(
              mapName + "/" + t.name,
              "/assets/tilesets/" + mapName + "/" + t.image
            )
          })
          this.load.tilemapTiledJSON(mapName, tilemap)
          preloadMusic(this, DungeonDetails[mapName].music)
          this.load.once("complete", resolve)
          this.load.start()
        })
      })
      .then(() => {
        const map = this.make.tilemap({ key: mapName })
        this.map = map
        this.tilemap!.layers.forEach((layer) => {
          const tileset = map.addTilesetImage(
            layer.name,
            mapName + "/" + layer.name
          )!
          map.createLayer(layer.name, tileset, 0, 0)?.setScale(2, 2)
        })
          ; (this.sys as any).animatedTiles.init(map)
        playMusic(this as any, DungeonDetails[mapName].music)
      })
  }

  updateColorFilter({
    red,
    green,
    blue,
    alpha
  }: {
    red: number
    green: number
    blue: number
    alpha: number
  }) {
    this.colorFilter?.destroy()
    this.colorFilter = this.add.existing(
      new Phaser.GameObjects.Rectangle(
        this,
        1500,
        1000,
        3000,
        2000,
        new Phaser.Display.Color(red, green, blue).color,
        alpha / 100
      ).setDepth(DEPTH.WEATHER_FX)
    )
  }

  applyStatusAnimation(status: Status | Boost | "") {
    if (this.pokemon) {
      this.pokemon.sprite.setTint(0xffffff)
      this.pokemon.removePoison()
      this.pokemon.removeSleep()
      this.pokemon.removeBurn()
      this.pokemon.removeSilence()
      this.pokemon.removeFatigue()
      this.pokemon.removeConfusion()
      this.pokemon.removeFreeze()
      this.pokemon.removeProtect()
      this.pokemon.removeWound()
      this.pokemon.removeResurection()
      this.pokemon.removeParalysis()
      this.pokemon.removePokerus()
      this.pokemon.removeLocked()
      this.pokemon.removeBlinded()
      this.pokemon.removeArmorReduction()
      this.pokemon.removeCharm()
      this.pokemon.removeRuneProtect()
      this.pokemon.removePossessed()
      this.pokemon.removeReflectShieldAnim()
      this.pokemon.removeFlinch()
      this.pokemon.removeCurse()
      this.pokemon.removeElectricField()
      this.pokemon.removePsychicField()
      this.pokemon.removeGrassField()
      this.pokemon.removeFairyField()

      if (status === Status.POISONNED) {
        this.pokemon.addPoison()
      }
      if (status === Status.SLEEP) {
        this.pokemon.addSleep()
      }
      if (status === Status.BURN) {
        this.pokemon.addBurn()
      }
      if (status == Status.SILENCE) {
        this.pokemon.addSilence()
      }
      if (status == Status.FATIGUE) {
        this.pokemon.addFatigue()
      }
      if (status == Status.CONFUSION) {
        this.pokemon.addConfusion()
      }
      if (status == Status.FREEZE) {
        this.pokemon.addFreeze()
      }
      if (status == Status.PROTECT) {
        this.pokemon.addProtect()
      }
      if (status == Status.WOUND) {
        this.pokemon.addWound()
      }
      if (status == Status.RESURECTION) {
        this.pokemon.addResurection()
      }
      if (status == Status.RESURECTING) {
        this.pokemon.resurectAnimation()
      }
      if (status == Status.PARALYSIS) {
        this.pokemon.addParalysis()
      }
      if (status == Status.POKERUS) {
        this.pokemon.addPokerus()
      }
      if (status == Status.ARMOR_BREAK) {
        this.pokemon.addArmorReduction()
      }
      if (status == Status.CHARM) {
        this.pokemon.addCharm()
      }
      if (status === Status.FLINCH) {
        this.pokemon.addFlinch()
      }
      if (status === Status.CURSE) {
        this.pokemon.addCurse()
      }
      if (status == Status.RUNE_PROTECT) {
        this.pokemon.addRuneProtect()
      }
      if (status == Status.RAGE) {
        this.pokemon.addRageEffect()
      }
      if (status == Status.LOCKED) {
        this.pokemon.addLocked()
      }
      if (status == Status.POSSESSED) {
        this.pokemon.addPossessed()
      }
      if (status == Status.BLINDED) {
        this.pokemon.addBlinded()
      }
      if (status == Status.SPIKY_SHIELD) {
        this.pokemon.addReflectShieldAnim()
      }
      if (status == Status.MAGIC_BOUNCE) {
        this.pokemon.addReflectShieldAnim(0xffa0ff)
      }
      if (status == Status.REFLECT) {
        this.pokemon.addReflectShieldAnim(0xff3030)
      }
      if (status == Status.ELECTRIC_FIELD) {
        this.pokemon.addElectricField()
      }
      if (status == Status.PSYCHIC_FIELD) {
        this.pokemon.addPsychicField()
      }
      if (status == Status.GRASS_FIELD) {
        this.pokemon.addGrassField()
      }
      if (status == Status.FAIRY_FIELD) {
        this.pokemon.addFairyField()
      }

      if (status === "BOOST/ATK") {
        this.pokemon.displayBoost(Stat.ATK, true)
      }
      if (status === "BOOST/AP") {
        this.pokemon.displayBoost(Stat.AP, true)
      }
      if (status === "BOOST/DEF") {
        this.pokemon.displayBoost(Stat.DEF, true)
      }
      if (status === "BOOST/SPE_DEF") {
        this.pokemon.displayBoost(Stat.SPE_DEF, true)
      }
      if (status === "BOOST/SHIELD") {
        this.pokemon.displayBoost(Stat.SHIELD, true)
      }
      if (status === "BOOST/SPEED") {
        this.pokemon.displayBoost(Stat.SPEED, true)
      }
    }
  }

  showTarget() {
    const or = this.pokemon!.orientation
    const range = max(2)(this.pokemon!.range)
    const tx = this.pokemon!.positionX + OrientationVector[or][0] * range
    const ty = this.pokemon!.positionY + OrientationVector[or][1] * range
    this.pokemon!.targetX = tx
    this.pokemon!.targetY = ty
    const [rtx, rty] = transformEntityCoordinates(tx, ty, false)
    this.target = new PokemonSprite(
      this,
      rtx,
      rty,
      PokemonFactory.createPokemonFromName(Pkm.SUBSTITUTE),
      "debug",
      false,
      false
    )
    this.target.positionX = tx
    this.target.positionY = ty
    this.animationManager?.play(this.target, AnimationType.Idle, { repeat: -1 })
  }

  addAttackAnim() {
    const attack = () => {
      if (!this.pokemon) return
      this.pokemon.attackAnimation(
        this.pokemon.targetX || 0,
        this.pokemon.targetY || 0,
        0,
        1000,
        () => {
          if (!this.pokemon) return
          const [x, y] = transformEntityCoordinates(
            this.pokemon.targetX || 0,
            this.pokemon.targetY || 0,
            false
          )
          displayHit(
            this,
            PokemonAnimations[PkmByIndex[this.pokemon.index]]?.hitSprite ?? DEFAULT_POKEMON_ANIMATION_CONFIG.hitSprite,
            x,
            y,
            false
          )
        }
      )
    }
    attack()
    this.attackAnimInterval = setInterval(attack, 2000)
  }

  addAbilityAnim() {
    const showAbilityAnim = () => {
      displayAbility({
        scene: this,
        pokemonsOnBoard: [this.target!],
        ability: this.pokemon!.skill,
        orientation: this.pokemon!.orientation,
        positionX: this.pokemon!.positionX,
        positionY: this.pokemon!.positionY,
        targetX: this.pokemon!.targetX ?? -1,
        targetY: this.pokemon!.targetY ?? -1,
        flip: this.pokemon!.flip,
        ap: 0
      })
    }
    showAbilityAnim()
    this.attackAnimInterval = setInterval(showAbilityAnim, 2000)
  }

  shakeCamera(options?: { intensity?: number; duration?: number }) {
    this.cameras.main.shake(options?.duration ?? 250, options?.intensity ?? 0.01)
  }
}
