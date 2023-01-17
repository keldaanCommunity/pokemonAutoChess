import React from "react"

const style = {
  color: "#fff",
  textShadow: "2px 4px 3px rgba(0,0,0,0.3)"
}

export default function Media() {
  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        width: "90vw",
        justifyContent: "space-around"
      }}
    >
      <h2 style={style}>Made by a fan, for fans</h2>
      <h2 style={style}>Non profit game</h2>
      <h2 style={style}>All rights to The Pokemon Company®</h2>
    </div>
  )
}
