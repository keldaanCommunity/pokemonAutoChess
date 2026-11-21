import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH, CELL_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)
const impactRayAngles = [-2.8, -2.2, -1.55, -0.85, -0.25, 0.35, 1, 1.7, 2.4]

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

function drawSlashBand(
  graphics: Phaser.GameObjects.Graphics,
  width: number,
  color: number,
  alpha: number,
  end: number
) {
  const steps = 24
  const point = (t: number, side: number) => {
    const x = (t - 0.5) * 112
    const curve = 14 * (1 - Math.sin(Math.PI * t))
    const thickness = width * Math.sin(Math.PI * t) ** 0.7
    return new Phaser.Math.Vector2(x, curve + side * thickness)
  }
  const points: Phaser.Math.Vector2[] = []
  for (let i = 0; i <= steps; i++) points.push(point((end * i) / steps, -1))
  for (let i = steps; i >= 0; i--) points.push(point((end * i) / steps, 1))
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
}

export const behemothBladeAnimation: AbilityAnimation = ({
  scene,
  pokemonsOnBoard,
  positionX,
  positionY,
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

  const [startX, startY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [endX, endY] = transformEntityCoordinates(targetX, targetY, flip)
  const angle = Math.atan2(endY - startY, endX - startX)
  const heightOffset = 18
  const directionX = Math.cos(angle)
  const directionY = Math.sin(angle)
  const caster = pokemonsOnBoard.reduce<
    (typeof pokemonsOnBoard)[number] | null
  >((closest, pokemon) => {
    if (!pokemon.active) return closest
    return !closest ||
      Math.hypot(pokemon.x - startX, pokemon.y - startY) <
        Math.hypot(closest.x - startX, closest.y - startY)
      ? pokemon
      : closest
  }, null)
  const hasCaster =
    caster !== null &&
    Math.hypot(caster.x - startX, caster.y - startY) < CELL_WIDTH / 2

  const blade = scene.add
    .container(
      hasCaster ? directionX * 8 : startX + directionX * 8,
      (hasCaster ? 0 : startY) - 32 + directionY * 6
    )
    .setDepth(DEPTH.PROJECTILE)
    .setRotation(angle - 0.85)
    .setAlpha(delay > 0 ? 0 : 1)
  const bladeShape = scene.add.graphics().setScale(2, 1.2)
  bladeShape.fillStyle(0x178edb, 0.95)
  bladeShape.fillPoints(
    [
      new Phaser.Math.Vector2(2, 0),
      new Phaser.Math.Vector2(17, -10),
      new Phaser.Math.Vector2(27, -18),
      new Phaser.Math.Vector2(25, -12),
      new Phaser.Math.Vector2(50, -17),
      new Phaser.Math.Vector2(72, 0),
      new Phaser.Math.Vector2(50, 17),
      new Phaser.Math.Vector2(25, 12),
      new Phaser.Math.Vector2(27, 18),
      new Phaser.Math.Vector2(17, 10)
    ],
    true
  )
  bladeShape.fillStyle(0x5cecff, 0.98)
  bladeShape.fillPoints(
    [
      new Phaser.Math.Vector2(6, 0),
      new Phaser.Math.Vector2(25, -9),
      new Phaser.Math.Vector2(49, -13),
      new Phaser.Math.Vector2(66, 0),
      new Phaser.Math.Vector2(49, 13),
      new Phaser.Math.Vector2(25, 9)
    ],
    true
  )
  bladeShape.lineStyle(3, 0xe9ffff, 0.95)
  bladeShape.lineBetween(17, 0, 51, -7)
  bladeShape.lineBetween(51, -7, 62, 0)
  bladeShape.lineBetween(62, 0, 51, 7)
  bladeShape.lineBetween(51, 7, 17, 0)
  bladeShape.lineStyle(2, 0xffffff, 0.95)
  bladeShape.lineBetween(19, 0, 57, 0)
  const hilt = scene.add.graphics()
  hilt.fillStyle(0xc9faff, 0.95)
  hilt.fillTriangle(-3, -11, 6, 0, -3, 11)
  hilt.fillStyle(0x237eb6, 0.95)
  hilt.fillRect(-8, -2, 9, 4)
  blade.add([bladeShape, hilt])
  if (hasCaster) caster.addAt(blade, caster.getIndex(caster.sprite) + 1)
  scene.abilitiesVfxGroup?.add(blade)

  const impact = scene.add
    .graphics({ x: endX, y: endY - heightOffset })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setRotation(angle + Math.PI / 2)
  scene.abilitiesVfxGroup?.add(impact)

  const duration = 460
  let cleaningUp = false
  const cleanup = () => {
    if (cleaningUp) return
    cleaningUp = true
    tween.stop()
    if (blade.active && !blade.isDestroyed) blade.destroy()
    if (impact.active && !impact.isDestroyed) impact.destroy()
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!blade.active || !impact.active) return
      const time = counter.getValue() ?? 0
      const swing = Phaser.Math.Easing.Sine.InOut(clamp(time / 220))
      blade.setRotation(angle - 0.85 + swing * 1.7)
      blade.setAlpha(clamp((340 - time) / 110))
      impact.clear()

      const reveal = clamp((time - 35) / 150)
      const fade = clamp((390 - time) / 190)
      if (reveal > 0 && fade > 0) {
        drawSlashBand(impact, 22, 0x159dda, fade * 0.1, reveal)
        drawSlashBand(impact, 17, 0x28c6ef, fade * 0.18, reveal)
        drawSlashBand(impact, 12, 0x62e8ff, fade * 0.32, reveal)
        drawSlashBand(impact, 7, 0xb5faff, fade * 0.55, reveal)
        drawSlashBand(impact, 2.5, 0xffffff, fade * 0.85, reveal)
      }

      const flash = Math.min(clamp((time - 90) / 25), clamp((280 - time) / 120))
      if (flash > 0) {
        const expansion = 0.75 + clamp((time - 90) / 100) * 0.25
        impact.fillStyle(0xffb819, flash * 0.28)
        impact.fillEllipse(0, 0, 76, 52)
        for (let i = 0; i < impactRayAngles.length; i++) {
          const ray = impactRayAngles[i]
          const cos = Math.cos(ray)
          const sin = Math.sin(ray)
          const length = (i % 3 === 0 ? 72 : i % 3 === 1 ? 52 : 42) * expansion
          const width = i % 3 === 0 ? 5 : 3.5
          impact.fillStyle(i % 2 === 0 ? 0xffd344 : 0xffeb8b, flash * 0.95)
          impact.fillTriangle(
            cos * 10 - sin * width,
            sin * 10 + cos * width,
            cos * length,
            sin * length,
            cos * 10 + sin * width,
            sin * 10 - cos * width
          )
        }
        impact.fillStyle(0xffe35b, flash * 0.72)
        impact.fillEllipse(0, 0, 42, 30)
        impact.fillStyle(0xfffbe0, flash * 0.95)
        impact.fillEllipse(0, 0, 22, 16)
        impact.fillTriangle(-43, 0, 0, -4, 44, 0)
        impact.fillTriangle(-43, 0, 0, 4, 44, 0)
        impact.fillTriangle(0, -28, -3, 0, 0, 26)
        impact.fillTriangle(0, -28, 3, 0, 0, 26)
      }

      const sparkAge = clamp((time - 100) / 280)
      const sparkAlpha = clamp((time - 100) / 30) * (1 - sparkAge)
      if (sparkAlpha > 0) {
        for (let i = 0; i < 7; i++) {
          const sign = i % 2 === 0 ? 1 : -1
          const x = sign * (10 + sparkAge * (25 + i * 4))
          const y = (i - 3) * (2 + sparkAge * 3)
          const length = (5 + (i % 3) * 3) * (1 - sparkAge * 0.5)
          impact.fillStyle(i % 3 === 0 ? 0xffdb63 : 0xaaf7ff, sparkAlpha * 0.9)
          impact.fillTriangle(
            x - length,
            y,
            x + length,
            y - 1.5,
            x + length,
            y + 1.5
          )
        }
      }
    },
    onComplete: cleanup
  })
  blade.once(Phaser.GameObjects.Events.DESTROY, cleanup)
  impact.once(Phaser.GameObjects.Events.DESTROY, cleanup)
}
