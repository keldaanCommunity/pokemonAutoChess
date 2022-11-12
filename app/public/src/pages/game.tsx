import { Client, Room } from 'colyseus.js'
import firebase from 'firebase/compat/app'
import React, { useEffect, useRef, useState } from 'react'
import GameState from '../../../rooms/states/game-state'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setPokemonCollection, setSynergies, addPlayer, changePlayer, setCurrentPlayerId, setExperienceManager, setInterest, setItemsProposition, setMapName, setMoney, setPhase, setRoundTime, setShop, setShopLocked, setStageLevel, setStreak, setOpponentName, setOpponentAvatar, setLife, setPlayer, setBoardSize, setCurrentPlayerMoney, setCurrentPlayerExperienceManager, setCurrentPlayerAvatar, setCurrentPlayerName, addBlueDpsMeter, changeBlueDpsMeter, addRedDpsMeter, changeRedDpsMeter, addBlueHealDpsMeter, changeBlueHealDpsMeter, addRedHealDpsMeter, changeRedHealDpsMeter, removeRedDpsMeter, removeBlueDpsMeter, removeRedHealDpsMeter, removeBlueHealDpsMeter, leaveGame, displayEmote, setCurrentPlayerTitle, setPokemonProposition, setAdditionalPokemons} from '../stores/GameStore'
import { logIn, joinGame, requestTilemap } from '../stores/NetworkStore'
import { FIREBASE_CONFIG } from './utils/utils'
import GameContainer from '../game/game-container'
import { Navigate } from 'react-router-dom'
import GameDpsMeter from './component/game/game-dps-meter'
import GameInformations from './component/game/game-informations'
import GameItemsProposition from './component/game/game-items-proposition'
import GamePlayerInformations from './component/game/game-player-informations'
import GamePlayers from './component/game/game-players'
import GameShop from './component/game/game-shop'
import GameSynergies from './component/game/game-synergies'
import GameModal from './component/game/game-modal'
import AfterGameState from '../../../rooms/states/after-game-state'
import { IDragDropCombineMessage, IDragDropItemMessage, IDragDropMessage, Transfer, ISimplePlayer } from '../../../types'
import GameToasts from './component/game/game-toasts'
import GamePokemonsProposition from './component/game/game-pokemons-proposition'
import PokemonFactory from '../../../models/pokemon-factory'
import { Pkm, PkmIndex } from '../../../types/enum/Pokemon'
import { toast } from 'react-toastify'
import { GameAdditionalPokemons } from './component/game/game-additional-pokemons'
import { getPortraitSrc } from '../utils'
let gameContainer: GameContainer

function playerClick(id: string){
  gameContainer.onPlayerClick(id)
}

export default function Game() {
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector(state=>state.network.client)
  const room: Room<GameState>|undefined = useAppSelector(state=>state.network.game)
  const uid: string = useAppSelector(state=>state.network.uid)
  const currentPlayerId: string = useAppSelector(state=>state.game.currentPlayerId)

  const [initialized, setInitialized] = useState<boolean>(false)
  const [reconnected, setReconnected] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalInfo, setModalInfo] = useState<string>('')
  const [modalBoolean, setModalBoolean] = useState<boolean>(false)
  const [toAfter, setToAfter] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  async function leave() {
    const savePlayers = new Array<ISimplePlayer>()

    document.getElementById('game')?.removeEventListener(Transfer.DRAG_DROP, ((event: CustomEvent<IDragDropMessage>) => {gameContainer.onDragDrop(event)}) as EventListener)
    document.getElementById('game')?.removeEventListener(Transfer.DRAG_DROP_ITEM, ((event: CustomEvent<IDragDropItemMessage>) => {gameContainer.onDragDropItem(event)}) as EventListener)
    document.getElementById('game')?.removeEventListener(Transfer.DRAG_DROP_COMBINE, ((event: CustomEvent<IDragDropCombineMessage>) => {gameContainer.onDragDropCombine(event)}) as EventListener)
    document.getElementById('game')?.removeEventListener(Transfer.SELL_DROP, ((event: CustomEvent<{pokemonId: string}>) => {gameContainer.onSellDrop(event)}) as EventListener)

    const token = await firebase.auth().currentUser?.getIdToken()

    if(gameContainer && gameContainer.game){
      gameContainer.game.destroy(true)
      
    }

    if(room && room.state && room.state.players && room.state.players.size > 0){
      room.state.players.forEach(player => savePlayers.push(gameContainer.transformToSimplePlayer(player)))
    }
    
    const r: Room<AfterGameState> = await client.create('after-game', {players:savePlayers, idToken:token})
    localStorage.setItem('lastRoomId', r.id)
    localStorage.setItem('lastSessionId', r.sessionId)
    await room?.leave()
    r.connection.close()
    dispatch(leaveGame())
    setToAfter(true)
  }

  useEffect(()=>{
    const reconnect = async () => {
        setReconnected(true)
        if(!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG)
        }

        firebase.auth().onAuthStateChanged(async user => {
          if(user){
            dispatch(logIn(user))
            dispatch(setCurrentPlayerId(user.uid))
            try{
                const lastRoomId = localStorage.getItem('lastRoomId')
                const lastSessionId = localStorage.getItem('lastSessionId')
                if(lastRoomId && lastSessionId){
                  const r: Room<GameState> = await client.reconnect(lastRoomId,lastSessionId)
                  dispatch(joinGame(r))
                }
            }
            catch(error){
                try {
                    setTimeout(async()=>{
                        const lastRoomId = localStorage.getItem('lastRoomId')
                        const lastSessionId = localStorage.getItem('lastSessionId')
                        if(lastRoomId && lastSessionId){
                          const r: Room<GameState> = await client.reconnect(lastRoomId,lastSessionId)
                          dispatch(joinGame(r))
                        }
                      })     
                } catch (error) {
                    setToAuth(true)
                }
  
            }
          }
          else{
            setToAuth(true)
            }
        })
    }

    if(!reconnected){
        reconnect()
    }

    if(!initialized && room != undefined && container?.current){
      setInitialized(true)
      dispatch(requestTilemap())

      gameContainer = new GameContainer(container.current, uid, room)
      document.getElementById('game')?.addEventListener(Transfer.DRAG_DROP, ((event: CustomEvent<IDragDropMessage>) => {gameContainer.onDragDrop(event)}) as EventListener)
      document.getElementById('game')?.addEventListener(Transfer.DRAG_DROP_ITEM, ((event: CustomEvent<IDragDropItemMessage>) => {gameContainer.onDragDropItem(event)}) as EventListener)
      document.getElementById('game')?.addEventListener(Transfer.DRAG_DROP_COMBINE, ((event: CustomEvent<IDragDropCombineMessage>) => {gameContainer.onDragDropCombine(event)}) as EventListener)
      document.getElementById('game')?.addEventListener(Transfer.SELL_DROP, ((event: CustomEvent<{pokemonId: string}>) => {gameContainer.onSellDrop(event)}) as EventListener)
      room.onMessage(Transfer.BROADCAST_INFO, message => {setModalTitle(message.title); setModalInfo(message.info); setModalBoolean(true)})
      room.onMessage(Transfer.REQUEST_TILEMAP, tilemap => {gameContainer.setTilemap(tilemap)})
      room.onMessage(Transfer.BROADCAST_EMOTE, message => {dispatch(displayEmote({id: message.id, emote: message.emote}))})

      room.state.onChange = changes => {
        changes.forEach( change => {
          if(change.field == 'roundTime') {
            dispatch(setRoundTime(change.value))
          }
          else if(change.field == 'phase') {
            if(gameContainer.game){
              const g: any = gameContainer.game.scene.getScene('gameScene')
              g.updatePhase()
            }
            dispatch(setPhase(change.value))
          }
          else if(change.field == 'stageLevel') {
            dispatch(setStageLevel(change.value))
          }
          else if(change.field == 'mapName') {
            dispatch(setMapName(change.value))
          }
        })
      }

      room.state.additionalPokemons.onAdd = (pkm) => {
        dispatch(setAdditionalPokemons(room.state.additionalPokemons))
        if(pkm !== Pkm.DEFAULT){
          const i = React.createElement(
            "img",
            {
              src: getPortraitSrc(PkmIndex[pkm])
            },
            null
          )
          room.state.players.forEach(player=>{
            toast(i, { containerId: player.rank.toString() })
          })
        }
      }

      room.state.players.onAdd = player => {
        gameContainer.initializePlayer(player)
        dispatch(addPlayer(player))

        if(player.id == uid){
            dispatch(setInterest(player.interest))
            dispatch(setStreak(player.streak))
            dispatch(setShopLocked(player.shopLocked))
            dispatch(setPokemonCollection(player.pokemonCollection))
            dispatch(setPlayer(player))
        }

        player.onChange = ((changes) => {

          changes.forEach((change) => {
            if(player.id == uid){
              if(change.field == 'alive') {
                const rankPhrase = `Place no ${player.rank}`
                const titlePhrase = 'Rank'
                if(!change.value){
                  setModalTitle(titlePhrase)
                  setModalInfo(rankPhrase)
                  setModalBoolean(true)
                }
              }
              else if (change.field == 'experienceManager'){
                dispatch(setExperienceManager(player.experienceManager))
              }
              else if (change.field == 'interest'){
                dispatch(setInterest(player.interest))
              }
              else if (change.field == 'shop'){
                dispatch(setShop(player.shop))
              }
              else if (change.field == 'shopLocked'){
                dispatch(setShopLocked(player.shopLocked))
              }
              else if (change.field == 'money'){
                dispatch(setMoney(player.money))
              }
              else if (change.field == 'streak'){
                dispatch(setStreak(player.streak))
              }
            }
            if(player.id == currentPlayerId){
              if(change.field == 'opponentName'){
                dispatch(setOpponentName(change.value))
              }
              else if(change.field == 'opponentAvatar'){
                dispatch(setOpponentAvatar(change.value))
              }
              else if(change.field == 'boardSize'){
                dispatch(setBoardSize(change.value))
              }
              else if(change.field == 'life'){
                dispatch(setLife(change.value))
              }
              else if(change.field == 'money'){
                dispatch(setCurrentPlayerMoney(change.value))
              }
              else if(change.field == 'experienceManager'){
                dispatch(setCurrentPlayerExperienceManager(change.value))
              }
              else if (change.field == 'avatar'){
                dispatch(setCurrentPlayerAvatar(change.value))
              }
              else if (change.field == 'name'){
                dispatch(setCurrentPlayerName(change.value))
              }
              else if (change.field == 'title'){
                dispatch(setCurrentPlayerTitle(change.value))
              }
            }
            dispatch(changePlayer({id: player.id, change: change}))
          })
        })


        player.synergies.onChange = (value, key) => {

          if(player.id == currentPlayerId){
            dispatch(setSynergies(player.synergies))
          }
        }
        
        player.itemsProposition.onAdd = ((changes)=>{
          if(player.id == uid){
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })
        player.itemsProposition.onRemove = ((changes)=>{
          if(player.id == uid){
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })

        player.pokemonsProposition.onAdd = ((changes)=>{
          if(player.id == uid){
            dispatch(setPokemonProposition(player.pokemonsProposition))
          }
        })
        player.pokemonsProposition.onRemove = ((changes)=>{
          if(player.id == uid){
            dispatch(setPokemonProposition(player.pokemonsProposition))
          }
        })

        player.simulation.blueDpsMeter.onAdd = ((dps, key)=>{
          if(player.id == currentPlayerId){
            dispatch(addBlueDpsMeter(dps))
          }
          dps.onChange = function(changes) {
            if(player.id == currentPlayerId){
              changes.forEach(change=>{
                dispatch(changeBlueDpsMeter({id: dps.id, change: change}))
              })  
            }
          }
        })
        player.simulation.blueDpsMeter.onRemove = (dps, key) =>{
            if(player.id == currentPlayerId) {
                dispatch(removeBlueDpsMeter(key))
            }
        }
        
        player.simulation.redDpsMeter.onAdd = ((dps, key)=>{
          if(player.id == currentPlayerId){
            dispatch(addRedDpsMeter(dps))
          }
          dps.onChange = function(changes) {
            if(player.id == currentPlayerId){
              changes.forEach(change=>{
                dispatch(changeRedDpsMeter({id: dps.id, change: change}))
              })
            }
          }
        })
        player.simulation.redDpsMeter.onRemove = (dps, key) =>{
            if(player.id == currentPlayerId) {
                dispatch(removeRedDpsMeter(key))
            }
        }

        player.simulation.blueHealDpsMeter.onAdd = ((dps, key)=>{
          if(player.id == currentPlayerId){
            dispatch(addBlueHealDpsMeter(dps))
          }
          dps.onChange = function(changes) {
            if(player.id == currentPlayerId){
              changes.forEach(change=>{
                dispatch(changeBlueHealDpsMeter({id: dps.id, change: change}))
              })   
            }
          }
        })
        player.simulation.blueHealDpsMeter.onRemove = (dps, key) =>{
            if(player.id == currentPlayerId) {
                dispatch(removeBlueHealDpsMeter(key))
            }
        }

        player.simulation.redHealDpsMeter.onAdd = ((dps, key)=>{
          if(player.id == currentPlayerId){
            dispatch(addRedHealDpsMeter(dps))
          }
          dps.onChange = function(changes) {
            if(player.id == currentPlayerId){
              changes.forEach(change=>{
                dispatch(changeRedHealDpsMeter({id: dps.id, change: change}))
              })
            }
          }
        })
        player.simulation.redHealDpsMeter.onRemove = (dps, key) =>{
            if(player.id == currentPlayerId) {
                dispatch(removeRedHealDpsMeter(key))
            }
        }
      }
    }
  }, [reconnected, initialized, room, dispatch, client, uid, currentPlayerId])

  if(toAuth){
      return <Navigate to={'/'}/>
  }

  if(toAfter){
    return <Navigate to='/after'/>
  }
  else{
    return <div>
    <GameModal modalBoolean={modalBoolean} modalTitle={modalTitle} modalInfo={modalInfo} hideModal={setModalBoolean} leave={leave}/>
    <GameShop/>
    <GameInformations leave={leave}/>
    <GamePlayerInformations/>
    <GamePlayers click={(id: string) => playerClick(id)}/>
    <GameSynergies/>
    <GameItemsProposition/>
    <GamePokemonsProposition/>
    <GameDpsMeter/>
    <GameToasts/>
    <div id='game' ref={container}>
    </div>
  </div>
  }
}