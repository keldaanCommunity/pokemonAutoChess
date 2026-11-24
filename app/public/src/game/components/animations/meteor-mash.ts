import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const TRAVEL = 280
const STAGGER = 170
const IMPACT = 330
const DURATION = TRAVEL + STAGGER * 3 + IMPACT + 60
const BLUE = 0x69edff
const YELLOW = 0xffee44
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function star(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  color: number,
  alpha: number,
  rotation = 0
) {
  const points: Phaser.Math.Vector2[] = []
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + rotation + (i * Math.PI) / 5
    const r = radius * (i % 2 ? 0.48 : 1)
    points.push(
      new Phaser.Math.Vector2(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
    )
  }
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
}

function fist(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  alpha: number
) {
  const scale = 0.85
  const outline = new Phaser.Curves.Path(-23, 5)
    .cubicBezierTo(-18, -13, -26, -3, -23, -10)
    .cubicBezierTo(10, -20, -9, -18, 2, -21)
    .cubicBezierTo(22, -13, 17, -20, 22, -18)
    .cubicBezierTo(22, 4, 25, -8, 22, -2)
    .cubicBezierTo(25, 16, 27, 8, 27, 14)
    .cubicBezierTo(8, 18, 22, 21, 14, 20)
    .cubicBezierTo(-16, 17, 0, 20, -9, 20)
    .cubicBezierTo(-23, 5, -23, 15, -25, 10)
    .closePath()
    .getPoints(40)
    .map((point) => point.scale(scale).add(new Phaser.Math.Vector2(x, y)))
  graphics.fillStyle(BLUE, alpha)
  graphics.fillPoints(outline, true)
  const tops = [-9, -14, -17, -15]
  const bottoms = [12, 14, 14, 12]
  for (let i = 0; i < 4; i++) {
    graphics.fillStyle(i % 2 ? 0xfff78c : YELLOW, alpha)
    graphics.fillRoundedRect(
      x + (-20 + i * 10) * scale,
      y + tops[i] * scale,
      9 * scale,
      (bottoms[i] - tops[i]) * scale,
      4 * scale
    )
  }
  graphics.fillStyle(0xffef64, alpha)
  graphics.fillRoundedRect(
    x + 9 * scale,
    y + 8 * scale,
    13 * scale,
    8 * scale,
    4 * scale
  )
}

export const meteorMashAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay,
  data
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const validTarget =
    Number.isInteger(targetX) &&
    Number.isInteger(targetY) &&
    targetX >= 0 &&
    targetX < BOARD_WIDTH &&
    targetY >= 0 &&
    targetY < BOARD_HEIGHT &&
    (targetX !== positionX || targetY !== positionY)
  const [tx, ty] = validTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [x, y]
  const dx = tx - x
  const dy = ty - y
  const distance = Math.hypot(dx, dy)
  const nx = distance ? -dy / distance : 0
  const ny = distance ? dx / distance : 0
  const hits = data?.hits === 4 ? 4 : 3
  const container = scene.add.container(x, y - 20).setDepth(DEPTH.PROJECTILE)
  const caster = scene.add.graphics()
  const trail = scene.add.graphics()
  const meteor = scene.add.graphics()
  const impact = scene.add.graphics()
  container.add([caster, trail, meteor, impact])
  scene.abilitiesVfxGroup?.add(container)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!container.active) return
      const elapsed = counter.progress * DURATION
      caster.clear()
      trail.clear()
      meteor.clear()
      impact.clear()

      const casterAlpha =
        clamp(elapsed / 45) * (1 - clamp((elapsed - 350) / 230))
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + elapsed / 550
        const radius = 14 + (i % 3) * 7
        star(
          caster,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.75,
          i % 2 ? 5 : 7,
          i % 2 ? BLUE : YELLOW,
          casterAlpha * 0.9,
          angle
        )
      }

      if (!validTarget) return
      for (let shot = 0; shot < hits; shot++) {
        const age = elapsed - shot * STAGGER
        const progress = age / TRAVEL
        if (progress >= 0 && progress < 1) {
          const px = dx * progress
          const py = dy * progress
          for (let i = 0; i < 7; i++) {
            const trailProgress = progress - (i + 1) * 0.065
            if (trailProgress < 0) continue
            const spread = Math.sin(i * 2.4 + shot) * (3 + i * 1.4)
            star(
              trail,
              dx * trailProgress + nx * spread,
              dy * trailProgress + ny * spread,
              5 - i * 0.45,
              i % 2 ? BLUE : YELLOW,
              (1 - i / 8) * 0.8,
              i * 0.5
            )
          }
          star(
            meteor,
            px,
            py,
            15,
            shot % 2 ? BLUE : YELLOW,
            0.95,
            progress * 0.7
          )
          star(meteor, px, py, 8, 0xffffff, 0.8, progress * 0.7)
        }

        const impactAge = age - TRAVEL
        if (impactAge < 0 || impactAge >= IMPACT) continue
        const p = impactAge / IMPACT
        const alpha = clamp(impactAge / 25) * (1 - clamp((p - 0.5) / 0.5))
        const explosionScale = 1.15
        const expansion = (0.65 + p * 0.85) * explosionScale
        star(impact, dx, dy, 29 * expansion, YELLOW, alpha * 0.85, p * 0.2)
        star(impact, dx, dy, 21 * expansion, BLUE, alpha * 0.8, 0.35 - p * 0.2)
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12 + shot * 0.47
          const radius = (14 + p * (28 + (i % 3) * 7)) * explosionScale
          star(
            impact,
            dx + Math.cos(angle) * radius,
            dy + Math.sin(angle) * radius,
            (4 + (i % 3)) * explosionScale,
            i % 2 ? BLUE : YELLOW,
            alpha,
            angle
          )
        }
        fist(impact, dx, dy, alpha)
      }
    },
    onComplete: () => container.destroy()
  })
  container.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
