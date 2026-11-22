import Phaser, { type GameObjects } from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { OrientationVector } from "../../../../../utils/orientation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 850
const CYAN = 0x8febf8
const LILAC = 0xb9a2f5
const INDIGO = 0x6066ab
const ICE = 0xeeffff
const ARC_COLORS = [LILAC, CYAN, 0xbaf5d9]
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)
const RIBBON_BANDS = [
  { from: 0, to: 0.34, color: LILAC, alpha: 0.48 },
  { from: 0.34, to: 0.72, color: CYAN, alpha: 0.35 },
  { from: 0.72, to: 1, color: 0x9de8e9, alpha: 0.18 }
]

function drawRibbon(
  fx: GameObjects.Graphics,
  segments: number,
  alpha: number,
  spanX: (u: number, v: number) => number,
  spanY: (u: number, v: number) => number,
  rim = 1
) {
  for (const band of RIBBON_BANDS) {
    fx.fillStyle(band.color, band.alpha * alpha)
    fx.beginPath()
    fx.moveTo(spanX(0, band.from), spanY(0, band.from))
    for (let i = 1; i <= segments; i++) {
      fx.lineTo(spanX(i / segments, band.from), spanY(i / segments, band.from))
    }
    for (let i = segments; i >= 0; i--) {
      fx.lineTo(spanX(i / segments, band.to), spanY(i / segments, band.to))
    }
    fx.closePath()
    fx.fillPath()
  }
  for (const [width, color, opacity] of [
    [4, INDIGO, 0.6],
    [2, ICE, 0.9]
  ]) {
    fx.lineStyle(width, color, alpha * opacity * rim)
    fx.beginPath()
    fx.moveTo(spanX(0, 0), spanY(0, 0))
    for (let i = 1; i <= segments; i++) {
      fx.lineTo(spanX(i / segments, 0), spanY(i / segments, 0))
    }
    fx.strokePath()
  }
}

function isBoardCell(cell: unknown): cell is { x: number; y: number } {
  if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell)) {
    return false
  }
  const { x, y } = cell
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

function drawCrystal(
  fx: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  fx.fillStyle(CYAN, alpha * 0.75)
  fx.fillTriangle(x, y - size, x - size * 0.55, y, x, y + size)
  fx.fillStyle(ICE, alpha)
  fx.fillTriangle(x, y - size, x + size * 0.55, y, x, y + size)
}

function drawSnowFlurry(
  fx: GameObjects.Graphics,
  x: number,
  y: number,
  t: number,
  strength: number
) {
  if (t <= 0 || t >= 270) return

  for (let i = 0; i < 6; i++) {
    const fall = (t - i * 18) / 170
    if (fall <= 0 || fall >= 1) continue
    const side = i % 2 === 0 ? -1 : 1
    const px = x + side * (19 + (i % 3) * 5 + fall * 7)
    const py = y - 25 + ((i * 13) % 29) + fall * (10 + (i % 3) * 4)
    const alpha = Math.sin(fall * Math.PI) * strength

    if (i < 2) {
      fx.lineStyle(2.5, INDIGO, alpha * 0.42)
      fx.strokeCircle(px, py, 2.4)
      fx.lineStyle(1.25, ICE, alpha)
      for (let arm = 0; arm < 3; arm++) {
        const angle = arm * (Math.PI / 3) + side * fall * 0.5
        const dx = Math.cos(angle) * 3.8
        const dy = Math.sin(angle) * 3.8
        fx.lineBetween(px - dx, py - dy, px + dx, py + dy)
      }
    } else {
      fx.fillStyle(i % 2 === 0 ? ICE : CYAN, alpha * 0.82)
      fx.fillCircle(px, py, 1.4 + (i % 3) * 0.35)
    }
  }
}

function drawCasterHalo(
  back: GameObjects.Graphics,
  front: GameObjects.Graphics,
  x: number,
  y: number,
  t: number
) {
  const phase = (t - 90) / 715
  const alpha = clamp(phase / 0.18) * clamp((1 - phase) / 0.6)
  if (alpha <= 0) return

  const open = Phaser.Math.Easing.Cubic.Out(clamp(phase / 0.33))
  const radius = 30 + open * 13
  const centerY = y - 25
  for (const isFront of [false, true]) {
    const fx = isFront ? front : back
    const opacity = alpha * (isFront ? 0.76 : 1)
    const angle = (u: number) => (u + (isFront ? 0 : 1)) * Math.PI
    const width = (a: number) =>
      (8 + 4 * Math.sin(a * 5 - phase * 7) + 2 * Math.cos(a * 9)) * open
    const r = (u: number, v: number) => radius - width(angle(u)) * v
    const spanX = (u: number, v: number) => x + Math.cos(angle(u)) * r(u, v)
    const spanY = (u: number, v: number) =>
      centerY + Math.sin(angle(u)) * r(u, v)

    drawRibbon(fx, 24, opacity, spanX, spanY, 0.75)
    for (let i = 1; i < 16; i++) {
      const u = (i + Math.sin(i * 6) * 0.32) / 16
      const shimmer = 0.5 + 0.5 * Math.sin(i * 2.4 - phase * 11)
      const v = 0.75 + shimmer * 0.7
      fx.lineStyle(
        1.4,
        i % 3 === 0 ? LILAC : CYAN,
        opacity * (0.18 + shimmer * 0.45)
      )
      fx.lineBetween(spanX(u, 0.12), spanY(u, 0.12), spanX(u, v), spanY(u, v))
    }
  }
}

function drawAuroraBands(
  fx: GameObjects.Graphics,
  segments: number,
  bandWidth: number,
  alpha: number,
  time: number,
  pointX: (u: number, offset: number) => number,
  pointY: (u: number, offset: number) => number
) {
  for (const [i, color] of ARC_COLORS.entries()) {
    const outer = (1.5 - i) * bandWidth
    const inner = (0.5 - i) * bandWidth
    fx.fillStyle(color, alpha * 0.82)
    fx.beginPath()
    fx.moveTo(pointX(0, outer), pointY(0, outer))
    for (let j = 1; j <= segments; j++) {
      const u = j / segments
      fx.lineTo(pointX(u, outer), pointY(u, outer))
    }
    for (let j = segments; j >= 0; j--) {
      const u = j / segments
      fx.lineTo(pointX(u, inner), pointY(u, inner))
    }
    fx.closePath()
    fx.fillPath()
  }

  for (let i = 1; i < segments; i++) {
    const u = (i + Math.sin(i * 5.3) * 0.3) / segments
    const shimmer = 0.5 + 0.5 * Math.sin(i * 2.4 - time * 0.035)
    const from = bandWidth * 1.42
    const to = from - bandWidth * (0.65 + 1.55 * shimmer)
    fx.lineStyle(1.2, i % 3 === 0 ? CYAN : ICE, alpha * shimmer * 0.44)
    fx.lineBetween(
      pointX(u, from),
      pointY(u, from),
      pointX(u, to),
      pointY(u, to)
    )
  }
}

function drawAllyArch(
  fx: GameObjects.Graphics,
  x: number,
  y: number,
  t: number,
  topEdge: number
) {
  const phase = t / 270
  const alpha = clamp(phase / 0.18) * clamp((1 - phase) / 0.6)
  if (alpha <= 0) return

  const open = Phaser.Math.Easing.Cubic.Out(clamp(phase / 0.33))
  const radius = 19 + 17 * open
  const height = Math.min(46, y - topEdge - 3) * (0.62 + 0.38 * open)
  const groundWidth = 2 * radius
  const groundHeight = groundWidth * 0.3
  fx.lineStyle(6, INDIGO, alpha * 0.42)
  fx.strokeEllipse(x, y + 7, groundWidth, groundHeight, 32)
  fx.lineStyle(2.4, CYAN, alpha * 0.92)
  fx.strokeEllipse(x, y + 7, groundWidth, groundHeight, 32)
  fx.lineStyle(1.2, LILAC, alpha * 0.7)
  fx.strokeEllipse(x, y + 7, groundWidth - 8, groundHeight - 4, 32)

  drawAuroraBands(
    fx,
    20,
    3.75,
    alpha,
    t,
    (u, offset) => x + Math.cos(Math.PI * u) * (radius + offset),
    (u, offset) => y + 7 - Math.sin(Math.PI * u) * (height + offset)
  )
  for (let i = 0; i < 4; i++) {
    const rise = clamp((phase - i * 0.06) * 1.45)
    if (rise <= 0 || rise >= 1) continue
    const side = i % 2 === 0 ? -1 : 1
    drawCrystal(
      fx,
      x + side * radius * (0.74 - (i % 3) * 0.13),
      y + 7 - rise * (height - 1),
      2.5,
      alpha * Math.sin(Math.PI * rise) * 0.82
    )
  }
  drawSnowFlurry(fx, x, y, t, 0.84)
}

export const auroraVeilAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  orientation,
  flip,
  delay,
  data
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const tail = -(OrientationVector[orientation]?.[0] ?? 0) || 1
  const [firstX, topY] = transformEntityCoordinates(
    0,
    flip ? 0 : BOARD_HEIGHT - 1,
    flip
  )
  const ribbonStartX = x + tail * 12
  const ribbonStartY = y - 25
  const allies: {
    x: number
    y: number
    launch: number
    travel: number
    offsetX: number
    offsetY: number
    bendX: number
    bendY: number
  }[] = []
  const cells: unknown = data?.allies
  if (Array.isArray(cells)) {
    const seen = new Set([positionX + positionY * BOARD_WIDTH])
    for (const cell of cells.slice(0, BOARD_WIDTH * BOARD_HEIGHT)) {
      if (!isBoardCell(cell)) continue
      const key = cell.x + cell.y * BOARD_WIDTH
      if (seen.has(key)) continue
      seen.add(key)
      const [ax, ay] = transformEntityCoordinates(cell.x, cell.y, flip)
      const distance = Math.hypot(cell.x - positionX, cell.y - positionY)
      const dx = ax - ribbonStartX
      const dy = ay - 20 - ribbonStartY
      const length = Math.hypot(dx, dy)
      const side = dx < 0 ? -1 : 1
      const offsetX = (side * dy) / length
      const offsetY = (-side * dx) / length
      const bend = Math.min(100, 34 + distance * 12)
      allies.push({
        x: ax,
        y: ay,
        launch: 175 + Math.min(30, distance * 7),
        travel: Math.min(370, 155 + distance * 36),
        offsetX,
        offsetY,
        bendX: Phaser.Math.Clamp(
          ribbonStartX + dx * 0.5 + offsetX * bend,
          firstX - CELL_WIDTH * 0.5 + 21,
          firstX + CELL_WIDTH * (BOARD_WIDTH - 0.5) - 21
        ),
        bendY: Math.max(
          topY - CELL_HEIGHT * 0.5 + 21,
          ribbonStartY + dy * 0.5 + offsetY * bend
        )
      })
    }
  }

  const fx = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const casterFront = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(fx)
  scene.abilitiesVfxGroup?.add(casterFront)

  const topEdge = topY - CELL_HEIGHT * 0.5
  const heightScale = Math.min(1, (y - topEdge - 2) / 65)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!fx.active || !casterFront.active) return
      const t = counter.getValue() ?? 0
      fx.clear()
      casterFront.clear()

      for (const ally of allies) {
        const age = t - ally.launch
        const sinceArrival = age - ally.travel
        const alpha = clamp(age / 66) * clamp((115 - sinceArrival) / 115)
        if (alpha <= 0) continue

        const head = Phaser.Math.Easing.Sine.Out(clamp(age / ally.travel))
        const trail =
          Math.max(0, head - 0.62) + clamp(sinceArrival / 115) * 0.62
        const progress = (u: number) => trail + (head - trail) * u
        const spread = (s: number) => Math.sin(Math.PI * s)
        const spanX = (u: number, offset: number) => {
          const s = progress(u)
          return (
            Phaser.Math.Interpolation.QuadraticBezier(
              s,
              ribbonStartX,
              ally.bendX,
              ally.x
            ) +
            ally.offsetX * offset * spread(s)
          )
        }
        const spanY = (u: number, offset: number) => {
          const s = progress(u)
          return (
            Phaser.Math.Interpolation.QuadraticBezier(
              s,
              ribbonStartY,
              ally.bendY,
              ally.y - 20
            ) +
            ally.offsetY * offset * spread(s)
          )
        }
        drawAuroraBands(fx, 16, 4, alpha * 0.82, age, spanX, spanY)
      }

      drawCasterHalo(fx, casterFront, x, y, t)
      drawSnowFlurry(casterFront, x, y, t - 90, 0.92)

      for (let i = 0; i < 5; i++) {
        const age = t - i * 18
        const rise = clamp(age / 270)
        const glint = clamp(age / 65) * clamp((350 - age) / 160)
        if (glint <= 0) continue
        drawCrystal(
          fx,
          x + tail * (12 + i * 5 + rise * 7),
          y - heightScale * (16 + (i % 3) * 8 + rise * 25),
          4 - (i % 3) * 0.55,
          glint
        )
      }

      for (const ally of allies) {
        drawAllyArch(fx, ally.x, ally.y, t - ally.launch - ally.travel, topEdge)
      }
    },
    onComplete: () => {
      fx.destroy()
      casterFront.destroy()
    }
  })
  fx.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
