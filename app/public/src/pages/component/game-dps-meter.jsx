import React, { Component } from 'react';
import GameDps from './game-dps';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GameDpsHeal from './game-dps-heal';

class GameDpsMeter extends Component{

    render(){
        const style = {
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
        const imgStyle = {
            width:'60px',
            height:'60px',
            imageRendering:'pixelated'
        };
        if(this.props.blueDpsMeter.size && this.props.redDpsMeter.size && this.props.blueHealDpsMeter.size && this.props.redHealDpsMeter.size && (this.props.blueDpsMeter.size > 0 || this.props.redDpsMeter.size > 0)){
            let redSortedArray = Array.from(this.props.redDpsMeter).sort((a,b)=>{return (b[1].physicalDamage + b[1].specialDamage + b[1].trueDamage) - (a[1].physicalDamage + a[1].specialDamage + a[1].trueDamage)});
            let blueSortedArray = Array.from(this.props.blueDpsMeter).sort((a,b)=>{return (b[1].physicalDamage + b[1].specialDamage + b[1].trueDamage) - (a[1].physicalDamage + a[1].specialDamage + a[1].trueDamage)});

            let redHealSortedArray = Array.from(this.props.redHealDpsMeter).sort((a,b)=>{return (b[1].heal + b[1].shield) - (a[1].heal + a[1].shield)});
            let blueHealSortedArray = Array.from(this.props.blueHealDpsMeter).sort((a,b)=>{return (b[1].heal + b[1].shield) - (a[1].heal + a[1].shield)});

            const blueMaxDamage = blueSortedArray[0][1].physicalDamage + blueSortedArray[0][1].specialDamage + blueSortedArray[0][1].trueDamage;
            const redMaxDamage = redSortedArray[0][1].physicalDamage + redSortedArray[0][1].specialDamage + redSortedArray[0][1].trueDamage;

            const blueHealMaxDamage = blueHealSortedArray[0][1].heal + blueHealSortedArray[0][1].shield;
            const redHealMaxDamage = redHealSortedArray[0][1].heal + redHealSortedArray[0][1].shield;

            return <div className='nes-container hidden-scrollable' style={style}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                <img style={imgStyle} src={'assets/avatar/'+ this.props.blueAvatar + '.png'}></img>
                <h2>Vs</h2>
                <img style={imgStyle} src={'assets/avatar/'+ this.props.redAvatar + '.png'}></img>
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
                            {blueSortedArray.map(p=>{
                                return <GameDps 
                                key={p[0]} 
                                name={p[1].name}
                                physicalDamage={p[1].physicalDamage}
                                specialDamage={p[1].specialDamage}
                                trueDamage={p[1].trueDamage}
                                damage={p[1].physicalDamage + p[1].specialDamage + p[1].trueDamage}
                                maxDamage={blueMaxDamage}
                                cssClass="nes-progress is-success"
                                />
                            })}
                        </div>
                        <div style={{width: '50%'}}>
                            {redSortedArray.map(p=>{
                                return <GameDps 
                                key={p[0]} 
                                name={p[1].name}
                                physicalDamage={p[1].physicalDamage}
                                specialDamage={p[1].specialDamage}
                                trueDamage={p[1].trueDamage}
                                damage={p[1].physicalDamage + p[1].specialDamage + p[1].trueDamage}
                                maxDamage={redMaxDamage}
                                cssClass="nes-progress is-error"
                                />
                            })}
                        </div>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{width: '50%'}}>
                                {blueHealSortedArray.map(p=>{
                                    return <GameDpsHeal 
                                    key={p[0]} 
                                    name={p[1].name}
                                    heal={p[1].heal}
                                    shield={p[1].shield}
                                    total={p[1].heal + p[1].shield}
                                    maxTotal={blueHealMaxDamage}
                                    />
                                })}
                            </div>
                            <div style={{width: '50%'}}>
                                {redHealSortedArray.map(p=>{
                                    return <GameDpsHeal 
                                    key={p[0]} 
                                    name={p[1].name}
                                    heal={p[1].heal}
                                    shield={p[1].shield}
                                    total={p[1].heal + p[1].shield}
                                    maxTotal={redHealMaxDamage}
                                    />
                                })}
                            </div>
                        </div>
                </TabPanel>
            </Tabs>
        </div>
        }
        else{
            return null;
        }
    }
}

export default GameDpsMeter;