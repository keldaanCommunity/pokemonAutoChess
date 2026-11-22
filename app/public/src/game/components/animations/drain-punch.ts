import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CHARGE_DURATION = 140
const TRAVEL_START = 140
const TRAVEL_DURATION = 300
const IMPACT_START = TRAVEL_START + TRAVEL_DURATION
const IMPACT_DURATION = 230
const RETURN_START = IMPACT_START + IMPACT_DURATION
const RETURN_DURATION = 340
const HEAL_DURATION = 250
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

function drawOrb(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  time: number
) {
  if (alpha <= 0) return

  graphics.fillStyle(0x20ff65, alpha * 0.16)
  graphics.fillCircle(x, y, radius * 1.8)
  graphics.fillStyle(0x35f779, alpha * 0.72)
  graphics.fillCircle(x, y, radius)
  graphics.lineStyle(2, 0x9dff78, alpha * 0.95)
  graphics.strokeCircle(x, y, radius)
  graphics.lineStyle(1, 0xd9ffd0, alpha * 0.8)
  graphics.strokeCircle(x, y, radius * 0.62)
  graphics.fillStyle(0xf4fff0, alpha * 0.96)
  graphics.fillCircle(x - radius * 0.16, y - radius * 0.18, radius * 0.24)

  for (let i = 0; i < 6; i++) {
    const angle = time * 0.008 + (Math.PI * 2 * i) / 6
    const inner = radius * 0.52
    const outer = radius * (0.78 + (i % 2) * 0.12)
    graphics.lineStyle(1, 0xe7ffe0, alpha * 0.72)
    graphics.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer
    )
  }
}

function drawTrail(
  graphics: Phaser.GameObjects.Graphics,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  progress: number,
  time: number
) {
  if (progress <= 0) return

  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.hypot(dx, dy)
  const normalX = distance > 0 ? -dy / distance : 0
  const normalY = distance > 0 ? dx / distance : 0
  for (let i = 0; i < 12; i++) {
    const t = progress - i * 0.055
    if (t <= 0) continue
    const sway = Math.sin(time * 0.014 + i * 1.7) * (2 + i * 0.18)
    const x = startX + dx * t + normalX * sway
    const y = startY + dy * t + normalY * sway
    const alpha = (1 - i / 13) * 0.8
    graphics.fillStyle(i % 3 === 0 ? 0xdfff9c : 0x55ff70, alpha)
    graphics.fillCircle(x, y, i % 4 === 0 ? 2.5 : 1.5)
  }
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  if (elapsed < 0 || elapsed >= IMPACT_DURATION) return

  const progress = elapsed / IMPACT_DURATION
  const fade = 1 - clamp((progress - 0.55) / 0.45)
  const radius = 59 + progress * 10
  graphics.fillStyle(0xff63c5, fade * 0.12)
  graphics.fillCircle(x, y, radius)
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + Math.PI / 12
    const directionX = Math.cos(angle)
    const directionY = Math.sin(angle)
    const inner = radius * 0.35
    const outer = radius * (i % 2 === 0 ? 0.9 : 0.74)
    const width = i % 2 === 0 ? 6 : 4
    graphics.fillStyle(i % 2 === 0 ? 0xf643a7 : 0xff9edc, fade * 0.65)
    graphics.fillTriangle(
      x + directionX * inner - directionY * width,
      y + directionY * inner + directionX * width,
      x + directionX * outer,
      y + directionY * outer,
      x + directionX * inner + directionY * width,
      y + directionY * inner - directionX * width
    )
  }

  graphics.lineStyle(7, 0xffd24f, fade * 0.18)
  graphics.strokeCircle(x, y, radius)
  graphics.lineStyle(2.5, 0xffe45c, fade * 0.92)
  graphics.strokeCircle(x, y, radius)

  const flash = clamp((80 - elapsed) / 65) * fade
  graphics.fillStyle(0xfff9d1, flash * 0.75)
  graphics.fillCircle(x, y, 14)
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 + 0.5
    const distance = radius * (0.82 + (i % 2) * 0.18)
    const sparkX = x + Math.cos(angle) * distance
    const sparkY = y + Math.sin(angle) * distance
    const size = i % 2 === 0 ? 5 : 3
    graphics.fillStyle(i % 2 === 0 ? 0xffa4c8 : 0xffdd66, fade * 0.5)
    graphics.fillCircle(sparkX, sparkY, size + 3)
    graphics.fillStyle(0xfffbe0, fade * 0.9)
    graphics.fillCircle(sparkX, sparkY, size)
  }
}

function drawFist(graphics: Phaser.GameObjects.Graphics) {
  const outline = new Phaser.Curves.Path(-39, 3)
    .cubicBezierTo(-30, -20, -40, -8, -36, -17)
    .cubicBezierTo(10, -31, -15, -29, -3, -33)
    .cubicBezierTo(38, -20, 25, -31, 35, -29)
    .cubicBezierTo(38, 6, 43, -13, 37, -2)
    .cubicBezierTo(43, 26, 44, 10, 44, 20)
    .cubicBezierTo(18, 30, 42, 33, 27, 31)
    .cubicBezierTo(9, 21, 12, 30, 8, 26)
    .cubicBezierTo(-25, 23, -3, 25, -15, 27)
    .cubicBezierTo(-39, 3, -37, 22, -42, 12)
    .closePath()
    .getPoints(72)

  graphics.fillStyle(0xd94e2e, 1)
  graphics.fillPoints(outline, true)
  graphics.lineStyle(2, 0x9d3e28, 1)
  graphics.strokePoints(outline, true)

  const knuckles = [
    { x: -34, y: -11, width: 15, height: 30, color: 0xffc653 },
    { x: -18, y: -20, width: 17, height: 41, color: 0xffd260 },
    { x: 0, y: -24, width: 18, height: 45, color: 0xffdc70 },
    { x: 19, y: -22, width: 17, height: 42, color: 0xffd66a }
  ]
  for (const knuckle of knuckles) {
    graphics.fillStyle(0xf9853b, 1)
    graphics.fillRoundedRect(
      knuckle.x - 1,
      knuckle.y - 1,
      knuckle.width + 2,
      knuckle.height + 2,
      7
    )
    graphics.fillStyle(knuckle.color, 1)
    graphics.fillRoundedRect(
      knuckle.x,
      knuckle.y,
      knuckle.width,
      knuckle.height,
      6
    )
  }

  const thumb = new Phaser.Curves.Path(12, 18)
    .cubicBezierTo(27, 11, 13, 10, 22, 10)
    .cubicBezierTo(38, 13, 31, 5, 37, 6)
    .cubicBezierTo(37, 25, 41, 18, 40, 23)
    .cubicBezierTo(18, 26, 32, 29, 21, 29)
    .cubicBezierTo(12, 18, 12, 25, 11, 22)
    .closePath()
    .getPoints(40)
  graphics.fillStyle(0xffcf61, 1)
  graphics.fillPoints(thumb, true)
  graphics.lineStyle(2, 0xf9853b, 1)
  graphics.strokePoints(thumb, true)
}

function drawHealing(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  if (elapsed < 0 || elapsed >= HEAL_DURATION) return

  const progress = elapsed / HEAL_DURATION
  const fade = (1 - progress) ** 1.4
  graphics.fillStyle(0x91ff7a, fade * 0.16)
  graphics.fillCircle(x, y - 15, 24 + progress * 35)
  graphics.lineStyle(2, 0x9bff83, fade * 0.9)
  graphics.strokeCircle(x, y - 15, 18 + progress * 32)
  graphics.lineStyle(1, 0xe5ffd4, fade * 0.8)
  graphics.strokeCircle(x, y - 15, 10 + progress * 23)

  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + 0.2
    const distance = 25 + progress * 24
    const px = x + Math.cos(angle) * distance
    const py = y - 15 + Math.sin(angle) * distance * 0.7
    graphics.fillStyle(i % 2 === 0 ? 0xf1ffcf : 0x61ff83, fade * 0.9)
    graphics.fillCircle(px, py, i % 3 === 0 ? 2.5 : 1.5)
  }
}

export const drainPunchAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  ap,
  data,
  delay = 0
}: AbilityAnimationArgs) => {
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
  const dx = targetScreenX - casterX
  const dy = targetScreenY - casterY
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return

  const directionX = dx / distance
  const directionY = dy / distance
  const startX = casterX + directionX * 22
  const startY = casterY - 18 + directionY * 16
  const impactX = targetScreenX - directionX * 8
  const impactY = targetScreenY - 20
  const hasHeal =
    typeof data.healReceived === "number" &&
    Number.isFinite(data.healReceived) &&
    data.healReceived > 0
  const duration = hasHeal
    ? RETURN_START + RETURN_DURATION + HEAL_DURATION
    : IMPACT_START + IMPACT_DURATION

  const trail = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const fist = scene.add
    .graphics({ x: impactX, y: impactY })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setAlpha(0)
  drawFist(fist)
  const fistScale = 0.8 * Math.min(10 / 3, 1 + ap / 200)
  scene.abilitiesVfxGroup?.add(trail)
  scene.abilitiesVfxGroup?.add(front)
  scene.abilitiesVfxGroup?.add(fist)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!trail.active || !front.active || !fist.active) return
      const time = counter.getValue() ?? 0
      trail.clear()
      front.clear()

      if (time < IMPACT_START) {
        const progress =
          time < TRAVEL_START
            ? 0
            : clamp((time - TRAVEL_START) / TRAVEL_DURATION)
        const orbX = startX + (impactX - startX) * progress
        const orbY = startY + (impactY - startY) * progress
        const charge = clamp(time / CHARGE_DURATION)
        const radius = time < TRAVEL_START ? 4 + charge * 11 : 15
        drawTrail(trail, startX, startY, impactX, impactY, progress, time)
        drawOrb(front, orbX, orbY, radius, 1, time)
      } else {
        const impactTime = time - IMPACT_START
        const fade = clamp(
          (impactTime - IMPACT_DURATION * 0.55) / (IMPACT_DURATION * 0.45)
        )
        fist.setAlpha(1 - fade).setScale(fistScale * (1 - 0.1 * fade))
        drawImpact(front, impactX, impactY, impactTime)
      }

      if (hasHeal && time >= RETURN_START) {
        const progress = clamp((time - RETURN_START) / RETURN_DURATION)
        const orbX = impactX + (startX - impactX) * progress
        const orbY = impactY + (startY - impactY) * progress
        drawTrail(trail, impactX, impactY, startX, startY, progress, time)
        drawOrb(front, orbX, orbY, 13, 1, time)
        drawHealing(
          front,
          casterX,
          casterY,
          time - (RETURN_START + RETURN_DURATION)
        )
      }
    },
    onComplete: () => {
      if (trail.active) trail.destroy()
      if (front.active) front.destroy()
      if (fist.active) fist.destroy()
    }
  })

  trail.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  fist.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
