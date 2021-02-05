const WORDS = Object.freeze({
  GAME_LOBBY: {
    'eng': 'Game Lobby',
    'esp': 'Lobby del juego',
    'fra': 'Salon principal'
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
    'esp': 'Envía',
    'fra': 'Envoyer'
  },
  ROOM_ID: {
    'eng': 'Room identifier',
    'esp': 'Identificador de la sala',
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
    'esp': 'Empieza el juego',
    'fra': 'Lancer la partie'
  },
  QUIT_ROOM: {
    'eng': 'Quit Room',
    'esp': 'Salga de la sala',
    'fra': 'Quitter la partie'
  },
  ADD_BOT: {
    'eng': 'Add bot',
    'esp': 'Añade el bot',
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

const CLIMATE = Object.freeze({
  NEUTRAL: 'NEUTRAL',
  RAIN: 'RAIN',
  SUN: 'SUN',
  SANDSTORM: 'SANDSTORM',
  SNOW: 'SNOW'
});

const ITEMS = Object.freeze({
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
  ICY_ROCK: 'ICY_ROCK'
});

const ITEM_NAME = Object.freeze({
  WHITE_GLASSES: {
    eng: 'White Glasses',
    esp: 'Gafas blancas',
    fra: 'Lunettes blanches'
  },
  MUSCLE_BAND: {
    eng: 'Muscle Band',
    esp: 'Banda Muscular',
    fra: 'Bandeau Muscle'
  },
  LIFE_ORB: {
    eng: 'Life Orb',
    esp: 'Orbe de la Vida',
    fra: 'Orbe Vie'
  },
  COIN_AMULET: {
    eng: 'Coin Amulet',
    esp: 'Amuleto de monedas',
    fra: 'Amulette Balkany'
  },
  ROCKY_HELMET: {
    eng: 'Rocky Helmet',
    esp: 'Casco rocoso',
    fra: 'Casque Brut'
  },
  SHELL_BELL: {
    eng: 'Shell Bell',
    esp: 'Casco Campana',
    fra: 'Grelot Coque'
  },
  BIG_ROOT: {
    eng: 'Big Root',
    esp: 'Raíz Grande',
    fra: 'Grosse Racine'
  },
  APRICOT_BERRY: {
    eng: 'Apricot Berry',
    esp: 'Apricot Baya',
    fra: 'Baie Abricot'
  },
  LIECHI_BERRY: {
    eng: 'Liechi Berry',
    esp: 'Liechi Baya',
    fra: 'Baie Lichi'
  },
  GANLON_BERRY: {
    eng: 'Ganlon Berry',
    esp: 'Ganlon Baya',
    fra: 'Baie Ganlon'
  },
  PETAYA_BERRY: {
    eng: 'Petaya Berry',
    esp: 'Petaya Baya',
    fra: 'Baie Pitaya'
  },
  SALAC_BERRY: {
    eng: 'Salac Berry',
    esp: 'Salac Baya',
    fra: 'Baie Salac'
  },
  ORAN_BERRY: {
    eng: 'Oran Berry',
    esp: 'Oran Baya',
    fra: 'Baie Oran'
  },
  SOFT_SAND: {
    eng: 'Soft Sand',
    esp: 'Arena Blanda',
    fra: 'Sable doux'
  },
  MOON_STONE: {
    eng: 'Moon Stone',
    esp: 'Piedra lunar',
    fra: 'Pierre lune'
  },
  NIGHT_STONE: {
    eng: 'Night Stone',
    esp: 'Piedra Nocturna',
    fra: 'Pierre nuit'
  },
  POISON_BARB: {
    eng: 'Poison Barb',
    esp: 'Barra de veneno',
    fra: 'Crochet venin'
  },
  DRAGON_FANG: {
    eng: 'Dragon Fang',
    esp: 'Colmillo de Dragón',
    fra: 'Croc dragon'
  },
  THUNDER_STONE: {
    eng: 'Thunder Stone',
    esp: 'Piedra del Trueno',
    fra: 'Pierre foudre'
  },
  METAL_SKIN: {
    eng: 'Metal Skin',
    esp: 'Piel de metal',
    fra: 'Peau métal'
  },
  METRONOME: {
    eng: 'Metronome',
    esp: 'Metrónomo',
    fra: 'Métronome'
  },
  WATER_STONE: {
    eng: 'Water Stone',
    esp: 'Piedra de agua',
    fra: 'Pierre eau'
  },
  FIRE_STONE: {
    eng: 'Fire Stone',
    esp: 'Piedra de fuego',
    fra: 'Pierre feu'
  },
  LEAF_STONE: {
    eng: 'Leaf Stone',
    esp: 'Piedra de la hoja',
    fra: 'Pierre feuille'
  },
  BLACK_BELT: {
    eng: 'Cinturón negro',
    esp: 'Black Belt',
    fra: 'Ceinture noire'
  },
  SILK_SCARF: {
    eng: 'Silk Scarf',
    esp: 'Bufanda de Seda',
    fra: 'Echarpe de soie'
  },
  DAWN_STONE: {
    eng: 'Dawn Stone',
    esp: 'Piedra del amanecer',
    fra: 'Pierre aube'
  },
  ICY_ROCK: {
    eng: 'Icy Rock',
    esp: 'Roca helada',
    fra: 'Rocher glacé'
  }
});


const ITEM_DESCRIPTION = Object.freeze({
  WHITE_GLASSES:
  {
    eng: '+10% special attack',
    esp: '+10% de ataque especial',
    fra: '+10% attaque spéciale'
  },
  MUSCLE_BAND: {
    eng: '+10% attack',
    esp: '+10% de ataque',
    fra: '+10% attaque physique'
  },
  LIFE_ORB: {
    eng: '+100% damage, cost 5% life for each attack',
    esp: '100% de daño, cuesta un 5% de vida por cada ataque',
    fra: '+100% attaque, blesse le pokémon de 5% hp/s'
  },
  COIN_AMULET: {
    eng: 'Chance to drop between 1 and 5 gold at each round',
    esp: 'Oportunidad de dejar caer entre 1 y 5 monedas de oro en cada ronda',
    fra: 'Chance de gagner entre 1 et 5 argent à chaque tour.'
  },
  ROCKY_HELMET: {
    eng: 'When user is attacked, the attacker take 12% max health physical damage',
    esp: 'Cuando el usuario es atacado, el atacante recibe un 12% de daño máximo de salud.',
    fra: 'Quand le pokémon est attaqué, l attaquant subit 12% de vie en dommage physique'
  },
  SHELL_BELL: {
    eng: '10% life steal on each attack',
    esp: '10% de robo de vida en cada ataque',
    fra: '+10% vol de vie à chaque attaque'
  },
  BIG_ROOT: {
    eng: '+ 5% health / attack restored',
    esp: '+ 5% de salud / atacado restaurado',
    fra: '+ 5% vie / seconde'
  },
  APRICOT_BERRY: {
    eng: '+50% spe def when below 50% health',
    esp: '+50% de defensa cuando está por debajo del 50% de salud',
    fra: '+50% de défense spé quand la vie passe en dessous de 50%'
  },
  LIECHI_BERRY: {
    eng: '+50% attack when health below 50%',
    esp: '+50% de ataque cuando la salud está por debajo del 50%',
    fra: '+50% d attaque quand la vie passe en dessous de 50%'
  },
  GANLON_BERRY: {
    eng: '+50% def when health below 50%',
    esp: '+50% def cuando la salud está por debajo del 50%',
    fra: '+50% de défense quand la vie passe en dessous de 50%'
  },
  PETAYA_BERRY: {
    eng: '+50% attack special when health below 50%',
    esp: '+50% de ataque especial cuando la salud está por debajo del 50%',
    fra: '+50% d attaque spéciale quand la vie passe en dessous de 50%'
  },
  SALAC_BERRY: {
    eng: '+50 % attack speed when health below 50%',
    esp: '+50% de velocidad de ataque cuando la salud está por debajo del 50%',
    fra: '+50% de vitesse d attaque quand la vie passe en dessous de 50%'
  },
  ORAN_BERRY: {
    eng: 'Restore 25% health when below 25% health',
    esp: 'Restaurar el 25% de la salud cuando está por debajo del 25% de la salud',
    fra: 'Restaure 25% de la vie quand la vie du pokémon descend en dessous de 25%'
  },
  SOFT_SAND: {
    eng: '+10% atk speed. +50% damage if pokemon has type ground.',
    esp: '+10% de velocidad de la tinta. +50% de daño si el pokemon tiene el tipo de tierra.',
    fra: '+10% vitesse d attaque. +50% attaque si type terre.'
  },
  MOON_STONE: {
    eng: '+10% atk speed. +50% damage if type Fairy. Will evolve  Eevee into Sylveon.',
    esp: '+10% de velocidad. +50% de daño si es del tipo Hada. Convertirá a Eevee en Sylveon.',
    fra: '+10% vitesse d attaque. +50% attaque si type fée. Fait évoluer Evoli en Nymphali.'
  },
  NIGHT_STONE: {
    eng: '+10% atk speed. +50% damage if type Dark. Will evolve Eevee into Umbreon.',
    esp: '10% de velocidad. +50% de daño si es del tipo Oscuridad. Convertirá a Eevee en Umbreón',
    fra: '+10% vitesse d attaque. +50% attaque si type ténèbres. Fait évoluer Evoli en Noctali.'
  },
  POISON_BARB: {
    eng: '+10% atk speed. +50% damage if type poison.',
    esp: '10% de velocidad. +50% de daño si es veneno.',
    fra: '+10% vitesse d attaque. +50% attaque si type poison.'
  },
  DRAGON_FANG: {
    eng: '+10% atk speed. +50% damage if type dragon.',
    esp: '+10% a la velocidad de la tinta. +50% de daño si es un dragón.',
    fra: '+10% vitesse d attaque. +50% attaque si type dragon.'
  },
  THUNDER_STONE: {
    eng: '+10% atk speed. +50% damage if type electric. Will evolve Eevee into Jolteon.',
    esp: '+10% a velocidad de corteza". +50% de daño si es de tipo eléctrico. Evolucionará Eevee a Jolteon.',
    fra: '+10% vitesse d attaque. +50% attaque si type électrique. Fait évoluer Evoli en Voltali.'
  },
  METAL_SKIN: {
    eng: '+10% atk speed. +50% damage if type metal.',
    esp: '10% a la velocidad de la luz. +50% de daño si es de tipo metálico.',
    fra: '+10% vitesse d attaque. +50% attaque si type métal.'
  },
  METRONOME: {
    eng: '+5% damage each time the pokemon attack.',
    esp: '5% de daño cada vez que el pokemon ataca.',
    fra: '+5% attaque à chaque fois que le pokémon attaque'
  },
  WATER_STONE: {
    eng: '+10% atk speed. +50% damage if type water. Will evolve Eeve into Vaporeon.',
    esp: '+10% a la velocidad de ataque. +50% de daño si es de agua. Convertirá a Eeve en Vaporeon".',
    fra: '+10% vitesse d attaque. +50% attaque si type eau. Fait évoluer Evoli en Aquali.'
  },
  FIRE_STONE: {
    eng: '+10% atk speed. +50% damage if type fire. Will evolve Eevee into Flareon',
    esp: '+10% a la velocidad de ataque. +50% de daño si se escribe "fuego". Convertirá a Eevee en Flareon',
    fra: '+10% vitesse d attaque. +50% attaque si type feu. Fait évoluer Evoli en Pyroli.'
  },
  LEAF_STONE: {
    eng: '+10% atk speed. +50% damage if type grass. Will evolve Eevee into Leafon ',
    esp: '+10% a la velocidad de la tinta. +50% de daño si se trata de hierba. Evolucionará Eevee en Leafon',
    fra: '+10% vitesse d attaque. +50% attaque si type feuille. Fait évoluer Evoli en Phylali.'
  },
  BLACK_BELT: {
    eng: '+10% atk speed. +50% damage if type fighting.',
    esp: '+10% a la velocidad de la tinta. +50% de daño si el tipo es luchador.',
    fra: '+10% vitesse d attaque. +50% attaque si type combat.'
  },
  SILK_SCARF: {
    eng: '+10% atk speed. +50% damage if type normal.',
    esp: '+10% de velocidad de corte. +50% de daño si el tipo es normal.',
    fra: '+10% vitesse d attaque. +50% attaque si type électrique.'
  },
  DAWN_STONE: {
    eng: '+10% atk speed. +50% damage if type psychic. Will evolve Eevee into Espeon.',
    esp: '+10% de velocidad de corte. +50% de daño si es del tipo psíquico. Evolucionará Eevee a Espeon.',
    fra: '+10% vitesse d attaque. +50% attaque si type psy. Fait évoluer Evoli en Mentali.'
  },
  ICY_ROCK: {
    eng: '10% chance to freeze. Will evolve Eevee into Glaceon.',
    esp: '10% de probabilidad de congelarse. Evolucionará Eevee a Glaceon',
    fra: '+10% vitesse d attaque. +50% attaque si type glace. Fait évoluer évoli en Givrali.'
  }
});

const EFFECTS = Object.freeze({
  INGRAIN: 'INGRAIN',
  GROWTH: 'GROWTH',
  SPORE: 'SPORE',
  BLAZE: 'BLAZE',
  DROUGHT: 'DROUGHT',
  DRIZZLE: 'DRIZZLE',
  RAIN_DANCE: 'RAIN_DANCE',
  PRIMORDIAL_SEA: 'PRIMORDIAL_SEA',
  STAMINA: 'STAMINA',
  STRENGTH: 'STRENGTH',
  PURE_POWER: 'PURE_POWER',
  AGILITY: 'AGILITY',
  REVENGE: 'REVENGE',
  PUNISHMENT: 'PUNISHMENT',
  PSYWAVE: 'PSYWAVE',
  MAGIC_ROOM: 'MAGIC_ROOM',
  MEAN_LOOK: 'MEAN_LOOK',
  SCARY_FACE: 'SCARY_FACE',
  IRON_DEFENSE: 'IRON_DEFENSE',
  AUTOTOMIZE: 'AUTOTOMIZE',
  SPIKES: 'SPIKES',
  STEALTH_ROCK: 'STEALTH_ROCK',
  SANDSTORM: 'SANDSTORM',
  POISON_GAS: 'POISON_GAS',
  TOXIC: 'TOXIC',
  INTIMIDATE: 'INTIMIDATE',
  DRAGON_DANCE: 'DRAGON_DANCE',
  WORK_UP: 'WORK_UP',
  RAGE: 'RAGE',
  ANGER_POINT: 'ANGER_POINT',
  PURSUIT: 'PURSUIT',
  BRUTAL_SWING: 'BRUTAL_SWING',
  POWER_TRIP: 'POWER_TRIP',
  MEDITATE: 'MEDITATE',
  FOCUS_ENERGY: 'FOCUS_ENERGY',
  CALM_MIND: 'CALM_MIND',
  SWARM: 'SWARM',
  STICKY_WEB: 'STICKY_WEB',
  SWIFT_SWIM: 'SWIFT_SWIM',
  HYDO_CANNON: 'HYDRO_CANNON',
  RAZOR_WIND: 'RAZOR_WIND',
  HURRICANE: 'HURRICANE',
  RAIN_DISH: 'RAIN_DISH',
  FLOWER_SHIELD: 'FLOWER_SHIELD',
  BATTLE_ARMOR: 'BATTLE_ARMOR',
  MOUTAIN_RESISTANCE: 'MOUTAIN_RESISTANCE',
  PHANTOM_FORCE: 'PHANTOM_FORCE',
  ATTRACT: 'ATTRACT',
  BABY_DOLL_EYES: 'BABY_DOLL_EYES',
  ROCK: 'ROCK',
  GRASS: 'GRASS',
  FIRE: 'FIRE',
  WATER: 'WATER',
  NORMAL: 'NORMAL',
  ICE: 'ICE',
  SNOW: 'SNOW',
  MANA_HEAL: 'MANA_HEAL'
});

const SPECIAL_SKILL = Object.freeze({
  DEFAULT: 'DEFAULT',
  FIRE_BLAST: 'FIRE_BLAST',
  WHEEL_OF_FIRE: 'WHEEL_OF_FIRE',
  SEISMIC_TOSS: 'SEISMIC_TOSS',
  GUILLOTINE: 'GUILLOTINE',
  ROCK_SLIDE: 'ROCK_SLIDE',
  HEAT_WAVE: 'HEAT_WAVE',
  THUNDER: 'THUNDER',
  HYDRO_PUMP: 'HYDRO_PUMP',
  DRACO_METEOR: 'DRACO_METEOR',
  BLAZE_KICK: 'BLAZE_KICK',
  WISH: 'WISH',
  CALM_MIND: 'CALM_MIND',
  IRON_DEFENSE: 'IRON_DEFENSE',
  METRONOME: 'METRONOME',
  SOAK: 'SOAK',
  IRON_TAIL: 'IRON_TAIL',
  BLAST_BURN: 'BLAST_BURN',
  CHARGE: 'CHARGE',
  DISCHARGE: 'DISCHARGE',
  BITE: 'BITE',
  DRAGON_TAIL: 'DRAGON_TAIL',
  DRAGON_BREATH: 'DRAGON_BREATH',
  ICICLE_CRASH: 'ICICLE_CRASH',
  ROOT: 'ROOT',
  TORMENT: 'TORMENT',
  STOMP: 'STOMP',
  DARK_PULSE: 'DARK_PULSE',
  NIGHT_SLASH: 'NIGHT_SLASH',
  BUG_BUZZ: 'BUG_BUZZ',
  POISON_STING: 'POISON_STING',
  LEECH_LIFE: 'LEECH_LIFE',
  HAPPY_HOUR: 'HAPPY_HOUR',
  TELEPORT: 'TELEPORT',
  NASTY_PLOT: 'NASTY_PLOT',
  THIEF: 'THIEF',
  STUN_SPORE: 'STUN_SPORE',
  METEOR_MASH: 'METEOR_MASH',
  HURRICANE: 'HURRICANE',
  BURN: 'BURN',
  SILENCE: 'SILENCE',
  SLEEP: 'SLEEP',
  FREEZE: 'FREEZE',
  PROTECT: 'PROTECT',
  POISON: 'POISON',
  CONFUSION: 'CONFUSION'
});

const SPECIAL_SKILL_DESCRIPTION = Object.freeze({
  DEFAULT: {
    eng: '',
    esp: '',
    fra:''
  },
  BURN: {
    eng: 'Burn the whole team for 2/4/8 seconds, dealing 5% hp / seconds, divide their attack by two.',
    esp: 'Quemar todo el equipo durante 2/4/8 segundos, repartiendo el 5% de hp/segundos, dividir su ataque por dos.',
    fra:'Brule la cible pour 2/4/8 secondes, lui faisant perdre 5% hp/secondes, divisant son attaque par 2.'
  },
  POISON: {
    eng: 'Poison the target for 5/10/20 seconds, dealing 15% hp/seconds',
    esp: 'Envenenar el objetivo durante 5/10/20 segundos, repartiendo 15% hp/segundos',
    fra:'Empoisonne la cible durant 5/10/20 secondes, faisant 15% hp/secondes'
  },
  SLEEP: {
    eng: 'Sleeps the target for 3/5/7 seconds',
    esp: 'Duerme el objetivo durante 3/5/7 segundos',
    fra:'Endors la cible durant 3/5/7 secondes'
  },
  SILENCE: {
    eng: 'Silence the whole team for 2/4/8 seconds',
    esp: 'Silenciar todo el equipo durante 2/4/8 segundos',
    fra: 'Silence toute l équipe ennemie durant 2/4/8 secondes'
  },
  PROTECT: {
    eng: 'Makes the pokemon invulnerable for 3/5/7 seconds.',
    esp: 'Hace que el pokemon sea invulnerable durante 3/5/7 segundos.',
    fra: 'Rend le pokémon invulnérable durant 3/5/7 secondes'
  },
  FREEZE: {
    eng: 'Freeze the whole ennemy team for 1/2/4 seconds',
    esp: 'Congela todo el equipo durante 1/2/4 segundos',
    fra:'Gèle la cible durant 1/2/4 secondes'
  },
  CONFUSION: {
    eng: 'Makes the target confused for 1/2/4 seconds',
    esp: 'Hace que todo el equipo se confunda durante 1/2/4 segundos',
    fra:'Rend toute la team ennemie confus pendant 1/ 2 4 secondes'
  },
  FIRE_BLAST: {
    eng: 'Throw a fire blast for 30/50/100 special damage',
    esp: 'Lanza una ráfaga de fuego para 30/50/100 de daño especial',
    fra:'Lance une déflagration infligeant 30/50/100 dégats spéciaux'
  },
  WHEEL_OF_FIRE: {
    eng: 'Sends a fire wheel that makes a round trip doing 30/40/50 special damages.',
    esp: 'Envía una rueda de fuego que hace un viaje de ida y vuelta haciendo 30/40/50 de daño especial.',
    fra:'Envoie une boule de feu faisant un aller retour, endommageant les pokémons pour 30/40/50 dégats spéciaux'
  },
  SEISMIC_TOSS: {
    eng: 'Mono target attack that deals true damage function of how big is your team',
    esp: 'Ataque de objetivo mono que inflige daño real en función de lo grande que sea tu equipo.',
    fra:'Attaque mono cible dont les dégats varient en fonction de la taille de l équipe.'
  },
  GUILLOTINE: {
    eng: 'Mono target attack that deals physical damage. Restores half mana if target killed',
    esp: 'Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere',
    fra:'Attaque mono cible qui fait des dégats physiques. Restaure la moitié du mana si la cible est tué.'
  },
  ROCK_SLIDE: {
    eng: 'Mono target attack that deals physical damage. Doubles damage if target is type flying.',
    esp: 'Ataque de objetivo mono que causa daño físico. Duplica el daño si el objetivo es de tipo volador.',
    fra:''
  },
  HEAT_WAVE: {
    eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
    esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
    fra:'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
  },
  THUNDER: {
    eng: 'Mono target damage that deals 30/50/70 special damage.',
    esp: 'Daño de objetivo mono que inflige 30/50/70 de daño especial.',
    fra:'Attaque monocibe infligeant 30/50/70 dégats spéciaux.'
  },
  HYDRO_PUMP: {
    eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
    esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
    fra:'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
  },
  DRACO_METEOR: {
    eng: 'Area of effect attack that deals 10/20/40 special damages to all ennemies',
    esp: 'Ataque de área de efecto que causa 10/20/40 de daño especial a todos los enemigos',
    fra:'Inflige 10/20/40 dégats spéciaux à tous les pokémons ennemis.'
  },
  BLAZE_KICK: {
    eng: 'Mono target that deals 30/60/90 physical damage.',
    esp: 'Objetivo mono que causa 30/60/90 de daño físico',
    fra:'Attaque monocinle faisant 30/60/90 dégats physiques'
  },
  WISH: {
    eng: 'Restores 50 hp to 1/2/3 ally pokemon',
    esp: 'Restaura 50 hp a 1/2/3 de pokemon aliado',
    fra:'Soigne 50 hp à 1/2/3 pokémons alliés'
  },
  CALM_MIND: {
    eng: 'Buff pokemon attack by 50/100/150%',
    esp: 'Ataque de pokemón de la Buff en un 50/100/150%.',
    fra:'Augmente l attaque du pokémon de 50/100/150%.'
  },
  IRON_DEFENSE: {
    eng: 'Buff pokemon defense / special defense by 4/6/8 points',
    esp: 'Defensa pokemon buff / defensa especial por 4/6/8 puntos',
    fra:'Augmente la défense du pokémon de 4/6/8 points'
  },
  METRONOME: {
    eng: 'Shoot a random capacity',
    esp: 'Disparar una capacidad aleatoria',
    fra:'Execute une capacité au hasard'
  },
  SOAK: {
    eng: 'Deals 20/30/40 special damage and restores 10 mana to friendly pokemons',
    esp: 'Hace 20/30/40 de daño especial y devuelve 10 de maná a los pokemons amistosos.',
    fra:'Fait 20/30/40 dégats spéciaux et restaure 10 mana à chaque pokémon allié.'
  },
  IRON_TAIL: {
    eng: 'Mono target damage attack that deals 20/30/40. Buff defense by 1/3/5 points.',
    esp: 'Ataque de daño al objetivo mono que reparte 20/30/40. Pulveriza la defensa por 1/3/5 puntos.',
    fra:'Attaque monocible faisant 20/30/40 dégats physique. Booste la défense de 1/3/5 points.'
  },
  BLAST_BURN: {
    eng: 'Area of effect attack that deals 30/50/80 special damages.',
    esp: 'Ataque en el área de efecto que causa 30/50/80 daños especiales.',
    fra:'Attaque AOE en cercle faisant 30/50/80 dégats spéciaux.'
  },
  CHARGE: {
    eng: 'Buff all electric ally pokemons attack by 10/20/30 %',
    esp: 'Pulir todos los pokemones aliados eléctricos atacan en un 10/20/30 %.',
    fra:'Augmente l attaque des alliés electrique de 10/20/30%'
  },
  DISCHARGE: {
    eng: 'Area of effect attack that deals 40/60/80 special damages.',
    esp: 'Ataque en el área de efecto que causa 40/60/80 daños especiales.',
    fra:'Attaque AOE en cercle faisant 40/60/80 dégats spéciaux.'
  },
  BITE: {
    eng: '50% Life steal mono target physical attack that deals 30/50/70 damage.',
    esp: '50% Vida robar mono objetivo de ataque físico que inflige 30/50/70 de daño.',
    fra:'Attaque monocible avec 50% de vol de vie faisant 30/50/70 dégats spéciaux.'
  },
  DRAGON_TAIL: {
    eng: 'Mono target physical attack that deals 30/40/50 damage and buff defenses by 1/2/3 points',
    esp: 'El ataque físico de un monoobjetivo que inflige 30/40/50 de daño y mejora las defensas en 1/2/3 puntos',
    fra:'Attaque mono-cible faisant 30/40/50 dégats physique et boostant les défenses de 1/2/3 points.'
  },
  DRAGON_BREATH: {
    eng: 'Area of effect attack that deals 30/40/50 special damage in a line behind the target',
    esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial en una línea detrás del objetivo',
    fra:'Attaque AOE faisant 30/40/50 dégats spéciaux dans une ligne derrière la cible'
  },
  ICICLE_CRASH: {
    eng: 'Area of effect attack that deals 30/40/50 physical damage around the target',
    esp: 'Ataque de área de efecto que causa 30/40/50 de daño físico alrededor del objetivo',
    fra:'Attaque AOE en cercle faisant 30/40/50 dégats physiques'
  },
  ROOT: {
    eng: 'Heal all nearby ally pokemons by 20/30/40 hp.',
    esp: 'Curar a todos los pokemons aliados cercanos con 20/30/40 hp.',
    fra:'Soigne les alliés autour de 20/30/40 hp.'
  },
  TORMENT: {
    eng: 'Increase attack speed by 20/30/40 %',
    esp: 'Aumenta la velocidad de ataque en un 20/30/40 %.',
    fra:'Augmente la vitesse d attaque de 20/30/40%'
  },
  STOMP: {
    eng: 'Mono target physical damage (2*atk*stars)',
    esp: 'Daño físico del objetivo mono (2*atk*stars)',
    fra:'Attaque mono cible faisant 2*atk*stars dégats physiques'
  },
  DARK_PULSE: {
    eng: 'Life drain target attack that deals 30/50/70 special damage',
    esp: 'Ataque al objetivo de drenaje de vida que causa 30/50/70 de daño especial',
    fra:'Attaque vol de vie faisant 30/50/70 dégats spéciaux.'
  },
  NIGHT_SLASH: {
    eng: 'Mono target special attack that does 40/60/80. Decreases all ennemies defense by 1 point.',
    esp: 'Ataque especial de objetivo mono que hace 40/60/80. Disminuye la defensa de todos los enemigos en 1 punto.',
    fra:'Attaque spéciale faisant 40/60/80 points de dégats. Diminue la défense de toute la team ennemie de 1 point.'
  },
  BUG_BUZZ: {
    eng: 'Mono target special damage attack that does 20/30/40.',
    esp: 'Ataque de daño especial de un mono objetivo que hace 20/30/40.',
    fra:'Attaque mono cible faisant 20/30/40 dégats spéciaux'
  },
  POISON_STING: {
    eng: 'Physical mono target damage that deals 30/40/50. Doubles damage if target is poisoned.',
    esp: 'Daño físico de un solo objetivo que reparte 30/40/50. Duplica el daño si el objetivo está envenenado.',
    fra:'Attaque physique mono cible faisant 30/40/50 dégats. Double les dégats si la cible est empoisonné.'
  },
  LEECH_LIFE: {
    eng: 'Area of effect life steal special damage attack 10/20/30 around the target',
    esp: 'Área de efecto robo de vida daño especial ataque 10/20/30 alrededor del objetivo',
    fra:'Attaque vol de vie en AOE faisant 10/20/30 points de dégats.'
  },
  HAPPY_HOUR: {
    eng: 'Buff all ally attacks by 3/6/9 points.',
    esp: 'Pulir todos los ataques de los aliados por 3/6/9 puntos.',
    fra:'Augmente l attaque de toute l équipe de 3/6/9 points.'
  },
  TELEPORT: {
    eng: 'Teleport the pokemon on one edge of the map',
    esp: 'Teletransportar el pokemon en un borde del mapa',
    fra:'Téléporte le pokémon sur un coin de la carte.'
  },
  NASTY_PLOT: {
    eng: 'Buff pokemon attack by 5/10/20 points',
    esp: 'Buff pokemon ataque por 5/10/20 puntos',
    fra:'Booste l attaque du pokémon de 5/10/20 points'
  },
  THIEF: {
    eng: 'Steal ennemy target item and deals 5/10/20 physical damage',
    esp: 'Roba el objeto del enemigo e inflige 5/10/20 de daño físico',
    fra:'Vole l item du pokémon ennemi et inflige 5/10/20 dégats physiques'
  },
  STUN_SPORE: {
    eng: 'Decrease target attack speed by 50/100/200%',
    esp: 'Disminuir la velocidad de ataque del objetivo en un 50/100/200%',
    fra:'Diminue la vitesse d attaque du pokémon de 50/100/200%'
  },
  METEOR_MASH: {
    eng: 'Area of effect around the target that deals 30/50/70 damages. Buff pokemon attack by 5 points.',
    esp: 'Área de efecto alrededor del objetivo que produce 30/50/70 daños. Buff pokemon ataque por 5 puntos.',
    fra:'Attaque en AOE faisant 30/50/40 dégats spéciaux. Booste l attaque du pokémon de 5 points.'
  },
  HURRICANE: {
    eng: 'Area of effect attack that deals 10/20/30 damages in a line behind the target',
    esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
    fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
  }
});

const TYPE_ITEM = Object.freeze({
  NORMAL: 'SILK_SCARF',
  GRASS: 'LEAF_STONE',
  FIRE: 'FIRE_STONE',
  WATER: 'WATER_STONE',
  ELECTRIC: 'THUNDER_STONE',
  FIGHTING: 'BLACK_BELT',
  PSYCHIC: 'DAWN_STONE',
  DARK: 'NIGHT_STONE',
  METAL: 'METAL_SKIN',
  GROUND: 'SOFT_SAND',
  POISON: 'POISON_BARB',
  DRAGON: 'DRAGON_FANG',
  FAIRY: 'MOON_STONE',
  ICE: 'ICY_ROCK'
});

const ITEM_TYPE = Object.freeze({
  SILK_SCARF: 'SILK_SCARF',
  LEAF_STONE: 'LEAF_STONE',
  FIRE_STONE: 'FIRE_STONE',
  WATER_STONE: 'WATER_STONE',
  THUNDER_STONE: 'THUNDER_STONE',
  BLACK_BELT: 'BLACK_BELT',
  DAWN_STONE: 'DAWN_STONE',
  NIGHT_STONE: 'NIGHT_STONE',
  METAL_SKIN: 'METAL_SKIN',
  SOFT_SAND: 'SOFT_SAND',
  POISON_BARB: 'POISON_BARB',
  DRAGON_FANG: 'DRAGON_FANG',
  MOON_STONE: 'MOON_STONE',
  ICY_ROCK: 'ICY_ROCK'
});

const LAST_BATTLE_RESULT_TRADUCTION = Object.freeze({
  Win: {
    eng: 'Win',
    esp: 'Gana',
    fra: 'Victoire'
  },
  Defeat: {
    eng: 'Defeat',
    esp: 'Derrota',
    fra: 'Défaite'
  },
  Draw: {
    eng: 'Draw',
    esp: 'Empate',
    fra: 'Egalité'
  }
});

const PHASE_TRADUCTION = Object.freeze({
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

const TYPE_TRADUCTION = Object.freeze({
  NORMAL: {
    eng: 'Normal',
    esp: 'Normal',
    fra: 'Normal'
  },
  GRASS: {
    eng: 'Grass',
    esp: 'Hierba',
    fra: 'Feuille'
  },
  FIRE: {
    eng: 'Fire',
    esp: 'Fuego',
    fra: 'Feu'
  },
  WATER: {
    eng: 'Water',
    esp: 'Agua',
    fra: 'Eau'
  },
  ELECTRIC: {
    eng: 'Elec',
    esp: 'Elec',
    fra: 'Elec'
  },
  FIGHTING: {
    eng: 'Fighting',
    esp: 'Luchando',
    fra: 'Combat'
  },
  PSYCHIC: {
    eng: 'Psychic',
    esp: 'Psiquico',
    fra: 'Psy'
  },
  DARK: {
    eng: 'Dark',
    esp: 'Oscuro',
    fra: 'Ténèbres'
  },
  METAL: {
    eng: 'Metal',
    esp: 'Metal',
    fra: 'Métal'
  },
  GROUND: {
    eng: 'Ground',
    esp: 'Tierra',
    fra: 'Sol'
  },
  POISON: {
    eng: 'Poison',
    esp: 'Veneno',
    fra: 'Poison'
  },
  DRAGON: {
    eng: 'Dragon',
    esp: 'Dragón',
    fra: 'Dragon'
  },
  FIELD: {
    eng: 'Field',
    esp: 'Campo',
    fra: 'Animal'
  },
  MONSTER: {
    eng: 'Monster',
    esp: 'Monstruo',
    fra: 'Monstre'
  },
  HUMAN: {
    eng: 'Human',
    esp: 'Humano',
    fra: 'Humain'
  },
  AQUATIC: {
    eng: 'Aquatic',
    esp: 'Acuático',
    fra: 'Aquatique'
  },
  BUG: {
    eng: 'Bug',
    esp: 'Insecto',
    fra: 'Insecte'
  },
  FLYING: {
    eng: 'Flying',
    esp: 'Volando',
    fra: 'Vol'
  },
  FLORA: {
    eng: 'Flora',
    esp: 'Flor',
    fra: 'Fleur'
  },
  MINERAL: {
    eng: 'Mineral',
    esp: 'Mineral',
    fra: 'Minéral'
  },
  AMORPH: {
    eng: 'Amorph',
    esp: 'Fantasma',
    fra: 'Fantome'
  },
  FAIRY: {
    eng: 'Fairy',
    esp: 'Feria',
    fra: 'Fée'
  },
  ICE: {
    eng: 'Ice',
    esp: 'Hielo',
    fra: 'Glace'
  }
});

const TYPE = Object.freeze({
  NORMAL: 'NORMAL',
  GRASS: 'GRASS',
  FIRE: 'FIRE',
  WATER: 'WATER',
  ELECTRIC: 'ELECTRIC',
  FIGHTING: 'FIGHTING',
  PSYCHIC: 'PSYCHIC',
  DARK: 'DARK',
  METAL: 'METAL',
  GROUND: 'GROUND',
  POISON: 'POISON',
  DRAGON: 'DRAGON',
  FIELD: 'FIELD',
  MONSTER: 'MONSTER',
  HUMAN: 'HUMAN',
  AQUATIC: 'AQUATIC',
  BUG: 'BUG',
  FLYING: 'FLYING',
  FLORA: 'FLORA',
  MINERAL: 'MINERAL',
  AMORPH: 'AMORPH',
  FAIRY: 'FAIRY',
  ICE: 'ICE'
});

const RARITY = Object.freeze({
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  NEUTRAL: 'NEUTRAL'
});

const RARITY_HP_COST= Object.freeze({
  COMMON: 1,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 2,
  LEGENDARY: 3,
  NEUTRAL: 3
});

const COST = Object.freeze({
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5
});

const BOT_AVATAR = Object.freeze({
  WATER1: 'squirtle',
  FIRE1: 'charmander',
  POISON1: 'zubat',
  GRASS1: 'bulbasaur',
  GROUND1: 'geodude',
  NORMAL1: 'jigglypuff',
  ELECTRIC1: 'pikachu',
  MONSTER1: 'larvitar',
  FIELD1: 'nidoqueen',
  DRAGON1: 'dratini'
});

const POKEMON_BOT = Object.freeze({
  squirtle: 'WATER1',
  charmander: 'FIRE1',
  zubat: 'POISON1',
  bulbasaur: 'GRASS1',
  geodude: 'GROUND1',
  jigglypuff: 'NORMAL1',
  pikachu: 'ELECTRIC1',
  larvitar: 'MONSTER1',
  nidoqueen: 'FIELD1',
  dratini: 'DRAGON1'
});

const EXP_TABLE = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 32,
  7: 50,
  8: 70
});

const STATE = Object.freeze({
  FIGHT: 'FIGHT',
  PICK: 'PICK'
});

const STATE_TYPE = Object.freeze({
  MOVING: 'MOVING',
  ATTACKING: 'ATTACKING'
});

const ORIENTATION = Object.freeze({
  DOWNLEFT: 'DOWNLEFT',
  LEFT: 'LEFT',
  UPLEFT: 'UPLEFT',
  UP: 'UP',
  UPRIGHT: 'UPRIGHT',
  RIGHT: 'RIGHT',
  DOWNRIGHT: 'DOWNRIGHT',
  DOWN: 'DOWN'
});

const ATTACK_TYPE = Object.freeze({
  PHYSICAL: 'PHYSICAL',
  SPECIAL: 'SPECIAL',
  TRUE: 'TRUE'
});

const MAP_TYPE = Object.freeze({
  WATER: 'WATER',
  NORMAL: 'NORMAL',
  FIRE: 'FIRE',
  GRASS: 'GRASS',
  ICE: 'ICE',
  ROCK: 'ROCK'
});

const MAP_TYPE_NAME = Object.freeze({
  WATER: 'Stormy Sea',
  NORMAL: 'Tiny Woods',
  FIRE: 'Magma Cavern',
  GRASS: 'Hidden Highland',
  ICE: 'Frosty Forest',
  ROCK: 'Glimmer Desert'
});

const XP_TABLE = [1000, 1500, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000];

const XP_PLACE = [700, 500, 400, 300, 200, 150, 100, 100];

module.exports = {
  SPECIAL_SKILL_DESCRIPTION,
  SPECIAL_SKILL,
  XP_PLACE,
  XP_TABLE,
  MAP_TYPE_NAME,
  LAST_BATTLE_RESULT_TRADUCTION,
  PHASE_TRADUCTION,
  TYPE_TRADUCTION,
  WORDS,
  MAP_TYPE,
  ITEM_TYPE,
  TYPE_ITEM,
  POKEMON_BOT,
  BOT_AVATAR,
  TYPE,
  RARITY,
  RARITY_HP_COST,
  COST,
  EXP_TABLE,
  STATE,
  STATE_TYPE,
  ORIENTATION,
  EFFECTS,
  CLIMATE,
  ATTACK_TYPE,
  ITEMS,
  ITEM_NAME,
  ITEM_DESCRIPTION
};
