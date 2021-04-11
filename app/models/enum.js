const PKM = Object.freeze({
  DITTO: "ditto",
  BULBASAUR: "bulbasaur",
  IVYSAUR: "ivysaur",
  VENUSAUR: "venusaur",
  CHARMANDER: "charmander",
  CHARMELEON: "charmeleon",
  CHARIZARD: "charizard",
  SQUIRTLE: "squirtle",
  WARTORTLE: "wartortle",
  BLASTOISE: "blastoise",
  GEODUDE: "geodude",
  GRAVELER: "graveler",
  GOLEM: "golem",
  AZURILL: "azurill",
  MARILL: "marill",
  AZUMARILL: "azumarill",
  ZUBAT: "zubat",
  GOLBAT: "golbat",
  CROBAT: "crobat",
  MAREEP: "mareep",
  FLAFFY: "flaffy",
  AMPHAROS: "ampharos",
  CLEFFA: "cleffa",
  CLEFAIRY: "clefairy",
  CLEFABLE: "clefable",
  IGGLYBUFF: "igglybuff",
  WIGGLYTUFF: "wygglytuff",
  JIGGLYPUFF: "jigglypuff",
  CATERPIE: "caterpie",
  METAPOD: "metapod",
  BUTTERFREE: "butterfree",
  WEEDLE: "weedle",
  KAKUNA: "kakuna",
  BEEDRILL: "beedrill",
  PIDGEY: "pidgey",
  PIDGEOTTO: "pidgeotto",
  PIDGEOT: "pidgeot",
  HOPPIP: "hoppip",
  SKIPLOOM: "skiploom",
  JUMPLUFF: "jumpluff",
  SEEDOT: "seedot",
  NUZLEAF: "nuzleaf",
  SHIFTRY: "shiftry",
  STARLY: "starly",
  STARAVIA: "staravia",
  STARAPTOR: "staraptor",
  CHIKORITA: "chikorita",
  BAYLEEF: "bayleef",
  MEGANIUM: "meganium",
  CYNDAQUIL: "cyndaquil",
  QUILAVA: "quilava",
  TYPHLOSION: "typlosion",
  TOTODILE: "totodile",
  CROCONAW: "croconaw",
  FERALIGATR: "feraligatr",
  TREECKO: "treecko",
  GROVYLE: "grovyle",
  SCEPTILE: "sceptile",
  TORCHIC: "torchic",
  COMBUSKEN: "combusken",
  BLAZIKEN: "blaziken",
  MUDKIP: "mudkip",
  MARSHTOMP: "marshtomp",
  SWAMPERT: "swampert",
  TURTWIG: "turtwig",
  GROTLE: "grotle",
  TORTERRA: "torterra",
  CHIMCHAR: "chimchar",
  MONFERNO: "monferno",
  INFERNAPE: "infernape",
  PIPLUP: "piplup",
  PRINPLUP: "prinplup",
  EMPOLEON: "empoleon",
  NIDORANF: "nidoranF",
  NIDORINA: "nidorina",
  NIDOQUEEN: "nidoqueen",
  NIDORANM: "nidoranM",
  NIDORINO: "nidorino",
  NIDOKING: "nidoking",
  PICHU: "pichu",
  PIKACHU: "pikachu",
  RAICHU: "raichu",
  MACHOP: "machop",
  MACHOKE: "machoke",
  MACHAMP: "machamp",
  HORSEA: "horsea",
  SEADRA: "seadra",
  KINGDRA: "kingdra",
  TRAPINCH: "trapinch",
  VIBRAVA: "vibrava",
  FLYGON: "flygon",
  SPHEAL: "spheal",
  SEALEO: "sealeo",
  WALREIN: "walrein",
  ARON: "aron",
  LAIRON: "lairon",
  AGGRON: "aggron",
  MAGNEMITE: "magnemite",
  MAGNETON: "magneton",
  MAGNEZONE: "magnezone",
  RHYHORN: "rhyhorn",
  RHYDON: "rhydon",
  RHYPERIOR: "rhyperior",
  TOGEPI: "togepi",
  TOGETIC: "togetic",
  TOGEKISS: "togekiss",
  DUSKULL: "duskull",
  DUSCLOPS: "dusclops",
  DUSKNOIR: "dusknoir",
  LOTAD: "lotad",
  LOMBRE: "lombre",
  LUDICOLO: "ludicolo",
  SHINX: "shinx",
  LUXIO: "luxio",
  LUXRAY: "luxray",
  POLIWAG: "poliwag",
  POLIWHIRL: "poliwhirl",
  POLITOED: "politoed",
  ABRA: "abra",
  KADABRA: "kadabra",
  ALAKAZAM: "alakazam",
  GASTLY: "gastly",
  HAUNTER: "haunter",
  GENGAR: "gengar",
  DRATINI: "dratini",
  DRAGONAIR: "dragonair",
  DRAGONITE: "dragonite",
  LARVITAR: "larvitar",
  PUPITAR: "pupitar",
  TYRANITAR: "tyranitar",
  SLAKOTH: "slakoth",
  VIGOROTH: "vigoroth",
  SLAKING: "slaking",
  RALTS: "ralts",
  KIRLIA: "kirlia",
  GARDEVOIR: "gardevoir",
  BAGON: "bagon",
  SHELGON: "shelgon",
  SALAMENCE: "salamence",
  BELDUM: "beldum",
  METANG: "metang",
  METAGROSS: "metagross",
  GIBLE: "gible",
  GABITE: "gabite",
  GARCHOMP: "garchomp",
  ELEKID: "elekid",
  ELECTABUZZ: "electabuzz",
  ELECTIVIRE: "electivire",
  MAGBY: "magby",
  MAGMAR: "magmar",
  MAGMORTAR: "magmortar",
  MUNCHLAX: "munchlax",
  SNORLAX: "snorlax",
  GROWLITHE: "growlithe",
  ARCANINE: "arcanine",
  ONIX: "onix",
  STEELIX: "steelix",
  MEGASTEELIX: "mega-steelix",
  SCYTHER: "scyther",
  SCIZOR: "scizor",
  MEGASCIZOR: "mega-scizor",
  RIOLU: "riolu",
  LUCARIO: "lucario",
  MEGALUCARIO: "mega-lucario",
  MAGIKARP: "magikarp",
  RATTATA: "rattata",
  RATICATE: "raticate",
  SPEAROW: "spearow",
  FEAROW: "fearow",
  GYARADOS: "gyarados",
  LUGIA: "lugia",
  GIRATINA: "giratina",
  ZAPDOS: "zapdos",
  MOLTRES: "moltres",
  ARTICUNO: "articuno",
  DIALGA: "dialga",
  PALKIA: "palkia",
  SUICUNE: "suicune",
  RAIKOU: "raikou",
  ENTEI: "entei",
  REGICE: "regice",
  REGIROCK: "regirock",
  REGISTEEL: "registeel",
  KYOGRE: "kyogre",
  GROUDON: "groudon",
  RAYQUAZA: "rayquaza",
  REGIGIGAS: "regigigas",
  EEVEE: "eevee",
  VAPOREON: "vaporeon",
  JOLTEON: "jolteon",
  FLAREON: "flareon",
  ESPEON: "espeon",
  UMBREON: "umbreon",
  LEAFEON: "leafeon",
  SYLVEON: "sylveon",
  MEDITITE: "meditite",
  MEDICHAM: "medicham",
  MEGAMEDICHAM: "mega-medicham",
  NUMEL: "numel",
  CAMERUPT: "camerupt",
  MEGACAMERUPT: "mega-camerupt",
  SANDSHREW: "sandshrew",
  DARKRAI: "darkrai",
  LITWICK: "litwick",
  LAMPENT: "lampent",
  CHANDELURE: "chandelure",
  SLOWPOKE: "slowpoke",
  SLOWBRO: "slowbro",
  SLOWKING: "slowking",
  BELLSPROUT: "bellsprout",
  WEEPINBELL: "weepinbell",
  VICTREEBEL: "victreebel",
  CARVANHA: "carvanha",
  HOUNDOUR: "houndour",
  SWINUB: "swinub",
  PILOSWINE: "piloswine",
  MAMOSWINE: "mamoswine",
  SNORUNT: "snorunt",
  GLALIE: "glalie",
  FROSLASS: "froslass",
  SNOVER: "snover",
  ABOMASNOW: "abomasnow",
  MEGAABOMASNOW: "mega-abomasnow",
  VANILLITE: "vanillite",
  VANILLISH: "vanillish",
  VANILLUXE: "vanilluxe",
  GLACEON: "glaceon",
  VOLCARONA: "volcarona",
  LANDORUS: "landorus",
  THUNDURUS: "thundurus",
  TORNADUS: "tornadus",
  KELDEO: "keldeo",
  TERRAKION: "terrakion",
  VIRIZION: "virizion",
  COBALION: "cobalion",
  MANAPHY: "manaphy",
  ROTOM: "rotom",
  SPIRITOMB: "spiritomb",
  ABSOL: "absol",
  LAPRAS: "lapras",
  LATIAS: "latias",
  LATIOS: "latios",
  MESPRIT: "mesprit",
  AZELF: "azelf",
  UXIE: "uxie",
  MEWTWO: "mewtwo",
  KYUREM: "kyurem",
  RESHIRAM: "reshiram",
  ZEKROM: "zekrom",
  CELEBI: "celebi",
  VICTINI: "victini",
  JIRACHI: "jirachi",
  ARCEUS: "arceus",
  DEOXYS: "deoxys",
  SHAYMIN: "shaymin",
  CRESSELIA: "cresselia",
  HEATRAN: "heatran",
  HOOH: "ho-Oh",
  AERODACTYL:"aerodactyl",
  PRIMALKYOGRE:"primal-Kyogre",
  PRIMALGROUDON:"primal-Groudon",
  MEOWTH:"meowth",
  PERSIAN:"persian",
  DEINO:"deino",
  ZWEILOUS:"zweilous",
  HYDREIGON:"hydreigon",
  SANDILE:"sandile",
  KROKOROK:"krokorok",
  KROOKODILE:"krookodile"
});

const WORDS = Object.freeze({
  TIPEE_DONOR:{
    'eng': ' being a tipee donor',
    'esp': 'ser donante de tipee',
    'fra': 'être un donateur tipee'
  },
  LEVEL:{
    'eng': 'Level',
    'esp': 'Nivel',
    'fra': 'Niveau'
  },
  LEADERBOARD:{
    'eng': 'Leaderboard',
    'esp': 'Posiciones',
    'fra': 'Classement'
  },
  RANK:{
    'eng': 'Rank',
    'esp': 'Rango',
    'fra': 'Rang'
  },
  COMPOSITION:{
    'eng': 'Team composition',
    'esp': 'Composición del equipo',
    'fra': 'Composition d équipe'
  },
  RESULTS:{
    'eng': 'Results',
    'esp': 'Resultados',
    'fra': 'Résultats'
  },
  EXPERIENCE:{
    'eng': 'experience',
    'esp': 'experiencia',
    'fra': 'experience'
  },
  LEAVE:{
    'eng': 'Exit the dungeon',
    'esp': 'Salir del calabozo',
    'fra': 'Quitter le donjon'
  },
  RANKING:{
    'eng': 'Ranking',
    'esp': 'Clasificación',
    'fra': 'Classement'
  },
  STAY:{
    'eng': 'Stay',
    'esp': 'Permanezca en',
    'fra': 'Rester'
  },
  PLACE:{
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
  ASSAULT_VEST:'ASSAULT_VEST',
  BLUE_ORB:'BLUE_ORB',
  RED_ORB:'RED_ORB',
  WONDER_BOX:'WONDER_BOX'
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
    eng: 'Reviver Seed',
    esp: 'Resugraina',
    fra: 'Résugraine'
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
  WONDER_BOX: {
    eng: 'Wonder Box',
    esp: 'Caja de Maravillas',
    fra: 'Boite mystère'
  }
});

const ITEM_DESCRIPTION = Object.freeze({
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
    eng: '+100% damage, cost 5% life for each attack',
    esp: '100% de daño, cuesta un 5% de vida por cada ataque',
    fra: '+100% attaque, blesse le pokémon de 5% hp/s'
  },
  COIN_AMULET: {
    eng: 'Chance to drop between 1 and 3 gold at each round',
    esp: 'Oportunidad de dejar caer entre 1 y 3 monedas de oro en cada ronda',
    fra: 'Chance de gagner entre 1 et 3 argent à chaque tour.'
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
    eng: '+50% critical strike damage',
    esp: '+50% de daño por golpe crítico',
    fra: '+50% dégâts des coups critiques'
  },
  RAZOR_CLAW: {
    eng: 'Critical hits do true damage',
    esp: 'Los golpes críticos hacen daño verdadero',
    fra: 'Les coups critiques font des true dégats'
  },
  SCOPE_LENS: {
    eng: '+50% critical hits',
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
  ICE: 'ICE'
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
  AMNESIA:'AMNESIA',
  LIGHT_SCREEN:'LIGHT_SCREEN',
  EERIE_SPELL:'EERIE_SPELL',
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
  TAILWIND: 'TAILWIND',
  FEATHER_DANCE: 'FEATHER_DANCE',
  MAX_AIRSTREAM: 'MAX_AIRSTREAM',
  RAIN_DISH: 'RAIN_DISH',
  FLOWER_SHIELD: 'FLOWER_SHIELD',
  BATTLE_ARMOR: 'BATTLE_ARMOR',
  MOUTAIN_RESISTANCE: 'MOUTAIN_RESISTANCE',
  PHANTOM_FORCE: 'PHANTOM_FORCE',
  ATTRACT: 'ATTRACT',
  BABY_DOLL_EYES: 'BABY_DOLL_EYES',
  GROUND: 'GROUND',
  GRASS: 'GRASS',
  FIRE: 'FIRE',
  WATER: 'WATER',
  NORMAL: 'NORMAL',
  ICE: 'ICE',
  SNOW: 'SNOW',
  SHEER_COLD: 'SHEER_COLD'
});

const EFFECTS_ICON = Object.freeze({
    INGRAIN: {
      level: 1,
      positive: true,
      type:TYPE.GRASS
    },
    GROWTH: {
      level: 2,
      positive: true,
      type:TYPE.GRASS
    },
    SPORE: {
      level: 3,
      positive: false,
      type:TYPE.GRASS
    },
    BLAZE: {
      level: 1,
      positive: true,
      type:TYPE.FIRE
    },
    DROUGHT: {
      level: 2,
      positive: true,
      type:TYPE.FIRE
    },
    DRIZZLE: {
      level: 1,
      positive: true,
      type:TYPE.WATER
    },
    RAIN_DANCE: {
      level: 2,
      positive: true,
      type:TYPE.WATER
    },
    PRIMORDIAL_SEA: {
      level: 3,
      positive: true,
      type:TYPE.WATER
    },
    STAMINA: {
      level: 1,
      positive: true,
      type:TYPE.NORMAL
    },
    STRENGTH: {
      level: 2,
      positive: true,
      type:TYPE.NORMAL
    },
    PURE_POWER: {
      level: 3,
      positive: true,
      type:TYPE.NORMAL
    },
    AGILITY: {
      level: 1,
      positive: true,
      type:TYPE.ELECTRIC
    },
    REVENGE: {
      level: 1,
      positive: true,
      type:TYPE.FIGHTING
    },
    PUNISHMENT: {
      level: 2,
      positive: true,
      type:TYPE.FIGHTING
    },
    AMNESIA:{
      level: 1,
      positive: true,
      type:TYPE.PSYCHIC
    },
    LIGHT_SCREEN:{
      level: 2,
      positive: true,
      type:TYPE.PSYCHIC
    },
    EERIE_SPELL:{
      level: 3,
      positive: true,
      type:TYPE.PSYCHIC
    },
    MEAN_LOOK: {
      level: 1,
      positive: false,
      type:TYPE.DARK
    },
    SCARY_FACE: {
      level: 2,
      positive: false,
      type:TYPE.DARK
    },
    IRON_DEFENSE: {
      level: 1,
      positive: true,
      type:TYPE.METAL
    },
    AUTOTOMIZE: {
      level: 2,
      positive: true,
      type:TYPE.METAL
    },
    SPIKES: {
      level: 1,
      positive: false,
      type:TYPE.GROUND
    },
    STEALTH_ROCK: {
      level: 2,
      positive: false,
      type:TYPE.GROUND
    },
    SANDSTORM: {
      level: 3,
      positive: false,
      type:TYPE.GROUND
    },
    POISON_GAS: {
      level: 1,
      positive: true,
      type:TYPE.POISON
    },
    TOXIC: {
      level: 2,
      positive: true,
      type:TYPE.POISON
    },
    INTIMIDATE: {
      level: 1,
      positive: false,
      type:TYPE.DRAGON
    },
    DRAGON_DANCE: {
      level: 2,
      positive: true,
      type:TYPE.DRAGON
    },
    WORK_UP: {
      level: 1,
      positive: true,
      type:TYPE.FIELD
    },
    RAGE: {
      level: 2,
      positive: true,
      type:TYPE.FIELD
    },
    ANGER_POINT: {
      level: 3,
      positive: true,
      type:TYPE.FIELD
    },
    PURSUIT: {
      level: 1,
      positive: true,
      type:TYPE.MONSTER
    },
    BRUTAL_SWING: {
      level: 2,
      positive: true,
      type:TYPE.MONSTER
    },
    POWER_TRIP: {
      level: 3,
      positive: true,
      type:TYPE.MONSTER
    },
    MEDITATE: {
      level: 1,
      positive: true,
      type:TYPE.HUMAN
    },
    FOCUS_ENERGY: {
      level: 2,
      positive: true,
      type:TYPE.HUMAN
    },
    CALM_MIND: {
      level: 3,
      positive: true,
      type:TYPE.HUMAN
    },
    SWARM: {
      level: 1,
      positive: true,
      type:TYPE.BUG
    },
    STICKY_WEB: {
      level: 2,
      positive: false,
      type:TYPE.BUG
    },
    SWIFT_SWIM: {
      level: 1,
      positive: true,
      type:TYPE.AQUATIC
    },
    HYDO_CANNON: {
      level: 2,
      positive: true,
      type:TYPE.AQUATIC
    },
    TAILWIND: {
      level: 1,
      positive: true,
      type:TYPE.FLYING
    },
    FEATHER_DANCE: {
      level: 2,
      positive: true,
      type:TYPE.FLYING
    },
    MAX_AIRSTREAM: {
      level: 3,
      positive: true,
      type:TYPE.FLYING
    },
    RAIN_DISH: {
      level: 1,
      positive: true,
      type:TYPE.FLORA
    },
    FLOWER_SHIELD: {
      level: 2,
      positive: true,
      type:TYPE.FLORA
    },
    BATTLE_ARMOR: {
      level: 1,
      positive: true,
      type:TYPE.MINERAL
    },
    MOUTAIN_RESISTANCE: {
      level: 2,
      positive: true,
      type:TYPE.MINERAL
    },
    PHANTOM_FORCE: {
      level: 1,
      positive: true,
      type:TYPE.AMORPH
    },
    ATTRACT: {
      level: 1,
      positive: true,
      type:TYPE.FAIRY
    },
    BABY_DOLL_EYES: {
      level: 2,
      positive: true,
      type:TYPE.FAIRY
    },
    GROUND: {
      level: 0,
      positive: true,
      type:TYPE.MINERAL
    },
    GRASS: {
      level: 0,
      positive: true,
      type:TYPE.GRASS
    },
    FIRE: {
      level: 0,
      positive: true,
      type:TYPE.FIRE
    },
    WATER: {
      level: 0,
      positive: true,
      type:TYPE.WATER
    },
    NORMAL: {
      level: 0,
      positive: true,
      type:TYPE.NORMAL
    },
    ICE: {
      level: 0,
      positive: true,
      type:TYPE.ICE
    },
    SNOW: {
      level: 1,
      positive: true,
      type:TYPE.ICE
    },
    SHEER_COLD: {
      level: 2,
      positive: true,
      type:TYPE.ICE
    }
})

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
    title:{
      eng: '',
      esp: '',
      fra:''
    },
    description:{
      eng: '',
      esp: '',
      fra:''
    }
  },
  BURN: {
    title:{
      eng: 'Burn',
      esp: 'Quemado',
      fra: 'Brulure'
    },
    description:{
      eng: 'Burn the whole team for 2/4/8 seconds, dealing 5% hp / seconds, divide their attack by two.',
      esp: 'Quemar todo el equipo durante 2/4/8 segundos, repartiendo el 5% de hp/segundos, dividir su ataque por dos.',
      fra:'Brule la cible pour 2/4/8 secondes, lui faisant perdre 5% hp/secondes, divisant son attaque par 2.'
    }
  },
  POISON: {
    title:{
      eng: 'Poison',
      esp: 'Veneno',
      fra: 'Poison'
    },
    description:{
      eng: 'Poison the target for 5/10/20 seconds, dealing 15% hp/seconds',
      esp: 'Envenenar el objetivo durante 5/10/20 segundos, repartiendo 15% hp/segundos',
      fra:'Empoisonne la cible durant 5/10/20 secondes, faisant 15% hp/secondes'
    }
  },
  SLEEP: {
    title:{
      eng: 'Sleep',
      esp: 'Duerme',
      fra: 'Dormir'
    },
    description:{
      eng: 'Sleeps the target for 3/5/7 seconds',
      esp: 'Duerme el objetivo durante 3/5/7 segundos',
      fra:'Endors la cible durant 3/5/7 secondes'
    }
  },
  SILENCE: {
    title:{
      eng: 'Silence',
      esp: 'Silencio',
      fra: 'Silence'
    },
    description:{
      eng: 'Silence the whole team for 2/4/8 seconds',
      esp: 'Silenciar todo el equipo durante 2/4/8 segundos',
      fra: 'Silence toute l équipe ennemie durant 2/4/8 secondes'
    }
  },
  PROTECT: {
    title:{
      eng: 'Protect',
      esp: 'Proteja',
      fra: 'Abri'
    },
    description:{
      eng: 'Makes the pokemon invulnerable for 3/5/7 seconds.',
      esp: 'Hace que el pokemon sea invulnerable durante 3/5/7 segundos.',
      fra: 'Rend le pokémon invulnérable durant 3/5/7 secondes'
    }
  },
  FREEZE: {
    title:{
      eng: 'Freeze',
      esp: 'Congelar',
      fra: 'Gelé'
    },
    description:{
      eng: 'Freeze the whole ennemy team for 1/2/4 seconds',
      esp: 'Congela todo el equipo durante 1/2/4 segundos',
      fra:'Gèle la cible durant 1/2/4 secondes'
    }
  },
  CONFUSION: {
    title:{
      eng: 'Confusion',
      esp: 'Confusión',
      fra: 'Confusion'
    },
    description:{
      eng: 'Makes the target confused for 1/2/4 seconds',
      esp: 'Hace que todo el equipo se confunda durante 1/2/4 segundos',
      fra:'Rend toute la team ennemie confus pendant 1/ 2 4 secondes'
    }
  },
  FIRE_BLAST: {
    title:{
      eng: 'Fire Blast',
      esp: 'Ráfaga de fuego',
      fra: 'Déflagration'
    },
    description:{
      eng: 'Throw a fire blast for 30/50/100 special damage',
      esp: 'Lanza una ráfaga de fuego para 30/50/100 de daño especial',
      fra:'Lance une déflagration infligeant 30/50/100 dégats spéciaux'
    }
  },
  WHEEL_OF_FIRE: {
    title:{
      eng: 'Wheel of fire',
      esp: 'Rueda de fuego',
      fra: 'Roue de feu'
    },
    description:{
      eng: 'Sends a fire wheel that makes a round trip doing 30/40/50 special damages.',
      esp: 'Envía una rueda de fuego que hace un viaje de ida y vuelta haciendo 30/40/50 de daño especial.',
      fra:'Envoie une boule de feu faisant un aller retour, endommageant les pokémons pour 30/40/50 dégats spéciaux'
    }
  },
  SEISMIC_TOSS: {
    title:{
      eng: 'Seismic toss',
      esp: 'Lanzamiento sísmico',
      fra: 'Frappe Atlas'
    },
    description:{
      eng: 'Mono target attack that deals true damage function of how big is your team',
      esp: 'Ataque de objetivo mono que inflige daño real en función de lo grande que sea tu equipo.',
      fra:'Attaque mono cible dont les dégats varient en fonction de la taille de l équipe.'
    }
  },
  GUILLOTINE: {
    title:{
      eng: 'Guillotine',
      esp: 'Guillotina',
      fra: 'Guillotine'
    },
    description:{
      eng: 'Mono target attack that deals physical damage. Restores half mana if target killed',
      esp: 'Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere',
      fra:'Attaque mono cible qui fait des dégats physiques. Restaure la moitié du mana si la cible est tué.'
    }
  },
  ROCK_SLIDE: {
    title:{
      eng: 'Rock Slide',
      esp: 'Deslizamiento de rocas',
      fra: 'Eboulement'
    },
    description:{
      eng: 'Mono target attack that deals physical damage. Doubles damage if target is type flying.',
      esp: 'Ataque de objetivo mono que causa daño físico. Duplica el daño si el objetivo es de tipo volador.',
      fra:'Attaque mono cible qui fait des dégats physiques. Double les dégats si type vol.'
    }
  },
  HEAT_WAVE: {
    title:{
      eng: 'Heat wave',
      esp: 'Ola de calor',
      fra: 'Canicule'
    },
    description:{
      eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
      fra:'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
    }
  },
  THUNDER: {
    title:{
      eng: 'Thunder',
      esp: 'Trueno',
      fra: 'Fatal-Foudre'
    },
    description:{
      eng: 'Mono target damage that deals 30/50/70 special damage.',
      esp: 'Daño de objetivo mono que inflige 30/50/70 de daño especial.',
      fra:'Attaque monocibe infligeant 30/50/70 dégats spéciaux.'
    }
  },
  HYDRO_PUMP: {
    title:{
      eng: 'Hydro Pump',
      esp: 'Hidrobomba',
      fra: 'Hydrocanon'
    },
    description:{
      eng: 'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.',
      fra:'Attaque AOE qui infique 30/40/50 dégats spéciaux dans une ligne derrière la cible.'
    }
  },
  DRACO_METEOR: {
    title:{
      eng: 'Draco meteor',
      esp: 'Meteoro Draco',
      fra: 'Draco meteor'
    },
    description:{
      eng: 'Area of effect attack that deals 10/20/40 special damages to all ennemies',
      esp: 'Ataque de área de efecto que causa 10/20/40 de daño especial a todos los enemigos',
      fra:'Inflige 10/20/40 dégats spéciaux à tous les pokémons ennemis.'
    }
  },
  BLAZE_KICK: {
    title:{
      eng: 'Blaze kick',
      esp: 'Patada de fuego',
      fra: 'Pied de feu'
    },
    description:{
      eng: 'Mono target that deals 30/60/90 physical damage.',
      esp: 'Objetivo mono que causa 30/60/90 de daño físico',
      fra:'Attaque monocinle faisant 30/60/90 dégats physiques'
    }
  },
  WISH: {
    title:{
      eng: 'Wish',
      esp: 'Deseo',
      fra: 'Voeu'
    },
    description:{
      eng: 'Restores 50 hp to 1/2/3 ally pokemon',
      esp: 'Restaura 50 hp a 1/2/3 de pokemon aliado',
      fra:'Soigne 50 hp à 1/2/3 pokémons alliés'
    }
  },
  CALM_MIND: {
    title:{
      eng: 'Calm mind',
      esp: 'Mente tranquila',
      fra: 'Plénitude'
    },
    description:{
      eng: 'Buff pokemon attack by 50/100/150%',
      esp: 'Ataque de pokemón de la Buff en un 50/100/150%.',
      fra:'Augmente l attaque du pokémon de 50/100/150%.'
    }
  },
  IRON_DEFENSE: {
    title:{
      eng: 'Iron Defense',
      esp: 'Defensa del hierro',
      fra: 'Mur de fer'
    },
    description:{
      eng: 'Buff pokemon defense / special defense by 4/6/8 points',
      esp: 'Defensa pokemon buff / defensa especial por 4/6/8 puntos',
      fra:'Augmente la défense du pokémon de 4/6/8 points'
    }
  },
  METRONOME: {
    title:{
      eng: 'Metronome',
      esp: 'Métrónomo',
      fra: 'Metronome'
    },
    description:{
      eng: 'Shoot a random capacity',
      esp: 'Disparar una capacidad aleatoria',
      fra:'Execute une capacité au hasard'
    }
  },
  SOAK: {
    title:{
      eng: 'Soak',
      esp: 'Empápate',
      fra: 'Lessivage'
    },
    description:{
      eng: 'Deals 20/30/40 special damage and restores 10 mana to friendly pokemons',
      esp: 'Hace 20/30/40 de daño especial y devuelve 10 de maná a los pokemons amistosos.',
      fra:'Fait 20/30/40 dégats spéciaux et restaure 10 mana à chaque pokémon allié.'
    }
  },
  IRON_TAIL: {
    title:{
      eng: 'Iron tail',
      esp: 'Cola de hierro',
      fra: 'Queue de fer'
    },
    description:{
      eng: 'Mono target damage attack that deals 20/30/40. Buff defense by 1/3/5 points.',
      esp: 'Ataque de daño al objetivo mono que reparte 20/30/40. Pulveriza la defensa por 1/3/5 puntos.',
      fra:'Attaque monocible faisant 20/30/40 dégats physique. Booste la défense de 1/3/5 points.'
    }
  },
  BLAST_BURN: {
    title:{
      eng: 'Blast Burn',
      esp: 'Quemadura por ráfaga',
      fra: 'Aire de feu'
    },
    description:{
      eng: 'Area of effect attack that deals 30/50/80 special damages.',
      esp: 'Ataque en el área de efecto que causa 30/50/80 daños especiales.',
      fra:'Attaque AOE en cercle faisant 30/50/80 dégats spéciaux.'
    }
  },
  CHARGE: {
    title:{
      eng: 'Charge',
      esp: 'Carga',
      fra: 'Chargeur'
    },
    description:{
      eng: 'Buff all electric ally pokemons attack by 10/20/30 %',
      esp: 'Pulir todos los pokemones aliados eléctricos atacan en un 10/20/30 %.',
      fra:'Augmente l attaque des alliés electrique de 10/20/30%'
    }
  },
  DISCHARGE: {
    title:{
      eng: 'Discharge',
      esp: 'Descarga',
      fra: 'Coud Jus'
    },
    description:{
      eng: 'Area of effect attack that deals 40/60/80 special damages.',
      esp: 'Ataque en el área de efecto que causa 40/60/80 daños especiales.',
      fra:'Attaque AOE en cercle faisant 40/60/80 dégats spéciaux.'
    }
  },
  BITE: {
    title:{
      eng: 'Bite',
      esp: 'Mordida',
      fra: 'Morsure'
    },
    description:{
      eng: '50% Life steal mono target physical attack that deals 30/50/70 damage.',
      esp: '50% Vida robar mono objetivo de ataque físico que inflige 30/50/70 de daño.',
      fra:'Attaque monocible avec 50% de vol de vie faisant 30/50/70 dégats spéciaux.'
    }
  },
  DRAGON_TAIL: {
    title:{
      eng: 'Dragon Tail',
      esp: 'Cola de Dragón',
      fra: 'Draco Queue'
    },
    description:{
      eng: 'Mono target physical attack that deals 30/40/50 damage and buff defenses by 1/2/3 points',
      esp: 'El ataque físico de un monoobjetivo que inflige 30/40/50 de daño y mejora las defensas en 1/2/3 puntos',
      fra:'Attaque mono-cible faisant 30/40/50 dégats physique et boostant les défenses de 1/2/3 points.'
    }
  },
  DRAGON_BREATH: {
    title:{
      eng: 'Dragon Breath',
      esp: 'Aliento de Dragón',
      fra: 'Draco Souffle'
    },
    description:{
      eng: 'Area of effect attack that deals 30/40/50 special damage in a line behind the target',
      esp: 'Ataque de área de efecto que inflige 30/40/50 de daño especial en una línea detrás del objetivo',
      fra:'Attaque AOE faisant 30/40/50 dégats spéciaux dans une ligne derrière la cible'
    }
  },
  ICICLE_CRASH: {
    title:{
      eng: 'Icicle Crash',
      esp: 'Choque de carámbanos',
      fra: 'Chute glace'
    },
    description:{
      eng: 'Area of effect attack that deals 30/40/50 physical damage around the target',
      esp: 'Ataque de área de efecto que causa 30/40/50 de daño físico alrededor del objetivo',
      fra:'Attaque AOE en cercle faisant 30/40/50 dégats physiques'
    }
  },
  ROOT: {
    title:{
      eng: 'Root',
      esp: 'Raíz',
      fra: 'Racine'
    },
    description:{
      eng: 'Heal all nearby ally pokemons by 20/30/40 hp.',
      esp: 'Curar a todos los pokemons aliados cercanos con 20/30/40 hp.',
      fra:'Soigne les alliés autour de 20/30/40 hp.'
    }
  },
  TORMENT: {
    title:{
      eng: 'Torment',
      esp: 'Viaje',
      fra: 'Tourment'
    },
    description:{
      eng: 'Increase attack speed by 20/30/40 %',
      esp: 'Aumenta la velocidad de ataque en un 20/30/40 %.',
      fra:'Augmente la vitesse d attaque de 20/30/40%'
    }
  },
  STOMP: {
    title:{
      eng: 'Stomp',
      esp: 'Pisotón',
      fra: 'Ecrasement'
    },
    description:{
      eng: 'Mono target physical damage (2*atk*stars)',
      esp: 'Daño físico del objetivo mono (2*atk*stars)',
      fra:'Attaque mono cible faisant 2*atk*stars dégats physiques'
    }
  },
  DARK_PULSE: {
    title:{
      eng: 'Dark Pulse',
      esp: 'Pulso oscuro',
      fra: 'Vibrobscur'
    },
    description:{
      eng: 'Life drain target attack that deals 30/50/70 special damage',
      esp: 'Ataque al objetivo de drenaje de vida que causa 30/50/70 de daño especial',
      fra:'Attaque vol de vie faisant 30/50/70 dégats spéciaux.'
    }
  },
  NIGHT_SLASH: {
    title:{
      eng: 'Night Slash',
      esp: 'Tajo nocturno',
      fra: 'Tranche Nuit'
    },
    description:{
      eng: 'Mono target special attack that does 40/60/80. Decreases all ennemies defense by 1 point.',
      esp: 'Ataque especial de objetivo mono que hace 40/60/80. Disminuye la defensa de todos los enemigos en 1 punto.',
      fra:'Attaque spéciale faisant 40/60/80 points de dégats. Diminue la défense de toute la team ennemie de 1 point.'
    }
  },
  BUG_BUZZ: {
    title:{
      eng: 'Bug Buzz',
      esp: 'Bichos',
      fra: 'Bourdon'
    },
    description:{
      eng: 'Mono target special damage attack that does 20/30/40.',
      esp: 'Ataque de daño especial de un mono objetivo que hace 20/30/40.',
      fra:'Attaque mono cible faisant 20/30/40 dégats spéciaux'
    }
  },
  POISON_STING: {
    title:{
      eng: 'Poison Sting',
      esp: 'Picadura de veneno',
      fra: 'Dard Venin'
    },
    description:{
      eng: 'Physical mono target damage that deals 30/40/50. Doubles damage if target is poisoned.',
      esp: 'Daño físico de un solo objetivo que reparte 30/40/50. Duplica el daño si el objetivo está envenenado.',
      fra:'Attaque physique mono cible faisant 30/40/50 dégats. Double les dégats si la cible est empoisonné.'
    }
  },
  LEECH_LIFE: {
    title:{
      eng: 'Leech Life',
      esp: 'Vampirismo',
      fra: 'Vampirisme'
    },
    description:{
      eng: 'Area of effect life steal special damage attack 10/20/30 around the target',
      esp: 'Área de efecto robo de vida daño especial ataque 10/20/30 alrededor del objetivo',
      fra:'Attaque vol de vie en AOE faisant 10/20/30 points de dégats.'
    }
  },
  HAPPY_HOUR: {
    title:{
      eng: 'Happy hour',
      esp: 'La hora feliz',
      fra: 'Happy hour'
    },
    description:{
      eng: 'Buff all ally attacks by 3/6/9 points.',
      esp: 'Pulir todos los ataques de los aliados por 3/6/9 puntos.',
      fra:'Augmente l attaque de toute l équipe de 3/6/9 points.'
    }
  },
  TELEPORT: {
    title:{
      eng: 'Teleport',
      esp: 'Teletransporte',
      fra: 'Teleport'
    },
    description:{
      eng: 'Teleport the pokemon on one edge of the map',
      esp: 'Teletransportar el pokemon en un borde del mapa',
      fra:'Téléporte le pokémon sur un coin de la carte.'
    }
  },
  NASTY_PLOT: {
    title:{
      eng: 'Nasty Plot',
      esp: 'Trama desagradable',
      fra: 'Machination'
    },
    description:{
      eng: 'Buff pokemon attack by 5/10/20 points',
      esp: 'Buff pokemon ataque por 5/10/20 puntos',
      fra:'Booste l attaque du pokémon de 5/10/20 points'
    }
  },
  THIEF: {
    title:{
      eng: 'Thief',
      esp: 'Ladrón',
      fra: 'Larcin'
    },
    description:{
      eng: 'Steal ennemy target item and deals 5/10/20 physical damage',
      esp: 'Roba el objeto del enemigo e inflige 5/10/20 de daño físico',
      fra:'Vole l item du pokémon ennemi et inflige 5/10/20 dégats physiques'
    }
  },
  STUN_SPORE: {
    title:{
      eng: 'Stun Spore',
      esp: 'Espora de aturdimiento',
      fra: 'Poudre para'
    },
    description:{
      eng: 'Decrease target attack speed by 50/100/200% and deals 5/10/20 physical damage',
      esp: 'Disminuir la velocidad de ataque del objetivo en un 50/100/200% e inflige 5/10/20 de daño físico',
      fra:'Diminue la vitesse d attaque du pokémon de 50/100/200% et inflige 5/10/20 dégats physiques'
    }
  },
  METEOR_MASH: {
    title:{
      eng: 'Meteor mash',
      esp: 'Puré de meteoritos',
      fra: 'Poing Meteor'
    },
    description:{
      eng: 'Area of effect around the target that deals 30/50/70 damages. Buff pokemon attack by 5 points.',
      esp: 'Área de efecto alrededor del objetivo que produce 30/50/70 daños. Buff pokemon ataque por 5 puntos.',
      fra:'Attaque en AOE faisant 30/50/40 dégats spéciaux. Booste l attaque du pokémon de 5 points.'
    }
  },
  HURRICANE: {
    title:{
      eng: 'Hurricane',
      esp: 'Huracán',
      fra: 'Vent Violent'
    },
    description:{
      eng: 'Area of effect attack that deals 10/20/30 damages in a line behind the target',
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
    fra: 'Animal'
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
  }
});

const RARITY = Object.freeze({
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHICAL: 'MYTHICAL',
  NEUTRAL: 'NEUTRAL'
});

const RARITY_HP_COST= Object.freeze({
  COMMON: 1,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 2,
  LEGENDARY: 3,
  MYTHICAL: 4,
  NEUTRAL: 2
});

const COST = Object.freeze({
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  MYTHICAL: 6,
  LEGENDARY: 5
});

const BOT_AVATAR = Object.freeze({
  WATER1: PKM.SQUIRTLE,
  FIRE1: PKM.CHARMANDER,
  POISON1: PKM.ZUBAT,
  GRASS1: PKM.BULBASAUR,
  GROUND1: PKM.GEODUDE,
  NORMAL1: PKM.JIGGLYPUFF,
  ELECTRIC1: PKM.PIKACHU,
  MONSTER1: PKM.LARVITAR,
  FIELD1: PKM.NIDOQUEEN,
  DRAGON1: PKM.DRATINI,
  HUMAN1:PKM.RIOLU,
  DARK: PKM.DARKRAI,
  GRASS2: PKM.SHAYMIN,
  GROUND2: PKM.REGIROCK,
  WATER2: PKM.KYOGRE,
  ELECTRIC2: PKM.ZAPDOS,
  DRAGON2: PKM.RAYQUAZA,
  FIRE2:PKM.MOLTRES,
  DRAGON3: PKM.KYUREM,
  ICE1:PKM.ARTICUNO,
  FIGHT1:PKM.REGIGIGAS
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
  dratini: 'DRAGON1',
  riolu: 'HUMAN1',
  darkrai: 'DARK',
  shaymin: 'GRASS2',
  regirock: 'GROUND2',
  kyogre: 'WATER2',
  zapdos: 'ELECTRIC2',
  rayquaza: 'DRAGON2',
  moltres: 'FIRE2',
  kyurem: 'DRAGON3',
  articuno:'ICE1',
  regigigas:'FIGHT1'
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
    'eng': 'Stormy \n Sea',
    'esp': 'Mar \n Tormentoso',
    'fra': 'Mer \n Houleuse'
  },
  NORMAL: {
    'eng': 'Tiny \n Woods',
    'esp': 'Arboleda \n Chica',
    'fra': 'Petit \n Bois'
  },
  FIRE: {
    'eng': 'Magma \n Cavern',
    'esp': 'Caverna \n Magma',
    'fra': 'Mine \n Magma'
  },
  GRASS: {
    'eng': 'Hidden \n Highland',
    'esp': 'Tierra \n Oculta',
    'fra': 'Terres \n Illusoires'
  },
  ICE: {
    'eng': 'Frosty \n Forest',
    'esp': 'Bosque \n Helado',
    'fra': 'Forêt \n Givrée'
  },
  GROUND: {
    'eng': 'Shimmer \n Desert',
    'esp': 'Desierto \n Trémulo',
    'fra': 'Désert \n Chatoyant'
  }
});

const TYPE_DETAILS = Object.freeze({
  NORMAL: {
    description:{
      eng:[
        {
          title:`(3) Stamina`,
          text:`+30% bonus HP for all normal allies`
        },
        {
          title:`(6) Strength`,
          text:`ATK, DEF + 10% for normal allies`
        },
        {
          title:`(9) Stamina`,
          text:`+100% ATK for all allies`
        }
      ],
      esp:[
        {
          title:`(3) Resistencia`,
          text:`30% de CV de bonficacion para todos los aliados normales`
        },
        {
          title:`(6) Fuerza`,
          text:`Aumentar el ATK y la DEF en un 10%`
        },
        {
          title:`(9) Poder Puro`,
          text:`+100% ATK para todos sus aliados`
        }
      ],
      fra:[
        {
          title:`(3) Force`,
          text:`+30% HP pour les alliés normaux`
        },
        {
          title:`(6) Stockage`,
          text:`ATK, DEF +10% pour les alliés normaux`
        },
        {
          title:`(9) Concentration`,
          text:`+100% ATK pour tous les alliés`
        }
      ]
    }
  },
  GRASS: {
    description:{
      eng:[
        {
          title:`(3) Ingrain`,
          text:`+5% HP/s for grass allies`
        },
        {
          title:`(5) Growth`,
          text:`+10% HP/s for grass allies`
        },
        {
          title:`(7) Stun Spore`,
          text:`-30% ATK speed for ennemy team`
        }
      ],
      esp:[
        {
          title:`(3) Ingrediente`,
          text:`+5% HP/s para los tipos de Planta`
        },
        {
          title:`(5) Crecimiento`,
          text:`+10% HP/s para los tipos de Planta`
        },
        {
          title:`(7) Espora aturdidora`,
          text:`Los ennemigos que no son de Planta tienen un 30% ATK speed`
        }
      ],
      fra:[
        {
          title:`(3) Racine`,
          text:`+5% HP/s pour tous les alliés plante`
        },
        {
          title:`(5) Croissance`,
          text:`+10% HP/s pour tous les alliés plante`
        },
        {
          title:`(7) Para Spore`,
          text:`-30% ATK speed pour tous les ennemis`
        }
      ]
    }
  },
  FIRE: {
    description:{
      eng:[
        {
          title:`(3) Blaze`,
          text:`Fire pkm gains +5 ATK at each attack`
        },
        {
          title:`(6) Drought`,
          text:`Sun itensifies, fire pkm gains +50% ATK`
        }
      ],
      esp:[
        {
          title:`(3) Blaze`,
          text:`Fire pkm gana un 5% de dano en cada ataque`
        },
        {
          title:`(6) Sequia`,
          text:`El so se intensifica, los pkm de fuego gana +50% ATK`
        }
      ],
      fra:[
        {
          title:`(3) Torche`,
          text:`Les pkm feu gagnent 5% d'ATK à chaque attaque`
        },
        {
          title:`(6) Zénith`,
          text:`Le soleil s'intensifie, augmentant l'ATK des pkm feu de 50%`
        }
      ]
    }
  },
  WATER: {
    description:{
      eng:[
        {
          title:`(3) Rain dance`,
          text:`Rain falls, 30% ATK for water allies`
        },
        {
          title:`(6) Crachin`,
          text:`The rain is getting heavier, 30% more ATK`
        },
        {
          title:`(9) Primordial sea`,
          text:`Invoke Kyogre, the king of the oceans`
        }
      ],
      esp:[
        {
          title:`(3) Danza de la lluvia`,
          text:`Cae la lluvia, 30% de ATK para los aliados del agua`
        },
        {
          title:`(6) Crachin`,
          text:`La lluvia es cada vez más intensa, un 30% más de ATK.`
        },
        {
          title:`(9) Mar Primordial`,
          text:`Invoca a Kyogre, el rey de los océanos`
        }
      ],
      fra:[
        {
          title:`(3) Danse pluie`,
          text:`La pluie tombe, 30% d'ATK pour les alliés eau`
        },
        {
          title:`(6) Crachin`,
          text:`La pluie s'intensifie, 30% d'ATK en plus`
        },
        {
          title:`(9) Mer primordiale`,
          text:`Invoque Kyogre, le roi des océans`
        }
      ]
    }
  },
  ELECTRIC: {
    description:{
      eng:[
        {
          title:`(-) Agility`,
          text:`+10% ATK speed for each elec ally in the team`
        }
      ],
      esp:[
        {
          title:`(-) Agilidad`,
          text:`+10% de velocidad ATK por cada aliado eléctrico del equipo`
        }
      ],
      fra:[
        {
          title:`(-) Agilité`,
          text:`+10% ATK speed pour chaque allié elec dans l'équipe`
        }
      ]
    }
  },
  FIGHTING: {
    description:{
      eng:[
        {
          title:`(2) Revenge`,
          text:`+5 mana / attack for all pkm`
        },
        {
          title:`(4) Punishment`,
          text:`+10 mana / attack for all pkm`
        }
      ],
      esp:[
        {
          title:`(2) Venganza`,
          text:`+5 maná/ataque para todos los pkm`
        },
        {
          title:`(4) Castigo`,
          text:`+10 maná/ataque para todos los pkm`
        }
      ],
      fra:[
        {
          title:`(2) Vengeance`,
          text:`+5 mana / attaque pour tous les pkm`
        },
        {
          title:`(4) Punition`,
          text:`+10 mana / attaque pour tous les pkm`
        }
      ]
    }
  },
  PSYCHIC: {
    description:{
      eng:[
        {
          title:`(2) Amnesia`,
          text:`Ally gains +5 SPEDEF`
        },
        {
          title:`(4) Light Screen`,
          text:`Ally gains additional +10 SPEDEF`
        },
        {
          title:`(6) Eerie Spell`,
          text:`Ally gains additional +20 SPEDEF`
        }
      ],
      esp:[
        {
          title:`(2) Amnesia`,
          text:`Ally gana +5 SPEDEF`
        },
        {
          title:`(4) Pantalla de luz`,
          text:`Ally gana +10 SPEDEF adicionales`
        },
        {
          title:`(6) Hechizo espeluznante`,
          text:`Ally gana +20 SPEDEF adicionales`
        }
      ],
      fra:[
        {
          title:`(2) Amnésie`,
          text:`Les alliés gagnent +5 SPEDEF`
        },
        {
          title:`(4) Mur lumière`,
          text:`Les alliés gagnent un additionel +10 SPEDEF`
        },
        {
          title:`(6) Sort Sinistre`,
          text:`Les alliés gagnent un additionel +20 SPEDEF`
        }
      ]
    }
  },
  DARK: {
    description:{
      eng:[
        {
          title:`(2) Black eyes`,
          text:`-25% DEF for the enemy team`
        },
        {
          title:`(4) Atmósfera oscura`,
          text:`-25% additional DEF for the enemy team`
        }
      ],
      esp:[
        {
          title:`(2) Halo Negra`,
          text:`-25% DEF para el equipo enemigo`
        },
        {
          title:`(4) Grima`,
          text:`25% de DEF adicional para el equipo enemigo`
        }
      ],
      fra:[
        {
          title:`(2) Regard Noir`,
          text:`-25% DEF pour la team ennemie`
        },
        {
          title:`(4) Aura Ténébreuse`,
          text:`-25% DEF additionel pour la team ennemie`
        }
      ]
    }
  },
  METAL: {
    description:{
      eng:[
        {
          title:`(2) Steel wall`,
          text:`+50% DEF for steel pkm`
        },
        {
          title:`(4) Lightening`,
          text:`+100% ATK speed for steel pkm`
        }
      ],
      esp:[
        {
          title:`(2) Muro de acero`,
          text:`+50% DEF para pkm de acero`
        },
        {
          title:`(4) Rayo`,
          text:`+100% de velocidad ATK para pkm de acero`
        }
      ],
      fra:[
        {
          title:`(2) Mur d'acier`,
          text:`+50% DEF pour les pkm acier`
        },
        {
          title:`(4) Allègement`,
          text:`+100% ATK speed pour les pkm acier`
        }
      ]
    }
  },
  GROUND: {
    description:{
      eng:[
        {
          title:`(2) Spikes`,
          text:`-10% HP for the enemies at the beginning of the fight`
        },
        {
          title:`(4) Stealth Rock`,
          text:`-10% HP for the enemies at the beginning of the fight`
        },
        {
          title:`(6) Sandstorm`,
          text:`A sandstorm is raging, making 10% HP/s at pkm non ground/steel`
        }
      ],
      esp:[
        {
          title:`(2) Picotas`,
          text:`-10% de HP para los enemigos al comienzo del combate`
        },
        {
          title:`(4) Trampa de rocas`,
          text:`-10% de HP para los enemigos al comienzo del combate`
        },
        {
          title:`(6) Tormenta de arena`,
          text:`Se desata una tormenta de arena que produce un 10% de HP/s por pkm de tierra/acero`
        }
      ],
      fra:[
        {
          title:`(2) Picots`,
          text:`-10% HP pour les ennemis au début du combat`
        },
        {
          title:`(4) Piège de roc`,
          text:`-10% HP pour les ennemis au début du combat`
        },
        {
          title:`(6) Tempête de sable`,
          text:`Une tempête de sable fait rage, faisant 10% HP/s aux pkm non sol/acier`
        }
      ]
    }
  },
  POISON: {
    description:{
      eng:[
        {
          title:`(3) Toxik Gas`,
          text:`+20% chance of poison the target for 2 seconds, dealing 15% hp/seconds`
        },
        {
          title:`(6) Toxik`,
          text:`+30% chance of poison the target for 2 seconds, dealing 15% hp/seconds`
        }
      ],
      esp:[
        {
          title:`(3) Toxik gas`,
          text:`+20% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
        },
        {
          title:`(6) Fuerza`,
          text:`+30% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
        }
      ],
      fra:[
        {
          title:`(3) Gaz Toxik`,
          text:`+20% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
        },
        {
          title:`(6) Toxik`,
          text:`+30% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
        }
      ]
    }
  },
  DRAGON: {
    description:{
      eng:[
        {
          title:`(2) Bullying`,
          text:`-30% ATK for the enemy team`
        },
        {
          title:`(4) Dragon Dance`,
          text:`+5% attack speed for pkm dragons at each attack`
        }
      ],
      esp:[
        {
          title:`(2) Intimidación`,
          text:`-30% ATK para el equipo enemigo`
        },
        {
          title:`(4) Fuerza`,
          text:`+5% velocidad de ataque para dragones pkm en cada ataque`
        }
      ],
      fra:[
        {
          title:`(2) Intimidation`,
          text:`-30% ATK pour l'équipe ennemie`
        },
        {
          title:`(4) Danse Draco`,
          text:`+5% vitesse d'attaque pour les pkm dragons à chaque attaque`
        }
      ]
    }
  },
  FIELD: {
    description:{
      eng:[
        {
          title:`(3) Bulk up`,
          text:`+5% ATK per opponent in the enemy team`
        },
        {
          title:`(6) Rage`,
          text:`+5% ATK per each shot received`
        },
        {
          title:`(9) Sword Dance`,
          text:`The attack speed is doubled for animal pkm`
        }
      ],
      esp:[
        {
          title:`(3) Gonflette`,
          text:`+5% ATK por oponente en el equipo enemigo`
        },
        {
          title:`(6) Furia`,
          text:`+5% ATK por cada golpe recibido`
        },
        {
          title:`(9) Cuchillas de baile`,
          text:`La velocidad de ataque se duplica para los animales pkm`
        }
      ],
      fra:[
        {
          title:`(3) Gonflette`,
          text:`+5% ATK par adversaire dans l'équipe ennemie`
        },
        {
          title:`(6) Rage`,
          text:`+5% ATK par chaque coup reçu`
        },
        {
          title:`(9) Danse Lames`,
          text:`La vitesse d'attaque est doublée pour les pkm animal`
        }
      ]
    }
  },
  MONSTER: {
    description:{
      eng:[
        {
          title:`(3) Pursuit`,
          text:`Enemies are executed below 30% HP`
        },
        {
          title:`(5) Pride`,
          text:`Every kill restores the life of the pkm`
        },
        {
          title:`(7) Berserk`,
          text:`Each kill increases ATK by pkm by 100%`
        }
      ],
      esp:[
        {
          title:`(3) Persecución`,
          text:`Los enemigos se ejecutan por debajo del 30% de HP`
        },
        {
          title:`(5) La arrogancia`,
          text:`Cada muerte devuelve la vida al pkm`
        },
        {
          title:`(7) Berserk`,
          text:`Cada muerte aumenta el ATK del pkm en un 100%`
        }
      ],
      fra:[
        {
          title:`(3) Poursuite`,
          text:`Les ennemis sont éxécutés en dessous de 30% HP`
        },
        {
          title:`(5) Arrogance`,
          text:`Chaque kill restaure la vie du pkm`
        },
        {
          title:`(7) Berserk`,
          text:`Chaque kill augmente l'ATK du pkm de 100%`
        }
      ]
    }
  },
  HUMAN: {
    description:{
      eng:[
        {
          title:`(2) Meditation`,
          text:`+15% ATK and +15% HP for all pkm`
        },
        {
          title:`(4) Power`,
          text:`+20% ATK and +20% HP for all pkm`
        },
        {
          title:`(6) Calm Mind`,
          text:`+30% ATK and +30% HP for all pkm`
        }
      ],
      esp:[
        {
          title:`(2) Meditación`,
          text:`+15% de ATK y +15% HP para todos los pokemones`
        },
        {
          title:`(4) Poder`,
          text:`+20% de ATK y +20% HP para todos los pokemones`
        },
        {
          title:`(6) Plenitud`,
          text:`+30% de ATK y +30% HP para todos los pokemones`
        }
      ],
      fra:[
        {
          title:`(2) Méditation`,
          text:`+15% ATK et +15% HP pour tous les pkm`
        },
        {
          title:`(4) Puissance`,
          text:`+20% ATK et +20% HP pour tous les pkm`
        },
        {
          title:`(6) Plénitude`,
          text:`+30% ATK et +30% HP pour tous les pkm`
        }
      ]
    }
  },
  AQUATIC: {
    description:{
      eng:[
        {
          title:`(3) Swift swim`,
          text:`+30% ATK speed for aquatic pkm`
        },
        {
          title:`(6) Hydro pump`,
          text:`+30% ATK for aquatic pkm`
        }
      ],
      esp:[
        {
          title:`(3) Resbalón`,
          text:`+30% de velocidad ATK por pkm de agua`
        },
        {
          title:`(6) Cañón hidráulico`,
          text:`+30% ATK para pkm acuáticos`
        }
      ],
      fra:[
        {
          title:`(3) Glissade`,
          text:`+30% ATK speed pour les pkm aquatiques`
        },
        {
          title:`(6) Hydro cannon`,
          text:`+30% ATK pour les pkm aquatiques`
        }
      ]
    }
  },
  BUG: {
    description:{
      eng:[
        {
          title:`(2) Swarm`,
          text:`2 pkm needed to evolve (instead of 3)`
        },
        {
          title:`(4) Sticky web`,
          text:`-33% ATK speed for the enemy team`
        }
      ],
      esp:[
        {
          title:`(2) Essaim`,
          text:`Se necesitan 2 pkm para evolucionar (en lugar de 3)`
        },
        {
          title:`(4) Web pegajosa`,
          text:`-33% de velocidad ATK para el equipo enemigo`
        }
      ],
      fra:[
        {
          title:`(2) Essaim`,
          text:`2 pkm nécessaires pour évoluer (au lieu de 3)`
        },
        {
          title:`(4) Toile gluante`,
          text:`-33% ATK speed pour l'équipe ennemie`
        }
      ]
    }
  },
  FLYING: {
    description:{
      eng:[
        {
          title:`(2) Tailwind`,
          text:`+10% critical chance for flying pokemons`
        },
        {
          title:`(4) Feather Dance`,
          text:`+20% additional critical chance for flying pokemons`
        },
        {
          title:`(6) Max Airstream`,
          text:`+40% additional critical chance for flying pokemons`
        }
      ],
      esp:[
        {
          title:`(2) Viento de cola`,
          text:`+10% de probabilidad de crítico para los pokemones voladores`
        },
        {
          title:`(4) Danza de las plumas`,
          text:`+20% de probabilidad de crítico adicional para los pokemones voladores`
        },
        {
          title:`(6) Corriente de aire máxima`,
          text:`+40% de probabilidad de crítico adicional para los pokemones voladores`
        }
      ],
      fra:[
        {
          title:`(2) Vent arrière`,
          text:`+10% de coup critique pour les pokémons vols`
        },
        {
          title:`(4) Danse des plumes`,
          text:`+20% de coup critique pour les pokémons vols`
        },
        {
          title:`(6) Max Airstream`,
          text:`+40% de coup critique pour les pokémons vols`
        }
      ]
    }
  },
  FLORA: {
    description:{
      eng:[
        {
          title:`(2) Sink`,
          text:`Restore 10% HP/s if it rains`
        },
        {
          title:`(4) Floral shield`,
          text:`+50% DEF and +50% SPEDEF for all pkm`
        }
      ],
      esp:[
        {
          title:`(2) Lavamanos`,
          text:`Restaurar un 10% de HP/s si llueve`
        },
        {
          title:`(4) Escudo floral`,
          text:`Aumentar el ATK y la DEF en un 10%`
        }
      ],
      fra:[
        {
          title:`(2) Lavabo`,
          text:`Restaure 10% HP/s si il pleut`
        },
        {
          title:`(4) Bouclier floral`,
          text:`+50% DEF et +50%SPEDEF pour tous les pkm`
        }
      ]
    }
  },
  MINERAL: {
    description:{
      eng:[
        {
          title:`(2) Armour Ball`,
          text:`+50% DEF for mineral pkm`
        },
        {
          title:`(4) Mountaineer`,
          text:`+50% SPEDEF and +100% HP for mineral pkm`
        }
      ],
      esp:[
        {
          title:`(2) Bola de Armadura`,
          text:`30% de CV de bonficacion para todos los aliados normales`
        },
        {
          title:`(4) Montañés`,
          text:`+50% SPEDEF y +100% HP por pkm mineral`
        }
      ],
      fra:[
        {
          title:`(2) Boul' Armure`,
          text:`+50% DEF pour les pkm minéraux`
        },
        {
          title:`(4) Montagnard`,
          text:`+50% SPEDEF et +100% HP pour les pkm minéraux`
        }
      ]
    }
  },
  AMORPH: {
    description:{
      eng:[
        {
          title:`(2) Phantom force`,
          text:`Ghosts gain 15% ATK speed and do true damage`
        }
      ],
      esp:[
        {
          title:`(2) Fuerza fantasma`,
          text:`Los fantasmas ganan un 15% de velocidad ATK y hacen daño verdadero`
        }
      ],
      fra:[
        {
          title:`(2) Revenant`,
          text:`Les fantômes gagnent 15% d'ATK speed et font des dégats bruts`
        }
      ]
    }
  },
  FAIRY: {
    description:{
      eng:[
        {
          title:`(2) Charm`,
          text:`25% chance to reduce the ATK speed of the target with each attack (max:50%)`
        },
        {
          title:`(4) Nice smile`,
          text:`25% chance of reducing the target's ATK with each attack (max:50%)`
        }
      ],
      esp:[
        {
          title:`(2) Encanto`,
          text:`25% de probabilidad de reducir la velocidad ATK del objetivo con cada ataque (máx:50%)`
        },
        {
          title:`(4) Bonita sonrisa`,
          text:`25% de probabilidad de reducir el ATK del objetivo con cada ataque (máx:50%)`
        }
      ],
      fra:[
        {
          title:`(2) Charme`,
          text:`25% de chance de réduire l'ATK speed de la cible à chaque attaque (max:50%)`
        },
        {
          title:`(4) Joli sourire`,
          text:`25% de chance de réduire l'ATK de la cible à chaque attaque (max:50%)`
        }
      ]
    }
  },
  ICE: {
    description:{
      eng:[
        {
          title:`(2) Snow alert`,
          text:`+10% chance to freeze the enemy during an attack`
        },
        {
          title:`(4)Sheer cold`,
          text:`+30% chance to freeze the enemy during an attack`
        }
      ],
      esp:[
        {
          title:`(2) Alerta de nieve`,
          text:`+10% de probabilidad de congelar al enemigo durante un ataque`
        },
        {
          title:`(4) Frío Polar`,
          text:`+30% de probabilidad de congelar al enemigo durante un ataque`
        }
      ],
      fra:[
        {
          title:`(2) Alerte neige`,
          text:`+10% de chance de geler l'ennemi lors d'une attaque`
        },
        {
          title:`(4) Glaciation`,
          text:`+30% de chance de geler l'ennemi lors d'une attaque`
        }
      ]
    }
  }
});


const XP_TABLE = [1000, 1500, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000];

const XP_PLACE = [700, 500, 400, 300, 200, 150, 100, 0];

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
  ITEM_DESCRIPTION,
  TYPE_DETAILS,
  EFFECTS_ICON,
  PKM
};
