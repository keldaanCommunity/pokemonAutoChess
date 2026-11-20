import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const OUTBOUND_DURATION = 360
const IMPACT_DURATION = 160
const RETURN_DURATION = 360
const DURATION = OUTBOUND_DURATION + IMPACT_DURATION + RETURN_DURATION
const ORB_COLORS = [0xff77c8, 0xffc56a, 0xf8f36e, 0x79f0bb, 0x73caff, 0xc98bff]
const WHITE = 0xfffaff

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

function drawOrb(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  time: number,
  alpha: number
) {
  const radius = (12 + Math.sin(time * 0.018) * 1.2) * 1.5
  const rotation = time * 0.0015
  graphics.fillStyle(0xc493ff, alpha * 0.055)
  graphics.fillCircle(x, y, radius * 2.8)
  graphics.fillStyle(0x8deaff, alpha * 0.1)
  graphics.fillCircle(x, y, radius * 2)
  graphics.fillStyle(0x9b85ff, alpha * 0.16)
  graphics.fillCircle(x, y, radius * 1.28)
  graphics.fillStyle(0x71dcff, alpha * 0.48)
  graphics.fillCircle(x, y, radius * 0.94)

  for (let i = 0; i < ORB_COLORS.length; i++) {
    const angle = rotation + (i / ORB_COLORS.length) * Math.PI * 2
    graphics.fillStyle(ORB_COLORS[i]!, alpha * 0.24)
    graphics.fillCircle(
      x + Math.cos(angle) * radius * 0.28,
      y + Math.sin(angle) * radius * 0.22,
      radius * 0.57
    )
  }

  graphics.fillStyle(0xc8fbff, alpha * 0.52)
  graphics.fillCircle(x, y, radius * 0.5)
  graphics.fillStyle(WHITE, alpha * 0.78)
  graphics.fillCircle(x - radius * 0.2, y - radius * 0.24, radius * 0.2)

  for (let strand = 0; strand < 3; strand++) {
    const phase = rotation * 4 + strand * 2.1
    graphics.lineStyle(
      1,
      strand === 1 ? WHITE : ORB_COLORS[strand * 2]!,
      alpha * 0.45
    )
    graphics.beginPath()
    for (let step = 0; step <= 8; step++) {
      const progress = step / 8
      const localX = (progress * 2 - 1) * radius * 0.63
      const localY = Math.sin(progress * Math.PI * 2 + phase) * radius * 0.22
      if (step === 0) graphics.moveTo(x + localX, y + localY)
      else graphics.lineTo(x + localX, y + localY)
    }
    graphics.strokePath()
  }
}

function drawWindTrail(
  graphics: GameObjects.Graphics,
  pathAt: (progress: number) => [number, number],
  progress: number,
  time: number
) {
  const length = Math.min(progress, 0.3)
  if (length <= 0.015) return

  const end = progress
  const start = progress - length
  const [headX, headY] = pathAt(Math.min(1, end))
  const [tailX, tailY] = pathAt(Math.max(0, start))
  const dx = headX - tailX
  const dy = headY - tailY
  const magnitude = Math.hypot(dx, dy) || 1
  const normalX = -dy / magnitude
  const normalY = dx / magnitude

  for (let strand = -1; strand <= 1; strand++) {
    const color = strand === 0 ? WHITE : strand < 0 ? 0x78edff : 0xff9fdf
    const segments = 9
    for (let i = 0; i < segments; i++) {
      const from = start + (length * i) / segments
      const to = start + (length * (i + 1)) / segments
      const [x1, y1] = pathAt(Math.max(0, from))
      const [x2, y2] = pathAt(Math.min(1, to))
      const wave1 = Math.sin(from * 32 + time * 0.012 + strand) * 3
      const wave2 = Math.sin(to * 32 + time * 0.012 + strand) * 3
      const fade = (i / segments) * 0.62
      graphics.lineStyle(
        strand === 0 ? 2 : 1.3,
        color,
        fade * (0.8 - Math.abs(strand) * 0.15)
      )
      graphics.lineBetween(
        x1 + normalX * (strand * 5 + wave1),
        y1 + normalY * (strand * 5 + wave1),
        x2 + normalX * (strand * 5 + wave2),
        y2 + normalY * (strand * 5 + wave2)
      )
    }
  }
}

function drawImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  progress: number,
  alpha: number,
  time: number
) {
  const fade = 1 - progress
  const expansion = Phaser.Math.Easing.Cubic.Out(progress)
  const flash = Math.max(0, 1 - progress * 4)
  graphics.fillStyle(0xff9fe0, alpha * fade * 0.2)
  graphics.fillEllipse(x, y, 44 + expansion * 26, 28 + expansion * 18)
  graphics.fillStyle(WHITE, alpha * flash * 0.62)
  graphics.fillCircle(x, y, 6 + flash * 8)
  graphics.lineStyle(2.5, 0xffb0e8, alpha * fade * 0.9)
  graphics.strokeCircle(x, y, 10 + expansion * 29)
  graphics.lineStyle(1.5, 0x9feeff, alpha * fade * 0.9)
  graphics.strokeCircle(x, y, 7 + expansion * 21)

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + time * 0.004
    const inner = 5 + expansion * 9
    const outer = 18 + expansion * 31
    graphics.lineStyle(
      i % 2 === 0 ? 2 : 1.2,
      i % 2 ? 0xffa7e4 : 0xa2f4ff,
      alpha * fade * 0.9
    )
    graphics.lineBetween(
      x + Math.cos(angle) * inner,
      y + Math.sin(angle) * inner * 0.72,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer * 0.72
    )
    if (i % 2 === 0 && progress < 0.7) {
      const particleRadius = 18 + expansion * 31
      graphics.fillStyle(WHITE, alpha * fade * 0.85)
      graphics.fillCircle(
        x + Math.cos(angle) * particleRadius,
        y + Math.sin(angle) * particleRadius * 0.72,
        2.4 * fade
      )
    }
  }
}

export const heartSwapAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay
}: AbilityAnimationArgs) => {
  if (!isCell(targetX, targetY)) return

  const [casterX, casterWorldY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetWorldX, targetWorldYBase] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const casterY = casterWorldY - 20
  const targetWorldY = targetWorldYBase - 20
  const dx = targetWorldX - casterX
  const dy = targetWorldY - casterY
  const distance = Math.hypot(dx, dy) || 1
  const controlX = (casterX + targetWorldX) / 2 - (dy / distance) * 12
  const controlY = (casterY + targetWorldY) / 2 + (dx / distance) * 12
  const pathAt = (progress: number): [number, number] => {
    const inverse = 1 - progress
    return [
      inverse * inverse * casterX +
        2 * inverse * progress * controlX +
        progress * progress * targetWorldX,
      inverse * inverse * casterY +
        2 * inverse * progress * controlY +
        progress * progress * targetWorldY
    ]
  }

  const graphics = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(graphics)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!graphics.active) return
      const time = counter.getValue() ?? 0
      graphics.clear()

      let orbX: number
      let orbY: number
      let travelProgress: number
      let returning = false
      let orbAlpha = 1
      if (time < OUTBOUND_DURATION) {
        travelProgress = Phaser.Math.Easing.Cubic.InOut(
          time / OUTBOUND_DURATION
        )
        ;[orbX, orbY] = pathAt(travelProgress)
      } else if (time < OUTBOUND_DURATION + IMPACT_DURATION) {
        travelProgress = 1
        ;[orbX, orbY] = pathAt(travelProgress)
        drawImpact(
          graphics,
          targetWorldX,
          targetWorldY,
          (time - OUTBOUND_DURATION) / IMPACT_DURATION,
          1,
          time
        )
      } else {
        returning = true
        travelProgress = Phaser.Math.Easing.Cubic.InOut(
          (time - OUTBOUND_DURATION - IMPACT_DURATION) / RETURN_DURATION
        )
        ;[orbX, orbY] = pathAt(1 - travelProgress)
      }

      if (time > DURATION - 120) {
        orbAlpha = 1 - (time - (DURATION - 120)) / 120
      }

      if (time < OUTBOUND_DURATION) {
        drawWindTrail(graphics, pathAt, travelProgress, time)
      } else if (returning) {
        drawWindTrail(
          graphics,
          (progress) => pathAt(1 - progress),
          travelProgress,
          time
        )
      }
      drawOrb(graphics, orbX, orbY, time, orbAlpha)

      if (returning && travelProgress > 0.88) {
        const arrival = (travelProgress - 0.88) / 0.12
        graphics.lineStyle(1.5, 0xffc4ec, (1 - arrival) * 0.75)
        graphics.strokeCircle(casterX, casterY, 10 + arrival * 18)
      }
    },
    onComplete: () => graphics.destroy()
  })

  graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
