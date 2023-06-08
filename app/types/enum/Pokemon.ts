import { AnimationType } from "../Animation"

export enum Pkm {
  EGG = "Egg",
  DITTO = "ditto",
  BULBASAUR = "bulbasaur",
  IVYSAUR = "ivysaur",
  VENUSAUR = "venusaur",
  CHARMANDER = "charmander",
  CHARMELEON = "charmeleon",
  CHARIZARD = "charizard",
  SQUIRTLE = "squirtle",
  WARTORTLE = "wartortle",
  BLASTOISE = "blastoise",
  GEODUDE = "geodude",
  GRAVELER = "graveler",
  GOLEM = "golem",
  AZURILL = "azurill",
  MARILL = "marill",
  AZUMARILL = "azumarill",
  ZUBAT = "zubat",
  GOLBAT = "golbat",
  CROBAT = "crobat",
  MAREEP = "mareep",
  FLAFFY = "flaffy",
  AMPHAROS = "ampharos",
  CLEFFA = "cleffa",
  CLEFAIRY = "clefairy",
  CLEFABLE = "clefable",
  IGGLYBUFF = "igglybuff",
  WIGGLYTUFF = "wygglytuff",
  JIGGLYPUFF = "jigglypuff",
  CATERPIE = "caterpie",
  METAPOD = "metapod",
  BUTTERFREE = "butterfree",
  WEEDLE = "weedle",
  KAKUNA = "kakuna",
  BEEDRILL = "beedrill",
  PIDGEY = "pidgey",
  PIDGEOTTO = "pidgeotto",
  PIDGEOT = "pidgeot",
  HOPPIP = "hoppip",
  SKIPLOOM = "skiploom",
  JUMPLUFF = "jumpluff",
  SEEDOT = "seedot",
  NUZLEAF = "nuzleaf",
  SHIFTRY = "shiftry",
  STARLY = "starly",
  STARAVIA = "staravia",
  STARAPTOR = "staraptor",
  CHIKORITA = "chikorita",
  BAYLEEF = "bayleef",
  MEGANIUM = "meganium",
  CYNDAQUIL = "cyndaquil",
  QUILAVA = "quilava",
  TYPHLOSION = "typlosion",
  TOTODILE = "totodile",
  CROCONAW = "croconaw",
  FERALIGATR = "feraligatr",
  TREECKO = "treecko",
  GROVYLE = "grovyle",
  SCEPTILE = "sceptile",
  TORCHIC = "torchic",
  COMBUSKEN = "combusken",
  BLAZIKEN = "blaziken",
  MUDKIP = "mudkip",
  MARSHTOMP = "marshtomp",
  SWAMPERT = "swampert",
  TURTWIG = "turtwig",
  GROTLE = "grotle",
  TORTERRA = "torterra",
  CHIMCHAR = "chimchar",
  MONFERNO = "monferno",
  INFERNAPE = "infernape",
  PIPLUP = "piplup",
  PRINPLUP = "prinplup",
  EMPOLEON = "empoleon",
  NIDORANF = "nidoranF",
  NIDORINA = "nidorina",
  NIDOQUEEN = "nidoqueen",
  NIDORANM = "nidoranM",
  NIDORINO = "nidorino",
  NIDOKING = "nidoking",
  PICHU = "pichu",
  PIKACHU = "pikachu",
  RAICHU = "raichu",
  MACHOP = "machop",
  MACHOKE = "machoke",
  MACHAMP = "machamp",
  HORSEA = "horsea",
  SEADRA = "seadra",
  KINGDRA = "kingdra",
  TRAPINCH = "trapinch",
  VIBRAVA = "vibrava",
  FLYGON = "flygon",
  SPHEAL = "spheal",
  SEALEO = "sealeo",
  WALREIN = "walrein",
  ARON = "aron",
  LAIRON = "lairon",
  AGGRON = "aggron",
  MAGNEMITE = "magnemite",
  MAGNETON = "magneton",
  MAGNEZONE = "magnezone",
  RHYHORN = "rhyhorn",
  RHYDON = "rhydon",
  RHYPERIOR = "rhyperior",
  TOGEPI = "togepi",
  TOGETIC = "togetic",
  TOGEKISS = "togekiss",
  DUSKULL = "duskull",
  DUSCLOPS = "dusclops",
  DUSKNOIR = "dusknoir",
  LOTAD = "lotad",
  LOMBRE = "lombre",
  LUDICOLO = "ludicolo",
  SHINX = "shinx",
  LUXIO = "luxio",
  LUXRAY = "luxray",
  POLIWAG = "poliwag",
  POLIWHIRL = "poliwhirl",
  POLITOED = "politoed",
  ABRA = "abra",
  KADABRA = "kadabra",
  ALAKAZAM = "alakazam",
  GASTLY = "gastly",
  HAUNTER = "haunter",
  GENGAR = "gengar",
  DRATINI = "dratini",
  DRAGONAIR = "dragonair",
  DRAGONITE = "dragonite",
  LARVITAR = "larvitar",
  PUPITAR = "pupitar",
  TYRANITAR = "tyranitar",
  SLAKOTH = "slakoth",
  VIGOROTH = "vigoroth",
  SLAKING = "slaking",
  RALTS = "ralts",
  KIRLIA = "kirlia",
  GARDEVOIR = "gardevoir",
  BAGON = "bagon",
  SHELGON = "shelgon",
  SALAMENCE = "salamence",
  BELDUM = "beldum",
  METANG = "metang",
  METAGROSS = "metagross",
  GIBLE = "gible",
  GABITE = "gabite",
  GARCHOMP = "garchomp",
  ELEKID = "elekid",
  ELECTABUZZ = "electabuzz",
  ELECTIVIRE = "electivire",
  MAGBY = "magby",
  MAGMAR = "magmar",
  MAGMORTAR = "magmortar",
  MUNCHLAX = "munchlax",
  SNORLAX = "snorlax",
  GROWLITHE = "growlithe",
  ARCANINE = "arcanine",
  ONIX = "onix",
  STEELIX = "steelix",
  MEGA_STEELIX = "mega-steelix",
  SCYTHER = "scyther",
  SCIZOR = "scizor",
  MEGA_SCIZOR = "mega-scizor",
  RIOLU = "riolu",
  LUCARIO = "lucario",
  MEGA_LUCARIO = "mega-lucario",
  MAGIKARP = "magikarp",
  RATTATA = "rattata",
  RATICATE = "raticate",
  SPEAROW = "spearow",
  FEAROW = "fearow",
  GYARADOS = "gyarados",
  LUGIA = "lugia",
  GIRATINA = "giratina",
  ZAPDOS = "zapdos",
  MOLTRES = "moltres",
  ARTICUNO = "articuno",
  DIALGA = "dialga",
  PALKIA = "palkia",
  SUICUNE = "suicune",
  RAIKOU = "raikou",
  ENTEI = "entei",
  REGICE = "regice",
  REGIROCK = "regirock",
  REGISTEEL = "registeel",
  KYOGRE = "kyogre",
  GROUDON = "groudon",
  RAYQUAZA = "rayquaza",
  REGIGIGAS = "regigigas",
  EEVEE = "eevee",
  VAPOREON = "vaporeon",
  JOLTEON = "jolteon",
  FLAREON = "flareon",
  ESPEON = "espeon",
  UMBREON = "umbreon",
  LEAFEON = "leafeon",
  SYLVEON = "sylveon",
  MEDITITE = "meditite",
  MEDICHAM = "medicham",
  MEGA_MEDICHAM = "mega-medicham",
  NUMEL = "numel",
  CAMERUPT = "camerupt",
  MEGA_CAMERUPT = "mega-camerupt",
  DARKRAI = "darkrai",
  LITWICK = "litwick",
  LAMPENT = "lampent",
  CHANDELURE = "chandelure",
  SLOWPOKE = "slowpoke",
  SLOWBRO = "slowbro",
  SLOWKING = "slowking",
  BELLSPROUT = "bellsprout",
  WEEPINBELL = "weepinbell",
  VICTREEBEL = "victreebel",
  SWINUB = "swinub",
  PILOSWINE = "piloswine",
  MAMOSWINE = "mamoswine",
  SNORUNT = "snorunt",
  GLALIE = "glalie",
  FROSLASS = "froslass",
  SNOVER = "snover",
  ABOMASNOW = "abomasnow",
  MEGA_ABOMASNOW = "mega-abomasnow",
  VANILLITE = "vanillite",
  VANILLISH = "vanillish",
  VANILLUXE = "vanilluxe",
  GLACEON = "glaceon",
  VOLCARONA = "volcarona",
  LANDORUS = "landorus",
  THUNDURUS = "thundurus",
  TORNADUS = "tornadus",
  KELDEO = "keldeo",
  TERRAKION = "terrakion",
  VIRIZION = "virizion",
  COBALION = "cobalion",
  MANAPHY = "manaphy",
  ROTOM = "rotom",
  SPIRITOMB = "spiritomb",
  ABSOL = "absol",
  LAPRAS = "lapras",
  LATIAS = "latias",
  LATIOS = "latios",
  MESPRIT = "mesprit",
  AZELF = "azelf",
  UXIE = "uxie",
  MEWTWO = "mewtwo",
  KYUREM = "kyurem",
  RESHIRAM = "reshiram",
  ZEKROM = "zekrom",
  CELEBI = "celebi",
  VICTINI = "victini",
  JIRACHI = "jirachi",
  ARCEUS = "arceus",
  DEOXYS = "deoxys",
  SHAYMIN = "shaymin",
  CRESSELIA = "cresselia",
  HEATRAN = "heatran",
  HO_OH = "ho-Oh",
  AERODACTYL = "aerodactyl",
  PRIMAL_KYOGRE = "primal-Kyogre",
  PRIMAL_GROUDON = "primal-Groudon",
  MEOWTH = "meowth",
  PERSIAN = "persian",
  DEINO = "deino",
  ZWEILOUS = "zweilous",
  HYDREIGON = "hydreigon",
  SANDILE = "sandile",
  KROKOROK = "krokorok",
  KROOKODILE = "krookodile",
  SOLOSIS = "solosis",
  DUOSION = "duosion",
  REUNICLUS = "reuniclus",
  MEGA_RAYQUAZA = "mega-Rayquaza",
  SWABLU = "swablu",
  ODDISH = "oddish",
  GLOOM = "gloom",
  VILEPLUME = "vileplume",
  BELLOSSOM = "bellossom",
  AMAURA = "amaura",
  AURORUS = "aurorus",
  ANORITH = "anorith",
  ARMALDO = "armaldo",
  ARCHEN = "archen",
  ARCHEOPS = "archeops",
  SHIELDON = "shieldon",
  BASTIODON = "bastiodon",
  TIRTOUGA = "tirtouga",
  CARRACOSTA = "carracosta",
  LILEEP = "lileep",
  CRADILY = "cradily",
  CRANIDOS = "cranidos",
  RAMPARDOS = "rampardos",
  KABUTO = "kabuto",
  KABUTOPS = "kabutops",
  OMANYTE = "omanyte",
  OMASTAR = "omastar",
  TYRUNT = "tyrunt",
  TYRANTRUM = "tyrantrum",
  BUDEW = "budew",
  ROSELIA = "roselia",
  ROSERADE = "roserade",
  BUNEARY = "buneary",
  LOPUNNY = "lopunny",
  MEGA_LOPUNNY = "mega-lopunny",
  AXEW = "axew",
  FRAXURE = "fraxure",
  HAXORUS = "haxorus",
  VENIPEDE = "venipede",
  WHIRLIPEDE = "whirlipede",
  SCOLIPEDE = "scolipede",
  PORYGON = "porygon",
  PORYGON_2 = "porygon2",
  PORYGON_Z = "porygon-z",
  ELECTRIKE = "electrike",
  MANECTRIC = "manectric",
  MEGA_MANECTRIC = "mega-manectric",
  SHUPPET = "shuppet",
  BANETTE = "banette",
  MEGA_BANETTE = "mega-banette",
  HONEDGE = "honedge",
  DOUBLADE = "doublade",
  AEGISLASH = "aegislash",
  CUBONE = "cubone",
  MAROWAK = "marowak",
  ALOLAN_MAROWAK = "alolan-marowak",
  WHISMUR = "whismur",
  LOUDRED = "loudred",
  EXPLOUD = "exploud",
  TYMPOLE = "tympole",
  PALPITOAD = "palpitoad",
  SEISMITOAD = "seismitoad",
  SEWADDLE = "sewaddle",
  SWADLOON = "swadloon",
  LEAVANNY = "leavanny",
  PIKIPEK = "pikipek",
  TRUMBEAK = "trumbeak",
  TOUCANNON = "toucannon",
  FLABEBE = "flabebe",
  FLOETTE = "floette",
  FLORGES = "florges",
  JANGMO_O = "jangmo-o",
  HAKAMO_O = "hakamo-o",
  KOMMO_O = "kommo-o",
  MELOETTA = "meloetta",
  ALTARIA = "altaria",
  MEGA_ALTARIA = "mega-altaria",
  CASTFORM = "castform",
  CASTFORM_SUN = "castform-sun",
  CASTFORM_RAIN = "castform-rain",
  CASTFORM_HAIL = "castform-hail",
  CORPHISH = "corphish",
  CRAWDAUNT = "crawdaunt",
  JOLTIK = "joltik",
  GALVANTULA = "galvantula",
  GENESECT = "genesect",
  RELICANTH = "relicanth",
  HATENNA = "hatenna",
  HATTREM = "hattrem",
  HATTERENE = "hatterene",
  FENNEKIN = "fennekin",
  BRAIXEN = "braixen",
  DELPHOX = "delphox",
  MAKUHITA = "makuhita",
  HARIYAMA = "hariyama",
  REGIELEKI = "regieleki",
  REGIDRAGO = "regidrago",
  GUZZLORD = "guzzlord",
  ETERNATUS = "eternatus",
  PONYTA = "ponyta",
  RAPIDASH = "rapidash",
  NINCADA = "nincada",
  NINJASK = "ninjask",
  SHEDNINJA = "shedninja",
  NOIBAT = "noibat",
  NOIVERN = "noivern",
  PUMPKABOO = "pumpkaboo",
  GOURGEIST = "gourgeist",
  CACNEA = "cacnea",
  CACTURNE = "cacturne",
  TAUROS = "tauros",
  DEFAULT = "default",
  HAPPINY = "happiny",
  CHANSEY = "chansey",
  BLISSEY = "blissey",
  TAPU_KOKO = "tapu-koko",
  TAPU_LELE = "tapu-lele",
  STAKATAKA = "stakataka",
  BLACEPHALON = "blacephalon",
  HOUNDOUR = "houndour",
  HOUNDOOM = "houndoom",
  MEGA_HOUNDOOM = "mega-houndoom",
  CLAMPERL = "clamperl",
  HUNTAIL = "huntail",
  GOREBYSS = "gorebyss",
  SMOOCHUM = "smoochum",
  JYNX = "jynx",
  SALANDIT = "salandit",
  SALAZZLE = "salazzle",
  VENONAT = "venonat",
  VENOMOTH = "venomoth",
  VOLTORB = "voltorb",
  ELECTRODE = "electrode",
  SLUGMA = "slugma",
  MAGCARGO = "magcargo",
  SNEASEL = "sneasel",
  WEAVILE = "weavile",
  CROAGUNK = "croagunk",
  TOXICROAK = "toxicroak",
  CHINCHOU = "chinchou",
  LANTURN = "lanturn",
  POOCHYENA = "poochyena",
  MIGHTYENA = "mightyena",
  BRONZOR = "bronzor",
  BRONZONG = "bronzong",
  DRIFLOON = "drifloon",
  DRIFBLIM = "drifblim",
  SHROOMISH = "shroomish",
  BRELOOM = "breloom",
  TENTACOOL = "tentacool",
  TENTACRUEL = "tentacruel",
  SNUBULL = "snubull",
  GRANBULL = "granbull",
  SEVIPER = "seviper",
  VULPIX = "vulpix",
  NINETALES = "ninetales",
  ALOLAN_VULPIX = "alolan-vulpix",
  ALOLAN_NINETALES = "alolan-ninetales",
  BUIZEL = "buizel",
  FLOATZEL = "floatzel",
  MAWILE = "mawile",
  KECLEON = "kecleon",
  CARBINK = "carbink",
  DIANCIE = "diancie",
  CHATOT = "chatot",
  GOOMY = "goomy",
  SLIGOO = "sligoo",
  GOODRA = "goodra",
  MEW = "mew",
  BOUNSWEET = "bounsweet",
  STEENEE = "steenee",
  TSAREENA = "tsareena",
  VOLCANION = "volcanion",
  APPLIN = "applin",
  APPLETUN = "appletun",
  OSHAWOTT = "oshawott",
  DEWOTT = "dewott",
  SAMUROTT = "samurott",
  SNOM = "snom",
  FROSMOTH = "frosmoth",
  WAILMER = "wailmer",
  WAILORD = "wailord",
  DREEPY = "dreepy",
  DRAKLOAK = "drakloak",
  DRAGAPULT = "dragapult",
  SNIVY = "snivy",
  SERVINE = "servine",
  SERPERIOR = "serperior",
  SCORBUNNY = "scorbunny",
  RABOOT = "raboot",
  CINDERACE = "cinderace",
  POPPLIO = "popplio",
  BRIONNE = "brionne",
  PRIMARINA = "primarina",
  GOTHITA = "gothita",
  GOTHORITA = "gothorita",
  GOTHITELLE = "gothitelle",
  SANDSHREW = "sandshrew",
  SANDSLASH = "sandslash",
  FARFETCH_D = "farfetch-d",
  UNOWN_A = "unown-a",
  UNOWN_B = "unown-b",
  UNOWN_C = "unown-c",
  UNOWN_D = "unown-d",
  UNOWN_E = "unown-e",
  UNOWN_F = "unown-f",
  UNOWN_G = "unown-g",
  UNOWN_H = "unown-h",
  UNOWN_I = "unown-i",
  UNOWN_J = "unown-j",
  UNOWN_K = "unown-k",
  UNOWN_L = "unown-l",
  UNOWN_M = "unown-m",
  UNOWN_N = "unown-n",
  UNOWN_O = "unown-o",
  UNOWN_P = "unown-p",
  UNOWN_Q = "unown-q",
  UNOWN_R = "unown-r",
  UNOWN_S = "unown-s",
  UNOWN_T = "unown-t",
  UNOWN_U = "unown-u",
  UNOWN_V = "unown-v",
  UNOWN_W = "unown-w",
  UNOWN_X = "unown-x",
  UNOWN_Y = "unown-y",
  UNOWN_Z = "unown-z",
  UNOWN_QUESTION = "unown-question",
  UNOWN_EXCLAMATION = "unown-exclamation",
  TAPU_FINI = "tapu-fini",
  TAPU_BULU = "tapu-bulu",
  DIGLETT = "diglett",
  DUGTRIO = "dugtrio",
  ROWLET = "rowlet",
  DARTIX = "dartix",
  DECIDUEYE = "decidueye",
  ZORUA = "zorua",
  ZOROARK = "zoroark",
  HISUI_ZORUA = "hisui-zorua",
  HISUI_ZOROARK = "hisui-zoroark",
  FROAKIE = "froakie",
  FROGADIER = "frogadier",
  GRENINJA = "greninja",
  TYROGUE = "tyrogue",
  HITMONLEE = "hitmonlee",
  HITMONCHAN = "hitmonchan",
  HITMONTOP = "hitmontop",
  MIMIKYU = "mimikyu",
  GRIMER = "grimer",
  MUK = "muk",
  ALOLAN_GRIMER = "alolan-grimer",
  ALOLAN_MUK = "alolan_muk",
  CARVANHA = "carvanha",
  SHARPEDO = "sharpedo",
  PINECO = "pineco",
  FORRETRESS = "forretress",
  SEEL = "seel",
  DEWGONG = "dewgong",
  ALOLAN_GEODUDE = "alolan-geodude",
  ALOLAN_GRAVELER = "alolan-graveler",
  ALOLAN_GOLEM = "alolan-golem",
  EKANS = "ekans",
  ARBOK = "arbok",
  MIME_JR = "mime-jr",
  MR_MIME = "mr-mime",
  ORIGIN_GIRATINA = "origin-giratina",
  PIROUETTE_MELOETTA = "pirouette-meloetta",
  MELMETAL = "melmetal",
  HOOPA = "hoopa",
  HOOPA_UNBOUND = "hoopa_unbound",
  SILVALLY = "silvally",
  TYPE_NULL = "type_null",
  ZERAORA = "zeraora",
  XERNEAS = "xerneas",
  YVELTAL = "yveltal",
  MARSHADOW = "marshadow",
  HOOTHOOT = "hoothoot",
  NOCTOWL = "noctowl",
  BONSLEY = "bonsley",
  SUDOWOODO = "sudowoodo",
  PHIONE = "phione",
  COMBEE = "combee",
  VESPIQUEEN = "vespiqueen",
  SHUCKLE = "shuckle",
  TEPIG = "tepig",
  PIGNITE = "pignite",
  EMBOAR = "emboar",
  WYNAUT = "wynaut",
  WOBBUFFET = "Wobbuffet",
  LUNATONE = "lunatone",
  SOLROCK = "solrock"
}

export const PkmIndex: { [key in Pkm]: string } = {
  [Pkm.EGG]: "0000-0004",
  [Pkm.DEFAULT]: "0000",
  [Pkm.DITTO]: "0132",
  [Pkm.BULBASAUR]: "0001",
  [Pkm.IVYSAUR]: "0002",
  [Pkm.VENUSAUR]: "0003",
  [Pkm.CHARMANDER]: "0004",
  [Pkm.CHARMELEON]: "0005",
  [Pkm.CHARIZARD]: "0006",
  [Pkm.SQUIRTLE]: "0007",
  [Pkm.WARTORTLE]: "0008",
  [Pkm.BLASTOISE]: "0009",
  [Pkm.GEODUDE]: "0074",
  [Pkm.GRAVELER]: "0075",
  [Pkm.GOLEM]: "0076",
  [Pkm.AZURILL]: "0298",
  [Pkm.MARILL]: "0183",
  [Pkm.AZUMARILL]: "0184",
  [Pkm.ZUBAT]: "0041",
  [Pkm.GOLBAT]: "0042",
  [Pkm.CROBAT]: "0169",
  [Pkm.MAREEP]: "0179",
  [Pkm.FLAFFY]: "0180",
  [Pkm.AMPHAROS]: "0181",
  [Pkm.CLEFFA]: "0173",
  [Pkm.CLEFAIRY]: "0035",
  [Pkm.CLEFABLE]: "0036",
  [Pkm.IGGLYBUFF]: "0174",
  [Pkm.WIGGLYTUFF]: "0040",
  [Pkm.JIGGLYPUFF]: "0039",
  [Pkm.CATERPIE]: "0010",
  [Pkm.METAPOD]: "0011",
  [Pkm.BUTTERFREE]: "0012",
  [Pkm.WEEDLE]: "0013",
  [Pkm.KAKUNA]: "0014",
  [Pkm.BEEDRILL]: "0015",
  [Pkm.PIDGEY]: "0016",
  [Pkm.PIDGEOTTO]: "0017",
  [Pkm.PIDGEOT]: "0018",
  [Pkm.HOPPIP]: "0187",
  [Pkm.SKIPLOOM]: "0188",
  [Pkm.JUMPLUFF]: "0189",
  [Pkm.SEEDOT]: "0273",
  [Pkm.NUZLEAF]: "0274",
  [Pkm.SHIFTRY]: "0275",
  [Pkm.STARLY]: "0396",
  [Pkm.STARAVIA]: "0397",
  [Pkm.STARAPTOR]: "0398",
  [Pkm.CHIKORITA]: "0152",
  [Pkm.BAYLEEF]: "0153",
  [Pkm.MEGANIUM]: "0154",
  [Pkm.CYNDAQUIL]: "0155",
  [Pkm.QUILAVA]: "0156",
  [Pkm.TYPHLOSION]: "0157",
  [Pkm.TOTODILE]: "0158",
  [Pkm.CROCONAW]: "0159",
  [Pkm.FERALIGATR]: "0160",
  [Pkm.TREECKO]: "0252",
  [Pkm.GROVYLE]: "0253",
  [Pkm.SCEPTILE]: "0254",
  [Pkm.TORCHIC]: "0255",
  [Pkm.COMBUSKEN]: "0256",
  [Pkm.BLAZIKEN]: "0257",
  [Pkm.MUDKIP]: "0258",
  [Pkm.MARSHTOMP]: "0259",
  [Pkm.SWAMPERT]: "0260",
  [Pkm.TURTWIG]: "0387",
  [Pkm.GROTLE]: "0388",
  [Pkm.TORTERRA]: "0389",
  [Pkm.CHIMCHAR]: "0390",
  [Pkm.MONFERNO]: "0391",
  [Pkm.INFERNAPE]: "0392",
  [Pkm.PIPLUP]: "0393",
  [Pkm.PRINPLUP]: "0394",
  [Pkm.EMPOLEON]: "0395",
  [Pkm.NIDORANF]: "0029",
  [Pkm.NIDORINA]: "0030",
  [Pkm.NIDOQUEEN]: "0031",
  [Pkm.NIDORANM]: "0032",
  [Pkm.NIDORINO]: "0033",
  [Pkm.NIDOKING]: "0034",
  [Pkm.PICHU]: "0172",
  [Pkm.PIKACHU]: "0025",
  [Pkm.RAICHU]: "0026",
  [Pkm.SANDSHREW]: "0027",
  [Pkm.SANDSLASH]: "0028",
  [Pkm.MACHOP]: "0066",
  [Pkm.MACHOKE]: "0067",
  [Pkm.MACHAMP]: "0068",
  [Pkm.HORSEA]: "0116",
  [Pkm.SEADRA]: "0117",
  [Pkm.KINGDRA]: "0230",
  [Pkm.TRAPINCH]: "0328",
  [Pkm.VIBRAVA]: "0329",
  [Pkm.FLYGON]: "0330",
  [Pkm.SPHEAL]: "0363",
  [Pkm.SEALEO]: "0364",
  [Pkm.WALREIN]: "0365",
  [Pkm.ARON]: "0304",
  [Pkm.LAIRON]: "0305",
  [Pkm.AGGRON]: "0306",
  [Pkm.MAGNEMITE]: "0081",
  [Pkm.MAGNETON]: "0082",
  [Pkm.MAGNEZONE]: "0462",
  [Pkm.RHYHORN]: "0111",
  [Pkm.RHYDON]: "0112",
  [Pkm.RHYPERIOR]: "0464",
  [Pkm.TOGEPI]: "0175",
  [Pkm.TOGETIC]: "0176",
  [Pkm.TOGEKISS]: "0468",
  [Pkm.DUSKULL]: "0355",
  [Pkm.DUSCLOPS]: "0356",
  [Pkm.DUSKNOIR]: "0477",
  [Pkm.LOTAD]: "0270",
  [Pkm.LOMBRE]: "0271",
  [Pkm.LUDICOLO]: "0272",
  [Pkm.SHINX]: "0403",
  [Pkm.LUXIO]: "0404",
  [Pkm.LUXRAY]: "0405",
  [Pkm.POLIWAG]: "0060",
  [Pkm.POLIWHIRL]: "0061",
  [Pkm.POLITOED]: "0186",
  [Pkm.ABRA]: "0063",
  [Pkm.KADABRA]: "0064",
  [Pkm.ALAKAZAM]: "0065",
  [Pkm.GASTLY]: "0092",
  [Pkm.HAUNTER]: "0093",
  [Pkm.GENGAR]: "0094",
  [Pkm.DRATINI]: "0147",
  [Pkm.DRAGONAIR]: "0148",
  [Pkm.DRAGONITE]: "0149",
  [Pkm.LARVITAR]: "0246",
  [Pkm.PUPITAR]: "0247",
  [Pkm.TYRANITAR]: "0248",
  [Pkm.SLAKOTH]: "0287",
  [Pkm.VIGOROTH]: "0288",
  [Pkm.SLAKING]: "0289",
  [Pkm.RALTS]: "0280",
  [Pkm.KIRLIA]: "0281",
  [Pkm.GARDEVOIR]: "0282",
  [Pkm.BAGON]: "0371",
  [Pkm.SHELGON]: "0372",
  [Pkm.SALAMENCE]: "0373",
  [Pkm.BELDUM]: "0374",
  [Pkm.METANG]: "0375",
  [Pkm.METAGROSS]: "0376",
  [Pkm.GIBLE]: "0443",
  [Pkm.GABITE]: "0444",
  [Pkm.GARCHOMP]: "0445",
  [Pkm.ELEKID]: "0239",
  [Pkm.ELECTABUZZ]: "0125",
  [Pkm.ELECTIVIRE]: "0466",
  [Pkm.MAGBY]: "0240",
  [Pkm.MAGMAR]: "0126",
  [Pkm.MAGMORTAR]: "0467",
  [Pkm.MUNCHLAX]: "0446",
  [Pkm.SNORLAX]: "0143",
  [Pkm.GROWLITHE]: "0058",
  [Pkm.ARCANINE]: "0059",
  [Pkm.ONIX]: "0095",
  [Pkm.STEELIX]: "0208",
  [Pkm.MEGA_STEELIX]: "0208-0001",
  [Pkm.SCYTHER]: "0123",
  [Pkm.SCIZOR]: "0212",
  [Pkm.MEGA_SCIZOR]: "0212-0001",
  [Pkm.RIOLU]: "0447",
  [Pkm.LUCARIO]: "0448",
  [Pkm.MEGA_LUCARIO]: "0448-0001",
  [Pkm.MAGIKARP]: "0129",
  [Pkm.RATTATA]: "0019",
  [Pkm.RATICATE]: "0020",
  [Pkm.SPEAROW]: "0021",
  [Pkm.FEAROW]: "0022",
  [Pkm.GYARADOS]: "0130",
  [Pkm.LUGIA]: "0249",
  [Pkm.GIRATINA]: "0487",
  [Pkm.ZAPDOS]: "0145",
  [Pkm.MOLTRES]: "0146",
  [Pkm.ARTICUNO]: "0144",
  [Pkm.DIALGA]: "0483",
  [Pkm.PALKIA]: "0484",
  [Pkm.SUICUNE]: "0245",
  [Pkm.RAIKOU]: "0243",
  [Pkm.ENTEI]: "0244",
  [Pkm.REGICE]: "0378",
  [Pkm.REGIROCK]: "0377",
  [Pkm.REGISTEEL]: "0379",
  [Pkm.KYOGRE]: "0382",
  [Pkm.GROUDON]: "0383",
  [Pkm.RAYQUAZA]: "0384",
  [Pkm.REGIGIGAS]: "0486",
  [Pkm.EEVEE]: "0133",
  [Pkm.VAPOREON]: "0134",
  [Pkm.JOLTEON]: "0135",
  [Pkm.FLAREON]: "0136",
  [Pkm.ESPEON]: "0196",
  [Pkm.UMBREON]: "0197",
  [Pkm.LEAFEON]: "0470",
  [Pkm.SYLVEON]: "0700",
  [Pkm.MEDITITE]: "0307",
  [Pkm.MEDICHAM]: "0308",
  [Pkm.MEGA_MEDICHAM]: "0308-0001",
  [Pkm.NUMEL]: "0322",
  [Pkm.CAMERUPT]: "0323",
  [Pkm.MEGA_CAMERUPT]: "0323-0001",
  [Pkm.DARKRAI]: "0491",
  [Pkm.LITWICK]: "0607",
  [Pkm.LAMPENT]: "0608",
  [Pkm.CHANDELURE]: "0609",
  [Pkm.SLOWPOKE]: "0079",
  [Pkm.SLOWBRO]: "0080",
  [Pkm.SLOWKING]: "0199",
  [Pkm.BELLSPROUT]: "0069",
  [Pkm.WEEPINBELL]: "0070",
  [Pkm.VICTREEBEL]: "0071",
  [Pkm.CARVANHA]: "0318",
  [Pkm.SWINUB]: "0220",
  [Pkm.PILOSWINE]: "0221",
  [Pkm.MAMOSWINE]: "0473",
  [Pkm.SNORUNT]: "0361",
  [Pkm.GLALIE]: "0362",
  [Pkm.FROSLASS]: "0478",
  [Pkm.SNOVER]: "0459",
  [Pkm.ABOMASNOW]: "0460",
  [Pkm.MEGA_ABOMASNOW]: "0460-0001",
  [Pkm.VANILLITE]: "0582",
  [Pkm.VANILLISH]: "0583",
  [Pkm.VANILLUXE]: "0584",
  [Pkm.GLACEON]: "0471",
  [Pkm.VOLCARONA]: "0637",
  [Pkm.LANDORUS]: "0645",
  [Pkm.THUNDURUS]: "0642",
  [Pkm.TORNADUS]: "0641",
  [Pkm.KELDEO]: "0647",
  [Pkm.TERRAKION]: "0639",
  [Pkm.VIRIZION]: "0640",
  [Pkm.COBALION]: "0638",
  [Pkm.MANAPHY]: "0490",
  [Pkm.ROTOM]: "0479",
  [Pkm.SPIRITOMB]: "0442",
  [Pkm.ABSOL]: "0359",
  [Pkm.LAPRAS]: "0131",
  [Pkm.LATIAS]: "0380",
  [Pkm.LATIOS]: "0381",
  [Pkm.MESPRIT]: "0481",
  [Pkm.AZELF]: "0482",
  [Pkm.UXIE]: "0480",
  [Pkm.MEWTWO]: "0150",
  [Pkm.KYUREM]: "0646",
  [Pkm.RESHIRAM]: "0643",
  [Pkm.ZEKROM]: "0644",
  [Pkm.CELEBI]: "0251",
  [Pkm.VICTINI]: "0494",
  [Pkm.JIRACHI]: "0385",
  [Pkm.ARCEUS]: "0493",
  [Pkm.DEOXYS]: "0386",
  [Pkm.SHAYMIN]: "0492",
  [Pkm.CRESSELIA]: "0488",
  [Pkm.HEATRAN]: "0485",
  [Pkm.HO_OH]: "0250",
  [Pkm.AERODACTYL]: "0142",
  [Pkm.PRIMAL_KYOGRE]: "0382-0001",
  [Pkm.PRIMAL_GROUDON]: "0383-0001",
  [Pkm.MEOWTH]: "0052",
  [Pkm.PERSIAN]: "0053",
  [Pkm.DEINO]: "0633",
  [Pkm.ZWEILOUS]: "0634",
  [Pkm.HYDREIGON]: "0635",
  [Pkm.SANDILE]: "0551",
  [Pkm.KROKOROK]: "0552",
  [Pkm.KROOKODILE]: "0553",
  [Pkm.SOLOSIS]: "0577",
  [Pkm.DUOSION]: "0578",
  [Pkm.REUNICLUS]: "0579",
  [Pkm.MEGA_RAYQUAZA]: "0384-0001",
  [Pkm.SWABLU]: "0333",
  [Pkm.ODDISH]: "0043",
  [Pkm.GLOOM]: "0044",
  [Pkm.VILEPLUME]: "0045",
  [Pkm.BELLOSSOM]: "0182",
  [Pkm.AMAURA]: "0698",
  [Pkm.AURORUS]: "0699",
  [Pkm.ANORITH]: "0347",
  [Pkm.ARMALDO]: "0348",
  [Pkm.ARCHEN]: "0566",
  [Pkm.ARCHEOPS]: "0567",
  [Pkm.SHIELDON]: "0410",
  [Pkm.BASTIODON]: "0411",
  [Pkm.TIRTOUGA]: "0564",
  [Pkm.CARRACOSTA]: "0565",
  [Pkm.LILEEP]: "0345",
  [Pkm.CRADILY]: "0346",
  [Pkm.CRANIDOS]: "0408",
  [Pkm.RAMPARDOS]: "0409",
  [Pkm.KABUTO]: "0140",
  [Pkm.KABUTOPS]: "0141",
  [Pkm.OMANYTE]: "0138",
  [Pkm.OMASTAR]: "0139",
  [Pkm.TYRUNT]: "0696",
  [Pkm.TYRANTRUM]: "0697",
  [Pkm.BUDEW]: "0406",
  [Pkm.ROSELIA]: "0315",
  [Pkm.ROSERADE]: "0407",
  [Pkm.BUNEARY]: "0427",
  [Pkm.LOPUNNY]: "0428",
  [Pkm.MEGA_LOPUNNY]: "0428-0001",
  [Pkm.AXEW]: "0610",
  [Pkm.FRAXURE]: "0611",
  [Pkm.HAXORUS]: "0612",
  [Pkm.VENIPEDE]: "0543",
  [Pkm.WHIRLIPEDE]: "0544",
  [Pkm.SCOLIPEDE]: "0545",
  [Pkm.PORYGON]: "0137",
  [Pkm.PORYGON_2]: "0233",
  [Pkm.PORYGON_Z]: "0474",
  [Pkm.ELECTRIKE]: "0309",
  [Pkm.MANECTRIC]: "0310",
  [Pkm.MEGA_MANECTRIC]: "0310-0001",
  [Pkm.SHUPPET]: "0353",
  [Pkm.BANETTE]: "0354",
  [Pkm.MEGA_BANETTE]: "0354-0001",
  [Pkm.HONEDGE]: "0679",
  [Pkm.DOUBLADE]: "0680",
  [Pkm.AEGISLASH]: "0681",
  [Pkm.CUBONE]: "0104",
  [Pkm.MAROWAK]: "0105",
  [Pkm.ALOLAN_MAROWAK]: "0105-0001",
  [Pkm.WHISMUR]: "0293",
  [Pkm.LOUDRED]: "0294",
  [Pkm.EXPLOUD]: "0295",
  [Pkm.TYMPOLE]: "0535",
  [Pkm.PALPITOAD]: "0536",
  [Pkm.SEISMITOAD]: "0537",
  [Pkm.SEWADDLE]: "0540",
  [Pkm.SWADLOON]: "0541",
  [Pkm.LEAVANNY]: "0542",
  [Pkm.PIKIPEK]: "0731",
  [Pkm.TRUMBEAK]: "0732",
  [Pkm.TOUCANNON]: "0733",
  [Pkm.FLABEBE]: "0669",
  [Pkm.FLOETTE]: "0670",
  [Pkm.FLORGES]: "0671",
  [Pkm.JANGMO_O]: "0782",
  [Pkm.HAKAMO_O]: "0783",
  [Pkm.KOMMO_O]: "0784",
  [Pkm.MELOETTA]: "0648",
  [Pkm.ALTARIA]: "0334",
  [Pkm.MEGA_ALTARIA]: "0334-0001",
  [Pkm.CASTFORM]: "0351",
  [Pkm.CASTFORM_SUN]: "0351-0001",
  [Pkm.CASTFORM_RAIN]: "0351-0002",
  [Pkm.CASTFORM_HAIL]: "0351-0003",
  [Pkm.CORPHISH]: "0341",
  [Pkm.CRAWDAUNT]: "0342",
  [Pkm.JOLTIK]: "0595",
  [Pkm.GALVANTULA]: "0596",
  [Pkm.GENESECT]: "0649",
  [Pkm.RELICANTH]: "0369",
  [Pkm.DIANCIE]: "0719",
  [Pkm.HATENNA]: "0856",
  [Pkm.HATTREM]: "0857",
  [Pkm.HATTERENE]: "0858",
  [Pkm.FENNEKIN]: "0653",
  [Pkm.BRAIXEN]: "0654",
  [Pkm.DELPHOX]: "0655",
  [Pkm.MAKUHITA]: "0296",
  [Pkm.HARIYAMA]: "0297",
  [Pkm.REGIELEKI]: "0894",
  [Pkm.REGIDRAGO]: "0895",
  [Pkm.GUZZLORD]: "0799",
  [Pkm.ETERNATUS]: "0890",
  [Pkm.NOIBAT]: "0714",
  [Pkm.NOIVERN]: "0715",
  [Pkm.PUMPKABOO]: "0710",
  [Pkm.GOURGEIST]: "0711",
  [Pkm.NINCADA]: "0290",
  [Pkm.NINJASK]: "0291",
  [Pkm.SHEDNINJA]: "0292",
  [Pkm.PONYTA]: "0077",
  [Pkm.RAPIDASH]: "0078",
  cacnea: "0331",
  cacturne: "0332",
  tauros: "0128",
  happiny: "0440",
  chansey: "0113",
  blissey: "0242",
  [Pkm.TAPU_KOKO]: "0785",
  [Pkm.TAPU_LELE]: "0786",
  [Pkm.STAKATAKA]: "0805",
  [Pkm.BLACEPHALON]: "0806",
  [Pkm.HOUNDOUR]: "0228",
  [Pkm.HOUNDOOM]: "0229",
  [Pkm.MEGA_HOUNDOOM]: "0229-0001",
  [Pkm.CLAMPERL]: "0366",
  [Pkm.HUNTAIL]: "0367",
  [Pkm.GOREBYSS]: "0368",
  smoochum: "0238",
  jynx: "0124",
  salandit: "0757",
  salazzle: "0758",
  venonat: "0048",
  venomoth: "0049",
  voltorb: "0100",
  electrode: "0101",
  slugma: "0218",
  magcargo: "0219",
  sneasel: "0215",
  weavile: "0461",
  croagunk: "0453",
  toxicroak: "0454",
  chinchou: "0170",
  lanturn: "0171",
  poochyena: "0261",
  mightyena: "0262",
  bronzor: "0436",
  bronzong: "0437",
  drifloon: "0425",
  drifblim: "0426",
  shroomish: "0285",
  breloom: "0286",
  tentacool: "0072",
  tentacruel: "0073",
  snubull: "0209",
  granbull: "0210",
  [Pkm.SEVIPER]: "0336",
  [Pkm.VULPIX]: "0037",
  [Pkm.NINETALES]: "0038",
  [Pkm.ALOLAN_VULPIX]: "0037-0001",
  [Pkm.ALOLAN_NINETALES]: "0038-0001",
  [Pkm.BUIZEL]: "0418",
  [Pkm.FLOATZEL]: "0419",
  [Pkm.KECLEON]: "0352",
  [Pkm.MAWILE]: "0303",
  [Pkm.CARBINK]: "0703",
  [Pkm.CHATOT]: "0441",
  [Pkm.GOOMY]: "0704",
  [Pkm.SLIGOO]: "0705",
  [Pkm.GOODRA]: "0706",
  [Pkm.MEW]: "0151",
  [Pkm.BOUNSWEET]: "0761",
  [Pkm.STEENEE]: "0762",
  [Pkm.TSAREENA]: "0763",
  [Pkm.VOLCANION]: "0721",
  [Pkm.APPLIN]: "0840",
  [Pkm.APPLETUN]: "0842",
  [Pkm.OSHAWOTT]: "0501",
  [Pkm.DEWOTT]: "0502",
  [Pkm.SAMUROTT]: "0503",
  [Pkm.SNOM]: "0872",
  [Pkm.FROSMOTH]: "0873",
  [Pkm.WAILMER]: "0320",
  [Pkm.WAILORD]: "0321",
  [Pkm.DREEPY]: "0885",
  [Pkm.DRAKLOAK]: "0886",
  [Pkm.DRAGAPULT]: "0887",
  [Pkm.SNIVY]: "0495",
  [Pkm.SERVINE]: "0496",
  [Pkm.SERPERIOR]: "0497",
  [Pkm.SCORBUNNY]: "0813",
  [Pkm.RABOOT]: "0814",
  [Pkm.CINDERACE]: "0815",
  [Pkm.POPPLIO]: "0728",
  [Pkm.BRIONNE]: "0729",
  [Pkm.PRIMARINA]: "0730",
  [Pkm.GOTHITA]: "0574",
  [Pkm.GOTHORITA]: "0575",
  [Pkm.GOTHITELLE]: "0576",
  [Pkm.FARFETCH_D]: "0083",
  [Pkm.UNOWN_A]: "0201",
  [Pkm.UNOWN_B]: "0201-0001",
  [Pkm.UNOWN_C]: "0201-0002",
  [Pkm.UNOWN_D]: "0201-0003",
  [Pkm.UNOWN_E]: "0201-0004",
  [Pkm.UNOWN_F]: "0201-0005",
  [Pkm.UNOWN_G]: "0201-0006",
  [Pkm.UNOWN_H]: "0201-0007",
  [Pkm.UNOWN_I]: "0201-0008",
  [Pkm.UNOWN_J]: "0201-0009",
  [Pkm.UNOWN_K]: "0201-0010",
  [Pkm.UNOWN_L]: "0201-0011",
  [Pkm.UNOWN_M]: "0201-0012",
  [Pkm.UNOWN_N]: "0201-0013",
  [Pkm.UNOWN_O]: "0201-0014",
  [Pkm.UNOWN_P]: "0201-0015",
  [Pkm.UNOWN_Q]: "0201-0016",
  [Pkm.UNOWN_R]: "0201-0017",
  [Pkm.UNOWN_S]: "0201-0018",
  [Pkm.UNOWN_T]: "0201-0019",
  [Pkm.UNOWN_U]: "0201-0020",
  [Pkm.UNOWN_V]: "0201-0021",
  [Pkm.UNOWN_W]: "0201-0022",
  [Pkm.UNOWN_X]: "0201-0023",
  [Pkm.UNOWN_Y]: "0201-0024",
  [Pkm.UNOWN_Z]: "0201-0025",
  [Pkm.UNOWN_QUESTION]: "0201-0027",
  [Pkm.UNOWN_EXCLAMATION]: "0201-0026",
  [Pkm.TAPU_FINI]: "0788",
  [Pkm.TAPU_BULU]: "0787",
  [Pkm.DIGLETT]: "0050",
  [Pkm.DUGTRIO]: "0051",
  [Pkm.ROWLET]: "0722",
  [Pkm.DARTIX]: "0723",
  [Pkm.DECIDUEYE]: "0724",
  [Pkm.ZORUA]: "0570",
  [Pkm.ZOROARK]: "0571",
  [Pkm.FROAKIE]: "0656",
  [Pkm.FROGADIER]: "0657",
  [Pkm.GRENINJA]: "0658",
  [Pkm.TYROGUE]: "0236",
  [Pkm.HITMONLEE]: "0106",
  [Pkm.HITMONCHAN]: "0107",
  [Pkm.HITMONTOP]: "0237",
  [Pkm.MIMIKYU]: "0778",
  [Pkm.GRIMER]: "0088",
  [Pkm.MUK]: "0089",
  [Pkm.SHARPEDO]: "0319",
  [Pkm.HISUI_ZORUA]: "0570-0002",
  [Pkm.HISUI_ZOROARK]: "0571-0001",
  [Pkm.ALOLAN_GRIMER]: "0088-0001",
  [Pkm.ALOLAN_MUK]: "0089-0001",
  [Pkm.PINECO]: "0204",
  [Pkm.FORRETRESS]: "0205",
  [Pkm.SEEL]: "0086",
  [Pkm.DEWGONG]: "0087",
  [Pkm.ALOLAN_GEODUDE]: "0074-0001",
  [Pkm.ALOLAN_GRAVELER]: "0075-0001",
  [Pkm.ALOLAN_GOLEM]: "0076-0001",
  [Pkm.EKANS]: "0023",
  [Pkm.ARBOK]: "0024",
  [Pkm.MIME_JR]: "0439",
  [Pkm.MR_MIME]: "0122",
  [Pkm.ORIGIN_GIRATINA]: "0487-0001",
  [Pkm.PIROUETTE_MELOETTA]: "0648-0001",
  [Pkm.MELMETAL]: "0809",
  [Pkm.HOOPA]: "0720",
  [Pkm.HOOPA_UNBOUND]: "0720-0001",
  [Pkm.SILVALLY]: "0773",
  [Pkm.ZERAORA]: "0807",
  [Pkm.XERNEAS]: "0716",
  [Pkm.YVELTAL]: "0717",
  [Pkm.TYPE_NULL]: "0772",
  [Pkm.MARSHADOW]: "0802",
  [Pkm.HOOTHOOT]: "0163",
  [Pkm.NOCTOWL]: "0164",
  [Pkm.BONSLEY]: "0438",
  [Pkm.SUDOWOODO]: "0185",
  [Pkm.PHIONE]: "0489",
  [Pkm.COMBEE]: "0415",
  [Pkm.VESPIQUEEN]: "0416",
  [Pkm.SHUCKLE]: "0213",
  [Pkm.TEPIG]: "0498",
  [Pkm.PIGNITE]: "0499",
  [Pkm.EMBOAR]: "0500",
  [Pkm.WYNAUT]: "0360",
  [Pkm.WOBBUFFET]: "0202",
  [Pkm.LUNATONE]: "0337",
  [Pkm.SOLROCK]: "0338"
}

export const PkmFamily: { [key in Pkm]: Pkm } = {
  [Pkm.EGG]: Pkm.EGG,
  [Pkm.BULBASAUR]: Pkm.BULBASAUR,
  [Pkm.IVYSAUR]: Pkm.BULBASAUR,
  [Pkm.VENUSAUR]: Pkm.BULBASAUR,
  [Pkm.CHARMANDER]: Pkm.CHARMANDER,
  [Pkm.CHARMELEON]: Pkm.CHARMANDER,
  [Pkm.CHARIZARD]: Pkm.CHARMANDER,
  [Pkm.SQUIRTLE]: Pkm.SQUIRTLE,
  [Pkm.WARTORTLE]: Pkm.SQUIRTLE,
  [Pkm.BLASTOISE]: Pkm.SQUIRTLE,
  [Pkm.SLOWPOKE]: Pkm.SLOWPOKE,
  [Pkm.SLOWBRO]: Pkm.SLOWPOKE,
  [Pkm.SLOWKING]: Pkm.SLOWPOKE,
  [Pkm.GEODUDE]: Pkm.GEODUDE,
  [Pkm.GRAVELER]: Pkm.GEODUDE,
  [Pkm.GOLEM]: Pkm.GEODUDE,
  [Pkm.AZURILL]: Pkm.AZURILL,
  [Pkm.MARILL]: Pkm.AZURILL,
  [Pkm.AZUMARILL]: Pkm.AZURILL,
  [Pkm.ZUBAT]: Pkm.ZUBAT,
  [Pkm.GOLBAT]: Pkm.ZUBAT,
  [Pkm.CROBAT]: Pkm.ZUBAT,
  [Pkm.AMPHAROS]: Pkm.MAREEP,
  [Pkm.MAREEP]: Pkm.MAREEP,
  [Pkm.FLAFFY]: Pkm.MAREEP,
  [Pkm.CLEFFA]: Pkm.CLEFFA,
  [Pkm.CLEFAIRY]: Pkm.CLEFFA,
  [Pkm.CLEFABLE]: Pkm.CLEFFA,
  [Pkm.IGGLYBUFF]: Pkm.IGGLYBUFF,
  [Pkm.JIGGLYPUFF]: Pkm.IGGLYBUFF,
  [Pkm.WIGGLYTUFF]: Pkm.IGGLYBUFF,
  [Pkm.CATERPIE]: Pkm.CATERPIE,
  [Pkm.METAPOD]: Pkm.CATERPIE,
  [Pkm.BUTTERFREE]: Pkm.CATERPIE,
  [Pkm.WEEDLE]: Pkm.WEEDLE,
  [Pkm.KAKUNA]: Pkm.WEEDLE,
  [Pkm.BEEDRILL]: Pkm.WEEDLE,
  [Pkm.PIDGEY]: Pkm.PIDGEY,
  [Pkm.PIDGEOTTO]: Pkm.PIDGEY,
  [Pkm.PIDGEOT]: Pkm.PIDGEY,
  [Pkm.HOPPIP]: Pkm.HOPPIP,
  [Pkm.SKIPLOOM]: Pkm.HOPPIP,
  [Pkm.JUMPLUFF]: Pkm.HOPPIP,
  [Pkm.SEEDOT]: Pkm.SEEDOT,
  [Pkm.NUZLEAF]: Pkm.SEEDOT,
  [Pkm.SHIFTRY]: Pkm.SEEDOT,
  [Pkm.STARLY]: Pkm.STARLY,
  [Pkm.STARAVIA]: Pkm.STARLY,
  [Pkm.STARAPTOR]: Pkm.STARLY,
  [Pkm.CHIKORITA]: Pkm.CHIKORITA,
  [Pkm.BAYLEEF]: Pkm.CHIKORITA,
  [Pkm.MEGANIUM]: Pkm.CHIKORITA,
  [Pkm.CYNDAQUIL]: Pkm.CYNDAQUIL,
  [Pkm.QUILAVA]: Pkm.CYNDAQUIL,
  [Pkm.TYPHLOSION]: Pkm.CYNDAQUIL,
  [Pkm.TOTODILE]: Pkm.TOTODILE,
  [Pkm.CROCONAW]: Pkm.TOTODILE,
  [Pkm.FERALIGATR]: Pkm.TOTODILE,
  [Pkm.TREECKO]: Pkm.TREECKO,
  [Pkm.GROVYLE]: Pkm.TREECKO,
  [Pkm.SCEPTILE]: Pkm.TREECKO,
  [Pkm.TORCHIC]: Pkm.TORCHIC,
  [Pkm.COMBUSKEN]: Pkm.TORCHIC,
  [Pkm.BLAZIKEN]: Pkm.TORCHIC,
  [Pkm.MUDKIP]: Pkm.MUDKIP,
  [Pkm.MARSHTOMP]: Pkm.MUDKIP,
  [Pkm.SWAMPERT]: Pkm.MUDKIP,
  [Pkm.TURTWIG]: Pkm.TURTWIG,
  [Pkm.GROTLE]: Pkm.TURTWIG,
  [Pkm.TORTERRA]: Pkm.TURTWIG,
  [Pkm.CHIMCHAR]: Pkm.CHIMCHAR,
  [Pkm.MONFERNO]: Pkm.CHIMCHAR,
  [Pkm.INFERNAPE]: Pkm.CHIMCHAR,
  [Pkm.PIPLUP]: Pkm.PIPLUP,
  [Pkm.PRINPLUP]: Pkm.PIPLUP,
  [Pkm.EMPOLEON]: Pkm.PIPLUP,
  [Pkm.NIDORANF]: Pkm.NIDORANF,
  [Pkm.NIDORINA]: Pkm.NIDORANF,
  [Pkm.NIDOQUEEN]: Pkm.NIDORANF,
  [Pkm.NIDORANM]: Pkm.NIDORANM,
  [Pkm.NIDORINO]: Pkm.NIDORANM,
  [Pkm.NIDOKING]: Pkm.NIDORANM,
  [Pkm.PICHU]: Pkm.PICHU,
  [Pkm.PIKACHU]: Pkm.PICHU,
  [Pkm.RAICHU]: Pkm.PICHU,
  [Pkm.MACHOP]: Pkm.MACHOP,
  [Pkm.MACHOKE]: Pkm.MACHOP,
  [Pkm.MACHAMP]: Pkm.MACHOP,
  [Pkm.HORSEA]: Pkm.HORSEA,
  [Pkm.SEADRA]: Pkm.HORSEA,
  [Pkm.KINGDRA]: Pkm.HORSEA,
  [Pkm.TRAPINCH]: Pkm.TRAPINCH,
  [Pkm.VIBRAVA]: Pkm.TRAPINCH,
  [Pkm.FLYGON]: Pkm.TRAPINCH,
  [Pkm.SPHEAL]: Pkm.SPHEAL,
  [Pkm.SEALEO]: Pkm.SPHEAL,
  [Pkm.WALREIN]: Pkm.SPHEAL,
  [Pkm.ARON]: Pkm.ARON,
  [Pkm.LAIRON]: Pkm.ARON,
  [Pkm.AGGRON]: Pkm.ARON,
  [Pkm.MAGNEMITE]: Pkm.MAGNEMITE,
  [Pkm.MAGNETON]: Pkm.MAGNEMITE,
  [Pkm.MAGNEZONE]: Pkm.MAGNEMITE,
  [Pkm.RHYHORN]: Pkm.RHYHORN,
  [Pkm.RHYDON]: Pkm.RHYHORN,
  [Pkm.RHYPERIOR]: Pkm.RHYHORN,
  [Pkm.TOGEPI]: Pkm.TOGEPI,
  [Pkm.TOGETIC]: Pkm.TOGEPI,
  [Pkm.TOGEKISS]: Pkm.TOGEPI,
  [Pkm.DUSKULL]: Pkm.DUSKULL,
  [Pkm.DUSCLOPS]: Pkm.DUSKULL,
  [Pkm.DUSKNOIR]: Pkm.DUSKULL,
  [Pkm.LOTAD]: Pkm.LOTAD,
  [Pkm.LOMBRE]: Pkm.LOTAD,
  [Pkm.LUDICOLO]: Pkm.LOTAD,
  [Pkm.SHINX]: Pkm.SHINX,
  [Pkm.LUXIO]: Pkm.SHINX,
  [Pkm.LUXRAY]: Pkm.SHINX,
  [Pkm.POLIWAG]: Pkm.POLIWAG,
  [Pkm.POLIWHIRL]: Pkm.POLIWAG,
  [Pkm.POLITOED]: Pkm.POLIWAG,
  [Pkm.ABRA]: Pkm.ABRA,
  [Pkm.KADABRA]: Pkm.ABRA,
  [Pkm.ALAKAZAM]: Pkm.ABRA,
  [Pkm.GASTLY]: Pkm.GASTLY,
  [Pkm.HAUNTER]: Pkm.GASTLY,
  [Pkm.GENGAR]: Pkm.GASTLY,
  [Pkm.DRATINI]: Pkm.DRATINI,
  [Pkm.DRAGONAIR]: Pkm.DRATINI,
  [Pkm.DRAGONITE]: Pkm.DRATINI,
  [Pkm.LARVITAR]: Pkm.LARVITAR,
  [Pkm.PUPITAR]: Pkm.LARVITAR,
  [Pkm.TYRANITAR]: Pkm.LARVITAR,
  [Pkm.SLAKOTH]: Pkm.SLAKOTH,
  [Pkm.VIGOROTH]: Pkm.SLAKOTH,
  [Pkm.SLAKING]: Pkm.SLAKOTH,
  [Pkm.RALTS]: Pkm.RALTS,
  [Pkm.KIRLIA]: Pkm.RALTS,
  [Pkm.GARDEVOIR]: Pkm.RALTS,
  [Pkm.BAGON]: Pkm.BAGON,
  [Pkm.SHELGON]: Pkm.BAGON,
  [Pkm.SALAMENCE]: Pkm.BAGON,
  [Pkm.BELDUM]: Pkm.BELDUM,
  [Pkm.METANG]: Pkm.BELDUM,
  [Pkm.METAGROSS]: Pkm.BELDUM,
  [Pkm.GIBLE]: Pkm.GIBLE,
  [Pkm.GABITE]: Pkm.GIBLE,
  [Pkm.GARCHOMP]: Pkm.GIBLE,
  [Pkm.ELEKID]: Pkm.ELEKID,
  [Pkm.ELECTABUZZ]: Pkm.ELEKID,
  [Pkm.ELECTIVIRE]: Pkm.ELEKID,
  [Pkm.MAGBY]: Pkm.MAGBY,
  [Pkm.MAGMAR]: Pkm.MAGBY,
  [Pkm.MAGMORTAR]: Pkm.MAGBY,
  [Pkm.MUNCHLAX]: Pkm.MUNCHLAX,
  [Pkm.SNORLAX]: Pkm.MUNCHLAX,
  [Pkm.GROWLITHE]: Pkm.GROWLITHE,
  [Pkm.ARCANINE]: Pkm.GROWLITHE,
  [Pkm.ONIX]: Pkm.ONIX,
  [Pkm.STEELIX]: Pkm.ONIX,
  [Pkm.MEGA_STEELIX]: Pkm.ONIX,
  [Pkm.SCYTHER]: Pkm.SCYTHER,
  [Pkm.SCIZOR]: Pkm.SCYTHER,
  [Pkm.MEGA_SCIZOR]: Pkm.SCYTHER,
  [Pkm.RIOLU]: Pkm.RIOLU,
  [Pkm.LUCARIO]: Pkm.RIOLU,
  [Pkm.MEGA_LUCARIO]: Pkm.RIOLU,
  [Pkm.EEVEE]: Pkm.EEVEE,
  [Pkm.VAPOREON]: Pkm.VAPOREON,
  [Pkm.JOLTEON]: Pkm.JOLTEON,
  [Pkm.FLAREON]: Pkm.FLAREON,
  [Pkm.ESPEON]: Pkm.ESPEON,
  [Pkm.UMBREON]: Pkm.UMBREON,
  [Pkm.LEAFEON]: Pkm.LEAFEON,
  [Pkm.SYLVEON]: Pkm.SYLVEON,
  [Pkm.GLACEON]: Pkm.GLACEON,
  [Pkm.MEDITITE]: Pkm.MEDITITE,
  [Pkm.MEDICHAM]: Pkm.MEDITITE,
  [Pkm.MEGA_MEDICHAM]: Pkm.MEDITITE,
  [Pkm.NUMEL]: Pkm.NUMEL,
  [Pkm.CAMERUPT]: Pkm.NUMEL,
  [Pkm.MEGA_CAMERUPT]: Pkm.NUMEL,
  [Pkm.DITTO]: Pkm.DITTO,
  [Pkm.DARKRAI]: Pkm.DARKRAI,
  [Pkm.LITWICK]: Pkm.LITWICK,
  [Pkm.LAMPENT]: Pkm.LITWICK,
  [Pkm.CHANDELURE]: Pkm.LITWICK,
  [Pkm.BELLSPROUT]: Pkm.BELLSPROUT,
  [Pkm.WEEPINBELL]: Pkm.BELLSPROUT,
  [Pkm.VICTREEBEL]: Pkm.BELLSPROUT,
  [Pkm.SWINUB]: Pkm.SWINUB,
  [Pkm.PILOSWINE]: Pkm.SWINUB,
  [Pkm.MAMOSWINE]: Pkm.SWINUB,
  [Pkm.SNORUNT]: Pkm.SNORUNT,
  [Pkm.GLALIE]: Pkm.SNORUNT,
  [Pkm.FROSLASS]: Pkm.SNORUNT,
  [Pkm.SNOVER]: Pkm.SNOVER,
  [Pkm.ABOMASNOW]: Pkm.SNOVER,
  [Pkm.MEGA_ABOMASNOW]: Pkm.SNOVER,
  [Pkm.VANILLITE]: Pkm.VANILLITE,
  [Pkm.VANILLISH]: Pkm.VANILLITE,
  [Pkm.VANILLUXE]: Pkm.VANILLITE,
  [Pkm.VOLCARONA]: Pkm.VOLCARONA,
  [Pkm.LANDORUS]: Pkm.LANDORUS,
  [Pkm.TORNADUS]: Pkm.TORNADUS,
  [Pkm.THUNDURUS]: Pkm.THUNDURUS,
  [Pkm.KELDEO]: Pkm.KELDEO,
  [Pkm.TERRAKION]: Pkm.TERRAKION,
  [Pkm.VIRIZION]: Pkm.VIRIZION,
  [Pkm.COBALION]: Pkm.COBALION,
  [Pkm.MANAPHY]: Pkm.PHIONE,
  [Pkm.ROTOM]: Pkm.ROTOM,
  [Pkm.SPIRITOMB]: Pkm.SPIRITOMB,
  [Pkm.ABSOL]: Pkm.ABSOL,
  [Pkm.LAPRAS]: Pkm.LAPRAS,
  [Pkm.LATIAS]: Pkm.LATIAS,
  [Pkm.LATIOS]: Pkm.LATIOS,
  [Pkm.MESPRIT]: Pkm.MESPRIT,
  [Pkm.AZELF]: Pkm.AZELF,
  [Pkm.UXIE]: Pkm.UXIE,
  [Pkm.MEWTWO]: Pkm.MEWTWO,
  [Pkm.KYUREM]: Pkm.KYUREM,
  [Pkm.RESHIRAM]: Pkm.RESHIRAM,
  [Pkm.ZEKROM]: Pkm.ZEKROM,
  [Pkm.CELEBI]: Pkm.CELEBI,
  [Pkm.VICTINI]: Pkm.VICTINI,
  [Pkm.JIRACHI]: Pkm.JIRACHI,
  [Pkm.ARCEUS]: Pkm.ARCEUS,
  [Pkm.DEOXYS]: Pkm.DEOXYS,
  [Pkm.SHAYMIN]: Pkm.SHAYMIN,
  [Pkm.CRESSELIA]: Pkm.CRESSELIA,
  [Pkm.HEATRAN]: Pkm.HEATRAN,
  [Pkm.HO_OH]: Pkm.HO_OH,
  [Pkm.REGICE]: Pkm.REGICE,
  [Pkm.REGISTEEL]: Pkm.REGISTEEL,
  [Pkm.REGIROCK]: Pkm.REGIROCK,
  [Pkm.ARTICUNO]: Pkm.ARTICUNO,
  [Pkm.ZAPDOS]: Pkm.ZAPDOS,
  [Pkm.MOLTRES]: Pkm.MOLTRES,
  [Pkm.AERODACTYL]: Pkm.AERODACTYL,
  [Pkm.GROUDON]: Pkm.GROUDON,
  [Pkm.KYOGRE]: Pkm.KYOGRE,
  [Pkm.RAYQUAZA]: Pkm.RAYQUAZA,
  [Pkm.MEGA_RAYQUAZA]: Pkm.RAYQUAZA,
  [Pkm.PALKIA]: Pkm.PALKIA,
  [Pkm.DIALGA]: Pkm.DIALGA,
  [Pkm.GIRATINA]: Pkm.GIRATINA,
  [Pkm.SUICUNE]: Pkm.SUICUNE,
  [Pkm.ENTEI]: Pkm.ENTEI,
  [Pkm.RAIKOU]: Pkm.RAIKOU,
  [Pkm.REGIGIGAS]: Pkm.REGIGIGAS,
  [Pkm.MAGIKARP]: Pkm.MAGIKARP,
  [Pkm.GYARADOS]: Pkm.MAGIKARP,
  [Pkm.RATTATA]: Pkm.RATTATA,
  [Pkm.RATICATE]: Pkm.RATTATA,
  [Pkm.LUGIA]: Pkm.LUGIA,
  [Pkm.CARVANHA]: Pkm.CARVANHA,
  [Pkm.SWABLU]: Pkm.SWABLU,
  [Pkm.PRIMAL_GROUDON]: Pkm.GROUDON,
  [Pkm.PRIMAL_KYOGRE]: Pkm.KYOGRE,
  [Pkm.FEAROW]: Pkm.SPEAROW,
  [Pkm.SPEAROW]: Pkm.SPEAROW,
  [Pkm.MEOWTH]: Pkm.MEOWTH,
  [Pkm.PERSIAN]: Pkm.MEOWTH,
  [Pkm.DEINO]: Pkm.DEINO,
  [Pkm.ZWEILOUS]: Pkm.DEINO,
  [Pkm.HYDREIGON]: Pkm.DEINO,
  [Pkm.SANDILE]: Pkm.SANDILE,
  [Pkm.KROKOROK]: Pkm.SANDILE,
  [Pkm.KROOKODILE]: Pkm.SANDILE,
  [Pkm.SOLOSIS]: Pkm.SOLOSIS,
  [Pkm.DUOSION]: Pkm.SOLOSIS,
  [Pkm.REUNICLUS]: Pkm.SOLOSIS,
  [Pkm.ODDISH]: Pkm.ODDISH,
  [Pkm.GLOOM]: Pkm.ODDISH,
  [Pkm.VILEPLUME]: Pkm.ODDISH,
  [Pkm.BELLOSSOM]: Pkm.ODDISH,
  [Pkm.AMAURA]: Pkm.AMAURA,
  [Pkm.AURORUS]: Pkm.AMAURA,
  [Pkm.ANORITH]: Pkm.ANORITH,
  [Pkm.ARMALDO]: Pkm.ANORITH,
  [Pkm.ARCHEN]: Pkm.ARCHEN,
  [Pkm.ARCHEOPS]: Pkm.ARCHEN,
  [Pkm.SHIELDON]: Pkm.SHIELDON,
  [Pkm.BASTIODON]: Pkm.SHIELDON,
  [Pkm.TIRTOUGA]: Pkm.TIRTOUGA,
  [Pkm.CARRACOSTA]: Pkm.TIRTOUGA,
  [Pkm.LILEEP]: Pkm.LILEEP,
  [Pkm.CRADILY]: Pkm.LILEEP,
  [Pkm.KABUTO]: Pkm.KABUTO,
  [Pkm.KABUTOPS]: Pkm.KABUTO,
  [Pkm.OMANYTE]: Pkm.OMANYTE,
  [Pkm.OMASTAR]: Pkm.OMANYTE,
  [Pkm.CRANIDOS]: Pkm.CRANIDOS,
  [Pkm.RAMPARDOS]: Pkm.CRANIDOS,
  [Pkm.TYRUNT]: Pkm.TYRUNT,
  [Pkm.TYRANTRUM]: Pkm.TYRUNT,
  [Pkm.BUDEW]: Pkm.BUDEW,
  [Pkm.ROSELIA]: Pkm.BUDEW,
  [Pkm.ROSERADE]: Pkm.BUDEW,
  [Pkm.BUNEARY]: Pkm.BUNEARY,
  [Pkm.LOPUNNY]: Pkm.BUNEARY,
  [Pkm.MEGA_LOPUNNY]: Pkm.BUNEARY,
  [Pkm.AXEW]: Pkm.AXEW,
  [Pkm.FRAXURE]: Pkm.AXEW,
  [Pkm.HAXORUS]: Pkm.AXEW,
  [Pkm.VENIPEDE]: Pkm.VENIPEDE,
  [Pkm.WHIRLIPEDE]: Pkm.VENIPEDE,
  [Pkm.SCOLIPEDE]: Pkm.VENIPEDE,
  [Pkm.PORYGON]: Pkm.PORYGON,
  [Pkm.PORYGON_2]: Pkm.PORYGON,
  [Pkm.PORYGON_Z]: Pkm.PORYGON,
  [Pkm.ELECTRIKE]: Pkm.ELECTRIKE,
  [Pkm.MANECTRIC]: Pkm.ELECTRIKE,
  [Pkm.MEGA_MANECTRIC]: Pkm.ELECTRIKE,
  [Pkm.SHUPPET]: Pkm.SHUPPET,
  [Pkm.BANETTE]: Pkm.SHUPPET,
  [Pkm.MEGA_BANETTE]: Pkm.SHUPPET,
  [Pkm.HONEDGE]: Pkm.HONEDGE,
  [Pkm.DOUBLADE]: Pkm.HONEDGE,
  [Pkm.AEGISLASH]: Pkm.HONEDGE,
  [Pkm.CUBONE]: Pkm.CUBONE,
  [Pkm.MAROWAK]: Pkm.CUBONE,
  [Pkm.ALOLAN_MAROWAK]: Pkm.CUBONE,
  [Pkm.WHISMUR]: Pkm.WHISMUR,
  [Pkm.LOUDRED]: Pkm.WHISMUR,
  [Pkm.EXPLOUD]: Pkm.WHISMUR,
  [Pkm.TYMPOLE]: Pkm.TYMPOLE,
  [Pkm.PALPITOAD]: Pkm.TYMPOLE,
  [Pkm.SEISMITOAD]: Pkm.TYMPOLE,
  [Pkm.SEWADDLE]: Pkm.SEWADDLE,
  [Pkm.SWADLOON]: Pkm.SEWADDLE,
  [Pkm.LEAVANNY]: Pkm.SEWADDLE,
  [Pkm.PIKIPEK]: Pkm.PIKIPEK,
  [Pkm.TRUMBEAK]: Pkm.PIKIPEK,
  [Pkm.TOUCANNON]: Pkm.PIKIPEK,
  [Pkm.FLABEBE]: Pkm.FLABEBE,
  [Pkm.FLOETTE]: Pkm.FLABEBE,
  [Pkm.FLORGES]: Pkm.FLABEBE,
  [Pkm.JANGMO_O]: Pkm.JANGMO_O,
  [Pkm.HAKAMO_O]: Pkm.JANGMO_O,
  [Pkm.KOMMO_O]: Pkm.JANGMO_O,
  [Pkm.MELOETTA]: Pkm.MELOETTA,
  [Pkm.ALTARIA]: Pkm.SWABLU,
  [Pkm.MEGA_ALTARIA]: Pkm.SWABLU,
  [Pkm.CASTFORM]: Pkm.CASTFORM,
  [Pkm.CASTFORM_SUN]: Pkm.CASTFORM,
  [Pkm.CASTFORM_RAIN]: Pkm.CASTFORM,
  [Pkm.CASTFORM_HAIL]: Pkm.CASTFORM,
  [Pkm.CORPHISH]: Pkm.CORPHISH,
  [Pkm.CRAWDAUNT]: Pkm.CORPHISH,
  [Pkm.JOLTIK]: Pkm.JOLTIK,
  [Pkm.GALVANTULA]: Pkm.JOLTIK,
  [Pkm.DEFAULT]: Pkm.DEFAULT,
  [Pkm.NINCADA]: Pkm.NINCADA,
  [Pkm.NINJASK]: Pkm.NINCADA,
  [Pkm.SHEDNINJA]: Pkm.NINCADA,
  [Pkm.PONYTA]: Pkm.PONYTA,
  [Pkm.RAPIDASH]: Pkm.PONYTA,
  [Pkm.GENESECT]: Pkm.GENESECT,
  [Pkm.RELICANTH]: Pkm.RELICANTH,
  [Pkm.HATENNA]: Pkm.HATENNA,
  [Pkm.HATTREM]: Pkm.HATENNA,
  [Pkm.HATTERENE]: Pkm.HATENNA,
  [Pkm.FENNEKIN]: Pkm.FENNEKIN,
  [Pkm.BRAIXEN]: Pkm.FENNEKIN,
  [Pkm.DELPHOX]: Pkm.FENNEKIN,
  [Pkm.MAKUHITA]: Pkm.MAKUHITA,
  [Pkm.HARIYAMA]: Pkm.MAKUHITA,
  [Pkm.REGIELEKI]: Pkm.REGIELEKI,
  [Pkm.REGIDRAGO]: Pkm.REGIDRAGO,
  [Pkm.GUZZLORD]: Pkm.GUZZLORD,
  [Pkm.ETERNATUS]: Pkm.ETERNATUS,
  [Pkm.NOIBAT]: Pkm.NOIBAT,
  [Pkm.NOIVERN]: Pkm.NOIBAT,
  [Pkm.PUMPKABOO]: Pkm.PUMPKABOO,
  [Pkm.GOURGEIST]: Pkm.PUMPKABOO,
  cacnea: Pkm.CACNEA,
  cacturne: Pkm.CACNEA,
  tauros: Pkm.TAUROS,
  happiny: Pkm.HAPPINY,
  chansey: Pkm.HAPPINY,
  blissey: Pkm.HAPPINY,
  [Pkm.TAPU_KOKO]: Pkm.TAPU_KOKO,
  [Pkm.TAPU_LELE]: Pkm.TAPU_LELE,
  [Pkm.STAKATAKA]: Pkm.STAKATAKA,
  [Pkm.BLACEPHALON]: Pkm.BLACEPHALON,
  [Pkm.HOUNDOUR]: Pkm.HOUNDOUR,
  [Pkm.HOUNDOOM]: Pkm.HOUNDOUR,
  [Pkm.MEGA_HOUNDOOM]: Pkm.HOUNDOUR,
  [Pkm.CLAMPERL]: Pkm.CLAMPERL,
  [Pkm.HUNTAIL]: Pkm.CLAMPERL,
  [Pkm.GOREBYSS]: Pkm.CLAMPERL,
  [Pkm.SMOOCHUM]: Pkm.SMOOCHUM,
  [Pkm.JYNX]: Pkm.SMOOCHUM,
  [Pkm.SALANDIT]: Pkm.SALANDIT,
  [Pkm.SALAZZLE]: Pkm.SALANDIT,
  [Pkm.VENONAT]: Pkm.VENONAT,
  [Pkm.VENOMOTH]: Pkm.VENONAT,
  [Pkm.VOLTORB]: Pkm.VOLTORB,
  [Pkm.ELECTRODE]: Pkm.VOLTORB,
  [Pkm.SLUGMA]: Pkm.SLUGMA,
  [Pkm.MAGCARGO]: Pkm.SLUGMA,
  [Pkm.SNEASEL]: Pkm.SNEASEL,
  [Pkm.WEAVILE]: Pkm.SNEASEL,
  [Pkm.CROAGUNK]: Pkm.CROAGUNK,
  [Pkm.TOXICROAK]: Pkm.CROAGUNK,
  [Pkm.CHINCHOU]: Pkm.CHINCHOU,
  [Pkm.LANTURN]: Pkm.CHINCHOU,
  [Pkm.POOCHYENA]: Pkm.POOCHYENA,
  [Pkm.MIGHTYENA]: Pkm.POOCHYENA,
  [Pkm.BRONZOR]: Pkm.BRONZOR,
  [Pkm.BRONZONG]: Pkm.BRONZOR,
  [Pkm.DRIFLOON]: Pkm.DRIFLOON,
  [Pkm.DRIFBLIM]: Pkm.DRIFLOON,
  [Pkm.SHROOMISH]: Pkm.SHROOMISH,
  [Pkm.BRELOOM]: Pkm.SHROOMISH,
  [Pkm.TENTACOOL]: Pkm.TENTACOOL,
  [Pkm.TENTACRUEL]: Pkm.TENTACOOL,
  [Pkm.SNUBULL]: Pkm.SNUBULL,
  [Pkm.GRANBULL]: Pkm.SNUBULL,
  [Pkm.SEVIPER]: Pkm.SEVIPER,
  [Pkm.VULPIX]: Pkm.VULPIX,
  [Pkm.NINETALES]: Pkm.VULPIX,
  [Pkm.ALOLAN_VULPIX]: Pkm.ALOLAN_VULPIX,
  [Pkm.ALOLAN_NINETALES]: Pkm.ALOLAN_VULPIX,
  [Pkm.BUIZEL]: Pkm.BUIZEL,
  [Pkm.FLOATZEL]: Pkm.BUIZEL,
  [Pkm.KECLEON]: Pkm.KECLEON,
  [Pkm.MAWILE]: Pkm.MAWILE,
  [Pkm.CARBINK]: Pkm.CARBINK,
  [Pkm.DIANCIE]: Pkm.CARBINK,
  [Pkm.CHATOT]: Pkm.CHATOT,
  [Pkm.GOOMY]: Pkm.GOOMY,
  [Pkm.SLIGOO]: Pkm.GOOMY,
  [Pkm.GOODRA]: Pkm.GOOMY,
  [Pkm.MEW]: Pkm.MEW,
  [Pkm.BOUNSWEET]: Pkm.BOUNSWEET,
  [Pkm.STEENEE]: Pkm.BOUNSWEET,
  [Pkm.TSAREENA]: Pkm.BOUNSWEET,
  [Pkm.VOLCANION]: Pkm.VOLCANION,
  [Pkm.APPLIN]: Pkm.APPLIN,
  [Pkm.APPLETUN]: Pkm.APPLIN,
  [Pkm.OSHAWOTT]: Pkm.OSHAWOTT,
  [Pkm.DEWOTT]: Pkm.OSHAWOTT,
  [Pkm.SAMUROTT]: Pkm.OSHAWOTT,
  [Pkm.SNOM]: Pkm.SNOM,
  [Pkm.FROSMOTH]: Pkm.SNOM,
  [Pkm.WAILMER]: Pkm.WAILMER,
  [Pkm.WAILORD]: Pkm.WAILMER,
  [Pkm.DREEPY]: Pkm.DREEPY,
  [Pkm.DRAKLOAK]: Pkm.DREEPY,
  [Pkm.DRAGAPULT]: Pkm.DREEPY,
  [Pkm.SNIVY]: Pkm.SNIVY,
  [Pkm.SERVINE]: Pkm.SNIVY,
  [Pkm.SERPERIOR]: Pkm.SNIVY,
  [Pkm.SCORBUNNY]: Pkm.SCORBUNNY,
  [Pkm.RABOOT]: Pkm.SCORBUNNY,
  [Pkm.CINDERACE]: Pkm.SCORBUNNY,
  [Pkm.POPPLIO]: Pkm.POPPLIO,
  [Pkm.BRIONNE]: Pkm.POPPLIO,
  [Pkm.PRIMARINA]: Pkm.POPPLIO,
  [Pkm.GOTHITA]: Pkm.GOTHITA,
  [Pkm.GOTHORITA]: Pkm.GOTHITA,
  [Pkm.GOTHITELLE]: Pkm.GOTHITA,
  [Pkm.SANDSHREW]: Pkm.SANDSHREW,
  [Pkm.SANDSLASH]: Pkm.SANDSHREW,
  [Pkm.FARFETCH_D]: Pkm.FARFETCH_D,
  [Pkm.UNOWN_A]: Pkm.UNOWN_A,
  [Pkm.UNOWN_B]: Pkm.UNOWN_A,
  [Pkm.UNOWN_C]: Pkm.UNOWN_A,
  [Pkm.UNOWN_D]: Pkm.UNOWN_A,
  [Pkm.UNOWN_E]: Pkm.UNOWN_A,
  [Pkm.UNOWN_F]: Pkm.UNOWN_A,
  [Pkm.UNOWN_G]: Pkm.UNOWN_A,
  [Pkm.UNOWN_H]: Pkm.UNOWN_A,
  [Pkm.UNOWN_I]: Pkm.UNOWN_A,
  [Pkm.UNOWN_J]: Pkm.UNOWN_A,
  [Pkm.UNOWN_K]: Pkm.UNOWN_A,
  [Pkm.UNOWN_L]: Pkm.UNOWN_A,
  [Pkm.UNOWN_M]: Pkm.UNOWN_A,
  [Pkm.UNOWN_N]: Pkm.UNOWN_A,
  [Pkm.UNOWN_O]: Pkm.UNOWN_A,
  [Pkm.UNOWN_P]: Pkm.UNOWN_A,
  [Pkm.UNOWN_Q]: Pkm.UNOWN_A,
  [Pkm.UNOWN_R]: Pkm.UNOWN_A,
  [Pkm.UNOWN_S]: Pkm.UNOWN_A,
  [Pkm.UNOWN_T]: Pkm.UNOWN_A,
  [Pkm.UNOWN_U]: Pkm.UNOWN_A,
  [Pkm.UNOWN_V]: Pkm.UNOWN_A,
  [Pkm.UNOWN_W]: Pkm.UNOWN_A,
  [Pkm.UNOWN_X]: Pkm.UNOWN_A,
  [Pkm.UNOWN_Y]: Pkm.UNOWN_A,
  [Pkm.UNOWN_Z]: Pkm.UNOWN_A,
  [Pkm.UNOWN_QUESTION]: Pkm.UNOWN_A,
  [Pkm.UNOWN_EXCLAMATION]: Pkm.UNOWN_A,
  [Pkm.TAPU_FINI]: Pkm.TAPU_FINI,
  [Pkm.TAPU_BULU]: Pkm.TAPU_BULU,
  [Pkm.DIGLETT]: Pkm.DIGLETT,
  [Pkm.DUGTRIO]: Pkm.DIGLETT,
  [Pkm.ROWLET]: Pkm.ROWLET,
  [Pkm.DARTIX]: Pkm.ROWLET,
  [Pkm.DECIDUEYE]: Pkm.ROWLET,
  [Pkm.ZORUA]: Pkm.ZORUA,
  [Pkm.ZOROARK]: Pkm.ZORUA,
  [Pkm.FROAKIE]: Pkm.FROAKIE,
  [Pkm.FROGADIER]: Pkm.FROAKIE,
  [Pkm.GRENINJA]: Pkm.FROAKIE,
  [Pkm.TYROGUE]: Pkm.TYROGUE,
  [Pkm.HITMONLEE]: Pkm.TYROGUE,
  [Pkm.HITMONCHAN]: Pkm.TYROGUE,
  [Pkm.HITMONTOP]: Pkm.TYROGUE,
  [Pkm.MIMIKYU]: Pkm.MIMIKYU,
  [Pkm.GRIMER]: Pkm.GRIMER,
  [Pkm.MUK]: Pkm.GRIMER,
  [Pkm.SHARPEDO]: Pkm.CARVANHA,
  [Pkm.HISUI_ZORUA]: Pkm.HISUI_ZORUA,
  [Pkm.HISUI_ZOROARK]: Pkm.HISUI_ZORUA,
  [Pkm.ALOLAN_GRIMER]: Pkm.ALOLAN_GRIMER,
  [Pkm.ALOLAN_MUK]: Pkm.ALOLAN_GRIMER,
  [Pkm.PINECO]: Pkm.PINECO,
  [Pkm.FORRETRESS]: Pkm.PINECO,
  [Pkm.SEEL]: Pkm.SEEL,
  [Pkm.DEWGONG]: Pkm.SEEL,
  [Pkm.ALOLAN_GEODUDE]: Pkm.ALOLAN_GEODUDE,
  [Pkm.ALOLAN_GRAVELER]: Pkm.ALOLAN_GEODUDE,
  [Pkm.ALOLAN_GOLEM]: Pkm.ALOLAN_GEODUDE,
  [Pkm.EKANS]: Pkm.EKANS,
  [Pkm.ARBOK]: Pkm.EKANS,
  [Pkm.MIME_JR]: Pkm.MIME_JR,
  [Pkm.MR_MIME]: Pkm.MIME_JR,
  [Pkm.ORIGIN_GIRATINA]: Pkm.ORIGIN_GIRATINA,
  [Pkm.PIROUETTE_MELOETTA]: Pkm.PIROUETTE_MELOETTA,
  [Pkm.MELMETAL]: Pkm.MELMETAL,
  [Pkm.HOOPA]: Pkm.HOOPA,
  [Pkm.HOOPA_UNBOUND]: Pkm.HOOPA_UNBOUND,
  [Pkm.SILVALLY]: Pkm.TYPE_NULL,
  [Pkm.ZERAORA]: Pkm.ZERAORA,
  [Pkm.XERNEAS]: Pkm.XERNEAS,
  [Pkm.YVELTAL]: Pkm.YVELTAL,
  [Pkm.TYPE_NULL]: Pkm.TYPE_NULL,
  [Pkm.MARSHADOW]: Pkm.MARSHADOW,
  [Pkm.HOOTHOOT]: Pkm.HOOTHOOT,
  [Pkm.NOCTOWL]: Pkm.HOOTHOOT,
  [Pkm.BONSLEY]: Pkm.BONSLEY,
  [Pkm.SUDOWOODO]: Pkm.BONSLEY,
  [Pkm.PHIONE]: Pkm.PHIONE,
  [Pkm.COMBEE]: Pkm.COMBEE,
  [Pkm.VESPIQUEEN]: Pkm.COMBEE,
  [Pkm.SHUCKLE]: Pkm.SHUCKLE,
  [Pkm.TEPIG]: Pkm.TEPIG,
  [Pkm.PIGNITE]: Pkm.TEPIG,
  [Pkm.EMBOAR]: Pkm.TEPIG,
  [Pkm.WYNAUT]: Pkm.WYNAUT,
  [Pkm.WOBBUFFET]: Pkm.WYNAUT,
  [Pkm.LUNATONE]: Pkm.LUNATONE,
  [Pkm.SOLROCK]: Pkm.SOLROCK
}

export const AnimationConfig: {
  [key in Pkm]: { attack: AnimationType; ability: AnimationType }
} = {
  [Pkm.EGG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DITTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BULBASAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.IVYSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VENUSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CHARMANDER]: {
    attack: AnimationType.Kick,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARMELEON]: {
    attack: AnimationType.Strike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARIZARD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SQUIRTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WARTORTLE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.BLASTOISE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.AZURILL]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Special0
  },
  [Pkm.MARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.AZUMARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ZUBAT]: {
    attack: AnimationType.Eat,
    ability: AnimationType.Attack
  },
  [Pkm.GOLBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.CROBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAREEP]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Attack
  },
  [Pkm.FLAFFY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.AMPHAROS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CLEFFA]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFAIRY]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFABLE]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.IGGLYBUFF]: {
    attack: AnimationType.Special1,
    ability: AnimationType.EventSleep
  },
  [Pkm.WIGGLYTUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sleep
  },
  [Pkm.JIGGLYPUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CATERPIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.METAPOD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BUTTERFREE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WEEDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.KAKUNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BEEDRILL]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Attack
  },
  [Pkm.PIDGEY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOTTO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.HOPPIP]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.SKIPLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JUMPLUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SEEDOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.NUZLEAF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SHIFTRY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Attack
  },
  [Pkm.STARLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAVIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAPTOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CHIKORITA]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Charge
  },
  [Pkm.BAYLEEF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGANIUM]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Charge
  },
  [Pkm.CYNDAQUIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.QUILAVA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.TYPHLOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.TOTODILE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.HitGround
  },
  [Pkm.CROCONAW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.FERALIGATR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TREECKO]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Pose
  },
  [Pkm.GROVYLE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special17
  },
  [Pkm.SCEPTILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.TORCHIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.COMBUSKEN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.BLAZIKEN]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.MUDKIP]: {
    attack: AnimationType.Pose,
    ability: AnimationType.Twirl
  },
  [Pkm.MARSHTOMP]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Swing
  },
  [Pkm.SWAMPERT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.TURTWIG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GROTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.TORTERRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CHIMCHAR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MONFERNO]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.INFERNAPE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.PIPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.PRINPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.EMPOLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.NIDORANF]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORINA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDOQUEEN]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORANM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDORINO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDOKING]: {
    attack: AnimationType.Strike,
    ability: AnimationType.RearUp
  },
  [Pkm.PICHU]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Shock
  },
  [Pkm.PIKACHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.RAICHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.MACHOP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Strike
  },
  [Pkm.MACHOKE]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.MACHAMP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.HORSEA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SEADRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KINGDRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.TRAPINCH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.VIBRAVA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.FLYGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.SPHEAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.SEALEO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.WALREIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ARON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.LAIRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.AGGRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigOut
  },
  [Pkm.MAGNEMITE]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNETON]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNEZONE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.RHYHORN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYPERIOR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rumble
  },
  [Pkm.TOGEPI]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Dance
  },
  [Pkm.TOGETIC]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Dance
  },
  [Pkm.TOGEKISS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.DUSKULL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSCLOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSKNOIR]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Special3
  },
  [Pkm.LOTAD]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Double
  },
  [Pkm.LOMBRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Double
  },
  [Pkm.LUDICOLO]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Double
  },
  [Pkm.SHINX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXRAY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.POLIWAG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.POLIWHIRL]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.POLITOED]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.ABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KADABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ALAKAZAM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special1
  },
  [Pkm.GASTLY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Lick
  },
  [Pkm.HAUNTER]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.MultiStrike
  },
  [Pkm.GENGAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special2
  },
  [Pkm.DRATINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.DRAGONAIR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DRAGONITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.LARVITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PUPITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TYRANITAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SLAKOTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Appeal
  },
  [Pkm.VIGOROTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance
  },
  [Pkm.SLAKING]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Dance
  },
  [Pkm.RALTS]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Pull
  },
  [Pkm.KIRLIA]: {
    attack: AnimationType.Twirl,
    ability: AnimationType.Pose
  },
  [Pkm.GARDEVOIR]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Special2
  },
  [Pkm.BAGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.SHELGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SALAMENCE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BELDUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.METANG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.METAGROSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Ricochet
  },
  [Pkm.GIBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GABITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GARCHOMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ELEKID]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shock
  },
  [Pkm.ELECTABUZZ]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ELECTIVIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.MAGBY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MAGMAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGMORTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MUNCHLAX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SNORLAX]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Charge
  },
  [Pkm.GROWLITHE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARCANINE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ONIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.STEELIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGA_STEELIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCYTHER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Slice
  },
  [Pkm.SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.MEGA_SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RIOLU]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.LUCARIO]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.MEGA_LUCARIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MAGIKARP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.RATTATA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.RATICATE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SPEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.FEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GYARADOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Attack
  },
  [Pkm.LUGIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.GIRATINA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.ZAPDOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.MOLTRES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARTICUNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.DIALGA]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.PALKIA]: {
    attack: AnimationType.Special0,
    ability: AnimationType.RearUp
  },
  [Pkm.SUICUNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Roar
  },
  [Pkm.RAIKOU]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Roar
  },
  [Pkm.ENTEI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Roar
  },
  [Pkm.REGICE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.REGISTEEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.KYOGRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.GROUDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.RAYQUAZA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIGIGAS]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special0
  },
  [Pkm.EEVEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.VAPOREON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.JOLTEON]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Pose
  },
  [Pkm.FLAREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ESPEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.UMBREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Eat
  },
  [Pkm.LEAFEON]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SYLVEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.MEDITITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEDICHAM]: {
    attack: AnimationType.Charge,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEGA_MEDICHAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.NUMEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.CAMERUPT]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_CAMERUPT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DARKRAI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sink
  },
  [Pkm.LITWICK]: {
    attack: AnimationType.Sink,
    ability: AnimationType.Pose
  },
  [Pkm.LAMPENT]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.CHANDELURE]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.SLOWPOKE]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Swing
  },
  [Pkm.SLOWBRO]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shake
  },
  [Pkm.SLOWKING]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BELLSPROUT]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rotate
  },
  [Pkm.WEEPINBELL]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Rotate
  },
  [Pkm.VICTREEBEL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Swing
  },
  [Pkm.SWINUB]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shake
  },
  [Pkm.PILOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MAMOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special0
  },
  [Pkm.SNORUNT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.GLALIE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.FROSLASS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SNOVER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VANILLITE]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.HitGround
  },
  [Pkm.VANILLISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VANILLUXE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GLACEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.VOLCARONA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANDORUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.THUNDURUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TORNADUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.KELDEO]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.TERRAKION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VIRIZION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.COBALION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MANAPHY]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Double
  },
  [Pkm.ROTOM]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Double
  },
  [Pkm.SPIRITOMB]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Special1
  },
  [Pkm.ABSOL]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.SpAttack
  },
  [Pkm.LAPRAS]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.LATIAS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special2
  },
  [Pkm.LATIOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.MESPRIT]: {
    attack: AnimationType.Hover,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AZELF]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Special1
  },
  [Pkm.UXIE]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Attack
  },
  [Pkm.MEWTWO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.KYUREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RESHIRAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ZEKROM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CELEBI]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Special0
  },
  [Pkm.VICTINI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.JIRACHI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARCEUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.DEOXYS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.SHAYMIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.CRESSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.HEATRAN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.HO_OH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Jab
  },
  [Pkm.AERODACTYL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.PRIMAL_KYOGRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PRIMAL_GROUDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MEOWTH]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Pose
  },
  [Pkm.PERSIAN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.DEINO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ZWEILOUS]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Charge
  },
  [Pkm.HYDREIGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SANDILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.KROKOROK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KROOKODILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SOLOSIS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.DUOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REUNICLUS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.MEGA_RAYQUAZA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SWABLU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.ODDISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VILEPLUME]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.BELLOSSOM]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Twirl
  },
  [Pkm.AMAURA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AURORUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ANORITH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Scratch
  },
  [Pkm.ARMALDO]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Special0
  },
  [Pkm.ARCHEN]: {
    attack: AnimationType.Swing,
    ability: AnimationType.FlapAround
  },
  [Pkm.ARCHEOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.SHIELDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BASTIODON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TIRTOUGA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARRACOSTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LILEEP]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRADILY]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRANIDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RAMPARDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KABUTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.KABUTOPS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.OMANYTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.OMASTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.TYRUNT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TYRANTRUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BUDEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSERADE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BUNEARY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.MEGA_LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.AXEW]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Emit
  },
  [Pkm.FRAXURE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAXORUS]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.VENIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.WHIRLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCOLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PORYGON]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_2]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_Z]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ELECTRIKE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MEGA_MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SHUPPET]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.MEGA_BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.HONEDGE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Head
  },
  [Pkm.DOUBLADE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.AEGISLASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CUBONE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack
  },
  [Pkm.MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Punch
  },
  [Pkm.WHISMUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.LOUDRED]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.EXPLOUD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.TYMPOLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PALPITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEISMITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SEWADDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SWADLOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LEAVANNY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PIKIPEK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TRUMBEAK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TOUCANNON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FLABEBE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLOETTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLORGES]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.JANGMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.HAKAMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.KOMMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.MELOETTA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ALTARIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MEGA_ALTARIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CASTFORM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CASTFORM_SUN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CASTFORM_RAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CASTFORM_HAIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.CORPHISH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.CRAWDAUNT]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.JOLTIK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GALVANTULA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GENESECT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.RELICANTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HATENNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTERENE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.FENNEKIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BRAIXEN]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Hop
  },
  [Pkm.DELPHOX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAKUHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.HARIYAMA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.REGIELEKI]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Charge
  },
  [Pkm.REGIDRAGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GUZZLORD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ETERNATUS]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Attack
  },
  [Pkm.PONYTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.RAPIDASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.NINCADA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NINJASK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.SHEDNINJA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Charge
  },
  [Pkm.NOIBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.NOIVERN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.PUMPKABOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOURGEIST]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.CACNEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.CACTURNE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.TAUROS]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Attack
  },
  [Pkm.DEFAULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAPPINY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CHANSEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BLISSEY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_KOKO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.TAPU_LELE]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Charge
  },
  [Pkm.STAKATAKA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Sleep
  },
  [Pkm.BLACEPHALON]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Attack
  },
  [Pkm.HOUNDOUR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CLAMPERL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HUNTAIL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOREBYSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SMOOCHUM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JYNX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Slap
  },
  [Pkm.SALANDIT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.SALAZZLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VENONAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.VENOMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.VOLTORB]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.ELECTRODE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.SLUGMA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGCARGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hurt
  },
  [Pkm.SNEASEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WEAVILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CROAGUNK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.TOXICROAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.CHINCHOU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANTURN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.POOCHYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MIGHTYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BRONZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BRONZONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.DRIFLOON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.DRIFBLIM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Idle
  },
  [Pkm.SHROOMISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BRELOOM]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.TENTACOOL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.TENTACRUEL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Charge
  },
  [Pkm.SNUBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GRANBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEVIPER]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot
  },
  [Pkm.VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.BUIZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.FLOATZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.MAWILE]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.KECLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARBINK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.DIANCIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.CHATOT]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Charge
  },
  [Pkm.GOOMY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SLIGOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOODRA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BOUNSWEET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.STEENEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.TSAREENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.VOLCANION]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.APPLIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.APPLETUN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.OSHAWOTT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.DEWOTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.SAMUROTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.SNOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.FROSMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.WAILMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.WAILORD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.DREEPY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAKLOAK]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAGAPULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SNIVY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Appeal
  },
  [Pkm.SERVINE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.SERPERIOR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SCORBUNNY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Kick
  },
  [Pkm.RABOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.CINDERACE]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.POPPLIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BRIONNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.PRIMARINA]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHORITA]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.GOTHITELLE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.SANDSHREW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.SANDSLASH]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.FARFETCH_D]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.UNOWN_A]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_B]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_C]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_D]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_E]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_F]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_G]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_H]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_I]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_J]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_K]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_L]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_M]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_N]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_O]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_P]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Q]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_R]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_S]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_T]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_U]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_V]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_W]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_X]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Y]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Z]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_QUESTION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_EXCLAMATION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.TAPU_FINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_BULU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DIGLETT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.DUGTRIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.ROWLET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DARTIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DECIDUEYE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FROAKIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.FROGADIER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRENINJA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.TYROGUE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HITMONLEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.HITMONCHAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Uppercut
  },
  [Pkm.HITMONTOP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MIMIKYU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CARVANHA]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.SHARPEDO]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.PINECO]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.FORRETRESS]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.SEEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DEWGONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.EKANS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARBOK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MIME_JR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Twirl
  },
  [Pkm.MR_MIME]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ORIGIN_GIRATINA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Shoot
  },
  [Pkm.PIROUETTE_MELOETTA]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Twirl
  },
  [Pkm.MELMETAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOPA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HOOPA_UNBOUND]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SILVALLY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TYPE_NULL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ZERAORA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.XERNEAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.YVELTAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MARSHADOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOTHOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.NOCTOWL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BONSLEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SUDOWOODO]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Attack
  },
  [Pkm.PHIONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.COMBEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.VESPIQUEEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.SHUCKLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw
  },
  [Pkm.TEPIG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PIGNITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.EMBOAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WYNAUT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WOBBUFFET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw
  },
  [Pkm.LUNATONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate
  },
  [Pkm.SOLROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate
  }
}
