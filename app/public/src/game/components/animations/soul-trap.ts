import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getShadowLocalCenter, isBoardCellObject } from "./helpers"

type SoulTarget = { x: number; y: number }

export const soulTrapAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  pokemonsOnBoard,
  flip,
  data,
  delay
}) => {
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const casterSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.positionX === positionX && pokemon.positionY === positionY
  )
  const targets: SoulTarget[] = Array.isArray(data.targets)
    ? data.targets.filter(isBoardCellObject)
    : []
  const souls = targets.flatMap(({ x, y }) => {
    const [startX, startY] = transformEntityCoordinates(x, y, flip)
    return [0, 1].map((side) => ({
      startX,
      startY: startY - 12,
      controlX: startX + (casterX - startX) * (side ? 0.25 : 0.75),
      controlY: startY - 12 + (casterY - startY) * (side ? 0.75 : 0.25),
      delay: side * 0.06,
      phase: side * Math.PI
    }))
  })

  const seal = scene.add
    .graphics({ x: casterX, y: casterY + 5 })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setAlpha(0)
  if (casterSprite) {
    seal.setPosition(0, 5)
    casterSprite.addAt(seal, casterSprite.getIndex(casterSprite.sprite))
  }
  seal.fillStyle(0x542175, 0.45)
  seal.fillEllipse(0, 0, 62, 30)
  seal.lineStyle(3, 0xc476dc, 0.85)
  seal.strokeEllipse(0, 0, 62, 30)
  seal.lineStyle(2, 0x8de15a, 0.8)
  seal.strokeEllipse(0, 0, 43, 19)
  scene.abilitiesVfxGroup?.add(seal)

  const wisps = scene.add.graphics().setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(wisps)
  scene.tweens.add({
    targets: seal,
    alpha: 1,
    duration: 800,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (tween) => {
      if (!seal.active || !wisps.active) return
      const progress = tween.progress
      const fade = Math.min(1, progress / 0.16, (1 - progress) / 0.24)
      const shadow = casterSprite?.shadow
      if (shadow) {
        const center = getShadowLocalCenter(shadow)
        seal.setPosition(center.x, center.y)
      }
      seal.setAlpha(fade * 0.85).setScale(2 * (0.75 + progress * 0.25))
      wisps.clear()

      for (const [index, soul] of souls.entries()) {
        const t = Math.max(
          0,
          Math.min(1, (progress - 0.15 - soul.delay) / 0.55)
        )
        if (progress < 0.15 + soul.delay) continue
        if (t >= 1) {
          if (index >= 8) continue
          const angle =
            (index * Math.PI * 2) / Math.min(souls.length, 8) +
            progress * Math.PI * 2
          const opacity = Math.max(0, Math.min(1, (1 - progress) / 0.2))
          const x = casterX + Math.cos(angle) * 18
          const y = casterY - 18 + Math.sin(angle) * 9
          wisps.fillStyle(0x96ed5d, opacity * 0.8)
          wisps.fillCircle(x, y, 4)
          wisps.fillStyle(0xffe77a, opacity)
          wisps.fillCircle(x, y, 2)
          continue
        }
        const point = (p: number) => {
          const inverse = 1 - p
          const swirl = Math.sin(Math.PI * p) * 5
          const angle = p * Math.PI * 2 + soul.phase
          return {
            x:
              inverse * inverse * soul.startX +
              2 * inverse * p * soul.controlX +
              p * p * casterX +
              Math.cos(angle) * swirl,
            y:
              inverse * inverse * soul.startY +
              2 * inverse * p * soul.controlY +
              p * p * (casterY - 12) +
              Math.sin(angle) * swirl
          }
        }
        const opacity = Math.min(1, t / 0.12, (1 - t) / 0.18)
        for (let i = 3; i >= 1; i--) {
          const trail = point(Math.max(0, t - i * 0.045))
          wisps.fillStyle(0xa34bcb, opacity * (0.25 - i * 0.04))
          wisps.fillCircle(trail.x, trail.y, 3 + i)
        }
        const { x, y } = point(t)
        wisps.fillStyle(0x7ad656, opacity * 0.35)
        wisps.fillCircle(x, y, 9)
        wisps.fillStyle(0x96ed5d, opacity * 0.95)
        wisps.fillCircle(x, y, 5)
        wisps.fillStyle(0xffe77a, opacity)
        wisps.fillCircle(x, y, 2.5)
      }
    },
    onComplete: () => {
      if (seal.active) seal.destroy()
      if (wisps.active) wisps.destroy()
    }
  })
}
