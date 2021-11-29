import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PKM, ITEMS } from '../../../models/enum';
import PokemonFactory from '../../../models/pokemon-factory';
import GameSynergies from './component/game-synergies';
import SelectedEntity from './component/selected-entity';
import ModalMenu from './component/modal-menu';
import ItemPicker from './component/item-picker';
import PokemonPicker from './component/pokemon-picker';
import TeamEditor from './component/team-editor';
//import "bootstrap/dist/css/bootstrap.min.css";

const MODE = Object.freeze({
  WRITE:'WRITE',
  ERASE:'ERASE'
});

const MODAL_MODE = Object.freeze({
  EXPORT:'EXPORT',
  IMPORT:'IMPORT'
});

class TeamBuilder extends Component {

    constructor(props){
        super(props);
        this.state = {
            step: 0,
            steps: [
                {
                  'roundsRequired': 0,
                  'board': [
                    {
                      'name': PKM.HOPPIP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.HOPPIP,
                      'x': 4,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.HOPPIP,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.CHIKORITA,
                      'x': 3,
                      'y': 1
                    },
                    {
                      'name': PKM.CATERPIE,
                      'x': 4,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 5,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MUDKIP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.PIPLUP,
                      'x': 5,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MUDKIP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.TOTODILE,
                      'x': 3,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.TOTODILE,
                      'x': 3,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWAG,
                      'x': 5,
                      'y': 1
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWAG,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 4,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    }
                  ]
                },
                {
                  'roundsRequired': 4,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 5,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SPHEAL,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 5,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LUDICOLO,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLITOED,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LUDICOLO,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                }
              ],
            synergies:{
              NORMAL: 0,
              GRASS: 0,
              NORMAL: 0,
              GRASS: 0,
              FIRE: 0,
              WATER: 0,
              ELECTRIC: 0,
              FIGHTING: 0,
              PSYCHIC: 0,
              DARK: 0,
              METAL: 0,
              GROUND: 0,
              POISON: 0,
              DRAGON: 0,
              FIELD: 0,
              MONSTER: 0,
              HUMAN: 0,
              AQUATIC: 0,
              BUG: 0,
              FLYING: 0,
              FLORA: 0,
              MINERAL: 0,
              AMORPH: 0,
              FAIRY: 0,
              ICE: 0
            },
            entity:'',
            mode: MODE.WRITE,
            modalMode:MODAL_MODE,
            modalBoolean: false
        }
    }

  updateSynergies(i){
    let newSynergies = {
      NORMAL: 0,
      GRASS: 0,
      NORMAL: 0,
      GRASS: 0,
      FIRE: 0,
      WATER: 0,
      ELECTRIC: 0,
      FIGHTING: 0,
      PSYCHIC: 0,
      DARK: 0,
      METAL: 0,
      GROUND: 0,
      POISON: 0,
      DRAGON: 0,
      FIELD: 0,
      MONSTER: 0,
      HUMAN: 0,
      AQUATIC: 0,
      BUG: 0,
      FLYING: 0,
      FLORA: 0,
      MINERAL: 0,
      AMORPH: 0,
      FAIRY: 0,
      ICE: 0
    };
    let pokemonNames = [];

    this.state.steps[i].board.forEach(pkm=>{
      const family = PokemonFactory.getPokemonFamily(pkm.name);
      const pkmTypes = PokemonFactory.createPokemonFromName(pkm.name).types;
      if (!pokemonNames.includes(family)) {
        pokemonNames.push(family);
        pkmTypes.forEach( (type) => {
          newSynergies[type] += 1;
        });
      }
    });

    this.setState({
      synergies: newSynergies
    });
  }

  selectEntity(e){
    this.setState({
      entity:e  
    });
  }

  toggleMode(){
    this.setState(prevState=>{
      return{
        mode:prevState.mode == MODE.WRITE ? MODE.ERASE: MODE.WRITE
      };
    });
  }

  showModal(mode){
    this.setState({
      modalMode: mode,
      modalBoolean: true
    });
  };


  hideModal(){
    this.setState({
      modalBoolean: false
    });
  };

  handleEditorClick(x,y){
    this.state.mode == MODE.WRITE ? this.write(x,y): this.erase(x,y);
  }

  write(x,y){
    if(Object.keys(ITEMS).includes(this.state.entity)){
      this.writeItem(x,y);
    }
    else if(Object.values(PKM).includes(this.state.entity)){
      this.writePokemon(x,y);
    }
  }

  writeItem(x,y){
    this.state.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x==x && pkm.y==y){
        let copySteps = this.state.steps.slice();
        if(!copySteps[this.state.step].board[i].items){
          copySteps[this.state.step].board[i].items = [];
          copySteps[this.state.step].board[i].items.push(this.state.entity);
        }
        else if(copySteps[this.state.step].board[i].items.length < 3){
          copySteps[this.state.step].board[i].items.push(this.state.entity);
        }
        else if(copySteps[this.state.step].board[i].items.length >= 3){
          copySteps[this.state.step].board[i].items = [this.state.entity];
        }
        this.setState({
          steps: copySteps
        });
      }
    });
  }

  writePokemon(x,y){
    let found = false;
    this.state.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x==x && pkm.y==y){
        found = true;
        let copySteps = this.state.steps.slice();
        copySteps[this.state.step].board[i].name = this.state.entity;
        this.setState({
          steps: copySteps
        });
      }
    });
    if(!found){
      let copySteps = this.state.steps.slice();
      copySteps[this.state.step].board.push({
          name: this.state.entity,
          x: x,
          y: y
      });
      this.setState({
        steps: copySteps
      });
      this.updateSynergies(this.state.step);
    }
  }

  erase(x,y){
    this.state.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x == x && pkm.y == y){
        let copySteps = this.state.steps.slice();
        copySteps[this.state.step].board = copySteps[this.state.step].board.filter(pkm=>{
          if(pkm.x == x && pkm.y == y){
          }
          else{
            return pkm;
          }
        })
        this.setState({
          steps:copySteps
        });
        this.updateSynergies(this.state.step);
      }
    });
  }

  handleTabClick(i){
    this.updateSynergies(i);
    this.setState({step:i});
  }

  componentDidMount(){
    this.updateSynergies(0);
  }

  import(text){
    console.log(text);
    try{
      let json = JSON.parse(text);
      if(json.validate){

      }
      this.setState({
        steps:json
      });
      this.updateSynergies(this.state.step);
    }
    catch(error){
      console.log(error);
    }
  }

  validate(json){
    return true;
  }

  render() {
      
    const buttonStyle= {
        top:'10px',
        left:'10px',
        position:'absolute',
        display:'flex'
    }

    const bottomContainerStyle={
      display:'flex',
      width:'87%',
      position:'absolute',
      bottom:'0px',
      right:'0px'
    }

    return <div className="App">
      <div style={buttonStyle}>
        <Link to='/auth'>
          <button className='nes-btn is-primary'>Lobby</button>
        </Link>
        <button onClick={this.toggleMode.bind(this, MODAL_MODE.IMPORT)} className='nes-btn'>{this.state.mode} Mode</button>
        <button onClick={this.showModal.bind(this, MODAL_MODE.IMPORT)} className='nes-btn is-warning'>Import</button>
        <button onClick={this.showModal.bind(this, MODAL_MODE.EXPORT)} className='nes-btn is-warning'>Export</button>
      </div>
      <GameSynergies synergies={this.state.synergies}/>
          <TeamEditor 
            step={this.state.step}
            steps={this.state.steps}
            handleTabClick={this.handleTabClick.bind(this)}
            handleEditorClick={this.handleEditorClick.bind(this)}
           />
          <SelectedEntity entity={this.state.entity}/>

          <div style={bottomContainerStyle}>
            <ItemPicker selectEntity={this.selectEntity.bind(this)}/>
            <PokemonPicker selectEntity={this.selectEntity.bind(this)}/>
          </div>

          <ModalMenu 
            modalBoolean={this.state.modalBoolean}
            showModal={this.showModal.bind(this)}
            steps={this.state.steps} 
            hideModal={this.hideModal.bind(this)}
            modalMode={this.state.modalMode}
            import={this.import.bind(this)}
          />
    </div>
    ; 
  }
}
export default TeamBuilder;
