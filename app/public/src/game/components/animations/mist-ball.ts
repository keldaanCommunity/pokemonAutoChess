import Phaser from "phaser"
import { AbilityConfigs } from "../../../../../config/game/abilities"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_WIDTH
} from "../../../../../config/game/board"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { Ability } from "../../../../../types/enum/Ability"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const IMPACT_DURATION = 260
export const MIST_BALL_RETURN_IMPACT_DURATION = 650
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

const MIST_BALL_PALETTE = {
  highlight: 0xffffff,
  impactGlow: 0xd668ff,
  impactCore: 0xffc7fa,
  impactRay: 0xf6a3ff,
  trailLight: 0xfff0ff,
  trailAccent: 0xfff0ff,
  trail: 0xf6b8f5,
  orbGlow: 0x9a4cff,
  orbBase: 0x8c4cf5,
  orbMid: 0xd08bff,
  orbLight: 0xf8d8ff,
  orbEdge: 0xf781ff
}

const LUSTER_PURGE_PALETTE: typeof MIST_BALL_PALETTE = {
  highlight: 0xddebf4,
  impactGlow: 0x6d85df,
  impactCore: 0xb0d7e5,
  impactRay: 0xaa9bdf,
  trailLight: 0xc6badd,
  trailAccent: 0xdcc68e,
  trail: 0x9fc8dd,
  orbGlow: 0x5e7edc,
  orbBase: 0x6886d8,
  orbMid: 0x89c7df,
  orbLight: 0xbddbe6,
  orbEdge: 0xaa9bdf
}

type TravelCoordinates = Pick<
  AbilityAnimationArgs,
  "positionX" | "positionY" | "targetX" | "targetY"
>

function isTravelCoordinates(value: unknown): value is TravelCoordinates {
  if (
    !value ||
    typeof value !== "object" ||
    !("positionX" in value) ||
    !("positionY" in value) ||
    !("targetX" in value) ||
    !("targetY" in value)
  )
    return false
  const { positionX, positionY, targetX, targetY } = value
  return (
    typeof positionX === "number" &&
    Number.isInteger(positionX) &&
    positionX >= 0 &&
    positionX < BOARD_WIDTH &&
    typeof positionY === "number" &&
    Number.isInteger(positionY) &&
    positionY >= 0 &&
    positionY < BOARD_HEIGHT &&
    typeof targetX === "number" &&
    Number.isInteger(targetX) &&
    targetX >= 0 &&
    targetX < BOARD_WIDTH &&
    typeof targetY === "number" &&
    Number.isInteger(targetY) &&
    targetY >= 0 &&
    targetY < BOARD_HEIGHT
  )
}

function getTravel(args: TravelCoordinates & { flip: boolean }) {
  const { positionX, positionY, targetX, targetY, flip } = args
  if (
    !Number.isFinite(targetX) ||
    !Number.isFinite(targetY) ||
    (targetX === -1 && targetY === -1) ||
    (targetX === positionX && targetY === positionY)
  )
    return null

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const [tx, ty] = transformEntityCoordinates(targetX, targetY, flip)
  const angle = Math.atan2(ty - y, tx - x)
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  return {
    x,
    y,
    dx,
    dy,
    distance: (CELL_WIDTH * 4) / Math.max(Math.abs(dx), Math.abs(dy))
  }
}

function drawImpact(
  graphics: Phaser.GameObjects.Graphics,
  time: number,
  duration: number,
  palette: typeof MIST_BALL_PALETTE
) {
  graphics.clear()
  if (time < 0 || time >= duration) return
  const alpha = clamp(time / 35) * clamp((duration - time) / 180)
  const expansion = 1 + clamp(time / 160) * 0.35
  graphics.fillStyle(palette.impactGlow, alpha * 0.25)
  graphics.fillCircle(0, 0, 26 * expansion)
  graphics.fillStyle(palette.impactCore, alpha * 0.8)
  graphics.fillCircle(0, 0, 13 * expansion)
  graphics.fillStyle(palette.highlight, alpha)
  graphics.fillCircle(0, 0, 7 * expansion)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + 0.2
    const inner = 14 * expansion
    const outer = (25 + (i % 2) * 8) * expansion
    graphics.lineStyle(
      i % 2 ? 2 : 3,
      i % 2 ? palette.impactRay : palette.highlight,
      alpha
    )
    graphics.lineBetween(
      Math.cos(angle) * inner,
      Math.sin(angle) * inner,
      Math.cos(angle) * outer,
      Math.sin(angle) * outer
    )
  }
}

function orbAnimation(
  args: AbilityAnimationArgs,
  palette: typeof MIST_BALL_PALETTE,
  outboundDuration: number
) {
  const travel = getTravel(args)
  if (!travel) return
  const { scene } = args
  const { x, y: anchorY, dx, dy, distance: travelDistance } = travel
  const y = anchorY - 20
  const duration = outboundDuration * 2
  const container = scene.add.container(0, 0).setDepth(DEPTH.PROJECTILE)
  const trail = scene.add.graphics()
  const orb = scene.add.graphics()
  container.add([trail, orb])
  scene.abilitiesVfxGroup?.add(container)
  if (Array.isArray(args.data.targets)) {
    orbHitAnimation(
      { ...args, data: { ...args.data, phase: "outbound" } },
      palette,
      outboundDuration
    )
  }

  const draw = (time: number) => {
    if (!container.active) return
    trail.clear()
    orb.clear()
    const returning = time > outboundDuration
    const linearProgress = returning
      ? clamp((duration - time) / outboundDuration)
      : clamp(time / outboundDuration)
    const progress = Phaser.Math.Easing.Cubic.Out(linearProgress)
    const headX = x + dx * travelDistance * progress
    const headY = y + dy * travelDistance * progress
    const direction = returning ? -1 : 1
    const available = returning
      ? travelDistance * (1 - progress)
      : travelDistance * progress
    const fade = clamp((duration - time) / 140)
    const appear = clamp(time / 65)
    const alpha = fade * appear
    const normalX = -dy
    const normalY = dx
    const speed = (1 - linearProgress) ** 2
    const trailLength = 260 * (0.12 + 0.88 * speed)
    const particleScale = 0.45 + 0.55 * speed

    for (let i = 15; i >= 0; i--) {
      const fraction = (i + 1) / 16
      const behind = fraction * trailLength
      if (behind > available) continue
      const wobble = Math.sin(time / 130 + i * 0.9) * (3 + fraction * 8)
      const px = headX - direction * dx * behind + normalX * wobble
      const py = headY - direction * dy * behind + normalY * wobble
      const opacity = alpha * (1 - fraction) * 0.3
      const trailColor =
        i % 6 === 0
          ? palette.trailAccent
          : i % 3 === 0
            ? palette.trailLight
            : palette.trail
      trail.fillStyle(trailColor, opacity)
      trail.fillCircle(px, py, (12 + fraction * 17) * particleScale)
      trail.fillStyle(palette.highlight, opacity * 0.75)
      trail.fillCircle(
        px + normalX * 3 * particleScale,
        py + normalY * 3 * particleScale,
        (5 + fraction * 8) * particleScale
      )
    }
    orb.fillStyle(palette.orbGlow, alpha * 0.16)
    orb.fillCircle(headX, headY, 37)
    orb.fillStyle(palette.orbBase, alpha * 0.72)
    orb.fillCircle(headX, headY, 29)
    orb.fillStyle(palette.orbMid, alpha * 0.8)
    orb.fillCircle(headX, headY, 23)
    orb.fillStyle(palette.orbLight, alpha * 0.9)
    orb.fillCircle(headX - dx * 2, headY - dy * 2, 15)
    orb.fillStyle(palette.highlight, alpha)
    orb.fillCircle(headX - dx * 3, headY - dy * 3, 10)
    orb.lineStyle(3, palette.orbEdge, alpha * 0.9)
    orb.strokeCircle(headX, headY, 32)
    orb.lineStyle(1.5, palette.highlight, alpha * 0.8)
    orb.strokeCircle(headX, headY, 27)
  }
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => container.destroy()
  })
  container.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  draw(0)
}

function orbHitAnimation(
  args: AbilityAnimationArgs,
  palette: typeof MIST_BALL_PALETTE,
  outboundDuration: number
) {
  const targets = getImpactCells(args.data)
  if (targets.length === 0) return
  const { scene, flip } = args
  const outbound = args.data.phase === "outbound"
  const impactDuration = outbound
    ? IMPACT_DURATION
    : MIST_BALL_RETURN_IMPACT_DURATION
  const returnTravel: unknown = args.data.travel
  const travel = outbound
    ? getTravel(args)
    : isTravelCoordinates(returnTravel)
      ? getTravel({ ...returnTravel, flip })
      : null
  if (outbound && !travel) return
  const container = scene.add
    .container(0, 0)
    .setDepth(outbound ? DEPTH.PROJECTILE : DEPTH.HIT_FX_ABOVE_POKEMON)
  const impacts = targets.map((cell) => {
    const [x, y] = transformEntityCoordinates(cell.x, cell.y, flip)
    const graphic = scene.add.graphics({ x, y: y - 20 })
    container.add(graphic)
    let arrival = 0
    if (travel) {
      const offsetX = x - travel.x
      const offsetY = y - travel.y
      const distance = offsetX * travel.dx + offsetY * travel.dy
      const perpendicular = Math.abs(offsetX * travel.dy - offsetY * travel.dx)
      const cellRadius =
        (CELL_WIDTH / 2) * (Math.abs(travel.dx) + Math.abs(travel.dy))
      const onPath =
        distance >= -0.000001 &&
        distance <= travel.distance + 0.000001 &&
        perpendicular <= cellRadius + 0.000001
      // Power2 is Cubic.Out; invert it to time the impact to the projectile.
      const fraction = clamp(distance / travel.distance)
      if (outbound) {
        arrival = outboundDuration * (1 - Math.cbrt(1 - fraction))
      } else if (onPath) {
        arrival = outboundDuration * Math.cbrt(1 - fraction)
      }
    }
    return { graphic, arrival }
  })
  scene.abilitiesVfxGroup?.add(container)
  const duration =
    Math.max(...impacts.map(({ arrival }) => arrival)) + impactDuration
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (!container.active) return
      const time = counter.getValue() ?? 0
      impacts.forEach(({ graphic, arrival }) =>
        drawImpact(graphic, time - arrival, impactDuration, palette)
      )
    },
    onComplete: () => container.destroy()
  })
  container.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const mistBallAnimation: AbilityAnimation = (args) =>
  orbAnimation(
    args,
    MIST_BALL_PALETTE,
    AbilityConfigs[Ability.MIST_BALL].returnDelay
  )

export const mistBallHitAnimation: AbilityAnimation = (args) =>
  orbHitAnimation(
    args,
    MIST_BALL_PALETTE,
    AbilityConfigs[Ability.MIST_BALL].returnDelay
  )

export const lusterPurgeAnimation: AbilityAnimation = (args) =>
  orbAnimation(
    args,
    LUSTER_PURGE_PALETTE,
    AbilityConfigs[Ability.LUSTER_PURGE].returnDelay
  )

export const lusterPurgeHitAnimation: AbilityAnimation = (args) =>
  orbHitAnimation(
    args,
    LUSTER_PURGE_PALETTE,
    AbilityConfigs[Ability.LUSTER_PURGE].returnDelay
  )
