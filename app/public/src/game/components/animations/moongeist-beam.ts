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
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { drawBeamImpactArcs, getImpactCells } from "./helpers"

const TAU = Math.PI * 2
const BEAM_TRAVEL_DURATION = 190
const palette = {
  shadow: 0x17143f,
  violet: 0x694cff,
  indigo: 0x536dff,
  cyan: 0x5eeaff,
  silver: 0xdceaff,
  white: 0xffffff,
  pink: 0xf2a8ff
}

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function moonbeamLine(args: AbilityAnimationArgs) {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  ) {
    return null
  }

  const [x, anchorY] = transformEntityCoordinates(positionX, positionY, flip)
  const [tx, ty] = transformEntityCoordinates(targetX, targetY, flip)
  if (tx === x && ty === anchorY) return null

  const angle = Math.atan2(ty - anchorY, tx - x)
  const [left, rowA] = transformEntityCoordinates(0, 0, flip)
  const [right, rowB] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const bounds = new Phaser.Geom.Rectangle(
    left - CELL_WIDTH / 2,
    Math.min(rowA, rowB) - CELL_HEIGHT / 2,
    right - left + CELL_WIDTH,
    Math.abs(rowB - rowA) + CELL_HEIGHT
  )
  const y = anchorY - 20
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  let length = Infinity
  if (dx > 0) length = Math.min(length, (bounds.right - x) / dx)
  if (dx < 0) length = Math.min(length, (bounds.left - x) / dx)
  if (dy > 0) length = Math.min(length, (bounds.bottom - y) / dy)
  if (dy < 0) length = Math.min(length, (bounds.top - y) / dy)

  return {
    x,
    y,
    angle,
    dx,
    dy,
    length: Math.max(0, length)
  }
}

function drawShell(
  back: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  back.clear()
  front.clear()

  const appear = clamp(elapsed / 110)
  const fade = 1 - clamp((elapsed - 905) / 205)
  const alpha = appear * fade
  if (alpha <= 0) return

  const rotation = elapsed * 0.0055
  const pulse = Math.sin(elapsed / 28) * 2.5
  back.fillStyle(palette.indigo, alpha * 0.14)
  back.fillCircle(x, y, 51 + pulse)
  back.lineStyle(3, palette.silver, alpha * 0.95)
  back.strokeCircle(x, y, 47 + pulse)
  back.lineStyle(1.5, palette.violet, alpha * 0.85)
  back.strokeCircle(x, y, 56 + pulse)

  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * TAU + rotation
    const inner = 49 + pulse
    const outer = inner + 10 + (i % 4) * 5
    back.lineStyle(i % 5 === 0 ? 2.5 : 1.5, palette.white, alpha * 0.9)
    back.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer
    )
  }

  front.lineStyle(2.5, palette.white, alpha * 0.82)
  front.beginPath()
  front.arc(x, y, 42, rotation, rotation + Math.PI * 1.45)
  front.strokePath()
  front.lineStyle(2, palette.cyan, alpha * 0.82)
  front.beginPath()
  front.arc(
    x,
    y,
    36,
    Math.PI - rotation * 0.82,
    Math.PI * 2.65 - rotation * 0.82
  )
  front.strokePath()
  front.fillStyle(palette.white, alpha * 0.18)
  front.fillCircle(x, y, 35)
}

function drawBeam(
  graphics: Phaser.GameObjects.Graphics,
  length: number,
  elapsed: number
) {
  graphics.clear()
  const progress = clamp(elapsed / BEAM_TRAVEL_DURATION)
  const fade = 1 - clamp((elapsed - 905) / 205)
  if (progress <= 0 || fade <= 0 || length <= 0) return

  const end = length * progress
  const layers = [
    { color: palette.violet, width: 31, alpha: 0.28 },
    { color: palette.indigo, width: 24, alpha: 0.72 },
    { color: palette.cyan, width: 15, alpha: 0.95 },
    { color: palette.silver, width: 8, alpha: 1 },
    { color: palette.white, width: 3.5, alpha: 1 }
  ]
  for (const layer of layers) {
    const points: Phaser.Math.Vector2[] = []
    for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
      const side = sideIndex === 0 ? -1 : 1
      for (let i = 0; i <= 20; i++) {
        const fraction = i / 20
        const taper = 0.7 + 0.3 * Math.sin(fraction * Math.PI)
        const ripple = Math.sin(fraction * 34 - elapsed / 24) * 1.5
        points.push(
          new Phaser.Math.Vector2(
            7 + fraction * Math.max(0, end - 7),
            side * (layer.width * taper + ripple) * (0.75 + progress * 0.25)
          )
        )
      }
    }
    graphics.fillStyle(layer.color, layer.alpha * fade)
    graphics.fillPoints(points, true)
  }

  for (let i = 0; i < 5; i++) {
    const points = Array.from({ length: 16 }, (_, j) => {
      const fraction = j / 15
      return new Phaser.Math.Vector2(
        8 + fraction * Math.max(0, end - 8),
        Math.sin(fraction * 42 - elapsed / 20 + i * 1.6) * (3 + i * 1.2)
      )
    })
    graphics.lineStyle(
      i % 2 ? 2 : 1,
      i % 2 ? palette.silver : palette.pink,
      fade * 0.8
    )
    graphics.strokePoints(points, false)
  }

  graphics.fillStyle(palette.cyan, fade * 0.85)
  graphics.fillCircle(10, 0, 15)
  graphics.fillStyle(palette.white, fade)
  graphics.fillCircle(10, 0, 8)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU + elapsed / 140
    graphics.lineStyle(1.5, i % 2 ? palette.silver : palette.cyan, fade * 0.9)
    graphics.lineBetween(
      10 + Math.cos(angle) * 13,
      Math.sin(angle) * 13,
      10 + Math.cos(angle) * 24,
      Math.sin(angle) * 24
    )
  }
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  elapsed: number,
  arrival: number
) {
  graphics.clear()
  const progress = clamp((elapsed - arrival) / 75)
  const fade = 1 - clamp((elapsed - arrival - 65) / 220)
  const alpha = progress * fade
  if (alpha <= 0) return

  const expansion = 1 + progress * 0.8
  drawBeamImpactArcs(
    graphics,
    elapsed - arrival,
    expansion,
    alpha,
    palette.shadow
  )
  graphics.fillStyle(palette.silver, alpha)
  graphics.fillCircle(0, 0, 13 * (1 - progress * 0.2))
  graphics.fillStyle(palette.white, alpha)
  graphics.fillCircle(0, 0, 9)
}

export const moongeistBeamAnimation: AbilityAnimation = (args) => {
  const line = moonbeamLine(args)
  if (!line) return
  const { scene } = args
  const [casterX, casterY] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  const beamAngle = line.angle
  const beam = scene.add
    .graphics({ x: line.x, y: line.y })
    .setRotation(beamAngle)
    .setDepth(DEPTH.PROJECTILE)
  const shellBack = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const shellFront = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const impacts = getImpactCells(args.data).map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, args.flip)
    const impactY = y - 20
    const graphics = scene.add
      .graphics({ x, y: impactY })
      .setRotation(beamAngle)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    const distance = Math.max(
      0,
      (x - line.x) * line.dx + (impactY - line.y) * line.dy
    )
    return {
      graphics,
      arrival: BEAM_TRAVEL_DURATION * clamp(distance / Math.max(1, line.length))
    }
  })
  const visuals = [
    shellBack,
    shellFront,
    beam,
    ...impacts.map(({ graphics }) => graphics)
  ]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const draw = (elapsed: number) => {
    if (visuals.some((visual) => !visual.active)) return
    drawShell(shellBack, shellFront, casterX, casterY - 20, elapsed)
    drawBeam(beam, line.length, elapsed)
    impacts.forEach(({ graphics, arrival }) =>
      drawImpact(graphics, elapsed, arrival)
    )
  }

  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1110,
    delay: Math.max(0, args.delay ?? 0),
    duration: 1110,
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => shellBack.destroy()
  })
  shellBack.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    shellFront.destroy()
    beam.destroy()
    impacts.forEach(({ graphics }) => graphics.destroy())
  })
  draw(0)
}
