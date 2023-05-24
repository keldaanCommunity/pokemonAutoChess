import React from "react"
import CSS from "csstype"
import { addIconsToDescription } from "../../utils/descriptions"

const imgStyle: CSS.Properties = {
  width: "64px",
  height: "64px",
  imageRendering: "pixelated",
  marginRight: "10px"
}

export default function WikiStatistic() {
  return (
    <ul className="wiki-stat">
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/hp.png"></img>
        <p>Health points</p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/shield.png"></img>
        <p>Shield</p>
        <p className="description">
          Temporary health points.
          <br />
          Cannot be healed.
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/def.png"></img>
        <p>Defense points</p>
        <p className="description">
          {addIconsToDescription(`Reduces PHYSICAL received`)}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/speDef.png"></img>
        <p>Special Defense points</p>
        <p className="description">
          {addIconsToDescription(`Reduces SPECIAL received`)}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/mana.png"></img>
        <p>Mana points</p>
        <p className="description">
          {addIconsToDescription(
            `Amount of mana required to cast ability. Pokemons receive mana with time (10 per second), when attacking (5 per attack) and when receiving damage (10% of incoming damage)`
          )}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/ap.png"></img>
        <p>Ability Power (%)</p>
        <p className="description">
          {addIconsToDescription(
            `Increase SPECIAL and ability effects in various ways.`
          )}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/atk.png"></img>
        <p>Attack Damage</p>
        <p className="description">
          {addIconsToDescription(`Damage inflicted on each basic attack`)}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/range.png"></img>
        <p>Attack Range</p>
        <p className="description">
          {addIconsToDescription(`1-range pokemon are melee`)}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/speed.png"></img>
        <p>Attack Speed (Attack/second)</p>
        <p className="description">
          Number of attacks per second.
          <br />
          Maximum 2.5
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/critChance.png"></img>
        <p>Critical hit chance (%)</p>
        <p className="description">
          {addIconsToDescription(
            `Critical hits deal 2x more damage. Abilities cannot crit by default.`
          )}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/critDamage.png"></img>
        <p>Critical hit damage</p>
        <p className="description">
          {addIconsToDescription(
            `Multiplier for critical hits additional damage`
          )}
        </p>
      </li>
    </ul>
  )
}
