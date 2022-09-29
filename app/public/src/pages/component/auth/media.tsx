import React from 'react'
import CreditsButton from '../buttons/credits-button'
import DiscordButton from '../buttons/discord-button'
import DonateButton from '../buttons/donate-button'
import PolicyButton from '../buttons/policy-button'

export default function Media(){
  return (
    <div style={{display:'flex'}}>
        <DiscordButton/>
        <DonateButton/>
        <PolicyButton/>
        <CreditsButton/>
       <p>V2.2</p>
    </div>
  )
}