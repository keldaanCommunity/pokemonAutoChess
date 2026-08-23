import { pack, unpack } from "@colyseus/msgpackr"

// .colreplay = "CLRP" container: header + length-prefixed frame records + optional match-summary footer. each frame
// stores raw inbound Colyseus bytes (handshake/state/patch) or a re-encoded ROOM_DATA message, so playback feeds
// byte-identical data through the normal client; every frame is independently decodable, enabling seeking.
//
// byte layout (LE; varint = unsigned LEB128):
//   magic "CLRP" | u8 containerVer=1 | u32 metaLen | metadata JSON | frames…
//   frame: u8 kind(0=hs,1=state,2=patch,3=msg) | varint tDelta
//     state-like: varint offset | varint len | len bytes
//     message:    u8 typeTag(0=num,1=str) | type | u8 enc(0=msgpack,1=bytes,2=none) | [varint len | bytes]

export interface ReplayFrame {
  t: number // ms since first frame
  kind: "handshake" | "state" | "patch" | "message"
  // state frames (handshake/state/patch):
  offset?: number // payload start within the frame bytes
  bytes?: Uint8Array
  // message frames (ROOM_DATA): typed onMessage event
  type?: string | number
  payload?: unknown // decoded value, or Uint8Array for ROOM_DATA_BYTES
}

export interface ReplayManifest {
  format: string
  schemaVersion: number
  game: { version: string; assetsVersion: string; serializerId: string }
  room: string
  viewerUid: string
  recordedAt: string
  frames: ReplayFrame[]
  // POV final team + placement from the trailer footer; absent on old/foreign files
  summary?: ReplaySummary
}

const MAGIC = [0x43, 0x4c, 0x52, 0x50] // "CLRP"
const CONTAINER_V1 = 1
const KIND = { handshake: 0, state: 1, patch: 2, message: 3 } as const
const KIND_NAME = ["handshake", "state", "patch", "message"] as const
const ENC_MSGPACK = 0
const ENC_BYTES = 1
const ENC_NONE = 2

// ── byte writer / reader ────────────────────────────────────────────────────────────────────────────
class ByteWriter {
  // ArrayBuffer-backed (not ArrayBufferLike) so done() returns a valid Blob/BufferSource
  private buf: Uint8Array<ArrayBuffer> = new Uint8Array(4096)
  private len = 0
  private ensure(n: number) {
    if (this.len + n <= this.buf.length) return
    let cap = this.buf.length
    while (cap < this.len + n) cap *= 2
    const nb = new Uint8Array(cap)
    nb.set(this.buf.subarray(0, this.len))
    this.buf = nb
  }
  u8(v: number) {
    this.ensure(1)
    this.buf[this.len++] = v & 0xff
  }
  u32(v: number) {
    this.ensure(4)
    v = v >>> 0
    this.buf[this.len++] = v & 0xff
    this.buf[this.len++] = (v >>> 8) & 0xff
    this.buf[this.len++] = (v >>> 16) & 0xff
    this.buf[this.len++] = (v >>> 24) & 0xff
  }
  varint(v: number) {
    if (!Number.isInteger(v) || v < 0)
      throw new Error(`varint: expected a non-negative integer, got ${v}`)
    this.ensure(10)
    while (v >= 0x80) {
      this.buf[this.len++] = (v & 0x7f) | 0x80
      v = Math.floor(v / 128)
    }
    this.buf[this.len++] = v
  }
  bytes(u8: Uint8Array) {
    this.ensure(u8.length)
    this.buf.set(u8, this.len)
    this.len += u8.length
  }
  done(): Uint8Array<ArrayBuffer> {
    return this.buf.subarray(0, this.len)
  }
}

class ByteReader {
  pos = 0
  constructor(private u8: Uint8Array) {}
  u8r(): number {
    return this.u8[this.pos++]
  }
  u32(): number {
    const b = this.u8
    const p = this.pos
    this.pos += 4
    return (
      ((b[p] | (b[p + 1] << 8) | (b[p + 2] << 16)) >>> 0) + b[p + 3] * 0x1000000
    )
  }
  varint(): number {
    let shift = 1
    let result = 0
    let b: number
    do {
      b = this.u8[this.pos++]
      result += (b & 0x7f) * shift
      shift *= 128
    } while (b & 0x80)
    return result
  }
  bytes(n: number): Uint8Array {
    const out = this.u8.slice(this.pos, this.pos + n)
    this.pos += n
    return out
  }
  get eof(): boolean {
    return this.pos >= this.u8.length
  }
  get length(): number {
    return this.u8.length
  }
}

const te = new TextEncoder()
const td = new TextDecoder()

// fixed file prefix (magic + version + length-prefixed metadata json), written once at open; the worker then appends frame records
export function encodeHeaderV1(manifest: {
  game: ReplayManifest["game"]
  room: string
  viewerUid: string
  recordedAt: string
}): Uint8Array<ArrayBuffer> {
  const w = new ByteWriter()
  for (const c of MAGIC) w.u8(c)
  w.u8(CONTAINER_V1)
  const meta = {
    format: "colreplay-v1",
    schemaVersion: CONTAINER_V1,
    game: manifest.game,
    room: manifest.room,
    viewerUid: manifest.viewerUid,
    recordedAt: manifest.recordedAt
  }
  const metaBytes = te.encode(JSON.stringify(meta))
  w.u32(metaBytes.length)
  w.bytes(metaBytes)
  return w.done()
}

export interface ReplayHeaderMeta {
  format: string
  schemaVersion: number
  game: { version: string; assetsVersion: string; serializerId: string }
  room: string
  viewerUid: string
  recordedAt: string
}

// parse just the v1 header (no frames) for cheap listing from a small prefix; null on a bad header, callers fall back to filename + mtime
export function readReplayHeader(bytes: Uint8Array): ReplayHeaderMeta | null {
  try {
    if (bytes.length < 9) return null
    for (let i = 0; i < MAGIC.length; i++)
      if (bytes[i] !== MAGIC[i]) return null
    const r = new ByteReader(bytes)
    for (let i = 0; i < MAGIC.length; i++) r.u8r() // magic
    if (r.u8r() !== CONTAINER_V1) return null // container version
    const metaLen = r.u32()
    // header must fit inside the bytes we were handed
    if (metaLen <= 0 || 9 + metaLen > bytes.length) return null
    return JSON.parse(td.decode(r.bytes(metaLen))) as ReplayHeaderMeta
  } catch {
    return null
  }
}

// ── match-summary trailer (footer at EOF) ─────────────────────────────────────────────────────────────
// per-recording summary appended after the last frame; /replay reads it from a small tail slice, no body decode; absent on pre-trailer/non-CLRP files
//   layout:  [ summary JSON bytes ][ u32 summaryLen (LE) ][ TRAILER_MAGIC "CLTR" ]
const TRAILER_MAGIC = [0x43, 0x4c, 0x54, 0x52] // "CLTR"
const TRAILER_FOOTER_LEN = 4 + TRAILER_MAGIC.length // u32 summaryLen + magic

interface ReplaySummaryUnit {
  name: string // pkm enum name, for the tooltip
  index: string // sprite index ("0025"), for the portrait
  shiny?: boolean
}

// all fields optional, reader tolerates a partial/future summary
export interface ReplaySummary {
  rank?: number // final placement, 1 (winner) … 8
  team?: ReplaySummaryUnit[] // POV final board, for portrait thumbnails
  name?: string
}

// derive the POV's final placement for the trailer. player.rank (game-room.ts rankPlayers) is authoritative once the
// POV is eliminated, but a still-alive POV who leaves surrenders and the server only writes that rank in onLeave after
// our socket closed, so the recording never sees it; for a still-alive POV place at aliveCount (sole survivor is 1)
export function deriveFinalRank(
  povRank: number | undefined,
  povAlive: boolean,
  aliveCount: number
): number | undefined {
  if (povAlive) return aliveCount > 0 ? aliveCount : povRank || undefined
  return povRank || undefined
}

// encode the trailer footer for summary; append it after the last frame at close
export function encodeReplayTrailer(
  summary: ReplaySummary
): Uint8Array<ArrayBuffer> {
  const w = new ByteWriter()
  const body = te.encode(JSON.stringify(summary))
  w.bytes(body)
  w.u32(body.length)
  for (const c of TRAILER_MAGIC) w.u8(c)
  return w.done()
}

// parse the trailer footer at the end of buf (whole file or tail slice); byteLength bounds the decoder's frame
// region. null when there's no valid footer (old/foreign file, or slice too short)
function parseTrailerFooter(
  buf: Uint8Array
): { summary: ReplaySummary; byteLength: number } | null {
  try {
    const L = buf.length
    if (L < TRAILER_FOOTER_LEN) return null
    for (let i = 0; i < TRAILER_MAGIC.length; i++) {
      if (buf[L - TRAILER_MAGIC.length + i] !== TRAILER_MAGIC[i]) return null
    }
    const lenPos = L - TRAILER_FOOTER_LEN
    const summaryLen =
      (buf[lenPos] | (buf[lenPos + 1] << 8) | (buf[lenPos + 2] << 16)) +
      buf[lenPos + 3] * 0x1000000
    const start = lenPos - summaryLen
    if (summaryLen <= 0 || start < 0) return null // trailer not fully inside buf (tail slice too short) or corrupt
    const summary = JSON.parse(
      td.decode(buf.subarray(start, lenPos))
    ) as ReplaySummary
    // require an object: a frame body coincidentally ending in <primitive><u32 len>"CLTR" would else be
    // mis-read as a trailer and truncate real frames
    if (typeof summary !== "object" || summary === null) return null
    return { summary, byteLength: summaryLen + TRAILER_FOOTER_LEN }
  } catch {
    return null
  }
}

export function readReplayTrailer(buf: Uint8Array): ReplaySummary | null {
  return parseTrailerFooter(buf)?.summary ?? null
}

// total byte length of the eof trailer, or null when absent. on resume, truncate a sealed file's trailer before
// appending reconnect frames, else they land past it and the decoder mis-bounds the frame region
export function trailerByteLength(buf: Uint8Array): number | null {
  return parseTrailerFooter(buf)?.byteLength ?? null
}

// ensure a v1 buffer carries a match-summary footer: append one when absent, else return unchanged. never
// double-appends (a second footer pushes the first into the frame region, corrupting decode); no-ops without a summary
export function ensureReplayTrailer(
  bytes: Uint8Array<ArrayBuffer>,
  summary: ReplaySummary | null | undefined
): Uint8Array<ArrayBuffer> {
  if (!summary || parseTrailerFooter(bytes)) return bytes
  const trailer = encodeReplayTrailer(summary)
  const out = new Uint8Array(bytes.length + trailer.length)
  out.set(bytes, 0)
  out.set(trailer, bytes.length)
  return out
}

// detected build-skew between a recording and the viewer's build; kind selects the message and carries the
// version/build strings, viewer localizes via t("replay.skew.<kind>", skew)
type ReplaySkew =
  | { kind: "version"; recorded: string; running: string }
  | { kind: "serializer"; recorded: string; running: string }
  | { kind: "build"; version: string; recorded: string; running: string }

// compare a recording's stamped build against the viewer's build; skew descriptor or null. state decode is
// reflection-driven (schema rides the handshake frame) so a balance patch plays back; this guards a structural
// schema change, which throws per frame into a frozen/partial scene plus a non-blocking banner
export function detectBuildSkew(
  recorded:
    | { version?: string; assetsVersion?: string; serializerId?: string }
    | null
    | undefined,
  running: { version: string; assetsVersion: string; serializerId?: string }
): ReplaySkew | null {
  if (!recorded?.version) return null // unknown/foreign header, nothing to compare against
  const recV = semver(recorded.version)
  const runV = semver(running.version)
  if (recV !== runV) return { kind: "version", recorded: recV, running: runV }
  if (
    recorded.serializerId &&
    running.serializerId &&
    recorded.serializerId !== running.serializerId
  )
    return {
      kind: "serializer",
      recorded: recorded.serializerId,
      running: running.serializerId
    }
  if (
    recorded.assetsVersion &&
    running.assetsVersion &&
    recorded.assetsVersion !== running.assetsVersion
  )
    return {
      kind: "build",
      version: runV,
      recorded: recorded.assetsVersion,
      running: running.assetsVersion
    }
  return null
}

// leading major.minor.patch of a version/build; returns the input unchanged when not semver-shaped
function semver(v: string): string {
  return (typeof v === "string" && v.match(/^\d+\.\d+\.\d+/)?.[0]) || v
}

// encode one frame record for streaming append. prevT is the previous frame's t; pass null for the first frame of a
// reopened file so tDelta is 0 and the reconnect segment continues from accumulated time, collapsing the dead gap
export function encodeFrameV1(
  frame: ReplayFrame,
  prevT: number | null
): { bytes: Uint8Array<ArrayBuffer>; t: number } {
  const w = new ByteWriter()
  const t = writeFrame(w, frame, prevT == null ? (frame.t ?? 0) : prevT)
  return { bytes: w.done(), t }
}

// shared per-frame writer used by encodeFrameV1
function writeFrame(w: ByteWriter, f: ReplayFrame, prevT: number): number {
  if (!(f.kind in KIND))
    throw new Error(`writeFrame: unknown frame kind "${f.kind}"`)
  const kind = KIND[f.kind]
  w.u8(kind)
  const t = f.t ?? 0
  let dt = t - prevT
  let nextPrevT = t
  // recorder stamps t = Date.now() (non-monotonic); a backward clock step makes dt < 0. don't throw (that aborts the
  // worker's flush batch and loses frames); clamp the gap to 0 and pin to prevT so the timeline can't go back
  if (dt < 0) {
    console.warn(`[colreplay] non-monotonic frame t (dt=${dt}); clamping to 0`)
    dt = 0
    nextPrevT = prevT
  }
  w.varint(dt)
  if (kind === KIND.message) {
    if (typeof f.type === "number") {
      w.u8(0)
      w.varint(f.type)
    } else {
      w.u8(1)
      const tb = te.encode(String(f.type))
      w.varint(tb.length)
      w.bytes(tb)
    }
    const p = f.payload
    if (p === undefined) {
      w.u8(ENC_NONE)
    } else if (p instanceof Uint8Array) {
      w.u8(ENC_BYTES)
      w.varint(p.length)
      w.bytes(p)
    } else {
      w.u8(ENC_MSGPACK)
      const pb = pack(p)
      w.varint(pb.length)
      w.bytes(pb)
    }
  } else {
    w.varint(f.offset ?? 1)
    // state frames always carry bytes in practice; the empty fallback is defensive
    const b = f.bytes ?? new Uint8Array(0)
    w.varint(b.length)
    w.bytes(b)
  }
  return nextPrevT
}

// ── decode: v1 binary to manifest (frames carry `bytes` / decoded `payload`) ──
export function decodeReplayV1(bytes: Uint8Array): ReplayManifest {
  const r = new ByteReader(bytes)
  for (const c of MAGIC) {
    if (r.u8r() !== c)
      throw new Error("decodeReplayV1: bad magic (not a CLRP file)")
  }
  const ver = r.u8r()
  if (ver !== CONTAINER_V1)
    throw new Error(`decodeReplayV1: unsupported container version ${ver}`)
  const metaLen = r.u32()
  const meta = JSON.parse(td.decode(r.bytes(metaLen)))

  // the trailer footer isn't a frame, so bound the frame loop to exclude it, else its bytes mis-parse as a
  // frame; framesEnd is the file end when the trailer is absent
  const trailer = parseTrailerFooter(bytes)
  const framesEnd = trailer ? bytes.length - trailer.byteLength : bytes.length

  const frames: ReplayFrame[] = []
  let prevT = 0
  // recover the valid prefix of a truncated/corrupt file (crash mid-write) rather than discarding it all: push a
  // frame only if it parsed fully (cursor stayed in bounds); on a short read or bad kind, warn and stop
  while (r.pos < framesEnd) {
    const frameStart = r.pos
    let frame: ReplayFrame
    let t: number
    try {
      const kind = r.u8r()
      t = prevT + r.varint()
      if (kind === KIND.message) {
        const typeTag = r.u8r()
        const type = typeTag === 0 ? r.varint() : td.decode(r.bytes(r.varint()))
        const enc = r.u8r()
        let payload: unknown
        if (enc === ENC_NONE) payload = undefined
        else if (enc === ENC_BYTES) payload = r.bytes(r.varint())
        else payload = unpack(r.bytes(r.varint()))
        frame = { t, kind: "message", type, payload }
      } else {
        const kindName = KIND_NAME[kind]
        if (kindName === undefined)
          throw new Error(`unknown frame kind byte ${kind}`)
        const offset = r.varint()
        const len = r.varint()
        frame = { t, kind: kindName, offset, bytes: r.bytes(len) }
      }
      if (r.pos > r.length) throw new Error("frame extends past end of file")
    } catch (e) {
      console.warn(
        `[colreplay] decode stopped at a truncated/corrupt frame @${frameStart} (recovered ${frames.length} frames): ${(e as Error).message}`
      )
      break
    }
    prevT = t
    frames.push(frame)
  }
  return { ...meta, frames, summary: trailer?.summary }
}

// decode a whole .colreplay buffer into a manifest; throws if it isn't a CLRP container
export function loadReplay(input: ArrayBuffer | Uint8Array): ReplayManifest {
  const u8 = input instanceof Uint8Array ? input : new Uint8Array(input)
  const isCLRP =
    u8.length >= 4 &&
    u8[0] === MAGIC[0] &&
    u8[1] === MAGIC[1] &&
    u8[2] === MAGIC[2] &&
    u8[3] === MAGIC[3]
  if (!isCLRP) throw new Error("loadReplay: not a CLRP file")
  return decodeReplayV1(u8)
}
