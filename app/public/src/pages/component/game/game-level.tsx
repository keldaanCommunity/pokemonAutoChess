import React from 'react'
import CSS from 'csstype'
import { useAppDispatch } from '../../../hooks'
import { levelClick } from '../../../stores/NetworkStore'

const style: CSS.Properties = {
    position:'absolute',
    left:'6%',
    bottom:'7%',
    width:'12%'
}

export default function GameLevel() {
    const dispatch = useAppDispatch()
    return <button className="nes-btn is-warning" onClick={()=>{dispatch(levelClick())}} style={style}>
    <div>Buy XP 4<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/></div>
</button>
}