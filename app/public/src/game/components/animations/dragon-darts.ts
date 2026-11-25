import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const SHOT_COUNT = 3
const SHOT_INTERVAL = 150
const IMPACT_DURATION = 130
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

type DartPath = {
  startX: number
  startY: number
  endX: number
  endY: number
  dx: number
  dy: number
  travelDuration: number
}

function getDartPath(args: AbilityAnimationArgs): DartPath | null {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    !Number.isInteger(targetX) ||
    !Number.isInteger(targetY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT ||
    targetX < 0 ||
    targetX >= BOARD_WIDTH ||
    targetY < 0 ||
    targetY >= BOARD_HEIGHT ||
    (positionX === targetX && positionY === targetY)
  ) {
    return null
  }

  const [casterX, casterCellY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetScreenX, targetCellY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const casterY = casterCellY - 20
  const targetScreenY = targetCellY - 20
  const deltaX = targetScreenX - casterX
  const deltaY = targetScreenY - casterY
  const distance = Math.hypot(deltaX, deltaY)
  if (distance === 0) return null

  const dx = deltaX / distance
  const dy = deltaY / distance
  const startOffset = Math.min(28, distance * 0.2)
  return {
    startX: casterX + dx * startOffset,
    startY: casterY + dy * startOffset,
    endX: targetScreenX,
    endY: targetScreenY,
    dx,
    dy,
    travelDuration: Phaser.Math.Clamp(distance * 0.8, 170, 360)
  }
}

function drawDart(
  graphics: Phaser.GameObjects.Graphics,
  tipX: number,
  tipY: number,
  dx: number,
  dy: number,
  alpha: number
) {
  const px = -dy
  const py = dx
  const point = (back: number, side: number) =>
    new Phaser.Math.Vector2(
      tipX - dx * back + px * side,
      tipY - dy * back + py * side
    )

  graphics.lineStyle(10, 0x7d16e8, alpha * 0.28)
  graphics.lineBetween(tipX - dx * 54, tipY - dy * 54, tipX, tipY)
  graphics.lineStyle(4, 0xf02bff, alpha * 0.7)
  graphics.lineBetween(
    tipX - dx * 49,
    tipY - dy * 49,
    tipX - dx * 5,
    tipY - dy * 5
  )

  graphics.fillStyle(0x7114c9, alpha * 0.98)
  graphics.fillPoints(
    [
      point(0, 0),
      point(20, 10),
      point(18, 4),
      point(48, 3),
      point(43, 10),
      point(54, 0),
      point(43, -10),
      point(48, -3),
      point(18, -4),
      point(20, -10)
    ],
    true
  )
  graphics.fillStyle(0xeb35ff, alpha * 0.96)
  graphics.fillPoints(
    [
      point(1, 0),
      point(20, 6),
      point(45, 2),
      point(53, 0),
      point(45, -2),
      point(20, -6)
    ],
    true
  )
  graphics.lineStyle(2, 0xffc7ff, alpha * 0.95)
  graphics.lineBetween(
    tipX - dx * 47 + px * 1.5,
    tipY - dy * 47 + py * 1.5,
    tipX - dx * 5,
    tipY - dy * 5
  )
  graphics.fillStyle(0xffffff, alpha)
  graphics.fillPoints(
    [point(2, 0), point(19, 1.5), point(40, 0), point(19, -1.5)],
    true
  )
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  const progress = clamp(elapsed / IMPACT_DURATION)
  const fade = 1 - progress
  const appear = clamp(elapsed / 16)
  const radius = 8 + progress * 27

  graphics.lineStyle(4 - progress * 1.5, 0xffffff, appear * fade)
  graphics.strokeCircle(x, y, radius)
  graphics.lineStyle(8 - progress * 5, 0xd722ff, appear * fade * 0.85)
  graphics.strokeCircle(x, y, radius + 4)

  const coreAlpha = appear * (1 - clamp(elapsed / 65))
  graphics.fillStyle(0xf34cff, coreAlpha * 0.9)
  graphics.fillPoints(
    [
      new Phaser.Math.Vector2(x, y - 17),
      new Phaser.Math.Vector2(x + 5, y - 5),
      new Phaser.Math.Vector2(x + 17, y),
      new Phaser.Math.Vector2(x + 5, y + 5),
      new Phaser.Math.Vector2(x, y + 17),
      new Phaser.Math.Vector2(x - 5, y + 5),
      new Phaser.Math.Vector2(x - 17, y),
      new Phaser.Math.Vector2(x - 5, y - 5)
    ],
    true
  )
  graphics.fillStyle(0xffffff, coreAlpha)
  graphics.fillPoints(
    [
      new Phaser.Math.Vector2(x, y - 10),
      new Phaser.Math.Vector2(x + 3, y - 3),
      new Phaser.Math.Vector2(x + 10, y),
      new Phaser.Math.Vector2(x + 3, y + 3),
      new Phaser.Math.Vector2(x, y + 10),
      new Phaser.Math.Vector2(x - 3, y + 3),
      new Phaser.Math.Vector2(x - 10, y),
      new Phaser.Math.Vector2(x - 3, y - 3)
    ],
    true
  )

  const shards = 9
  for (let index = 0; index < shards; index++) {
    const angle = (index / shards) * Math.PI * 2 + 0.12
    const inner = 11 + (index % 3) * 3
    const outer = 27 + (index % 4) * 7
    const spread = 2.5 + (index % 3) * 1.4
    const directionX = Math.cos(angle)
    const directionY = Math.sin(angle)
    const perpendicularX = -directionY
    const perpendicularY = directionX
    const shardAlpha = appear * fade * (index % 2 ? 0.8 : 0.58)
    graphics.fillStyle(index % 2 ? 0xb514f5 : 0x42106f, shardAlpha)
    graphics.fillPoints(
      [
        new Phaser.Math.Vector2(
          x + directionX * inner + perpendicularX * spread,
          y + directionY * inner + perpendicularY * spread
        ),
        new Phaser.Math.Vector2(x + directionX * outer, y + directionY * outer),
        new Phaser.Math.Vector2(
          x + directionX * inner - perpendicularX * spread,
          y + directionY * inner - perpendicularY * spread
        )
      ],
      true
    )
  }
}

export const dragonDartsAnimation: AbilityAnimation = (args) => {
  const path = getDartPath(args)
  if (!path) return

  const { scene, delay = 0 } = args
  const projectile = scene.add.graphics().setDepth(DEPTH.PROJECTILE)
  const impact = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const duration =
    path.travelDuration + (SHOT_COUNT - 1) * SHOT_INTERVAL + IMPACT_DURATION
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!projectile.active || !impact.active) return
      const elapsed = counter.getValue() ?? 0
      projectile.clear()
      impact.clear()

      for (let shot = 0; shot < SHOT_COUNT; shot++) {
        const shotElapsed = elapsed - shot * SHOT_INTERVAL
        if (shotElapsed < 0) continue

        const progress = clamp(shotElapsed / path.travelDuration)
        if (progress < 1) {
          const easedProgress = Phaser.Math.Easing.Cubic.Out(progress)
          const tipX = Phaser.Math.Linear(path.startX, path.endX, easedProgress)
          const tipY = Phaser.Math.Linear(path.startY, path.endY, easedProgress)
          drawDart(projectile, tipX, tipY, path.dx, path.dy, 1)
        } else if (shotElapsed < path.travelDuration + IMPACT_DURATION) {
          drawImpact(
            impact,
            path.endX,
            path.endY,
            shotElapsed - path.travelDuration
          )
        }
      }
    },
    onComplete: () => {
      projectile.destroy()
      impact.destroy()
    }
  })

  scene.abilitiesVfxGroup?.add(projectile)
  scene.abilitiesVfxGroup?.add(impact)
  projectile.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  impact.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
