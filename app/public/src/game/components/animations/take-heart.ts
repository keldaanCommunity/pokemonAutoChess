import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 1120
const GATHER_END = 430
const VIOLET = 0xb88cff
const PINK = 0xff8fe4
const CYAN = 0x8feaff
const WHITE = 0xfff4ff
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function drawSpark(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number
) {
  if (alpha <= 0) return
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(
    [
      new Phaser.Math.Vector2(x, y - size),
      new Phaser.Math.Vector2(x + size * 0.24, y - size * 0.24),
      new Phaser.Math.Vector2(x + size, y),
      new Phaser.Math.Vector2(x + size * 0.24, y + size * 0.24),
      new Phaser.Math.Vector2(x, y + size),
      new Phaser.Math.Vector2(x - size * 0.24, y + size * 0.24),
      new Phaser.Math.Vector2(x - size, y),
      new Phaser.Math.Vector2(x - size * 0.24, y - size * 0.24)
    ],
    true
  )
}

function drawGathering(
  back: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  time: number
) {
  const progress = clamp(time / GATHER_END)
  const alpha = clamp(time / 100) * clamp((GATHER_END + 120 - time) / 130)
  if (alpha <= 0) return

  const squeeze = Phaser.Math.Easing.Sine.InOut(progress)
  const centerY = -26
  const radius = 30 - squeeze * 9

  back.fillStyle(VIOLET, alpha * 0.08)
  back.fillEllipse(0, centerY, 72 + squeeze * 22, 72 + squeeze * 22)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - time * 0.002
    const offsetX = Math.cos(angle) * (37 - squeeze * 9)
    const offsetY = centerY + Math.sin(angle) * (30 - squeeze * 8)
    const bubbleRadius = 13 + (i % 3) * 3
    const color = i % 2 ? PINK : VIOLET
    back.fillStyle(color, alpha * 0.11)
    back.fillCircle(offsetX, offsetY, bubbleRadius)
    back.lineStyle(2, color, alpha * 0.62)
    back.strokeCircle(offsetX, offsetY, bubbleRadius)
    back.lineStyle(1, WHITE, alpha * 0.64)
    back.strokeEllipse(
      offsetX - bubbleRadius * 0.18,
      offsetY - bubbleRadius * 0.18,
      bubbleRadius * 0.62,
      bubbleRadius * 0.4
    )
  }

  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + i * 0.17
    const inner = 38 + (i % 3) * 5
    const outer = 54 + (i % 4) * 8
    const x1 = Math.cos(angle) * inner
    const y1 = centerY + Math.sin(angle) * inner
    const x2 = Math.cos(angle) * outer
    const y2 = centerY + Math.sin(angle) * outer
    front.lineStyle(i % 4 === 0 ? 2 : 1, i % 2 ? PINK : CYAN, alpha * 0.56)
    front.lineBetween(x1, y1, x2, y2)
  }

  front.lineStyle(2.5, PINK, alpha * 0.76)
  front.strokeCircle(0, centerY, radius + 5)
  front.lineStyle(1.5, CYAN, alpha * 0.74)
  front.strokeCircle(0, centerY, radius)
  front.fillStyle(WHITE, alpha * 0.48)
  front.fillCircle(0, centerY, 4 + squeeze * 3)

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.004
    const distance = 22 + (i % 3) * 9
    drawSpark(
      front,
      Math.cos(angle) * distance,
      centerY + Math.sin(angle) * distance * 0.78,
      3 + (i % 3),
      i % 2 ? WHITE : PINK,
      alpha * (0.62 + 0.22 * Math.sin(time * 0.02 + i))
    )
  }
}

function drawArch(
  graphics: Phaser.GameObjects.Graphics,
  centerY: number,
  radiusX: number,
  radiusY: number,
  from: number,
  to: number,
  color: number,
  alpha: number,
  time: number
) {
  const segments = 28
  graphics.lineStyle(8, color, alpha * 0.16)
  graphics.beginPath()
  for (let i = 0; i <= segments; i++) {
    const angle = from + ((to - from) * i) / segments
    const pulse = 1 + Math.sin(angle * 4 + time * 0.006) * 0.025
    const x = Math.cos(angle) * radiusX * pulse
    const y = centerY + Math.sin(angle) * radiusY * pulse
    if (i === 0) graphics.moveTo(x, y)
    else graphics.lineTo(x, y)
  }
  graphics.strokePath()

  graphics.lineStyle(3, color, alpha * 0.86)
  graphics.beginPath()
  for (let i = 0; i <= segments; i++) {
    const angle = from + ((to - from) * i) / segments
    const pulse = 1 + Math.sin(angle * 4 + time * 0.006) * 0.025
    const x = Math.cos(angle) * radiusX * pulse
    const y = centerY + Math.sin(angle) * radiusY * pulse
    if (i === 0) graphics.moveTo(x, y)
    else graphics.lineTo(x, y)
  }
  graphics.strokePath()
  graphics.lineStyle(1.2, WHITE, alpha * 0.9)
  graphics.beginPath()
  for (let i = 0; i <= segments; i++) {
    const angle = from + ((to - from) * i) / segments
    const x = Math.cos(angle) * radiusX * 0.96
    const y = centerY + Math.sin(angle) * radiusY * 0.96
    if (i === 0) graphics.moveTo(x, y)
    else graphics.lineTo(x, y)
  }
  graphics.strokePath()
}

function drawRelease(
  back: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  time: number
) {
  const elapsed = time - GATHER_END
  if (elapsed < 0) return
  const progress = clamp(elapsed / 610)
  const alpha = clamp(elapsed / 70) * clamp((DURATION - time) / 240)
  if (alpha <= 0) return

  const open = Phaser.Math.Easing.Cubic.Out(progress)
  const centerY = -27
  const radiusX = 44 + open * 17
  const radiusY = 45 + open * 18

  back.fillStyle(PINK, alpha * 0.13)
  back.fillEllipse(0, 12, 72 + open * 32, 22 + open * 14)
  back.fillStyle(WHITE, alpha * 0.17)
  back.fillEllipse(0, 11, 38 + open * 19, 10 + open * 7)
  drawArch(
    back,
    centerY,
    radiusX,
    radiusY,
    Math.PI,
    Math.PI * 2,
    PINK,
    alpha,
    time
  )
  drawArch(
    back,
    centerY,
    radiusX - 11,
    radiusY - 7,
    Math.PI,
    Math.PI * 2,
    CYAN,
    alpha * 0.92,
    time + 80
  )

  drawArch(back, centerY, radiusX, radiusY, 0, Math.PI, PINK, alpha, time)
  drawArch(
    front,
    centerY,
    radiusX - 11,
    radiusY - 7,
    0,
    Math.PI,
    CYAN,
    alpha * 0.9,
    time + 80
  )

  const burst = clamp(1 - elapsed / 320)
  if (burst > 0) {
    front.fillStyle(WHITE, burst * alpha * 0.74)
    front.fillCircle(0, centerY, 5 + burst * 11)
    front.fillStyle(PINK, burst * alpha * 0.23)
    front.fillCircle(0, centerY, 17 + burst * 20)
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + i * 0.19
      const distance = 27 + (1 - burst) * (28 + (i % 4) * 7)
      const x = Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance * 0.82
      const length = 7 + (i % 4) * 3
      front.lineStyle(
        i % 5 === 0 ? 2 : 1,
        i % 2 ? PINK : CYAN,
        burst * alpha * 0.76
      )
      front.lineBetween(
        x,
        y,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      )
      if (i % 2 === 0) {
        drawSpark(
          front,
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length,
          2.5 + (i % 3),
          i % 4 ? WHITE : PINK,
          burst * alpha * 0.82
        )
      }
    }
  }
}

export const takeHeartAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.getValue() ?? 0
      back.clear()
      front.clear()
      drawGathering(back, front, time)
      drawRelease(back, front, time)
    },
    onComplete: () => {
      if (back.active) back.destroy()
      if (front.active) front.destroy()
    }
  })

  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
