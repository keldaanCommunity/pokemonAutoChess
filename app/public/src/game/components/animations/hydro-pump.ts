import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const HydroPumpTravelDuration = 300

function drawBubble(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  alpha: number
) {
  graphics.fillStyle(0x5bb9cc, 0.2 * alpha)
  graphics.fillCircle(x, y, radius + 2)
  graphics.fillStyle(0x85d4df, 0.35 * alpha)
  graphics.fillCircle(x, y, radius)
  graphics.lineStyle(1, 0xa9dfe6, 0.6 * alpha)
  graphics.strokeCircle(x, y, radius)
  graphics.fillStyle(0xd0edf0, 0.5 * alpha)
  graphics.fillCircle(x - radius * 0.3, y - radius * 0.3, radius * 0.22)
}

function hydroPumpLine({
  positionX,
  positionY,
  targetX,
  targetY,
  flip
}: AbilityAnimationArgs) {
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  )
    return null
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const dx = targetScreenX - casterX
  const dy = targetScreenY - casterY
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  const angle = Math.atan2(dy, dx)
  const directionX = dx / length
  const directionY = dy / length
  let visibleLength = Infinity
  const [left, firstRow] = transformEntityCoordinates(0, 0, flip)
  const [right, lastRow] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const minX = left - CELL_WIDTH / 2
  const maxX = right + CELL_WIDTH / 2
  const minY = Math.min(firstRow, lastRow) - CELL_HEIGHT / 2
  const maxY = Math.max(firstRow, lastRow) + CELL_HEIGHT / 2
  if (directionX > 0)
    visibleLength = Math.min(visibleLength, (maxX - casterX) / directionX)
  if (directionX < 0)
    visibleLength = Math.min(visibleLength, (minX - casterX) / directionX)
  if (directionY > 0)
    visibleLength = Math.min(visibleLength, (maxY - casterY) / directionY)
  if (directionY < 0)
    visibleLength = Math.min(visibleLength, (minY - casterY) / directionY)
  if (visibleLength <= 0) return null
  return {
    casterX,
    casterY,
    angle,
    directionX,
    directionY,
    visibleLength
  }
}

export const hydroPumpAnimation: AbilityAnimation = (args) => {
  const { scene, delay } = args
  const line = hydroPumpLine(args)
  if (!line) return
  const { casterX, casterY, angle, directionX, directionY, visibleLength } =
    line
  const startX = casterX + directionX * 12
  const startY = casterY - 20 + directionY * 12
  const streamLength = Math.max(0, visibleLength - 12)
  const animationDelay = Math.max(0, delay ?? 0)
  const holdDuration = 90
  const fadeDuration = 180
  const streamDuration = HydroPumpTravelDuration + holdDuration + fadeDuration
  const stream = scene.add
    .graphics()
    .setPosition(startX, startY)
    .setDepth(DEPTH.PROJECTILE)
    .setRotation(angle)
  scene.abilitiesVfxGroup?.add(stream)

  const bubbleCount = Math.max(8, Math.ceil(streamLength / 10))
  const noise = (i: number) => {
    const value = Math.sin(i * 12.9898) * 43758.5453
    return value - Math.floor(value)
  }
  const drawStream = (elapsed: number) => {
    stream.clear()
    const fade = Phaser.Math.Clamp(
      (streamDuration - elapsed) / fadeDuration,
      0,
      1
    )
    for (let i = 0; i < bubbleCount; i++) {
      const radius = 3 + noise(i + 17) * 4
      const age = elapsed - (i / bubbleCount) * 220
      if (age < 0 || age > HydroPumpTravelDuration) continue
      const x =
        streamLength *
        Phaser.Math.Easing.Quadratic.Out(age / HydroPumpTravelDuration)
      if (x < radius || x + radius > streamLength) continue
      const y = (noise(i + 31) - 0.5) * 20 + Math.sin(age / 110 + i * 2) * 2
      drawBubble(stream, x, y, radius, fade)
    }
  }

  const tween = scene.tweens.addCounter({
    from: 0,
    to: streamDuration,
    duration: streamDuration,
    delay: animationDelay,
    onUpdate: (tween) => {
      if (stream.active) drawStream(tween.getValue() ?? 0)
    },
    onComplete: () => stream.destroy()
  })
  stream.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())

  getImpactCells(args.data).forEach((cell) =>
    hydroPumpSplashAnimation(args, line, cell)
  )
}

function hydroPumpSplashAnimation(
  { scene, delay, flip, pokemonsOnBoard }: AbilityAnimationArgs,
  line: NonNullable<ReturnType<typeof hydroPumpLine>>,
  cell: { x: number; y: number }
) {
  const { casterX, casterY, directionX, directionY, visibleLength } = line
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    cell.x,
    cell.y,
    flip
  )
  const impactX = targetScreenX - directionX * 10
  const impactY = targetScreenY - 20 - directionY * 10
  const targetSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.active &&
      pokemon.positionX === cell.x &&
      pokemon.positionY === cell.y
  )
  const puddle = scene.add
    .graphics({ x: targetScreenX, y: targetScreenY + 5 })
    .setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
    .setScale(0.35)
    .setAlpha(0)
  if (targetSprite) {
    puddle.setPosition(0, 5)
    targetSprite.addAt(puddle, targetSprite.getIndex(targetSprite.sprite))
  }
  puddle.fillStyle(0x6abfce, 0.4)
  puddle.fillEllipse(0, 0, 26, 20)
  puddle.lineStyle(2, 0xaddfe5, 0.65)
  puddle.strokeEllipse(0, 0, 30, 23)
  scene.abilitiesVfxGroup?.add(puddle)
  const alignPuddle = () => {
    const shadow = targetSprite?.shadow
    if (!shadow || !puddle.active) return
    const frame = shadow.frame
    puddle.setPosition(
      shadow.x +
        (frame.x + frame.width / 2 - shadow.displayOriginX) *
          shadow.scaleX *
          (shadow.flipX ? -1 : 1),
      shadow.y +
        (frame.y + frame.height / 2 - shadow.displayOriginY) *
          shadow.scaleY *
          (shadow.flipY ? -1 : 1)
    )
  }
  alignPuddle()

  const targetDistance =
    (targetScreenX - casterX) * directionX +
    (targetScreenY - casterY) * directionY
  const impactProgress = Phaser.Math.Clamp(
    (targetDistance - 22) / Math.max(1, visibleLength - 12),
    0,
    1
  )
  const impactDelay =
    Math.max(0, delay ?? 0) +
    HydroPumpTravelDuration * (1 - Math.sqrt(1 - impactProgress))
  scene.tweens.chain({
    targets: puddle,
    tweens: [
      {
        alpha: 0.8,
        scale: 1,
        duration: 100,
        delay: impactDelay,
        ease: Phaser.Math.Easing.Quadratic.Out,
        onUpdate: alignPuddle
      },
      { scale: 1, duration: 35, onUpdate: alignPuddle },
      {
        alpha: 0,
        scale: 1.4,
        duration: 190,
        ease: Phaser.Math.Easing.Quadratic.In,
        onUpdate: alignPuddle
      }
    ],
    onComplete: () => puddle.destroy()
  })

  for (let i = 0; i < 7; i++) {
    const direction = line.angle + ((i - 3) / 3) * 1.1
    const distance = randomBetween(20, 36)
    const bubble = scene.add
      .graphics()
      .setPosition(impactX, impactY)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setScale(0.7)
      .setAlpha(0)
    drawBubble(bubble, 0, 0, randomBetween(8, 10), 1.65)
    scene.abilitiesVfxGroup?.add(bubble)
    scene.tweens.chain({
      targets: bubble,
      tweens: [
        {
          alpha: 1,
          scale: 1,
          duration: 35,
          delay: impactDelay + randomBetween(0, 35)
        },
        {
          x: impactX + Math.cos(direction) * distance,
          y: impactY + Math.sin(direction) * distance,
          alpha: 0,
          scale: 0.45,
          duration: 240,
          ease: Phaser.Math.Easing.Quadratic.Out
        }
      ],
      onComplete: () => bubble.destroy()
    })
  }
}
