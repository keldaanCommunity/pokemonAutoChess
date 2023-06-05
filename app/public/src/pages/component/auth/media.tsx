import React from "react"
import DiscordButton from "../buttons/discord-button"
import GithubButton from "../buttons/github-button"
import PolicyButton from "../buttons/policy-button"

export default function Media() {
  return (
    <div className="media">
      <DiscordButton />
      <GithubButton />
      <PolicyButton />
      <span>V3.4</span>
      <p>
        Made by 2 fans, for fans
        <br />
        Non profit / Open Source game
        <br />
        All rights to The Pokemon Company®
      </p>
    </div>
  )
}
