import React from "react"
import { EloRankThreshold, EloRank } from "../../../../types/Config"
import CSS from "csstype"

const style: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  width: "calc(48px + 3em)",
  flex: "0 0 calc(48px + 3em)",
  gap: "5px"
}

const imgStyle: CSS.Properties = {
  width: "48px",
  height: "48px",
  imageRendering: "pixelated"
}

export default function Elo(props: { elo: number }) {
  const rank = getRank(props.elo)
  return (
    <div style={style}>
      <img style={imgStyle} src={"assets/ranks/" + rank + ".png"} />
      <div>
        <p style={{ margin: "0px", fontSize: "1vw" }}>{props.elo}</p>
      </div>
    </div>
  )
}

function getRank(elo: number) {
  let rank = EloRank.BRONZE
  ;(Object.keys(EloRankThreshold) as EloRank[]).forEach((e) => {
    if (elo > EloRankThreshold[e]) {
      rank = e
    }
  })
  return rank
}
