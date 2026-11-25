import Phaser from "phaser"
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

const DURATION = 600
const WAVE_TRAVEL = 360
const WAVE_LIFETIME = 450
const WAVE_INTERVAL = 65
const { Clamp } = Phaser.Math

export const boomburstAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay = 0,
  data
}) => {
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT
  )
    return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const burstY = y - 8
  const targets = getImpactCells(data)
    .filter(
      (cell) =>
        Math.max(Math.abs(cell.x - positionX), Math.abs(cell.y - positionY)) ===
        1
    )
    .map((cell) => {
      const [targetX, targetY] = transformEntityCoordinates(
        cell.x,
        cell.y,
        flip
      )
      const dx = (targetX - x) / CELL_WIDTH
      const dy = (targetY - y) / CELL_HEIGHT
      return {
        x: targetX,
        y: targetY - 16,
        angle: Math.atan2(targetY - y, targetX - x),
        arrival: ((Math.hypot(dx, dy) - 0.2) / 1.24) * WAVE_TRAVEL
      }
    })
  const burst = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const waves = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(burst)
  scene.abilitiesVfxGroup?.add(waves)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!burst.active || !waves.active) return
      const t = counter.getValue() ?? 0
      burst.clear()
      waves.clear()

      const burstAlpha = Clamp((300 - t) / 230, 0, 1)
      const expansion = Phaser.Math.Easing.Cubic.Out(Clamp(t / 170, 0, 1))
      const inner = 0.18 + expansion * 0.1
      const outer = 0.32 + expansion * 0.4
      if (burstAlpha > 0) {
        for (let i = 0; i < 24; i++) {
          const angle = (i * Math.PI * 2) / 24
          const left = angle - 0.125
          const right = angle + 0.125
          const length = outer * (i % 3 === 0 ? 1 : 0.78)
          burst.fillStyle(
            [0xff88c2, 0xffb36e, 0xd8f89b][i % 3],
            burstAlpha * 0.65
          )
          burst.fillTriangle(
            x + Math.cos(left) * inner * CELL_WIDTH,
            burstY + Math.sin(left) * inner * CELL_HEIGHT,
            x + Math.cos(angle) * length * CELL_WIDTH,
            burstY + Math.sin(angle) * length * CELL_HEIGHT,
            x + Math.cos(right) * inner * CELL_WIDTH,
            burstY + Math.sin(right) * inner * CELL_HEIGHT
          )
        }
      }

      for (let i = 0; i < 3; i++) {
        const age = t - i * WAVE_INTERVAL
        if (age < 0 || age >= WAVE_LIFETIME) continue
        const progress = Clamp(age / WAVE_TRAVEL, 0, 1)
        const radius =
          0.2 + 1.24 * progress + 0.03 * Clamp((age - WAVE_TRAVEL) / 90, 0, 1)
        const alpha =
          Clamp(age / 40, 0, 1) * Clamp((WAVE_LIFETIME - age) / 180, 0, 1)
        waves.lineStyle(5, 0xff8dbb, alpha * 0.38)
        waves.strokeEllipse(
          x,
          y,
          radius * CELL_WIDTH * 2,
          radius * CELL_HEIGHT * 2
        )
        waves.lineStyle(1.7, i === 1 ? 0xffc478 : 0xe7ffad, alpha * 0.9)
        waves.strokeEllipse(
          x,
          y,
          radius * CELL_WIDTH * 2,
          radius * CELL_HEIGHT * 2
        )
      }

      for (const target of targets) {
        const age = t - target.arrival
        if (age < 0 || age >= 200) continue
        const progress = age / 200
        const alpha = Clamp(age / 30, 0, 1) * (1 - progress)
        const expansion = Phaser.Math.Easing.Cubic.Out(progress)
        for (let i = 0; i < 3; i++) {
          const radius = 12 + i * 6 + expansion * 12
          for (const side of [0, Math.PI]) {
            const angle = target.angle + side
            waves.lineStyle(4, 0xff8dbb, alpha * 0.55)
            waves.beginPath()
            waves.arc(target.x, target.y, radius, angle - 0.85, angle + 0.85)
            waves.strokePath()
            waves.lineStyle(1.7, i === 1 ? 0xffc478 : 0xe7ffad, alpha)
            waves.beginPath()
            waves.arc(target.x, target.y, radius, angle - 0.85, angle + 0.85)
            waves.strokePath()
          }
        }
      }
    },
    onComplete: () => {
      burst.destroy()
      waves.destroy()
    }
  })

  burst.once("destroy", () => tween.stop())
  waves.once("destroy", () => tween.stop())
}
