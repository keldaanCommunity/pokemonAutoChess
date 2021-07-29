import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import AfterMenu  from './component/after-menu';
import { Client } from 'colyseus.js';
import { FIREBASE_CONFIG } from './utils/utils';

class AfterGame extends Component {

    constructor(props){
        super(props);
        this.client = new Client(window.endpoint);

        this.state = {
            players:{},
            isSignedIn: false
        };

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        } 

        firebase.auth().onAuthStateChanged(user => {
            this.setState({isSignedIn: !!user});
            this.uid = firebase.auth().currentUser.uid;
            
            this.id = localStorage.getItem('lastRoomId');
            this.sessionId = localStorage.getItem('lastSessionId');

            try {
                firebase.auth().currentUser.getIdToken().then(token =>{
                    this.client.reconnect(this.id, this.sessionId)
                    .then(room=>{
                        this.initializeRoom(room);
                    })
                    .catch((err)=>{
                        this.client.joinById(this.id, {idToken: token}).then(room =>{
                            this.initializeRoom(room);
                        })
                        .catch(err=>{
                            this.setState({
                                toLobby: true
                            });
                        });
                    });
                });
              
              } catch (e) {
                console.error("join error", e);
            }
        });
    }

    initializeRoom(room){
        this.room = room;
        this.room.state.players.onAdd = (player) => {
            this.setState({players: this.room.state.players});
        };

        this.room.state.players.onRemove = (player, key) => {
            this.setState({players: this.room.state.players});
        };
    }

    leaveRoom(){
        this.room.leave();
    }

  render() {

    const buttonStyle= {
        marginLeft:'10px',
        marginTop:'10px'
    }

    if(this.state.toLobby){
        return <Redirect to='/lobby'/>;
    }
    else{
        return <div className='App'>
        <Link to='/lobby'>
            <button className='nes-btn is-primary' style={buttonStyle} onClick={this.leaveRoom.bind(this)}>Lobby</button>
        </Link>

        <div className="nes-container with-title is-centered" style={{
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
    </div>
    }
  }
}
export default AfterGame;
