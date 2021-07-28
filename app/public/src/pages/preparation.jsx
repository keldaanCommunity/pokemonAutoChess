import React, { Component } from 'react';
import Chat from './component/chat';
import firebase from 'firebase/app';
import PreparationMenu from './component/preparation-menu';
import { Redirect, Link } from 'react-router-dom';
import { Client } from 'colyseus.js';
import { FIREBASE_CONFIG } from './utils/utils';

class Preparation extends Component {

    constructor(props){
        super(props);
        this.client = new Client(window.endpoint);

        this.state = {
            messages: [],
            users: {},
            user:{},
            currentText: '',
            gameId: '',
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

            firebase.auth().currentUser.getIdToken().then(token =>{
                this.client.reconnect(this.id, this.sessionId)
                .then(room=>{
                    this.room = room;
                    this.room.onMessage('messages', (message) => {
                        this.setState({
                            messages: this.state.messages.concat(message)
                        });
                    });
        
                    this.room.state.users.onAdd = (u) => {
                        if(u.id == this.uid){
                            this.setState({user: u});
                        }
                        u.onChange = changes =>{
                            this.setState({users: this.room.state.users});
                        }
                        this.setState({users: this.room.state.users});
                    };
        
                    this.room.state.users.onRemove = (player, key) => {
                        this.setState({users: this.room.state.users});
                    };
                });
            });
        });
    }

    handleSubmit (e) {
        e.preventDefault();
        this.sendMessage(this.state.currentText);
        this.setState({currentText: ""});
    }
    
    setCurrentText (e) {
        e.preventDefault();
        this.setState({ currentText: e.target.value });
    }

    sendMessage(payload){
        this.room.send('new-message', {'name': this.state.user.name, 'payload': payload, 'avatar':this.state.user.avatar });
    }

    addBot(){
        this.room.send('addBot');
    }

    removeBot(){
        this.room.send('removeBot');
    }

    toggleReady(){
        this.room.send('toggle-ready');
    }

    startGame(){
        firebase.auth().currentUser.getIdToken().then(token =>{
            let allUsersReady = true;

            this.room.state.users.forEach((user, key) => {
              if (!user.ready) {
                allUsersReady = false;
              }
            });
      
            if (allUsersReady) {
              this.client.create('game', {users: this.room.state.users, idToken: token}).then((room) => {
                this.setState({gameId: room.id});
                this.room.send('game-start', {id: room.id});
                this.room.leave();
              }).catch((e) => {
                console.error('join error', e);
              });
            }
        });
    }

    leaveRoom(){
        this.room.leave();
    }

  render() {
    const preparationStyle = {
        display:'flex',
        justifyContent:'space-between'
    };

    const buttonStyle= {
        marginLeft:'10px',
        marginTop:'10px'
    }

    if(!this.state.isSignedIn){
        return <div>
        </div>;
      }
    if(this.state.gameId != ''){
        return <Redirect to={{
            pathname: '/game/' + this.state.gameId
        }} />;
    }
    else{
        return (
            <div className="App">
                <Link to='/lobby'>
                    <button className='nes-btn is-primary' style={buttonStyle} onClick={this.leaveRoom.bind(this)}>Lobby</button>
                </Link>
                <div style={preparationStyle}>
                    <PreparationMenu
                        id={this.id}
                        users={this.state.users}
                        addBot={this.addBot.bind(this)}
                        removeBot={this.removeBot.bind(this)}
                        toggleReady={this.toggleReady.bind(this)}
                        startGame={this.startGame.bind(this)}
                    />
                    <Chat 
                        messages={this.state.messages}
                        handleSubmit={this.handleSubmit.bind(this)} 
                        setCurrentText={this.setCurrentText.bind(this)}
                        currentText={this.state.currentText}
                    />
                </div>
            </div>
        );    
    }
  }
}
export default Preparation;
