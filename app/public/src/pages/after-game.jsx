import React, { Component } from 'react';
import firebase from 'firebase/app';
import AfterMenu  from './component/after-menu';

class AfterGame extends Component {

    constructor(props){
        super(props);
        this.room = window._room;
        this.uid = firebase.auth().currentUser.uid;
        this.id = this.props.match.params.id;

        this.state = {
            players:{}
        };

        this.room.state.players.onAdd = (player) => {

            this.setState({players: this.room.state.players});
        };

        this.room.state.players.onRemove = (player, key) => {
            this.setState({players: this.room.state.players});
        };
    }

  render() {
    return <div className="nes-container with-title is-centered" style={{
    backgroundColor: 'rgba(255, 255, 255, .6)',
        margin:'10px',
        display: 'flex',
        flexFlow: 'column'
        }}>
        <p className='title'>Room id: {this.id}</p>
        <AfterMenu
            players = {this.state.players}
        />
    </div>
    }
}
export default AfterGame;
