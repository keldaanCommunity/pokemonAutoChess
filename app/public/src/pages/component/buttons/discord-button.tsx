import React from "react"

export default function DiscordButton(props: { channel?: string }) {
  let url = "https://discord.gg/6JMS7tr"
  if (props.channel === "bot-creation")
    url = "https://discord.com/channels/737230355039387749/914503292875325461"
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button type="button" className="bubbly discord">
        <img width={32} height={32} src={`assets/ui/discord.svg`} />
        Discord
      </button>
    </a>
  )
}
