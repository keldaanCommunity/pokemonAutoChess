import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const TRAVEL_DURATION = 190
const EFFECT_DURATION = 500
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function getBeamLine(args: AbilityAnimationArgs) {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isInteger(targetX) ||
    !Number.isInteger(targetY) ||
    targetX < 0 ||
    targetX >= BOARD_WIDTH ||
    targetY < 0 ||
    targetY >= BOARD_HEIGHT ||
    (targetX === positionX && targetY === positionY)
  ) {
    return null
  }

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const startY = y - 20
  const targetYOnScreen = targetScreenY - 20
  const dx = targetScreenX - x
  const dy = targetYOnScreen - startY
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  const angle = Math.atan2(dy, dx)
  const startOffset = Math.min(12, length * 0.2)
  return {
    x: x + Math.cos(angle) * startOffset,
    y: startY + Math.sin(angle) * startOffset,
    angle,
    length: length - startOffset,
    targetX: targetScreenX,
    targetY: targetYOnScreen
  }
}

function drawHalo(
  back: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number
) {
  back.clear()
  front.clear()

  const appear = clamp(elapsed / 55)
  const fade = 1 - clamp((elapsed - 300) / 150)
  const alpha = appear * fade
  if (alpha <= 0) return

  const pulse = Math.sin(elapsed / 24) * 2
  const rotation = elapsed * 0.006
  back.fillStyle(0x5634cf, alpha * 0.2)
  back.fillCircle(x, y, 24 + pulse)
  back.lineStyle(2.5, 0x8e6cff, alpha * 0.9)
  back.strokeCircle(x, y, 27 + pulse)

  front.lineStyle(2, 0x8edfff, alpha * 0.9)
  front.beginPath()
  front.arc(x, y, 22 + pulse, rotation, rotation + Math.PI * 1.35)
  front.strokePath()
  front.lineStyle(1.5, 0xf3a4ff, alpha * 0.8)
  front.beginPath()
  front.arc(
    x,
    y,
    30 + pulse,
    Math.PI - rotation * 0.7,
    Math.PI * 2.15 - rotation * 0.7
  )
  front.strokePath()

  front.fillStyle(0x7157ff, alpha * 0.8)
  front.fillCircle(x, y, 8)
  front.fillStyle(0x9feaff, alpha * 0.95)
  front.fillCircle(x, y, 5)
  front.fillStyle(0xffffff, alpha)
  front.fillCircle(x, y, 2.5)

  for (let i = 0; i < 7; i++) {
    const angle = rotation + (i / 7) * Math.PI * 2
    const radius = 30 + Math.sin(elapsed / 20 + i) * 3
    front.fillStyle(i % 2 ? 0xf28cff : 0x7cecff, alpha * 0.9)
    front.fillCircle(
      x + Math.cos(angle) * radius,
      y + Math.sin(angle) * radius,
      i % 3 === 0 ? 2 : 1.4
    )
  }
}

function drawBeam(
  graphics: Phaser.GameObjects.Graphics,
  length: number,
  elapsed: number
) {
  graphics.clear()
  const progress = clamp(elapsed / TRAVEL_DURATION)
  const fade = 1 - clamp((elapsed - TRAVEL_DURATION - 100) / 140)
  const end = length * progress
  if (end <= 0 || fade <= 0) return

  graphics.lineStyle(13, 0x6533d9, fade * 0.48)
  graphics.lineBetween(0, 0, end, 0)
  graphics.lineStyle(8, 0xb258ff, fade * 0.8)
  graphics.lineBetween(0, 0, end, 0)
  graphics.lineStyle(5, 0xf0a3ff, fade * 0.95)
  graphics.lineBetween(0, 0, end, 0)
  graphics.lineStyle(2.5, 0xffffff, fade)
  graphics.lineBetween(0, 0, end, 0)

  graphics.fillStyle(0x83eaff, fade * 0.95)
  graphics.fillCircle(end, 0, 5)
  graphics.fillStyle(0xffffff, fade)
  graphics.fillCircle(end, 0, 2.5)
}

function drawImpact(graphics: Phaser.GameObjects.Graphics, elapsed: number) {
  graphics.clear()
  const local = elapsed - TRAVEL_DURATION
  const appear = clamp(local / 22)
  const fade = 1 - clamp((local - 70) / 150)
  const alpha = appear * fade
  if (alpha <= 0) return

  const expansion = 1 + clamp(local / 100) * 0.35
  const rotation = local * 0.003
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + rotation
    const inner = 5 + (i % 2) * 2
    const outer = (17 + (i % 3) * 6) * expansion
    graphics.lineStyle(
      i % 2 ? 2.2 : 3.2,
      i % 3 === 0 ? 0xf39aff : 0x70edff,
      alpha
    )
    graphics.lineBetween(
      Math.cos(angle) * inner,
      Math.sin(angle) * inner,
      Math.cos(angle) * outer,
      Math.sin(angle) * outer
    )
  }

  graphics.fillStyle(0x77eaff, alpha * 0.4)
  graphics.fillCircle(0, 0, 10 * expansion)
  graphics.fillStyle(0xf19cff, alpha * 0.6)
  graphics.fillCircle(0, 0, 6 * expansion)
  graphics.fillStyle(0xffffff, alpha)
  graphics.fillCircle(0, 0, 3.5)
}

export const twinBeamAnimation: AbilityAnimation = (args) => {
  const line = getBeamLine(args)
  if (!line) return

  const { scene } = args
  const beam = scene.add
    .graphics({ x: line.x, y: line.y })
    .setRotation(line.angle)
    .setDepth(DEPTH.PROJECTILE)
  const impact = scene.add
    .graphics({ x: line.targetX, y: line.targetY })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const visuals: Phaser.GameObjects.Graphics[] = [beam, impact]
  let haloBack: Phaser.GameObjects.Graphics | undefined
  let haloFront: Phaser.GameObjects.Graphics | undefined

  if (args.data.beamIndex !== 1) {
    haloBack = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    haloFront = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    visuals.push(haloBack, haloFront)
  }

  const [casterX, casterY] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  const tween = scene.tweens.addCounter({
    from: 0,
    to: EFFECT_DURATION,
    delay: Math.max(0, args.delay ?? 0),
    duration: EFFECT_DURATION,
    onUpdate: (counter) => {
      const elapsed = counter.getValue() ?? 0
      if (visuals.some((visual) => !visual.active)) return
      if (haloBack && haloFront) {
        drawHalo(haloBack, haloFront, casterX, casterY - 20, elapsed)
      }
      drawBeam(beam, line.length, elapsed)
      drawImpact(impact, elapsed)
    },
    onComplete: () => beam.destroy()
  })
  beam.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    impact.destroy()
    haloBack?.destroy()
    haloFront?.destroy()
  })

  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))
}
