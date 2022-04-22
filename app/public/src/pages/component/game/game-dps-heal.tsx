import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { IDpsHeal } from '../../../../../types';
import { CDN_PORTRAIT_URL } from '../../../../../models/enum';

const imgStyle = {
    width:'40px',
    height:'40px'
}

const progressStyle = {
    height:'18px',
    borderImageOutset: '1.5'
}

const style = {
    display:'flex',
    alignItems:'center',
    marginBottom: '10px',
    width:'90%'
}

export default function GameDpsHeal(props:{maxHeal: number, dpsHeal: IDpsHeal}) {
    return  <div style={style}>
    <img style={imgStyle} src={`${CDN_PORTRAIT_URL}${props.dpsHeal.name}.png`}/>
    <div style={{display:'flex', flexFlow:'column', justifyContent:'space-around', marginLeft:'5px', width:'100%'}}>
        <p style={{marginBottom:'-5px', marginLeft:'3px'}}>{props.dpsHeal.heal + props.dpsHeal.shield}</p>
        <ProgressBar className="nes-progress is-primary" style={progressStyle}>
            <ProgressBar style={{backgroundColor: '#92cc41'}} max={props.maxHeal} now={props.dpsHeal.heal} key='heal' />
            <ProgressBar style={{backgroundColor: '#8d8d8d'}} max={props.maxHeal} now={props.dpsHeal.shield} key='shield' />
        </ProgressBar>
    </div>
</div>
}
