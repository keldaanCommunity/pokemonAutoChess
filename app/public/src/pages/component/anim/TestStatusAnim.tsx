import React, { useEffect } from "react"
import Phaser from "phaser"
import { nanoid } from "nanoid"
import { createStatusAnimations } from "../../../game/animation-manager"
import { loadStatusMultiAtlas } from "../../../game/components/loading-manager"
import {
  Orientation,
  PokemonActionState,
  PokemonTint,
  SpriteType
} from "../../../../../types/enum/Game"
import durations from "../../../../dist/client/assets/pokemons/durations.json"

export default function TestAnim({
  height = 100,
  width = 100,
  offset = [0, 0],
  scale = 1,
  depth = 7,
  animationKey = "burn",
  atlasKey = "status"
}: {
  height?: number
  width?: number
  atlasKey?: string
  animationKey?: string
  offset?: [number, number]
  scale?: number
  depth?: number
}) {
  let PKM_INDEX
  switch (animationKey) {
    case "ELECTRIC_SURGE":
      PKM_INDEX = "0025"
      break
    case "PSYCHIC_SURGE":
      PKM_INDEX = "0063"
      break
    case "GRASSY_SURGE":
      PKM_INDEX = "0069"
      break
    case "MISTY_SURGE":
      PKM_INDEX = "0035"
      break
    default:
      PKM_INDEX = "0019"
      break
  }

  class TestAnimScene extends Phaser.Scene {
    preload() {
      loadStatusMultiAtlas(this)
      this.load.multiatlas(
        PKM_INDEX,
        `/assets/pokemons/${PKM_INDEX}.json`,
        "/assets/pokemons"
      )
    }

    create() {
      createStatusAnimations(this)

      const durationArray =
        durations[
          `${PKM_INDEX}/${PokemonTint.NORMAL}/${PokemonActionState.IDLE}/${SpriteType.ANIM}`
        ]
      const frameArray = this.anims.generateFrameNames(PKM_INDEX, {
        start: 0,
        end: durationArray.length - 1,
        zeroPad: 4,
        prefix: `${PokemonTint.NORMAL}/${PokemonActionState.IDLE}/${SpriteType.ANIM}/${Orientation.DOWN}/`
      })
      for (let i = 0; i < durationArray.length; i++) {
        if (frameArray[i]) {
          frameArray[i]["duration"] = durationArray[i] * 10
        }
      }

      this.game.anims.create({
        key: PKM_INDEX,
        frames: frameArray,
        repeat: -1
      })

      const pkmSprite = this.add.sprite(
        width / 2,
        height / 2,
        PKM_INDEX,
        `${PokemonTint.NORMAL}/${PokemonActionState.IDLE}/${SpriteType.ANIM}/${Orientation.DOWN}/0000`
      )
      pkmSprite.play(PKM_INDEX)
      pkmSprite.setScale(2).setDepth(3)

      const statusSprite = this.add
        .sprite(width / 2 + offset[0], height / 2 + offset[1], atlasKey)
        .play(animationKey)
      statusSprite.setScale(scale).setDepth(depth)
    }
  }

  const containerId = nanoid()

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerId,
      pixelArt: true,
      width,
      height,
      scene: [TestAnimScene],
      backgroundColor: "#61738a"
    })
  })

  return <div id={containerId} className="test-anim-wrapper"></div>
}
