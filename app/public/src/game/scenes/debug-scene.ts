import { DesignTiled } from "../../../../core/design"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AnimationType } from "../../../../types/Animation"
import { DungeonDetails, DungeonPMDO } from "../../../../types/enum/Dungeon"
import { Orientation, Stat } from "../../../../types/enum/Game"
import { Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import { Status } from "../../../../types/enum/Status"
import { Weather } from "../../../../types/enum/Weather"
import { logger } from "../../../../utils/logger"
import { max } from "../../../../utils/number"
import { OrientationVector } from "../../../../utils/orientation"
import { playMusic, preloadMusic } from "../../pages/utils/audio"
import { transformEntityCoordinates } from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import {
  clearAbilityAnimations,
  displayAbility,
  displayHit
} from "../components/abilities-animations"
import LoadingManager from "../components/loading-manager"
import PokemonSprite from "../components/pokemon"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "../components/pokemon-animations"
import WeatherManager from "../components/weather-manager"
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
  weatherManager: WeatherManager | undefined
  onProgress: (value: number) => void
  onComplete: () => void
  pokemonSprite?: PokemonSprite
  target?: PokemonSprite
  uid = "debug"
  mapName: DungeonPMDO | "town" = "town"
  tilemap: DesignTiled | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  colorFilter: Phaser.GameObjects.Rectangle | null = null
  music: Phaser.Sound.WebAudioSound | null = null
  attackAnimInterval: ReturnType<typeof setInterval> | undefined
  abilitiesVfxGroup: Phaser.GameObjects.Group | undefined
  landscape: Phaser.GameObjects.Sprite[] = []

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

  create() {
    this.abilitiesVfxGroup = this.add.group()
    this.weatherManager = new WeatherManager(this)
  }

  updateSprite(
    pkm: Pkm,
    orientation: Orientation,
    animationType: string,
    status: Status | "",
    shiny: boolean
  ) {
    if (this.pokemonSprite) {
      this.pokemonSprite.destroy()
    }
    clearAbilityAnimations(this)
    if (this.target) {
      this.target.destroy()
      clearInterval(this.attackAnimInterval)
    }
    const [px, py] = transformEntityCoordinates(3, 3, false)
    this.pokemonSprite = new PokemonSprite(
      this,
      px,
      py,
      PokemonFactory.createPokemonFromName(pkm, { shiny }),
      "debug",
      false,
      false
    )
    this.pokemonSprite.orientation = orientation
    this.pokemonSprite.positionX = 3
    this.pokemonSprite.positionY = 3

    this.pokemonSprite.sprite.setTint(
      DungeonDetails[this.mapName].tint ?? 0xffffff
    )

    let animationName = AnimationType[animationType]
    const anims = {
      ...DEFAULT_POKEMON_ANIMATION_CONFIG,
      ...(PokemonAnimations[pkm] ?? {})
    }
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
      this.animationManager?.play(this.pokemonSprite, animationName, {
        repeat: -1
      })
    } catch (err) {
      logger.error(
        `Error playing animation ${this.pokemonSprite.name} ${animationType}: ${animationName}`,
        err
      )
    }
    this.applyStatusAnimation(status)
  }

  updateMap(mapName: DungeonPMDO | "town"): Promise<void> {
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
        ;(this.sys as any).animatedTiles.init(map)
        playMusic(this as any, DungeonDetails[mapName].music)
      })
      .then(() => {
        this.updateSprite(Pkm.SMEARGLE, Orientation.DOWNLEFT, "Idle", "", false)
        this.updateLandscape()
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

  updateLandscape() {
    if (!this.map) return
    const tint = DungeonDetails[this.mapName].tint ?? 0xffffff
    this.landscape.forEach((sprite) => sprite.destroy())
    this.landscape = [
      this.scene.scene.add.sprite(850, 600, "ground_holes", `trench3.png`),
      this.scene.scene.add.sprite(1200, 600, "ground_holes", `hole5.png`),
      this.scene.scene.add.sprite(420, 660, "berry_trees", "ASPEAR_BERRY_4"),
      this.scene.scene.add.sprite(360, 660, "berry_trees", "BABIRI_BERRY_6"),
      this.scene.scene.add.sprite(300, 660, "berry_trees", "LIECHI_BERRY_3"),
      this.scene.scene.add.sprite(320, 580, "flower_pots", "BLUE.png"),
      this.scene.scene.add.sprite(420, 580, "flower_pots", "PINK.png")
    ]
    this.landscape.forEach((sprite) => sprite.setScale(2).setTint(tint))
  }

  applyStatusAnimation(status: Status | Boost | "") {
    if (this.pokemonSprite) {
      this.pokemonSprite.sprite.setTint(
        DungeonDetails[this.mapName].tint ?? 0xffffff
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

      if (status === Status.POISONNED) {
        this.pokemonSprite.addPoison()
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
      if (status == Status.RUNE_PROTECT) {
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
    const tx = this.pokemonSprite!.positionX + OrientationVector[or][0] * range
    const ty = this.pokemonSprite!.positionY + OrientationVector[or][1] * range
    this.pokemonSprite!.targetX = tx
    this.pokemonSprite!.targetY = ty
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
      if (!this.pokemonSprite) return
      this.pokemonSprite.attackAnimation(
        this.pokemonSprite.targetX || 0,
        this.pokemonSprite.targetY || 0,
        0,
        1000,
        () => {
          if (!this.pokemonSprite) return
          const [x, y] = transformEntityCoordinates(
            this.pokemonSprite.targetX || 0,
            this.pokemonSprite.targetY || 0,
            false
          )
          displayHit(
            this,
            PokemonAnimations[PkmByIndex[this.pokemonSprite.pokemon.index]]
              ?.hitSprite ?? DEFAULT_POKEMON_ANIMATION_CONFIG.hitSprite,
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
        ability: this.pokemonSprite!.pokemon.skill,
        orientation: this.pokemonSprite!.orientation,
        positionX: this.pokemonSprite!.positionX,
        positionY: this.pokemonSprite!.positionY,
        targetX: this.pokemonSprite!.targetX ?? -1,
        targetY: this.pokemonSprite!.targetY ?? -1,
        flip: this.pokemonSprite!.flip,
        ap: 0
      })
    }
    showAbilityAnim()
    this.attackAnimInterval = setInterval(showAbilityAnim, 2000)
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
    } else if (weather === Weather.SUN) {
      this.weatherManager.addSun()
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
