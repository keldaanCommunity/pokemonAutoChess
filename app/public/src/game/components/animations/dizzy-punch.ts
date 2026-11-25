import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const LEAD_IN = 65
const TRAVEL_DURATION = 165
const IMPACT_DURATION = 190
const DUCK_FLIGHT_DURATION = 315
const DUCK_DELAYS = [0, 10, 20, 30, 40, 50, 60, 70]
const DUCK_ANGLES = [-2.9, -2.55, -2.2, -1.85, -1.5, -1.15, -0.8, -0.45]
const DUCK_SCALES = [0.78, 0.9, 0.72, 0.85, 0.75, 0.88, 0.74, 0.82]
const DUCK_DURATION = DUCK_FLIGHT_DURATION + DUCK_DELAYS[DUCK_DELAYS.length - 1]
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

function quadraticPoint(
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number,
  progress: number
) {
  const inverse = 1 - progress
  return {
    x:
      inverse * inverse * startX +
      2 * inverse * progress * controlX +
      progress * progress * endX,
    y:
      inverse * inverse * startY +
      2 * inverse * progress * controlY +
      progress * progress * endY
  }
}

function drawAnticipation(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  const progress = elapsed / LEAD_IN
  const alpha = clamp(elapsed / 12) * clamp((LEAD_IN - elapsed) / 12)
  const pulse = 1 + Math.sin(progress * Math.PI) * 0.08
  const centerY = y - 14

  graphics.fillStyle(0xff8b20, alpha * 0.32)
  graphics.fillEllipse(x, centerY, 62 * pulse, 44 * pulse)
  graphics.fillStyle(0xffc64a, alpha * 0.28)
  graphics.fillEllipse(x, centerY, 46 * pulse, 32 * pulse)
  graphics.lineStyle(4, 0xff9a22, alpha * 0.96)
  graphics.strokeEllipse(x, centerY, 62 * pulse, 44 * pulse)
  graphics.lineStyle(2, 0xffffad, alpha)
  graphics.strokeEllipse(x, centerY, 46 * pulse, 32 * pulse)

  for (const [index, offset] of [-18, 0, 17].entries()) {
    const height = 8 + Math.sin(progress * Math.PI) * (index % 2 === 0 ? 8 : 5)
    graphics.fillStyle(index === 1 ? 0xffffbd : 0xffff73, alpha * 0.95)
    graphics.fillTriangle(
      x + offset - 2,
      centerY - 12,
      x + offset,
      centerY - 12 - height,
      x + offset + 2,
      centerY - 12
    )
  }
}

function drawStrike(
  graphics: GameObjects.Graphics,
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number,
  progress: number
) {
  const eased = Phaser.Math.Easing.Cubic.Out(progress)
  const tail = Math.max(0, eased - 0.42)
  const headPoint = quadraticPoint(
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    eased
  )
  const tailPoint = quadraticPoint(
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    tail
  )
  const tangentX =
    2 * (1 - eased) * (controlX - startX) + 2 * eased * (endX - controlX)
  const tangentY =
    2 * (1 - eased) * (controlY - startY) + 2 * eased * (endY - controlY)
  const tangentLength = Math.hypot(tangentX, tangentY) || 1
  const directionX = tangentX / tangentLength
  const directionY = tangentY / tangentLength
  const normalX = -directionY
  const normalY = directionX

  graphics.lineStyle(24, 0xff8a18, 0.54)
  graphics.beginPath()
  graphics.moveTo(tailPoint.x, tailPoint.y)
  for (let step = 1; step <= 6; step++) {
    const point = quadraticPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      tail + ((eased - tail) * step) / 6
    )
    graphics.lineTo(point.x, point.y)
  }
  graphics.strokePath()

  graphics.lineStyle(15, 0xffd64b, 0.98)
  graphics.beginPath()
  graphics.moveTo(tailPoint.x, tailPoint.y)
  for (let step = 1; step <= 6; step++) {
    const point = quadraticPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      tail + ((eased - tail) * step) / 6
    )
    graphics.lineTo(point.x, point.y)
  }
  graphics.strokePath()
  graphics.lineStyle(5, 0xffffbd, 0.92)
  graphics.beginPath()
  graphics.moveTo(tailPoint.x, tailPoint.y)
  for (let step = 1; step <= 6; step++) {
    const point = quadraticPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      tail + ((eased - tail) * step) / 6
    )
    graphics.lineTo(point.x, point.y)
  }
  graphics.strokePath()

  const tipX = headPoint.x + directionX * 14
  const tipY = headPoint.y + directionY * 14
  const baseX = headPoint.x - directionX * 10
  const baseY = headPoint.y - directionY * 10
  graphics.fillStyle(0xff9a22, 0.98)
  graphics.fillTriangle(
    tipX,
    tipY,
    baseX + normalX * 11,
    baseY + normalY * 11,
    baseX - normalX * 11,
    baseY - normalY * 11
  )
  graphics.fillStyle(0xffffbd, 0.95)
  graphics.fillCircle(headPoint.x, headPoint.y, 6)
}

function drawImpactBackdrop(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  if (elapsed < 0 || elapsed >= IMPACT_DURATION) return

  const progress = elapsed / IMPACT_DURATION
  const alpha = (1 - progress) ** 0.9
  const centerY = y

  graphics.fillStyle(0xff8b20, alpha * 0.48)
  graphics.fillEllipse(x, centerY, 58 + progress * 12, 46 + progress * 10)
  graphics.fillStyle(0xffcf48, alpha * 0.58)
  graphics.fillEllipse(x, centerY - 2, 42 + progress * 8, 32 + progress * 8)
  graphics.lineStyle(3, 0xff9a22, alpha * 0.94)
  graphics.strokeEllipse(x, centerY, 58 + progress * 12, 46 + progress * 10)
}

function drawImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number,
  directionX: number,
  directionY: number
) {
  if (elapsed < 0 || elapsed >= IMPACT_DURATION) return

  const progress = elapsed / IMPACT_DURATION
  const alpha = (1 - progress) ** 0.9
  const centerY = y

  graphics.fillStyle(0xffff8a, alpha * 0.4)
  graphics.fillEllipse(x, centerY - 2, 24 + progress * 5, 19 + progress * 5)

  if (elapsed < 90) {
    const flashAlpha = 1 - elapsed / 90
    const normalX = -directionY
    const normalY = directionX
    const flashX = x
    const flashY = centerY
    graphics.fillStyle(0xffffff, flashAlpha)
    graphics.fillTriangle(
      flashX + directionX * 18,
      flashY + directionY * 18,
      flashX - directionX * 7 + normalX * 8,
      flashY - directionY * 7 + normalY * 8,
      flashX - directionX * 7 - normalX * 8,
      flashY - directionY * 7 - normalY * 8
    )
    graphics.fillCircle(flashX, flashY, 5 + flashAlpha * 3)

    for (const [index, angle] of [-2.7, -1.5, -0.5].entries()) {
      const distance = 17 + elapsed * 0.08
      const sparkleX = flashX + Math.cos(angle) * distance
      const sparkleY = flashY + Math.sin(angle) * distance
      const size = 2.5 * flashAlpha
      graphics.fillStyle(index === 1 ? 0xf0f0f0 : 0xf0e800, flashAlpha)
      graphics.fillTriangle(
        sparkleX,
        sparkleY - size * 1.5,
        sparkleX + size,
        sparkleY,
        sparkleX - size,
        sparkleY
      )
      graphics.fillTriangle(
        sparkleX,
        sparkleY + size * 1.5,
        sparkleX + size,
        sparkleY,
        sparkleX - size,
        sparkleY
      )
    }
  }

  const rays = [
    { angle: -2.8, length: 22 },
    { angle: -2.25, length: 29 },
    { angle: -1.72, length: 23 },
    { angle: -1.18, length: 28 },
    { angle: -0.63, length: 21 }
  ]
  for (const [index, ray] of rays.entries()) {
    const directionX = Math.cos(ray.angle)
    const directionY = Math.sin(ray.angle)
    const inner = 13 + progress * 8
    const outer = inner + ray.length * (0.65 + progress * 0.35)
    const width = index % 2 === 0 ? 3 : 2
    graphics.fillStyle(index % 2 === 0 ? 0xd8b000 : 0xf0e800, alpha * 0.98)
    graphics.fillTriangle(
      x + directionX * inner - directionY * width,
      centerY + directionY * inner + directionX * width,
      x + directionX * outer,
      centerY + directionY * outer,
      x + directionX * inner + directionY * width,
      centerY + directionY * inner - directionX * width
    )
  }
}

function drawDuck(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  facing: number,
  alpha: number
) {
  const headX = x + facing * size * 0.44

  graphics.fillStyle(0xa06800, alpha * 0.82)
  graphics.fillEllipse(x, y + size * 0.18, size * 1.65, size * 0.95)
  graphics.fillTriangle(
    x - facing * size * 0.55,
    y - size * 0.18,
    x - facing * size * 1.05,
    y - size * 0.4,
    x - facing * size * 0.82,
    y + size * 0.18
  )

  graphics.fillStyle(0xd8b000, alpha)
  graphics.fillEllipse(x, y, size * 1.5, size * 0.9)
  graphics.fillCircle(headX, y - size * 0.28, size * 0.34)

  graphics.fillStyle(0xf0e800, alpha)
  graphics.fillEllipse(
    x - facing * size * 0.12,
    y - size * 0.08,
    size * 0.72,
    size * 0.42
  )
  graphics.fillCircle(headX, y - size * 0.28, size * 0.25)
  graphics.fillStyle(0xf0f0f0, alpha * 0.95)
  graphics.fillEllipse(
    x - facing * size * 0.18,
    y - size * 0.23,
    size * 0.28,
    size * 0.12
  )

  graphics.fillStyle(0x980000, alpha)
  graphics.fillTriangle(
    headX + facing * size * 0.2,
    y - size * 0.36,
    headX + facing * size * 0.72,
    y - size * 0.25,
    headX + facing * size * 0.2,
    y - size * 0.14
  )
  graphics.fillStyle(0x5a3b00, alpha)
  graphics.fillCircle(
    headX + facing * size * 0.08,
    y - size * 0.34,
    size * 0.09
  )

  graphics.lineStyle(1.4, 0x980000, alpha)
  graphics.lineBetween(
    x - size * 0.12,
    y + size * 0.34,
    x - size * 0.12,
    y + size * 0.48
  )
  graphics.lineBetween(
    x + size * 0.18,
    y + size * 0.34,
    x + size * 0.18,
    y + size * 0.48
  )
}

function drawConfusionDucks(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  if (elapsed < 0 || elapsed >= DUCK_DURATION) return

  for (const [index, delay] of DUCK_DELAYS.entries()) {
    const age = elapsed - delay
    if (age < 0 || age >= DUCK_FLIGHT_DURATION) continue

    const progress = age / DUCK_FLIGHT_DURATION
    const lateSpread = clamp((progress - 0.65) / 0.35)
    const distance =
      10 + 40 * Phaser.Math.Easing.Cubic.Out(progress) + 14 * lateSpread
    const angle = DUCK_ANGLES[index]
    const wobble = Math.sin(progress * Math.PI * 2 + index) * 3
    const duckX = x + Math.cos(angle) * distance - Math.sin(angle) * wobble
    const duckY =
      y + Math.sin(angle) * distance + Math.cos(angle) * wobble - progress * 5
    const alpha = clamp(age / 22) * clamp((DUCK_FLIGHT_DURATION - age) / 55)

    drawDuck(
      graphics,
      duckX,
      duckY,
      11 * DUCK_SCALES[index],
      Math.cos(angle) >= 0 ? 1 : -1,
      alpha
    )
  }
}

export const dizzyPunchAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  pokemonsOnBoard,
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
  const targetSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.active &&
      pokemon.positionX === targetX &&
      pokemon.positionY === targetY
  )
  const getImpactCenter = () => {
    const shadow = targetSprite?.shadow
    if (shadow?.active) {
      const frame = shadow.frame
      return shadow
        .getWorldTransformMatrix()
        .transformPoint(
          (frame.x + frame.width / 2 - shadow.displayOriginX) *
            (shadow.flipX ? -1 : 1),
          (frame.y + frame.height / 2 - shadow.displayOriginY) *
            (shadow.flipY ? -1 : 1)
        )
    }

    return targetSprite?.active
      ? targetSprite.getWorldTransformMatrix().transformPoint(0, 5)
      : { x: targetScreenX, y: targetScreenY + 5 }
  }
  const distance = Math.hypot(targetScreenX - casterX, targetScreenY - casterY)
  if (distance === 0) return

  const directionX = (targetScreenX - casterX) / distance
  const directionY = (targetScreenY - casterY) / distance
  const startX = casterX + directionX * 12
  const startY = casterY - 15 + directionY * 12
  const endX = targetScreenX - directionX * 8
  const endY = targetScreenY - 14 - directionY * 8
  const controlX = (startX + endX) / 2
  const controlY = (startY + endY) / 2 - 34
  const impactStart = LEAD_IN + TRAVEL_DURATION
  const duration = impactStart + Math.max(IMPACT_DURATION, DUCK_DURATION)
  const fx = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const impactBackdrop = scene.add
    .graphics()
    .setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
  scene.abilitiesVfxGroup?.add(fx)
  scene.abilitiesVfxGroup?.add(impactBackdrop)

  const timeline = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!fx.active || !impactBackdrop.active) return
      const elapsed = counter.getValue() ?? 0
      fx.clear()
      impactBackdrop.clear()

      if (elapsed < LEAD_IN) {
        drawAnticipation(fx, casterX, casterY, elapsed)
      } else if (elapsed < impactStart) {
        drawStrike(
          fx,
          startX,
          startY,
          controlX,
          controlY,
          endX,
          endY,
          (elapsed - LEAD_IN) / TRAVEL_DURATION
        )
      }

      const impactCenter = getImpactCenter()
      drawImpactBackdrop(
        impactBackdrop,
        impactCenter.x,
        impactCenter.y,
        elapsed - impactStart
      )
      drawImpact(
        fx,
        impactCenter.x,
        impactCenter.y,
        elapsed - impactStart,
        directionX,
        directionY
      )
      drawConfusionDucks(
        fx,
        impactCenter.x,
        impactCenter.y,
        elapsed - impactStart
      )
    },
    onComplete: () => {
      fx.destroy()
      impactBackdrop.destroy()
    }
  })

  fx.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
  impactBackdrop.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
}
