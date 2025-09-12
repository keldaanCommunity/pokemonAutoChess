import { useEffect, useState } from "react"
import { CDN_URL, ICreditName } from "../types"

export interface PokemonCredits {
  portrait_credit: Credit
  sprite_credit: Credit
}

export interface Credit {
  primary: string
  secondary: string[]
  total: number
}

export function useCredits() {
  const [loading, setLoading] = useState(false)
  const [creditsNames, setCreditsNames] = useState<ICreditName[]>()
  const [spriteCredits, setSpriteCredits] =
    useState<Record<string, PokemonCredits>>()

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchCreditsNames(), fetchSpriteCredits()])
      .then(([creditsNames, spriteCredits]) => {
        setCreditsNames(creditsNames)
        setSpriteCredits(spriteCredits)
      })
      .finally(() => setLoading(false))
  }, [])

  return {
    loading,
    creditsNames,
    spriteCredits
  }
}

let creditsNamesRequest
function fetchCreditsNames() {
  if (!creditsNamesRequest) {
    creditsNamesRequest = fetch(`${CDN_URL}/credit_names.txt`)
      .then((res) => res.text())
      .then((text) => text.split("\n"))
      .then((lines: string[]) =>
        lines.slice(1).map((line) => {
          let [name, discord, contact] = line.split("\t")
          if (contact && contact.startsWith("<@") && contact.endsWith(">")) {
            // Discord mention format
            const id = contact.slice(2, -1)
            contact = `https://discord.com/users/${id}`
          }
          else if (contact && contact.toLowerCase().startsWith("dc:<@") && contact.endsWith(">")) {
            // Discord mention format with DC: prefix
            contact = `https://discord.com/users/${contact.slice(5, -1)}`
          }
          const credit: ICreditName = { name, discord, contact }
          return credit
        })
      )
  }

  return creditsNamesRequest
}

let spriteCreditsRequest
function fetchSpriteCredits(): Promise<Record<string, PokemonCredits>> {
  if (!spriteCreditsRequest) {
    spriteCreditsRequest = import("../models/precomputed/credits.json").then(
      (m) => m.default
    )
  }
  return spriteCreditsRequest
}
