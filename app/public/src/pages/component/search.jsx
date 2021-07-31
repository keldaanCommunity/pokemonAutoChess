import React, { Component } from 'react';
import History from './history';
import { XP_TABLE } from '../../../../models/enum';

class Search extends Component{

    constructor(){
        super();
        this.state = {
            inputValue: ''
        };
    }

    handleInputValueChange(event){
        this.setState({
            inputValue:event.target.value
        });
    }

    handleSearchName(){
        this.props.searchName(this.state.inputValue);
    }

    render(){
        if(this.props.user.name){
            return <div>
            <div className="nes-field is-inline">
                <input type="text" id="inline_field" className="nes-input" placeholder="Player Name..." onChange={this.handleInputValueChange.bind(this)}/>
                <button className="nes-btn is-primary" onClick={this.handleSearchName.bind(this)}>Search</button>
            </div>

            <div style={{display:'flex', alignItems: 'center', marginTop: '30px'}}>
                <img src={"/assets/avatar/" + this.props.user.avatar + ".png"}/>
                <h5>{this.props.user.name} ({this.props.user.elo})</h5>
            </div>
            <p>Level {this.props.user.level} ({this.props.user.exp} / {XP_TABLE[this.props.user.level]})</p>
            <p>Wins: {this.props.user.wins}</p>
            <p>Tipee contributor: {this.props.user.donor ? 'Yes': 'No'}</p>
            <h5>Game History</h5>
            <History history={this.props.user.history}/>
        </div>
        }
        else{
            return <div>
                <div className="nes-field is-inline">
                    <input type="text" id="inline_field" className="nes-input" placeholder="Player Name..." onChange={this.handleInputValueChange.bind(this)}/>
                    <button className="nes-btn is-primary" onClick={this.handleSearchName.bind(this)}>Search</button>
                </div>

                <h5>No player found</h5>
            </div>
        }
    }
}

export default Search;