import React, { useEffect, useMemo, useRef } from "react"
import Phaser from "phaser"
import { nanoid } from "nanoid"
import { createStatusAnimations } from "../../../game/animation-manager"
import { loadStatusMultiAtlas } from "../../../game/components/loading-manager"
import {
  Orientation,
  PokemonTint,
  SpriteType
} from "../../../../../types/enum/Game"
import durations from "../../../../dist/client/assets/pokemons/durations.json"
import { AnimationType } from "../../../../../types/Animation"

export default function TestAnim({
  pkmIndex,
  height = 100,
  width = 100,
  offset = [0, 0],
  scale = 1,
  depth = 7,
  animationKey,
  atlasKey = "status"
}: {
  pkmIndex?: string
  height?: number
  width?: number
  atlasKey?: string
  animationKey?: string
  offset?: [number, number]
  scale?: number
  depth?: number
}) {
  const gameRef = useRef<Phaser.Game>()

  const PKM_INDEX = useMemo(() => {
    if (pkmIndex) {
      return pkmIndex
    }

    switch (animationKey) {
      case "ELECTRIC_SURGE":
        return "0025"
      case "PSYCHIC_SURGE":
        return "0063"
      case "GRASSY_SURGE":
        return "0069"
      case "MISTY_SURGE":
        return "0035"
      default:
        return "0019"
    }
  }, [animationKey, pkmIndex])

  const containerId = nanoid()

  useEffect(() => {
    if (pkmIndex || animationKey) {
      gameRef.current?.destroy(true)
      gameRef.current = undefined
    }
  }, [animationKey, pkmIndex])

  useEffect(() => {
    if (!gameRef.current) {
      const scene = new TestAnimScene(
        PKM_INDEX,
        height,
        width,
        atlasKey,
        offset,
        scale,
        depth,
        animationKey
      )

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        pixelArt: true,
        width,
        height,
        scene: [scene],
        backgroundColor: "#61738a"
      })
    }
  }, [
    PKM_INDEX,
    animationKey,
    atlasKey,
    containerId,
    depth,
    height,
    offset,
    scale,
    width
  ])

  return <div id={containerId} className="test-anim-wrapper"></div>
}

export class TestAnimScene extends Phaser.Scene {
  index: string
  height: number
  width: number
  atlasKey: string
  animationKey?: string
  offset: [number, number]
  statusScale: number
  depth: number

  constructor(
    index: string,
    height: number,
    width: number,
    atlasKey: string,
    offset: [number, number],
    statusScale: number,
    depth: number,
    animationKey?: string
  ) {
    super()
    this.index = index
    this.height = height
    this.width = width
    this.atlasKey = atlasKey
    this.animationKey = animationKey
    this.offset = offset
    this.statusScale = statusScale
    this.depth = depth
  }

  preload() {
    loadStatusMultiAtlas(this)
    this.load.multiatlas(
      this.index,
      `/assets/pokemons/${this.index}.json`,
      "/assets/pokemons"
    )
  }

  create() {
    createStatusAnimations(this)

    const durationArray =
      durations[
        `${this.index}/${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}`
      ]
    const frameArray = this.anims.generateFrameNames(this.index, {
      start: 0,
      end: durationArray.length - 1,
      zeroPad: 4,
      prefix: `${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}/${Orientation.DOWN}/`
    })
    for (let i = 0; i < durationArray.length; i++) {
      if (frameArray[i]) {
        frameArray[i]["duration"] = durationArray[i] * 10
      }
    }

    this.game.anims.create({
      key: this.index,
      frames: frameArray,
      repeat: -1
    })

    const pkmSprite = this.add.sprite(
      this.width / 2,
      this.height / 2,
      this.index,
      `${PokemonTint.NORMAL}/${AnimationType.Idle}/${SpriteType.ANIM}/${Orientation.DOWN}/0000`
    )
    pkmSprite.play(this.index)
    pkmSprite.setScale(2).setDepth(3)

    if (this.animationKey) {
      const statusSprite = this.add
        .sprite(
          this.width / 2 + this.offset[0],
          this.height / 2 + this.offset[1],
          this.atlasKey
        )
        .play(this.animationKey)
      statusSprite.setScale(this.statusScale).setDepth(this.depth)
    }
  }
}
