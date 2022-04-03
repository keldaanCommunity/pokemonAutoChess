import React from 'react';

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function CreditsButton(){
    function handleCreditsClick(){
        window.location.href = 'https://pokemonautochess-b18fb.web.app/';
    }
    return <button type="button" style={buttonStyle} className="nes-btn" onClick={()=>{handleCreditsClick()}}>Credits</button>;
}