import Phaser from "phaser"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const ACQUISITION_DURATION = 300
const FLIGHT_DURATION = 180
const IMPACT_SCALE = 1.25
const TRAIL_HOLD_DURATION = 45
const TRAIL_FADE_DURATION = 100
const SPLASH_DURATION = 300
const SPLASH_EXPANSION_DURATION = 100

type SnipeShotLine = {
  startX: number
  startY: number
  endX: number
  endY: number
  directionX: number
  directionY: number
  length: number
  angle: number
}

function getSnipeShotLine({
  positionX,
  positionY,
  targetX,
  targetY,
  flip
}: AbilityAnimationArgs): SnipeShotLine | null {
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  ) {
    return null
  }

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
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return null

  const directionX = dx / distance
  const directionY = dy / distance
  const startX = casterX + directionX * 14
  const startY = casterY - 20 + directionY * 14
  const endX = targetScreenX - directionX * 8
  const endY = targetScreenY - 20 - directionY * 8
  const length = Math.hypot(endX - startX, endY - startY)
  if (length === 0) return null

  return {
    startX,
    startY,
    endX,
    endY,
    directionX,
    directionY,
    length,
    angle: Math.atan2(directionY, directionX)
  }
}

function drawRibbon(
  graphics: Phaser.GameObjects.Graphics,
  points: Phaser.Math.Vector2[],
  width: number,
  color: number,
  alpha: number
) {
  const left: Phaser.Math.Vector2[] = []
  const right: Phaser.Math.Vector2[] = []
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const previous = points[Math.max(0, i - 1)]
    const next = points[Math.min(points.length - 1, i + 1)]
    const dx = next.x - previous.x
    const dy = next.y - previous.y
    const length = Math.hypot(dx, dy) || 1
    const halfWidth =
      width *
      (0.32 + 0.68 * Math.sin((Math.PI * i) / Math.max(1, points.length - 1)))
    const offsetX = (-dy / length) * halfWidth
    const offsetY = (dx / length) * halfWidth
    left.push(new Phaser.Math.Vector2(point.x + offsetX, point.y + offsetY))
    right.push(new Phaser.Math.Vector2(point.x - offsetX, point.y - offsetY))
  }
  graphics.fillStyle(color, alpha)
  graphics.fillPoints([...left, ...right.reverse()], true)
}

function drawBubble(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  alpha: number
) {
  graphics.fillStyle(0x68dff3, 0.23 * alpha)
  graphics.fillCircle(x, y, radius)
  graphics.lineStyle(1.2, 0xbaf8ff, 0.78 * alpha)
  graphics.strokeCircle(x, y, radius)
  graphics.fillStyle(0xf0ffff, 0.85 * alpha)
  graphics.fillCircle(x - radius * 0.28, y - radius * 0.3, radius * 0.22)
}

function playAcquisition(args: AbilityAnimationArgs) {
  const { scene, positionX, positionY, flip } = args
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const caster = args.pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.active &&
      pokemon.positionX === positionX &&
      pokemon.positionY === positionY
  )
  const sparkle = scene.add
    .graphics({ x, y: y - 42 })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  if (caster) {
    caster.addAt(sparkle, caster.getIndex(caster.sprite) + 1)
    sparkle.setPosition(0, -42)
  }
  scene.abilitiesVfxGroup?.add(sparkle)
  const matrix = new Phaser.GameObjects.Components.TransformMatrix()
  const center = new Phaser.Math.Vector2()
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: ACQUISITION_DURATION,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (!sparkle.active) return
      const source = caster?.active ? caster.sprite : undefined
      if (source?.active) {
        const { frame } = source
        const localX =
          (frame.x + frame.width * 0.62 - source.displayOriginX) *
          (source.flipX ? -1 : 1)
        const localY =
          (frame.y + frame.height * 0.36 - source.displayOriginY) *
          (source.flipY ? -1 : 1)
        source
          .getLocalTransformMatrix(matrix)
          .transformPoint(localX, localY, center)
        sparkle.setPosition(center.x, center.y)
      }
      const progress = counter.getValue() ?? 0
      const envelope = Math.sin(Math.PI * progress)
      const size = (8 + envelope * 11) * 1.4
      const pointWidth = 2.5 * 1.4
      sparkle.clear()
      sparkle.fillStyle(0x82e8ff, envelope * 0.28)
      sparkle.fillCircle(0, 0, size * 0.6)
      sparkle.fillStyle(0xd0faff, envelope * 0.95)
      sparkle.fillTriangle(0, -size, -pointWidth, 0, pointWidth, 0)
      sparkle.fillTriangle(0, size, -pointWidth, 0, pointWidth, 0)
      sparkle.fillTriangle(-size * 0.85, 0, 0, -pointWidth, 0, pointWidth)
      sparkle.fillTriangle(size * 0.85, 0, 0, -pointWidth, 0, pointWidth)
      sparkle.fillStyle(0xffffff, envelope)
      sparkle.fillCircle(0, 0, pointWidth)
      sparkle.lineStyle(1.2, 0xe9ffff, envelope)
      for (let i = 0; i < 4; i++) {
        const angle = Math.PI / 4 + (i * Math.PI) / 2
        const inner = size * 0.82
        const outer = inner + 4 * 1.4
        sparkle.lineBetween(
          Math.cos(angle) * inner,
          Math.sin(angle) * inner,
          Math.cos(angle) * outer,
          Math.sin(angle) * outer
        )
      }
    },
    onComplete: () => sparkle.destroy()
  })
  sparkle.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

function drawWaterStream(
  graphics: Phaser.GameObjects.Graphics,
  line: SnipeShotLine,
  elapsed: number
) {
  graphics.clear()
  const progress = Phaser.Math.Clamp(elapsed / FLIGHT_DURATION, 0, 1)
  const totalDuration =
    FLIGHT_DURATION + TRAIL_HOLD_DURATION + TRAIL_FADE_DURATION
  const fade =
    elapsed <= FLIGHT_DURATION + TRAIL_HOLD_DURATION
      ? 1
      : Phaser.Math.Clamp((totalDuration - elapsed) / TRAIL_FADE_DURATION, 0, 1)
  if (progress === 0 || fade === 0) return

  const normalX = -line.directionY
  const normalY = line.directionX
  const segmentCount = Math.max(2, Math.ceil(progress * 18))
  const centerline: Phaser.Math.Vector2[] = []
  for (let i = 0; i <= segmentCount; i++) {
    const t = (progress * i) / segmentCount
    const flow = Math.sin(t * 21 - elapsed / 48) * 1.8 * Math.sin(Math.PI * t)
    centerline.push(
      new Phaser.Math.Vector2(
        line.startX + line.directionX * line.length * t + normalX * flow,
        line.startY + line.directionY * line.length * t + normalY * flow
      )
    )
  }

  drawRibbon(graphics, centerline, 7, 0x31c8e9, 0.48 * fade)
  drawRibbon(graphics, centerline, 3.2, 0x9af5ff, 0.8 * fade)
  graphics.lineStyle(1.2, 0xf0ffff, 0.8 * fade)
  graphics.strokePoints(centerline)

  const tip = centerline[centerline.length - 1]
  const tipX = tip.x + line.directionX * 7
  const tipY = tip.y + line.directionY * 7
  const backX = tip.x - line.directionX * 5
  const backY = tip.y - line.directionY * 5
  const halfWidth = 4.5
  const sideX = -line.directionY * halfWidth
  const sideY = line.directionX * halfWidth
  graphics.fillStyle(0x42d8f1, 0.9 * fade)
  graphics.fillTriangle(
    tipX,
    tipY,
    backX + sideX,
    backY + sideY,
    backX - sideX,
    backY - sideY
  )
  graphics.fillStyle(0xf1ffff, 0.95 * fade)
  graphics.fillCircle(tip.x, tip.y, 2.4)

  for (let i = 0; i < 7; i++) {
    const age = elapsed - (i * FLIGHT_DURATION * 44) / 360
    if (age <= 0 || age > FLIGHT_DURATION) continue
    const t = age / FLIGHT_DURATION
    const offset = Math.sin(age / 32 + i * 1.7) * (3 + (i % 3) * 1.5)
    const x = line.startX + line.directionX * line.length * t + normalX * offset
    const y = line.startY + line.directionY * line.length * t + normalY * offset
    drawBubble(graphics, x, y, 1.8 + (i % 3) * 0.55, fade * 0.9)
  }
}

function drawSplash(
  graphics: Phaser.GameObjects.Graphics,
  elapsed: number,
  angle: number,
  variant: number
) {
  graphics.clear()
  const expansion = Phaser.Math.Easing.Quadratic.Out(
    Math.min(1, elapsed / SPLASH_EXPANSION_DURATION)
  )
  const fade =
    elapsed <= SPLASH_EXPANSION_DURATION
      ? 1
      : Phaser.Math.Clamp(
          (SPLASH_DURATION - elapsed) /
            (SPLASH_DURATION - SPLASH_EXPANSION_DURATION),
          0,
          1
        )
  const radius = 5 + expansion * 9
  graphics.fillStyle(0x43d8ee, 0.32 * fade)
  graphics.fillCircle(0, 0, radius)
  graphics.fillStyle(0xe7ffff, 0.82 * fade)
  graphics.fillCircle(0, 0, radius * 0.38)
  graphics.lineStyle(1.5, 0xaaf7ff, 0.62 * fade)
  graphics.strokeCircle(0, 0, radius)

  for (let i = 0; i < 5; i++) {
    const direction = angle + (i - 2) * 0.74 + (variant % 2) * 0.16
    const directionX = Math.cos(direction)
    const directionY = Math.sin(direction)
    const normalX = -directionY
    const normalY = directionX
    const stagger = i * 14
    const travel = Phaser.Math.Clamp(
      (elapsed - stagger) / (SPLASH_DURATION - stagger),
      0,
      1
    )
    const drift = Phaser.Math.Easing.Quadratic.Out(travel) * (8 + (i % 3) * 3)
    const arc = Math.sin(travel * Math.PI) * (2 + (i % 3))
    const bob = Math.sin(elapsed / 24 + i * 1.6) * (0.6 + (i % 2) * 0.5)
    const initialDistance = (10 + ((i * 5 + variant) % 12)) * expansion
    const x = directionX * (initialDistance + drift) + normalX * (arc + bob)
    const y =
      directionY * (initialDistance + drift) +
      normalY * (arc + bob) -
      travel * (4 + (i % 3) * 2)
    drawBubble(graphics, x, y, 3.5 + (i % 3), fade)
  }
}

function playSplash(
  args: AbilityAnimationArgs,
  line: SnipeShotLine,
  cell: { x: number; y: number },
  index: number,
  arrival: number
) {
  const [targetX, targetY] = transformEntityCoordinates(
    cell.x,
    cell.y,
    args.flip
  )
  const graphics = args.scene.add
    .graphics({ x: targetX, y: targetY - 20 })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(IMPACT_SCALE)
  args.scene.abilitiesVfxGroup?.add(graphics)

  const tween = args.scene.tweens.addCounter({
    from: 0,
    to: SPLASH_DURATION,
    duration: SPLASH_DURATION,
    delay: Math.max(0, args.delay ?? 0) + ACQUISITION_DURATION + arrival,
    onUpdate: (counter) => {
      if (graphics.active) {
        drawSplash(graphics, counter.getValue() ?? 0, line.angle, index)
      }
    },
    onComplete: () => graphics.destroy()
  })
  graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const snipeShotAnimation: AbilityAnimation = (args) => {
  const line = getSnipeShotLine(args)
  if (!line) return

  playAcquisition(args)
  const stream = args.scene.add.graphics().setDepth(DEPTH.PROJECTILE)
  args.scene.abilitiesVfxGroup?.add(stream)
  const streamDuration =
    FLIGHT_DURATION + TRAIL_HOLD_DURATION + TRAIL_FADE_DURATION
  const streamTween = args.scene.tweens.addCounter({
    from: 0,
    to: streamDuration,
    duration: streamDuration,
    delay: Math.max(0, args.delay ?? 0) + ACQUISITION_DURATION,
    onUpdate: (counter) => {
      if (stream.active) {
        drawWaterStream(stream, line, counter.getValue() ?? 0)
      }
    },
    onComplete: () => stream.destroy()
  })
  stream.once(Phaser.GameObjects.Events.DESTROY, () => streamTween.stop())

  getImpactCells(args.data).forEach((cell, index) => {
    const [targetX, targetY] = transformEntityCoordinates(
      cell.x,
      cell.y,
      args.flip
    )
    const projectedDistance =
      (targetX - line.startX) * line.directionX +
      (targetY - 20 - line.startY) * line.directionY
    const arrival =
      FLIGHT_DURATION * Phaser.Math.Clamp(projectedDistance / line.length, 0, 1)
    playSplash(args, line, cell, index, arrival)
  })
}
