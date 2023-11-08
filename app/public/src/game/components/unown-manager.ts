import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { Transfer } from "../../../../types"
import { PokemonActionState } from "../../../../types/enum/Game"
import { Pkm, Unowns } from "../../../../types/enum/Pokemon"
import { pickRandomIn, coinflip } from "../../../../utils/random"
import { getGameContainer } from "../../pages/game"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import Pokemon from "./pokemon"
import { Ability } from "../../../../types/enum/Ability"
import { transformAttackCoordinate } from "../../pages/utils/utils"

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
      PokemonFactory.createPokemonFromName(pickRandomIn(Unowns)),
      "unown",
      false,
      false
    )
    this.animationManager.animatePokemon(unown, PokemonActionState.IDLE, false)

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

    unown.draggable = false
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

  hiddenPowerAnimation(
    skill: Ability,
    originX: number,
    originY: number,
    flip: boolean
  ) {
    const [x, y] = transformAttackCoordinate(originX, originY, flip)
    const unownsGroup = this.scene.add.group()
    const letters = UNOWNS_PER_ABILITY.get(skill)
    for (let n = 0; n < 8; n++) {
      letters?.forEach((letter, i) => {
        const unown = new Pokemon(
          this.scene,
          x,
          y,
          PokemonFactory.createPokemonFromName(letter),
          "unown",
          false,
          flip
        )
        unown.draggable = false
        unownsGroup.add(unown)
        this.animationManager.animatePokemon(
          unown,
          PokemonActionState.IDLE,
          flip
        )
      })
    }

    const circle = new Phaser.Geom.Circle(x, y, 10)
    Phaser.Actions.PlaceOnCircle(unownsGroup.getChildren(), circle)

    this.scene.tweens.add({
      targets: circle,
      radius: 500,
      ease: Phaser.Math.Easing.Quartic.Out,
      duration: 2500,
      onUpdate: function (tween) {
        Phaser.Actions.RotateAroundDistance(
          unownsGroup.getChildren(),
          { x, y },
          -0.02 * (1 - tween.progress),
          circle.radius
        )
        if (tween.progress > 0.8) {
          unownsGroup.setAlpha((1 - tween.progress) * 5)
        }
      },
      onComplete() {
        unownsGroup.destroy(true, true)
      }
    })
  }
}

const UNOWNS_PER_ABILITY = new Map([
  [
    Ability.HIDDEN_POWER_A,
    [Pkm.UNOWN_A, Pkm.UNOWN_B, Pkm.UNOWN_R, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_B,
    [Pkm.UNOWN_B, Pkm.UNOWN_U, Pkm.UNOWN_R, Pkm.UNOWN_N]
  ],
  [
    Ability.HIDDEN_POWER_C,
    [Pkm.UNOWN_C, Pkm.UNOWN_O, Pkm.UNOWN_I, Pkm.UNOWN_N]
  ],
  [
    Ability.HIDDEN_POWER_D,
    [Pkm.UNOWN_D, Pkm.UNOWN_I, Pkm.UNOWN_T, Pkm.UNOWN_O]
  ],
  [
    Ability.HIDDEN_POWER_E,
    [Pkm.UNOWN_E, Pkm.UNOWN_G, Pkm.UNOWN_G, Pkm.UNOWN_S]
  ],
  [
    Ability.HIDDEN_POWER_F,
    [Pkm.UNOWN_F, Pkm.UNOWN_I, Pkm.UNOWN_S, Pkm.UNOWN_H]
  ],
  [
    Ability.HIDDEN_POWER_G,
    [Pkm.UNOWN_G, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_D]
  ],
  [
    Ability.HIDDEN_POWER_H,
    [Pkm.UNOWN_H, Pkm.UNOWN_E, Pkm.UNOWN_A, Pkm.UNOWN_L]
  ],
  [
    Ability.HIDDEN_POWER_I,
    [Pkm.UNOWN_I, Pkm.UNOWN_T, Pkm.UNOWN_E, Pkm.UNOWN_M]
  ],
  [
    Ability.HIDDEN_POWER_J,
    [Pkm.UNOWN_J, Pkm.UNOWN_A, Pkm.UNOWN_W, Pkm.UNOWN_S]
  ],
  [
    Ability.HIDDEN_POWER_K,
    [Pkm.UNOWN_K, Pkm.UNOWN_I, Pkm.UNOWN_C, Pkm.UNOWN_K]
  ],
  [
    Ability.HIDDEN_POWER_L,
    [Pkm.UNOWN_L, Pkm.UNOWN_I, Pkm.UNOWN_F, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_M,
    [Pkm.UNOWN_M, Pkm.UNOWN_A, Pkm.UNOWN_N, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_N,
    [Pkm.UNOWN_N, Pkm.UNOWN_U, Pkm.UNOWN_K, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_O,
    [Pkm.UNOWN_O, Pkm.UNOWN_N, Pkm.UNOWN_I, Pkm.UNOWN_X]
  ],
  [
    Ability.HIDDEN_POWER_P,
    [Pkm.UNOWN_P, Pkm.UNOWN_E, Pkm.UNOWN_S, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_Q,
    [Pkm.UNOWN_Q, Pkm.UNOWN_U, Pkm.UNOWN_I, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_R,
    [Pkm.UNOWN_R, Pkm.UNOWN_O, Pkm.UNOWN_C, Pkm.UNOWN_K]
  ],
  [
    Ability.HIDDEN_POWER_S,
    [Pkm.UNOWN_S, Pkm.UNOWN_T, Pkm.UNOWN_O, Pkm.UNOWN_P]
  ],
  [
    Ability.HIDDEN_POWER_T,
    [Pkm.UNOWN_T, Pkm.UNOWN_R, Pkm.UNOWN_E, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_U,
    [Pkm.UNOWN_U, Pkm.UNOWN_X, Pkm.UNOWN_I, Pkm.UNOWN_E]
  ],
  [
    Ability.HIDDEN_POWER_V,
    [Pkm.UNOWN_V, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_T]
  ],
  [
    Ability.HIDDEN_POWER_W,
    [Pkm.UNOWN_W, Pkm.UNOWN_I, Pkm.UNOWN_S, Pkm.UNOWN_H]
  ],
  [
    Ability.HIDDEN_POWER_X,
    [Pkm.UNOWN_X, Pkm.UNOWN_R, Pkm.UNOWN_A, Pkm.UNOWN_Y]
  ],
  [
    Ability.HIDDEN_POWER_Y,
    [Pkm.UNOWN_Y, Pkm.UNOWN_O, Pkm.UNOWN_G, Pkm.UNOWN_A]
  ],
  [
    Ability.HIDDEN_POWER_Z,
    [Pkm.UNOWN_Z, Pkm.UNOWN_Z, Pkm.UNOWN_Z, Pkm.UNOWN_Z]
  ],
  [
    Ability.HIDDEN_POWER_EM,
    [
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION,
      Pkm.UNOWN_EXCLAMATION
    ]
  ],
  [
    Ability.HIDDEN_POWER_QM,
    [
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION,
      Pkm.UNOWN_QUESTION
    ]
  ]
])
