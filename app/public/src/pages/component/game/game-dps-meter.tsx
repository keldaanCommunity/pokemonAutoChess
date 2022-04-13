import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CSS from 'csstype';
import GameBlueDpsMeter from './game-blue-dps-meter';
import GameRedDpsMeter from './game-red-dps-meter';
import GameBlueHealDpsMeter from './game-blue-heal-dps-meter';
import GameRedHealDpsMeter from './game-red-heal-dps-meter';
import { useAppSelector } from '../../../hooks';
import { CDN_URL } from '../../../../../models/enum';

const style: CSS.Properties = {
    position:'absolute',
    right: '6.5%',
    top: '.5%',
    width:'15%',
    display:'flex',
    flexFlow:'column',
    justifyContent:'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding:'10px',
    overflowY:'scroll',
    maxHeight:'78%'
}
const imgStyle: CSS.Properties = {
    width:'60px',
    height:'60px',
    imageRendering:'pixelated'
};

export default function GameDpsMeter() {
    const opponentAvatar = useAppSelector(state=>state.game.currentPlayerOpponentAvatar);
    const avatar = useAppSelector(state=>state.game.currentPlayerAvatar);
    if(opponentAvatar == ''){
        return null;
    }
    else{
        return <div className='nes-container hidden-scrollable' style={style}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
            <img style={imgStyle} src={CDN_URL + avatar + '.png'}></img>
            <h2>Vs</h2>
            <img style={imgStyle} src={CDN_URL + opponentAvatar + '.png'}></img>
        </div>
        <Tabs>
            <TabList style={{display:'flex', justifyContent:'space-evenly'}}>
                <Tab key='damage'>
                    <p>Damage</p>
                </Tab>
                <Tab key='heal'>
                    <p>Heal</p>
                </Tab>
            </TabList>
    
            <TabPanel>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '50%'}}>
                        <GameBlueDpsMeter/>
                    </div>
                    <div style={{width: '50%'}}>
                        <GameRedDpsMeter/>
                    </div>
                </div>
            </TabPanel>
    
            <TabPanel>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{width: '50%'}}>
                            <GameBlueHealDpsMeter/>
                        </div>
                        <div style={{width: '50%'}}>
                            <GameRedHealDpsMeter/>
                        </div>
                    </div>
            </TabPanel>
        </Tabs>
    </div>
    }
}