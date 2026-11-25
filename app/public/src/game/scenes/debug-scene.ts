import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  getRegionTint,
  RegionDetails
} from "../../../../config"
import { AbilityConfigs } from "../../../../config/game/abilities"
import type { DesignTiled } from "../../../../core/design"
import PokemonFactory from "../../../../models/pokemon-factory"
import {
  type AbilityAnimationArgs,
  AnimationType,
  AttackSprite,
  AttackSpriteScale
} from "../../../../types/Animation"
import { Ability } from "../../../../types/enum/Ability"
import type { DungeonPMDO } from "../../../../types/enum/Dungeon"
import { Orientation, Stat } from "../../../../types/enum/Game"
import { Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import { Status } from "../../../../types/enum/Status"
import { Weather } from "../../../../types/enum/Weather"
import { logger } from "../../../../utils/logger"
import { max } from "../../../../utils/number"
import { OrientationVector } from "../../../../utils/orientation"
import {
  type AbilityPreviewOptions,
  isPreviewCell
} from "../../pages/component/debug/ability-preview"
import {
  type AttackTimingInput,
  getAttackTimings
} from "../../pages/component/debug/attack-timings"
import type { PreviewStatus } from "../../pages/component/debug/preview-scenario"
import { playMusic, preloadMusic } from "../../pages/utils/audio"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import { preference } from "../../preferences"
import AnimationManager, { getAttackAnimTimeScale } from "../animation-manager"
import {
  clearAbilityAnimations,
  displayAbility,
  displayHit
} from "../components/abilities-animations"
import { FUTURE_SIGHT_TIMING } from "../components/animations/future-sight-cast"
import { GEOMANCY_DURATION } from "../components/animations/geomancy"
import { MIST_BALL_RETURN_IMPACT_DURATION } from "../components/animations/mist-ball"
import { STORED_POWER_TIMING } from "../components/animations/stored-power"
import LoadingManager from "../components/loading-manager"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "../components/pokemon-animations"
import PokemonSprite, { resetSpriteCounts } from "../components/pokemon-sprite"
import WeatherManager from "../components/weather-manager"
import { DEPTH } from "../depths"

export class DebugScene extends Phaser.Scene {
  height: number
  width: number
  animationManager: AnimationManager | null = null
  loadingManager: LoadingManager | null = null
  weatherManager: WeatherManager | undefined
  onProgress: (value: number) => void
  onComplete: () => void
  pokemonSprite?: PokemonSprite
  target?: PokemonSprite
  previewTargets: PokemonSprite[] = []
  abilityPreview?: AbilityPreviewOptions
  uid = "debug"
  mapName: DungeonPMDO | "town" = "town"
  tilemap: DesignTiled | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  colorFilter: Phaser.GameObjects.Rectangle | null = null
  music: Phaser.Sound.WebAudioSound | null = null
  abilitiesVfxGroup: Phaser.GameObjects.Group | undefined
  landscape: Phaser.GameObjects.Sprite[] = []
  previewElapsed: number | null = null
  loopPreview = false
  private previewAnimationType = "Idle"
  private previewStatus: PreviewStatus = ""
  private frameDelta = 0
  private hasSeekBaseline = false
  private attackEffect?: {
    sprite: Phaser.GameObjects.Sprite
    animation: AttackSprite
    ranged: boolean
    shootTime: number
    travelTime: number
    startX: number
    startY: number
    targetX: number
    targetY: number
    launched: boolean
    hit: boolean
  }

  static readonly VIEW_WIDTH = (BOARD_WIDTH + 1) * CELL_WIDTH
  static readonly VIEW_HEIGHT = (BOARD_HEIGHT + 3.5) * CELL_HEIGHT

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
    resetSpriteCounts()
    this.loadingManager = new LoadingManager(this)

    this.load.on("progress", (value: number) => {
      this.onProgress(value)
    })
    this.load.once("complete", () => {
      this.animationManager = new AnimationManager(this)
    })
  }

  create() {
    this.abilitiesVfxGroup = this.add.group()
    this.weatherManager = new WeatherManager(this)
    if (this.width === DebugScene.VIEW_WIDTH) {
      const [left, near] = transformEntityCoordinates(0, 0, false)
      const [right, far] = transformEntityCoordinates(BOARD_WIDTH - 1, 0, true)
      this.cameras.main.centerOn(
        (left + right) / 2,
        (near + far) / 2 - CELL_HEIGHT / 2
      )
    }
    // Keep tweens on the same clock as sprite animations and Phaser timers.
    this.events.on(Phaser.Scenes.Events.PRE_UPDATE, (_time, delta: number) => {
      this.frameDelta = delta
    })
    this.tweens.getDelta = () => this.frameDelta
    this.onComplete()
  }

  update(_time: number, delta: number) {
    if (this.previewElapsed === null || !this.pokemonSprite) return

    const elapsed = Math.min(this.previewElapsed + delta, this.previewDuration)
    if (this.previewAnimationType === "Attack") this.updateAttackEffect(elapsed)
    if (this.loopPreview && elapsed >= this.previewDuration) {
      this.replayPreview()
      return
    }

    this.previewElapsed = elapsed
  }

  get previewDuration() {
    if (this.previewAnimationType === "Attack") {
      const input = this.getAttackTimingInput()
      if (input && this.target) {
        const { attackDuration, delayBeforeShoot, travelTime } =
          getAttackTimings(input)
        // Battle projectiles travel for at least 250 ms, even at short range.
        const visualTravelTime = this.pokemonSprite?.attackSprite.endsWith(
          "/range"
        )
          ? Math.max(250, travelTime)
          : 0
        return (
          Math.max(attackDuration, delayBeforeShoot + visualTravelTime) + 400
        )
      }
      return 2000
    }

    const ability =
      this.abilityPreview?.ability ?? this.pokemonSprite?.pokemon.skill
    if (ability === Ability.FUTURE_SIGHT) return FUTURE_SIGHT_TIMING.replay
    if (ability === Ability.GEOMANCY) return GEOMANCY_DURATION + 100
    if (ability === Ability.MIST_BALL || ability === Ability.LUSTER_PURGE)
      return (
        AbilityConfigs[ability].returnDelay * 2 +
        MIST_BALL_RETURN_IMPACT_DURATION +
        100
      )
    return 2000
  }

  setPreviewPaused(paused: boolean) {
    if (paused && !this.sys.isPaused()) this.sys.pause()
    if (!paused && this.sys.isPaused()) {
      this.hasSeekBaseline = false
      this.sys.resume()
    }
  }

  stepPreviewFrame() {
    if (!this.sys.isPaused()) return
    const frame = 1000 / 60
    this.sys.step(this.time.now + frame, frame)
  }

  seekPreviewTime(milliseconds: number) {
    if (
      !this.sys.isPaused() ||
      !this.pokemonSprite ||
      !Number.isFinite(milliseconds)
    ) {
      return this.previewElapsed ?? 0
    }

    const target = Phaser.Math.Clamp(milliseconds, 0, this.previewDuration)
    const frameDuration = 1000 / 60
    const targetFrame = Math.round(target / frameDuration)
    let currentFrame = Math.round((this.previewElapsed ?? 0) / frameDuration)
    const shouldLoop = this.loopPreview
    this.loopPreview = false
    try {
      // Rewind from a common sprite and cast origin; forward seeks reuse it.
      if (!this.hasSeekBaseline || targetFrame < currentFrame) {
        const sprites = [this.pokemonSprite, ...this.previewTargets]
        if (this.target) sprites.push(this.target)
        for (const { sprite, shadow } of sprites) {
          sprite.anims.restart(false, true)
          shadow?.anims.restart(false, true)
        }
        this.replayPreview()
        this.hasSeekBaseline = true
        currentFrame = 0
      }
      for (let frame = currentFrame; frame < targetFrame; frame++) {
        this.stepPreviewFrame()
      }
    } finally {
      this.loopPreview = shouldLoop
    }
    return this.previewElapsed ?? 0
  }

  updateSprite(
    pkm: Pkm,
    orientation: Orientation,
    animationType: string,
    status: PreviewStatus,
    shiny: boolean,
    preview?: AbilityPreviewOptions,
    onPreviewReady?: () => void,
    speed?: number
  ) {
    this.abilityPreview = preview
    this.previewAnimationType = animationType
    this.previewStatus = status
    if (this.pokemonSprite) {
      this.pokemonSprite.destroy()
    }
    clearAbilityAnimations(this)
    this.attackEffect = undefined
    this.time.clearPendingEvents().removeAllEvents()
    this.previewElapsed = null
    this.hasSeekBaseline = false
    if (this.target) {
      this.target.destroy()
      this.target = undefined
    }
    this.previewTargets.forEach((sprite) => sprite.destroy())
    this.previewTargets = []
    const caster = preview?.caster ?? { x: 3, y: 3 }
    const flip = preview?.flip ?? false
    const [px, py] = transformEntityCoordinates(caster.x, caster.y, flip)
    this.pokemonSprite = new PokemonSprite(
      this,
      px,
      py,
      PokemonFactory.createPokemonFromName(pkm, { shiny }),
      "debug",
      false,
      flip
    )
    if (speed !== undefined) this.pokemonSprite.pokemon.speed = speed
    this.pokemonSprite.orientation = orientation
    this.pokemonSprite.pokemon.positionX = caster.x
    this.pokemonSprite.pokemon.positionY = caster.y

    this.pokemonSprite.sprite.setTint(
      getRegionTint(this.mapName, preference("colorblindMode"))
    )

    let animationName = AnimationType[animationType]
    const anims = {
      ...DEFAULT_POKEMON_ANIMATION_CONFIG,
      ...(PokemonAnimations[pkm] ?? {})
    }
    if (animationType === "Attack") {
      animationName = anims.attack
      this.showTarget()
    }
    if (animationType === "Ability") {
      animationName = anims.idle
      this.showTarget()
      this.showPreviewTargets()
      this.sortAbilityPreviewSprites(this.pokemonSprite)
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

    this.pokemonSprite.once("loaded", () => {
      try {
        this.animationManager?.play(this.pokemonSprite!, animationName, {
          flip,
          repeat: animationType === "Attack" ? 0 : -1,
          timeScale:
            animationType === "Attack"
              ? getAttackAnimTimeScale(
                  this.pokemonSprite!.pokemon.index,
                  this.pokemonSprite!.pokemon.speed
                )
              : 1
        })
      } catch (err) {
        logger.error(
          `Error playing animation ${this.pokemonSprite!.name} ${animationType}: ${animationName}`,
          err
        )
      }
      this.applyStatusAnimation(status)
      if (!onPreviewReady && animationType === "Ability") this.replayAbility()
      if (!onPreviewReady && animationType === "Attack") this.replayAttack()
    })
    if (onPreviewReady) {
      const casterSprite = this.pokemonSprite
      const sprites = [casterSprite, ...this.previewTargets]
      if (this.target) sprites.push(this.target)
      let remaining = sprites.length
      for (const sprite of sprites) {
        sprite.once("loaded", () => {
          if (--remaining === 0 && this.pokemonSprite === casterSprite) {
            onPreviewReady()
          }
        })
      }
    }
  }

  updateMap(mapName: DungeonPMDO | "town", preview = false): Promise<void> {
    if (this.map) this.map.destroy()

    this.mapName = mapName
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
        if (!preview) playMusic(this as any, RegionDetails[mapName].music)
        resolve()
      })
    }

    return fetch(`/tilemap/${mapName}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load map ${mapName}: ${res.status}`)
        return res.json()
      })
      .then((tilemap: DesignTiled) => {
        this.tilemap = tilemap
        return new Promise<void>((resolve, reject) => {
          if (!preview) this.load.reset()
          let failedFile: string | undefined
          const onLoadError = (file: Phaser.Loader.File) => {
            if (file.key === mapName || file.key.startsWith(`${mapName}/`)) {
              failedFile = file.key
            }
          }
          if (preview) {
            this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, onLoadError)
          }
          tilemap.tilesets.forEach((t) => {
            //logger.debug(`loading tileset ${t.image}`)
            this.load.image(
              mapName + "/" + t.name,
              "/assets/tilesets/" + mapName + "/" + t.image
            )
          })
          this.load.tilemapTiledJSON(mapName, tilemap)
          if (!preview) preloadMusic(this, RegionDetails[mapName].music)
          this.load.once("complete", () => {
            this.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, onLoadError)
            if (failedFile) {
              reject(new Error(`Failed to load map asset: ${failedFile}`))
            } else {
              resolve()
            }
          })
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
        if (!preview) playMusic(this as any, RegionDetails[mapName].music)
      })
      .then(() => {
        if (!preview) {
          this.updateSprite(
            Pkm.SMEARGLE,
            Orientation.DOWNLEFT,
            "Idle",
            "",
            false
          )
          this.updateLandscape()
        }
      })
  }

  clearPreviewMap() {
    this.map?.destroy()
    this.map = undefined
    this.mapName = "town"
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

  updateLandscape() {
    if (!this.map) return
    const tint = getRegionTint(this.mapName, preference("colorblindMode"))
    this.landscape.forEach((sprite) => sprite.destroy())
    this.landscape = [
      this.scene.scene.add.sprite(850, 600, "ground_holes", `trench3.png`),
      this.scene.scene.add.sprite(1200, 600, "ground_holes", `hole5.png`),
      this.scene.scene.add.sprite(
        420,
        660,
        "berry_trees",
        "ASPEAR_BERRY_4.png"
      ),
      this.scene.scene.add.sprite(
        360,
        660,
        "berry_trees",
        "BABIRI_BERRY_6.png"
      ),
      this.scene.scene.add.sprite(
        300,
        660,
        "berry_trees",
        "LIECHI_BERRY_3.png"
      ),
      this.scene.scene.add.sprite(320, 580, "flower_pots", "BLUE.png"),
      this.scene.scene.add.sprite(420, 580, "flower_pots", "PINK.png")
    ]
    this.landscape.forEach((sprite) => sprite.setScale(2).setTint(tint))
  }

  applyStatusAnimation(status: PreviewStatus) {
    if (this.pokemonSprite) {
      this.pokemonSprite.sprite.setTint(
        getRegionTint(this.mapName, preference("colorblindMode"))
      )
      this.pokemonSprite.removePoison()
      this.pokemonSprite.removeSleep()
      this.pokemonSprite.removeBurn()
      this.pokemonSprite.removeSilence()
      this.pokemonSprite.removeFatigue()
      this.pokemonSprite.removeConfusion()
      this.pokemonSprite.removeFreeze()
      this.pokemonSprite.removeProtect()
      this.pokemonSprite.removeWound()
      this.pokemonSprite.removeResurrection()
      this.pokemonSprite.removeParalysis()
      this.pokemonSprite.removePokerus()
      this.pokemonSprite.removeLocked()
      this.pokemonSprite.removeBlinded()
      this.pokemonSprite.removeArmorReduction()
      this.pokemonSprite.removeCharm()
      this.pokemonSprite.removeRuneProtect()
      this.pokemonSprite.removePossessed()
      this.pokemonSprite.removeReflectShieldAnim()
      this.pokemonSprite.removeFlinch()
      this.pokemonSprite.removeCurse()
      this.pokemonSprite.removeElectricField()
      this.pokemonSprite.removePsychicField()
      this.pokemonSprite.removeGrassField()
      this.pokemonSprite.removeFairyField()
      this.pokemonSprite.removeStellarEffect()

      if (status === Status.POISONED) {
        this.pokemonSprite.addPoison(1)
      }
      if (status === "POISONED_BADLY") {
        this.pokemonSprite.addPoison(3)
      }
      if (status === Status.SLEEP) {
        this.pokemonSprite.addSleep()
      }
      if (status === Status.BURN) {
        this.pokemonSprite.addBurn()
      }
      if (status == Status.SILENCE) {
        this.pokemonSprite.addSilence()
      }
      if (status == Status.FATIGUE) {
        this.pokemonSprite.addFatigue()
      }
      if (status == Status.CONFUSION) {
        this.pokemonSprite.addConfusion()
      }
      if (status == Status.FREEZE) {
        this.pokemonSprite.addFreeze()
      }
      if (status == Status.PROTECT) {
        this.pokemonSprite.addProtect()
      }
      if (status == Status.WOUND) {
        this.pokemonSprite.addWound()
      }
      if (status == Status.RESURRECTION) {
        this.pokemonSprite.addResurrection()
      }
      if (status == Status.RESURRECTING) {
        this.pokemonSprite.resurrectAnimation()
      }
      if (status == Status.PARALYSIS) {
        this.pokemonSprite.addParalysis()
      }
      if (status == Status.POKERUS) {
        this.pokemonSprite.addPokerus()
      }
      if (status == Status.ARMOR_BREAK) {
        this.pokemonSprite.addArmorReduction()
      }
      if (status == Status.CHARM) {
        this.pokemonSprite.addCharm()
      }
      if (status === Status.FLINCH) {
        this.pokemonSprite.addFlinch()
      }
      if (status === Status.CURSE) {
        this.pokemonSprite.addCurse()
      }
      if (status == Status.SAFEGUARD) {
        this.pokemonSprite.addRuneProtect()
      }
      if (status == Status.RAGE) {
        this.pokemonSprite.addRageEffect()
      }
      if (status == Status.LOCKED) {
        this.pokemonSprite.addLocked()
      }
      if (status == Status.POSSESSED) {
        this.pokemonSprite.addPossessed()
      }
      if (status == Status.BLINDED) {
        this.pokemonSprite.addBlinded()
      }
      if (status == Status.SPIKY_SHIELD) {
        this.pokemonSprite.addReflectShieldAnim()
      }
      if (status == Status.MAGIC_BOUNCE) {
        this.pokemonSprite.addReflectShieldAnim(0xffa0ff)
      }
      if (status == Status.REFLECT) {
        this.pokemonSprite.addReflectShieldAnim(0xff3030)
      }
      if (status == Status.ELECTRIC_FIELD) {
        this.pokemonSprite.addElectricField()
      }
      if (status == Status.PSYCHIC_FIELD) {
        this.pokemonSprite.addPsychicField()
      }
      if (status == Status.GRASS_FIELD) {
        this.pokemonSprite.addGrassField()
      }
      if (status == Status.FAIRY_FIELD) {
        this.pokemonSprite.addFairyField()
      }
      if (status === "BALM_MUSHROOM") {
        this.pokemonSprite.addBalmMushroomEffect()
      }
      if (status === "STELLAR") {
        this.pokemonSprite.addStellarEffect()
      }
      if (status === "BOOST/ATK") {
        this.pokemonSprite.displayBoost(Stat.ATK, true)
      }
      if (status === "BOOST/AP") {
        this.pokemonSprite.displayBoost(Stat.AP, true)
      }
      if (status === "BOOST/DEF") {
        this.pokemonSprite.displayBoost(Stat.DEF, true)
      }
      if (status === "BOOST/SPE_DEF") {
        this.pokemonSprite.displayBoost(Stat.SPE_DEF, true)
      }
      if (status === "BOOST/SHIELD") {
        this.pokemonSprite.displayBoost(Stat.SHIELD, true)
      }
      if (status === "BOOST/SPEED") {
        this.pokemonSprite.displayBoost(Stat.SPEED, true)
      }
    }
  }

  showTarget() {
    const or = this.pokemonSprite!.orientation
    const range = max(2)(this.pokemonSprite!.pokemon.range)
    const target = this.abilityPreview
      ? this.abilityPreview.target
      : {
          x: this.pokemonSprite!.positionX + OrientationVector[or][0] * range,
          y: this.pokemonSprite!.positionY + OrientationVector[or][1] * range
        }
    if (!target) {
      this.pokemonSprite!.targetX = -1
      this.pokemonSprite!.targetY = -1
      return
    }
    const { x: tx, y: ty } = target
    this.pokemonSprite!.targetX = tx
    this.pokemonSprite!.targetY = ty
    this.target = this.createPreviewTarget(tx, ty)
  }

  createPreviewTarget(x: number, y: number) {
    const flip = this.abilityPreview?.flip ?? false
    const [screenX, screenY] = transformEntityCoordinates(x, y, flip)
    const sprite = new PokemonSprite(
      this,
      screenX,
      screenY,
      PokemonFactory.createPokemonFromName(Pkm.SUBSTITUTE),
      "debug",
      false,
      flip
    )
    sprite.pokemon.positionX = x
    sprite.pokemon.positionY = y
    this.animationManager?.play(sprite, AnimationType.Idle, {
      flip,
      repeat: -1
    })
    return sprite
  }

  showPreviewTargets() {
    if (!this.abilityPreview) return
    const { caster, target, data } = this.abilityPreview
    const seen = new Set([`${caster.x},${caster.y}`])
    if (target) seen.add(`${target.x},${target.y}`)
    const ability =
      this.abilityPreview.ability ?? this.pokemonSprite?.pokemon.skill
    const lists = [data.targets, data.allies]
    if (ability === Ability.MIST_BALL || ability === Ability.LUSTER_PURGE)
      lists.push(data.returnTargets)
    for (const list of lists) {
      if (!Array.isArray(list)) continue
      for (const cell of list.slice(0, 48)) {
        if (!isPreviewCell(cell)) continue
        const key = `${cell.x},${cell.y}`
        if (seen.has(key)) continue
        seen.add(key)
        this.previewTargets.push(this.createPreviewTarget(cell.x, cell.y))
      }
    }
  }

  private sortAbilityPreviewSprites(caster: PokemonSprite) {
    const sprites = [caster, ...this.previewTargets]
    if (this.target) sprites.push(this.target)

    sprites.sort((a, b) => a.y - b.y)
    for (let i = 1; i < sprites.length; i++) {
      this.children.moveAbove(sprites[i], sprites[i - 1])
    }
  }

  private getAttackTimingInput(): AttackTimingInput | undefined {
    const sprite = this.pokemonSprite
    if (!sprite || sprite.targetX == null || sprite.targetY == null) return

    return {
      pokemonIndex: sprite.pokemon.index,
      speed: sprite.pokemon.speed,
      paralyzed: this.previewStatus === Status.PARALYSIS,
      positionX: sprite.pokemon.positionX,
      positionY: sprite.pokemon.positionY,
      targetX: sprite.targetX,
      targetY: sprite.targetY
    }
  }

  replayPreview() {
    if (this.previewAnimationType === "Attack") {
      this.replayAttack()
    } else {
      this.replayAbility()
    }
  }

  private replayAttack() {
    const sprite = this.pokemonSprite
    const target = this.target
    const input = this.getAttackTimingInput()
    this.hasSeekBaseline = false
    this.time.clearPendingEvents().removeAllEvents()
    this.abilitiesVfxGroup?.getChildren().forEach((effect) => {
      this.tweens.killTweensOf(effect)
    })
    clearAbilityAnimations(this)
    this.previewElapsed = 0
    if (!sprite || !target || !input) return

    sprite.animationLocked = false
    this.animationManager?.play(
      sprite,
      PokemonAnimations[sprite.name]?.attack ??
        DEFAULT_POKEMON_ANIMATION_CONFIG.attack,
      {
        flip: sprite.flip,
        repeat: 0,
        timeScale: getAttackAnimTimeScale(
          sprite.pokemon.index,
          sprite.pokemon.speed
        )
      }
    )
    const { delayBeforeShoot, travelTime } = getAttackTimings(input)
    const targetX = sprite.targetX ?? target.pokemon.positionX
    const targetY = sprite.targetY ?? target.pokemon.positionY
    const ranged = sprite.attackSprite.endsWith("/range")
    let attackSprite = sprite.attackSprite
    let scale = AttackSpriteScale[attackSprite]
    let tint = 0xffffff
    if (attackSprite === AttackSprite.DRAGON_GREEN_RANGE) {
      attackSprite = AttackSprite.DRAGON_RANGE
      scale = [1.5, 1.5]
      tint = 0x80ff60
    }
    const [startX, startY] = transformEntityCoordinates(
      ranged ? sprite.positionX : targetX,
      ranged ? sprite.positionY : targetY,
      sprite.flip
    )
    const [endX, endY] = transformEntityCoordinates(
      targetX,
      targetY,
      sprite.flip
    )
    const effect = this.add
      .sprite(startX, startY - 10, "attacks", `${attackSprite}/000.png`)
      .setScale(scale[0], scale[1])
      .setTint(tint)
      .setDepth(DEPTH.PROJECTILE)
      .setVisible(false)
    this.abilitiesVfxGroup?.add(effect)
    if (!ranged) {
      effect.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        effect.setVisible(false)
      )
    }
    this.attackEffect = {
      sprite: effect,
      animation: attackSprite,
      ranged,
      shootTime: Math.max(0, delayBeforeShoot - 20),
      travelTime: ranged ? Math.max(250, travelTime) : 0,
      startX,
      startY: startY - 10,
      targetX: endX,
      targetY: endY,
      launched: false,
      hit: false
    }
  }

  private updateAttackEffect(elapsed: number) {
    const effect = this.attackEffect
    const caster = this.pokemonSprite
    if (!effect || !caster || elapsed < effect.shootTime) return
    if (!effect.launched) {
      effect.launched = true
      effect.sprite.setVisible(true)
      effect.sprite.anims.play(effect.animation)
    }
    const progress =
      effect.travelTime === 0
        ? 1
        : Math.min(1, (elapsed - effect.shootTime) / effect.travelTime)
    if (effect.ranged) {
      effect.sprite.setPosition(
        Phaser.Math.Linear(effect.startX, effect.targetX, progress),
        Phaser.Math.Linear(effect.startY, effect.targetY, progress)
      )
    }
    if (progress >= 1 && !effect.hit) {
      effect.hit = true
      if (effect.ranged) effect.sprite.setVisible(false)
      displayHit(
        this,
        PokemonAnimations[PkmByIndex[caster.pokemon.index]]?.hitSprite ??
          DEFAULT_POKEMON_ANIMATION_CONFIG.hitSprite,
        effect.targetX,
        effect.targetY,
        caster.flip
      )
    }
  }

  replayAbility() {
    if (!this.pokemonSprite) return
    this.hasSeekBaseline = false
    clearAbilityAnimations(this)
    this.time.clearPendingEvents().removeAllEvents()
    this.previewElapsed = 0
    const caster = this.pokemonSprite
    const animation =
      PokemonAnimations[caster.name]?.ability ??
      DEFAULT_POKEMON_ANIMATION_CONFIG.ability
    caster.animationLocked = false
    this.animationManager?.play(caster, animation, {
      flip: caster.flip,
      lock: true,
      repeat: 0
    })
    const showAbilityAnim = () => {
      const caster = this.pokemonSprite
      if (!caster) return
      const args: AbilityAnimationArgs = {
        scene: this,
        pokemonsOnBoard: [
          caster,
          ...(this.target ? [this.target] : []),
          ...this.previewTargets
        ],
        ability: this.abilityPreview?.ability ?? caster.pokemon.skill,
        orientation: caster.orientation,
        positionX: caster.positionX,
        positionY: caster.positionY,
        targetX: caster.targetX ?? -1,
        targetY: caster.targetY ?? -1,
        flip: caster.flip,
        ap: 0,
        data: this.abilityPreview?.data ?? {}
      }
      if (args.ability === Ability.HYPER_BEAM) {
        displayAbility({ ...args, ability: "HYPER_BEAM_CHARGE" })
        displayAbility({
          ...args,
          delay: AbilityConfigs[Ability.HYPER_BEAM].chargeDuration
        })
      } else if (args.ability === Ability.DYNAMAX_CANNON) {
        displayAbility({ ...args, ability: "DYNAMAX_CANNON_CHARGE" })
        displayAbility({
          ...args,
          delay: AbilityConfigs[Ability.DYNAMAX_CANNON].chargeDuration
        })
      } else if (
        args.ability === Ability.MIST_BALL ||
        args.ability === Ability.LUSTER_PURGE
      ) {
        displayAbility({ ...args, data: {} })
      } else {
        displayAbility(args)
      }
      if (
        args.ability === Ability.MIST_BALL ||
        args.ability === Ability.LUSTER_PURGE
      ) {
        const hitAbility =
          args.ability === Ability.MIST_BALL
            ? "MIST_BALL_HIT"
            : "LUSTER_PURGE_HIT"
        displayAbility({
          ...args,
          ability: hitAbility,
          data: { phase: "outbound", targets: args.data.targets }
        })
        displayAbility({
          ...args,
          ability: hitAbility,
          delay: AbilityConfigs[args.ability].returnDelay,
          data: {
            phase: "return",
            targets: args.data.returnTargets ?? args.data.targets,
            travel: {
              positionX: args.positionX,
              positionY: args.positionY,
              targetX: args.targetX,
              targetY: args.targetY
            }
          }
        })
      }
      if (args.ability === Ability.STORED_POWER) {
        displayAbility({
          ...args,
          ability: "STORED_POWER_TARGET",
          delay: STORED_POWER_TIMING.target
        })
        displayAbility({
          ...args,
          ability: "STORED_POWER_HIT",
          delay: STORED_POWER_TIMING.impact
        })
      }
      if (args.ability === Ability.FIERY_DANCE) {
        const timing = AbilityConfigs[Ability.FIERY_DANCE]
        displayAbility({
          ...args,
          ability: "FIERY_DANCE_HIT",
          delay: timing.chargeDuration + timing.flightDuration
        })
      }
      if (args.ability === Ability.FUTURE_SIGHT) {
        displayAbility({
          ...args,
          ability: "FUTURE_SIGHT_HIT",
          delay: FUTURE_SIGHT_TIMING.hit
        })

        const hasTarget = isPreviewCell({
          x: args.targetX,
          y: args.targetY
        })
        const splashTargets =
          hasTarget && Array.isArray(args.data.targets)
            ? args.data.targets
                .filter(isPreviewCell)
                .filter(
                  (cell) =>
                    (cell.x !== args.targetX || cell.y !== args.targetY) &&
                    (cell.x !== args.positionX || cell.y !== args.positionY) &&
                    Math.abs(cell.x - args.targetX) <= 1 &&
                    Math.abs(cell.y - args.targetY) <= 1
                )
                .filter(
                  (cell, index, cells) =>
                    cells.findIndex(
                      (other) => other.x === cell.x && other.y === cell.y
                    ) === index
                )
            : []

        splashTargets.forEach((cell, index) => {
          displayAbility({
            ...args,
            ability: "FUTURE_SIGHT_SPLASH",
            targetX: cell.x,
            targetY: cell.y,
            delay:
              FUTURE_SIGHT_TIMING.hit +
              FUTURE_SIGHT_TIMING.splashStagger * index
          })
        })
      }
    }
    showAbilityAnim()
  }

  shakeCamera(options?: { intensity?: number; duration?: number }) {
    this.cameras.main.shake(
      options?.duration ?? 250,
      options?.intensity ?? 0.01
    )
  }

  setWeather(weather: Weather | "dawn" | "sunset" | "nighttime") {
    if (!this.weatherManager) return
    this.weatherManager.clearWeather()
    if (weather === Weather.RAIN) {
      this.weatherManager.addRain()
    } else if (weather === Weather.ZENITH) {
      this.weatherManager.addSun()
    } else if (weather === Weather.DROUGHT) {
      this.weatherManager.addDrought()
    } else if (weather === Weather.SANDSTORM) {
      this.weatherManager.addSandstorm()
    } else if (weather === Weather.SNOW) {
      this.weatherManager.addSnow()
    } else if (weather === Weather.NIGHT) {
      this.weatherManager.addNight()
    } else if (weather === Weather.BLOODMOON) {
      this.weatherManager.addBloodMoon()
    } else if (weather === Weather.WINDY) {
      this.weatherManager.addWind()
    } else if (weather === Weather.STORM) {
      this.weatherManager.addStorm()
    } else if (weather === Weather.MISTY) {
      this.weatherManager.addMist()
    } else if (weather === Weather.SMOG) {
      this.weatherManager.addSmog()
    } else if (weather === Weather.MURKY) {
      this.weatherManager.addMurky()
    } else if (weather === "dawn") {
      this.weatherManager.setTownDaytime(0)
    } else if (weather === "sunset") {
      this.weatherManager.setTownDaytime(20)
    } else if (weather === "nighttime") {
      this.weatherManager.setTownDaytime(30)
    }
  }
}
