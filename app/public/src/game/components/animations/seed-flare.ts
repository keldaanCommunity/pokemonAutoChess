import Phaser, { type GameObjects } from "phaser"
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

const DURATION = 1420
const DOME_BURST = 260
const WAVE_START = 330
const WAVE_SPACING = 42
const WAVE_TRAVEL = 650
const WAVE_COUNT = 3
const WAVE_RADIUS = 5.5
const GROUND_Y = 12

const GREEN = 0x32d84b
const LIME = 0xb9ff43
const CYAN = 0x60ffe0
const PALE_GREEN = 0xe7ffad

const { Clamp } = Phaser.Math

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

function drawArc(
  graphics: GameObjects.Graphics,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  color: number,
  alpha: number,
  width: number,
  half?: "front" | "back"
) {
  if (alpha <= 0) return
  const steps = Math.max(8, Math.ceil(Math.abs(endAngle - startAngle) * 12))
  graphics.lineStyle(width, color, alpha)
  graphics.beginPath()
  let drawing = false

  for (let step = 0; step <= steps; step++) {
    const angle = startAngle + ((endAngle - startAngle) * step) / steps
    const x = centerX + Math.cos(angle) * radiusX
    const y = centerY + Math.sin(angle) * radiusY
    const onHalf =
      half === undefined || (half === "front" ? y >= centerY : y <= centerY)

    if (!onHalf) {
      drawing = false
      continue
    }

    if (drawing) graphics.lineTo(x, y)
    else {
      graphics.moveTo(x, y)
      drawing = true
    }
  }
  graphics.strokePath()
}

function drawDome(
  graphics: GameObjects.Graphics,
  time: number,
  front: boolean
) {
  const charge = Clamp(time / DOME_BURST, 0, 1)
  const fade = Clamp((430 - time) / 170, 0, 1)
  if (fade <= 0) return

  const scale = 0.72 + charge * 0.28
  const centerY = -24
  const radiusX = 44 * scale
  const radiusY = 48 * scale
  const start = front ? 0 : Math.PI
  const end = front ? Math.PI : Math.PI * 2
  const alpha = fade * (0.48 + charge * 0.32)

  if (front) {
    graphics.fillStyle(CYAN, fade * 0.045)
    graphics.fillEllipse(0, centerY, radiusX * 1.7, radiusY * 1.7)
  }
  graphics.lineStyle(7, GREEN, alpha * 0.28)
  graphics.beginPath()
  graphics.arc(0, centerY, radiusX, start, end)
  graphics.strokePath()
  graphics.lineStyle(3, CYAN, alpha * 0.72)
  graphics.beginPath()
  graphics.arc(0, centerY, radiusX, start, end)
  graphics.strokePath()
  graphics.lineStyle(1.5, PALE_GREEN, alpha * 0.9)
  graphics.beginPath()
  graphics.arc(0, centerY, radiusX * 0.92, start, end)
  graphics.strokePath()

  for (let index = 0; index < 5; index++) {
    const angle = (index / 5) * Math.PI + (front ? 0 : Math.PI)
    const x = Math.cos(angle) * radiusX * 0.86
    const y = centerY + Math.sin(angle) * radiusY * 0.86
    graphics.lineStyle(1.5, index % 2 === 0 ? LIME : PALE_GREEN, alpha * 0.72)
    graphics.lineBetween(x * 0.7, y * 0.7, x, y)
  }
}

function drawChargeParticles(
  graphics: GameObjects.Graphics,
  time: number,
  front: boolean
) {
  const charge = Clamp(time / DOME_BURST, 0, 1)
  const fade = Clamp((DOME_BURST - time) / 100, 0, 1)
  if (charge <= 0 || fade <= 0) return

  for (let index = 0; index < 14; index++) {
    const angle = (index / 14) * Math.PI * 2 + time * 0.0015
    if (Math.sin(angle) > 0 !== front) continue
    const radius = 72 - charge * 34
    const x = Math.cos(angle) * radius
    const y = -24 + Math.sin(angle) * radius * 0.72
    const size = 4 + (index % 3) * 1.2
    const alpha = fade * (0.65 + charge * 0.3)
    graphics.lineStyle(2, index % 3 === 0 ? CYAN : LIME, alpha)
    graphics.lineBetween(
      x,
      y,
      x - Math.cos(angle) * size * 2,
      y - Math.sin(angle) * size * 1.5
    )
    graphics.fillStyle(PALE_GREEN, alpha)
    graphics.fillCircle(x, y, size * 0.45)
  }
}

function drawCasterBurst(graphics: GameObjects.Graphics, time: number) {
  const age = time - DOME_BURST
  if (age < 0 || age > 210) return
  const progress = age / 210
  const fade = Clamp(age / 25, 0, 1) * Clamp((210 - age) / 105, 0, 1)
  const centerY = -24

  graphics.fillStyle(PALE_GREEN, fade * Clamp((90 - age) / 45, 0, 1) * 0.75)
  graphics.fillCircle(0, centerY, 8 + progress * 30)

  for (let index = 0; index < 16; index++) {
    const angle = (index / 16) * Math.PI * 2 + 0.12
    const inner = 11 + progress * 8
    const outer = 44 + progress * (index % 3 === 0 ? 52 : 34)
    const width = index % 3 === 0 ? 4 : 2.5
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    graphics.fillStyle(index % 3 === 0 ? LIME : CYAN, fade * 0.82)
    graphics.fillTriangle(
      dx * inner - dy * width,
      centerY + dy * inner + dx * width,
      dx * outer,
      centerY + dy * outer,
      dx * inner + dy * width,
      centerY + dy * inner - dx * width
    )
  }
}

function drawLeaf(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  size: number,
  alpha: number
) {
  const dx = Math.cos(angle) * size
  const dy = Math.sin(angle) * size
  const nx = -dy * 0.38
  const ny = dx * 0.38
  graphics.fillStyle(LIME, alpha * 0.9)
  graphics.beginPath()
  graphics.moveTo(x - dx, y - dy)
  graphics.lineTo(x + nx, y + ny)
  graphics.lineTo(x + dx, y + dy)
  graphics.lineTo(x - nx, y - ny)
  graphics.closePath()
  graphics.fillPath()
  graphics.lineStyle(1, 0x087d4b, alpha * 0.75)
  graphics.strokePath()
  graphics.lineStyle(1, PALE_GREEN, alpha)
  graphics.lineBetween(x - dx * 0.6, y - dy * 0.6, x + dx * 0.6, y + dy * 0.6)
}

function drawWaves(
  graphics: GameObjects.Graphics,
  time: number,
  half?: "front" | "back"
) {
  for (let wave = 0; wave < WAVE_COUNT; wave++) {
    const start = WAVE_START + wave * WAVE_SPACING
    const progress = Clamp((time - start) / WAVE_TRAVEL, 0, 1)
    if (time < start || progress >= 1) continue

    const radius = WAVE_RADIUS * progress
    const rise = Clamp(progress * 5, 0, 1)
    const fade = rise * Clamp((1 - progress) * 4, 0, 1)
    const radiusX = radius * CELL_WIDTH
    const radiusY = radius * CELL_HEIGHT
    const centerY = GROUND_Y
    const phase = wave * 0.86 + progress * 0.34

    drawArc(
      graphics,
      0,
      centerY,
      radiusX,
      radiusY,
      0,
      Math.PI * 2,
      CYAN,
      fade * 0.12,
      11,
      half
    )
    drawArc(
      graphics,
      0,
      centerY,
      radiusX,
      radiusY,
      0,
      Math.PI * 2,
      GREEN,
      fade * 0.82,
      3,
      half
    )

    for (let arc = 0; arc < 6; arc++) {
      const direction = (arc / 6) * Math.PI * 2 + phase
      const span = 0.48 + (arc % 3) * 0.14
      const lift = (arc % 2 === 0 ? -1 : 1) * (4 + (arc % 3) * 2)
      const arcRadiusX = radiusX * (0.88 + (arc % 2) * 0.08)
      const arcRadiusY = radiusY * (0.88 + (arc % 3) * 0.055)
      drawArc(
        graphics,
        0,
        centerY + lift,
        arcRadiusX,
        arcRadiusY,
        direction - span,
        direction + span,
        arc % 3 === 0 ? PALE_GREEN : LIME,
        fade * (arc % 2 === 0 ? 0.86 : 0.62),
        arc % 3 === 0 ? 2.6 : 1.8,
        half
      )
    }

    for (let leaf = 0; leaf < 12; leaf++) {
      const angle = (leaf / 12) * Math.PI * 2 + phase + wave * 0.42
      const leafRadius = 0.74 + (leaf % 4) * 0.055
      const x = Math.cos(angle) * radiusX * leafRadius
      const y = centerY + Math.sin(angle) * radiusY * leafRadius
      if (half === "front" && y < centerY) continue
      if (half === "back" && y >= centerY) continue
      drawLeaf(
        graphics,
        x,
        y,
        angle + Math.PI / 3 + progress * (leaf % 2 === 0 ? 1 : -1),
        7.5 + (leaf % 2) * 1.5,
        fade * 0.9
      )
    }
  }
}

function drawTargetImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  age: number
) {
  if (age < 0 || age > 230) return
  const progress = age / 230
  const fade = Clamp(age / 25, 0, 1) * Clamp((230 - age) / 110, 0, 1)

  graphics.fillStyle(LIME, fade * Clamp((95 - age) / 55, 0, 1) * 0.8)
  graphics.fillCircle(x, y, 8 + progress * 18)
  for (let index = 0; index < 12; index++) {
    const angle = (index / 12) * Math.PI * 2 + 0.15
    const inner = 5 + progress * 5
    const outer = 22 + progress * (index % 3 === 0 ? 28 : 17)
    const width = index % 3 === 0 ? 4 : 2.5
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    graphics.fillStyle(index % 3 === 0 ? PALE_GREEN : GREEN, fade * 0.9)
    graphics.fillTriangle(
      x + dx * inner - dy * width,
      y + dy * inner + dx * width,
      x + dx * outer,
      y + dy * outer,
      x + dx * inner + dy * width,
      y + dy * inner - dx * width
    )
    graphics.lineStyle(1, PALE_GREEN, fade * 0.8)
    graphics.lineBetween(
      x + dx * (inner + 3),
      y + dy * (inner + 3),
      x + dx * (outer - 3),
      y + dy * (outer - 3)
    )
  }
}

function addLayer(
  args: AbilityAnimationArgs,
  x: number,
  y: number,
  depth: number,
  draw: (graphics: GameObjects.Graphics, time: number) => void
) {
  const { scene, delay = 0 } = args
  const graphics = scene.add.graphics({ x, y }).setDepth(depth)
  scene.abilitiesVfxGroup?.add(graphics)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!graphics.active) return
      graphics.clear()
      draw(graphics, counter.getValue() ?? 0)
    },
    onComplete: () => graphics.destroy()
  })
  graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const seedFlareAnimation: AbilityAnimation = (args) => {
  const { positionX, positionY, flip } = args
  if (!isBoardCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const targets = getImpactCells(args.data).filter((cell) => {
    const dx = cell.x - positionX
    const dy = cell.y - positionY
    return dx !== 0 || dy !== 0
      ? dx * dx + dy * dy < WAVE_RADIUS * WAVE_RADIUS
      : false
  })
  const targetImpacts = targets.map((cell) => {
    const [targetX, targetY] = transformEntityCoordinates(cell.x, cell.y, flip)
    const distance = Math.hypot(cell.x - positionX, cell.y - positionY)
    return {
      x: targetX - casterX,
      y: targetY - casterY - 20,
      time: WAVE_START + (distance / WAVE_RADIUS) * WAVE_TRAVEL
    }
  })

  addLayer(
    args,
    casterX,
    casterY,
    DEPTH.ABILITY_GROUND_LEVEL,
    (graphics, time) => {
      const firstWave = Clamp((time - WAVE_START) / WAVE_TRAVEL, 0, 1)
      const imprintAlpha =
        Clamp(time / WAVE_START, 0, 1) * Clamp((1120 - time) / 280, 0, 1)
      if (imprintAlpha > 0) {
        const radius = WAVE_RADIUS * firstWave
        drawArc(
          graphics,
          0,
          GROUND_Y,
          radius * CELL_WIDTH,
          radius * CELL_HEIGHT,
          0,
          Math.PI * 2,
          CYAN,
          imprintAlpha * 0.22,
          18
        )
        drawArc(
          graphics,
          0,
          GROUND_Y,
          radius * CELL_WIDTH,
          radius * CELL_HEIGHT,
          0,
          Math.PI * 2,
          GREEN,
          imprintAlpha * 0.52,
          5
        )
      }
      drawWaves(graphics, time)
    }
  )

  addLayer(
    args,
    casterX,
    casterY,
    DEPTH.ABILITY_BELOW_POKEMON,
    (graphics, time) => {
      drawDome(graphics, time, false)
      drawChargeParticles(graphics, time, false)
      drawWaves(graphics, time, "back")
    }
  )

  addLayer(
    args,
    casterX,
    casterY,
    DEPTH.HIT_FX_ABOVE_POKEMON,
    (graphics, time) => {
      drawDome(graphics, time, true)
      drawChargeParticles(graphics, time, true)
      drawCasterBurst(graphics, time)
      drawWaves(graphics, time, "front")
    }
  )

  addLayer(
    args,
    casterX,
    casterY,
    DEPTH.HIT_FX_ABOVE_POKEMON,
    (graphics, time) => {
      for (const impact of targetImpacts) {
        drawTargetImpact(graphics, impact.x, impact.y, time - impact.time)
      }
    }
  )
}
