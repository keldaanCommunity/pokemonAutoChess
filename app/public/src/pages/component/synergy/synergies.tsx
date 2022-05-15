import React from 'react'
import { TypeTrigger } from '../../../../../types/Config'
import SynergyComponent from './synergy-component'
import CSS from 'csstype'
import {Synergy} from '../../../../../types/enum/Synergy'

const style: CSS.Properties = {
    position: 'absolute',
    left: '0.5%',
    display: 'flex',
    justifyContent:'space-between',
    width: '13%',
    top:'11%',
    flexFlow: 'column',
    maxHeight:'73%',
    overflowY:'scroll',
    padding:'0px',
    backgroundColor:'rgba(255,255,255,0.6)' 
}

export default function Synergies(props:{synergies: [string, number][]}) {

    if(props.synergies && props.synergies.length > 0){

        return <div style={style} className='nes-container hidden-scrollable'>
            <h5 style={{padding:'10px', textAlign: 'center'}}>Synergies</h5>
        {Object.keys(Synergy).sort((a,b)=>{
                const fa = props.synergies.find(e=>e[0] == a)
                const fb = props.synergies.find(e=>e[0] == b)
                const sa = fa ? fa : 0
                const sb = fb ? fb : 0
                if(sa[1] == sb[1]){
                    if(sa[1] >= TypeTrigger[a][0]){
                        return -1
                    }
                    else{
                        return 1
                    }
                }
                else{
                    return sb[1] - sa[1]
                }
            }).map((type, index)=>{
            // console.log(type);
            const s = props.synergies.find(e=>e[0] == type)
            // console.log(s);
            if(s &&  s[1] > 0){
                return <SynergyComponent key={type} type={type as Synergy} isFirst={index==0} value={s[1]}/>
            }
            else{
                return null
            }
        })}
    </div>
    }
    else{
        return null
    }
}
