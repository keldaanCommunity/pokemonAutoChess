import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 1200
const clamp = (value: number) => Math.max(0, Math.min(1, value))

function drawSparkle(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number
) {
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(
    [
      new Phaser.Math.Vector2(x, y - size),
      new Phaser.Math.Vector2(x + size * 0.3, y),
      new Phaser.Math.Vector2(x, y + size),
      new Phaser.Math.Vector2(x - size * 0.3, y)
    ],
    true
  )
}

function drawRewindingClock(
  graphics: Phaser.GameObjects.Graphics,
  time: number,
  alpha: number,
  scale: number
) {
  const x = 0
  const y = -73
  const radius = 23 * scale
  graphics.fillStyle(0x165b55, alpha * 0.65)
  graphics.fillCircle(x, y, radius)
  graphics.lineStyle(2.5 * scale, 0x9bf4d1, alpha)
  graphics.strokeCircle(x, y, radius)
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2
    const inner = radius - (i % 3 === 0 ? 5 : 3) * scale
    graphics.lineStyle((i % 3 === 0 ? 2 : 1) * scale, 0xd4fff1, alpha)
    graphics.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner,
      x + Math.cos(angle) * (radius - 2 * scale),
      y + Math.sin(angle) * (radius - 2 * scale)
    )
  }
  for (const [length, speed, offset] of [
    [15, 0.009, -Math.PI / 2],
    [9, 0.003, 0]
  ]) {
    const angle = offset - time * speed
    graphics.lineStyle(2 * scale, 0xf0fffa, alpha)
    graphics.lineBetween(
      x,
      y,
      x + Math.cos(angle) * length * scale,
      y + Math.sin(angle) * length * scale
    )
  }
  graphics.fillStyle(0xffffff, alpha)
  graphics.fillCircle(x, y, 2 * scale)
}

function recoveryCue(
  scene: AbilityAnimationArgs["scene"],
  x: number,
  y: number,
  delay: number,
  caster: boolean
) {
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics({ x, y }).setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: DURATION,
    delay,
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const t = counter.progress * DURATION
      const fade = clamp((DURATION - t) / 300)
      back.clear()
      front.clear()

      const glow = clamp(t / 250) * clamp((950 - t) / 400)
      back.fillStyle(0x71e6ad, glow * (caster ? 0.65 : 0.35))
      back.fillEllipse(0, -22, caster ? 74 : 46, caster ? 84 : 64)
      back.fillStyle(0xb9ffe2, glow * (caster ? 0.45 : 0.22))
      back.fillEllipse(0, -23, caster ? 44 : 28, caster ? 62 : 48)

      for (let i = 0; i < 2; i++) {
        const progress = clamp((t - i * 180) / 650)
        const alpha = clamp((t - i * 180) / 120) * (1 - progress) * fade
        if (alpha <= 0) continue
        back.lineStyle(
          (caster ? 5 : 3) - progress,
          i === 0 ? 0x9bf4d1 : 0xb9eeff,
          alpha
        )
        back.strokeEllipse(
          0,
          7 - progress * 12,
          18 + progress * 55,
          7 + progress * 21
        )
      }

      const clockAlpha = clamp(t / 180) * clamp((1050 - t) / 250)
      drawRewindingClock(back, t, clockAlpha, caster ? 1 : 0.65)

      if (caster) {
        const gather = clamp(t / 750)
        const alpha = clamp(t / 130) * clamp((850 - t) / 260)
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8 - t * 0.006
          const radius = 45 - gather * 29
          const mx = Math.cos(angle) * radius
          const my = -22 + Math.sin(angle) * radius * 0.58
          const layer = Math.sin(angle) > 0 ? front : back
          drawSparkle(layer, mx, my, 6, i % 2 ? 0xc3f7ff : 0x9bf3bb, alpha)
        }
      }

      for (let i = 0; i < 5; i++) {
        const progress = clamp((t - 260 - i * 80) / 620)
        const alpha = clamp((t - 260 - i * 80) / 100) * (1 - progress) * fade
        if (alpha <= 0) continue
        const sx = Math.sin(i * 2.4) * 23
        drawSparkle(
          front,
          sx,
          -2 - progress * 48,
          caster ? 5.5 : 3.5,
          0xd4ffe5,
          alpha
        )
      }
    },
    onComplete: () => {
      if (back.active) back.destroy()
      if (front.active) front.destroy()
    }
  })
  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const timeTravelAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  recoveryCue(scene, x, y, baseDelay, true)

  if (!Array.isArray(data?.allies)) return
  const seen = new Set<number>()
  for (const cell of data.allies) {
    if (
      !Number.isInteger(cell?.x) ||
      !Number.isInteger(cell?.y) ||
      cell.x < 0 ||
      cell.x >= BOARD_WIDTH ||
      cell.y < 0 ||
      cell.y >= BOARD_HEIGHT ||
      (cell.x === positionX && cell.y === positionY)
    ) {
      continue
    }
    const key = cell.y * BOARD_WIDTH + cell.x
    if (seen.has(key)) continue
    seen.add(key)
    const [allyX, allyY] = transformEntityCoordinates(cell.x, cell.y, flip)
    const stagger = Math.min(
      140,
      distanceE(positionX, positionY, cell.x, cell.y) * 25
    )
    recoveryCue(scene, allyX, allyY, baseDelay + 180 + stagger, false)
  }
}
