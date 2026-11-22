import Phaser from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const DURATION = 750
const IMPACT = 150
const { Clamp } = Phaser.Math

export const bulldozeAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  pokemonsOnBoard,
  flip,
  delay = 0,
  data
}) => {
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT
  )
    return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [firstX, firstY] = transformEntityCoordinates(0, 0, flip)
  const [lastX, lastY] = transformEntityCoordinates(
    BOARD_WIDTH - 1,
    BOARD_HEIGHT - 1,
    flip
  )
  const left = Math.min(firstX, lastX) - CELL_WIDTH / 2 + 3
  const right = Math.max(firstX, lastX) + CELL_WIDTH / 2 - 3
  const top = Math.min(firstY, lastY) - CELL_HEIGHT / 2 + 3
  const bottom = Math.max(firstY, lastY) + CELL_HEIGHT / 2 - 3
  const caster = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.active &&
      pokemon.positionX === positionX &&
      pokemon.positionY === positionY &&
      pokemon.pokemon.name === Pkm.TORTERRA
  )
  const leaves = caster
    ? Array.from({ length: 8 }, (_, i) => ({
        startX: [-13, 12, -6, 8, -16, 16, -9, 10][i],
        startY: -36 - (i % 3) * 3,
        drift: [-34, 32, -40, 35, -29, 42, -38, 38][i],
        delay: i * 18,
        angle: i * 1.4,
        size: 6.5 + (i % 2)
      }))
    : []
  const leafColors = caster?.pokemon.shiny
    ? [0x376700, 0x628b4a, 0x85b56e]
    : [0x376700, 0x4f8700, 0x57af00]
  const rings = [0.4, 0.9, 1.36].map((radius, ring) => {
    const points = Array.from({ length: 48 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 48
      const jaggedRadius = radius + (Math.random() - 0.5) * 0.18
      return {
        x: x + Math.cos(angle) * jaggedRadius * CELL_WIDTH,
        y: y + Math.sin(angle) * jaggedRadius * CELL_HEIGHT
      }
    })
    return points.flatMap((a, i) => {
      const b = points[(i + 1) % points.length]
      const dx = b.x - a.x
      const dy = b.y - a.y
      let start = 0
      let end = 1
      for (const [origin, delta, min, max] of [
        [a.x, dx, left + 4, right - 4],
        [a.y, dy, top + 4, bottom - 4]
      ]) {
        if (Math.abs(delta) < 0.000001) {
          if (origin < min || origin > max) return []
        } else {
          const first = (min - origin) / delta
          const last = (max - origin) / delta
          start = Math.max(start, Math.min(first, last))
          end = Math.min(end, Math.max(first, last))
        }
      }
      if (start >= end) return []
      return [
        {
          a: { x: a.x + dx * start, y: a.y + dy * start },
          b: { x: a.x + dx * end, y: a.y + dy * end },
          delay: ring * 45 + Math.random() * 20
        }
      ]
    })
  })
  const targets = getImpactCells(data)
    .filter(
      (cell) =>
        Math.max(Math.abs(cell.x - positionX), Math.abs(cell.y - positionY)) ===
        1
    )
    .map((cell) => {
      const [tx, ty] = transformEntityCoordinates(cell.x, cell.y, flip)
      const puffs = Array.from({ length: 12 }, (_, i) => ({
        side: i % 2 === 0 ? -1 : 1,
        offsetX: 5 + Math.random() * 18,
        offsetY: Math.random() * 10,
        speedX: 0.025 + Math.random() * 0.065,
        speedY: 0.015 + Math.random() * 0.06,
        delay: Math.random() * 75,
        width: 12 + Math.random() * 10,
        height: 8 + Math.random() * 7,
        color: i % 2 ? 0xaa8c6e : 0xd0b698
      }))
      const fragments = Array.from({ length: 7 }, (_, i) => ({
        side: i % 2 === 0 ? -1 : 1,
        offset: 2 + Math.random() * 7,
        distance: 18 + Math.random() * 18,
        height: 16 + Math.random() * 24,
        delay: Math.random() * 65,
        size: 2.5 + Math.random() * 2.5,
        color: i % 2 ? 0x745440 : 0x967154
      }))
      return { x: tx, y: ty, puffs, fragments }
    })

  const ground = scene.add.graphics().setDepth(DEPTH.ABILITY_GROUND_LEVEL)
  const dust = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const impact = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(dust)
  scene.abilitiesVfxGroup?.add(impact)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!ground.active || !dust.active || !impact.active) return
      const t = counter.getValue() ?? 0
      ground.clear()
      dust.clear()
      impact.clear()

      const dustAlpha = Clamp(t / 70, 0, 1) * Clamp((570 - t) / 300, 0, 1)
      if (dustAlpha > 0) {
        for (let i = 0; i < 7; i++) {
          const direction = i % 2 === 0 ? 1 : -1
          const spread = 21 + (i % 4) * 7 + t * 0.035
          const px = x + direction * spread
          const py = y - (i % 3) * 4 - t * 0.018
          if (
            px < left + 15 ||
            px > right - 15 ||
            py < top + 8 ||
            py > bottom - 8
          )
            continue
          dust.fillStyle(i % 2 ? 0x9d8169 : 0xcbb394, dustAlpha * 0.7)
          dust.fillEllipse(px, py, 22 + (i % 3) * 5, 14 + (i % 2) * 5)
        }
      }

      const drawLeaves = (
        originX: number,
        originY: number,
        elapsed: number,
        duration: number,
        stagger: number
      ) => {
        for (const leaf of leaves) {
          const age = elapsed - leaf.delay * stagger
          if (age < 0 || age >= duration) continue
          const progress = age / duration
          const alpha =
            Clamp(age / 45, 0, 1) * Clamp((duration - age) / 140, 0, 1)
          const px =
            originX +
            leaf.startX +
            leaf.drift * progress +
            Math.sin(age / 95 + leaf.angle) * 3
          const py = originY + leaf.startY + 38 * progress
          const angle = leaf.angle + progress * 4
          const dx = Math.cos(angle) * leaf.size
          const dy = Math.sin(angle) * leaf.size
          const nx = -dy * 0.45
          const ny = dx * 0.45
          impact.fillStyle(leafColors[2], alpha)
          impact.lineStyle(1.5, leafColors[0], alpha)
          impact.beginPath()
          impact.moveTo(px - dx, py - dy)
          impact.lineTo(px - nx, py - ny)
          impact.lineTo(px + dx, py + dy)
          impact.lineTo(px + nx, py + ny)
          impact.closePath()
          impact.fillPath()
          impact.strokePath()
          impact.fillStyle(leafColors[1], alpha)
          impact.fillTriangle(
            px - dx,
            py - dy,
            px - nx * 0.7,
            py - ny * 0.7,
            px + dx * 0.7,
            py + dy * 0.7
          )
          impact.lineStyle(1, leafColors[2], alpha * 0.8)
          impact.lineBetween(
            px - dx * 0.6,
            py - dy * 0.6,
            px + dx * 0.6,
            py + dy * 0.6
          )
        }
      }
      drawLeaves(x, y, t, 600, 1)

      for (const ring of rings) {
        const crackAlpha = Clamp((620 - t) / 220, 0, 1)
        for (const segment of ring) {
          const reveal = Clamp((t - segment.delay) / 35, 0, 1)
          if (reveal <= 0) continue
          const { a, b } = segment
          const bx = a.x + (b.x - a.x) * reveal
          const by = a.y + (b.y - a.y) * reveal
          const length = Math.hypot(bx - a.x, by - a.y)
          const nx = length ? -(by - a.y) / length : 0
          const ny = length ? (bx - a.x) / length : 0
          ground.fillStyle(0x30221e, crackAlpha * 0.95)
          ground.fillTriangle(
            a.x,
            a.y,
            Clamp((a.x + bx) / 2 + nx * 5, left, right),
            Clamp((a.y + by) / 2 + ny * 5, top, bottom),
            bx,
            by
          )
          ground.fillTriangle(
            a.x,
            a.y,
            Clamp((a.x + bx) / 2 - nx * 4, left, right),
            Clamp((a.y + by) / 2 - ny * 4, top, bottom),
            bx,
            by
          )
          ground.lineStyle(7, 0x3c2b23, crackAlpha * 0.95)
          ground.lineBetween(a.x, a.y, bx, by)
          ground.lineStyle(2, 0xb28b60, crackAlpha * 0.8)
          ground.lineBetween(a.x, a.y, bx, by)
        }
      }
      for (const target of targets) {
        const elapsed = t - IMPACT
        if (elapsed < 0 || elapsed >= 480) continue
        const tx = target.x
        const ty = target.y
        for (const puff of target.puffs) {
          const age = elapsed - puff.delay
          if (age < 0) continue
          const impactDust =
            Clamp(age / 65, 0, 1) * Clamp((480 - elapsed) / 230, 0, 1)
          const px = tx + puff.side * (puff.offsetX + age * puff.speedX)
          const py = ty + 5 - puff.offsetY - age * puff.speedY
          if (
            px - puff.width / 2 < left ||
            px + puff.width / 2 > right ||
            py - puff.height / 2 < top ||
            py + puff.height / 2 > bottom
          )
            continue
          impact.fillStyle(puff.color, impactDust * 0.7)
          impact.fillEllipse(px, py, puff.width, puff.height)
        }
        for (const fragment of target.fragments) {
          const age = elapsed - fragment.delay
          if (age < 0 || age >= 360) continue
          const progress = age / 360
          const px =
            tx +
            fragment.side * (fragment.offset + fragment.distance * progress)
          const py = ty - fragment.height * 4 * progress * (1 - 0.7 * progress)
          const radius = fragment.size
          if (
            px - radius >= left &&
            px + radius <= right &&
            py - radius >= top &&
            py + radius <= bottom
          ) {
            const fragmentAlpha =
              Clamp(age / 40, 0, 1) * Clamp((360 - age) / 120, 0, 1)
            impact.fillStyle(fragment.color, fragmentAlpha * 0.9)
            impact.beginPath()
            impact.moveTo(px - radius, py)
            impact.lineTo(px - radius * 0.3, py - radius)
            impact.lineTo(px + radius, py - radius * 0.4)
            impact.lineTo(px + radius * 0.6, py + radius * 0.8)
            impact.lineTo(px - radius * 0.5, py + radius * 0.65)
            impact.closePath()
            impact.fillPath()
            impact.fillStyle(0xc29b70, fragmentAlpha * 0.7)
            impact.fillTriangle(
              px - radius * 0.3,
              py - radius,
              px + radius,
              py - radius * 0.4,
              px,
              py
            )
          }
        }
        drawLeaves(tx, ty, elapsed, 350, 0.8)
      }
    },
    onComplete: () => {
      ground.destroy()
      dust.destroy()
      impact.destroy()
    }
  })
  for (const graphics of [ground, dust, impact]) {
    graphics.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  }
}
