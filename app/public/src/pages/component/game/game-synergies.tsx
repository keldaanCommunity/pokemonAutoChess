import React from "react"
import Synergies from "../synergy/synergies"
import { useAppSelector } from "../../../hooks"

export default function GameSynergies() {
  const synergies = useAppSelector((state) => state.game.currentPlayerSynergies)
  return <Synergies synergies={synergies} />
}
