import React from "react"
import Synergies from "../synergy/synergies"
import { useAppSelector } from "../../../hooks"

export default function BuilderSynergies() {
  const synergies = useAppSelector((state) => state.lobby.synergies)
  return <Synergies synergies={synergies} />
}
