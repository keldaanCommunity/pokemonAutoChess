import React, { Component } from 'react';
import { ITEMS, PKM } from '../../../../models/enum';
import PokemonDetail from './pokemon-detail';

class SelectedEntity extends Component {
  render() {        
        if(Object.keys(ITEMS).includes(this.props.entity)){
            return <div className='nes-container' style={{display: 'flex'}}>
            <h3>{this.props.ITEM}</h3>
            <img src={'assets/items/' + this.props.entity + '.png'}/>
        </div>
        }
        else if(Object.values(PKM).includes(this.props.entity)){
            return <PokemonDetail pokemon={this.props.entity}/>;
        }
        else{
            return null;
        }
  }
}
export default SelectedEntity;
