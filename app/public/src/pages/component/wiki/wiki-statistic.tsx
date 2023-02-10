import React from "react"
import CSS from "csstype"

const imgStyle: CSS.Properties = {
  width: "64px",
  height: "64px",
  imageRendering: "pixelated",
  marginRight: "10px"
}

export default function WikiStatistic() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "960px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexFlow: "column"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/hp.png"></img>
          <p>Health points</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/def.png"></img>
          <p>Defense points</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/speDef.png"></img>
          <p>Special Defense points</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/mana.png"></img>
          <p>Mana points</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/spellDamage.png"></img>
          <p>Spell damage (%)</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexFlow: "column"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/atk.png"></img>
          <p>Attack damage</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/range.png"></img>
          <p>Range, 1-range pokemon are melee.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/speed.png"></img>
          <p>Attack speed (Attack/second)</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/critChance.png"></img>
          <p>Critical hit chance (%)</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <img style={imgStyle} src="assets/icons/critDamage.png"></img>
          <p>Critical hit damage (x multiplier)</p>
        </div>
      </div>
    </div>
  )
}
