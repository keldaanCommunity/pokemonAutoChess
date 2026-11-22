import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const HydroPumpTravelDuration = 250

function hydroPumpLine(
  { positionX, positionY, targetX, targetY, flip }: AbilityAnimationArgs,
  extendToBoardEdge = false
) {
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  )
    return null
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const dx = targetScreenX - casterX
  const dy = targetScreenY - casterY
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  const angle = Math.atan2(dy, dx)
  const directionX = dx / length
  const directionY = dy / length
  let visibleLength = extendToBoardEdge ? Infinity : length
  const [left, firstRow] = transformEntityCoordinates(0, 0, flip)
  const [right, lastRow] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const minX = left - CELL_WIDTH / 2
  const maxX = right + CELL_WIDTH / 2
  const minY = Math.min(firstRow, lastRow) - CELL_HEIGHT / 2
  const maxY = Math.max(firstRow, lastRow) + CELL_HEIGHT / 2
  if (directionX > 0)
    visibleLength = Math.min(visibleLength, (maxX - casterX) / directionX)
  if (directionX < 0)
    visibleLength = Math.min(visibleLength, (minX - casterX) / directionX)
  if (directionY > 0)
    visibleLength = Math.min(visibleLength, (maxY - casterY) / directionY)
  if (directionY < 0)
    visibleLength = Math.min(visibleLength, (minY - casterY) / directionY)
  if (visibleLength <= 0) return null
  return {
    casterX,
    casterY,
    targetScreenX,
    targetScreenY,
    angle,
    directionX,
    directionY,
    visibleLength,
    hasProjectedEnd:
      targetX < 0 ||
      targetX >= BOARD_WIDTH ||
      targetY < 0 ||
      targetY >= BOARD_HEIGHT
  }
}

export const hydroPumpAnimation: AbilityAnimation = (args) => {
  const { scene, delay } = args
  const line = hydroPumpLine(args)
  if (!line) return
  const { casterX, casterY, angle, directionX, directionY, visibleLength } =
    line
  const startX = casterX + directionX * 12
  const startY = casterY - 20 + directionY * 12
  const beamLength = Math.max(0, visibleLength - 12)
  const animationDelay = Math.max(0, delay ?? 0)
  const firingDelay = animationDelay + 75
  const holdDuration = 75
  const fadeDuration = 190
  const streamDuration = HydroPumpTravelDuration + holdDuration + fadeDuration
  const flowCycleDuration = 107.5

  const muzzle = scene.add
    .ellipse(startX, startY, 28, 20, 0x25cfff, 0.7)
    .setDepth(DEPTH.ABILITY)
    .setScale(0.35, 0.35)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(muzzle)
  scene.tweens.chain({
    targets: muzzle,
    tweens: [
      {
        alpha: 0.8,
        scaleX: 1,
        scaleY: 1,
        duration: 65,
        delay: animationDelay,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      { alpha: 0, scaleX: 1.4, scaleY: 0.6, duration: 90 }
    ],
    onComplete: () => muzzle.destroy()
  })

  const beam = scene.add
    .container(startX, startY)
    .setDepth(DEPTH.PROJECTILE)
    .setRotation(angle)
    .setScale(0, 1)
  scene.abilitiesVfxGroup?.add(beam)

  const stream = scene.add.graphics()
  const lobeCount = Math.max(2, Math.ceil(beamLength / 19))
  const spacing = beamLength / lobeCount
  const noise = (i: number) => {
    const value = Math.sin(i * 12.9898) * 43758.5453
    return value - Math.floor(value)
  }
  const drawStream = (flow: number) => {
    stream.clear()
    const layers = [
      { color: 0x78ddea, alpha: 0.18, width: 42, height: 52 },
      { color: 0x9debf3, alpha: 0.55, width: 37, height: 35 },
      { color: 0xf4ffff, alpha: 0.82, width: 33, height: 21 }
    ]
    for (const layer of layers) {
      stream.fillStyle(layer.color, layer.alpha)
      for (let i = -1; i <= lobeCount; i++) {
        const x = Math.min(beamLength, Math.max(0, (i + (flow % 1)) * spacing))
        const phase = i * 2.3 - flow * 3
        const swell = 0.75 + noise(i + 8) * 0.35 + 0.1 * Math.sin(phase)
        const spread = Math.min(1, 0.6 + x / 120)
        stream.fillEllipse(
          x,
          (noise(i + 31) - 0.5) * 8 + Math.sin(phase * 0.8) * 3,
          layer.width * swell,
          layer.height * swell * spread
        )
      }
    }

    stream.fillStyle(0xe9ffff, 0.6)
    for (let i = 0; i < lobeCount * 5; i++) {
      const x =
        (noise(i + 100) * beamLength + flow * spacing * 2) % (beamLength || 1)
      const spread = Math.min(1, 0.6 + x / 120)
      const y = (noise(i + 300) - 0.5) * 65 * spread
      const size = 1.5 + noise(i + 500) * 4
      stream.fillEllipse(x, y, size * 1.4, size)
    }
  }
  drawStream(0)
  beam.add(stream)

  scene.tweens.addCounter({
    from: 0,
    to: streamDuration / flowCycleDuration,
    duration: streamDuration,
    delay: firingDelay,
    onUpdate: (tween) => {
      if (beam.active && stream.active) drawStream(tween.getValue() ?? 0)
    }
  })

  scene.tweens.chain({
    targets: beam,
    tweens: [
      {
        scaleX: 1,
        duration: HydroPumpTravelDuration,
        delay: firingDelay,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      {
        alpha: 0,
        scaleY: 0.55,
        delay: holdDuration,
        duration: fadeDuration,
        ease: Phaser.Math.Easing.Quadratic.In
      }
    ],
    onComplete: () => beam.destroy()
  })

  if (!line.hasProjectedEnd) hydroPumpSplashAnimation(args)
}

export const hydroPumpSplashAnimation: AbilityAnimation = (args) => {
  const { scene, delay } = args
  if (args.targetX < 0 || args.targetY < 0) return
  const line = hydroPumpLine(args, args.ability === "HYDRO_PUMP_SPLASH")
  if (!line) return
  const {
    casterX,
    casterY,
    targetScreenX,
    targetScreenY,
    directionX,
    directionY,
    visibleLength
  } = line
  const impactX = targetScreenX - directionX * 10
  const impactY = targetScreenY - 20 - directionY * 10
  const impact = scene.add
    .container(impactX, impactY)
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(0.35)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(impact)

  const splash = scene.add.graphics()
  splash.fillStyle(0x05bfff, 0.48)
  splash.fillEllipse(0, 0, 48, 34)
  splash.fillStyle(0xc9faff, 0.9)
  splash.fillEllipse(0, 0, 24, 18)
  splash.lineStyle(3, 0x70eaff, 0.8)
  splash.strokeEllipse(0, 0, 55, 37)
  for (let i = 0; i < 9; i++) {
    const direction = (i * Math.PI * 2) / 9
    const innerRadius = 11
    const outerRadius = 25 + (i % 3) * 6
    const halfWidth = 3 + (i % 2) * 2
    const perpendicularX = -Math.sin(direction) * halfWidth
    const perpendicularY = Math.cos(direction) * halfWidth
    splash.fillStyle(i % 2 === 0 ? 0x9af5ff : 0x19caff, 0.9)
    splash.fillTriangle(
      Math.cos(direction) * innerRadius + perpendicularX,
      Math.sin(direction) * innerRadius + perpendicularY,
      Math.cos(direction) * outerRadius,
      Math.sin(direction) * outerRadius,
      Math.cos(direction) * innerRadius - perpendicularX,
      Math.sin(direction) * innerRadius - perpendicularY
    )
  }
  impact.add(splash)

  const targetDistance = Math.hypot(
    targetScreenX - casterX,
    targetScreenY - casterY
  )
  const impactProgress = Math.min(1, targetDistance / visibleLength)
  const impactDelay =
    Math.max(0, delay ?? 0) +
    75 +
    HydroPumpTravelDuration * (1 - Math.sqrt(1 - impactProgress))
  scene.tweens.chain({
    targets: impact,
    tweens: [
      {
        alpha: 0.95,
        scale: 1,
        duration: 100,
        delay: impactDelay,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      {
        alpha: 0,
        scale: 1.4,
        delay: 35,
        duration: 190,
        ease: Phaser.Math.Easing.Quadratic.In
      }
    ],
    onComplete: () => impact.destroy()
  })

  for (let i = 0; i < 8; i++) {
    const direction = (i * Math.PI * 2) / 8 + (Math.random() - 0.5) * 0.3
    const distance = randomBetween(28, 58)
    const droplet = scene.add
      .ellipse(
        impactX,
        impactY,
        randomBetween(7, 12),
        randomBetween(11, 18),
        i % 2 === 0 ? 0x8af2ff : 0x12bfff,
        0.9
      )
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setRotation(direction + Math.PI / 2)
      .setAlpha(0)
    scene.abilitiesVfxGroup?.add(droplet)
    scene.tweens.chain({
      targets: droplet,
      tweens: [
        {
          alpha: 0.95,
          duration: 35,
          delay: impactDelay + randomBetween(0, 35)
        },
        {
          x: impactX + Math.cos(direction) * distance,
          y: impactY + Math.sin(direction) * distance,
          alpha: 0,
          scale: 0.45,
          duration: 240,
          ease: Phaser.Math.Easing.Quadratic.Out
        }
      ],
      onComplete: () => droplet.destroy()
    })
  }
}
