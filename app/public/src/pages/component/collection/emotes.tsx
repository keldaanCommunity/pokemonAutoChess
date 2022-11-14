import React, { useState } from "react"
import { Emotion } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { broadcastEmote } from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"

export default function Emotes() {
  const [collectionVisible, setCollectionVisible] = useState<boolean>(false)
  return (
    <div
      style={{
        position: "absolute",
        right: "9.5%",
        bottom: "16%",
        borderColor: "black"
      }}
    >
      <EmoteCollection visible={collectionVisible} />
      <button
        className="bubbly-success"
        style={{ height: "30px", padding: "0px" }}
        onClick={() => {
          setCollectionVisible(!collectionVisible)
        }}
      >
        {":)"}
      </button>
    </div>
  )
}

export function EmoteCollection(props: { visible: boolean }) {
  const collection = useAppSelector((state) => state.game.pokemonCollection)
  const c = new Array<{ id: string; emotion: Emotion; shiny: boolean }>()
  collection.forEach((v, k) => {
    const co = collection.get(k)
    if (co) {
      co.emotions.forEach((e) => c.push({ id: k, emotion: e, shiny: false }))
      co.shinyEmotions.forEach((e) =>
        c.push({ id: k, emotion: e, shiny: false })
      )
    }
  })
  return (
    <div
      className="nes-container"
      style={{
        display: props.visible ? "inherit" : "none",
        position: "absolute",
        right: "0%",
        bottom: "120%",
        padding: "10px",
        width: "600px"
      }}
    >
      <p style={{ textAlign: "center" }}>Emotes</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {c.map((conf) => (
          <Emote
            key={`${conf.id}-${conf.emotion}-${conf.shiny}`}
            id={conf.id}
            emotion={conf.emotion}
            shiny={conf.shiny}
          />
        ))}
      </div>
    </div>
  )
}

export function Emote(props: { id: string; shiny: boolean; emotion: Emotion }) {
  const dispatch = useAppDispatch()
  return (
    <img
      onClick={() => {
        dispatch(
          broadcastEmote(getPortraitSrc(props.id, props.shiny, props.emotion))
        )
      }}
    />
  )
}
