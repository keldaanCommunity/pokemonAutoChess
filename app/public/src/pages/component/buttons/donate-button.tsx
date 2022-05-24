import React from 'react'

export default function DonateButton(){
    function handleTipeeClick(){
        window.location.href = 'https://en.tipeee.com/pokemon-auto-chess'
    }
    return <button type="button" className="bubbly" onClick={()=>{handleTipeeClick()}}><img style={{height:'4vh', marginTop:'-0.5vh'}} src='assets/ui/tipeee.svg'/></button>
}