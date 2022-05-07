import CSS from 'csstype';
import React, { useState } from 'react';
import { CDN_PORTRAIT_URL } from '../../../../../types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PokemonCarousel from './pokemon-carousel';
import Modal from 'react-bootstrap/esm/Modal';
import { useAppSelector } from '../../../hooks';
import { Pokemon } from '../../../../../models/colyseus-models/pokemon';
import PokemonFactory from '../../../../../models/pokemon-factory';
import { IPokemonConfig } from '../../../../../models/mongo-models/user-metadata';
import tracker from '../../../../dist/client/assets/pokemons/tracker.json';
import { Emotion } from '../../../../../types';
import {Synergy} from '../../../../../types/enum/Synergy';
import {ITracker} from '../../../../../types/ITracker';
import PokemonEmotion from './pokemon-emotion';
import { Pkm } from '../../../../../types/enum/Pokemon';

const buttonStyle: CSS.Properties = {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function PokemonCollection(props: {toggleCollection :()=>void}){
    const metadata = tracker as unknown as { [key: string]: ITracker };
    const [pokemon, setPokemon] =  useState<Pkm>(undefined);
    const pokemonCollection = useAppSelector(state=>state.lobby.pokemonCollection);
    let p: Pokemon;
    let pConfig: IPokemonConfig;
    let pShinyPad = '';
    let pMetadata;
    let emotion: Emotion;
    const availableEmotions: Emotion[] = [];
    let modalElement = null;
    if(pokemon){
        p = PokemonFactory.createPokemonFromName(pokemon);
        pConfig = pokemonCollection.find(c=>c.id == p.index);
        const pathIndex = p.index.split('-');
        if(pathIndex.length == 1){
            pMetadata = metadata[p.index];
        }
        else if(pathIndex.length == 2){
            pMetadata = metadata[pathIndex[0]].subgroups[pathIndex[1]];
        }
        
        if(pConfig && pConfig.selectedEmotion){
            emotion = pConfig.selectedEmotion;
            pShinyPad = pConfig.selectedShiny ? '/0000/0001': ''; 
        }
        else{
            emotion = Emotion.NORMAL;
        }
        Object.keys(pMetadata.portrait_files).forEach(k=>{
            const possibleEmotion = k as Emotion;
            if(Object.values(Emotion).includes(possibleEmotion)){
                availableEmotions.push(possibleEmotion);
            }
        });
        modalElement = <Modal show={pokemon !== undefined} onHide={()=>{setPokemon(undefined)}} dialogClassName="modalClass">
        <Modal.Header>
            <Modal.Title>
                <h3>{pokemon}</h3>
            </Modal.Title>
            <Modal.Title>
                <div style={{display:'flex', marginTop:'5px', marginBottom:'-10px', justifyContent:'center'}}><h3>{pConfig ? pConfig.dust: 0}</h3><img style={{width:'80px',height:'80px',imageRendering:'pixelated'}} 
                src={`${CDN_PORTRAIT_URL}${p.index.replace('-','/')}/Normal.png`}/></div>
            </Modal.Title>
            <Modal.Title>
            <img 
            src={`${CDN_PORTRAIT_URL}${p.index.replace('-','/')}${pShinyPad}/${emotion}.png`}
            style={{filter: pConfig ? 'grayscale(0)':'grayscale(1)', width:'80px', height:'80px', imageRendering:'pixelated'}}/>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <div>
                <p style={{textAlign:'center'}}>Normal Emotions</p>
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>{availableEmotions.map(e=>{
                    return <PokemonEmotion key={e} index={p.index} shiny={false} unlocked={pConfig && pConfig.emotions.includes(e)} path={p.index.replace('-','/')} emotion={e}/>
                })}</div>
                </div>
                <div>
                <p style={{textAlign:'center'}}>Shiny Emotions</p>
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>{availableEmotions.map(e=>{
                    return <PokemonEmotion key={e} index={p.index} shiny={true} unlocked={pConfig && pConfig.shinyEmotions.includes(e)} path={`${p.index.replace('-','/')}/0000/0001`} emotion={e}/>
                })}</div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button style={buttonStyle} className='nes-btn is-error' onClick={()=>{setPokemon(undefined)}}>Close</button>
        </Modal.Footer>
    </Modal>
    }
    return <div>
        <button style={buttonStyle} onClick={()=>{props.toggleCollection()}} className='nes-btn is-primary'>Lobby</button>
        <div style={{margin:'10px', backgroundColor:'rgba(255,255,255,0.7)'}} className='nes-container'>
            <h5>Collection</h5>
            <Tabs>
                <TabList>
                    {(Object.keys(Synergy) as Synergy[]).map((r =>{
                        return <Tab key={'title-' + r}> <img src={"assets/types/" + r + ".png"}></img></Tab>
                    }))}
                </TabList>

                {(Object.keys(Synergy) as Synergy[]).map((r =>{
                    return <TabPanel key={r}>
                        <div style={{display: 'flex', flexWrap:'wrap'}}>
                            <PokemonCarousel type={r} setPokemon={setPokemon} metadata={metadata}/>
                        </div>
                    </TabPanel>
                }))}
            </Tabs>
        </div>
        {modalElement}
    </div>
}