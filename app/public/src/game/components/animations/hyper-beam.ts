import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import { AbilityConfigs } from "../../../../../config/game/abilities"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { Ability } from "../../../../../types/enum/Ability"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import {
  drawBeamImpactArcs,
  drawBoardEdgeMask,
  getImpactCells
} from "./helpers"

const TAU = Math.PI * 2
const TRAVEL = 200
const BEAM_DURATION = 700
const BEAM_START_FEATHER = 32
const BEAM_START_STEPS = 16
const BEAM_WIDTH_SCALE = 0.92
const colors = {
  dark: 0x7d1c0c,
  red: 0xc43b11,
  orange: 0xff7c13,
  gold: 0xffc42c,
  light: 0xffec83,
  white: 0xfff9d1
}
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function beamLine(args: AbilityAnimationArgs) {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1)
  )
    return null
  const [x, anchorY] = transformEntityCoordinates(positionX, positionY, flip)
  const [tx, ty] = transformEntityCoordinates(targetX, targetY, flip)
  if (x === tx && anchorY === ty) return null
  const angle = Math.atan2(ty - anchorY, tx - x)
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const [left, rowA] = transformEntityCoordinates(0, 0, flip)
  const [right, rowB] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const bounds = new Phaser.Geom.Rectangle(
    left - CELL_WIDTH / 2,
    Math.min(rowA, rowB) - CELL_HEIGHT / 2,
    right - left + CELL_WIDTH,
    Math.abs(rowB - rowA) + CELL_HEIGHT
  )
  const y = anchorY - 20
  let length = Infinity
  if (dx > 0) length = Math.min(length, (bounds.right - x) / dx)
  if (dx < 0) length = Math.min(length, (bounds.left - x) / dx)
  if (dy > 0) length = Math.min(length, (bounds.bottom - y) / dy)
  if (dy < 0) length = Math.min(length, (bounds.top - y) / dy)
  return { x, y, angle, dx, dy, length: Math.max(0, length), bounds }
}

export const hyperBeamChargeAnimation: AbilityAnimation = (args) => {
  const line = beamLine(args)
  if (!line) return
  const { scene } = args
  const back = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const draw = (progress: number) => {
    if (!back.active || !front.active) return
    back.clear()
    front.clear()
    const alpha = clamp(progress * 5) * (1 - clamp((progress - 0.9) / 0.1))
    const radius = 37 + 13 * progress
    const rotation = progress * 8
    for (let i = 0; i < 7; i++) {
      const graphics = i % 2 ? front : back
      const start = rotation * (i % 2 ? -0.8 : 1) + i * 0.95
      graphics.lineStyle(
        i % 3 === 0 ? 5 : 2.5,
        i % 3 === 0 ? colors.dark : i % 2 ? colors.orange : colors.gold,
        alpha * 0.9
      )
      graphics.beginPath()
      graphics.arc(line.x, line.y, radius + i * 3, start, start + 1.65)
      graphics.strokePath()
    }
    const focusX = line.x + line.dx * 39
    const focusY = line.y + line.dy * 39
    for (let i = 0; i < 27; i++) {
      const offset = i < 20 ? i / 20 : (i - 19.5) / 7
      const phase = (progress * 2.1 + offset) % 1
      const angle = i * 2.39996 + rotation * 0.3
      const distance = 10 + (1 - phase) * 55
      const tail = 5 + (1 - phase) * 15
      front.lineStyle(
        i % 4 === 0 ? 2.5 : 1.3,
        i % 2 ? colors.gold : colors.red,
        alpha * Math.sin(phase * Math.PI)
      )
      front.lineBetween(
        focusX + Math.cos(angle) * distance,
        focusY + Math.sin(angle) * distance,
        focusX + Math.cos(angle) * (distance + tail),
        focusY + Math.sin(angle) * (distance + tail)
      )
    }
    front.fillStyle(colors.orange, alpha * 0.55)
    front.fillCircle(focusX, focusY, 8 + progress * 9)
    front.fillStyle(colors.light, alpha * 0.9)
    front.fillCircle(focusX, focusY, 4 + progress * 5)
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    delay: Math.max(0, args.delay ?? 0),
    duration: AbilityConfigs[Ability.HYPER_BEAM].chargeDuration,
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => back.destroy()
  })
  back.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    front.destroy()
  })
  draw(0)
}

export const hyperBeamAnimation: AbilityAnimation = (args) => {
  const line = beamLine(args)
  if (!line) return
  const { scene } = args
  const beam = scene.add
    .graphics({ x: line.x, y: line.y })
    .setRotation(line.angle)
    .setScale(1, BEAM_WIDTH_SCALE)
    .setDepth(DEPTH.PROJECTILE)
  const maskShape = scene.add.graphics().setVisible(false)
  drawBoardEdgeMask(maskShape, line.bounds, line.dx, line.dy)
  const canvasMask =
    scene.renderer.type === Phaser.CANVAS
      ? maskShape.createGeometryMask()
      : null
  if (canvasMask) {
    beam.setMask(canvasMask)
  } else {
    beam.enableFilters()
    beam.filters?.external.addMask(maskShape, false, scene.cameras.main)
  }
  scene.abilitiesVfxGroup?.add(beam)
  scene.abilitiesVfxGroup?.add(maskShape)
  const impacts = getImpactCells(args.data).map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, args.flip)
    const graphics = scene.add
      .graphics({ x, y: y - 20 })
      .setRotation(line.angle)
      .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    scene.abilitiesVfxGroup?.add(graphics)
    const distance = Math.max(
      0,
      (x - line.x) * line.dx + (y - 20 - line.y) * line.dy
    )
    return {
      graphics,
      arrival: TRAVEL * clamp(distance / Math.max(1, line.length))
    }
  })
  const draw = (elapsed: number) => {
    if (!beam.active) return
    beam.clear()
    const progress = clamp(elapsed / TRAVEL)
    const fade = 1 - clamp((elapsed - 450) / 250)
    const end = line.length * progress
    if (end > 0 && fade > 0) {
      const layers = [
        { color: colors.red, width: 35, alpha: 0.65 },
        { color: colors.orange, width: 29, alpha: 0.95 },
        { color: colors.gold, width: 23, alpha: 1 },
        { color: colors.light, width: 15, alpha: 1 },
        { color: colors.white, width: 7, alpha: 1 }
      ]
      for (const layer of layers) {
        const drawSection = (
          start: number,
          finish: number,
          samples: number,
          opacity: number
        ) => {
          const points: Phaser.Math.Vector2[] = []
          for (const side of [-1, 1]) {
            for (let i = 0; i <= samples; i++) {
              const step = side === -1 ? i / samples : 1 - i / samples
              const x = start + (finish - start) * step
              const fraction = x / end
              const width =
                layer.width * (0.65 + 0.35 * Math.min(1, fraction * 4))
              const ripple = Math.sin(fraction * 32 - elapsed / 25) * 1.2
              points.push(new Phaser.Math.Vector2(x, side * (width + ripple)))
            }
          }
          beam.fillStyle(layer.color, layer.alpha * fade * opacity)
          beam.fillPoints(points, true)
        }
        const featherEnd = Math.min(end, BEAM_START_FEATHER)
        for (let i = 0; i < BEAM_START_STEPS; i++) {
          const start = (featherEnd * i) / BEAM_START_STEPS
          const finish = (featherEnd * (i + 1)) / BEAM_START_STEPS
          drawSection(
            start,
            finish,
            1,
            (start + finish) / (2 * BEAM_START_FEATHER)
          )
        }
        if (end > featherEnd) drawSection(featherEnd, end, 20, 1)
      }
      for (let i = 0; i < 5; i++) {
        const offset = (i - 2) * 8
        const featherEnd = Math.min(end, BEAM_START_FEATHER)
        const lineY = (x: number) => offset * (0.5 + (0.5 * x) / end)
        for (let step = 0; step < BEAM_START_STEPS; step++) {
          const start = (featherEnd * step) / BEAM_START_STEPS
          const finish = (featherEnd * (step + 1)) / BEAM_START_STEPS
          beam.lineStyle(
            i % 2 ? 1 : 2,
            i % 2 ? colors.orange : colors.white,
            fade * 0.7 * ((start + finish) / (2 * BEAM_START_FEATHER))
          )
          beam.lineBetween(start, lineY(start), finish, lineY(finish))
        }
        if (end > featherEnd) {
          beam.lineStyle(
            i % 2 ? 1 : 2,
            i % 2 ? colors.orange : colors.white,
            fade * 0.7
          )
          beam.lineBetween(featherEnd, lineY(featherEnd), end, offset)
        }
      }
    }
    impacts.forEach(({ graphics, arrival }) => {
      if (!graphics.active) return
      graphics.clear()
      const local = elapsed - arrival
      if (local < 0 || local > 290) return
      const appear = clamp(local / 45)
      const alpha = appear * (1 - clamp((local - 70) / 220))
      const expansion = 1 + clamp(local / 160) * 0.5
      drawBeamImpactArcs(graphics, local, expansion, alpha, 0x26130f)
      graphics.fillStyle(colors.white, alpha)
      graphics.fillCircle(0, 0, 10)
    })
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: BEAM_DURATION,
    delay: Math.max(0, args.delay ?? 0),
    duration: BEAM_DURATION,
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => beam.destroy()
  })
  beam.once(Phaser.GameObjects.Events.DESTROY, () => {
    tween.stop()
    maskShape.destroy()
    impacts.forEach(({ graphics }) => graphics.destroy())
  })
  draw(0)
}
