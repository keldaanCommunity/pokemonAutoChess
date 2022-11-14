import { Rarity } from "../../../../../types/enum/Game"
import React from "react"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"
import { Probability, RarityColor } from "../../../../../types/Config"

const style: CSS.Properties = {
  display: "flex",
  padding: "0px",
  borderRadius: "5px"
}

export default function GameRarityPercentage() {
  const level = useAppSelector((state) => state.game.experienceManager.level)
  return (
    <div style={style} className="nes-container">
      {[
        Rarity.COMMON,
        Rarity.UNCOMMON,
        Rarity.RARE,
        Rarity.EPIC,
        Rarity.LEGENDARY
      ].map((rarity, index) => {
        return (
          <div
            key={rarity}
            style={{
              backgroundColor: RarityColor[rarity],
              width: "20%",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {Math.ceil(Probability[level][index] * 100)}%
          </div>
        )
      })}
    </div>
  )
}
