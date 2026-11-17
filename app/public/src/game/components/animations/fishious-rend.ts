import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const fishiousRendAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip
}) => {
  if (targetX < 0 || targetY < 0) return

  const [startX, startY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [x, y] = transformEntityCoordinates(targetX, targetY, flip)
  const angle = Math.atan2(y - startY, x - startX)

  const surge = scene.add
    .container(startX, startY - 18)
    .setDepth(DEPTH.PROJECTILE)
    .setRotation(angle)
  scene.abilitiesVfxGroup?.add(surge)
  const surgeShape = scene.add.graphics()
  surgeShape.fillStyle(0x087dc4, 0.35)
  surgeShape.fillTriangle(-70, -18, 8, 0, -70, 18)
  surgeShape.fillStyle(0x25d9fa, 0.7)
  surgeShape.fillTriangle(-56, -10, 14, 0, -56, 10)
  surgeShape.fillStyle(0xe4ffff, 0.95)
  surgeShape.fillTriangle(-42, -3, 18, 0, -42, 3)
  surge.add(surgeShape)
  scene.tweens.add({
    targets: surge,
    x,
    y: y - 18,
    duration: 170,
    ease: Phaser.Math.Easing.Quadratic.In,
    onComplete: () => surge.destroy()
  })

  const swipeAngle = angle + Math.PI / 2
  const swipe = scene.add
    .graphics({
      x: x - Math.cos(swipeAngle) * 95,
      y: y - 10 - Math.sin(swipeAngle) * 95
    })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setRotation(swipeAngle)
    .setScale(0.05, 1)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(swipe)
  ;[
    { width: 20, color: 0x008fe8, alpha: 0.35 },
    { width: 12, color: 0x00d7ff, alpha: 0.85 },
    { width: 4, color: 0xe7ffff, alpha: 0.95 }
  ].forEach(({ width, color, alpha }) => {
    swipe.fillStyle(color, alpha)
    swipe.beginPath()
    for (let i = 0; i <= 24; i++) {
      const t = i / 24
      const curve = 28 * (2 * t - 1) ** 2 - 15
      const edge = Math.sin(Math.PI * t) * width
      if (i === 0) swipe.moveTo(t * 190, curve - edge)
      else swipe.lineTo(t * 190, curve - edge)
    }
    for (let i = 24; i >= 0; i--) {
      const t = i / 24
      const curve = 28 * (2 * t - 1) ** 2 - 15
      const edge = Math.sin(Math.PI * t) * width
      swipe.lineTo(t * 190, curve + edge)
    }
    swipe.closePath()
    swipe.fillPath()
  })
  scene.tweens.chain({
    targets: swipe,
    tweens: [
      {
        alpha: 1,
        scaleX: 1,
        delay: 170,
        duration: 130,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      { alpha: 0, duration: 210 }
    ],
    onComplete: () => swipe.destroy()
  })

  const impact = scene.add
    .container(x, y - 18)
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(0.35)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(impact)
  const burst = scene.add.graphics()
  for (let i = 0; i < 10; i++) {
    const rayAngle = (i * Math.PI * 2) / 10
    const length = i % 2 === 0 ? 72 : 48
    burst.fillStyle(i % 2 === 0 ? 0x75eeff : 0xffffff, 0.9)
    burst.fillTriangle(
      Math.cos(rayAngle - 0.18) * 12,
      Math.sin(rayAngle - 0.18) * 12,
      Math.cos(rayAngle) * length,
      Math.sin(rayAngle) * length,
      Math.cos(rayAngle + 0.18) * 12,
      Math.sin(rayAngle + 0.18) * 12
    )
  }
  const flash = scene.add.circle(0, 0, 22, 0xe9ffff, 0.8)
  impact.add([burst, flash])
  scene.tweens.chain({
    targets: impact,
    tweens: [
      { alpha: 1, scale: 1, delay: 280, duration: 70 },
      { alpha: 0, scale: 1.35, duration: 180 }
    ],
    onComplete: () => impact.destroy()
  })

  const ripple = scene.add
    .graphics({ x, y: y + 16 })
    .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
    .setScale(0.3)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(ripple)
  ripple.lineStyle(5, 0x36d5f4, 0.7)
  ripple.strokeEllipse(0, 0, 100, 42)
  ripple.lineStyle(2, 0xe5ffff, 0.9)
  ripple.strokeEllipse(0, 0, 84, 34)
  scene.tweens.chain({
    targets: ripple,
    tweens: [
      { alpha: 1, delay: 280, duration: 50 },
      { alpha: 0, scale: 1.45, duration: 300 }
    ],
    onComplete: () => ripple.destroy()
  })

  for (let i = 0; i < 14; i++) {
    const direction = (i * Math.PI * 2) / 14
    const distance = randomBetween(38, 72)
    const droplet = scene.add
      .ellipse(x, y - 18, i % 3 === 0 ? 8 : 5, i % 3 === 0 ? 14 : 9, 0xb9faff)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setRotation(direction - Math.PI / 2)
      .setAlpha(0)
    scene.abilitiesVfxGroup?.add(droplet)
    scene.tweens.chain({
      targets: droplet,
      tweens: [
        { alpha: 1, delay: 280, duration: 30 },
        {
          x: x + Math.cos(direction) * distance,
          y: y - 18 + Math.sin(direction) * distance * 0.7,
          alpha: 0,
          scale: 0.4,
          duration: 280,
          ease: Phaser.Math.Easing.Quadratic.Out
        }
      ],
      onComplete: () => droplet.destroy()
    })
  }
}
