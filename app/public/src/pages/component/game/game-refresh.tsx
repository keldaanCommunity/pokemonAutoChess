import React from 'react'
import CSS from 'csstype'
import { useAppDispatch } from '../../../hooks'
import { refreshClick } from '../../../stores/NetworkStore'

const style: CSS.Properties = {
    margin:'5px',
    fontSize:'1.1vw'
}


export default function GameRefresh() {
    const dispatch = useAppDispatch()
    return <button className="bubbly-primary" onClick={()=>{dispatch(refreshClick())}} style={style}>
        Refresh 1<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
    </button>
}