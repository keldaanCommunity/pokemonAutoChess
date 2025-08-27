import { RoomAvailable } from "colyseus.js";
import { GameMode } from "../../types/enum/Game";

// Mock room data for testing
export const mockRooms: RoomAvailable[] = [
    {
        roomId: "mock-room-1",
        name: "preparation",
        clients: 4,
        maxClients: 8,
        metadata: {
            name: "DragonMaster's Battle Arena",
            ownerName: "DragonMaster",
            gameMode: GameMode.CUSTOM_LOBBY,
            passwordProtected: false,
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
            gameMode: GameMode.CLASSIC,
            passwordProtected: false,
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
            passwordProtected: false,
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
            passwordProtected: false,
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
            passwordProtected: true,
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
            passwordProtected: false,
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
            passwordProtected: false,
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
            passwordProtected: false,
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
            passwordProtected: true,
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
            passwordProtected: false,
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
            passwordProtected: false,
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
            passwordProtected: true,
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
