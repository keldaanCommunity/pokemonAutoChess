import { Rarity } from "../../../../../types/enum/Game"
import React from "react"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"
import { Probability, RarityColor } from "../../../../../types/Config"

export default function GameRarityPercentage() {
  const level = useAppSelector((state) => state.game.experienceManager.level)
  return (
    <div className="nes-container game-rarity-percentage">
      {[
        Rarity.COMMON,
        Rarity.UNCOMMON,
        Rarity.RARE,
        Rarity.EPIC,
        Rarity.LEGENDARY
      ].map((rarity, index) => {
        return (
          <div key={rarity} style={{ backgroundColor: RarityColor[rarity] }}>
            {Math.ceil(Probability[level][index] * 100)}%
          </div>
        )
      })}
    </div>
  )
}
