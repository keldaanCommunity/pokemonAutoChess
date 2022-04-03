import React from 'react';

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function DiscordButton(){
    function handleDiscordClick(){
        window.location.href = 'https://discord.gg/6JMS7tr';
    }
    return <button type="button" style={buttonStyle} className="nes-btn is-warning" onClick={()=>{handleDiscordClick()}}>Join Discord</button>;
}