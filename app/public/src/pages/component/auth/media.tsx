import React from "react"
import DiscordButton from "../buttons/discord-button"
import DonateButton from "../buttons/donate-button"
import PolicyButton from "../buttons/policy-button"

export default function Media() {
  return (
    <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
      <DiscordButton />
      <DonateButton />
      <PolicyButton />
      <span style={{ color: "white", textShadow: "2px 2px 0 black" }}>V2.5</span>
    </div>
  )
}
