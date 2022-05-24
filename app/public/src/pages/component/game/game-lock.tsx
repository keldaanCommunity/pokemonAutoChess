import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import CSS from 'csstype'
import { lockClick } from '../../../stores/NetworkStore'

const style: CSS.Properties = {
    position:'absolute',
    top:'5%',
    left:'1%'
}

export default function GameLock() {
    const dispatch = useAppDispatch()
    const shopLocked = useAppSelector(state=>state.game.shopLocked)

    return <button className= {shopLocked ? 'bubbly-error': 'bubbly-success is-success'} onClick={()=>{dispatch(lockClick())}} style={style}>
    <img style={{width:'25px', marginLeft:'-1px'}} src="/assets/ui/lock.png"/>
</button>
}