import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const TAU = Math.PI * 2
const CHARGE_DURATION = 260
const BEAM_START = 190
const BEAM_TRAVEL = 180
const BEAM_ORIGIN_FEATHER = 36
const BEAM_WIDTH_SCALE = 0.86
const IMPACT_DURATION = 330

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

type BeamLine = {
  x: number
  y: number
  dx: number
  dy: number
  length: number
}

function getBeamLine(args: AbilityAnimationArgs): BeamLine | null {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT ||
    !Number.isInteger(targetX) ||
    !Number.isInteger(targetY) ||
    targetX < 0 ||
    targetX >= BOARD_WIDTH ||
    targetY < 0 ||
    targetY >= BOARD_HEIGHT
  ) {
    return null
  }

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetWorldX, targetWorldY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const targetYAligned = targetWorldY - 20
  const sourceY = casterY - 20
  const targetDx = targetWorldX - casterX
  const targetDy = targetYAligned - sourceY
  const distance = Math.hypot(targetDx, targetDy)
  if (distance === 0) return null

  const dx = targetDx / distance
  const dy = targetDy / distance
  const muzzleOffset = Math.min(34, distance * 0.35)
  return {
    x: casterX + dx * muzzleOffset,
    y: sourceY + dy * muzzleOffset,
    dx,
    dy,
    length: distance - muzzleOffset
  }
}

function drawCharge(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  const appear = clamp(elapsed / 70)
  const fade = 1 - clamp((elapsed - 235) / 75)
  const alpha = appear * fade
  if (alpha <= 0) return

  const progress = clamp(elapsed / CHARGE_DURATION)
  const pulse = Math.sin(elapsed / 20) * 1.5
  const radius = 19 + progress * 10 + pulse
  const rotation = elapsed * 0.008

  graphics.fillStyle(0x812dff, alpha * 0.22)
  graphics.fillCircle(x, y, radius + 14)
  graphics.lineStyle(3, 0xf2a4ff, alpha * 0.9)
  graphics.strokeCircle(x, y, radius + 5)
  graphics.lineStyle(1.5, 0xffffff, alpha * 0.85)
  graphics.strokeCircle(x, y, radius + 9 + pulse)
  graphics.fillStyle(0xc329ff, alpha * 0.72)
  graphics.fillCircle(x, y, radius)
  graphics.fillStyle(0xf05cff, alpha * 0.9)
  graphics.fillCircle(x - 2, y - 2, radius * 0.76)
  graphics.fillStyle(0xffc7ff, alpha * 0.96)
  graphics.fillCircle(x - 3, y - 3, radius * 0.53)
  graphics.fillStyle(0xffffff, alpha)
  graphics.fillCircle(x - 4, y - 4, radius * 0.34)

  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * TAU + rotation * (i % 2 ? -1 : 1)
    const travel = (elapsed * 0.22 + i * 19) % 46
    const outer = 59 - travel
    const inner = Math.max(radius + 8, outer - 10 - (i % 3) * 3)
    const streakAlpha = alpha * Math.sin((travel / 46) * Math.PI)
    const color = i % 3 === 0 ? 0xffffff : i % 2 ? 0xf05cff : 0x9d55ff
    graphics.lineStyle(i % 4 === 0 ? 2 : 1.3, color, streakAlpha)
    graphics.lineBetween(
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer,
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner
    )
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU - rotation * 0.7
    const inner = radius + 4
    const outer = inner + (i % 3 === 0 ? 12 : 7)
    graphics.lineStyle(i % 3 === 0 ? 2 : 1, 0xf7a4ff, alpha * 0.85)
    graphics.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer
    )
  }
}

function drawBeam(
  graphics: Phaser.GameObjects.Graphics,
  line: BeamLine,
  elapsed: number
) {
  const travelElapsed = elapsed - BEAM_START
  const progress = clamp(travelElapsed / BEAM_TRAVEL)
  if (progress <= 0) return

  const fade = 1 - clamp((travelElapsed - BEAM_TRAVEL) / 85)
  if (fade <= 0) return

  const end = line.length * progress
  const px = -line.dy
  const py = line.dx
  const centerY = (distance: number) =>
    Math.sin(distance * 0.075 - elapsed * 0.035) * 2
  const layers = [
    { color: 0x7d1cff, width: 29, alpha: 0.42 },
    { color: 0xd426ff, width: 22, alpha: 0.7 },
    { color: 0xf36bff, width: 15, alpha: 0.88 },
    { color: 0xffc9ff, width: 8, alpha: 0.95 },
    { color: 0xffffff, width: 3.5, alpha: 1 }
  ]

  for (const layer of layers) {
    const pointAt = (distance: number, side: number) => {
      const fraction = distance / Math.max(1, end)
      const taper = 0.68 + 0.32 * Math.sin(fraction * Math.PI * 0.72)
      const ripple = Math.sin(distance * 0.11 - elapsed * 0.04) * 1.5
      const halfWidth = (layer.width * taper + ripple) * BEAM_WIDTH_SCALE
      const wave = centerY(distance)
      return new Phaser.Math.Vector2(
        line.x + line.dx * distance + px * (wave + side * halfWidth),
        line.y + line.dy * distance + py * (wave + side * halfWidth)
      )
    }
    const drawRange = (
      start: number,
      finish: number,
      alphaAt: (distance: number) => number
    ) => {
      const segmentCount = Math.max(1, Math.ceil((finish - start) / 5))
      for (let i = 0; i < segmentCount; i++) {
        const segmentStart = start + ((finish - start) * i) / segmentCount
        const segmentEnd = start + ((finish - start) * (i + 1)) / segmentCount
        const points = [
          pointAt(segmentStart, -1),
          pointAt(segmentEnd, -1),
          pointAt(segmentEnd, 1),
          pointAt(segmentStart, 1)
        ]
        graphics.fillStyle(
          layer.color,
          layer.alpha * fade * alphaAt((segmentStart + segmentEnd) / 2)
        )
        graphics.fillPoints(points, true)
      }
    }

    const featherEnd = Math.min(end, BEAM_ORIGIN_FEATHER)
    drawRange(0, featherEnd, (distance) => {
      const progress = clamp(distance / BEAM_ORIGIN_FEATHER)
      return progress * progress * (3 - 2 * progress)
    })
    if (end > featherEnd) drawRange(featherEnd, end, () => 1)
  }

  for (let i = 0; i < 5; i++) {
    const pointAt = (distance: number) => {
      const offset =
        Math.sin(distance * 0.16 - elapsed * 0.045 + i * 1.5) *
        (3 + (i % 3) * 1.5) *
        BEAM_WIDTH_SCALE
      return new Phaser.Math.Vector2(
        line.x + line.dx * distance + px * offset,
        line.y + line.dy * distance + py * offset
      )
    }
    const color = i % 2 ? 0xffbdff : 0xffffff
    const width = (i % 2 ? 1.4 : 2) * BEAM_WIDTH_SCALE
    const featherEnd = Math.min(end, BEAM_ORIGIN_FEATHER)
    const segmentCount = Math.max(1, Math.ceil(featherEnd / 3))
    for (let step = 0; step < segmentCount; step++) {
      const start = (featherEnd * step) / segmentCount
      const finish = (featherEnd * (step + 1)) / segmentCount
      const progress = clamp((start + finish) / (2 * BEAM_ORIGIN_FEATHER))
      graphics.lineStyle(
        width,
        color,
        fade * 0.8 * progress * progress * (3 - 2 * progress)
      )
      const from = pointAt(start)
      const to = pointAt(finish)
      graphics.lineBetween(from.x, from.y, to.x, to.y)
    }
    if (end > featherEnd) {
      const points = Array.from({ length: 18 }, (_, step) =>
        pointAt(featherEnd + ((end - featherEnd) * step) / 17)
      )
      graphics.lineStyle(width, color, fade * 0.8)
      graphics.strokePoints(points, false)
    }
  }

  const headX = line.x + line.dx * end
  const headY = line.y + line.dy * end
  const headAlpha = fade * clamp(end / BEAM_ORIGIN_FEATHER)
  graphics.fillStyle(0xe658ff, headAlpha * 0.8)
  graphics.fillCircle(headX, headY, 12 * BEAM_WIDTH_SCALE)
  graphics.fillStyle(0xffffff, headAlpha)
  graphics.fillCircle(headX, headY, 6 * BEAM_WIDTH_SCALE)
}

const smokePuffs = [
  { x: -18, y: -7, radius: 19, color: 0x9a27cf },
  { x: 9, y: -17, radius: 20, color: 0xc13bdc },
  { x: 25, y: 3, radius: 17, color: 0xf05adf },
  { x: 7, y: 20, radius: 18, color: 0x8522c2 },
  { x: -25, y: 16, radius: 15, color: 0xda3fe8 },
  { x: -34, y: -15, radius: 12, color: 0xf071ec },
  { x: 30, y: -23, radius: 13, color: 0x9c31d7 },
  { x: 39, y: 13, radius: 11, color: 0xf079ef },
  { x: -3, y: -34, radius: 12, color: 0xe94de4 }
]

function drawSmokeCloud(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  color: number,
  alpha: number,
  phase: number
) {
  const points = Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * TAU
    const irregularity =
      1 +
      Math.sin(angle * 3 + phase) * 0.09 +
      Math.sin(angle * 5 - phase * 0.7) * 0.06 +
      Math.cos(angle * 8 + phase * 0.4) * 0.035
    return new Phaser.Math.Vector2(
      x + Math.cos(angle) * radiusX * irregularity,
      y + Math.sin(angle) * radiusY * irregularity
    )
  })
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  const local = elapsed - (BEAM_START + BEAM_TRAVEL)
  if (local < 0 || local >= IMPACT_DURATION) return

  const appear = clamp(local / 24)
  const fade = 1 - clamp((local - 135) / 195)
  const alpha = appear * fade
  if (alpha <= 0) return

  const expansion = 0.7 + 0.48 * clamp(local / 100)
  const cloudY = y - local * 0.018
  drawSmokeCloud(
    graphics,
    x,
    cloudY,
    38 * expansion,
    30 * expansion,
    0x57117e,
    alpha * 0.86,
    local * 0.008
  )
  drawSmokeCloud(
    graphics,
    x - 4 * expansion,
    cloudY + 2 * expansion,
    29 * expansion,
    23 * expansion,
    0xa529c4,
    alpha * 0.76,
    1.4 + local * 0.01
  )

  for (const [index, puff] of smokePuffs.entries()) {
    const dx = puff.x / 44
    const dy = puff.y / 44
    const drift = local * (0.025 + (index % 3) * 0.007)
    const puffX = x + puff.x * expansion * 0.72 + dx * drift
    const puffY = cloudY + puff.y * expansion * 0.72 + dy * drift
    const size = puff.radius * (0.82 + expansion * 0.38)
    drawSmokeCloud(
      graphics,
      puffX,
      puffY,
      size * 0.92,
      size * 0.68,
      puff.color,
      alpha * 0.74,
      index * 1.7 + local * 0.008
    )
    if (index === 1 || index === 4 || index === 7) {
      drawSmokeCloud(
        graphics,
        puffX - size * 0.12,
        puffY - size * 0.15,
        size * 0.48,
        size * 0.34,
        0xf582ff,
        alpha * 0.42,
        index + local * 0.012
      )
    }
  }

  graphics.fillStyle(0xf5a0ff, alpha * 0.55 * (1 - clamp(local / 90)))
  graphics.fillCircle(x - 2, y - 3, 12)
  graphics.fillStyle(0xffffff, alpha * 0.82 * (1 - clamp(local / 65)))
  graphics.fillCircle(x - 2, y - 3, 6)

  for (let i = 0; i < 11; i++) {
    const angle = (i / 11) * TAU + (i % 2 ? 0.28 : -0.18)
    const distance = 20 + (i % 4) * 4 + local * (0.1 + (i % 3) * 0.025)
    const length = 4 + (i % 3) * 3
    const sparkAlpha = alpha * (1 - clamp(local / (150 + (i % 3) * 25)))
    graphics.lineStyle(i % 4 === 0 ? 2 : 1.2, 0xffe6ff, sparkAlpha)
    graphics.lineBetween(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      x + Math.cos(angle) * (distance + length),
      y + Math.sin(angle) * (distance + length)
    )
  }
}

export const dragonEnergyAnimation: AbilityAnimation = (args) => {
  const line = getBeamLine(args)
  if (!line) return

  const { scene } = args
  const [casterX, casterY] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  const chargeX = casterX + line.dx * (34 - line.length * 0.02)
  const chargeY = casterY - 20 + line.dy * (34 - line.length * 0.02)
  const [targetX, targetY] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  const impactX = targetX
  const impactY = targetY - 20
  const graphics = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const duration = BEAM_START + BEAM_TRAVEL + IMPACT_DURATION
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    delay: Math.max(0, args.delay ?? 0),
    duration,
    onUpdate: (counter) => {
      if (!graphics.active) return
      const elapsed = counter.getValue() ?? 0
      graphics.clear()
      drawCharge(graphics, chargeX, chargeY, elapsed)
      drawBeam(graphics, line, elapsed)
      drawImpact(graphics, impactX, impactY, elapsed)
    },
    onComplete: () => graphics.destroy()
  })

  scene.abilitiesVfxGroup?.add(graphics)
  graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
