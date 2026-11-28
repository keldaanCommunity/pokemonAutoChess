import Phaser from "phaser"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getSurgeAllies } from "./helpers"

const CASTER_DURATION = 900
const ALLY_DURATION = 780
const GROUND_Y = 8

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function drawLeaf(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  size: number,
  alpha: number,
  color: number
) {
  const directionX = Math.cos(angle)
  const directionY = Math.sin(angle)
  const normalX = -directionY
  const normalY = directionX
  const point = (along: number, across: number) =>
    new Phaser.Math.Vector2(
      x + directionX * along + normalX * across,
      y + directionY * along + normalY * across
    )
  const points = [
    point(-size, 0),
    point(-size * 0.3, -size * 0.56),
    point(size * 0.35, -size * 0.42),
    point(size, 0),
    point(size * 0.35, size * 0.42),
    point(-size * 0.3, size * 0.56)
  ]

  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
  graphics.lineStyle(1, 0xe7f7a5, alpha * 0.75)
  graphics.lineBetween(
    x - directionX * size * 0.65,
    y - directionY * size * 0.65,
    x + directionX * size * 0.7,
    y + directionY * size * 0.7
  )
}

function addLeafPuddle(
  scene: AbilityAnimationArgs["scene"],
  x: number,
  y: number,
  delay: number,
  duration: number,
  role: "caster" | "ally",
  phase: number
) {
  const isCaster = role === "caster"
  const scale = 1.25
  const leafCount = isCaster ? 12 : 10
  const ground = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(scale)
  const leaves = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(scale)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(leaves)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay,
    onUpdate: (counter) => {
      if (!ground.active || !leaves.active) return
      const time = counter.progress * duration
      ground.clear()
      leaves.clear()

      const bloom = Phaser.Math.Easing.Sine.Out(clamp(time / 180))
      const fade = clamp((duration - time) / 240)
      const alpha = clamp(time / 110) * fade
      const breathe = 0.96 + Math.sin(time * 0.008) * 0.04
      const puddleScale = (0.72 + bloom * 0.28) * breathe

      ground.fillStyle(0x348b42, alpha * 0.24)
      ground.fillEllipse(-5, GROUND_Y + 2, 62 * puddleScale, 24 * puddleScale)
      ground.fillStyle(0x78cd49, alpha * 0.27)
      ground.fillEllipse(3, GROUND_Y, 43 * puddleScale, 17 * puddleScale)
      ground.fillStyle(0xc5eb72, alpha * 0.16)
      ground.fillEllipse(-1, GROUND_Y - 1, 24 * puddleScale, 10 * puddleScale)
      if (isCaster) {
        ground.fillStyle(0xe8f69a, alpha * 0.16)
        ground.fillEllipse(0, GROUND_Y - 2, 28 * puddleScale, 11 * puddleScale)
      }

      for (let leaf = 0; leaf < leafCount; leaf++) {
        const isFront = leaf % 2 === 1
        if (isCaster) {
          const launch = 75 + (leaf % 4) * 28
          const progress = clamp((time - launch) / 540)
          if (progress <= 0 || progress >= 1) continue

          const spread = Phaser.Math.Easing.Sine.Out(progress)
          const angle = phase + (leaf / leafCount) * Math.PI * 2
          const wobble = Math.sin(time * 0.015 + leaf * 1.7)
          const leafX = Math.cos(angle) * (5 + spread * 40) + wobble * 2
          const lift = Math.sin(progress * Math.PI) * (44 + (leaf % 3) * 6)
          const leafY = GROUND_Y - 6 - lift + spread * (6 + Math.sin(angle) * 4)
          const leafAlpha =
            alpha * clamp(progress / 0.12) * clamp((1 - progress) / 0.28)
          drawLeaf(
            isFront ? leaves : ground,
            leafX,
            leafY + (isFront ? -14 : GROUND_Y - 3),
            angle + Math.PI / 2 + progress * 2.2 + wobble * 0.25,
            6 + (leaf % 3) * 0.6,
            leafAlpha,
            leaf % 2 === 0 ? 0xe5f29a : 0x84cd4d
          )
          continue
        }

        const angle = time * 0.008 + phase + (leaf / leafCount) * Math.PI * 2
        const wobble = Math.sin(time * 0.009 + leaf * 1.7)
        const orbitX = 25 + Math.sin(time * 0.007 + leaf) * 3
        const orbitY = 8 + Math.cos(time * 0.008 + leaf) * 2
        const leafX = Math.cos(angle) * orbitX
        const leafY = Math.sin(angle) * orbitY + wobble * 2
        drawLeaf(
          isFront ? leaves : ground,
          leafX,
          leafY + (isFront ? -20 : GROUND_Y - 3),
          angle + Math.PI / 2 + wobble * 0.25,
          5.2 + (leaf % 3) * 0.55,
          alpha * (isFront ? 0.95 : 0.8),
          leaf % 3 === 0 ? 0xd2ef78 : 0x84cd4d
        )
      }
    },
    onComplete: () => {
      if (ground.active) ground.destroy()
      if (leaves.active) leaves.destroy()
    }
  })

  ground.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  leaves.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const grassySurgeAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}: AbilityAnimationArgs) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  addLeafPuddle(
    scene,
    casterX,
    casterY,
    baseDelay,
    CASTER_DURATION,
    "caster",
    0
  )

  getSurgeAllies(data, positionX, positionY).forEach((ally, index) => {
    const [allyX, allyY] = transformEntityCoordinates(ally.x, ally.y, flip)
    const wave = Math.min(
      160,
      distanceE(positionX, positionY, ally.x, ally.y) * 22
    )
    addLeafPuddle(
      scene,
      allyX,
      allyY,
      baseDelay + 110 + wave,
      ALLY_DURATION,
      "ally",
      index * 0.48
    )
  })
}
