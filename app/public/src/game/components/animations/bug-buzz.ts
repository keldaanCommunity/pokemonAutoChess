import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { isBoardCell } from "./helpers"

const LEAD_IN = 65
const PULSE_COUNT = 3
const PULSE_INTERVAL = 48
const WAVE_DURATION = 300
const DURATION_MULTIPLIER = 1.2
const LIME = 0x9cff36
const MINT = 0x50ffd4
const PALE = 0xffffb3
const { Clamp, Linear } = Phaser.Math

function drawPulse(
  fx: GameObjects.Graphics,
  x: number,
  radius: number,
  alpha: number,
  tail: number
) {
  fx.fillStyle(LIME, 0.38 * alpha)
  fx.fillTriangle(x - tail, 0, x, -radius * 0.48, x, radius * 0.48)
  fx.fillStyle(LIME, 0.2 * alpha)
  fx.fillEllipse(x, 0, radius * 1.25, radius * 2.2)
  fx.lineStyle(4, LIME, 0.78 * alpha)
  fx.strokeEllipse(x, 0, radius * 0.95, radius * 1.8)
  fx.lineStyle(1.5, MINT, 0.9 * alpha)
  fx.strokeEllipse(x, 0, radius * 0.82, radius * 1.66)
  fx.fillStyle(PALE, alpha)
  fx.fillEllipse(x, 0, radius * 0.48, radius * 0.7)
}

function drawWave(
  fx: GameObjects.Graphics,
  contact: number,
  elapsed: number,
  duration: number,
  scale: number
) {
  if (elapsed < 0 || elapsed >= duration) return

  const progress = elapsed / duration
  const spread = Phaser.Math.Easing.Cubic.Out(progress)
  const alpha = (1 - progress) ** 1.4
  const radius = (8 + 43 * spread) * scale
  const center = contact + 24 * spread * scale
  const gap = 0.12 + 0.28 * progress

  // Local +X follows the shot. Brighter forward arcs wrap around a fainter rear.
  for (let i = 0; i < 6; i++) {
    const angle = ((i - 2.5) * Math.PI) / 3
    const forward = Math.max(0, Math.cos(angle))
    const intensity = alpha * (0.44 + 0.64 * forward)
    const halfArc = Math.PI / 6 - gap * (i % 2 === 0 ? 1 : 0.6)
    const arcRadius = radius * (i % 2 === 0 ? 1 : 0.93)
    fx.beginPath()
    for (let step = 0; step <= 8; step++) {
      const theta = angle + halfArc * (step / 4 - 1)
      const x = center + Math.cos(theta) * arcRadius * 0.64
      const y = Math.sin(theta) * arcRadius
      if (step === 0) fx.moveTo(x, y)
      else fx.lineTo(x, y)
    }
    fx.lineStyle((7 + 7 * forward) * scale, LIME, 0.46 * intensity)
    fx.strokePath()
    fx.lineStyle(
      (2.6 + 2.4 * forward) * scale,
      i % 2 === 0 ? MINT : LIME,
      intensity
    )
    fx.strokePath()
  }
}

function drawContact(fx: GameObjects.Graphics, x: number, elapsed: number) {
  if (elapsed < 0 || elapsed >= 85) return

  const progress = elapsed / 85
  const alpha = 1 - progress
  fx.fillStyle(LIME, 0.55 * alpha)
  fx.fillEllipse(x, 0, 17 + progress * 15, 20 + progress * 20)
  fx.fillStyle(PALE, alpha)
  fx.fillCircle(x, 0, 7 * alpha)
  for (let i = 0; i < 6; i++) {
    const angle = ((i + 0.35) * Math.PI) / 3
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const inner = 5 + progress * 14
    const tip = inner + (i % 2 === 0 ? 16 : 10) * alpha
    fx.lineStyle(2, i % 2 === 0 ? PALE : MINT, alpha)
    fx.lineBetween(x + dx * inner, dy * inner, x + dx * tip, dy * tip)
  }
}

export const bugBuzzAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  if (!isBoardCell(positionX, positionY) || !isBoardCell(targetX, targetY)) {
    return
  }
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [tx, ty] = transformEntityCoordinates(targetX, targetY, flip)
  const distance = Math.hypot(tx - x, ty - y)
  if (distance === 0) return

  const start = Math.min(20, distance * 0.2)
  const travel = Clamp(distance * 0.62, 90, 195)
  const contact = LEAD_IN + travel
  const timelineEnd = contact + WAVE_DURATION
  const fx = scene.add
    .graphics({ x, y })
    .setRotation(Math.atan2(ty - y, tx - x))
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(fx)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: timelineEnd,
    duration: timelineEnd * DURATION_MULTIPLIER,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!fx.active) return
      const t = counter.getValue() ?? 0
      fx.clear()

      drawWave(fx, distance, t - contact, WAVE_DURATION, 1)
      drawWave(fx, distance, t - contact - PULSE_INTERVAL, 220, 0.78)
      drawWave(fx, distance, t - contact - 2 * PULSE_INTERVAL, 175, 0.61)
      drawContact(fx, distance, t - contact)

      if (t < LEAD_IN) {
        const charge = t / LEAD_IN
        drawPulse(fx, start, 4 + charge * 9, charge, 0)
      }

      for (let i = 0; i < PULSE_COUNT; i++) {
        const p = (t - LEAD_IN - i * PULSE_INTERVAL) / travel
        if (p < 0 || p >= 1) continue
        const head = Linear(start, distance, p)
        const alpha = i === 0 ? 1 : 0.84
        const radius = (13 + 8 * p) * (1 - i * 0.1)
        drawPulse(fx, head, radius, alpha, Math.min(30, head - start))
      }
    },
    onComplete: () => fx.destroy()
  })

  fx.once("destroy", () => tween.stop())
}
