import React from "react"
import { useAppSelector } from "../../../hooks"
import Synergies from "../synergy/synergies"

export default function GameSynergies() {
  const synergies = useAppSelector((state) => state.game.currentPlayerSynergies)
  return <Synergies synergies={synergies} />
}
