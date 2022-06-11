import React from 'react'

export default function GameLeave(props:{leave: ()=>void}) {
    return <button style={{fontSize:'0.9vw'}} type="button" className="bubbly-close" onClick={()=>{props.leave()}}>X</button>
}