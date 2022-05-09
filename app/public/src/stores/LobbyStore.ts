import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LobbyUser, {ILobbyUser} from "../../../models/colyseus-models/lobby-user";
import Message from "../../../models/colyseus-models/message";
import LeaderboardInfo, { ILeaderboardInfo } from "../../../models/colyseus-models/leaderboard-info";
import { RoomAvailable } from "colyseus.js";
import { IMessage, IPreparationMetadata } from "../../../types";
import { IMeta } from "../../../models/mongo-models/meta";
import { IBot } from "../../../models/mongo-models/bot-v2";
import { IItemsStatistic } from "../../../models/mongo-models/items-statistic";
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata";
import PokemonConfig from "../../../models/colyseus-models/pokemon-config";
import { Synergy } from "../../../types/enum/Synergy";
import { IBotMonitoring } from "../../../models/mongo-models/bot-monitoring";

interface IUserLobbyState {
    messages: IMessage[];
    users: ILobbyUser[];
    leaderboard: ILeaderboardInfo[];
    botLeaderboard: ILeaderboardInfo[];
    user: ILobbyUser | undefined;
    searchedUser: ILobbyUser | undefined;
    tabIndex: number;
    allRooms: RoomAvailable[];
    botList: {name :string, avatar: string}[];
    meta: IMeta[];
    metaItems: IItemsStatistic[];
    pastebinUrl: string;
    botData: IBot;
    synergies: [Synergy, number][];
    pokemonCollection: IPokemonConfig[];
    boosterContent: string[];
    botMonitor: IBotMonitoring[];
}

const initialState: IUserLobbyState = {
    botMonitor: [],
    boosterContent: [],
    pokemonCollection: [],
    messages : [],
    users : [],
    leaderboard : [],
    botLeaderboard : [],
    user: undefined,
    tabIndex: 0,
    allRooms: [],
    searchedUser: undefined,
    botList: [],
    meta: [],
    metaItems: [],
    pastebinUrl: '',
    synergies: [],
    botData: {
        steps: [
          {
            'roundsRequired': 2,
            'board': [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          },
          {
            'roundsRequired': 2,
            'board':
            [
            ]
          }
        ],
        avatar:'ditto',
        author:'',
        elo: 1200,
        name: 'ditto'
      }
}

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: initialState,
    reducers: {
        pushMessage: (state, action: PayloadAction<Message>) => {
            const m: IMessage = JSON.parse(JSON.stringify(action.payload));
            state.messages.push(m);
        },
        pushLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            const l: ILeaderboardInfo = JSON.parse(JSON.stringify(action.payload));
            state.leaderboard.push(l);
        },
        pushBotLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            const l: ILeaderboardInfo = JSON.parse(JSON.stringify(action.payload));
            state.botLeaderboard.push(l);
        },
        addPokemonConfig: (state, action: PayloadAction<PokemonConfig>) => {
          state.pokemonCollection.push(JSON.parse(JSON.stringify(action.payload)));
        },
        changePokemonConfig: (state, action: PayloadAction<{id: string, field: string, value: any}>) => {
          const index = state.pokemonCollection.findIndex(p => p.id == action.payload.id);
          if(index != -1) {
            state.pokemonCollection[index][action.payload.field] = action.payload.value;
          }
        },
        addUser: (state, action: PayloadAction<LobbyUser>) => {
            const u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.users.push(u);
        },
        changeUser: (state, action: PayloadAction<{id: string, field: string, value: any}>) => {
            if(state.user && action.payload.id == state.user.id){
                state.user[action.payload.field] = action.payload.value;
            }
            const index = state.users.findIndex(u => u.id == action.payload.id);

            if(index != -1) {
              state.users[index][action.payload.field] = action.payload.value;
            }
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users.splice(state.users.findIndex(u => u.id == action.payload), 1);
        },
        setUser: (state, action: PayloadAction<LobbyUser>) => {
            const u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.user = u;
        },
        setTabIndex: (state, action: PayloadAction<number>) => {
            state.tabIndex = action.payload;
        },
        addRoom: (state, action: PayloadAction<RoomAvailable>) => {
          const metadata : IPreparationMetadata = action.payload.metadata;
          if(metadata && metadata.name) {
            const roomIndex = state.allRooms.findIndex((room) => room.roomId === action.payload.roomId);
            if (roomIndex !== -1) {
              state.allRooms[roomIndex] = action.payload;
          
            } else {
              state.allRooms.push(action.payload);
            }
          }
        },
        removeRoom: (state, action: PayloadAction<string>) => {
            state.allRooms = state.allRooms.filter((room) => room.roomId !== action.payload);
        },
        setSearchedUser: (state, action: PayloadAction<LobbyUser>) => {
            const u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.searchedUser = u;
        },
        setMeta: (state, action: PayloadAction<IMeta[]>) => {
            state.meta = action.payload;
        },
        setMetaItems: (state, action: PayloadAction<IItemsStatistic[]>) => {
            state.metaItems = action.payload;
        },
        setBotList: (state, action: PayloadAction<{name: string, avatar: string}[]>) => {
            state.botList = action.payload
        },
        setBotMonitor: (state, action: PayloadAction<IBotMonitoring[]>) => {
          state.botMonitor = action.payload;
        },
        setPastebinUrl: (state, action: PayloadAction<string>) => {
            state.pastebinUrl = action.payload;
        },
        setBotData: (state, action: PayloadAction<IBot>) => {
            state.botData = action.payload
        },
        setBotCreatorSynergies: (state, action: PayloadAction<Map<Synergy,number>>) => {
            state.synergies = Array.from(action.payload);
        },
        setBoosterContent: (state, action: PayloadAction<string[]>) => {
          state.boosterContent = action.payload;
        },
        leaveLobby: () => initialState
    }
});

export const {
    setBotMonitor,
    setBoosterContent,
    addPokemonConfig,
    changePokemonConfig,
    pushMessage,
    pushLeaderboard,
    pushBotLeaderboard,
    addUser,
    changeUser,
    removeUser,
    setUser,
    setTabIndex,
    addRoom,
    removeRoom,
    setSearchedUser,
    setMeta,
    setMetaItems,
    setBotList,
    setPastebinUrl,
    setBotData,
    leaveLobby,
    setBotCreatorSynergies
} = lobbySlice.actions;

export default lobbySlice.reducer;