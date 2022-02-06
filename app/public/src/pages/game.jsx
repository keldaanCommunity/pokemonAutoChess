import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import GameContainer from '../game/game-container';
import firebase from 'firebase/compat/app';
import { FIREBASE_CONFIG } from './utils/utils';
import { Client } from 'colyseus.js';
import GameShop from './component/game-shop';
import GameInformations from './component/game-informations';
import GamePlayers from './component/game-players';
import { WORDS} from '../../../models/enum';
import GamePlayerInformations from './component/game-player-informations';
import GameDpsMeter from './component/game-dps-meter';
import GameSynergies from './component/game-synergies';
import GameRarityPercentage from './component/game-rarity-percentage';
import GameItemsProposition from './component/game-items-proposition';
import GameModal from './component/game-modal';

class Game extends Component {

    constructor(props){
        super(props);
        this.client = new Client(window.endpoint);
        window.langage = 'eng';
        this.container = React.createRef();

        this.state = {
          modalBoolean: false,
          modalTitle: '',
          modalInfo: '',
          blueDpsMeter: {},
          redDpsMeter:{},
          history:[],
          afterGameId: '',
          isSignedIn: false,
          connected: false,
          shopLocked: false,
          name: '',
          money: 0,
          streak:0,
          interest:0,
          currentPlayerId:'',
          experienceManager:
          {
            level: 2,
            experience: 0,
            expNeeded: 2
          },
          shop:[],
          itemsProposition:[],
          player:{
            boardSize: 0,
            opponentName:'',
            opponentAvatar:'',
            experienceManager:{
                level:2
            },
            avatar:'rattata',
            money:5,
            name:'',
            life:100,
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
                GHOST: 0,
                FAIRY: 0,
                ICE: 0,
                FOSSIL: 0,
                SOUND: 0
            }

          },
          gameState:{
            roundTime: '',
            phase: '',
            players: {},
            stageLevel: 0
          }
        };

        // Initialize Firebase
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }

        firebase.auth().onAuthStateChanged(user => {
          this.setState({isSignedIn: !!user});
          this.uid = firebase.auth().currentUser.uid;
          this.setState(
              {
                currentPlayerId: this.uid
              }
          );
          this.id = localStorage.getItem('lastRoomId');
          this.sessionId = localStorage.getItem('lastSessionId');

          try {
              firebase.auth().currentUser.getIdToken().then(token =>{
                  this.client.reconnect(this.id, this.sessionId)
                  .then(room=>{
                      this.initializeRoom(room);
                  })
                  .catch(err=>{
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

      this.gameContainer = new GameContainer(this.container.current, this.uid, this.room);
      document.getElementById('game').addEventListener('drag-drop', this.gameContainer.onDragDrop.bind(this.gameContainer));
      document.getElementById('game').addEventListener('sell-drop', this.gameContainer.onSellDrop.bind(this.gameContainer));

      this.room.send('request-tilemap');
      this.room.onMessage('info', (message)=> this.showModal(message.title, message.info));
      this.room.onMessage('tilemap', (tilemap) => {this.gameContainer.setTilemap(tilemap)});

      this.room.state.players.onAdd = (player) => {
        this.gameContainer.initializePlayer(player);
        player.onChange = ((changes) => {
          if(player.id == this.state.currentPlayerId){
            this.setState({
              player: player
            });
          }
          if(player.id == this.uid){
            this.setState({
              name: player.name,
              money: player.money,
              interest: player.interest,
              streak: player.streak,
              shopLocked: player.shopLocked,
              experienceManager: player.experienceManager,
              history: player.history
            })
          }

          changes.forEach((change) => {
            if(change.field == 'alive' && this.uid == player.id) {
                let rankPhrase = `${WORDS.PLACE['eng']} no ${player.rank}`;
                let titlePhrase = WORDS.RANKING['eng'];
                if(!change.value){
                this.showModal(titlePhrase, rankPhrase);
                }
            }
          });
        });

        player.history.onChange = (player, key) => {
          this.setState({
            gameState:{
              ...this.state.gameState,
              players: this.state.gameState.players
            }
          });
      };

        player.shop.onAdd = (p)=>{
            if(player.id == this.uid){
                this.setState({
                  shop: player.shop
                })
            }
        }
        player.shop.onRemove = (p)=>{
            if(player.id == this.uid){
                this.setState({
                  shop: player.shop
                })
            }
        }
        player.shop.onChange = (p)=>{
            if(player.id == this.uid){
                this.setState({
                  shop: player.shop
                })
            }
        }

        
        player.itemsProposition.onAdd = (p)=>{
          if(player.id == this.uid){
              this.setState({
                itemsProposition: player.itemsProposition
              })
          }
      }
      player.itemsProposition.onRemove = (p)=>{
          if(player.id == this.uid){
              this.setState({
                itemsProposition: player.itemsProposition
              })
          }
      }
      player.itemsProposition.onChange = (p)=>{
          if(player.id == this.uid){
              this.setState({
                itemsProposition: player.itemsProposition
              })
          }
      }

        player.synergies.onChange = (s)=>{
            if(player.id == this.state.currentPlayerId){
                this.setState({
                    player: player
                });
            }
        };
        player.simulation.blueDpsMeter.onAdd = (dps, key) => {
            if(player.id == this.state.currentPlayerId){
                this.setState({
                  blueDpsMeter:player.simulation.blueDpsMeter
                });
            }
            dps.onChange = (changes) => {
                if(player.id == this.state.currentPlayerId){
                    this.setState({
                      blueDpsMeter:player.simulation.blueDpsMeter
                    });
                }
            };
          };
        player.simulation.blueDpsMeter.onRemove = (dps, key) => {
            if(player.id == this.state.currentPlayerId){
                this.setState({
                  blueDpsMeter:player.simulation.blueDpsMeter
                });
            }
          };

          player.simulation.redDpsMeter.onAdd = (dps, key) => {
            if(player.id == this.state.currentPlayerId){
                this.setState({
                  redDpsMeter:player.simulation.redDpsMeter
                });
            }
            dps.onChange = (changes) => {
                if(player.id == this.state.currentPlayerId){
                    this.setState({
                      redDpsMeter:player.simulation.redDpsMeter
                    });
                }
            };
          };
        player.simulation.redDpsMeter.onRemove = (dps, key) => {
            if(player.id == this.state.currentPlayerId){
                this.setState({
                  redDpsMeter:player.simulation.redDpsMeter
                });
            }
          };
      };
      this.room.state.players.onRemove = (player, key) => {
        this.gameContainer.onPlayerRemove(player, key)
      };
      this.room.state.onChange = (changes)=>{
        if(this.gameContainer && this.gameContainer.game){
          changes.forEach(change=>{
            switch (change.field) {
              case 'phase':
                this.gameContainer.game.scene.getScene('gameScene').updatePhase();
                this.setState({
                    phase: change.value
                });
                break;

            case 'afterGameId':
                this.setState({
                    afterGameId: change.value
                });
                break;
  
            case 'roundTime':
                this.setState({
                    roundTime: change.value
                });
                break;

            case 'stageLevel':
                this.setState({
                    stageLevel: change.value
                });
                break;

            default:
                break;
            }
          });
        }
      }

      this.setState({
        gameState: this.room.state
      });
    }

    leaveGame(){
      this.removeEventListeners();
      let savePlayers = [];
      this.gameContainer.game.destroy(true);
      this.room.state.players.forEach(player => savePlayers.push(this.gameContainer.transformToSimplePlayer(player)));

      firebase.auth().currentUser.getIdToken().then(token =>{
        this.client.create('after-game', {players:savePlayers, idToken:token}).then((room) => {
          this.room.leave();
          let id = room.id;
          localStorage.setItem('lastRoomId', id);
          localStorage.setItem('lastSessionId', room.sessionId);
          room.connection.close();
          this.setState({afterGameId: room.id});
          });
          //console.log('joined room:', room);
      }).catch((e) => {
        console.error('join error', e);
      });
    }


    showModal(title, info){
      this.setState({
        modalTitle: title,
        modalInfo: info,
        modalBoolean: true
      });
    };


    hideModal(){
      this.setState({
        modalBoolean: false
      });
    };

    removeEventListeners(){
      document.getElementById('game').removeEventListener('drag-drop', this.gameContainer.onDragDrop.bind(this.gameContainer));
      document.getElementById('game').removeEventListener('sell-drop', this.gameContainer.onSellDrop.bind(this.gameContainer));
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

    refreshClick() {
      this.room.send('refresh');
    }

    lockClick() {
      this.room.send('lock');
    }

    levelClick() {
        this.room.send('levelUp');
    }

    shopClick(index){
      this.room.send('shop', {'id': index});
    }

    itemClick(item){
      this.room.send('item',{'id': item});
    }

    playerClick(id){
        this.setState({
            currentPlayerId:id,
            player:this.state.gameState.players.get(id)
        });
        this.gameContainer.onPlayerClick(id);
    }

  render() {

    if(!this.state.isSignedIn){
      return <div>
      </div>;
    }
    if(this.state.toLobby){
      return <Navigate to='/lobby'/>;
    }
    if(this.state.afterGameId != ''){
      return <Navigate to='/after'/>;
    }
    if(!this.state.connected){
      return <div style={{display:'flex', position: 'absolute', top:'50%', left:'50%', marginLeft: '-300px', marginTop: '-150px', backgroundColor: 'rgba(255, 255, 255, .6)'}}>
          <div className="nes-container with-title is-centered" style={{width: '600px', height: '300px'}}>
            <p className="title">Game</p>
            <button className='nes-btn is-warning' onClick={this.reconnect.bind(this)}>Join Game</button>
        </div>
      </div>
    }
    else{
      return <div>
        <GameModal
          modalBoolean={this.state.modalBoolean}
          showModal={this.showModal.bind(this)}
          hideModal={this.hideModal.bind(this)}
          title={this.state.modalTitle}
          info={this.state.modalInfo}
          leave={this.leaveGame.bind(this)}
        />
        <GameShop
            history={this.state.history}
            levelExp={this.state.experienceManager.level} 
            experience={this.state.experienceManager.experience} 
            experienceNeeded={this.state.experienceManager.expNeeded} 
            money={this.state.money} refresh={this.refreshClick.bind(this)}
            interest={this.state.interest}
            streak={this.state.streak}
            lock={this.lockClick.bind(this)} 
            shopLocked={this.state.shopLocked} 
            level={this.levelClick.bind(this)}
            shop={this.state.shop}
            shopClick={this.shopClick.bind(this)}
        />
        <GameInformations
          time={this.state.gameState.roundTime}
          turn={this.state.gameState.stageLevel}
          mapName={this.state.gameState.mapName}
          click={this.leaveGame.bind(this)}
          />
        <GamePlayers 
            players={this.state.gameState.players}
            playerClick={this.playerClick.bind(this)}
            uid={this.uid}
        />
        <GamePlayerInformations
            boardSize={this.state.player.boardSize} 
            maxBoardSize={this.state.player.experienceManager.level}
            avatar={this.state.player.avatar}
            opponent={this.state.player.opponentName}
            opponentAvatar={this.state.player.opponentAvatar}
            money={this.state.player.money}
            name={this.state.player.name}
            life={this.state.player.life}
        />
        <GameDpsMeter
            blueDpsMeter={this.state.blueDpsMeter}
            redDpsMeter={this.state.redDpsMeter}
        />
        <GameSynergies
            synergies={this.state.player.synergies}
        />
        <GameRarityPercentage
            level={this.state.experienceManager.level}
        />
        <GameItemsProposition
            proposition={this.state.itemsProposition}
            itemClick={this.itemClick.bind(this)}
        />
        <div id='game' ref={this.container} style={{
          maxHeight:'100vh'
        }}>
        </div>
      </div>
      
    }
  }
}
export default Game;
