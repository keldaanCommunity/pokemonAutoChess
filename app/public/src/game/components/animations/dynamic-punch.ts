import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { drawEllipseArc, isBoardCell } from "./helpers"

const PUNCHES = [0, 1, 2, 3, 4, 5] as const
const PUNCH_STAGGER = 85
const PUNCH_TRAVEL = 155
const IMPACT_DURATION = 150
const DURATION = 820
const CLAMP = Phaser.Math.Clamp

function drawImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number,
  index: number
) {
  if (elapsed < 0 || elapsed >= IMPACT_DURATION) return

  const progress = elapsed / IMPACT_DURATION
  const alpha = CLAMP(elapsed / 24, 0, 1) * (1 - progress) ** 1.4
  const rotation = (index % 2 === 0 ? 1 : -1) * (index * 0.17)
  const inner = 3 + progress * 5

  graphics.fillStyle(0xff8b20, alpha * 0.38)
  graphics.fillEllipse(x, y, 44 + progress * 18, 30 + progress * 12)

  for (let ray = 0; ray < 9; ray++) {
    const angle = rotation + (ray * Math.PI * 2) / 9
    const directionX = Math.cos(angle)
    const directionY = Math.sin(angle)
    const length = (ray % 2 === 0 ? 27 : 18) + progress * 14
    const width = ray % 2 === 0 ? 5 : 3
    graphics.fillStyle(ray % 3 === 0 ? 0xff8d1c : 0xffcf48, alpha * 0.92)
    graphics.fillTriangle(
      x + directionX * inner - directionY * width,
      y + directionY * inner + directionX * width,
      x + directionX * length,
      y + directionY * length,
      x + directionX * inner + directionY * width,
      y + directionY * inner - directionX * width
    )
  }

  const flash = CLAMP((76 - elapsed) / 50, 0, 1) * alpha
  graphics.fillStyle(0xffffb3, flash)
  graphics.fillCircle(x, y, 8 + progress * 5)
  graphics.lineStyle(2, 0xffffe0, flash)
  graphics.strokeCircle(x, y, 5 + progress * 7)
}

function drawHalo(
  behind: GameObjects.Graphics,
  front: GameObjects.Graphics,
  time: number,
  duration: number
) {
  const fadeIn = CLAMP(time / 90, 0, 1)
  const fadeOut = CLAMP((duration - time) / 190, 0, 1)
  const energy = fadeIn * fadeOut
  const pulse = 1 + Math.sin(time * 0.016) * 0.035

  behind.clear()
  front.clear()
  behind.setRotation(time * 0.0014).setScale(pulse)
  front.setRotation(time * 0.0014).setScale(pulse)
  behind.fillStyle(0xffad2f, energy * 0.07)
  behind.fillEllipse(0, 0, 48, 25)
  drawEllipseArc(
    behind,
    0,
    0,
    28,
    15,
    Math.PI,
    Math.PI * 2,
    0xffb83f,
    energy * 0.78,
    2.5,
    16
  )
  drawEllipseArc(
    front,
    0,
    0,
    28,
    15,
    0,
    Math.PI,
    0xffe58b,
    energy * 0.58,
    2.5,
    16
  )
}

export const dynamicPunchAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  ap,
  delay = 0
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const haloBack = scene.add
    .graphics({ x: casterX, y: casterY - 12 })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const haloFront = scene.add
    .graphics({ x: casterX, y: casterY - 12 })
    .setDepth(DEPTH.ABILITY_MINOR)
  scene.abilitiesVfxGroup?.add(haloBack)
  scene.abilitiesVfxGroup?.add(haloFront)

  const hasTarget =
    isBoardCell(targetX, targetY) &&
    (targetX !== positionX || targetY !== positionY)
  const impacts = hasTarget
    ? scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    : null
  if (impacts) scene.abilitiesVfxGroup?.add(impacts)

  if (hasTarget && impacts) {
    const [targetScreenX, targetScreenY] = transformEntityCoordinates(
      targetX,
      targetY,
      flip
    )
    const dx = targetScreenX - casterX
    const dy = targetScreenY - casterY
    const distance = Math.hypot(dx, dy)
    if (distance > 0) {
      const directionX = dx / distance
      const directionY = dy / distance
      const normalX = -directionY
      const normalY = directionX
      const scale = 2.4 * CLAMP(1 + Math.max(0, ap) / 800, 1, 1.3)
      const lanes = [-12, 8, -5, 13, -9, 4]
      const aimOffsets = [8, -10, 3, 12, -6, -2]

      for (const index of PUNCHES) {
        const lane = lanes[index]
        const aimOffset = aimOffsets[index]
        const startX = casterX + directionX * 20 + normalX * lane
        const startY = casterY - 13 + directionY * 20 + normalY * lane
        const endX = targetScreenX - directionX * 5 + normalX * aimOffset
        const endY = targetScreenY - 18 + directionY * -5 + normalY * aimOffset
        const fist = scene.add
          .sprite(startX, startY, "attacks", "FIGHTING/melee/000.png")
          .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
          .setScale(scale * 0.8)
          .setRotation(Math.atan2(endY - startY, endX - startX))
          .setTint(0xffc64a)
          .setAlpha(0)
        if (scene.anims.exists("FIGHTING/melee")) {
          fist.play({ key: "FIGHTING/melee", repeat: -1 })
        }
        scene.abilitiesVfxGroup?.add(fist)

        const fistTween = scene.tweens.chain({
          targets: fist,
          delay: Math.max(0, delay) + 55 + index * PUNCH_STAGGER,
          tweens: [
            {
              x: endX,
              y: endY,
              alpha: 1,
              scaleX: scale,
              scaleY: scale,
              duration: PUNCH_TRAVEL,
              ease: Phaser.Math.Easing.Cubic.In
            },
            {
              alpha: 0,
              scaleX: scale * 0.85,
              scaleY: scale * 0.85,
              duration: 55,
              ease: Phaser.Math.Easing.Quadratic.Out
            }
          ],
          onComplete: () => fist.destroy()
        })
        fist.once(Phaser.GameObjects.Events.DESTROY, () => fistTween.stop())
      }

      const timeline = scene.tweens.addCounter({
        from: 0,
        to: DURATION,
        duration: DURATION,
        delay: Math.max(0, delay),
        onUpdate: (counter) => {
          if (!haloBack.active || !haloFront.active || !impacts.active) return
          const time = counter.getValue() ?? 0
          drawHalo(haloBack, haloFront, time, DURATION)

          impacts.clear()
          for (const index of PUNCHES) {
            const aimOffset = aimOffsets[index]
            const hitX = targetScreenX + normalX * aimOffset
            const hitY = targetScreenY - 18 + normalY * aimOffset
            const hitTime = 55 + index * PUNCH_STAGGER + PUNCH_TRAVEL
            drawImpact(impacts, hitX, hitY, time - hitTime, index)
          }
        },
        onComplete: () => {
          haloBack.destroy()
          haloFront.destroy()
          impacts.destroy()
        }
      })
      haloBack.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
      haloFront.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
      impacts.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
      return
    }
  }

  const timeline = scene.tweens.addCounter({
    from: 0,
    to: 560,
    duration: 560,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!haloBack.active || !haloFront.active) return
      const time = counter.getValue() ?? 0
      drawHalo(haloBack, haloFront, time, 560)
    },
    onComplete: () => {
      haloBack.destroy()
      haloFront.destroy()
    }
  })
  haloBack.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
  haloFront.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
}
