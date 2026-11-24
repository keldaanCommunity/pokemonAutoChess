import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import type PokemonSprite from "../pokemon-sprite"
import { getImpactCells } from "./helpers"

type Point = { x: number; y: number }
type PhantomFlight = {
  start: Point
  end: Point
  control: Point
  launch: number
  duration: number
}
type ImpactEffect = {
  fallback: Point
  time: number
  ground: Phaser.GameObjects.Graphics
  sprite: PokemonSprite | undefined
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const AURA_DURATION = 1450
const FLIGHT_MIN_DURATION = 360
const FLIGHT_MAX_DURATION = 740
const LAUNCH_STAGGER = 42
const MAX_LAUNCH_STAGGER = 420
const PHANTOMS_PER_TARGET = 3
const ARC_ANGLES = [-0.95, 0.08, 0.95]

function drawPolygon(
  graphics: Phaser.GameObjects.Graphics,
  points: [number, number][],
  x: number,
  y: number,
  angle: number,
  scale: number,
  color: number,
  alpha: number
) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const transformed = points.map(
    ([px, py]) =>
      new Phaser.Math.Vector2(
        x + (px * cos - py * sin) * scale,
        y + (px * sin + py * cos) * scale
      )
  )
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(transformed, true)
  graphics.lineStyle(2 * scale, 0x9e5cad, alpha * 0.9)
  graphics.strokePoints(transformed, true)
}

function drawPhantom(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  scale: number,
  alpha: number,
  wingbeat: number
) {
  const flap = Math.sin(wingbeat) * 2.5
  drawPolygon(
    graphics,
    [
      [-3, -1],
      [-8, -5 - flap],
      [-7, -1],
      [-12, 1],
      [-8, 3],
      [-10, 7],
      [-3, 4]
    ],
    x,
    y,
    angle,
    scale,
    0x27112f,
    alpha
  )
  drawPolygon(
    graphics,
    [
      [3, -1],
      [8, -5 - flap],
      [7, -1],
      [12, 1],
      [8, 3],
      [10, 7],
      [3, 4]
    ],
    x,
    y,
    angle,
    scale,
    0x27112f,
    alpha
  )

  graphics.fillStyle(0x5b286d, alpha)
  graphics.fillEllipse(x, y, 7 * scale, 10 * scale)
  drawPolygon(
    graphics,
    [
      [-2.5, -2],
      [-2.5, -6],
      [0, -3],
      [2.5, -6],
      [2.5, -2]
    ],
    x,
    y,
    angle,
    scale,
    0x5b286d,
    alpha
  )

  const eyeOffsetX = Math.cos(angle)
  const eyeOffsetY = Math.sin(angle)
  graphics.fillStyle(0xf1a4e8, alpha)
  graphics.fillCircle(
    x - eyeOffsetY * 1.25 * scale,
    y + eyeOffsetX * 1.25 * scale - 0.5 * scale,
    0.85 * scale
  )
  graphics.fillCircle(
    x + eyeOffsetY * 1.25 * scale,
    y - eyeOffsetX * 1.25 * scale - 0.5 * scale,
    0.85 * scale
  )
}

function drawAura(
  ground: Phaser.GameObjects.Graphics,
  front: Phaser.GameObjects.Graphics,
  elapsed: number
) {
  ground.clear()
  front.clear()

  const appear = clamp(elapsed / 180)
  const fade = clamp((AURA_DURATION - elapsed) / 420)
  const strength = appear * fade
  if (strength <= 0) return

  const pulse = 0.92 + Math.sin(elapsed * 0.012) * 0.08
  ground.fillStyle(0x160d25, strength * 0.64)
  ground.fillEllipse(0, 0, 104 * pulse, 39 * pulse)
  ground.lineStyle(4, 0x52266f, strength * 0.94)
  ground.strokeEllipse(0, 0, 96 * pulse, 34 * pulse)
  ground.lineStyle(2, 0xb568c9, strength * 0.68)
  ground.strokeEllipse(0, 0, 66 * pulse, 24 * pulse)

  front.fillStyle(0x55206f, strength * 0.16)
  front.fillEllipse(0, -17, 52, 60)
  front.lineStyle(3, 0x9a4bb3, strength * 0.84)
  front.beginPath()
  front.arc(0, -16, 42 * pulse, Math.PI * 0.08, Math.PI * 0.92)
  front.strokePath()
  front.beginPath()
  front.arc(0, -16, 42 * pulse, Math.PI * 1.08, Math.PI * 1.92)
  front.strokePath()

  for (let i = 0; i < 3; i++) {
    const angle = -Math.PI / 2 + elapsed * 0.004 + (i * Math.PI * 2) / 3
    const radius = 37 + Math.sin(elapsed * 0.008 + i) * 5
    const x = Math.cos(angle) * radius
    const y = -16 + Math.sin(angle) * radius * 0.7
    front.fillStyle(0xd67bda, strength * 0.8)
    front.fillCircle(x, y, 1.4)
  }

  const orbitFade = clamp((740 - elapsed) / 340)
  if (orbitFade > 0) {
    for (let i = 0; i < 4; i++) {
      const angle = elapsed * 0.008 + (i * Math.PI) / 2
      const radius = 30 + Math.sin(elapsed * 0.01 + i) * 5
      const x = Math.cos(angle) * radius
      const y = -16 + Math.sin(angle) * radius * 0.68
      drawPhantom(
        front,
        x,
        y,
        angle + Math.PI / 2,
        1.25,
        strength * orbitFade,
        elapsed * 0.04 + i
      )
    }
  }
}

function getFlightPoint(flight: PhantomFlight, progress: number) {
  const inverse = 1 - progress
  return {
    x:
      inverse * inverse * flight.start.x +
      2 * inverse * progress * flight.control.x +
      progress * progress * flight.end.x,
    y:
      inverse * inverse * flight.start.y +
      2 * inverse * progress * flight.control.y +
      progress * progress * flight.end.y
  }
}

function getShadowCenter(
  sprite: PokemonSprite | undefined,
  fallback: Point
): Point {
  const shadow = sprite?.shadow
  if (!shadow?.active) return fallback

  const frame = shadow.frame
  return shadow
    .getWorldTransformMatrix()
    .transformPoint(
      (frame.x + frame.width / 2 - shadow.displayOriginX) *
        (shadow.flipX ? -1 : 1),
      (frame.y + frame.height / 2 - shadow.displayOriginY) *
        (shadow.flipY ? -1 : 1)
    )
}

export const nightmareAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  pokemonsOnBoard,
  flip,
  delay,
  data
}) => {
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const source = { x: casterX, y: casterY - 18 }
  const casterSprite = pokemonsOnBoard.find(
    (pokemon) =>
      pokemon.positionX === positionX && pokemon.positionY === positionY
  )
  const targets = getImpactCells(data)
  const flights: PhantomFlight[] = []
  const impacts: ImpactEffect[] = []

  targets.forEach(({ x, y }, targetIndex) => {
    const [targetX, targetY] = transformEntityCoordinates(x, y, flip)
    const end = { x: targetX, y: targetY - 12 }
    const dx = end.x - source.x
    const dy = end.y - source.y
    const distance = Math.hypot(dx, dy)
    const direction = Math.atan2(dy, dx)
    const travelDuration = Math.max(
      FLIGHT_MIN_DURATION,
      Math.min(FLIGHT_MAX_DURATION, distance * 0.72)
    )
    const stagger = Math.min(MAX_LAUNCH_STAGGER, targetIndex * LAUNCH_STAGGER)

    for (
      let phantomIndex = 0;
      phantomIndex < PHANTOMS_PER_TARGET;
      phantomIndex++
    ) {
      const controlAngle = direction + ARC_ANGLES[phantomIndex]
      const controlDistance = Math.min(74, Math.max(30, distance * 0.25))
      const control = {
        x: (source.x + end.x) / 2 + Math.cos(controlAngle) * controlDistance,
        y: (source.y + end.y) / 2 + Math.sin(controlAngle) * controlDistance
      }
      const launch = 140 + stagger + phantomIndex * 56
      flights.push({
        start: source,
        end,
        control,
        launch,
        duration: travelDuration
      })
      if (phantomIndex === PHANTOMS_PER_TARGET - 1) {
        const sprite = pokemonsOnBoard.find(
          (pokemon) => pokemon.positionX === x && pokemon.positionY === y
        )
        const ground = scene.add
          .graphics()
          .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
        scene.abilitiesVfxGroup?.add(ground)
        impacts.push({
          fallback: { x: targetX, y: targetY + 5 },
          time: launch + travelDuration,
          ground,
          sprite
        })
      }
    }
  })

  const ground = scene.add
    .graphics({
      ...getShadowCenter(casterSprite, { x: casterX, y: casterY + 5 })
    })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add
    .graphics({ x: casterX, y: casterY })
    .setDepth(DEPTH.PROJECTILE)
  const swarm = scene.add.graphics().setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(ground)
  scene.abilitiesVfxGroup?.add(front)
  scene.abilitiesVfxGroup?.add(swarm)

  const finalArrival = impacts.reduce(
    (latest, impact) => Math.max(latest, impact.time),
    0
  )
  const duration = Math.max(AURA_DURATION, finalArrival + 450)
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!ground.active || !front.active || !swarm.active) return
      const elapsed = counter.progress * duration
      const casterShadowCenter = getShadowCenter(casterSprite, {
        x: casterX,
        y: casterY + 5
      })
      ground.setPosition(casterShadowCenter.x, casterShadowCenter.y)
      drawAura(ground, front, elapsed)
      swarm.clear()

      flights.forEach((flight, index) => {
        const progress = clamp((elapsed - flight.launch) / flight.duration)
        if (progress <= 0 || progress >= 1) return

        const point = getFlightPoint(flight, progress)
        const ahead = getFlightPoint(flight, Math.max(0, progress - 0.025))
        const behind = getFlightPoint(flight, Math.max(0, progress - 0.075))
        const angle = Math.atan2(point.y - ahead.y, point.x - ahead.x)
        const fade = Math.min(1, progress * 8, (1 - progress) * 5)
        const scale = 1.45 + (index % PHANTOMS_PER_TARGET) * 0.1

        swarm.lineStyle(2, 0x67377a, fade * 0.34)
        swarm.beginPath()
        swarm.moveTo(behind.x, behind.y)
        swarm.lineTo(point.x, point.y)
        swarm.strokePath()
        drawPhantom(
          swarm,
          point.x,
          point.y,
          angle,
          scale,
          fade,
          elapsed * 0.035 + index
        )
      })

      impacts.forEach((impact) => {
        if (!impact.ground.active) return
        const point = getShadowCenter(impact.sprite, impact.fallback)
        impact.ground.setPosition(point.x, point.y)
        impact.ground.clear()

        const impactProgress = clamp((elapsed - impact.time) / 380)
        if (impactProgress > 0 && impactProgress < 1) {
          const ringFade = Math.sin(Math.PI * impactProgress)
          const radius = 18 + impactProgress * 26
          impact.ground.fillStyle(0x291035, ringFade * 0.54)
          impact.ground.fillEllipse(0, 0, radius * 2.5, radius * 0.9)
          impact.ground.lineStyle(4, 0xd187df, ringFade * 0.95)
          impact.ground.strokeEllipse(0, 0, radius * 2.6, radius)
          impact.ground.lineStyle(2, 0xf0a0eb, ringFade * 0.84)
          impact.ground.strokeEllipse(0, 0, radius * 1.8, radius * 0.68)
        }

        const burstProgress = clamp((elapsed - impact.time) / 420)
        if (burstProgress <= 0 || burstProgress >= 1) return
        const batFade = Math.min(
          1,
          burstProgress * 7,
          (1 - burstProgress) * 3.5
        )
        for (let i = 0; i < 6; i++) {
          const angle =
            (i / 6) * Math.PI * 2 +
            impact.time * 0.001 +
            burstProgress * Math.PI * 1.4
          const distance = 8 + burstProgress * 38
          const batX = point.x + Math.cos(angle) * distance
          const batY =
            point.y + Math.sin(angle) * distance * 0.58 - burstProgress * 16
          const tailX = point.x + Math.cos(angle) * Math.max(0, distance - 7)
          const tailY =
            point.y +
            Math.sin(angle) * Math.max(0, distance - 7) * 0.58 -
            Math.max(0, burstProgress - 0.04) * 16
          swarm.lineStyle(2, 0x9e5cad, batFade * 0.58)
          swarm.beginPath()
          swarm.moveTo(tailX, tailY)
          swarm.lineTo(batX, batY)
          swarm.strokePath()
          drawPhantom(
            swarm,
            batX,
            batY,
            angle,
            1.2 - burstProgress * 0.18,
            batFade,
            elapsed * 0.04 + i
          )
        }
      })
    },
    onComplete: () => {
      if (ground.active) ground.destroy()
      if (front.active) front.destroy()
      if (swarm.active) swarm.destroy()
      impacts.forEach((impact) => {
        if (impact.ground.active) impact.ground.destroy()
      })
    }
  })
  ground.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
