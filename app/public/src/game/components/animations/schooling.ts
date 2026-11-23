import Phaser from "phaser"
import { CELL_HEIGHT, CELL_WIDTH } from "../../../../../config/game/board"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const TRAVEL_DURATION = 1140
const SCHOOL_SPREAD = 260
const IMPACT_FISH_DURATION = 240
const DURATION = 1540
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function drawFish(graphics: Phaser.GameObjects.Graphics, size: number) {
  graphics.fillStyle(0x07233c)
  graphics.fillTriangle(-8, 0, -14, -5, -12, 0)
  graphics.fillTriangle(-8, 0, -14, 5, -12, 0)
  graphics.fillTriangle(-3, -2, 0, -7, 3, -2)
  graphics.fillEllipse(0, 0, 19, 9)
  graphics.fillStyle(0x114079)
  graphics.fillEllipse(0.5, 0, 16, 6)
  graphics.fillStyle(0x5d97d7)
  graphics.fillEllipse(2, 1, 10, 3)
  graphics.fillStyle(0x23404b)
  graphics.fillTriangle(-1, 2, -5, 6, 3, 2)
  graphics.fillStyle(0x7fd3f5)
  graphics.fillRect(5, -2, 2, 2)
  graphics.setScale(size / 23)
}

export const schoolingAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  data,
  delay
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const container = scene.add.container(x, y - 22).setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(container)
  const vertical = flip ? CELL_HEIGHT : -CELL_HEIGHT
  const route = new Phaser.Curves.Spline(
    [
      [0, 0],
      [0.65, -0.4],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [0.65, 0.4],
      [0, 0]
    ].map(([px, py]) => new Phaser.Math.Vector2(px * CELL_WIDTH, py * vertical))
  )
  const points = route.getSpacedPoints(256)
  const sample = (progress: number) => {
    const index = clamp(progress) * (points.length - 1)
    const from = points[Math.min(Math.floor(index), points.length - 2)]
    const to = points[Math.min(Math.floor(index) + 1, points.length - 1)]
    const fraction = index - Math.min(Math.floor(index), points.length - 2)
    return {
      x: Phaser.Math.Linear(from.x, to.x, fraction),
      y: Phaser.Math.Linear(from.y, to.y, fraction),
      angle: Math.atan2(to.y - from.y, to.x - from.x)
    }
  }
  const fish = Array.from({ length: 112 }, (_, i) => {
    const graphic = scene.add.graphics().setVisible(false)
    container.add(graphic)
    drawFish(graphic, 10 + Math.random() * 7)
    return {
      graphic,
      delay: (i / 111) * SCHOOL_SPREAD,
      lane: (Math.random() - 0.5) * 38,
      phase: Math.random() * Math.PI * 2
    }
  })
  const impacts = getImpactCells(data)
    .filter(
      (cell) =>
        Math.abs(cell.x - positionX) <= 1 &&
        Math.abs(cell.y - positionY) <= 1 &&
        (cell.x !== positionX || cell.y !== positionY)
    )
    .map((cell) => {
      const [tx, ty] = transformEntityCoordinates(cell.x, cell.y, flip)
      const localX = tx - x
      const localY = ty - y
      let nearest = 0
      let distance = Infinity
      for (let i = 0; i < points.length; i++) {
        const d = Math.hypot(points[i].x - localX, points[i].y - localY)
        if (d < distance) {
          distance = d
          nearest = i
        }
      }
      return {
        x: localX,
        y: localY,
        time: (nearest / (points.length - 1)) * TRAVEL_DURATION + 80,
        fish: Array.from({ length: 6 }, (_, i) => {
          const graphic = scene.add.graphics().setVisible(false)
          container.add(graphic)
          drawFish(graphic, 11 + Math.random() * 3)
          const angle =
            sample(nearest / (points.length - 1)).angle +
            (i - 2.5) * 0.36 +
            (Math.random() - 0.5) * 0.15
          const distance = 28 + Math.random() * 16
          return {
            graphic,
            delay: i * 6,
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance
          }
        })
      }
    })
  const spray = scene.add.graphics()
  container.add(spray)

  const draw = (elapsed: number) => {
    if (!container.active) return
    for (const { graphic, delay: stagger, lane, phase } of fish) {
      const age = elapsed - stagger
      const progress = age / TRAVEL_DURATION
      graphic.setVisible(progress > 0 && progress < 1)
      if (progress <= 0 || progress >= 1) continue
      const point = sample(progress)
      const spread = Math.sin(Math.PI * progress) ** 0.4
      const offset = (lane + Math.sin(age / 65 + phase) * 3) * spread
      graphic
        .setPosition(
          point.x - Math.sin(point.angle) * offset,
          point.y + Math.cos(point.angle) * offset
        )
        .setRotation(point.angle + Math.sin(age / 45 + phase) * 0.12)
        .setAlpha(clamp(age / 45) * clamp((TRAVEL_DURATION - age) / 80))
    }
    spray.clear()
    for (const impact of impacts) {
      const age = elapsed - impact.time
      for (const { graphic, delay: stagger, dx, dy } of impact.fish) {
        const fishAge = age - stagger
        const progress = fishAge / IMPACT_FISH_DURATION
        graphic.setVisible(progress >= 0 && progress < 1)
        if (progress < 0 || progress >= 1) continue
        const travel = Phaser.Math.Easing.Quadratic.Out(progress)
        const speed = 2 * (1 - progress)
        graphic
          .setPosition(
            impact.x + dx * travel,
            impact.y + dy * travel - Math.sin(Math.PI * progress) * 10
          )
          .setRotation(
            Math.atan2(
              dy * speed - Math.cos(Math.PI * progress) * Math.PI * 10,
              dx * speed
            )
          )
          .setAlpha(clamp(fishAge / 15) * clamp((1 - progress) / 0.45))
      }
      if (age < 0 || age > 190) continue
      const progress = age / 190
      const alpha = clamp(age / 20) * (1 - progress)
      spray.fillStyle(0x7fd3f5, alpha * 0.85)
      spray.fillEllipse(impact.x, impact.y, 13 * (1 - progress), 20)
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2 + 0.3
        const radius = 7 + progress * (16 + (i % 3) * 5)
        spray.lineStyle(1.5, 0x8bc4ec, alpha * 0.8)
        spray.strokeCircle(
          impact.x + Math.cos(angle) * radius,
          impact.y + Math.sin(angle) * radius * 0.7,
          1.5 + (i % 2)
        )
      }
    }
    const returnProgress = clamp((elapsed - 1170) / 370)
    if (returnProgress > 0 && returnProgress < 1) {
      for (let i = 0; i < 8; i++) {
        const angle = i * 2.4
        const radius = 9 + (i % 3) * 6
        spray.lineStyle(1, 0x7fd3f5, Math.sin(Math.PI * returnProgress) * 0.55)
        spray.strokeCircle(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius - returnProgress * 15,
          1.5 + (i % 2)
        )
      }
    }
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => draw(counter.progress * DURATION),
    onComplete: () => container.destroy()
  })
  container.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
