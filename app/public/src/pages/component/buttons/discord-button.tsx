import React from "react"

export default function DiscordButton(props: { url?: string }) {
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer" className="discord-button">
      <button type="button" className="bubbly discord">
        <img width={32} height={32} src={`assets/ui/discord.svg`} />
        Discord
      </button>
    </a>
  )
}
