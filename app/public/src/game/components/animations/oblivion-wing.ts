import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const oblivionWingAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [endX, endY] = transformEntityCoordinates(targetX, targetY, flip)
  const dx = endX - x
  const dy = endY - y
  const length = Math.hypot(dx, dy)
  if (length === 0 || targetX < 0 || targetY < 0) return

  const angle = Math.atan2(dy, dx)
  const beam = scene.add.container(x, y).setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(beam)
  beam.setRotation(angle).setScale(0, 1)

  const beamLayers = scene.add.graphics()
  const layers = [
    { width: 60, color: 0x7d082b, alpha: 0.3 },
    { width: 34, color: 0x31000c, alpha: 0.9 },
    { width: 20, color: 0xc21b36, alpha: 0.9 },
    { width: 8, color: 0xffc2b9, alpha: 0.95 }
  ]
  layers.forEach(({ width, color, alpha }) => {
    beamLayers.fillStyle(color, alpha)
    beamLayers.fillRoundedRect(
      0,
      -width / 2,
      length,
      width,
      Math.min(width, length) / 2
    )
  })
  beam.add(beamLayers)

  scene.tweens.chain({
    targets: beam,
    tweens: [
      { scaleX: 1, duration: 180, ease: Phaser.Math.Easing.Quadratic.Out },
      { alpha: 0, scaleY: 0.5, delay: 120, duration: 350 }
    ],
    onComplete: () => beam.destroy()
  })

  const deathCircle = scene.add
    .container(x, y)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setRotation(angle)
    .setScale(0.55)
  scene.abilitiesVfxGroup?.add(deathCircle)
  const circleGlow = scene.add.ellipse(0, 0, 80, 152, 0x850d30, 0.25)
  const circle = scene.add.graphics()
  circle.lineStyle(12, 0x5b061d, 0.5)
  circle.strokeEllipse(0, 0, 68, 136)
  circle.lineStyle(5, 0x27000b, 1)
  circle.strokeEllipse(0, 0, 62, 130)
  circle.lineStyle(2, 0xf13b50, 0.9)
  circle.strokeEllipse(0, 0, 62, 130)

  for (let i = 0; i < 24; i++) {
    const theta = (i * Math.PI * 2) / 24
    const next = theta + Math.PI / 24
    const radius = i % 3 === 0 ? 1.4 : 1.2
    circle.fillStyle(i % 2 === 0 ? 0x250009 : 0x7d082b, 0.95)
    circle.fillTriangle(
      Math.cos(theta) * 31,
      Math.sin(theta) * 65,
      Math.cos(next) * 31 * radius,
      Math.sin(next) * 65 * radius,
      Math.cos(theta + Math.PI / 12) * 31,
      Math.sin(theta + Math.PI / 12) * 65
    )
  }
  deathCircle.add([circleGlow, circle])
  scene.tweens.chain({
    targets: deathCircle,
    tweens: [
      { scale: 1, duration: 180, ease: Phaser.Math.Easing.Quadratic.Out },
      { alpha: 0, scale: 1.1, delay: 120, duration: 350 }
    ],
    onComplete: () => deathCircle.destroy()
  })

  for (let i = 0; i < 16; i++) {
    const along = length * (0.15 + Math.random() * 0.8)
    const offset = randomBetween(-16, 16)
    const particle = scene.add
      .rectangle(
        x + Math.cos(angle) * along - Math.sin(angle) * offset,
        y + Math.sin(angle) * along + Math.cos(angle) * offset,
        randomBetween(4, 8),
        randomBetween(4, 8),
        i % 2 === 0 ? 0xe43948 : 0x590824
      )
      .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      .setAlpha(0)
    scene.abilitiesVfxGroup?.add(particle)
    const spread = randomBetween(20, 45) * (offset < 0 ? -1 : 1)
    scene.tweens.add({
      targets: particle,
      x: particle.x - Math.sin(angle) * spread,
      y: particle.y + Math.cos(angle) * spread,
      alpha: { from: 0.9, to: 0 },
      scale: 0.3,
      delay: 100 + i * 10,
      duration: 400,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => particle.destroy()
    })
  }
}
