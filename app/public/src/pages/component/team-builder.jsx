import React, { Component } from 'react';
import { PKM, ITEMS } from '../../../../models/enum';
import PokemonFactory from '../../../../models/pokemon-factory';
import GameSynergies from './game-synergies';
import SelectedEntity from './selected-entity';
import ModalMenu from './modal-menu';
import ItemPicker from './item-picker';
import PokemonPicker from './pokemon-picker';
import TeamEditor from './team-editor';
import ReactTooltip from 'react-tooltip';
//import "bootstrap/dist/css/bootstrap.min.css";

const MODE = Object.freeze({
  WRITE:'WRITE',
  ERASE:'ERASE'
});

const MODAL_MODE = Object.freeze({
  EXPORT:'EXPORT',
  IMPORT:'IMPORT'
});

const buttonsStyle= {
  top:'10px',
  left:'10px',
  position:'absolute',
  display:'flex'
}

const buttonStyle = {
marginLeft:'10px',
marginTop:'10px',
marginRight:'10px'
}

const bottomContainerStyle = {
display:'flex',
width:'87%',
position:'absolute',
bottom:'0px',
right:'0px'
}

class TeamBuilder extends Component {

    constructor(props){
        super(props);
        this.state = {
            step: 0,
            copyBoard: [],
            copyRoundsRequired:0,
            bot:{
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
              id:'',
              avatar:'ditto',
              author:''
            },
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

    this.state.bot.steps[i].board.forEach(pkm=>{
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
    this.state.bot.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x==x && pkm.y==y){
        let copySteps = this.state.bot.steps.slice();
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
        this.setState(prevState=>{
          return {
          bot:{
            ...prevState.bot,
            steps:copySteps
          }
        }
      });
      }
    });
  }

  writePokemon(x,y){
    let found = false;
    this.state.bot.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x==x && pkm.y==y){
        found = true;
        let copySteps = this.state.bot.steps.slice();
        copySteps[this.state.step].board[i].name = this.state.entity;
        this.setState(prevState=>{
          return{
            bot:{
              ...prevState.bot,
              steps:copySteps
            }
          }
        });
      }
    });
    if(!found){
      let copySteps = this.state.bot.steps.slice();
      copySteps[this.state.step].board.push({
          name: this.state.entity,
          x: x,
          y: y
      });
      this.setState(prevState=>{
        return{
          bot:{
            ...prevState.bot,
            steps:copySteps
          }
        }
      });
      this.updateSynergies(this.state.step);
    }
  }

  erase(x,y){
    this.state.bot.steps[this.state.step].board.forEach((pkm,i)=>{
      if(pkm.x == x && pkm.y == y){
        let copySteps = this.state.bot.steps.slice();
        copySteps[this.state.step].board = copySteps[this.state.step].board.filter(pkm=>{
          if(pkm.x == x && pkm.y == y){
          }
          else{
            return pkm;
          }
        })
        this.setState(prevState=>{
          return{
            bot:{
              ...prevState.bot,
              steps:copySteps
            }
          }
        });
        this.updateSynergies(this.state.step);
      }
    });
  }

  handleTabClick(i){
    this.updateSynergies(i);
    this.setState({step:i});
  }

  handleAuthorChange(e){
    this.setState(prevState=>{
      return {
        bot:{
          ...prevState.bot,
          author: e.target.value
        }
    }})
  }

  handleRoundsRequiredChange(e){
    let copySteps = this.state.bot.steps.slice();
    copySteps[this.state.step].roundsRequired = parseInt(e.target.value);
    this.setState(prevState=>{
      return{
        bot:{
          ...prevState.bot,
          steps:copySteps
        }
      }
    });
  }

  handleIdChange(e){
    this.setState(prevState=>{
      return {
        bot:{
          ...prevState.bot,
          id: e.target.value
        }
    }})
  }

  handleAvatarChange(e){
    this.setState(prevState=>{
      return {
        bot:{
          ...prevState.bot,
          avatar: e.target.value
        }
    }})
  }

  componentDidMount(){
    this.updateSynergies(0);
  }

  import(text){
    //console.log(text);
    try{
      let json = JSON.parse(text);
      if(json.validate){

      }
      this.setState({
        bot:json,
        step:0
      });
      this.updateSynergies(this.state.step);
      this.hideModal();
    }
    catch(error){
      alert(error);
    }
  }

  copy(step){
    let copyBoard=[...this.state.bot.steps[step].board];
    let copyRoundsRequired = this.state.bot.steps[step].roundsRequired;

    this.setState({
      copyBoard: copyBoard,
      copyRoundsRequired:copyRoundsRequired
    });
  }

  paste(){
    let copySteps = [...this.state.bot.steps];
    copySteps[this.state.step].board = JSON.parse(JSON.stringify(this.state.copyBoard));
    copySteps[this.state.step].roundsRequired = this.state.copyRoundsRequired;
    this.setState(prevState=>{
      return{
        bot:{
          ...prevState.bot,
          steps:copySteps
        }
      }
    });
    this.updateSynergies(this.state.step);
  }

  validate(json){
    return true;
  }

  render() {
    return <div className="App">
      <div style={buttonsStyle}>
        <button style={buttonStyle} onClick={this.props.toggleBuilder} className='nes-btn is-primary'>Lobby</button>
        <button 
          style={buttonStyle}
          onClick={this.showModal.bind(this, MODAL_MODE.IMPORT)}
          className='nes-btn is-warning'
        >
          Import/Load
        </button>
        <button style={buttonStyle}
         onClick={this.showModal.bind(this, MODAL_MODE.EXPORT)}
         className='nes-btn is-warning'
          >
          Export
        </button>
        <button 
        style={buttonStyle} 
        onClick={this.toggleMode.bind(this, MODAL_MODE.IMPORT)} 
        className='nes-btn'
        data-tip
        data-for={'mode'}
        >
          {this.state.mode} Mode
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
        onClick={this.copy.bind(this, this.state.step)} 
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
         onClick={this.paste.bind(this)} 
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
      <GameSynergies synergies={this.state.synergies}/>
          <TeamEditor 
            step={this.state.step}
            steps={this.state.bot.steps}
            avatar={this.state.bot.avatar}
            id={this.state.bot.id}
            author={this.state.bot.author}
            handleTabClick={this.handleTabClick.bind(this)}
            handleEditorClick={this.handleEditorClick.bind(this)}
            handleAuthorChange={this.handleAuthorChange.bind(this)}
            handleAvatarChange={this.handleAvatarChange.bind(this)}
            handleIdChange={this.handleIdChange.bind(this)}
            handleRoundsRequiredChange={this.handleRoundsRequiredChange.bind(this)}
           />
          <SelectedEntity entity={this.state.entity}/>

          <div style={bottomContainerStyle}>
            <ItemPicker selectEntity={this.selectEntity.bind(this)}/>
            <PokemonPicker selectEntity={this.selectEntity.bind(this)}/>
          </div>

          <ModalMenu 
            modalBoolean={this.state.modalBoolean}
            showModal={this.showModal.bind(this)}
            bot={this.state.bot} 
            hideModal={this.hideModal.bind(this)}
            modalMode={this.state.modalMode}
            import={this.import.bind(this)}
            createBot={this.props.createBot}
            pasteBinUrl={this.props.pasteBinUrl}
          />
    </div>
    ; 
  }
}
export default TeamBuilder;
