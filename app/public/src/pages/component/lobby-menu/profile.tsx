import React, { useState } from 'react'
import { Title, TitleDescription, TitleName } from '../../../../../types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Elo from '../elo'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { changeAvatar, changeName, setTitle } from '../../../stores/NetworkStore'
import { RoleBadge } from '../RoleBadge'
import { getAvatarSrc, getPortraitSrc } from '../../../utils'

const cursorStyle = {
    cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer'
}

const tabStyle = {
    cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    outline:'none',
    color:'white',
    fontSize:'1.5vw'
}

export default function Profile() {
    const dispatch = useAppDispatch()
    const [inputValue, setInputValue] = useState<string>('')
    const user = useAppSelector(state=>state.lobby.user)
    const pokemonCollection = useAppSelector(state=>state.lobby.pokemonCollection)

    if(user){
        return(
            <div>
                <div className='playerBox' style={{marginBottom:'20px'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems: 'center', gap:'5px'}}>
                            <img src={getAvatarSrc(user.avatar)}/>
                            <p style={{color: '#ffc107'}}>{TitleName[user.title]}</p>
                            <RoleBadge role={user.role}/>
                            <p>{user.name}</p>
                        </div>
                        <p>Level {user.level} ({user.exp} / 1000)</p>
                    </div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center'}}><Elo elo={user.elo}/></div>
                        <p>Wins: {user.wins}</p>
                    </div>
                </div>
    
            <Tabs>
                <TabList>
                <Tab style={tabStyle}>Name</Tab>
                <Tab style={tabStyle}>Avatar</Tab>
                <Tab style={tabStyle}>Title</Tab>
                </TabList>
    
                <TabPanel>
                    <div>
                        <h3>Change Name</h3>
                        <div className="nes-field is-inline">
                            <input type="text" id="inline_field" className="my-input" placeholder={user.name} onChange={e=>{setInputValue(e.target.value)}}/>
                            <button className="bubbly-primary" onClick={()=>dispatch(changeName(inputValue))}>Change</button>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        <h3>Change Avatar</h3>
                        <div style={{display: 'flex', flexWrap:'wrap'}}>
                            {pokemonCollection.map(
                                (pokemonConfig)=>{
                                    return pokemonConfig.emotions.map(
                                        (emotion) => {
                                            return <img key={`normal-${pokemonConfig.id}${emotion}`} style={cursorStyle} onClick={()=>{dispatch(changeAvatar({index: pokemonConfig.id, emotion: emotion, shiny: false}))}} src={getPortraitSrc(pokemonConfig.id, false, emotion)}></img>
                                        }
                                    )
                                }
                            )}
                            {pokemonCollection.map(
                                (pokemonConfig)=>{
                                    return pokemonConfig.shinyEmotions.map(
                                        (emotion) => {
                                            return <img key={`shiny-${pokemonConfig.id}${emotion}`} style={cursorStyle} onClick={()=>{dispatch(changeAvatar({index: pokemonConfig.id, emotion: emotion, shiny: true}))}} src={getPortraitSrc(pokemonConfig.id, true, emotion)}></img>
                                        }
                                    )
                                }
                            )}
                        
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='playerBox'>
                        <div style={{display:'flex', flexWrap:'wrap'}}>
                            {Object.keys(Title).map(k=><div key={k}><h5 
                            onClick={()=>{
                                if(user.titles.includes(k as Title)){
                                    dispatch(setTitle(k))
                                }
                            }}
                            style={{color:user.titles.includes(k as Title) ? '#28a745': '#db5e6a'}} className='my-cursor'>{TitleName[k]}</h5><p>{TitleDescription[k]}</p></div>)}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
      </div>)
    }
    else{
        return null
    }
}