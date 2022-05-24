import React from 'react'

export default function GameLeave(props:{leave: ()=>void}) {
    return <button type="button" className="bubbly-error" onClick={()=>{props.leave()}}>X</button>
}