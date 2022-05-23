import React from 'react'

export default function GameLeave(props:{leave: ()=>void}) {
    return <button type="button" className="bubbly-success is-error" onClick={()=>{props.leave()}}>X</button>
}