import { CELL_HEIGHT, CELL_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const blizzardAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip
}) => {
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const anticipation = scene.add
    .container(casterX, casterY - 18)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(0.35)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(anticipation)
  const icyGlow = scene.add.circle(0, 0, 24, 0x8feaff, 0.2)
  const icyCore = scene.add.circle(0, 0, 9, 0xcaf7ff, 0.4)
  anticipation.add([icyGlow, icyCore])
  scene.tweens.chain({
    targets: anticipation,
    tweens: [
      { alpha: 0.7, scale: 0.8, duration: 100 },
      { alpha: 0, scale: 1.5, duration: 170 }
    ],
    onComplete: () => anticipation.destroy()
  })

  const ground = scene.add
    .graphics({ x: casterX, y: casterY })
    .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
    .setAlpha(0)
  ground.fillStyle(0x84dcff, 0.1)
  ground.fillEllipse(0, 0, CELL_WIDTH * 8.96, CELL_HEIGHT * 8.96)
  scene.abilitiesVfxGroup?.add(ground)

  const storm = scene.add
    .graphics({ x: casterX, y: casterY })
    .setDepth(DEPTH.WEATHER_FX)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(storm)
  const gusts = Array.from({ length: 28 }, (_, i) => ({
    angle: ((i + Math.random()) * Math.PI * 2) / 28,
    radius: randomBetween(80, 410) / 100,
    arc: randomBetween(18, 42) / 100,
    bend: randomBetween(3, 12) / 100,
    speed: randomBetween(90, 160) / 50,
    width: i % 3 === 0 ? 3 : 2
  }))
  const flakes = Array.from({ length: 36 }, (_, i) => ({
    angle: ((i + Math.random()) * Math.PI * 2) / 36,
    radius: randomBetween(50, 410) / 100,
    speed: randomBetween(110, 200) / 50,
    size: randomBetween(3, 7),
    color: i % 3 === 0 ? 0xffffff : 0x9feaff
  }))

  scene.tweens.add({
    targets: storm,
    alpha: 1,
    duration: 1500,
    onUpdate: (tween) => {
      if (!storm.active || !ground.active) return
      const progress = tween.progress
      const envelope = Math.min(1, progress / 0.18, (1 - progress) / 0.25)
      const scale = Math.min(1, 0.25 + progress * 4)
      ground.setAlpha(envelope).setScale(scale)
      storm.setAlpha(envelope)
      storm.clear()

      gusts.forEach((gust) => {
        storm.lineStyle(gust.width, 0xc2ebfc, 0.9)
        storm.beginPath()
        for (let step = 0; step <= 8; step++) {
          const t = step / 8
          const angle =
            gust.angle + progress * gust.speed + (t - 0.5) * gust.arc
          const radius =
            (gust.radius + Math.sin(t * Math.PI) * gust.bend) * scale
          const x = Math.cos(angle) * radius * CELL_WIDTH
          const y = Math.sin(angle) * radius * CELL_HEIGHT
          if (step === 0) storm.moveTo(x, y)
          else storm.lineTo(x, y)
        }
        storm.strokePath()
      })

      flakes.forEach((flake) => {
        const angle = flake.angle + progress * flake.speed
        const radius = flake.radius * scale
        const px = Math.cos(angle) * radius * CELL_WIDTH
        const py = Math.sin(angle) * radius * CELL_HEIGHT
        storm.lineStyle(2, flake.color, 0.9)
        storm.beginPath()
        storm.moveTo(px - flake.size * 2, py)
        storm.lineTo(px + flake.size, py)
        storm.moveTo(px, py - flake.size)
        storm.lineTo(px, py + flake.size)
        storm.strokePath()
      })
    },
    onComplete: () => {
      storm.destroy()
      ground.destroy()
    }
  })
}
