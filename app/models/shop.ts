import PokemonFactory from "./pokemon-factory"
import { Pkm, PkmFamily } from "../types/enum/Pokemon"
import Player from "./colyseus-models/player"
import { IPokemon } from "../types"
import { Probability } from "../types/Config"
import { Rarity } from "../types/enum/Game"
import { pickRandomIn } from "../utils/random"

export default class Shop {
  COMMON: Pkm[]
  UNCOMMON: Pkm[]
  RARE: Pkm[]
  EPIC: Pkm[]
  LEGENDARY: Pkm[]
  MYTHICAL_1: Pkm[]
  MYTHICAL_2: Pkm[]
  constructor() {
    this.COMMON = [
      Pkm.POLIWAG,
      Pkm.CHARMANDER,
      Pkm.GEODUDE,
      Pkm.AZURILL,
      Pkm.ZUBAT,
      Pkm.MAREEP,
      Pkm.CLEFFA,
      Pkm.CATERPIE,
      Pkm.WEEDLE,
      Pkm.PIDGEY,
      Pkm.HOPPIP,
      Pkm.SEEDOT,
      Pkm.STARLY,
      Pkm.SWINUB,
      Pkm.FENNEKIN,
      Pkm.PICHU,
      Pkm.SQUIRTLE
    ]

    this.UNCOMMON = [
      Pkm.TOTODILE,
      Pkm.IGGLYBUFF,
      Pkm.CHIKORITA,
      Pkm.CYNDAQUIL,
      Pkm.TREECKO,
      Pkm.TORCHIC,
      Pkm.MUDKIP,
      Pkm.CHIMCHAR,
      Pkm.PIPLUP,
      Pkm.MACHOP,
      Pkm.HORSEA,
      Pkm.SPHEAL,
      Pkm.MAGNEMITE,
      Pkm.DUSKULL,
      Pkm.EEVEE,
      Pkm.FLABEBE,
      Pkm.BELLSPROUT,
      Pkm.SLOWPOKE,
      Pkm.HATENNA
    ]

    this.RARE = [
      Pkm.BULBASAUR,
      Pkm.TURTWIG,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.TRAPINCH,
      Pkm.ARON,
      Pkm.RHYHORN,
      Pkm.TOGEPI,
      Pkm.LOTAD,
      Pkm.SHINX,
      Pkm.DRATINI,
      Pkm.MAGBY,
      Pkm.WHISMUR,
      Pkm.VANILLITE,
      Pkm.BAGON,
      Pkm.HONEDGE
    ]

    this.EPIC = [
      Pkm.ABRA,
      Pkm.LARVITAR,
      Pkm.SLAKOTH,
      Pkm.RALTS,
      Pkm.BELDUM,
      Pkm.GIBLE,
      Pkm.ELEKID,
      Pkm.SNORUNT,
      Pkm.BUDEW,
      Pkm.PORYGON,
      Pkm.CUBONE,
      Pkm.HOUNDOUR,
      Pkm.GOOMY,
      Pkm.BOUNSWEET,
      Pkm.OSHAWOTT
    ]

    this.LEGENDARY = [
      Pkm.GASTLY,
      Pkm.ONIX,
      Pkm.SCYTHER,
      Pkm.RIOLU,
      Pkm.MEDITITE,
      Pkm.NUMEL,
      Pkm.SNOVER,
      Pkm.SWABLU,
      Pkm.BUNEARY,
      Pkm.ELECTRIKE,
      Pkm.SHUPPET,
      Pkm.NINCADA,
      Pkm.HAPPINY,
      Pkm.SOLOSIS
    ]

    this.MYTHICAL_1 = [
      Pkm.AERODACTYL,
      Pkm.BLACEPHALON,
      Pkm.REGIDRAGO,
      Pkm.REGIELEKI,
      Pkm.CASTFORM,
      Pkm.REGICE,
      Pkm.REGISTEEL,
      Pkm.REGIROCK,
      Pkm.UXIE,
      Pkm.MESPRIT,
      Pkm.AZELF,
      Pkm.LATIAS,
      Pkm.LATIOS,
      Pkm.ZAPDOS,
      Pkm.MOLTRES,
      Pkm.ARTICUNO,
      Pkm.LAPRAS,
      Pkm.ABSOL,
      Pkm.SPIRITOMB,
      Pkm.ROTOM,
      Pkm.MANAPHY,
      Pkm.COBALION,
      Pkm.KELDEO,
      Pkm.VOLCARONA,
      Pkm.TAPU_KOKO,
      Pkm.TAPU_LELE,
      Pkm.SEVIPER,
      Pkm.KECLEON,
      Pkm.MAWILE,
      Pkm.TAUROS,
      Pkm.TORNADUS,
      Pkm.RELICANTH,
      Pkm.MEW,
      Pkm.CHATOT
    ]
    this.MYTHICAL_2 = [
      Pkm.RESHIRAM,
      Pkm.ZEKROM,
      Pkm.STAKATAKA,
      Pkm.GENESECT,
      Pkm.GUZZLORD,
      Pkm.ETERNATUS,
      Pkm.MELOETTA,
      Pkm.MEWTWO,
      Pkm.ENTEI,
      Pkm.SUICUNE,
      Pkm.RAIKOU,
      Pkm.REGIGIGAS,
      Pkm.CELEBI,
      Pkm.VICTINI,
      Pkm.JIRACHI,
      Pkm.ARCEUS,
      Pkm.DEOXYS,
      Pkm.SHAYMIN,
      Pkm.GIRATINA,
      Pkm.DARKRAI,
      Pkm.CRESSELIA,
      Pkm.HEATRAN,
      Pkm.LUGIA,
      Pkm.HO_OH,
      Pkm.PALKIA,
      Pkm.DIALGA,
      Pkm.RAYQUAZA,
      Pkm.KYOGRE,
      Pkm.GROUDON,
      Pkm.VOLCANION
    ]
  }

  addAdditionalPokemon(pkm: Pkm) {
    const p = PokemonFactory.createPokemonFromName(pkm)
    switch (p.rarity) {
      case Rarity.COMMON:
        this.COMMON.push(pkm)
        break
      case Rarity.UNCOMMON:
        this.UNCOMMON.push(pkm)
        break
      case Rarity.RARE:
        this.RARE.push(pkm)
        break
      case Rarity.EPIC:
        this.EPIC.push(pkm)
        break
      case Rarity.LEGENDARY:
        this.LEGENDARY.push(pkm)
        break
      default:
        break
    }
  }

  assignShop(player: Player) {
    for (let i = 0; i < 6; i++) {
      let pokemon = this.pickPokemon(player)
      const seed = Math.random()
      if (seed > 0.994) {
        pokemon = Pkm.DITTO
      }
      player.shop[i] = pokemon
    }
  }

  assignDittoShop(player: Player) {
    player.shop[0] = Pkm.DITTO

    for (let i = 1; i < 6; i++) {
      const pokemon = this.pickPokemon(player)
      player.shop[i] = pokemon
    }
  }

  assignFirstMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(this.MYTHICAL_1))
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(pickRandomIn(mythicalCopy)).name
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1)
      player.shop[i] = pkm
    }
  }

  assignSecondMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(this.MYTHICAL_2))
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(pickRandomIn(mythicalCopy)).name
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1)
      player.shop[i] = pkm
    }
  }

  pickPokemon(player: Player) {
    const playerProbality = Probability[player.experienceManager.level]
    const seed = Math.random()
    let pokemon = Pkm.MAGIKARP
    let threshold = 0
    const finals = new Array<Pkm>()

    player.board.forEach((pokemon: IPokemon) => {
      if (pokemon.final) {
        finals.push(PkmFamily[pokemon.name])
      }
    })

    const common = this.COMMON.filter((name: Pkm) => !finals.includes(name))
    const uncommon = this.UNCOMMON.filter((name: Pkm) => !finals.includes(name))
    const rare = this.RARE.filter((name: Pkm) => !finals.includes(name))
    const epic = this.EPIC.filter((name: Pkm) => !finals.includes(name))
    const legendary = this.LEGENDARY.filter((name: Pkm) => !finals.includes(name))

    for (let i = 0; i < playerProbality.length; i++) {
      threshold += playerProbality[i]
      if (seed < threshold) {
        switch (i) {
          case 0:
            pokemon = pickRandomIn(common)
            break
          case 1:
            pokemon = pickRandomIn(uncommon)
            break
          case 2:
            pokemon = pickRandomIn(rare)
            break
          case 3:
            pokemon = pickRandomIn(epic)
            break
          case 4:
            pokemon = pickRandomIn(legendary)
            break
          default:
            console.log(
              `error in shop while picking seed = ${seed}, threshold = ${threshold}, index = ${i}`
            )
            break
        }
        break
      }
    }
    return pokemon
  }
}
