import CSS from 'csstype';
import React from 'react';
import { PKM, SPECIAL_SKILL, TYPE } from '../../../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PokemonFactory from '../../../../../models/pokemon-factory';
import PokemonCarousel from './pokemon-carousel';

const buttonStyle: CSS.Properties = {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function PokemonCollection(props: {toggleCollection :()=>void}){

    return <div>
        <button style={buttonStyle} onClick={()=>{props.toggleCollection()}} className='nes-btn is-primary'>Lobby</button>
        <div style={{margin:'10px', backgroundColor:'rgba(255,255,255,0.7)'}} className='nes-container'>
            <h5>Collection</h5>
            <Tabs>
                <TabList>
                    {Object.keys(TYPE).map((r=>{
                        return <Tab key={'title-' + r}> <img src={"assets/types/" + r + ".png"}></img></Tab>
                    }))}
                </TabList>

                {Object.keys(TYPE).map((r=>{
                    return <TabPanel key={r}>
                        <div style={{display: 'flex', flexWrap:'wrap'}}>
                            <PokemonCarousel type={r}/>
                        </div>
                    </TabPanel>
                }))}
            </Tabs>

        </div>
    </div>
}