import React, { Component, useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Chat from './component/chat';
import CurrentUsers from './component/current-users';
import RoomMenu from './component/room-menu';
import TabMenu from './component/tab-menu';
import firebase from 'firebase/compat/app';
import { FIREBASE_CONFIG } from './utils/utils';
import { Client, Room, RoomAvailable } from 'colyseus.js';
import DiscordButton from './component/discord-button';
import DonateButton from './component/donate-button';
import PolicyButton from './component/policy-button';
import CreditsButton from './component/credits-button';
import Wiki from './component/wiki';
import TeamBuilder from './component/team-builder';
import MetaReport from './component/meta-report';
import { useAppDispatch, useAppSelector } from '../hooks';
import { joinLobby, logIn, logOut } from '../stores/NetworkStore';
import { addUser, changeUser, pushBotLeaderboard, pushLeaderboard, pushMessage, removeUser, setUser } from '../stores/LobbyStore';
import { ICustomLobbyState } from '../../../types';
import LobbyUser from '../../../models/colyseus-models/lobby-user';
import { IBot } from '../../../models/mongo-models/bot-v2';
import { IMeta } from '../../../models/mongo-models/meta';
import { IItemsStatistic } from '../../../models/mongo-models/items-statistic';
import LeaderboardInfo from '../../../models/colyseus-models/leaderboard-info';
import Message from '../../../models/colyseus-models/message';

export default function Lobby(){
    const dispatch = useAppDispatch();

    const client: Client = useAppSelector(state=>state.network.client);
    const uid: string = useAppSelector(state=>state.network.uid);
    const leaderboard: LeaderboardInfo[] = useAppSelector(state=>state.lobby.leaderboard);
    const botLeaderboard: LeaderboardInfo[] = useAppSelector(state=>state.lobby.botLeaderboard);
    const users: Map<string, LobbyUser> = useAppSelector(state => state.lobby.users);
    const user: LobbyUser = useAppSelector(state => state.lobby.user);

    const [lobbyJoined, setLobbyJoined] = useState<boolean>(false);
    const [searchedUser, setSearchedUser] = useState<LobbyUser>(undefined);
    const [pastebinUrl, setPastebinUrl] = useState<string>(undefined);
    const [allRooms, setAllRooms] = useState<RoomAvailable[]>([]);
    const [botList, setBotList] = useState<IBot[]>([]);
    const [meta, setMeta] = useState<IMeta[]>([]);
    const [metaItems, setMetaItems] = useState<IItemsStatistic[]>([]);
    const [botData, setBotData] = useState<IBot>(undefined);
    const [preparationRoomId, setPreparationRoomId] = useState<string>(undefined);
    const [showWiki, toggleWiki] = useState<boolean>(false);
    const [showMeta, toggleMeta] = useState<boolean>(false);
    const [showBuilder, toggleBuilder] = useState<boolean>(false);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const lobbyStyle = {display:'flex',justifyContent:'space-between'};
    const buttonStyle= {marginLeft:'10px',marginTop:'10px',marginRight:'10px'};
    

    useEffect(()=>{

        const join = async () => {
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            } 
            firebase.auth().onAuthStateChanged(async user => {
                dispatch(logIn(user));
                const token = await user.getIdToken();
                const room: Room<ICustomLobbyState> = await client.joinOrCreate('lobby', {idToken: token});
                room.state.messages.onAdd = (m) => {dispatch(pushMessage(m))};

                room.state.users.onAdd = (u) => {
                    dispatch(addUser(u));
                    if(u.id == user.uid){
                        dispatch(setUser(u));
                        setSearchedUser(u);
                    }
                    u.onChange = (changes) => {
                        changes.forEach(change=>{
                            dispatch(changeUser({id: u.id, field: change.field, value: change.value}));
                        });
                    };
                };
                room.state.users.onRemove = (u) => {dispatch(removeUser(u.id))};

                room.state.leaderboard.onAdd = (l) => {dispatch(pushLeaderboard(l))};
                
                room.state.botLeaderboard.onAdd = (l) => {dispatch(pushBotLeaderboard(l))};

                room.onMessage('pastebin-url', (json: { url: string; }) => {setPastebinUrl(json.url)});

                room.onMessage('rooms', (rooms: RoomAvailable[]) => {setAllRooms(rooms.filter(room => room.metadata.name == 'room'))});

                room.onMessage('bot-list', (bots: IBot[]) => {setBotList(bots)});
                
                room.onMessage('+', ([roomId, room]) => {
                    if(room.name == 'room'){
                        const roomIndex = allRooms.findIndex((room: RoomAvailable) => room.roomId === roomId);
                        if (roomIndex !== -1) {
                            let temp = [...allRooms];
                            temp[roomIndex] = room;
                            setAllRooms(temp);
                        }
                        else {
                            setAllRooms(allRooms.concat(room));
                        }
                    }
                });
            
                room.onMessage('-', (roomId: string) => {
                    const temp = allRooms.filter((room) => room.roomId !== roomId);
                    setAllRooms(temp);
                });

                room.onMessage('user', (user: LobbyUser) => {setSearchedUser(user)});

                room.onMessage('meta', (meta: IMeta[]) => {setMeta(meta)});

                room.onMessage('metaItems', (metaItems: IItemsStatistic[]) => {setMetaItems(metaItems)});

                room.onMessage('bot-data', (data: IBot) => { setBotData(data)});

                dispatch(joinLobby(room));
            });
        };
        if(!lobbyJoined){
            join();
            setLobbyJoined(true);
        }
    });
    if(!uid){
        return <div>
        </div>;
      }
      if(preparationRoomId){
        return <Navigate to='/preparation'/>;
      }
      if(showWiki){
        return <Wiki toggleWiki={toggleWiki(!showWiki)} content='Lobby'/>;
      }
      if(showMeta){
          return <MetaReport toggleMeta={toggleMeta(!showMeta)} meta={meta} metaItems={metaItems}/>;
      }
      if(showBuilder){
          return <TeamBuilder 
          toggleBuilder={toggleBuilder(!showBuilder)}
          //createBot={this.createBot.bind(this)}
          pasteBinUrl={pastebinUrl}
          botList={botList}
          botData={botData}
          //requestBotData={this.requestBotData.bind(this)}
          />
      }
      else{
        return (
            <div className='App'>
                <div style={{display:'flex'}}>
                    <Link to='/auth'>
                            <button className='nes-btn is-error' style={buttonStyle} onClick={()=>dispatch(logOut('bye'))}>Sign Out</button>
                    </Link>
                    <button className='nes-btn is-success' style={buttonStyle} onClick={()=>{toggleWiki(!showWiki)}}>Wiki</button>
                    <button className='nes-btn is-primary' style={buttonStyle} onClick={()=>{toggleBuilder(!showBuilder)}}>BOT Builder</button>
                    <button className='nes-btn is-primary' style={buttonStyle} onClick={()=>{toggleMeta(!showMeta)}}>Meta Report</button>
                    <DiscordButton/>
                    <DonateButton/>
                    <PolicyButton/>
                    <CreditsButton/>
                </div>

                <div style={lobbyStyle}>

                <TabMenu
                    leaderboard={leaderboard}
                    botLeaderboard={botLeaderboard}
                    user={user}
                    searchedUser={searchedUser}
                    tabIndex={tabIndex}
                    //changeAvatar={changeAvatar.bind(this)}
                    //changeName={changeName.bind(this)}
                    //changeMap={changeMap.bind(this)}
                    //searchName={searchName.bind(this)}
                    // setTabIndex={setTabIndex.bind(this)}
                   // displayInfo={displayInfo.bind(this)}
                />
                <RoomMenu
                    allRooms={allRooms}
                    //createRoom={this.createRoom.bind(this)}
                    //joinRoom={this.joinRoom.bind(this)}
                />
                <CurrentUsers
                    users={users}
                    //displayInfo={this.displayInfo.bind(this)}
                />
                <Chat/>
                </div>
            </div>
        );
    };
}
