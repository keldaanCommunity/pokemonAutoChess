import React from 'react'

const buttonStyle = {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function PolicyButton(){
    function handlePrivacyPolicyClick(){
        window.location.href = 'https://pokemonautochess-b18fb.web.app/privacy-policy.html'
    }
    return <button type="button" style={buttonStyle} className="bubbly" onClick={()=>{handlePrivacyPolicyClick()}}>Policy</button>
}