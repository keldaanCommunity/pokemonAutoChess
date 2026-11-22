import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

type Point = { x: number; y: number }
type ChainLink = Point & { angle: number }
type TargetCell = { x: number; y: number }
type ImpactPath = {
  start: Point
  control: Point
  end: Point
  chainLinks: ChainLink[]
  delay: number
  travelDuration: number
}
type ImpactCurve = Pick<ImpactPath, "start" | "control" | "end">

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

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

function isTargetCell(value: unknown): value is TargetCell {
  if (!value || typeof value !== "object" || !("x" in value) || !("y" in value))
    return false
  const { x, y } = value
  return typeof x === "number" && typeof y === "number" && isBoardCell(x, y)
}

function makeChainLinks(caster: Point, target: Point): ChainLink[] {
  const casterLoop = { x: caster.x, y: caster.y + 7 }
  const targetLoop = { x: target.x, y: target.y + 7 }
  const points: Point[] = []
  const loopSteps = 96
  const appendWrap = (center: Point, expanding: boolean) => {
    for (let i = 0; i <= loopSteps; i++) {
      const progress = i / loopSteps
      const radiusProgress = expanding ? progress : 1 - progress
      const angle = -Math.PI / 2 + Math.PI * 4 * progress
      const radiusX = Phaser.Math.Linear(24, 32, radiusProgress)
      const radiusY = Phaser.Math.Linear(11, 16, radiusProgress)
      points.push({
        x: center.x + Math.cos(angle) * radiusX,
        y: center.y + Math.sin(angle) * radiusY
      })
    }
  }

  appendWrap(casterLoop, true)
  const start = points[points.length - 1]
  const targetStart = { x: targetLoop.x, y: targetLoop.y - 16 }
  const dx = targetStart.x - start.x
  const dy = targetStart.y - start.y
  const length = Math.hypot(dx, dy)
  const normalX = length > 0 ? -dy / length : 0
  const normalY = length > 0 ? dx / length : 1
  const control1 = {
    x: start.x + dx / 3 + normalX * 24,
    y: start.y + dy / 3 + normalY * 24
  }
  const control2 = {
    x: start.x + (dx * 2) / 3 - normalX * 24,
    y: start.y + (dy * 2) / 3 - normalY * 24
  }
  for (let i = 1; i <= 64; i++) {
    const t = i / 64
    const inverse = 1 - t
    points.push({
      x:
        inverse ** 3 * start.x +
        3 * inverse ** 2 * t * control1.x +
        3 * inverse * t ** 2 * control2.x +
        t ** 3 * targetStart.x,
      y:
        inverse ** 3 * start.y +
        3 * inverse ** 2 * t * control1.y +
        3 * inverse * t ** 2 * control2.y +
        t ** 3 * targetStart.y
    })
  }
  appendWrap(targetLoop, false)

  const distances = [0]
  for (let i = 1; i < points.length; i++) {
    distances.push(
      distances[i - 1] +
        Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    )
  }

  const pointAt = (distance: number): Point => {
    let index = 1
    while (index < distances.length - 1 && distances[index] < distance) index++
    const segmentLength = distances[index] - distances[index - 1]
    const progress =
      segmentLength > 0 ? (distance - distances[index - 1]) / segmentLength : 0
    return {
      x: Phaser.Math.Linear(points[index - 1].x, points[index].x, progress),
      y: Phaser.Math.Linear(points[index - 1].y, points[index].y, progress)
    }
  }

  const links: ChainLink[] = []
  const spacing = 11
  for (
    let distance = 5;
    distance < distances[distances.length - 1];
    distance += spacing
  ) {
    const point = pointAt(distance)
    const before = pointAt(Math.max(0, distance - 3))
    const after = pointAt(
      Math.min(distances[distances.length - 1], distance + 3)
    )
    links.push({
      ...point,
      angle: Math.atan2(after.y - before.y, after.x - before.x)
    })
  }
  return links
}

function drawChainLink(
  graphics: Phaser.GameObjects.Graphics,
  link: ChainLink,
  index: number,
  alpha: number
) {
  const angle = link.angle + (index % 2 === 0 ? -0.36 : 0.36)
  const halfLength = 6.5
  const dx = Math.cos(angle) * halfLength
  const dy = Math.sin(angle) * halfLength
  graphics.lineStyle(8, 0xd94daf, alpha)
  graphics.lineBetween(link.x - dx, link.y - dy, link.x + dx, link.y + dy)
  graphics.lineStyle(4, 0xffc8f3, alpha * 0.95)
  graphics.lineBetween(link.x - dx, link.y - dy, link.x + dx, link.y + dy)
  graphics.fillStyle(0xffffff, alpha * 0.75)
  graphics.fillCircle(link.x - dx * 0.55, link.y - dy * 0.55, 1.2)
}

function drawFrontWrap(
  graphics: Phaser.GameObjects.Graphics,
  center: Point,
  alpha: number
) {
  for (const [radiusX, radiusY] of [
    [28, 13],
    [32, 16]
  ]) {
    graphics.lineStyle(8, 0xd94daf, alpha * 0.95)
    graphics.beginPath()
    for (let i = 0; i <= 18; i++) {
      const angle = (Math.PI * i) / 18
      const x = center.x + Math.cos(angle) * radiusX
      const y = center.y + Math.sin(angle) * radiusY
      if (i === 0) graphics.moveTo(x, y)
      else graphics.lineTo(x, y)
    }
    graphics.strokePath()
    graphics.lineStyle(4, 0xffc8f3, alpha * 0.95)
    graphics.beginPath()
    for (let i = 0; i <= 18; i++) {
      const angle = (Math.PI * i) / 18
      const x = center.x + Math.cos(angle) * radiusX
      const y = center.y + Math.sin(angle) * radiusY
      if (i === 0) graphics.moveTo(x, y)
      else graphics.lineTo(x, y)
    }
    graphics.strokePath()
  }
}

function drawSecondaryImpact(
  graphics: Phaser.GameObjects.Graphics,
  position: Point,
  progress: number,
  alpha: number
) {
  const opacity = alpha * (1 - progress * 0.85)
  const radius = 9 + progress * 26
  graphics.lineStyle(3, 0xf04cc5, opacity)
  graphics.strokeEllipse(position.x, position.y, radius * 2, radius * 1.5)
  graphics.lineStyle(1.5, 0xffd5f7, opacity * 0.9)
  graphics.strokeEllipse(position.x, position.y, radius * 1.35, radius)
  graphics.fillStyle(0xffe6fb, opacity * (1 - progress * 0.55))
  graphics.fillCircle(position.x, position.y, 6 * (1 - progress * 0.5))
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    const innerRadius = radius * 0.55
    const outerRadius = innerRadius + 9 * (1 - progress * 0.4)
    graphics.lineStyle(2.5, 0xffc8f3, opacity)
    graphics.lineBetween(
      position.x + Math.cos(angle) * innerRadius,
      position.y + Math.sin(angle) * innerRadius,
      position.x + Math.cos(angle) * outerRadius,
      position.y + Math.sin(angle) * outerRadius
    )
  }
}

function getImpactPathPoint(path: ImpactCurve, t: number): Point {
  const inverse = 1 - t
  return {
    x:
      inverse ** 2 * path.start.x +
      2 * inverse * t * path.control.x +
      t ** 2 * path.end.x,
    y:
      inverse ** 2 * path.start.y +
      2 * inverse * t * path.control.y +
      t ** 2 * path.end.y
  }
}

function makeImpactChainLinks(path: ImpactCurve): ChainLink[] {
  const points = Array.from({ length: 17 }, (_, i) =>
    getImpactPathPoint(path, i / 16)
  )
  const distances = [0]
  for (let i = 1; i < points.length; i++) {
    distances.push(
      distances[i - 1] +
        Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    )
  }

  const pointAt = (distance: number): Point => {
    let index = 1
    while (index < distances.length - 1 && distances[index] < distance) index++
    const segmentLength = distances[index] - distances[index - 1]
    const progress =
      segmentLength > 0 ? (distance - distances[index - 1]) / segmentLength : 0
    return {
      x: Phaser.Math.Linear(points[index - 1].x, points[index].x, progress),
      y: Phaser.Math.Linear(points[index - 1].y, points[index].y, progress)
    }
  }

  const links: ChainLink[] = []
  for (
    let distance = 4;
    distance < distances[distances.length - 1];
    distance += 8
  ) {
    const point = pointAt(distance)
    const before = pointAt(Math.max(0, distance - 2))
    const after = pointAt(
      Math.min(distances[distances.length - 1], distance + 2)
    )
    links.push({
      ...point,
      angle: Math.atan2(after.y - before.y, after.x - before.x)
    })
  }
  return links
}

function drawSecondaryChainLink(
  graphics: Phaser.GameObjects.Graphics,
  link: ChainLink,
  index: number,
  alpha: number
) {
  const angle = link.angle + (index % 2 === 0 ? -0.42 : 0.42)
  const halfLength = 4.5
  const dx = Math.cos(angle) * halfLength
  const dy = Math.sin(angle) * halfLength
  graphics.lineStyle(4.5, 0xd94daf, alpha * 0.68)
  graphics.lineBetween(link.x - dx, link.y - dy, link.x + dx, link.y + dy)
  graphics.lineStyle(2, 0xffc8f3, alpha * 0.72)
  graphics.lineBetween(link.x - dx, link.y - dy, link.x + dx, link.y + dy)
}

function drawImpactTravel(
  graphics: Phaser.GameObjects.Graphics,
  path: ImpactPath,
  progress: number,
  alpha: number
) {
  const easedProgress = Phaser.Math.Easing.Cubic.Out(progress)
  const visibleLinks = Math.ceil(path.chainLinks.length * easedProgress)
  for (let i = 0; i < visibleLinks; i++) {
    drawSecondaryChainLink(graphics, path.chainLinks[i], i, alpha * 0.72)
  }

  const head = getImpactPathPoint(path, easedProgress)
  graphics.fillStyle(0xe848bd, alpha * 0.42)
  graphics.fillCircle(head.x, head.y, 6)
  graphics.fillStyle(0xffe6fb, alpha * 0.8)
  graphics.fillCircle(head.x, head.y, 2.5)
}

function drawLock(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  scale: number,
  alpha: number,
  time: number
) {
  const bodyWidth = 28 * scale
  const bodyHeight = 24 * scale
  const bodyX = x - bodyWidth / 2
  const bodyY = y - bodyHeight / 2 + 3 * scale
  const radius = 4 * scale

  graphics.fillStyle(0xe848bd, alpha * 0.18)
  graphics.fillEllipse(x, y, 76 * scale, 86 * scale)
  graphics.lineStyle(2.5, 0xf175dd, alpha * 0.8)
  graphics.strokeEllipse(x, y, 68 * scale, 78 * scale)
  graphics.lineStyle(1.5, 0xffc1f3, alpha * 0.65)
  graphics.strokeEllipse(x, y, 57 * scale, 67 * scale)

  graphics.lineStyle(4 * scale, 0xffd5f7, alpha)
  graphics.beginPath()
  graphics.moveTo(x - 7 * scale, bodyY + 6 * scale)
  graphics.lineTo(x - 7 * scale, bodyY - 2 * scale)
  graphics.lineTo(x - 5 * scale, bodyY - 9 * scale)
  graphics.lineTo(x, bodyY - 12 * scale)
  graphics.lineTo(x + 5 * scale, bodyY - 9 * scale)
  graphics.lineTo(x + 7 * scale, bodyY - 2 * scale)
  graphics.lineTo(x + 7 * scale, bodyY + 6 * scale)
  graphics.strokePath()

  graphics.fillStyle(0xf477d9, alpha * 0.96)
  graphics.fillRoundedRect(bodyX, bodyY, bodyWidth, bodyHeight, radius)
  graphics.lineStyle(2, 0xffd5f7, alpha)
  graphics.strokeRoundedRect(bodyX, bodyY, bodyWidth, bodyHeight, radius)
  graphics.fillStyle(0x9f327f, alpha)
  graphics.fillCircle(x, bodyY + 10 * scale, 2 * scale)
  graphics.fillRect(x - scale, bodyY + 10 * scale, 2 * scale, 5 * scale)

  for (let i = 0; i < 4; i++) {
    const angle = time * 0.006 + (i * Math.PI) / 2
    const sparkleX = x + Math.cos(angle) * 37 * scale
    const sparkleY = y + Math.sin(angle) * 42 * scale
    graphics.fillStyle(
      0xffe6fb,
      alpha * (0.55 + 0.4 * Math.sin(time * 0.01 + i))
    )
    graphics.fillCircle(sparkleX, sparkleY, (2 + (i % 2)) * scale)
  }
}

export const fairyLockAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  data,
  delay = 0
}) => {
  if (
    !isBoardCell(positionX, positionY) ||
    !isBoardCell(targetX, targetY) ||
    (positionX === targetX && positionY === targetY)
  ) {
    return
  }

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
  const caster = { x: casterX, y: casterY + 7 }
  const target = { x: targetScreenX, y: targetScreenY + 7 }
  const adjacentTargets: Point[] = Array.isArray(data.targets)
    ? data.targets
        .filter(isTargetCell)
        .filter(({ x, y }) => x !== targetX || y !== targetY)
        .map(({ x, y }) => {
          const [screenX, screenY] = transformEntityCoordinates(x, y, flip)
          return { x: screenX, y: screenY - 6 }
        })
    : []
  const impactOrigin = { x: targetScreenX, y: targetScreenY - 6 }
  const impactPaths: ImpactPath[] = adjacentTargets.map((end, index) => {
    const dx = end.x - impactOrigin.x
    const dy = end.y - impactOrigin.y
    const distance = Math.hypot(dx, dy)
    const normalX = distance > 0 ? -dy / distance : 0
    const normalY = distance > 0 ? dx / distance : 0
    const path = {
      start: impactOrigin,
      control: {
        x: (impactOrigin.x + end.x) / 2 + normalX * 5,
        y: (impactOrigin.y + end.y) / 2 + normalY * 5
      },
      end,
      delay: index * 18,
      travelDuration: 240 + distance * 0.6
    }
    return { ...path, chainLinks: makeImpactChainLinks(path) }
  })
  const links = makeChainLinks(caster, target)
  const duration = 2050
  const revealDuration = 1000
  const fadeDuration = 360
  const impactStart = 650
  const impactDuration = 440
  const ground = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const visuals = [ground, front]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (visuals.some((visual) => !visual.active)) return
      const time = counter.getValue() ?? 0
      const opacity = clamp((duration - time) / fadeDuration)
      const progress = clamp(time / revealDuration)
      ground.clear()
      front.clear()

      for (const center of [caster, target]) {
        const glow = clamp(time / 100) * opacity
        ground.fillStyle(0xe848bd, glow * 0.24)
        ground.fillEllipse(center.x, center.y, 74, 34)
        ground.lineStyle(2, 0xff9be8, glow * 0.85)
        ground.strokeEllipse(center.x, center.y, 58, 24)
      }

      const visibleLinks = Math.floor(links.length * progress)
      for (let i = 0; i < visibleLinks; i++) {
        drawChainLink(ground, links[i], i, opacity)
      }

      if (progress > 0.22) {
        drawFrontWrap(front, caster, opacity * clamp((progress - 0.22) / 0.2))
      }
      if (progress > 0.78) {
        drawFrontWrap(front, target, opacity * clamp((progress - 0.78) / 0.2))
      }

      for (const path of impactPaths) {
        const elapsed = time - impactStart - path.delay
        if (elapsed < 0) continue
        const travelProgress = clamp(elapsed / path.travelDuration)
        if (travelProgress < 1) {
          drawImpactTravel(front, path, travelProgress, opacity)
          continue
        }
        const impactProgress = clamp(
          (elapsed - path.travelDuration) / impactDuration
        )
        if (impactProgress < 1) {
          drawSecondaryImpact(front, path.end, impactProgress, opacity)
        }
      }

      const lockProgress = clamp((time - revealDuration - 120) / 200)
      if (lockProgress > 0) {
        const pop = Phaser.Math.Easing.Back.Out(lockProgress)
        const lockAlpha = opacity * clamp(lockProgress * 5)
        drawLock(
          front,
          casterX,
          casterY - 10,
          0.68 + pop * 0.32,
          lockAlpha,
          time
        )
        drawLock(
          front,
          targetScreenX,
          targetScreenY - 10,
          0.68 + pop * 0.32,
          lockAlpha,
          time
        )
      }
    },
    onComplete: () => visuals.forEach((visual) => visual.destroy())
  })

  visuals.forEach((visual) => {
    visual.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  })
}
