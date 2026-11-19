import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const STORED_POWER_TIMING = {
  target: 850,
  impact: 1050,
  end: 1500
} as const

const { Clamp, Linear } = Phaser.Math
const PINK = 0xf34cff
const VIOLET = 0x8c40ed
const WHITE = 0xffefff
const CYAN = 0xa2f8ff

function isCell(x: number, y: number) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function layer(
  args: AbilityAnimationArgs,
  x: number,
  y: number,
  depth: number,
  duration: number,
  draw: (g: GameObjects.Graphics, time: number) => void
) {
  const { scene, delay = 0 } = args
  const graphics = scene.add.graphics({ x, y }).setDepth(depth)
  scene.abilitiesVfxGroup?.add(graphics)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
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

function spike(
  g: GameObjects.Graphics,
  x: number,
  bottom: number,
  height: number,
  width: number,
  alpha: number
) {
  g.fillStyle(VIOLET, alpha * 0.1)
  g.fillEllipse(x, bottom - height * 0.45, width * 6, height * 1.15)
  g.fillStyle(PINK, alpha * 0.55)
  g.fillTriangle(x - width, bottom, x, bottom - height, x + width, bottom)
  g.fillStyle(WHITE, alpha)
  g.fillTriangle(
    x - width * 0.35,
    bottom,
    x,
    bottom - height,
    x + width * 0.35,
    bottom
  )
}

export const storedPowerAnimation: AbilityAnimation = (args) => {
  if (!isCell(args.positionX, args.positionY)) return
  const [x, y] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  layer(args, x, y, DEPTH.ABILITY_BELOW_POKEMON, 1100, (g, time) => {
    const charge = Clamp(time / 450, 0, 1)
    const release = Clamp((time - 650) / 450, 0, 1)
    const peak = Math.sin(Clamp((time - 450) / 200, 0, 1) * Math.PI)
    const radius = 20 + charge * 13 + release * 38
    g.fillStyle(VIOLET, (0.12 + charge * 0.13) * (1 - release))
    g.fillEllipse(0, 8, radius * 2.4, radius)
    g.fillStyle(PINK, (0.16 + peak * 0.2) * (1 - release))
    g.fillEllipse(0, 8, radius * 1.6, radius * 0.65)
    g.lineStyle(2 + peak * 2, peak > 0 ? WHITE : PINK, 0.8 * (1 - release))
    g.strokeEllipse(0, 8, radius * 2, radius * 0.8)
  })
  layer(args, x, y, DEPTH.HIT_FX_ABOVE_POKEMON, 1100, (g, time) => {
    if (time < 480) {
      for (let i = 0; i < 16; i++) {
        const p = (time / 330 + i / 16) % 1
        const angle = (i * Math.PI * 2) / 16 + 0.25
        const distance = Linear(78, 8, p)
        const length = 13 + Math.sin(p * Math.PI) * 18
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const sx = dx * distance
        const sy = -22 + dy * distance * 0.75
        const alpha = Math.sin(p * Math.PI) * Clamp(time / 90, 0, 1)
        g.fillStyle(i % 5 === 0 ? CYAN : i % 3 === 0 ? WHITE : PINK, alpha)
        g.fillTriangle(
          sx - dy * 2,
          sy + dx * 2,
          sx - dx * length,
          sy - dy * length,
          sx + dy * 2,
          sy - dx * 2
        )
      }
    }
    if (time >= 400 && time < 800) {
      const rise = Clamp((time - 400) / 110, 0, 1)
      const fade = 1 - Clamp((time - 630) / 170, 0, 1)
      spike(g, 0, 6, 148 * rise, (4 + 8 * rise) * fade, fade)
    }
    if (time >= 650) {
      const p = Clamp((time - 650) / 450, 0, 1)
      for (let i = 0; i < 22; i++) {
        const angle = i * 2.399
        const radius = 10 + p * (24 + (i % 5) * 7)
        const sx = Math.cos(angle) * radius
        const sy = -12 + Math.sin(angle) * radius * 0.4 - p * 75
        const alpha = Math.sin(Math.PI * Math.sqrt(p)) * (i % 3 === 0 ? 1 : 0.7)
        g.fillStyle(i % 4 === 0 ? CYAN : i % 3 === 0 ? WHITE : PINK, alpha)
        g.fillCircle(sx, sy, i % 3 === 0 ? 2.7 : 1.8)
      }
    }
  })
}

export const storedPowerTargetAnimation: AbilityAnimation = (args) => {
  if (!isCell(args.targetX, args.targetY)) return
  const [x, y] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  const duration = STORED_POWER_TIMING.impact - STORED_POWER_TIMING.target
  layer(args, x, y, DEPTH.HIT_FX_ABOVE_POKEMON, duration, (g, time) => {
    const p = time / duration
    const descend = Clamp((p - 0.35) / 0.65, 0, 1)
    const bottom = Linear(-82, -8, descend * descend)
    spike(g, 0, bottom, 38 + p * 25, 4 + p * 3, Clamp(p * 5, 0, 1))
  })
}

export const storedPowerHitAnimation: AbilityAnimation = (args) => {
  if (!isCell(args.targetX, args.targetY)) return
  const [x, y] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  const duration = STORED_POWER_TIMING.end - STORED_POWER_TIMING.impact
  layer(args, x, y, DEPTH.ABILITY_BELOW_POKEMON, duration, (g, time) => {
    const p = time / duration
    g.fillStyle(VIOLET, 0.22 * (1 - p))
    g.fillEllipse(0, 8, 70 + p * 50, 30 + p * 20)
    g.lineStyle(3 * (1 - p), PINK, 0.9 * (1 - p))
    g.strokeEllipse(0, 8, 32 + p * 85, 14 + p * 36)
  })
  layer(args, x, y - 10, DEPTH.HIT_FX_ABOVE_POKEMON, duration, (g, time) => {
    const p = time / duration
    const flash = 1 - Clamp(time / 160, 0, 1)
    const expansion = Phaser.Math.Easing.Cubic.Out(Clamp(time / 210, 0, 1))
    const fade = 1 - p
    spike(g, 0, 4, 115, 8 * flash, flash)
    g.fillStyle(VIOLET, 0.12 * fade)
    g.fillCircle(0, 0, 24 + expansion * 18)
    for (let i = 0; i < 11; i++) {
      const angle = (i * Math.PI * 2) / 11 - Math.PI / 2
      const dx = Math.cos(angle)
      const dy = Math.sin(angle)
      const radius = (i % 2 === 0 ? 49 : 34) * expansion
      const base = 8 * fade
      g.fillStyle(i % 3 === 0 ? PINK : WHITE, 0.95 * fade * fade)
      g.fillTriangle(
        -dy * base,
        dx * base,
        dx * radius,
        dy * radius,
        dy * base,
        -dx * base
      )
    }
    g.fillStyle(WHITE, flash * 0.95)
    g.fillEllipse(0, 0, 32 * (1 - p), 38 * (1 - p))
    for (let i = 0; i < 14; i++) {
      const angle = i * 2.399
      const radius = 12 + p * (30 + (i % 4) * 7)
      g.fillStyle(i % 4 === 0 ? CYAN : PINK, fade * fade)
      g.fillCircle(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7 - p * 16,
        2.5 * fade
      )
    }
  })
}
