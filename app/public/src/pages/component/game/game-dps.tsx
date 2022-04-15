import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import CSS from 'csstype';
import { IDps } from '../../../../../types';
import { CDN_URL } from '../../../../../models/enum';

const imgStyle: CSS.Properties = {
    width:'40px',
    height:'40px'
}

const progressStyle: CSS.Properties = {
    height:'18px',
    borderImageOutset: '1.5'
}

const style: CSS.Properties = {
    display:'flex',
    alignItems:'center',
    marginBottom: '10px',
    width:'90%'
}

export default function GameDps(props:{maxDamage: number, dps: IDps}) {
    return  <div style={style}>
    <img style={imgStyle} src={`${CDN_URL}${props.dps.name}.png`}/>
    <div style={{display:'flex', flexFlow:'column', justifyContent:'space-around', marginLeft:'5px', width:'100%'}}>
        <p style={{marginBottom:'-5px', marginLeft:'3px'}}>{props.dps.physicalDamage + props.dps.specialDamage + props.dps.trueDamage}</p>
        <ProgressBar className="nes-progress is-primary" style={progressStyle}>
            <ProgressBar style={{backgroundColor: '#e76e55'}} max={props.maxDamage} now={props.dps.physicalDamage} key='physical' />
            <ProgressBar style={{backgroundColor: '#209cee'}} max={props.maxDamage} now={props.dps.specialDamage} key='special' />
            <ProgressBar style={{backgroundColor: '#f7d51d'}} max={props.maxDamage} now={props.dps.trueDamage} key='true' />
        </ProgressBar>
    </div>
</div>
}