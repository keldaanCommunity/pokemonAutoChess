import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { Transfer } from "../../../../types"
import { PokemonActionState } from "../../../../types/enum/Game"
import { PkmFamily, Pkm } from "../../../../types/enum/Pokemon"
import { pickRandomIn, coinflip } from "../../../../utils/random"
import { getGameContainer } from "../../pages/game"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import Pokemon from "./pokemon"
import { AnimationType } from "../../../../types/Animation"

const SHARDS_PER_ENCOUNTER = 50

export default class UnownManager {
  uid: string
  scene: GameScene
  animationManager: AnimationManager

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string
  ) {
    this.uid = uid
    this.scene = scene
    this.animationManager = animationManager
  }

  addWanderingUnown() {
    const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(
      (pkm) => PkmFamily[pkm] === Pkm.UNOWN_A
    )
    const [startX, endX] = coinflip()
      ? [-100, +window.innerWidth + 100]
      : [+window.innerWidth + 100, -100]
    const [startY, endY] = [
      100 + Math.round(Math.random() * 400),
      100 + Math.round(Math.random() * 400)
    ]

    const unown = new Pokemon(
      this.scene,
      startX,
      startY,
      PokemonFactory.createPokemonFromName(pickRandomIn(unowns)),
      "unown",
      false
    )
    this.animationManager.animatePokemon(unown, PokemonActionState.IDLE)

    const tween = this.scene.tweens.add({
      targets: unown,
      x: endX,
      y: endY,
      ease: "Linear",
      duration: 5000,
      onComplete: () => {
        if (unown) {
          unown.destroy()
        }
      }
    })

    unown.isDisabled = true
    unown.sprite.setInteractive()
    unown.sprite.on("pointerdown", (pointer) => {
      getGameContainer().room.send(Transfer.UNOWN_ENCOUNTER, unown.index)
      this.displayShardGain([pointer.x, pointer.y], unown.index)
      tween.stop()
      unown.destroy()
    })
  }

  displayShardGain(coordinates: number[], index: string) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#fff",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }

    const image = this.scene.add.existing(
      new GameObjects.Image(this.scene, 0, 0, `portrait-${index}`)
        .setScale(0.5, 0.5)
        .setOrigin(0, 0)
    )
    const text = this.scene.add.existing(
      new GameObjects.Text(
        this.scene,
        25,
        0,
        SHARDS_PER_ENCOUNTER.toString(),
        textStyle
      )
    )
    image.setDepth(9)
    text.setDepth(10)

    const container = this.scene.add.existing(
      new GameObjects.Container(
        this.scene,
        coordinates[0],
        coordinates[1] - 50,
        [text, image]
      )
    )

    this.scene.add.tween({
      targets: [container],
      ease: "linear",
      duration: 1500,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => coordinates[1] - 50,
        getEnd: () => coordinates[1] - 110
      },
      onComplete: () => {
        container.destroy(true)
      }
    })
  }
}
