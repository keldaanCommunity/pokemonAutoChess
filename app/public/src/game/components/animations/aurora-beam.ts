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
import { getImpactCells } from "./helpers"

const TAU = Math.PI * 2
const BEAM_TRAVEL_DURATION = 190
const EFFECT_DURATION = 540
const BEAM_START = 4
const BEAM_START_FEATHER = 34
const BEAM_START_STEPS = 16
const palette = [
  0xff4b72, 0xffa34f, 0xffeb68, 0x7dff9b, 0x56eaff, 0x6683ff, 0xc36dff
]

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function beamLine(args: AbilityAnimationArgs) {
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

  return { x, y, angle, dx, dy, length: Math.max(0, length) }
}

function drawEmitter(
  back: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  back.clear()
  front.clear()

  const appear = clamp(elapsed / 55)
  const fade = 1 - clamp((elapsed - 350) / 190)
  const alpha = appear * fade
  if (alpha <= 0) return

  const pulse = Math.sin(elapsed / 24) * 2
  const rotation = elapsed * 0.006
  back.fillStyle(0x754cff, alpha * 0.18)
  back.fillCircle(x, y, 22 + pulse)
  back.lineStyle(2.5, 0xffffff, alpha * 0.9)
  back.strokeCircle(x, y, 19 + pulse)

  for (let i = 0; i < palette.length; i++) {
    const start = rotation + (i / palette.length) * TAU
    back.lineStyle(4, palette[i], alpha * 0.95)
    back.beginPath()
    back.arc(x, y, 25 + pulse, start, start + TAU / palette.length + 0.1)
    back.strokePath()
  }

  front.lineStyle(1.5, 0xffffff, alpha * 0.9)
  front.beginPath()
  front.arc(x, y, 15 + pulse * 0.5, rotation, rotation + Math.PI * 1.65)
  front.strokePath()
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * TAU - rotation * 0.7
    const inner = 27 + pulse
    const outer = inner + (i % 3 === 0 ? 11 : 6)
    front.lineStyle(i % 3 === 0 ? 2 : 1, palette[i % palette.length], alpha)
    front.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer
    )
  }
}

function drawBeam(
  graphics: Phaser.GameObjects.Graphics,
  length: number,
  elapsed: number
) {
  graphics.clear()
  const progress = clamp(elapsed / BEAM_TRAVEL_DURATION)
  const fade = 1 - clamp((elapsed - 340) / 180)
  if (progress <= 0 || fade <= 0 || length <= 0) return

  const end = length * progress
  const drawStrand = (
    width: number,
    color: number,
    alpha: number,
    yAt: (x: number) => number
  ) => {
    const featherEnd = Math.min(end, BEAM_START_FEATHER)
    if (featherEnd <= BEAM_START) return

    for (let i = 0; i < BEAM_START_STEPS; i++) {
      const start =
        BEAM_START + ((featherEnd - BEAM_START) * i) / BEAM_START_STEPS
      const finish =
        BEAM_START + ((featherEnd - BEAM_START) * (i + 1)) / BEAM_START_STEPS
      const opacity = clamp(
        ((start + finish) / 2 - BEAM_START) / (BEAM_START_FEATHER - BEAM_START)
      )
      graphics.lineStyle(
        width,
        color,
        alpha * opacity * opacity * (3 - 2 * opacity)
      )
      graphics.lineBetween(start, yAt(start), finish, yAt(finish))
    }

    if (end > BEAM_START_FEATHER) {
      const points = Array.from({ length: 25 }, (_, step) => {
        const x = BEAM_START_FEATHER + ((end - BEAM_START_FEATHER) * step) / 24
        return new Phaser.Math.Vector2(x, yAt(x))
      })
      graphics.lineStyle(width, color, alpha)
      graphics.strokePoints(points, false)
    }
  }

  drawStrand(28, 0x9b68ff, fade * 0.16, () => 0)
  drawStrand(15, 0x73eaff, fade * 0.22, () => 0)

  for (let i = 0; i < palette.length; i++) {
    const offset = (i - (palette.length - 1) / 2) * 2.4
    drawStrand(3.2, palette[i], fade * 0.95, (x) => {
      const fraction = clamp((x - 17) / Math.max(1, end - 17))
      const ripple = Math.sin(fraction * 26 - elapsed / 22 + i * 0.7) * 1.1
      return offset + ripple
    })
  }

  drawStrand(3, 0xffffff, fade, () => 0)
  graphics.fillStyle(0x8beeff, fade * 0.75)
  graphics.fillCircle(end, 0, 8)
  graphics.fillStyle(0xffffff, fade)
  graphics.fillCircle(end, 0, 4)
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  elapsed: number,
  arrival: number
) {
  graphics.clear()
  const local = elapsed - arrival
  const appear = clamp(local / 38)
  const fade = 1 - clamp((local - 70) / 210)
  const alpha = appear * fade
  if (alpha <= 0) return

  const expansion = 1 + clamp(local / 140) * 0.35
  const radius = 24 * expansion
  graphics.fillStyle(0xff70ec, alpha * 0.12)
  graphics.fillCircle(0, 0, radius + 8)
  graphics.fillStyle(0x70eaff, alpha * 0.1)
  graphics.fillCircle(0, 0, radius)

  for (let i = 0; i < palette.length; i++) {
    const start = (i / palette.length) * TAU + local / 190
    graphics.lineStyle(3, palette[i], alpha)
    graphics.beginPath()
    graphics.arc(0, 0, radius, start, start + TAU / palette.length + 0.12)
    graphics.strokePath()
  }

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * TAU - local / 170
    const inner = 14 + (i % 2) * 3
    const outer = 29 + (i % 3) * 5
    graphics.lineStyle(
      i % 3 === 0 ? 2 : 1.3,
      palette[i % palette.length],
      alpha
    )
    graphics.lineBetween(
      Math.cos(angle) * inner,
      Math.sin(angle) * inner,
      Math.cos(angle) * outer * expansion,
      Math.sin(angle) * outer * expansion
    )
  }

  graphics.fillStyle(0xffa7f4, alpha * 0.8)
  graphics.fillCircle(0, 0, 13)
  graphics.fillStyle(0xffffff, alpha)
  graphics.fillCircle(0, 0, 8)
}

export const auroraBeamAnimation: AbilityAnimation = (args) => {
  const line = beamLine(args)
  if (!line) return

  const { scene } = args
  const [casterX, casterY] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  const emitterX = casterX + line.dx * 4
  const emitterY = casterY - 20 + line.dy * 4
  const beam = scene.add
    .graphics({ x: line.x, y: line.y })
    .setRotation(line.angle)
    .setDepth(DEPTH.PROJECTILE)
  const emitterBack = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const emitterFront = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const impacts = getImpactCells(args.data).map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, args.flip)
    const impactY = y - 20
    const graphics = scene.add
      .graphics({ x, y: impactY })
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
    emitterBack,
    emitterFront,
    beam,
    ...impacts.map(({ graphics }) => graphics)
  ]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const draw = (elapsed: number) => {
    if (visuals.some((visual) => !visual.active)) return
    drawEmitter(emitterBack, emitterFront, emitterX, emitterY, elapsed)
    drawBeam(beam, line.length, elapsed)
    impacts.forEach(({ graphics, arrival }) =>
      drawImpact(graphics, elapsed, arrival)
    )
  }

  const tween = scene.tweens.addCounter({
    from: 0,
    to: EFFECT_DURATION,
    delay: Math.max(0, args.delay ?? 0),
    duration: EFFECT_DURATION,
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => emitterBack.destroy()
  })
  emitterBack.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    emitterFront.destroy()
    beam.destroy()
    impacts.forEach(({ graphics }) => graphics.destroy())
  })
  draw(0)
}
