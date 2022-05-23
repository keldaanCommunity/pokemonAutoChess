import React from 'react'

const buttonStyle = {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function DonateButton(){
    function handleTipeeClick(){
        window.location.href = 'https://en.tipeee.com/pokemon-auto-chess'
    }
    return <button type="button" style={buttonStyle} className="bubbly" onClick={()=>{handleTipeeClick()}}>Donate</button>
}