const PKM = Object.freeze({
  DITTO: 'ditto',
  BULBASAUR: 'bulbasaur',
  IVYSAUR: 'ivysaur',
  VENUSAUR: 'venusaur',
  CHARMANDER: 'charmander',
  CHARMELEON: 'charmeleon',
  CHARIZARD: 'charizard',
  SQUIRTLE: 'squirtle',
  WARTORTLE: 'wartortle',
  BLASTOISE: 'blastoise',
  GEODUDE: 'geodude',
  GRAVELER: 'graveler',
  GOLEM: 'golem',
  AZURILL: 'azurill',
  MARILL: 'marill',
  AZUMARILL: 'azumarill',
  ZUBAT: 'zubat',
  GOLBAT: 'golbat',
  CROBAT: 'crobat',
  MAREEP: 'mareep',
  FLAFFY: 'flaffy',
  AMPHAROS: 'ampharos',
  CLEFFA: 'cleffa',
  CLEFAIRY: 'clefairy',
  CLEFABLE: 'clefable',
  IGGLYBUFF: 'igglybuff',
  WIGGLYTUFF: 'wygglytuff',
  JIGGLYPUFF: 'jigglypuff',
  CATERPIE: 'caterpie',
  METAPOD: 'metapod',
  BUTTERFREE: 'butterfree',
  WEEDLE: 'weedle',
  KAKUNA: 'kakuna',
  BEEDRILL: 'beedrill',
  PIDGEY: 'pidgey',
  PIDGEOTTO: 'pidgeotto',
  PIDGEOT: 'pidgeot',
  HOPPIP: 'hoppip',
  SKIPLOOM: 'skiploom',
  JUMPLUFF: 'jumpluff',
  SEEDOT: 'seedot',
  NUZLEAF: 'nuzleaf',
  SHIFTRY: 'shiftry',
  STARLY: 'starly',
  STARAVIA: 'staravia',
  STARAPTOR: 'staraptor',
  CHIKORITA: 'chikorita',
  BAYLEEF: 'bayleef',
  MEGANIUM: 'meganium',
  CYNDAQUIL: 'cyndaquil',
  QUILAVA: 'quilava',
  TYPHLOSION: 'typlosion',
  TOTODILE: 'totodile',
  CROCONAW: 'croconaw',
  FERALIGATR: 'feraligatr',
  TREECKO: 'treecko',
  GROVYLE: 'grovyle',
  SCEPTILE: 'sceptile',
  TORCHIC: 'torchic',
  COMBUSKEN: 'combusken',
  BLAZIKEN: 'blaziken',
  MUDKIP: 'mudkip',
  MARSHTOMP: 'marshtomp',
  SWAMPERT: 'swampert',
  TURTWIG: 'turtwig',
  GROTLE: 'grotle',
  TORTERRA: 'torterra',
  CHIMCHAR: 'chimchar',
  MONFERNO: 'monferno',
  INFERNAPE: 'infernape',
  PIPLUP: 'piplup',
  PRINPLUP: 'prinplup',
  EMPOLEON: 'empoleon',
  NIDORANF: 'nidoranF',
  NIDORINA: 'nidorina',
  NIDOQUEEN: 'nidoqueen',
  NIDORANM: 'nidoranM',
  NIDORINO: 'nidorino',
  NIDOKING: 'nidoking',
  PICHU: 'pichu',
  PIKACHU: 'pikachu',
  RAICHU: 'raichu',
  MACHOP: 'machop',
  MACHOKE: 'machoke',
  MACHAMP: 'machamp',
  HORSEA: 'horsea',
  SEADRA: 'seadra',
  KINGDRA: 'kingdra',
  TRAPINCH: 'trapinch',
  VIBRAVA: 'vibrava',
  FLYGON: 'flygon',
  SPHEAL: 'spheal',
  SEALEO: 'sealeo',
  WALREIN: 'walrein',
  ARON: 'aron',
  LAIRON: 'lairon',
  AGGRON: 'aggron',
  MAGNEMITE: 'magnemite',
  MAGNETON: 'magneton',
  MAGNEZONE: 'magnezone',
  RHYHORN: 'rhyhorn',
  RHYDON: 'rhydon',
  RHYPERIOR: 'rhyperior',
  TOGEPI: 'togepi',
  TOGETIC: 'togetic',
  TOGEKISS: 'togekiss',
  DUSKULL: 'duskull',
  DUSCLOPS: 'dusclops',
  DUSKNOIR: 'dusknoir',
  LOTAD: 'lotad',
  LOMBRE: 'lombre',
  LUDICOLO: 'ludicolo',
  SHINX: 'shinx',
  LUXIO: 'luxio',
  LUXRAY: 'luxray',
  POLIWAG: 'poliwag',
  POLIWHIRL: 'poliwhirl',
  POLITOED: 'politoed',
  ABRA: 'abra',
  KADABRA: 'kadabra',
  ALAKAZAM: 'alakazam',
  GASTLY: 'gastly',
  HAUNTER: 'haunter',
  GENGAR: 'gengar',
  DRATINI: 'dratini',
  DRAGONAIR: 'dragonair',
  DRAGONITE: 'dragonite',
  LARVITAR: 'larvitar',
  PUPITAR: 'pupitar',
  TYRANITAR: 'tyranitar',
  SLAKOTH: 'slakoth',
  VIGOROTH: 'vigoroth',
  SLAKING: 'slaking',
  RALTS: 'ralts',
  KIRLIA: 'kirlia',
  GARDEVOIR: 'gardevoir',
  BAGON: 'bagon',
  SHELGON: 'shelgon',
  SALAMENCE: 'salamence',
  BELDUM: 'beldum',
  METANG: 'metang',
  METAGROSS: 'metagross',
  GIBLE: 'gible',
  GABITE: 'gabite',
  GARCHOMP: 'garchomp',
  ELEKID: 'elekid',
  ELECTABUZZ: 'electabuzz',
  ELECTIVIRE: 'electivire',
  MAGBY: 'magby',
  MAGMAR: 'magmar',
  MAGMORTAR: 'magmortar',
  MUNCHLAX: 'munchlax',
  SNORLAX: 'snorlax',
  GROWLITHE: 'growlithe',
  ARCANINE: 'arcanine',
  ONIX: 'onix',
  STEELIX: 'steelix',
  MEGASTEELIX: 'mega-steelix',
  SCYTHER: 'scyther',
  SCIZOR: 'scizor',
  MEGASCIZOR: 'mega-scizor',
  RIOLU: 'riolu',
  LUCARIO: 'lucario',
  MEGALUCARIO: 'mega-lucario',
  MAGIKARP: 'magikarp',
  RATTATA: 'rattata',
  RATICATE: 'raticate',
  SPEAROW: 'spearow',
  FEAROW: 'fearow',
  GYARADOS: 'gyarados',
  LUGIA: 'lugia',
  GIRATINA: 'giratina',
  ZAPDOS: 'zapdos',
  MOLTRES: 'moltres',
  ARTICUNO: 'articuno',
  DIALGA: 'dialga',
  PALKIA: 'palkia',
  SUICUNE: 'suicune',
  RAIKOU: 'raikou',
  ENTEI: 'entei',
  REGICE: 'regice',
  REGIROCK: 'regirock',
  REGISTEEL: 'registeel',
  KYOGRE: 'kyogre',
  GROUDON: 'groudon',
  RAYQUAZA: 'rayquaza',
  REGIGIGAS: 'regigigas',
  EEVEE: 'eevee',
  VAPOREON: 'vaporeon',
  JOLTEON: 'jolteon',
  FLAREON: 'flareon',
  ESPEON: 'espeon',
  UMBREON: 'umbreon',
  LEAFEON: 'leafeon',
  SYLVEON: 'sylveon',
  MEDITITE: 'meditite',
  MEDICHAM: 'medicham',
  MEGAMEDICHAM: 'mega-medicham',
  NUMEL: 'numel',
  CAMERUPT: 'camerupt',
  MEGACAMERUPT: 'mega-camerupt',
  SANDSHREW: 'sandshrew',
  DARKRAI: 'darkrai',
  LITWICK: 'litwick',
  LAMPENT: 'lampent',
  CHANDELURE: 'chandelure',
  SLOWPOKE: 'slowpoke',
  SLOWBRO: 'slowbro',
  SLOWKING: 'slowking',
  BELLSPROUT: 'bellsprout',
  WEEPINBELL: 'weepinbell',
  VICTREEBEL: 'victreebel',
  CARVANHA: 'carvanha',
  HOUNDOUR: 'houndour',
  SWINUB: 'swinub',
  PILOSWINE: 'piloswine',
  MAMOSWINE: 'mamoswine',
  SNORUNT: 'snorunt',
  GLALIE: 'glalie',
  FROSLASS: 'froslass',
  SNOVER: 'snover',
  ABOMASNOW: 'abomasnow',
  MEGAABOMASNOW: 'mega-abomasnow',
  VANILLITE: 'vanillite',
  VANILLISH: 'vanillish',
  VANILLUXE: 'vanilluxe',
  GLACEON: 'glaceon',
  VOLCARONA: 'volcarona',
  LANDORUS: 'landorus',
  THUNDURUS: 'thundurus',
  TORNADUS: 'tornadus',
  KELDEO: 'keldeo',
  TERRAKION: 'terrakion',
  VIRIZION: 'virizion',
  COBALION: 'cobalion',
  MANAPHY: 'manaphy',
  ROTOM: 'rotom',
  SPIRITOMB: 'spiritomb',
  ABSOL: 'absol',
  LAPRAS: 'lapras',
  LATIAS: 'latias',
  LATIOS: 'latios',
  MESPRIT: 'mesprit',
  AZELF: 'azelf',
  UXIE: 'uxie',
  MEWTWO: 'mewtwo',
  KYUREM: 'kyurem',
  RESHIRAM: 'reshiram',
  ZEKROM: 'zekrom',
  CELEBI: 'celebi',
  VICTINI: 'victini',
  JIRACHI: 'jirachi',
  ARCEUS: 'arceus',
  DEOXYS: 'deoxys',
  SHAYMIN: 'shaymin',
  CRESSELIA: 'cresselia',
  HEATRAN: 'heatran',
  HOOH: 'ho-Oh',
  AERODACTYL: 'aerodactyl',
  PRIMALKYOGRE: 'primal-Kyogre',
  PRIMALGROUDON: 'primal-Groudon',
  MEOWTH: 'meowth',
  PERSIAN: 'persian',
  DEINO: 'deino',
  ZWEILOUS: 'zweilous',
  HYDREIGON: 'hydreigon',
  SANDILE: 'sandile',
  KROKOROK: 'krokorok',
  KROOKODILE: 'krookodile',
  SOLOSIS: 'solosis',
  DUOSION: 'duosion',
  REUNICLUS: 'reuniclus',
  MEGARAYQUAZA: 'mega-Rayquaza',
  SWABLU: 'swablu',
  ODDISH: 'oddish',
  GLOOM: 'gloom',
  VILEPLUME: 'vileplume',
  BELLOSSOM: 'bellossom',
  AMAURA: 'amaura',
  AURORUS: 'aurorus',
  ANORITH: 'anorith',
  ARCHEN: 'archen',
  ARCHEOPS: 'archeops',
  ARMALDO: 'armaldo',
  BASTIODON: 'bastiodon',
  CARRACOSTA: 'carracosta',
  CRADILY: 'cradily',
  CRANIDOS: 'cranidos',
  KABUTO: 'kabuto',
  KABUTOPS: 'kabutops',
  LILEEP: 'lileep',
  OMANYTE: 'omanyte',
  OMASTAR: 'omastar',
  RAMPARDOS: 'rampardos',
  SHIELDON: 'shieldon',
  TIRTOUGA: 'tirtouga',
  TYRANTRUM: 'tyrantrum',
  TYRUNT: 'tyrunt',
  BUDEW: 'budew',
  ROSELIA: 'roselia',
  ROSERADE: 'roserade',
  BUNEARY: 'buneary',
  LOPUNNY: 'lopunny',
  MEGALOPUNNY: 'mega-lopunny',
  AXEW: 'axew',
  FRAXURE: 'fraxure',
  HAXORUS: 'haxorus',
  VENIPEDE: 'venipede',
  WHIRLIPEDE: 'whirlipede',
  SCOLIPEDE: 'scolipede',
  PORYGON: 'porygon',
  PORYGON2: 'porygon2',
  PORYGONZ: 'porygon-z',
  KLINK: 'klink',
  KLANG: 'klang',
  KLINKLANG: 'klinklang',
  ELECTRIKE: 'electrike',
  MANECTRIC: 'manectric',
  MEGAMANECTRIC: 'mega-manectric',
  SHUPPET: 'shuppet',
  BANETTE: 'banette',
  MEGABANETTE: 'mega-banette',
  HONEDGE: 'honedge',
  DOUBLADE: 'doublade',
  AEGISLASH: 'aegislash',
  CUBONE: 'cubone',
  MAROWAK: 'marowak',
  ALOLANMAROWAK: 'alolan-marowak',
  FLETCHLING: 'fletchling',
  FLETCHINDER: 'fletchinder',
  TALONFLAME: 'talonflame',
  WHISMUR: 'whismur',
  LOUDRED: 'loudred',
  EXPLOUD: 'exploud',
  TYMPOLE: 'tympole',
  PALPITOAD: 'palpitoad',
  SEISMITOAD: 'seismitoad',
  SEWADDLE: 'sewaddle',
  SWADLOON: 'swadloon',
  LEAVANNY: 'leavanny',
  PIKIPEK: 'pikipek',
  TRUMBEAK: 'trumbeak',
  TOUCANNON: 'toucannon',
  FLABEBE: 'flabebe',
  FLOETTE: 'floette',
  FLORGES: 'florges',
  JANGMOO: 'jangmo-o',
  HAKAMOO: 'hakamo-o',
  KOMMOO: 'kommo-o',
  MELOETTA: 'meloetta',
  ALTARIA: 'altaria',
  MEGAALTARIA: 'mega-altaria',
  LILLIPUP: 'lillipup',
  HERDIER: 'herdier',
  STOUTLAND: 'stoutland'
});

const WORDS = Object.freeze({
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

const ITEM_NAME = Object.freeze({
  ARMOR_FOSSIL: {
    eng: 'Armor Fossil',
    esp: 'Armor Fossil',
    fra: 'Armor Fossil'
  },
  CLAW_FOSSIL: {
    eng: 'Claw Fossil',
    esp: 'Claw Fossil',
    fra: 'Claw Fossil'
  },
  COVER_FOSSIL: {
    eng: 'Cover Fossil',
    esp: 'Cover Fossil',
    fra: 'Cover Fossil'
  },
  DOME_FOSSIL: {
    eng: 'Dome Fossil',
    esp: 'Dome Fossil',
    fra: 'Dome Fossil'
  },
  HELIX_FOSSIL: {
    eng: 'Helix Fossil',
    esp: 'Helix Fossil',
    fra: 'Helix Fossil'
  },
  JAW_FOSSIL: {
    eng: 'Jaw Fossil',
    esp: 'Jaw Fossil',
    fra: 'Jaw Fossil'
  },
  OLD_AMBER: {
    eng: 'Old Amber',
    esp: 'Old Amber',
    fra: 'Old Amber'
  },
  PLUME_FOSSIL: {
    eng: 'Plume Fossil',
    esp: 'Plume Fossil',
    fra: 'Plume Fossil'
  },
  ROOT_FOSSIL: {
    eng: 'Root Fossil',
    esp: 'Root Fossil',
    fra: 'Root Fossil'
  },
  SAIL_FOSSIL: {
    eng: 'Sail Fossil',
    esp: 'Sail Fossil',
    fra: 'Sail Fossil'
  },
  SKULL_FOSSIL: {
    eng: 'Skull Fossil',
    esp: 'Skull Fossil',
    fra: 'Skull Fossil'
  },
  WHITE_GLASSES: {
    eng: 'Wise Glasses',
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
    eng: 'Amulet Coin',
    esp: 'Amuleto de monedas',
    fra: 'Piece Rune'
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
    eng: 'Dusk Stone',
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
    eng: 'Metal Coat',
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
    eng: 'Black Belt',
    esp: 'Cinturón negro',
    fra: 'Ceinture noire'
  },
  SILK_SCARF: {
    eng: 'Silk Scarf',
    esp: 'Bufanda de Seda',
    fra: 'Mouchoir Soie'
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
  },
  RAZOR_FANG: {
    eng: 'Razor Fang',
    esp: 'Colmillo de afeitar',
    fra: 'Croc Rasoir'
  },
  RAZOR_CLAW: {
    eng: 'Razor Claw',
    esp: 'Manijas rasoir',
    fra: 'Griffe Rasoir'
  },
  SCOPE_LENS: {
    eng: 'Scope Lens',
    esp: 'lente del visor',
    fra: 'Lentilscope'
  },
  REVIVER_SEED: {
    eng: 'Revival Herb',
    esp: 'Resugraina',
    fra: 'Herbe Rappel'
  },
  ASSAULT_VEST: {
    eng: 'Assault Vest',
    esp: 'Chaleco de asalto',
    fra: 'Veste de combat'
  },
  BLUE_ORB: {
    eng: 'Blue Orb',
    esp: 'Orbe azul',
    fra: 'Gemme Bleue'
  },
  RED_ORB: {
    eng: 'Red Orb',
    esp: 'Orbe rojo',
    fra: 'Gemme Rouge'
  },
  DELTA_ORB: {
    eng: 'Delta Orb',
    esp: 'Orbe Delta',
    fra: 'Gemme Delta'
  },
  WONDER_BOX: {
    eng: 'Wonder Box',
    esp: 'Caja de Maravillas',
    fra: 'Boite mystère'
  }
});

const ITEM_DESCRIPTION = Object.freeze({
  ARMOR_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Shieldon (Rare, 6 tours to evolve)',
    esp: 'Armor Fossil',
    fra: 'Armor Fossil'
  },
  CLAW_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into an Anorith (Uncommon, 4 tours to evolve)',
    esp: 'Claw Fossil',
    fra: 'Claw Fossil'
  },
  COVER_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Tirtouga (Rare, 6 tours to evolve)',
    esp: 'Cover Fossil',
    fra: 'Cover Fossil'
  },
  DOME_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Kabuto (Uncommon, 4 tours to evolve)',
    esp: 'Dome Fossil',
    fra: 'Dome Fossil'
  },
  HELIX_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Omanyte (Uncommon, 4 tours to evolve)',
    esp: 'Helix Fossil',
    fra: 'Helix Fossil'
  },
  JAW_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Tyrunt (Epic, 8 tours to evolve)',
    esp: 'Jaw Fossil',
    fra: 'Jaw Fossil'
  },
  OLD_AMBER: {
    eng: 'Give this to a Ditto to make it evolve into an Aerodactyl',
    esp: 'Old Amber',
    fra: 'Old Amber'
  },
  PLUME_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into an Archen (Rare, 6 tours to evolve)',
    esp: 'Plum Fossil',
    fra: 'Plum Fossil'
  },
  ROOT_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Lileep (Uncommon, 4 tours to evolve)',
    esp: 'Root Fossil',
    fra: 'Root Fossil'
  },
  SAIL_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into an Amaura (Epic, 8 tours to evolve)',
    esp: 'Sail Fossil',
    fra: 'Sail Fossil'
  },
  SKULL_FOSSIL: {
    eng: 'Give this to a Ditto to make it evolve into a Cranidos (Rare, 6 tours to evolve)',
    esp: 'Skull Fossil',
    fra: 'Skull Fossil'
  },
  WHITE_GLASSES:
  {
    eng: '+30% special attack',
    esp: '+30% de ataque especial',
    fra: '+30% attaque spéciale'
  },
  MUSCLE_BAND: {
    eng: '+30% attack',
    esp: '+30% de ataque',
    fra: '+30% attaque physique'
  },
  LIFE_ORB: {
    eng: '+100% damage, lose 5% HP per hit.',
    esp: '100% de daño, cuesta un 5% de vida por cada ataque',
    fra: '+100% attaque, blesse le pokémon de 5% hp/s'
  },
  COIN_AMULET: {
    eng: 'Earn 1-3 gold every round.',
    esp: 'Oportunidad de dejar caer entre 1 y 3 monedas de oro en cada ronda',
    fra: 'Chance de gagner entre 1 et 3 argent à chaque tour.'
  },
  ROCKY_HELMET: {
    eng: 'The attacker of the wearer takes 4% HP damage per physical hit.',
    esp: 'Cuando el usuario es atacado, el atacante recibe un 4% de daño máximo de salud.',
    fra: 'Quand le pokémon est attaqué, l attaquant subit 4% de vie en dommage physique'
  },
  SHELL_BELL: {
    eng: 'Restore 10% of the damage dealt.',
    esp: '10% de robo de vida en cada ataque',
    fra: '+10% vol de vie à chaque attaque'
  },
  BIG_ROOT: {
    eng: 'Restore 5% of your HP per hit.',
    esp: '+ 5% de salud / atacado restaurado',
    fra: '+ 5% vie / seconde'
  },
  APRICOT_BERRY: {
    eng: '+100% spe def when below 50% health',
    esp: '+100% de defensa cuando está por debajo del 50% de salud',
    fra: '+100% de défense spé quand la vie passe en dessous de 50%'
  },
  LIECHI_BERRY: {
    eng: '+100% attack when health below 50%',
    esp: '+100% de ataque cuando la salud está por debajo del 50%',
    fra: '+100% d attaque quand la vie passe en dessous de 50%'
  },
  GANLON_BERRY: {
    eng: '+100% def when health below 50%',
    esp: '+100% def cuando la salud está por debajo del 50%',
    fra: '+100% de défense quand la vie passe en dessous de 50%'
  },
  PETAYA_BERRY: {
    eng: '+100% attack special when health below 50%',
    esp: '+100% de ataque especial cuando la salud está por debajo del 50%',
    fra: '+100% d attaque spéciale quand la vie passe en dessous de 50%'
  },
  SALAC_BERRY: {
    eng: '+100% attack speed when health below 50%',
    esp: '+100% de velocidad de ataque cuando la salud está por debajo del 50%',
    fra: '+100% de vitesse d attaque quand la vie passe en dessous de 50%'
  },
  ORAN_BERRY: {
    eng: 'Restore 50% health when below 50% health',
    esp: 'Restaurar el 50% de la salud cuando está por debajo del 50% de la salud',
    fra: 'Restaure 50% de la vie quand la vie du pokémon descend en dessous de 50%'
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
    eng: '+10% atk speed. +50% damage if type grass. Will evolve Eevee into leafeon ',
    esp: '+10% a la velocidad de la tinta. +50% de daño si se trata de planta. Evolucionará Eevee en leafeon',
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
    fra: '+10% vitesse d attaque. +50% attaque si type normal.'
  },
  DAWN_STONE: {
    eng: '+10% atk speed. +50% damage if type psychic. Will evolve Eevee into Espeon.',
    esp: '+10% de velocidad de corte. +50% de daño si es del tipo psíquico. Evolucionará Eevee a Espeon.',
    fra: '+10% vitesse d attaque. +50% attaque si type psy. Fait évoluer Evoli en Mentali.'
  },
  ICY_ROCK: {
    eng: '10% chance to freeze. +50% damage if type ice. Will evolve Eevee into Glaceon.',
    esp: '10% de probabilidad de congelarse.+50% de daño si es del tipo hielo. Evolucionará Eevee a Glaceon',
    fra: '+10% vitesse d attaque. +50% attaque si type glace. Fait évoluer évoli en Givrali.'
  },
  RAZOR_FANG: {
    eng: '+50% Critical Hit damage.',
    esp: '+50% de daño por golpe crítico',
    fra: '+50% dégâts des coups critiques'
  },
  RAZOR_CLAW: {
    eng: 'Critical Hits ignore stat changes.',
    esp: 'Los golpes críticos hacen daño verdadero',
    fra: 'Les coups critiques font des true dégats'
  },
  SCOPE_LENS: {
    eng: '+50% Critical Hit chance.',
    esp: '+50% de golpes críticos',
    fra: '+50% de coups critiques'
  },
  REVIVER_SEED: {
    eng: 'Revives the pokemon',
    esp: 'Revive al pokémon',
    fra: 'Fait revivre le pokémon'
  },
  ASSAULT_VEST: {
    eng: '+50% special defense',
    esp: '+50% de defensa especial',
    fra: '+50% défense spécial'
  },
  BLUE_ORB: {
    eng: 'Team Aqua strengthens the pokemon s ability',
    esp: 'El equipo Aqua refuerza la habilidad del pokémon',
    fra: 'La team Aqua renforce la capacité du pokémon'
  },
  RED_ORB: {
    eng: 'Team Magma strengthens the pokemon s ability',
    esp: 'El equipo Magma refuerza la habilidad del pokémon',
    fra: 'La team Magma renforce la capacité du pokémon'
  },
  DELTA_ORB: {
    eng: 'Team Delta strengthens the pokemon s ability',
    esp: 'El equipo Delta refuerza la habilidad del pokémon',
    fra: 'La team Delta renforce la capacité du pokémon'
  },
  WONDER_BOX: {
    eng: 'Start the game with 2 random items',
    esp: 'Comienza el juego con 2 objetos al azar',
    fra: 'Commence la partie avec 2 items aléatoires'
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
  ICE: 'ICE',
  FOSSIL: 'FOSSIL'
});

const EFFECTS = Object.freeze({
  INGRAIN: 'INGRAIN',
  GROWTH: 'GROWTH',
  SPORE: 'SPORE',
  BLAZE: 'BLAZE',
  DROUGHT: 'DROUGHT',
  DESOLATE_LAND: 'DESOLATE_LAND',
  DRIZZLE: 'DRIZZLE',
  RAIN_DANCE: 'RAIN_DANCE',
  PRIMORDIAL_SEA: 'PRIMORDIAL_SEA',
  STAMINA: 'STAMINA',
  STRENGTH: 'STRENGTH',
  PURE_POWER: 'PURE_POWER',
  AGILITY: 'AGILITY',
  REVENGE: 'REVENGE',
  PUNISHMENT: 'PUNISHMENT',
  AMNESIA: 'AMNESIA',
  LIGHT_SCREEN: 'LIGHT_SCREEN',
  EERIE_SPELL: 'EERIE_SPELL',
  HONE_CLAWS: 'HONE_CLAWS',
  ASSURANCE: 'ASSURANCE',
  BEAT_UP: 'BEAT_UP',
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
  HYDRO_CANNON: 'HYDRO_CANNON',
  TAILWIND: 'TAILWIND',
  FEATHER_DANCE: 'FEATHER_DANCE',
  MAX_AIRSTREAM: 'MAX_AIRSTREAM',
  MAX_GUARD: 'MAX_GUARD',
  ODD_FLOWER: 'ODD_FLOWER',
  GLOOM_FLOWER: 'GLOOM_FLOWER',
  VILE_FLOWER: 'VILE_FLOWER',
  BATTLE_ARMOR: 'BATTLE_ARMOR',
  MOUTAIN_RESISTANCE: 'MOUTAIN_RESISTANCE',
  PHANTOM_FORCE: 'PHANTOM_FORCE',
  CURSE: 'CURSE',
  ATTRACT: 'ATTRACT',
  BABY_DOLL_EYES: 'BABY_DOLL_EYES',
  GROUND: 'GROUND',
  GRASS: 'GRASS',
  FIRE: 'FIRE',
  WATER: 'WATER',
  NORMAL: 'NORMAL',
  ICE: 'ICE',
  SNOW: 'SNOW',
  SHEER_COLD: 'SHEER_COLD',
  ANCIENT_POWER: 'ANCIENT_POWER',
  ELDER_POWER: 'ELDER_POWER',
  UNOWN_GATHERINGS: 'UNOWN_GATHERINGS'
});

const EFFECTS_ICON = Object.freeze({
  INGRAIN: {
    level: 1,
    positive: true,
    type: TYPE.GRASS
  },
  GROWTH: {
    level: 2,
    positive: true,
    type: TYPE.GRASS
  },
  SPORE: {
    level: 3,
    positive: true,
    type: TYPE.GRASS
  },
  BLAZE: {
    level: 1,
    positive: true,
    type: TYPE.FIRE
  },
  DROUGHT: {
    level: 2,
    positive: true,
    type: TYPE.FIRE
  },
  DESOLATE_LAND: {
    level: 3,
    positive: true,
    type: TYPE.FIRE
  },
  DRIZZLE: {
    level: 1,
    positive: true,
    type: TYPE.WATER
  },
  RAIN_DANCE: {
    level: 2,
    positive: true,
    type: TYPE.WATER
  },
  PRIMORDIAL_SEA: {
    level: 3,
    positive: true,
    type: TYPE.WATER
  },
  STAMINA: {
    level: 1,
    positive: true,
    type: TYPE.NORMAL
  },
  STRENGTH: {
    level: 2,
    positive: true,
    type: TYPE.NORMAL
  },
  PURE_POWER: {
    level: 3,
    positive: true,
    type: TYPE.NORMAL
  },
  AGILITY: {
    level: 1,
    positive: true,
    type: TYPE.ELECTRIC
  },
  REVENGE: {
    level: 1,
    positive: true,
    type: TYPE.FIGHTING
  },
  PUNISHMENT: {
    level: 2,
    positive: true,
    type: TYPE.FIGHTING
  },
  AMNESIA: {
    level: 1,
    positive: true,
    type: TYPE.PSYCHIC
  },
  LIGHT_SCREEN: {
    level: 2,
    positive: true,
    type: TYPE.PSYCHIC
  },
  EERIE_SPELL: {
    level: 3,
    positive: true,
    type: TYPE.PSYCHIC
  },
  HONE_CLAWS: {
    level: 1,
    positive: true,
    type: TYPE.DARK
  },
  ASSURANCE: {
    level: 2,
    positive: true,
    type: TYPE.DARK
  },
  BEAT_UP: {
    level: 3,
    positive: true,
    type: TYPE.DARK
  },
  IRON_DEFENSE: {
    level: 1,
    positive: true,
    type: TYPE.METAL
  },
  AUTOTOMIZE: {
    level: 2,
    positive: true,
    type: TYPE.METAL
  },
  SPIKES: {
    level: 1,
    positive: false,
    type: TYPE.GROUND
  },
  STEALTH_ROCK: {
    level: 2,
    positive: false,
    type: TYPE.GROUND
  },
  SANDSTORM: {
    level: 3,
    positive: false,
    type: TYPE.GROUND
  },
  POISON_GAS: {
    level: 1,
    positive: true,
    type: TYPE.POISON
  },
  TOXIC: {
    level: 2,
    positive: true,
    type: TYPE.POISON
  },
  INTIMIDATE: {
    level: 1,
    positive: false,
    type: TYPE.DRAGON
  },
  DRAGON_DANCE: {
    level: 2,
    positive: true,
    type: TYPE.DRAGON
  },
  WORK_UP: {
    level: 1,
    positive: true,
    type: TYPE.FIELD
  },
  RAGE: {
    level: 2,
    positive: true,
    type: TYPE.FIELD
  },
  ANGER_POINT: {
    level: 3,
    positive: true,
    type: TYPE.FIELD
  },
  PURSUIT: {
    level: 1,
    positive: true,
    type: TYPE.MONSTER
  },
  BRUTAL_SWING: {
    level: 2,
    positive: true,
    type: TYPE.MONSTER
  },
  POWER_TRIP: {
    level: 3,
    positive: true,
    type: TYPE.MONSTER
  },
  MEDITATE: {
    level: 1,
    positive: true,
    type: TYPE.HUMAN
  },
  FOCUS_ENERGY: {
    level: 2,
    positive: true,
    type: TYPE.HUMAN
  },
  CALM_MIND: {
    level: 3,
    positive: true,
    type: TYPE.HUMAN
  },
  SWARM: {
    level: 1,
    positive: true,
    type: TYPE.BUG
  },
  STICKY_WEB: {
    level: 2,
    positive: false,
    type: TYPE.BUG
  },
  SWIFT_SWIM: {
    level: 1,
    positive: true,
    type: TYPE.AQUATIC
  },
  HYDRO_CANNON: {
    level: 2,
    positive: true,
    type: TYPE.AQUATIC
  },
  TAILWIND: {
    level: 1,
    positive: true,
    type: TYPE.FLYING
  },
  FEATHER_DANCE: {
    level: 2,
    positive: true,
    type: TYPE.FLYING
  },
  MAX_AIRSTREAM: {
    level: 3,
    positive: true,
    type: TYPE.FLYING
  },
  MAX_GUARD: {
    level: 4,
    positive: true,
    type: TYPE.FLYING
  },
  ODD_FLOWER: {
    level: 1,
    positive: true,
    type: TYPE.FLORA
  },
  GLOOM_FLOWER: {
    level: 2,
    positive: true,
    type: TYPE.FLORA
  },
  VILE_FLOWER: {
    level: 3,
    positive: true,
    type: TYPE.FLORA
  },
  BATTLE_ARMOR: {
    level: 1,
    positive: true,
    type: TYPE.MINERAL
  },
  MOUTAIN_RESISTANCE: {
    level: 2,
    positive: true,
    type: TYPE.MINERAL
  },
  PHANTOM_FORCE: {
    level: 1,
    positive: true,
    type: TYPE.AMORPH
  },
  CURSE: {
    level: 2,
    positive: true,
    type: TYPE.AMORPH
  },
  ATTRACT: {
    level: 1,
    positive: true,
    type: TYPE.FAIRY
  },
  BABY_DOLL_EYES: {
    level: 2,
    positive: true,
    type: TYPE.FAIRY
  },
  GROUND: {
    level: 0,
    positive: true,
    type: TYPE.MINERAL
  },
  GRASS: {
    level: 0,
    positive: true,
    type: TYPE.GRASS
  },
  FIRE: {
    level: 0,
    positive: true,
    type: TYPE.FIRE
  },
  WATER: {
    level: 0,
    positive: true,
    type: TYPE.WATER
  },
  NORMAL: {
    level: 0,
    positive: true,
    type: TYPE.NORMAL
  },
  ICE: {
    level: 0,
    positive: true,
    type: TYPE.ICE
  },
  SNOW: {
    level: 1,
    positive: true,
    type: TYPE.ICE
  },
  SHEER_COLD: {
    level: 2,
    positive: true,
    type: TYPE.ICE
  },
  ANCIENT_POWER: {
    level: 1,
    positive: true,
    type: TYPE.FOSSIL
  },
  ELDER_POWER: {
    level: 2,
    positive: true,
    type: TYPE.FOSSIL
  },
  UNOWN_GATHERINGS: {
    level: 3,
    positive: true,
    type: TYPE.FOSSIL
  }
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
  CONFUSION: 'CONFUSION',
  ORIGIN_PULSE: 'ORIGIN_PULSE',
  SEED_FLARE: 'SEED_FLARE',
  HEAL_BLOCK: 'HEAL_BLOCK',
  ROAR_OF_TIME: 'ROAR_OF_TIME',
  ROCK_TOMB: 'ROCK_TOMB',
  ROCK_SMASH: 'ROCK_SMASH',
  HEAD_SMASH: 'HEAD_SMASH'
});

const SPECIAL_SKILL_DESCRIPTION = Object.freeze({
  DEFAULT: {
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
  BURN: {
    title: {
      eng: 'Burn',
      esp: 'Quemado',
      fra: 'Brulure'
    },
    description: {
      eng: 'Burn the whole team for 2/4/8 seconds, dealing 5% hp / seconds',
      esp: 'Quemar todo el equipo durante 2/4/8 segundos, repartiendo el 5% de hp/segundos',
      fra: 'Brule la cible pour 2/4/8 secondes, lui faisant perdre 5% hp/secondes'
    }
  },
  POISON: {
    title: {
      eng: 'Poison',
      esp: 'Veneno',
      fra: 'Poison'
    },
    description: {
      eng: 'Poison the target for 5/10/20 seconds, dealing 15% hp/seconds',
      esp: 'Envenenar el objetivo durante 5/10/20 segundos, repartiendo 15% hp/segundos',
      fra: 'Empoisonne la cible durant 5/10/20 secondes, faisant 15% hp/secondes'
    }
  },
  SLEEP: {
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
  SILENCE: {
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
  PROTECT: {
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
  FREEZE: {
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
  CONFUSION: {
    title: {
      eng: 'Confusion',
      esp: 'Confusión',
      fra: 'Confusion'
    },
    description: {
      eng: 'Makes the target confused for 1/2/4 seconds',
      esp: 'Hace que todo el equipo se confunda durante 1/2/4 segundos',
      fra: 'Rend toute la team ennemie confus pendant 1/ 2 4 secondes'
    }
  },
  FIRE_BLAST: {
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
  WHEEL_OF_FIRE: {
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
  SEISMIC_TOSS: {
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
  GUILLOTINE: {
    title: {
      eng: 'Guillotine',
      esp: 'Guillotina',
      fra: 'Guillotine'
    },
    description: {
      eng: 'Mono target attack that deals physical damage. Restores half mana if target killed',
      esp: 'Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere',
      fra: 'Attaque mono cible qui fait des dégats physiques. Restaure la moitié du mana si la cible est tué.'
    }
  },
  ROCK_SLIDE: {
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
  HEAT_WAVE: {
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
  THUNDER: {
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
  HYDRO_PUMP: {
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
  DRACO_METEOR: {
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
  BLAZE_KICK: {
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
  WISH: {
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
  CALM_MIND: {
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
  IRON_DEFENSE: {
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
  METRONOME: {
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
  SOAK: {
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
  ORIGIN_PULSE: {
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
  SEED_FLARE: {
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
  IRON_TAIL: {
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
  BLAST_BURN: {
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
  CHARGE: {
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
  DISCHARGE: {
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
  BITE: {
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
  DRAGON_TAIL: {
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
  DRAGON_BREATH: {
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
  ICICLE_CRASH: {
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
  ROOT: {
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
  TORMENT: {
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
  STOMP: {
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
  DARK_PULSE: {
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
  NIGHT_SLASH: {
    title: {
      eng: 'Night Slash',
      esp: 'Tajo nocturno',
      fra: 'Tranche Nuit'
    },
    description: {
      eng: 'Mono target special attack that does 40/60/80. Decreases all ennemies defense by 1 point.',
      esp: 'Ataque especial de objetivo mono que hace 40/60/80. Disminuye la defensa de todos los enemigos en 1 punto.',
      fra: 'Attaque spéciale faisant 40/60/80 points de dégats. Diminue la défense de toute la team ennemie de 1 point.'
    }
  },
  BUG_BUZZ: {
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
  POISON_STING: {
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
  LEECH_LIFE: {
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
  HAPPY_HOUR: {
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
  TELEPORT: {
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
  NASTY_PLOT: {
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
  THIEF: {
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
  STUN_SPORE: {
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
  METEOR_MASH: {
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
  HURRICANE: {
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
  HEAL_BLOCK: {
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
  ROAR_OF_TIME: {
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
  ROCK_TOMB: {
    title: {
      eng: 'Rock Tomb',
      esp: 'Rock Tomb',
      fra: 'Rock Tomb'
    },
    description: {
      eng: 'Mono target attack that deals 30/60/90 physical damage and decrease target attack speed by 300/600/900.',
      esp: 'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo',
      fra: 'Attaque AOE faisant 10/20/30 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  ROCK_SMASH: {
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
  HEAD_SMASH: {
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
    esp: 'Planta',
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
    esp: 'Lucha',
    fra: 'Combat'
  },
  PSYCHIC: {
    eng: 'Psychic',
    esp: 'Psiquico',
    fra: 'Psy'
  },
  DARK: {
    eng: 'Dark',
    esp: 'Siniestro',
    fra: 'Ténèbres'
  },
  METAL: {
    eng: 'Steel',
    esp: 'Acero',
    fra: 'Acier'
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
    fra: 'Terrestre'
  },
  MONSTER: {
    eng: 'Monster',
    esp: 'Monstruo',
    fra: 'Monstre'
  },
  HUMAN: {
    eng: 'Human',
    esp: 'Humanoide',
    fra: 'Humain'
  },
  AQUATIC: {
    eng: 'Aquatic',
    esp: 'Acuático',
    fra: 'Aquatique'
  },
  BUG: {
    eng: 'Bug',
    esp: 'Bicho',
    fra: 'Insecte'
  },
  FLYING: {
    eng: 'Flying',
    esp: 'Volador',
    fra: 'Vol'
  },
  FLORA: {
    eng: 'Flora',
    esp: 'Flor',
    fra: 'Fleur'
  },
  MINERAL: {
    eng: 'Mineral',
    esp: 'Roca',
    fra: 'Minéral'
  },
  AMORPH: {
    eng: 'Amorph',
    esp: 'Fantasma',
    fra: 'Fantome'
  },
  FAIRY: {
    eng: 'Fairy',
    esp: 'Hada',
    fra: 'Fée'
  },
  ICE: {
    eng: 'Ice',
    esp: 'Hielo',
    fra: 'Glace'
  },
  FOSSIL: {
    eng: 'Fossil',
    esp: 'Fossil',
    fra: 'Fossile'
  }
});

const RARITY = Object.freeze({
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHICAL: 'MYTHICAL',
  NEUTRAL: 'NEUTRAL',
  SUMMON: 'SUMMON'
});

const RARITY_HP_COST= Object.freeze({
  COMMON: 1,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 2,
  LEGENDARY: 3,
  MYTHICAL: 4,
  NEUTRAL: 2,
  SUMMON: 1
});

const COST = Object.freeze({
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  MYTHICAL: 6,
  LEGENDARY: 5,
  SUMMON: 0
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
  FIGHT: 'Fight',
  PICK: 'Pick'
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
  DOWN: 'DOWN',
  UNCLEAR: 'UNCLEAR'
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
  GROUND: 'GROUND'
});

const MAP_TYPE_NAME = Object.freeze({
  WATER: {
    'eng': 'Stormy Sea',
    'esp': 'Mar Tormentoso',
    'fra': 'Mer Houleuse'
  },
  NORMAL: {
    'eng': 'Tiny Woods',
    'esp': 'Arboleda Chica',
    'fra': 'Petit Bois'
  },
  FIRE: {
    'eng': 'Magma Cavern',
    'esp': 'Caverna Magma',
    'fra': 'Mine  Magma'
  },
  GRASS: {
    'eng': 'Hidden Highland',
    'esp': 'Tierra Oculta',
    'fra': 'Terres Illusoires'
  },
  ICE: {
    'eng': 'Frosty Forest',
    'esp': 'Bosque Helado',
    'fra': 'Forêt Givrée'
  },
  GROUND: {
    'eng': 'Shimmer Desert',
    'esp': 'Desierto Trémulo',
    'fra': 'Désert Chatoyant'
  }
});

const MAP_TYPE_NAME_DESCRIPTION = Object.freeze({
  WATER: {
    'eng': '+20% SPE DEF for pokemons placed on puddle.',
    'esp': '+20% SPE DEF para los pokemons colocados en el puddle.',
    'fra': '+20% SPE DEF pour les pokémons placés sur un puddle.'
  },
  NORMAL: {
    'eng': '+20% HP for pokemons placed on puddle.',
    'esp': '+20% HP para los pokemons colocados en el puddle.',
    'fra': '+20% HP pour les pokémons placés sur un puddle.'
  },
  FIRE: {
    'eng': '+20% ATK for pokemons placed on puddle.',
    'esp': '+20% ATK para los pokemons colocados en el puddle.',
    'fra': '+20% ATK pour les pokémons placés sur un puddle.'
  },
  GRASS: {
    'eng': '+5% HP regeneration if placed on puddle.',
    'esp': '+5% de regeneración de HP si se coloca en el puddle.',
    'fra': '+5% de régénération des HP si placé sur un puddle.'
  },
  ICE: {
    'eng': '+10% ATK SPEED for pokemons placed on puddle.',
    'esp': '+10% ATK SPEED para los pokemons colocados en el puddle.',
    'fra': '+10% ATK SPEED pour les pokémons placés sur un puddle.'
  },
  GROUND: {
    'eng': '+20% DEF for pokemons placed on puddle.',
    'esp': '+20% DEF para los pokemons colocados en el puddle.',
    'fra': '+20% DEF pour les pokémons placés sur un puddle.'
  }
});

const TYPE_DETAILS = Object.freeze({
  NORMAL: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Stamina`,
          text: `All allies adjacent to your Normal pokemon have +20 HP.`
        },
        {
          trigger: 6,
          title: `(6) Strength`,
          text: `All allies adjacent to your Normal pokemon have +50 HP.`
        },
        {
          trigger: 9,
          title: `(9) Pure power`,
          text: `All allies adjacent to your Normal pokemon have +100 HP.`
        }
      ],
      esp: [
        {
          title: `(3) Resistencia`,
          text: `+20 HP por cada pokemon que esté cerca`
        },
        {
          title: `(6) Fuerza`,
          text: `+30 HP por cada pokemon que esté cerca`
        },
        {
          title: `(9) Poder Puro`,
          text: `+50 HP por cada pokemon que esté cerca`
        }
      ],
      fra: [
        {
          title: `(3) Force`,
          text: `+20 HP pour tous les pokémons autours`
        },
        {
          title: `(6) Stockage`,
          text: `+30 HP pour tous les pokémons autours`
        },
        {
          title: `(9) Concentration`,
          text: `+50 HP pour tous les pokémons autours`
        }
      ]
    }
  },
  GRASS: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Ingrain`,
          text: `Grass allies restore 5% HP per second`
        },
        {
          trigger: 5,
          title: `(5) Growth`,
          text: `Grass allies restore 10% extra HP per second`
        },
        {
          trigger: 7,
          title: `(7) Tree of life`,
          text: `Grass allies restore 15% extra HP per second`
        }
      ],
      esp: [
        {
          title: `(3) Ingrediente`,
          text: `+5% HP/s para los tipos de Planta`
        },
        {
          title: `(5) Crecimiento`,
          text: `+10% HP/s para los tipos de Planta`
        },
        {
          title: `(7) Espora aturdidora`,
          text: `Los ennemigos que no son de Planta tienen un 30% ATK speed`
        }
      ],
      fra: [
        {
          title: `(3) Racine`,
          text: `+5% HP/s pour tous les alliés plante`
        },
        {
          title: `(5) Croissance`,
          text: `+10% HP/s pour tous les alliés plante`
        },
        {
          title: `(7) Para Spore`,
          text: `-30% ATK speed pour tous les ennemis`
        }
      ]
    }
  },
  FIRE: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Blaze`,
          text: `Your Fire pokemon gain +1 Attack after every hit.`
        },
        {
          trigger: 4,
          title: `(4) Drought`,
          text: `Your Fire pokemon gain +2 Attack after every hit. (Sunlight)`
        },
        {
          trigger: 6,
          title: `(6) Desolate Land`,
          text: `Your Fire pokemon gain +3 Attack after every hit. (Harsh Sunlight)`
        }
      ],
      esp: [
        {
          trigger: 3,
          title: `(3) Blaze`,
          text: `Fire pkm gana un 5% de dano en cada ataque`
        },
        {
          trigger: 6,
          title: `(6) Sequia`,
          text: `El so se intensifica, los pkm de fuego gana +50% ATK`
        }
      ],
      fra: [
        {
          title: `(3) Torche`,
          text: `Les pkm feu gagnent 5% d'ATK à chaque attaque`
        },
        {
          title: `(6) Zénith`,
          text: `Le soleil s'intensifie, augmentant l'ATK des pkm feu de 50%`
        }
      ]
    }
  },
  WATER: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Rain dance`,
          text: `Your Water pokemon have +30% Attack. (Rain)`
        },
        {
          trigger: 6,
          title: `(6) Drizzle`,
          text: `Your Water pokemon have +60% more Attack. (Rain)`
        },
        {
          trigger: 8,
          title: `(8) Primordial sea`,
          text: `Summon Kyogre, the king of the oceans. (Rain)`
        }
      ],
      esp: [
        {
          title: `(3) Danza de la lluvia`,
          text: `Cae la lluvia, 30% de ATK para los aliados del agua`
        },
        {
          title: `(6) Crachin`,
          text: `La lluvia es cada vez más intensa, un 30% más de ATK.`
        },
        {
          title: `(9) Mar Primordial`,
          text: `Invoca a Kyogre, el rey de los océanos`
        }
      ],
      fra: [
        {
          title: `(3) Danse pluie`,
          text: `La pluie tombe, 30% d'ATK pour les alliés eau`
        },
        {
          title: `(6) Crachin`,
          text: `La pluie s'intensifie, 30% d'ATK en plus`
        },
        {
          title: `(9) Mer primordiale`,
          text: `Invoque Kyogre, le roi des océans`
        }
      ]
    }
  },
  ELECTRIC: {
    description: {
      eng: [
        {
          trigger: 1,
          title: `(-) Charge`,
          text: `Your Electric pokemon have +10% speed. (stacks)`
        }
      ],
      esp: [
        {
          title: `(-) Agilidad`,
          text: `+10% de velocidad ATK por cada aliado eléctrico del equipo`
        }
      ],
      fra: [
        {
          title: `(-) Agilité`,
          text: `+10% ATK speed pour chaque allié elec dans l'équipe`
        }
      ]
    }
  },
  FIGHTING: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Revenge`,
          text: `+5 Mana per hit.`
        },
        {
          trigger: 4,
          title: `(4) Punishment`,
          text: `+15 extra Mana per hit.`
        }
      ],
      esp: [
        {
          title: `(2) Venganza`,
          text: `+5 maná/ataque para todos los pkm`
        },
        {
          title: `(4) Castigo`,
          text: `+10 maná/ataque para todos los pkm`
        }
      ],
      fra: [
        {
          title: `(2) Vengeance`,
          text: `+5 mana / attaque pour tous les pkm`
        },
        {
          title: `(4) Punition`,
          text: `+10 mana / attaque pour tous les pkm`
        }
      ]
    }
  },
  PSYCHIC: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Amnesia`,
          text: `All your pokemon have +5 Special Defense.`
        },
        {
          trigger: 4,
          title: `(4) Light Screen`,
          text: `All your pokemon have +15 Special Defense.`
        },
        {
          trigger: 6,
          title: `(6) Eerie Spell`,
          text: `All your pokemon have +35 Special Defense.`
        }
      ],
      esp: [
        {
          title: `(2) Amnesia`,
          text: `Ally gana +5 SPEDEF`
        },
        {
          title: `(4) Pantalla de luz`,
          text: `Ally gana +10 SPEDEF adicionales`
        },
        {
          title: `(6) Hechizo espeluznante`,
          text: `Ally gana +20 SPEDEF adicionales`
        }
      ],
      fra: [
        {
          title: `(2) Amnésie`,
          text: `Les alliés gagnent +5 SPEDEF`
        },
        {
          title: `(4) Mur lumière`,
          text: `Les alliés gagnent un additionel +10 SPEDEF`
        },
        {
          title: `(6) Sort Sinistre`,
          text: `Les alliés gagnent un additionel +20 SPEDEF`
        }
      ]
    }
  },
  DARK: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Hone Claws`,
          text: `Dark pokemons gains +4 damage/+20 shield for each held items`
        },
        {
          trigger: 4,
          title: `(4) Assurance`,
          text: `Dark pokemons gains +7 damage/+30 shield for each held items`
        },
        {
          trigger: 6,
          title: `(6) Beat up`,
          text: `Dark pokemons gains +10 damage/+50 shield for each held items`
        }
      ],
      esp: [
        {
          trigger: 2,
          title: `(2) Hone Claws`,
          text: `Dark pokemons gains +4 attack/+20 shield for each held items`
        },
        {
          trigger: 4,
          title: `(4) Assurance`,
          text: `Dark pokemons gains +7 attack/+30 shield for each held items`
        },
        {
          trigger: 6,
          title: `(6) Beat up`,
          text: `Dark pokemons gains +10 attack/+50 shield for each held items`
        }
      ],
      fra: [
        {
          trigger: 2,
          title: `(2) Hone Claws`,
          text: `Dark pokemons gains +4 attack/+20 shield for each held items`
        },
        {
          trigger: 4,
          title: `(4) Assurance`,
          text: `Dark pokemons gains +7 attack/+30 shield for each held items`
        },
        {
          trigger: 6,
          title: `(6) Beat up`,
          text: `Dark pokemons gains +10 attack/+50 shield for each held items`
        }
      ]
    }
  },
  METAL: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Steel wall`,
          text: `Your Steel pokemon have +50% Defense.`
        },
        {
          trigger: 4,
          title: `(4) Lightening`,
          text: `Your Steel pokemon have +100% Speed.`
        }
      ],
      esp: [
        {
          title: `(2) Muro de acero`,
          text: `+50% DEF para pkm de acero`
        },
        {
          title: `(4) Rayo`,
          text: `+100% de velocidad ATK para pkm de acero`
        }
      ],
      fra: [
        {
          title: `(2) Mur d'acier`,
          text: `+50% DEF pour les pkm acier`
        },
        {
          title: `(4) Allègement`,
          text: `+100% ATK speed pour les pkm acier`
        }
      ]
    }
  },
  GROUND: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Spikes`,
          text: `Enemies lose 10% HP when entering the battle.`
        },
        {
          trigger: 4,
          title: `(4) Stealth Rock`,
          text: `Enemies lose 10% more HP when entering the battle.`
        },
        {
          trigger: 6,
          title: `(6) Sandstorm`,
          text: `All ennemies lose 10% HP per second.`
        }
      ],
      esp: [
        {
          title: `(2) Picotas`,
          text: `-10% de HP para los enemigos al comienzo del combate`
        },
        {
          title: `(4) Trampa de rocas`,
          text: `-10% de HP para los enemigos al comienzo del combate`
        },
        {
          title: `(6) Tormenta de arena`,
          text: `Se desata una tormenta de arena que produce un 10% de HP/s por pkm de tierra/acero/mineral`
        }
      ],
      fra: [
        {
          title: `(2) Picots`,
          text: `-10% HP pour les ennemis au début du combat`
        },
        {
          title: `(4) Piège de roc`,
          text: `-10% HP pour les ennemis au début du combat`
        },
        {
          title: `(6) Tempête de sable`,
          text: `Une tempête de sable fait rage, faisant 10% HP/s aux pkm non sol/acier/mineral`
        }
      ]
    }
  },
  POISON: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Toxik Gas`,
          text: `Your Poison pokemon have a 20% chance to poison the target for 2 seconds. (15% HP per second)`
        },
        {
          trigger: 6,
          title: `(6) Toxik`,
          text: `Your Poison pokemon have an extra 30% chance to poison the target for 2 seconds. (15% HP per second)`
        }
      ],
      esp: [
        {
          title: `(3) Toxik gas`,
          text: `+20% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
        },
        {
          title: `(6) Fuerza`,
          text: `+30% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
        }
      ],
      fra: [
        {
          title: `(3) Gaz Toxik`,
          text: `+20% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
        },
        {
          title: `(6) Toxik`,
          text: `+30% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
        }
      ]
    }
  },
  DRAGON: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Bullying`,
          text: `Enemies have -30% Attack.`
        },
        {
          trigger: 4,
          title: `(4) Dragon Dance`,
          text: `Your Dragon pokemon gain +5 Speed after every hit.`
        }
      ],
      esp: [
        {
          title: `(2) Intimidación`,
          text: `-30% ATK para el equipo enemigo`
        },
        {
          title: `(4) Fuerza`,
          text: `+5% velocidad de ataque para dragones pkm en cada ataque`
        }
      ],
      fra: [
        {
          title: `(2) Intimidation`,
          text: `-30% ATK pour l'équipe ennemie`
        },
        {
          title: `(4) Danse Draco`,
          text: `+5% vitesse d'attaque pour les pkm dragons à chaque attaque`
        }
      ]
    }
  },
  FIELD: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Bulk up`,
          text: `Your pokemon on the same column have +2 Attack.`
        },
        {
          trigger: 6,
          title: `(6) Rage`,
          text: `Your pokemon on the same column have +6 Attack.`
        },
        {
          trigger: 9,
          title: `(9) Sword Dance`,
          text: `Your pokemon on the same column have +14 Attack.`
        }
      ],
      esp: [
        {
          title: `(3) Gonflette`,
          text: `+2 ATK para pokemons en la misma columna`
        },
        {
          title: `(6) Furia`,
          text: `+4 ATK para pokemons en la misma columna`
        },
        {
          title: `(9) Cuchillas de baile`,
          text: `+8 ATK para pokemons en la misma columna`
        }
      ],
      fra: [
        {
          title: `(3) Gonflette`,
          text: `+2 ATK pour les pokémons sur la même colonne`
        },
        {
          title: `(6) Rage`,
          text: `+4 ATK pour les pokémons sur la même colonne`
        },
        {
          title: `(9) Danse Lames`,
          text: `+8 ATK pour les pokémons sur la même colonne`
        }
      ]
    }
  },
  MONSTER: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Pursuit`,
          text: `Enemies below 30% HP faint in one hit.`
        },
        {
          trigger: 5,
          title: `(5) Pride`,
          text: `After causing an enemy to faint, restore to full health.`
        },
        {
          trigger: 7,
          title: `(7) Moxie`,
          text: `After causing an enemy to faint, gain +100% Attack.`
        }
      ],
      esp: [
        {
          title: `(3) Persecución`,
          text: `Los enemigos se ejecutan por debajo del 30% de HP`
        },
        {
          title: `(5) La arrogancia`,
          text: `Cada muerte devuelve la vida al pkm`
        },
        {
          title: `(7) Berserk`,
          text: `Cada muerte aumenta el ATK del pkm en un 100%`
        }
      ],
      fra: [
        {
          title: `(3) Poursuite`,
          text: `Les ennemis sont éxécutés en dessous de 30% HP`
        },
        {
          title: `(5) Arrogance`,
          text: `Chaque kill restaure la vie du pkm`
        },
        {
          title: `(7) Berserk`,
          text: `Chaque kill augmente l'ATK du pkm de 100%`
        }
      ]
    }
  },
  HUMAN: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Meditation`,
          text: `Your pokemon have +15% Attack and HP.`
        },
        {
          trigger: 4,
          title: `(4) Power`,
          text: `Your pokemon have +35% Attack and HP.`
        },
        {
          trigger: 6,
          title: `(6) Calm Mind`,
          text: `Your pokemon have +65% Attack and HP.`
        }
      ],
      esp: [
        {
          title: `(2) Meditación`,
          text: `+15% de ATK y +15% HP para todos los pokemones`
        },
        {
          title: `(4) Poder`,
          text: `+20% de ATK y +20% HP para todos los pokemones`
        },
        {
          title: `(6) Plenitud`,
          text: `+30% de ATK y +30% HP para todos los pokemones`
        }
      ],
      fra: [
        {
          title: `(2) Méditation`,
          text: `+15% ATK et +15% HP pour tous les pkm`
        },
        {
          title: `(4) Puissance`,
          text: `+20% ATK et +20% HP pour tous les pkm`
        },
        {
          title: `(6) Plénitude`,
          text: `+30% ATK et +30% HP pour tous les pkm`
        }
      ]
    }
  },
  AQUATIC: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Swift swim`,
          text: `Revive aquatic pokemons at first death with 40% health and 30% increased damage.`
        },
        {
          trigger: 4,
          title: `(4) Hydro pump`,
          text: `Revive aquatic pokemons at first death with 80% health and 60% increased damage.`
        }
      ],
      esp: [
        {
          title: `(3) Resbalón`,
          text: `+30% de velocidad ATK por pkm de agua`
        },
        {
          title: `(6) Cañón hidráulico`,
          text: `+30% ATK para pkm acuáticos`
        }
      ],
      fra: [
        {
          title: `(3) Glissade`,
          text: `+30% ATK speed pour les pkm aquatiques`
        },
        {
          title: `(6) Hydro cannon`,
          text: `+30% ATK pour les pkm aquatiques`
        }
      ]
    }
  },
  BUG: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Swarm`,
          text: `Your Bug pokemon evolve faster. (2 instead of 3)`
        },
        {
          trigger: 4,
          title: `(4) Sticky web`,
          text: `Enemies have -33% Speed.`
        }
      ],
      esp: [
        {
          title: `(2) Essaim`,
          text: `Se necesitan 2 pkm para evolucionar (en lugar de 3)`
        },
        {
          title: `(4) Web pegajosa`,
          text: `-33% de velocidad ATK para el equipo enemigo`
        }
      ],
      fra: [
        {
          title: `(2) Essaim`,
          text: `2 pkm nécessaires pour évoluer (au lieu de 3)`
        },
        {
          title: `(4) Toile gluante`,
          text: `-33% ATK speed pour l'équipe ennemie`
        }
      ]
    }
  },
  FLYING: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Tailwind`,
          text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
        },
        {
          trigger: 4,
          title: `(4) Feather Dance`,
          text: `Give a protection effect for 2sec when the pokemon fell under 40% hp`
        },
        {
          trigger: 6,
          title: `(6) Max Airstream`,
          text: `Give a protection effect for 3sec when the pokemon fell under 50% hp`
        },
        {
          trigger: 8,
          title: `(8) Max Guard`,
          text: `Give a protection effect for 4sec when the pokemon fell under 50% hp`
        }
      ],
      esp: [
        {
          trigger: 2,
          title: `(2) Tailwind`,
          text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
        },
        {
          trigger: 4,
          title: `(4) Feather Dance`,
          text: `Give a protection effect for 1sec when the pokemon fell under 40% hp`
        },
        {
          trigger: 6,
          title: `(6) Max Airstream`,
          text: `Give a protection effect for 2sec when the pokemon fell under 50% hp`
        },
        {
          trigger: 8,
          title: `(8) Max Guard`,
          text: `Add a second protection effect at 30%`
        }
      ],
      fra: [
        {
          trigger: 2,
          title: `(2) Tailwind`,
          text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
        },
        {
          trigger: 4,
          title: `(4) Feather Dance`,
          text: `Give a protection effect for 1sec when the pokemon fell under 40% hp`
        },
        {
          trigger: 6,
          title: `(6) Max Airstream`,
          text: `Give a protection effect for 2sec when the pokemon fell under 50% hp`
        },
        {
          trigger: 8,
          title: `(8) Max Guard`,
          text: `Add a second protection effect at 30%`
        }
      ]
    }
  },
  FLORA: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Odd Flower`,
          text: `When an flora ally is dead, the oddish flower will rise from its grave..`
        },
        {
          trigger: 3,
          title: `(3) Gloom Flower`,
          text: `When an flora ally is dead, the gloom flower will rise from its grave..`
        },
        {
          trigger: 4,
          title: `(4) Vile Flower`,
          text: `When an flora ally is dead, the vile flower will rise from its grave..`
        }
      ],
      esp: [
        {
          title: `(2) Lavamanos`,
          text: `Restaurar un 10% de HP/s si llueve`
        },
        {
          title: `(4) Escudo floral`,
          text: `Aumentar el ATK y la DEF en un 10%`
        }
      ],
      fra: [
        {
          title: `(2) Lavabo`,
          text: `Restaure 10% HP/s si il pleut`
        },
        {
          title: `(4) Bouclier floral`,
          text: `+50% DEF et +50%SPEDEF pour tous les pkm`
        }
      ]
    }
  },
  MINERAL: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Harden`,
          text: `Your Mineral pokemon have +50% Defense.`
        },
        {
          trigger: 4,
          title: `(4) Solid Rock`,
          text: `Your Mineral pokemon have +50% Defense and +100% HP.`
        }
      ],
      esp: [
        {
          title: `(2) Bola de Armadura`,
          text: `30% de CV de bonficacion para todos los aliados normales`
        },
        {
          title: `(4) Montañés`,
          text: `+50% SPEDEF y +100% HP por pkm mineral`
        }
      ],
      fra: [
        {
          title: `(2) Boul' Armure`,
          text: `+50% DEF pour les pkm minéraux`
        },
        {
          title: `(4) Montagnard`,
          text: `+50% SPEDEF et +100% HP pour les pkm minéraux`
        }
      ]
    }
  },
  AMORPH: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Phantom force`,
          text: `Your Amorphous pokemon have +15% Speed and ignore stat changes.`
        },
        {
          trigger: 4,
          title: `(4) Curse`,
          text: `Hits from your Amorphous pokemon prevent the target from filling up their Mana.`
        }
      ],
      esp: [
        {
          title: `(2) Fuerza fantasma`,
          text: `Los fantasmas ganan un 15% de velocidad ATK y hacen daño verdadero`
        },
        {
          title: `(4) Maldición`,
          text: `Los ataques fantasma silencian sus objetivos`
        }
      ],
      fra: [
        {
          title: `(2) Revenant`,
          text: `Les fantômes gagnent 15% d'ATK speed et font des dégats bruts`
        },
        {
          title: `(4) Malédiction`,
          text: `Les attaques des fantomes réduisent aux silences leurs cibles`
        }
      ]
    }
  },
  FAIRY: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Sing`,
          text: `Your Fairy pokemon put their front opponent to sleep for 2 seconds.`
        },
        {
          trigger: 4,
          title: `(4) Jigglypuff Microphone`,
          text: `Your Fairy pokemon put their front opponent to sleep for 4 seconds.`
        }
      ],
      esp: [
        {
          title: `(2) Canción de cuna`,
          text: `Los pokemons hada duermen a su oponente en el espejo durante 2 segundos`
        },
        {
          title: `(4) Jigglypuff Micrófono`,
          text: `Los pokemons hada duermen a su oponente en el espejo durante 4 segundos`
        }
      ],
      fra: [
        {
          title: `(2) Berceuse`,
          text: `Les pokémons fées endorment leur adversaire miroir pendant 2 secondes.`
        },
        {
          title: `(4) Micro de Rondoudou`,
          text: `Les pokémons fées endorment leur adversaire miroir pendant 4 secondes.`
        }
      ]
    }
  },
  ICE: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Snow alert`,
          text: `Your Ice pokemon have a 10% chance to freeze an enemy for 2 seconds after a hit.`
        },
        {
          trigger: 4,
          title: `(4) Sheer cold`,
          text: `Your Ice pokemon have a 30% chance to freeze an enemy for 2 seconds after a hit.`
        }
      ],
      esp: [
        {
          title: `(2) Alerta de nieve`,
          text: `+10% de probabilidad de congelar al enemigo durante un ataque`
        },
        {
          title: `(4) Frío Polar`,
          text: `+30% de probabilidad de congelar al enemigo durante un ataque`
        }
      ],
      fra: [
        {
          title: `(2) Alerte neige`,
          text: `+10% de chance de geler l'ennemi lors d'une attaque`
        },
        {
          title: `(4) Glaciation`,
          text: `+30% de chance de geler l'ennemi lors d'une attaque`
        }
      ]
    }
  },
  FOSSIL: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Ancient Power`,
          text: `+40% Crit Chance and +80% Crit Damage`
        }, {
          trigger: 4,
          title: `(4) Elder Power`,
          text: `+70% Crit Chance and +140% Crit Damage`
        }, {
          trigger: 6,
          title: `(6) Unown Gatherings`,
          text: `+100% Crit Chance and +250% Crit Damage`
        }
      ],
      esp: [
        {
          trigger: 2,
          title: `(2) Historic Power`,
          text: `+10% Crit Chance and +20% Crit Damage.`
        }, {
          trigger: 4,
          title: `(4) Ancient Power`,
          text: `+30% Crit Chance and +40% Crit Damage`
        }, {
          trigger: 6,
          title: `(6) Elder Power`,
          text: `+50% Crit Chance and +60% Crit Damage`
        }, {
          trigger: 8,
          title: `(8) Unown Gatherings`,
          text: `+80% Crit Chance and +100% Crit Damage`
        }
      ],
      fra: [
        {
          trigger: 2,
          title: `(2) Historic Power`,
          text: `+10% Crit Chance and +20% Crit Damage.`
        }, {
          trigger: 4,
          title: `(4) Ancient Power`,
          text: `+30% Crit Chance and +40% Crit Damage`
        }, {
          trigger: 6,
          title: `(6) Elder Power`,
          text: `+50% Crit Chance and +60% Crit Damage`
        }, {
          trigger: 8,
          title: `(8) Unown Gatherings`,
          text: `+80% Crit Chance and +100% Crit Damage`
        }
      ]
    }
  }
});

const TYPE_TRIGGER = {
  NORMAL: [3, 6, 9],
  GRASS: [3, 5, 7],
  FIRE: [2, 4, 6],
  WATER: [3, 6, 8],
  ELECTRIC: [1],
  FIGHTING: [2, 4],
  PSYCHIC: [2, 4, 6],
  DARK: [2, 4, 6],
  METAL: [2, 4],
  GROUND: [2, 4, 6],
  POISON: [3, 6],
  DRAGON: [2, 4],
  FIELD: [3, 6, 9],
  MONSTER: [3, 5, 7],
  HUMAN: [2, 4, 6],
  AQUATIC: [2, 4],
  BUG: [2, 4],
  FLYING: [2, 4, 6, 8],
  FLORA: [2, 3, 4],
  MINERAL: [2, 4],
  AMORPH: [2, 4],
  FAIRY: [2, 4],
  ICE: [2, 4],
  FOSSIL: [2, 4, 6]
};

const XP_TABLE = [1000, 1500, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000];

const XP_PLACE = [700, 500, 400, 300, 200, 150, 100, 0];

const RARITY_COLOR = Object.freeze({
  COMMON: '#686d7d',
  NEUTRAL: '#686d7d',
  UNCOMMON: '#478a41',
  RARE: '#5062ab',
  EPIC: '#7b469c',
  LEGENDARY: '#a6802e',
  MYTHICAL: '#ffc0cb',
  SUMMON: '#991f1f'
});

const PROBABILITY = {
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

const PRECOMPUTED_TYPE_POKEMONS_ALL = {
  NORMAL: [
    'ditto', 'cleffa', 'clefairy',
    'clefable', 'igglybuff', 'wygglytuff',
    'jigglypuff', 'pidgey', 'pidgeotto',
    'pidgeot', 'starly', 'staravia',
    'staraptor', 'togepi', 'togetic',
    'togekiss', 'slakoth', 'vigoroth',
    'slaking', 'scyther', 'rattata',
    'raticate', 'spearow', 'fearow',
    'regigigas', 'eevee', 'meditite',
    'medicham', 'mega-medicham', 'arceus'
  ],
  GRASS: [
    'bulbasaur', 'ivysaur', 'venusaur',
    'caterpie', 'metapod', 'butterfree',
    'hoppip', 'skiploom', 'jumpluff',
    'seedot', 'nuzleaf', 'shiftry',
    'chikorita', 'bayleef', 'meganium',
    'treecko', 'grovyle', 'sceptile',
    'turtwig', 'grotle', 'torterra',
    'lotad', 'lombre', 'ludicolo',
    'leafeon', 'bellsprout', 'weepinbell',
    'victreebel', 'snover', 'abomasnow',
    'mega-abomasnow', 'virizion', 'celebi',
    'shaymin', 'oddish', 'gloom',
    'vileplume', 'bellossom', 'cradily',
    'lileep'
  ],
  FIRE: [
    'charmander', 'charmeleon', 'charizard',
    'cyndaquil', 'quilava', 'typlosion',
    'torchic', 'combusken', 'blaziken',
    'chimchar', 'monferno', 'infernape',
    'magby', 'magmar', 'magmortar',
    'moltres', 'entei', 'groudon',
    'flareon', 'numel', 'camerupt',
    'mega-camerupt', 'litwick', 'lampent',
    'chandelure', 'houndour', 'volcarona',
    'reshiram', 'victini', 'heatran',
    'ho-Oh', 'primal-Groudon'
  ],
  WATER: [
    'squirtle', 'wartortle', 'blastoise',
    'azurill', 'marill', 'azumarill',
    'mudkip', 'marshtomp', 'swampert',
    'piplup', 'prinplup', 'empoleon',
    'horsea', 'seadra', 'kingdra',
    'lotad', 'lombre', 'ludicolo',
    'poliwag', 'poliwhirl', 'politoed',
    'magikarp', 'gyarados', 'palkia',
    'suicune', 'kyogre', 'vaporeon',
    'carvanha', 'keldeo', 'manaphy',
    'lapras', 'primal-Kyogre', 'carracosta',
    'kabuto', 'kabutops', 'omanyte',
    'omastar', 'tirtouga'
  ],
  ELECTRIC: [
    'mareep', 'flaffy',
    'ampharos', 'pichu',
    'pikachu', 'raichu',
    'magnemite', 'magneton',
    'magnezone', 'shinx',
    'luxio', 'luxray',
    'elekid', 'electabuzz',
    'electivire', 'zapdos',
    'raikou', 'jolteon',
    'thundurus', 'rotom',
    'zekrom', 'primal-Kyogre'
  ],
  FIGHTING: [
    'combusken', 'blaziken',
    'monferno', 'infernape',
    'machop', 'machoke',
    'machamp', 'poliwag',
    'poliwhirl', 'politoed',
    'riolu', 'lucario',
    'mega-lucario', 'meditite',
    'medicham', 'mega-medicham',
    'keldeo', 'terrakion',
    'virizion', 'cobalion'
  ],
  PSYCHIC: [
    'abra', 'kadabra', 'alakazam',
    'ralts', 'kirlia', 'gardevoir',
    'beldum', 'metang', 'metagross',
    'lugia', 'espeon', 'slowpoke',
    'slowbro', 'slowking', 'latias',
    'latios', 'mesprit', 'azelf',
    'uxie', 'mewtwo', 'celebi',
    'victini', 'jirachi', 'deoxys',
    'cresselia', 'solosis', 'duosion',
    'reuniclus'
  ],
  DARK: [
    'seedot', 'nuzleaf',
    'shiftry', 'duskull',
    'dusclops', 'dusknoir',
    'larvitar', 'pupitar',
    'tyranitar', 'umbreon',
    'darkrai', 'carvanha',
    'houndour', 'spiritomb',
    'absol', 'deino',
    'zweilous', 'hydreigon',
    'sandile', 'krokorok',
    'krookodile'
  ],
  METAL: [
    'prinplup', 'empoleon',
    'aron', 'lairon',
    'aggron', 'magnemite',
    'magneton', 'magnezone',
    'beldum', 'metang',
    'metagross', 'steelix',
    'mega-steelix', 'scizor',
    'mega-scizor', 'lucario',
    'mega-lucario', 'dialga',
    'registeel', 'cobalion',
    'jirachi', 'heatran',
    'bastiodon', 'shieldon'
  ],
  GROUND: [
    'geodude', 'graveler', 'golem',
    'mudkip', 'marshtomp', 'swampert',
    'turtwig', 'grotle', 'torterra',
    'trapinch', 'vibrava', 'flygon',
    'rhyhorn', 'rhydon', 'rhyperior',
    'gible', 'gabite', 'garchomp',
    'onix', 'steelix', 'mega-steelix',
    'groudon', 'numel', 'camerupt',
    'mega-camerupt', 'sandshrew', 'swinub',
    'piloswine', 'mamoswine', 'landorus',
    'primal-Groudon', 'sandile', 'krokorok',
    'krookodile'
  ],
  POISON: [
    'bulbasaur', 'ivysaur', 'venusaur',
    'zubat', 'golbat', 'crobat',
    'weedle', 'kakuna', 'beedrill',
    'nidoranF', 'nidorina', 'nidoqueen',
    'nidoranM', 'nidorino', 'nidoking',
    'gastly', 'haunter', 'gengar',
    'bellsprout', 'weepinbell', 'victreebel',
    'oddish', 'gloom', 'vileplume',
    'bellossom'
  ],
  DRAGON: [
    'horsea', 'seadra', 'kingdra',
    'vibrava', 'flygon', 'dratini',
    'dragonair', 'dragonite', 'bagon',
    'shelgon', 'salamence', 'gible',
    'gabite', 'garchomp', 'giratina',
    'dialga', 'palkia', 'rayquaza',
    'latias', 'latios', 'kyurem',
    'reshiram', 'zekrom', 'deino',
    'zweilous', 'hydreigon', 'mega-Rayquaza',
    'tyrantrum', 'tyrunt'
  ],
  FIELD: [
    'squirtle', 'wartortle', 'blastoise',
    'mareep', 'flaffy', 'ampharos',
    'seedot', 'nuzleaf', 'shiftry',
    'cyndaquil', 'quilava', 'typlosion',
    'nidoranF', 'nidorina', 'nidoqueen',
    'nidoranM', 'nidorino', 'nidoking',
    'shinx', 'luxio', 'luxray',
    'slakoth', 'vigoroth', 'slaking',
    'raikou', 'entei', 'eevee',
    'vaporeon', 'jolteon', 'flareon',
    'espeon', 'umbreon', 'leafeon',
    'sylveon', 'numel', 'camerupt',
    'mega-camerupt', 'sandshrew', 'glaceon',
    'absol', 'arceus', 'sandile',
    'krokorok', 'krookodile'
  ],
  MONSTER: [
    'charmander', 'charmeleon', 'charizard',
    'totodile', 'croconaw', 'feraligatr',
    'treecko', 'grovyle', 'sceptile',
    'aron', 'lairon', 'aggron',
    'rhyhorn', 'rhydon', 'rhyperior',
    'gastly', 'haunter', 'gengar',
    'larvitar', 'pupitar', 'tyranitar',
    'bagon', 'shelgon', 'salamence',
    'gible', 'gabite', 'garchomp',
    'regigigas', 'darkrai', 'mewtwo',
    'kyurem', 'cranidos', 'rampardos'
  ],
  HUMAN: [
    'chimchar', 'monferno',
    'infernape', 'machop',
    'machoke', 'machamp',
    'abra', 'kadabra',
    'alakazam', 'ralts',
    'kirlia', 'gardevoir',
    'elekid', 'electabuzz',
    'electivire', 'magby',
    'magmar', 'magmortar',
    'riolu', 'lucario',
    'mega-lucario', 'regice',
    'regirock', 'registeel',
    'regigigas', 'meditite',
    'medicham', 'mega-medicham',
    'deoxys'
  ],
  AQUATIC: [
    'totodile', 'croconaw',
    'feraligatr', 'spheal',
    'sealeo', 'walrein',
    'dratini', 'dragonair',
    'dragonite', 'lugia',
    'kyogre', 'slowpoke',
    'slowbro', 'slowking',
    'primal-Kyogre'
  ],
  BUG: [
    'caterpie', 'metapod',
    'butterfree', 'weedle',
    'kakuna', 'beedrill',
    'trapinch', 'vibrava',
    'flygon', 'scyther',
    'scizor', 'mega-scizor',
    'volcarona', 'manaphy',
    'anorith', 'armaldo'
  ],
  FLYING: [
    'charizard', 'zubat', 'golbat',
    'crobat', 'butterfree', 'beedrill',
    'pidgey', 'pidgeotto', 'pidgeot',
    'hoppip', 'skiploom', 'jumpluff',
    'starly', 'staravia', 'staraptor',
    'torchic', 'combusken', 'blaziken',
    'piplup', 'prinplup', 'empoleon',
    'togetic', 'togekiss', 'dragonite',
    'salamence', 'spearow', 'fearow',
    'lugia', 'zapdos', 'moltres',
    'articuno', 'rayquaza', 'landorus',
    'thundurus', 'tornadus', 'ho-Oh',
    'aerodactyl', 'mega-Rayquaza', 'swablu',
    'archen', 'archeops'
  ],
  FLORA: [
    'bulbasaur', 'ivysaur',
    'venusaur', 'hoppip',
    'skiploom', 'jumpluff',
    'chikorita', 'bayleef',
    'meganium', 'turtwig',
    'grotle', 'torterra',
    'leafeon', 'bellsprout',
    'weepinbell', 'victreebel',
    'shaymin'
  ],
  MINERAL: [
    'geodude', 'graveler',
    'golem', 'aron',
    'lairon', 'aggron',
    'rhyhorn', 'rhydon',
    'rhyperior', 'larvitar',
    'pupitar', 'tyranitar',
    'beldum', 'metang',
    'metagross', 'onix',
    'steelix', 'mega-steelix',
    'regirock', 'terrakion'
  ],
  AMORPH: [
    'duskull', 'dusclops',
    'dusknoir', 'gastly',
    'haunter', 'gengar',
    'giratina', 'darkrai',
    'litwick', 'lampent',
    'chandelure', 'snorunt',
    'glalie', 'froslass',
    'rotom', 'spiritomb',
    'solosis', 'duosion',
    'reuniclus'
  ],
  FAIRY: [
    'azurill', 'marill', 'azumarill',
    'cleffa', 'clefairy', 'clefable',
    'igglybuff', 'wygglytuff', 'jigglypuff',
    'pichu', 'pikachu', 'raichu',
    'togepi', 'togetic', 'togekiss',
    'ralts', 'kirlia', 'gardevoir',
    'sylveon', 'vanillite', 'vanillish',
    'vanilluxe', 'mesprit', 'azelf',
    'uxie', 'cresselia', 'swablu'
  ],
  ICE: [
    'spheal', 'sealeo',
    'walrein', 'articuno',
    'suicune', 'regice',
    'swinub', 'piloswine',
    'mamoswine', 'snorunt',
    'glalie', 'froslass',
    'snover', 'abomasnow',
    'mega-abomasnow', 'vanillite',
    'vanillish', 'vanilluxe',
    'glaceon', 'lapras',
    'kyurem', 'amaura',
    'aurorus'
  ],
  FOSSIL: [
    'aerodactyl', 'amaura',
    'aurorus', 'anorith',
    'archen', 'archeops',
    'armaldo', 'bastiodon',
    'carracosta', 'cradily',
    'cranidos', 'kabuto',
    'kabutops', 'lileep',
    'omanyte', 'omastar',
    'rampardos', 'shieldon',
    'tirtouga', 'tyrantrum',
    'tyrunt'
  ]
};

const PRECOMPUTED_TYPE_POKEMONS = {
  NORMAL: {
    pokemons: [
      'cleffa', 'igglybuff',
      'pidgey', 'starly',
      'eevee', 'togepi',
      'slakoth', 'ditto',
      'scyther', 'meditite'
    ],
    mythicalPokemons: ['regigigas', 'arceus']
  },
  GRASS: {
    pokemons: [
      'bulbasaur', 'caterpie',
      'hoppip', 'seedot',
      'chikorita', 'treecko',
      'turtwig', 'leafeon',
      'bellsprout', 'oddish',
      'lotad', 'snover',
      'cradily'
    ],
    mythicalPokemons: ['virizion', 'celebi', 'shaymin']
  },
  FIRE: {
    pokemons: [
      'charmander', 'cyndaquil',
      'torchic', 'chimchar',
      'flareon', 'houndour',
      'magby', 'litwick',
      'numel'
    ],
    mythicalPokemons: [
      'moltres',
      'entei',
      'groudon',
      'volcarona',
      'reshiram',
      'victini',
      'heatran',
      'ho-Oh',
      'primal-Groudon'
    ]
  },
  WATER: {
    pokemons: [
      'squirtle', 'azurill',
      'mudkip', 'piplup',
      'vaporeon', 'carvanha',
      'horsea', 'lotad',
      'poliwag', 'carracosta',
      'kabuto', 'omanyte'
    ],
    mythicalPokemons: [
      'palkia',
      'suicune',
      'kyogre',
      'keldeo',
      'manaphy',
      'lapras',
      'primal-Kyogre'
    ]
  },
  ELECTRIC: {
    pokemons: ['mareep', 'jolteon', 'pichu', 'magnemite', 'shinx', 'elekid'],
    mythicalPokemons: [
      'zapdos',
      'raikou',
      'thundurus',
      'rotom',
      'zekrom',
      'primal-Kyogre'
    ]
  },
  FIGHTING: {
    pokemons: [
      'combusken',
      'monferno',
      'machop',
      'poliwag',
      'riolu',
      'meditite'
    ],
    mythicalPokemons: ['keldeo', 'terrakion', 'virizion', 'cobalion']
  },
  PSYCHIC: {
    pokemons: ['espeon', 'slowpoke', 'abra', 'ralts', 'beldum', 'solosis'],
    mythicalPokemons: [
      'lugia', 'latias',
      'latios', 'mesprit',
      'azelf', 'uxie',
      'mewtwo', 'celebi',
      'victini', 'jirachi',
      'deoxys', 'cresselia'
    ]
  },
  DARK: {
    pokemons: [
      'seedot', 'umbreon',
      'carvanha', 'houndour',
      'duskull', 'larvitar',
      'deino', 'sandile'
    ],
    mythicalPokemons: ['darkrai', 'spiritomb', 'absol']
  },
  METAL: {
    pokemons: [
      'prinplup', 'aron',
      'magnemite', 'beldum',
      'steelix', 'scizor',
      'lucario', 'bastiodon'
    ],
    mythicalPokemons: ['dialga', 'registeel', 'cobalion', 'jirachi', 'heatran']
  },
  GROUND: {
    pokemons: [
      'geodude', 'mudkip',
      'turtwig', 'swinub',
      'trapinch', 'rhyhorn',
      'gible', 'sandile',
      'onix', 'numel'
    ],
    mythicalPokemons: ['groudon', 'landorus', 'primal-Groudon']
  },
  POISON: {
    pokemons: [
      'bulbasaur',
      'zubat',
      'weedle',
      'nidoranF',
      'nidoranM',
      'bellsprout',
      'oddish',
      'gastly'
    ],
    mythicalPokemons: []
  },
  DRAGON: {
    pokemons: [
      'horsea',
      'vibrava',
      'dratini',
      'bagon',
      'gible',
      'deino',
      'tyrantrum'
    ],
    mythicalPokemons: [
      'giratina',
      'dialga',
      'palkia',
      'rayquaza',
      'latias',
      'latios',
      'kyurem',
      'reshiram',
      'zekrom',
      'mega-Rayquaza'
    ]
  },
  FIELD: {
    pokemons: [
      'squirtle', 'mareep',
      'seedot', 'cyndaquil',
      'nidoranF', 'nidoranM',
      'eevee', 'vaporeon',
      'jolteon', 'flareon',
      'espeon', 'umbreon',
      'leafeon', 'sylveon',
      'glaceon', 'shinx',
      'slakoth', 'sandile',
      'numel'
    ],
    mythicalPokemons: ['raikou', 'entei', 'absol', 'arceus']
  },
  MONSTER: {
    pokemons: [
      'charmander', 'totodile',
      'treecko', 'aron',
      'rhyhorn', 'gastly',
      'larvitar', 'bagon',
      'gible', 'cranidos'
    ],
    mythicalPokemons: ['regigigas', 'darkrai', 'mewtwo', 'kyurem']
  },
  HUMAN: {
    pokemons: [
      'chimchar', 'machop',
      'abra', 'ralts',
      'elekid', 'magby',
      'riolu', 'meditite'
    ],
    mythicalPokemons: ['regice', 'regirock', 'registeel', 'regigigas', 'deoxys']
  },
  AQUATIC: {
    pokemons: ['totodile', 'slowpoke', 'spheal', 'dratini'],
    mythicalPokemons: ['lugia', 'kyogre', 'primal-Kyogre']
  },
  BUG: {
    pokemons: ['caterpie', 'weedle', 'trapinch', 'scyther', 'anorith'],
    mythicalPokemons: ['volcarona', 'manaphy']
  },
  FLYING: {
    pokemons: [
      'charizard', 'zubat',
      'butterfree', 'beedrill',
      'pidgey', 'hoppip',
      'starly', 'torchic',
      'piplup', 'swablu',
      'togetic', 'dragonite',
      'salamence', 'aerodactyl',
      'archen'
    ],
    mythicalPokemons: [
      'lugia',
      'zapdos',
      'moltres',
      'articuno',
      'rayquaza',
      'landorus',
      'thundurus',
      'tornadus',
      'ho-Oh',
      'mega-Rayquaza'
    ]
  },
  FLORA: {
    pokemons: [
      'bulbasaur',
      'hoppip',
      'chikorita',
      'turtwig',
      'leafeon',
      'bellsprout'
    ],
    mythicalPokemons: ['shaymin']
  },
  MINERAL: {
    pokemons: ['geodude', 'aron', 'rhyhorn', 'larvitar', 'beldum', 'onix'],
    mythicalPokemons: ['regirock', 'terrakion']
  },
  AMORPH: {
    pokemons: ['duskull', 'gastly', 'litwick', 'snorunt', 'solosis'],
    mythicalPokemons: ['giratina', 'darkrai', 'rotom', 'spiritomb']
  },
  FAIRY: {
    pokemons: [
      'azurill', 'cleffa',
      'igglybuff', 'sylveon',
      'swablu', 'pichu',
      'togepi', 'ralts',
      'vanillite'
    ],
    mythicalPokemons: ['mesprit', 'azelf', 'uxie', 'cresselia']
  },
  ICE: {
    pokemons: [
      'swinub',
      'glaceon',
      'spheal',
      'snorunt',
      'vanillite',
      'snover',
      'amaura'
    ],
    mythicalPokemons: ['articuno', 'suicune', 'regice', 'lapras', 'kyurem']
  },
  FOSSIL: {
    pokemons: [
      'aerodactyl', 'amaura',
      'anorith', 'archen',
      'shieldon', 'tirtouga',
      'cradily', 'cranidos',
      'kabuto', 'omanyte',
      'tyrunt'
    ],
    mythicalPokemons: []
  }
};

const BATTLE_RESULT = Object.freeze({
  WIN: 'WIN',
  DEFEAT: 'DEFEAT',
  DRAW: 'DRAW'
});

const NEUTRAL_STAGE = [
  {
    turn: 1,
    avatar: PKM.MAGIKARP
  },
  {
    turn: 2,
    avatar: PKM.RATICATE
  },
  {
    turn: 3,
    avatar: PKM.FEAROW
  },
  {
    turn: 10,
    avatar: PKM.GYARADOS
  },
  {
    turn: 15,
    avatar: PKM.LUGIA
  },
  {
    turn: 20,
    avatar: PKM.GIRATINA
  },
  {
    turn: 25,
    avatar: PKM.ZAPDOS
  },
  {
    turn: 30,
    avatar: PKM.DIALGA
  },
  {
    turn: 35,
    avatar: PKM.SUICUNE
  },
  {
    turn: 40,
    avatar: PKM.REGICE
  },
  {
    turn: 45,
    avatar: PKM.RAYQUAZA
  },
  {
    turn: 50,
    avatar: PKM.RAYQUAZA
  },
  {
    turn: 55,
    avatar: PKM.RAYQUAZA
  }];

const FLYING_PROTECT_THRESHOLD = Object.freeze({
  TAILWIND: {
    duration: 1000,
    threshold: 0.2
  },
  FEATHER_DANCE: {
    duration: 2000,
    threshold: 0.4
  },
  MAX_AIRSTREAM: {
    duration: 3000,
    threshold: 0.5
  },
  MAX_GUARD: {
    duration: 4000,
    threshold: 0.5
  }
});

const RANK = Object.freeze({
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

module.exports = {
  RANK,
  FLYING_PROTECT_THRESHOLD,
  BATTLE_RESULT,
  SPECIAL_SKILL_DESCRIPTION,
  SPECIAL_SKILL,
  XP_PLACE,
  XP_TABLE,
  MAP_TYPE_NAME,
  MAP_TYPE_NAME_DESCRIPTION,
  LAST_BATTLE_RESULT_TRADUCTION,
  PHASE_TRADUCTION,
  TYPE_TRADUCTION,
  WORDS,
  MAP_TYPE,
  ITEM_TYPE,
  TYPE_ITEM,
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
  ITEM_DESCRIPTION,
  TYPE_DETAILS,
  EFFECTS_ICON,
  PKM,
  RARITY_COLOR,
  PROBABILITY,
  TYPE_TRIGGER,
  PRECOMPUTED_TYPE_POKEMONS,
  NEUTRAL_STAGE,
  PRECOMPUTED_TYPE_POKEMONS_ALL
};
