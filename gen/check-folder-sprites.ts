import { createHash } from "crypto"
import { existsSync, readdirSync, readFileSync, statSync } from "fs"
import { join, relative, resolve } from "path"
import { createInterface } from "readline"

const ABILITIES_ROOT = resolve(
  __dirname,
  "../app/public/src/assets/abilities{tps}"
)

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (entry.name.toLowerCase().endsWith(".png")) yield path
  }
}

const hashFile = (file: string) =>
  createHash("sha1").update(readFileSync(file)).digest("hex")

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((res) =>
    rl.question(question, (answer) => {
      rl.close()
      res(answer)
    })
  )
}

async function main() {
  const input =
    process.argv[2] ?? (await prompt("Path of the folder of pictures to check: "))
  const folder = resolve(process.env.INIT_CWD ?? process.cwd(), input.trim().replace(/^["']|["']$/g, ""))

  if (!existsSync(folder) || !statSync(folder).isDirectory()) {
    console.error(`Error: "${folder}" is not a folder`)
    process.exit(1)
  }

  const newFiles = [...walk(folder)]
  if (newFiles.length === 0) {
    console.error(`Error: no PNG found in "${folder}"`)
    process.exit(1)
  }

  const existing = new Map<string, string[]>()
  for (const file of walk(ABILITIES_ROOT)) {
    if (file.startsWith(folder + "/") || file.startsWith(folder + "\\")) continue
    const hash = hashFile(file)
    const rel = relative(ABILITIES_ROOT, file).split("\\").join("/")
    const list = existing.get(hash)
    if (list) list.push(rel)
    else existing.set(hash, [rel])
  }

  const abilitiesUsing = new Map<string, number>()
  let matched = 0
  for (const file of newFiles) {
    const used = existing.get(hashFile(file))
    if (!used) continue
    matched++
    console.warn(
      `⚠ ${relative(folder, file)} is already used in: ${used.join(", ")}`
    )
    for (const ability of new Set(used.map((u) => u.split("/")[0]))) {
      abilitiesUsing.set(ability, (abilitiesUsing.get(ability) ?? 0) + 1)
    }
  }

  console.log(
    `\nChecked ${newFiles.length} picture(s) from ${folder} against existing abilities`
  )
  if (matched === 0) {
    console.log("No picture is already in use")
  } else {
    console.warn(
      `⚠ WARNING: ${matched}/${newFiles.length} picture(s) already in use:`
    )
    for (const [ability, count] of [...abilitiesUsing].sort(
      (a, b) => b[1] - a[1]
    ))
      console.warn(`  ${ability}: ${count} shared picture(s)`)
    console.warn("Consider using different particles to avoid sharing them")
  }
}

main()
