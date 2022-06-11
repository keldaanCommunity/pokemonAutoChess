import React from 'react'

export default function DiscordButton(){
    function handleDiscordClick(){
        window.location.href = 'https://discord.gg/6JMS7tr'
    }
    return <button type="button" className="bubbly" onClick={()=>{handleDiscordClick()}}><img style={{height:'7vh', marginTop:'-1vh'}} src='assets/ui/discord.svg'/></button>
}