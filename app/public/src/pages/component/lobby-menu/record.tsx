import React from "react"
import Elo from "../elo"
import { getAvatarSrc } from "../../../utils"
import {
  IGameRecord,
  IPokemonRecord
} from "../../../../../models/colyseus-models/game-record"

export function Record(props: { record: IGameRecord }) {
  return (
    <div
      style={{ marginBottom: "10px", padding: "10px" }}
      className="nes-container"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3>Top {props.record.rank}</h3>
        <p>{formatDate(props.record.time)}</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Elo elo={props.record.elo} />
        </div>
      </div>
      <div style={{ display: "flex", overflowX: "scroll" }}>
        {props.record.pokemons.map((p, i) => (
          <RecordItem p={p} key={i} />
        ))}
      </div>
    </div>
  )
}

export function RecordItem(props: { p: IPokemonRecord }) {
  return (
    <div>
      <img
        style={{ width: "60px", imageRendering: "pixelated" }}
        src={getAvatarSrc(props.p.avatar)}
      />
      <div style={{ display: "flex" }}>
        {props.p.items.map((item, i) => {
          return (
            <img
              key={i}
              style={{
                width: "20px",
                height: "20px",
                imageRendering: "pixelated"
              }}
              src={"/assets/item/" + item + ".png"}
            />
          )
        })}
      </div>
    </div>
  )
}

function formatDate(n: number) {
  const date = new Date(n)
  return (
    pad(date.getUTCMonth() + 1) +
    "/" +
    pad(date.getUTCDate()) +
    " " +
    pad(date.getUTCHours()) +
    ":" +
    pad(date.getUTCMinutes())
  )
}

function pad(number: number) {
  if (number < 10) {
    return "0" + number
  }
  return number
}
