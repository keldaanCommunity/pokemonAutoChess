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

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function drawPolygon(
  graphics: Phaser.GameObjects.Graphics,
  points: Array<[number, number]>
) {
  graphics.beginPath()
  graphics.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i][0], points[i][1])
  }
  graphics.closePath()
  graphics.fillPath()

  graphics.beginPath()
  graphics.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i][0], points[i][1])
  }
  graphics.closePath()
  graphics.strokePath()
}

function drawSpiritCross(
  graphics: Phaser.GameObjects.Graphics,
  radius: number,
  alpha: number
) {
  const width = Math.max(5, radius * 0.13)
  const points: Array<[number, number]> = [
    [0, -radius],
    [width, -width * 0.75],
    [radius, 0],
    [width, width * 0.75],
    [0, radius],
    [-width, width * 0.75],
    [-radius, 0],
    [-width, -width * 0.75]
  ]

  graphics.fillStyle(0xe744e9, alpha * 0.9)
  graphics.lineStyle(3, 0xff9bf5, alpha)
  drawPolygon(
    graphics,
    points.map(([x, y]) => [x * 1.08, y * 1.08])
  )

  graphics.fillStyle(0x10091d, alpha)
  graphics.lineStyle(1, 0x10091d, alpha)
  drawPolygon(graphics, points)
}

function drawPetal(
  graphics: Phaser.GameObjects.Graphics,
  angle: number,
  radius: number,
  index: number,
  alpha: number
) {
  const width = radius * 0.26
  const shape: Array<[number, number]> = [
    [radius * 0.08, 0],
    [radius * 0.28, -width * 0.52],
    [radius * 0.55, -width],
    [radius * 0.83, -width * 0.62],
    [radius, 0],
    [radius * 0.83, width * 0.62],
    [radius * 0.55, width],
    [radius * 0.28, width * 0.52]
  ]
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const points: Array<[number, number]> = shape.map(([x, y]) => [
    x * cos - y * sin,
    x * sin + y * cos
  ])

  graphics.fillStyle(index % 2 === 0 ? 0xf341dc : 0x8e38ec, alpha * 0.56)
  graphics.lineStyle(2, 0xffb4fb, alpha * 0.62)
  drawPolygon(graphics, points)
}

export const spiritBreakAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay
}) => {
  const [casterScreenX, casterScreenY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const hasTarget =
    Number.isInteger(targetX) &&
    Number.isInteger(targetY) &&
    targetX >= 0 &&
    targetX < BOARD_WIDTH &&
    targetY >= 0 &&
    targetY < BOARD_HEIGHT
  const [targetScreenX, targetScreenY] = hasTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [0, 0]

  const casterAura = scene.add
    .graphics({ x: casterScreenX, y: casterScreenY })
    .setDepth(DEPTH.ABILITY_MAJOR)
    .setScale(1.2)
  const targetShadow = hasTarget
    ? scene.add
        .graphics({ x: targetScreenX, y: targetScreenY })
        .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        .setScale(0.5)
    : null
  const targetBurst = hasTarget
    ? scene.add
        .graphics({ x: targetScreenX, y: targetScreenY })
        .setDepth(DEPTH.ABILITY_MAJOR)
        .setScale(0.5)
    : null
  const visuals = [casterAura, targetShadow, targetBurst].filter(
    (visual): visual is Phaser.GameObjects.Graphics => visual !== null
  )
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const duration = hasTarget ? 1050 : 500
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay: Math.max(0, delay ?? 0),
    ease: "Linear",
    onUpdate: (counter) => {
      if (visuals.some((visual) => !visual.active)) {
        counter.stop()
        return
      }

      const progress = counter.getValue() ?? 0
      casterAura.clear()
      const auraProgress = clamp01(progress / 0.63)
      const auraAlpha = Math.sin(Math.PI * auraProgress) * 0.72
      if (auraAlpha > 0) {
        const outerRadius = CELL_WIDTH * (0.32 + auraProgress * 0.62)
        const innerRadius = outerRadius * 0.64
        casterAura.fillStyle(0xe744cf, auraAlpha * 0.16)
        casterAura.fillEllipse(0, 0, outerRadius * 1.4, outerRadius * 1.8)
        casterAura.lineStyle(2.5, 0xffb5fb, auraAlpha * 0.84)
        casterAura.strokeEllipse(0, 0, outerRadius * 1.55, outerRadius * 1.05)
        casterAura.lineStyle(1.5, 0xf04ada, auraAlpha * 0.82)
        casterAura.strokeEllipse(0, 0, innerRadius * 1.7, innerRadius * 1.18)
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + progress * Math.PI * 5
          const x = Math.cos(angle) * outerRadius * 0.7
          const y = Math.sin(angle) * outerRadius * 0.48
          casterAura.fillStyle(i % 2 === 0 ? 0xffc7fb : 0xee54dc, auraAlpha)
          casterAura.fillCircle(x, y, i % 3 === 0 ? 3.5 : 2.5)
        }
      }

      if (!targetShadow || !targetBurst) return
      targetShadow.clear()
      targetBurst.clear()

      const flashProgress = clamp01((progress - 0.24) / 0.26)
      const flashAlpha = Math.sin(Math.PI * flashProgress)
      if (flashAlpha > 0) {
        const radius = CELL_WIDTH * (0.55 + flashProgress * 0.4)
        targetBurst.fillStyle(0xff8aec, flashAlpha * 0.32)
        targetBurst.fillCircle(0, 0, radius * 0.36)
        targetBurst.lineStyle(3, 0xffedff, flashAlpha * 0.92)
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + Math.PI / 12
          const inner = radius * 0.14
          const outer = radius * (i % 3 === 0 ? 1 : 0.7)
          targetBurst.lineBetween(
            Math.cos(angle) * inner,
            Math.sin(angle) * inner,
            Math.cos(angle) * outer,
            Math.sin(angle) * outer
          )
        }
        targetBurst.fillStyle(0xffffff, flashAlpha * 0.9)
        targetBurst.fillCircle(0, 0, 5 + flashAlpha * 8)
      }

      const crossProgress = clamp01((progress - 0.39) / 0.3)
      const crossAlpha =
        Math.min(1, crossProgress * 6, (1 - crossProgress) * 3) * 0.88
      if (crossAlpha > 0) {
        targetShadow.fillStyle(0x9c2bd0, crossAlpha * 0.32)
        targetShadow.fillEllipse(
          0,
          CELL_HEIGHT * 0.16,
          CELL_WIDTH * 1.8,
          CELL_HEIGHT * 0.7
        )
        drawSpiritCross(
          targetBurst,
          CELL_WIDTH * (0.05 + crossProgress * 1.18),
          crossAlpha
        )
      }

      const bloomProgress = clamp01((progress - 0.62) / 0.38)
      const bloomAlpha = Math.min(
        1,
        bloomProgress * 5,
        (1 - bloomProgress) * 2.6
      )
      if (bloomAlpha > 0) {
        const radius = CELL_WIDTH * (0.22 + bloomProgress * 1.42)
        targetShadow.fillStyle(0xb137d8, bloomAlpha * 0.22)
        targetShadow.fillEllipse(
          0,
          CELL_HEIGHT * 0.16,
          radius * 1.8,
          CELL_HEIGHT * 0.8
        )
        for (let i = 0; i < 8; i++) {
          drawPetal(
            targetBurst,
            (i / 8) * Math.PI * 2 - Math.PI / 8,
            radius * (i % 2 === 0 ? 1 : 0.84),
            i,
            bloomAlpha
          )
        }
        targetBurst.lineStyle(2, 0xffc8ff, bloomAlpha * 0.68)
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2
          targetBurst.lineBetween(
            Math.cos(angle) * radius * 0.68,
            Math.sin(angle) * radius * 0.68,
            Math.cos(angle) * radius * 1.12,
            Math.sin(angle) * radius * 1.12
          )
        }
        targetBurst.fillStyle(0xffa4ef, bloomAlpha * 0.34)
        targetBurst.fillCircle(0, 0, radius * 0.2)
      }
    },
    onComplete: () => {
      visuals.forEach((visual) => {
        if (visual.active) visual.destroy()
      })
    }
  })

  visuals.forEach((visual) => {
    visual.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  })
}
