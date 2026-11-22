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

const EXPANSION_DURATION = 650
const DURATION = 1100
const FLAME_COUNT = 64
const FLAME_SCALE = 0.85
const { Clamp } = Phaser.Math

export const overheatAnimation: AbilityAnimation = ({
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
  const effect = scene.add.container(0, 0).setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const graphics = scene.add.graphics()
  effect.add(graphics)
  const impact = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)
  scene.abilitiesVfxGroup?.add(impact)
  const targets = getImpactCells(data).map((cell) => {
    const [targetX, targetY] = transformEntityCoordinates(cell.x, cell.y, flip)
    const distance = Math.hypot(cell.x - positionX, cell.y - positionY)
    return {
      x: targetX,
      y: targetY,
      start: Math.min(distance / 4, 1) * EXPANSION_DURATION
    }
  })

  const flames = Array.from({ length: FLAME_COUNT }, (_, i) => ({
    angle: ((i + (Math.random() - 0.5) * 0.5) * Math.PI * 2) / FLAME_COUNT,
    height: 48 + Math.random() * 42,
    width: 19 + Math.random() * 9,
    phase: Math.random() * Math.PI * 2,
    lean: (Math.random() - 0.5) * 12
  }))

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!graphics.active || !impact.active) return
      const time = counter.getValue() ?? 0
      const progress = Clamp(time / EXPANSION_DURATION, 0, 1)
      const radius = 4 * progress
      const alpha =
        Clamp(time / 60, 0, 1) * Clamp((DURATION - time) / 400, 0, 1)
      graphics.clear()
      impact.clear()

      graphics.lineStyle(12, 0xf65a08, alpha * 0.6)
      graphics.strokeEllipse(
        x,
        y,
        radius * CELL_WIDTH * 2,
        radius * CELL_HEIGHT * 2
      )
      graphics.lineStyle(4, 0xffc72b, alpha * 0.8)
      graphics.strokeEllipse(
        x,
        y,
        radius * CELL_WIDTH * 2,
        radius * CELL_HEIGHT * 2
      )

      for (const flame of flames) {
        const fx = x + Math.cos(flame.angle) * radius * CELL_WIDTH
        const fy = y + Math.sin(flame.angle) * radius * CELL_HEIGHT
        const height =
          flame.height *
          (0.85 + 0.15 * Math.sin(time / 85 + flame.phase)) *
          FLAME_SCALE
        const width = flame.width * FLAME_SCALE
        const lean =
          (flame.lean + Math.sin(time / 105 + flame.phase) * 5) * FLAME_SCALE
        const drawFlame = (scale: number, color: number, opacity: number) => {
          const w = width * scale
          const h = height * scale
          graphics.fillStyle(color, alpha * opacity)
          graphics.fillPoints(
            [
              new Phaser.Math.Vector2(fx - w, fy),
              new Phaser.Math.Vector2(fx - w * 0.95, fy - h * 0.22),
              new Phaser.Math.Vector2(fx - w * 0.8, fy - h * 0.42),
              new Phaser.Math.Vector2(fx - w * 0.38, fy - h * 0.57),
              new Phaser.Math.Vector2(
                fx - w * 0.2 + lean * scale * 0.4,
                fy - h * 0.76
              ),
              new Phaser.Math.Vector2(fx + lean * scale, fy - h),
              new Phaser.Math.Vector2(
                fx + w * 0.18 + lean * scale * 0.4,
                fy - h * 0.68
              ),
              new Phaser.Math.Vector2(fx + w * 0.26, fy - h * 0.47),
              new Phaser.Math.Vector2(fx + w * 0.72, fy - h * 0.67),
              new Phaser.Math.Vector2(fx + w * 0.76, fy - h * 0.42),
              new Phaser.Math.Vector2(fx + w, fy - h * 0.24),
              new Phaser.Math.Vector2(fx + w * 0.8, fy)
            ],
            true
          )
        }
        drawFlame(1, 0xe94c08, 0.9)
        drawFlame(0.75, 0xff9810, 0.95)
        drawFlame(0.43, 0xffe251, 0.95)

        const emberAge = time - 400 - (flame.phase / (Math.PI * 2)) * 220
        if (emberAge > 0) {
          const emberAlpha = Clamp((400 - emberAge) / 200, 0, 1) * alpha
          graphics.fillStyle(0xffc32b, emberAlpha)
          graphics.fillCircle(
            fx + Math.sin(flame.phase * 3) * emberAge * 0.025,
            fy - height - emberAge * 0.07,
            2
          )
        }
      }

      for (const target of targets) {
        const age = time - target.start
        if (age < 0 || age >= 320) continue
        const p = age / 320
        const fade = Clamp((1 - p) / 0.65, 0, 1)
        const growth = 0.65 + 0.35 * Clamp(age / 70, 0, 1)
        for (const [offset, height, width, lean] of [
          [-13, 27, 11, -5],
          [12, 30, 11, 5],
          [0, 40, 15, 3]
        ]) {
          const fx = target.x + offset * growth
          const base = target.y + 13
          const drawFlame = (scale: number, color: number, opacity: number) => {
            const w = width * scale * growth
            const h = height * scale * growth
            const tip = lean * scale + Math.sin(age / 65 + offset) * 2
            impact.fillStyle(color, fade * opacity)
            impact.fillPoints(
              [
                new Phaser.Math.Vector2(fx - w * 0.7, base),
                new Phaser.Math.Vector2(fx - w, base - h * 0.25),
                new Phaser.Math.Vector2(fx - w * 0.65, base - h * 0.55),
                new Phaser.Math.Vector2(fx + tip, base - h),
                new Phaser.Math.Vector2(fx + w * 0.25, base - h * 0.55),
                new Phaser.Math.Vector2(fx + w * 0.8, base - h * 0.7),
                new Phaser.Math.Vector2(fx + w, base - h * 0.25),
                new Phaser.Math.Vector2(fx + w * 0.7, base)
              ],
              true
            )
          }
          drawFlame(1, 0xd94a08, 0.85)
          drawFlame(0.75, 0xff9211, 0.9)
          drawFlame(0.45, 0xffdc46, 0.95)
        }
        const flash = Clamp(1 - age / 110, 0, 1)
        impact.fillStyle(0xfff3a5, flash * 0.85)
        impact.fillCircle(target.x, target.y, 8 * growth)
        for (let i = 0; i < 4; i++) {
          const side = i % 2 === 0 ? -1 : 1
          const drift = 12 + i * 3 + age * 0.045
          impact.fillStyle(i % 2 ? 0xffc42c : 0xff7c0b, fade * 0.8)
          impact.fillCircle(
            target.x + side * drift,
            target.y - 5 - (i % 3) * 7 - age * 0.06,
            2
          )
        }
      }
    },
    onComplete: () => {
      effect.destroy()
      impact.destroy()
    }
  })

  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  impact.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
