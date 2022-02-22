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
  CHINCHOU: 'chinchou',
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
  SANDSLASH: 'sandslash',
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
  ARMALDO: 'armaldo',
  ARCHEN: 'archen',
  ARCHEOPS: 'archeops',
  SHIELDON: 'shieldon',
  BASTIODON: 'bastiodon',
  TIRTOUGA: 'tirtouga',
  CARRACOSTA: 'carracosta',
  LILEEP: 'lileep',
  CRADILY: 'cradily',
  CRANIDOS: 'cranidos',
  RAMPARDOS: 'rampardos',
  KABUTO: 'kabuto',
  KABUTOPS: 'kabutops',
  OMANYTE: 'omanyte',
  OMASTAR: 'omastar',
  TYRUNT: 'tyrunt',
  TYRANTRUM: 'tyrantrum',
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
  STOUTLAND: 'stoutland',
  HITMONCHAN: 'hitmonchan',
  SKUNTANK: 'skuntank',
  PRIMEAPE: 'primeape',
  URSARING: 'ursaring',
  BIBAREL: 'bibarel',
  SENTRET: 'sentret',
  FURRET: 'furret',
  JUMPLUFF: 'jumpluff',
  LUNATONE: 'lunatone',
  HONCHKROW: 'honchkrow',
  GLAMEOW: 'glameow',
  PURUGLY: 'purugly',
  TOXICROAK: 'toxicroak',
  SKARMORY: 'skarmory',
  LICKILICKY: 'lickilicky',
  LICKITUNG: 'lickitung',
  TANGELA: 'tangela',
  TANGROWTH: 'tangrowth',
  MISDREAVUS: 'misdreavus',
  MISMAGIUS: 'mismagius',
  SOLROCK: 'solrock',
  SKORUPI: 'skorupi',
  CLAYDOL: 'claydol',
  BALTOY: 'baltoy',
  GLISCOR: 'gliscor',
  MUK: 'muk',
  NOSEPASS: 'nosepass',
  PROBOPASS: 'probopass',
  SURSKIT: 'surskit',
  MASQUERAIN: 'masquerain',
  VOLBEAT: 'volbeat',
  ILLUMISE: 'illumise',
  DIGLETT: 'diglett',
  DUGTRIO: 'dugtrio',
  SEVIPER: 'seviper',
  WEEZING: 'weezing',
  KOFFING: 'koffing',
  CACTURNE: 'cacturne',
  CACNEA: 'cacnea',
  DRIFBLIM: 'drifblim',
  DRIFLOON: 'drifloon',
  KINGLER: 'kingler',
  KRABBY: 'krabby',
  EXEGGCUTE: 'exeggcute',
  HOOTHOOT: 'hoothoot',
  NOCTOWL: 'noctowl',
  DODUO: 'doduo',
  DODRIO: 'dodrio',
  TAUROS: 'tauros',
  BURMY: 'burmy',
  WORMADAN: 'wormadan',
  SPINARAK: 'spinarak',
  ARIADOS: 'ariados',
  WURMPLE: 'wurmple',
  BRONZONG: 'bronzong',
  BRONZOR: 'bronzor',
  DROWZEE: 'drowzee',
  HYPNO: 'hypno',
  SMOOCHUM: 'smoochum',
  PLUSLE: 'plusle',
  MINUN: 'minun',
  PHANPY: 'phanpy',
  GIRAFARIG: 'girafarig',
  YANMA: 'yanma',
  YANMEGA: 'yanmega',
  POOCHYENA: 'poochyena',
  MIGHTYENA: 'mightyena',
  SHROOMISH: 'shroomish',
  CARNIVINE: 'carnivine',
  MAWILE: 'mawile',
  DUNSPARCE: 'dunsparce',
  SMEARGLE: 'smeargle',
  CHERUBI: 'cherubi',
  CHERIM: 'cherim',
  ZIGZAGOON: 'zigzagoon',
  PACHIRISU: 'pachirisu',
  STANTLER: 'stantler',
  PINSIR: 'pinsir',
  BRELOOM: 'breloom',
  LINOONE: 'linoone',
  KRICKEROT: 'krickerot',
  TROPIUS: 'tropius',
  MEW: 'mew',
  SHELLDER: 'shellder',
  CORSOLA: 'corsola',
  SHELLOS: 'shellos',
  GASTRODON: 'gastrodon',
  WAILMER: 'wailmer',
  WAILORD: 'wailord',
  CLAMPERL: 'clamperl',
  FINNEON: 'finneon',
  TENTACOOL: 'tentacool',
  TENTACRUEL: 'tentacruel',
  REMORAID: 'remoraid',
  SEEL: 'seel',
  DEWGONG: 'dewgong',
  PELIPPER: 'pelipper',
  STARYU: 'staryu',
  STARMIE: 'starmie',
  SPOINK: 'spoink',
  GRUMPIG: 'grumpig',
  VOLTORB: 'voltorb',
  ELECTRODE: 'electrode',
  MURKROW: 'murkrow',
  SKITTY: 'skitty',
  DELCATTY: 'delcatty',
  TAILOW: 'tailow',
  SWELLOW: 'swellow',
  WINGULL: 'wingull',
  DONPHAN: 'donphan',
  FLOATZEL: 'floatzel',
  PONYTA: 'ponyta',
  RAPIDASH: 'rapidash',
  SLUGMA: 'slugma',
  MAGCARGO: 'magcargo',
  HIPPOWDON: 'hippowdon',
  HIPPOPOTAS: 'hippopotas',
  VULPIX: 'vulpix',
  NINETALES: 'ninetales',
  FORETRESS: 'foretress',
  CHINGLING: 'chingling',
  MOTHIM: 'mothim',
  NINCADA: 'nincada',
  NINJASK: 'ninjask',
  SHEDNINJA: 'shedninja',
  UNOWN: 'unown',
  OCTIRELLY: 'octirelly',
  QWILFISH: 'qwilfish',
  CHANSEY: 'chansey',
  BLISSEY: 'blissey',
  WYNAUT: 'wynaut',
  WOOBUFFET: 'woobuffet',
  SPINDA: 'spinda',
  MILTANK: 'miltank',
  VESPIQUEEN: 'vespiqueen',
  HOUNDOUR: 'houndour',
  HOUNDOOM: 'houndoom',
  SNUBULL: 'snubull',
  GRANBULL: 'granbull',
  FARFETCH: 'farfetch',
  KRICKETUNE: 'kricketune',
  GRIMER: 'grimer',
  PSYDUCK: 'psyduck',
  WOOPER: 'wooper',
  BARBOACH: 'barboach',
  WHISCASH: 'whiscash',
  SNEASEL: 'sneasel',
  SABLEYE: 'sableye',
  SUDOWOODO: 'sudowoodo',
  EKANS: 'ekans',
  ARBOK: 'arbok',
  CASTFORM: 'castform',
  CASTFORMSUN: 'castform-sun',
  CASTFORMRAIN: 'castform-rain',
  CASTFORMHAIL: 'castform-hail'
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
  GHOST: 'GHOST',
  FAIRY: 'FAIRY',
  ICE: 'ICE',
  FOSSIL: 'FOSSIL',
  SOUND: 'SOUND'
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
  SHORE_UP: 'SHORE_UP',
  ROTOTILLER: 'ROTOTILLER',
  SANDSTORM: 'SANDSTORM',
  POISON_GAS: 'POISON_GAS',
  TOXIC: 'TOXIC',
  DRAGON_ENERGY: 'DRAGON_ENERGY',
  DRAGON_DANCE: 'DRAGON_DANCE',
  BULK_UP: 'BULK_UP',
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
  SUN_FLOWER: 'SUN_FLOWER',
  BATTLE_ARMOR: 'BATTLE_ARMOR',
  MOUTAIN_RESISTANCE: 'MOUTAIN_RESISTANCE',
  DIAMOND_STORM: 'DIAMOND_STORM',
  PHANTOM_FORCE: 'PHANTOM_FORCE',
  CURSE: 'CURSE',
  AROMATIC_MIST: 'AROMATIC_MIST',
  FAIRY_WIND: 'FAIRY_WIND',
  STRANGE_STEAM: 'STRANGE_STEAM',
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
  UNOWN_GATHERINGS: 'UNOWN_GATHERINGS',
  LARGO: 'LARGO',
  ALLEGRO: 'ALLLEGRO',
  PRESTO: 'PRESTO'
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
  SHORE_UP: {
    level: 1,
    positive: true,
    type: TYPE.GROUND
  },
  ROTOTILLER: {
    level: 2,
    positive: true,
    type: TYPE.GROUND
  },
  SANDSTORM: {
    level: 3,
    positive: true,
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
  DRAGON_ENERGY: {
    level: 1,
    positive: true,
    type: TYPE.DRAGON
  },
  DRAGON_DANCE: {
    level: 2,
    positive: true,
    type: TYPE.DRAGON
  },
  BULK_UP: {
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
    positive: true,
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
  SUN_FLOWER: {
    level: 4,
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
  DIAMOND_STORM: {
    level: 3,
    positive: true,
    type: TYPE.MINERAL
  },
  PHANTOM_FORCE: {
    level: 1,
    positive: true,
    type: TYPE.GHOST
  },
  CURSE: {
    level: 2,
    positive: true,
    type: TYPE.GHOST
  },
  AROMATIC_MIST: {
    level: 1,
    positive: true,
    type: TYPE.FAIRY
  },
  FAIRY_WIND: {
    level: 2,
    positive: true,
    type: TYPE.FAIRY
  },
  GROUND: {
    level: 0,
    positive: true,
    type: TYPE.GROUND
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
  },
  LARGO: {
    level: 1,
    positive: true,
    type: TYPE.SOUND
  },
  ALLEGRO: {
    level: 2,
    positive: true,
    type: TYPE.SOUND
  },
  PRESTO: {
    level: 3,
    positive: true,
    type: TYPE.SOUND
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
  HEAD_SMASH: 'HEAD_SMASH',
  VOLT_SWITCH: 'VOLT_SWITCH',
  SHADOW_CLONE: 'SHADOW_CLONE',
  HYPER_VOICE: 'HYPER_VOICE',
  PETAL_DANCE: 'PETAL_DANCE',
  ECHO: 'ECHO',
  TRI_ATTACK: 'TRI_ATTACK',
  GRASS_WHISTLE: 'GRASS_WHISTLE',
  HIGH_JUMP_KICK: 'HIGH_JUMP_KICK',
  DISARMING_VOICE: 'DISARMING_VOICE',
  RELIC_SONG: 'RELIC_SONG',
  GROWL: 'GROWL',
  BONEMERANG: 'BONEMERANG',
  CLANGOROUS_SOUL: 'CLANGOROUS_SOUL',
  NIGHTMARE: 'NIGHTMARE',
  EXPLOSION: 'EXPLOSION',
  KING_SHIELD: 'KING_SHIELD'
});

const SPECIAL_SKILL_DESCRIPTION = Object.freeze({
  KING_SHIELD: {
    title: {
      eng: 'King Shield'
    },
    description: {
      eng: 'Protect the user for 0.75/1.5/3s and swap his position with the farthest ennemy'
    }
  },
  EXPLOSION: {
    title: {
      eng: 'Explosion'
    },
    description: {
      eng: 'Deals 40/80/160 physical damage. Damage also the user.'
    }
  },
  NIGHTMARE: {
    title: {
      eng: 'Nightmare'
    },
    description: {
      eng: 'Poison the ennemy team for 2/4/8s'
    }
  },
  CLANGOROUS_SOUL: {
    title: {
      eng: 'Clangorous Soul'
    },
    description: {
      eng: 'Buff the adjacent allies with 2/4/8 attack and 1/2/4 defense/special defense'
    }
  },
  BONEMERANG: {
    title: {
      eng: 'Bonemerang'
    },
    description: {
      eng: 'Throw a boomerang bone through the enemy team, dealing 30/60/120 physical damage on its way'
    }
  },
  GROWL: {
    title: {
      eng: 'Growl'
    },
    description: {
      eng: 'Apply wound status on the ennemy team for 1/2/3s'
    }
  },
  RELIC_SONG: {
    title: {
      eng: 'Relic Song'
    },
    description: {
      eng: 'Put asleep the ennemy team for .5/1/2s'
    }
  },
  DISARMING_VOICE: {
    title: {
      eng: 'Disarming Voice'
    },
    description: {
      eng: 'Heals and restore 10/20/40 points of mana to all allies'
    }
  },
  HIGH_JUMP_KICK: {
    title: {
      eng: 'High Jump Kick'
    },
    description: {
      eng: 'Deals 50/100/200 physical damage and steal the mana from its target'
    }
  },
  GRASS_WHISTLE: {
    title: {
      eng: 'Grass Whistle'
    },
    description: {
      eng: 'Put asleep 1/2/4 ennemies for 2 seconds'
    }
  },
  TRI_ATTACK: {
    title: {
      eng: 'Tri Attack'
    },
    description: {
      eng: 'Burn, freeze and wound the target for 2/4/8s'
    }
  },
  ECHO: {
    title: {
      eng: 'Echo'
    },
    description: {
      eng: 'Deals 5/10/20 special damage, +10/+15/+20 damage each time the pokemon uses its ability'
    }
  },
  PETAL_DANCE: {
    title: {
      eng: 'Petal Dance'
    },
    description: {
      eng: 'Deals 30/60/90 special damage to 2/3/4 ennemies'
    }
  },
  HYPER_VOICE: {
    title: {
      eng: 'Hyper Voice'
    },
    description: {
      eng: 'Deals 50/100/200 special damage on a row, confuse for 1/2/3 seconds'
    }
  },
  SHADOW_CLONE: {
    title: {
      eng: 'Shadow Clone'
    },
    description: {
      eng: 'The pokemon creates an identical clone of himself next to his target. This clone inherits from the pokemon items and stats'
    }
  },
  VOLT_SWITCH: {
    title: {
      eng: 'Volt Switch'
    },
    description: {
      eng: 'Dash into the ennemy backline, dealing 40/80/160 special damage'
    }
  },
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
      eng: 'Burn the whole team for 5/10/20 seconds, dealing 5% hp/ seconds',
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
      eng: 'Poison the target for 5/10/20 seconds, dealing 10% hp/seconds',
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
      eng: 'Makes the target confused for .5/1.5/3 seconds',
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
      eng: 'Special one-target attack that does 40/60/80. Decreases the defence of all enemies by 1 point',
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
      eng: 'Rock Tomb'
    },
    description: {
      eng: 'Mono target attack that deals 30/60/90 physical damage and decrease target attack speed by 20/40/60%'
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
    eng: 'Rock',
    esp: 'Roca',
    fra: 'Minéral'
  },
  GHOST: {
    eng: 'Ghost',
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
  },
  SOUND: {
    eng: 'Sound',
    esp: 'Sound',
    fra: 'Sound'
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
  8: 70,
  9: -1
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

const ORIENTATION_RAD = Object.freeze({
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
          text: `Grass allies restore 10% HP per second`
        },
        {
          trigger: 7,
          title: `(7) Tree of life`,
          text: `Grass allies restore 15% HP per second`
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
          text: `Water pokemons gain 20% chance to dodge enemy attacks`
        },
        {
          trigger: 6,
          title: `(6) Drizzle`,
          text: `Water pokemons gain 40% chance to dodge enemy attacks`
        },
        {
          trigger: 9,
          title: `(9) Primordial sea`,
          text: `Water pokemons gain 60% chance to dodge enemy attacks`
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
          text: `Your Electric pokemon have +14% attack speed. (stacks)`
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
          title: `(2) Shift Gear`,
          text: `One of your steel gains double attack damage`
        },
        {
          trigger: 4,
          title: `(4) Lightening`,
          text: `All of your steel gains double attack damage`
        }
      ]
    }
  },
  GROUND: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Shore Up`,
          text: `Every two seconds all ground pokemons gains 1 defense/special defense and 1 attack bonus stats. This effect stacks up to five times`
        },
        {
          trigger: 4,
          title: `(4) Rototiller`,
          text: `Every two seconds all ground pokemons gains 2 defense/special defense and 2 attack bonus stats. This effect stacks up to five times`
        },
        {
          trigger: 6,
          title: `(6) Sandstorm`,
          text: `Every two seconds all ground pokemons gains 3 defense/special defense and 3 attack bonus stats. This effect stacks up to five times`
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
          text: `Your Poison pokemon have a 10% chance to poison the target for 2 seconds. (15% HP per second)`
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
          trigger: 3,
          title: `(3) Dragon Energy`,
          text: `Your Dragon pokemon gain +3% attack Speed after every hit.`
        },
        {
          trigger: 4,
          title: `(5) Dragon Dance`,
          text: `Your Dragon pokemon gain +6% attack Speed after every hit.`
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
          text: `When a field pokemon dies, all other field pokemons gain 20% Attack Speed and are healed for 30% of their Maximum Health`
        },
        {
          trigger: 6,
          title: `(6) Rage`,
          text: `When a field pokemon dies, all other field pokemons gain 30% Attack Speed and are healed for 40% of their Maximum Health`
        },
        {
          trigger: 9,
          title: `(9) Sword Dance`,
          text: `When a field pokemon dies, all other field pokemons gain 50% Attack Speed and are healed for 60% of their Maximum Health`
        }
      ]
    }
  },
  MONSTER: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Pursuit`,
          text: `Monster pokemons shield themselves for 20% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
        },
        {
          trigger: 4,
          title: `(4) Pride`,
          text: `Monster pokemons shield themselves for 30% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
        },
        {
          trigger: 6,
          title: `(6) Berserk`,
          text: `Monster pokemons shield themselves for 40% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
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
          text: `All allies heals for 15% of the damage they deal with spells and attacks`
        },
        {
          trigger: 4,
          title: `(4) Helping Hands`,
          text: `All allies heals for 30% of the damage they deal with spells and attacks`
        },
        {
          trigger: 6,
          title: `(6) Calm Mind`,
          text: `All allies heals for 60% of the damage they deal with spells and attacks`
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
          title: `(2) Fisrt Impression`,
          text: `At the start of combat, creates a copy of one bug pokemon`
        },
        {
          trigger: 5,
          title: `(5) Swarm`,
          text: `At the start of combat, creates a copy of all bug pokemon`
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
          text: `When the first flora pokemon is dead, the odd flower will rise from its grave..`
        },
        {
          trigger: 3,
          title: `(3) Gloom Flower`,
          text: `When the first flora pokemon is dead, the gloom flower will rise from its grave..`
        },
        {
          trigger: 4,
          title: `(4) Vile Flower`,
          text: `When the first flora pokemon is dead, the vile flower will rise from its grave..`
        },
        {
          trigger: 5,
          title: `(5) Sun Flower`,
          text: `When the first flora pokemon is dead, the sun flower will rise from its grave..`
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
          text: `Mineral pokemons gains 75 bonus maximum health`
        },
        {
          trigger: 4,
          title: `(4) Solid Rock`,
          text: `Mineral pokemons gains 150 bonus maximum health`
        },
        {
          trigger: 6,
          title: `(6) Diamond Storm`,
          text: `Mineral pokemons gains 300 bonus maximum health`
        }
      ]
    }
  },
  GHOST: {
    description: {
      eng: [
        {
          trigger: 2,
          title: `(2) Phantom force`,
          text: `One of your ghost pokemons deals true damage and silence his target`
        },
        {
          trigger: 4,
          title: `(4) Curse`,
          text: `All of your ghost pokemons deals true damage and silence his target`
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
          title: `(2) Aromatic Mist`,
          text: `Fairy pokemons shock nearby enemies for 15 special damages whenever they deal or receive a critical strike`
        },
        {
          trigger: 4,
          title: `(4) Fairy Wind`,
          text: `Fairy pokemons shock nearby enemies for 30 special damages whenever they deal or receive a critical strike`
        },
        {
          trigger: 6,
          title: `(6) Strange Steam`,
          text: `Fairy pokemons shock nearby enemies for 60 special damages whenever they deal or receive a critical strike`
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
          text: `All allies have a 10% chance to freeze an enemy for 2 seconds after a hit.`
        },
        {
          trigger: 4,
          title: `(4) Sheer cold`,
          text: `All allies pokemon have a 30% chance to freeze an enemy for 2 seconds after a hit.`
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
  },
  SOUND: {
    description: {
      eng: [
        {
          trigger: 3,
          title: `(3) Largo`,
          text: `+3 attack each time a sound pokemon use its ability`
        }, {
          trigger: 5,
          title: `(5) Allegro`,
          text: `+6 attack each time a sound pokemon use its ability`
        }, {
          trigger: 7,
          title: `(7) Presto`,
          text: `+8 attack each time a sound pokemon use its ability`
        }
      ]
    }
  }
});

const TYPE_TRIGGER = {
  NORMAL: [3, 6, 9],
  GRASS: [3, 5, 7],
  FIRE: [2, 4, 6],
  WATER: [3, 6, 9],
  ELECTRIC: [1],
  FIGHTING: [2, 4],
  PSYCHIC: [2, 4, 6],
  DARK: [2, 4, 6],
  METAL: [2, 4],
  GROUND: [2, 4, 6],
  POISON: [3, 6],
  DRAGON: [3, 5],
  FIELD: [3, 6, 9],
  MONSTER: [2, 4, 6],
  HUMAN: [2, 4, 6],
  AQUATIC: [2, 4],
  BUG: [2, 5],
  FLYING: [2, 4, 6, 8],
  FLORA: [2, 3, 4, 5],
  MINERAL: [2, 4, 6],
  GHOST: [2, 4],
  FAIRY: [2, 4, 6],
  ICE: [2, 4],
  FOSSIL: [2, 4, 6],
  SOUND: [3, 5, 7]
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
    'cleffa', 'clefairy', 'clefable',
    'igglybuff', 'wygglytuff', 'jigglypuff',
    'pidgey', 'pidgeotto', 'pidgeot',
    'starly', 'staravia', 'staraptor',
    'togepi', 'togetic', 'togekiss',
    'slakoth', 'vigoroth', 'slaking',
    'regigigas', 'eevee', 'meditite',
    'medicham', 'mega-medicham', 'arceus',
    'buneary', 'lopunny', 'mega-lopunny',
    'porygon', 'porygon2', 'porygon-z',
    'whismur', 'loudred', 'exploud',
    'pikipek', 'trumbeak', 'toucannon',
    'meloetta', 'castform', 'castform-sun',
    'castform-rain', 'castform-hail'
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
    'vileplume', 'bellossom', 'lileep',
    'cradily', 'budew', 'roselia',
    'roserade', 'sewaddle', 'swadloon',
    'leavanny'
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
    'chandelure', 'volcarona', 'reshiram',
    'victini', 'heatran', 'ho-Oh',
    'primal-Groudon', 'alolan-marowak', 'houndour',
    'castform-sun'
  ],
  WATER: [
    'squirtle', 'wartortle', 'blastoise',
    'azurill', 'marill', 'azumarill',
    'mudkip', 'marshtomp', 'swampert',
    'piplup', 'prinplup', 'empoleon',
    'horsea', 'seadra', 'kingdra',
    'lotad', 'lombre', 'ludicolo',
    'poliwag', 'poliwhirl', 'politoed',
    'gyarados', 'palkia', 'suicune',
    'kyogre', 'vaporeon', 'carvanha',
    'keldeo', 'manaphy', 'lapras',
    'primal-Kyogre', 'tirtouga', 'carracosta',
    'kabuto', 'kabutops', 'omanyte',
    'omastar', 'tympole', 'palpitoad',
    'seismitoad', 'castform-rain'
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
    'zekrom', 'primal-Kyogre',
    'electrike', 'manectric',
    'mega-manectric'
  ],
  FIGHTING: [
    'torchic', 'combusken',
    'blaziken', 'chimchar',
    'monferno', 'infernape',
    'machop', 'machoke',
    'machamp', 'poliwag',
    'poliwhirl', 'politoed',
    'riolu', 'lucario',
    'mega-lucario', 'meditite',
    'medicham', 'mega-medicham',
    'keldeo', 'terrakion',
    'virizion', 'cobalion',
    'buneary', 'lopunny',
    'mega-lopunny', 'jangmo-o',
    'hakamo-o', 'kommo-o'
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
    'reuniclus', 'porygon', 'porygon2',
    'porygon-z'
  ],
  DARK: [
    'seedot', 'nuzleaf',
    'shiftry', 'duskull',
    'dusclops', 'dusknoir',
    'larvitar', 'pupitar',
    'tyranitar', 'umbreon',
    'darkrai', 'carvanha',
    'spiritomb', 'absol',
    'deino', 'zweilous',
    'hydreigon', 'sandile',
    'krokorok', 'krookodile',
    'shuppet', 'banette',
    'mega-banette', 'houndour'
  ],
  METAL: [
    'prinplup', 'empoleon', 'aron',
    'lairon', 'aggron', 'magnemite',
    'magneton', 'magnezone', 'beldum',
    'metang', 'metagross', 'onix',
    'steelix', 'mega-steelix', 'scizor',
    'mega-scizor', 'lucario', 'mega-lucario',
    'dialga', 'registeel', 'cobalion',
    'jirachi', 'heatran', 'shieldon',
    'bastiodon', 'honedge', 'doublade',
    'aegislash'
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
    'mega-camerupt', 'swinub', 'piloswine',
    'mamoswine', 'landorus', 'primal-Groudon',
    'sandile', 'krokorok', 'krookodile',
    'cubone', 'marowak', 'alolan-marowak',
    'tympole', 'palpitoad', 'seismitoad'
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
    'bellossom', 'budew', 'roselia',
    'roserade', 'venipede', 'whirlipede',
    'scolipede'
  ],
  DRAGON: [
    'charmander', 'charmeleon', 'charizard',
    'horsea', 'seadra', 'kingdra',
    'vibrava', 'flygon', 'dratini',
    'dragonair', 'dragonite', 'bagon',
    'shelgon', 'salamence', 'gible',
    'gabite', 'garchomp', 'giratina',
    'dialga', 'palkia', 'rayquaza',
    'latias', 'latios', 'kyurem',
    'reshiram', 'zekrom', 'deino',
    'zweilous', 'hydreigon', 'mega-Rayquaza',
    'swablu', 'tyrunt', 'tyrantrum',
    'axew', 'fraxure', 'haxorus',
    'jangmo-o', 'hakamo-o', 'kommo-o',
    'altaria', 'mega-altaria'
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
    'mega-camerupt', 'swinub', 'piloswine',
    'mamoswine', 'glaceon', 'absol',
    'arceus', 'sandile', 'krokorok',
    'krookodile', 'electrike', 'manectric',
    'mega-manectric'
  ],
  MONSTER: [
    'totodile', 'croconaw', 'feraligatr',
    'treecko', 'grovyle', 'sceptile',
    'aron', 'lairon', 'aggron',
    'rhyhorn', 'rhydon', 'rhyperior',
    'gastly', 'haunter', 'gengar',
    'larvitar', 'pupitar', 'tyranitar',
    'bagon', 'shelgon', 'salamence',
    'gible', 'gabite', 'garchomp',
    'regigigas', 'darkrai', 'mewtwo',
    'cranidos', 'rampardos', 'axew',
    'fraxure', 'haxorus'
  ],
  HUMAN: [
    'machop', 'machoke',
    'machamp', 'abra',
    'kadabra', 'alakazam',
    'ralts', 'kirlia',
    'gardevoir', 'elekid',
    'electabuzz', 'electivire',
    'magby', 'magmar',
    'magmortar', 'riolu',
    'lucario', 'mega-lucario',
    'regice', 'regirock',
    'registeel', 'regigigas',
    'meditite', 'medicham',
    'mega-medicham', 'deoxys'
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
    'anorith', 'armaldo',
    'venipede', 'whirlipede',
    'scolipede', 'sewaddle',
    'swadloon', 'leavanny'
  ],
  FLYING: [
    'zubat', 'golbat', 'crobat',
    'butterfree', 'beedrill', 'pidgey',
    'pidgeotto', 'pidgeot', 'hoppip',
    'skiploom', 'jumpluff', 'starly',
    'staravia', 'staraptor', 'torchic',
    'combusken', 'blaziken', 'piplup',
    'prinplup', 'empoleon', 'togetic',
    'togekiss', 'dragonite', 'salamence',
    'scyther', 'scizor', 'mega-scizor',
    'lugia', 'zapdos', 'moltres',
    'articuno', 'rayquaza', 'landorus',
    'thundurus', 'tornadus', 'ho-Oh',
    'aerodactyl', 'mega-Rayquaza', 'archen',
    'archeops', 'pikipek', 'trumbeak',
    'toucannon'
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
    'shaymin', 'budew',
    'roselia', 'roserade',
    'flabebe', 'floette',
    'florges'
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
    'regirock', 'terrakion',
    'cubone', 'marowak',
    'alolan-marowak'
  ],
  GHOST: [
    'duskull', 'dusclops',
    'dusknoir', 'gastly',
    'haunter', 'gengar',
    'giratina', 'darkrai',
    'litwick', 'lampent',
    'chandelure', 'snorunt',
    'glalie', 'froslass',
    'rotom', 'spiritomb',
    'solosis', 'duosion',
    'reuniclus', 'shuppet',
    'banette', 'mega-banette',
    'honedge', 'doublade',
    'aegislash', 'alolan-marowak',
    'castform', 'castform-sun',
    'castform-rain', 'castform-hail'
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
    'uxie', 'cresselia', 'swablu',
    'flabebe', 'floette', 'florges',
    'altaria', 'mega-altaria'
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
    'aurorus', 'castform-hail'
  ],
  FOSSIL: [
    'aerodactyl', 'amaura',
    'aurorus', 'anorith',
    'armaldo', 'archen',
    'archeops', 'shieldon',
    'bastiodon', 'tirtouga',
    'carracosta', 'lileep',
    'cradily', 'cranidos',
    'rampardos', 'kabuto',
    'kabutops', 'omanyte',
    'omastar', 'tyrunt',
    'tyrantrum'
  ],
  SOUND: [
    'zubat', 'golbat', 'crobat',
    'igglybuff', 'wygglytuff', 'jigglypuff',
    'swablu', 'whismur', 'loudred',
    'exploud', 'tympole', 'palpitoad',
    'seismitoad', 'sewaddle', 'swadloon',
    'leavanny', 'pikipek', 'trumbeak',
    'toucannon', 'flabebe', 'floette',
    'florges', 'jangmo-o', 'hakamo-o',
    'kommo-o', 'meloetta', 'altaria',
    'mega-altaria'
  ]
};

const PRECOMPUTED_TYPE_POKEMONS = {
  NORMAL: {
    pokemons: [
      'cleffa', 'igglybuff',
      'pidgey', 'starly',
      'eevee', 'pikipek',
      'togepi', 'slakoth',
      'porygon', 'whismur',
      'meditite', 'buneary'
    ],
    mythicalPokemons: [
      'regigigas',
      'arceus',
      'meloetta',
      'castform',
      'castform-sun',
      'castform-rain',
      'castform-hail'
    ]
  },
  GRASS: {
    pokemons: [
      'caterpie', 'hoppip',
      'seedot', 'chikorita',
      'treecko', 'leafeon',
      'bellsprout', 'oddish',
      'lileep', 'bulbasaur',
      'turtwig', 'lotad',
      'budew', 'sewaddle',
      'snover'
    ],
    mythicalPokemons: ['virizion', 'celebi', 'shaymin']
  },
  FIRE: {
    pokemons: [
      'charmander',
      'cyndaquil',
      'torchic',
      'chimchar',
      'flareon',
      'houndour',
      'magby',
      'litwick',
      'alolan-marowak',
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
      'primal-Groudon',
      'castform-sun'
    ]
  },
  WATER: {
    pokemons: [
      'squirtle', 'azurill',
      'mudkip', 'piplup',
      'horsea', 'vaporeon',
      'carvanha', 'kabuto',
      'omanyte', 'lotad',
      'poliwag', 'tirtouga',
      'tympole'
    ],
    mythicalPokemons: [
      'palkia',
      'suicune',
      'kyogre',
      'keldeo',
      'manaphy',
      'lapras',
      'primal-Kyogre',
      'castform-rain'
    ]
  },
  ELECTRIC: {
    pokemons: [
      'mareep',
      'magnemite',
      'jolteon',
      'pichu',
      'shinx',
      'elekid',
      'electrike'
    ],
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
      'torchic', 'chimchar',
      'machop', 'poliwag',
      'jangmo-o', 'riolu',
      'meditite', 'buneary'
    ],
    mythicalPokemons: ['keldeo', 'terrakion', 'virizion', 'cobalion']
  },
  PSYCHIC: {
    pokemons: [
      'espeon', 'slowpoke',
      'abra', 'ralts',
      'beldum', 'solosis',
      'porygon'
    ],
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
      'seedot', 'duskull',
      'umbreon', 'carvanha',
      'sandile', 'houndour',
      'larvitar', 'deino',
      'shuppet'
    ],
    mythicalPokemons: ['darkrai', 'spiritomb', 'absol']
  },
  METAL: {
    pokemons: [
      'prinplup', 'magnemite',
      'aron', 'beldum',
      'shieldon', 'honedge',
      'onix', 'scizor',
      'lucario'
    ],
    mythicalPokemons: ['dialga', 'registeel', 'cobalion', 'jirachi', 'heatran']
  },
  GROUND: {
    pokemons: [
      'geodude', 'mudkip',
      'swinub', 'sandile',
      'turtwig', 'trapinch',
      'rhyhorn', 'gible',
      'cubone', 'tympole',
      'onix', 'numel'
    ],
    mythicalPokemons: ['groudon', 'landorus', 'primal-Groudon']
  },
  POISON: {
    pokemons: [
      'zubat', 'weedle',
      'bellsprout', 'oddish',
      'venipede', 'bulbasaur',
      'nidoranF', 'nidoranM',
      'budew', 'gastly'
    ],
    mythicalPokemons: []
  },
  DRAGON: {
    pokemons: [
      'charmander', 'horsea',
      'vibrava', 'dratini',
      'bagon', 'gible',
      'deino', 'tyrunt',
      'axew', 'jangmo-o',
      'swablu'
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
      'eevee', 'vaporeon',
      'jolteon', 'flareon',
      'espeon', 'umbreon',
      'leafeon', 'sylveon',
      'swinub', 'glaceon',
      'sandile', 'nidoranF',
      'nidoranM', 'shinx',
      'slakoth', 'numel',
      'electrike'
    ],
    mythicalPokemons: ['raikou', 'entei', 'absol', 'arceus']
  },
  MONSTER: {
    pokemons: [
      'totodile', 'treecko',
      'aron', 'rhyhorn',
      'larvitar', 'bagon',
      'gible', 'cranidos',
      'axew', 'gastly'
    ],
    mythicalPokemons: ['regigigas', 'darkrai', 'mewtwo']
  },
  HUMAN: {
    pokemons: [
      'machop', 'abra',
      'ralts', 'elekid',
      'magby', 'riolu',
      'meditite'
    ],
    mythicalPokemons: ['regice', 'regirock', 'registeel', 'regigigas', 'deoxys']
  },
  AQUATIC: {
    pokemons: ['totodile', 'spheal', 'slowpoke', 'dratini'],
    mythicalPokemons: ['lugia', 'kyogre', 'primal-Kyogre']
  },
  BUG: {
    pokemons: [
      'caterpie',
      'weedle',
      'anorith',
      'venipede',
      'trapinch',
      'sewaddle',
      'scyther'
    ],
    mythicalPokemons: ['volcarona', 'manaphy']
  },
  FLYING: {
    pokemons: [
      'zubat', 'butterfree',
      'beedrill', 'pidgey',
      'hoppip', 'starly',
      'torchic', 'piplup',
      'pikipek', 'togetic',
      'dragonite', 'salamence',
      'aerodactyl', 'archen',
      'scyther'
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
      'hoppip',
      'chikorita',
      'leafeon',
      'bellsprout',
      'flabebe',
      'bulbasaur',
      'turtwig',
      'budew'
    ],
    mythicalPokemons: ['shaymin']
  },
  MINERAL: {
    pokemons: [
      'geodude', 'aron',
      'rhyhorn', 'larvitar',
      'beldum', 'cubone',
      'onix'
    ],
    mythicalPokemons: ['regirock', 'terrakion']
  },
  GHOST: {
    pokemons: [
      'duskull',
      'litwick',
      'snorunt',
      'solosis',
      'honedge',
      'alolan-marowak',
      'gastly',
      'shuppet'
    ],
    mythicalPokemons: [
      'giratina',
      'darkrai',
      'rotom',
      'spiritomb',
      'castform',
      'castform-sun',
      'castform-rain',
      'castform-hail'
    ]
  },
  FAIRY: {
    pokemons: [
      'azurill', 'cleffa',
      'igglybuff', 'sylveon',
      'flabebe', 'pichu',
      'togepi', 'ralts',
      'vanillite', 'swablu'
    ],
    mythicalPokemons: ['mesprit', 'azelf', 'uxie', 'cresselia']
  },
  ICE: {
    pokemons: [
      'spheal',
      'swinub',
      'glaceon',
      'snorunt',
      'vanillite',
      'amaura',
      'snover'
    ],
    mythicalPokemons: [
      'articuno',
      'suicune',
      'regice',
      'lapras',
      'kyurem',
      'castform-hail'
    ]
  },
  FOSSIL: {
    pokemons: [
      'anorith', 'lileep',
      'kabuto', 'omanyte',
      'aerodactyl', 'amaura',
      'archen', 'shieldon',
      'tirtouga', 'cranidos',
      'tyrunt'
    ],
    mythicalPokemons: []
  },
  SOUND: {
    pokemons: [
      'zubat', 'igglybuff',
      'pikipek', 'flabebe',
      'whismur', 'tympole',
      'sewaddle', 'jangmo-o',
      'swablu'
    ],
    mythicalPokemons: ['meloetta']
  }
};

const PRECOMPUTED_RARITY_POKEMONS_ALL = {
  COMMON: [
    'charmander', 'charmeleon', 'charizard',
    'geodude', 'graveler', 'golem',
    'azurill', 'marill', 'azumarill',
    'zubat', 'golbat', 'crobat',
    'mareep', 'flaffy', 'ampharos',
    'cleffa', 'clefairy', 'clefable',
    'caterpie', 'metapod', 'butterfree',
    'weedle', 'kakuna', 'beedrill',
    'pidgey', 'pidgeotto', 'pidgeot',
    'hoppip', 'skiploom', 'jumpluff',
    'seedot', 'nuzleaf', 'shiftry',
    'starly', 'staravia', 'staraptor',
    'totodile', 'croconaw', 'feraligatr',
    'swinub', 'piloswine', 'mamoswine'
  ],
  UNCOMMON: [
    'squirtle', 'wartortle', 'blastoise', 'igglybuff', 'wygglytuff',
    'jigglypuff', 'chikorita', 'bayleef', 'meganium', 'cyndaquil',
    'quilava', 'typlosion', 'treecko', 'grovyle', 'sceptile',
    'torchic', 'combusken', 'blaziken', 'mudkip', 'marshtomp',
    'swampert', 'chimchar', 'monferno', 'infernape', 'piplup',
    'prinplup', 'empoleon', 'machop', 'machoke', 'machamp',
    'horsea', 'seadra', 'kingdra', 'spheal', 'sealeo',
    'walrein', 'magnemite', 'magneton', 'magnezone', 'duskull',
    'dusclops', 'dusknoir', 'eevee', 'vaporeon', 'jolteon',
    'flareon', 'espeon', 'umbreon', 'leafeon', 'sylveon',
    'slowpoke', 'slowbro', 'slowking', 'bellsprout', 'weepinbell',
    'victreebel', 'glaceon', 'sandile', 'krokorok', 'krookodile',
    'anorith', 'armaldo', 'lileep', 'cradily', 'kabuto',
    'kabutops', 'omanyte', 'omastar', 'venipede', 'whirlipede',
    'scolipede', 'pikipek', 'trumbeak', 'toucannon', 'flabebe',
    'floette', 'florges'
  ],
  RARE: [
    'bulbasaur', 'ivysaur', 'venusaur', 'turtwig',
    'grotle', 'torterra', 'nidoranF', 'nidorina',
    'nidoqueen', 'nidoranM', 'nidorino', 'nidoking',
    'pichu', 'pikachu', 'raichu', 'trapinch',
    'vibrava', 'flygon', 'aron', 'lairon',
    'aggron', 'rhyhorn', 'rhydon', 'rhyperior',
    'togepi', 'togetic', 'togekiss', 'lotad',
    'lombre', 'ludicolo', 'shinx', 'luxio',
    'luxray', 'poliwag', 'poliwhirl', 'politoed',
    'dratini', 'dragonair', 'dragonite', 'magby',
    'magmar', 'magmortar', 'vanillite', 'vanillish',
    'vanilluxe', 'deino', 'zweilous', 'hydreigon',
    'solosis', 'duosion', 'reuniclus', 'archen',
    'archeops', 'shieldon', 'bastiodon', 'tirtouga',
    'carracosta', 'cranidos', 'rampardos', 'axew',
    'fraxure', 'haxorus', 'whismur', 'loudred',
    'exploud'
  ],
  EPIC: [
    'abra', 'kadabra', 'alakazam',
    'larvitar', 'pupitar', 'tyranitar',
    'slakoth', 'vigoroth', 'slaking',
    'ralts', 'kirlia', 'gardevoir',
    'bagon', 'shelgon', 'salamence',
    'beldum', 'metang', 'metagross',
    'gible', 'gabite', 'garchomp',
    'elekid', 'electabuzz', 'electivire',
    'litwick', 'lampent', 'chandelure',
    'snorunt', 'glalie', 'froslass',
    'aerodactyl', 'amaura', 'aurorus',
    'tyrunt', 'tyrantrum', 'budew',
    'roselia', 'roserade', 'porygon',
    'porygon2', 'porygon-z', 'honedge',
    'doublade', 'aegislash', 'cubone',
    'marowak', 'alolan-marowak', 'tympole',
    'palpitoad', 'seismitoad', 'sewaddle',
    'swadloon', 'leavanny', 'jangmo-o',
    'hakamo-o', 'kommo-o'
  ],
  LEGENDARY: [
    'gastly', 'haunter', 'gengar',
    'onix', 'steelix', 'mega-steelix',
    'scyther', 'scizor', 'mega-scizor',
    'riolu', 'lucario', 'mega-lucario',
    'meditite', 'medicham', 'mega-medicham',
    'numel', 'camerupt', 'mega-camerupt',
    'snover', 'abomasnow', 'mega-abomasnow',
    'swablu', 'buneary', 'lopunny',
    'mega-lopunny', 'electrike', 'manectric',
    'mega-manectric', 'shuppet', 'banette',
    'mega-banette', 'altaria', 'mega-altaria'
  ],
  MYTHICAL: [
    'lugia', 'giratina', 'zapdos',
    'moltres', 'articuno', 'dialga',
    'palkia', 'suicune', 'raikou',
    'entei', 'regice', 'regirock',
    'registeel', 'kyogre', 'groudon',
    'rayquaza', 'regigigas', 'darkrai',
    'volcarona', 'landorus', 'thundurus',
    'tornadus', 'keldeo', 'terrakion',
    'virizion', 'cobalion', 'manaphy',
    'rotom', 'spiritomb', 'absol',
    'lapras', 'latias', 'latios',
    'mesprit', 'azelf', 'uxie',
    'mewtwo', 'kyurem', 'reshiram',
    'zekrom', 'celebi', 'victini',
    'jirachi', 'arceus', 'deoxys',
    'shaymin', 'cresselia', 'heatran',
    'ho-Oh', 'primal-Kyogre', 'primal-Groudon',
    'mega-Rayquaza', 'meloetta', 'castform',
    'castform-sun', 'castform-rain', 'castform-hail'
  ],
  NEUTRAL: ['gyarados'],
  SUMMON: [
    'carvanha',
    'oddish',
    'gloom',
    'vileplume',
    'bellossom',
    'houndour'
  ]
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

const HDR = Object.freeze({
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

const MAP = Object.freeze({
  FOURTH_STATION_PATH: {
    id: 'FOURTH_STATION_PATH',
    name: '4th Station Path',
    pokemons: [PKM.IVYSAUR, PKM.METAPOD, PKM.RATICATE, PKM.WEEPINBELL, PKM.BAYLEEF, PKM.ROSELIA, PKM.FLYGON, PKM.TORTERRA, PKM.SKUNTANK, PKM.URSARING, PKM.BIBAREL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  SEVEN_STATION_PATH: {
    id: 'SEVEN_STATION_PATH',
    name: '7th Station Path',
    pokemons: [PKM.SKUNTANK, PKM.FEAROW, PKM.PRIMEAPE, PKM.MAROWAK, PKM.HITMONCHAN, PKM.FURRET, PKM.URSARING, PKM.SHEDNINJA, PKM.BIBAREL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.FIGHTING
  },
  BARREN_VALLEY: {
    id: 'BARREN_VALLEY',
    name: 'Barren Valley',
    pokemons: [PKM.JUMPLUFF, PKM.FLYGON, PKM.LUNATONE, PKM.HONCHKROW, PKM.GLAMEOW, PKM.TOXICROAK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.DARK
  },
  DARK_ICE_MOUNTAIN_PEAK: {
    id: 'DARK_ICE_MOUNTAIN_PEAK',
    name: 'Dark Ice Mountain Peak',
    pokemons: [PKM.GENGAR, PKM.SKARMORY, PKM.DUSKULL, PKM.METANG, PKM.LICKILICKY, PKM.TANGROWTH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DARK_ICE_MOUNTAIN: {
    id: 'DARK_ICE_MOUNTAIN',
    name: 'Dark Ice Mountain',
    pokemons: [PKM.BANETTE, PKM.GENGAR, PKM.SKARMORY, PKM.DUSKULL, PKM.METANG, PKM.LICKILICKY, PKM.TANGROWTH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DARK_WASTELAND: {
    id: 'DARK_WASTELAND',
    name: 'Dark Wasteland',
    pokemons: [PKM.GASTLY, PKM.ONIX, PKM.MISDREAVUS, PKM.SHIFTRY, PKM.SOLROCK, PKM.SKORUPI],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DEEP_BOULDER_QUARRY: {
    id: 'DEEP_BOULDER_QUARRY',
    name: 'Deep Boulder Quarry',
    pokemons: [PKM.CLAYDOL, PKM.GLISCOR, PKM.NINJASK, PKM.MUK, PKM.PROBOPASS, PKM.SHELGON, PKM.RHYDON, PKM.TANGROWTH, PKM.METANG, PKM.STEELIX],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GROUND
  },
  LIMESTONE_CAVERN: {
    id: 'LIMESTONE_CAVERN',
    name: 'Limestone Cavern',
    pokemons: [PKM.KINGLER, PKM.MARILL, PKM.SLOWKING, PKM.VOLBEAT, PKM.ILLUMISE, PKM.SEVIPER, PKM.DRAGONAIR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.WATER
  },
  DEEP_LIMESTONE_CAVERN: {
    id: 'DEEP_LIMESTONE_CAVERN',
    name: 'Deep Limestone Cavern',
    pokemons: [PKM.DRAGONAIR, PKM.AERODACTYL, PKM.MASQUERAIN, PKM.VOLBEAT, PKM.ILLUMISE, PKM.SEVIPER, PKM.POLIWHIRL, PKM.DUGTRIO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.WATER
  },
  ICICLE_FOREST: {
    id: 'ICICLE_FOREST',
    name: 'Icicle Forest',
    pokemons: [PKM.GENGAR, PKM.WEEZING, PKM.CACTURNE, PKM.METAGROSS, PKM.LICKILICKY, PKM.GLISCOR, PKM.DRIFBLIM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.ICE
  },
  MURKY_FOREST: {
    id: 'MURKY_FOREST',
    name: 'Murky Forest',
    pokemons: [PKM.EXEGGCUTE, PKM.HOOTHOOT, PKM.HOPPIP, PKM.DODUO, PKM.WEEDLE, PKM.BURMY, PKM.SPINARAK, PKM.WURMPLE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.BUG
  },
  SPACIAL_CLIFFS: {
    id: 'SPACIAL_CLIFFS',
    name: 'Spacial Cliffs',
    pokemons: [PKM.HAUNTER, PKM.BELDUM, PKM.MISDREAVUS, PKM.KOFFING, PKM.SHEDNINJA, PKM.BANETTE, PKM.MISMAGIUS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  TEMPORAL_SPIRE_FUTURE: {
    id: 'TEMPORAL_SPIRE_FUTURE',
    name: 'Temporal Spire Future',
    pokemons: [PKM.GOLBAT, PKM.ALAKAZAM, PKM.MAGNETON, PKM.GASTLY, PKM.HYPNO, PKM.CLAYDOL, PKM.MISMAGIUS, PKM.BRONZONG, PKM.PORYGON2, PKM.CROBAT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  TEMPORAL_TOWER_FUTURE: {
    id: 'TEMPORAL_TOWER_FUTURE',
    name: 'Temporal Tower Future',
    pokemons: [PKM.ZUBAT, PKM.KADABRA, PKM.MAGNEMITE, PKM.GASTLY, PKM.DROWZEE, PKM.CLAYDOL, PKM.MISMAGIUS, PKM.BRONZONG, PKM.GOLBAT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  VAST_ICE_MOUNTAIN_PEAK: {
    id: 'VAST_ICE_MOUNTAIN_PEAK',
    name: 'Vast Ice Mountain Peak',
    pokemons: [PKM.GENGAR, PKM.AERODACTYL, PKM.SMOOCHUM, PKM.DUSCLOPS, PKM.ABSOL, PKM.METAGROSS, PKM.MAGNEZONE, PKM.GLISCOR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  VAST_ICE_MOUNTAIN: {
    id: 'VAST_ICE_MOUNTAIN',
    name: 'Vast Ice Mountain',
    pokemons: [PKM.GENGAR, PKM.AERODACTYL, PKM.SMOOCHUM, PKM.DUSCLOPS, PKM.ABSOL, PKM.METAGROSS, PKM.MAGNEZONE, PKM.GLISCOR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  AMP_PLAINS: {
    id: 'AMP_PLAINS',
    name: 'Amp Plains',
    pokemons: [PKM.PLUSLE, PKM.MINUN, PKM.MAREEP, PKM.PHANPY, PKM.ELEKID, PKM.SHINX, PKM.GIRAFARIG, PKM.ZAPDOS, PKM.FLAFFY, PKM.PIKACHU, PKM.PICHU, PKM.YANMEGA, PKM.ELECTABUZZ],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  FAR_AMP_PLAINS: {
    id: 'FAR_AMP_PLAINS',
    name: 'Far Amp Plains',
    pokemons: [PKM.SHINX, PKM.GIRAFARIG, PKM.PIKACHU, PKM.PICHU, PKM.YANMEGA, PKM.FLAFFY, PKM.ELECTABUZZ, PKM.TAUROS, PKM.DODRIO, PKM.ELECTRIKE, PKM.LUXIO, PKM.LUXRAY, PKM.AMPHAROS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  FINAL_MAZE_B23F: {
    id: 'FINAL_MAZE_B23F',
    name: 'Final Maze',
    pokemons: [PKM.MACHOP, PKM.MAGNEMITE, PKM.DODUO, PKM.OMANYTE, PKM.KABUTO, PKM.SPINARAK, PKM.MAREEP, PKM.MISDREAVUS, PKM.SWINUB, PKM.HOUNDOUR, PKM.PHANPY, PKM.MAGBY, PKM. POOCHYENA, PKM.SHROOMISH, PKM.MAWILE, PKM.MEDITITE, PKM.BAGON, PKM.STARAVIA, PKM.SKORUPI, PKM.CARNIVINE, PKM.JIRACHI, PKM.MOLTRES, PKM.SUICUNE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  FOGGY_FOREST: {
    id: 'FOGGY_FOREST',
    name: 'Foggy Forest',
    pokemons: [PKM.HOOTHOOT, PKM.DUNSPARCE, PKM.SMEARGLE, PKM.CHERUBI, PKM.SKIPLOOM, PKM.ZIGZAGOON, PKM.PACHIRISU, PKM.NOCTOWL, PKM.STANTLER, PKM.BUNEARY, PKM.PINSIR, PKM. BRELOOM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  FOREST_PATH: {
    id: 'FOREST_PATH',
    name: 'Forest Path',
    pokemons: [PKM.PINSIR, PKM.DUNSPARCE, PKM.SWINUB, PKM.HOUNDOUR, PKM.LINOONE, PKM.KRICKEROT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  GOLD_CHAMBER: {
    id: 'GOLD_CHAMBER',
    name: 'Gold Chamber',
    pokemons: [PKM.MACHOP, PKM.MAGNEMITE, PKM.DODUO, PKM.OMANYTE, PKM.KABUTO, PKM.SPINARAK, PKM.MAREEP, PKM.MISDREAVUS, PKM.SWINUB, PKM.HOUNDOUR, PKM.PHANPY, PKM.MAGBY, PKM. POOCHYENA, PKM.SHROOMISH, PKM.MAWILE, PKM.MEDITITE, PKM.BAGON, PKM.STARAVIA, PKM.SKORUPI, PKM.CARNIVINE, PKM.JIRACHI, PKM.MOLTRES, PKM.SUICUNE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  HIDDEN_HIGHLAND: {
    id: 'HIDDEN_HIGHLAND',
    name: 'Hidden Highland',
    pokemons: [PKM.DRAGONITE, PKM.MANECTRIC, PKM.TROPIUS, PKM.RAMPARDOS, PKM.BASTIODON, PKM.PURUGLY, PKM.GARCHOMP, PKM.ABOMASNOW, PKM.MAGMORTAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  MYSTERY_JUNGLE_01F_15F: {
    id: 'MYSTERY_JUNGLE_01F_15F',
    name: 'Mystery Jungle',
    pokemons: [PKM.MEW, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  MYSTERY_JUNGLE_16F_30F: {
    id: 'MYSTERY_JUNGLE_16F_30F',
    name: 'Mystery Jungle',
    pokemons: [PKM.MEW, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  MYSTIFYING_FOREST: {
    id: 'MYSTIFYING_FOREST',
    name: 'Mystifying Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  BEACH_CAVE: {
    id: 'BEACH_CAVE',
    name: 'Beach Cave',
    pokemons: [PKM.SHELLDER, PKM.SHELLOS, PKM.KABUTO, PKM.CORSOLA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
    type: TYPE.WATER
  },
  BOTTOMLESS_SEA: {
    id: 'BOTTOMLESS_SEA',
    name: 'Bottomless Sea',
    pokemons: [PKM.KYOGRE, PKM.GYARADOS, PKM.REMORAID, PKM.KINGDRA, PKM.WAILMER, PKM.CLAMPERL, PKM.FINNEON, PKM.TENTACRUEL, PKM.SLOWBRO, PKM.HORSEA, PKM.SEADRA, PKM.STARMIE, PKM.SLOWKING, PKM.LAPRAS, PKM.WAILORD],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
    type: TYPE.WATER
  },
  BRINE_CAVE: {
    id: 'BRINE_CAVE',
    name: 'Brine Cave',
    pokemons: [PKM.SEEL, PKM.OMANYTE, PKM.KINGLER, PKM.PELIPPER, PKM.GASTRODON, PKM.TENTACOOL, PKM.DEWGONG, PKM.STARYU, PKM.DRAGONAIR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  CONCEALED_RUINS: {
    id: 'CONCEALED_RUINS',
    name: 'Concealed Ruins',
    pokemons: [PKM.PIDGEY, PKM.VOLTORB, PKM.POOCHYENA, PKM.TAILOW, PKM.LOUDRED, PKM.NIDOQUEEN, PKM.WEEZING, PKM.MURKROW, PKM.DELCATTY, PKM.PIDGEOTTO, PKM.SHUPPET, PKM.ELECTRODE, PKM.EXPLOUD, PKM.RAIKOU, PKM.PIDGEOT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  CRAGGY_COAST: {
    id: 'CRAGGY_COAST',
    name: 'Craggy Coast',
    pokemons: [PKM.SPHEAL, PKM.KRABBY, PKM.DRATINI, PKM.WINGULL, PKM.GASTRODON, PKM.SEALEO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  CRYSTAL_CAVE_01F_05F: {
    id: 'CRYSTAL_CAVE_01F_05F',
    name: 'Crystal Cave',
    pokemons: [PKM.GRAVELER, PKM.SEVIPER, PKM.BELDUM, PKM.WORMADAN, PKM.RIOLU, PKM.CRANIDOS, PKM.DONPHAN, PKM.SHIELDON, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  CRYSTAL_CAVE_06F_11F: {
    id: 'CRYSTAL_CAVE_06F_11F',
    name: 'Crystal Cave',
    pokemons: [PKM.GRAVELER, PKM.SEVIPER, PKM.BELDUM, PKM.WORMADAN, PKM.RIOLU, PKM.CRANIDOS, PKM.DONPHAN, PKM.SHIELDON, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  CRYSTAL_CROSSING: {
    id: 'CRYSTAL_CROSSING',
    name: 'Crystal Crossing',
    pokemons: [PKM.FLOATZEL, PKM.BAGON, PKM.WORMADAN, PKM.GLAMEOW, PKM.ABSOL, PKM.GLALIE, PKM.FROSLASS, PKM.AZELF],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  DARK_CRATER: {
    id: 'DARK_CRATER',
    name: 'Dark Crater',
    pokemons: [PKM.CHARMANDER, PKM.CYNDAQUIL, PKM.HIPPOWDON, PKM.NUMEL, PKM.SLUGMA, PKM.GROWLITHE, PKM.PONYTA, PKM.TORCHIC, PKM.FLAREON, PKM.COMBUSKEN, PKM.RAPIDASH, PKM.MEWTWO, PKM.ARCANINE, PKM.QUILAVA, PKM.MAGCARGO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.FIRE
  },
  DEEP_DARK_CRATER: {
    id: 'DEEP_DARK_CRATER',
    name: 'Deep Dark Crater',
    pokemons: [PKM.CHARMELEON, PKM.QUILAVA, PKM.MONFERNO, PKM.CAMERUPT, PKM.COMBUSKEN, PKM.ARCANINE, PKM.RAPIDASH, PKM.FLAREON, PKM.MAGCARGO, PKM.RHYPERIOR, PKM.MAGMORTAR, PKM.CHARIZARD, PKM.TYPHLOSION, PKM.INFERNAPE, PKM.MISMAGIUS, PKM.BLAZIKEN, PKM.AGGRON, PKM.ENTEI],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.FIRE
  },
  DARK_HILL_01F_06F: {
    id: 'DARK_HILL_01F_06F',
    name: 'Dark Hill',
    pokemons: [PKM.GASTLY, PKM.HAUNTER, PKM.GENGAR, PKM.BANETTE, PKM.DUSCLOPS, PKM.CLAYDOL, PKM.MISMAGIUS, PKM.GLISCOR, PKM.MISDREAVUS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DARK_HILL_07F_15F: {
    id: 'DARK_HILL_07F_15F',
    name: 'Dark Hill',
    pokemons: [PKM.GASTLY, PKM.HAUNTER, PKM.GENGAR, PKM.BANETTE, PKM.DUSCLOPS, PKM.CLAYDOL, PKM.MISMAGIUS, PKM.GLISCOR, PKM.MISDREAVUS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DEEP_DUSK_FOREST_01F_06F: {
    id: 'DEEP_DUSK_FOREST_01F_06F',
    name: 'Deep Dusk Forest',
    pokemons: [PKM.VULPIX, PKM.RHYDON, PKM.STEELIX, PKM.AGGRON, PKM.LEAFEON, PKM.HIPPOWDON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  DEEP_DUSK_FOREST_07F_12F: {
    id: 'DEEP_DUSK_FOREST_07F_12F',
    name: 'Deep Dusk Forest',
    pokemons: [PKM.VULPIX, PKM.RHYDON, PKM.STEELIX, PKM.AGGRON, PKM.LEAFEON, PKM.HIPPOWDON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  DEEP_SEALED_RUIN: {
    id: 'DEEP_SEALED_RUIN',
    name: 'Deep Sealed Ruin',
    pokemons: [PKM.MUK, PKM.FORETRESS, PKM.SHELGON, PKM.METANG, PKM.TANGROWTH, PKM.PROBOPASS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.METAL
  },
  DRENCHED_BLUFF: {
    id: 'DRENCHED_BLUFF',
    name: 'Drenched Bluff',
    pokemons: [PKM.LILEEP, PKM.ANORITH, PKM.SHELLOS, PKM.CHINGLING],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  DUSK_FOREST_01F_04F: {
    id: 'DUSK_FOREST_01F_04F',
    name: 'Dusk Forest',
    pokemons: [PKM.JUMPLUFF, PKM.MOTHIM, PKM.MISMAGIUS, PKM.GABITE, PKM.HAUNTER, PKM.LICKITUNG, PKM.CLAYDOL, PKM.SALAMENCE, PKM.MISMAGIUS, PKM.HIPPOWDON, PKM.RHYPERIOR, PKM.DRIFLOON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  DUSK_FOREST_05F_08F: {
    id: 'DUSK_FOREST_05F_08F',
    name: 'Dusk Forest',
    pokemons: [PKM.JUMPLUFF, PKM.MOTHIM, PKM.MISMAGIUS, PKM.GABITE, PKM.HAUNTER, PKM.LICKITUNG, PKM.CLAYDOL, PKM.SALAMENCE, PKM.MISMAGIUS, PKM.HIPPOWDON, PKM.RHYPERIOR, PKM.DRIFLOON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GHOST
  },
  NORTHERN_DESERT_01F_07F: {
    id: 'NORTHERN_DESERT_01F_07F',
    name: 'Northern Desert',
    pokemons: [PKM.BALTOY, PKM.CUBONE, PKM.ARON, PKM.CACNEA, PKM.LARVITAR, PKM.SANDSHREW, PKM.TRAPINCH, PKM.CARNIVINE, PKM.RHYHORN, PKM.LAIRON, PKM.CACTURNE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  QUICKSAND_CAVE: {
    id: 'QUICKSAND_CAVE',
    name: 'Quicksand Cave',
    pokemons: [PKM.NINCADA, PKM.VIBRAVA, PKM.PUPITAR, PKM.SKORUPI, PKM.SANDSLASH, PKM.MAWILE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  QUICKSAND_PIT: {
    id: 'QUICKSAND_PIT',
    name: 'Quicksand Pit',
    pokemons: [PKM.MESPRIT, PKM.PUPITAR, PKM.SKORUPI, PKM.MAWILE, PKM.SANDSLASH, PKM.TYRANITAR, PKM.HIPPOPOTAS, PKM.NINJASK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  ROCK_AEGIS_CAVE: {
    id: 'ROCK_AEGIS_CAVE',
    name: 'Rock Aegis Cave',
    pokemons: [PKM.ZUBAT, PKM.GOLBAT, PKM.UNOWN, PKM.MACHOKE, PKM.MACHAMP, PKM.REGIROCK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.MINERAL
  },
  SURROUNDED_SEA: {
    id: 'SURROUNDED_SEA',
    name: 'Surrounded Sea',
    pokemons: [PKM.SHELLDER, PKM.CARVANHA, PKM.WAILMER, PKM.SLOWBRO, PKM.TENTACRUEL, PKM.STARMIE, PKM.QWILFISH, PKM.HORSEA, PKM.SEADRA, PKM.SLOWKING, PKM.REMORAID, PKM.OCTIRELLY, PKM.KINGDRA, PKM.CLAMPERL, PKM.FINNEON, PKM.LAPRAS, PKM.WAILORD, PKM.LUGIA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
    type: TYPE.WATER
  },
  TEMPORAL_SPIRE: {
    id: 'TEMPORAL_SPIRE',
    name: 'Temporal Spire',
    pokemons: [PKM.DIALGA, PKM.DEOXYS, PKM.BRONZONG, PKM.PORYGON, PKM.SALAMENCE, PKM.PORYGONZ, PKM.METAGROSS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.METAL
  },
  TEMPORAL_TOWER: {
    id: 'TEMPORAL_TOWER',
    name: 'Temporal Tower',
    pokemons: [PKM.PORYGON, PKM.LUNATONE, PKM.SOLROCK, PKM.BRONZOR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  TEST_DUNGEON: {
    id: 'TEST_DUNGEON',
    name: 'Test Dungeon',
    pokemons: [PKM.PORYGON, PKM.UNOWN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  THE_NIGHTMARE: {
    id: 'THE_NIGHTMARE',
    name: 'The Nightmare',
    pokemons: [PKM.SPOINK, PKM.CLEFFA, PKM.CLEFAIRY, PKM.JIGGLYPUFF, PKM.WYNAUT, PKM.SPINDA, PKM.LICKITUNG, PKM.ESPEON, PKM.WOOBUFFET, PKM.MILTANK, PKM.BLISSEY, PKM.WHISMUR, PKM.SKITTY, PKM.PERSIAN, PKM.IGGLYBUFF, PKM.CLEFABLE, PKM.WIGGLYTUFF, PKM.CHANSEY],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  TINY_MEADOW: {
    id: 'TINY_MEADOW',
    name: 'Tiny Meadow',
    pokemons: [PKM.SKIPLOOM, PKM.BRELOOM, PKM.STARAVIA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  TREESHROUD_FOREST_01F_08F: {
    id: 'TREESHROUD_FOREST_01F_08F',
    name: 'Treeshroud Forest',
    pokemons: [PKM.KADABRA, PKM.RALTS, PKM.CHERIM, PKM.HOUNDOOM, PKM.NINETALES, PKM.ALAKAZAM, PKM.KIRLIA, PKM.VESPIQUEEN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  TREESHROUD_FOREST_09F_21F: {
    id: 'TREESHROUD_FOREST_09F_21F',
    name: 'Treeshroud Forest',
    pokemons: [PKM.KADABRA, PKM.RALTS, PKM.CHERIM, PKM.HOUNDOOM, PKM.NINETALES, PKM.ALAKAZAM, PKM.KIRLIA, PKM.VESPIQUEEN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  STEAM_CAVE: {
    id: 'STEAM_CAVE',
    name: 'Steam Cave',
    pokemons: [PKM.SNUBULL, PKM.SLUGMA, PKM.MAGBY, PKM.NUMEL, PKM.FARFETCH, PKM.YANMEGA, PKM.KRICKETUNE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.FIRE
  },
  QUICKSAND_PIT_2: {
    id: 'QUICKSAND_PIT_2',
    name: 'Quicksand Pit',
    pokemons: [PKM.MESPRIT, PKM.PUPITAR, PKM.SKORUPI, PKM.MAWILE, PKM.SANDSLASH, PKM.TYRANITAR, PKM.HIPPOPOTAS, PKM.NINJASK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  LOWER_BRINE_CAVE: {
    id: 'LOWER_BRINE_CAVE',
    name: 'Lower Brine Cave',
    pokemons: [PKM.WALREIN, PKM.DRAGONAIR, PKM.STARYU, PKM.TENTACOOL, PKM.DEWGONG, PKM.GASTRODON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  HIDDEN_LAND: {
    id: 'HIDDEN_LAND',
    name: 'Hidden land',
    pokemons: [PKM.DRAGONITE, PKM.MANECTRIC, PKM.TROPIUS, PKM.RAMPARDOS, PKM.BASTIODON, PKM.PURUGLY, PKM.GARCHOMP, PKM.ABOMASNOW, PKM.MAGMORTAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  TEMPORAL_TOWER_2: {
    id: 'TEMPORAL_TOWER_2',
    name: 'Temporal Tower',
    pokemons: [PKM.PORYGON, PKM.LUNATONE, PKM.SOLROCK, PKM.BRONZOR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  CRYSTAL_CAVE_2: {
    id: 'CRYSTAL_CAVE_2',
    name: 'Crystal Cave',
    pokemons: [PKM.GRAVELER, PKM.SEVIPER, PKM.BELDUM, PKM.WORMADAN, PKM.RIOLU, PKM.CRANIDOS, PKM.DONPHAN, PKM.SHIELDON, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GROUND
  },
  WATERFALL_CAVE: {
    id: 'WATERFALL_CAVE',
    name: 'Waterfall Cave',
    pokemons: [PKM.PSYDUCK, PKM.POLIWAG, PKM.GRIMER, PKM.TANGELA, PKM.WOOPER, PKM.LOTAD, PKM.SURSKIT, PKM.BARBOACH, PKM.WHISCASH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  WORLD_ABYSS: {
    id: 'WORLD_ABYSS',
    name: 'World Abyss',
    pokemons: [PKM.GIRATINA, PKM.TAILOW, PKM.PIDGEY, PKM.MURKROW, PKM.VOLTORB, PKM.POOCHYENA, PKM.LOUDRED, PKM.PIDGEOTTO, PKM.NIDOQUEEN, PKM.ELECTRODE, PKM.WEEZING, PKM.UMBREON, PKM.DELCATTY, PKM.SWELLOW, PKM.EXPLOUD, PKM.MIGHTYENA, PKM.PIDGEOT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  ZERO_ISLE_EAST_15F_25F: {
    id: 'ZERO_ISLE_EAST_15F_25F',
    name: 'Zero Isle East',
    pokemons: [PKM.DEWGONG, PKM.SHELLDER, PKM.CORSOLA, PKM.KABUTO, PKM.AZUMARILL, PKM.SLOWPOKE, PKM.YANMA, PKM.TENTACRUEL, PKM.VOLTORB, PKM.SPEAROW, PKM.SEEDOT, PKM.GOLBAT, PKM.HOOTHOOT, PKM.WYNAUT, PKM.HOUNDOUR, PKM.WAILMER, PKM.MAGNETON, PKM.BEEDRILL, PKM.VULPIX, PKM.FERALIGATR, PKM.SPINARAK, PKM.SLUGMA, PKM.CHANSEY, PKM.KRABBY, PKM.MAGMAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  ZERO_ISLE_EAST_26F_40F: {
    id: 'ZERO_ISLE_EAST_26F_40F',
    name: 'Zero Isle East',
    pokemons: [PKM.DEWGONG, PKM.SHELLDER, PKM.CORSOLA, PKM.KABUTO, PKM.AZUMARILL, PKM.SLOWPOKE, PKM.YANMA, PKM.TENTACRUEL, PKM.VOLTORB, PKM.SPEAROW, PKM.SEEDOT, PKM.GOLBAT, PKM.HOOTHOOT, PKM.WYNAUT, PKM.HOUNDOUR, PKM.WAILMER, PKM.MAGNETON, PKM.BEEDRILL, PKM.VULPIX, PKM.FERALIGATR, PKM.SPINARAK, PKM.SLUGMA, PKM.CHANSEY, PKM.KRABBY, PKM.MAGMAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  ZERO_ISLE_SOUTH_01F_03F: {
    id: 'ZERO_ISLE_SOUTH_01F_03F',
    name: 'Zero Isle South',
    pokemons: [PKM.PIDGEY, PKM.JIGGLYPUFF, PKM.SHELLDER, PKM.SEADRA, PKM.STARYU, PKM.STARMIE, PKM.CHINGLING, PKM.CLEFFA, PKM.BELLSPROUT, PKM.EXEGGCUTE, PKM.CHINCHOU, PKM.POOCHYENA, PKM.NIDORANM, PKM.LARVITAR, PKM.RATTATA, PKM.TOGEPI, PKM.EEVEE, PKM.RALTS, PKM.BALTOY],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  ZERO_ISLE_SOUTH_04F_08F: {
    id: 'ZERO_ISLE_SOUTH_04F_08F',
    name: 'Zero Isle East',
    pokemons: [PKM.PIDGEY, PKM.JIGGLYPUFF, PKM.SHELLDER, PKM.SEADRA, PKM.STARYU, PKM.STARMIE, PKM.CHINGLING, PKM.CLEFFA, PKM.BELLSPROUT, PKM.EXEGGCUTE, PKM.CHINCHOU, PKM.POOCHYENA, PKM.NIDORANM, PKM.LARVITAR, PKM.RATTATA, PKM.TOGEPI, PKM.EEVEE, PKM.RALTS, PKM.BALTOY],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.NORMAL
  },
  BURIED_RELIC_1F_20F: {
    id: 'BURIED_RELIC_1F_20F',
    name: 'Buried Relic',
    pokemons: [PKM.GOLBAT, PKM.SNEASEL, PKM.WYNAUT, PKM.RATICATE, PKM.MACHOP, PKM.WHISMUR, PKM.HOOTHOOT, PKM.PORYGON, PKM.PORYGON2, PKM.ARON, PKM.REGIROCK, PKM.GEODUDE, PKM.REGISTEEL, PKM.REGICE, PKM.KADABRA, PKM.MEW, PKM.SHEDNINJA, PKM.SANDSHREW, PKM.MAWILE, PKM.GRAVELER, PKM.HAUNTER, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  BURIED_RELIC_21F_50F: {
    id: 'BURIED_RELIC_21F_50F',
    name: 'Buried Relic',
    pokemons: [PKM.GOLBAT, PKM.SNEASEL, PKM.WYNAUT, PKM.RATICATE, PKM.MACHOP, PKM.WHISMUR, PKM.HOOTHOOT, PKM.PORYGON, PKM.PORYGON2, PKM.ARON, PKM.REGIROCK, PKM.GEODUDE, PKM.REGISTEEL, PKM.REGICE, PKM.KADABRA, PKM.MEW, PKM.SHEDNINJA, PKM.SANDSHREW, PKM.MAWILE, PKM.GRAVELER, PKM.HAUNTER, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  BURIED_RELIC_51F_99F: {
    id: 'BURIED_RELIC_51F_99F',
    name: 'Buried Relic',
    pokemons: [PKM.GOLBAT, PKM.SNEASEL, PKM.WYNAUT, PKM.RATICATE, PKM.MACHOP, PKM.WHISMUR, PKM.HOOTHOOT, PKM.PORYGON, PKM.PORYGON2, PKM.ARON, PKM.REGIROCK, PKM.GEODUDE, PKM.REGISTEEL, PKM.REGICE, PKM.KADABRA, PKM.MEW, PKM.SHEDNINJA, PKM.SANDSHREW, PKM.MAWILE, PKM.GRAVELER, PKM.HAUNTER, PKM.GOLEM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  DARKNIGHT_RELIC: {
    id: 'DARKNIGHT_RELIC',
    name: 'Darknight Relic',
    pokemons: [PKM.SHUPPET, PKM.GASTLY, PKM.MISDREAVUS, PKM.SHEDNINJA, PKM.SABLEYE, PKM.BANETTE, PKM.HAUNTER, PKM.DUSKULL, PKM.GENGAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GHOST
  },
  SHIMMER_DESERT: {
    id: 'SHIMMER_DESERT',
    name: 'Shimmer Desert',
    pokemons: [PKM.EKANS, PKM.ARBOK, PKM.SANDSHREW, PKM.SANDSLASH, PKM.NIDOKING, PKM.DIGLETT, PKM.DUGTRIO, PKM.SUDOWOODO, PKM.GARCHOMP, PKM.RHYPERIOR, PKM.GROUDON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  UNOWN_RELIC: {
    id: 'UNOWN_RELIC',
    name: 'Unown Relic',
    pokemons: [PKM.UNOWN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  FROSTY_FOREST: {
    id: 'FROSTY_FOREST',
    name: 'Frosty Forest',
    pokemons: [PKM.AZURILL, PKM.FURRET, PKM.NOSEPASS, PKM.PILOSWINE, PKM.MIGHTYENA, PKM.LAIRON, PKM.SNORUNT, PKM.ARTICUNO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.ICE
  },
  GREAT_CANYON: {
    id: 'GREAT_CANYON',
    name: 'Great Canyon',
    pokemons: [PKM.SKIPLOOM, PKM.DUNSPARCE, PKM.PHANPY, PKM.DODUO, PKM.VILEPLUME, PKM.BRELOOM, PKM.MURKROW, PKM.CACTURNE, PKM.NOCTOWL, PKM.ARIADOS, PKM.TAUROS, PKM.HOUNDOOM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  HOWLING_FOREST_01F_06F: {
    id: 'HOWLING_FOREST_01F_06F',
    name: 'Howling Forest',
    pokemons: [PKM.AZURILL, PKM.HOUNDOUR, PKM.POOCHYENA, PKM.WHISMUR, PKM.SPOINK, PKM.FURRET, PKM.PIDGEY, PKM.LOUDRED, PKM.HOUNDOOM, PKM.MIGHTYENA, PKM.GRUMPIG, PKM.SNORLAX, PKM.EXEGGCUTE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  HOWLING_FOREST_07F_15F: {
    id: 'HOWLING_FOREST_07F_15F',
    name: 'Howling Forest',
    pokemons: [PKM.AZURILL, PKM.HOUNDOUR, PKM.POOCHYENA, PKM.WHISMUR, PKM.SPOINK, PKM.FURRET, PKM.PIDGEY, PKM.LOUDRED, PKM.HOUNDOOM, PKM.MIGHTYENA, PKM.GRUMPIG, PKM.SNORLAX, PKM.EXEGGCUTE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  MT_FARAWAY: {
    id: 'MT_FARAWAY',
    name: 'Mt Faraway',
    pokemons: [PKM.LUNATONE, PKM.SNORUNT, PKM.SOLROCK, PKM.AZUMARILL, PKM.GOLEM, PKM.MARSHTOMP, PKM.VIGOROTH, PKM.GRANBULL, PKM.WEEZING, PKM.DUGTRIO, PKM.GLALIE, PKM.HOOH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.ICE
  },
  MT_FARAWAY_10F_20F: {
    id: 'MT_FARAWAY_10F_20F',
    name: 'Mt Faraway',
    pokemons: [PKM.LUNATONE, PKM.SNORUNT, PKM.SOLROCK, PKM.AZUMARILL, PKM.GOLEM, PKM.MARSHTOMP, PKM.VIGOROTH, PKM.GRANBULL, PKM.WEEZING, PKM.DUGTRIO, PKM.GLALIE, PKM.HOOH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.ICE
  },
  MT_FARAWAY_30F_39F: {
    id: 'MT_FARAWAY_30F_39F',
    name: 'Mt Faraway',
    pokemons: [PKM.LUNATONE, PKM.SNORUNT, PKM.SOLROCK, PKM.AZUMARILL, PKM.GOLEM, PKM.MARSHTOMP, PKM.VIGOROTH, PKM.GRANBULL, PKM.WEEZING, PKM.DUGTRIO, PKM.GLALIE, PKM.HOOH],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.ICE
  },
  JOYOUS_TOWER: {
    id: 'JOYOUS_TOWER',
    name: 'Joyous Tower',
    pokemons: [PKM.JIGGLYPUFF, PKM.TREECKO, PKM.BULBASAUR, PKM.TAILOW, PKM.PICHU, PKM.DIGLETT, PKM.SPINDA, PKM.PLUSLE, PKM.MINUN, PKM.METAPOD, PKM.CHIKORITA, PKM.PSYDUCK, PKM.KAKUNA, PKM.CLEFAIRY, PKM.TORCHIC, PKM.EEVEE, PKM.CYNDAQUIL, PKM.BELDUM, PKM.SCYTHER, PKM.SLAKOTH, PKM.TRAPINCH, PKM.CLEFABLE, PKM.HOUNDOUR, PKM.SPINARAK, PKM.GARDEVOIR, PKM.BELLOSSOM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  LAPIS_CAVE: {
    id: 'LAPIS_CAVE',
    name: 'Lapis Cave',
    pokemons: [PKM.ZUBAT, PKM.NINCADA, PKM.NIDORINA, PKM.NIDORINO, PKM.TANGELA, PKM.BAGON, PKM.GOLBAT],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.POISON
  },
  LIGHTNING_FIELD: {
    id: 'LIGHTNING_FIELD',
    name: 'Lightning Field',
    pokemons: [PKM.MAREEP, PKM.ELECTRIKE, PKM.MAGNEMITE, PKM.PIKACHU, PKM.FLAFFY, PKM.PLUSLE, PKM.MINUN, PKM.JOLTEON, PKM.CACTURNE, PKM.ELECTRODE, PKM.ELEKID, PKM.MAGNETON, PKM.AMPHAROS, PKM.MANECTRIC, PKM.RAICHU, PKM.RAIKOU],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  MAGMA_CAVERN_08F_17F: {
    id: 'MAGMA_CAVERN_08F_17F',
    name: 'Magma Cavern',
    pokemons: [PKM.RATICATE, PKM.SANDSHREW, PKM.NIDOQUEEN, PKM.NIDOKING, PKM.GRAVELER, PKM.MAGMAR, PKM.MAWILE, PKM.ARBOK, PKM.MAGCARGO, PKM.SANDSLASH, PKM.GOLEM, PKM.GRIMER, PKM.ONIX],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.FIRE
  },
  MAGMA_CAVERN_18F_23F: {
    id: 'MAGMA_CAVERN_18F_23F',
    name: 'Magma Cavern',
    pokemons: [PKM.GROUDON, PKM.RATICATE, PKM.SANDSHREW, PKM.NIDOQUEEN, PKM.NIDOKING, PKM.GRAVELER, PKM.MAGMAR, PKM.MAWILE, PKM.ARBOK, PKM.MAGCARGO, PKM.SANDSLASH, PKM.GOLEM, PKM.GRIMER, PKM.ONIX],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.FIRE
  },
  METEOR_CAVE: {
    id: 'METEOR_CAVE',
    name: 'Meteor Cave',
    pokemons: [PKM.DEOXYS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  MT_BLAZE: {
    id: 'MT_BLAZE',
    name: 'Mt Blaze',
    pokemons: [PKM.PIDGEOT, PKM.MAGBY, PKM.NUMEL, PKM.SLUGMA, PKM.RAPIDASH, PKM.FEAROW, PKM.ARCANINE, PKM.MOLTRES],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.FIRE
  },
  MT_STEEL_01F_05F: {
    id: 'MT_STEEL_01F_05F',
    name: 'Mt Steel',
    pokemons: [PKM.SPEAROW, PKM.BALTOY, PKM.ZIGZAGOON, PKM.ARON, PKM.GEODUDE, PKM.MEDITITE, PKM.BELDUM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.METAL
  },
  MT_STEEL_06F_08F: {
    id: 'MT_STEEL_06F_08F',
    name: 'Mt Steel',
    pokemons: [PKM.SPEAROW, PKM.BALTOY, PKM.ZIGZAGOON, PKM.ARON, PKM.GEODUDE, PKM.MEDITITE, PKM.BELDUM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.METAL
  },
  MT_FREEZE: {
    id: 'MT_FREEZE',
    name: 'Mt Freeze',
    pokemons: [PKM.SWABLU, PKM.SHELGON, PKM.PUPITAR, PKM.SEEL, PKM.VIGOROTH, PKM.SLAKING, PKM.SEVIPER],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.ICE
  },
  MT_THUNDER_PEAK: {
    id: 'MT_THUNDER_PEAK',
    name: 'Mt Thunder Peak',
    pokemons: [PKM.WEEDLE, PKM.NIDORANM, PKM.ELECTRIKE, PKM.CACNEA, PKM.PIDGEOTTO, PKM.BEEDRILL, PKM.ELECTABUZZ, PKM.STANTLER, PKM.AMPHAROS, PKM.MANECTRIC, PKM.GROWLITHE, PKM.ZAPDOS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  MT_THUNDER: {
    id: 'MT_THUNDER',
    name: 'Mt Thunder',
    pokemons: [PKM.WEEDLE, PKM.NIDORANM, PKM.ELECTRIKE, PKM.CACNEA, PKM.PIDGEOTTO, PKM.BEEDRILL, PKM.ELECTABUZZ, PKM.STANTLER, PKM.AMPHAROS, PKM.MANECTRIC, PKM.GROWLITHE, PKM.ZAPDOS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  MURKY_CAVE: {
    id: 'MURKY_CAVE',
    name: 'Murky Cave',
    pokemons: [PKM.ZUBAT, PKM.SEVIPER, PKM.GRIMER, PKM.GOLBAT, PKM.SHEDNINJA, PKM.SHUPPET, PKM.CROBAT, PKM.MISDREAVUS, PKM.MUK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.POISON
  },
  NORMAL_MAZE: {
    id: 'NORMAL_MAZE',
    name: 'Normal Maze',
    pokemons: [PKM.RATICATE, PKM.FARFETCH, PKM.FURRET],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.NORMAL
  },
  NORTHERN_RANGE_01F_07F: {
    id: 'NORTHERN_RANGE_01F_07F',
    name: 'Northern Range',
    pokemons: [PKM.HOOTHOOT, PKM.DODRIO, PKM.NINJASK, PKM.SPINARAK, PKM.SWELLOW, PKM.PIDGEOT, PKM.FEAROW, PKM.TOGETIC, PKM.LATIOS, PKM.SEVIPER],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.FLYING
  },
  NORTHERN_RANGE_08F_16F: {
    id: 'NORTHERN_RANGE_08F_16F',
    name: 'Northern Range',
    pokemons: [PKM.HOOTHOOT, PKM.DODRIO, PKM.NINJASK, PKM.SPINARAK, PKM.SWELLOW, PKM.PIDGEOT, PKM.FEAROW, PKM.TOGETIC, PKM.LATIOS, PKM.SEVIPER],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.FLYING
  },
  NORTHWIND_FIELD: {
    id: 'NORTHWIND_FIELD',
    name: 'Northwind Field',
    pokemons: [PKM.AZUMARILL, PKM.DELCATTY, PKM.VAPOREON, PKM.POLIWHIRL, PKM.MUK, PKM.POLITOED, PKM.ABSOL, PKM.CROCONAW, PKM.WARTORTLE, PKM.SUICUNE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.WATER
  },
  PITFALL_VALLEY: {
    id: 'PITFALL_VALLEY',
    name: 'Pitfall Valley',
    pokemons: [PKM.PIDGEOT, PKM.FARFETCH, PKM.SWELLOW, PKM.HOPPIP, PKM.BUTTERFREE, PKM.RATICATE, PKM.DODUO, PKM.SWABLU, PKM.YANMA, PKM.MASQUERAIN, PKM.SKIPLOOM, PKM.AERODACTYL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.FLYING
  },
  POISON_MAZE: {
    id: 'POISON_MAZE',
    name: 'Poison Maze',
    pokemons: [PKM.NIDORANF, PKM.NIDORANM, PKM.NIDORINO, PKM.NIDORINA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.POISON
  },
  PURITY_FOREST_04F_07F: {
    id: 'PURITY_FOREST_04F_07F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_13F_20F: {
    id: 'PURITY_FOREST_13F_20F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_30F_43F: {
    id: 'PURITY_FOREST_30F_43F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_44F_60F: {
    id: 'PURITY_FOREST_44F_60F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_61F_79F: {
    id: 'PURITY_FOREST_61F_79F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_61F_79F: {
    id: 'PURITY_FOREST_61F_79F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GRASS
  },
  PURITY_FOREST_80F_99F: {
    id: 'PURITY_FOREST_80F_99F',
    name: 'Purity Forest',
    pokemons: [PKM.CELEBI, PKM.DARKRAI, PKM.BULBASAUR, PKM.IVYSAUR, PKM.VENUSAUR, PKM.METAPOD, PKM.RATTATA, PKM.RATICATE, PKM.SPEAROW, PKM.NIDORANF, PKM.NIDORANM, PKM.VILEPLUME, PKM.BELLSPROUT, PKM.WEEPINBELL, PKM.VICTREEBEL, PKM.EXEGGCUTE, PKM.KOFFING, PKM.SCYTHER, PKM.CHIKORITA, PKM.BAYLEEF, PKM.MEGANIUM, PKM.TREECKO, PKM.GROVYLE, PKM.SCEPTILE, PKM.SEEDOT, PKM.NUZLEAF, PKM.ROSELIA, PKM.FLYGON, PKM.MUNCHLAX, PKM.TURTWIG, PKM.GROTLE, PKM.TORTERRA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GRASS
  },
  RESCUE_TEAM_MAZE: {
    id: 'RESCUE_TEAM_MAZE',
    name: 'Rescue Team Maze',
    pokemons: [PKM.PIDGEY, PKM.RATTATA, PKM.VOLTORB, PKM.EXEGGCUTE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.NORMAL
  },
  ROCK_PATH: {
    id: 'ROCK_PATH',
    name: 'Rock Path',
    pokemons: [PKM.PIDGEOT, PKM.NIDORINA, PKM.NIDORINO, PKM.ZUBAT, PKM.NUMEL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.POISON
  },
  SILENT_CHASM: {
    id: 'SILENT_CHASM',
    name: 'Silent Chasm',
    pokemons: [PKM.FARFETCH, PKM.WEEDLE, PKM.YANMA, PKM.GLOOM, PKM.HOUNDOUR, PKM.POLIWAG, PKM.SPINARAK, PKM.TRAPINCH, PKM.BEEDRILL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.BUG
  },
  SILVER_TRENCH: {
    id: 'SILVER_TRENCH',
    name: 'Silver Trench',
    pokemons: [PKM.LUGIA, PKM.DEWGONG, PKM.SHELLDER, PKM.CORSOLA, PKM.KABUTO, PKM.AZUMARILL, PKM.SLOWPOKE, PKM.YANMA, PKM.TENTACRUEL, PKM.VOLTORB, PKM.SPEAROW, PKM.SEEDOT, PKM.GOLBAT, PKM.HOOTHOOT, PKM.WYNAUT, PKM.HOUNDOUR, PKM.WAILMER, PKM.MAGNETON, PKM.BEEDRILL, PKM.VULPIX, PKM.FERALIGATR, PKM.SPINARAK, PKM.SLUGMA, PKM.CHANSEY, PKM.KRABBY, PKM.MAGMAR],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
    type: TYPE.WATER
  },
  SINISTER_WOODS: {
    id: 'SINISTER_WOODS',
    name: 'Sinister Woods',
    pokemons: [PKM.SWINUB, PKM.ODDISH, PKM.SUDOWOODO, PKM.SENTRET, PKM.SHROOMISH, PKM.WOOPER, PKM.SCYTHER, PKM.HOOTHOOT, PKM.SLAKOTH, PKM.EKANS, PKM.GENGAR, PKM.MEDICHAM],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.BUG
  },
  SKY_TOWER: {
    id: 'SKY_TOWER',
    name: 'Sky Tower',
    pokemons: [PKM.SHEDNINJA, PKM.SHUPPET, PKM.LUNATONE, PKM.RAYQUAZA, PKM.DUSKULL, PKM.KOFFING, PKM.ALTARIA, PKM.SOLROCK, PKM.SCIZOR, PKM.DUSCLOPS, PKM.FLYGON, PKM.TROPIUS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.FLYING
  },
  SNOW_PATH: {
    id: 'SNOW_PATH',
    name: 'Snow Path',
    pokemons: [PKM.AZURILL, PKM.FURRET, PKM.NOSEPASS],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.ICE
  },
  SOLAR_CAVE: {
    id: 'SOLAR_CAVE',
    name: 'Solar Cave',
    pokemons: [PKM.WYNAUT, PKM.GIRAFARIG, PKM.BELDUM, PKM.DROWZEE, PKM.SPOINK, PKM.ABRA, PKM.MEDITITE, PKM.LUNATONE, PKM.METANG, PKM.HYPNO, PKM.KIRLIA, PKM.KADABRA, PKM.MEDICHAM, PKM.GRUMPIG, PKM.CLAYDOL],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PSYCHIC
  },
  SOUTHERN_CAVERN_01F_23F: {
    id: 'SOUTHERN_CAVERN_01F_23F',
    name: 'Southern Cavern',
    pokemons: [PKM.GEODUDE, PKM.DIGLETT, PKM.SEEDOT, PKM.CUBONE, PKM.NIDOKING, PKM.PHANPY, PKM.VIBRAVA, PKM.BALTOY, PKM.LARVITAR, PKM.ARIADOS, PKM.DUGTRIO, PKM.MAROWAK, PKM.GRAVELER, PKM.RHYHORN, PKM.FLYGON, PKM.DONPHAN, PKM.PUPITAR, PKM.GOLEM, PKM.ONIX, PKM.RHYDON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.GROUND
  },
  SOUTHERN_CAVERN_24F_50F: {
    id: 'SOUTHERN_CAVERN_24F_50F',
    name: 'Southern Cavern',
    pokemons: [PKM.GEODUDE, PKM.DIGLETT, PKM.SEEDOT, PKM.CUBONE, PKM.NIDOKING, PKM.PHANPY, PKM.VIBRAVA, PKM.BALTOY, PKM.LARVITAR, PKM.ARIADOS, PKM.DUGTRIO, PKM.MAROWAK, PKM.GRAVELER, PKM.RHYHORN, PKM.FLYGON, PKM.DONPHAN, PKM.PUPITAR, PKM.GOLEM, PKM.ONIX, PKM.RHYDON],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.GROUND
  },
  STORMY_SEA_01F_16F: {
    id: 'STORMY_SEA_01F_16F',
    name: 'Stormy Sea',
    pokemons: [PKM.WINGULL, PKM.TENTACRUEL, PKM.TENTACOOL, PKM.SHELLDER, PKM.OMANYTE, PKM.OMASTAR, PKM.SLOWPOKE, PKM.SPHEAL, PKM.OMASTAR, PKM.GRIMER, PKM.KABUTOPS, PKM.ARMALDO, PKM.SEADRA, PKM.STARMIE, PKM.SEALEO, PKM.KYOGRE, PKM.CARVANHA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
    type: TYPE.WATER
  },
  STORMY_SEA_16F_39F: {
    id: 'STORMY_SEA_16F_39F',
    name: 'Stormy Sea',
    pokemons: [PKM.WINGULL, PKM.TENTACRUEL, PKM.TENTACOOL, PKM.SHELLDER, PKM.OMANYTE, PKM.OMASTAR, PKM.SLOWPOKE, PKM.SPHEAL, PKM.OMASTAR, PKM.GRIMER, PKM.KABUTOPS, PKM.ARMALDO, PKM.SEADRA, PKM.STARMIE, PKM.SEALEO, PKM.KYOGRE, PKM.CARVANHA],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
    type: TYPE.WATER
  },
  THUNDERWAVE_CAVE: {
    id: 'THUNDERWAVE_CAVE',
    name: 'Thunderwave Cave',
    pokemons: [PKM.RATTATA, PKM.NIDORANM, PKM.POOCHYENA, PKM.VOLTORB, PKM.ELEKID, PKM.PLUSLE, PKM.MINUN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.ELECTRIC
  },
  TINY_WOODS: {
    id: 'TINY_WOODS',
    name: 'Tiny Woods',
    pokemons: [PKM.RATTATA, PKM.RATTATA, PKM.SANDSHREW, PKM.SPINARAK],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.NORMAL
  },
  UPROAR_FOREST: {
    id: 'UPROAR_FOREST',
    name: 'Uproar Forest',
    pokemons: [PKM.ROSELIA, PKM.NUZLEAF, PKM.LOTAD, PKM.RATICATE, PKM.GRIMER, PKM.NOCTOWL, PKM.KOFFING],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
    type: TYPE.GRASS
  },
  SERENITY_RIVER: {
    id: 'SERENITY_RIVER',
    name: 'Serenity River',
    pokemons: [PKM.POLIWAG, PKM.WOOPER, PKM.LOTAD, PKM.BARBOACH, PKM.MASQUERAIN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.WATER
  },
  WATERFALL_POND: {
    id: 'WATERFALL_POND',
    name: 'Waterfall Pond',
    pokemons: [PKM.MUDKIP, PKM.LOTAD, PKM.POLIWAG, PKM.BARBOACH, PKM.WOOPER, PKM.TOTODILE, PKM.SURSKIT, PKM.MAGIKARP, PKM.SQUIRTLE, PKM.LOMBRE, PKM.MARSHTOMP, PKM.WHISCASH, PKM.MASQUERAIN],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.WATER
  },
  WESTERN_CAVE_B01F_B27F: {
    id: 'WESTERN_CAVE_B01F_B27F',
    name: 'Western Cave',
    pokemons: [PKM.MURKROW, PKM.BUTTERFREE, PKM.EKANS, PKM.MEOWTH, PKM.BELLOSSOM, PKM.EXPLOUD, PKM.IGGLYBUFF, PKM.TAUROS, PKM.MILTANK, PKM.ESPEON, PKM.IVYSAUR, PKM.ARBOK, PKM.AGGRON, PKM.PERSIAN, PKM.DODRIO, PKM.BAYLEEF, PKM.ALAKAZAM, PKM.TYRANITAR, PKM.SCEPTILE, PKM.ARCANINE, PKM.SWAMPERT, PKM.MACHAMP, PKM.STEELIX, PKM.CHARIZARD, PKM.BLASTOISE, PKM.MEWTWO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PYSCHIC
  },
  WESTERN_CAVE_B28F_B39F: {
    id: 'WESTERN_CAVE_B28F_B39F',
    name: 'Western Cave',
    pokemons: [PKM.MURKROW, PKM.BUTTERFREE, PKM.EKANS, PKM.MEOWTH, PKM.BELLOSSOM, PKM.EXPLOUD, PKM.IGGLYBUFF, PKM.TAUROS, PKM.MILTANK, PKM.ESPEON, PKM.IVYSAUR, PKM.ARBOK, PKM.AGGRON, PKM.PERSIAN, PKM.DODRIO, PKM.BAYLEEF, PKM.ALAKAZAM, PKM.TYRANITAR, PKM.SCEPTILE, PKM.ARCANINE, PKM.SWAMPERT, PKM.MACHAMP, PKM.STEELIX, PKM.CHARIZARD, PKM.BLASTOISE, PKM.MEWTWO],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PYSCHIC
  },
  WISH_CAVE_01F_13F: {
    id: 'WISH_CAVE_01F_13F',
    name: 'Wish Cave',
    pokemons: [PKM.MURKROW, PKM.BUTTERFREE, PKM.EKANS, PKM.MEOWTH, PKM.BELLOSSOM, PKM.EXPLOUD, PKM.IGGLYBUFF, PKM.TAUROS, PKM.MILTANK, PKM.ESPEON, PKM.IVYSAUR, PKM.ARBOK, PKM.AGGRON, PKM.PERSIAN, PKM.DODRIO, PKM.BAYLEEF, PKM.ALAKAZAM, PKM.TYRANITAR, PKM.SCEPTILE, PKM.ARCANINE, PKM.SWAMPERT, PKM.MACHAMP, PKM.STEELIX, PKM.CHARIZARD, PKM.BLASTOISE, PKM.JIRACHI],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
    type: TYPE.PYSCHIC
  },
  WISH_CAVE_90F_99F: {
    id: 'WISH_CAVE_90F_99F',
    name: 'Wish Cave',
    pokemons: [PKM.MURKROW, PKM.BUTTERFREE, PKM.EKANS, PKM.MEOWTH, PKM.BELLOSSOM, PKM.EXPLOUD, PKM.IGGLYBUFF, PKM.TAUROS, PKM.MILTANK, PKM.ESPEON, PKM.IVYSAUR, PKM.ARBOK, PKM.AGGRON, PKM.PERSIAN, PKM.DODRIO, PKM.BAYLEEF, PKM.ALAKAZAM, PKM.TYRANITAR, PKM.SCEPTILE, PKM.ARCANINE, PKM.SWAMPERT, PKM.MACHAMP, PKM.STEELIX, PKM.CHARIZARD, PKM.BLASTOISE, PKM.JIRACHI],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.PYSCHIC
  },
  WYVERN_HILL: {
    id: 'WYVERN_HILL',
    name: 'Wyvern Hill',
    pokemons: [PKM.BAGON, PKM.DRATINI, PKM.ALTARIA, PKM.TOTODILE, PKM.LUDICOLO, PKM.SHELGON, PKM.VIBRAVA, PKM.DRAGONAIR, PKM.SALAMENCE, PKM.FLYGON, PKM.DRAGONITE],
    tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
    type: TYPE.DRAGON
  }
});

const MASK_COORDINATE = Object.freeze({
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

const MASK_TABLE = Object.freeze({
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

const TERRAIN = Object.freeze({
  GROUND: 0,
  WALL: 1,
  WATER: 2
});

const ID_TABLE = {
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

const BASIC_ITEM = {
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

const ITEM = {
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

const ITEM_NAME = Object.freeze({
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

const ITEM_DESCRIPTION = Object.freeze({
  FOSSIL_STONE: 'Give it to a Ditto to obtain a random fossil',
  TWISTED_SPOON: '+1 spell attack damage',
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
  CHOICE_SPECS: 'The holder gains 8 spell damage',
  SOUL_DEW: 'During combat, the holder gains 3 spell damage every 5 seconds',
  UPGRADE: 'Attacks grant +6% bonus Attack Speed for the rest of combat',
  REAPER_CLOTH: 'The holder spells can critically strike (20% chance, 2x damage)',
  POKEMONOMICON: 'When the holder deals damage with their Ability, they burn and wound the target for 3 seconds',
  WATER_INCENSE: 'When an ennemy cast an ability, they take incense damage equal to 20% of their max mana',
  SHELL_BELL: 'The holder spells heal for 40% of the damage dealt',
  LUCKY_EGG: 'When combat begins, the holder and all allies within 2 hexes in the same row gain 20 shield points',
  AQUA_EGG: 'The holder gains 50 mana. After casting their ability the holder gains 20 mana',
  BLUE_ORB: 'The holder gains 10% bonus Attack Speed. Every third attack from the holder unleashes a chain lightning that bounces to 4 enemies, dealing 8 magic damage',
  ZOOM_LENS: 'The holder gains 4 attack damage and 4 spell damage',
  BRIGHT_POWDER: 'Every 5 seconds, the holder throws a bright powder within 1 hex, healing them for 18% of their missing health',
  DELTA_ORB: 'When combat begins, the holder and all allies within 1 hex in the same row gain 3 Ability Power for the rest of combat',
  MANA_SCARF: 'The holder attacks restore 8 additional mana',
  SMOKE_BALL: 'Reduce the attack speed of ennemy attackers by 30% for 5 seconds',
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
  ASSAULT_VEST: 'Grants 15 bonus special defense',
  KINGS_ROCK: 'Physical damage heals the holder for 33% of the damage dealt',
  POKE_DOLL: 'The holder gains 5 Armor and 5 Magic Resist',
  RED_ORB: 'The holder gains 8 bonus Attack Damage',
  MAX_REVIVE: 'Prevents the holder first death',
  ROCKY_HELMET: 'Grants 10 bonus armor. Negates bonus damage from incoming critical hits.'
});

const ITEM_RECIPE = {
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

module.exports = {
  BASIC_ITEM,
  ITEM_RECIPE,
  ITEM,
  ID_TABLE,
  TERRAIN,
  MASK_COORDINATE,
  MASK_TABLE,
  HDR,
  MAP,
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
  TYPE,
  RARITY,
  RARITY_HP_COST,
  COST,
  EXP_TABLE,
  STATE,
  STATE_TYPE,
  ORIENTATION,
  ORIENTATION_RAD,
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
  PRECOMPUTED_TYPE_POKEMONS_ALL,
  PRECOMPUTED_RARITY_POKEMONS_ALL
};
