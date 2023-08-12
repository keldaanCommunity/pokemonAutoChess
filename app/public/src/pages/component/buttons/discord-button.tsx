import React from "react"

export default function DiscordButton() {
  return (
    <a
      href="https://discord.gg/6JMS7tr"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button type="button" className="bubbly">
        <img
          src="assets/ui/discord.svg"
          style={{ height: "1.4em", margin: "0" }}
        />
      </button>
    </a>
  )
}
