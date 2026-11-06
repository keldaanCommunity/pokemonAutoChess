import Phaser, { GameObjects } from "phaser"
import { Pkm, PkmFamily } from "../../../../types/enum/Pokemon"
import { DEPTH } from "../depths"

// Legends Z-A style: ribbons swirl into a spinning globe wrapped in torn
// bands, the globe darkens into a cell-latticed shell whose seams glow, crack
// and burst to reveal the Mega. Drawn on a small canvas each frame, then
// enlarged with nearest-neighbour filtering to match the sprites
const SPHERE_RADIUS = 58
const PIXEL_SCALE = 2
const DRAW_SIZE = SPHERE_RADIUS * 6
const CANVAS_SIZE = DRAW_SIZE / PIXEL_SCALE
const LATTICE_SIZE = Math.round((SPHERE_RADIUS * 2) / PIXEL_SCALE)
const PIXEL_TEXTURE = "mega-pixel"
const LOADING_TEXTURE = "loading_pokeball"
const AURA_DURATION = 1300
// rings of shadow copies nudged outward: [offset in pixels, alpha]
const AURA_RINGS: [number, number][] = [
  [6, 0.14],
  [3, 0.2]
]
const AURA_DIRECTIONS = [
  [1, 0],
  [0.7, 0.7],
  [0, 1],
  [-0.7, 0.7],
  [-1, 0],
  [-0.7, -0.7],
  [0, -1],
  [0.7, -0.7]
]

const SPHERE_START = 400
const SPHERE_FORM_DURATION = 600
const POKEMON_FADE_IN_DURATION = 450
const ORIGINAL_VANISH_DURATION = SPHERE_START + 350
const SWIRL_DURATION = 650
const SWIRL_GROW_DURATION = 450
const SWIRL_STAGGER = 40
// timed to the mega_evolution sound: its dip, swell and peak at 3.63s
const DARKEN_START = 1900
const DARKEN_DURATION = 550
const CRACK_START = 2900
const BURST_START = 3630
const CRACK_DURATION = BURST_START - CRACK_START
const REVEAL_DURATION = 900
const LIGHT_RAY_DURATION = REVEAL_DURATION
const NB_LIGHT_RAYS = 26
const SHATTER_DURATION = 700
const TOTAL_DURATION = BURST_START + Math.max(REVEAL_DURATION, AURA_DURATION)

const GLOBE_PITCH = 0.35
const GLOBE_ROLL = -0.45
const GLOBE_SPIN_PER_SECOND = 2

const NB_INNER_SWIRL_ARCS = 12
const NB_OUTER_SWIRL_ARCS = 3
const NB_SWIRL_FILAMENTS = 28
const SWIRL_ARC_SEGMENTS = 20
// [tilt, roundness] of each reveal ribbon, coloured by the palette
const REVEAL_RIBBON_SHAPES: [number, number][] = [
  [GLOBE_ROLL - 0.1, 0.55],
  [GLOBE_ROLL + 0.1, 0.68],
  [GLOBE_ROLL, 0.5]
]

type Rgb = [number, number, number]

type MegaAnimationPalette = {
  swirlArcs: [string, string][]
  swirlFilaments: string[]
  revealRibbons: [string, string][]
  bands: string[]
  // [bright core, outer ribbon] of the ribbons wrapping the dark shell
  orbit: [string, string][]
  shatterSparks: number[]
  lightRays: string[]
  aura: Rgb[]
  seams: Rgb[]
  crack: Rgb
  // each lattice cell takes one, so several make a plated shell
  shells: Rgb[]
  halo: Rgb
  rim: Rgb
  coreEdge: [Rgb, Rgb]
}

const MEGA_PALETTE: MegaAnimationPalette = {
  swirlArcs: [
    ["#ffffff", "#f2a6dc"],
    ["#b9f2cf", "#f2a6dc"],
    ["#ffffff", "#b9f2cf"],
    ["#f6f29c", "#f2a6dc"],
    ["#e7b7ff", "#ffffff"]
  ],
  swirlFilaments: ["#ffffff", "#fbe6f6", "#e6fbef", "#fdfbe0"],
  revealRibbons: [
    ["#b9f2cf", "#f2a6dc"],
    ["#f6f29c", "#ffffff"],
    ["#e7b7ff", "#ffffff"]
  ],
  bands: ["#f2a6dc", "#e98be0", "#b9f2cf", "#f6f29c", "#f2a6dc", "#ffffff"],
  orbit: [
    ["#ffffff", "#f2a6dc"],
    ["#fffbe0", "#f6f29c"],
    ["#ffffff", "#b9f2cf"]
  ],
  shatterSparks: [0xffffff, 0xfff2b0, 0xffd27a, 0x8fe8ff],
  lightRays: ["#ffffff", "#fff4fb", "#f6ecff", "#fffbe0", "#eafff4"],
  aura: [
    [242, 166, 220],
    [231, 163, 240],
    [185, 242, 207],
    [246, 242, 156]
  ],
  seams: [
    [255, 200, 105],
    [130, 225, 255],
    [255, 214, 140],
    [120, 150, 255]
  ],
  crack: [255, 251, 232],
  shells: [[70, 48, 96]],
  halo: [240, 200, 255],
  rim: [214, 140, 255],
  coreEdge: [
    [233, 248, 170],
    [246, 186, 226]
  ]
}

// Primal Reversion: lava for Groudon's RED_ORB, ocean for Kyogre's BLUE_ORB
const PRIMAL_GROUDON_PALETTE: MegaAnimationPalette = {
  swirlArcs: [
    ["#ffe9a8", "#e8423a"],
    ["#ffd36b", "#b8282a"],
    ["#ffffff", "#ff7a3d"],
    ["#ffd36b", "#e8423a"],
    ["#ffb07a", "#ffffff"]
  ],
  swirlFilaments: ["#ffffff", "#ffe9c8", "#ffd9b0", "#fff2c0"],
  revealRibbons: [
    ["#ffd36b", "#e8423a"],
    ["#ff7a3d", "#ffffff"],
    ["#ffe9a8", "#ffffff"]
  ],
  bands: ["#e8423a", "#ff7a3d", "#ffd36b", "#3a2f33", "#e8423a", "#ffe9a8"],
  orbit: [
    ["#ffe680", "#c2452c"],
    ["#fff3c0", "#ffd23a"],
    ["#ffd23a", "#ff7a2a"]
  ],
  shatterSparks: [0xffffff, 0xffe9a8, 0xffb050, 0xff6a3a],
  lightRays: ["#ffffff", "#fff1d8", "#ffe2c0", "#fff6c8", "#ffd9c0"],
  aura: [
    [232, 66, 58],
    [255, 122, 61],
    [255, 211, 107],
    [184, 40, 42]
  ],
  seams: [
    [255, 200, 90],
    [255, 150, 60],
    [255, 224, 140]
  ],
  crack: [255, 236, 180],
  // two close near-black tints, so the plates read without a soccer ball look
  shells: [
    [78, 28, 26],
    [62, 24, 22]
  ],
  halo: [255, 150, 90],
  rim: [255, 110, 70],
  coreEdge: [
    [255, 140, 80],
    [255, 210, 120]
  ]
}

const PRIMAL_KYOGRE_PALETTE: MegaAnimationPalette = {
  swirlArcs: [
    ["#ffffff", "#2b4fd8"],
    ["#bfeeff", "#2b4fd8"],
    ["#ffffff", "#59c8ff"],
    ["#fff1a8", "#2b4fd8"],
    ["#9fd8ff", "#ffffff"]
  ],
  swirlFilaments: ["#ffffff", "#e4f6ff", "#d8ecff", "#fffbe0"],
  revealRibbons: [
    ["#59c8ff", "#2b4fd8"],
    ["#fff1a8", "#ffffff"],
    ["#bfeeff", "#ffffff"]
  ],
  bands: ["#2b4fd8", "#59c8ff", "#fff1a8", "#16236b", "#2b4fd8", "#bfeeff"],
  orbit: [
    ["#fff3a0", "#2f5fd0"],
    ["#ffffff", "#ffe94a"],
    ["#e8f8ff", "#7fd8ff"]
  ],
  shatterSparks: [0xffffff, 0xbfeeff, 0x59c8ff, 0xfff1a8],
  lightRays: ["#ffffff", "#eef8ff", "#e0f0ff", "#fffbe0", "#e8fbff"],
  aura: [
    [43, 79, 216],
    [89, 200, 255],
    [255, 241, 168],
    [22, 35, 107]
  ],
  seams: [
    [120, 225, 255],
    [180, 245, 255],
    [90, 200, 255]
  ],
  crack: [235, 250, 255],
  shells: [
    [26, 38, 96],
    [20, 30, 78]
  ],
  halo: [120, 200, 255],
  rim: [90, 170, 255],
  coreEdge: [
    [110, 200, 255],
    [190, 240, 255]
  ]
}

const MEGA_RAYQUAZA_PALETTE: MegaAnimationPalette = {
  swirlArcs: [
    ["#ffffff", "#2f9e5a"],
    ["#ffe36b", "#2f9e5a"],
    ["#ffffff", "#7be0a0"],
    ["#ffe36b", "#1f7a44"],
    ["#c8ffd8", "#ffffff"]
  ],
  swirlFilaments: ["#ffffff", "#e6ffef", "#fff8d0", "#f0fff4"],
  revealRibbons: [
    ["#7be0a0", "#2f9e5a"],
    ["#ffe36b", "#ffffff"],
    ["#c8ffd8", "#ffffff"]
  ],
  bands: ["#2f9e5a", "#7be0a0", "#ffe36b", "#1d2b24", "#2f9e5a", "#e8fff0"],
  orbit: [
    ["#fff3a0", "#2f9e5a"],
    ["#ffffff", "#ffe94a"],
    ["#e8ffef", "#5fd38a"]
  ],
  shatterSparks: [0xffffff, 0xffe36b, 0x7be0a0, 0x2f9e5a],
  lightRays: ["#ffffff", "#f0fff4", "#e4fbe8", "#fff8d0", "#eafff0"],
  aura: [
    [47, 158, 90],
    [123, 224, 160],
    [255, 227, 107],
    [31, 122, 68]
  ],
  seams: [
    [255, 220, 90],
    [255, 240, 150],
    [255, 195, 70]
  ],
  crack: [255, 250, 215],
  shells: [
    [26, 68, 42],
    [20, 54, 34]
  ],
  halo: [150, 240, 170],
  rim: [90, 210, 130],
  coreEdge: [
    [140, 240, 160],
    [255, 240, 140]
  ]
}

const PALETTE_BY_FAMILY: Partial<Record<Pkm, MegaAnimationPalette>> = {
  [Pkm.GROUDON]: PRIMAL_GROUDON_PALETTE,
  [Pkm.KYOGRE]: PRIMAL_KYOGRE_PALETTE,
  [Pkm.RAYQUAZA]: MEGA_RAYQUAZA_PALETTE
}

const PRIMAL_FORMS: Pkm[] = [Pkm.PRIMAL_GROUDON, Pkm.PRIMAL_KYOGRE]

// Megas and Primal Reversions share this animation
export function hasMegaEvolutionAnimation(pkm: Pkm) {
  return pkm.startsWith("MEGA_") || PRIMAL_FORMS.includes(pkm)
}

const LIGHT_DIRECTION = [-0.45, -0.55, 0.7]

const PATCH_SEGMENTS = 40
const PATCH_NOISE_SAMPLES = 64
const NB_LATTICE_CELLS = 14
const SHELL_SHADE_STEPS = 6
const SEAM_GLOW_WIDTH = 0.08
const SEAM_CORE_RATIO = 0.4
const SEAM_HALO_BRIGHTNESS = 0.55
const NB_ENERGY_BOLTS = 14
const NB_BOLT_SEGMENTS = 4
const ENERGY_BOLT_WIDTH = 0.032
const BOLT_CORE_RATIO = 0.6
// each bolt strobes on and off in steps of this many ms, like crackling energy
const BOLT_FLICKER_MS = 70
// pixels the globe shakes by right before it bursts
const RUMBLE_AMPLITUDE = 1
const NB_ORBIT_RIBBONS = 4
const ORBIT_RADIUS = 1.12
const ORBIT_SPEED = 1.4
const SHARD_GAP = 0.05
const SHARD_BORDER_WIDTH = 1.8
const NB_BANDS = 9
const BAND_SPAN: [number, number] = [3.8, 5.4]
const BAND_HALF_WIDTH: [number, number] = [0.12, 0.22]
const BAND_RIM_WIDTH = 2

export type OriginalLook = {
  textureKey: string
  frameName: string | number
  scaleX: number
  scaleY: number
  flipX: boolean
}

type MegaEvolvingSprite = {
  name: string
  scene: Phaser.Scene
  x: number
  y: number
  sprite: GameObjects.Sprite
  shadow?: GameObjects.Sprite
  add(child: GameObjects.GameObject): unknown
  addAt(child: GameObjects.GameObject, index?: number): unknown
  emoteAnimation(): void
}

type GlobePatch = {
  lat: number
  halfWidth: number
  lon: number
  span: number
  color: string
  noise: number[]
}

type ProjectedPoint = { x: number; y: number; z: number }
type PatchRun = { top: ProjectedPoint[]; bottom: ProjectedPoint[] }
type Vector3 = [number, number, number]
// appearAt is the crack progress at which this piece of the bolt shows up
type BoltSegment = {
  from: Vector3
  to: Vector3
  index: number
  appearAt: number
}

type ShellShard = {
  outline: { x: number; y: number }[]
  fill: string
  centreX: number
  centreY: number
  angle: number
  speed: number
  spin: number
}

type LightRay = {
  angle: number
  speed: number
  length: number
  width: number
  color: string
}

type SwirlArc = {
  u: Vector3
  v: Vector3
  radius: number
  length: number
  speed: number
  phase: number
  width: number
  body: string
  edge: string | null
}

type MegaScenery = {
  palette: MegaAnimationPalette
  swirlArcs: SwirlArc[]
  lightRays: LightRay[]
  shards: ShellShard[] | null
  bands: GlobePatch[]
  orbitPatches: GlobePatch[]
  orbitCores: GlobePatch[]
  latticeCells: Vector3[]
  bolts: BoltSegment[]
  latticeCanvas: HTMLCanvasElement
}

let animationCount = 0

// originalLook is the form before the Mega; left out (the dev test button),
// the Pokemon's current look stands in, and null means there is none to show
export function playMegaEvolutionAnimation(
  pokemon: MegaEvolvingSprite,
  originalLook?: OriginalLook | null
) {
  const { scene, x, y } = pokemon
  const look =
    originalLook === undefined ? lookOf(pokemon.sprite) : originalLook
  const original = look ? createOriginalGhost(pokemon, look) : null
  ensurePixelTexture(scene)
  const textureKey = `mega-evolution-${animationCount++}`
  const canvas = scene.textures.createCanvas(
    textureKey,
    CANVAS_SIZE,
    CANVAS_SIZE
  )
  if (!canvas) return
  canvas.setFilter(Phaser.Textures.FilterMode.NEAREST)
  const image = scene.add
    .image(x, y, textureKey)
    .setScale(PIXEL_SCALE)
    .setDepth(DEPTH.ITEM_FOUND)
  const auraSprites = createOrbAura(pokemon)
  const random = seededRandom(Math.floor(Math.random() * 1e6))
  const palette =
    PALETTE_BY_FAMILY[PkmFamily[pokemon.name as Pkm]] ?? MEGA_PALETTE
  const scenery: MegaScenery = {
    palette,
    swirlArcs: createSwirlArcs(random, palette),
    lightRays: createLightRays(random, palette),
    shards: null,
    bands: createBands(random, palette),
    ...createOrbitRibbons(random, palette),
    latticeCells: createLatticeCells(random),
    bolts: createEnergyBolts(random),
    latticeCanvas: createLatticeCanvas()
  }
  let revealed = false
  let emoted = false

  scene.tweens.addCounter({
    from: 0,
    to: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    onUpdate: (tween) => {
      const time = tween.getValue() ?? 0
      pokemon.sprite.setAlpha(getPokemonAlpha(time))
      const shadowBeforeBurst = original
        ? 1 - updateOriginalGhost(original, time)
        : 0
      pokemon.shadow?.setAlpha(
        time < BURST_START ? shadowBeforeBurst : getPokemonAlpha(time)
      )
      if (time >= BURST_START && !revealed) {
        revealed = true
        burstIntoShatterSparks(scene, x, y, palette)
      }
      // a sprite still loading would drop the emote, so it waits for it
      if (
        revealed &&
        !emoted &&
        pokemon.sprite.texture.key !== LOADING_TEXTURE
      ) {
        emoted = true
        pokemon.emoteAnimation()
      }
      drawFrame(canvas.context, time, scenery)
      canvas.refresh()
      if (pokemon.shadow) {
        updateOrbAura(auraSprites, pokemon.shadow, time, palette)
      }
    },
    onComplete: () => {
      pokemon.sprite.setAlpha(1)
      pokemon.shadow?.setAlpha(1)
      original?.colored.destroy()
      original?.white.destroy()
      image.destroy()
      auraSprites.forEach((auraSprite) => auraSprite.destroy())
      scene.textures.remove(textureKey)
    }
  })
}

function burstIntoShatterSparks(
  scene: Phaser.Scene,
  x: number,
  y: number,
  palette: MegaAnimationPalette
) {
  const shards = scene.add
    .particles(x, y, PIXEL_TEXTURE, {
      speed: { min: 50, max: 150 },
      lifespan: { min: 350, max: 700 },
      scale: { start: PIXEL_SCALE * 1.5, end: 0 },
      tint: palette.shatterSparks,
      emitting: false
    })
    .setDepth(DEPTH.ITEM_FOUND + 2)
  shards.explode(18)
  scene.time.delayedCall(800, () => shards.destroy())
}

export function lookOf(sprite: GameObjects.Sprite): OriginalLook {
  return {
    textureKey: sprite.texture.key,
    frameName: sprite.frame.name,
    scaleX: sprite.scaleX,
    scaleY: sprite.scaleY,
    flipX: sprite.flipX
  }
}

type OriginalGhost = {
  colored: GameObjects.Sprite
  white: GameObjects.Sprite
  scaleX: number
  scaleY: number
}

// the form before the Mega, rebuilt from its last look, with a white copy over
// it so it can turn white before it shrinks away into the globe
function createOriginalGhost(
  pokemon: MegaEvolvingSprite,
  look: OriginalLook
): OriginalGhost | null {
  if (look.textureKey === LOADING_TEXTURE) return null
  const [colored, white] = [false, true].map((isWhite) => {
    const ghost = new GameObjects.Sprite(
      pokemon.scene,
      pokemon.sprite.x,
      pokemon.sprite.y,
      look.textureKey,
      look.frameName
    )
      .setScale(look.scaleX, look.scaleY)
      .setFlipX(look.flipX)
    if (isWhite) {
      ghost.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL).setAlpha(0)
    }
    pokemon.add(ghost)
    return ghost
  })
  return { colored, white, scaleX: look.scaleX, scaleY: look.scaleY }
}

// turns white first, then shrinks and fades; returns how far it has vanished
function updateOriginalGhost(ghost: OriginalGhost, time: number) {
  const progress = clamp01(time / ORIGINAL_VANISH_DURATION)
  const whiten = clamp01(progress / 0.4)
  const vanish = easeInOut(clamp01((progress - 0.3) / 0.7))
  const shrink = 1 - 0.1 * vanish
  for (const layer of [ghost.colored, ghost.white]) {
    layer.setScale(ghost.scaleX * shrink, ghost.scaleY * shrink)
  }
  ghost.colored.setAlpha(1 - whiten)
  ghost.white.setAlpha(whiten * (1 - vanish))
  return vanish
}

// the Mega's sprite is already in place when the animation starts, so it
// stays hidden until the shell bursts, then fades in
function getPokemonAlpha(time: number) {
  if (time < BURST_START) return 0
  const fadeIn = clamp01((time - BURST_START) / POKEMON_FADE_IN_DURATION)
  return 1 - (1 - fadeIn) * (1 - fadeIn)
}

function orbAuraColor(position: number, colors: Rgb[]) {
  const scaled = (((position % 1) + 1) % 1) * colors.length
  const index = Math.floor(scaled)
  const blend = scaled - index
  const from = colors[index]
  const to = colors[(index + 1) % colors.length]
  return from.map((channel, i) => channel + (to[i] - channel) * blend)
}

function ensurePixelTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(PIXEL_TEXTURE)) return
  const pixel = scene.textures.createCanvas(PIXEL_TEXTURE, 1, 1)
  if (!pixel) return
  pixel.context.fillStyle = "#ffffff"
  pixel.context.fillRect(0, 0, 1, 1)
  pixel.setFilter(Phaser.Textures.FilterMode.NEAREST)
  pixel.refresh()
}

function seededRandom(seed: number) {
  let state = seed % 2147483647 || 1
  return () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function easeInOut(value: number) {
  return value * value * (3 - 2 * value)
}

function createPatches(
  random: () => number,
  count: number,
  colors: string[],
  spanRange: [number, number],
  widthRange: [number, number]
): GlobePatch[] {
  return Array.from({ length: count }, () => ({
    lat: -1.2 + random() * 2.4,
    halfWidth: widthRange[0] + random() * (widthRange[1] - widthRange[0]),
    lon: random() * Math.PI * 2,
    span: spanRange[0] + random() * (spanRange[1] - spanRange[0]),
    color: colors[Math.floor(random() * colors.length)],
    noise: Array.from({ length: PATCH_NOISE_SAMPLES }, () => random())
  }))
}

// a bright core shares each ribbon's torn noise, so it runs along its middle
function createOrbitRibbons(
  random: () => number,
  palette: MegaAnimationPalette
) {
  const ribbons = createPatches(
    random,
    NB_ORBIT_RIBBONS,
    palette.orbit.map(([, outer]) => outer),
    [1.6, 2.4],
    [0.07, 0.11]
  )
  const colorPairs = ribbons.map(
    (_, i) => palette.orbit[i % palette.orbit.length]
  )
  return {
    orbitPatches: ribbons.map((ribbon, i) => ({
      ...ribbon,
      color: colorPairs[i][1]
    })),
    orbitCores: ribbons.map((ribbon, i) => ({
      ...ribbon,
      halfWidth: ribbon.halfWidth * 0.4,
      color: colorPairs[i][0]
    }))
  }
}

// long bands spread evenly from pole to pole, so they read as stripes
function createBands(
  random: () => number,
  palette: MegaAnimationPalette
): GlobePatch[] {
  return createPatches(
    random,
    NB_BANDS,
    palette.bands,
    BAND_SPAN,
    BAND_HALF_WIDTH
  ).map((band, i) => ({
    ...band,
    lat: -1.15 + (2.3 * i) / (NB_BANDS - 1) + (random() - 0.5) * 0.08
  }))
}

function createLatticeCanvas() {
  const canvas = document.createElement("canvas")
  canvas.width = LATTICE_SIZE
  canvas.height = LATTICE_SIZE
  return canvas
}

// short zigzag bolts scattered over the globe, each step turning sharply the
// other way like lightning; they grow piece by piece, each at its own pace
function createEnergyBolts(random: () => number): BoltSegment[] {
  const segments: BoltSegment[] = []
  for (let index = 0; index < NB_ENERGY_BOLTS; index++) {
    const height = random() * 2 - 1
    const ringRadius = Math.sqrt(1 - height * height)
    const angle = random() * Math.PI * 2
    let point: Vector3 = [
      Math.cos(angle) * ringRadius,
      height,
      Math.sin(angle) * ringRadius
    ]
    let heading = normalize(
      cross(point, [random() - 0.5, random() - 0.5, random() - 0.5])
    )
    const start = random() * 0.5
    const pace = 0.08 + random() * 0.08
    for (let step = 0; step < NB_BOLT_SEGMENTS; step++) {
      // hard turns and straight runs, so it reads as lightning, not a worm
      const turn = (step % 2 === 0 ? 1 : -1) * (0.9 + random() * 0.4)
      const side = cross(point, heading)
      heading = heading.map(
        (value, axis) => value * Math.cos(turn) + side[axis] * Math.sin(turn)
      ) as Vector3
      const length = 0.08 + random() * 0.06
      const next = normalize(
        point.map((value, axis) => value + heading[axis] * length) as Vector3
      )
      segments.push({
        from: point,
        to: next,
        index,
        appearAt: start + step * pace
      })
      heading = normalize(cross(cross(next, heading), next))
      point = next
    }
  }
  return segments
}

// evenly spread cell centres (a jittered Fibonacci sphere)
function createLatticeCells(random: () => number): Vector3[] {
  return Array.from({ length: NB_LATTICE_CELLS }, (_, i) => {
    const height =
      1 - ((i + 0.5) / NB_LATTICE_CELLS) * 2 + (random() - 0.5) * 0.15
    const ringRadius = Math.sqrt(Math.max(0, 1 - height * height))
    const angle = i * 2.39996 + (random() - 0.5) * 0.5
    return [
      Math.cos(angle) * ringRadius,
      height,
      Math.sin(angle) * ringRadius
    ]
  })
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenery: MegaScenery
) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  ctx.save()
  ctx.scale(1 / PIXEL_SCALE, 1 / PIXEL_SCALE)
  ctx.translate(DRAW_SIZE / 2, DRAW_SIZE / 2)
  if (time < BURST_START) {
    // a rumble building up to the burst, in whole art pixels
    const rumble =
      clamp01((time - CRACK_START) / CRACK_DURATION) ** 2 * RUMBLE_AMPLITUDE
    ctx.save()
    ctx.translate(
      Math.round(Math.sin(time / 23) * rumble) * PIXEL_SCALE,
      Math.round(Math.cos(time / 31) * rumble) * PIXEL_SCALE
    )
    drawSwirl(ctx, time, scenery, false)
    drawSphere(ctx, time, scenery)
    drawSwirl(ctx, time, scenery, true)
    ctx.restore()
  }
  drawLightRays(ctx, time, scenery)
  drawShatteredShell(ctx, time, scenery)
  drawRevealRibbons(ctx, time, scenery.palette)
  ctx.restore()
  snapAlphaToSteps(ctx)
}

// hard alpha steps instead of smooth fades, like hand-made pixel art
function snapAlphaToSteps(ctx: CanvasRenderingContext2D) {
  const image = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  const { data } = image
  for (let i = 3; i < data.length; i += 4) {
    const alpha = data[i]
    data[i] = alpha < 40 ? 0 : alpha < 120 ? 96 : alpha < 200 ? 176 : 255
  }
  ctx.putImageData(image, 0, 0)
}

function drawBrushArc(
  ctx: CanvasRenderingContext2D,
  radius: number,
  from: number,
  length: number,
  body: string,
  edge: string,
  width: number
) {
  ctx.lineCap = "round"
  for (let layer = 0; layer < 3; layer++) {
    const taper = layer * 0.22
    const start = from + taper
    const end = from + length - taper * 1.5
    const lineWidth = width + 3 - layer * 3
    if (end <= start || lineWidth <= 0) continue
    ctx.strokeStyle = layer === 0 ? edge : body
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(0, 0, radius, start, end)
    ctx.stroke()
  }
}

// orbit planes spread evenly over every direction (a jittered Fibonacci
// sphere of plane normals), so no side of the ball gets heavier
function createOrbitBases(random: () => number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const height = 1 - ((i + 0.5) / count) * 2
    const ring = Math.sqrt(Math.max(0, 1 - height * height))
    const azimuth = i * 2.39996 + random() * 0.4
    const normal: Vector3 = [
      Math.cos(azimuth) * ring,
      height,
      Math.sin(azimuth) * ring
    ]
    const helper: Vector3 = Math.abs(normal[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
    const u = normalize(cross(normal, helper))
    return { u, v: cross(normal, u) }
  })
}

// Rasengan-like: thin arcs and hairline filaments circle the ball in every
// direction, plus a few wide outer sweeps
function createSwirlArcs(
  random: () => number,
  palette: MegaAnimationPalette
): SwirlArc[] {
  const total = NB_INNER_SWIRL_ARCS + NB_OUTER_SWIRL_ARCS
  const arcs = createOrbitBases(random, total).map(({ u, v }, i) => {
    const isOuter = i >= NB_INNER_SWIRL_ARCS
    const [body, edge] = palette.swirlArcs[i % palette.swirlArcs.length]
    return {
      u,
      v,
      radius: isOuter ? 1.5 + random() * 0.4 : 1.05 + random() * 0.15,
      length: isOuter ? 1.6 + random() * 0.8 : 1.2 + random() * 1.1,
      speed: 5 + random() * 3,
      phase: random() * Math.PI * 2,
      width: isOuter ? 2 : 2.5 + random(),
      body,
      edge
    }
  })
  const filaments = createOrbitBases(random, NB_SWIRL_FILAMENTS).map(
    ({ u, v }, i) => ({
      u,
      v,
      radius: 1 + random() * 0.3,
      length: 0.6 + random() * 1.2,
      speed: 7 + random() * 4,
      phase: random() * Math.PI * 2,
      width: 2,
      body: palette.swirlFilaments[i % palette.swirlFilaments.length],
      edge: null
    })
  )
  return [...filaments, ...arcs]
}

function cross(a: Vector3, b: Vector3): Vector3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
}

function normalize(vector: Vector3): Vector3 {
  const length = Math.hypot(...vector) || 1
  return [vector[0] / length, vector[1] / length, vector[2] / length]
}

// the arcs wind up one after another and unwind as the globe darkens; they
// grow and shrink by length and width rather than alpha, which the pixel alpha
// steps would make choppy
function drawSwirl(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenery: MegaScenery,
  front: boolean
) {
  const unwind = easeInOut(clamp01((time - DARKEN_START) / DARKEN_DURATION))
  if (unwind >= 1) return
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  scenery.swirlArcs.forEach((arc, i) => {
    const age = time - (i % NB_INNER_SWIRL_ARCS) * SWIRL_STAGGER
    const grow = 1 - (1 - clamp01(age / SWIRL_GROW_DURATION)) ** 2
    if (grow <= 0) return
    const settle = easeInOut(clamp01(age / SWIRL_DURATION))
    const radius = SPHERE_RADIUS * arc.radius * (0.7 + 0.3 * settle)
    const length = arc.length * grow * (1 - unwind)
    const width = arc.width * (0.4 + 0.6 * grow) * (1 - unwind)
    if (length <= 0 || width <= 0) return
    const start = arc.phase + (time / 1000) * arc.speed
    const runs: { x: number; y: number }[][] = []
    let run: { x: number; y: number }[] | null = null
    for (let k = 0; k <= SWIRL_ARC_SEGMENTS; k++) {
      const angle = start - (length * k) / SWIRL_ARC_SEGMENTS
      const point = arc.u.map(
        (value, axis) =>
          (value * Math.cos(angle) + arc.v[axis] * Math.sin(angle)) * radius
      )
      if (point[2] >= 0 !== front) {
        run = null
        continue
      }
      if (!run) {
        run = []
        runs.push(run)
      }
      run.push({ x: point[0], y: point[1] })
    }
    const layers = arc.edge ? [arc.edge, arc.body] : [arc.body]
    for (const [layer, color] of layers.entries()) {
      ctx.strokeStyle = color
      ctx.lineWidth = width + (layers.length - 1 - layer) * 2
      for (const points of runs) {
        if (points.length < 2) continue
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (const point of points.slice(1)) ctx.lineTo(point.x, point.y)
        ctx.stroke()
      }
    }
  })
}

// a point on the tilted globe, seen from the front: z < 0 faces away
function projectOnGlobe(lat: number, lon: number, r: number): ProjectedPoint {
  const x = Math.cos(lat) * Math.sin(lon)
  const y = -Math.sin(lat)
  const z = Math.cos(lat) * Math.cos(lon)
  const pitchedY = y * Math.cos(GLOBE_PITCH) - z * Math.sin(GLOBE_PITCH)
  const pitchedZ = y * Math.sin(GLOBE_PITCH) + z * Math.cos(GLOBE_PITCH)
  return {
    x: (x * Math.cos(GLOBE_ROLL) - pitchedY * Math.sin(GLOBE_ROLL)) * r,
    y: (x * Math.sin(GLOBE_ROLL) + pitchedY * Math.cos(GLOBE_ROLL)) * r,
    z: pitchedZ
  }
}

function getPatchRuns(
  patch: GlobePatch,
  r: number,
  time: number,
  front: boolean,
  spanScale: number
): PatchRun[] {
  const start = patch.lon + (time / 1000) * GLOBE_SPIN_PER_SECOND
  const runs: PatchRun[] = []
  let run: PatchRun | null = null
  for (let k = 0; k <= PATCH_SEGMENTS; k++) {
    const progress = k / PATCH_SEGMENTS
    const lon = start + patch.span * spanScale * progress
    const facesViewer = projectOnGlobe(patch.lat, lon, r).z >= 0
    if (facesViewer !== front) {
      run = null
      continue
    }
    const taper = Math.pow(Math.sin(Math.PI * progress), 0.35)
    const tearStrength = (0.3 + (1 - taper) * 0.9) * 0.6
    const tearTop = (patch.noise[k % PATCH_NOISE_SAMPLES] - 0.5) * tearStrength
    const tearBottom =
      (patch.noise[(k + 30) % PATCH_NOISE_SAMPLES] - 0.5) * tearStrength
    const top = patch.halfWidth * Math.max(0, taper + tearTop)
    const bottom = patch.halfWidth * Math.max(0, taper + tearBottom)
    if (!run) {
      run = { top: [], bottom: [] }
      runs.push(run)
    }
    run.top.push(projectOnGlobe(patch.lat + top, lon, r))
    run.bottom.push(projectOnGlobe(patch.lat - bottom, lon, r))
  }
  return runs.filter((patchRun) => patchRun.top.length > 1)
}

function drawPatches(
  ctx: CanvasRenderingContext2D,
  patches: GlobePatch[],
  r: number,
  time: number,
  front: boolean,
  alpha: number,
  rimWidth = 0,
  spanScale = 1
) {
  if (alpha <= 0 || spanScale <= 0) return
  ctx.globalAlpha = alpha
  ctx.lineJoin = "round"
  for (const patch of patches) {
    const runs = getPatchRuns(patch, r, time, front, spanScale)
    for (const { top, bottom } of runs) {
      ctx.beginPath()
      ctx.moveTo(top[0].x, top[0].y)
      for (let i = 1; i < top.length; i++) ctx.lineTo(top[i].x, top[i].y)
      for (let i = bottom.length - 1; i >= 0; i--) {
        ctx.lineTo(bottom[i].x, bottom[i].y)
      }
      ctx.closePath()
      ctx.fillStyle = patch.color
      ctx.fill()
      if (rimWidth > 0) {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = rimWidth
        ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1
}

function drawOrbitRibbons(
  ctx: CanvasRenderingContext2D,
  scenery: MegaScenery,
  r: number,
  time: number,
  front: boolean,
  alpha: number
) {
  const radius = r * ORBIT_RADIUS
  for (const ribbons of [scenery.orbitPatches, scenery.orbitCores]) {
    drawPatches(ctx, ribbons, radius, time * ORBIT_SPEED, front, alpha)
  }
}

function drawSphere(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenery: MegaScenery
) {
  const form = easeInOut(
    clamp01((time - SPHERE_START) / SPHERE_FORM_DURATION)
  )
  if (form <= 0) return
  const r = SPHERE_RADIUS
  const dark = easeInOut(clamp01((time - DARKEN_START) / DARKEN_DURATION))

  const halo = ctx.createRadialGradient(0, 0, r * 0.85, 0, 0, r * 1.35)
  const { halo: haloColor, rim: rimColor } = scenery.palette
  halo.addColorStop(0, `rgba(${haloColor},${0.4 * form * (1 - dark)})`)
  halo.addColorStop(1, `rgba(${haloColor},0)`)
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2)
  ctx.fill()
  // the far side of the ribbons, dimmed, so they wrap around the shell
  drawOrbitRibbons(ctx, scenery, r, time, false, dark * 0.45)

  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.clip()
  if (form < 1) {
    ctx.beginPath()
    ctx.arc(0, 0, r * (1 - form), 0, Math.PI * 2)
    ctx.rect(-r, -r, r * 2, r * 2)
    ctx.clip("evenodd")
  }
  drawGlowingCore(ctx, r, time, scenery.palette)
  if (dark > 0) drawLatticeShell(ctx, r, time, dark, scenery)
  ctx.restore()
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.clip()
  const lightLeft = 1 - dark
  drawPatches(ctx, scenery.bands, r, time, false, 0.3 * lightLeft, 0, form)
  drawPatches(
    ctx,
    scenery.bands,
    r,
    time,
    true,
    0.9 * lightLeft,
    BAND_RIM_WIDTH,
    form
  )
  ctx.restore()
  drawOrbitRibbons(ctx, scenery, r, time, true, dark)

  ctx.strokeStyle = `rgba(${rimColor},${(0.8 - dark * 0.5) * form})`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.stroke()
}

function drawGlowingCore(
  ctx: CanvasRenderingContext2D,
  r: number,
  time: number,
  palette: MegaAnimationPalette
) {
  const drift = (Math.sin(time / 260) + 1) / 2
  const [from, to] = palette.coreEdge
  const edge = from.map((channel, i) =>
    Math.round(channel + (to[i] - channel) * drift)
  )
  const core = ctx.createRadialGradient(-r * 0.25, -r * 0.2, r * 0.05, 0, 0, r)
  core.addColorStop(0, "#ffffff")
  core.addColorStop(0.45, "#ffffff")
  core.addColorStop(1, `rgb(${edge})`)
  ctx.fillStyle = core
  ctx.fillRect(-r, -r, r * 2, r * 2)
}

// the screen point (x, y) of the unit globe, back in the spinning globe's own
// coordinates, so the lattice turns with the patches
function unprojectFromGlobe(x: number, y: number, spin: number): Vector3 {
  const z = Math.sqrt(1 - x * x - y * y)
  const unrolledX = x * Math.cos(GLOBE_ROLL) + y * Math.sin(GLOBE_ROLL)
  const unrolledY = -x * Math.sin(GLOBE_ROLL) + y * Math.cos(GLOBE_ROLL)
  const globeY =
    unrolledY * Math.cos(GLOBE_PITCH) + z * Math.sin(GLOBE_PITCH)
  const globeZ =
    -unrolledY * Math.sin(GLOBE_PITCH) + z * Math.cos(GLOBE_PITCH)
  return [
    unrolledX * Math.cos(spin) - globeZ * Math.sin(spin),
    globeY,
    unrolledX * Math.sin(spin) + globeZ * Math.cos(spin)
  ]
}

// the two closest cells; a small gap between them means a seam
function findClosestCells(point: Vector3, cells: Vector3[]) {
  let closest = { index: 0, dot: -2 }
  let secondClosest = { index: 0, dot: -2 }
  cells.forEach((cell, index) => {
    const dot = point[0] * cell[0] + point[1] * cell[1] + point[2] * cell[2]
    if (dot > closest.dot) {
      secondClosest = closest
      closest = { index, dot }
    } else if (dot > secondClosest.dot) {
      secondClosest = { index, dot }
    }
  })
  return {
    closestIndex: closest.index,
    seamDistance: closest.dot - secondClosest.dot,
    // the same pair of cells always picks the same seam colour
    seamHash: closest.index * 7 + secondClosest.index * 13
  }
}

// the closest bolt piece already grown in, measured straight through the globe
function findClosestBolt(
  point: Vector3,
  segments: BoltSegment[],
  crack: number,
  flickerFrame: number
) {
  let distance = Infinity
  let index = 0
  for (const segment of segments) {
    if (segment.appearAt > crack) continue
    // each bolt is lit about 2 frames in 5, on its own rhythm
    if ((flickerFrame * 3 + segment.index * 7) % 5 >= 2) continue
    const { from, to } = segment
    const segmentX = to[0] - from[0]
    const segmentY = to[1] - from[1]
    const segmentZ = to[2] - from[2]
    const offsetX = point[0] - from[0]
    const offsetY = point[1] - from[1]
    const offsetZ = point[2] - from[2]
    const along = clamp01(
      (offsetX * segmentX + offsetY * segmentY + offsetZ * segmentZ) /
        (segmentX * segmentX + segmentY * segmentY + segmentZ * segmentZ)
    )
    const segmentDistance = Math.hypot(
      offsetX - segmentX * along,
      offsetY - segmentY * along,
      offsetZ - segmentZ * along
    )
    if (segmentDistance < distance) {
      distance = segmentDistance
      index = segment.index
    }
  }
  return { distance, index }
}

function getShellLight(x: number, y: number) {
  const z = Math.sqrt(1 - x * x - y * y)
  return clamp01(
    x * LIGHT_DIRECTION[0] + y * LIGHT_DIRECTION[1] + z * LIGHT_DIRECTION[2]
  )
}

// computed per pixel at the final pixel size, so the seams stay crisp
function drawLatticeShell(
  ctx: CanvasRenderingContext2D,
  r: number,
  time: number,
  dark: number,
  scenery: MegaScenery
) {
  const size = LATTICE_SIZE
  const { latticeCanvas, latticeCells, palette } = scenery
  const latticeContext = latticeCanvas.getContext("2d")
  if (!latticeContext) return
  const image = latticeContext.createImageData(size, size)
  const { data } = image
  const spin = (time / 1000) * GLOBE_SPIN_PER_SECOND
  const glow = clamp01((time - DARKEN_START - 100) / 300)
  const crack = clamp01((time - CRACK_START) / CRACK_DURATION)
  const glowWidth =
    SEAM_GLOW_WIDTH * glow * (1 - clamp01((crack - 0.3) / 0.5))
  const crackWidth = 0.022 + Math.pow(clamp01((crack - 0.7) / 0.3), 2) * 0.35
  const flickerFrame = Math.floor(time / BOLT_FLICKER_MS)
  const half = size / 2
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const x = (column + 0.5 - half) / half
      const y = (row + 0.5 - half) / half
      if (x * x + y * y > 1) continue
      const point = unprojectFromGlobe(x, y, spin)
      const { closestIndex, seamDistance, seamHash } = findClosestCells(
        point,
        latticeCells
      )
      const seamColor = palette.seams[seamHash % palette.seams.length]
      const shellColor = palette.shells[closestIndex % palette.shells.length]
      const puffiness = 0.55 + 0.45 * clamp01(seamDistance / 0.35)
      const shade = (0.35 + 0.65 * getShellLight(x, y)) * puffiness
      // flat steps instead of smooth gradients, like the rest of the pixel art
      const steppedShade =
        Math.max(1, Math.ceil(shade * SHELL_SHADE_STEPS)) / SHELL_SHADE_STEPS
      let color = shellColor.map((channel) => channel * steppedShade)
      // before the burst, small energy bolts crack across the plates
      if (crack > 0) {
        const bolt = findClosestBolt(point, scenery.bolts, crack, flickerFrame)
        if (bolt.distance < ENERGY_BOLT_WIDTH * BOLT_CORE_RATIO) {
          color = palette.crack
        } else if (bolt.distance < ENERGY_BOLT_WIDTH) {
          color = palette.seams[bolt.index % palette.seams.length]
        }
      }
      // a pure seam colour core and a darker halo of the same hue: blending it
      // into the shell would turn gold on green into olive
      if (seamDistance < glowWidth * SEAM_CORE_RATIO) {
        color = seamColor
      } else if (seamDistance < glowWidth) {
        color = seamColor.map((channel) => channel * SEAM_HALO_BRIGHTNESS)
      }
      if (crack > 0.3 && seamDistance < crackWidth) color = palette.crack
      const offset = (row * size + column) * 4
      data[offset] = color[0]
      data[offset + 1] = color[1]
      data[offset + 2] = color[2]
      data[offset + 3] = 255
    }
  }
  latticeContext.putImageData(image, 0, 0)
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = dark
  ctx.drawImage(latticeCanvas, -r, -r, r * 2, r * 2)
  ctx.globalAlpha = 1
}

// the glow under the Mega is made of its own shadow: tinted copies nudged a few
// pixels in every direction overlap into a halo around the shadow's exact
// shape, so it sits on it frame by frame whatever the sprite's pivot
function createOrbAura(pokemon: MegaEvolvingSprite) {
  const { shadow } = pokemon
  if (!shadow) return []
  const sprites = AURA_RINGS.flatMap(() =>
    AURA_DIRECTIONS.map(() =>
      new GameObjects.Sprite(
        pokemon.scene,
        shadow.x,
        shadow.y,
        shadow.texture.key,
        shadow.frame.name
      )
        .setTintMode(Phaser.TintModes.FILL)
        .setVisible(false)
    )
  )
  sprites.forEach((auraSprite, i) => pokemon.addAt(auraSprite, i))
  return sprites
}

function updateOrbAura(
  sprites: GameObjects.Sprite[],
  shadow: GameObjects.Sprite,
  time: number,
  palette: MegaAnimationPalette
) {
  const progress = clamp01((time - BURST_START) / AURA_DURATION)
  const active = time >= BURST_START && progress < 1
  const swell = 1 - (1 - clamp01(progress * 4)) ** 2
  const presence = swell * (1 - progress ** 3)
  const [red, green, blue] = orbAuraColor(progress * 1.5, palette.aura).map(
    Math.round
  )
  const tint = (red << 16) | (green << 8) | blue
  sprites.forEach((auraSprite, i) => {
    auraSprite.setVisible(active)
    if (!active) return
    const [offset, alpha] = AURA_RINGS[Math.floor(i / AURA_DIRECTIONS.length)]
    const [dx, dy] = AURA_DIRECTIONS[i % AURA_DIRECTIONS.length]
    const reach = offset * (0.5 + 0.5 * swell)
    auraSprite
      .setFrame(shadow.frame.name)
      .setOrigin(shadow.originX, shadow.originY)
      .setScale(shadow.scaleX, shadow.scaleY)
      .setPosition(shadow.x + dx * reach, shadow.y + dy * reach * 0.6)
      .setTint(tint)
      .setAlpha(alpha * presence)
  })
}

function createLightRays(
  random: () => number,
  palette: MegaAnimationPalette
): LightRay[] {
  return Array.from({ length: NB_LIGHT_RAYS }, () => ({
    angle: random() * Math.PI * 2,
    speed: 1 + random() * 1.2,
    length: 10 + random() * 14,
    width: 4 + random() * 4,
    color: palette.lightRays[Math.floor(random() * palette.lightRays.length)]
  }))
}

// rays shorten instead of fading, which the pixel alpha steps would make choppy
function drawLightRays(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenery: MegaScenery
) {
  const progress = clamp01((time - BURST_START) / LIGHT_RAY_DURATION)
  if (time < BURST_START || progress >= 1) return
  const travel = 1 - (1 - progress) ** 2
  for (const ray of scenery.lightRays) {
    const distance = SPHERE_RADIUS * (0.4 + travel * ray.speed)
    const length = ray.length * (1 - progress)
    const width = ray.width * (1 - progress * 0.5)
    ctx.save()
    ctx.rotate(ray.angle)
    ctx.fillStyle = ray.color
    ctx.fillRect(distance, -width / 2, length, width)
    ctx.restore()
  }
}

// each visible cell becomes a shard, so the shell breaks where it was seen
// cracking; a shard is its cell's outline so its border stays clean as it spins
function createShellShards(
  scenery: MegaScenery,
  random: () => number
): ShellShard[] {
  const size = LATTICE_SIZE
  const half = size / 2
  const spin = (BURST_START / 1000) * GLOBE_SPIN_PER_SECOND
  const pieces = new Map<
    number,
    { points: { x: number; y: number }[]; shade: number }
  >()
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const x = (column + 0.5 - half) / half
      const y = (row + 0.5 - half) / half
      if (x * x + y * y > 1) continue
      const { closestIndex, seamDistance } = findClosestCells(
        unprojectFromGlobe(x, y, spin),
        scenery.latticeCells
      )
      if (seamDistance < SHARD_GAP) continue
      let piece = pieces.get(closestIndex)
      if (!piece) {
        piece = { points: [], shade: 0 }
        pieces.set(closestIndex, piece)
      }
      piece.points.push({ x, y })
      piece.shade += 0.35 + 0.65 * getShellLight(x, y)
    }
  }
  const { shells } = scenery.palette
  return [...pieces.entries()]
    .filter(([, piece]) => piece.points.length >= 3)
    .map(([cellIndex, piece]) => {
      const count = piece.points.length
      const centreX = piece.points.reduce((sum, p) => sum + p.x, 0) / count
      const centreY = piece.points.reduce((sum, p) => sum + p.y, 0) / count
      const shade = (piece.shade / count) * 0.85
      const [red, green, blue] = shells[cellIndex % shells.length].map(
        (channel) => Math.round(channel * shade)
      )
      const outward =
        Math.hypot(centreX, centreY) > 0.15
          ? Math.atan2(centreY, centreX)
          : random() * Math.PI * 2
      return {
        outline: convexHull(piece.points).map((p) => ({
          x: (p.x - centreX) * SPHERE_RADIUS,
          y: (p.y - centreY) * SPHERE_RADIUS
        })),
        fill: `rgb(${red},${green},${blue})`,
        centreX,
        centreY,
        angle: outward + (random() - 0.5) * 0.7,
        speed: 0.6 + random() * 1.2,
        spin: (random() - 0.5) * 5
      }
    })
}

// monotone chain
function convexHull(points: { x: number; y: number }[]) {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y)
  const turn = (
    o: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const lower: { x: number; y: number }[] = []
  for (const point of sorted) {
    while (
      lower.length >= 2 &&
      turn(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop()
    }
    lower.push(point)
  }
  const upper: { x: number; y: number }[] = []
  for (const point of [...sorted].reverse()) {
    while (
      upper.length >= 2 &&
      turn(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop()
    }
    upper.push(point)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

function drawShatteredShell(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenery: MegaScenery
) {
  const progress = clamp01((time - BURST_START) / SHATTER_DURATION)
  if (time < BURST_START || progress >= 1) return
  const shards = (scenery.shards ??= createShellShards(scenery, Math.random))
  const travel = 1 - (1 - progress) * (1 - progress)
  const r = SPHERE_RADIUS
  ctx.lineJoin = "round"
  ctx.lineWidth = SHARD_BORDER_WIDTH
  ctx.strokeStyle = `rgb(${scenery.palette.crack})`
  for (const shard of shards) {
    const distance = travel * shard.speed * r * 1.3
    const fall = progress * progress * r * 0.35
    ctx.save()
    ctx.translate(
      shard.centreX * r + Math.cos(shard.angle) * distance,
      shard.centreY * r + Math.sin(shard.angle) * distance + fall
    )
    ctx.rotate(shard.spin * progress)
    ctx.scale(1 - progress * 0.75, 1 - progress * 0.75)
    ctx.beginPath()
    shard.outline.forEach((point, i) =>
      i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
    )
    ctx.closePath()
    ctx.fillStyle = shard.fill
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}

function drawRevealRibbons(
  ctx: CanvasRenderingContext2D,
  time: number,
  palette: MegaAnimationPalette
) {
  const progress = clamp01((time - BURST_START) / REVEAL_DURATION)
  if (progress <= 0 || progress >= 1) return
  // they unwind by length and width, like the swirl, instead of a stepped fade
  const presence = 1 - progress * progress
  REVEAL_RIBBON_SHAPES.forEach(([tilt, roundness], i) => {
    const [body, edge] = palette.revealRibbons[i]
    ctx.save()
    ctx.rotate(tilt)
    ctx.scale(1, roundness)
    const spin = (-time / 1000) * 3.5 + i * 2
    const radius = SPHERE_RADIUS * (1.05 + progress * 0.5)
    drawBrushArc(ctx, radius, spin, 1.9 * presence, body, edge, 8 * presence)
    ctx.restore()
  })
}
