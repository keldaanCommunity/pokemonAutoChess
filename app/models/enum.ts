import { Rarity } from "../types/enum/Game";
import { Effect } from "../types/enum/Effect"
import { Synergy } from "../types/enum/Synergy";
import { Emotion } from "../types";
import { Pkm, PkmIndex } from '../types/enum/Pokemon';

export const WORDS = Object.freeze({
  TIPEE_DONOR: {
    'eng': ' being a tipee donor',
    'esp': 'ser donante de tipee',
    'fra': 'être un donateur tipee'
  },
  LEVEL: {
    'eng': 'Level',
    'esp': 'Nivel',
    'fra': 'Niveau'
  },
  LEADERBOARD: {
    'eng': 'Leaderboard',
    'esp': 'Posiciones',
    'fra': 'Classement'
  },
  RANK: {
    'eng': 'Rank',
    'esp': 'Rango',
    'fra': 'Rang'
  },
  COMPOSITION: {
    'eng': 'Team composition',
    'esp': 'Composición del equipo',
    'fra': 'Composition d équipe'
  },
  RESULTS: {
    'eng': 'Results',
    'esp': 'Resultados',
    'fra': 'Résultats'
  },
  EXPERIENCE: {
    'eng': 'experience',
    'esp': 'experiencia',
    'fra': 'experience'
  },
  LEAVE: {
    'eng': 'Exit the dungeon',
    'esp': 'Salir del calabozo',
    'fra': 'Quitter le donjon'
  },
  RANKING: {
    'eng': 'Ranking',
    'esp': 'Clasificación',
    'fra': 'Classement'
  },
  STAY: {
    'eng': 'Stay',
    'esp': 'Permanezca en',
    'fra': 'Rester'
  },
  PLACE: {
    'eng': 'place',
    'esp': 'puesto',
    'fra': 'place'
  },
  GAME_LOBBY: {
    'eng': 'Game Lobby',
    'esp': 'Lobby del juego',
    'fra': 'Salon principal'
  },
  USERS: {
    'eng': 'Users',
    'esp': 'Usuarios',
    'fra': 'Utilisateurs'
  },
  HOME: {
    'eng': 'Home',
    'esp': 'Inicio',
    'fra': 'Déconnexion'
  },
  CHANGE_LANGAGE: {
    'eng': 'Change Langage',
    'esp': 'Cambiar idioma',
    'fra': 'Changer de language'
  },
  AVAILABLE_ROOM_IDS: {
    'eng': 'Available rooms',
    'esp': 'Sala disponible',
    'fra': 'Parties disponibles'
  },
  CREATE_NEW_ROOM: {
    'eng': 'Create new room',
    'esp': 'Crear una nueva sala',
    'fra': 'Créer une partie'
  },
  TYPE_HERE: {
    'eng': 'Type here',
    'esp': 'Escriba aquí',
    'fra': 'écrivez ici'
  },
  SEND: {
    'eng': 'Send',
    'esp': 'Envíar',
    'fra': 'Envoyer'
  },
  ROOM_ID: {
    'eng': 'Room identifier',
    'esp': 'Codigo de la sala',
    'fra': 'Identifiant de la partie'
  },
  PLAYERS_IN_ROOM: {
    'eng': 'Players in room',
    'esp': 'Los jugadores en la sala',
    'fra': 'Nombre de joueurs dans la partie'
  },
  PLAYER: {
    'eng': 'Player',
    'esp': 'Jugador',
    'fra': 'Joueur'
  },
  READY: {
    'eng': 'Ready',
    'esp': 'listo',
    'fra': 'Prêt'
  },
  START_GAME: {
    'eng': 'Start Game',
    'esp': 'Jugar',
    'fra': 'Lancer la partie'
  },
  QUIT_ROOM: {
    'eng': 'Quit Room',
    'esp': 'Salga de la sala',
    'fra': 'Quitter la partie'
  },
  ADD_BOT: {
    'eng': 'Add bot',
    'esp': 'Añadir bot',
    'fra': 'Ajouter un bot'
  },
  REMOVE_BOT: {
    'eng': 'Remove bot',
    'esp': 'Quitar el bot',
    'fra': 'Enlever un bot'
  },
  REFRESH: {
    'eng': 'Refresh',
    'esp': 'Actualizar',
    'fra': 'Actualiser'
  },
  BUY_XP: {
    'eng': 'Buy exp',
    'esp': 'Comprar xp',
    'fra': 'Acheter xp'
  },
  TURN: {
    'eng': 'Turn',
    'esp': 'Gira',
    'fra': 'Tour'
  },
  MONEY: {
    'eng': 'Money',
    'esp': 'Dinero',
    'fra': 'Argent'
  },
  BASE: {
    'eng': 'Base',
    'esp': 'Base',
    'fra': 'Base'
  },
  STREAK: {
    'eng': 'Streak',
    'esp': 'Raya',
    'fra': 'Série'
  },
  INTEREST: {
    'eng': 'Inter',
    'esp': 'Inter',
    'fra': 'Inter'
  },
  WIN: {
    'eng': 'Win',
    'esp': 'Victoria',
    'fra': 'Victoire'
  },
  CLOSE: {
    'eng': 'Close',
    'esp': 'Cerrar',
    'fra': 'Fermer'
  },
  SAVE: {
    'eng': 'Save Changes',
    'esp': 'Guardar cambios',
    'fra': 'Sauvegarder'
  },
  UNLOCK: {
    'eng': 'Unlock at lvl',
    'esp': 'Desbloquear en el nivel',
    'fra': 'Débloqué au lvl'
  },
  UNLOCK_AFTER: {
    'eng': 'Unlock after',
    'esp': 'Desbloquear después de',
    'fra': 'Débloqué après'
  },
  WINS_IN: {
    'eng': 'wins in',
    'esp': 'victorias en',
    'fra': 'victoires dans'
  }
});

export const LAST_BATTLE_RESULT_TRADUCTION = Object.freeze({
  WIN: {
    eng: 'Win',
    esp: 'Gana',
    fra: 'Victoire'
  },
  DEFEAT: {
    eng: 'Defeat',
    esp: 'Derrota',
    fra: 'Défaite'
  },
  DRAW: {
    eng: 'Draw',
    esp: 'Empate',
    fra: 'Egalité'
  }
});

export const PHASE_TRADUCTION = Object.freeze({
  PICK: {
    eng: 'Pick',
    esp: 'Escoge',
    fra: 'Choix'
  },
  FIGHT: {
    eng: 'Fight',
    esp: 'Luchar',
    fra: 'Combat'
  }
});

export const RARITY_HP_COST= Object.freeze({
  [Rarity.COMMON] : 1,
  [Rarity.UNCOMMON] : 1,
  [Rarity.RARE] : 2,
  [Rarity.EPIC] : 2,
  [Rarity.LEGENDARY] : 3,
  [Rarity.MYTHICAL] : 4,
  [Rarity.NEUTRAL] : 2,
  [Rarity.SUMMON] : 1
});

export const COST = Object.freeze({
  [Rarity.COMMON] : 1,
  [Rarity.UNCOMMON] : 2,
  [Rarity.RARE] : 3,
  [Rarity.EPIC] : 4,
  [Rarity.MYTHICAL] : 6,
  [Rarity.LEGENDARY] : 5,
  [Rarity.SUMMON] : 0,
  [Rarity.NEUTRAL] : 0
});

export const EXP_TABLE = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 32,
  7: 50,
  8: 70,
  9: -1
});

export const ORIENTATION_RAD = Object.freeze({
  DOWNLEFT: 5 * Math.PI / 4,
  LEFT: Math.PI,
  UPLEFT: 3 * Math.PI / 4,
  UP: Math.PI / 2,
  UPRIGHT: Math.PI / 4,
  RIGHT: 0,
  DOWNRIGHT: 7 * Math.PI / 4,
  DOWN: 3 * Math.PI / 2,
  UNCLEAR: 0
});

export const XP_TABLE = [1000, 1500, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000];

export const XP_PLACE = [700, 500, 400, 300, 200, 150, 100, 0];

export const RARITY_COLOR = Object.freeze({
  [Rarity.COMMON]: '#686d7d',
  [Rarity.NEUTRAL]: '#686d7d',
  [Rarity.UNCOMMON]: '#478a41',
  [Rarity.RARE]: '#5062ab',
  [Rarity.EPIC]: '#7b469c',
  [Rarity.LEGENDARY]: '#a6802e',
  [Rarity.MYTHICAL]: '#ffc0cb',
  [Rarity.SUMMON]: '#991f1f'
});

export const PROBABILITY = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0, 0],
  4: [0.55, 0.3, 0.15, 0, 0],
  5: [0.4, 0.3, 0.25, 0.05, 0],
  6: [0.29, 0.295, 0.31, 0.1, 0.005],
  7: [0.24, 0.28, 0.31, 0.15, 0.02],
  8: [0.2, 0.24, 0.31, 0.2, 0.05],
  9: [0.1, 0.19, 0.31, 0.30, 0.1]
};

export const FLYING_PROTECT_THRESHOLD = Object.freeze({
  [Effect.TAILWIND]: {
    duration: 1000,
    threshold: 0.2
  },
  [Effect.FEATHER_DANCE]: {
    duration: 2000,
    threshold: 0.4
  },
  [Effect.MAX_AIRSTREAM]: {
    duration: 3000,
    threshold: 0.5
  },
  [Effect.MAX_GUARD]: {
    duration: 4000,
    threshold: 0.5
  }
});

export const RANK = Object.freeze({
  DIAMOND: {
    id: 'DIAMOND',
    threshold: 1400
  },
  PLATINUM: {
    id: 'PLATINUM',
    threshold: 1250
  },
  GOLD: {
    id: 'GOLD',
    threshold: 1100
  },
  SILVER: {
    id: 'SILVER',
    threshold: 900
  },
  BRONZE: {
    id: 'BRONZE',
    threshold: 0
  }
});

export const HDR = Object.freeze({
  WALL: 'WALL',
  WALL_ALT_1: 'WALL_ALT_1',
  WALL_ALT_2: 'WALL_ALT_2',
  WALL_ALT_3: 'WALL_ALT_3',
  GROUND: 'GROUND',
  GROUND_ALT_1: 'GROUND_ALT_1',
  GROUND_ALT_2: 'GROUND_ALT_2',
  GROUND_ALT_3: 'GROUND_ALT_3',
  GROUND_ALT_4: 'GROUND_ALT_4',
  WATER: 'WATER',
  ABYSS: 'ABYSS',
  ABYSS_ALT_1: 'ABYSS_ALT_1',
  ABYSS_ALT_2: 'ABYSS_ALT_2'
});

export const MAP = Object.freeze({
    FOURTH_STATION_PATH: {
      id: 'FOURTH_STATION_PATH',
      name: '4th Station Path',
      pokemons: [],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    SEVEN_STATION_PATH: {
      id: 'SEVEN_STATION_PATH',
      name: '7th Station Path',
      pokemons: [],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FIGHTING
    },
    BARREN_VALLEY: {
      id: 'BARREN_VALLEY',
      name: 'Barren Valley',
      pokemons: [],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.DARK
    },
    DARK_ICE_MOUNTAIN_PEAK: {
      id: 'DARK_ICE_MOUNTAIN_PEAK',
      name: 'Dark Ice Mountain Peak',
      pokemons: [Pkm.GENGAR, Pkm.DUSKULL, Pkm.METANG],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_ICE_MOUNTAIN: {
      id: 'DARK_ICE_MOUNTAIN',
      name: 'Dark Ice Mountain',
      pokemons: [Pkm.BANETTE, Pkm.GENGAR, Pkm.DUSKULL, Pkm.METANG],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_WASTELAND: {
      id: 'DARK_WASTELAND',
      name: 'Dark Wasteland',
      pokemons: [Pkm.GASTLY, Pkm.ONIX, Pkm.SHIFTRY],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DEEP_BOULDER_QUARRY: {
      id: 'DEEP_BOULDER_QUARRY',
      name: 'Deep Boulder Quarry',
      pokemons: [Pkm.NINJASK, Pkm.SHELGON, Pkm.RHYDON, Pkm.METANG, Pkm.STEELIX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    LIMESTONE_CAVERN: {
      id: 'LIMESTONE_CAVERN',
      name: 'Limestone Cavern',
      pokemons: [Pkm.MARILL, Pkm.SLOWKING, Pkm.DRAGONAIR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    DEEP_LIMESTONE_CAVERN: {
      id: 'DEEP_LIMESTONE_CAVERN',
      name: 'Deep Limestone Cavern',
      pokemons: [Pkm.DRAGONAIR, Pkm.AERODACTYL, Pkm.POLIWHIRL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    ICICLE_FOREST: {
      id: 'ICICLE_FOREST',
      name: 'Icicle Forest',
      pokemons: [Pkm.GENGAR, Pkm.CACTURNE, Pkm.METAGROSS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ICE
    },
    MURKY_FOREST: {
      id: 'MURKY_FOREST',
      name: 'Murky Forest',
      pokemons: [Pkm.HOPPIP, Pkm.WEEDLE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.BUG
    },
    SPACIAL_CLIFFS: {
      id: 'SPACIAL_CLIFFS',
      name: 'Spacial Cliffs',
      pokemons: [Pkm.HAUNTER, Pkm.BELDUM, Pkm.SHEDNINJA, Pkm.BANETTE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    TEMPORAL_SPIRE_FUTURE: {
      id: 'TEMPORAL_SPIRE_FUTURE',
      name: 'Temporal Spire Future',
      pokemons: [Pkm.GOLBAT, Pkm.ALAKAZAM, Pkm.MAGNETON, Pkm.GASTLY, Pkm.PORYGON_2, Pkm.CROBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TEMPORAL_TOWER_FUTURE: {
      id: 'TEMPORAL_TOWER_FUTURE',
      name: 'Temporal Tower Future',
      pokemons: [Pkm.ZUBAT, Pkm.KADABRA, Pkm.MAGNEMITE, Pkm.GASTLY, Pkm.GOLBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    VAST_ICE_MOUNTAIN_PEAK: {
      id: 'VAST_ICE_MOUNTAIN_PEAK',
      name: 'Vast Ice Mountain Peak',
      pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    VAST_ICE_MOUNTAIN: {
      id: 'VAST_ICE_MOUNTAIN',
      name: 'Vast Ice Mountain',
      pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    AMP_PLAINS: {
      id: 'AMP_PLAINS',
      name: 'Amp Plains',
      pokemons: [Pkm.MAREEP, Pkm.ELEKID, Pkm.SHINX, Pkm.ZAPDOS, Pkm.FLAFFY, Pkm.PIKACHU, Pkm.PICHU, Pkm.ELECTABUZZ],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    FAR_AMP_PLAINS: {
      id: 'FAR_AMP_PLAINS',
      name: 'Far Amp Plains',
      pokemons: [Pkm.SHINX, Pkm.PIKACHU, Pkm.PICHU, Pkm.FLAFFY, Pkm.ELECTABUZZ, Pkm.ELECTRIKE, Pkm.LUXIO, Pkm.LUXRAY, Pkm.AMPHAROS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    FINAL_MAZE_B23F: {
      id: 'FINAL_MAZE_B23F',
      name: 'Final Maze',
      pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.OMANYTE, Pkm.KABUTO, Pkm.MAREEP, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.MAGBY, Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    FOGGY_FOREST: {
      id: 'FOGGY_FOREST',
      name: 'Foggy Forest',
      pokemons: [Pkm.SKIPLOOM, Pkm.BUNEARY],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    FOREST_PATH: {
      id: 'FOREST_PATH',
      name: 'Forest Path',
      pokemons: [Pkm.SWINUB, Pkm.HOUNDOUR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    GOLD_CHAMBER: {
      id: 'GOLD_CHAMBER',
      name: 'Gold Chamber',
      pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.OMANYTE, Pkm.KABUTO, Pkm.MAREEP, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.MAGBY,  Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    HIDDEN_HIGHLAND: {
      id: 'HIDDEN_HIGHLAND',
      name: 'Hidden Highland',
      pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTERY_JUNGLE_01F_15F: {
      id: 'MYSTERY_JUNGLE_01F_15F',
      name: 'Mystery Jungle',
      pokemons: [Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTERY_JUNGLE_16F_30F: {
      id: 'MYSTERY_JUNGLE_16F_30F',
      name: 'Mystery Jungle',
      pokemons: [Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTIFYING_FOREST: {
      id: 'MYSTIFYING_FOREST',
      name: 'Mystifying Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    BEACH_CAVE: {
      id: 'BEACH_CAVE',
      name: 'Beach Cave',
      pokemons: [Pkm.KABUTO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
      type: Synergy.WATER
    },
    BOTTOMLESS_SEA: {
      id: 'BOTTOMLESS_SEA',
      name: 'Bottomless Sea',
      pokemons: [Pkm.KYOGRE, Pkm.GYARADOS, Pkm.KINGDRA, Pkm.SLOWBRO, Pkm.HORSEA, Pkm.SEADRA, Pkm.SLOWKING, Pkm.LAPRAS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    BRINE_CAVE: {
      id: 'BRINE_CAVE',
      name: 'Brine Cave',
      pokemons: [Pkm.OMANYTE, Pkm.DRAGONAIR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    CONCEALED_RUINS: {
      id: 'CONCEALED_RUINS',
      name: 'Concealed Ruins',
      pokemons: [Pkm.PIDGEY, Pkm.LOUDRED, Pkm.NIDOQUEEN, Pkm.SHUPPET, Pkm.RAIKOU, Pkm.PIDGEOT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    CRAGGY_COAST: {
      id: 'CRAGGY_COAST',
      name: 'Craggy Coast',
      pokemons: [Pkm.SPHEAL, Pkm.DRATINI, Pkm.SEALEO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    CRYSTAL_CAVE_01F_05F: {
      id: 'CRYSTAL_CAVE_01F_05F',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    CRYSTAL_CAVE_06F_11F: {
      id: 'CRYSTAL_CAVE_06F_11F',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    CRYSTAL_CROSSING: {
      id: 'CRYSTAL_CROSSING',
      name: 'Crystal Crossing',
      pokemons: [Pkm.BAGON, Pkm.ABSOL, Pkm.GLALIE, Pkm.FROSLASS, Pkm.AZELF],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DARK_CRATER: {
      id: 'DARK_CRATER',
      name: 'Dark Crater',
      pokemons: [Pkm.CHARMANDER, Pkm.CYNDAQUIL, Pkm.NUMEL, Pkm.GROWLITHE, Pkm.PONYTA, Pkm.TORCHIC, Pkm.FLAREON, Pkm.COMBUSKEN, Pkm.RAPIDASH, Pkm.MEWTWO, Pkm.ARCANINE, Pkm.QUILAVA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    DEEP_DARK_CRATER: {
      id: 'DEEP_DARK_CRATER',
      name: 'Deep Dark Crater',
      pokemons: [Pkm.CHARMELEON, Pkm.QUILAVA, Pkm.MONFERNO, Pkm.CAMERUPT, Pkm.COMBUSKEN, Pkm.ARCANINE, Pkm.RAPIDASH, Pkm.FLAREON, Pkm.RHYPERIOR, Pkm.MAGMORTAR, Pkm.CHARIZARD, Pkm.TYPHLOSION, Pkm.INFERNAPE, Pkm.BLAZIKEN, Pkm.AGGRON, Pkm.ENTEI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    DARK_HILL_01F_06F: {
      id: 'DARK_HILL_01F_06F',
      name: 'Dark Hill',
      pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_HILL_07F_15F: {
      id: 'DARK_HILL_07F_15F',
      name: 'Dark Hill',
      pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DEEP_DUSK_FOREST_01F_06F: {
      id: 'DEEP_DUSK_FOREST_01F_06F',
      name: 'Deep Dusk Forest',
      pokemons: [Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DEEP_DUSK_FOREST_07F_12F: {
      id: 'DEEP_DUSK_FOREST_07F_12F',
      name: 'Deep Dusk Forest',
      pokemons: [Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DEEP_SEALED_RUIN: {
      id: 'DEEP_SEALED_RUIN',
      name: 'Deep Sealed Ruin',
      pokemons: [Pkm.SHELGON, Pkm.METANG],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.METAL
    },
    DRENCHED_BLUFF: {
      id: 'DRENCHED_BLUFF',
      name: 'Drenched Bluff',
      pokemons: [Pkm.LILEEP, Pkm.ANORITH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    DUSK_FOREST_01F_04F: {
      id: 'DUSK_FOREST_01F_04F',
      name: 'Dusk Forest',
      pokemons: [Pkm.JUMPLUFF, Pkm.GABITE, Pkm.HAUNTER, Pkm.SALAMENCE, Pkm.RHYPERIOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DUSK_FOREST_05F_08F: {
      id: 'DUSK_FOREST_05F_08F',
      name: 'Dusk Forest',
      pokemons: [Pkm.JUMPLUFF, Pkm.GABITE, Pkm.HAUNTER, Pkm.SALAMENCE, Pkm.RHYPERIOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    NORTHERN_DESERT_01F_07F: {
      id: 'NORTHERN_DESERT_01F_07F',
      name: 'Northern Desert',
      pokemons: [Pkm.CUBONE, Pkm.ARON, Pkm.CACNEA, Pkm.LARVITAR, Pkm.TRAPINCH, Pkm.RHYHORN, Pkm.LAIRON, Pkm.CACTURNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    QUICKSAND_CAVE: {
      id: 'QUICKSAND_CAVE',
      name: 'Quicksand Cave',
      pokemons: [Pkm.NINCADA, Pkm.VIBRAVA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    QUICKSAND_PIT: {
      id: 'QUICKSAND_PIT',
      name: 'Quicksand Pit',
      pokemons: [Pkm.MESPRIT, Pkm.TYRANITAR, Pkm.NINJASK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    ROCK_AEGIS_CAVE: {
      id: 'ROCK_AEGIS_CAVE',
      name: 'Rock Aegis Cave',
      pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.MACHOKE, Pkm.MACHAMP, Pkm.REGIROCK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.MINERAL
    },
    SURROUNDED_SEA: {
      id: 'SURROUNDED_SEA',
      name: 'Surrounded Sea',
      pokemons: [Pkm.CARVANHA, Pkm.SLOWBRO, Pkm.HORSEA, Pkm.SEADRA, Pkm.SLOWKING, Pkm.KINGDRA, Pkm.LAPRAS, Pkm.LUGIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    TEMPORAL_SPIRE: {
      id: 'TEMPORAL_SPIRE',
      name: 'Temporal Spire',
      pokemons: [Pkm.DIALGA, Pkm.DEOXYS, Pkm.PORYGON, Pkm.SALAMENCE, Pkm.PORYGON_Z, Pkm.METAGROSS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.METAL
    },
    TEMPORAL_TOWER: {
      id: 'TEMPORAL_TOWER',
      name: 'Temporal Tower',
      pokemons: [Pkm.PORYGON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TEST_DUNGEON: {
      id: 'TEST_DUNGEON',
      name: 'Test Dungeon',
      pokemons: [Pkm.PORYGON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    THE_NIGHTMARE: {
      id: 'THE_NIGHTMARE',
      name: 'The Nightmare',
      pokemons: [Pkm.CLEFFA, Pkm.CLEFAIRY, Pkm.JIGGLYPUFF, Pkm.ESPEON, Pkm.WHISMUR, Pkm.PERSIAN, Pkm.IGGLYBUFF, Pkm.CLEFABLE, Pkm.WIGGLYTUFF],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    TINY_MEADOW: {
      id: 'TINY_MEADOW',
      name: 'Tiny Meadow',
      pokemons: [Pkm.SKIPLOOM, Pkm.STARAVIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    TREESHROUD_FOREST_01F_08F: {
      id: 'TREESHROUD_FOREST_01F_08F',
      name: 'Treeshroud Forest',
      pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.ALAKAZAM, Pkm.KIRLIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TREESHROUD_FOREST_09F_21F: {
      id: 'TREESHROUD_FOREST_09F_21F',
      name: 'Treeshroud Forest',
      pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.ALAKAZAM, Pkm.KIRLIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    STEAM_CAVE: {
      id: 'STEAM_CAVE',
      name: 'Steam Cave',
      pokemons: [Pkm.MAGBY, Pkm.NUMEL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    QUICKSAND_PIT_2: {
      id: 'QUICKSAND_PIT_2',
      name: 'Quicksand Pit',
      pokemons: [Pkm.MESPRIT, Pkm.TYRANITAR, Pkm.NINJASK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    LOWER_BRINE_CAVE: {
      id: 'LOWER_BRINE_CAVE',
      name: 'Lower Brine Cave',
      pokemons: [Pkm.WALREIN, Pkm.DRAGONAIR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    HIDDEN_LAND: {
      id: 'HIDDEN_LAND',
      name: 'Hidden land',
      pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    TEMPORAL_TOWER_2: {
      id: 'TEMPORAL_TOWER_2',
      name: 'Temporal Tower',
      pokemons: [Pkm.PORYGON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    CRYSTAL_CAVE_2: {
      id: 'CRYSTAL_CAVE_2',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    WATERFALL_CAVE: {
      id: 'WATERFALL_CAVE',
      name: 'Waterfall Cave',
      pokemons: [Pkm.POLIWAG, Pkm.LOTAD],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    WORLD_ABYSS: {
      id: 'WORLD_ABYSS',
      name: 'World Abyss',
      pokemons: [Pkm.GIRATINA, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.NIDOQUEEN, Pkm.UMBREON, Pkm.PIDGEOT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    ZERO_ISLE_EAST_15F_25F: {
      id: 'ZERO_ISLE_EAST_15F_25F',
      name: 'Zero Isle East',
      pokemons: [Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOUNDOUR, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.FERALIGATR, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    ZERO_ISLE_EAST_26F_40F: {
      id: 'ZERO_ISLE_EAST_26F_40F',
      name: 'Zero Isle East',
      pokemons: [Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOUNDOUR, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.FERALIGATR, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    ZERO_ISLE_SOUTH_01F_03F: {
      id: 'ZERO_ISLE_SOUTH_01F_03F',
      name: 'Zero Isle South',
      pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SEADRA, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    ZERO_ISLE_SOUTH_04F_08F: {
      id: 'ZERO_ISLE_SOUTH_04F_08F',
      name: 'Zero Isle East',
      pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SEADRA, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    BURIED_RELIC_1F_20F: {
      id: 'BURIED_RELIC_1F_20F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.SHEDNINJA, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    BURIED_RELIC_21F_50F: {
      id: 'BURIED_RELIC_21F_50F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.SHEDNINJA, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    BURIED_RELIC_51F_99F: {
      id: 'BURIED_RELIC_51F_99F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.SHEDNINJA, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DARKNIGHT_RELIC: {
      id: 'DARKNIGHT_RELIC',
      name: 'Darknight Relic',
      pokemons: [Pkm.SHUPPET, Pkm.GASTLY, Pkm.SHEDNINJA, Pkm.BANETTE, Pkm.HAUNTER, Pkm.DUSKULL, Pkm.GENGAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GHOST
    },
    SHIMMER_DESERT: {
      id: 'SHIMMER_DESERT',
      name: 'Shimmer Desert',
      pokemons: [Pkm.NIDOKING, Pkm.GARCHOMP, Pkm.RHYPERIOR, Pkm.GROUDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    UNOWN_RELIC: {
      id: 'UNOWN_RELIC',
      name: 'Unown Relic',
      pokemons: [],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    FROSTY_FOREST: {
      id: 'FROSTY_FOREST',
      name: 'Frosty Forest',
      pokemons: [Pkm.AZURILL, Pkm.PILOSWINE, Pkm.LAIRON, Pkm.SNORUNT, Pkm.ARTICUNO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ICE
    },
    GREAT_CANYON: {
      id: 'GREAT_CANYON',
      name: 'Great Canyon',
      pokemons: [Pkm.SKIPLOOM, Pkm.VILEPLUME, Pkm.CACTURNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    HOWLING_FOREST_01F_06F: {
      id: 'HOWLING_FOREST_01F_06F',
      name: 'Howling Forest',
      pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.WHISMUR, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.SNORLAX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    HOWLING_FOREST_07F_15F: {
      id: 'HOWLING_FOREST_07F_15F',
      name: 'Howling Forest',
      pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.WHISMUR, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.SNORLAX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    MT_FARAWAY: {
      id: 'MT_FARAWAY',
      name: 'Mt Faraway',
      pokemons: [Pkm.SNORUNT, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_FARAWAY_10F_20F: {
      id: 'MT_FARAWAY_10F_20F',
      name: 'Mt Faraway',
      pokemons: [Pkm.SNORUNT, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_FARAWAY_30F_39F: {
      id: 'MT_FARAWAY_30F_39F',
      name: 'Mt Faraway',
      pokemons: [Pkm.SNORUNT, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ICE
    },
    JOYOUS_TOWER: {
      id: 'JOYOUS_TOWER',
      name: 'Joyous Tower',
      pokemons: [Pkm.JIGGLYPUFF, Pkm.TREECKO, Pkm.BULBASAUR, Pkm.PICHU, Pkm.METAPOD, Pkm.CHIKORITA, Pkm.KAKUNA, Pkm.CLEFAIRY, Pkm.TORCHIC, Pkm.EEVEE, Pkm.CYNDAQUIL, Pkm.BELDUM, Pkm.SCYTHER, Pkm.SLAKOTH, Pkm.TRAPINCH, Pkm.CLEFABLE, Pkm.HOUNDOUR, Pkm.GARDEVOIR, Pkm.BELLOSSOM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    LAPIS_CAVE: {
      id: 'LAPIS_CAVE',
      name: 'Lapis Cave',
      pokemons: [Pkm.ZUBAT, Pkm.NINCADA, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.BAGON, Pkm.GOLBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.POISON
    },
    LIGHTNING_FIELD: {
      id: 'LIGHTNING_FIELD',
      name: 'Lightning Field',
      pokemons: [Pkm.MAREEP, Pkm.ELECTRIKE, Pkm.MAGNEMITE, Pkm.PIKACHU, Pkm.FLAFFY, Pkm.JOLTEON, Pkm.CACTURNE, Pkm.ELEKID, Pkm.MAGNETON, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.RAICHU, Pkm.RAIKOU],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MAGMA_CAVERN_08F_17F: {
      id: 'MAGMA_CAVERN_08F_17F',
      name: 'Magma Cavern',
      pokemons: [Pkm.RATICATE, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.GOLEM, Pkm.ONIX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FIRE
    },
    MAGMA_CAVERN_18F_23F: {
      id: 'MAGMA_CAVERN_18F_23F',
      name: 'Magma Cavern',
      pokemons: [Pkm.GROUDON, Pkm.RATICATE, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.GOLEM, Pkm.ONIX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FIRE
    },
    METEOR_CAVE: {
      id: 'METEOR_CAVE',
      name: 'Meteor Cave',
      pokemons: [Pkm.DEOXYS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    MT_BLAZE: {
      id: 'MT_BLAZE',
      name: 'Mt Blaze',
      pokemons: [Pkm.PIDGEOT, Pkm.MAGBY, Pkm.NUMEL, Pkm.RAPIDASH, Pkm.FEAROW, Pkm.ARCANINE, Pkm.MOLTRES],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FIRE
    },
    MT_STEEL_01F_05F: {
      id: 'MT_STEEL_01F_05F',
      name: 'Mt Steel',
      pokemons: [Pkm.SPEAROW, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.METAL
    },
    MT_STEEL_06F_08F: {
      id: 'MT_STEEL_06F_08F',
      name: 'Mt Steel',
      pokemons: [Pkm.SPEAROW, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.METAL
    },
    MT_FREEZE: {
      id: 'MT_FREEZE',
      name: 'Mt Freeze',
      pokemons: [Pkm.SWABLU, Pkm.SHELGON, Pkm.VIGOROTH, Pkm.SLAKING],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_THUNDER_PEAK: {
      id: 'MT_THUNDER_PEAK',
      name: 'Mt Thunder Peak',
      pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MT_THUNDER: {
      id: 'MT_THUNDER',
      name: 'Mt Thunder',
      pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MURKY_CAVE: {
      id: 'MURKY_CAVE',
      name: 'Murky Cave',
      pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.CROBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.POISON
    },
    NORMAL_MAZE: {
      id: 'NORMAL_MAZE',
      name: 'Normal Maze',
      pokemons: [Pkm.RATICATE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.NORMAL
    },
    NORTHERN_RANGE_01F_07F: {
      id: 'NORTHERN_RANGE_01F_07F',
      name: 'Northern Range',
      pokemons: [Pkm.NINJASK, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FLYING
    },
    NORTHERN_RANGE_08F_16F: {
      id: 'NORTHERN_RANGE_08F_16F',
      name: 'Northern Range',
      pokemons: [Pkm.NINJASK, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FLYING
    },
    NORTHWIND_FIELD: {
      id: 'NORTHWIND_FIELD',
      name: 'Northwind Field',
      pokemons: [Pkm.AZUMARILL, Pkm.VAPOREON, Pkm.POLIWHIRL, Pkm.POLITOED, Pkm.ABSOL, Pkm.CROCONAW, Pkm.WARTORTLE, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    PITFALL_VALLEY: {
      id: 'PITFALL_VALLEY',
      name: 'Pitfall Valley',
      pokemons: [Pkm.PIDGEOT, Pkm.HOPPIP, Pkm.BUTTERFREE, Pkm.RATICATE, Pkm.SWABLU, Pkm.SKIPLOOM, Pkm.AERODACTYL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FLYING
    },
    POISON_MAZE: {
      id: 'POISON_MAZE',
      name: 'Poison Maze',
      pokemons: [Pkm.NIDORANF, Pkm.NIDORANM, Pkm.NIDORINO, Pkm.NIDORINA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.POISON
    },
    PURITY_FOREST_04F_07F: {
      id: 'PURITY_FOREST_04F_07F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_13F_20F: {
      id: 'PURITY_FOREST_13F_20F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_30F_43F: {
      id: 'PURITY_FOREST_30F_43F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_44F_60F: {
      id: 'PURITY_FOREST_44F_60F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_61F_79F: {
      id: 'PURITY_FOREST_61F_79F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_80F_99F: {
      id: 'PURITY_FOREST_80F_99F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    RESCUE_TEAM_MAZE: {
      id: 'RESCUE_TEAM_MAZE',
      name: 'Rescue Team Maze',
      pokemons: [Pkm.PIDGEY, Pkm.RATTATA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    ROCK_PATH: {
      id: 'ROCK_PATH',
      name: 'Rock Path',
      pokemons: [Pkm.PIDGEOT, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.ZUBAT, Pkm.NUMEL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.POISON
    },
    SILENT_CHASM: {
      id: 'SILENT_CHASM',
      name: 'Silent Chasm',
      pokemons: [Pkm.WEEDLE, Pkm.GLOOM, Pkm.HOUNDOUR, Pkm.POLIWAG, Pkm.TRAPINCH, Pkm.BEEDRILL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.BUG
    },
    SILVER_TRENCH: {
      id: 'SILVER_TRENCH',
      name: 'Silver Trench',
      pokemons: [Pkm.LUGIA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOUNDOUR, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.FERALIGATR, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    SINISTER_WOODS: {
      id: 'SINISTER_WOODS',
      name: 'Sinister Woods',
      pokemons: [Pkm.SWINUB, Pkm.ODDISH, Pkm.SCYTHER, Pkm.SLAKOTH, Pkm.GENGAR, Pkm.MEDICHAM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.BUG
    },
    SKY_TOWER: {
      id: 'SKY_TOWER',
      name: 'Sky Tower',
      pokemons: [Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.RAYQUAZA, Pkm.DUSKULL, Pkm.ALTARIA, Pkm.SCIZOR, Pkm.DUSCLOPS, Pkm.FLYGON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FLYING
    },
    SNOW_PATH: {
      id: 'SNOW_PATH',
      name: 'Snow Path',
      pokemons: [Pkm.AZURILL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ICE
    },
    SOLAR_CAVE: {
      id: 'SOLAR_CAVE',
      name: 'Solar Cave',
      pokemons: [Pkm.BELDUM, Pkm.ABRA, Pkm.MEDITITE, Pkm.METANG, Pkm.KIRLIA, Pkm.KADABRA, Pkm.MEDICHAM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    SOUTHERN_CAVERN_01F_23F: {
      id: 'SOUTHERN_CAVERN_01F_23F',
      name: 'Southern Cavern',
      pokemons: [Pkm.GEODUDE, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.VIBRAVA, Pkm.LARVITAR, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    SOUTHERN_CAVERN_24F_50F: {
      id: 'SOUTHERN_CAVERN_24F_50F',
      name: 'Southern Cavern',
      pokemons: [Pkm.GEODUDE, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.VIBRAVA, Pkm.LARVITAR, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    STORMY_SEA_01F_16F: {
      id: 'STORMY_SEA_01F_16F',
      name: 'Stormy Sea',
      pokemons: [Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    STORMY_SEA_16F_39F: {
      id: 'STORMY_SEA_16F_39F',
      name: 'Stormy Sea',
      pokemons: [Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    THUNDERWAVE_CAVE: {
      id: 'THUNDERWAVE_CAVE',
      name: 'Thunderwave Cave',
      pokemons: [Pkm.RATTATA, Pkm.NIDORANM, Pkm.ELEKID],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    TINY_WOODS: {
      id: 'TINY_WOODS',
      name: 'Tiny Woods',
      pokemons: [Pkm.RATTATA, Pkm.RATTATA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.NORMAL
    },
    UPROAR_FOREST: {
      id: 'UPROAR_FOREST',
      name: 'Uproar Forest',
      pokemons: [Pkm.ROSELIA, Pkm.NUZLEAF, Pkm.LOTAD, Pkm.RATICATE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.GRASS
    },
    SERENITY_RIVER: {
      id: 'SERENITY_RIVER',
      name: 'Serenity River',
      pokemons: [Pkm.POLIWAG, Pkm.LOTAD],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    WATERFALL_POND: {
      id: 'WATERFALL_POND',
      name: 'Waterfall Pond',
      pokemons: [Pkm.MUDKIP, Pkm.LOTAD, Pkm.POLIWAG, Pkm.TOTODILE, Pkm.MAGIKARP, Pkm.SQUIRTLE, Pkm.LOMBRE, Pkm.MARSHTOMP],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    WESTERN_CAVE_B01F_B27F: {
      id: 'WESTERN_CAVE_B01F_B27F',
      name: 'Western Cave',
      pokemons: [Pkm.BUTTERFREE, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.IGGLYBUFF, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.AGGRON, Pkm.PERSIAN, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WESTERN_CAVE_B28F_B39F: {
      id: 'WESTERN_CAVE_B28F_B39F',
      name: 'Western Cave',
      pokemons: [Pkm.BUTTERFREE, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.IGGLYBUFF, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.AGGRON, Pkm.PERSIAN, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WISH_CAVE_01F_13F: {
      id: 'WISH_CAVE_01F_13F',
      name: 'Wish Cave',
      pokemons: [Pkm.BUTTERFREE, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.IGGLYBUFF, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.AGGRON, Pkm.PERSIAN, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WISH_CAVE_90F_99F: {
      id: 'WISH_CAVE_90F_99F',
      name: 'Wish Cave',
      pokemons: [Pkm.BUTTERFREE, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.IGGLYBUFF, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.AGGRON, Pkm.PERSIAN, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WYVERN_HILL: {
      id: 'WYVERN_HILL',
      name: 'Wyvern Hill',
      pokemons: [Pkm.BAGON, Pkm.DRATINI, Pkm.ALTARIA, Pkm.TOTODILE, Pkm.LUDICOLO, Pkm.SHELGON, Pkm.VIBRAVA, Pkm.DRAGONAIR, Pkm.SALAMENCE, Pkm.FLYGON, Pkm.DRAGONITE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.DRAGON
    }
  });

export const MASK_COORDINATE = Object.freeze({
  X: {x: 1, y: 4},
  A: {x: 1, y: 8},
  B: {x: 0, y: 7},
  C: {x: 1, y: 6},
  D: {x: 2, y: 7},
  AB: {x: 0, y: 5},
  AC: {x: 0, y: 4},
  AD: {x: 2, y: 5},
  BC: {x: 0, y: 3},
  BD: {x: 1, y: 3},
  CD: {x: 2, y: 3},
  ABC: {x: 0, y: 10},
  ABD: {x: 1, y: 11},
  ACD: {x: 2, y: 10},
  BCD: {x: 1, y: 9},
  ABCD: {x: 1, y: 7},
  A1B: {x: 0, y: 2},
  B2C: {x: 0, y: 0},
  C3D: {x: 2, y: 0},
  AD4: {x: 2, y: 2},
  A1BC: {x: 0, y: 17},
  AB2C: {x: 0, y: 18},
  B2CD: {x: 1, y: 19},
  BC3D: {x: 0, y: 19},
  AC3D: {x: 1, y: 18},
  ACD4: {x: 1, y: 17},
  A1BD: {x: 1, y: 20},
  ABD4: {x: 0, y: 20},
  A1B2C: {x: 0, y: 1},
  B2C3D: {x: 1, y: 0},
  AC3D4: {x: 2, y: 1},
  A1BD4: {x: 1, y: 2},
  A1BCD: {x: 0, y: 22},
  AB2CD: {x: 0, y: 21},
  ABC3D: {x: 1, y: 21},
  ABCD4: {x: 1, y: 22},
  A1B2CD: {x: 2, y: 13},
  AB2C3D: {x: 1, y: 14},
  ABC3D4: {x: 0, y: 13},
  A1BCD4: {x: 1, y: 12},
  A1B2C3D: {x: 1, y: 16},
  AB2C3D4: {x: 0, y: 16},
  A1BC3D4: {x: 0, y: 15},
  A1B2CD4: {x: 1, y: 15},
  A1BC3D: {x: 0, y: 23},
  AB2CD4: {x: 1, y: 23},
  A1B2C3D4: {x: 1, y: 1}
});

export const MASK_TABLE = Object.freeze({
  X: 'X',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  AB: 'AB',
  AC: 'AC',
  AD: 'AD',
  BC: 'BC',
  BD: 'BD',
  CD: 'CD',
  ABC: 'ABC',
  ABD: 'ABD',
  ACD: 'ACD',
  BCD: 'BCD',
  ABCD: 'ABCD',
  A1B: 'A1B',
  B2C: 'B2C',
  C3D: 'C3D',
  AD4: 'AD4',
  A1BC: 'A1BC',
  AB2C: 'AB2C',
  B2CD: 'B2CD',
  BC3D: 'BC3D',
  AC3D: 'AC3D',
  ACD4: 'ACD4',
  A1BD: 'A1BD',
  ABD4: 'ABD4',
  A1B2C: 'A1B2C',
  B2C3D: 'B2C3D',
  AC3D4: 'AC3D4',
  A1BD4: 'A1BD4',
  A1BCD: 'A1BCD',
  AB2CD: 'AB2CD',
  ABC3D: 'ABC3D',
  ABCD4: 'ABCD4',
  A1B2CD: 'A1B2CD',
  AB2C3D: 'AB2C3D',
  ABC3D4: 'ABC3D4',
  A1BCD4: 'A1BCD4',
  A1B2C3D: 'A1B2C3D',
  AB2C3D4: 'AB2C3D4',
  A1BC3D4: 'A1BC3D4',
  A1B2CD4: 'A1B2CD4',
  A1BC3D: 'A1BC3D',
  AB2CD4: 'AB2CD4',
  A1B2C3D4: 'A1B2C3D4'
});

export const TERRAIN = Object.freeze({
  GROUND: 0,
  WALL: 1,
  WATER: 2
});

export const ID_TABLE = {
  0: 'X', 1: 'A', 2: 'B', 4: 'C', 8: 'D',
  3: 'AB', 5: 'AC', 9: 'AD', 6: 'BC', 10: 'BD', 12: 'CD',
  7: 'ABC', 11: 'ABD', 13: 'ACD', 14: 'BCD', 15: 'ABCD',
  19: 'A1B', 38: 'B2C', 76: 'C3D', 137: 'AD4',
  23: 'A1BC', 39: 'AB2C', 46: 'B2CD', 78: 'BC3D',
  77: 'AC3D', 141: 'ACD4', 27: 'A1BD', 139: 'ABD4',
  55: 'A1B2C', 110: 'B2C3D', 205: 'AC3D4', 155: 'A1BD4',
  31: 'A1BCD', 47: 'AB2CD', 79: 'ABC3D', 143: 'ABCD4',
  63: 'A1B2CD', 111: 'AB2C3D', 207: 'ABC3D4', 159: 'A1BCD4',
  127: 'A1B2C3D', 239: 'AB2C3D4', 223: 'A1BC3D4', 191: 'A1B2CD4',
  95: 'A1BC3D', 175: 'AB2CD4', 255: 'A1B2C3D4'
};


export const NEUTRAL_STAGE = [
  {
    turn: 1,
    avatar: `${PkmIndex[Pkm.MAGIKARP].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 2,
    avatar: `${PkmIndex[Pkm.RATICATE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 3,
    avatar: `${PkmIndex[Pkm.FEAROW].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 10,
    avatar: `${PkmIndex[Pkm.GYARADOS].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 15,
    avatar: `${PkmIndex[Pkm.LUGIA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 20,
    avatar: `${PkmIndex[Pkm.GIRATINA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 25,
    avatar: `${PkmIndex[Pkm.ZAPDOS].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 30,
    avatar: `${PkmIndex[Pkm.DIALGA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 35,
    avatar: `${PkmIndex[Pkm.SUICUNE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 40,
    avatar: `${PkmIndex[Pkm.REGICE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 45,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 50,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 55,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  }];


export const CDN_PORTRAIT_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/';

export const CDN_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master';