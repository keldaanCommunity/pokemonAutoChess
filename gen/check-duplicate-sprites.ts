import { createHash } from "crypto"
import { readdirSync, readFileSync } from "fs"
import { join, relative, resolve } from "path"

const ROOT = resolve(
  __dirname,
  "../app/public/src/assets",
  process.argv[2] ?? "abilities{tps}"
)

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (entry.name.toLowerCase().endsWith(".png")) yield path
  }
}

const byHash = new Map<string, string[]>()
let total = 0
for (const file of walk(ROOT)) {
  total++
  const hash = createHash("sha1").update(readFileSync(file)).digest("hex")
  const rel = relative(ROOT, file).split("\\").join("/")
  const list = byHash.get(hash)
  if (list) list.push(rel)
  else byHash.set(hash, [rel])
}

const groupOf = (file: string) => file.split("/")[0]
const duplicates = [...byHash.values()].filter((files) => files.length > 1)
const crossGroup = duplicates.filter(
  (files) => new Set(files.map(groupOf)).size > 1
)

console.log(`Scanned ${total} sprites in ${ROOT}`)

if (duplicates.length === 0) {
  console.log("No duplicate sprites found")
} else {
  // summarize which folders (abilities) share identical images
  const pairs = new Map<string, number>()
  for (const files of crossGroup) {
    const key = [...new Set(files.map(groupOf))].sort().join(" <-> ")
    pairs.set(key, (pairs.get(key) ?? 0) + 1)
  }
  if (pairs.size > 0) {
    console.warn(
      `\n⚠ WARNING: ${crossGroup.length} identical sprite(s) shared between different folders:`
    )
    for (const [key, count] of [...pairs].sort((a, b) => b[1] - a[1])) {
      console.warn(`  ${key}: ${count} shared sprite(s)`)
    }
    console.warn("\nDetails:")
    for (const files of crossGroup) console.warn(`  - ${files.join(", ")}`)
  }
  const intra = duplicates.length - crossGroup.length
  if (intra > 0) {
    console.warn(
      `\n⚠ WARNING: ${intra} group(s) of identical sprites inside a single folder:`
    )
    for (const files of duplicates.filter(
      (f) => new Set(f.map(groupOf)).size === 1
    ))
      console.warn(`  - ${files.join(", ")}`)
  }
  console.warn(
    `\n⚠ ${duplicates.length} duplicate group(s) found in total, consider reusing the same sprite`
  )
}
