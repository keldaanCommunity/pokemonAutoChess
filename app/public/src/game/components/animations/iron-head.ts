import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 650
const TIME_SCALE = 1.25
const VISIBILITY = 1.3
const CLAMP = Phaser.Math.Clamp
const brighten = (alpha: number) => CLAMP(alpha * VISIBILITY, 0, 1)

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

function drawSparkle(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  graphics.fillStyle(0xffffff, brighten(alpha))
  graphics.fillTriangle(x, y - size, x - size * 0.22, y, x + size * 0.22, y)
  graphics.fillTriangle(x, y + size, x - size * 0.22, y, x + size * 0.22, y)
  graphics.fillTriangle(x - size, y, x, y - size * 0.22, x, y + size * 0.22)
  graphics.fillTriangle(x + size, y, x, y - size * 0.22, x, y + size * 0.22)
}

export const ironHeadAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  pokemonsOnBoard,
  flip,
  delay = 0
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const hasTarget =
    isBoardCell(targetX, targetY) &&
    (targetX !== positionX || targetY !== positionY)
  const [targetScreenX, targetScreenY] = hasTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [casterX, casterY]
  const dx = targetScreenX - casterX
  const dy = targetScreenY - casterY
  const distance = Math.hypot(dx, dy)
  const directionX = distance ? dx / distance : 1
  const directionY = distance ? dy / distance : 0
  const normalX = -directionY
  const normalY = directionX
  const caster = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.positionX === positionX && pokemon.positionY === positionY
  )
  const source = caster?.sprite
  const metallic = source
    ? scene.add
        .sprite(source.x, source.y, source.texture.key, source.frame.name)
        .setTint(0xdce9f2)
        .setTintMode(Phaser.TintModes.FILL)
        .setVisible(false)
    : undefined
  if (caster && metallic) {
    caster.addAt(metallic, caster.getIndex(caster.sprite) + 1)
    scene.abilitiesVfxGroup?.add(metallic)
  }

  const graphics = scene.add.graphics()
  const cast = scene.add
    .container(0, 0, [graphics])
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(cast)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION * TIME_SCALE,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!cast.active) return
      const elapsed = counter.getValue() ?? 0
      const casterFade = CLAMP((650 - elapsed) / 550, 0, 1)
      const currentX = caster?.active ? caster.x : casterX
      const currentY = caster?.active ? caster.y : casterY

      if (metallic?.active && source?.active) {
        metallic
          .setTexture(source.texture.key, source.frame.name)
          .setPosition(source.x, source.y)
          .setOrigin(source.originX, source.originY)
          .setScale(source.scaleX, source.scaleY)
          .setRotation(source.rotation)
          .setFlip(source.flipX, source.flipY)
          .setAlpha(brighten(source.alpha * casterFade * 0.7))
          .setVisible(source.visible && casterFade > 0)
      }

      graphics.clear()
      for (let i = 0; i < 5; i++) {
        const angle = i * 2.4 + 0.3
        const twinkle = Math.sin(
          CLAMP((elapsed - i * 40) / 430, 0, 1) * Math.PI
        )
        drawSparkle(
          graphics,
          currentX + Math.cos(angle) * (26 + (i % 2) * 12),
          currentY + Math.sin(angle) * 30,
          5 + (i % 2) * 4,
          twinkle * casterFade
        )
      }
      if (!hasTarget) return

      if (elapsed < 120) {
        const progress = CLAMP(elapsed / 120, 0, 1)
        const traveled = distance * Phaser.Math.Easing.Cubic.Out(progress)
        const headX = casterX + directionX * traveled
        const headY = casterY + directionY * traveled
        const trailLength = Math.min(traveled, 70)
        const trailFade = 1 - progress
        for (let i = -2; i <= 2; i++) {
          const offset = i * 6
          graphics.lineStyle(
            3 - Math.abs(i) * 0.6,
            0xd8e7f2,
            brighten(trailFade * 0.7)
          )
          graphics.beginPath()
          graphics.moveTo(
            headX - directionX * trailLength + normalX * offset,
            headY - directionY * trailLength + normalY * offset
          )
          graphics.lineTo(headX + normalX * offset, headY + normalY * offset)
          graphics.strokePath()
        }
        graphics.lineStyle(3, 0xf2fbff, brighten(trailFade * 0.85))
        graphics.beginPath()
        for (let i = 0; i <= 24; i++) {
          const angle = (i / 24) * Math.PI * 2
          const x =
            headX +
            directionX * Math.cos(angle) * 8 +
            normalX * Math.sin(angle) * 18
          const y =
            headY +
            directionY * Math.cos(angle) * 8 +
            normalY * Math.sin(angle) * 18
          if (i === 0) graphics.moveTo(x, y)
          else graphics.lineTo(x, y)
        }
        graphics.closePath()
        graphics.strokePath()
      }

      const flash = CLAMP(1 - elapsed / 135, 0, 1)
      graphics.fillStyle(0xb9dcf5, brighten(flash * 0.48))
      graphics.fillCircle(targetScreenX, targetScreenY, 38 + flash * 10)
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2 + 0.2
        const x = Math.cos(angle)
        const y = Math.sin(angle)
        const length = i % 2 === 0 ? 53 : 39
        graphics.fillStyle(0xffffff, brighten(flash * 0.85))
        graphics.fillTriangle(
          targetScreenX + x * length,
          targetScreenY + y * length,
          targetScreenX - y * 5,
          targetScreenY + x * 5,
          targetScreenX + y * 5,
          targetScreenY - x * 5
        )
      }
      graphics.fillStyle(0xffffff, brighten(flash * 0.96))
      graphics.fillCircle(targetScreenX, targetScreenY, 23 + flash * 8)

      const ringFade = CLAMP(1 - elapsed / 430, 0, 1)
      const radius = 30 + 28 * (1 - (1 - CLAMP(elapsed / 300, 0, 1)) ** 2)
      graphics.fillStyle(0x9bd5f7, brighten(ringFade * 0.12))
      graphics.fillCircle(targetScreenX, targetScreenY, radius)
      graphics.lineStyle(5, 0x9bd5f7, brighten(ringFade * 0.25))
      graphics.strokeCircle(targetScreenX, targetScreenY, radius)
      graphics.lineStyle(2, 0xd9f4ff, brighten(ringFade * 0.7))
      graphics.strokeCircle(targetScreenX, targetScreenY, radius)

      for (let i = 0; i < 11; i++) {
        const angle = i * 2.4 + 0.5
        const drift = 18 + elapsed * (0.045 + (i % 3) * 0.012)
        const alpha = CLAMP(1 - elapsed / (350 + (i % 3) * 60), 0, 1)
        graphics.fillStyle(
          i % 3 === 0 ? 0xffffff : 0xb7e6ff,
          brighten(alpha * 0.8)
        )
        graphics.fillCircle(
          targetScreenX + Math.cos(angle) * drift,
          targetScreenY + Math.sin(angle) * drift - elapsed * 0.035,
          i % 3 === 0 ? 2.5 : 1.5
        )
      }
    },
    onComplete: () => cast.destroy()
  })

  cast.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    if (metallic?.active) metallic.destroy()
  })
}
