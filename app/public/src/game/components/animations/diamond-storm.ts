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

const DURATION = 1350
const { Clamp, Linear } = Phaser.Math

function isBoardCell(x: unknown, y: unknown): x is number {
  return (
    typeof x === "number" &&
    typeof y === "number" &&
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function diamond(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number
) {
  const c = Math.cos(rotation)
  const s = Math.sin(rotation)
  const point = (px: number, py: number): [number, number] => [
    x + (px * c - py * s) * size,
    y + (px * s + py * c) * size
  ]
  const top = point(0, -1)
  const left = point(-0.7, -0.15)
  const bottom = point(0, 1)
  const right = point(0.7, -0.15)
  const center = point(-0.1, -0.18)
  g.fillStyle(0xd58abb, alpha * 0.8)
  g.fillTriangle(...top, ...left, ...center)
  g.fillStyle(0xffeafa, alpha)
  g.fillTriangle(...top, ...center, ...right)
  g.fillStyle(0xc9a3df, alpha * 0.86)
  g.fillTriangle(...left, ...bottom, ...center)
  g.fillStyle(0xffffff, alpha * 0.92)
  g.fillTriangle(...center, ...bottom, ...right)
  g.lineStyle(2, 0x875486, alpha * 0.8)
  g.beginPath()
  g.moveTo(...top)
  g.lineTo(...right)
  g.lineTo(...bottom)
  g.lineTo(...left)
  g.closePath()
  g.strokePath()
  g.lineStyle(1, 0xfff6ff, alpha * 0.8)
  g.strokePath()
}

function sparkle(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  g.lineStyle(3, 0x8a6ca5, alpha * 0.65)
  g.lineBetween(x - size, y, x + size, y)
  g.lineBetween(x, y - size, x, y + size)
  g.lineStyle(1.5, 0xffffff, alpha)
  g.lineBetween(x - size, y, x + size, y)
  g.lineBetween(x, y - size, x, y + size)
  g.fillStyle(0xffffff, alpha)
  g.fillCircle(x, y, 1.5)
}

function diamondImpact(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  direction: number,
  elapsed: number
) {
  const progress = Clamp(elapsed / 230, 0, 1)
  const alpha = Clamp(elapsed / 35, 0, 1) * Clamp((230 - elapsed) / 140, 0, 1)
  if (alpha <= 0) return

  for (let i = 0; i < 8; i++) {
    const angle = direction + (i * Math.PI * 2) / 8 + (i % 2) * 0.14
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const start = 3 + progress * 5
    const length = (i % 2 === 0 ? 23 : 15) + progress * 7
    const width = i % 2 === 0 ? 3.5 : 2.5
    g.fillStyle(i % 3 === 0 ? 0xb882bf : 0xe7b6e6, alpha * 0.8)
    g.fillTriangle(
      x + dx * start - dy * width,
      y + dy * start + dx * width,
      x + dx * length,
      y + dy * length,
      x + dx * start + dy * width,
      y + dy * start - dx * width
    )
    g.lineStyle(1, 0xffffff, alpha * 0.85)
    g.lineBetween(
      x + dx * (start + 2),
      y + dy * (start + 2),
      x + dx * (length - 2),
      y + dy * (length - 2)
    )
  }

  const flash = alpha * Clamp((100 - elapsed) / 65, 0, 1)
  if (flash > 0) diamond(g, x, y, 7, direction + 0.3, flash)

  for (let i = 0; i < 6; i++) {
    const angle = direction + (i * Math.PI * 2) / 6 + 0.35
    const distance = 9 + progress * (15 + (i % 3) * 4)
    diamond(
      g,
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      2.5 + (i % 2),
      angle + progress,
      alpha * 0.9
    )
  }
}

export const diamondStormAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay = 0,
  data
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [firstX, firstY] = transformEntityCoordinates(0, 0, flip)
  const [lastX, lastY] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const left = firstX - CELL_WIDTH / 2
  const right = lastX + CELL_WIDTH / 2
  const top = Math.min(firstY, lastY) - CELL_HEIGHT / 2
  const bottom = Math.max(firstY, lastY) + CELL_HEIGHT / 2
  const targets = new Set<string>()
  const payload: unknown = data?.targets
  if (Array.isArray(payload)) {
    for (const cell of payload.slice(0, 8)) {
      if (
        cell &&
        typeof cell === "object" &&
        "x" in cell &&
        "y" in cell &&
        typeof cell.y === "number" &&
        isBoardCell(cell.x, cell.y) &&
        Math.max(Math.abs(cell.x - positionX), Math.abs(cell.y - positionY)) ===
          1
      ) {
        targets.add(`${cell.x},${cell.y}`)
      }
    }
  }

  const cells: { x: number; y: number; hit: boolean; index: number }[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = positionX + dx
      const cy = positionY + dy
      if ((dx === 0 && dy === 0) || !isBoardCell(cx, cy)) continue
      const [screenX, screenY] = transformEntityCoordinates(cx, cy, flip)
      cells.push({
        x: screenX,
        y: screenY,
        hit: targets.has(`${cx},${cy}`),
        index: (dy + 1) * 3 + dx + 1
      })
    }
  }

  const back = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const t = counter.getValue() ?? 0
      back.clear()
      front.clear()

      const halo = Clamp(t / 180, 0, 1) * Clamp((750 - t) / 260, 0, 1)
      if (halo > 0) {
        for (const [g, start, end] of [
          [back, Math.PI, Math.PI * 2],
          [front, 0, Math.PI]
        ] as const) {
          g.lineStyle(7, 0x315f96, halo * 0.45)
          g.beginPath()
          g.arc(x, y - 28, 43, start, end)
          g.strokePath()
          g.lineStyle(5, 0x54d9ed, halo * 0.45)
          g.beginPath()
          g.arc(x, y - 28, 43, start, end)
          g.strokePath()
          g.lineStyle(2, 0xb7f9ff, halo * 0.8)
          g.beginPath()
          g.arc(x, y - 28, 43, start, end)
          g.strokePath()
        }
      }

      const orbitAlpha = Clamp(t / 160, 0, 1) * Clamp((730 - t) / 250, 0, 1)
      if (orbitAlpha > 0) {
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6 + t * 0.0016
          const ox = x + Math.cos(angle) * 48
          const oy = y - 28 + Math.sin(angle) * 36
          const layer = Math.sin(angle) > 0 ? front : back
          diamond(layer, ox, oy, 9 + (i % 3), angle * 0.35, orbitAlpha)
          if (i % 2 === 0) sparkle(layer, ox + 9, oy - 8, 4, orbitAlpha * 0.8)
        }
      }

      for (const cell of cells) {
        for (let i = 0; i < 3; i++) {
          const launch = 400 + i * 95 + (cell.index % 3) * 14
          const age = t - launch
          const travel = 300
          if (age <= 0 || age >= travel) continue
          const p = age / travel
          const lateral = (i - 1) * 13
          const startX = x + (cell.x - x) * 0.16 + lateral * 0.35
          const startY = y + (cell.y - y) * 0.16
          const endX = cell.x + (cell.hit ? 0 : lateral)
          const endY = cell.y - (cell.hit ? 20 : 6)
          const px = Linear(startX, endX, p)
          const py =
            Linear(startY, endY, p) - Math.sin(Math.PI * p) * (22 + i * 5)
          if (
            px < left + 6 ||
            px > right - 6 ||
            py < top + 6 ||
            py > bottom - 6
          )
            continue
          const alpha = Clamp(age / 55, 0, 1) * Clamp((travel - age) / 60, 0, 1)
          diamond(front, px, py, 5 + (i % 2), p * 2 + i, alpha)
          if (i === 1) sparkle(front, px - 7, py + 4, 3, alpha * 0.7)
        }

        if (cell.hit) {
          const impact = t - (700 + (cell.index % 3) * 14)
          if (impact >= 0 && impact < 230) {
            const direction = Math.atan2(cell.y - 20 - y, cell.x - x)
            diamondImpact(front, cell.x, cell.y - 20, direction, impact)
          }
        }
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
