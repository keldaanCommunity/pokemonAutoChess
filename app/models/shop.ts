import PokemonFactory from "./pokemon-factory"
import { Pkm, PkmFamily } from "../types/enum/Pokemon"
import Player from "./colyseus-models/player"
import { IPokemon } from "../types"
import { Probability } from "../types/Config"
import { Rarity } from "../types/enum/Game"
import { pickRandomIn } from "../utils/random"

export const PoolSizeRarity: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 29,
  [Rarity.UNCOMMON]: 22,
  [Rarity.RARE]: 18,
  [Rarity.EPIC]: 12,
  [Rarity.LEGENDARY]: 10,
  [Rarity.MYTHICAL]: 29,
  [Rarity.NEUTRAL]: 29,
  [Rarity.SUMMON]: 29
}

export const CommonShop = new Array<Pkm>(
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
)

export const UncommonShop = new Array<Pkm>(
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
)

export const RareShop = new Array<Pkm>(
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
)

export const EpicShop = new Array<Pkm>(
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
)

export const LegendaryShop = new Array<Pkm>(
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
)

export const Mythical1Shop = new Array<Pkm>(
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
)

export const Mythical2Shop = new Array<Pkm>(
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
)

export default class Shop {
  commonPool: Map<Pkm, number> = new Map<Pkm, number>()
  uncommonPool: Map<Pkm, number> = new Map<Pkm, number>()
  rarePool: Map<Pkm, number> = new Map<Pkm, number>()
  epicPool: Map<Pkm, number> = new Map<Pkm, number>()
  legendaryPool: Map<Pkm, number> = new Map<Pkm, number>()
  constructor() {
    CommonShop.forEach((pkm) => {
      this.commonPool.set(pkm, PoolSizeRarity[Rarity.COMMON])
    })
    UncommonShop.forEach((pkm) => {
      this.uncommonPool.set(pkm, PoolSizeRarity[Rarity.UNCOMMON])
    })
    RareShop.forEach((pkm) => {
      this.rarePool.set(pkm, PoolSizeRarity[Rarity.RARE])
    })
    EpicShop.forEach((pkm) => {
      this.epicPool.set(pkm, PoolSizeRarity[Rarity.EPIC])
    })
    LegendaryShop.forEach((pkm) => {
      this.legendaryPool.set(pkm, PoolSizeRarity[Rarity.LEGENDARY])
    })
  }

  addAdditionalPokemon(pkm: Pkm) {
    const p = PokemonFactory.createPokemonFromName(pkm)
    switch (p.rarity) {
      case Rarity.COMMON:
        this.commonPool.set(pkm, PoolSizeRarity[Rarity.COMMON])
        break
      case Rarity.UNCOMMON:
        this.uncommonPool.set(pkm, PoolSizeRarity[Rarity.UNCOMMON])
        break
      case Rarity.RARE:
        this.rarePool.set(pkm, PoolSizeRarity[Rarity.RARE])
        break
      case Rarity.EPIC:
        this.epicPool.set(pkm, PoolSizeRarity[Rarity.EPIC])
        break
      case Rarity.LEGENDARY:
        this.legendaryPool.set(pkm, PoolSizeRarity[Rarity.LEGENDARY])
        break
      default:
        break
    }
  }

  assignShop(player: Player, addDitto?: boolean) {
    player.shop.forEach((pkm) => {
      const pokemon = PokemonFactory.createPokemonFromName(pkm)
      if (pokemon.name !== Pkm.MAGIKARP) {
        if (pokemon.rarity === Rarity.COMMON) {
          const value = this.commonPool.get(pkm)
          if (value !== undefined) {
            this.commonPool.set(pkm, value + 1)
            console.log("adding back a ", pkm, value + 1)
          }
        } else if (pokemon.rarity === Rarity.UNCOMMON) {
          const value = this.uncommonPool.get(pkm)
          if (value !== undefined) {
            this.uncommonPool.set(pkm, value + 1)
            console.log("adding back a ", pkm, value + 1)
          }
        } else if (pokemon.rarity === Rarity.RARE) {
          const value = this.rarePool.get(pkm)
          if (value !== undefined) {
            this.rarePool.set(pkm, value + 1)
            console.log("adding back a ", pkm, value + 1)
          }
        } else if (pokemon.rarity === Rarity.EPIC) {
          const value = this.epicPool.get(pkm)
          if (value !== undefined) {
            this.epicPool.set(pkm, value + 1)
            console.log("adding back a ", pkm, value + 1)
          }
        } else if (pokemon.rarity === Rarity.LEGENDARY) {
          const value = this.legendaryPool.get(pkm)
          if (value !== undefined) {
            this.legendaryPool.set(pkm, value + 1)
            console.log("adding back a ", pkm, value + 1)
          }
        }
      }
    })

    if (addDitto) {
      player.shop[0] = Pkm.DITTO

      for (let i = 1; i < 6; i++) {
        const pokemon = this.pickPokemon(player)
        player.shop[i] = pokemon
      }
    } else {
      for (let i = 0; i < 6; i++) {
        let pokemon = this.pickPokemon(player)
        const seed = Math.random()
        if (seed > 0.994) {
          pokemon = Pkm.DITTO
        }
        player.shop[i] = pokemon
      }
    }
  }

  assignFirstMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(Mythical1Shop)) as Array<Pkm>
    for (let i = 0; i < 6; i++) {
      const pkm = pickRandomIn(mythicalCopy)
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1)
      player.shop[i] = pkm
    }
  }

  assignSecondMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(Mythical2Shop)) as Array<Pkm>
    for (let i = 0; i < 6; i++) {
      const pkm = pickRandomIn(mythicalCopy)
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1)
      player.shop[i] = pkm
    }
  }

  getRandomPokemonFromPool(pool: Map<Pkm, number>, finals: Array<Pkm>): Pkm {
    let pkm = Pkm.MAGIKARP
    const potential = new Array<Pkm>()
    pool.forEach((value, pkm) => {
      if (!finals.includes(pkm)) {
        for (let i = 0; i < value; i++) {
          potential.push(pkm)
        }
      }
    })
    if (potential.length > 0) {
      pkm = potential[Math.floor(Math.random() * potential.length)]
    }
    const val = pool.get(pkm)
    if (val !== undefined) {
      pool.set(pkm, Math.max(0, val - 1))
    }
    console.log("taking a ", pkm, "from the shop", val)
    return pkm
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

    for (let i = 0; i < playerProbality.length; i++) {
      threshold += playerProbality[i]
      if (seed < threshold) {
        switch (i) {
          case 0:
            pokemon = this.getRandomPokemonFromPool(this.commonPool, finals)
            break
          case 1:
            pokemon = this.getRandomPokemonFromPool(this.uncommonPool, finals)
            break
          case 2:
            pokemon = this.getRandomPokemonFromPool(this.rarePool, finals)
            break
          case 3:
            pokemon = this.getRandomPokemonFromPool(this.epicPool, finals)
            break
          case 4:
            pokemon = this.getRandomPokemonFromPool(this.legendaryPool, finals)
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
