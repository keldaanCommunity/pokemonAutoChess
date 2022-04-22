import React, { useState } from 'react';
import { XP_TABLE, CDN_PORTRAIT_URL } from '../../../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Elo from '../elo';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { changeAvatar, changeName } from '../../../stores/NetworkStore';

const cursorStyle = {
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
}

export default function Profile() {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const user = useAppSelector(state=>state.lobby.user);
    const pokemonCollection = useAppSelector(state=>state.lobby.pokemonCollection);

    return(
        <div>
        <div style={{display:'flex', alignItems: 'center'}}>
            <img src={CDN_PORTRAIT_URL + user.avatar + ".png"}/>
            <h5>{user.name}</h5>
        </div>
        <p>Level {user.level} ({user.exp} / 1000)</p>
        <p>Langage: {user.langage}</p>
        <div style={{display:'flex', alignItems:'center'}}>Elo: <Elo elo={user.elo}/></div>
        <p>Wins: {user.wins}</p>
        <p>Tipee contributor: {user.donor ? 'Yes': 'No'}</p>

        <Tabs>
            <TabList>
            <Tab>Name</Tab>
            <Tab>Avatar</Tab>
            </TabList>

            <TabPanel>
                <div>
                    <h5>Change Name</h5>
                    <div className="nes-field is-inline">
                        <input type="text" id="inline_field" className="nes-input" placeholder={user.name} onChange={e=>{setInputValue(e.target.value)}}/>
                        <button className="nes-btn is-primary" onClick={()=>dispatch(changeName(inputValue))}>Change</button>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <h5>Change Avatar</h5>
                    <div style={{display: 'flex', flexWrap:'wrap'}}>
                        {pokemonCollection.map(
                            (pokemonConfig)=>{
                                return pokemonConfig.emotions.map(
                                    (emotion) => {
                                        return <img key={`normal-${pokemonConfig.id}${emotion}`} style={cursorStyle} onClick={()=>{dispatch(changeAvatar({index: pokemonConfig.id, emotion: emotion, shiny: false}))}} src={`${CDN_PORTRAIT_URL}${pokemonConfig.id.replace('-','/')}/${emotion}.png`}></img>
                                    }
                                )
                            }
                        )}
                        {pokemonCollection.map(
                            (pokemonConfig)=>{
                                return pokemonConfig.shinyEmotions.map(
                                    (emotion) => {
                                        return <img key={`shiny-${pokemonConfig.id}${emotion}`} style={cursorStyle} onClick={()=>{dispatch(changeAvatar({index: pokemonConfig.id, emotion: emotion, shiny: true}))}} src={`${CDN_PORTRAIT_URL}${pokemonConfig.id.replace('-','/')}/0000/0001/${emotion}.png`}></img>
                                    }
                                )
                            }
                        )}
                    
                    </div>
                </div>
            </TabPanel>
        </Tabs>
  </div>
    )
}