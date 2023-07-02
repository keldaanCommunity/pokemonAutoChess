import { Rarity } from "../../../../../types/enum/Game"
import React from "react"
import ReactTooltip from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import { RarityProbabilityPerLevel, RarityColor } from "../../../../../types/Config"

export default function GameRarityPercentage() {
  const level = useAppSelector((state) => state.game.experienceManager.level)
  const RarityTiers = [
    Rarity.COMMON,
    Rarity.UNCOMMON,
    Rarity.RARE,
    Rarity.EPIC,
    Rarity.LEGENDARY
  ]
  return (
    <>
      <ReactTooltip
        id="detail-game-rarity-percentage"
        className="customeTheme"
        effect="solid"
        place="top"
      >
        <p>Encouter rates</p>
        <table style={{ width: "10vw" }}>
          <thead>
            <tr>
              <th>Rarity</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {RarityTiers.map((rarity, index) => (
              <tr key={"detail-" + rarity}>
                <td style={{ color: RarityColor[rarity] }}>{rarity}</td>
                <td>{Math.ceil(RarityProbabilityPerLevel[level][index] * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="help">
          Increase your level to raise your chances to get higher tier Pokémon.
        </p>
      </ReactTooltip>
      <div
        className="nes-container game-rarity-percentage"
        data-tip
        data-for="detail-game-rarity-percentage"
      >
        {RarityTiers.map((rarity, index) => {
          return (
            <div key={rarity} style={{ backgroundColor: RarityColor[rarity] }}>
              {Math.ceil(RarityProbabilityPerLevel[level][index] * 100)}%
            </div>
          )
        })}
      </div>
    </>
  )
}
