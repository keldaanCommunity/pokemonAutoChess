import { Starters } from "../types/enum/Starters"
import { Pkm } from "../types/enum/Pokemon"
import { pickRandomIn } from "./random"

const Adjectives: string[] = [
  "Happy",
  "Brave",
  "Curious",
  "Sleepy",
  "Swift",
  "Bold",
  "Calm",
  "Clever",
  "Daring",
  "Eager",
  "Fierce",
  "Gentle",
  "Jolly",
  "Kind",
  "Lively",
  "Mighty",
  "Noble",
  "Proud",
  "Quick",
  "Rash",
  "Sassy",
  "Shy",
  "Silent",
  "Sneaky",
  "Spooky",
  "Sturdy",
  "Tiny",
  "Tough",
  "Tricky",
  "Trusty",
  "Wild",
  "Witty",
  "Zany",
  "Chill",
  "Dizzy",
  "Fluffy",
  "Frosty",
  "Funky",
  "Grumpy",
  "Hasty",
  "Lucky",
  "Moody",
  "Naive",
  "Peppy",
  "Quiet",
  "Rowdy",
  "Shiny",
  "Silly",
  "Sunny",
  "Wacky"
]

function formatPkmName(pkm: Pkm): string {
  return pkm.charAt(0).toUpperCase() + pkm.slice(1).toLowerCase()
}

function randomDigits(): string {
  return String(Math.floor(10000 + Math.random() * 90000))
}

export function generateRandomName(): string {
  const adjective = pickRandomIn(Adjectives)
  const pokemon = formatPkmName(pickRandomIn(Starters))
  const digits = randomDigits()
  return `${adjective}-${pokemon}-${digits}`
}
