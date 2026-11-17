import Phaser from "phaser"
import { CELL_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const darkAuraAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const radius = 2 * CELL_WIDTH
  const perspective = 0.6
  const halo = scene.add
    .ellipse(x, y, 88, 88 * perspective, 0xc21b36, 0.45)
    .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
  scene.abilitiesVfxGroup?.add(halo)
  scene.tweens.add({
    targets: halo,
    scale: 0.5,
    alpha: 0,
    duration: 400,
    ease: Phaser.Math.Easing.Quadratic.In,
    onComplete: () => halo.destroy()
  })

  ;[
    { color: 0xc21b36, width: 6, alpha: 0.6, delay: 150, duration: 500 },
    { color: 0xffc2b9, width: 3, alpha: 0.45, delay: 230, duration: 500 }
  ].forEach(({ color, width, alpha, delay, duration }) => {
    const ring = scene.add
      .graphics({ x, y })
      .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
    scene.abilitiesVfxGroup?.add(ring)
    ring.lineStyle(width, color, 0.85)
    ring.beginPath()
    for (let i = 0; i <= 16; i++) {
      const angle = (i * Math.PI * 2) / 16
      const px = Math.cos(angle) * radius
      const py = Math.sin(angle) * radius * perspective
      if (i === 0) ring.moveTo(px, py)
      else ring.lineTo(px, py)
    }
    ring.strokePath()
    ring.setScale(0.08).setAlpha(0)
    scene.tweens.add({
      targets: ring,
      scale: 1,
      alpha: { from: alpha, to: 0 },
      delay,
      duration,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => ring.destroy()
    })
  })

  for (let i = 0; i < 22; i++) {
    const angle = (i * Math.PI * 2) / 22 + (Math.random() - 0.5) * 0.3
    const distance = (0.7 + Math.random() * 0.3) * radius
    const particle = scene.add
      .rectangle(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance * perspective,
        randomBetween(8, 11),
        randomBetween(8, 11),
        i % 3 === 0 ? 0xffc2b9 : 0xc21b36
      )
      .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      .setAlpha(0)
    scene.abilitiesVfxGroup?.add(particle)
    scene.tweens.add({
      targets: particle,
      x,
      y,
      scale: 0.3,
      alpha: { from: 0.65, to: 0 },
      delay: 250 + i * 10,
      duration: 450,
      ease: Phaser.Math.Easing.Quadratic.In,
      onComplete: () => particle.destroy()
    })
  }
}
