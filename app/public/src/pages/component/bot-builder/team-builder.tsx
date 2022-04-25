import React, { useState } from 'react';
import { Item } from '../../../../../types/enum/Item';
import {Pkm} from '../../../../../types/enum/Pokemon';
import PokemonFactory from '../../../../../models/pokemon-factory';
import SelectedEntity from './selected-entity';
import ModalMenu from './modal-menu';
import ItemPicker from './item-picker';
import PokemonPicker from './pokemon-picker';
import TeamEditor from './team-editor';
import ReactTooltip from 'react-tooltip';
import { IBot, IStep } from '../../../../../models/mongo-models/bot-v2';
import CSS from 'csstype';
import produce from 'immer';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import {createBot, requestBotData} from "../../../stores/NetworkStore"
import { setBotCreatorSynergies } from '../../../stores/LobbyStore';
import BuilderSynergies from './builder-synergies';
import { Synergy } from '../../../../../types/enum/Synergy';
import { Emotion, ModalMode, ReadWriteMode } from '../../../../../types';
import {PokemonIndex} from '../../../../../types/enum/Pokemon';

const buttonsStyle: CSS.Properties = {
  top:'10px',
  left:'10px',
  position:'absolute',
  display:'flex'
}

const buttonStyle: CSS.Properties = {
marginLeft:'10px',
marginTop:'10px',
marginRight:'10px'
}

const bottomContainerStyle: CSS.Properties = {
display:'flex',
width:'87%',
position:'absolute',
bottom:'0px',
right:'0px'
}

export default function TeamBuilder(props: {toggleBuilder: ()=>void}) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<number>(0);
  const [copyStep, setCopyStep] = useState<IStep>(undefined);
  const [bot, setBot] = useState<IBot>({
    steps: [
      {
        'roundsRequired': 2,
        'board': [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
        ]
      }
    ],
    avatar:'ditto',
    author:'',
    elo: 1200,
    name: 'ditto'
  });
  const [entity, setEntity] = useState<Item | Pkm>(Pkm.DEFAULT);
  const [mode, setMode] = useState<ReadWriteMode>(ReadWriteMode.WRITE);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.IMPORT)
  const [modalBoolean, setModalBoolean] = useState<boolean>(false);

  const pastebinUrl: string = useAppSelector(state=>state.lobby.pastebinUrl);
  const botData: IBot = useAppSelector(state=>state.lobby.botData);

  function updateSynergies(i: number) {
    const newSynergies = new Map<Synergy,number>();
    (Object.keys(Synergy) as Synergy[]).forEach(s=>{
      newSynergies.set(s, 0);
    });
    const pokemonNames = [];

    bot.steps[i].board.forEach(pkm=>{
      const family = PokemonFactory.getPokemonFamily(pkm.name);
      const pkmTypes = PokemonFactory.createPokemonFromName(pkm.name).types;
      if (!pokemonNames.includes(family)) {
        pokemonNames.push(family);
        pkmTypes.forEach( (type) => {
          newSynergies.set(type, 1);
        });
      }
    });
    dispatch(setBotCreatorSynergies(newSynergies));
  }

  function write(x: number, y: number) {
    if(Object.values(Pkm).includes(entity as Pkm)){
        writePokemon(x, y);
      }
    if(Object.keys(Item).includes(entity)){
      writeItem(x, y);
    }
  }

  function writeItem(x: number ,y: number) {
    const potential = bot.steps[step].board.findIndex(p=>p.x==x && p.y==y);
    const e = entity as Item;
    if(potential >= 0) {
      if(bot.steps[step].board[potential].items.length <3){
        setBot(produce(draft=>{draft.steps[step].board[potential].items.push(e)}));
      }
      else{
        setBot(produce(draft=>{draft.steps[step].board[potential].items = [e]}));
      }
    }
  }

  function writePokemon(x: number, y: number) {
    const potential = bot.steps[step].board.findIndex(p=>p.x == x && p.y == y);
    const e = entity as Pkm;
    if(potential >= 0) {
      setBot(produce(draft=>{draft.steps[step].board[potential].name = e}));
    }
    else {
      setBot(produce(draft=>{draft.steps[step].board.push({name: e, x: x, y: y, items: []})}));
    }
    updateSynergies(step);
  }

  function erase(x: number, y: number) {
    const potential = bot.steps[step].board.findIndex(p=>p.x == x && p.y == y);
    if(potential >= 0) {
      setBot(produce(draft=>{draft.steps[step].board.splice(potential, 1)}));
    }
  }

  function importBot(text: string) {
    try{
      const b: IBot = JSON.parse(text);
      setBot(b);
      updateSynergies(step);
      setModalBoolean(false);
    }
    catch(e){
      alert(e);
    }
  }

  function create() {
    dispatch(createBot(bot));
  }

  return <div>
  <div style={buttonsStyle}>
    <button style={buttonStyle} onClick={()=>{props.toggleBuilder()}} className='nes-btn is-primary'>Lobby</button>
    <button 
      style={buttonStyle}
      onClick={()=>{setModalMode(ModalMode.IMPORT); setModalBoolean(true)}}
      className='nes-btn is-warning'
    >
      Import/Load
    </button>
    <button style={buttonStyle}
     onClick={()=>{setModalMode(ModalMode.EXPORT); setModalBoolean(true)}}
     className='nes-btn is-warning'
      >
      Export
    </button>
    <button 
    style={buttonStyle} 
    onClick={()=>setMode(mode == ReadWriteMode.WRITE ? ReadWriteMode.ERASE: ReadWriteMode.WRITE)} 
    className='nes-btn'
    data-tip
    data-for={'mode'}
    >
      {mode} Mode
      <ReactTooltip id={'mode'} 
        className='customeTheme' 
        textColor='#000000' 
        backgroundColor='rgba(255,255,255,1)' 
        effect='solid'
        place='bottom'>
        <p>Click to change the current edition mode.</p><p> The WRITE mode allow you to place pokemons and items on the board.</p><p> The ERASE mode allow you to erase pokemons from the board.</p>
      </ReactTooltip>
    </button>
    <button 
    style={buttonStyle}
    onClick={()=>{setCopyStep(JSON.parse(JSON.stringify(bot.steps[step])))}} 
    className='nes-btn'
    data-tip
    data-for={'copy'}
    >
      <ReactTooltip id={'copy'} 
        className='customeTheme' 
        textColor='#000000' 
        backgroundColor='rgba(255,255,255,1)' 
        effect='solid'
        place='bottom'>
        <p>Click to copy the current step.</p><p> You can then paste this step later elsewhere.</p>
      </ReactTooltip>
    Copy Step</button>
    <button
     style={buttonStyle}
     onClick={()=>{
       if(copyStep){
        setBot(produce(draft=>{draft.steps[step] = copyStep}));
       }
     }} 
     className='nes-btn'
     data-tip
     data-for={'paste'}
     >
      <ReactTooltip id={'paste'} 
        className='customeTheme' 
        textColor='#000000' 
        backgroundColor='rgba(255,255,255,1)' 
        effect='solid'
        place='bottom'>
        <p>Click to paste the copied step on your current step.</p><p> It will replace the board of the current step with the one you copied.</p>
      </ReactTooltip>
       Paste Step</button>
  </div>
  <BuilderSynergies/>
  <TeamEditor 
    step={step}
    steps={bot.steps}
    avatar={bot.avatar}
    author={bot.author}
    name={bot.name}
    handleTabClick={(i: number)=>{updateSynergies(i); setStep(i)}}
    handleEditorClick={(x,y)=>{mode == ReadWriteMode.WRITE ? write(x,y): erase(x,y)}}
    handleAuthorChange={(e)=>{e.preventDefault; setBot(produce(draft=>{draft.author = e.target.value}))}}
    handleAvatarChange={(e)=>setBot(produce(draft=>{
      draft.name = e.target.value;
      draft.avatar = `${PokemonIndex[e.target.value]}/${Emotion.NORMAL}`;
    }))}
    handleRoundsRequiredChange={(e)=>setBot(produce(draft=>{draft.steps[step].roundsRequired = e.target.value}))}
    />
  <SelectedEntity entity={entity}/>

  <div style={bottomContainerStyle}>
    <ItemPicker selectEntity={setEntity}/>
    <PokemonPicker selectEntity={setEntity}/>
  </div>

  <ModalMenu 
    modalBoolean={modalBoolean}
    showModal={(mode: ModalMode)=>{setModalMode(mode); setModalBoolean(true)}}
    bot={bot} 
    hideModal={()=>{setModalBoolean(false)}}
    modalMode={modalMode}
    importBot={importBot}
    pasteBinUrl={pastebinUrl}
    createBot={create}
    botData={botData}
  />
</div>
}