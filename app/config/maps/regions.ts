import { preference } from "../../public/src/preferences"
import { DungeonMusic, DungeonPMDO } from "../../types/enum/Dungeon"
import { Dish, Item } from "../../types/enum/Item"
import { Synergy } from "../../types/enum/Synergy"

export interface RegionDetail {
  synergies: Synergy[]
  music: DungeonMusic
  regionalSpeciality: Dish
  tint?: number
}

export const RegionDetails: {
  [key in DungeonPMDO | "town"]: RegionDetail
} = {
  [DungeonPMDO.AmpPlains]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.SOUND],
    music: DungeonMusic.AMP_PLAINS,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.AppleWoods]: {
    synergies: [Synergy.BUG, Synergy.GOURMET, Synergy.BABY],
    music: DungeonMusic.APPLE_WOODS,
    regionalSpeciality: Item.SWEET_APPLE
  },
  [DungeonPMDO.BarrenValley]: {
    synergies: [Synergy.ROCK, Synergy.FIGHTING, Synergy.GHOST],
    music: DungeonMusic.BARREN_VALLEY,
    regionalSpeciality: Item.ROCK_SALT,
    tint: 0xdddddd
  },
  [DungeonPMDO.BeachCave]: {
    synergies: [Synergy.AQUATIC, Synergy.GROUND, Synergy.FOSSIL],
    music: DungeonMusic.BEACH_CAVE,
    regionalSpeciality: Item.LEEK
  },
  [DungeonPMDO.BrineCave]: {
    synergies: [Synergy.POISON, Synergy.FOSSIL, Synergy.DARK],
    music: DungeonMusic.BRINE_CAVE,
    regionalSpeciality: Item.BLACK_SLUDGE,
    tint: 0xeeddee
  },
  [DungeonPMDO.BuriedRelic1]: {
    synergies: [Synergy.LIGHT, Synergy.ARTIFICIAL, Synergy.HUMAN],
    music: DungeonMusic.BURIED_RELIC,
    regionalSpeciality: Item.SPINDA_COCKTAIL
  },
  [DungeonPMDO.BuriedRelic2]: {
    synergies: [Synergy.GROUND, Synergy.ARTIFICIAL, Synergy.LIGHT],
    music: DungeonMusic.TIME_GEAR_REMIX,
    regionalSpeciality: Item.HERBA_MYSTICA_SALTY
  },
  [DungeonPMDO.BuriedRelic3]: {
    synergies: [Synergy.GROUND, Synergy.ARTIFICIAL, Synergy.HUMAN],
    music: DungeonMusic.TIME_GEAR,
    regionalSpeciality: Item.RIBBON_SWEET
  },
  [DungeonPMDO.ConcealedRuins]: {
    synergies: [Synergy.POISON, Synergy.WILD, Synergy.GHOST],
    music: DungeonMusic.CONCEALED_RUINS,
    regionalSpeciality: Item.BINDING_MOCHI,
    tint: 0xddffbb
  },
  [DungeonPMDO.CraggyCoast]: {
    synergies: [Synergy.WATER, Synergy.FIGHTING, Synergy.MONSTER],
    music: DungeonMusic.CRAGGY_COAST,
    regionalSpeciality: Item.TEA,
    tint: 0xeeeeff
  },
  [DungeonPMDO.CrystalCave1]: {
    synergies: [Synergy.PSYCHIC, Synergy.SOUND, Synergy.FAIRY],
    music: DungeonMusic.CRYSTAL_CAVE,
    regionalSpeciality: Item.WHIPPED_DREAM,
    tint: 0xffeeff
  },
  [DungeonPMDO.CrystalCave2]: {
    synergies: [Synergy.PSYCHIC, Synergy.SOUND, Synergy.LIGHT],
    music: DungeonMusic.STAFF_ROLL,
    regionalSpeciality: Item.STAR_SWEET,
    tint: 0xffeeee
  },
  [DungeonPMDO.CrystalCrossing]: {
    synergies: [Synergy.PSYCHIC, Synergy.AQUATIC, Synergy.POISON],
    music: DungeonMusic.CRYSTAL_CROSSING,
    regionalSpeciality: Item.STRAWBERRY_SWEET,
    tint: 0xeeffff
  },
  [DungeonPMDO.DarkCrater]: {
    synergies: [Synergy.DARK, Synergy.FIRE, Synergy.GROUND],
    music: DungeonMusic.DARK_CRATER,
    regionalSpeciality: Item.CURRY,
    tint: 0xffaaaa
  },
  [DungeonPMDO.DarkHill1]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.FLYING],
    music: DungeonMusic.DARK_HILL,
    regionalSpeciality: Item.TEA,
    tint: 0xeeffee
  },
  [DungeonPMDO.DarkHill2]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.AMORPHOUS],
    music: DungeonMusic.I_SAW_SOMETHING_AGAIN,
    regionalSpeciality: Item.CLOVER_SWEET,
    tint: 0xddffcc
  },
  [DungeonPMDO.DarkIceMountain]: {
    synergies: [Synergy.DARK, Synergy.ICE, Synergy.NORMAL],
    music: DungeonMusic.DARK_ICE_MOUNTAIN,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.DarkIceMountainPeak]: {
    synergies: [Synergy.DARK, Synergy.ICE, Synergy.FLYING],
    music: DungeonMusic.AT_THE_SNOWY_MOUNTAIN,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.DarknightRelic]: {
    synergies: [Synergy.FOSSIL, Synergy.ARTIFICIAL, Synergy.HUMAN],
    music: DungeonMusic.DARK_WASTELAND,
    regionalSpeciality: Item.RIBBON_SWEET
  },
  [DungeonPMDO.DarkWasteland]: {
    synergies: [Synergy.DARK, Synergy.POISON, Synergy.MONSTER],
    music: DungeonMusic.CHASM_CAVE,
    regionalSpeciality: Item.BINDING_MOCHI,
    tint: 0xeeeeee
  },
  [DungeonPMDO.DeepBoulderQuarry]: {
    synergies: [Synergy.ROCK, Synergy.STEEL, Synergy.FOSSIL],
    music: DungeonMusic.BOULDER_QUARRY,
    regionalSpeciality: Item.ROCK_SALT,
    tint: 0xffeeee
  },
  [DungeonPMDO.DeepDarkCrater]: {
    synergies: [Synergy.DARK, Synergy.FIRE, Synergy.MONSTER],
    music: DungeonMusic.DEEP_DARK_CRATER,
    regionalSpeciality: Item.CURRY,
    tint: 0xffddee
  },
  [DungeonPMDO.DeepDuskForest1]: {
    synergies: [Synergy.DARK, Synergy.GRASS, Synergy.GOURMET],
    music: DungeonMusic.DEEP_DUSK_FOREST,
    regionalSpeciality: Item.TEA,
    tint: 0xeeffee
  },
  [DungeonPMDO.DeepDuskForest2]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.LIGHT],
    music: DungeonMusic.GROWING_ANXIETY,
    regionalSpeciality: Item.CLOVER_SWEET,
    tint: 0xffffee
  },
  [DungeonPMDO.DeepLimestoneCavern]: {
    synergies: [Synergy.WATER, Synergy.BUG, Synergy.ROCK],
    music: DungeonMusic.PROTECTED_WORLD_PEACE,
    regionalSpeciality: Item.ROCK_SALT
  },
  [DungeonPMDO.DeepSealedRuin]: {
    synergies: [Synergy.AMORPHOUS, Synergy.GHOST, Synergy.MONSTER],
    music: DungeonMusic.SEALED_RUIN_PIT,
    regionalSpeciality: Item.LEFTOVERS,
    tint: 0xeeeeff
  },
  [DungeonPMDO.DesertRegion]: {
    synergies: [Synergy.FIRE, Synergy.FIELD, Synergy.LIGHT],
    music: DungeonMusic.MT_BLAZE_PEAK,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.DrenchedBluff]: {
    synergies: [Synergy.AQUATIC, Synergy.FOSSIL, Synergy.BABY],
    music: DungeonMusic.DRENCHED_BLUFF,
    regionalSpeciality: Item.LOVE_SWEET
  },
  [DungeonPMDO.DuskForest1]: {
    synergies: [Synergy.MONSTER, Synergy.GRASS, Synergy.DARK],
    music: DungeonMusic.DUSK_FOREST,
    regionalSpeciality: Item.LARGE_LEEK,
    tint: 0xccddcc
  },
  [DungeonPMDO.DuskForest2]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.FLORA],
    music: DungeonMusic.SINISTER_WOODS,
    regionalSpeciality: Item.LARGE_LEEK,
    tint: 0xccddee
  },
  [DungeonPMDO.ElectricMaze]: {
    synergies: [Synergy.ELECTRIC, Synergy.LIGHT, Synergy.GOURMET],
    music: DungeonMusic.STOP_THIEF,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.FarAmpPlains]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.FOSSIL],
    music: DungeonMusic.FAR_AMP_PLAINS,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.FinalMaze2]: {
    synergies: [Synergy.NORMAL, Synergy.FLORA, Synergy.BUG],
    music: DungeonMusic.FRIEND_AREA_CAVES,
    regionalSpeciality: Item.HONEY
  },
  [DungeonPMDO.FoggyForest]: {
    synergies: [Synergy.FAIRY, Synergy.WILD, Synergy.FLORA],
    music: DungeonMusic.FOGGY_FOREST,
    regionalSpeciality: Item.WHIPPED_DREAM
  },
  [DungeonPMDO.ForestPath]: {
    synergies: [Synergy.GRASS, Synergy.BUG, Synergy.BABY],
    music: DungeonMusic.SKY_PEAK_FOREST,
    regionalSpeciality: Item.HONEY
  },
  [DungeonPMDO.FrostyForest]: {
    synergies: [Synergy.LIGHT, Synergy.ICE, Synergy.FIGHTING],
    music: DungeonMusic.FROSTY_FOREST,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.FutureTemporalSpire]: {
    synergies: [Synergy.HUMAN, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    music: DungeonMusic.BATTLE_WITH_RAYQUAZA,
    regionalSpeciality: Item.SPINDA_COCKTAIL,
    tint: 0xdddddd
  },
  [DungeonPMDO.FutureTemporalTower]: {
    synergies: [Synergy.MONSTER, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    music: DungeonMusic.TEMPORAL_TOWER,
    regionalSpeciality: Item.SPINDA_COCKTAIL,
    tint: 0xeeeeee
  },
  [DungeonPMDO.GoldenChamber]: {
    synergies: [Synergy.DRAGON, Synergy.STEEL, Synergy.AMORPHOUS],
    music: DungeonMusic.OUTLAW,
    regionalSpeciality: Item.POFFIN,
    tint: 0xffffee
  },
  [DungeonPMDO.GrassMaze]: {
    synergies: [Synergy.GRASS, Synergy.FIELD, Synergy.NORMAL],
    music: DungeonMusic.MAKUHITA_DOJO,
    regionalSpeciality: Item.MOOMOO_MILK
  },
  [DungeonPMDO.GreatCanyon]: {
    synergies: [Synergy.NORMAL, Synergy.WILD, Synergy.FIRE],
    music: DungeonMusic.GREAT_CANYON,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.HiddenHighland]: {
    synergies: [Synergy.FLORA, Synergy.GRASS, Synergy.DRAGON],
    music: DungeonMusic.HIDDEN_HIGHLAND,
    regionalSpeciality: Item.HONEY
  },
  [DungeonPMDO.HiddenLand]: {
    synergies: [Synergy.FLORA, Synergy.BUG, Synergy.WATER],
    music: DungeonMusic.HIDDEN_LAND,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.HowlingForest1]: {
    synergies: [Synergy.SOUND, Synergy.FIELD, Synergy.BUG],
    music: DungeonMusic.RANDOM_DUNGEON_2,
    regionalSpeciality: Item.BERRY_JUICE
  },
  [DungeonPMDO.HowlingForest2]: {
    synergies: [Synergy.SOUND, Synergy.POISON, Synergy.GOURMET],
    music: DungeonMusic.FRIEND_AREA_FOREST,
    regionalSpeciality: Item.BLACK_SLUDGE
  },
  [DungeonPMDO.IceAegisCave]: {
    synergies: [Synergy.ICE, Synergy.FIGHTING, Synergy.GROUND],
    music: DungeonMusic.ILLUSION_STONE_CHAMBER,
    regionalSpeciality: Item.CASTELIACONE,
    tint: 0xccffff
  },
  [DungeonPMDO.IceMaze]: {
    synergies: [Synergy.ICE, Synergy.STEEL, Synergy.FIGHTING],
    music: DungeonMusic.TOP_MENU_THEME,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.IcicleForest]: {
    synergies: [Synergy.ICE, Synergy.FIELD, Synergy.FIGHTING],
    music: DungeonMusic.ICICLE_FOREST,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.JoyousTower]: {
    synergies: [Synergy.LIGHT, Synergy.FAIRY, Synergy.BABY],
    music: DungeonMusic.A_NEW_WORLD,
    regionalSpeciality: Item.WHIPPED_DREAM,
    tint: 0xffeeee
  },
  [DungeonPMDO.LapisCave]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.FOSSIL],
    music: DungeonMusic.LAPIS_CAVE,
    regionalSpeciality: Item.TEA
  },
  [DungeonPMDO.LightningField]: {
    synergies: [Synergy.ELECTRIC, Synergy.FIELD, Synergy.LIGHT],
    music: DungeonMusic.OH_NO,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.LimestoneCavern]: {
    synergies: [Synergy.ROCK, Synergy.BUG, Synergy.AQUATIC],
    music: DungeonMusic.LIMESTONE_CAVERN,
    regionalSpeciality: Item.ROCK_SALT
  },
  [DungeonPMDO.LowerBrineCave]: {
    synergies: [Synergy.AQUATIC, Synergy.FOSSIL, Synergy.WILD],
    music: DungeonMusic.LOWER_BRINE_CAVE,
    regionalSpeciality: Item.POFFIN
  },
  [DungeonPMDO.LushPrairie]: {
    synergies: [Synergy.GOURMET, Synergy.LIGHT, Synergy.FLORA],
    music: DungeonMusic.WELCOME_TO_THE_WORLD_OF_POKEMON,
    regionalSpeciality: Item.OLIVE_OIL
  },
  [DungeonPMDO.MagmaCavern2]: {
    synergies: [Synergy.FIRE, Synergy.FIGHTING, Synergy.MONSTER],
    music: DungeonMusic.MAGMA_CAVERN,
    regionalSpeciality: Item.CURRY,
    tint: 0xffeeee
  },
  [DungeonPMDO.MagmaCavern3]: {
    synergies: [Synergy.FIRE, Synergy.DRAGON, Synergy.MONSTER],
    music: DungeonMusic.MAGMA_CAVERN_PIT,
    regionalSpeciality: Item.CURRY,
    tint: 0xffdddd
  },
  [DungeonPMDO.MeteorCave]: {
    synergies: [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN],
    music: DungeonMusic.RANDOM_DUNGEON_1,
    regionalSpeciality: Item.SPINDA_COCKTAIL
  },
  [DungeonPMDO.MiracleSea]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.FAIRY],
    music: DungeonMusic.MIRACLE_SEA,
    regionalSpeciality: Item.SMOKED_FILET
  },
  [DungeonPMDO.MoonlitCourtyard]: {
    synergies: [Synergy.FAIRY, Synergy.FLORA, Synergy.DARK],
    music: DungeonMusic.GOODNIGHT,
    regionalSpeciality: Item.LOVE_SWEET,
    tint: 0xddeeff
  },
  [DungeonPMDO.MtBlaze]: {
    synergies: [Synergy.FIRE, Synergy.FLYING, Synergy.WILD],
    music: DungeonMusic.MT_BLAZE,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.MtBristle]: {
    synergies: [Synergy.ELECTRIC, Synergy.FLYING, Synergy.MONSTER],
    music: DungeonMusic.MT_BRISTLE,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.MtFaraway2]: {
    synergies: [Synergy.ICE, Synergy.AMORPHOUS, Synergy.DRAGON],
    music: DungeonMusic.FROSTY_GROTTO,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.MtFaraway4]: {
    synergies: [Synergy.ICE, Synergy.FLYING, Synergy.SOUND],
    music: DungeonMusic.ESCAPE_THROUGH_THE_SNOW,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.MtFreeze]: {
    synergies: [Synergy.ICE, Synergy.FLYING, Synergy.NORMAL],
    music: DungeonMusic.MT_FREEZE,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.MtHorn]: {
    synergies: [Synergy.ROCK, Synergy.FLYING, Synergy.SOUND],
    music: DungeonMusic.MT_HORN,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.MtSteel1]: {
    synergies: [Synergy.STEEL, Synergy.FLYING, Synergy.FOSSIL],
    music: DungeonMusic.MT_STEEL,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.MtSteel2]: {
    synergies: [Synergy.STEEL, Synergy.FLYING, Synergy.AMORPHOUS],
    music: DungeonMusic.BOSS_BATTLE,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.MtThunder]: {
    synergies: [Synergy.ELECTRIC, Synergy.ROCK, Synergy.STEEL],
    music: DungeonMusic.MT_THUNDER,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.MtThunderPeak]: {
    synergies: [Synergy.ELECTRIC, Synergy.FLYING, Synergy.WILD],
    music: DungeonMusic.MT_THUNDER_PEAK,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.MtTravail]: {
    synergies: [Synergy.FIGHTING, Synergy.HUMAN, Synergy.FOSSIL],
    music: DungeonMusic.MT_TRAVAIL,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.MurkyCave]: {
    synergies: [Synergy.GHOST, Synergy.GROUND, Synergy.HUMAN],
    music: DungeonMusic.MONSTER_HOUSE,
    regionalSpeciality: Item.BLACK_SLUDGE
  },
  [DungeonPMDO.MurkyForest]: {
    synergies: [Synergy.GHOST, Synergy.GRASS, Synergy.DARK],
    music: DungeonMusic.MURKY_FOREST,
    regionalSpeciality: Item.BERRY_JUICE,
    tint: 0xffeeff
  },
  [DungeonPMDO.MysteryJungle1]: {
    synergies: [Synergy.WILD, Synergy.FLORA, Synergy.POISON],
    music: DungeonMusic.FRIEND_AREA_STEPPE,
    regionalSpeciality: Item.TART_APPLE
  },
  [DungeonPMDO.MysteryJungle2]: {
    synergies: [Synergy.WILD, Synergy.FAIRY, Synergy.POISON],
    music: DungeonMusic.BLIZZARD_ISLAND,
    regionalSpeciality: Item.SIRUPY_APPLE,
    tint: 0xddffdd
  },
  [DungeonPMDO.MystifyingForest]: {
    synergies: [Synergy.DRAGON, Synergy.FAIRY, Synergy.FLORA],
    music: DungeonMusic.MYSTIFYING_FOREST,
    regionalSpeciality: Item.HERBA_MYSTICA_SWEET
  },
  [DungeonPMDO.NorthernDesert1]: {
    synergies: [Synergy.DRAGON, Synergy.FIRE, Synergy.LIGHT],
    music: DungeonMusic.NORTHERN_DESERT,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.NorthernDesert2]: {
    synergies: [Synergy.DRAGON, Synergy.FIRE, Synergy.WILD],
    music: DungeonMusic.NORTHERN_DESERT,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.NorthernRange1]: {
    synergies: [Synergy.POISON, Synergy.AQUATIC, Synergy.STEEL],
    music: DungeonMusic.FORTUNE_RAVINE,
    regionalSpeciality: Item.POFFIN
  },
  [DungeonPMDO.NorthernRange2]: {
    synergies: [Synergy.MONSTER, Synergy.FIGHTING, Synergy.STEEL],
    music: DungeonMusic.TEAM_SKULL,
    regionalSpeciality: Item.MOOMOO_MILK
  },
  [DungeonPMDO.NorthwindField]: {
    synergies: [Synergy.WATER, Synergy.FIELD, Synergy.SOUND],
    music: DungeonMusic.THROUGH_THE_SEA_OF_TIME,
    regionalSpeciality: Item.NUTRITIOUS_EGG
  },
  [DungeonPMDO.PitfallValley1]: {
    synergies: [Synergy.FIELD, Synergy.HUMAN, Synergy.BABY],
    music: DungeonMusic.PERSONALITY_TEST,
    regionalSpeciality: Item.MOOMOO_MILK
  },
  [DungeonPMDO.PoisonMaze]: {
    synergies: [Synergy.POISON, Synergy.PSYCHIC, Synergy.BUG],
    music: DungeonMusic.RANDOM_DUNGEON_3,
    regionalSpeciality: Item.BLACK_SLUDGE,
    tint: 0xffeeff
  },
  [DungeonPMDO.PurityForest2]: {
    synergies: [Synergy.BABY, Synergy.GOURMET, Synergy.AMORPHOUS],
    music: DungeonMusic.RUN_AWAY,
    regionalSpeciality: Item.SWEET_APPLE
  },
  [DungeonPMDO.PurityForest4]: {
    synergies: [Synergy.NORMAL, Synergy.BABY, Synergy.FAIRY],
    music: DungeonMusic.POKEMON_SQUARE,
    regionalSpeciality: Item.HERBA_MYSTICA_SWEET
  },
  [DungeonPMDO.PurityForest6]: {
    synergies: [Synergy.NORMAL, Synergy.GRASS, Synergy.BABY],
    music: DungeonMusic.SHAYMIN_VILLAGE,
    regionalSpeciality: Item.SWEET_APPLE
  },
  [DungeonPMDO.PurityForest7]: {
    synergies: [Synergy.GRASS, Synergy.BABY, Synergy.SOUND],
    music: DungeonMusic.ON_THE_BEACH_AT_DUSK,
    regionalSpeciality: Item.SWEET_APPLE
  },
  [DungeonPMDO.QuicksandCave]: {
    synergies: [Synergy.GROUND, Synergy.FOSSIL, Synergy.NORMAL],
    music: DungeonMusic.QUICKSAND_CAVE,
    regionalSpeciality: Item.LEEK
  },
  [DungeonPMDO.QuicksandPit]: {
    synergies: [Synergy.GROUND, Synergy.FOSSIL, Synergy.MONSTER],
    music: DungeonMusic.QUICKSAND_PIT,
    regionalSpeciality: Item.LEEK
  },
  [DungeonPMDO.QuicksandUnused]: {
    synergies: [Synergy.GROUND, Synergy.NORMAL, Synergy.POISON],
    music: DungeonMusic.THERES_TROUBLE,
    regionalSpeciality: Item.LARGE_LEEK,
    tint: 0xeeeeee
  },
  [DungeonPMDO.RescueTeamMaze]: {
    synergies: [Synergy.FIGHTING, Synergy.HUMAN, Synergy.ARTIFICIAL],
    music: DungeonMusic.RESCUE_TEAM_BASE,
    regionalSpeciality: Item.NUTRITIOUS_EGG
  },
  [DungeonPMDO.RockAegisCave]: {
    synergies: [Synergy.ROCK, Synergy.GHOST, Synergy.AMORPHOUS],
    music: DungeonMusic.FRIEND_AREA_SWAMP,
    regionalSpeciality: Item.ROCK_SALT,
    tint: 0xeeffee
  },
  [DungeonPMDO.RockMaze]: {
    synergies: [Synergy.ROCK, Synergy.STEEL, Synergy.FIGHTING],
    music: DungeonMusic.DEFY_THE_LEGENDS,
    regionalSpeciality: Item.ROCK_SALT
  },
  [DungeonPMDO.RockPathRB]: {
    synergies: [Synergy.ROCK, Synergy.FIELD, Synergy.FOSSIL],
    music: DungeonMusic.RISING_FEAR,
    regionalSpeciality: Item.RIBBON_SWEET
  },
  [DungeonPMDO.RockPathTDS]: {
    synergies: [Synergy.ROCK, Synergy.FIELD, Synergy.MONSTER],
    music: DungeonMusic.FRIEND_AREA_POND,
    regionalSpeciality: Item.RIBBON_SWEET
  },
  [DungeonPMDO.SealedRuin]: {
    synergies: [Synergy.HUMAN, Synergy.DRAGON, Synergy.GHOST],
    music: DungeonMusic.THE_LEGEND_OF_NINETALES,
    regionalSpeciality: Item.LEFTOVERS
  },
  [DungeonPMDO.SidePath]: {
    synergies: [Synergy.NORMAL, Synergy.FIELD, Synergy.STEEL],
    music: DungeonMusic.CAVE_AND_SIDE_PATH,
    regionalSpeciality: Item.MOOMOO_MILK
  },
  [DungeonPMDO.SilentChasm]: {
    synergies: [Synergy.FIRE, Synergy.LIGHT, Synergy.WILD],
    music: DungeonMusic.SILENT_CHASM,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.SkyPeak4thPass]: {
    synergies: [Synergy.GOURMET, Synergy.FLORA, Synergy.BABY],
    music: DungeonMusic.SKY_PEAK_COAST,
    regionalSpeciality: Item.OLIVE_OIL
  },
  [DungeonPMDO.SkyPeak7thPass]: {
    synergies: [Synergy.ICE, Synergy.DRAGON, Synergy.FAIRY],
    music: DungeonMusic.DIALGA_FIGHT_TO_THE_FINISH,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.SkyPeakSummitPass]: {
    synergies: [Synergy.FLYING, Synergy.ROCK, Synergy.FIGHTING],
    music: DungeonMusic.SKY_TOWER_SUMMIT,
    regionalSpeciality: Item.STAR_SWEET,
    tint: 0xeeeeee
  },
  [DungeonPMDO.SkyTower]: {
    synergies: [Synergy.FLYING, Synergy.LIGHT, Synergy.FAIRY],
    music: DungeonMusic.SKY_TOWER,
    regionalSpeciality: Item.STAR_SWEET
  },
  [DungeonPMDO.SnowPath]: {
    synergies: [Synergy.ICE, Synergy.FIELD, Synergy.NORMAL],
    music: DungeonMusic.SKY_PEAK_SNOWFIELD,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.SolarCave1]: {
    synergies: [Synergy.PSYCHIC, Synergy.FIRE, Synergy.SOUND],
    music: DungeonMusic.SKY_PEAK_PRAIRIE,
    regionalSpeciality: Item.STRAWBERRY_SWEET
  },
  [DungeonPMDO.SouthernCavern1]: {
    synergies: [Synergy.STEEL, Synergy.POISON, Synergy.ARTIFICIAL],
    music: DungeonMusic.SPRING_CAVE,
    regionalSpeciality: Item.CLOVER_SWEET
  },
  [DungeonPMDO.SouthernCavern2]: {
    synergies: [Synergy.FAIRY, Synergy.AQUATIC, Synergy.POISON],
    music: DungeonMusic.SPRING_CAVE_DEPTHS,
    regionalSpeciality: Item.BERRY_SWEET
  },
  [DungeonPMDO.SouthernJungle]: {
    synergies: [Synergy.WILD, Synergy.FLORA, Synergy.GRASS],
    music: DungeonMusic.SOUTHERN_JUNGLE,
    regionalSpeciality: Item.BERRY_JUICE,
    tint: 0xeeffee
  },
  [DungeonPMDO.SpacialCliffs]: {
    synergies: [Synergy.GHOST, Synergy.AMORPHOUS, Synergy.ELECTRIC],
    music: DungeonMusic.SPACIAL_CLIFFS,
    regionalSpeciality: Item.SPINDA_COCKTAIL,
    tint: 0xeeeeee
  },
  [DungeonPMDO.SpacialRift1]: {
    synergies: [Synergy.AMORPHOUS, Synergy.ARTIFICIAL, Synergy.MONSTER],
    music: DungeonMusic.IN_THE_FUTURE,
    regionalSpeciality: Item.STAR_SWEET,
    tint: 0xeeffee
  },
  [DungeonPMDO.SpacialRift2]: {
    synergies: [Synergy.AMORPHOUS, Synergy.ARTIFICIAL, Synergy.PSYCHIC],
    music: DungeonMusic.PLANETS_PARALYSIS,
    regionalSpeciality: Item.STAR_SWEET,
    tint: 0xeeeeee
  },
  [DungeonPMDO.SteamCave]: {
    synergies: [Synergy.FIRE, Synergy.GOURMET, Synergy.ELECTRIC],
    music: DungeonMusic.STEAM_CAVE,
    regionalSpeciality: Item.CURRY,
    tint: 0xfff0f0
  },
  [DungeonPMDO.SteelAegisCave]: {
    synergies: [Synergy.STEEL, Synergy.NORMAL, Synergy.FIGHTING],
    music: DungeonMusic.AEGIS_CAVE,
    regionalSpeciality: Item.POFFIN
  },
  [DungeonPMDO.StormySea1]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.ELECTRIC],
    music: DungeonMusic.STORMY_SEA,
    regionalSpeciality: Item.HERBA_MYSTICA_SOUR
  },
  [DungeonPMDO.StormySea2]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.SOUND],
    music: DungeonMusic.FRIEND_AREA_OCEANIC,
    regionalSpeciality: Item.SMOKED_FILET
  },
  [DungeonPMDO.SurroundedSea]: {
    synergies: [Synergy.WATER, Synergy.DRAGON, Synergy.ICE],
    music: DungeonMusic.SURROUNDED_SEA,
    regionalSpeciality: Item.LEFTOVERS
  },
  [DungeonPMDO.TemporalSpire]: {
    synergies: [Synergy.HUMAN, Synergy.PSYCHIC, Synergy.AMORPHOUS],
    music: DungeonMusic.TEMPORAL_SPIRE,
    regionalSpeciality: Item.SPINDA_COCKTAIL
  },
  [DungeonPMDO.TemporalTower]: {
    synergies: [Synergy.HUMAN, Synergy.STEEL, Synergy.ARTIFICIAL],
    music: DungeonMusic.GARDEVOIR_INSIDE_OF_A_DREAM,
    regionalSpeciality: Item.SPINDA_COCKTAIL
  },
  [DungeonPMDO.TemporalUnused]: {
    synergies: [Synergy.NORMAL, Synergy.FOSSIL, Synergy.ARTIFICIAL],
    music: DungeonMusic.TEMPORAL_PINNACLE,
    regionalSpeciality: Item.SPINDA_COCKTAIL
  },
  [DungeonPMDO.TestDungeon]: {
    synergies: [Synergy.ARTIFICIAL, Synergy.ELECTRIC, Synergy.PSYCHIC],
    music: DungeonMusic.FRIEND_AREA_LAB,
    regionalSpeciality: Item.HERBA_MYSTICA_SPICY
  },
  [DungeonPMDO.TheNightmare]: {
    synergies: [Synergy.GHOST, Synergy.DARK, Synergy.PSYCHIC],
    music: DungeonMusic.THE_POWER_OF_DARKNESS,
    regionalSpeciality: Item.BLACK_SLUDGE,
    tint: 0xffddff
  },
  [DungeonPMDO.ThunderwaveCave]: {
    synergies: [Synergy.ELECTRIC, Synergy.GROUND, Synergy.LIGHT],
    music: DungeonMusic.THUNDERWAVE_CAVE,
    regionalSpeciality: Item.FRUIT_JUICE
  },
  [DungeonPMDO.TinyMeadow]: {
    synergies: [Synergy.GRASS, Synergy.BABY, Synergy.AMORPHOUS],
    music: DungeonMusic.FRIEND_AREA_GRASSLANDS,
    regionalSpeciality: Item.MOOMOO_MILK
  },
  [DungeonPMDO.TinyWoods]: {
    synergies: [Synergy.BUG, Synergy.BABY, Synergy.NORMAL],
    music: DungeonMusic.TINY_WOODS,
    regionalSpeciality: Item.SWEET_APPLE
  },
  [DungeonPMDO.TreeshroudForest1]: {
    synergies: [Synergy.GOURMET, Synergy.WATER, Synergy.BUG],
    music: DungeonMusic.TREESHROUD_FOREST,
    regionalSpeciality: Item.TART_APPLE
  },
  [DungeonPMDO.TreeshroudForest2]: {
    synergies: [Synergy.GRASS, Synergy.AQUATIC, Synergy.BABY],
    music: DungeonMusic.FRIEND_AREA_WILDS,
    regionalSpeciality: Item.TART_APPLE
  },
  [DungeonPMDO.UnusedBrineCave]: {
    synergies: [Synergy.GOURMET, Synergy.GROUND, Synergy.DRAGON],
    music: DungeonMusic.IN_THE_NIGHTMARE,
    regionalSpeciality: Item.STRAWBERRY_SWEET
  },
  [DungeonPMDO.UnusedSteamCave]: {
    synergies: [Synergy.FIRE, Synergy.WATER, Synergy.ELECTRIC],
    music: DungeonMusic.UPPER_STEAM_CAVE,
    regionalSpeciality: Item.CURRY
  },
  [DungeonPMDO.UnusedWaterfallPond]: {
    synergies: [Synergy.AQUATIC, Synergy.BUG, Synergy.WILD],
    music: DungeonMusic.DEEP_STAR_CAVE,
    regionalSpeciality: Item.CLOVER_SWEET
  },
  [DungeonPMDO.UproarForest]: {
    synergies: [Synergy.WILD, Synergy.FIELD, Synergy.SOUND],
    music: DungeonMusic.TREASURE_TOWN,
    regionalSpeciality: Item.RAGE_CANDY_BAR
  },
  [DungeonPMDO.VastIceMountain]: {
    synergies: [Synergy.WILD, Synergy.ICE, Synergy.ROCK],
    music: DungeonMusic.VAST_ICE_MOUNTAIN,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.VastIceMountainPeak]: {
    synergies: [Synergy.DRAGON, Synergy.ICE, Synergy.FLYING],
    music: DungeonMusic.VAST_ICE_MOUNTAIN_PEAK,
    regionalSpeciality: Item.CASTELIACONE
  },
  [DungeonPMDO.WaterfallCave]: {
    synergies: [Synergy.WATER, Synergy.GROUND, Synergy.SOUND],
    music: DungeonMusic.MAROWAK_DOJO,
    regionalSpeciality: Item.TEA
  },
  [DungeonPMDO.WaterfallPond]: {
    synergies: [Synergy.WATER, Synergy.AMORPHOUS, Synergy.SOUND],
    music: DungeonMusic.WATERFALL_CAVE,
    regionalSpeciality: Item.TEA,
    tint: 0xeeffff
  },
  [DungeonPMDO.WaterMaze]: {
    synergies: [Synergy.WATER, Synergy.AQUATIC, Synergy.GRASS],
    music: DungeonMusic.STAR_CAVE,
    regionalSpeciality: Item.TEA
  },
  [DungeonPMDO.WesternCave1]: {
    synergies: [Synergy.HUMAN, Synergy.FLORA, Synergy.ARTIFICIAL],
    music: DungeonMusic.SKY_PEAK_FINAL_PASS,
    regionalSpeciality: Item.RIBBON_SWEET
  },
  [DungeonPMDO.WesternCave2]: {
    synergies: [Synergy.HUMAN, Synergy.FLORA, Synergy.ROCK],
    music: DungeonMusic.JOB_CLEAR,
    regionalSpeciality: Item.FLOWER_SWEET
  },
  [DungeonPMDO.WishCave1]: {
    synergies: [Synergy.FAIRY, Synergy.GOURMET, Synergy.BABY],
    music: DungeonMusic.LIVING_SPIRIT,
    regionalSpeciality: Item.LOVE_SWEET
  },
  [DungeonPMDO.WishCave2]: {
    synergies: [Synergy.FAIRY, Synergy.DRAGON, Synergy.BUG],
    music: DungeonMusic.TEAM_CHARM_THEME,
    regionalSpeciality: Item.LOVE_SWEET
  },
  [DungeonPMDO.WorldAbyss2]: {
    synergies: [Synergy.DARK, Synergy.GHOST, Synergy.ELECTRIC],
    music: DungeonMusic.WORLD_CALAMITY,
    regionalSpeciality: Item.LEFTOVERS
  },
  [DungeonPMDO.WyvernHill]: {
    synergies: [Synergy.DRAGON, Synergy.FLYING, Synergy.GOURMET],
    music: DungeonMusic.KECLEONS_SHOP,
    regionalSpeciality: Item.POFFIN
  },
  [DungeonPMDO.ZeroIsleEast3]: {
    synergies: [Synergy.AMORPHOUS, Synergy.PSYCHIC, Synergy.STEEL],
    music: DungeonMusic.VERSUS_BOSS,
    regionalSpeciality: Item.SPINDA_COCKTAIL,
    tint: 0xeeeeee
  },
  [DungeonPMDO.ZeroIsleEast4]: {
    synergies: [Synergy.POISON, Synergy.MONSTER, Synergy.PSYCHIC],
    music: DungeonMusic.VERSUS_LEGENDARY,
    regionalSpeciality: Item.BLACK_SLUDGE,
    tint: 0xeeeeee
  },
  [DungeonPMDO.ZeroIsleSouth1]: {
    synergies: [Synergy.GROUND, Synergy.BUG, Synergy.GOURMET],
    music: DungeonMusic.WIGGLYTUFFS_GUILD_REMIX,
    regionalSpeciality: Item.LARGE_LEEK
  },
  [DungeonPMDO.ZeroIsleSouth2]: {
    synergies: [Synergy.ROCK, Synergy.GROUND, Synergy.FIGHTING],
    music: DungeonMusic.WIGGLYTUFFS_GUILD,
    regionalSpeciality: Item.ROCK_SALT
  },
  town: {
    synergies: [],
    music: DungeonMusic.TREASURE_TOWN_STAGE_0,
    regionalSpeciality: Item.NUTRITIOUS_EGG
  }
}

export function getRegionTint(region: DungeonPMDO | "town"): number {
  if (preference("colorblindMode")) {
    return 0xffffff
  }
  return RegionDetails[region]?.tint ?? 0xffffff
}

export function countRegionsBySynergy() {
  const synergyCount: Record<Synergy, number> = {} as Record<Synergy, number>

  // Initialize all synergies to 0
  Object.values(Synergy).forEach((synergy) => {
    synergyCount[synergy] = 0
  })

  // Count occurrences of each synergy across all regions
  Object.values(RegionDetails).forEach((region) => {
    region.synergies.forEach((synergy) => {
      synergyCount[synergy]++
    })
  })

  // Log the results
  console.log("Regions per synergy:")
  Object.entries(synergyCount)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .forEach(([synergy, count]) => {
      console.log(`${synergy}: ${count}`)
    })

  return synergyCount
}

//countRegionsBySynergy()
