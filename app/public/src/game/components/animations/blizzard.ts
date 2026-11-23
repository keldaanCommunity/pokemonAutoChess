import Phaser, { type GameObjects } from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const CHARGE = 300
const WAVE_START = 340
const WAVE_TRAVEL = 850
const DURATION = 1600
const HIT_RADIUS = 4.5
const WHITE = 0xeeffff
const ICE = 0xa2e9ff
const BLUE = 0x54b8e4
const { Clamp } = Phaser.Math

function sparkle(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  g.lineStyle(1.4, WHITE, alpha)
  g.lineBetween(x - size, y, x + size, y)
  g.lineBetween(x, y - size, x, y + size)
  g.fillStyle(WHITE, alpha)
  g.fillCircle(x, y, Math.max(0.7, size * 0.18))
}

function dome(g: GameObjects.Graphics, time: number, front: boolean) {
  const charge = Clamp(time / CHARGE, 0, 1)
  const fade = Clamp((420 - time) / 120, 0, 1)
  if (fade <= 0) return
  const radius = 30 + charge * 17
  const start = front ? 0 : Math.PI
  const end = front ? Math.PI : Math.PI * 2
  if (front) {
    g.fillStyle(ICE, 0.08 * fade)
    g.fillEllipse(0, -25, radius * 1.8, radius * 1.9)
  }
  g.lineStyle(7, BLUE, fade * 0.17)
  g.beginPath()
  g.arc(0, -25, radius, start, end)
  g.strokePath()
  g.lineStyle(2, WHITE, fade * (0.32 + charge * 0.4))
  g.beginPath()
  g.arc(0, -25, radius, start, end)
  g.strokePath()

  if (time < CHARGE) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + time * 0.002
      if (Math.sin(angle) >= 0 !== front) continue
      const distance = 90 - charge * 48 + (i % 3) * 5
      const x = Math.cos(angle) * distance
      const y = -25 + Math.sin(angle) * distance * 0.75
      const alpha = Math.min(1, time / 70) * 0.85
      g.lineStyle(1.5, ICE, alpha * 0.65)
      g.lineBetween(x + Math.cos(angle) * 9, y + Math.sin(angle) * 7, x, y)
      sparkle(g, x, y, 2 + (i % 3), alpha)
    }
  }
}

function burst(g: GameObjects.Graphics, time: number) {
  const age = time - CHARGE
  if (age < 0 || age > 240) return
  const progress = age / 240
  const alpha = Clamp(age / 25, 0, 1) * (1 - progress)
  g.fillStyle(WHITE, alpha * 0.38)
  g.fillCircle(0, -25, 12 + progress * 36)
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2
    const inner = 20 + progress * 28
    const outer = inner + 8 + (i % 3) * 5
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    g.lineStyle(i % 3 === 0 ? 3 : 1.5, i % 2 ? ICE : WHITE, alpha)
    g.lineBetween(x * inner, -25 + y * inner, x * outer, -25 + y * outer)
    sparkle(g, x * outer, -25 + y * outer, 2.5, alpha)
  }
}

function wave(
  g: GameObjects.Graphics,
  time: number,
  radiusMax: number,
  front: boolean
) {
  const progress = (time - WAVE_START) / WAVE_TRAVEL
  if (progress < 0 || progress >= 1) return
  const radius = radiusMax * progress
  const atmosphere = radius > HIT_RADIUS ? 0.48 : 1
  const fade = Clamp(progress * 8, 0, 1) * Clamp((1 - progress) * 5, 0, 1)
  const alpha = fade * atmosphere
  for (let i = 0; i < 36; i++) {
    const angle = i * 2.4 + Math.sin(i * 1.7) * 0.2 + progress * 0.16
    if (Math.sin(angle) >= 0 !== front) continue
    const r = radius - (0.12 + (i % 7) * 0.12)
    if (r <= 0) continue
    const x = Math.cos(angle) * r * CELL_WIDTH
    const y = Math.sin(angle) * r * CELL_HEIGHT - 8
    const width = 90 + (i % 5) * 13
    const height = 37 + (i % 4) * 7
    const mistAlpha = alpha * Clamp(r * 2, 0, 1) * 0.8
    g.fillStyle(0x6baac5, mistAlpha * 0.09)
    g.fillEllipse(x, y, width * 1.5, height * 1.5)
    g.fillStyle(ICE, mistAlpha * 0.06)
    g.fillEllipse(x, y, width, height)
    g.fillStyle(WHITE, mistAlpha * 0.045)
    g.fillEllipse(x + 5, y - 3, width * 0.6, height * 0.65)
  }

  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2 + progress * (i % 2 ? 0.35 : -0.2)
    if (Math.sin(angle) >= 0 !== front) continue
    const r = Math.max(0, radius - (i % 5) * 0.17)
    const x = Math.cos(angle) * r * CELL_WIDTH
    const y = Math.sin(angle) * r * CELL_HEIGHT
    const span = 0.12 + (i % 4) * 0.055
    g.fillStyle(ICE, alpha * 0.16)
    g.fillEllipse(x, y, 34 + (i % 3) * 9, 15 + (i % 4) * 3)
    g.lineStyle(i % 3 === 0 ? 5 : 2.5, i % 2 ? WHITE : ICE, alpha * 0.72)
    g.beginPath()
    for (let step = 0; step <= 8; step++) {
      const a = angle - span / 2 + (span * step) / 8
      const bend = Math.sin((step / 8) * Math.PI) * 9
      const px = Math.cos(a) * (r * CELL_WIDTH + bend)
      const py = Math.sin(a) * (r * CELL_HEIGHT + bend)
      if (step === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.strokePath()
  }

  for (let i = 0; i < 54; i++) {
    const angle = (i / 54) * Math.PI * 2 + progress * (i % 2 ? 0.4 : -0.3)
    if (Math.sin(angle) >= 0 !== front) continue
    const r = Math.max(0, radius - (i % 9) * 0.12)
    const x = Math.cos(angle) * r * CELL_WIDTH
    const y = Math.sin(angle) * r * CELL_HEIGHT
    const length = 6 + (i % 4) * 3
    g.lineStyle(i % 3 === 0 ? 3 : 1.5, i % 2 ? WHITE : ICE, alpha * 0.9)
    g.lineBetween(
      x - Math.cos(angle) * length,
      y - Math.sin(angle) * length,
      x,
      y
    )
    if (i % 3 === 0) sparkle(g, x, y, 3, alpha * 0.9)
    else {
      g.fillStyle(WHITE, alpha * 0.75)
      g.fillCircle(x, y, 1.5 + (i % 3) * 0.6)
    }
  }
}

function impact(g: GameObjects.Graphics, x: number, y: number, age: number) {
  if (age < 0 || age >= 260) return
  const p = age / 260
  const alpha = Clamp(age / 25, 0, 1) * Clamp((1 - p) * 2, 0, 1)
  g.fillStyle(WHITE, alpha * 0.55 * Clamp((100 - age) / 65, 0, 1))
  g.fillCircle(x, y, 9 + p * 13)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + 0.2
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const inner = 7 + p * 8
    const outer = 22 + p * (i % 2 ? 18 : 28)
    const width = i % 2 ? 3 : 5
    g.fillStyle(i % 2 ? ICE : WHITE, alpha * 0.86)
    g.fillTriangle(
      x + dx * inner - dy * width,
      y + dy * inner + dx * width,
      x + dx * outer,
      y + dy * outer,
      x + dx * inner + dy * width,
      y + dy * inner - dx * width
    )
  }
}

export const blizzardAnimation: AbilityAnimation = (args) => {
  const { scene, positionX, positionY, flip, delay = 0 } = args
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT
  )
    return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const radiusMax =
    Math.hypot(
      Math.max(positionX, BOARD_WIDTH - 1 - positionX),
      Math.max(positionY, BOARD_HEIGHT - 1 - positionY)
    ) + 0.8
  const impacts = getImpactCells(args.data)
    .filter(({ x, y }) => {
      const distance = Math.hypot(x - positionX, y - positionY)
      return distance > 0 && distance < HIT_RADIUS
    })
    .map(({ x, y }) => {
      const [targetX, targetY] = transformEntityCoordinates(x, y, flip)
      return {
        x: targetX - casterX,
        y: targetY - casterY - 20,
        time:
          WAVE_START +
          (Math.hypot(x - positionX, y - positionY) / radiusMax) * WAVE_TRAVEL
      }
    })

  const back = scene.add
    .graphics({ x: casterX, y: casterY })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add
    .graphics({ x: casterX, y: casterY })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.getValue() ?? 0
      back.clear()
      front.clear()
      dome(back, time, false)
      dome(front, time, true)
      burst(front, time)
      wave(back, time, radiusMax, false)
      wave(front, time, radiusMax, true)
      for (const hit of impacts) {
        impact(front, hit.x, hit.y, time - hit.time)
      }
    },
    onComplete: () => {
      back.destroy()
      front.destroy()
    }
  })
  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
