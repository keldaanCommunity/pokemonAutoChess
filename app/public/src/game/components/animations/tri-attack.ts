import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimationArgs } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const ORB_REVEAL = 220
const FLIGHT = 250
const IMPACT_DURATION = 340
const TOTAL_DURATION = ORB_REVEAL + FLIGHT + IMPACT_DURATION
const ORB_BEAM_ORIGIN_RADIUS = 12.5
const { Clamp, Linear } = Phaser.Math

type Element = "fire" | "electric" | "ice"

const ELEMENT_COLORS: Record<
  Element,
  { glow: number; body: number; light: number; core: number }
> = {
  fire: { glow: 0xff6b1a, body: 0xff9f23, light: 0xffd84a, core: 0xfff5b0 },
  electric: {
    glow: 0xffd21f,
    body: 0xffe344,
    light: 0xfff39a,
    core: 0xffffff
  },
  ice: { glow: 0x54dfff, body: 0x73e7ff, light: 0xc3f7ff, core: 0xffffff }
}

function isBoardCell(x: number, y: number) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function isElement(value: unknown): value is Element {
  return value === "fire" || value === "electric" || value === "ice"
}

function drawOrb(
  graphics: GameObjects.Graphics,
  element: Element,
  x: number,
  y: number,
  alpha: number,
  time: number
) {
  const colors = ELEMENT_COLORS[element]
  const scale = 1.15
  graphics.fillStyle(colors.glow, alpha * 0.22).fillCircle(x, y, 15 * scale)
  graphics.fillStyle(colors.body, alpha * 0.84).fillCircle(x, y, 9 * scale)
  graphics
    .fillStyle(colors.light, alpha)
    .fillCircle(x - scale, y - 2 * scale, 6 * scale)
  graphics
    .fillStyle(colors.core, alpha * 0.95)
    .fillCircle(x - 2 * scale, y - 3 * scale, 3 * scale)
  graphics.lineStyle(1.5 * scale, colors.light, alpha * 0.8)
  graphics.strokeCircle(x, y, (11 + Math.sin(time / 55) * 1.5) * scale)

  if (element === "fire") {
    for (let spark = 0; spark < 3; spark++) {
      const angle = time / 130 + (spark * Math.PI * 2) / 3
      const length = (13 + (spark % 2) * 3) * scale
      graphics.lineStyle(2 * scale, colors.light, alpha * 0.9)
      graphics.lineBetween(
        x + Math.cos(angle) * 8 * scale,
        y + Math.sin(angle) * 8 * scale,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      )
    }
  } else if (element === "electric") {
    graphics.lineStyle(2 * scale, colors.core, alpha)
    graphics.lineBetween(
      x - 4 * scale,
      y - 13 * scale,
      x + 1 * scale,
      y - 6 * scale
    )
    graphics.lineBetween(
      x + 1 * scale,
      y - 6 * scale,
      x - 3 * scale,
      y - 1 * scale
    )
    graphics.lineBetween(
      x - 3 * scale,
      y - 1 * scale,
      x + 5 * scale,
      y + 6 * scale
    )
    graphics.lineStyle(scale, colors.light, alpha)
    graphics.strokeCircle(x, y, (15 + Math.sin(time / 45) * 2) * scale)
  } else {
    graphics.fillStyle(colors.core, alpha * 0.9)
    graphics.fillTriangle(
      x,
      y - 15 * scale,
      x - 4 * scale,
      y - 8 * scale,
      x + 4 * scale,
      y - 8 * scale
    )
    graphics.fillTriangle(
      x + 15 * scale,
      y,
      x + 8 * scale,
      y - 4 * scale,
      x + 8 * scale,
      y + 4 * scale
    )
    graphics.fillTriangle(
      x,
      y + 15 * scale,
      x - 4 * scale,
      y + 8 * scale,
      x + 4 * scale,
      y + 8 * scale
    )
    graphics.fillTriangle(
      x - 15 * scale,
      y,
      x - 8 * scale,
      y - 4 * scale,
      x - 8 * scale,
      y + 4 * scale
    )
  }
}

function drawFireImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number,
  fade: number
) {
  const radius = 8 + progress * 25
  for (let puff = 0; puff < 6; puff++) {
    const angle = -Math.PI / 2 + (puff / 6) * Math.PI * 2 + 0.18
    const spread = radius * (0.42 + (puff % 3) * 0.07)
    graphics.fillStyle(0x342b2b, fade * 0.34)
    graphics.fillEllipse(
      x + Math.cos(angle) * spread,
      y + Math.sin(angle) * spread,
      radius * (0.56 + (puff % 2) * 0.08),
      radius * (0.42 + (puff % 3) * 0.04)
    )
  }
  for (let flame = 0; flame < 6; flame++) {
    const angle = -Math.PI / 2 + (flame / 6) * Math.PI * 2 + 0.12
    const ux = Math.cos(angle)
    const uy = Math.sin(angle)
    const px = -uy
    const py = ux
    const base = radius * (0.18 + (flame % 2) * 0.08)
    const length = radius * (0.72 + (flame % 3) * 0.13)
    const width = 3 + (flame % 2) * 1.5
    const flamePoints = (scale: number) => [
      new Phaser.Math.Vector2(
        x + ux * base + px * width * scale,
        y + uy * base + py * width * scale
      ),
      new Phaser.Math.Vector2(
        x + ux * (base + length * 0.4) + px * width * 0.65 * scale,
        y + uy * (base + length * 0.4) + py * width * 0.65 * scale
      ),
      new Phaser.Math.Vector2(
        x + ux * (base + length),
        y + uy * (base + length)
      ),
      new Phaser.Math.Vector2(
        x + ux * (base + length * 0.34) - px * width * 0.5 * scale,
        y + uy * (base + length * 0.34) - py * width * 0.5 * scale
      ),
      new Phaser.Math.Vector2(
        x + ux * base - px * width * scale,
        y + uy * base - py * width * scale
      )
    ]
    graphics.fillStyle(0xff6419, fade * 0.9)
    graphics.fillPoints(flamePoints(1), true)
    graphics.fillStyle(0xffd84a, fade * 0.92)
    graphics.fillPoints(flamePoints(0.42), true)
  }
  const flash = Clamp(1 - progress * 1.15, 0, 1)
  graphics.fillStyle(0xffa31b, fade * 0.42)
  graphics.fillCircle(x, y, radius * 0.58)
  graphics.fillStyle(0xfff4b0, fade * flash)
  graphics.fillCircle(x, y, 4 + flash * 8)
  for (let ember = 0; ember < 5; ember++) {
    const angle = (ember / 5) * Math.PI * 2 + 0.4
    const distance = radius * (0.72 + (ember % 2) * 0.12)
    graphics.fillStyle(ember % 2 ? 0xff6a1a : 0xffe267, fade * 0.9)
    graphics.fillCircle(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      ember % 2 ? 1.5 : 2
    )
  }
}

function drawElectricImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number,
  fade: number
) {
  const radius = 10 + progress * 28
  graphics.fillStyle(0xffe33a, fade * 0.38)
  graphics.fillCircle(x, y, radius * 0.55)
  graphics.fillStyle(0xffffff, fade * 0.92)
  graphics.fillCircle(x, y, radius * 0.2)
  for (let bolt = 0; bolt < 8; bolt++) {
    const angle = (bolt / 8) * Math.PI * 2
    const ux = Math.cos(angle)
    const uy = Math.sin(angle)
    const px = -uy
    const py = ux
    const middle = radius * (0.55 + (bolt % 2) * 0.15)
    const end = radius * (0.9 + (bolt % 3) * 0.12)
    graphics.lineStyle(4, 0xffcd28, fade * 0.65)
    graphics.beginPath()
    graphics.moveTo(x + ux * 4, y + uy * 4)
    graphics.lineTo(x + ux * middle + px * 4, y + uy * middle + py * 4)
    graphics.lineTo(x + ux * end - px * 3, y + uy * end - py * 3)
    graphics.strokePath()
    graphics.lineStyle(1.6, 0xffffff, fade)
    graphics.beginPath()
    graphics.moveTo(x + ux * 4, y + uy * 4)
    graphics.lineTo(x + ux * middle + px * 4, y + uy * middle + py * 4)
    graphics.lineTo(x + ux * end - px * 3, y + uy * end - py * 3)
    graphics.strokePath()
  }
}

function drawIceImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number,
  fade: number
) {
  const radius = 8 + progress * 27
  graphics.fillStyle(0x64dfff, fade * 0.3)
  graphics.fillCircle(x, y, radius * 0.55)
  graphics.fillStyle(0xe4fdff, fade * 0.9)
  graphics.fillCircle(x, y, radius * 0.2)
  for (let shard = 0; shard < 8; shard++) {
    const angle = (shard / 8) * Math.PI * 2 + 0.12
    const ux = Math.cos(angle)
    const uy = Math.sin(angle)
    const length = radius * (0.7 + (shard % 3) * 0.17)
    const width = 3 + (shard % 2) * 2
    graphics.fillStyle(shard % 2 ? 0x8ceeff : 0xd8fbff, fade * 0.92)
    graphics.fillTriangle(
      x + ux * 4 - uy * width,
      y + uy * 4 + ux * width,
      x + ux * length,
      y + uy * length,
      x + ux * 4 + uy * width,
      y + uy * 4 - ux * width
    )
  }
  graphics.lineStyle(1.5, 0xffffff, fade * 0.9)
  for (let flake = 0; flake < 3; flake++) {
    const angle = (flake / 3) * Math.PI * 2 + progress
    const cx = x + Math.cos(angle) * radius * 0.65
    const cy = y + Math.sin(angle) * radius * 0.65
    for (let arm = 0; arm < 3; arm++) {
      const a = angle + (arm * Math.PI) / 3
      graphics.lineBetween(
        cx - Math.cos(a) * 4,
        cy - Math.sin(a) * 4,
        cx + Math.cos(a) * 4,
        cy + Math.sin(a) * 4
      )
    }
  }
}

export const triAttackAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0,
  data
}: AbilityAnimationArgs) => {
  if (!isBoardCell(positionX, positionY)) return

  const element: Element = isElement(data?.element) ? data.element : "fire"
  const elements: Element[] = ["fire", "electric", "ice"]
  const orbOffsets = [
    { x: -25, y: -56 },
    { x: 0, y: -68 },
    { x: 25, y: -56 }
  ]
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const validTarget =
    isBoardCell(targetX, targetY) &&
    (targetX !== positionX || targetY !== positionY)
  const [targetCellX, targetCellY] = validTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [casterX, casterY]
  const targetPoint = { x: targetCellX, y: targetCellY - 16 }
  const selectedOrbIndex = elements.indexOf(element)
  const selectedOrb = orbOffsets[selectedOrbIndex]
  const orbCenter = {
    x: casterX + selectedOrb.x,
    y: casterY + selectedOrb.y
  }
  const dx = targetPoint.x - orbCenter.x
  const dy = targetPoint.y - orbCenter.y
  const angle = Math.atan2(dy, dx)
  const startPoint = {
    x: orbCenter.x + Math.cos(angle) * ORB_BEAM_ORIGIN_RADIUS,
    y: orbCenter.y + Math.sin(angle) * ORB_BEAM_ORIGIN_RADIUS
  }
  const effect = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)

  const drawBeam = (
    endX: number,
    endY: number,
    progress: number,
    fade: number,
    time: number
  ) => {
    if (element === "electric") {
      const points: Phaser.Math.Vector2[] = []
      const segmentCount = 8
      for (let step = 0; step <= segmentCount; step++) {
        const t = (step / segmentCount) * progress
        const jitter =
          step === 0 || step === segmentCount
            ? 0
            : Math.sin(time / 24 + step * 2.7) * 5
        points.push(
          new Phaser.Math.Vector2(
            Linear(startPoint.x, targetPoint.x, t) - Math.sin(angle) * jitter,
            Linear(startPoint.y, targetPoint.y, t) + Math.cos(angle) * jitter
          )
        )
      }
      effect.lineStyle(12, 0xffd52a, fade * 0.24).strokePoints(points, false)
      effect.lineStyle(5, 0xffdf37, fade * 0.9).strokePoints(points, false)
      effect.lineStyle(1.8, 0xffffff, fade).strokePoints(points, false)
      return
    }

    const color = ELEMENT_COLORS[element]
    effect.lineStyle(15, color.glow, fade * 0.25)
    effect.lineBetween(startPoint.x, startPoint.y, endX, endY)
    effect.lineStyle(element === "fire" ? 7 : 9, color.body, fade * 0.9)
    effect.lineBetween(startPoint.x, startPoint.y, endX, endY)
    effect.lineStyle(element === "fire" ? 2.5 : 3.5, color.core, fade)
    effect.lineBetween(startPoint.x, startPoint.y, endX, endY)

    if (element === "fire") {
      for (let ember = 0; ember < 5; ember++) {
        const t = Clamp(progress - ember * 0.065, 0, 1)
        const x = Linear(startPoint.x, targetPoint.x, t)
        const y = Linear(startPoint.y, targetPoint.y, t)
        const spread = Math.sin(time / 26 + ember * 4) * 5
        effect.fillStyle(ember % 2 ? 0xff6320 : 0xffdf57, fade * 0.85)
        effect.fillCircle(
          x - Math.sin(angle) * spread,
          y + Math.cos(angle) * spread,
          ember % 2 ? 2.5 : 3.5
        )
      }
    } else {
      for (let shard = 0; shard < 5; shard++) {
        const t = Clamp(progress - shard * 0.09, 0, 1)
        const x = Linear(startPoint.x, targetPoint.x, t)
        const y = Linear(startPoint.y, targetPoint.y, t)
        const size = 3 + (shard % 2) * 2
        effect.fillStyle(shard % 2 ? 0xbaf8ff : 0xffffff, fade * 0.9)
        effect.fillTriangle(
          x - Math.sin(angle) * size,
          y + Math.cos(angle) * size,
          x + Math.cos(angle) * size * 1.7,
          y + Math.sin(angle) * size * 1.7,
          x + Math.sin(angle) * size,
          y - Math.cos(angle) * size
        )
      }
    }
  }

  const tween = scene.tweens.addCounter({
    from: 0,
    to: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!effect.active) return
      const time = counter.getValue() ?? 0
      effect.clear()
      const reveal = Clamp(time / ORB_REVEAL, 0, 1)
      const flightTime = time - ORB_REVEAL
      const orbFade = Clamp((TOTAL_DURATION - time) / 100, 0, 1)

      for (let index = 0; index < elements.length; index++) {
        const orb = orbOffsets[index]
        drawOrb(
          effect,
          elements[index],
          casterX + orb.x,
          casterY + orb.y,
          reveal * orbFade,
          time
        )
      }

      if (validTarget && flightTime >= 0 && flightTime < FLIGHT + 90) {
        const progress = Clamp(flightTime / FLIGHT, 0, 1)
        const fade = Clamp(1 - (flightTime - FLIGHT) / 90, 0, 1)
        const endX = Linear(startPoint.x, targetPoint.x, progress)
        const endY = Linear(startPoint.y, targetPoint.y, progress)
        drawBeam(endX, endY, progress, fade, time)
      }

      if (validTarget && flightTime >= FLIGHT) {
        const impactTime = flightTime - FLIGHT
        const progress = Clamp(impactTime / 90, 0, 1)
        const fade = Clamp(1 - impactTime / IMPACT_DURATION, 0, 1)
        if (element === "fire") {
          drawFireImpact(effect, targetPoint.x, targetPoint.y, progress, fade)
        } else if (element === "electric") {
          drawElectricImpact(
            effect,
            targetPoint.x,
            targetPoint.y,
            progress,
            fade
          )
        } else {
          drawIceImpact(effect, targetPoint.x, targetPoint.y, progress, fade)
        }
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
