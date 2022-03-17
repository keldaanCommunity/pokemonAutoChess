import React, { Component } from 'react';
import Chat from './component/chat/chat';
import firebase from 'firebase/compat/app';
import PreparationMenu from './component/preparation-menu';
import { Navigate, Link } from 'react-router-dom';
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
            isSignedIn: false,
            toLobby: false,
            connected: false,
            ownerId:'',
            ownerName:''
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
                        console.log(err);
                    });
                });
              } catch (e) {
                console.error("join error", e);
            }
        });
    }

    initializeRoom(room){
        this.room = room;
        this.setState({
            connected:true
        });

        this.room.onMessage('messages', (message) => {
            this.setState({
                messages: this.state.messages.concat(message)
            });
        });

        this.room.onMessage('game-start', (message) => {
            console.log('game start');
            firebase.auth().currentUser.getIdToken().then(token =>{
                this.client.joinById(message.id, {idToken: token}).then((room) => {
                    this.closeConnection(room);
                  }).catch((e) => {
                    console.error('join error', e);
                });
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

        this.room.state.onChange = changes =>{
            this.setState({
                ownerId: this.room.state.ownerId,
                ownerName: this.room.state.ownerName
            });
        };
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

    addBot(difficulty){
        this.room.send('addBot', difficulty);
    }

    removeBot(target){
        this.room.send('removeBot', target);
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
                this.room.send('game-start', {id: room.id});
                this.closeConnection(room);
                
              }).catch((e) => {
                console.error('join error', e);
              });
            }
        });
    }

    closeConnection(room){
        this.room.leave();
        this.room.connection.close();
        let id = room.id;
        localStorage.setItem('lastRoomId', id);
        localStorage.setItem('lastSessionId', room.sessionId);
        room.connection.close();
        this.setState({gameId: room.id});
    }

    reconnect(){
        firebase.auth().currentUser.getIdToken().then(token =>{
          this.client.reconnect(this.id, this.sessionId)
          .then(room=>{
              this.initializeRoom(room);
          })
          .catch(err=>{
            this.setState({
              toLobby: true
            });
            console.log(err);
          });
        });
      }

    toLobby(){
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
        return <Navigate to='/game'/>;
    }
    if(this.state.toLobby){
        return <Navigate to='/lobby'/>;
    }
    if(!this.state.connected){
        return <div style={{display:'flex', position: 'absolute', top:'50%', left:'50%', marginLeft: '-300px', marginTop: '-150px', backgroundColor: 'rgba(255, 255, 255, .6)'}}>
            <div className="nes-container with-title is-centered" style={{width: '600px', height: '300px'}}>
              <p className="title">Game</p>
              <button className='nes-btn is-warning' onClick={this.reconnect.bind(this)}>Join Preparation Room</button>
          </div>
        </div>
    }
    else{
        return (
            <div className="App">
                <Link to='/lobby'>
                    <button className='nes-btn is-primary' style={buttonStyle} onClick={this.toLobby.bind(this)}>Lobby</button>
                </Link>
                <div style={preparationStyle}>
                    <PreparationMenu
                        id={this.id}
                        users={this.state.users}
                        addBot={this.addBot.bind(this)}
                        removeBot={this.removeBot.bind(this)}
                        toggleReady={this.toggleReady.bind(this)}
                        startGame={this.startGame.bind(this)}
                        ownerId={this.state.ownerId}
                        uid={this.uid}
                        ownerName={this.state.ownerName}
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
