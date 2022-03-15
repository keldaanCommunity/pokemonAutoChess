import {ArraySchema, MapSchema} from '@colyseus/schema';
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info';
import LobbyUser from '../models/colyseus-models/lobby-user';
import Message from '../models/colyseus-models/message';

export interface IMessage {
    name: string;
    payload: string;
    avatar: string;
    time: number;
}

export interface ICustomLobbyState {
    messages : ArraySchema<Message>;
    users : MapSchema<LobbyUser>;
    leaderboard : ArraySchema<LeaderboardInfo>;
    botLeaderboard : ArraySchema<LeaderboardInfo>;
}

export interface IClientLobbyState {
    messages: any[],
    users: any,
    user: any,
    searchedUser: any,
    leaderboard: any[],
    botLeaderboard: any[],
    currentText: string,
    allRooms: any[],
    isSignedIn: boolean,
    preparationRoomId: string,
    tabIndex: number,
    showWiki: boolean,
    showBuilder: boolean,
    pasteBinUrl: string,
    botData: any,
    meta: any[],
    metaItems: any[],
    showMeta: boolean,
    botList: any[],
    roomCreated: boolean
}