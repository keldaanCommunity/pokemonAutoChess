import {ArraySchema, MapSchema, SetSchema, CollectionSchema} from '@colyseus/schema'
import board from '../core/board'
import Dps from '../core/dps'
import DpsHeal from '../core/dps-heal'
import BattleResult from '../models/colyseus-models/battle-result'
import Count from '../models/colyseus-models/count'
import Status from '../models/colyseus-models/status'
import ExperienceManager from '../models/colyseus-models/experience-manager'
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info'
import LobbyUser from '../models/colyseus-models/lobby-user'
import Message from '../models/colyseus-models/message'
import Synergies from '../models/colyseus-models/synergies'
import { IPokemonConfig } from '../models/mongo-models/user-metadata'
import PokemonCollection from '../models/colyseus-models/pokemon-collection'
import { AttackType, Orientation, PokemonActionState, Rarity } from './enum/Game'
import { Effect } from './enum/Effect'
import { Ability } from './enum/Ability'

export interface IMessage {
    name: string
    payload: string
    avatar: string
    time: number
}

export interface ICustomLobbyState {
    messages : ArraySchema<Message>
    users : MapSchema<LobbyUser>
    leaderboard : ArraySchema<LeaderboardInfo>
    botLeaderboard : ArraySchema<LeaderboardInfo>
}

export interface IGameState {
    afterGameId: string
    roundTime: number
    phase: string
    players: MapSchema<IPlayer>
    stageLevel: number
    mapName: string
}
export interface IPlayer {
    id: string
    name: string
    avatar: string
    board: MapSchema<IPokemon>
    shop: string[]
    simulation: ISimulation
    experienceManager: ExperienceManager
    synergies: Synergies
    itemsProposition: string[]
    money: number
    life: number
    shopLocked: boolean
    streak: number
    interest: number
    opponentName: string
    opponentAvatar: string
    boardSize: number
    items: CollectionSchema<string>
    rank: number
    exp: number
    elo: number
    alive: boolean
    tileset: string
    history: ArraySchema<BattleResult>
    pokemonCollection: PokemonCollection
}
export interface IPokemon {
    id: string
    name: string
    types: string[]
    rarity: Rarity
    index: string
    evolution:string
    positionX: number
    positionY: number
    cost: number
    attackSprite: string
    atkSpeed: number
    def: number
    speDef: number
    attackType: AttackType
    atk: number
    hp: number
    range: number
    stars: number
    maxMana: number
    skill: Ability
    items: SetSchema<string>
    fossilTimer: number
    shiny: boolean
    emotion: Emotion
}

export interface ISynergies {
    NORMAL: number;
    GRASS: number;
    FIRE: number;
    WATER: number;
    ELECTRIC: number;
    FIGHTING: number;
    PSYCHIC: number;
    DARK: number;
    METAL: number;
    GROUND: number;
    POISON: number;
    DRAGON: number;
    FIELD: number;
    MONSTER: number;
    HUMAN: number;
    AQUATIC: number;
    BUG: number;
    FLYING: number;
    FLORA: number;
    MINERAL: number;
    GHOST: number;
    FAIRY: number;
    ICE: number;
    FOSSIL: number;
    SOUND: number;
  }

export interface IExperienceManager {
    level: number
    experience: number
    expNeeded: number
    maxLevel: number
}

export interface ISimulation {
    climate: string
    blueEffects: Effect[]
    redEffects: Effect[]
    blueTeam: MapSchema<IPokemonEntity>
    redTeam: MapSchema<IPokemonEntity>
    blueDpsMeter: MapSchema<Dps>
    redDpsMeter: MapSchema<Dps>
    blueHealDpsMeter: MapSchema<DpsHeal>
    redHealDpsMeter: MapSchema<DpsHeal>
}

export interface IDps {
    changeDamage(physicalDamage: number, specialDamage: number, trueDamage: number)
    id: string
    name: string
    physicalDamage: number
    specialDamage: number
    trueDamage: number
}

export interface IDpsHeal {
    changeHeal(healDone: number, shieldDone: number)
    id: string
    name: string
    heal: number
    shield: number
}

export function instanceofPokemonEntity(obj: IPokemon | IPokemonEntity){
    return 'mana' in obj;
}

export interface IPokemonEntity {
  handleShield(shieldBonus: number, pokemon: IPokemonEntity)
  update(dt: number, board: board, climate: string)
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  shieldDone: number
  positionX: number
  positionY: number
  action: PokemonActionState
  index: string
  id: string
  orientation: Orientation
  critChance: number
  hp: number
  mana: number
  maxMana: number
  atk: number
  def: number
  speDef: number
  attackType: AttackType
  life: number
  shield: number
  team: number
  range: number
  atkSpeed: number
  atkSpeedBonus: number
  targetX: number
  targetY: number
  attackSprite: string
  rarity: Rarity
  name: string
  effects: Effect[]
  items: SetSchema<string>
  types: string[]
  stars: number
  skill: Ability
  status: Status
  count: Count
  critDamage: number
  spellDamage: number
  healDone: number
  shiny: boolean
  emotion: Emotion
}

export interface IStatus {
    triggerRuneProtect()
    burn: boolean
    silence: boolean
    poison: boolean
    freeze: boolean
    protect: boolean
    sleep: boolean
    confusion: boolean
    wound: boolean
    resurection: boolean
    smoke: boolean
    armorReduction: boolean
    runeProtect: boolean
}

export interface ICount {
    crit: number
    ult: number
    petalDanceCount: number
    fieldCount: number
    soundCount: number
    fairyCritCount: number
    attackCount: number
    growGroundCount: number
    dodgeCount: number
    incenseCount: number
    staticCount: number
    brightPowderCount: number
    doubleAttackCount: number
    staticHolderCount: number
    defensiveRibbonCount: number
}

export interface IPreparationMetadata {
    name: string,
    type: string
}

export enum Emotion {
    NORMAL = "Normal",
    HAPPY = "Happy",
    PAIN = "Pain",
    ANGRY = "Angry",
    WORRIED = "Worried",
    SAD = "Sad",
    CRYING = "Crying",
    SHOUTING = "Shouting",
    TEARY_EYED = "Teary-Eyed",
    DETERMINED = "Determined",
    JOYOUS = "Joyous",
    INSPIRED = "Inspired",
    SURPRISED = "Surprised",
    DIZZY = "Dizzy",
    SPECIAL0 = "Special0",
    SPECIAL1 = "Special1",
    SIGH = "Sigh",
    STUNNED = "Stunned",
    SPECIAL2 = "Special2",
    SPECIAL3 = "Special3"
}

export const EmotionCost: {[key in Emotion] : number} = {
    [Emotion.NORMAL] : 50,
    [Emotion.HAPPY] : 100,
    [Emotion.PAIN] : 110,
    [Emotion.ANGRY] : 120,
    [Emotion.WORRIED] : 130,
    [Emotion.SAD] : 140,
    [Emotion.CRYING] : 150,
    [Emotion.SHOUTING] : 160,
    [Emotion.TEARY_EYED] : 170,
    [Emotion.DETERMINED] : 180,
    [Emotion.JOYOUS] : 190,
    [Emotion.INSPIRED] : 200,
    [Emotion.SURPRISED] : 210,
    [Emotion.DIZZY] : 220,
    [Emotion.SPECIAL0] : 230,
    [Emotion.SPECIAL1] : 240,
    [Emotion.SIGH] : 250,
    [Emotion.STUNNED] : 260,
    [Emotion.SPECIAL2] : 270,
    [Emotion.SPECIAL3] : 280
}

export const PokemonIndex = Object.freeze({
    "ditto": "0132",
    "bulbasaur": "0001",
    "ivysaur": "0002",
    "venusaur": "0003",
    "charmander": "0004",
    "charmeleon": "0005",
    "charizard": "0006",
    "squirtle": "0007",
    "wartortle": "0008",
    "blastoise": "0009",
    "geodude": "0074",
    "graveler": "0075",
    "golem": "0076",
    "azurill": "0298",
    "marill": "0183",
    "azumarill": "0184",
    "zubat": "0041",
    "golbat": "0042",
    "crobat": "0169",
    "mareep": "0179",
    "flaffy": "0180",
    "ampharos": "0181",
    "cleffa": "0173",
    "clefairy": "0035",
    "clefable": "0036",
    "igglybuff": "0174",
    "wygglytuff": "0040",
    "jigglypuff": "0039",
    "caterpie": "0010",
    "metapod": "0011",
    "butterfree": "0012",
    "weedle": "0013",
    "kakuna": "0014",
    "beedrill": "0015",
    "pidgey": "0016",
    "pidgeotto": "0017",
    "pidgeot": "0018",
    "hoppip": "0187",
    "skiploom": "0188",
    "jumpluff": "0189",
    "seedot": "0273",
    "nuzleaf": "0274",
    "shiftry": "0275",
    "starly": "0396",
    "staravia": "0397",
    "staraptor": "0398",
    "chikorita": "0152",
    "bayleef": "0153",
    "meganium": "0154",
    "cyndaquil": "0155",
    "quilava": "0156",
    "typlosion": "0157",
    "totodile": "0158",
    "croconaw": "0159",
    "feraligatr": "0160",
    "treecko": "0252",
    "grovyle": "0253",
    "sceptile": "0254",
    "torchic": "0255",
    "combusken": "0256",
    "blaziken": "0257",
    "mudkip": "0258",
    "marshtomp": "0259",
    "swampert": "0260",
    "turtwig": "0387",
    "grotle": "0388",
    "torterra": "0389",
    "chimchar": "0390",
    "monferno": "0391",
    "infernape": "0392",
    "piplup": "0393",
    "prinplup": "0394",
    "empoleon": "0395",
    "nidoranF": "0029",
    "nidorina": "0030",
    "nidoqueen": "0031",
    "nidoranM": "0032",
    "nidorino": "0033",
    "nidoking": "0034",
    "pichu": "0172",
    "pikachu": "0025",
    "raichu": "0026",
    "machop": "0066",
    "machoke": "0067",
    "machamp": "0068",
    "horsea": "0116",
    "seadra": "0117",
    "kingdra": "0230",
    "trapinch": "0328",
    "vibrava": "0329",
    "flygon": "0330",
    "spheal": "0363",
    "sealeo": "0364",
    "chinchou": "0129",
    "walrein": "0365",
    "aron": "0304",
    "lairon": "0305",
    "aggron": "0306",
    "magnemite": "0081",
    "magneton": "0082",
    "magnezone": "0462",
    "rhyhorn": "0111",
    "rhydon": "0112",
    "rhyperior": "0464",
    "togepi": "0175",
    "togetic": "0176",
    "togekiss": "0468",
    "duskull": "0355",
    "dusclops": "0356",
    "dusknoir": "0477",
    "lotad": "0270",
    "lombre": "0271",
    "ludicolo": "0272",
    "shinx": "0403",
    "luxio": "0404",
    "luxray": "0405",
    "poliwag": "0060",
    "poliwhirl": "0061",
    "politoed": "0186",
    "abra": "0063",
    "kadabra": "0064",
    "alakazam": "0065",
    "gastly": "0092",
    "haunter": "0093",
    "gengar": "0094",
    "dratini": "0147",
    "dragonair": "0148",
    "dragonite": "0149",
    "larvitar": "0246",
    "pupitar": "0247",
    "tyranitar": "0248",
    "slakoth": "0287",
    "vigoroth": "0288",
    "slaking": "0289",
    "ralts": "0280",
    "kirlia": "0281",
    "gardevoir": "0282",
    "bagon": "0371",
    "shelgon": "0372",
    "salamence": "0373",
    "beldum": "0374",
    "metang": "0375",
    "metagross": "0376",
    "gible": "0443",
    "gabite": "0444",
    "garchomp": "0445",
    "elekid": "0239",
    "electabuzz": "0125",
    "electivire": "0466",
    "magby": "0240",
    "magmar": "0126",
    "magmortar": "0467",
    "munchlax": "0446",
    "snorlax": "0143",
    "growlithe": "0058",
    "arcanine": "0059",
    "onix": "0095",
    "steelix": "0208",
    "mega-steelix": "0208-0001",
    "scyther": "0123",
    "scizor": "0212",
    "mega-scizor": "0212-0001",
    "riolu": "0447",
    "lucario": "0448",
    "mega-lucario": "0448-0001",
    "magikarp": "0129",
    "rattata": "0019",
    "raticate": "0020",
    "spearow": "0021",
    "fearow": "0022",
    "gyarados": "0130",
    "lugia": "0249",
    "giratina": "0487",
    "zapdos": "0145",
    "moltres": "0146",
    "articuno": "0144",
    "dialga": "0483",
    "palkia": "0484",
    "suicune": "0245",
    "raikou": "0243",
    "entei": "0244",
    "regice": "0378",
    "regirock": "0377",
    "registeel": "0379",
    "kyogre": "0382",
    "groudon": "0383",
    "rayquaza": "0384",
    "regigigas": "0486",
    "eevee": "0133",
    "vaporeon": "0134",
    "jolteon": "0135",
    "flareon": "0136",
    "espeon": "0196",
    "umbreon": "0197",
    "leafeon": "0470",
    "sylveon": "0700",
    "meditite": "0307",
    "medicham": "0308",
    "mega-medicham": "0308-0001",
    "numel": "0322",
    "camerupt": "0323",
    "mega-camerupt": "0323-0001",
    "sandshrew": "0027",
    "sandslash": "0129",
    "darkrai": "0491",
    "litwick": "0607",
    "lampent": "0608",
    "chandelure": "0609",
    "slowpoke": "0079",
    "slowbro": "0080",
    "slowking": "0199",
    "bellsprout": "0069",
    "weepinbell": "0070",
    "victreebel": "0071",
    "carvanha": "0318",
    "swinub": "0220",
    "piloswine": "0221",
    "mamoswine": "0473",
    "snorunt": "0361",
    "glalie": "0362",
    "froslass": "0478",
    "snover": "0459",
    "abomasnow": "0460",
    "mega-abomasnow": "0460-0001",
    "vanillite": "0582",
    "vanillish": "0583",
    "vanilluxe": "0584",
    "glaceon": "0471",
    "volcarona": "0637",
    "landorus": "0645",
    "thundurus": "0642",
    "tornadus": "0641",
    "keldeo": "0647",
    "terrakion": "0639",
    "virizion": "0640",
    "cobalion": "0638",
    "manaphy": "0490",
    "rotom": "0479",
    "spiritomb": "0442",
    "absol": "0359",
    "lapras": "0131",
    "latias": "0380",
    "latios": "0381",
    "mesprit": "0481",
    "azelf": "0482",
    "uxie": "0480",
    "mewtwo": "0150",
    "kyurem": "0646",
    "reshiram": "0643",
    "zekrom": "0644",
    "celebi": "0251",
    "victini": "0494",
    "jirachi": "0385",
    "arceus": "0493",
    "deoxys": "0386",
    "shaymin": "0492",
    "cresselia": "0488",
    "heatran": "0485",
    "ho-Oh": "0250",
    "aerodactyl": "0142",
    "primal-Kyogre": "0382-0001",
    "primal-Groudon": "0383-0001",
    "meowth": "0052",
    "persian": "0053",
    "deino": "0633",
    "zweilous": "0634",
    "hydreigon": "0635",
    "sandile": "0551",
    "krokorok": "0552",
    "krookodile": "0553",
    "solosis": "0577",
    "duosion": "0578",
    "reuniclus": "0579",
    "mega-Rayquaza": "0384-0001",
    "swablu": "0333",
    "oddish": "0043",
    "gloom": "0044",
    "vileplume": "0045",
    "bellossom": "0182",
    "amaura": "0698",
    "aurorus": "0699",
    "anorith": "0347",
    "armaldo": "0348",
    "archen": "0566",
    "archeops": "0567",
    "shieldon": "0410",
    "bastiodon": "0411",
    "tirtouga": "0564",
    "carracosta": "0565",
    "lileep": "0345",
    "cradily": "0346",
    "cranidos": "0408",
    "rampardos": "0409",
    "kabuto": "0140",
    "kabutops": "0141",
    "omanyte": "0138",
    "omastar": "0139",
    "tyrunt": "0696",
    "tyrantrum": "0697",
    "budew": "0406",
    "roselia": "0315",
    "roserade": "0407",
    "buneary": "0427",
    "lopunny": "0428",
    "mega-lopunny": "0428-0001",
    "axew": "0610",
    "fraxure": "0611",
    "haxorus": "0612",
    "venipede": "0543",
    "whirlipede": "0544",
    "scolipede": "0545",
    "porygon": "0137",
    "porygon2": "0233",
    "porygon-z": "0474",
    "klink": "0599",
    "klang": "0600",
    "klinklang": "0601",
    "electrike": "0309",
    "manectric": "0310",
    "mega-manectric": "0310-0001",
    "shuppet": "0353",
    "banette": "0354",
    "mega-banette": "0354-0001",
    "honedge": "0679",
    "doublade": "0680",
    "aegislash": "0681",
    "cubone": "0104",
    "marowak": "0105",
    "alolan-marowak": "0105/0001",
    "fletchling": "0661",
    "fletchinder": "0662",
    "talonflame": "0663",
    "whismur": "0293",
    "loudred": "0294",
    "exploud": "0295",
    "tympole": "0535",
    "palpitoad": "0536",
    "seismitoad": "0537",
    "sewaddle": "0540",
    "swadloon": "0541",
    "leavanny": "0542",
    "pikipek": "0731",
    "trumbeak": "0732",
    "toucannon": "0733",
    "flabebe": "0669",
    "floette": "0670",
    "florges": "0671",
    "jangmo-o": "0782",
    "hakamo-o": "0783",
    "kommo-o": "0784",
    "meloetta": "0648",
    "altaria": "0334",
    "mega-altaria": "0334-0001",
    "lillipup": "0506",
    "herdier": "0507",
    "stoutland": "0508",
    "hitmonchan": "0129",
    "skuntank": "0129",
    "primeape": "0129",
    "ursaring": "0129",
    "bibarel": "0129",
    "sentret": "0129",
    "furret": "0129",
    "lunatone": "0129",
    "honchkrow": "0129",
    "glameow": "0129",
    "purugly": "0129",
    "toxicroak": "0129",
    "skarmory": "0129",
    "lickilicky": "0129",
    "lickitung": "0129",
    "tangela": "0129",
    "tangrowth": "0129",
    "misdreavus": "0129",
    "mismagius": "0129",
    "solrock": "0129",
    "skorupi": "0129",
    "claydol": "0129",
    "baltoy": "0129",
    "gliscor": "0129",
    "muk": "0129",
    "nosepass": "0129",
    "probopass": "0129",
    "surskit": "0129",
    "masquerain": "0129",
    "volbeat": "0129",
    "illumise": "0129",
    "diglett": "0129",
    "dugtrio": "0129",
    "seviper": "0129",
    "weezing": "0129",
    "koffing": "0129",
    "cacturne": "0129",
    "cacnea": "0129",
    "drifblim": "0129",
    "drifloon": "0129",
    "kingler": "0129",
    "krabby": "0129",
    "exeggcute": "0129",
    "hoothoot": "0129",
    "noctowl": "0129",
    "doduo": "0129",
    "dodrio": "0129",
    "tauros": "0129",
    "burmy": "0129",
    "wormadan": "0129",
    "spinarak": "0129",
    "ariados": "0129",
    "wurmple": "0129",
    "bronzong": "0129",
    "bronzor": "0129",
    "drowzee": "0129",
    "hypno": "0129",
    "smoochum": "0129",
    "plusle": "0129",
    "minun": "0129",
    "phanpy": "0129",
    "girafarig": "0129",
    "yanma": "0129",
    "yanmega": "0129",
    "poochyena": "0129",
    "mightyena": "0129",
    "shroomish": "0129",
    "carnivine": "0129",
    "mawile": "0129",
    "dunsparce": "0129",
    "smeargle": "0129",
    "cherubi": "0129",
    "cherim": "0129",
    "zigzagoon": "0129",
    "pachirisu": "0129",
    "stantler": "0129",
    "pinsir": "0129",
    "breloom": "0129",
    "linoone": "0129",
    "krickerot": "0129",
    "tropius": "0129",
    "mew": "0129",
    "shellder": "0129",
    "corsola": "0129",
    "shellos": "0129",
    "gastrodon": "0129",
    "wailmer": "0129",
    "wailord": "0129",
    "clamperl": "0129",
    "finneon": "0129",
    "tentacool": "0129",
    "tentacruel": "0129",
    "remoraid": "0129",
    "seel": "0129",
    "dewgong": "0129",
    "pelipper": "0129",
    "staryu": "0129",
    "starmie": "0129",
    "spoink": "0129",
    "grumpig": "0129",
    "voltorb": "0129",
    "electrode": "0129",
    "murkrow": "0129",
    "skitty": "0129",
    "delcatty": "0129",
    "tailow": "0129",
    "swellow": "0129",
    "wingull": "0129",
    "donphan": "0129",
    "floatzel": "0129",
    "ponyta": "0129",
    "rapidash": "0129",
    "slugma": "0129",
    "magcargo": "0129",
    "hippowdon": "0129",
    "hippopotas": "0129",
    "vulpix": "0129",
    "ninetales": "0129",
    "foretress": "0129",
    "chingling": "0129",
    "mothim": "0129",
    "nincada": "0129",
    "ninjask": "0129",
    "shedninja": "0129",
    "unown": "0129",
    "octirelly": "0129",
    "qwilfish": "0129",
    "chansey": "0129",
    "blissey": "0129",
    "wynaut": "0129",
    "woobuffet": "0129",
    "spinda": "0129",
    "miltank": "0129",
    "vespiqueen": "0129",
    "houndour": "0228",
    "houndoom": "0129",
    "snubull": "0129",
    "granbull": "0129",
    "farfetch": "0129",
    "kricketune": "0129",
    "grimer": "0129",
    "psyduck": "0129",
    "wooper": "0129",
    "barboach": "0129",
    "whiscash": "0129",
    "sneasel": "0129",
    "sableye": "0129",
    "sudowoodo": "0129",
    "ekans": "0129",
    "arbok": "0129",
    "castform": "0351",
    "castform-sun": "0351-0001",
    "castform-rain": "0351-0002",
    "castform-hail": "0351-0003"
})