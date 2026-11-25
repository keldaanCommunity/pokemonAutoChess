import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const TRAVEL = 300
const RETURN_START = 520
const RETURN_END = 880
const DURATION = 1320
const { Clamp, Linear } = Phaser.Math

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

function drawAntler(graphics: GameObjects.Graphics, side: number) {
  const points = new Phaser.Curves.Path(-38, 6 * side)
    .cubicBezierTo(13, 13 * side, -25, 4 * side, -3, 14 * side)
    .cubicBezierTo(34, 24 * side, 23, 14 * side, 31, 18 * side)
    .cubicBezierTo(44, 49 * side, 40, 31 * side, 46, 40 * side)
    .cubicBezierTo(36, 44 * side, 42, 48 * side, 38, 47 * side)
    .cubicBezierTo(28, 32 * side, 35, 39 * side, 33, 34 * side)
    .cubicBezierTo(21, 28 * side, 26, 29 * side, 23, 28 * side)
    .cubicBezierTo(22, 52 * side, 24, 35 * side, 25, 46 * side)
    .cubicBezierTo(13, 45 * side, 18, 49 * side, 14, 49 * side)
    .cubicBezierTo(11, 25 * side, 13, 39 * side, 15, 30 * side)
    .cubicBezierTo(2, 23 * side, 8, 24 * side, 5, 23 * side)
    .cubicBezierTo(-2, 40 * side, 1, 29 * side, 1, 35 * side)
    .cubicBezierTo(-10, 34 * side, -5, 40 * side, -10, 39 * side)
    .cubicBezierTo(-9, 20 * side, -10, 29 * side, -8, 24 * side)
    .cubicBezierTo(-38, 20 * side, -19, 20 * side, -31, 22 * side)
    .cubicBezierTo(-38, 6 * side, -45, 20 * side, -45, 7 * side)
    .closePath()
    .getPoints(60)
  graphics.fillStyle(0x4a3b22, 1)
  graphics.fillPoints(points, true)
  graphics.lineStyle(1.5, 0x302a19, 0.95)
  graphics.strokePoints(points, true)

  const face = new Phaser.Curves.Path(-37, 9 * side)
    .cubicBezierTo(12, 16 * side, -23, 8 * side, -3, 17 * side)
    .cubicBezierTo(32, 25 * side, 21, 17 * side, 29, 21 * side)
    .cubicBezierTo(42, 46 * side, 38, 31 * side, 43, 41 * side)
    .cubicBezierTo(29, 28 * side, 35, 33 * side, 33, 30 * side)
    .cubicBezierTo(10, 21 * side, 24, 24 * side, 16, 22 * side)
    .cubicBezierTo(-37, 17 * side, -7, 18 * side, -26, 18 * side)
    .closePath()
    .getPoints(44)
  graphics.fillStyle(0xa58a4e, 1)
  graphics.fillPoints(face, true)

  const prong = new Phaser.Curves.Path(14, 22 * side)
    .cubicBezierTo(20, 47 * side, 17, 28 * side, 18, 41 * side)
    .cubicBezierTo(20, 27 * side, 20, 38 * side, 21, 32 * side)
    .closePath()
    .getPoints(20)
  graphics.fillStyle(0xb69c5c, 0.9)
  graphics.fillPoints(prong, true)
  graphics.fillStyle(0x897346, 1)
  graphics.fillTriangle(-8, 19 * side, -6, 33 * side, -2, 22 * side)

  graphics.lineStyle(2, 0xd4c184, 0.8)
  graphics.lineBetween(-34, 10 * side, -12, 12 * side)
  graphics.lineBetween(-12, 12 * side, 10, 17 * side)
  graphics.lineBetween(23, 21 * side, 33, 27 * side)
  graphics.lineStyle(2, 0x73db78, 0.9)
  graphics.lineBetween(-34, 18 * side, -9, 18 * side)
  graphics.lineBetween(-9, 18 * side, 11, 23 * side)
  graphics.lineBetween(20, 26 * side, 29, 29 * side)
  graphics.lineBetween(29, 29 * side, 37, 41 * side)
  graphics.lineBetween(13, 24 * side, 15, 42 * side)
  graphics.lineStyle(1, 0xd1ffab, 1)
  graphics.lineBetween(-30, 17 * side, -12, 17 * side)
  graphics.lineBetween(20, 25 * side, 28, 27 * side)
  graphics.lineBetween(30, 29 * side, 37, 39 * side)
  graphics.lineBetween(-6, 20 * side, -6, 31 * side)
}

function sparkle(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  graphics.fillStyle(0xe9fff0, alpha)
  graphics.fillTriangle(x, y - size, x - size * 0.3, y, x + size * 0.3, y)
  graphics.fillTriangle(x, y + size, x - size * 0.3, y, x + size * 0.3, y)
  graphics.fillTriangle(x - size, y, x, y - size * 0.3, x, y + size * 0.3)
  graphics.fillTriangle(x + size, y, x, y - size * 0.3, x, y + size * 0.3)
}

export const hornLeechAnimation: AbilityAnimation = ({
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
  )
    return

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
  const casterY = casterCellY - 18
  const targetScreenY = targetCellY - 18
  const angle = Math.atan2(targetScreenY - casterY, targetScreenX - casterX)
  const hasRecovery =
    (typeof data.healReceived === "number" && data.healReceived > 0) ||
    (typeof data.shieldReceived === "number" && data.shieldReceived > 0)

  const effect = scene.add.container(0, 0).setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const antlers = scene.add.graphics().setRotation(angle).setAlpha(0)
  const light = scene.add.graphics()
  drawAntler(antlers, -1)
  drawAntler(antlers, 1)
  effect.add([antlers, light])
  scene.abilitiesVfxGroup?.add(effect)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!effect.active) return
      const time = counter.getValue() ?? 0
      const travel = Phaser.Math.Easing.Cubic.Out(Clamp(time / TRAVEL, 0, 1))
      const antlerFade = 1 - Clamp((time - 390) / 170, 0, 1)
      const nod =
        time < TRAVEL
          ? -0.22 +
            0.48 * Phaser.Math.Easing.Sine.InOut(Clamp(time / TRAVEL, 0, 1))
          : 0.26 *
            (1 -
              Phaser.Math.Easing.Cubic.Out(Clamp((time - TRAVEL) / 170, 0, 1)))
      antlers
        .setPosition(
          Linear(casterX, targetScreenX, travel),
          Linear(casterY, targetScreenY, travel)
        )
        .setRotation(angle + nod)
        .setAlpha(Clamp(time / 40, 0, 1) * antlerFade)
      light.clear()

      if (time < TRAVEL) {
        const x = Linear(casterX, targetScreenX, travel)
        const y = Linear(casterY, targetScreenY, travel)
        for (let i = 0; i < 3; i++) {
          const a = angle + (i * Math.PI * 2) / 3 + time / 300
          sparkle(
            light,
            x + Math.cos(a) * 34,
            y + Math.sin(a) * 34,
            i === 0 ? 4 : 2.5,
            Clamp(time / 60, 0, 1) * 0.75
          )
        }
      }

      if (time >= TRAVEL && time < 540) {
        const progress = (time - TRAVEL) / 240
        const fade = 1 - progress
        light.fillStyle(0x89ff79, fade * 0.45)
        light.fillCircle(targetScreenX, targetScreenY, 17 + progress * 18)
        light.fillStyle(0xffef86, fade * 0.95)
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + 0.15
          const r = 21 + progress * 16
          light.fillTriangle(
            targetScreenX + Math.cos(a - 0.22) * 8,
            targetScreenY + Math.sin(a - 0.22) * 8,
            targetScreenX + Math.cos(a) * r,
            targetScreenY + Math.sin(a) * r,
            targetScreenX + Math.cos(a + 0.22) * 8,
            targetScreenY + Math.sin(a + 0.22) * 8
          )
        }
        light.fillStyle(0xf7fff0, fade * 0.95)
        light.fillCircle(targetScreenX, targetScreenY, 11 * fade + 3)
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5 + 0.4
          sparkle(
            light,
            targetScreenX + Math.cos(a) * (27 + progress * 12),
            targetScreenY + Math.sin(a) * (27 + progress * 12),
            4,
            fade
          )
        }
      }

      if (time >= RETURN_START && time < RETURN_END) {
        const progress = Phaser.Math.Easing.Cubic.Out(
          (time - RETURN_START) / (RETURN_END - RETURN_START)
        )
        const x = Linear(targetScreenX, casterX, progress)
        const y = Linear(targetScreenY, casterY, progress)
        for (let i = 4; i >= 1; i--) {
          const t = Math.max(0, progress - i * 0.045)
          light.fillStyle(0x83ffb1, 0.28 * (1 - i / 5))
          light.fillCircle(
            Linear(targetScreenX, casterX, t),
            Linear(targetScreenY, casterY, t),
            7 - i
          )
        }
        light.fillStyle(0x67ffc2, 0.35)
        light.fillCircle(x, y, 17)
        light.fillStyle(0x9fffe0, 0.9)
        light.fillCircle(x, y, 11)
        light.fillStyle(0xffffff, 0.95)
        light.fillCircle(x, y, 6)
        sparkle(light, x, y, 14, 0.9)
      }

      if (hasRecovery && time >= RETURN_END) {
        const progress = (time - RETURN_END) / (DURATION - RETURN_END)
        const fade = 1 - progress
        light.fillStyle(0x6fffad, fade * 0.25)
        light.fillCircle(casterX, casterY, 19 + progress * 15)
        light.lineStyle(2.5, 0xb4ffda, fade * 0.95)
        light.strokeCircle(casterX, casterY, 19 + progress * 20)
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + 0.3
          const r = 20 + progress * 23
          sparkle(
            light,
            casterX + Math.cos(a) * r,
            casterY + Math.sin(a) * r * 0.8,
            i % 2 ? 3.5 : 6,
            fade
          )
        }
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
