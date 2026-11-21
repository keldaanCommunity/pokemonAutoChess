import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import { AbilityConfigs } from "../../../../../config/game/abilities"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { Ability } from "../../../../../types/enum/Ability"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const { Clamp, Linear } = Phaser.Math
const { chargeDuration, flightDuration } = AbilityConfigs[Ability.FIERY_DANCE]
const contact = chargeDuration + flightDuration

function strandFade(u: number) {
  const t = Clamp(Math.min(u, 1 - u) / 0.2, 0, 1)
  return t * t * (3 - 2 * t)
}

function isCell(x: number, y: number) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function findSprite(args: AbilityAnimationArgs, role: "caster" | "target") {
  const id = args.data[`${role}Id`]
  if (typeof id === "string") {
    return args.pokemonsOnBoard.find((sprite) => sprite.id === id)
  }
  const x = role === "caster" ? args.positionX : args.targetX
  const y = role === "caster" ? args.positionY : args.targetY
  return args.pokemonsOnBoard.find(
    (sprite) => sprite.positionX === x && sprite.positionY === y
  )
}

function flame(
  g: GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  g.fillStyle(0xd73508, alpha * 0.8)
  g.fillCircle(x, y, size)
  g.fillTriangle(
    x - size * 0.8,
    y,
    x + size * 0.2,
    y - size * 1.8,
    x + size * 0.8,
    y
  )
  g.fillStyle(0xff820c, alpha)
  g.fillCircle(x, y, size * 0.74)
  g.fillTriangle(
    x - size * 0.55,
    y,
    x + size * 0.15,
    y - size * 1.35,
    x + size * 0.55,
    y
  )
  g.fillStyle(0xffd52c, alpha * 0.95)
  g.fillCircle(x, y - size * 0.12, size * 0.38)
}

export const fieryDanceAnimation: AbilityAnimation = (args) => {
  if (!isCell(args.positionX, args.positionY)) return
  const { scene, flip } = args
  const caster = findSprite(args, "caster")
  const target = findSprite(args, "target")
  const [casterX, casterY] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    flip
  )
  const hasTarget = isCell(args.targetX, args.targetY)
  const [targetX, targetY] = hasTarget
    ? transformEntityCoordinates(args.targetX, args.targetY, flip)
    : [casterX, casterY]
  const ground = scene.add.graphics().setDepth(DEPTH.ABILITY_GROUND_LEVEL)
  const back = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)
  let launchX = casterX
  let launchY = casterY - 15
  let launched = false

  const tween = scene.tweens.addCounter({
    from: 0,
    to: contact,
    duration: contact,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (!ground.active || !back.active || !front.active) return
      ground.clear()
      back.clear()
      front.clear()
      const time = counter.getValue() ?? 0
      const x = caster?.active ? caster.x : casterX
      const y = caster?.active ? caster.y : casterY
      const envelope =
        Clamp(time / 130, 0, 1) *
        Clamp((chargeDuration + 120 - time) / 170, 0, 1)

      ground.fillStyle(0xf45a08, envelope * 0.16)
      ground.fillEllipse(x, y + 22, 104, 39)
      ground.fillStyle(0xff9a18, envelope * 0.12)
      ground.fillEllipse(x, y + 22, 88, 27)
      ground.lineStyle(4, 0xe94b08, envelope * 0.55)
      ground.strokeEllipse(x, y + 22, 92, 29)
      ground.lineStyle(2, 0xffc42c, envelope * 0.8)
      ground.strokeEllipse(x, y + 22, 88, 26)
      for (let strand = 0; strand < 2; strand++) {
        const phase = time * 0.009 + strand * Math.PI
        const baseX = x + Math.cos(phase) * 44
        const baseY = y + 22 + Math.sin(phase) * 13
        ground.fillStyle(0xffdf55, envelope * 0.85)
        ground.fillCircle(baseX, baseY, 3)
      }

      for (let strand = 0; strand < 2; strand++) {
        for (let i = 0; i < 32; i++) {
          const u = i / 32
          const next = (i + 1) / 32
          const phase = u * Math.PI * 2.5 + time * 0.009 + strand * Math.PI
          const nextPhase =
            next * Math.PI * 2.5 + time * 0.009 + strand * Math.PI
          const g = Math.sin((phase + nextPhase) / 2) < 0 ? back : front
          const x1 = x + Math.cos(phase) * 44
          const y1 = y + 22 - u * 87 + Math.sin(phase) * 13
          const x2 = x + Math.cos(nextPhase) * 44
          const y2 = y + 22 - next * 87 + Math.sin(nextPhase) * 13
          const fade = strandFade((u + next) / 2)
          g.lineStyle(9 * fade, 0xe94b08, envelope * 0.65 * fade)
          g.lineBetween(x1, y1, x2, y2)
          g.lineStyle(5 * fade, 0xff9212, envelope * 0.85 * fade)
          g.lineBetween(x1, y1, x2, y2)
          g.lineStyle(2 * fade, 0xffdc38, envelope * 0.9 * fade)
          g.lineBetween(x1, y1, x2, y2)
        }
        for (let i = 0; i < 17; i++) {
          const u = i / 16
          const phase = u * Math.PI * 2.5 + time * 0.009 + strand * Math.PI
          const g = Math.sin(phase) < 0 ? back : front
          const flicker = 0.85 + 0.15 * Math.sin(time * 0.022 + i * 2)
          const fade = strandFade(u)
          flame(
            g,
            x + Math.cos(phase) * 44,
            y + 22 - u * 87 + Math.sin(phase) * 13,
            (5 + 2 * Math.sin(u * Math.PI)) * flicker * fade,
            envelope * (0.65 + 0.25 * Math.sin(u * Math.PI)) * fade
          )
        }
      }

      for (let i = 0; i < 14; i++) {
        const p = (time / 430 + i / 14) % 1
        const angle = i * 2.4 + time * 0.0015
        const radius = Linear(100, 38, p)
        const alpha = envelope * Math.sin(p * Math.PI)
        front.fillStyle(i % 3 === 0 ? 0xffe252 : 0xff8a15, alpha)
        front.fillCircle(
          x + Math.cos(angle) * radius,
          y - 22 + Math.sin(angle) * radius * 0.65,
          2 + (i % 3)
        )
      }

      if (!hasTarget || time < chargeDuration) return
      if (!launched) {
        launchX = x
        launchY = y - 15
        launched = true
      }
      const endX = target?.active ? target.x : targetX
      const endY = (target?.active ? target.y : targetY) - 10
      const progress = Clamp((time - chargeDuration) / flightDuration, 0, 1)
      for (let i = 4; i >= 1; i--) {
        const p = Math.max(0, progress - i * 0.065)
        const trailX = Linear(launchX, endX, p)
        const trailY = Linear(launchY, endY, p)
        flame(front, trailX, trailY, 8 - i, 0.12 + (4 - i) * 0.1)
      }
      if (progress < 1) {
        const ballX = Linear(launchX, endX, progress)
        const ballY = Linear(launchY, endY, progress)
        flame(front, ballX, ballY, 16, 1)
        front.fillStyle(0xfff1a0, 0.95).fillCircle(ballX - 2, ballY - 3, 5)
      }
    },
    onComplete: () => {
      ground.destroy()
      back.destroy()
      front.destroy()
    }
  })
  ground.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const fieryDanceHitAnimation: AbilityAnimation = (args) => {
  if (!isCell(args.targetX, args.targetY)) return
  const { scene } = args
  const target = findSprite(args, "target")
  const [x, y] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  const impact = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(impact)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 340,
    duration: 340,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (!impact.active) return
      impact.clear()
      const time = counter.getValue() ?? 0
      const p = Clamp(time / 340, 0, 1)
      const cx = target?.active ? target.x : x
      const cy = (target?.active ? target.y : y) - 10
      const spread = 1 - (1 - Clamp(time / 190, 0, 1)) ** 2
      const alpha = Clamp((1 - p) / 0.55, 0, 1)
      const flash = Clamp((110 - time) / 80, 0, 1)

      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10 + (i % 3) * 0.18
        const distance = (11 + (i % 4) * 3) * spread
        flame(
          impact,
          cx + Math.cos(angle) * distance,
          cy + Math.sin(angle) * distance - p * 5,
          (6.5 + (i % 3) * 1.5) * (1 - p * 0.45),
          alpha * 0.85
        )
      }

      impact.fillStyle(0xffdf55, flash * 0.85)
      impact.fillCircle(cx, cy, 9 + spread * 3)
      impact.fillStyle(0xfff6bd, flash)
      impact.fillCircle(cx, cy, 5 + spread * 2)

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + 0.3
        const distance = (12 + (i % 3) * 6) * spread
        const sparkX = cx + Math.cos(angle) * distance
        const sparkY = cy + Math.sin(angle) * distance - p * 5
        impact.fillStyle(i % 3 === 0 ? 0xffdc49 : 0xff7410, alpha)
        impact.fillCircle(sparkX, sparkY, (1.5 + (i % 2)) * (1 - p * 0.5))
      }
    },
    onComplete: () => impact.destroy()
  })
  impact.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())

  const back = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)
  const vortex = scene.tweens.addCounter({
    from: 0,
    to: 700,
    duration: 700,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      back.clear()
      front.clear()
      const time = counter.getValue() ?? 0
      const cx = target?.active ? target.x : x
      const cy = (target?.active ? target.y : y) - 10
      const envelope =
        Clamp((time - 40) / 140, 0, 1) * Clamp((700 - time) / 220, 0, 1)

      for (let i = 0; i < 22; i++) {
        const rise = (i / 22 + time / 620) % 1
        const angle = i * 2.4 + time * 0.01 + rise * 1.5
        const radius = 32 + rise * 18
        const px = cx + Math.cos(angle) * radius
        const py = cy + 20 - rise * 62 + Math.sin(angle) * 12
        const alpha = envelope * Math.sin(rise * Math.PI)
        const g = Math.sin(angle) < 0 ? back : front
        const trail = 7 + (i % 3) * 3
        g.lineStyle(3, 0xf45a08, alpha * 0.6)
        g.lineBetween(
          px,
          py,
          px + Math.sin(angle) * trail,
          py - Math.cos(angle) * trail * 0.4 + 5
        )
        flame(g, px, py, 5 + (i % 3) * 1.5, alpha * 0.85)
        g.fillStyle(0xffce36, alpha * 0.8)
        g.fillCircle(
          px + Math.sin(angle) * (trail + 5),
          py - Math.cos(angle) * trail * 0.4 + 8,
          1.5 + (i % 2)
        )
      }
    },
    onComplete: () => {
      back.destroy()
      front.destroy()
    }
  })
  back.once(Phaser.GameObjects.Events.DESTROY, () => vortex.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => vortex.stop())
}
