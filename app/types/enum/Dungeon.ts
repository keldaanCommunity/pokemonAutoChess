import { Synergy } from "./Synergy"

export enum DungeonMusic {
  AEGIS_CAVE = "Aegis Cave",
  AMP_PLAINS = "Amp Plains",
  A_NEW_WORLD = "A New World",
  APPLE_WOODS = "Apple Woods",
  AT_THE_SNOWY_MOUNTAIN = "At the Snowy Mountain",
  AT_THE_END_OF_THE_DAY = "At the End of the Day", // UNUSED
  BARREN_VALLEY = "Barren Valley",
  BATTLE_WITH_RAYQUAZA = "Battle with Rayquaza",
  BEACH_CAVE = "Beach Cave",
  BLIZZARD_ISLAND = "Blizzard Island Rescue Team Medley",
  BOSS_BATTLE = "Boss Battle!",
  BOULDER_QUARRY = "Boulder Quarry",
  BRINE_CAVE = "Brine Cave",
  BURIED_RELIC = "Burned Relic",
  CAVE_AND_SIDE_PATH = "Cave and Side Path",
  CHASM_CAVE = "Chasm Cave",
  CONCEALED_RUINS = "Concealed Ruins",
  CRAGGY_COAST = "Craggy Coast",
  CRYSTAL_CAVE = "Crystal Cave",
  CRYSTAL_CROSSING = "Crystal Crossing",
  DARK_CRATER = "Dark Crater",
  DARK_HILL = "Dark Hill",
  DARK_ICE_MOUNTAIN = "Dark Ice Mountain",
  DARK_WASTELAND = "Dark Wasteland",
  DEEP_DARK_CRATER = "Deep Dark Crater",
  DEEP_DUSK_FOREST = "Deep Dusk Forest",
  DEEP_STAR_CAVE = "Deep Star Cave",
  DEFY_THE_LEGENDS = "Defy the Legends",
  DRENCHED_BLUFF = "Drenched Bluff",
  DUN_HONOO_2 = "Dun Honoo 2",
  DUSK_FOREST = "Dusk Forest",
  ESCAPE_THROUGH_THE_SNOW = "Escape Through the Snow",
  FAR_AMP_PLAINS = "Far Amp Plains",
  FOGGY_FOREST = "Foggy Forest",
  FORTUNE_RAVINE = "Fortune Ravine",
  FORTUNE_RAVINE_DEPTHS = "Fortune Ravine Depths", // UNUSED
  FRIEND_AREA_CAVES = "Friend Area ~ Caves",
  FRIEND_AREA_FOREST = "Friend Area ~ Forest",
  FRIEND_AREA_GRASSLANDS = "Friend Area - Grasslands",
  FRIEND_AREA_OCEANIC = "Friend Area ~ Oceanic",
  FRIEND_AREA_LAB = "Friend Area - Lab",
  FRIEND_AREA_POND = "Friend Area - Pond",
  FRIEND_AREA_STEPPE = "Friend Area - Steppe",
  FRIEND_AREA_SWAMP = "Friend Area - Swamp",
  FRIEND_AREA_WILDS = "Friend Area - Wilds",
  FROSTY_FOREST = "Frosty Forest",
  FROSTY_GROTTO = "Frosty Grotto",
  GARDEVOIR_INSIDE_OF_A_DREAM = "Gardevoir Inside of a Dream",
  GOODNIGHT = "Goodnight",
  GREAT_CANYON = "Great Canyon",
  GROWING_ANXIETY = "Growing Anxiety",
  HIDDEN_HIGHLAND = "Hidden Highland",
  HIDDEN_LAND = "Hidden Land",
  I_SAW_SOMETHING_AGAIN = "I Saw Something Again",
  ICICLE_FOREST = "Icicle Forest",
  ILLUSION_STONE_CHAMBER = "Illusion Stone Chamber",
  IN_THE_FUTURE = "In the Future",
  IN_THE_HANDS_OF_FATE = "In the Hands of Fate", // UNUSED
  IN_THE_NIGHTMARE = "In the Nightmare",
  JOB_CLEAR = "Job Clear!",
  KECLEONS_SHOP = "Kecleon's Shop",
  LAPIS_CAVE = "Lapis Cave",
  LIMESTONE_CAVERN = "Limestone Cavern",
  LIVING_SPIRIT = "Living Spirit",
  LOWER_BRINE_CAVE = "Lower Brine Cave",
  LUDICOLO_DANCE = "Ludicolo Dance", // UNUSED
  MAGMA_CAVERN = "Magma Cavern",
  MAGMA_CAVERN_PIT = "Magma Cavern Pit",
  MAKUHITA_DOJO = "Makuhita Dojo",
  MAROWAK_DOJO = "Marowak Dojo",
  MIRACLE_SEA = "Miracle Sea",
  MONSTER_HOUSE = "Monster House!",
  MT_BLAZE = "Mt. Blaze",
  MT_BRISTLE = "Mt. Bristle",
  MT_FREEZE = "Mt. Freeze",
  MT_HORN = "Mt. Horn",
  MT_STEEL = "Mt. Steel",
  MT_THUNDER = "Mt. Thunder",
  MT_THUNDER_PEAK = "Mt. Thunder Peak",
  MT_TRAVAIL = "Mt. Travail",
  MURKY_FOREST = "Murky Forest",
  MYSTIFYING_FOREST = "Mystifying Forest",
  NORTHERN_DESERT = "Northern Desert",
  OH_NO = "Oh No!",
  ON_THE_BEACH_AT_DUSK = "On the Beach at Dusk",
  OUTLAW = "Outlaw!",
  PERSONALITY_TEST = "Personality Test",
  PLANETS_PARALYSIS = "Planet's Paralysis",
  POKEMON_SQUARE = "Pokemon Square",
  PROTECTED_WORLD_PEACE = "Protected World Peace",
  QUICKSAND_CAVE = "Quicksand Cave",
  QUICKSAND_PIT = "Quicksand Pit",
  RANDOM_DUNGEON_1 = "Random Dungeon 1",
  RANDOM_DUNGEON_2 = "Random Dungeon 2",
  RANDOM_DUNGEON_3 = "Random Dungeon 3",
  RESCUE_TEAM_BASE = "Rescue Team Base",
  RISING_FEAR = "Rising Fear",
  RUN_AWAY = "Run Away",
  SEALED_RUIN_PIT = "Sealed Ruin Pit",
  SHAYMIN_VILLAGE = "Shaymin Village",
  SILENT_CHASM = "Silent Chasm",
  SINISTER_WOODS = "Sinister Woods",
  SKY_PEAK_CAVE = "Sky Peak Cave",
  SKY_PEAK_COAST = "Sky Peak Coast",
  SKY_PEAK_FINAL_PASS = "Sky Peak Final Pass",
  SKY_PEAK_FOREST = "Sky Peak Forest",
  SKY_PEAK_PRAIRIE = "Sky Peak Prairie",
  SKY_PEAK_SNOWFIELD = "Sky Peak Snowfield",
  SKY_TOWER = "Sky Tower",
  SKY_TOWER_SUMMIT = "Sky Tower Summit",
  SOUTHERN_JUNGLE = "Southern Jungle",
  SPACIAL_CLIFFS = "Spacial Cliffs",
  SPINDA_CAFE = "Spinda's Cafe", // UNUSED
  SPRING_CAVE = "Spring Cave",
  SPRING_CAVE_DEPTHS = "Spring Cave Depths",
  STAFF_ROLL = "Staff Roll",
  STAR_CAVE = "Star Cave",
  STEAM_CAVE = "Steam Cave",
  STOP_THIEF = "Stop! Thief!",
  STORMY_SEA = "Stormy Sea",
  SURROUNDED_SEA = "Surrounded Sea",
  TEAM_CHARM_THEME = "Team Charm's Theme",
  TEAM_SKULL = "Team Skull",
  TEMPORAL_PINNACLE = "Temporal Pinnacle",
  TEMPORAL_SPIRE = "Temporal Spire",
  TEMPORAL_TOWER = "Temporal Tower",
  THE_LEGEND_OF_NINETALES = "The Legend of Ninetales",
  THE_POWER_OF_DARKNESS = "The Power of Darkness",
  THERES_TROUBLE = "There's Trouble!",
  THROUGH_THE_SEA_OF_TIME = "Through the Sea of Time",
  THUNDERWAVE_CAVE = "Thunderwave Cave",
  TIME_GEAR = "Time Gear",
  TIME_GEAR_REMIX = "Time Gear Remix",
  TINY_WOODS = "Tiny Woods",
  TOP_MENU_THEME = "Top Menu Theme",
  TREASURE_TOWN = "Treasure Town",
  TREESHROUD_FOREST = "Treeshroud Forest",
  UPPER_STEAM_CAVE = "Upper Steam Cave",
  VAST_ICE_MOUNTAIN = "Vast Ice Mountain",
  VAST_ICE_MOUNTAIN_PEAK = "Vast Ice Mountain Peak",
  VERSUS_BOSS = "Versus Boss",
  VERSUS_LEGENDARY = "Versus Legendary",
  WATERFALL_CAVE = "Waterfall Cave",
  WELCOME_TO_THE_WORLD_OF_POKEMON = "Welcome To the World of Pokemon!",
  WIGGLYTUFFS_GUILD = "Wigglytuff's Guild",
  WIGGLYTUFFS_GUILD_REMIX = "Wigglytuff's Guild Remix",
  WORLD_CALAMITY = "World Calamity"
}

export enum DungeonPMDO {
  AmpPlains = "AmpPlains",
  AppleWoods = "AppleWoods",
  BarrenValley = "BarrenValley",
  BeachCave = "BeachCave",
  BrineCave = "BrineCave",
  BuriedRelic1 = "BuriedRelic1",
  BuriedRelic2 = "BuriedRelic2",
  BuriedRelic3 = "BuriedRelic3",
  ConcealedRuins = "ConcealedRuins",
  CraggyCoast = "CraggyCoast",
  CrystalCave1 = "CrystalCave1",
  CrystalCave2 = "CrystalCave2",
  CrystalCrossing = "CrystalCrossing",
  DarkCrater = "DarkCrater",
  DarkHill1 = "DarkHill1",
  DarkHill2 = "DarkHill2",
  DarkIceMountain = "DarkIceMountain",
  DarkIceMountainPeak = "DarkIceMountainPeak",
  DarknightRelic = "DarknightRelic",
  DarkWasteland = "DarkWasteland",
  DeepBoulderQuarry = "DeepBoulderQuarry",
  DeepDarkCrater = "DeepDarkCrater",
  DeepDuskForest1 = "DeepDuskForest1",
  DeepDuskForest2 = "DeepDuskForest2",
  DeepLimestoneCavern = "DeepLimestoneCavern",
  DeepSealedRuin = "DeepSealedRuin",
  DesertRegion = "DesertRegion",
  DrenchedBluff = "DrenchedBluff",
  DuskForest1 = "DuskForest1",
  DuskForest2 = "DuskForest2",
  ElectricMaze = "ElectricMaze",
  FarAmpPlains = "FarAmpPlains",
  FinalMaze2 = "FinalMaze2",
  FoggyForest = "FoggyForest",
  ForestPath = "ForestPath",
  FrostyForest = "FrostyForest",
  FutureTemporalSpire = "FutureTemporalSpire",
  FutureTemporalTower = "FutureTemporalTower",
  GoldenChamber = "GoldenChamber",
  GrassMaze = "GrassMaze",
  GreatCanyon = "GreatCanyon",
  HiddenHighland = "HiddenHighland",
  HiddenLand = "HiddenLand",
  HowlingForest1 = "HowlingForest1",
  HowlingForest2 = "HowlingForest2",
  IceAegisCave = "IceAegisCave",
  IceMaze = "IceMaze",
  IcicleForest = "IcicleForest",
  JoyousTower = "JoyousTower",
  LapisCave = "LapisCave",
  LightningField = "LightningField",
  LimestoneCavern = "LimestoneCavern",
  LowerBrineCave = "LowerBrineCave",
  LushPrairie = "LushPrairie",
  MagmaCavern2 = "MagmaCavern2",
  MagmaCavern3 = "MagmaCavern3",
  MeteorCave = "MeteorCave",
  MiracleSea = "MiracleSea",
  MoonlitCourtyard = "MoonlitCourtyard",
  MtBlaze = "MtBlaze",
  MtBristle = "MtBristle",
  MtFaraway2 = "MtFaraway2",
  MtFaraway4 = "MtFaraway4",
  MtFreeze = "MtFreeze",
  MtHorn = "MtHorn",
  MtSteel1 = "MtSteel1",
  MtSteel2 = "MtSteel2",
  MtThunder = "MtThunder",
  MtThunderPeak = "MtThunderPeak",
  MtTravail = "MtTravail",
  MurkyCave = "MurkyCave",
  MurkyForest = "MurkyForest",
  MysteryJungle1 = "MysteryJungle1",
  MysteryJungle2 = "MysteryJungle2",
  MystifyingForest = "MystifyingForest",
  NorthernDesert1 = "NorthernDesert1",
  NorthernDesert2 = "NorthernDesert2",
  NorthernRange1 = "NorthernRange1",
  NorthernRange2 = "NorthernRange2",
  NorthwindField = "NorthwindField",
  PitfallValley1 = "PitfallValley1",
  PoisonMaze = "PoisonMaze",
  PurityForest2 = "PurityForest2",
  PurityForest4 = "PurityForest4",
  PurityForest6 = "PurityForest6",
  PurityForest7 = "PurityForest7",
  QuicksandCave = "QuicksandCave",
  QuicksandPit = "QuicksandPit",
  QuicksandUnused = "QuicksandUnused",
  RescueTeamMaze = "RescueTeamMaze",
  RockAegisCave = "RockAegisCave",
  RockMaze = "RockMaze",
  RockPathRB = "RockPathRB",
  RockPathTDS = "RockPathTDS",
  SealedRuin = "SealedRuin",
  SidePath = "SidePath",
  SilentChasm = "SilentChasm",
  SkyPeak4thPass = "SkyPeak4thPass",
  SkyPeak7thPass = "SkyPeak7thPass",
  SkyPeakSummitPass = "SkyPeakSummitPass",
  SkyTower = "SkyTower",
  SnowPath = "SnowPath",
  SolarCave1 = "SolarCave1",
  SouthernCavern1 = "SouthernCavern1",
  SouthernCavern2 = "SouthernCavern2",
  SouthernJungle = "SouthernJungle",
  SpacialCliffs = "SpacialCliffs",
  SpacialRift1 = "SpacialRift1",
  SpacialRift2 = "SpacialRift2",
  SteamCave = "SteamCave",
  SteelAegisCave = "SteelAegisCave",
  StormySea1 = "StormySea1",
  StormySea2 = "StormySea2",
  SurroundedSea = "SurroundedSea",
  TemporalSpire = "TemporalSpire",
  TemporalTower = "TemporalTower",
  TemporalUnused = "TemporalUnused",
  TestDungeon = "TestDungeon",
  TheNightmare = "TheNightmare",
  ThunderwaveCave = "ThunderwaveCave",
  TinyMeadow = "TinyMeadow",
  TinyWoods = "TinyWoods",
  TreeshroudForest1 = "TreeshroudForest1",
  TreeshroudForest2 = "TreeshroudForest2",
  UnusedBrineCave = "UnusedBrineCave",
  UnusedSteamCave = "UnusedSteamCave",
  UnusedWaterfallPond = "UnusedWaterfallPond",
  UproarForest = "UproarForest",
  VastIceMountain = "VastIceMountain",
  VastIceMountainPeak = "VastIceMountainPeak",
  WaterfallCave = "WaterfallCave",
  WaterfallPond = "WaterfallPond",
  WaterMaze = "WaterMaze",
  WesternCave1 = "WesternCave1",
  WesternCave2 = "WesternCave2",
  WishCave1 = "WishCave1",
  WishCave2 = "WishCave2",
  WorldAbyss2 = "WorldAbyss2",
  WyvernHill = "WyvernHill",
  ZeroIsleEast3 = "ZeroIsleEast3",
  ZeroIsleEast4 = "ZeroIsleEast4",
  ZeroIsleSouth1 = "ZeroIsleSouth1",
  ZeroIsleSouth2 = "ZeroIsleSouth2"
}

export enum RegionPokemon {
  KANTO = "KANTO",
  JOHTO = "JOHTO",
  HOENN = "HOENN",
  SINNOH = "SINNOH",
  UNYS = "UNYS",
  KALOS = "KALOS",
  ALOLA = "ALOLA",
  GALAR = "GALAR",
  PALDEA = "PALDEA"
}

export interface DungeonPMDODetail {
  synergies: Synergy[]
  region: RegionPokemon
  music: DungeonMusic
}
export const DungeonDetails: { [key in DungeonPMDO]: DungeonPMDODetail } = {
  [DungeonPMDO.AmpPlains]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.AQUATIC],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.AMP_PLAINS
  },
  [DungeonPMDO.AppleWoods]: {
    synergies: [Synergy.BUG, Synergy.FLORA, Synergy.BABY],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.APPLE_WOODS
  },
  [DungeonPMDO.BarrenValley]: {
    synergies: [Synergy.ROCK, Synergy.FIGHTING, Synergy.GHOST],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.BARREN_VALLEY
  },
  [DungeonPMDO.BeachCave]: {
    synergies: [Synergy.AQUATIC, Synergy.GROUND, Synergy.FOSSIL],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.BEACH_CAVE
  },
  [DungeonPMDO.BrineCave]: {
    synergies: [Synergy.POISON, Synergy.FOSSIL, Synergy.GROUND],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.BRINE_CAVE
  },
  [DungeonPMDO.BuriedRelic1]: {
    synergies: [Synergy.LIGHT, Synergy.ARTIFICIAL, Synergy.HUMAN],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.BURIED_RELIC
  },
  [DungeonPMDO.BuriedRelic2]: {
    synergies: [Synergy.GROUND, Synergy.ARTIFICIAL, Synergy.LIGHT],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.TIME_GEAR_REMIX
  },
  [DungeonPMDO.BuriedRelic3]: {
    synergies: [Synergy.GROUND, Synergy.ARTIFICIAL, Synergy.HUMAN],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.TIME_GEAR
  },
  [DungeonPMDO.ConcealedRuins]: {
    synergies: [Synergy.POISON, Synergy.WILD, Synergy.GHOST],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.CONCEALED_RUINS
  },
  [DungeonPMDO.CraggyCoast]: {
    synergies: [Synergy.WATER, Synergy.FIGHTING, Synergy.MONSTER],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.CRAGGY_COAST
  },
  [DungeonPMDO.CrystalCave1]: {
    synergies: [Synergy.PSYCHIC, Synergy.SOUND, Synergy.DARK],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.CRYSTAL_CAVE
  },
  [DungeonPMDO.CrystalCave2]: {
    synergies: [Synergy.PSYCHIC, Synergy.SOUND, Synergy.LIGHT],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.STAFF_ROLL
  },
  [DungeonPMDO.CrystalCrossing]: {
    synergies: [Synergy.PSYCHIC, Synergy.AQUATIC, Synergy.POISON],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.CRYSTAL_CROSSING
  },
  [DungeonPMDO.DarkCrater]: {
    synergies: [Synergy.DARK, Synergy.FIRE, Synergy.GROUND],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.DARK_CRATER
  },
  [DungeonPMDO.DarkHill1]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.FLYING],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.DARK_HILL
  },
  [DungeonPMDO.DarkHill2]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.FIELD],
    region: RegionPokemon.KANTO,
    music: DungeonMusic.I_SAW_SOMETHING_AGAIN
  },
  [DungeonPMDO.DarkIceMountain]: {
    synergies: [Synergy.DARK, Synergy.ICE, Synergy.NORMAL],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DARK_ICE_MOUNTAIN
  },
  [DungeonPMDO.DarkIceMountainPeak]: {
    synergies: [Synergy.DARK, Synergy.ICE, Synergy.FLYING],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.AT_THE_SNOWY_MOUNTAIN
  },
  [DungeonPMDO.DarknightRelic]: {
    synergies: [Synergy.FOSSIL, Synergy.ARTIFICIAL, Synergy.HUMAN],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DARK_WASTELAND
  },
  [DungeonPMDO.DarkWasteland]: {
    synergies: [Synergy.DARK, Synergy.POISON, Synergy.MONSTER],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.CHASM_CAVE
  },
  [DungeonPMDO.DeepBoulderQuarry]: {
    synergies: [Synergy.ROCK, Synergy.STEEL, Synergy.FOSSIL],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.BOULDER_QUARRY
  },
  [DungeonPMDO.DeepDarkCrater]: {
    synergies: [Synergy.DARK, Synergy.FIRE, Synergy.MONSTER],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DEEP_DARK_CRATER
  },
  [DungeonPMDO.DeepDuskForest1]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.DARK],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DEEP_DUSK_FOREST
  },
  [DungeonPMDO.DeepDuskForest2]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.LIGHT],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.GROWING_ANXIETY
  },
  [DungeonPMDO.DeepLimestoneCavern]: {
    synergies: [Synergy.WATER, Synergy.BUG, Synergy.ROCK],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.PROTECTED_WORLD_PEACE
  },
  [DungeonPMDO.DeepSealedRuin]: {
    synergies: [Synergy.HUMAN, Synergy.ARTIFICIAL, Synergy.MONSTER],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.SEALED_RUIN_PIT
  },
  [DungeonPMDO.DesertRegion]: {
    synergies: [Synergy.FIRE, Synergy.FIELD, Synergy.LIGHT],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DUN_HONOO_2
  },
  [DungeonPMDO.DrenchedBluff]: {
    synergies: [Synergy.AQUATIC, Synergy.FOSSIL, Synergy.BABY],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DRENCHED_BLUFF
  },
  [DungeonPMDO.DuskForest1]: {
    synergies: [Synergy.MONSTER, Synergy.GRASS, Synergy.DARK],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.DUSK_FOREST
  },
  [DungeonPMDO.DuskForest2]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.FLORA],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.SINISTER_WOODS
  },
  [DungeonPMDO.ElectricMaze]: {
    synergies: [Synergy.ELECTRIC, Synergy.MONSTER, Synergy.LIGHT],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.STOP_THIEF
  },
  [DungeonPMDO.FarAmpPlains]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.FOSSIL],
    region: RegionPokemon.JOHTO,
    music: DungeonMusic.FAR_AMP_PLAINS
  },
  [DungeonPMDO.FinalMaze2]: {
    synergies: [Synergy.BABY, Synergy.FLORA, Synergy.BUG],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.FRIEND_AREA_CAVES
  },
  [DungeonPMDO.FoggyForest]: {
    synergies: [Synergy.FAIRY, Synergy.WILD, Synergy.FLORA],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.FOGGY_FOREST
  },
  [DungeonPMDO.ForestPath]: {
    synergies: [Synergy.GRASS, Synergy.BUG, Synergy.BABY],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.SKY_PEAK_FOREST
  },
  [DungeonPMDO.FrostyForest]: {
    synergies: [Synergy.LIGHT, Synergy.ICE, Synergy.FIGHTING],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.FROSTY_FOREST
  },
  [DungeonPMDO.FutureTemporalSpire]: {
    synergies: [Synergy.HUMAN, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.BATTLE_WITH_RAYQUAZA
  },
  [DungeonPMDO.FutureTemporalTower]: {
    synergies: [Synergy.MONSTER, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.TEMPORAL_TOWER
  },
  [DungeonPMDO.GoldenChamber]: {
    synergies: [Synergy.LIGHT, Synergy.STEEL, Synergy.DRAGON],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.OUTLAW
  },
  [DungeonPMDO.GrassMaze]: {
    synergies: [Synergy.GRASS, Synergy.FIELD, Synergy.NORMAL],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.MAKUHITA_DOJO
  },
  [DungeonPMDO.GreatCanyon]: {
    synergies: [Synergy.NORMAL, Synergy.WILD, Synergy.FIRE],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.GREAT_CANYON
  },
  [DungeonPMDO.HiddenHighland]: {
    synergies: [Synergy.FLORA, Synergy.BABY, Synergy.BUG],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.HIDDEN_HIGHLAND
  },
  [DungeonPMDO.HiddenLand]: {
    synergies: [Synergy.FLORA, Synergy.WILD, Synergy.WATER],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.HIDDEN_LAND
  },
  [DungeonPMDO.HowlingForest1]: {
    synergies: [Synergy.SOUND, Synergy.FIELD, Synergy.BUG],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.RANDOM_DUNGEON_2
  },
  [DungeonPMDO.HowlingForest2]: {
    synergies: [Synergy.SOUND, Synergy.POISON, Synergy.FOSSIL],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.FRIEND_AREA_FOREST
  },
  [DungeonPMDO.IceAegisCave]: {
    synergies: [Synergy.ICE, Synergy.FIGHTING, Synergy.DARK],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.ILLUSION_STONE_CHAMBER
  },
  [DungeonPMDO.IceMaze]: {
    synergies: [Synergy.ICE, Synergy.STEEL, Synergy.FIGHTING],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.TOP_MENU_THEME
  },
  [DungeonPMDO.IcicleForest]: {
    synergies: [Synergy.ICE, Synergy.FIELD, Synergy.FIGHTING],
    region: RegionPokemon.HOENN,
    music: DungeonMusic.ICICLE_FOREST
  },
  [DungeonPMDO.JoyousTower]: {
    synergies: [Synergy.LIGHT, Synergy.FAIRY, Synergy.BABY],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.A_NEW_WORLD
  },
  [DungeonPMDO.LapisCave]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.FOSSIL],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.LAPIS_CAVE
  },
  [DungeonPMDO.LightningField]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.LIGHT],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.OH_NO
  },
  [DungeonPMDO.LimestoneCavern]: {
    synergies: [Synergy.ROCK, Synergy.BUG, Synergy.AQUATIC],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.LIMESTONE_CAVERN
  },
  [DungeonPMDO.LowerBrineCave]: {
    synergies: [Synergy.AQUATIC, Synergy.FOSSIL, Synergy.WILD],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.LOWER_BRINE_CAVE
  },
  [DungeonPMDO.LushPrairie]: {
    synergies: [Synergy.BUG, Synergy.BABY, Synergy.FLORA],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.WELCOME_TO_THE_WORLD_OF_POKEMON
  },
  [DungeonPMDO.MagmaCavern2]: {
    synergies: [Synergy.FIRE, Synergy.FIGHTING, Synergy.MONSTER],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MAGMA_CAVERN
  },
  [DungeonPMDO.MagmaCavern3]: {
    synergies: [Synergy.FIRE, Synergy.DRAGON, Synergy.MONSTER],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MAGMA_CAVERN_PIT
  },
  [DungeonPMDO.MeteorCave]: {
    synergies: [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.RANDOM_DUNGEON_1
  },
  [DungeonPMDO.MiracleSea]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.FAIRY],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MIRACLE_SEA
  },
  [DungeonPMDO.MoonlitCourtyard]: {
    synergies: [Synergy.FAIRY, Synergy.FLORA, Synergy.DARK],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.GOODNIGHT
  },
  [DungeonPMDO.MtBlaze]: {
    synergies: [Synergy.FIRE, Synergy.FLYING, Synergy.WILD],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MT_BLAZE
  },
  [DungeonPMDO.MtBristle]: {
    synergies: [Synergy.ELECTRIC, Synergy.FLYING, Synergy.MONSTER],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MT_BRISTLE
  },
  [DungeonPMDO.MtFaraway2]: {
    synergies: [Synergy.ICE, Synergy.FLYING, Synergy.DRAGON],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.FROSTY_GROTTO
  },
  [DungeonPMDO.MtFaraway4]: {
    synergies: [Synergy.ICE, Synergy.FLYING, Synergy.SOUND],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.ESCAPE_THROUGH_THE_SNOW
  },
  [DungeonPMDO.MtFreeze]: {
    synergies: [Synergy.ICE, Synergy.FLYING, Synergy.NORMAL],
    region: RegionPokemon.SINNOH,
    music: DungeonMusic.MT_FREEZE
  },
  [DungeonPMDO.MtHorn]: {
    synergies: [Synergy.ROCK, Synergy.FLYING, Synergy.SOUND],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MT_HORN
  },
  [DungeonPMDO.MtSteel1]: {
    synergies: [Synergy.STEEL, Synergy.FLYING, Synergy.FIGHTING],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MT_STEEL
  },
  [DungeonPMDO.MtSteel2]: {
    synergies: [Synergy.STEEL, Synergy.FLYING, Synergy.FIGHTING],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.BOSS_BATTLE
  },
  [DungeonPMDO.MtThunder]: {
    synergies: [Synergy.ELECTRIC, Synergy.ROCK, Synergy.STEEL],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MT_THUNDER
  },
  [DungeonPMDO.MtThunderPeak]: {
    synergies: [Synergy.ELECTRIC, Synergy.FLYING, Synergy.WILD],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MT_THUNDER_PEAK
  },
  [DungeonPMDO.MtTravail]: {
    synergies: [Synergy.FIGHTING, Synergy.HUMAN, Synergy.FOSSIL],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MT_TRAVAIL
  },
  [DungeonPMDO.MurkyCave]: {
    synergies: [Synergy.POISON, Synergy.GROUND, Synergy.HUMAN],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MONSTER_HOUSE
  },
  [DungeonPMDO.MurkyForest]: {
    synergies: [Synergy.POISON, Synergy.GRASS, Synergy.DARK],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MURKY_FOREST
  },
  [DungeonPMDO.MysteryJungle1]: {
    synergies: [Synergy.WILD, Synergy.FLORA, Synergy.POISON],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.FRIEND_AREA_STEPPE
  },
  [DungeonPMDO.MysteryJungle2]: {
    synergies: [Synergy.WILD, Synergy.FAIRY, Synergy.POISON],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.BLIZZARD_ISLAND
  },
  [DungeonPMDO.MystifyingForest]: {
    synergies: [Synergy.BABY, Synergy.FAIRY, Synergy.FLORA],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.MYSTIFYING_FOREST
  },
  [DungeonPMDO.NorthernDesert1]: {
    synergies: [Synergy.DRAGON, Synergy.FIRE, Synergy.LIGHT],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.NORTHERN_DESERT
  },
  [DungeonPMDO.NorthernDesert2]: {
    synergies: [Synergy.DRAGON, Synergy.FIRE, Synergy.WILD],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.NORTHERN_DESERT
  },
  [DungeonPMDO.NorthernRange1]: {
    synergies: [Synergy.POISON, Synergy.AQUATIC, Synergy.STEEL],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.FORTUNE_RAVINE
  },
  [DungeonPMDO.NorthernRange2]: {
    synergies: [Synergy.MONSTER, Synergy.FIGHTING, Synergy.STEEL],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.TEAM_SKULL
  },
  [DungeonPMDO.NorthwindField]: {
    synergies: [Synergy.WATER, Synergy.FIELD, Synergy.SOUND],
    region: RegionPokemon.UNYS,
    music: DungeonMusic.THROUGH_THE_SEA_OF_TIME
  },
  [DungeonPMDO.PitfallValley1]: {
    synergies: [Synergy.FIELD, Synergy.HUMAN, Synergy.BABY],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.PERSONALITY_TEST
  },
  [DungeonPMDO.PoisonMaze]: {
    synergies: [Synergy.POISON, Synergy.PSYCHIC, Synergy.BUG],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.RANDOM_DUNGEON_3
  },
  [DungeonPMDO.PurityForest2]: {
    synergies: [Synergy.BABY, Synergy.FAIRY, Synergy.FLORA],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.RUN_AWAY
  },
  [DungeonPMDO.PurityForest4]: {
    synergies: [Synergy.NORMAL, Synergy.WILD, Synergy.FAIRY],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.POKEMON_SQUARE
  },
  [DungeonPMDO.PurityForest6]: {
    synergies: [Synergy.NORMAL, Synergy.GRASS, Synergy.BABY],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.SHAYMIN_VILLAGE
  },
  [DungeonPMDO.PurityForest7]: {
    synergies: [Synergy.GRASS, Synergy.BABY, Synergy.SOUND],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.ON_THE_BEACH_AT_DUSK
  },
  [DungeonPMDO.QuicksandCave]: {
    synergies: [Synergy.GROUND, Synergy.FOSSIL, Synergy.NORMAL],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.QUICKSAND_CAVE
  },
  [DungeonPMDO.QuicksandPit]: {
    synergies: [Synergy.GROUND, Synergy.FOSSIL, Synergy.MONSTER],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.QUICKSAND_PIT
  },
  [DungeonPMDO.QuicksandUnused]: {
    synergies: [Synergy.GROUND, Synergy.NORMAL, Synergy.POISON],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.THERES_TROUBLE
  },
  [DungeonPMDO.RescueTeamMaze]: {
    synergies: [Synergy.FIGHTING, Synergy.HUMAN, Synergy.ARTIFICIAL],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.RESCUE_TEAM_BASE
  },
  [DungeonPMDO.RockAegisCave]: {
    synergies: [Synergy.ROCK, Synergy.GHOST, Synergy.FIGHTING],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.FRIEND_AREA_SWAMP
  },
  [DungeonPMDO.RockMaze]: {
    synergies: [Synergy.ROCK, Synergy.STEEL, Synergy.FIGHTING],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.DEFY_THE_LEGENDS
  },
  [DungeonPMDO.RockPathRB]: {
    synergies: [Synergy.ROCK, Synergy.FIELD, Synergy.FOSSIL],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.RISING_FEAR
  },
  [DungeonPMDO.RockPathTDS]: {
    synergies: [Synergy.ROCK, Synergy.FIELD, Synergy.MONSTER],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.FRIEND_AREA_POND
  },
  [DungeonPMDO.SealedRuin]: {
    synergies: [Synergy.HUMAN, Synergy.DRAGON, Synergy.GHOST],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.THE_LEGEND_OF_NINETALES
  },
  [DungeonPMDO.SidePath]: {
    synergies: [Synergy.NORMAL, Synergy.FIELD, Synergy.STEEL],
    region: RegionPokemon.KALOS,
    music: DungeonMusic.CAVE_AND_SIDE_PATH
  },
  [DungeonPMDO.SilentChasm]: {
    synergies: [Synergy.FIRE, Synergy.LIGHT, Synergy.WILD],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SILENT_CHASM
  },
  [DungeonPMDO.SkyPeak4thPass]: {
    synergies: [Synergy.GRASS, Synergy.FLORA, Synergy.BABY],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_PEAK_COAST
  },
  [DungeonPMDO.SkyPeak7thPass]: {
    synergies: [Synergy.ICE, Synergy.DRAGON, Synergy.FAIRY],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_PEAK_CAVE
  },
  [DungeonPMDO.SkyPeakSummitPass]: {
    synergies: [Synergy.DARK, Synergy.STEEL, Synergy.ROCK],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_TOWER_SUMMIT
  },
  [DungeonPMDO.SkyTower]: {
    synergies: [Synergy.FLYING, Synergy.LIGHT, Synergy.FAIRY],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_TOWER
  },
  [DungeonPMDO.SnowPath]: {
    synergies: [Synergy.ICE, Synergy.FIELD, Synergy.NORMAL],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_PEAK_SNOWFIELD
  },
  [DungeonPMDO.SolarCave1]: {
    synergies: [Synergy.PSYCHIC, Synergy.FIRE, Synergy.SOUND],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SKY_PEAK_PRAIRIE
  },
  [DungeonPMDO.SouthernCavern1]: {
    synergies: [Synergy.STEEL, Synergy.POISON, Synergy.ARTIFICIAL],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SPRING_CAVE
  },
  [DungeonPMDO.SouthernCavern2]: {
    synergies: [Synergy.FAIRY, Synergy.AQUATIC, Synergy.POISON],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SPRING_CAVE_DEPTHS
  },
  [DungeonPMDO.SouthernJungle]: {
    synergies: [Synergy.WILD, Synergy.FLORA, Synergy.GRASS],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SOUTHERN_JUNGLE
  },
  [DungeonPMDO.SpacialCliffs]: {
    synergies: [Synergy.GHOST, Synergy.ROCK, Synergy.ELECTRIC],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.SPACIAL_CLIFFS
  },
  [DungeonPMDO.SpacialRift1]: {
    synergies: [Synergy.GHOST, Synergy.ARTIFICIAL, Synergy.MONSTER],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.IN_THE_FUTURE
  },
  [DungeonPMDO.SpacialRift2]: {
    synergies: [Synergy.GHOST, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.PLANETS_PARALYSIS
  },
  [DungeonPMDO.SteamCave]: {
    synergies: [Synergy.FIRE, Synergy.GROUND, Synergy.ELECTRIC],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.STEAM_CAVE
  },
  [DungeonPMDO.SteelAegisCave]: {
    synergies: [Synergy.STEEL, Synergy.NORMAL, Synergy.FIGHTING],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.AEGIS_CAVE
  },
  [DungeonPMDO.StormySea1]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.ELECTRIC],
    region: RegionPokemon.ALOLA,
    music: DungeonMusic.STORMY_SEA
  },
  [DungeonPMDO.StormySea2]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.SOUND],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.FRIEND_AREA_OCEANIC
  },
  [DungeonPMDO.SurroundedSea]: {
    synergies: [Synergy.WATER, Synergy.DRAGON, Synergy.ICE],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.SURROUNDED_SEA
  },
  [DungeonPMDO.TemporalSpire]: {
    synergies: [Synergy.HUMAN, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.TEMPORAL_SPIRE
  },
  [DungeonPMDO.TemporalTower]: {
    synergies: [Synergy.HUMAN, Synergy.STEEL, Synergy.ARTIFICIAL],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.GARDEVOIR_INSIDE_OF_A_DREAM
  },
  [DungeonPMDO.TemporalUnused]: {
    synergies: [Synergy.NORMAL, Synergy.FOSSIL, Synergy.ARTIFICIAL],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.TEMPORAL_PINNACLE
  },
  [DungeonPMDO.TestDungeon]: {
    synergies: [Synergy.ARTIFICIAL, Synergy.ELECTRIC, Synergy.PSYCHIC],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.FRIEND_AREA_LAB
  },
  [DungeonPMDO.TheNightmare]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.PSYCHIC],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.THE_POWER_OF_DARKNESS
  },
  [DungeonPMDO.ThunderwaveCave]: {
    synergies: [Synergy.ELECTRIC, Synergy.GROUND, Synergy.LIGHT],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.THUNDERWAVE_CAVE
  },
  [DungeonPMDO.TinyMeadow]: {
    synergies: [Synergy.GRASS, Synergy.BABY, Synergy.NORMAL],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.FRIEND_AREA_GRASSLANDS
  },
  [DungeonPMDO.TinyWoods]: {
    synergies: [Synergy.BUG, Synergy.BABY, Synergy.NORMAL],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.TINY_WOODS
  },
  [DungeonPMDO.TreeshroudForest1]: {
    synergies: [Synergy.GRASS, Synergy.WATER, Synergy.BUG],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.TREESHROUD_FOREST
  },
  [DungeonPMDO.TreeshroudForest2]: {
    synergies: [Synergy.GRASS, Synergy.AQUATIC, Synergy.BABY],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.FRIEND_AREA_WILDS
  },
  [DungeonPMDO.UnusedBrineCave]: {
    synergies: [Synergy.WATER, Synergy.GROUND, Synergy.DRAGON],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.IN_THE_NIGHTMARE
  },
  [DungeonPMDO.UnusedSteamCave]: {
    synergies: [Synergy.FIRE, Synergy.WATER, Synergy.ELECTRIC],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.UPPER_STEAM_CAVE
  },
  [DungeonPMDO.UnusedWaterfallPond]: {
    synergies: [Synergy.AQUATIC, Synergy.BUG, Synergy.WILD],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.DEEP_STAR_CAVE
  },
  [DungeonPMDO.UproarForest]: {
    synergies: [Synergy.WILD, Synergy.FIELD, Synergy.SOUND],
    region: RegionPokemon.GALAR,
    music: DungeonMusic.TREASURE_TOWN
  },
  [DungeonPMDO.VastIceMountain]: {
    synergies: [Synergy.DRAGON, Synergy.ICE, Synergy.ROCK],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.VAST_ICE_MOUNTAIN
  },
  [DungeonPMDO.VastIceMountainPeak]: {
    synergies: [Synergy.DRAGON, Synergy.ICE, Synergy.FLYING],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.VAST_ICE_MOUNTAIN_PEAK
  },
  [DungeonPMDO.WaterfallCave]: {
    synergies: [Synergy.WATER, Synergy.GROUND, Synergy.SOUND],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.MAROWAK_DOJO
  },
  [DungeonPMDO.WaterfallPond]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.SOUND],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.WATERFALL_CAVE
  },
  [DungeonPMDO.WaterMaze]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.GRASS],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.STAR_CAVE
  },
  [DungeonPMDO.WesternCave1]: {
    synergies: [Synergy.HUMAN, Synergy.FLORA, Synergy.ARTIFICIAL],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.SKY_PEAK_FINAL_PASS
  },
  [DungeonPMDO.WesternCave2]: {
    synergies: [Synergy.HUMAN, Synergy.FLORA, Synergy.ROCK],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.JOB_CLEAR
  },
  [DungeonPMDO.WishCave1]: {
    synergies: [Synergy.FAIRY, Synergy.HUMAN, Synergy.DRAGON],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.LIVING_SPIRIT
  },
  [DungeonPMDO.WishCave2]: {
    synergies: [Synergy.FAIRY, Synergy.DRAGON, Synergy.BUG],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.TEAM_CHARM_THEME
  },
  [DungeonPMDO.WorldAbyss2]: {
    synergies: [Synergy.DARK, Synergy.GHOST, Synergy.ELECTRIC],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.WORLD_CALAMITY
  },
  [DungeonPMDO.WyvernHill]: {
    synergies: [Synergy.DRAGON, Synergy.FLYING, Synergy.FIELD],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.KECLEONS_SHOP
  },
  [DungeonPMDO.ZeroIsleEast3]: {
    synergies: [Synergy.GROUND, Synergy.PSYCHIC, Synergy.STEEL],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.VERSUS_BOSS
  },
  [DungeonPMDO.ZeroIsleEast4]: {
    synergies: [Synergy.POISON, Synergy.MONSTER, Synergy.ROCK],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.VERSUS_LEGENDARY
  },
  [DungeonPMDO.ZeroIsleSouth1]: {
    synergies: [Synergy.GROUND, Synergy.BUG, Synergy.NORMAL],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.WIGGLYTUFFS_GUILD_REMIX
  },
  [DungeonPMDO.ZeroIsleSouth2]: {
    synergies: [Synergy.ROCK, Synergy.GROUND, Synergy.FIGHTING],
    region: RegionPokemon.PALDEA,
    music: DungeonMusic.WIGGLYTUFFS_GUILD
  }
}
