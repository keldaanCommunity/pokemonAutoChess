import Phaser, { type GameObjects } from "phaser"
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

const DURATION = 1640
const TARGET_START = 250
const TARGET_DURATION = 210
const AREA_RADIUS = 2
const FIREBALL_BURST_AT = 280
const FIREBALL_BURST_DURATION = 230
const FIREBALL_END = FIREBALL_BURST_AT + FIREBALL_BURST_DURATION
const FIREBALL_CENTER_Y_OFFSET = -CELL_HEIGHT * 0.45
const { Clamp } = Phaser.Math
const CHUNK_SHAPE = [
  [-0.74, -0.42],
  [-0.26, -1],
  [0.22, -0.7],
  [0.82, -0.52],
  [0.58, 0.04],
  [0.28, 0.84],
  [-0.42, 0.62],
  [-0.9, 0.12]
] as const
const EMBER_LAYERS = [
  { scale: 1, color: 0xff5478, alpha: 0.9, offsetX: 0, offsetY: 0 },
  { scale: 0.68, color: 0xff7a12, alpha: 1, offsetX: 0, offsetY: 0 },
  { scale: 0.36, color: 0xffe34a, alpha: 1, offsetX: 0.1, offsetY: 0.12 },
  { scale: 0.16, color: 0xfff5a6, alpha: 0.95, offsetX: 0.18, offsetY: 0.22 }
] as const

type IncandescentChunk = {
  cellX: number
  cellY: number
  landingX: number
  landingY: number
  launchAt: number
  flightDuration: number
  landingAt: number
  launchOffsetX: number
  launchOffsetY: number
  arcHeight: number
  size: number
  rotation: number
  fragments: {
    offsetX: number
    offsetY: number
    velocityX: number
    velocityY: number
    gravity: number
    size: number
    color: number
  }[]
}

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

function getRainAreaCells(centerX: number, centerY: number) {
  const radius = Math.floor(Math.abs(AREA_RADIUS)) + 0.5
  const radiusSquared = radius * radius
  const extent = Math.floor(radius)
  const cells: { x: number; y: number }[] = []

  for (
    let y = Math.max(0, centerY - extent);
    y <= Math.min(BOARD_HEIGHT - 1, centerY + extent);
    y++
  ) {
    for (
      let x = Math.max(0, centerX - extent);
      x <= Math.min(BOARD_WIDTH - 1, centerX + extent);
      x++
    ) {
      const dx = centerX - x
      const dy = centerY - y
      if ((dx !== 0 || dy !== 0) && dx * dx + dy * dy < radiusSquared) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

function drawChunkShape(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  rotation: number,
  scale: number,
  color: number,
  alpha: number,
  offsetX = 0,
  offsetY = 0
) {
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(
    CHUNK_SHAPE.map(([px, py]) => {
      const localX = px * size * scale
      const localY = py * size * scale
      return new Phaser.Math.Vector2(
        x + offsetX + localX * cos - localY * sin,
        y + offsetY + localX * sin + localY * cos
      )
    }),
    true
  )
}

function drawEmberChunk(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number
) {
  for (const layer of EMBER_LAYERS) {
    drawChunkShape(
      graphics,
      x,
      y,
      size,
      rotation,
      layer.scale,
      layer.color,
      alpha * layer.alpha,
      -size * layer.offsetX,
      -size * layer.offsetY
    )
  }
}

function drawFireball(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  rotation: number
) {
  for (let tongue = 0; tongue < 5; tongue++) {
    const angle = rotation + (tongue * Math.PI * 2) / 5
    const spread = 0.22
    graphics.fillStyle(0xff7410, alpha * 0.9)
    graphics.fillPoints(
      [
        new Phaser.Math.Vector2(
          x + Math.cos(angle - spread) * radius * 0.68,
          y + Math.sin(angle - spread) * radius * 0.68
        ),
        new Phaser.Math.Vector2(
          x + Math.cos(angle) * radius * 1.24,
          y + Math.sin(angle) * radius * 1.24
        ),
        new Phaser.Math.Vector2(
          x + Math.cos(angle + spread) * radius * 0.68,
          y + Math.sin(angle + spread) * radius * 0.68
        )
      ],
      true
    )
  }

  graphics.fillStyle(0x7837b7, alpha * 0.62)
  graphics.fillCircle(x, y, radius * 0.98)
  graphics.fillStyle(0xe94308, alpha * 0.96)
  graphics.fillCircle(x, y, radius * 0.86)
  graphics.fillStyle(0xff8510, alpha)
  graphics.fillEllipse(
    x - Math.cos(rotation) * radius * 0.08,
    y + Math.sin(rotation) * radius * 0.08,
    radius * 1.36,
    radius * 1.48
  )
  graphics.fillStyle(0xffd52f, alpha)
  graphics.fillEllipse(
    x + Math.cos(rotation) * radius * 0.1,
    y - Math.sin(rotation) * radius * 0.1,
    radius * 0.86,
    radius * 1.04
  )
  graphics.fillStyle(0xfff5a6, alpha * 0.96)
  graphics.fillCircle(
    x + Math.cos(rotation + 0.5) * radius * 0.12,
    y - Math.sin(rotation + 0.5) * radius * 0.12,
    radius * 0.3
  )
}

function drawSpark(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  color: number,
  alpha: number,
  tailLength: number,
  lineWidth: number,
  radius: number
) {
  const tailX = Math.cos(angle) * tailLength
  const tailY = Math.sin(angle) * tailLength
  graphics.lineStyle(lineWidth, color, alpha)
  graphics.lineBetween(x - tailX, y - tailY, x, y)
  graphics.fillStyle(color, alpha)
  graphics.fillCircle(x, y, radius)
}

export const searingShotAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay = 0,
  data
}) => {
  if (!isCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(front)

  const targets = getImpactCells(data).map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, flip)
    return {
      x,
      y,
      cellX: cell.x,
      cellY: cell.y,
      start: TARGET_START,
      sparks: Array.from({ length: 9 }, (_, index) => ({
        angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9,
        speed: 0.09 + Math.random() * 0.09,
        gravity: 0.00035 + Math.random() * 0.0003,
        delay: Math.random() * 30,
        size: 3.8 + Math.random() * 2,
        color: [0xffe34a, 0xff7a12, 0xff5478][index % 3]
      }))
    }
  })

  const areaCells = getRainAreaCells(positionX, positionY)
  for (let i = areaCells.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1))
    ;[areaCells[i], areaCells[swapIndex]] = [areaCells[swapIndex], areaCells[i]]
  }
  const chunks: IncandescentChunk[] = areaCells.map((cell, index) => {
    const [cellX, cellY] = transformEntityCoordinates(cell.x, cell.y, flip)
    const distance = Math.hypot(cell.x - positionX, cell.y - positionY)
    const launchAt = FIREBALL_BURST_AT + 20 + index * 14
    const flightDuration = 210 + Math.min(distance / Math.sqrt(5), 1) * 120
    const landingX = cellX + (Math.random() - 0.5) * CELL_WIDTH * 0.35
    const landingY = cellY + 14 + (Math.random() - 0.5) * CELL_HEIGHT * 0.12

    return {
      cellX: cell.x,
      cellY: cell.y,
      landingX,
      landingY,
      launchAt,
      flightDuration,
      landingAt: launchAt + flightDuration,
      launchOffsetX: (Math.random() - 0.5) * CELL_WIDTH * 0.35,
      launchOffsetY: FIREBALL_CENTER_Y_OFFSET + (Math.random() - 0.5) * 8,
      arcHeight: 34 + distance * 16 + Math.random() * 24,
      size: index % 3 === 0 ? 11 + Math.random() * 3 : 7 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      fragments: Array.from({ length: 4 }, (_, fragmentIndex) => ({
        offsetX: (Math.random() - 0.5) * CELL_WIDTH * 0.12,
        offsetY: (Math.random() - 0.5) * CELL_HEIGHT * 0.1,
        velocityX: (Math.random() - 0.5) * 0.11,
        velocityY: -0.12 - Math.random() * 0.08,
        gravity: 0.0014 + Math.random() * 0.0003,
        size: 1.5 + Math.random() * 2,
        color: [0xff5478, 0xff7a12, 0xffe34a][fragmentIndex % 3]
      }))
    }
  })
  const chunksByCell = new Map(
    chunks.map((chunk) => [chunk.cellY * BOARD_WIDTH + chunk.cellX, chunk])
  )
  for (const target of targets) {
    target.start =
      chunksByCell.get(target.cellY * BOARD_WIDTH + target.cellX)?.landingAt ??
      TARGET_START
  }

  const fireballParticles = Array.from({ length: 14 }, (_, index) => {
    const arrival = FIREBALL_BURST_AT * (0.84 + Math.random() * 0.14)
    const delay = Math.random() * Math.min(35, arrival * 0.2)
    return {
      angle: Math.random() * Math.PI * 2,
      direction: Math.random() < 0.5 ? -1 : 1,
      turns: 0.5 + Math.random() * 0.4,
      startRadius: CELL_WIDTH * (0.45 + Math.random() * 0.3),
      delay,
      arrival,
      size: 3.2 + Math.random() * 1.6,
      color: [0xffe34a, 0xff7a12, 0xff5478][index % 3]
    }
  })
  const fireballSparks = Array.from({ length: 14 }, (_, index) => ({
    angle: Math.random() * Math.PI * 2,
    delay: Math.random() * 35,
    size: 1.8 + Math.random() * 1.8,
    color: [0xffe34a, 0xff7a12, 0xff5478][index % 3]
  }))

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!front.active) return
      front.clear()

      const time = counter.getValue() ?? 0

      const fireballX = casterX
      const fireballY = casterY + FIREBALL_CENTER_Y_OFFSET
      const fireballMaxRadius = CELL_WIDTH * 0.32
      if (time < FIREBALL_BURST_AT) {
        const growth = Clamp(time / FIREBALL_BURST_AT, 0, 1)
        const easedGrowth = 1 - (1 - growth) ** 3
        const absorbedParticles =
          fireballParticles.reduce(
            (total, particle) =>
              total + Clamp((time - particle.arrival + 35) / 35, 0, 1),
            0
          ) / fireballParticles.length
        const fireballRadius =
          fireballMaxRadius *
          (0.22 + easedGrowth * 0.04 + absorbedParticles * 0.74)
        drawFireball(
          front,
          fireballX,
          fireballY,
          fireballRadius,
          Clamp(time / 40, 0, 1),
          time / 110
        )
        for (const particle of fireballParticles) {
          const particleDuration = particle.arrival - particle.delay
          const elapsed = time - particle.delay
          if (elapsed < 0 || elapsed >= particleDuration) continue
          const progress = Clamp(elapsed / particleDuration, 0, 1)
          const angle =
            particle.angle +
            particle.direction * Math.PI * 2 * particle.turns * progress
          const particleDistance = (particleProgress: number) => {
            if (particleProgress < 0.82) {
              const approach = particleProgress / 0.82
              return (
                particle.startRadius * (1 - approach) +
                fireballRadius * 1.35 * approach
              )
            }
            const absorption = (particleProgress - 0.82) / 0.18
            return fireballRadius * (1.35 - 0.9 * absorption)
          }
          const distance = particleDistance(progress)
          const x = fireballX + Math.cos(angle) * distance
          const y = fireballY + Math.sin(angle) * distance
          const alpha =
            Clamp(elapsed / 20, 0, 1) *
            Clamp((particle.arrival - time) / 30, 0, 1)
          const trailStart = Math.max(0, progress - 0.2)
          const startAngle =
            particle.angle +
            particle.direction * Math.PI * 2 * particle.turns * trailStart
          const startDistance = particleDistance(trailStart)
          let previousX = fireballX + Math.cos(startAngle) * startDistance
          let previousY = fireballY + Math.sin(startAngle) * startDistance
          for (let segment = 1; segment <= 3; segment++) {
            const trailProgress =
              trailStart + ((progress - trailStart) * segment) / 3
            const trailAngle =
              particle.angle +
              particle.direction * Math.PI * 2 * particle.turns * trailProgress
            const trailDistance = particleDistance(trailProgress)
            const trailX = fireballX + Math.cos(trailAngle) * trailDistance
            const trailY = fireballY + Math.sin(trailAngle) * trailDistance
            front.lineStyle(
              2.8 + particle.size * 0.18,
              particle.color,
              alpha * (0.22 + (segment / 3) * 0.78)
            )
            front.lineBetween(previousX, previousY, trailX, trailY)
            previousX = trailX
            previousY = trailY
          }
          front.fillStyle(particle.color, alpha)
          front.fillCircle(x, y, particle.size)
        }
      } else if (time < FIREBALL_END) {
        const burstAge = time - FIREBALL_BURST_AT
        const burstProgress = Clamp(burstAge / FIREBALL_BURST_DURATION, 0, 1)
        const burstFade = Clamp((FIREBALL_END - time) / 90, 0, 1)
        const shellAlpha = burstFade * Clamp(1 - burstProgress * 2.2, 0, 1)
        drawFireball(
          front,
          fireballX,
          fireballY,
          fireballMaxRadius * Math.max(0.08, 1 - burstProgress * 1.8),
          shellAlpha,
          time / 110
        )
        front.fillStyle(0xfff5a6, burstFade * (1 - burstProgress) * 0.58)
        front.fillCircle(
          fireballX,
          fireballY,
          fireballMaxRadius * (0.3 + burstProgress * 0.65)
        )
        for (const spark of fireballSparks) {
          const sparkAge = burstAge - spark.delay
          if (sparkAge < 0 || sparkAge >= 190) continue
          const progress = sparkAge / 190
          const distance = fireballMaxRadius * (1.45 + progress * 1.65)
          const x = fireballX + Math.cos(spark.angle) * distance
          const y = fireballY + Math.sin(spark.angle) * distance
          const sparkAlpha = burstFade * Clamp((190 - sparkAge) / 65, 0, 1)
          drawSpark(
            front,
            x,
            y,
            spark.angle,
            spark.color,
            sparkAlpha,
            4.5 + spark.size,
            2.2,
            spark.size * (1 - progress * 0.35)
          )
        }
      }

      for (const chunk of chunks) {
        const age = time - chunk.launchAt
        if (age < 0) continue

        const progress = Clamp(age / chunk.flightDuration, 0, 1)
        if (progress < 1) {
          const launchX = casterX + chunk.launchOffsetX
          const launchY = casterY + chunk.launchOffsetY
          const baseX = launchX + (chunk.landingX - launchX) * progress
          const baseY = launchY + (chunk.landingY - launchY) * progress
          const chunkX = baseX
          const chunkY = baseY - Math.sin(progress * Math.PI) * chunk.arcHeight

          for (let trail = 3; trail > 0; trail--) {
            const trailProgress = Math.max(0, progress - trail * 0.065)
            const trailX = launchX + (chunk.landingX - launchX) * trailProgress
            const trailY =
              launchY +
              (chunk.landingY - launchY) * trailProgress -
              Math.sin(trailProgress * Math.PI) * chunk.arcHeight
            const trailColor =
              trail === 3 ? 0xff5478 : trail === 2 ? 0xff7a12 : 0xffe34a
            front.fillStyle(trailColor, (1 - trail / 4) * 0.65)
            front.fillCircle(trailX, trailY, 1.2 + (3 - trail) * 0.45)
          }

          front.fillStyle(0xff7a12, 0.18)
          front.fillCircle(chunkX, chunkY, chunk.size)
          drawEmberChunk(
            front,
            chunkX,
            chunkY,
            chunk.size,
            chunk.rotation + progress * 2.4,
            1
          )
          continue
        }

        const fragmentAge = age - chunk.flightDuration
        if (fragmentAge >= 250) continue
        const fragmentAlpha =
          Clamp(fragmentAge / 25, 0, 1) * Clamp((250 - fragmentAge) / 100, 0, 1)

        for (const fragment of chunk.fragments) {
          const x =
            chunk.landingX + fragment.offsetX + fragment.velocityX * fragmentAge
          const y =
            chunk.landingY +
            fragment.offsetY +
            fragment.velocityY * fragmentAge +
            0.5 * fragment.gravity * fragmentAge * fragmentAge
          front.fillStyle(fragment.color, fragmentAlpha)
          front.fillCircle(x, y, fragment.size * (1 - fragmentAge / 400))
        }
      }

      for (const target of targets) {
        const age = time - target.start
        if (age < 0 || age >= TARGET_DURATION) continue
        const fade = Clamp((TARGET_DURATION - age) / 70, 0, 1)
        const impactAlpha = Clamp(age / 20, 0, 1) * fade

        for (const spark of target.sparks) {
          const sparkAge = age - spark.delay
          if (sparkAge < 0 || sparkAge >= 200) continue
          const distance = spark.speed * sparkAge
          const x = target.x + Math.cos(spark.angle) * distance
          const y =
            target.y +
            12 +
            Math.sin(spark.angle) * distance +
            0.5 * spark.gravity * sparkAge * sparkAge
          const sparkAlpha = impactAlpha * Clamp((200 - sparkAge) / 75, 0, 1)
          drawSpark(
            front,
            x,
            y,
            spark.angle,
            spark.color,
            sparkAlpha,
            6 + spark.size * 0.9,
            2.2 + spark.size * 0.28,
            spark.size
          )
        }
      }
    },
    onComplete: () => {
      front.destroy()
    }
  })

  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
