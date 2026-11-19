import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const makeItRainAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  const [sourceX, sourceY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const casterScale = 0.7
  const casterGlowScale = casterScale * 0.8

  const casterGlow = scene.add
    .graphics({ x: sourceX, y: sourceY - 18 })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(casterGlowScale * 0.55)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(casterGlow)
  casterGlow.fillStyle(0xffc629, 0.16)
  casterGlow.fillCircle(0, 0, 76)
  casterGlow.fillStyle(0xffd84a, 0.24)
  casterGlow.fillCircle(0, 0, 54)
  casterGlow.fillStyle(0xffed9a, 0.2)
  casterGlow.fillCircle(0, 0, 34)
  casterGlow.lineStyle(4, 0xffe98a, 0.78)
  casterGlow.strokeCircle(0, 0, 58)
  for (let i = 0; i < 14; i++) {
    const angle = (i * Math.PI * 2) / 14
    casterGlow.fillStyle(0xffe98a, 0.2)
    casterGlow.fillTriangle(
      Math.cos(angle - 0.12) * 24,
      Math.sin(angle - 0.12) * 24,
      Math.cos(angle) * 96,
      Math.sin(angle) * 96,
      Math.cos(angle + 0.12) * 24,
      Math.sin(angle + 0.12) * 24
    )
    casterGlow.lineStyle(i % 2 === 0 ? 2 : 1, 0xffffc2, 0.55)
    casterGlow.beginPath()
    casterGlow.moveTo(Math.cos(angle) * 67, Math.sin(angle) * 67)
    casterGlow.lineTo(
      Math.cos(angle) * (i % 2 === 0 ? 88 : 78),
      Math.sin(angle) * (i % 2 === 0 ? 88 : 78)
    )
    casterGlow.strokePath()
  }
  scene.tweens.chain({
    targets: casterGlow,
    tweens: [
      {
        alpha: 0.95,
        scale: casterGlowScale,
        duration: 180,
        delay,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      {
        alpha: 0,
        scale: casterGlowScale * 1.18,
        duration: 420,
        ease: Phaser.Math.Easing.Quadratic.In
      }
    ],
    onComplete: () => casterGlow.destroy()
  })

  for (let i = 0; i < 7; i++) {
    const angle = (i * Math.PI * 2) / 7
    const radius = 58 + (i % 3) * 9
    const arc = scene.add
      .graphics({ x: sourceX, y: sourceY - 18 })
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setRotation(angle)
      .setScale(casterScale * 1.1)
      .setAlpha(0)
    scene.abilitiesVfxGroup?.add(arc)

    const drawArc = (width: number, color: number, alpha: number) => {
      arc.lineStyle(width, color, alpha)
      arc.beginPath()
      for (let point = 0; point <= 16; point++) {
        const progress = point / 16
        const arcAngle = -0.72 + progress * 1.44
        const arcRadius = radius + Math.sin(progress * Math.PI) * 5
        const x = Math.cos(arcAngle) * arcRadius
        const y = Math.sin(arcAngle) * arcRadius
        if (point === 0) arc.moveTo(x, y)
        else arc.lineTo(x, y)
      }
      arc.strokePath()
    }

    drawArc(10, 0xffc62e, 0.22)
    drawArc(3, 0xfff0a3, 0.95)
    scene.tweens.chain({
      targets: arc,
      tweens: [
        {
          alpha: 1,
          scale: casterScale,
          duration: 45,
          delay: delay + i * 55,
          ease: Phaser.Math.Easing.Quadratic.Out
        },
        {
          alpha: 0,
          scale: casterScale * 0.08,
          rotation: angle + (i % 2 === 0 ? 0.35 : -0.35),
          duration: 300,
          ease: Phaser.Math.Easing.Quadratic.In
        }
      ],
      onComplete: () => arc.destroy()
    })
  }

  const centerFlash = scene.add
    .graphics({ x: sourceX, y: sourceY - 18 })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(casterScale * 0.3)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(centerFlash)
  centerFlash.fillStyle(0xffd84a, 0.9)
  centerFlash.fillCircle(0, 0, 10)
  centerFlash.fillStyle(0xfff4bd, 0.98)
  centerFlash.fillCircle(0, 0, 4)
  scene.tweens.chain({
    targets: centerFlash,
    tweens: [
      {
        alpha: 1,
        scale: casterScale,
        duration: 60,
        delay: delay + 340,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      {
        alpha: 0,
        scale: casterScale * 1.5,
        duration: 160,
        ease: Phaser.Math.Easing.Quadratic.In
      }
    ],
    onComplete: () => centerFlash.destroy()
  })

  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    targetX < 0 ||
    targetY < 0
  ) {
    return
  }

  const [endX, endY] = transformEntityCoordinates(targetX, targetY, flip)
  const dx = endX - sourceX
  const dy = endY - sourceY

  for (let i = 0; i < 13; i++) {
    const drift = 0.3 * (1 - i / 12)
    const hitsTarget = i % 3 === 0
    const landingX = endX + Math.sin(i * 2.4) * (hitsTarget ? 13 : 26)
    const landingY = endY - 18 + Math.cos(i * 2.4) * (hitsTarget ? 11 : 22)
    const fallDelay = delay + 130 + i * 27
    const fallDuration = 300 + (i % 3) * 28
    const coin = scene.add
      .graphics({
        x: landingX - dx * drift + Math.sin(i * 1.7) * 22,
        y: landingY - dy * drift - 96 - (i % 4) * 12
      })
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setRotation((i % 2 === 0 ? 1 : -1) * 0.35)
      .setAlpha(0)
    coin.fillStyle(0xffc629, 0.98)
    coin.fillEllipse(0, 0, 10, 14)
    coin.lineStyle(1.5, 0xffffae, 0.95)
    coin.strokeEllipse(0, 0, 10, 14)
    coin.lineStyle(1, 0xf18a12, 0.9)
    coin.strokeEllipse(0, 0, 5, 9)
    scene.abilitiesVfxGroup?.add(coin)

    scene.tweens.chain({
      targets: coin,
      tweens: [
        {
          alpha: 1,
          delay: fallDelay,
          duration: 55
        },
        {
          x: landingX,
          y: landingY,
          alpha: hitsTarget ? 0.85 : 0,
          rotation: coin.rotation + (i % 2 === 0 ? 2.8 : -2.8),
          scale: 0.65,
          duration: fallDuration,
          ease: Phaser.Math.Easing.Quadratic.In
        }
      ],
      onComplete: () => coin.destroy()
    })

    if (hitsTarget) {
      const impact = scene.add
        .graphics({ x: landingX, y: landingY })
        .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
        .setScale(0.55)
        .setAlpha(0)
      scene.abilitiesVfxGroup?.add(impact)
      for (let ray = 0; ray < 7; ray++) {
        const angle = (ray * Math.PI * 2) / 7 + i * 0.21
        const length = 22 + ((ray * 3 + i) % 5) * 4
        const x = Math.cos(angle)
        const y = Math.sin(angle)
        impact.fillStyle(0xffc745, 0.8)
        impact.fillTriangle(
          y * 7,
          -x * 7,
          x * length,
          y * length,
          -y * 7,
          x * 7
        )
        impact.fillStyle(0xfffae7, 0.98)
        impact.fillTriangle(
          y * 4,
          -x * 4,
          x * (length - 4),
          y * (length - 4),
          -y * 4,
          x * 4
        )
      }
      scene.tweens.chain({
        targets: impact,
        tweens: [
          {
            alpha: 1,
            scale: 0.95,
            delay: fallDelay + 55 + fallDuration,
            duration: 24
          },
          {
            alpha: 0,
            scale: 1.15,
            duration: 96,
            ease: Phaser.Math.Easing.Quadratic.Out
          }
        ],
        onComplete: () => impact.destroy()
      })
    }
  }
}
