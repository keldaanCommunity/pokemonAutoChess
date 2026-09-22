/// <reference lib="webworker" />
import {
  createRecorderWorker,
  type RawReplayEntry,
  type ReplayReadWriteHandle
} from "./recorder-worker-core"

// dedicated worker owning the recording's file io, streaming the v1 .colreplay to an opfs file (low ram, crash-durable)
// opfs sync handles are worker-only and prompt-free, hence a worker; all logic lives in recorder-worker-core, this is the browser glue

declare const self: DedicatedWorkerGlobalScope

let dirPromise: Promise<FileSystemDirectoryHandle> | null = null
function replaysDir(): Promise<FileSystemDirectoryHandle> {
  if (!dirPromise) {
    dirPromise = navigator.storage
      .getDirectory()
      .then((root) => root.getDirectoryHandle("replays", { create: true }))
  }
  return dirPromise
}

const core = createRecorderWorker({
  async openHandle(roomId): Promise<ReplayReadWriteHandle> {
    const dir = await replaysDir()
    const fh = await dir.getFileHandle(`${roomId}.colreplay`, { create: true })
    // sync access handle: dedicated-worker only; write/read/getSize/flush/close are synchronous and fast
    const h = await (
      fh as unknown as {
        createSyncAccessHandle(): Promise<ReplayReadWriteHandle>
      }
    ).createSyncAccessHandle()
    return h as ReplayReadWriteHandle
  },
  async readFile(roomId): Promise<Uint8Array | null> {
    // read-only whole-file read for downloading a non-active file (getFile() needs no exclusive handle); null if absent
    const dir = await replaysDir()
    let fh: FileSystemFileHandle
    try {
      fh = await dir.getFileHandle(`${roomId}.colreplay`, { create: false })
    } catch {
      return null
    }
    const file = await fh.getFile()
    return new Uint8Array(await file.arrayBuffer())
  },
  async list(): Promise<RawReplayEntry[]> {
    // enumerate recordings: read only a header prefix + small tail per file, never the whole multi-mb recording
    const HEADER_PREFIX = 16384
    const TAIL_BYTES = 4096
    const dir = await replaysDir()
    const out: RawReplayEntry[] = []
    const iter = dir as unknown as {
      entries(): AsyncIterable<[string, FileSystemHandle]>
    }
    for await (const [name, handle] of iter.entries()) {
      if (!name.endsWith(".colreplay") || handle.kind !== "file") continue
      try {
        const file = await (handle as FileSystemFileHandle).getFile()
        const header = new Uint8Array(
          await file.slice(0, HEADER_PREFIX).arrayBuffer()
        )
        const tail = new Uint8Array(
          await file.slice(Math.max(0, file.size - TAIL_BYTES)).arrayBuffer()
        )
        out.push({
          roomId: name.slice(0, -".colreplay".length),
          header,
          tail,
          bytes: file.size,
          mtime: file.lastModified
        })
      } catch {
        // a file held open by the active sync handle may be unreadable here, so skip it (lists next time)
      }
    }
    return out
  },
  async remove(roomId): Promise<void> {
    const dir = await replaysDir()
    await dir.removeEntry(`${roomId}.colreplay`)
  },
  async prune(keep, protect) {
    const dir = await replaysDir()
    const protectName = `${protect}.colreplay`
    const entries: { name: string; mtime: number }[] = []
    const iter = dir as unknown as {
      entries(): AsyncIterable<[string, FileSystemHandle]>
    }
    for await (const [name, handle] of iter.entries()) {
      if (!name.endsWith(".colreplay") || handle.kind !== "file") continue
      // exclude the in-progress recording by name so it's never a prune candidate (relying on getFile() throwing for the locked handle is browser-dependent); keep counts sealed files only
      if (name === protectName) continue
      try {
        const file = await (handle as FileSystemFileHandle).getFile()
        entries.push({ name, mtime: file.lastModified })
      } catch {
        // a file held open by another sync handle may be unreadable here, so skip it (prunes next time)
      }
    }
    const keepNames = new Set(
      entries
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, keep)
        .map((e) => e.name)
    )
    // protectName was never added to entries, so it can't be deleted below
    for (const e of entries) {
      if (!keepNames.has(e.name)) {
        try {
          await dir.removeEntry(e.name)
        } catch {
          // best effort
        }
      }
    }
  },
  post: (message, transfer) => self.postMessage(message, transfer ?? [])
})

// serialize all message handling: the async open must finish before the next message, or two "frames" could open the same exclusive sync handle on one file
let chain: Promise<void> = Promise.resolve()
self.onmessage = (e: MessageEvent) => {
  chain = chain
    .then(() => core.handleMessage(e.data))
    .catch((err) => console.error("[recorder.worker]", err))
}

self.postMessage({ type: "ready" })
