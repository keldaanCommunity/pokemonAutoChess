import React from 'react';

export default function GameLeave(props:{leave: ()=>void}) {
    return <button type="button" className="nes-btn is-error" onClick={()=>{props.leave()}}>X</button>;
}