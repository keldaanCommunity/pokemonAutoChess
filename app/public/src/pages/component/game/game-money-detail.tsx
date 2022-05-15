import React from 'react'
import { useAppSelector } from '../../../hooks'

export default function GameMoneyDetail(){
    const streak = useAppSelector(state=>state.game.streak)
    const interest = useAppSelector(state=>state.game.interest)
    return <div>
    <div>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <p>Streak: </p>
            <div>
                {streak}
                <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
            </div>
            
        </div>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <p>Interest: </p>
            <div>
                {interest}
                <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
            </div>
        </div>
    </div>
</div>
}