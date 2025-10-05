import { t } from "i18next"
import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { Transfer } from "../../../../types"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import {
  Wanderer,
  WandererBehavior,
  WandererType
} from "../../../../types/enum/Wanderer"
import { getFreeSpaceOnBench } from "../../../../utils/board"
import { clamp } from "../../../../utils/number"
import { chance } from "../../../../utils/random"
import { DEPTH } from "../depths"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"

const SHARDS_PER_UNOWN_WANDERER = 50
const DEFAULT_WANDERER_SPEED = 0.25

/*
List of wanderers:
- Unowns: give shard when caught
- Sableye: from town encounter, steal an item
- Others: from Gotta catch em all scribble, added to bench when caught
*/

export default class WanderersManager {
  scene: GameScene

  constructor(scene: GameScene) {
    this.scene = scene
  }

  addWanderer(wanderer: Wanderer) {
    if (wanderer.type === WandererType.SABLEYE) {
      this.addSableye(wanderer)
    } else if (wanderer.type === WandererType.UNOWN) {
      this.addWanderingUnown(wanderer)
    } else if (wanderer.type === WandererType.CATCHABLE) {
      this.addCatchableWanderer(wanderer)
    }
  }

  addWanderingUnown(wanderer: Wanderer) {
    this.addWandererPokemonSprite({
      wanderer,
      onClick: (wanderer, unownSprite, pointer, tweens) => {
        this.scene.room?.send(Transfer.WANDERER_CAUGHT, { id: wanderer.id })
        this.displayShardGain([pointer.x, pointer.y], unownSprite.index)
        unownSprite.destroy()
        tweens.forEach((tween) => tween.destroy())
        return true
      }
    })
  }

  addCatchableWanderer(wanderer: Wanderer) {
    this.addWandererPokemonSprite({
      wanderer,
      onClick: (wanderer, sprite, pointer, tweens) => {
        let clicked = false
        if (this.scene.board) {
          if (getFreeSpaceOnBench(this.scene.board.player.board) > 0) {
            this.scene.room?.send(Transfer.WANDERER_CAUGHT, { id: wanderer.id })
            sprite.destroy()
            tweens.forEach((tween) => tween.destroy())
            clicked = true
          } else {
            this.scene.board.displayText(pointer.x, pointer.y, t("full"), true)
          }
        }
        return clicked
      }
    })
  }

  addSableye(wanderer: Wanderer) {
    this.addWandererPokemonSprite({
      wanderer,
      onClick: (wanderer, sprite, pointer, tweens) => {
        this.scene.displayMoneyGain(sprite.x, sprite.y, 1)
        this.scene.room?.send(Transfer.WANDERER_CAUGHT, { id: wanderer.id })
        this.scene.animationManager?.animatePokemon(
          sprite,
          PokemonActionState.HURT,
          false
        )
        tweens.forEach((tween) => tween.destroy())
        this.scene.add.tween({
          targets: [sprite],
          ease: "linear",
          duration: 1000,
          alpha: 0,
          onComplete: () => {
            sprite.destroy()
          }
        })
        return true
      }
    })
  }

  addWandererPokemonSprite({
    wanderer,
    onClick
  }: {
    wanderer: Wanderer
    onClick: (
      wanderer: Wanderer,
      pokemon: PokemonSprite,
      pointer: Phaser.Input.Pointer,
      tweens: Phaser.Tweens.Tween[]
    ) => boolean
  }): PokemonSprite {
    let startX = -100,
      startY = 350,
      endX = window.innerWidth + 100,
      endY = 350
    let duration = clamp(window.innerWidth / DEFAULT_WANDERER_SPEED, 4000, 6000)
    let clicked = false
    const tweens: Phaser.Tweens.Tween[] = []

    switch (wanderer.behavior) {
      case WandererBehavior.SPECTATE: {
        startX = -100
        startY = 100 + Math.round(Math.random() * 500)
        endX = 580
        endY = 300 + Math.round(Math.random() * 200)
        duration = 4000
        break
      }

      case WandererBehavior.RUN_THROUGH:
      default: {
        const fromLeft = chance(1 / 2)
        startX = fromLeft ? -100 : +window.innerWidth + 100
        startY = 100 + Math.round(Math.random() * 500)
        endX = fromLeft ? +window.innerWidth + 100 : -100
        endY = 100 + Math.round(Math.random() * 500)
        break
      }
    }

    const sprite = new PokemonSprite(
      this.scene,
      startX,
      startY,
      PokemonFactory.createPokemonFromName(wanderer.pkm),
      "wanderer",
      false,
      false
    )
    sprite.orientation = startX < endX ? Orientation.RIGHT : Orientation.LEFT
    this.scene.animationManager?.animatePokemon(
      sprite,
      PokemonActionState.WALK,
      false
    )

    const tween = this.scene.tweens.add({
      targets: sprite,
      x: endX,
      y: endY,
      ease: "Linear",
      duration,
      onComplete: () => {
        if (wanderer.behavior === WandererBehavior.SPECTATE) {
          this.scene.animationManager?.animatePokemon(
            sprite,
            PokemonActionState.IDLE,
            false
          )
          tweens.push(
            this.scene.add.tween({
              targets: [sprite],
              ease: "linear",
              duration: 5000,
              delay: 5000,
              x: startX,
              y: startY,
              onComplete: () => {
                sprite.destroy()
              },
              onStart: () => {
                sprite.orientation = Orientation.LEFT
                this.scene.animationManager?.animatePokemon(
                  sprite,
                  PokemonActionState.WALK,
                  false
                )
              }
            })
          )
        } else {
          sprite.destroy()
        }
      }
    })
    tweens.push(tween)

    sprite.draggable = false
    sprite.sprite.setInteractive()
    sprite.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (clicked) return
      if ((clicked = onClick(wanderer, sprite, pointer, tweens)))
        tweens.forEach((tween) => tween.destroy())
    })

    return sprite
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
