import React from 'react'

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function WikiButton(props:{toggleWiki: ()=>void}){
    return <button type="button" style={buttonStyle} className="nes-btn is-success" onClick={props.toggleWiki}>Lobby</button>
}