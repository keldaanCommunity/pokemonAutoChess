import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { isBoardCell } from "./helpers"

const LEAD_IN = 100
const FLIGHT = 210
const IMPACT = LEAD_IN + FLIGHT
const DURATION = 850
const EFFECT_SCALE = 1.3
const { Clamp, Linear } = Phaser.Math

function drawBurst(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number,
  scale: number
) {
  if (elapsed < 0 || elapsed >= 480) return
  const flash = Clamp(elapsed / 150, 0, 1)
  const fade = Clamp(1 - elapsed / 480, 0, 1)
  const radius = (8 + 27 * flash) * scale

  g.fillStyle(0x41205d, 0.75 * fade)
  g.fillCircle(x, y, radius * 0.8)
  for (let i = 0; i < 9; i++) {
    const angle = (i * Math.PI * 2) / 9 + 0.15
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const length = radius * (i % 2 === 0 ? 1.4 : 0.9)
    const width = 4 * scale * fade
    g.fillStyle(i % 3 === 0 ? 0xe04468 : 0x9050ae, 0.95 * fade)
    g.fillTriangle(
      x + cos * radius * 0.2 - sin * width,
      y + sin * radius * 0.2 + cos * width,
      x + cos * length,
      y + sin * length,
      x + cos * radius * 0.2 + sin * width,
      y + sin * radius * 0.2 - cos * width
    )
  }
  g.fillStyle(0xff8292, 0.8 * (1 - flash))
  g.fillCircle(x, y, 7 * scale * (1 - flash))

  for (let i = 0; i < 4; i++) {
    const p = Clamp((elapsed - 60 - i * 35) / 360, 0, 1)
    if (p <= 0 || p >= 1) continue
    const side = i % 2 === 0 ? -1 : 1
    g.fillStyle(i % 2 === 0 ? 0x70438d : 0xa43a60, 0.7 * (1 - p))
    g.fillEllipse(
      x + side * (12 + p * 19) * scale,
      y + (i - 1.5) * 7 * scale - p * 12 * scale,
      (12 + p * 9) * scale,
      (5 + p * 4) * scale
    )
  }
}

export const nightDazeAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0,
  data
}) => {
  if (!isBoardCell(positionX, positionY) || !isBoardCell(targetX, targetY)) {
    return
  }

  const [startX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [endX, targetYScreen] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const startY = casterY - 8
  const endY = targetYScreen - 8
  const angle = Math.atan2(endY - startY, endX - startX)
  const impacts: { x: number; y: number; primary: boolean }[] = []
  const payload: unknown = data?.targets
  if (Array.isArray(payload)) {
    for (const cell of payload.slice(0, 9)) {
      if (cell && isBoardCell(cell.x, cell.y)) {
        const [x, y] = transformEntityCoordinates(cell.x, cell.y, flip)
        impacts.push({
          x,
          y: y - 8,
          primary: cell.x === targetX && cell.y === targetY
        })
      }
    }
  }

  const effect = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!effect.active) return
      const time = counter.getValue() ?? 0
      effect.clear()
      const charge = Clamp(time / LEAD_IN, 0, 1)
      if (time < LEAD_IN) {
        effect.fillStyle(0x70408c, 0.8 * Math.sin(Math.PI * charge))
        effect.fillCircle(startX, startY, (8 + charge * 14) * EFFECT_SCALE)
      }
      if (time >= LEAD_IN && time < IMPACT) {
        const travel = (time - LEAD_IN) / FLIGHT
        for (let i = 4; i >= 0; i--) {
          const p = Math.max(0, travel - i * 0.065)
          const x = Linear(startX, endX, p)
          const y = Linear(startY, endY, p)
          const radius = (13 - i * 1.6) * EFFECT_SCALE
          effect.fillStyle(i === 0 ? 0x3c1b50 : 0x79408e, 0.9 - i * 0.1)
          effect.fillCircle(x, y, radius)
        }
        const x = Linear(startX, endX, travel)
        const y = Linear(startY, endY, travel)
        effect.lineStyle(3 * EFFECT_SCALE, 0xf05a78, 0.95)
        effect.lineBetween(
          x - Math.cos(angle) * 10 * EFFECT_SCALE,
          y - Math.sin(angle) * 10 * EFFECT_SCALE,
          x + Math.cos(angle) * 9 * EFFECT_SCALE,
          y + Math.sin(angle) * 9 * EFFECT_SCALE
        )
      }
      for (const { x, y, primary } of impacts) {
        drawBurst(
          effect,
          x,
          y,
          time - IMPACT - (primary ? 0 : 50),
          (primary ? 1 : 0.7) * EFFECT_SCALE
        )
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
