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

console.log(`Scanned ${total} PNG files in ${ROOT}`)

if (crossGroup.length === 0) {
  console.log("No shared PNGs found across ability folders.")
} else {
  const groupsByFolders = new Map<string, string[][]>()
  for (const files of crossGroup) {
    const key = [...new Set(files.map(groupOf))].sort().join(" <-> ")
    const groups = groupsByFolders.get(key)
    if (groups) groups.push(files)
    else groupsByFolders.set(key, [files])
  }

  const sortedGroups = [...groupsByFolders.entries()].sort(
    ([firstKey, firstGroups], [secondKey, secondGroups]) =>
      secondGroups.length - firstGroups.length ||
      firstKey.localeCompare(secondKey)
  )
  console.log(
    `\nFound ${crossGroup.length} shared PNG groups across ${sortedGroups.length} ability-folder combinations:`
  )
  for (const [folders, groups] of sortedGroups) {
    console.log(`\n${folders} (${groups.length})`)
    for (const files of groups.sort((first, second) =>
      first.join(" ").localeCompare(second.join(" "))
    )) {
      const sortedFiles = [...files].sort()
      let line = `  ${sortedFiles[0]}`
      for (const file of sortedFiles.slice(1)) {
        const next = ` = ${file}`
        if (line.length + next.length > 100) {
          console.log(line)
          line = `    = ${file}`
        } else {
          line += next
        }
      }
      console.log(line)
    }
  }
}
