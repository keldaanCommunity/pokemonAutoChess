import React from "react"
import DiscordButton from "../buttons/discord-button"
import DonateButton from "../buttons/donate-button"
import PolicyButton from "../buttons/policy-button"

export default function Media() {
  return (
    <div style={{ display: "flex" }}>
      <DiscordButton />
      <DonateButton />
      <PolicyButton />
      <p>V2.5</p>
    </div>
  )
}
