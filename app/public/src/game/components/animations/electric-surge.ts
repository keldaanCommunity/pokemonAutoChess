import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CASTER_DURATION = 900
const ALLY_DURATION = 760
const MAX_ALLIES = 48
const GROUND_Y = 8

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function isBoardCell(cell: unknown): cell is { x: number; y: number } {
  if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell)) {
    return false
  }
  const { x, y } = cell
  return (
    typeof x === "number" &&
    Number.isInteger(x) &&
    typeof y === "number" &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function getAllies(
  data: AbilityAnimationArgs["data"],
  casterX: number,
  casterY: number
) {
  const cells: unknown = data.allies
  if (!Array.isArray(cells)) return []

  const seen = new Set<number>()
  const allies: { x: number; y: number }[] = []
  for (const cell of cells.slice(0, BOARD_WIDTH * BOARD_HEIGHT)) {
    if (!isBoardCell(cell) || (cell.x === casterX && cell.y === casterY)) {
      continue
    }
    const key = cell.y * BOARD_WIDTH + cell.x
    if (seen.has(key)) continue
    seen.add(key)
    allies.push({ x: cell.x, y: cell.y })
    if (allies.length >= MAX_ALLIES) break
  }
  return allies
}

function drawElectricArc(
  graphics: Phaser.GameObjects.Graphics,
  time: number,
  phase: number,
  alpha: number,
  size: number
) {
  const angle = phase + time * 0.003
  const points: Phaser.Math.Vector2[] = []
  for (let i = 0; i <= 4; i++) {
    const progress = i / 4
    const radius = (20 + progress * 27) * size
    const jitter =
      i === 0 || i === 4 ? 0 : Math.sin(time * 0.035 + i * 4 + phase) * 4 * size
    const theta = angle + progress * 0.24
    points.push(
      new Phaser.Math.Vector2(
        Math.cos(theta) * radius + Math.cos(theta + Math.PI / 2) * jitter,
        -16 +
          Math.sin(theta) * radius * 0.56 +
          Math.sin(theta + Math.PI / 2) * jitter * 0.56
      )
    )
  }
  graphics.lineStyle(2.5, 0xffc72b, alpha * 0.9)
  graphics.strokePoints(points, false)
  graphics.lineStyle(1, 0xfff4a3, alpha * 0.95)
  graphics.strokePoints(points, false)

  const branch = points[2]
  graphics.lineStyle(1.5, 0xffd84a, alpha * 0.8)
  graphics.lineBetween(
    branch.x,
    branch.y,
    branch.x + Math.cos(angle + 1.3) * 10 * size,
    branch.y + Math.sin(angle + 1.3) * 8 * size
  )
}

function drawCasterDischarge(
  graphics: Phaser.GameObjects.Graphics,
  time: number
) {
  const chargeDuration = 150
  const burstDuration = 220
  const charging = time < chargeDuration
  const charge = clamp(time / chargeDuration)
  const burst = clamp((time - chargeDuration) / burstDuration)
  if (burst >= 1) return

  const spread = Phaser.Math.Easing.Cubic.Out(burst)
  const radius = charging ? 59 - charge * 14 : 24 + spread * 30
  const alpha = charging ? clamp(time / 55) : (1 - burst) ** 2 * 0.9
  const aspect = charging ? 0.92 : 0.72

  for (let bolt = 0; bolt < 7; bolt++) {
    const angle = (bolt / 7) * Math.PI * 2 + 0.23
    const length = 18 * (1 + (bolt % 3) * 0.15)
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const point = (r: number, offset: number) =>
      new Phaser.Math.Vector2(
        cos * r - sin * offset,
        -35 + (sin * r + cos * offset) * aspect
      )
    const bend = bolt % 2 === 0 ? 4 : -4
    const points = [
      point(radius - length, 0),
      point(radius - length * 0.55, bend),
      point(radius - length * 0.3, -bend * 0.5),
      point(radius, 0)
    ]
    if (charging) {
      graphics.lineStyle(9, 0xffb31c, alpha * 0.25)
      graphics.strokePoints(points, false)
    }
    graphics.lineStyle(charging ? 5 : 3, 0xffc72b, alpha * 0.7)
    graphics.strokePoints(points, false)
    graphics.lineStyle(charging ? 2.4 : 1.3, 0xfff4a3, alpha)
    graphics.strokePoints(points, false)
  }
}

function drawSpark(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  graphics.lineStyle(1.5, 0xfff3a0, alpha)
  graphics.lineBetween(x - size, y, x + size, y)
  graphics.lineBetween(x, y - size, x, y + size)
  graphics.fillStyle(0xffffff, alpha * 0.85)
  graphics.fillCircle(x, y, size * 0.35)
}

function addElectricPulse(
  scene: AbilityAnimationArgs["scene"],
  x: number,
  y: number,
  delay: number,
  duration: number,
  isCaster: boolean,
  phase: number
) {
  const ground = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(1.2)
  const front = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(1.2)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay,
    onUpdate: (counter) => {
      if (!ground.active || !front.active) return
      const time = counter.progress * duration
      ground.clear()
      front.clear()

      const bloom = Phaser.Math.Easing.Sine.Out(clamp(time / 160))
      const fade = clamp((duration - time) / 230)
      const alpha = clamp(time / 90) * fade
      const breathing = 0.96 + Math.sin(time * 0.009) * 0.04
      const groundScale = (0.72 + bloom * 0.28) * breathing

      ground.fillStyle(0x986a08, alpha * 0.2)
      ground.fillEllipse(-4, GROUND_Y + 2, 60 * groundScale, 22 * groundScale)
      ground.fillStyle(0xf0b916, alpha * 0.22)
      ground.fillEllipse(2, GROUND_Y, 42 * groundScale, 16 * groundScale)
      ground.fillStyle(0xffe677, alpha * 0.18)
      ground.fillEllipse(0, GROUND_Y - 1, 22 * groundScale, 9 * groundScale)

      const ringCount = isCaster ? 2 : 1
      for (let ring = 0; ring < ringCount; ring++) {
        const progress = clamp((time - ring * 170) / (isCaster ? 590 : 510))
        if (progress <= 0 || progress >= 1) continue
        const ringAlpha = Math.sin(Math.PI * progress) * alpha
        const radius = 12 + progress * (isCaster ? 40 : 33)
        ground.lineStyle(3, 0xf2bc24, ringAlpha * 0.65)
        ground.strokeEllipse(0, GROUND_Y, radius * 2, radius * 0.62)
        ground.lineStyle(1.2, 0xfff3a0, ringAlpha * 0.8)
        ground.strokeEllipse(0, GROUND_Y, radius * 1.72, radius * 0.48)
      }

      if (isCaster) drawCasterDischarge(ground, time)

      const arcCount = isCaster ? 3 : 2
      for (let arc = 0; arc < arcCount; arc++) {
        drawElectricArc(
          ground,
          time,
          phase + (arc / arcCount) * Math.PI * 2,
          alpha * (isCaster ? 0.8 : 0.62),
          isCaster ? 1 : 0.76
        )
      }

      for (let spark = 0; spark < 5; spark++) {
        const progress = (time / 330 + spark * 0.19) % 1
        const rise = progress * 34
        const sparkAlpha =
          alpha *
          clamp(Math.sin(Math.PI * progress) * 1.2) *
          (isCaster ? 0.8 : 0.65)
        const angle = phase + (spark / 5) * Math.PI * 2
        drawSpark(
          front,
          Math.cos(angle) * (13 + progress * 7),
          -22 - rise,
          1.5 + (spark % 2) * 0.6,
          sparkAlpha
        )
      }
    },
    onComplete: () => {
      if (ground.active) ground.destroy()
      if (front.active) front.destroy()
    }
  })

  ground.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const electricSurgeAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}: AbilityAnimationArgs) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  addElectricPulse(scene, casterX, casterY, baseDelay, CASTER_DURATION, true, 0)

  getAllies(data, positionX, positionY).forEach((ally, index) => {
    const [allyX, allyY] = transformEntityCoordinates(ally.x, ally.y, flip)
    const wave = Math.min(
      160,
      distanceE(positionX, positionY, ally.x, ally.y) * 22
    )
    addElectricPulse(
      scene,
      allyX,
      allyY,
      baseDelay + 110 + wave,
      ALLY_DURATION,
      false,
      index * 0.48
    )
  })
}
