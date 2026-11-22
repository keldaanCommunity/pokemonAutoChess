import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const TRAVEL = 200
const DURATION = 700
const EFFECT_SCALE = 1.3
const { Clamp, Linear } = Phaser.Math

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

function drawHorn(
  graphics: GameObjects.Graphics,
  time: number,
  length: number
) {
  const width = 29 * 1.2
  graphics.clear()

  for (let i = 0; i < 5; i++) {
    const offset = (i - 2) * 9
    const streak = 18 + ((time * 0.12 + i * 13) % 25)
    graphics.fillStyle(i % 2 === 0 ? 0xf6e9c2 : 0xe9933b, 0.55)
    graphics.fillTriangle(
      -length + 8,
      offset,
      -length - streak,
      offset + (i - 2) * 3,
      -length + 3,
      offset + 2
    )
  }

  graphics.fillStyle(0x454947, 0.98)
  graphics.fillTriangle(0, 0, -length, -width, -length, width)
  graphics.fillStyle(0xa6aaa6, 1)
  graphics.fillTriangle(0, 0, -length, -width, -length, 0)
  graphics.fillStyle(0x727975, 1)
  graphics.fillTriangle(0, 0, -length, 0, -length, width)

  // Bands follow the cone's surface; their changing phase conveys axial rotation.
  for (let band = 0; band < 3; band++) {
    const points: Phaser.Math.Vector2[] = []
    for (const side of [-1, 1]) {
      for (let step = 0; step <= 24; step++) {
        const t = side === -1 ? step / 24 : 1 - step / 24
        const radius = width * t
        const phase =
          t * Math.PI * 3.2 - time * 0.027 + (band * (Math.PI * 2)) / 3
        const center = Math.sin(phase) * radius * 0.68
        const thickness = radius * 0.24
        points.push(
          new Phaser.Math.Vector2(
            -length * t,
            Clamp(center + side * thickness, -radius, radius)
          )
        )
      }
    }
    graphics.fillStyle(
      band === 1 ? 0xf8faf2 : 0x343d3a,
      band === 1 ? 0.88 : 0.66
    )
    graphics.fillPoints(points, true)
  }

  graphics.lineStyle(2.4, 0xf5f5e8, 0.8)
  graphics.lineBetween(0, 0, -length, -width)
}

function drawImpact(
  graphics: GameObjects.Graphics,
  progress: number,
  index: number
) {
  const fade = 1 - Clamp((progress - 0.55) / 0.45, 0, 1)
  const spread = 1 - (1 - progress) ** 2

  for (let i = 0; i < 9; i++) {
    const angle = (i * Math.PI * 2) / 9 + index * 0.3
    const distance = (12 + (i % 3) * 7) * spread
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    graphics.fillStyle(0xa58d71, fade * 0.34)
    graphics.fillCircle(x, y, 7 + progress * 9)
  }

  for (let i = 0; i < 18; i++) {
    const angle = (i * Math.PI * 2) / 18 + index * 0.37
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const distance = (32 + ((i * 11 + index * 7) % 29)) * spread
    const x = dx * distance
    const y = dy * distance
    const size = (i % 3 === 0 ? 9 : 6.5) * (1 - progress * 0.25)
    graphics.fillStyle(i % 2 === 0 ? 0x645749 : 0x85745e, fade)
    graphics.fillTriangle(
      x - dx * size + dy * size * 0.4,
      y - dy * size - dx * size * 0.4,
      x + dx * size * 0.4 + dy * size,
      y + dy * size * 0.4 - dx * size,
      x + dx * size - dy * size * 0.65,
      y + dy * size + dx * size * 0.65
    )
    graphics.fillStyle(0xc3ac8b, fade * 0.85)
    graphics.fillTriangle(
      x - dx * size + dy * size * 0.4,
      y - dy * size - dx * size * 0.4,
      x + dx * size * 0.4 + dy * size,
      y + dy * size * 0.4 - dx * size,
      x,
      y
    )
  }

  const flash = (1 - Clamp(progress / 0.5, 0, 1)) * 0.95
  graphics.fillStyle(0xffbf57, flash)
  graphics.fillTriangle(-27, -6, 25, 0, -27, 6)
  graphics.fillTriangle(-5, -25, 5, 0, -5, 25)
  graphics.fillStyle(0xffedb5, flash)
  graphics.fillCircle(0, 0, 6)
}

export const hornDrillAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  if (
    !isBoardCell(positionX, positionY) ||
    !isBoardCell(targetX, targetY) ||
    (positionX === targetX && positionY === targetY)
  ) {
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
  const startY = casterY - 12
  const endY = targetYScreen - 12
  const angle = Math.atan2(endY - startY, endX - startX)

  const effect = scene.add.container(0, 0).setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)
  const horn = scene.add.graphics().setRotation(angle).setScale(EFFECT_SCALE)
  const impact = scene.add
    .graphics()
    .setPosition(endX, endY)
    .setRotation(angle)
    .setScale(EFFECT_SCALE)
  effect.add([horn, impact])

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay,
    onUpdate: (counter) => {
      if (!effect.active) return
      const time = counter.getValue() ?? 0
      const travel = Clamp(time / TRAVEL, 0, 1)
      const fade = 1 - Clamp((time - 540) / 160, 0, 1)
      horn
        .setPosition(Linear(startX, endX, travel), Linear(startY, endY, travel))
        .setRotation(angle + Math.sin((time * Math.PI * 2) / 180) * 0.1)
        .setAlpha(fade * Clamp(time / 40, 0, 1))
      drawHorn(horn, time, Linear(45, 105, travel) * 1.2)

      impact.clear()
      for (let i = 0; i < 3; i++) {
        const elapsed = time - TRAVEL - i * 110
        if (elapsed >= 0 && elapsed < 145) {
          drawImpact(impact, elapsed / 145, i)
        }
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
