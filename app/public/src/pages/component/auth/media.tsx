import React from "react"
import DiscordButton from "../buttons/discord-button"
import GithubButton from "../buttons/github-button"
import PolicyButton from "../buttons/policy-button"

export default function Media() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1em",
        alignItems: "center",
        justifyContent: "end",
        marginRight: "1em"
      }}
    >
      <DiscordButton />
      <GithubButton />
      <PolicyButton />
      <span style={{ color: "white", textShadow: "2px 2px 0 black" }}>
        V2.6
      </span>
      <p style={{ color: "#fff", textShadow: "2px 4px 3px rgba(0,0,0,0.3)" }}>
        Made by a fan, for fans
        <br />
        Non profit / Open Source game
        <br />
        All rights to The Pokemon Company®
      </p>
    </div>
  )
}
