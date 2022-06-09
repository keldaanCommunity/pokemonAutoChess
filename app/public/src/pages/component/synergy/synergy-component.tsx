import React from 'react'
import {TypeTrigger} from '../../../../../types/Config'
import ReactTooltip from 'react-tooltip'
import SynergyDetailComponent from './synergy-detail-component'
import { Synergy } from '../../../../../types/enum/Synergy'
import { SynergyName } from '../../../../../types/strings/Synergy'

export default function SynergyComponent(props:{type: Synergy, isFirst: boolean, value: number}) {
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: props.value >= TypeTrigger[props.type][0] ? '#54596b': 'rgba(84, 89, 107,0)',
        margin: '5px',
        borderRadius:'12px',
        padding:'5px',
        border: props.value >= TypeTrigger[props.type][0] ? '4px solid black': 'none',
        cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer'
    }}
    data-tip
    data-for={'detail-' + props.type}
    >
    <ReactTooltip id={'detail-' + props.type} 
    className='customeTheme'
    effect='solid'
    place='right'
    offset={{bottom: props.isFirst ? 110: 0}}>
        <SynergyDetailComponent type={props.type} value={props.value}/>
    </ReactTooltip>

        <img style={{
            height:'40px',
            width:'40px'
        }}
        src={'assets/types/' + props.type + '.svg'}/>
        <h4>{props.value}</h4>
        <div style={{
            display:'flex',
             flexFlow:'column'}}>
            <div style={{
                display:'flex',
                justifyContent:'space-between'
            }}>
                {TypeTrigger[props.type].map(t=>{
                    return <span key={t} style={{color: props.value >= t ? '#fff': '#e8e8e8'}}>
                        {t} 
                        </span>
                })}
            </div>
            <p style={{margin:'0px'}}>{SynergyName[props.type]['eng']}</p>
        </div>
    </div>
}