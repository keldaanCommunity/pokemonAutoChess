import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import { AbilityConfigs } from "../../../../../config/game/abilities"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { Ability } from "../../../../../types/enum/Ability"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { drawBeamImpactArcs, drawBoardEdgeMask } from "./helpers"

const timing = AbilityConfigs[Ability.DYNAMAX_CANNON]
const TAU = Math.PI * 2
const palette = {
  dark: 0x38105c,
  violet: 0x8e28ff,
  pink: 0xff16da,
  red: 0xff2965,
  light: 0xffa9ef,
  core: 0xfff5ff
}

function cannonLine(args: AbilityAnimationArgs) {
  const { positionX, positionY, targetX, targetY, flip } = args
  // Projected line endpoints may be negative, unlike a missing target.
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  )
    return null
  const [x, anchorY] = transformEntityCoordinates(positionX, positionY, flip)
  const [tx, ty] = transformEntityCoordinates(targetX, targetY, flip)
  const angle = Math.atan2(ty - anchorY, tx - x)
  if (tx === x && ty === anchorY) return null
  const [left, rowA] = transformEntityCoordinates(0, 0, flip)
  const [right, rowB] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const bounds = new Phaser.Geom.Rectangle(
    left - CELL_WIDTH / 2,
    Math.min(rowA, rowB) - CELL_HEIGHT / 2,
    right - left + CELL_WIDTH,
    Math.abs(rowB - rowA) + CELL_HEIGHT
  )
  const y = anchorY - 20
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  let length = Infinity
  if (dx > 0) length = Math.min(length, (bounds.right - x) / dx)
  if (dx < 0) length = Math.min(length, (bounds.left - x) / dx)
  if (dy > 0) length = Math.min(length, (bounds.bottom - y) / dy)
  if (dy < 0) length = Math.min(length, (bounds.top - y) / dy)
  return { x, y, angle, dx, dy, length: Math.max(0, length), bounds }
}

export const dynamaxCannonChargeAnimation: AbilityAnimation = (args) => {
  const line = cannonLine(args)
  if (!line) return
  const { scene } = args
  const charge = scene.add
    .container(line.x + line.dx * 36, line.y + line.dy * 36)
    .setDepth(DEPTH.PROJECTILE)
    .setRotation(line.angle)
  const orb = scene.add.graphics()
  charge.add(orb)
  scene.abilitiesVfxGroup?.add(charge)

  const draw = (progress: number) => {
    if (!charge.active || !orb.active) return
    orb.clear()
    const radius = 7 + 23 * Phaser.Math.Easing.Cubic.Out(progress)
    const alpha = Math.min(1, progress * 5)
    orb.fillStyle(palette.violet, 0.12 * alpha)
    orb.fillCircle(0, 0, radius + 10)
    orb.fillStyle(palette.dark, 0.9 * alpha)
    orb.fillCircle(0, 0, radius)
    for (let i = 0; i < 6; i++) {
      const angle = (i * TAU) / 6 + progress * 3
      orb.fillStyle(i % 2 ? palette.violet : palette.pink, 0.28 * alpha)
      orb.fillEllipse(
        Math.cos(angle) * radius * 0.3,
        Math.sin(angle) * radius * 0.3,
        radius * 1.4,
        radius * 1.25
      )
    }
    orb.lineStyle(3, palette.pink, 0.9 * alpha)
    orb.strokeCircle(0, 0, radius)
    orb.lineStyle(1.5, palette.light, 0.85 * alpha)
    orb.strokeCircle(0, 0, radius * 0.9)
    orb.fillStyle(palette.core, alpha)
    orb.fillCircle(0, 0, radius * (0.28 + progress * 0.12))

    for (let i = 0; i < 3; i++) {
      orb.lineStyle(2, i % 2 ? palette.red : palette.violet, 0.7 * alpha)
      orb.beginPath()
      orb.arc(
        0,
        0,
        radius + 5 + i * 5,
        progress * 5 + i * 2,
        progress * 5 + i * 2 + 2.7
      )
      orb.strokePath()
    }
    for (let i = 0; i < 24; i++) {
      const cycle = (progress * 2.2 + i / 24) % 1
      const angle = i * 2.39996 + progress * 0.5
      const distance = radius + (1 - cycle) ** 2 * (55 + (i % 4) * 12)
      const tail = 7 + (1 - cycle) * 12
      orb.lineStyle(
        i % 3 === 0 ? 2.5 : 1.5,
        i % 2 ? palette.red : palette.light,
        alpha * Math.sin(cycle * Math.PI)
      )
      orb.lineBetween(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        Math.cos(angle) * (distance + tail),
        Math.sin(angle) * (distance + tail)
      )
    }
    for (let i = 0; i < 5; i++) {
      const angle = (i * TAU) / 5 + progress * 4
      const points = Array.from({ length: 5 }, (_, j) => {
        const a = angle + j * 0.15
        const r =
          radius * (0.55 + j * 0.12) + Math.sin(progress * 45 + i + j * 3) * 4
        return new Phaser.Math.Vector2(Math.cos(a) * r, Math.sin(a) * r)
      })
      orb.lineStyle(
        1.5,
        palette.core,
        alpha * (0.5 + 0.4 * Math.sin(progress * 35 + i) ** 2)
      )
      orb.strokePoints(points, false)
    }
  }
  draw(0)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    delay: Math.max(0, args.delay ?? 0),
    duration: timing.chargeDuration,
    onUpdate: (tween) => draw(tween.getValue() ?? 0),
    onComplete: () => charge.destroy()
  })
  charge.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

function hitCells(data: AbilityAnimationArgs["data"]) {
  const targets: unknown = data.targets
  if (!Array.isArray(targets)) return []
  const seen = new Set<number>()
  return targets
    .slice(0, BOARD_WIDTH * BOARD_HEIGHT)
    .filter((cell): cell is { x: number; y: number } => {
      if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell))
        return false
      const { x, y } = cell
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        x < 0 ||
        x >= BOARD_WIDTH ||
        y < 0 ||
        y >= BOARD_HEIGHT
      )
        return false
      const key = y * BOARD_WIDTH + x
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export const dynamaxCannonAnimation: AbilityAnimation = (args) => {
  const line = cannonLine(args)
  if (!line) return
  const { scene } = args
  const beam = scene.add
    .container(line.x, line.y)
    .setRotation(line.angle)
    .setDepth(DEPTH.PROJECTILE)
  const ray = scene.add.graphics()
  beam.add(ray)
  scene.abilitiesVfxGroup?.add(beam)
  const maskShape = scene.add.graphics().setVisible(false)
  drawBoardEdgeMask(maskShape, line.bounds, line.dx, line.dy)
  const canvasMask =
    scene.renderer.type === Phaser.CANVAS
      ? maskShape.createGeometryMask()
      : null
  if (canvasMask) {
    beam.setMask(canvasMask)
  } else {
    beam.enableFilters()
    beam.filters?.external.addMask(maskShape, false, scene.cameras.main)
  }
  scene.abilitiesVfxGroup?.add(maskShape)

  const impacts = hitCells(args.data).map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, args.flip)
    const impact = scene.add
      .graphics()
      .setPosition(x, y - 20)
      .setRotation(line.angle)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    scene.abilitiesVfxGroup?.add(impact)
    return impact
  })
  const draw = (elapsed: number) => {
    if (!beam.active || !ray.active) return
    ray.clear()
    const fade =
      1 -
      Phaser.Math.Clamp(
        (elapsed - timing.beamDuration) / timing.fadeDuration,
        0,
        1
      )
    const opening = Math.min(1, 0.65 + elapsed / 55)
    const width = opening * fade * (1 + 0.04 * Math.sin(elapsed / 17))
    const length = line.length
    const layers = [
      { color: palette.violet, alpha: 0.2, width: 40 },
      { color: palette.red, alpha: 0.65, width: 33 },
      { color: palette.pink, alpha: 0.95, width: 29 },
      { color: palette.light, alpha: 1, width: 23 },
      { color: palette.core, alpha: 1, width: 18 }
    ]
    for (const layer of layers) {
      const points: Phaser.Math.Vector2[] = []
      for (const side of [-1, 1]) {
        for (let i = 0; i <= 24; i++) {
          const fraction = side === -1 ? i / 24 : 1 - i / 24
          const x = 25 + fraction * Math.max(0, length - 25)
          const swell = 0.58 + Math.min(1, fraction * 3) * 0.42
          const ripple = Math.sin(fraction * 35 - elapsed / 22) * 1.7
          points.push(
            new Phaser.Math.Vector2(
              x,
              side * (layer.width * swell + ripple) * width
            )
          )
        }
      }
      ray.fillStyle(layer.color, layer.alpha * fade)
      ray.fillPoints(points, true)
    }
    for (let i = 0; i < 7; i++) {
      const points = Array.from({ length: 19 }, (_, j) => {
        const x = 25 + (j / 18) * Math.max(0, length - 25)
        return new Phaser.Math.Vector2(
          x,
          (Math.sin(j * 0.7 - elapsed / 28 + i * 2) * 4 + (i - 3) * 6) * width
        )
      })
      ray.lineStyle(
        i % 2 ? 2 : 1,
        i % 2 ? palette.pink : palette.core,
        0.75 * fade
      )
      ray.strokePoints(points, false)
    }
    ray.fillStyle(palette.pink, 0.85 * fade)
    ray.fillCircle(30, 0, 25 * width)
    ray.fillStyle(palette.core, fade)
    ray.fillCircle(30, 0, 15 * width)
    for (let i = 0; i < 14; i++) {
      const angle = (i * TAU) / 14 + elapsed / 300
      ray.lineStyle(1.5, i % 2 ? palette.light : palette.red, fade * 0.8)
      ray.lineBetween(
        30 + Math.cos(angle) * 25 * width,
        Math.sin(angle) * 25 * width,
        30 + Math.cos(angle) * 43 * width,
        Math.sin(angle) * 43 * width
      )
    }
    const hitFade = Math.max(0, 1 - elapsed / 300)
    impacts.forEach((impact) => {
      if (!impact.active) return
      impact.clear()
      if (hitFade <= 0) return
      const expansion = Math.min(1, elapsed / 85)
      drawBeamImpactArcs(
        impact,
        elapsed,
        1 + expansion * 0.5,
        hitFade,
        palette.dark
      )
      impact.fillStyle(palette.light, hitFade)
      impact.fillCircle(0, 0, 14 * hitFade)
      impact.fillStyle(palette.core, hitFade)
      impact.fillCircle(0, 0, 8 * hitFade)
    })
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: timing.beamDuration + timing.fadeDuration,
    delay: Math.max(0, args.delay ?? 0),
    duration: timing.beamDuration + timing.fadeDuration,
    onUpdate: (tween) => draw(tween.getValue() ?? 0),
    onComplete: () => beam.destroy()
  })
  beam.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    canvasMask?.destroy()
    maskShape.destroy()
    impacts.forEach((impact) => impact.destroy())
  })
}
