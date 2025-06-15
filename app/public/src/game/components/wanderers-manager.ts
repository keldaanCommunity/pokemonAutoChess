import { GameObjects } from "phaser"
import { Transfer } from "../../../../types"
import { Ability } from "../../../../types/enum/Ability"
import { Pkm, Unowns } from "../../../../types/enum/Pokemon"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { DEPTH } from "../depths"
import { getFreeSpaceOnBench } from "../../../../utils/board"
import { t } from "i18next"
import { chance } from "../../../../utils/random"
import PokemonFactory from "../../../../models/pokemon-factory"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"

const SHARDS_PER_UNOWN_WANDERER = 50
const DEFAULT_WANDERER_SPEED = 0.3
const UNOWN_WANDERER_SPEED = 0.2

/*
List of wanderers:
- Unowns: give shard when caught
- Sableye: from town encounter, steal an item
- Others: from scribble, added to bench when caught
*/

export default class WanderersManager {
  scene: GameScene

  constructor(scene: GameScene) {
    this.scene = scene
  }

  addWanderer(pkm: Pkm, id: string) {
    if (pkm === Pkm.SABLEYE) {
      this.addSableye(id)
    } else if (Unowns.includes(pkm)) {
      this.addWanderingUnown(pkm, id)
    } else {
      this.addCatchableWanderer(pkm, id)
    }
  }

  addWanderingUnown(pkm: Pkm, id: string) {
    this.addWanderingPokemon({
      id,
      pkm,
      duration: window.innerWidth / UNOWN_WANDERER_SPEED,
      onClick: (unown, id, pointer, tween) => {
        this.scene.room?.send(Transfer.POKEMON_WANDERING, { id })
        this.displayShardGain([pointer.x, pointer.y], unown.index)
        unown.destroy()
        tween.destroy()
      },
      onComplete: (sprite) => {
        sprite.destroy()
      }
    })
  }

  addCatchableWanderer(pkm: Pkm, id: string) {
    this.addWanderingPokemon({
      id,
      pkm,
      onClick: (sprite, id, pointer, tween) => {
        if (
          this.scene.board &&
          getFreeSpaceOnBench(this.scene.board.player.board) > 0
        ) {
          this.scene.room?.send(Transfer.POKEMON_WANDERING, { id })
          sprite.destroy()
          tween.destroy()
        } else if (this.scene.board) {
          this.scene.board.displayText(pointer.x, pointer.y, t("full"))
        }
      },
      onComplete: (sprite) => {
        sprite.destroy()
      }
    })
  }

  addSableye(id: string) {
    let stopped = false
    const tweens: Phaser.Tweens.Tween[] = []
    const { sprite: sableye, tween } = this.addWanderingPokemon({
      id,
      pkm: Pkm.SABLEYE,
      startX: -100,
      startY: 700,
      endX: 484,
      endY: 686,
      duration: 6000,
      onClick: (sprite, id, pointer) => {
        this.scene.room?.send(Transfer.POKEMON_WANDERING, { id })
        stopped = true
        this.scene.animationManager?.animatePokemon(
          sableye,
          PokemonActionState.HURT,
          false
        )
        tweens.forEach((tween) => tween.stop())
        this.scene.add.tween({
          targets: [sprite],
          ease: "linear",
          duration: 1000,
          alpha: 0,
          onComplete: () => {
            sprite.destroy()
          }
        })
      },
      onComplete: () => {
        if (!stopped) {
          sableye.orientation = Orientation.LEFT
          this.scene.animationManager?.animatePokemon(
            sableye,
            PokemonActionState.WALK,
            false
          )
          tweens.push(
            this.scene.add.tween({
              targets: [sableye],
              ease: "linear",
              duration: 2000,
              x: -100,
              y: 700,
              onComplete: () => {
                sableye.destroy()
              }
            })
          )
        }
      }
    })
    tweens.push(tween)
  }

  addWanderingPokemon({
    id,
    pkm,
    onClick,
    onComplete,
    startX,
    startY,
    endX,
    endY,
    duration = window.innerWidth / DEFAULT_WANDERER_SPEED
  }: {
    id: string
    pkm: Pkm
    startX?: number
    startY?: number
    endX?: number
    endY?: number
    duration?: number
    onClick: (
      pokemon: PokemonSprite,
      id: string,
      pointer: Phaser.Input.Pointer,
      tween: Phaser.Tweens.Tween
    ) => void
    onComplete?: (pokemon: PokemonSprite, id: string) => void
  }): { tween: Phaser.Tweens.Tween; sprite: PokemonSprite } {
    const fromLeft = chance(1 / 2)
    startX = startX || (fromLeft ? -100 : +window.innerWidth + 100)
    startY = startY || 100 + Math.round(Math.random() * 500)
    endX = endX || (fromLeft ? +window.innerWidth + 100 : -100)
    endY = endY || 100 + Math.round(Math.random() * 500)

    const pokemon = new PokemonSprite(
      this.scene,
      startX,
      startY,
      PokemonFactory.createPokemonFromName(pkm),
      "wanderer",
      false,
      false
    )
    pokemon.orientation = startX < endX ? Orientation.RIGHT : Orientation.LEFT
    this.scene.animationManager?.animatePokemon(
      pokemon,
      PokemonActionState.WALK,
      false
    )

    const tween = this.scene.tweens.add({
      targets: pokemon,
      x: endX,
      y: endY,
      ease: "Linear",
      duration,
      onComplete() {
        onComplete?.(pokemon, id)
      }
    })

    pokemon.draggable = false
    pokemon.sprite.setInteractive()
    pokemon.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      onClick(pokemon, id, pointer, tween)
    })
    return { tween, sprite: pokemon }
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
        SHARDS_PER_UNOWN_WANDERER.toString(),
        textStyle
      )
    )
    image.setDepth(DEPTH.TEXT_MINOR)
    text.setDepth(DEPTH.TEXT)

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
        container.destroy()
      }
    })
  }
}

export const UNOWNS_PER_ABILITY = new Map([
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
    [Pkm.UNOWN_L, Pkm.UNOWN_O, Pkm.UNOWN_C, Pkm.UNOWN_K]
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
    [Pkm.UNOWN_O, Pkm.UNOWN_V, Pkm.UNOWN_E, Pkm.UNOWN_N]
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
    [Pkm.UNOWN_R, Pkm.UNOWN_O, Pkm.UNOWN_L, Pkm.UNOWN_L]
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
