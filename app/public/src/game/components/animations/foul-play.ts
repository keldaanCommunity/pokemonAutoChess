import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CHARGE_DURATION = 150
const FLIGHT_DURATION = 270
const IMPACT_DURATION = 340
const TOTAL_DURATION = CHARGE_DURATION + FLIGHT_DURATION + IMPACT_DURATION
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)
const impactDebris = [
  { angle: -2.35, delay: 0.02, travel: 0.62, size: 6.5, color: 0xff5bd7 },
  { angle: -1.42, delay: 0.08, travel: 0.82, size: 5.8, color: 0xffb3ee },
  { angle: -0.28, delay: 0.05, travel: 0.7, size: 7.2, color: 0xc13cff },
  { angle: 0.62, delay: 0.11, travel: 0.86, size: 5.6, color: 0xf000bc },
  { angle: 1.83, delay: 0.14, travel: 0.64, size: 6.8, color: 0xff8ce6 },
  { angle: 2.92, delay: 0.01, travel: 0.78, size: 5.4, color: 0x9a3cff }
]

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

function drawCharge(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number
) {
  const fade = Math.sin(Math.PI * progress)
  const rotation = progress * Math.PI * 0.35
  const radius = 8 + progress * 18

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12 + rotation
    const inner = 4
    const outer = radius + (i % 3) * 3
    const halfWidth = 2.5 + (i % 2)
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    graphics.fillStyle(i % 3 === 0 ? 0xffc7fa : 0xff27bb, fade * 0.95)
    graphics.fillTriangle(
      x + cos * inner - sin * halfWidth,
      y + sin * inner + cos * halfWidth,
      x + cos * outer,
      y + sin * outer,
      x + cos * inner + sin * halfWidth,
      y + sin * inner - cos * halfWidth
    )
  }

  graphics.fillStyle(0x190b20, fade * 0.95)
  graphics.fillPoints(
    [
      new Phaser.Math.Vector2(x, y - 6),
      new Phaser.Math.Vector2(x + 5, y),
      new Phaser.Math.Vector2(x, y + 6),
      new Phaser.Math.Vector2(x - 5, y)
    ],
    true
  )
  graphics.fillStyle(0xff4bc9, fade)
  graphics.fillCircle(x, y, 2.5)
}

function drawProjectile(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  fade: number,
  phase: number
) {
  const scale = 0.9
  const forwardX = Math.cos(angle)
  const forwardY = Math.sin(angle)
  const sideX = -forwardY
  const sideY = forwardX
  const point = (forward: number, side: number) =>
    new Phaser.Math.Vector2(
      x + forwardX * forward * 1.45 * scale + sideX * side * 1.45 * scale,
      y + forwardY * forward * 1.45 * scale + sideY * side * 1.45 * scale
    )
  const polygon = (vertices: [number, number][]) =>
    vertices.map(([forward, side]) => point(forward, side))
  const silhouette = polygon([
    [-28, -5],
    [-19, -17],
    [-10, -13],
    [-2, -20],
    [6, -12],
    [21, -9],
    [30, 0],
    [18, 8],
    [10, 16],
    [1, 12],
    [-8, 18],
    [-17, 11],
    [-28, 5]
  ])
  graphics.fillStyle(0x100b1f, 0.96 * fade)
  graphics.fillPoints(silhouette, true)
  graphics.lineStyle(2 * scale, 0x56217e, 0.95 * fade)
  graphics.strokePoints(silhouette, true)

  graphics.fillStyle(0x4b075a, 0.96 * fade)
  graphics.fillPoints(
    polygon([
      [-19, -5],
      [-9, -11],
      [8, -8],
      [24, 0],
      [9, 7],
      [-9, 10]
    ]),
    true
  )
  graphics.fillStyle(0xf000bc, 0.95 * fade)
  graphics.fillPoints(
    polygon([
      [-13, -2],
      [-5, -6],
      [10, -4],
      [21, 0],
      [8, 4],
      [-5, 6]
    ]),
    true
  )
  graphics.lineStyle(4 * scale, 0xff00c8, 0.9 * fade)
  graphics.lineBetween(
    point(-15, 0).x,
    point(-15, 0).y,
    point(17, 0).x,
    point(17, 0).y
  )
  graphics.lineStyle(1.5 * scale, 0xffd5f8, 0.9 * fade)
  graphics.lineBetween(
    point(-9, 0).x,
    point(-9, 0).y,
    point(14, 0).x,
    point(14, 0).y
  )

  for (let i = 0; i < 2; i++) {
    const orbit: Phaser.Math.Vector2[] = []
    const rotation = phase * 0.08 + i * Math.PI
    for (let step = 0; step <= 10; step++) {
      const theta = rotation + (step / 10) * Math.PI * 1.15
      orbit.push(point(Math.cos(theta) * 9, Math.sin(theta) * (10 + i * 2)))
    }
    graphics.lineStyle(2 * scale, i === 0 ? 0xff16c8 : 0x9a29ff, 0.82 * fade)
    graphics.strokePoints(orbit, false)
  }
}

function drawImpact(
  shadow: GameObjects.Graphics,
  foreground: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number
) {
  const expansion = clamp(progress / 0.22)
  const fade = clamp(1 - progress / 0.88)
  const radius = 5 + expansion * 29
  const impactScale = radius / 68
  const shadowFade = fade * 0.58
  shadow.fillStyle(0x100916, 0.78 * shadowFade)
  shadow.fillEllipse(x - radius * 0.08, y, radius * 2.15, radius * 1.28)
  shadow.fillEllipse(
    x - radius * 0.34,
    y + radius * 0.06,
    radius * 1.04,
    radius * 1.12
  )
  shadow.fillEllipse(
    x + radius * 0.32,
    y - radius * 0.08,
    radius * 1.16,
    radius * 1.18
  )

  const shards: [number, number, number, number, number, number][] = [
    [-0.35, -0.3, -0.15, -1.2, 0.06, -0.4],
    [0.3, -0.2, 1.15, -0.75, 0.45, 0.05],
    [0.25, 0.25, 0.6, 1.05, -0.05, 0.45],
    [-0.4, 0.15, -1.1, 0.28, -0.45, -0.08]
  ]
  shadow.fillStyle(0x130918, 0.96 * shadowFade)
  for (const [ax, ay, bx, by, cx, cy] of shards) {
    shadow.fillTriangle(
      x + ax * radius,
      y + ay * radius,
      x + bx * radius,
      y + by * radius,
      x + cx * radius,
      y + cy * radius
    )
  }

  shadow.fillStyle(0x9b006d, 0.9 * shadowFade)
  shadow.fillEllipse(x - radius * 0.08, y, radius * 2, radius * 1.3)
  shadow.fillStyle(0xe500b2, 0.94 * shadowFade)
  shadow.fillEllipse(
    x - radius * 0.2,
    y + radius * 0.02,
    radius * 1.6,
    radius * 1.04
  )
  shadow.fillEllipse(
    x + radius * 0.16,
    y - radius * 0.07,
    radius * 0.96,
    radius * 1.08
  )
  shadow.fillStyle(0xff4bd5, 0.84 * shadowFade)
  shadow.fillEllipse(
    x - radius * 0.28,
    y - radius * 0.04,
    radius * 0.62,
    radius * 0.72
  )
  shadow.fillStyle(0xffd8f8, 0.76 * shadowFade * (1 - clamp(progress / 0.42)))
  shadow.fillEllipse(
    x - radius * 0.16,
    y - radius * 0.04,
    radius * 0.2,
    radius * 0.34
  )

  foreground.fillStyle(0xef00b7, 0.28 * fade)
  foreground.fillEllipse(
    x - radius * 0.55,
    y - radius * 0.08,
    radius * 0.56,
    radius * 0.34
  )

  const streaks: [number, number, number, number, number][] = [
    [-0.55, -0.3, -1.35, -0.6, 2],
    [0.5, -0.35, 1.2, -1.1, 1.5],
    [0.55, 0.18, 1.4, 0.32, 2.1],
    [-0.15, 0.5, 0.1, 1.3, 1.3]
  ]
  for (const [sx, sy, ex, ey, width] of streaks) {
    foreground.lineStyle(width * impactScale, 0xff0fca, 0.92 * fade)
    foreground.lineBetween(
      x + sx * radius,
      y + sy * radius,
      x + ex * radius,
      y + ey * radius
    )
  }

  const flares: [number, number, number, number][] = [
    [-0.42, -0.2, 8, 4],
    [0.12, 0.2, 7, 5],
    [0.4, -0.24, 9, 4]
  ]
  for (const [px, py, width, height] of flares) {
    foreground.fillStyle(0xffb8ee, 0.82 * fade)
    foreground.fillEllipse(
      x + px * radius,
      y + py * radius,
      width * impactScale * fade,
      height * impactScale * fade
    )
  }

  for (let i = 0; i < impactDebris.length; i++) {
    const debris = impactDebris[i]
    const travelProgress = clamp((progress - debris.delay) / 0.62)
    if (travelProgress <= 0 || travelProgress >= 1) continue

    const directionX = Math.cos(debris.angle)
    const directionY = Math.sin(debris.angle)
    const normalX = -directionY
    const normalY = directionX
    const distance = radius * (0.5 + travelProgress * debris.travel)
    const curve =
      Math.sin(Math.PI * travelProgress) *
      radius *
      0.08 *
      (i % 2 === 0 ? -1 : 1)
    const px = x + directionX * distance + normalX * curve
    const py = y + directionY * distance + normalY * curve
    const alpha =
      clamp((progress - debris.delay) / 0.08) * clamp((0.82 - progress) / 0.22)
    const size = debris.size
    const tipX = px + directionX * size * 0.8
    const tipY = py + directionY * size * 0.8
    const tailX = px - directionX * size
    const tailY = py - directionY * size

    foreground.lineStyle(1.2, debris.color, alpha * 0.72)
    foreground.lineBetween(
      px - directionX * size * 2,
      py - directionY * size * 2,
      px,
      py
    )
    foreground.fillStyle(debris.color, alpha)
    foreground.fillPoints(
      [
        new Phaser.Math.Vector2(
          tailX + normalX * size * 0.28,
          tailY + normalY * size * 0.28
        ),
        new Phaser.Math.Vector2(tipX, tipY),
        new Phaser.Math.Vector2(
          px - directionX * size * 0.24 - normalX * size * 0.38,
          py - directionY * size * 0.24 - normalY * size * 0.38
        )
      ],
      true
    )
    foreground.lineStyle(1.1, 0xffe2f8, alpha * 0.96)
    foreground.lineBetween(
      px - directionX * size * 0.2,
      py - directionY * size * 0.2,
      tipX,
      tipY
    )
    foreground.fillStyle(0xffe2f8, alpha * 0.88)
    foreground.fillCircle(tipX, tipY, 1.8)
  }
}

export const foulPlayAnimation: AbilityAnimation = ({
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

  const [casterX, casterCellY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetXScreen, targetCellY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const casterY = casterCellY - 8
  const targetScreenY = targetCellY - 8
  const dx = targetXScreen - casterX
  const dy = targetScreenY - casterY
  const angle = Math.atan2(dy, dx)
  const graphics = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const impactShadow = scene.add.graphics().setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
  scene.abilitiesVfxGroup?.add(graphics)
  scene.abilitiesVfxGroup?.add(impactShadow)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!graphics.active || !impactShadow.active) return
      const time = counter.getValue() ?? 0
      graphics.clear()
      impactShadow.clear()

      if (time < CHARGE_DURATION) {
        drawCharge(graphics, casterX, casterY, time / CHARGE_DURATION)
      }

      const flightProgress = clamp((time - CHARGE_DURATION) / FLIGHT_DURATION)
      if (time >= CHARGE_DURATION && time < CHARGE_DURATION + FLIGHT_DURATION) {
        const easedProgress = Phaser.Math.Easing.Cubic.Out(flightProgress)
        const x = Phaser.Math.Linear(casterX, targetXScreen, easedProgress)
        const y = Phaser.Math.Linear(casterY, targetScreenY, easedProgress)
        drawProjectile(graphics, x, y, angle, 1, time - CHARGE_DURATION)
      }

      const impactTime = time - CHARGE_DURATION - FLIGHT_DURATION
      if (impactTime >= 0 && impactTime < IMPACT_DURATION) {
        drawImpact(
          impactShadow,
          graphics,
          targetXScreen,
          targetScreenY,
          impactTime / IMPACT_DURATION
        )
      }
    },
    onComplete: () => {
      graphics.destroy()
      impactShadow.destroy()
    }
  })

  graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  impactShadow.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
