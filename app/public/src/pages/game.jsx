import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GameContainer from '../game/game-container';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './utils/utils';
import { Client } from 'colyseus.js';

class Game extends Component {

    constructor(props){
        super(props);
        this.client = new Client(window.endpoint);
        window.langage = 'eng';
        this.container = React.createRef();

        this.state = {
          afterGameId: '',
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
      this.gameContainer = new GameContainer(this.container.current, this.uid, this.room);
      document.getElementById('game').addEventListener('shop-click', this.gameContainer.onShopClick.bind(this.gameContainer));
      document.getElementById('game').addEventListener('player-click', this.gameContainer.onPlayerClick.bind(this.gameContainer));
      document.getElementById('game').addEventListener('refresh-click', this.gameContainer.onRefreshClick.bind(this.gameContainer));
      document.getElementById('game').addEventListener('lock-click', this.gameContainer.onLockClick.bind(this.gameContainer));
      document.getElementById('game').addEventListener('level-click', this.gameContainer.onLevelClick.bind(this.gameContainer));
      document.getElementById('game').addEventListener('drag-drop', this.gameContainer.onDragDrop.bind(this.gameContainer));
      document.getElementById('game').addEventListener('sell-drop', this.gameContainer.onSellDrop.bind(this.gameContainer));
      document.getElementById('game').addEventListener('leave-game', this.leaveGame.bind(this));
    }

    leaveGame(){
      this.removeEventListeners();
      let savePlayers = [];
      this.gameContainer.game.destroy(true);
      this.gameContainer.room.state.players.forEach(player => savePlayers.push(this.gameContainer.transformToSimplePlayer(player)));
      firebase.auth().currentUser.getIdToken().then(token =>{
        window._client.create('after-game', {players:savePlayers, idToken:token}).then((room) => {
          window._room = room;
          this.gameContainer.room.leave();
          this.setState({
            afterGameId: room.id
          });
          //console.log('joined room:', room);
        }).catch((e) => {
          console.error('join error', e);
        });
      });
    }

    removeEventListeners(){
      document.getElementById('game').removeEventListener('shop-click', this.gameContainer.onShopClick.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('player-click', this.gameContainer.onPlayerClick.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('refresh-click', this.gameContainer.onRefreshClick.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('lock-click', this.gameContainer.onLockClick.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('level-click', this.gameContainer.onLevelClick.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('drag-drop', this.gameContainer.onDragDrop.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('sell-drop', this.gameContainer.onSellDrop.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('leave-game', this.leaveGame.bind(this));
    }

  render() {
    if(!this.state.isSignedIn){
      return <div>
      </div>;
    }
    if(this.state.afterGameId != ''){
      return <Redirect to={{
        pathname: '/after/' + this.state.afterGameId
    }}/>;
    }
    else{
      return (
        <main style={{display:'flex'}}>
            <div id='game' ref={this.container}></div>
        </main>
        );
    }
  }
}
export default Game;
