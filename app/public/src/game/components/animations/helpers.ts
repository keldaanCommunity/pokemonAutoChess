import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH, CELL_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs,
  AbilityAnimationMaker,
  AbilityAnimationOptions,
  HitSprite
} from "../../../../../types/Animation"
import { AttackSpriteScale } from "../../../../../types/Animation"
import type { Ability } from "../../../../../types/enum/Ability"
import type { Orientation } from "../../../../../types/enum/Game"
import { distanceM } from "../../../../../utils/distance"
import { wait } from "../../../../../utils/function"
import { logger } from "../../../../../utils/logger"
import { angleBetween, max } from "../../../../../utils/number"
import { OrientationVector } from "../../../../../utils/orientation"
import { pickRandomIn } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import type { DebugScene } from "../../scenes/debug-scene"
import type GameScene from "../../scenes/game-scene"
import type PokemonSprite from "../pokemon-sprite"

export type AbilityCoordinates =
  | [number, number, boolean?]
  | "target"
  | "caster"

export function drawBeamImpactArcs(
  graphics: GameObjects.Graphics,
  elapsed: number,
  expansion: number,
  alpha: number,
  color: number
) {
  for (let ring = 0; ring < 3; ring++) {
    const radius = (23 + ring * 7) * expansion
    const center = 4 + ring * 4
    for (let segment = 0; segment < 3; segment++) {
      const angle = (segment * Math.PI * 2) / 3 + elapsed / 500 + ring * 0.3
      const halfArc = 0.76 - ring * 0.04
      const points: Phaser.Math.Vector2[] = []
      for (const side of [-1, 1]) {
        for (let step = 0; step <= 16; step++) {
          const progress = side === -1 ? step / 16 : 1 - step / 16
          const theta = angle + halfArc * (progress * 2 - 1)
          const thickness = ((7 - ring) / 2) * Math.sin(Math.PI * progress)
          const r = radius + side * thickness
          points.push(
            new Phaser.Math.Vector2(
              center + Math.cos(theta) * r * 0.64,
              Math.sin(theta) * r
            )
          )
        }
      }
      graphics.fillStyle(color, alpha)
      graphics.fillPoints(points, true)
    }
  }
}

export function drawBoardEdgeMask(
  mask: GameObjects.Graphics,
  bounds: Phaser.Geom.Rectangle,
  dx: number,
  dy: number
) {
  const { left, right, top, bottom } = bounds
  const feather = 24
  const xs = [
    left,
    left + (dx < -0.000001 ? feather : 0),
    right - (dx > 0.000001 ? feather : 0),
    right
  ]
  const ys = [
    top,
    top + (dy < -0.000001 ? feather : 0),
    bottom - (dy > 0.000001 ? feather : 0),
    bottom
  ]
  const alpha = (x: number, y: number) =>
    Math.min(
      dx < -0.000001 ? (x - left) / feather : 1,
      dx > 0.000001 ? (right - x) / feather : 1,
      dy < -0.000001 ? (y - top) / feather : 1,
      dy > 0.000001 ? (bottom - y) / feather : 1,
      1
    )
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      const x = xs[column]
      const y = ys[row]
      const width = xs[column + 1] - x
      const height = ys[row + 1] - y
      if (width === 0 || height === 0) continue
      mask.fillGradientStyle(
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        alpha(x, y),
        alpha(x + width, y),
        alpha(x, y + height),
        alpha(x + width, y + height)
      )
      mask.fillRect(x, y, width, height)
    }
  }
}

export function getImpactCells(data: AbilityAnimationArgs["data"]) {
  const targets: unknown = data.targets
  if (!Array.isArray(targets)) return []
  const seen = new Set<number>()
  return targets
    .slice(0, BOARD_WIDTH * BOARD_HEIGHT)
    .filter((cell): cell is { x: number; y: number } => {
      if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell))
        return false
      const { x, y } = cell
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        x < 0 ||
        x >= BOARD_WIDTH ||
        y < 0 ||
        y >= BOARD_HEIGHT
      ) {
        return false
      }
      const key = y * BOARD_WIDTH + x
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export function getSurgeAllies(
  data: AbilityAnimationArgs["data"],
  casterX: number,
  casterY: number
) {
  const cells: unknown = data.allies
  if (!Array.isArray(cells)) return []

  const seen = new Set<number>()
  const allies: { x: number; y: number }[] = []
  for (const cell of cells.slice(0, BOARD_WIDTH * BOARD_HEIGHT)) {
    if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell)) {
      continue
    }
    const { x, y } = cell
    if (
      typeof x !== "number" ||
      !Number.isInteger(x) ||
      typeof y !== "number" ||
      !Number.isInteger(y) ||
      x < 0 ||
      x >= BOARD_WIDTH ||
      y < 0 ||
      y >= BOARD_HEIGHT ||
      (x === casterX && y === casterY)
    ) {
      continue
    }
    const key = y * BOARD_WIDTH + x
    if (seen.has(key)) continue
    seen.add(key)
    allies.push({ x, y })
    if (allies.length >= 48) break
  }
  return allies
}

function scheduleAbilityStart(
  scene: AbilityAnimationArgs["scene"],
  delay: number,
  start: () => void
) {
  if ("stepPreviewFrame" in scene) {
    scene.time.delayedCall(delay, start)
  } else {
    setTimeout(start, delay)
  }
}

export function drawGoldCoin(graphics: GameObjects.Graphics) {
  graphics.fillStyle(0xffc629, 0.98)
  graphics.fillEllipse(0, 0, 10, 14)
  graphics.lineStyle(1.5, 0xffffae, 0.95)
  graphics.strokeEllipse(0, 0, 10, 14)
  graphics.lineStyle(1, 0xf18a12, 0.9)
  graphics.strokeEllipse(0, 0, 5, 9)
}

export type TweenAnimationMakerOptions = {
  duration?: number
  ease?: string | ((v: number) => number)
  hitAnim?: AbilityAnimation | AbilityAnimation[]
  tweenProps?: Record<string, any>
  startCoords?: AbilityCoordinates
  endCoords?: AbilityCoordinates
  startPositionOffset?: [number, number]
  endPositionOffset?: [number, number]
  startPosition?: [number, number]
  destroyOnTweenComplete?: boolean
}

export function displayHit(
  scene: GameScene | DebugScene,
  hitSpriteTypes: HitSprite | HitSprite[],
  x: number,
  y: number,
  _flip: boolean
) {
  const hitSpriteType = Array.isArray(hitSpriteTypes)
    ? pickRandomIn(hitSpriteTypes)
    : hitSpriteTypes
  const frame = `${hitSpriteType}/000.png`

  if (
    !scene.textures.exists("attacks") ||
    !scene.textures.get("attacks").has(frame)
  ) {
    logger.warn(`Missing frame: ${frame} in attacks texture`)
    return null
  }

  if (!scene.anims.exists(hitSpriteType)) {
    logger.warn(`Missing animation: ${hitSpriteType}`)
    return null
  }

  const hitSprite = scene.add.sprite(
    x + (Math.random() - 0.5) * 30,
    y + (Math.random() - 0.5) * 30,
    "attacks",
    `${hitSpriteType}/000.png`
  )
  hitSprite
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
    .setScale(...(AttackSpriteScale[hitSpriteType] ?? [1, 1]))
  hitSprite.anims.play(hitSpriteType)
  hitSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    hitSprite.destroy()
  })
  scene.abilitiesVfxGroup?.add(hitSprite)
}

export function addAbilitySprite(
  scene: GameScene | DebugScene,
  ability: Ability | string,
  ap: number,
  position: number[],
  options: AbilityAnimationOptions = {}
) {
  const frame = options.frame ?? `${ability}/000.png`
  const textureKey = options.textureKey ?? "abilities"

  if (
    !scene.textures.exists(textureKey) ||
    !scene.textures.get(textureKey).has(frame)
  ) {
    logger.warn(`Missing frame "${frame}" in texture "${textureKey}"`)
    return null
  }

  if (ability && !scene.anims.exists(ability)) {
    logger.warn(`Missing animation: ${ability}`)
    return null
  }

  const sprite = scene.add.sprite(position[0], position[1], textureKey, frame)
  scene.abilitiesVfxGroup?.add(sprite)

  const {
    origin,
    scale,
    depth,
    tint,
    tintMode,
    rotation,
    angle,
    alpha,
    flipX,
    flipY,
    destroyOnComplete = true,
    animOptions = {}
  } = options
  sprite.setOrigin(
    ...(Array.isArray(origin)
      ? origin
      : origin !== undefined
        ? [origin]
        : [0.5, 0.5])
  )
  const apScaling = options.apScaling !== false ? 1 + ap / 200 : 1
  const scaleX = max(10)(
    (Array.isArray(scale) ? scale[0] : (scale ?? 2)) * apScaling
  )
  const scaleY = max(10)(
    (Array.isArray(scale) ? scale[1] : (scale ?? 2)) * apScaling
  )
  sprite.setScale(scaleX, scaleY)
  sprite.setDepth(depth ?? DEPTH.ABILITY)
  if (tintMode) sprite.setTintMode(tintMode)
  if (tint) sprite.setTint(tint)
  if (rotation !== undefined) sprite.setRotation(rotation)
  if (angle !== undefined) sprite.setAngle(angle)
  if (alpha !== undefined) sprite.setAlpha(alpha)
  if (flipX) sprite.flipX = true
  if (flipY) sprite.flipY = true
  if (destroyOnComplete) {
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      sprite.destroy()
    })
  }

  if (ability) sprite.play({ key: ability, ...animOptions })
  return sprite
}

export const staticAnimation: AbilityAnimationMaker<{ x: number; y: number }> =
  (options) => (args) => {
    let rotation = options.rotation
    if (options?.oriented) {
      const coordinates = transformEntityCoordinates(
        args.positionX,
        args.positionY,
        args.flip
      )
      const coordinatesTarget = transformEntityCoordinates(
        args.targetX,
        args.targetY,
        args.flip
      )
      rotation = angleBetween(coordinates, coordinatesTarget) + (rotation ?? 0)
    }

    const delay = options.delay ?? args.delay ?? 0
    scheduleAbilityStart(args.scene, delay, () => {
      addAbilitySprite(
        args.scene,
        options.ability ?? args.ability,
        args.ap,
        [
          options.x + (options?.positionOffset?.[0] ?? 0),
          options.y + (options?.positionOffset?.[1] ?? 0)
        ],
        { ...options, rotation }
      )
    })
  }

export const onCaster: AbilityAnimationMaker = (options) => (args) => {
  const [x, y] = transformEntityCoordinates(
    args.positionX,
    args.positionY,
    args.flip
  )
  return staticAnimation({ x, y, ...options })(args)
}

export const onTarget: AbilityAnimationMaker = (options) => (args) => {
  const [x, y] = transformEntityCoordinates(
    args.targetX,
    args.targetY,
    args.flip
  )
  return staticAnimation({ x, y, ...options })(args)
}

export const onCasterScale1 = onCaster({ scale: 1 })
export const onCasterScale2 = onCaster({ scale: 2 })
export const onCasterScale3 = onCaster({ scale: 3 })
export const onCasterScale4 = onCaster({ scale: 4 })
export const onTargetScale1 = onTarget({ scale: 1 })
export const onTargetScale2 = onTarget({ scale: 2 })
export const onTargetScale3 = onTarget({ scale: 3 })
export const onTargetScale4 = onTarget({ scale: 4 })

export const onSprite =
  (
    handler: (
      args: AbilityAnimationArgs & {
        casterSprite?: PokemonSprite
        targetSprite?: PokemonSprite
      }
    ) => void
  ) =>
  (args) => {
    const casterSprite = args.pokemonsOnBoard.find(
      (pkmUI) =>
        pkmUI.positionX === args.positionX && pkmUI.positionY === args.positionY
    )
    const targetSprite = args.pokemonsOnBoard.find(
      (pkmUI) =>
        pkmUI.positionX === args.targetX && pkmUI.positionY === args.targetY
    )
    handler({ casterSprite, targetSprite, ...args })
  }

const parseCoordinates = (
  coords: AbilityCoordinates,
  args: AbilityAnimationArgs
): [number, number, boolean?] => {
  if (coords === "caster") {
    return [args.positionX, args.positionY, args.flip]
  } else if (coords === "target") {
    return [args.targetX, args.targetY, args.flip]
  }
  return coords
}

export const tweenAnimation: AbilityAnimationMaker<TweenAnimationMakerOptions> =
  (options = {}) =>
  (args) => {
    const { scene, flip } = args
    let { rotation } = options
    const [startRow, startCol, startFlip] = parseCoordinates(
      options.startCoords ?? "caster",
      args
    )
    const delay = options.delay ?? args.delay ?? 0
    scheduleAbilityStart(scene, delay, () => {
      const startPosition =
        options.startPosition ||
        transformEntityCoordinates(startRow, startCol, startFlip ?? flip).map(
          (coord, i) => coord + (options.startPositionOffset?.[i] ?? 0)
        )

      if (options?.oriented) {
        const coordinates = transformEntityCoordinates(
          args.positionX,
          args.positionY,
          args.flip
        )
        const coordinatesTarget = transformEntityCoordinates(
          args.targetX,
          args.targetY,
          args.flip
        )
        rotation =
          angleBetween(coordinates, coordinatesTarget) + (rotation ?? 0)
      }

      const sprite = addAbilitySprite(
        scene,
        options.ability ?? args.ability,
        args.ap,
        startPosition,
        {
          destroyOnComplete: false,
          ...options,
          rotation
        }
      )
      if (!sprite) return null

      const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: sprite,
        duration: options.duration || 500,
        ease: options.ease || "linear",
        onComplete: () => {
          if (options.destroyOnTweenComplete !== false) sprite?.destroy()
          if (options.hitAnim) {
            if (Array.isArray(options.hitAnim)) {
              options.hitAnim.forEach((anim) => {
                anim(args)
              })
            } else options.hitAnim(args)
          }
        },
        ...(options.tweenProps ?? {})
      }

      const tween = scene.tweens.add(tweenConfig)
      if ("stepPreviewFrame" in scene) {
        sprite.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
      }
    })
  }

export const projectile: AbilityAnimationMaker<
  TweenAnimationMakerOptions & {
    orientation?: Orientation | true
    distance?: number
    easeX?: string | ((v: number) => number)
    easeY?: string | ((v: number) => number)
    projectileSpeed?: number
  }
> =
  (options = {}) =>
  (args) => {
    let {
      startCoords,
      endCoords,
      oriented,
      rotation,
      distance,
      orientation,
      projectileSpeed,
      duration
    } = options

    let endPosition: [number, number]
    if (distance !== undefined || orientation !== undefined) {
      let ox: number, oy: number
      if (endCoords !== undefined) {
        ;[ox, oy] = parseCoordinates(endCoords ?? "caster", args)
      } else {
        ;[ox, oy] = parseCoordinates(startCoords ?? "caster", args)
      }

      let dx: number, dy: number
      if (options.orientation !== undefined) {
        ;[dx, dy] =
          OrientationVector[
            options.orientation === true
              ? args.orientation
              : options.orientation
          ]
      } else {
        const angleToTarget = Math.atan2(
          args.targetY - args.positionY,
          args.targetX - args.positionX
        )
        dx = Math.cos(angleToTarget)
        dy = Math.sin(angleToTarget)
      }
      endPosition = transformEntityCoordinates(
        ox + dx * (distance ?? 12),
        oy + dy * (distance ?? 12),
        args.flip
      )

      if (oriented) {
        rotation = angleBetween([dx, -dy], [0, 0]) + (rotation ?? 0)
        oriented = false
      }
    } else {
      const [endX, endY, endFlip] = parseCoordinates(
        endCoords ?? "target",
        args
      )
      const [ox, oy] = parseCoordinates(startCoords ?? "caster", args)
      distance = distanceM(ox, oy, endX, endY)
      endPosition = transformEntityCoordinates(endX, endY, endFlip ?? args.flip)
    }

    endPosition[0] += options.endPositionOffset?.[0] ?? 0
    endPosition[1] += options.endPositionOffset?.[1] ?? 0

    if (projectileSpeed !== undefined && duration === undefined) {
      duration = Math.round(((distance ?? 12) * 1000) / projectileSpeed)
    }

    return tweenAnimation({
      ...options,
      oriented,
      duration,
      rotation,
      startCoords,
      endCoords,
      tweenProps: {
        x: {
          value: endPosition[0],
          ease: options.easeX ?? options.ease ?? "linear"
        },
        y: {
          value: endPosition[1],
          ease: options.easeY ?? options.ease ?? "linear"
        },
        ...(options.tweenProps ?? {})
      }
    })(args)
  }

export const skyfall: AbilityAnimationMaker<TweenAnimationMakerOptions> =
  (options) => (args) => {
    return projectile({
      ...options,
      startCoords: [args.targetX, 9, false]
    })(args)
  }

export const parabolicProjectile: AbilityAnimationMaker<
  TweenAnimationMakerOptions & {
    peakHeight?: number
    onProjectileLand?: (
      projectile: GameObjects.Sprite,
      args: AbilityAnimationArgs
    ) => void
  }
> =
  (options = {}) =>
  async (args) => {
    const { scene, ap, positionX, positionY, targetX, targetY, flip } = args
    const delay = options.delay ?? args.delay ?? 0
    if (delay) await wait(delay)
    let [startX, startY] = transformEntityCoordinates(
      positionX,
      positionY,
      flip
    )
    startX += options.startPositionOffset?.[0] ?? 0
    startY += options.startPositionOffset?.[1] ?? 0

    let [endX, endY] = transformEntityCoordinates(targetX, targetY, flip)
    endX += options.endPositionOffset?.[0] ?? 0
    endY += options.endPositionOffset?.[1] ?? 0

    const projectile = addAbilitySprite(
      scene,
      options.ability ?? args.ability,
      ap,
      [startX, startY],
      {
        destroyOnComplete: false,
        ...options
      }
    )
    if (!projectile) return null

    const peakHeight = options.peakHeight ?? 150
    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: options.duration || 1000,
      ease: options.ease || "linear",
      onUpdate: (tween) => {
        const t = tween.getValue() // Progress from 0 to 1
        if (t === null) return

        // Linear interpolation for X
        projectile.x = startX + (endX - startX) * t

        // Parabolic formula for Y: y = startY + displacement + arc height
        // The term (4 * peakHeight * t * (1 - t)) creates a perfect parabola peak at t = 0.5
        const heightOffset = 4 * peakHeight * t * (1 - t)
        projectile.y =
          Phaser.Math.Interpolation.Linear([startY, endY], t) - heightOffset

        if (options.tweenProps?.rotation) {
          projectile.rotation = Phaser.Math.Interpolation.Linear(
            [0, options.tweenProps.rotation],
            t
          )
        }
      },
      onComplete: () => {
        if (options.destroyOnTweenComplete !== false) {
          projectile.destroy()
        }
        options.onProjectileLand?.(projectile, args)
        if (options.hitAnim) {
          if (Array.isArray(options.hitAnim)) {
            options.hitAnim.forEach((anim) => {
              anim(args)
            })
          } else options.hitAnim(args)
        }
      },
      ...(options.tweenProps ?? {})
    })
    return projectile
  }

export function followDashMovement(
  args: AbilityAnimationArgs,
  spawnTrail: (x: number, y: number, angle: number) => void
) {
  const { scene, positionX, positionY, targetX, targetY, flip } = args
  if (targetX < 0 || targetY < 0) return

  const [startX, startY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const casterSprite =
    args.pokemonsOnBoard.find(
      (pokemon) =>
        pokemon.positionX === positionX && pokemon.positionY === positionY
    ) ??
    args.pokemonsOnBoard.reduce<PokemonSprite | undefined>(
      (closest, pokemon) => {
        if (!closest) return pokemon
        return Math.hypot(pokemon.x - startX, pokemon.y - startY) <
          Math.hypot(closest.x - startX, closest.y - startY)
          ? pokemon
          : closest
      },
      undefined
    )
  if (!casterSprite) return

  const initialPosition = [casterSprite.x, casterSprite.y] as const
  const initialDistance = Math.hypot(
    initialPosition[0] - startX,
    initialPosition[1] - startY
  )
  if (initialDistance > CELL_WIDTH * 4) return

  const direction = Math.atan2(targetScreenY - startY, targetScreenX - startX)

  let finished = false
  let movementStarted = casterSprite.moveManager.isRunning
  let lastTrailTime = scene.time.now - 50
  let previousX = casterSprite.x
  let previousY = casterSprite.y
  const startedAt = scene.time.now
  const cleanup = () => {
    if (finished) return
    finished = true
    scene.events.off(Phaser.Scenes.Events.UPDATE, onSceneUpdate)
    scene.events.off(Phaser.Scenes.Events.SHUTDOWN, onSceneShutdown)
  }
  const onSceneShutdown = () => {
    cleanup()
  }
  const onSceneUpdate = (time: number) => {
    if (!casterSprite.active) {
      cleanup()
      return
    }

    if (casterSprite.moveManager.isRunning) {
      movementStarted = true
      if (time - lastTrailTime >= 40) {
        const dx = casterSprite.x - previousX
        const dy = casterSprite.y - previousY
        const trailAngle =
          Math.hypot(dx, dy) > 1 ? Math.atan2(dy, dx) : direction
        spawnTrail(casterSprite.x, casterSprite.y, trailAngle)
        previousX = casterSprite.x
        previousY = casterSprite.y
        lastTrailTime = time
      }
    } else if (
      movementStarted ||
      casterSprite.positionX !== positionX ||
      casterSprite.positionY !== positionY ||
      time - startedAt >= 180
    ) {
      cleanup()
    }
  }

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, onSceneShutdown)
  scene.events.on(Phaser.Scenes.Events.UPDATE, onSceneUpdate)
}

type PathAnimationMakerOptions = {
  duration?: number
  ease?: string | ((v: number) => number)
  sprite?: GameObjects.Sprite
  finishAnim?: AbilityAnimation | AbilityAnimation[]
  tweenProps?: Record<string, any>
  path: Phaser.Curves.Curve
  destroyOnTweenComplete?: boolean
  initSprite?: (sprite: GameObjects.Sprite) => void
}

export const pathAnimation: AbilityAnimationMaker<PathAnimationMakerOptions> =
  (options) => (args) => {
    const { scene } = args
    let { rotation } = options
    const delay = options.delay ?? args.delay ?? 0
    setTimeout(() => {
      const follower = { t: 0, vec: new Phaser.Math.Vector2() }
      const { x: startX, y: startY } = options.path.getStartPoint()
      let lastX = startX,
        lastY = startY

      const sprite =
        options.sprite ??
        addAbilitySprite(
          scene,
          options.ability ?? args.ability,
          args.ap,
          [startX, startY],
          {
            destroyOnComplete: false,
            ...options,
            rotation
          }
        )
      if (!sprite) return null
      if (options.initSprite) options.initSprite(sprite)

      const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: follower,
        duration: options.duration || 500,
        ease: options.ease || "linear",
        t: 1,
        onUpdate: () => {
          options.path.getPointAt(follower.t, follower.vec)
          sprite.setPosition(follower.vec.x, follower.vec.y)
          if (options?.oriented) {
            rotation =
              angleBetween([lastX, lastY], [follower.vec.x, follower.vec.y]) +
              (options.rotation ?? 0)
            sprite.setRotation(rotation)
          }
          lastX = follower.vec.x
          lastY = follower.vec.y
        },
        onComplete: () => {
          if (options.destroyOnTweenComplete !== false) sprite?.destroy()
          if (options.finishAnim) {
            if (Array.isArray(options.finishAnim)) {
              options.finishAnim.forEach((anim) => {
                anim(args)
              })
            } else {
              options.finishAnim(args)
            }
          }
        },
        ...(options.tweenProps ?? {})
      }

      scene.tweens.add(tweenConfig)
    }, delay)
  }

export const shakeCamera: AbilityAnimationMaker<{
  duration?: number
  intensity?: number
}> =
  (options) =>
  ({ scene }) =>
    setTimeout(() => scene.shakeCamera(options), options.delay ?? 0)

export const poppingIcon: AbilityAnimationMaker<
  TweenAnimationMakerOptions & { maxScale: number }
> = (options) => (args) =>
  tweenAnimation({
    ...options,
    startCoords:
      options.startCoords === "target"
        ? [args.targetX, args.targetY]
        : [args.positionX, args.positionY],
    ease: Phaser.Math.Easing.Cubic.Out,
    scale: options.scale ?? 0.25,
    tweenProps: { scale: options?.maxScale ?? 3, ...(options.tweenProps ?? {}) }
  })(args)
