import React from "react"

export default function Media() {
  return (
    <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
      <DiscordButton />
      <DonateButton />
      <PolicyButton />
      <span style={{ color: "white", textShadow: "2px 2px 0 black" }}>V2.5</span>
      <p style={{ color: "#fff", textShadow: "2px 4px 3px rgba(0,0,0,0.3)" }}>
        Made by a fan, for fans.
        <br/>Non profit game
        <br/>All rights to The Pokemon Company®
      </p>
    </div>
  )
}
