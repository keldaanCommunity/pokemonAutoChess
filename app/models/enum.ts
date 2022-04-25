import { Rarity } from "../types/enum/Game";
import { Effect } from "../types/enum/Effect"
import { Ability } from "../types/enum/Ability"
import { Synergy } from "../types/enum/Synergy";
import { Emotion } from "../types";
import { Pkm, PokemonIndex } from '../types/enum/Pokemon';

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

export const CLIMATE = Object.freeze({
  NEUTRAL: 'NEUTRAL',
  RAIN: 'RAIN',
  SUN: 'SUN',
  SANDSTORM: 'SANDSTORM',
  SNOW: 'SNOW'
});

export const ITEMS = Object.freeze({
  WHITE_GLASSES: 'WHITE_GLASSES',
  MUSCLE_BAND: 'MUSCLE_BAND',
  LIFE_ORB: 'LIFE_ORB',
  COIN_AMULET: 'COIN_AMULET',
  ROCKY_HELMET: 'ROCKY_HELMET',
  SHELL_BELL: 'SHELL_BELL',
  BIG_ROOT: 'BIG_ROOT',
  APRICOT_BERRY: 'APRICOT_BERRY',
  LIECHI_BERRY: 'LIECHI_BERRY',
  GANLON_BERRY: 'GANLON_BERRY',
  PETAYA_BERRY: 'PETAYA_BERRY',
  SALAC_BERRY: 'SALAC_BERRY',
  ORAN_BERRY: 'ORAN_BERRY',
  SOFT_SAND: 'SOFT_SAND',
  MOON_STONE: 'MOON_STONE',
  NIGHT_STONE: 'NIGHT_STONE',
  POISON_BARB: 'POISON_BARB',
  DRAGON_FANG: 'DRAGON_FANG',
  THUNDER_STONE: 'THUNDER_STONE',
  METAL_SKIN: 'METAL_SKIN',
  METRONOME: 'METRONOME',
  WATER_STONE: 'WATER_STONE',
  FIRE_STONE: 'FIRE_STONE',
  LEAF_STONE: 'LEAF_STONE',
  BLACK_BELT: 'BLACK_BELT',
  SILK_SCARF: 'SILK_SCARF',
  DAWN_STONE: 'DAWN_STONE',
  ICY_ROCK: 'ICY_ROCK',
  RAZOR_FANG: 'RAZOR_FANG',
  RAZOR_CLAW: 'RAZOR_CLAW',
  SCOPE_LENS: 'SCOPE_LENS',
  REVIVER_SEED: 'REVIVER_SEED',
  ASSAULT_VEST: 'ASSAULT_VEST',
  BLUE_ORB: 'BLUE_ORB',
  RED_ORB: 'RED_ORB',
  DELTA_ORB: 'DELTA_ORB',
  WONDER_BOX: 'WONDER_BOX',
  ARMOR_FOSSIL: 'ARMOR_FOSSIL',
  CLAW_FOSSIL: 'CLAW_FOSSIL',
  COVER_FOSSIL: 'COVER_FOSSIL',
  DOME_FOSSIL: 'DOME_FOSSIL',
  HELIX_FOSSIL: 'HELIX_FOSSIL',
  JAW_FOSSIL: 'JAW_FOSSIL',
  OLD_AMBER: 'OLD_AMBER',
  PLUME_FOSSIL: 'PLUME_FOSSIL',
  ROOT_FOSSIL: 'ROOT_FOSSIL',
  SAIL_FOSSIL: 'SAIL_FOSSIL',
  SKULL_FOSSIL: 'SKULL_FOSSIL'
});

export const EFFECTS_ICON = Object.freeze({
  [Effect.INGRAIN] : {
    level: 1,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.GROWTH] : {
    level: 2,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.SPORE] : {
    level: 3,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.BLAZE] : {
    level: 1,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DROUGHT] : {
    level: 2,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DESOLATE_LAND] : {
    level: 3,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DRIZZLE] : {
    level: 1,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.RAIN_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.PRIMORDIAL_SEA] : {
    level: 3,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.STAMINA] : {
    level: 1,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.STRENGTH] : {
    level: 2,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.PURE_POWER] : {
    level: 3,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.EERIE_IMPULSE] : {
    level: 1,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.RISING_VOLTAGE] : {
    level: 2,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.OVERDRIVE] : {
    level: 3,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.REVENGE] : {
    level: 1,
    positive: true,
    type: Synergy.FIGHTING
  },
  [Effect.PUNISHMENT] : {
    level: 2,
    positive: true,
    type: Synergy.FIGHTING
  },
  [Effect.AMNESIA] : {
    level: 1,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.LIGHT_SCREEN] : {
    level: 2,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.EERIE_SPELL] : {
    level: 3,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.HONE_CLAWS] : {
    level: 1,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.ASSURANCE] : {
    level: 2,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.BEAT_UP] : {
    level: 3,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.IRON_DEFENSE] : {
    level: 1,
    positive: true,
    type: Synergy.METAL
  },
  [Effect.AUTOTOMIZE] : {
    level: 2,
    positive: true,
    type: Synergy.METAL
  },
  [Effect.SHORE_UP] : {
    level: 1,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.ROTOTILLER] : {
    level: 2,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.SANDSTORM] : {
    level: 3,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.POISON_GAS] : {
    level: 1,
    positive: true,
    type: Synergy.POISON
  },
  [Effect.TOXIC] : {
    level: 2,
    positive: true,
    type: Synergy.POISON
  },
  [Effect.DRAGON_ENERGY] : {
    level: 1,
    positive: true,
    type: Synergy.DRAGON
  },
  [Effect.DRAGON_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.DRAGON
  },
  [Effect.BULK_UP] : {
    level: 1,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.RAGE] : {
    level: 2,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.ANGER_POINT] : {
    level: 3,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.PURSUIT] : {
    level: 1,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.BRUTAL_SWING] : {
    level: 2,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.POWER_TRIP] : {
    level: 3,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.MEDITATE] : {
    level: 1,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.FOCUS_ENERGY] : {
    level: 2,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.CALM_MIND] : {
    level: 3,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.SWARM] : {
    level: 1,
    positive: true,
    type: Synergy.BUG
  },
  [Effect.STICKY_WEB] : {
    level: 2,
    positive: true,
    type: Synergy.BUG
  },
  [Effect.SWIFT_SWIM] : {
    level: 1,
    positive: true,
    type: Synergy.AQUATIC
  },
  [Effect.HYDRO_CANNON] : {
    level: 2,
    positive: true,
    type: Synergy.AQUATIC
  },
  [Effect.TAILWIND] : {
    level: 1,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.FEATHER_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.MAX_AIRSTREAM] : {
    level: 3,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.MAX_GUARD] : {
    level: 4,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.ODD_FLOWER] : {
    level: 1,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.GLOOM_FLOWER] : {
    level: 2,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.VILE_FLOWER] : {
    level: 3,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.SUN_FLOWER] : {
    level: 4,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.BATTLE_ARMOR] : {
    level: 1,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.MOUTAIN_RESISTANCE] : {
    level: 2,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.DIAMOND_STORM] : {
    level: 3,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.PHANTOM_FORCE] : {
    level: 1,
    positive: true,
    type: Synergy.GHOST
  },
  [Effect.CURSE] : {
    level: 2,
    positive: true,
    type: Synergy.GHOST
  },
  [Effect.AROMATIC_MIST] : {
    level: 1,
    positive: true,
    type: Synergy.FAIRY
  },
  [Effect.FAIRY_WIND] : {
    level: 2,
    positive: true,
    type: Synergy.FAIRY
  },
  [Effect.GROUND] : {
    level: 0,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.GRASS] : {
    level: 0,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.FIRE] : {
    level: 0,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.WATER] : {
    level: 0,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.NORMAL] : {
    level: 0,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.ICE] : {
    level: 0,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.SNOW] : {
    level: 1,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.SHEER_COLD] : {
    level: 2,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.ANCIENT_POWER] : {
    level: 1,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.ELDER_POWER] : {
    level: 2,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.UNOWN_GATHERINGS] : {
    level: 3,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.LARGO] : {
    level: 1,
    positive: true,
    type: Synergy.SOUND
  },
  [Effect.ALLEGRO] : {
    level: 2,
    positive: true,
    type: Synergy.SOUND
  },
  [Effect.PRESTO] : {
    level: 3,
    positive: true,
    type: Synergy.SOUND
  }
});

export const SPECIAL_SKILL_DESCRIPTION = Object.freeze({
  [Ability.KING_SHIELD] : {
    title: {
      eng: 'King Shield'
    },
    description: {
      eng: 'Protect the user for 0.75/1.5/3s and swap his position with the farthest ennemy'
    }
  },
  [Ability.EXPLOSION] : {
    title: {
      eng: 'Explosion'
    },
    description: {
      eng: 'Deals 40/80/160 physical damage. Damage also the user.'
    }
  },
  [Ability.NIGHTMARE] : {
    title: {
      eng: 'Nightmare'
    },
    description: {
      eng: 'Poison the ennemy team for 2/4/8s'
    }
  },
  [Ability.CLANGOROUS_SOUL] : {
    title: {
      eng: 'Clangorous Soul'
    },
    description: {
      eng: 'Buff the adjacent allies with 2/4/8 attack and 1/2/4 defense/special defense'
    }
  },
  [Ability.BONEMERANG] : {
    title: {
      eng: 'Bonemerang'
    },
    description: {
      eng: 'Throw a boomerang bone through the enemy team, dealing 30/60/120 physical damage on its way'
    }
  },
  [Ability.GROWL] : {
    title: {
      eng: 'Growl'
    },
    description: {
      eng: 'Apply wound status on the ennemy team for 1/2/3s'
    }
  },
  [Ability.RELIC_SONG] : {
    title: {
      eng: 'Relic Song'
    },
    description: {
      eng: 'Put asleep the ennemy team for .5/1/2s'
    }
  },
  [Ability.DISARMING_VOICE] : {
    title: {
      eng: 'Disarming Voice'
    },
    description: {
      eng: 'Heals and restore 10/20/40 points of mana to all allies'
    }
  },
  [Ability.HIGH_JUMP_KICK] : {
    title: {
      eng: 'High Jump Kick'
    },
    description: {
      eng: 'Deals 50/100/200 physical damage and steal the mana from its target'
    }
  },
  [Ability.GRASS_WHISTLE] : {
    title: {
      eng: 'Grass Whistle'
    },
    description: {
      eng: 'Put asleep 1/2/4 ennemies for 2 seconds'
    }
  },
  [Ability.TRI_ATTACK] : {
    title: {
      eng: 'Tri Attack'
    },
    description: {
      eng: 'Burn, freeze and wound the target for 2/4/8s'
    }
  },
  [Ability.ECHO] : {
    title: {
      eng: 'Echo'
    },
    description: {
      eng: 'Deals 5/10/20 special damage, +3/+6/+9 damage each time the pokemon uses its ability'
    }
  },
  [Ability.PETAL_DANCE] : {
    title: {
      eng: 'Petal Dance'
    },
    description: {
      eng: 'Deals 30/60/90 special damage to 2/3/4 ennemies'
    }
  },
  [Ability.HYPER_VOICE] : {
    title: {
      eng: 'Hyper Voice'
    },
    description: {
      eng: 'Deals 50/100/200 special damage on a row, confuse for 1/2/3 seconds'
    }
  },
  [Ability.SHADOW_CLONE] : {
    title: {
      eng: 'Shadow Clone'
    },
    description: {
      eng: 'The pokemon creates an identical clone of himself next to his target. This clone inherits from the pokemon items and stats'
    }
  },
  [Ability.VOLT_SWITCH] : {
    title: {
      eng: 'Volt Switch'
    },
    description: {
      eng: 'Dash into the ennemy backline, dealing 40/80/160 special damage'
    }
  },
  [Ability.DEFAULT] : {
    title: {
      eng: '',
      esp: '',
      fra: ''
    },
    description: {
      eng: '',
      esp: '',
      fra: ''
    }
  },
  [Ability.BURN] : {
    title: {
      eng: 'Burn',
      esp: 'Quemado',
      fra: 'Brulure'
    },
    description: {
      eng: 'Burn the whole team for 5/10/20 seconds, dealing 5% hp/ seconds',
      esp: 'Quemar todo el equipo durante 2/4/8 segundos, repartiendo el 5% de hp/segundos',
      fra: 'Brule la cible pour 2/4/8 secondes, lui faisant perdre 5% hp/secondes'
    }
  },
  [Ability.POISON] : {
    title: {
      eng: 'Poison',
      esp: 'Veneno',
      fra: 'Poison'
    },
    description: {
      eng: 'Poison the target for 5/10/20 seconds, dealing 10% hp/seconds',
      esp: 'Envenenar el objetivo durante 5/10/20 segundos, repartiendo 15% hp/segundos',
      fra: 'Empoisonne la cible durant 5/10/20 secondes, faisant 15% hp/secondes'
    }
  },
  [Ability.SLEEP] : {
    title: {
      eng: 'Sleep',
      esp: 'Duerme',
      fra: 'Dormir'
    },
    description: {
      eng: 'Sleeps the target for 3/5/7 seconds',
      esp: 'Duerme el objetivo durante 3/5/7 segundos',
      fra: 'Endors la cible durant 3/5/7 secondes'
    }
  },
  [Ability.SILENCE] : {
    title: {
      eng: 'Silence',
      esp: 'Silencio',
      fra: 'Silence'
    },
    description: {
      eng: 'Silence the whole team for 2/4/8 seconds',
      esp: 'Silenciar todo el equipo durante 2/4/8 segundos',
      fra: 'Silence toute l équipe ennemie durant 2/4/8 secondes'
    }
  },
  [Ability.PROTECT] : {
    title: {
      eng: 'Protect',
      esp: 'Proteja',
      fra: 'Abri'
    },
    description: {
      eng: 'Makes the pokemon invulnerable for 3/5/7 seconds.',
      esp: 'Hace que el pokemon sea invulnerable durante 3/5/7 segundos.',
      fra: 'Rend le pokémon invulnérable durant 3/5/7 secondes'
    }
  },
  [Ability.FREEZE] : {
    title: {
      eng: 'Freeze',
      esp: 'Congelar',
      fra: 'Gelé'
    },
    description: {
      eng: 'Freeze the whole ennemy team for 1/2/4 seconds',
      esp: 'Congela todo el equipo durante 1/2/4 segundos',
      fra: 'Gèle la cible durant 1/2/4 secondes'
    }
  },
  [Ability.CONFUSION] : {
    title: {
      eng: 'Confusion',
      esp: 'Confusión',
      fra: 'Confusion'
    },
    description: {
      eng: 'Makes the target confused for .5/1.5/3 seconds',
      esp: 'Hace que todo el equipo se confunda durante 1/2/4 segundos',
      fra: 'Rend toute la team ennemie confus pendant 1/ 2 4 secondes'
    }
  },
  [Ability.FIRE_BLAST] : {
    title: {
      eng: 'Fire Blast',
      esp: 'Ráfaga de fuego',
      fra: 'Déflagration'
    },
    description: {
      eng: 'Throw a fire blast for 30/50/100 special damage',
      esp: 'Lanza una ráfaga de fuego para 30/50/100 de daño especial',
      fra: 'Lance une déflagration infligeant 30/50/100 dégats spéciaux'
    }
  },
  [Ability.WHEEL_OF_FIRE] : {
    title: {
      eng: 'Flame Wheel',
      esp: 'Rueda de fuego',
      fra: 'Roue de feu'
    },
    description: {
      eng: 'Sends a fire wheel that makes a round trip doing 30/40/50 special damages.',
      esp: 'Envía una rueda de fuego que hace un viaje de ida y vuelta haciendo 30/40/50 de daño especial.',
      fra: 'Envoie une boule de feu faisant un aller retour, endommageant les pokémons pour 30/40/50 dégats spéciaux'
    }
  },
  [Ability.SEISMIC_TOSS] : {
    title: {
      eng: 'Seismic toss',
      esp: 'Lanzamiento sísmico',
      fra: 'Frappe Atlas'
    },
    description: {
      eng: 'Mono target attack that deals true damage function of how big is your team',
      esp: 'Ataque de objetivo mono que inflige daño real en función de lo grande que sea tu equipo.',
      fra: 'Attaque mono cible dont les dégats varient en fonction de la taille de l équipe.'
    }
  },
  [Ability.GUILLOTINE] : {
    title: {
      eng: 'Guillotine',
      esp: 'Guillotina',
      fra: 'Guillotine'
    },
    description: {
      eng: 'Mono target attack that deals physical damage. Restores full mana if target killed',
      esp: 'Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere',
      fra: 'Attaque mono cible qui fait des dégats physiques. Restaure la moitié du mana si la cible est tué.'
    }
  },
  [Ability.ROCK_SLIDE] : {
    title: {
      eng: 'Rock Slide',
      esp: 'Deslizamiento de rocas',
      fra: 'Eboulement'
    },
    description: {
      eng: 'Mono target attack that deals physical damage. Doubles damage if target is type flying.',
      esp: 'Ataque de objetivo mono que causa daño físico. Duplica el daño si el objetivo es de tipo volador.',
      fra: 'Attaque mono cible qui fait des dégats physiques. Double les dégats si type vol.'
    }
  },
  [Ability.HEAT_WAVE] : {
    title: {
      eng: 'Heat wave',
      esp: 'Ola de calor',
      fra: 'Canicule'
    },
    description: {
      eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
      fra: 'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
    }
  },
  [Ability.THUNDER] : {
    title: {
      eng: 'Thunder',
      esp: 'Trueno',
      fra: 'Fatal-Foudre'
    },
    description: {
      eng: 'Mono target damage that deals 30/50/70 special damage.',
      esp: 'Daño de objetivo mono que inflige 30/50/70 de daño especial.',
      fra: 'Attaque monocibe infligeant 30/50/70 dégats spéciaux.'
    }
  },
  [Ability.HYDRO_PUMP] : {
    title: {
      eng: 'Hydro Cannon',
      esp: 'Hidrobomba',
      fra: 'Hydrocanon'
    },
    description: {
      eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
      fra: 'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
    }
  },
  [Ability.DRACO_METEOR] : {
    title: {
      eng: 'Draco meteor',
      esp: 'Meteoro Draco',
      fra: 'Draco meteor'
    },
    description: {
      eng: 'Area of effect attack that deals 10/20/40 special damages to all ennemies',
      esp: 'Ataque de área de efecto que causa 10/20/40 de daño especial a todos los enemigos',
      fra: 'Inflige 10/20/40 dégats spéciaux à tous les pokémons ennemis.'
    }
  },
  [Ability.BLAZE_KICK] : {
    title: {
      eng: 'Blaze kick',
      esp: 'Patada de fuego',
      fra: 'Pied de feu'
    },
    description: {
      eng: 'Mono target that deals 30/60/90 physical damage.',
      esp: 'Objetivo mono que causa 30/60/90 de daño físico',
      fra: 'Attaque monocinle faisant 30/60/90 dégats physiques'
    }
  },
  [Ability.WISH] : {
    title: {
      eng: 'Wish',
      esp: 'Deseo',
      fra: 'Voeu'
    },
    description: {
      eng: 'Restores 50 hp to 1/2/3 ally pokemon',
      esp: 'Restaura 50 hp a 1/2/3 de pokemon aliado',
      fra: 'Soigne 50 hp à 1/2/3 pokémons alliés'
    }
  },
  [Ability.CALM_MIND] : {
    title: {
      eng: 'Calm mind',
      esp: 'Mente tranquila',
      fra: 'Plénitude'
    },
    description: {
      eng: 'Buff pokemon attack by 50/100/150%',
      esp: 'Ataque de pokemón de la Buff en un 50/100/150%.',
      fra: 'Augmente l attaque du pokémon de 50/100/150%.'
    }
  },
  [Ability.IRON_DEFENSE] : {
    title: {
      eng: 'Defense Curl',
      esp: 'Defensa del hierro',
      fra: 'Mur de fer'
    },
    description: {
      eng: 'Buff pokemon defense / special defense by 4/6/8 points',
      esp: 'Defensa pokemon buff / defensa especial por 4/6/8 puntos',
      fra: 'Augmente la défense du pokémon de 4/6/8 points'
    }
  },
  [Ability.METRONOME] : {
    title: {
      eng: 'Metronome',
      esp: 'Métrónomo',
      fra: 'Metronome'
    },
    description: {
      eng: 'Shoot a random capacity',
      esp: 'Disparar una capacidad aleatoria',
      fra: 'Execute une capacité au hasard'
    }
  },
  [Ability.SOAK] : {
    title: {
      eng: 'Soak',
      esp: 'Empápate',
      fra: 'Lessivage'
    },
    description: {
      eng: 'Deals 20/30/40 special damage and restores 10 mana to friendly pokemons',
      esp: 'Hace 20/30/40 de daño especial y devuelve 10 de maná a los pokemons amistosos.',
      fra: 'Fait 20/30/40 dégats spéciaux et restaure 10 mana à chaque pokémon allié.'
    }
  },
  [Ability.ORIGIN_PULSE] : {
    title: {
      eng: 'Origin Pulse',
      esp: 'Fogonazo',
      fra: 'Onde Originelle'
    },
    description: {
      eng: 'A wave travels horizontally across the battlefield doing 60 magic damage',
      esp: 'Una ola viaja horizontalmente por el campo de batalla haciendo 60 de daño mágico.',
      fra: 'Une vague parcourt horizontalement le champ de bataille faisant 60 dégats magiques'
    }
  },
  [Ability.SEED_FLARE] : {
    title: {
      eng: 'Seed Flare',
      esp: 'Pulso Primigenio',
      fra: 'Fulmigraine'
    },
    description: {
      eng: 'Shaymins body emits a shock wave, dealing 30 magic damage to all ennemies, and decreasing their special defense by 2.',
      esp: 'El cuerpo de Shaymin emite una onda de choque que inflige 30 de daño mágico a todos los enemigos y reduce su velocidad en 2.',
      fra: 'Le corps de Shaymin émet une onde de choc, infligeant 30 dégâts magiques à tous les ennemis et réduisant leur vitesse de 2.'
    }
  },
  [Ability.IRON_TAIL] : {
    title: {
      eng: 'Iron tail',
      esp: 'Cola de hierro',
      fra: 'Queue de fer'
    },
    description: {
      eng: 'Mono target damage attack that deals 20/30/40. Buff defense by 1/3/5 points.',
      esp: 'Ataque de daño al objetivo mono que reparte 20/30/40. Pulveriza la defensa por 1/3/5 puntos.',
      fra: 'Attaque monocible faisant 20/30/40 dégats physique. Booste la défense de 1/3/5 points.'
    }
  },
  [Ability.BLAST_BURN] : {
    title: {
      eng: 'Blast Burn',
      esp: 'Quemadura por ráfaga',
      fra: 'Aire de feu'
    },
    description: {
      eng: 'Area of effect attack that deals 30/50/80 special damages.',
      esp: 'Ataque en el área de efecto que causa 30/50/80 daños especiales.',
      fra: 'Attaque AOE en cercle faisant 30/50/80 dégats spéciaux.'
    }
  },
  [Ability.CHARGE] : {
    title: {
      eng: 'Charge',
      esp: 'Carga',
      fra: 'Chargeur'
    },
    description: {
      eng: 'Buff all electric ally pokemons attack by 10/20/30 %',
      esp: 'Pulir todos los pokemones aliados eléctricos atacan en un 10/20/30 %.',
      fra: 'Augmente l attaque des alliés electrique de 10/20/30%'
    }
  },
  [Ability.DISCHARGE] : {
    title: {
      eng: 'Discharge',
      esp: 'Descarga',
      fra: 'Coud Jus'
    },
    description: {
      eng: 'Area of effect attack that deals 40/60/80 special damages.',
      esp: 'Ataque en el área de efecto que causa 40/60/80 daños especiales.',
      fra: 'Attaque AOE en cercle faisant 40/60/80 dégats spéciaux.'
    }
  },
  [Ability.BITE] : {
    title: {
      eng: 'Bite',
      esp: 'Mordida',
      fra: 'Morsure'
    },
    description: {
      eng: '50% Life steal mono target physical attack that deals 30/50/70 damage.',
      esp: '50% Vida robar mono objetivo de ataque físico que inflige 30/50/70 de daño.',
      fra: 'Attaque monocible avec 50% de vol de vie faisant 30/50/70 dégats spéciaux.'
    }
  },
  [Ability.DRAGON_TAIL] : {
    title: {
      eng: 'Dragon Tail',
      esp: 'Cola de Dragón',
      fra: 'Draco Queue'
    },
    description: {
      eng: 'Mono target physical attack that deals 30/40/50 damage and buff defenses by 1/2/3 points',
      esp: 'El ataque físico de un monoobjetivo que inflige 30/40/50 de daño y mejora las defensas en 1/2/3 puntos',
      fra: 'Attaque mono-cible faisant 30/40/50 dégats physique et boostant les défenses de 1/2/3 points.'
    }
  },
  [Ability.DRAGON_BREATH] : {
    title: {
      eng: 'Dragon Breath',
      esp: 'Aliento de Dragón',
      fra: 'Draco Souffle'
    },
    description: {
      eng: 'Area of effect attack that deals 30/40/50 special damage in a line behind the target',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 30/40/50 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  [Ability.ICICLE_CRASH] : {
    title: {
      eng: 'Icicle Crash',
      esp: 'Choque de carámbanos',
      fra: 'Chute glace'
    },
    description: {
      eng: 'Area of effect attack that deals 30/40/50 physical damage around the target',
      esp: 'Ataque de área de efecto que causa 30/40/50 de daño físico alrededor del objetivo',
      fra: 'Attaque AOE en cercle faisant 30/40/50 dégats physiques'
    }
  },
  [Ability.ROOT] : {
    title: {
      eng: 'Root',
      esp: 'Raíz',
      fra: 'Racine'
    },
    description: {
      eng: 'Heal all nearby ally pokemons by 20/30/40 hp.',
      esp: 'Curar a todos los pokemons aliados cercanos con 20/30/40 hp.',
      fra: 'Soigne les alliés autour de 20/30/40 hp.'
    }
  },
  [Ability.TORMENT] : {
    title: {
      eng: 'Torment',
      esp: 'Viaje',
      fra: 'Tourment'
    },
    description: {
      eng: 'Increase attack speed by 20/30/40 %',
      esp: 'Aumenta la velocidad de ataque en un 20/30/40 %.',
      fra: 'Augmente la vitesse d attaque de 20/30/40%'
    }
  },
  [Ability.STOMP] : {
    title: {
      eng: 'Stomp',
      esp: 'Pisotón',
      fra: 'Ecrasement'
    },
    description: {
      eng: 'Mono target physical damage (2*atk*stars)',
      esp: 'Daño físico del objetivo mono (2*atk*stars)',
      fra: 'Attaque mono cible faisant 2*atk*stars dégats physiques'
    }
  },
  [Ability.DARK_PULSE] : {
    title: {
      eng: 'Dark Pulse',
      esp: 'Pulso oscuro',
      fra: 'Vibrobscur'
    },
    description: {
      eng: 'Life drain target attack that deals 30/50/70 special damage',
      esp: 'Ataque al objetivo de drenaje de vida que causa 30/50/70 de daño especial',
      fra: 'Attaque vol de vie faisant 30/50/70 dégats spéciaux.'
    }
  },
  [Ability.NIGHT_SLASH] : {
    title: {
      eng: 'Night Slash',
      esp: 'Tajo nocturno',
      fra: 'Tranche Nuit'
    },
    description: {
      eng: 'Special one-target attack that does 40/60/80. Decreases the defence of all enemies by 1 point',
      esp: 'Ataque especial de objetivo mono que hace 40/60/80. Disminuye la defensa de todos los enemigos en 1 punto.',
      fra: 'Attaque spéciale faisant 40/60/80 points de dégats. Diminue la défense de toute la team ennemie de 1 point.'
    }
  },
  [Ability.BUG_BUZZ] : {
    title: {
      eng: 'Bug Buzz',
      esp: 'Bichos',
      fra: 'Bourdon'
    },
    description: {
      eng: 'Mono target special damage attack that does 20/30/40.',
      esp: 'Ataque de daño especial de un mono objetivo que hace 20/30/40.',
      fra: 'Attaque mono cible faisant 20/30/40 dégats spéciaux'
    }
  },
  [Ability.POISON_STING] : {
    title: {
      eng: 'Poison Sting',
      esp: 'Picadura de veneno',
      fra: 'Dard Venin'
    },
    description: {
      eng: 'Physical mono target damage that deals 30/40/50. Doubles damage if target is poisoned.',
      esp: 'Daño físico de un solo objetivo que reparte 30/40/50. Duplica el daño si el objetivo está envenenado.',
      fra: 'Attaque physique mono cible faisant 30/40/50 dégats. Double les dégats si la cible est empoisonné.'
    }
  },
  [Ability.LEECH_LIFE] : {
    title: {
      eng: 'Leech Life',
      esp: 'Vampirismo',
      fra: 'Vampirisme'
    },
    description: {
      eng: 'Area of effect life steal special damage attack 10/20/30 around the target',
      esp: 'Área de efecto robo de vida daño especial ataque 10/20/30 alrededor del objetivo',
      fra: 'Attaque vol de vie en AOE faisant 10/20/30 points de dégats.'
    }
  },
  [Ability.HAPPY_HOUR] : {
    title: {
      eng: 'Happy hour',
      esp: 'La hora feliz',
      fra: 'Happy hour'
    },
    description: {
      eng: 'Buff all ally attacks by 3/6/9 points.',
      esp: 'Pulir todos los ataques de los aliados por 3/6/9 puntos.',
      fra: 'Augmente l attaque de toute l équipe de 3/6/9 points.'
    }
  },
  [Ability.TELEPORT] : {
    title: {
      eng: 'Teleport',
      esp: 'Teletransporte',
      fra: 'Teleport'
    },
    description: {
      eng: 'Teleport the pokemon on one edge of the map',
      esp: 'Teletransportar el pokemon en un borde del mapa',
      fra: 'Téléporte le pokémon sur un coin de la carte.'
    }
  },
  [Ability.NASTY_PLOT] : {
    title: {
      eng: 'Nasty Plot',
      esp: 'Trama desagradable',
      fra: 'Machination'
    },
    description: {
      eng: 'Buff pokemon attack by 5/10/20 points',
      esp: 'Buff pokemon ataque por 5/10/20 puntos',
      fra: 'Booste l attaque du pokémon de 5/10/20 points'
    }
  },
  [Ability.THIEF] : {
    title: {
      eng: 'Thief',
      esp: 'Ladrón',
      fra: 'Larcin'
    },
    description: {
      eng: 'Steal ennemy target item and deals 5/10/20 physical damage',
      esp: 'Roba el objeto del enemigo e inflige 5/10/20 de daño físico',
      fra: 'Vole l item du pokémon ennemi et inflige 5/10/20 dégats physiques'
    }
  },
  [Ability.STUN_SPORE] : {
    title: {
      eng: 'Stun Spore',
      esp: 'Espora de aturdimiento',
      fra: 'Poudre para'
    },
    description: {
      eng: 'Decrease target attack speed by 50/100/200% and deals 5/10/20 physical damage',
      esp: 'Disminuir la velocidad de ataque del objetivo en un 50/100/200% e inflige 5/10/20 de daño físico',
      fra: 'Diminue la vitesse d attaque du pokémon de 50/100/200% et inflige 5/10/20 dégats physiques'
    }
  },
  [Ability.METEOR_MASH] : {
    title: {
      eng: 'Meteor mash',
      esp: 'Puré de meteoritos',
      fra: 'Poing Meteor'
    },
    description: {
      eng: 'Area of effect around the target that deals 30/50/70 damages. Buff pokemon attack by 5 points.',
      esp: 'Área de efecto alrededor del objetivo que produce 30/50/70 daños. Buff pokemon ataque por 5 puntos.',
      fra: 'Attaque en AOE faisant 30/50/40 dégats spéciaux. Booste l attaque du pokémon de 5 points.'
    }
  },
  [Ability.HURRICANE] : {
    title: {
      eng: 'Hurricane',
      esp: 'Huracán',
      fra: 'Vent Violent'
    },
    description: {
      eng: 'Area of effect attack that deals 10/20/30 damages in a line behind the target',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  [Ability.HEAL_BLOCK] : {
    title: {
      eng: 'Heal Block',
      esp: 'Heal Block',
      fra: 'Heal Block'
    },
    description: {
      eng: 'Apply wound status (target cannot heal) to all adjacent ennemies for 5s/10s/15s.',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  [Ability.ROAR_OF_TIME] : {
    title: {
      eng: 'Roar of time',
      esp: 'Roar of time',
      fra: 'Roar of time'
    },
    description: {
      eng: 'Add a second life to the pokemon that has the most items.',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  [Ability.ROCK_TOMB] : {
    title: {
      eng: 'Rock Tomb'
    },
    description: {
      eng: 'Mono target attack that deals 30/60/90 physical damage and decrease target attack speed by 20/40/60%'
    }
  },
  [Ability.ROCK_SMASH] : {
    title: {
      eng: 'Rock Smash',
      esp: 'Rock Smash',
      fra: 'Rock Smash'
    },
    description: {
      eng: 'Mono target attack that deals 20/40/60 damage and silence target for 3/6/9s.',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  [Ability.HEAD_SMASH] : {
    title: {
      eng: 'Head Smash',
      esp: 'Head Smash',
      fra: 'Head Smash'
    },
    description: {
      eng: 'The pokemon hurt itself for 5/10/15 hp, and deals 40/80/150 physical damage. Execute if the target is asleep/frozen.',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
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
      pokemons: [Pkm.IVYSAUR, Pkm.METAPOD, Pkm.RATICATE, Pkm.WEEPINBELL, Pkm.BAYLEEF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.TORTERRA, Pkm.SKUNTANK, Pkm.URSARING, Pkm.BIBAREL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    SEVEN_STATION_PATH: {
      id: 'SEVEN_STATION_PATH',
      name: '7th Station Path',
      pokemons: [Pkm.SKUNTANK, Pkm.FEAROW, Pkm.PRIMEAPE, Pkm.MAROWAK, Pkm.HITMONCHAN, Pkm.FURRET, Pkm.URSARING, Pkm.SHEDNINJA, Pkm.BIBAREL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FIGHTING
    },
    BARREN_VALLEY: {
      id: 'BARREN_VALLEY',
      name: 'Barren Valley',
      pokemons: [Pkm.JUMPLUFF, Pkm.FLYGON, Pkm.LUNATONE, Pkm.HONCHKROW, Pkm.GLAMEOW, Pkm.TOXICROAK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.DARK
    },
    DARK_ICE_MOUNTAIN_PEAK: {
      id: 'DARK_ICE_MOUNTAIN_PEAK',
      name: 'Dark Ice Mountain Peak',
      pokemons: [Pkm.GENGAR, Pkm.SKARMORY, Pkm.DUSKULL, Pkm.METANG, Pkm.LICKILICKY, Pkm.TANGROWTH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_ICE_MOUNTAIN: {
      id: 'DARK_ICE_MOUNTAIN',
      name: 'Dark Ice Mountain',
      pokemons: [Pkm.BANETTE, Pkm.GENGAR, Pkm.SKARMORY, Pkm.DUSKULL, Pkm.METANG, Pkm.LICKILICKY, Pkm.TANGROWTH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_WASTELAND: {
      id: 'DARK_WASTELAND',
      name: 'Dark Wasteland',
      pokemons: [Pkm.GASTLY, Pkm.ONIX, Pkm.MISDREAVUS, Pkm.SHIFTRY, Pkm.SOLROCK, Pkm.SKORUPI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DEEP_BOULDER_QUARRY: {
      id: 'DEEP_BOULDER_QUARRY',
      name: 'Deep Boulder Quarry',
      pokemons: [Pkm.CLAYDOL, Pkm.GLISCOR, Pkm.NINJASK, Pkm.MUK, Pkm.PROBOPASS, Pkm.SHELGON, Pkm.RHYDON, Pkm.TANGROWTH, Pkm.METANG, Pkm.STEELIX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    LIMESTONE_CAVERN: {
      id: 'LIMESTONE_CAVERN',
      name: 'Limestone Cavern',
      pokemons: [Pkm.KINGLER, Pkm.MARILL, Pkm.SLOWKING, Pkm.VOLBEAT, Pkm.ILLUMISE, Pkm.SEVIPER, Pkm.DRAGONAIR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    DEEP_LIMESTONE_CAVERN: {
      id: 'DEEP_LIMESTONE_CAVERN',
      name: 'Deep Limestone Cavern',
      pokemons: [Pkm.DRAGONAIR, Pkm.AERODACTYL, Pkm.MASQUERAIN, Pkm.VOLBEAT, Pkm.ILLUMISE, Pkm.SEVIPER, Pkm.POLIWHIRL, Pkm.DUGTRIO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    ICICLE_FOREST: {
      id: 'ICICLE_FOREST',
      name: 'Icicle Forest',
      pokemons: [Pkm.GENGAR, Pkm.WEEZING, Pkm.CACTURNE, Pkm.METAGROSS, Pkm.LICKILICKY, Pkm.GLISCOR, Pkm.DRIFBLIM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ICE
    },
    MURKY_FOREST: {
      id: 'MURKY_FOREST',
      name: 'Murky Forest',
      pokemons: [Pkm.EXEGGCUTE, Pkm.HOOTHOOT, Pkm.HOPPIP, Pkm.DODUO, Pkm.WEEDLE, Pkm.BURMY, Pkm.SPINARAK, Pkm.WURMPLE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.BUG
    },
    SPACIAL_CLIFFS: {
      id: 'SPACIAL_CLIFFS',
      name: 'Spacial Cliffs',
      pokemons: [Pkm.HAUNTER, Pkm.BELDUM, Pkm.MISDREAVUS, Pkm.KOFFING, Pkm.SHEDNINJA, Pkm.BANETTE, Pkm.MISMAGIUS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    TEMPORAL_SPIRE_FUTURE: {
      id: 'TEMPORAL_SPIRE_FUTURE',
      name: 'Temporal Spire Future',
      pokemons: [Pkm.GOLBAT, Pkm.ALAKAZAM, Pkm.MAGNETON, Pkm.GASTLY, Pkm.HYPNO, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.BRONZONG, Pkm.PORYGON_2, Pkm.CROBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TEMPORAL_TOWER_FUTURE: {
      id: 'TEMPORAL_TOWER_FUTURE',
      name: 'Temporal Tower Future',
      pokemons: [Pkm.ZUBAT, Pkm.KADABRA, Pkm.MAGNEMITE, Pkm.GASTLY, Pkm.DROWZEE, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.BRONZONG, Pkm.GOLBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    VAST_ICE_MOUNTAIN_PEAK: {
      id: 'VAST_ICE_MOUNTAIN_PEAK',
      name: 'Vast Ice Mountain Peak',
      pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.SMOOCHUM, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE, Pkm.GLISCOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    VAST_ICE_MOUNTAIN: {
      id: 'VAST_ICE_MOUNTAIN',
      name: 'Vast Ice Mountain',
      pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.SMOOCHUM, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE, Pkm.GLISCOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    AMP_PLAINS: {
      id: 'AMP_PLAINS',
      name: 'Amp Plains',
      pokemons: [Pkm.PLUSLE, Pkm.MINUN, Pkm.MAREEP, Pkm.PHANPY, Pkm.ELEKID, Pkm.SHINX, Pkm.GIRAFARIG, Pkm.ZAPDOS, Pkm.FLAFFY, Pkm.PIKACHU, Pkm.PICHU, Pkm.YANMEGA, Pkm.ELECTABUZZ],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    FAR_AMP_PLAINS: {
      id: 'FAR_AMP_PLAINS',
      name: 'Far Amp Plains',
      pokemons: [Pkm.SHINX, Pkm.GIRAFARIG, Pkm.PIKACHU, Pkm.PICHU, Pkm.YANMEGA, Pkm.FLAFFY, Pkm.ELECTABUZZ, Pkm.TAUROS, Pkm.DODRIO, Pkm.ELECTRIKE, Pkm.LUXIO, Pkm.LUXRAY, Pkm.AMPHAROS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    FINAL_MAZE_B23F: {
      id: 'FINAL_MAZE_B23F',
      name: 'Final Maze',
      pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.DODUO, Pkm.OMANYTE, Pkm.KABUTO, Pkm.SPINARAK, Pkm.MAREEP, Pkm.MISDREAVUS, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.PHANPY, Pkm.MAGBY, Pkm. POOCHYENA, Pkm.SHROOMISH, Pkm.MAWILE, Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.SKORUPI, Pkm.CARNIVINE, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    FOGGY_FOREST: {
      id: 'FOGGY_FOREST',
      name: 'Foggy Forest',
      pokemons: [Pkm.HOOTHOOT, Pkm.DUNSPARCE, Pkm.SMEARGLE, Pkm.CHERUBI, Pkm.SKIPLOOM, Pkm.ZIGZAGOON, Pkm.PACHIRISU, Pkm.NOCTOWL, Pkm.STANTLER, Pkm.BUNEARY, Pkm.PINSIR, Pkm. BRELOOM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    FOREST_PATH: {
      id: 'FOREST_PATH',
      name: 'Forest Path',
      pokemons: [Pkm.PINSIR, Pkm.DUNSPARCE, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.LINOONE, Pkm.KRICKEROT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    GOLD_CHAMBER: {
      id: 'GOLD_CHAMBER',
      name: 'Gold Chamber',
      pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.DODUO, Pkm.OMANYTE, Pkm.KABUTO, Pkm.SPINARAK, Pkm.MAREEP, Pkm.MISDREAVUS, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.PHANPY, Pkm.MAGBY, Pkm. POOCHYENA, Pkm.SHROOMISH, Pkm.MAWILE, Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.SKORUPI, Pkm.CARNIVINE, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    HIDDEN_HIGHLAND: {
      id: 'HIDDEN_HIGHLAND',
      name: 'Hidden Highland',
      pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.TROPIUS, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.PURUGLY, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTERY_JUNGLE_01F_15F: {
      id: 'MYSTERY_JUNGLE_01F_15F',
      name: 'Mystery Jungle',
      pokemons: [Pkm.MEW, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTERY_JUNGLE_16F_30F: {
      id: 'MYSTERY_JUNGLE_16F_30F',
      name: 'Mystery Jungle',
      pokemons: [Pkm.MEW, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    MYSTIFYING_FOREST: {
      id: 'MYSTIFYING_FOREST',
      name: 'Mystifying Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    BEACH_CAVE: {
      id: 'BEACH_CAVE',
      name: 'Beach Cave',
      pokemons: [Pkm.SHELLDER, Pkm.SHELLOS, Pkm.KABUTO, Pkm.CORSOLA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
      type: Synergy.WATER
    },
    BOTTOMLESS_SEA: {
      id: 'BOTTOMLESS_SEA',
      name: 'Bottomless Sea',
      pokemons: [Pkm.KYOGRE, Pkm.GYARADOS, Pkm.REMORAID, Pkm.KINGDRA, Pkm.WAILMER, Pkm.CLAMPERL, Pkm.FINNEON, Pkm.TENTACRUEL, Pkm.SLOWBRO, Pkm.HORSEA, Pkm.SEADRA, Pkm.STARMIE, Pkm.SLOWKING, Pkm.LAPRAS, Pkm.WAILORD],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    BRINE_CAVE: {
      id: 'BRINE_CAVE',
      name: 'Brine Cave',
      pokemons: [Pkm.SEEL, Pkm.OMANYTE, Pkm.KINGLER, Pkm.PELIPPER, Pkm.GASTRODON, Pkm.TENTACOOL, Pkm.DEWGONG, Pkm.STARYU, Pkm.DRAGONAIR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    CONCEALED_RUINS: {
      id: 'CONCEALED_RUINS',
      name: 'Concealed Ruins',
      pokemons: [Pkm.PIDGEY, Pkm.VOLTORB, Pkm.POOCHYENA, Pkm.TAILOW, Pkm.LOUDRED, Pkm.NIDOQUEEN, Pkm.WEEZING, Pkm.MURKROW, Pkm.DELCATTY, Pkm.PIDGEOTTO, Pkm.SHUPPET, Pkm.ELECTRODE, Pkm.EXPLOUD, Pkm.RAIKOU, Pkm.PIDGEOT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    CRAGGY_COAST: {
      id: 'CRAGGY_COAST',
      name: 'Craggy Coast',
      pokemons: [Pkm.SPHEAL, Pkm.KRABBY, Pkm.DRATINI, Pkm.WINGULL, Pkm.GASTRODON, Pkm.SEALEO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    CRYSTAL_CAVE_01F_05F: {
      id: 'CRYSTAL_CAVE_01F_05F',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    CRYSTAL_CAVE_06F_11F: {
      id: 'CRYSTAL_CAVE_06F_11F',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    CRYSTAL_CROSSING: {
      id: 'CRYSTAL_CROSSING',
      name: 'Crystal Crossing',
      pokemons: [Pkm.FLOATZEL, Pkm.BAGON, Pkm.WORMADAN, Pkm.GLAMEOW, Pkm.ABSOL, Pkm.GLALIE, Pkm.FROSLASS, Pkm.AZELF],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DARK_CRATER: {
      id: 'DARK_CRATER',
      name: 'Dark Crater',
      pokemons: [Pkm.CHARMANDER, Pkm.CYNDAQUIL, Pkm.HIPPOWDON, Pkm.NUMEL, Pkm.SLUGMA, Pkm.GROWLITHE, Pkm.PONYTA, Pkm.TORCHIC, Pkm.FLAREON, Pkm.COMBUSKEN, Pkm.RAPIDASH, Pkm.MEWTWO, Pkm.ARCANINE, Pkm.QUILAVA, Pkm.MAGCARGO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    DEEP_DARK_CRATER: {
      id: 'DEEP_DARK_CRATER',
      name: 'Deep Dark Crater',
      pokemons: [Pkm.CHARMELEON, Pkm.QUILAVA, Pkm.MONFERNO, Pkm.CAMERUPT, Pkm.COMBUSKEN, Pkm.ARCANINE, Pkm.RAPIDASH, Pkm.FLAREON, Pkm.MAGCARGO, Pkm.RHYPERIOR, Pkm.MAGMORTAR, Pkm.CHARIZARD, Pkm.TYPHLOSION, Pkm.INFERNAPE, Pkm.MISMAGIUS, Pkm.BLAZIKEN, Pkm.AGGRON, Pkm.ENTEI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    DARK_HILL_01F_06F: {
      id: 'DARK_HILL_01F_06F',
      name: 'Dark Hill',
      pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.GLISCOR, Pkm.MISDREAVUS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DARK_HILL_07F_15F: {
      id: 'DARK_HILL_07F_15F',
      name: 'Dark Hill',
      pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.GLISCOR, Pkm.MISDREAVUS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DEEP_DUSK_FOREST_01F_06F: {
      id: 'DEEP_DUSK_FOREST_01F_06F',
      name: 'Deep Dusk Forest',
      pokemons: [Pkm.VULPIX, Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON, Pkm.HIPPOWDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DEEP_DUSK_FOREST_07F_12F: {
      id: 'DEEP_DUSK_FOREST_07F_12F',
      name: 'Deep Dusk Forest',
      pokemons: [Pkm.VULPIX, Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON, Pkm.HIPPOWDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DEEP_SEALED_RUIN: {
      id: 'DEEP_SEALED_RUIN',
      name: 'Deep Sealed Ruin',
      pokemons: [Pkm.MUK, Pkm.FORETRESS, Pkm.SHELGON, Pkm.METANG, Pkm.TANGROWTH, Pkm.PROBOPASS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.METAL
    },
    DRENCHED_BLUFF: {
      id: 'DRENCHED_BLUFF',
      name: 'Drenched Bluff',
      pokemons: [Pkm.LILEEP, Pkm.ANORITH, Pkm.SHELLOS, Pkm.CHINGLING],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    DUSK_FOREST_01F_04F: {
      id: 'DUSK_FOREST_01F_04F',
      name: 'Dusk Forest',
      pokemons: [Pkm.JUMPLUFF, Pkm.MOTHIM, Pkm.MISMAGIUS, Pkm.GABITE, Pkm.HAUNTER, Pkm.LICKITUNG, Pkm.CLAYDOL, Pkm.SALAMENCE, Pkm.MISMAGIUS, Pkm.HIPPOWDON, Pkm.RHYPERIOR, Pkm.DRIFLOON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    DUSK_FOREST_05F_08F: {
      id: 'DUSK_FOREST_05F_08F',
      name: 'Dusk Forest',
      pokemons: [Pkm.JUMPLUFF, Pkm.MOTHIM, Pkm.MISMAGIUS, Pkm.GABITE, Pkm.HAUNTER, Pkm.LICKITUNG, Pkm.CLAYDOL, Pkm.SALAMENCE, Pkm.MISMAGIUS, Pkm.HIPPOWDON, Pkm.RHYPERIOR, Pkm.DRIFLOON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GHOST
    },
    NORTHERN_DESERT_01F_07F: {
      id: 'NORTHERN_DESERT_01F_07F',
      name: 'Northern Desert',
      pokemons: [Pkm.BALTOY, Pkm.CUBONE, Pkm.ARON, Pkm.CACNEA, Pkm.LARVITAR, Pkm.SANDSHREW, Pkm.TRAPINCH, Pkm.CARNIVINE, Pkm.RHYHORN, Pkm.LAIRON, Pkm.CACTURNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    QUICKSAND_CAVE: {
      id: 'QUICKSAND_CAVE',
      name: 'Quicksand Cave',
      pokemons: [Pkm.NINCADA, Pkm.VIBRAVA, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.SANDSLASH, Pkm.MAWILE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    QUICKSAND_PIT: {
      id: 'QUICKSAND_PIT',
      name: 'Quicksand Pit',
      pokemons: [Pkm.MESPRIT, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.MAWILE, Pkm.SANDSLASH, Pkm.TYRANITAR, Pkm.HIPPOPOTAS, Pkm.NINJASK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    ROCK_AEGIS_CAVE: {
      id: 'ROCK_AEGIS_CAVE',
      name: 'Rock Aegis Cave',
      pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.UNOWN, Pkm.MACHOKE, Pkm.MACHAMP, Pkm.REGIROCK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.MINERAL
    },
    SURROUNDED_SEA: {
      id: 'SURROUNDED_SEA',
      name: 'Surrounded Sea',
      pokemons: [Pkm.SHELLDER, Pkm.CARVANHA, Pkm.WAILMER, Pkm.SLOWBRO, Pkm.TENTACRUEL, Pkm.STARMIE, Pkm.QWILFISH, Pkm.HORSEA, Pkm.SEADRA, Pkm.SLOWKING, Pkm.REMORAID, Pkm.OCTIRELLY, Pkm.KINGDRA, Pkm.CLAMPERL, Pkm.FINNEON, Pkm.LAPRAS, Pkm.WAILORD, Pkm.LUGIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    TEMPORAL_SPIRE: {
      id: 'TEMPORAL_SPIRE',
      name: 'Temporal Spire',
      pokemons: [Pkm.DIALGA, Pkm.DEOXYS, Pkm.BRONZONG, Pkm.PORYGON, Pkm.SALAMENCE, Pkm.PORYGON_Z, Pkm.METAGROSS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.METAL
    },
    TEMPORAL_TOWER: {
      id: 'TEMPORAL_TOWER',
      name: 'Temporal Tower',
      pokemons: [Pkm.PORYGON, Pkm.LUNATONE, Pkm.SOLROCK, Pkm.BRONZOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TEST_DUNGEON: {
      id: 'TEST_DUNGEON',
      name: 'Test Dungeon',
      pokemons: [Pkm.PORYGON, Pkm.UNOWN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    THE_NIGHTMARE: {
      id: 'THE_NIGHTMARE',
      name: 'The Nightmare',
      pokemons: [Pkm.SPOINK, Pkm.CLEFFA, Pkm.CLEFAIRY, Pkm.JIGGLYPUFF, Pkm.WYNAUT, Pkm.SPINDA, Pkm.LICKITUNG, Pkm.ESPEON, Pkm.WOOBUFFET, Pkm.MILTANK, Pkm.BLISSEY, Pkm.WHISMUR, Pkm.SKITTY, Pkm.PERSIAN, Pkm.IGGLYBUFF, Pkm.CLEFABLE, Pkm.WIGGLYTUFF, Pkm.CHANSEY],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    TINY_MEADOW: {
      id: 'TINY_MEADOW',
      name: 'Tiny Meadow',
      pokemons: [Pkm.SKIPLOOM, Pkm.BRELOOM, Pkm.STARAVIA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    TREESHROUD_FOREST_01F_08F: {
      id: 'TREESHROUD_FOREST_01F_08F',
      name: 'Treeshroud Forest',
      pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.CHERIM, Pkm.HOUNDOOM, Pkm.NINETALES, Pkm.ALAKAZAM, Pkm.KIRLIA, Pkm.VESPIQUEEN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    TREESHROUD_FOREST_09F_21F: {
      id: 'TREESHROUD_FOREST_09F_21F',
      name: 'Treeshroud Forest',
      pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.CHERIM, Pkm.HOUNDOOM, Pkm.NINETALES, Pkm.ALAKAZAM, Pkm.KIRLIA, Pkm.VESPIQUEEN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    STEAM_CAVE: {
      id: 'STEAM_CAVE',
      name: 'Steam Cave',
      pokemons: [Pkm.SNUBULL, Pkm.SLUGMA, Pkm.MAGBY, Pkm.NUMEL, Pkm.FARFETCH, Pkm.YANMEGA, Pkm.KRICKETUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.FIRE
    },
    QUICKSAND_PIT_2: {
      id: 'QUICKSAND_PIT_2',
      name: 'Quicksand Pit',
      pokemons: [Pkm.MESPRIT, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.MAWILE, Pkm.SANDSLASH, Pkm.TYRANITAR, Pkm.HIPPOPOTAS, Pkm.NINJASK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    LOWER_BRINE_CAVE: {
      id: 'LOWER_BRINE_CAVE',
      name: 'Lower Brine Cave',
      pokemons: [Pkm.WALREIN, Pkm.DRAGONAIR, Pkm.STARYU, Pkm.TENTACOOL, Pkm.DEWGONG, Pkm.GASTRODON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    HIDDEN_LAND: {
      id: 'HIDDEN_LAND',
      name: 'Hidden land',
      pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.TROPIUS, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.PURUGLY, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    TEMPORAL_TOWER_2: {
      id: 'TEMPORAL_TOWER_2',
      name: 'Temporal Tower',
      pokemons: [Pkm.PORYGON, Pkm.LUNATONE, Pkm.SOLROCK, Pkm.BRONZOR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    CRYSTAL_CAVE_2: {
      id: 'CRYSTAL_CAVE_2',
      name: 'Crystal Cave',
      pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    WATERFALL_CAVE: {
      id: 'WATERFALL_CAVE',
      name: 'Waterfall Cave',
      pokemons: [Pkm.PSYDUCK, Pkm.POLIWAG, Pkm.GRIMER, Pkm.TANGELA, Pkm.WOOPER, Pkm.LOTAD, Pkm.SURSKIT, Pkm.BARBOACH, Pkm.WHISCASH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    WORLD_ABYSS: {
      id: 'WORLD_ABYSS',
      name: 'World Abyss',
      pokemons: [Pkm.GIRATINA, Pkm.TAILOW, Pkm.PIDGEY, Pkm.MURKROW, Pkm.VOLTORB, Pkm.POOCHYENA, Pkm.LOUDRED, Pkm.PIDGEOTTO, Pkm.NIDOQUEEN, Pkm.ELECTRODE, Pkm.WEEZING, Pkm.UMBREON, Pkm.DELCATTY, Pkm.SWELLOW, Pkm.EXPLOUD, Pkm.MIGHTYENA, Pkm.PIDGEOT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    ZERO_ISLE_EAST_15F_25F: {
      id: 'ZERO_ISLE_EAST_15F_25F',
      name: 'Zero Isle East',
      pokemons: [Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    ZERO_ISLE_EAST_26F_40F: {
      id: 'ZERO_ISLE_EAST_26F_40F',
      name: 'Zero Isle East',
      pokemons: [Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    ZERO_ISLE_SOUTH_01F_03F: {
      id: 'ZERO_ISLE_SOUTH_01F_03F',
      name: 'Zero Isle South',
      pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SHELLDER, Pkm.SEADRA, Pkm.STARYU, Pkm.STARMIE, Pkm.CHINGLING, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.EXEGGCUTE, Pkm.CHINCHOU, Pkm.POOCHYENA, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS, Pkm.BALTOY],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    ZERO_ISLE_SOUTH_04F_08F: {
      id: 'ZERO_ISLE_SOUTH_04F_08F',
      name: 'Zero Isle East',
      pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SHELLDER, Pkm.SEADRA, Pkm.STARYU, Pkm.STARMIE, Pkm.CHINGLING, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.EXEGGCUTE, Pkm.CHINCHOU, Pkm.POOCHYENA, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS, Pkm.BALTOY],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.NORMAL
    },
    BURIED_RELIC_1F_20F: {
      id: 'BURIED_RELIC_1F_20F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    BURIED_RELIC_21F_50F: {
      id: 'BURIED_RELIC_21F_50F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    BURIED_RELIC_51F_99F: {
      id: 'BURIED_RELIC_51F_99F',
      name: 'Buried Relic',
      pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    DARKNIGHT_RELIC: {
      id: 'DARKNIGHT_RELIC',
      name: 'Darknight Relic',
      pokemons: [Pkm.SHUPPET, Pkm.GASTLY, Pkm.MISDREAVUS, Pkm.SHEDNINJA, Pkm.SABLEYE, Pkm.BANETTE, Pkm.HAUNTER, Pkm.DUSKULL, Pkm.GENGAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GHOST
    },
    SHIMMER_DESERT: {
      id: 'SHIMMER_DESERT',
      name: 'Shimmer Desert',
      pokemons: [Pkm.EKANS, Pkm.ARBOK, Pkm.SANDSHREW, Pkm.SANDSLASH, Pkm.NIDOKING, Pkm.DIGLETT, Pkm.DUGTRIO, Pkm.SUDOWOODO, Pkm.GARCHOMP, Pkm.RHYPERIOR, Pkm.GROUDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    UNOWN_RELIC: {
      id: 'UNOWN_RELIC',
      name: 'Unown Relic',
      pokemons: [Pkm.UNOWN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    FROSTY_FOREST: {
      id: 'FROSTY_FOREST',
      name: 'Frosty Forest',
      pokemons: [Pkm.AZURILL, Pkm.FURRET, Pkm.NOSEPASS, Pkm.PILOSWINE, Pkm.MIGHTYENA, Pkm.LAIRON, Pkm.SNORUNT, Pkm.ARTICUNO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ICE
    },
    GREAT_CANYON: {
      id: 'GREAT_CANYON',
      name: 'Great Canyon',
      pokemons: [Pkm.SKIPLOOM, Pkm.DUNSPARCE, Pkm.PHANPY, Pkm.DODUO, Pkm.VILEPLUME, Pkm.BRELOOM, Pkm.MURKROW, Pkm.CACTURNE, Pkm.NOCTOWL, Pkm.ARIADOS, Pkm.TAUROS, Pkm.HOUNDOOM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    HOWLING_FOREST_01F_06F: {
      id: 'HOWLING_FOREST_01F_06F',
      name: 'Howling Forest',
      pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.POOCHYENA, Pkm.WHISMUR, Pkm.SPOINK, Pkm.FURRET, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.HOUNDOOM, Pkm.MIGHTYENA, Pkm.GRUMPIG, Pkm.SNORLAX, Pkm.EXEGGCUTE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    HOWLING_FOREST_07F_15F: {
      id: 'HOWLING_FOREST_07F_15F',
      name: 'Howling Forest',
      pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.POOCHYENA, Pkm.WHISMUR, Pkm.SPOINK, Pkm.FURRET, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.HOUNDOOM, Pkm.MIGHTYENA, Pkm.GRUMPIG, Pkm.SNORLAX, Pkm.EXEGGCUTE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    MT_FARAWAY: {
      id: 'MT_FARAWAY',
      name: 'Mt Faraway',
      pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_FARAWAY_10F_20F: {
      id: 'MT_FARAWAY_10F_20F',
      name: 'Mt Faraway',
      pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_FARAWAY_30F_39F: {
      id: 'MT_FARAWAY_30F_39F',
      name: 'Mt Faraway',
      pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ICE
    },
    JOYOUS_TOWER: {
      id: 'JOYOUS_TOWER',
      name: 'Joyous Tower',
      pokemons: [Pkm.JIGGLYPUFF, Pkm.TREECKO, Pkm.BULBASAUR, Pkm.TAILOW, Pkm.PICHU, Pkm.DIGLETT, Pkm.SPINDA, Pkm.PLUSLE, Pkm.MINUN, Pkm.METAPOD, Pkm.CHIKORITA, Pkm.PSYDUCK, Pkm.KAKUNA, Pkm.CLEFAIRY, Pkm.TORCHIC, Pkm.EEVEE, Pkm.CYNDAQUIL, Pkm.BELDUM, Pkm.SCYTHER, Pkm.SLAKOTH, Pkm.TRAPINCH, Pkm.CLEFABLE, Pkm.HOUNDOUR, Pkm.SPINARAK, Pkm.GARDEVOIR, Pkm.BELLOSSOM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.NORMAL
    },
    LAPIS_CAVE: {
      id: 'LAPIS_CAVE',
      name: 'Lapis Cave',
      pokemons: [Pkm.ZUBAT, Pkm.NINCADA, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.TANGELA, Pkm.BAGON, Pkm.GOLBAT],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.POISON
    },
    LIGHTNING_FIELD: {
      id: 'LIGHTNING_FIELD',
      name: 'Lightning Field',
      pokemons: [Pkm.MAREEP, Pkm.ELECTRIKE, Pkm.MAGNEMITE, Pkm.PIKACHU, Pkm.FLAFFY, Pkm.PLUSLE, Pkm.MINUN, Pkm.JOLTEON, Pkm.CACTURNE, Pkm.ELECTRODE, Pkm.ELEKID, Pkm.MAGNETON, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.RAICHU, Pkm.RAIKOU],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MAGMA_CAVERN_08F_17F: {
      id: 'MAGMA_CAVERN_08F_17F',
      name: 'Magma Cavern',
      pokemons: [Pkm.RATICATE, Pkm.SANDSHREW, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.MAWILE, Pkm.ARBOK, Pkm.MAGCARGO, Pkm.SANDSLASH, Pkm.GOLEM, Pkm.GRIMER, Pkm.ONIX],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FIRE
    },
    MAGMA_CAVERN_18F_23F: {
      id: 'MAGMA_CAVERN_18F_23F',
      name: 'Magma Cavern',
      pokemons: [Pkm.GROUDON, Pkm.RATICATE, Pkm.SANDSHREW, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.MAWILE, Pkm.ARBOK, Pkm.MAGCARGO, Pkm.SANDSLASH, Pkm.GOLEM, Pkm.GRIMER, Pkm.ONIX],
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
      pokemons: [Pkm.PIDGEOT, Pkm.MAGBY, Pkm.NUMEL, Pkm.SLUGMA, Pkm.RAPIDASH, Pkm.FEAROW, Pkm.ARCANINE, Pkm.MOLTRES],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FIRE
    },
    MT_STEEL_01F_05F: {
      id: 'MT_STEEL_01F_05F',
      name: 'Mt Steel',
      pokemons: [Pkm.SPEAROW, Pkm.BALTOY, Pkm.ZIGZAGOON, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.METAL
    },
    MT_STEEL_06F_08F: {
      id: 'MT_STEEL_06F_08F',
      name: 'Mt Steel',
      pokemons: [Pkm.SPEAROW, Pkm.BALTOY, Pkm.ZIGZAGOON, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.METAL
    },
    MT_FREEZE: {
      id: 'MT_FREEZE',
      name: 'Mt Freeze',
      pokemons: [Pkm.SWABLU, Pkm.SHELGON, Pkm.PUPITAR, Pkm.SEEL, Pkm.VIGOROTH, Pkm.SLAKING, Pkm.SEVIPER],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ICE
    },
    MT_THUNDER_PEAK: {
      id: 'MT_THUNDER_PEAK',
      name: 'Mt Thunder Peak',
      pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.PIDGEOTTO, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.STANTLER, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MT_THUNDER: {
      id: 'MT_THUNDER',
      name: 'Mt Thunder',
      pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.PIDGEOTTO, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.STANTLER, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    MURKY_CAVE: {
      id: 'MURKY_CAVE',
      name: 'Murky Cave',
      pokemons: [Pkm.ZUBAT, Pkm.SEVIPER, Pkm.GRIMER, Pkm.GOLBAT, Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.CROBAT, Pkm.MISDREAVUS, Pkm.MUK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.POISON
    },
    NORMAL_MAZE: {
      id: 'NORMAL_MAZE',
      name: 'Normal Maze',
      pokemons: [Pkm.RATICATE, Pkm.FARFETCH, Pkm.FURRET],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.NORMAL
    },
    NORTHERN_RANGE_01F_07F: {
      id: 'NORTHERN_RANGE_01F_07F',
      name: 'Northern Range',
      pokemons: [Pkm.HOOTHOOT, Pkm.DODRIO, Pkm.NINJASK, Pkm.SPINARAK, Pkm.SWELLOW, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS, Pkm.SEVIPER],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.FLYING
    },
    NORTHERN_RANGE_08F_16F: {
      id: 'NORTHERN_RANGE_08F_16F',
      name: 'Northern Range',
      pokemons: [Pkm.HOOTHOOT, Pkm.DODRIO, Pkm.NINJASK, Pkm.SPINARAK, Pkm.SWELLOW, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS, Pkm.SEVIPER],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FLYING
    },
    NORTHWIND_FIELD: {
      id: 'NORTHWIND_FIELD',
      name: 'Northwind Field',
      pokemons: [Pkm.AZUMARILL, Pkm.DELCATTY, Pkm.VAPOREON, Pkm.POLIWHIRL, Pkm.MUK, Pkm.POLITOED, Pkm.ABSOL, Pkm.CROCONAW, Pkm.WARTORTLE, Pkm.SUICUNE],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    PITFALL_VALLEY: {
      id: 'PITFALL_VALLEY',
      name: 'Pitfall Valley',
      pokemons: [Pkm.PIDGEOT, Pkm.FARFETCH, Pkm.SWELLOW, Pkm.HOPPIP, Pkm.BUTTERFREE, Pkm.RATICATE, Pkm.DODUO, Pkm.SWABLU, Pkm.YANMA, Pkm.MASQUERAIN, Pkm.SKIPLOOM, Pkm.AERODACTYL],
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
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_13F_20F: {
      id: 'PURITY_FOREST_13F_20F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_30F_43F: {
      id: 'PURITY_FOREST_30F_43F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_44F_60F: {
      id: 'PURITY_FOREST_44F_60F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_61F_79F: {
      id: 'PURITY_FOREST_61F_79F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GRASS
    },
    PURITY_FOREST_80F_99F: {
      id: 'PURITY_FOREST_80F_99F',
      name: 'Purity Forest',
      pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GRASS
    },
    RESCUE_TEAM_MAZE: {
      id: 'RESCUE_TEAM_MAZE',
      name: 'Rescue Team Maze',
      pokemons: [Pkm.PIDGEY, Pkm.RATTATA, Pkm.VOLTORB, Pkm.EXEGGCUTE],
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
      pokemons: [Pkm.FARFETCH, Pkm.WEEDLE, Pkm.YANMA, Pkm.GLOOM, Pkm.HOUNDOUR, Pkm.POLIWAG, Pkm.SPINARAK, Pkm.TRAPINCH, Pkm.BEEDRILL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.BUG
    },
    SILVER_TRENCH: {
      id: 'SILVER_TRENCH',
      name: 'Silver Trench',
      pokemons: [Pkm.LUGIA, Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    SINISTER_WOODS: {
      id: 'SINISTER_WOODS',
      name: 'Sinister Woods',
      pokemons: [Pkm.SWINUB, Pkm.ODDISH, Pkm.SUDOWOODO, Pkm.SENTRET, Pkm.SHROOMISH, Pkm.WOOPER, Pkm.SCYTHER, Pkm.HOOTHOOT, Pkm.SLAKOTH, Pkm.EKANS, Pkm.GENGAR, Pkm.MEDICHAM],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.BUG
    },
    SKY_TOWER: {
      id: 'SKY_TOWER',
      name: 'Sky Tower',
      pokemons: [Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.LUNATONE, Pkm.RAYQUAZA, Pkm.DUSKULL, Pkm.KOFFING, Pkm.ALTARIA, Pkm.SOLROCK, Pkm.SCIZOR, Pkm.DUSCLOPS, Pkm.FLYGON, Pkm.TROPIUS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.FLYING
    },
    SNOW_PATH: {
      id: 'SNOW_PATH',
      name: 'Snow Path',
      pokemons: [Pkm.AZURILL, Pkm.FURRET, Pkm.NOSEPASS],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.ICE
    },
    SOLAR_CAVE: {
      id: 'SOLAR_CAVE',
      name: 'Solar Cave',
      pokemons: [Pkm.WYNAUT, Pkm.GIRAFARIG, Pkm.BELDUM, Pkm.DROWZEE, Pkm.SPOINK, Pkm.ABRA, Pkm.MEDITITE, Pkm.LUNATONE, Pkm.METANG, Pkm.HYPNO, Pkm.KIRLIA, Pkm.KADABRA, Pkm.MEDICHAM, Pkm.GRUMPIG, Pkm.CLAYDOL],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    SOUTHERN_CAVERN_01F_23F: {
      id: 'SOUTHERN_CAVERN_01F_23F',
      name: 'Southern Cavern',
      pokemons: [Pkm.GEODUDE, Pkm.DIGLETT, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.PHANPY, Pkm.VIBRAVA, Pkm.BALTOY, Pkm.LARVITAR, Pkm.ARIADOS, Pkm.DUGTRIO, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.DONPHAN, Pkm.PUPITAR, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.GROUND
    },
    SOUTHERN_CAVERN_24F_50F: {
      id: 'SOUTHERN_CAVERN_24F_50F',
      name: 'Southern Cavern',
      pokemons: [Pkm.GEODUDE, Pkm.DIGLETT, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.PHANPY, Pkm.VIBRAVA, Pkm.BALTOY, Pkm.LARVITAR, Pkm.ARIADOS, Pkm.DUGTRIO, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.DONPHAN, Pkm.PUPITAR, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.GROUND
    },
    STORMY_SEA_01F_16F: {
      id: 'STORMY_SEA_01F_16F',
      name: 'Stormy Sea',
      pokemons: [Pkm.WINGULL, Pkm.TENTACRUEL, Pkm.TENTACOOL, Pkm.SHELLDER, Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.GRIMER, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.STARMIE, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    STORMY_SEA_16F_39F: {
      id: 'STORMY_SEA_16F_39F',
      name: 'Stormy Sea',
      pokemons: [Pkm.WINGULL, Pkm.TENTACRUEL, Pkm.TENTACOOL, Pkm.SHELLDER, Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.GRIMER, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.STARMIE, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
      type: Synergy.WATER
    },
    THUNDERWAVE_CAVE: {
      id: 'THUNDERWAVE_CAVE',
      name: 'Thunderwave Cave',
      pokemons: [Pkm.RATTATA, Pkm.NIDORANM, Pkm.POOCHYENA, Pkm.VOLTORB, Pkm.ELEKID, Pkm.PLUSLE, Pkm.MINUN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.ELECTRIC
    },
    TINY_WOODS: {
      id: 'TINY_WOODS',
      name: 'Tiny Woods',
      pokemons: [Pkm.RATTATA, Pkm.RATTATA, Pkm.SANDSHREW, Pkm.SPINARAK],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.NORMAL
    },
    UPROAR_FOREST: {
      id: 'UPROAR_FOREST',
      name: 'Uproar Forest',
      pokemons: [Pkm.ROSELIA, Pkm.NUZLEAF, Pkm.LOTAD, Pkm.RATICATE, Pkm.GRIMER, Pkm.NOCTOWL, Pkm.KOFFING],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
      type: Synergy.GRASS
    },
    SERENITY_RIVER: {
      id: 'SERENITY_RIVER',
      name: 'Serenity River',
      pokemons: [Pkm.POLIWAG, Pkm.WOOPER, Pkm.LOTAD, Pkm.BARBOACH, Pkm.MASQUERAIN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.WATER
    },
    WATERFALL_POND: {
      id: 'WATERFALL_POND',
      name: 'Waterfall Pond',
      pokemons: [Pkm.MUDKIP, Pkm.LOTAD, Pkm.POLIWAG, Pkm.BARBOACH, Pkm.WOOPER, Pkm.TOTODILE, Pkm.SURSKIT, Pkm.MAGIKARP, Pkm.SQUIRTLE, Pkm.LOMBRE, Pkm.MARSHTOMP, Pkm.WHISCASH, Pkm.MASQUERAIN],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
      type: Synergy.WATER
    },
    WESTERN_CAVE_B01F_B27F: {
      id: 'WESTERN_CAVE_B01F_B27F',
      name: 'Western Cave',
      pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WESTERN_CAVE_B28F_B39F: {
      id: 'WESTERN_CAVE_B28F_B39F',
      name: 'Western Cave',
      pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WISH_CAVE_01F_13F: {
      id: 'WISH_CAVE_01F_13F',
      name: 'Wish Cave',
      pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
      tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
      type: Synergy.PSYCHIC
    },
    WISH_CAVE_90F_99F: {
      id: 'WISH_CAVE_90F_99F',
      name: 'Wish Cave',
      pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
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

export const BASIC_ITEM = {
  FOSSIL_STONE: 'FOSSIL_STONE',
  TWISTED_SPOON: 'TWISTED_SPOON',
  MYSTIC_WATER: 'MYSTIC_WATER',
  MAGNET: 'MAGNET',
  BLACK_GLASSES: 'BLACK_GLASSES',
  MIRACLE_SEED: 'MIRACLE_SEED',
  NEVER_MELT_ICE: 'NEVER_MELT_ICE',
  CHARCOAL: 'CHARCOAL',
  HEART_SCALE: 'HEART_SCALE'
};

export const ITEM = {
  FOSSIL_STONE: 'FOSSIL_STONE',
  TWISTED_SPOON: 'TWISTED_SPOON',
  MYSTIC_WATER: 'MYSTIC_WATER',
  MAGNET: 'MAGNET',
  BLACK_GLASSES: 'BLACK_GLASSES',
  MIRACLE_SEED: 'MIRACLE_SEED',
  NEVER_MELT_ICE: 'NEVER_MELT_ICE',
  CHARCOAL: 'CHARCOAL',
  HEART_SCALE: 'HEART_SCALE',
  OLD_AMBER: 'OLD_AMBER',
  DAWN_STONE: 'DAWN_STONE',
  WATER_STONE: 'WATER_STONE',
  THUNDER_STONE: 'THUNDER_STONE',
  FIRE_STONE: 'FIRE_STONE',
  MOON_STONE: 'MOON_STONE',
  DUSK_STONE: 'DUSK_STONE',
  LEAF_STONE: 'LEAF_STONE',
  ICY_ROCK: 'ICY_ROCK',
  CHOICE_SPECS: 'CHOICE_SPECS',
  SOUL_DEW: 'SOUL_DEW',
  UPGRADE: 'UPGRADE',
  REAPER_CLOTH: 'REAPER_CLOTH',
  POKEMONOMICON: 'POKEMONOMICON',
  WATER_INCENSE: 'WATER_INCENSE',
  SHELL_BELL: 'SHELL_BELL',
  LUCKY_EGG: 'LUCKY_EGG',
  AQUA_EGG: 'AQUA_EGG',
  BLUE_ORB: 'BLUE_ORB',
  ZOOM_LENS: 'ZOOM_LENS',
  BRIGHT_POWDER: 'BRIGHT_POWDER',
  DELTA_ORB: 'DELTA_ORB',
  MANA_SCARF: 'MANA_SCARF',
  SMOKE_BALL: 'SMOKE_BALL',
  XRAY_VISION: 'XRAY_VISION',
  RAZOR_FANG: 'RAZOR_FANG',
  LEFTOVERS: 'LEFTOVERS',
  CHOICE_SCARF: 'CHOICE_SCARF',
  FIRE_GEM: 'FIRE_GEM',
  DEFENSIVE_RIBBON: 'DEFENSIVE_RIBBON',
  WONDER_BOX: 'WONDER_BOX',
  RUNE_PROTECT: 'RUNE_PROTECT',
  WIDE_LENS: 'WIDE_LENS',
  RAZOR_CLAW: 'RAZOR_CLAW',
  FLUFFY_TAIL: 'FLUFFY_TAIL',
  ORAN_BERRY: 'ORAN_BERRY',
  SHINY_CHARM: 'SHINY_CHARM',
  FOCUS_BAND: 'FOCUS_BAND',
  FLAME_ORB: 'FLAME_ORB',
  ASSAULT_VEST: 'ASSAULT_VEST',
  KINGS_ROCK: 'KINGS_ROCK',
  POKE_DOLL: 'POKE_DOLL',
  RED_ORB: 'RED_ORB',
  MAX_REVIVE: 'MAX_REVIVE',
  ROCKY_HELMET: 'ROCKY_HELMET'
};

export const ITEM_NAME = Object.freeze({
  FOSSIL_STONE: 'Fossil Stone',
  TWISTED_SPOON: 'Twisted Spoon',
  MYSTIC_WATER: 'Mystic Water',
  MAGNET: 'Magnet',
  BLACK_GLASSES: 'Black Glasses',
  MIRACLE_SEED: 'Miracle Seed',
  NEVER_MELT_ICE: 'Never Melt Ice',
  CHARCOAL: 'Charcoal',
  HEART_SCALE: 'Heart Scale',
  OLD_AMBER: 'Old Amber',
  DAWN_STONE: 'Dawn Stone',
  WATER_STONE: 'Water Stone',
  THUNDER_STONE: 'Thunder Stone',
  FIRE_STONE: 'Fire Stone',
  MOON_STONE: 'Moon Stone',
  DUSK_STONE: 'Dusk Stone',
  LEAF_STONE: 'Leaf Stone',
  ICY_ROCK: 'Icy Rock',
  CHOICE_SPECS: 'Choice Specs',
  SOUL_DEW: 'Soul Dew',
  UPGRADE: 'Upgrade',
  REAPER_CLOTH: 'Reaper Cloth',
  POKEMONOMICON: 'Pokemonomicon',
  WATER_INCENSE: 'Water Incense',
  SHELL_BELL: 'Shell Bell',
  LUCKY_EGG: 'Lucky Egg',
  AQUA_EGG: 'Aqua Egg',
  BLUE_ORB: 'Blue Orb',
  ZOOM_LENS: 'Zoom Lens',
  BRIGHT_POWDER: 'Bright Powder',
  DELTA_ORB: 'Delta Orb',
  MANA_SCARF: 'Mana Scarf',
  SMOKE_BALL: 'Smoke Ball',
  XRAY_VISION: 'XRay Vision',
  RAZOR_FANG: 'Razor Fang',
  LEFTOVERS: 'Leftovers',
  CHOICE_SCARF: 'Choice Scarf',
  FIRE_GEM: 'Fire Gem',
  DEFENSIVE_RIBBON: 'Defensive Ribbon',
  WONDER_BOX: 'Wonder Box',
  RUNE_PROTECT: 'Rune Protect',
  WIDE_LENS: 'Wide Lens',
  RAZOR_CLAW: 'Razor Claw',
  FLUFFY_TAIL: 'Fluffy Tail',
  ORAN_BERRY: 'Oran Berry',
  SHINY_CHARM: 'Shiny Charm',
  FOCUS_BAND: 'Focus Band',
  FLAME_ORB: 'Flame Orb',
  ASSAULT_VEST: 'Assault Vest',
  KINGS_ROCK: 'Kings Rock',
  POKE_DOLL: 'Poke Doll',
  RED_ORB: 'Red Orb',
  MAX_REVIVE: 'Max Revive',
  ROCKY_HELMET: 'Rocky Helmet'
});

export const ITEM_DESCRIPTION = Object.freeze({
  FOSSIL_STONE: 'Give it to a Ditto to obtain a random fossil',
  TWISTED_SPOON: '+10% spell damage',
  MYSTIC_WATER: '+15 mana',
  MAGNET: '+10% attack speed',
  BLACK_GLASSES: '+5% critical hit',
  MIRACLE_SEED: '+15 health',
  NEVER_MELT_ICE: '+2 special defense',
  CHARCOAL: '+1 attack',
  HEART_SCALE: '+1 defense',
  OLD_AMBER: 'The holder gains the fossil type',
  DAWN_STONE: 'The holder gains the psychic type',
  WATER_STONE: 'The holder gains the water type',
  THUNDER_STONE: 'The holder gains the electric type',
  FIRE_STONE: 'The holder gains the fire type',
  MOON_STONE: 'The holder gains the fairy type',
  DUSK_STONE: 'The holder gains the dark type',
  LEAF_STONE: 'The holder gains the grass type',
  ICY_ROCK: 'The holder gains the ice type',
  CHOICE_SPECS: 'The holder gains 75% spell damage',
  SOUL_DEW: 'During combat, the holder gains 30% spell damage every 5 seconds',
  UPGRADE: 'Attacks grant +6% bonus Attack Speed for the rest of combat',
  REAPER_CLOTH: 'The holder spells can critically strike (20% chance, 2x damage)',
  POKEMONOMICON: 'When the holder deals damage with their Ability, they burn and wound the target for 2 seconds',
  WATER_INCENSE: 'When an ennemy cast an ability, they take incense damage equal to 20% of their max mana',
  SHELL_BELL: 'The holder spells heal for 40% of the damage dealt',
  LUCKY_EGG: 'When combat begins, the holder and all allies within 2 hexes in the same row gain 20 shield points',
  AQUA_EGG: 'The holder gains 50 mana. After casting their ability the holder gains 20 mana',
  BLUE_ORB: 'The holder gains 10% bonus Attack Speed. Every third attack from the holder unleashes a chain lightning that bounces to 4 enemies, dealing 8 magic damage',
  ZOOM_LENS: 'The holder gains 4 attack damage and 40% spell damage',
  BRIGHT_POWDER: 'Every 5 seconds, the holder throws a bright powder within 1 hex, healing them for 18% of their missing health',
  DELTA_ORB: 'When combat begins, the holder and all allies within 1 hex in the same row gain 30% Spell damage for the rest of combat',
  MANA_SCARF: 'The holder attacks restore 8 additional mana',
  SMOKE_BALL: 'Reduce the attack speed of ennemy attackers by 50% for 5 seconds',
  XRAY_VISION: 'Increase the holders attack range by 1 hex and grants 55% bonus attack speed. The holder attacks can no longer miss.',
  RAZOR_FANG: 'When the holder inflicts a critical hit, the targets Armor is reduced by 70% for 5 seconds. This effect does not stack.',
  LEFTOVERS: 'During  the combat, the holder attack heals adjacent allies for 3 health point',
  CHOICE_SCARF: 'The holder basic attack hit a second adjacent ennemy for 75% of holder damage',
  FIRE_GEM: 'The holders Abilities and attacks do 20% bonus damage. If the target has more than 200 maximum Health, the bonus increases to 60%.',
  DEFENSIVE_RIBBON: 'When the holder takes damage, they gain attack damage, 1 defense and 1 special defense. Stacks up to 5 times',
  WONDER_BOX: 'At the beginning of each battle phase, the holder equips 2 temporary items',
  RUNE_PROTECT: 'When combat begins, the holder and all allies whithin 1 hex in the same row gain a shield that block the damage and effects of the first ennemy ability',
  WIDE_LENS: 'The holder gains 20% bonus attack speed. The holder is immune to poison/fire',
  RAZOR_CLAW: 'The holder gains 75% Critical Strike Chance and 10% Critical Strike Damage',
  FLUFFY_TAIL: 'When combat begins, every ennemy in the same column have their max mana increased by 30%',
  ORAN_BERRY: 'Grants 100 bonus hp',
  SHINY_CHARM: 'When combat begins, every ennemy in the same column falls asleep for 3 seconds',
  FOCUS_BAND: 'When combat begins, the holder and all allies within 1 hexes in the same row gain +30% Attack Speed for the rest of combat',
  FLAME_ORB: 'Every 2 seconds, a random ennemy is burned for 8 seconds',
  ASSAULT_VEST: 'Grants 30 bonus special defense',
  KINGS_ROCK: 'Physical damage heals the holder for 50% of the damage dealt',
  POKE_DOLL: 'The holder gains 5 Armor and 5 Magic Resist',
  RED_ORB: 'The holder gains 8 bonus Attack Damage',
  MAX_REVIVE: 'Prevents the holder first death',
  ROCKY_HELMET: 'Grants 10 bonus armor. Negates bonus damage from incoming critical hits.'
});

export const ITEM_RECIPE = {
  OLD_AMBER: [ITEM.FOSSIL_STONE, ITEM.FOSSIL_STONE],
  DAWN_STONE: [ITEM.FOSSIL_STONE, ITEM.TWISTED_SPOON],
  WATER_STONE: [ITEM.FOSSIL_STONE, ITEM.MYSTIC_WATER],
  THUNDER_STONE: [ITEM.FOSSIL_STONE, ITEM.MAGNET],
  FIRE_STONE: [ITEM.FOSSIL_STONE, ITEM.CHARCOAL],
  MOON_STONE: [ITEM.FOSSIL_STONE, ITEM.HEART_SCALE],
  DUSK_STONE: [ITEM.FOSSIL_STONE, ITEM.BLACK_GLASSES],
  LEAF_STONE: [ITEM.FOSSIL_STONE, ITEM.MIRACLE_SEED],
  ICY_ROCK: [ITEM.FOSSIL_STONE, ITEM.NEVER_MELT_ICE],
  CHOICE_SPECS: [ITEM.TWISTED_SPOON, ITEM.TWISTED_SPOON],
  SOUL_DEW: [ITEM.TWISTED_SPOON, ITEM.MYSTIC_WATER],
  UPGRADE: [ITEM.TWISTED_SPOON, ITEM.MAGNET],
  REAPER_CLOTH: [ITEM.TWISTED_SPOON, ITEM.BLACK_GLASSES],
  POKEMONOMICON: [ITEM.TWISTED_SPOON, ITEM.MIRACLE_SEED],
  WATER_INCENSE: [ITEM.TWISTED_SPOON, ITEM.NEVER_MELT_ICE],
  SHELL_BELL: [ITEM.TWISTED_SPOON, ITEM.CHARCOAL],
  LUCKY_EGG: [ITEM.TWISTED_SPOON, ITEM.HEART_SCALE],
  AQUA_EGG: [ITEM.MYSTIC_WATER, ITEM.MYSTIC_WATER],
  BLUE_ORB: [ITEM.MYSTIC_WATER, ITEM.MAGNET],
  ZOOM_LENS: [ITEM.MYSTIC_WATER, ITEM.BLACK_GLASSES],
  BRIGHT_POWDER: [ITEM.MYSTIC_WATER, ITEM.MIRACLE_SEED],
  DELTA_ORB: [ITEM.MYSTIC_WATER, ITEM.NEVER_MELT_ICE],
  MANA_SCARF: [ITEM.MYSTIC_WATER, ITEM.CHARCOAL],
  SMOKE_BALL: [ITEM.MYSTIC_WATER, ITEM.HEART_SCALE],
  XRAY_VISION: [ITEM.MAGNET, ITEM.MAGNET],
  RAZOR_FANG: [ITEM.MAGNET, ITEM.BLACK_GLASSES],
  LEFTOVERS: [ITEM.MAGNET, ITEM.MIRACLE_SEED],
  CHOICE_SCARF: [ITEM.MAGNET, ITEM.NEVER_MELT_ICE],
  FIRE_GEM: [ITEM.MAGNET, ITEM.CHARCOAL],
  DEFENSIVE_RIBBON: [ITEM.MAGNET, ITEM.HEART_SCALE],
  WONDER_BOX: [ITEM.BLACK_GLASSES, ITEM.BLACK_GLASSES],
  RUNE_PROTECT: [ITEM.BLACK_GLASSES, ITEM.MIRACLE_SEED],
  WIDE_LENS: [ITEM.BLACK_GLASSES, ITEM.NEVER_MELT_ICE],
  RAZOR_CLAW: [ITEM.BLACK_GLASSES, ITEM.CHARCOAL],
  FLUFFY_TAIL: [ITEM.BLACK_GLASSES, ITEM.HEART_SCALE],
  ORAN_BERRY: [ITEM.MIRACLE_SEED, ITEM.MIRACLE_SEED],
  SHINY_CHARM: [ITEM.MIRACLE_SEED, ITEM.NEVER_MELT_ICE],
  FOCUS_BAND: [ITEM.MIRACLE_SEED, ITEM.CHARCOAL],
  FLAME_ORB: [ITEM.MIRACLE_SEED, ITEM.HEART_SCALE],
  ASSAULT_VEST: [ITEM.NEVER_MELT_ICE, ITEM.NEVER_MELT_ICE],
  KINGS_ROCK: [ITEM.NEVER_MELT_ICE, ITEM.CHARCOAL],
  POKE_DOLL: [ITEM.NEVER_MELT_ICE, ITEM.HEART_SCALE],
  RED_ORB: [ITEM.CHARCOAL, ITEM.CHARCOAL],
  MAX_REVIVE: [ITEM.CHARCOAL, ITEM.HEART_SCALE],
  ROCKY_HELMET: [ITEM.HEART_SCALE, ITEM.HEART_SCALE]
};

export const NEUTRAL_STAGE = [
  {
    turn: 1,
    avatar: `${PokemonIndex[Pkm.MAGIKARP].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 2,
    avatar: `${PokemonIndex[Pkm.RATICATE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 3,
    avatar: `${PokemonIndex[Pkm.FEAROW].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 10,
    avatar: `${PokemonIndex[Pkm.GYARADOS].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 15,
    avatar: `${PokemonIndex[Pkm.LUGIA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 20,
    avatar: `${PokemonIndex[Pkm.GIRATINA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 25,
    avatar: `${PokemonIndex[Pkm.ZAPDOS].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 30,
    avatar: `${PokemonIndex[Pkm.DIALGA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 35,
    avatar: `${PokemonIndex[Pkm.SUICUNE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 40,
    avatar: `${PokemonIndex[Pkm.REGICE].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 45,
    avatar: `${PokemonIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 50,
    avatar: `${PokemonIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  },
  {
    turn: 55,
    avatar: `${PokemonIndex[Pkm.RAYQUAZA].replace('-','/')}/${Emotion.NORMAL}`
  }];


export const CDN_PORTRAIT_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/';

export const CDN_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master';