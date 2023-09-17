import React from "react"
import { EloRankThreshold, EloRank } from "../../../../types/Config"
import CSS from "csstype"

const style: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  width: "calc(48px + 2.5em)",
  flex: "0 0 calc(48px + 2.5em)",
  gap: "5px"
}

const imgStyle: CSS.Properties = {
  width: "50px",
  height: "50px"
}

export default function Elo(props: { elo: number }) {
  const rank = getRank(props.elo)
  return (
    <div style={style} className="elo">
      <img style={imgStyle} src={"assets/ranks/" + rank + ".svg"} />
      <p style={{ margin: "0px", fontSize: "1vw" }}>{props.elo}</p>
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
