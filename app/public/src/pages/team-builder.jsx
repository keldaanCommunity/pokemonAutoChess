import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PKM, ITEMS, PRECOMPUTED_TYPE_POKEMONS, PRECOMPUTED_RARITY_POKEMONS } from '../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PokemonFactory from '../../../models/pokemon-factory';
import GameSynergies from './component/game-synergies';
import SelectedEntity from './component/selected-entity';

const MODE = Object.freeze({
  WRITE:'WRITE',
  ERASE:'ERASE'
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
            mode: MODE.WRITE
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

  changeToWriteMode(){
    this.setState({
      mode:MODE.WRITE
    });
  }

  chaneToEraseMode(){
    this.setState({
      mode:MODE.ERASE
    });
  }

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

  componentDidMount(){
    this.updateSynergies(0);
  }

  render() {
      
    const buttonStyle= {
        top:'10px',
        left:'10px',
        position:'absolute',
        display:'flex'
    }

    const tabStyle = {
        backgroundColor: 'rgba(255, 255, 255, .7)',
        margin:'10px',
        width:'50%',
        position:'absolute',
        top:'8.5%',
        left:'25%'
    }

    const cursorStyle = {
        cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
    }

    const tdStyle = {
        width:'100px',
        height:'100px',
        cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`

    }

    const imgStyle = {
        width:'40px',
        height:'40px',
        imageRendering:'pixelated',
        cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
    }

    const bigImgStyle={
      width:'80px',
      height:'80px',
      imageRendering:'pixelated',
      cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
    }

    const tabPaneStyle = {
        display:'flex',
        justifyContent:'center'
    }

    const pokemonPoolStyle = {
      display:'flex',
      flexWrap:'wrap',
      backgroundColor:'rgb(255,255,255,0.7)',
      margin:'10px'
    }

    const itemPoolStyle={
      display:'flex',
      flexWrap:'wrap',
      backgroundColor:'rgb(255,255,255,0.7)',
      margin:'10px'
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
        <button onClick={this.changeToWriteMode.bind(this)} className='nes-btn is-success'>Write Mode</button>
        <button onClick={this.chaneToEraseMode.bind(this)} className='nes-btn is-warning'>Erase Mode</button>
      </div>
      <GameSynergies synergies={this.state.synergies}/>
        <Tabs className="nes-container" style={tabStyle}
              selectedIndex={this.state.step} onSelect={i => {this.updateSynergies(i);this.setState({step:i});}}>

                  <TabList>
                      {this.state.steps.map((step,i)=>{
                          return <Tab style={cursorStyle} key={i}><p>{i}</p></Tab>
                      })}
                  </TabList>

                  {this.state.steps.map((step,i)=>{
                      return <TabPanel style={tabPaneStyle} key={i}>
                          <table className='nes-table is-bordered is-centered'>
                              <tbody>
                                  {[3,2,1,0].map(y => {
                                      return <tr key={y}>
                                          {[0,1,2,3,4,5,6,7].map(x=>{
                                              let r = <td style={tdStyle} onClick={this.handleEditorClick.bind(this,x,y)} key={x}></td>;
                                              this.state.steps[i].board.forEach(p=>{
                                                  if(p.x == x && p.y == y){
                                                      r = <td style={tdStyle} onClick={this.handleEditorClick.bind(this,x,y)} key={x}> <img style={bigImgStyle} src={'assets/avatar/'+ p.name +'.png'}></img></td>
                                                  }
                                              });
                                              return r;
                                          })}  
                                      </tr>
                                  })}
                              </tbody>
                          </table>    
                      </TabPanel>
                  })}
          </Tabs>
          <SelectedEntity entity={this.state.entity}/>

          <div style={bottomContainerStyle}>
            <div className='nes-container' style={itemPoolStyle}>
              {Object.keys(ITEMS).map(item=>{
                  return <div onClick={this.selectEntity.bind(this, item)} key={item}><img style={imgStyle} src={'assets/items/' + ITEMS[item] + '.png'}/></div>;
              })}
            </div>
            <Tabs className='nes-container' style={pokemonPoolStyle}>
              <TabList>
                {Object.keys(PRECOMPUTED_RARITY_POKEMONS).map((r)=>{
                    return <Tab style={cursorStyle} key={r}><p>{r}</p></Tab>
                })}
              </TabList>

              {Object.keys(PRECOMPUTED_RARITY_POKEMONS).map((key)=>{
                return <TabPanel key={key} style={{display:'flex', flexWrap:'wrap'}}>
                      {PRECOMPUTED_RARITY_POKEMONS[key].map((pkm)=>{
                        return <div onClick={this.selectEntity.bind(this, pkm)} key={pkm}><img style={imgStyle} src={'assets/avatar/' + pkm + '.png'}/></div>;
                      })}
                  </TabPanel>
              })}
            </Tabs>
          </div>
    </div>
    ; 
  }
}
export default TeamBuilder;
