import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 920
const TRAVEL = 150
const IMPACT_DURATION = 150
const SLASH_SCALE = 1.05
const IMPACT_SCALE = 1.4
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function drawSlash(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  curvature: number,
  width: number,
  color: number,
  alpha: number,
  jagged = false,
  start = 0,
  end = 1,
  separation = 0
) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const points: Phaser.Math.Vector2[] = []
  const edge = [0.6, 1, 0.8, 1.15, 0.65, 1, 0.8, 1.2, 0.65, 1, 0.8, 1, 0.6]
  for (const side of [-1, 1]) {
    for (let step = 0; step <= 12; step++) {
      const pointIndex = side === -1 ? step : 12 - step
      const progress = pointIndex / 12
      const t = start + (end - start) * progress
      const along = (t - 0.5) * 78
      const taper = Math.sin(Math.PI * progress)
      const across = curvature * Math.sin(Math.PI * t) + separation * taper
      const irregularity = jagged && side === -1 ? edge[pointIndex] : 1
      const thickness = side * width * taper * irregularity
      points.push(
        new Phaser.Math.Vector2(
          x + (along * cos - (across + thickness) * sin) * SLASH_SCALE,
          y + (along * sin + (across + thickness) * cos) * SLASH_SCALE
        )
      )
    }
  }
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
}

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

export const closeCombatAnimation: AbilityAnimation = ({
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

  const casterSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.positionX === positionX && pokemon.positionY === positionY
  )
  const ground = scene.add
    .graphics({ x: casterX, y: casterY + 5 })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  if (casterSprite) {
    ground.setPosition(0, 5)
    casterSprite.addAt(ground, casterSprite.getIndex(casterSprite.sprite))
  }
  const behind = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(behind)
  scene.abilitiesVfxGroup?.add(front)

  const casterAngle = Math.atan2(
    targetScreenY - casterY,
    targetScreenX - casterX
  )
  const strikeAngles = [
    casterAngle - 1.15,
    casterAngle + 0.95,
    casterAngle - 0.48,
    casterAngle + 1.42,
    casterAngle + 0.28
  ]
  const strikeOffsets = [-9, 8, -3, 10, 0]
  const strikeStarts = [0, 115, 230, 345, 460]
  const lastSlashEnd = strikeStarts[strikeStarts.length - 1] + TRAVEL
  const directionX = Math.cos(casterAngle)
  const directionY = Math.sin(casterAngle)
  const normalX = -directionY
  const normalY = directionX

  const timeline = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!ground.active || !behind.active || !front.active) return
      const time = counter.getValue() ?? 0
      ground.clear()
      behind.clear()
      front.clear()

      const halo = clamp(time / 70) * clamp((lastSlashEnd + 150 - time) / 150)
      if (halo > 0) {
        const shadow = casterSprite?.shadow
        if (shadow) {
          const frame = shadow.frame
          ground.setPosition(
            shadow.x +
              (frame.x + frame.width / 2 - shadow.displayOriginX) *
                shadow.scaleX *
                (shadow.flipX ? -1 : 1),
            shadow.y +
              (frame.y + frame.height / 2 - shadow.displayOriginY) *
                shadow.scaleY *
                (shadow.flipY ? -1 : 1)
          )
        }
        const growth = Math.min(time, 140)
        const width = 64 + growth * 0.1
        const height = 25 + growth * 0.04
        ground.fillStyle(0xff3b24, halo * 0.35)
        ground.fillEllipse(0, 0, width, height)
        ground.lineStyle(5, 0xff3b24, halo * 0.75)
        ground.strokeEllipse(0, 0, width, height)
        ground.lineStyle(3, 0xff6339, halo)
        ground.strokeEllipse(0, 0, width - 5, height - 4)
        ground.lineStyle(2, 0xfff4db, halo)
        ground.strokeEllipse(0, 0, width - 12, height - 9)
      }

      strikeStarts.forEach((start, index) => {
        const elapsed = time - start
        if (elapsed < 0 || elapsed >= TRAVEL + IMPACT_DURATION) return

        const angle = strikeAngles[index] ?? casterAngle
        const offset = strikeOffsets[index] ?? 0
        const hitX = targetScreenX + normalX * offset
        const hitY = targetScreenY - 8 + normalY * offset

        if (elapsed < TRAVEL) {
          const progress = elapsed / TRAVEL
          const x = Phaser.Math.Linear(casterX, hitX, progress)
          const y = Phaser.Math.Linear(casterY - 8, hitY, progress)
          const alpha = clamp(elapsed / 25)
          const curve = index % 2 === 0 ? 13 : -13
          drawSlash(behind, x, y, angle, curve, 17, 0xff3b24, alpha * 0.26)
          drawSlash(front, x, y, angle, curve, 10, 0xff6339, alpha * 0.85)
          drawSlash(front, x, y, angle, curve, 6, 0xfff4db, alpha, true)
          drawSlash(
            front,
            x,
            y,
            angle,
            curve,
            1.8,
            0xfff8e9,
            alpha * 0.9,
            true,
            0.12,
            0.84,
            curve > 0 ? -12 : 12
          )
        } else {
          const impactTime = elapsed - TRAVEL
          const flash = clamp(1 - impactTime / IMPACT_DURATION)
          const expansion = impactTime * 0.1 * IMPACT_SCALE
          behind.fillStyle(0xffa52f, flash * 0.2)
          behind.fillCircle(hitX, hitY, 12 * IMPACT_SCALE + expansion)

          for (let i = 0; i < 8; i++) {
            const rayAngle = angle + (i * Math.PI * 2) / 8 + Math.PI * 0.03
            const dx = Math.cos(rayAngle)
            const dy = Math.sin(rayAngle)
            const inner = 4 * IMPACT_SCALE + expansion * 0.3
            const outer = (i % 2 === 0 ? 25 : 16) * IMPACT_SCALE + expansion
            const width = (i % 2 === 0 ? 4 : 2.5) * IMPACT_SCALE
            front.fillStyle(i % 3 === 0 ? 0xfff7c7 : 0xffbf37, flash)
            front.fillTriangle(
              hitX + dx * inner - dy * width,
              hitY + dy * inner + dx * width,
              hitX + dx * outer,
              hitY + dy * outer,
              hitX + dx * inner + dy * width,
              hitY + dy * inner - dx * width
            )
          }
          front.fillStyle(0xfff8ce, flash)
          front.fillCircle(hitX, hitY, 5 * IMPACT_SCALE + expansion * 0.2)
        }
      })

      const fade = clamp((DURATION - time) / 170)
      ground.setAlpha(fade)
      behind.setAlpha(fade)
      front.setAlpha(fade)
    },
    onComplete: () => cleanup()
  })
  let cleaningUp = false
  const cleanup = (destroyed?: Phaser.GameObjects.Graphics) => {
    if (cleaningUp) return
    cleaningUp = true
    timeline.stop()
    for (const effect of [ground, behind, front]) {
      if (effect !== destroyed && effect.active && !effect.isDestroyed) {
        effect.destroy()
      }
    }
  }
  ground.once(Phaser.GameObjects.Events.DESTROY, () => cleanup(ground))
  behind.once(Phaser.GameObjects.Events.DESTROY, () => cleanup(behind))
  front.once(Phaser.GameObjects.Events.DESTROY, () => cleanup(front))
}
