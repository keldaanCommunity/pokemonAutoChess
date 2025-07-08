import { Client, Room, RoomAvailable } from "colyseus.js"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  ICustomLobbyState,
  IPreparationMetadata,
  Role,
  Transfer
} from "../../../../../types"
import { GameMode } from "../../../../../types/enum/Game"
import { block, throttle } from "../../../../../utils/function"
import { joinExistingPreparationRoom } from "../../../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { IngameRoomsList } from "./game-rooms-menu"
import RoomItem from "./room-item"
import { RoomSelectionMenu } from "./room-selection-menu"
import "./room-menu.css"

export default function RoomMenu() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )
  const ccu = useAppSelector((state) => state.lobby.ccu)

  const client: Client = useAppSelector((state) => state.network.client)
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const user = useAppSelector((state) => state.network.profile)
  const [showRoomSelectionMenu, setShowRoomSelectionMenu] =
    useState<boolean>(false)

  const requestRoom = throttle(async function (gameMode: GameMode) {
    if (lobby) {
      lobby.send(Transfer.REQUEST_ROOM, gameMode)
      setShowRoomSelectionMenu(false)
    }
  }, 1000)

  const requestJoiningExistingRoom = block(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    const password = selectedRoom.metadata?.password

    if (lobby) {
      if (password && user?.role === Role.BASIC) {
        const password = prompt(t("room_is_private"))
        if (password && selectedRoom.metadata?.password != password)
          return alert(t("wrong_password"))
        else if (!password) return
      }

      await joinExistingPreparationRoom(
        selectedRoom.roomId,
        client,
        lobby,
        dispatch,
        navigate
      )
    }
  })

  const onRoomAction = (
    room: RoomAvailable<IPreparationMetadata>,
    action: string
  ) => {
    if (action === "join") {
      requestJoiningExistingRoom(room)
    } else if (action === "delete" && user?.role === Role.ADMIN) {
      confirm("Delete room ?") && lobby?.send(Transfer.DELETE_ROOM, room.roomId)
    }
  }

  return (
    <Tabs className="my-container room-menu custom-bg hidden-scrollable">
      <h2>{t("rooms")}</h2>
      <p style={{ position: "absolute", right: "10px", top: "10px" }}>
        {t("players", { count: ccu })},{" "}
        {t("rooms", { count: preparationRooms.length })}
      </p>
      <TabList>
        <Tab>{t("available_rooms")}</Tab>
        <Tab>
          <img src="/assets/ui/quickplay.png" alt="" />
          <span>{t("quick_play")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/ranked.png" alt="" />
          <span>{t("ranked_match_short")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/scribble.png" alt="" />
          <span>{t("smeargle_scribble_short")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/custom.png" alt="" />
          <span>{t("custom_room_short")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/spectate.svg" alt="" />
          <span>{t("in_game")}</span>
        </Tab>
      </TabList>
      <TabPanel>
        <RoomList onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.QUICKPLAY} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.RANKED} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.SCRIBBLE} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList
          gameMode={GameMode.CUSTOM_LOBBY}
          onRoomAction={onRoomAction}
        />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList />
      </TabPanel>
      {!user && <p className="subtitle">{t("loading")}</p>}

      <RoomSelectionMenu
        show={showRoomSelectionMenu}
        onClose={() => setShowRoomSelectionMenu(false)}
        onSelectMode={(mode) => requestRoom(mode)}
      />
      <button
        onClick={() => setShowRoomSelectionMenu(true)}
        className="bubbly green play-button"
      >
        {t("new_game")}
      </button>
    </Tabs>
  )
}

export function RoomList({
  gameMode,
  onRoomAction
}: {
  gameMode?: GameMode
  onRoomAction: (room: RoomAvailable, action: string) => void
}) {
  const { t } = useTranslation()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )

  // Mock room data for testing
  const mockRooms: RoomAvailable[] = [
    {
      roomId: "mock-room-1",
      name: "preparation",
      clients: 4,
      maxClients: 8,
      metadata: {
        name: "DragonMaster's Battle Arena",
        ownerName: "DragonMaster",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: null,
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "POKE_BALL",
        maxRank: "ULTRA_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "DragonMaster [1250]",
          "FireTrainer [1180]",
          "WaterExpert [1220]",
          "GrassLover [1190]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-2",
      name: "preparation",
      clients: 6,
      maxClients: 8,
      metadata: {
        name: "Quick Battle Zone",
        ownerName: null,
        gameMode: GameMode.QUICKPLAY,
        password: null,
        noElo: true,
        type: "preparation",
        gameStartedAt: null,
        minRank: null,
        maxRank: null,
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "QuickPlayer1 [1100]",
          "FastBattler [1050]",
          "SpeedyFan [1080]",
          "RushExpert [1120]",
          "BlitzMaster [1060]",
          "TurboTrainer [1090]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-3",
      name: "preparation",
      clients: 2,
      maxClients: 8,
      metadata: {
        name: "Ranked Match",
        ownerName: null,
        gameMode: GameMode.RANKED,
        password: null,
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "SUPER_BALL",
        maxRank: "MASTER_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: ["ProPlayer [1450]", "EliteMaster [1520]"],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-4",
      name: "preparation",
      clients: 3,
      maxClients: 8,
      metadata: {
        name: "Smeargle's Scribble",
        ownerName: null,
        gameMode: GameMode.SCRIBBLE,
        password: null,
        noElo: true,
        type: "preparation",
        gameStartedAt: null,
        minRank: null,
        maxRank: null,
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "ArtistPlayer [1200]",
          "CreativeUser [1150]",
          "SketchMaster [1300]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-5",
      name: "preparation",
      clients: 8,
      maxClients: 8,
      metadata: {
        name: "Private Champions League",
        ownerName: "ChampionHost",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: "SECRET",
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "ULTRA_BALL",
        maxRank: "BEAST_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "ChampionHost [1800]",
          "LegendaryUser [1750]",
          "MythicalPlayer [1820]",
          "UltimateTrainer [1780]",
          "SupremeChamp [1850]",
          "MasterElite [1790]",
          "GrandMaster [1830]",
          "TopTierPro [1760]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-6",
      name: "preparation",
      clients: 1,
      maxClients: 8,
      metadata: {
        name: "Beginner's Paradise",
        ownerName: "NewbieGuide",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: null,
        noElo: true,
        type: "preparation",
        gameStartedAt: null,
        minRank: "LEVEL_BALL",
        maxRank: "NET_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: ["NewbieGuide [800]"],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-7",
      name: "preparation",
      clients: 5,
      maxClients: 8,
      metadata: {
        name: "Tournament Finals",
        ownerName: null,
        gameMode: GameMode.TOURNAMENT,
        password: null,
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: null,
        maxRank: null,
        whitelist: ["player1", "player2", "player3", "player4", "player5"],
        blacklist: [],
        playersInfo: [
          "TourneyWinner [1600]",
          "FinalsBound [1580]",
          "ChampionSeeker [1620]",
          "TrophyHunter [1590]",
          "GlorySeeker [1610]"
        ],
        tournamentId: "tournament-123",
        bracketId: "bracket-456"
      }
    },
    {
      roomId: "mock-room-8",
      name: "preparation",
      clients: 7,
      maxClients: 8,
      metadata: {
        name: "Casual Friday Fun",
        ownerName: "FridayHost",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: null,
        noElo: true,
        type: "preparation",
        gameStartedAt: null,
        minRank: null,
        maxRank: null,
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "FridayHost [1000]",
          "WeekendWarrior [980]",
          "CasualGamer [1020]",
          "RelaxedPlayer [990]",
          "FunSeeker [1010]",
          "ChillMaster [1005]",
          "EasyGoingPro [995]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-9",
      name: "preparation",
      clients: 2,
      maxClients: 8,
      metadata: {
        name: "Midnight Battles",
        ownerName: "NightOwl",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: "NIGHT",
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "SAFARI_BALL",
        maxRank: "LOVE_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: ["NightOwl [1350]", "LateNightGamer [1320]"],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-10",
      name: "preparation",
      clients: 4,
      maxClients: 8,
      metadata: {
        name: "International Championship",
        ownerName: "GlobalHost",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: null,
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "PREMIER_BALL",
        maxRank: "BEAST_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "GlobalHost [1500]",
          "WorldChampion [1650]",
          "InternationalPro [1550]",
          "GlobalElite [1600]"
        ],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-11",
      name: "preparation",
      clients: 1,
      maxClients: 8,
      metadata: {
        name: "Training Grounds",
        ownerName: "TrainingMaster",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: null,
        noElo: true,
        type: "preparation",
        gameStartedAt: null,
        minRank: null,
        maxRank: null,
        whitelist: [],
        blacklist: [],
        playersInfo: ["TrainingMaster [1100]"],
        tournamentId: null,
        bracketId: null
      }
    },
    {
      roomId: "mock-room-12",
      name: "preparation",
      clients: 6,
      maxClients: 8,
      metadata: {
        name: "Veterans Only",
        ownerName: "OldSchoolPro",
        gameMode: GameMode.CUSTOM_LOBBY,
        password: "VETERAN",
        noElo: false,
        type: "preparation",
        gameStartedAt: null,
        minRank: "QUICK_BALL",
        maxRank: "BEAST_BALL",
        whitelist: [],
        blacklist: [],
        playersInfo: [
          "OldSchoolPro [1400]",
          "RetroGamer [1420]",
          "ClassicPlayer [1380]",
          "VintageChamp [1440]",
          "SeasonedVet [1410]",
          "ExperiencedPro [1390]"
        ],
        tournamentId: null,
        bracketId: null
      }
    }
  ]

  // Combine real rooms with mock rooms for testing
  const allRooms = [...preparationRooms, ...mockRooms]

  return (
    <ul className="room-list hidden-scrollable">
      {allRooms
        .filter((r) => !gameMode || r.metadata.gameMode === gameMode)
        .map((r) => (
          <li key={r.roomId}>
            <RoomItem room={r} click={(action) => onRoomAction(r, action)} />
          </li>
        ))}
    </ul>
  )
}
