import { Client, Room } from "colyseus.js";
import firebase from "firebase/compat/app";
import React, { useEffect, useRef, useState } from "react";
import GameState from "../../../rooms/states/game-state";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addPlayer, changePlayer, setAfterGameId, setExperienceManager, setInterest, setItemsProposition, setMapName, setMoney, setPhase, setPlayer, setRoundTime, setShop, setShopLocked, setStageLevel, setStreak } from "../stores/GameStore";
import { logIn, joinGame, requestTilemap } from "../stores/NetworkStore";
import { FIREBASE_CONFIG } from "./utils/utils";
import GameContainer from '../game/game-container';
import { Navigate } from "react-router-dom";
import { WORDS } from "../../../models/enum";
import GameDpsMeter from "./component/game/game-dps-meter";
import GameInformations from "./component/game/game-informations";
import GameItemsProposition from "./component/game/game-items-proposition";
import GameModal from "./component/game/game-modal";
import GamePlayerInformations from "./component/game/game-player-informations";
import GamePlayers from "./component/game/game-players";
import GameRarityPercentage from "./component/game/game-rarity-percentage";
import GameShop from "./component/game/game-shop";
import GameSynergies from "./component/game/game-synergies";

let gameContainer: GameContainer;

export default function Game() {
  const dispatch = useAppDispatch();
  const client: Client = useAppSelector(state=>state.network.client);
  const room : Room<GameState> = useAppSelector(state=>state.network.game);
  const uid : string = useAppSelector(state=>state.network.uid);
  const currentPlayerId: string = useAppSelector(state=>state.game.currentPlayerId);
  const afterGameId: string = useAppSelector(state=>state.game.afterGameId);

  const [initialized, setInitialized] = useState<boolean>(false);
  const [reconnected, setReconnected] = useState<boolean>(false);
  const [toLobby, setToLobby] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalInfo, setModalInfo] = useState<string>('');
  const [modalBoolean, setModalBoolean] = useState<boolean>(false);
  
  const container = useRef();

  useEffect(()=>{
    const reconnect = async () => {
        setReconnected(true);
        if(!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        firebase.auth().onAuthStateChanged(async user => {
            dispatch(logIn(user));
            try{
                const r: Room<GameState> = await client.reconnect(localStorage.getItem('lastRoomId'),localStorage.getItem('lastSessionId'));
                dispatch(joinGame(r));
            }
            catch(error){
                console.log(error);         
            }
        });
    }

    if(!reconnected){
        reconnect();
    }

    if(!initialized && room != undefined){
      setInitialized(true);

      gameContainer = new GameContainer(container.current, uid, room);
      document.getElementById('game').addEventListener('drag-drop', gameContainer.onDragDrop.bind(gameContainer));
      document.getElementById('game').addEventListener('sell-drop', gameContainer.onSellDrop.bind(gameContainer));
      dispatch(requestTilemap());

      room.onMessage('info', message => {setModalTitle(message.title); setModalInfo(message.info); setModalBoolean(true)});
      room.onMessage('tilemap', tilemap => {gameContainer.setTilemap(tilemap)});

      room.state.onChange = changes => {
        changes.forEach( change => {
          if(change.field == 'afterGameId') {
            dispatch(setAfterGameId(change.value));
          }
          else if(change.field == 'roundTime') {
            dispatch(setRoundTime(change.value));
          }
          else if(change.field == 'phase') {
            const g: any = gameContainer.game.scene.getScene('gameScene');
            g.updatePhase();
            dispatch(setPhase(change.value));
          }
          else if(change.field == 'stageLevel') {
            dispatch(setStageLevel(change.value));
          }
          else if(change.field == 'mapName') {
            dispatch(setMapName(change.value));
          }
        })
      }

      room.state.players.onAdd = player => {
        gameContainer.initializePlayer(player);
        dispatch(addPlayer(player));

        if(player.id == currentPlayerId){
          dispatch(setPlayer(player));
        }

        if(player.id == uid){
            dispatch(setMoney(player.money));
            dispatch(setInterest(player.interest));
            dispatch(setStreak(player.streak));
            dispatch(setShopLocked(player.shopLocked));
            dispatch(setExperienceManager(player.experienceManager));
        }

        player.onChange = ((changes) => {

          changes.forEach((change) => {
            if(player.id == uid){
              if(change.field == 'alive') {
                const rankPhrase = `${WORDS.PLACE['eng']} no ${player.rank}`;
                const titlePhrase = WORDS.RANKING['eng'];
                if(!change.value){
                  setModalTitle(titlePhrase);
                  setModalInfo(rankPhrase);
                  setModalBoolean(true);
                }
              }
              else if (change.field == 'experienceManager'){
                dispatch(setExperienceManager(player.experienceManager));
              }
              else if (change.field == 'intereset'){
                dispatch(setInterest(player.interest));
              }
              else if (change.field == 'itemsProposition'){
                dispatch(setItemsProposition(player.itemsProposition));
              }
              else if (change.field == 'shop'){
                dispatch(setShop(player.shop));
              }
              else if (change.field == 'shopLocked'){
                dispatch(setShopLocked(player.shopLocked));
              }
              else if (change.field == 'money'){
                dispatch(setMoney(player.money));
              }
              else if (change.field == 'streak'){
                dispatch(setStreak(player.streak));
              }
            }
            dispatch(changePlayer(player));
          });
        })
      }
    }
  });

  if(toLobby){
    return <Navigate to='/lobby'/>;
  }
  if(afterGameId){
    return <Navigate to='/after'/>
  }
  else{
    return <div>
    <GameShop/>
    <div id='game' ref={container} style={{
      maxHeight:'100vh'
    }}>
    </div>
  </div>
  }
}

/*
    <GameModal/>
    <GameShop/>
    <GameInformations/>
    <GamePlayers/>
    <GamePlayerInformations/>
    <GameDpsMeter/>
    <GameSynergies/>
    <GameRarityPercentage/>
    <GameItemsProposition/>

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

    playerClick(id){
        this.setState({
            currentPlayerId:id,
            player:this.state.gameState.players.get(id),
            blueDpsMeter: this.state.gameState.players.get(id).simulation.blueDpsMeter,
            redDpsMeter: this.state.gameState.players.get(id).simulation.redDpsMeter,
            blueHealDpsMeter: this.state.gameState.players.get(id).simulation.blueHealDpsMeter,
            redHealDpsMeter: this.state.gameState.players.get(id).simulation.redHealDpsMeter,
        });
        this.gameContainer.onPlayerClick(id);
    }
*/