import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getShadowWorldCenter, isBoardCell } from "./helpers"

type Point = { x: number; y: number }

function pointOnBezier(
  start: Point,
  control1: Point,
  control2: Point,
  end: Point,
  progress: number
) {
  const inverse = 1 - progress
  const inverseSquared = inverse * inverse
  const progressSquared = progress * progress
  return {
    x:
      inverseSquared * inverse * start.x +
      3 * inverseSquared * progress * control1.x +
      3 * inverse * progressSquared * control2.x +
      progressSquared * progress * end.x,
    y:
      inverseSquared * inverse * start.y +
      3 * inverseSquared * progress * control1.y +
      3 * inverse * progressSquared * control2.y +
      progressSquared * progress * end.y
  }
}

export const pummelingPaybackAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  pokemonsOnBoard,
  targetX,
  targetY,
  flip,
  ap,
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
  const [targetCenterX, targetCenterY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const casterSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.positionX === positionX && pokemon.positionY === positionY
  )
  const shadow = casterSprite?.shadow
  const shadowCenter = shadow
    ? getShadowWorldCenter(shadow)
    : {
        x: casterSprite?.x ?? casterX,
        y: (casterSprite?.y ?? casterY) + 5
      }
  const dx = targetCenterX - casterX
  const dy = targetCenterY - casterY
  const length = Math.hypot(dx, dy)
  if (length === 0) return

  const directionX = dx / length
  const directionY = dy / length
  const normalX = -directionY
  const normalY = directionX
  const powerScale = Phaser.Math.Clamp(1 + Math.max(0, ap) / 200, 1, 1.5)
  const fragmentScale = 1.1 * powerScale
  const startDelay = Math.max(0, delay)
  const fragmentStagger = 110
  const fragmentDuration = 205
  const targetXOnScreen = targetCenterX
  const targetYOnScreen = targetCenterY
  const casterYOnScreen = casterY - 16

  const charge = scene.add
    .graphics({ x: casterX, y: casterYOnScreen })
    .setDepth(DEPTH.ABILITY_MINOR)
    .setScale(0.45)
    .setAlpha(0)
  charge.lineStyle(2, 0x32d4e5, 0.8)
  charge.strokeEllipse(0, 0, 31, 18)
  charge.fillStyle(0xb9f9ff, 0.9)
  charge.fillTriangle(-7, 0, 0, -6, 8, 0)
  charge.fillTriangle(-7, 0, 0, 6, 8, 0)
  scene.abilitiesVfxGroup?.add(charge)
  const chargeTween = scene.tweens.add({
    targets: charge,
    alpha: 0.8,
    scale: 1,
    delay: startDelay,
    duration: 55,
    ease: Phaser.Math.Easing.Quadratic.Out,
    yoyo: true,
    hold: 15,
    onComplete: () => charge.destroy()
  })
  charge.once(Phaser.GameObjects.Events.DESTROY, () => chargeTween.stop())

  const fragments = [
    { startSide: -12, contactAlong: -7, contactSide: -8, arc: -20 },
    { startSide: -4, contactAlong: 5, contactSide: 7, arc: 18 },
    { startSide: 4, contactAlong: -3, contactSide: 3, arc: 24 },
    { startSide: 12, contactAlong: 7, contactSide: -5, arc: -16 }
  ] as const

  for (const [i, fragment] of fragments.entries()) {
    const start = {
      x: casterX + normalX * fragment.startSide,
      y: casterYOnScreen + normalY * fragment.startSide
    }
    const end = {
      x:
        targetXOnScreen +
        directionX * fragment.contactAlong +
        normalX * fragment.contactSide,
      y:
        targetYOnScreen +
        directionY * fragment.contactAlong +
        normalY * fragment.contactSide
    }
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const control1 = {
      x: start.x + deltaX * 0.28 + normalX * fragment.arc,
      y: start.y + deltaY * 0.28 + normalY * fragment.arc
    }
    const control2 = {
      x: end.x - deltaX * 0.24 + normalX * fragment.arc * 0.55,
      y: end.y - deltaY * 0.24 + normalY * fragment.arc * 0.55
    }
    const launchDelay = startDelay + 65 + i * fragmentStagger

    const shard = scene.add
      .container(start.x, start.y)
      .setDepth(DEPTH.PROJECTILE)
      .setRotation(Math.atan2(dy, dx))
      .setScale(fragmentScale * 0.82)
      .setAlpha(0)
    const shape = scene.add.graphics()
    shape.lineStyle(11, 0x20d3df, 0.38)
    shape.lineBetween(-33, 0, -12, 0)
    shape.lineStyle(3, 0x9af8ff, 0.9)
    shape.lineBetween(-30, -2, -13, -2)
    shape.fillStyle(0x263a43, 0.99)
    shape.fillTriangle(-19, -7, 4, -11, 19, -3)
    shape.fillTriangle(-19, -7, -13, 9, 19, -3)
    shape.fillTriangle(-13, 9, 19, -3, 12, 11)
    shape.fillStyle(0x8fa6ae, 0.98)
    shape.fillTriangle(-11, -4, 7, -8, 14, -2)
    shape.fillStyle(0xc3d1d5, 0.92)
    shape.fillTriangle(-6, -4, 6, -7, 11, -2)
    shape.fillStyle(0xa9674f, 0.9)
    shape.fillTriangle(-13, 2, -7, 7, 1, 4)
    shape.lineStyle(2, 0xf0ffff, 0.95)
    shape.lineBetween(-7, -4, 8, -7)
    shape.lineStyle(2.5, 0x4fe6ef, 0.98)
    shape.lineBetween(-9, 5, 8, 2)
    shard.add(shape)
    scene.abilitiesVfxGroup?.add(shard)

    const shardTween = scene.tweens.addCounter({
      from: 0,
      to: 1,
      delay: launchDelay,
      duration: fragmentDuration,
      ease: Phaser.Math.Easing.Cubic.In,
      onUpdate: (counter) => {
        if (!shard.active) return
        const progress = Phaser.Math.Clamp(counter.getValue() ?? 0, 0, 1)
        const point = pointOnBezier(start, control1, control2, end, progress)
        const nextPoint = pointOnBezier(
          start,
          control1,
          control2,
          end,
          Math.min(1, progress + 0.015)
        )
        shard
          .setPosition(point.x, point.y)
          .setRotation(Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x))
          .setScale(fragmentScale * (0.82 + progress * 0.18))
          .setAlpha(Phaser.Math.Clamp(progress / 0.08, 0, 1))
      },
      onComplete: () => shard.destroy()
    })
    shard.once(Phaser.GameObjects.Events.DESTROY, () => shardTween.stop())

    const impact = scene.add
      .container(end.x, end.y)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
      .setRotation(Math.atan2(end.y - control2.y, end.x - control2.x))
      .setScale(0.35 * powerScale)
      .setAlpha(0)
    const burst = scene.add.graphics()
    burst.fillStyle(0x54eaf1, 0.3)
    burst.fillCircle(0, 0, 10)
    for (let ray = 0; ray < 8; ray++) {
      const angle = (ray * Math.PI) / 4
      const inner = ray % 2 === 0 ? 6 : 4
      const outer = ray % 2 === 0 ? 24 : 16
      burst.fillStyle(ray % 2 === 0 ? 0xefffff : 0x54eaf1, 0.95)
      burst.fillTriangle(
        Math.cos(angle - 0.12) * inner,
        Math.sin(angle - 0.12) * inner,
        Math.cos(angle) * outer,
        Math.sin(angle) * outer,
        Math.cos(angle + 0.12) * inner,
        Math.sin(angle + 0.12) * inner
      )
    }
    burst.lineStyle(2.5, 0xffffff, 0.98)
    burst.strokeCircle(0, 0, 9)
    burst.lineStyle(1.5, 0x54eaf1, 0.95)
    burst.strokeCircle(0, 0, 15)
    burst.fillStyle(0xffffff, 0.98)
    burst.fillCircle(0, 0, 5)
    impact.add(burst)
    scene.abilitiesVfxGroup?.add(impact)
    const impactTween = scene.tweens.chain({
      targets: impact,
      delay: launchDelay + fragmentDuration,
      tweens: [
        {
          alpha: 0.95,
          scale: 0.95 * powerScale,
          duration: 30,
          ease: Phaser.Math.Easing.Quadratic.Out
        },
        {
          alpha: 0,
          scale: 1.55 * powerScale,
          duration: 100,
          ease: Phaser.Math.Easing.Quadratic.Out
        }
      ],
      onComplete: () => impact.destroy()
    })
    impact.once(Phaser.GameObjects.Events.DESTROY, () => impactTween.stop())
  }

  const lastArrival =
    startDelay +
    65 +
    (fragments.length - 1) * fragmentStagger +
    fragmentDuration
  const recovery = scene.add
    .graphics({ x: shadowCenter.x, y: shadowCenter.y })
    .setDepth(DEPTH.ABILITY_MINOR)
    .setScale(1.25)
  scene.abilitiesVfxGroup?.add(recovery)

  const healingMotes = [
    { x: -13, y: 3, dx: -22, dy: -27, size: 4 },
    { x: 14, y: 4, dx: 23, dy: -29, size: 5 },
    { x: -5, y: 8, dx: -8, dy: -35, size: 3 },
    { x: 6, y: -4, dx: 13, dy: -33, size: 4 }
  ] as const
  const recoveryTween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    delay: lastArrival + 35,
    duration: 620,
    onUpdate: (counter) => {
      if (!recovery.active) return
      const progress = Phaser.Math.Clamp(counter.getValue() ?? 0, 0, 1)
      const fade = Phaser.Math.Clamp((1 - progress) / 0.18, 0, 1)
      const pulse = 0.88 + 0.12 * Math.sin(progress * Math.PI * 6)
      recovery.clear()

      const groundAlpha = fade * pulse
      recovery.fillStyle(0xd8a568, groundAlpha * 0.28)
      recovery.fillEllipse(0, 4, 56 + progress * 20, 19 + progress * 9)
      recovery.lineStyle(3, 0xc99761, groundAlpha * 0.85)
      recovery.strokeEllipse(0, 4, 47 + progress * 26, 16 + progress * 10)

      const gathering = Phaser.Math.Clamp(progress / 0.5, 0, 1)
      const gatheringAlpha =
        Phaser.Math.Clamp(progress / 0.08, 0, 1) *
        Phaser.Math.Clamp((0.6 - progress) / 0.22, 0, 1)
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10 + progress * 0.8
        const radius = 42 - gathering * 18
        recovery.fillStyle(
          i % 2 === 0 ? 0xf0d49d : 0xc99761,
          gatheringAlpha * 0.85
        )
        recovery.fillEllipse(
          Math.cos(angle) * radius,
          4 + Math.sin(angle) * radius * 0.3,
          6,
          3.5
        )
      }

      const healingAlpha =
        Phaser.Math.Clamp(progress / 0.1, 0, 1) *
        Phaser.Math.Clamp((0.86 - progress) / 0.3, 0, 1)
      const healingY = 2 - progress * 16
      recovery.fillStyle(0x9fffc5, 0.24 * healingAlpha * pulse)
      recovery.fillEllipse(0, healingY, 24 + progress * 14, 17 + progress * 10)
      recovery.lineStyle(3, 0xbfff7d, 0.92 * healingAlpha)
      recovery.strokeEllipse(0, 3, 32 + progress * 32, 16 + progress * 10)
      recovery.lineStyle(2, 0x7dffcf, 0.85 * healingAlpha)
      recovery.strokeEllipse(0, 3, 23 + progress * 25, 11 + progress * 8)
      recovery.fillStyle(0xe4fff0, 0.82 * healingAlpha)
      recovery.fillEllipse(0, healingY, 9 + progress * 4, 6 + progress * 3)

      for (let i = 0; i < healingMotes.length; i++) {
        const mote = healingMotes[i]
        const x = mote.x + mote.dx * progress
        const y = mote.y + mote.dy * progress
        const size = mote.size * (1 - progress * 0.45)
        recovery.fillStyle(i % 2 === 0 ? 0xf6d8a4 : 0xe7bd85, fade * 0.98)
        recovery.fillEllipse(x, y, size * 1.6, size * 0.8)
        recovery.fillStyle(0xffd69a, fade * 0.85)
        recovery.fillEllipse(
          x - size * 0.15,
          y - size * 0.1,
          size * 0.65,
          size * 0.3
        )
      }

      for (let i = 0; i < 6; i++) {
        const sparkProgress = (progress * 1.5 + i / 6) % 1
        const angle = (i * Math.PI) / 3
        const x = Math.cos(angle) * (9 + sparkProgress * 26)
        const y = 3 + Math.sin(angle) * sparkProgress * 8 - sparkProgress * 20
        const sparkAlpha = (1 - sparkProgress) * fade
        recovery.fillStyle(i % 2 === 0 ? 0xbfff7d : 0xffd69a, sparkAlpha)
        recovery.fillEllipse(x, y, 5, 3.5)
      }
    },
    onComplete: () => recovery.destroy()
  })
  recovery.once(Phaser.GameObjects.Events.DESTROY, () => recoveryTween.stop())
}
