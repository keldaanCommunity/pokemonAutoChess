import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const futureSightHitAnimation: AbilityAnimation = ({
  scene,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  if (targetX < 0 || targetY < 0) return
  const animationDelay = Math.max(0, delay)
  const [x, y] = transformEntityCoordinates(targetX, targetY, flip)
  const impact = scene.add
    .container(x, y - 18)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(0.25)
    .setAlpha(animationDelay > 0 ? 0 : 1)
  scene.abilitiesVfxGroup?.add(impact)

  const groundGlow = scene.add.ellipse(0, 18, 140, 62, 0x9e55f5, 0.25)
  const outerGlow = scene.add.circle(0, 0, 52, 0xb269ff, 0.16)
  const sphere = scene.add.circle(0, 0, 40, 0xbb70ef, 0.65)
  const innerGlow = scene.add.circle(0, -3, 32, 0xefb3ff, 0.45)
  const outline = scene.add.graphics()
  outline.lineStyle(2, 0xf7cfff, 0.9)
  outline.strokeCircle(0, 0, 40)

  const rays = scene.add.graphics()
  for (let i = 0; i < 7; i++) {
    const angle = (i * Math.PI * 2) / 7 - Math.PI / 2
    const tip = i % 2 === 0 ? 65 : 54
    const side = 0.12
    rays.fillStyle(i % 2 === 0 ? 0x9bf4ff : 0xf5d5ff, 0.9)
    rays.fillTriangle(
      Math.cos(angle - side) * 35,
      Math.sin(angle - side) * 35,
      Math.cos(angle) * tip,
      Math.sin(angle) * tip,
      Math.cos(angle + side) * 35,
      Math.sin(angle + side) * 35
    )
  }

  const bands = scene.add.graphics()
  bands.lineStyle(6, 0xffffff, 0.9)
  bands.strokeEllipse(0, -10, 65, 20)
  bands.strokeEllipse(0, 8, 78, 24)
  bands.lineStyle(3, 0xffc7fa, 0.95)
  bands.strokeEllipse(0, 19, 62, 16)
  bands.setRotation(-0.2)
  impact.add([groundGlow, outerGlow, sphere, innerGlow, outline, rays, bands])

  scene.tweens.add({
    targets: bands,
    angle: 25,
    duration: 500,
    delay: animationDelay,
    ease: Phaser.Math.Easing.Sine.InOut
  })
  scene.tweens.chain({
    targets: impact,
    delay: animationDelay,
    tweens: [
      {
        scale: 1,
        alpha: 1,
        duration: 140,
        ease: Phaser.Math.Easing.Back.Out
      },
      { scale: 1.08, duration: 140, ease: Phaser.Math.Easing.Sine.Out },
      {
        scale: 1.3,
        alpha: 0,
        duration: 300,
        ease: Phaser.Math.Easing.Quadratic.Out
      }
    ],
    onComplete: () => impact.destroy()
  })
}
