import { DesignTiled } from "../../../../core/design"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AnimationType } from "../../../../types/Animation"
import { DungeonPMDO } from "../../../../types/Config"
import { Orientation } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import { Status } from "../../../../types/enum/Status"
import { logger } from "../../../../utils/logger"
import AnimationManager from "../animation-manager"
import LoadingManager from "../components/loading-manager"
import Pokemon from "../components/pokemon"

export class DebugScene extends Phaser.Scene {
  height: number
  width: number
  animationManager: AnimationManager
  loadingManager: LoadingManager
  onProgress: (value: number) => void
  onComplete: () => void
  pokemon?: Pokemon
  uid = "debug"
  tilemap: DesignTiled | undefined
  map: Phaser.Tilemaps.Tilemap | undefined

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

  create() {}

  updateSprite(
    pkm: Pkm,
    orientation: Orientation,
    animationType: AnimationType,
    status: Status | ""
  ) {
    if (this.pokemon) {
      this.pokemon.destroy(true)
    }
    this.pokemon = new Pokemon(
      this,
      this.width / 2,
      this.height / 2,
      PokemonFactory.createPokemonFromName(pkm),
      "debug",
      false,
      false
    )
    this.pokemon.orientation = orientation
    if (animationType in AnimationType) {
      try {
        this.animationManager.play(this.pokemon, animationType, { loop: true })
      } catch (err) {
        logger.error(
          `Error playing animation ${this.pokemon.name} ${animationType}`,
          err
        )
      }
    }
    this.applyStatusAnimation(status)
  }

  updateMap(mapName: DungeonPMDO): Promise<void> {
    if (this.map) this.map.destroy()

    console.log("updateMap", mapName)
    return fetch(`/tilemap/${mapName}`)
      .then((res) => res.json())
      .then((tilemap: DesignTiled) => {
        console.log("tilemap loaded", tilemap)
        this.tilemap = tilemap
        return new Promise((resolve) => {
          this.load.reset()
          tilemap.tilesets.forEach((t) => {
            console.log(`loading tileset ${t.image}`)
            this.load.image(
              mapName + "/" + t.name,
              "/assets/tilesets/" + mapName + "/" + t.image
            )
          })
          this.load.tilemapTiledJSON("map", tilemap)
          this.load.once("complete", resolve)
          this.load.start()
        })
      })
      .then(() => {
        console.log("making map")
        const map = this.make.tilemap({ key: "map" })
        this.map = map
        this.tilemap!.layers.forEach((layer) => {
          const tileset = map.addTilesetImage(
            layer.name,
            mapName + "/" + layer.name
          )!
          map.createLayer(layer.name, tileset, 0, 0)!.setScale(2, 2)
        })
        ;(this.sys as any).animatedTiles.init(map)
        console.log("finished")
      })
  }

  applyStatusAnimation(status: Status | "") {
    if (this.pokemon) {
      this.pokemon.removePoison()
      this.pokemon.removeSleep()
      this.pokemon.removeBurn()
      this.pokemon.removeSilence()
      this.pokemon.removeConfusion()
      this.pokemon.removeFreeze()
      this.pokemon.removeProtect()
      this.pokemon.removeWound()
      this.pokemon.removeResurection()
      this.pokemon.removeParalysis()
      this.pokemon.removeArmorReduction()
      this.pokemon.removeCharm()
      this.pokemon.removeRuneProtect()
      this.pokemon.removeSpikeArmor()
      this.pokemon.removeMagicBounce()
      this.pokemon.removeElectricField()
      this.pokemon.removePsychicField()
      this.pokemon.removeGrassField()
      this.pokemon.removeFairyField()

      if (status === Status.POISON) {
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
      if (status == Status.ARMOR_REDUCTION) {
        this.pokemon.addArmorReduction()
      }
      if (status == Status.CHARM) {
        this.pokemon.addCharm()
      }
      if (status === Status.FLINCH) {
        this.pokemon.addFlinch()
      }
      if (status == Status.RUNE_PROTECT) {
        this.pokemon.addRuneProtect()
      }
      if (status == Status.SPIKE_ARMOR) {
        this.pokemon.addSpikeArmor()
      }
      if (status == Status.MAGIC_BOUNCE) {
        this.pokemon.addMagicBounce()
      }
      if (status == Status.ELECTRIC_FIELD) {
        this.pokemon.addElectricField()
        this.pokemon.bringToTop(this.pokemon.sprite)
      }
      if (status == Status.PSYCHIC_FIELD) {
        this.pokemon.addPsychicField()
        this.pokemon.bringToTop(this.pokemon.sprite)
      }
      if (status == Status.GRASS_FIELD) {
        this.pokemon.addGrassField()
        this.pokemon.bringToTop(this.pokemon.sprite)
      }
      if (status == Status.FAIRY_FIELD) {
        this.pokemon.addFairyField()
        this.pokemon.bringToTop(this.pokemon.sprite)
      }
    }
  }
}
