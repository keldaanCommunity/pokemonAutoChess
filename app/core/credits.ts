import { useState, useEffect } from "react"
import { CDN_URL } from "../types"
import { ICreditName } from "../types"

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
          const [Name, Discord, Contact] = line.split("\t")
          const credit: ICreditName = { Name, Discord, Contact }
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
