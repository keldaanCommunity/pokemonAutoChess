import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CHARGE = 480
const STAGGER = 160
const TRAVEL = 160
const IMPACT = 260
const { Clamp } = Phaser.Math

function isCell(x: unknown, y: unknown): x is number {
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

function chargeOrb(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  alpha: number,
  t: number
) {
  g.fillStyle(0xffa520, alpha * 0.22).fillCircle(x, y, 16)
  g.fillStyle(0xffc72d, alpha * 0.9).fillCircle(x, y, 10)
  g.fillStyle(0xffee77, alpha).fillCircle(x - 1, y - 1, 7)
  g.fillStyle(0xffffff, alpha * 0.95).fillCircle(x - 2, y - 2, 3)
  g.lineStyle(2, 0xfff5ac, alpha * 0.9)
  g.strokeEllipse(x, y, 21 + 3 * Math.sin(t / 100), 34)
  g.lineStyle(1.5, 0xffffff, alpha * 0.9)
  g.lineBetween(x - 15, y + 5, x + 17, y - 6)
  g.lineBetween(x - 4, y - 18, x + 5, y + 17)
}

export const fickleBeamAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay = 0,
  data
}) => {
  if (!isCell(positionX, positionY)) return
  const payload: unknown = data?.beams
  if (!Array.isArray(payload)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const beams: { x: number; y: number; startX: number; startY: number }[] = []
  for (const cell of payload.slice(0, 5)) {
    if (
      !cell ||
      typeof cell !== "object" ||
      !("x" in cell && "y" in cell) ||
      typeof cell.y !== "number" ||
      !isCell(cell.x, cell.y)
    )
      continue
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, flip)
    beams.push({ x, y: y - 10, startX: 0, startY: 0 })
  }
  if (beams.length === 0) return

  for (const [i, beam] of beams.entries()) {
    const angle = -Math.PI + ((i + 1) * Math.PI) / (beams.length + 1)
    beam.startX = casterX + Math.cos(angle) * 35
    beam.startY = casterY - 24 + Math.sin(angle) * 27
  }

  const effect = scene.add.container(0, 0).setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)
  const graphics = scene.add.graphics()
  effect.add(graphics)
  const duration = CHARGE + (beams.length - 1) * STAGGER + TRAVEL + IMPACT
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!effect.active) return
      const t = counter.getValue() ?? 0
      graphics.clear()
      for (const [i, beam] of beams.entries()) {
        const shotTime = t - CHARGE - i * STAGGER
        if (shotTime < 0) {
          const alpha = Clamp((t - i * 35) / 180, 0, 1)
          chargeOrb(graphics, beam.startX, beam.startY, alpha, t)
          continue
        }

        const dx = beam.x - beam.startX
        const dy = beam.y - beam.startY
        const length = Math.hypot(dx, dy)
        if (length === 0) continue
        const ux = dx / length
        const uy = dy / length
        const progress = Clamp(shotTime / TRAVEL, 0, 1)
        const endX = beam.startX + dx * progress
        const endY = beam.startY + dy * progress
        const fade = Clamp(1 - (shotTime - TRAVEL) / 150, 0, 1)
        if (fade > 0) {
          graphics.lineStyle(16, 0xff9f1c, 0.3 * fade)
          graphics.lineBetween(beam.startX, beam.startY, endX, endY)
          graphics.lineStyle(10, 0xffd52f, 0.85 * fade)
          graphics.lineBetween(beam.startX, beam.startY, endX, endY)
          graphics.lineStyle(4, 0xfffbb3, fade)
          graphics.lineBetween(beam.startX, beam.startY, endX, endY)
          for (let ring = 0; ring < 2; ring++) {
            const along = length * progress * (0.25 + ring * 0.4)
            const centerX = beam.startX + ux * along
            const centerY = beam.startY + uy * along
            const phase = shotTime / 100 + ring
            graphics.lineStyle(2.5, 0xffc33a, 0.75 * fade)
            graphics.beginPath()
            for (let step = 0; step <= 12; step++) {
              const a = phase + (step * Math.PI * 1.65) / 12
              const x = centerX + ux * Math.cos(a) * 5 - uy * Math.sin(a) * 13
              const y = centerY + uy * Math.cos(a) * 5 + ux * Math.sin(a) * 13
              if (step === 0) graphics.moveTo(x, y)
              else graphics.lineTo(x, y)
            }
            graphics.strokePath()
          }
          for (let j = 0; j < 5; j++) {
            const along = length * progress * ((j + 0.5) / 5)
            const spread = 8 + (j % 2) * 5
            const x = beam.startX + ux * along
            const y = beam.startY + uy * along
            const side = j % 2 === 0 ? 1 : -1
            graphics.lineStyle(2, 0xffb526, 0.8 * fade)
            graphics.lineBetween(
              x - ux * 7 + uy * spread * side,
              y - uy * 7 - ux * spread * side,
              x + ux * 8 + uy * (spread + 5) * side,
              y + uy * 8 - ux * (spread + 5) * side
            )
          }
          graphics.fillStyle(0xfff47a, fade).fillCircle(endX, endY, 8)
          graphics.fillStyle(0xffffff, fade).fillCircle(endX, endY, 4)
        }

        const hit = shotTime - TRAVEL
        if (hit >= 0 && hit < IMPACT) {
          const p = hit / IMPACT
          const alpha = (1 - p) ** 2
          graphics
            .fillStyle(0xffe850, alpha)
            .fillCircle(beam.x, beam.y, 13 + p * 8)
          graphics.fillStyle(0xffffff, alpha).fillCircle(beam.x, beam.y, 7)
          for (let j = 0; j < 9; j++) {
            const angle = Math.atan2(dy, dx) + (j * Math.PI * 2) / 9
            const ax = Math.cos(angle)
            const ay = Math.sin(angle)
            const reach = 20 + (j % 3) * 6 + p * 12
            graphics.fillStyle(j % 2 ? 0xffbc28 : 0xfff6bb, alpha)
            graphics.fillTriangle(
              beam.x - ay * 3,
              beam.y + ax * 3,
              beam.x + ax * reach,
              beam.y + ay * reach,
              beam.x + ay * 3,
              beam.y - ax * 3
            )
          }
        }
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
