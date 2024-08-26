import React from "react"

export default function DiscordButton(props: { channel?: string }) {
  let url = process.env.DISCORD_SERVER
  if (props.channel === "bot-creation")
    url = "https://discord.com/invite/6JMS7tr"
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button type="button" className="bubbly discord">
        <img width={32} height={32} src={`assets/ui/discord.svg`} />
        Discord
      </button>
    </a>
  )
}
