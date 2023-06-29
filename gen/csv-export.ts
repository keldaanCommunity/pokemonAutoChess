import { createObjectCsvWriter } from "csv-writer"
import { Pkm, PkmDuos, PkmFamily, PkmIndex } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Rarity } from "../app/types/enum/Game"
import { logger } from "../app/utils/logger"

const csvWriter = createObjectCsvWriter({
  path: "../app/models/precomputed/pokemons-data.csv",
  header: [
    { id: "index", title: "Index" },
    { id: "name", title: "Name" },
    { id: "category", title: "Category" },
    { id: "tier", title: "Tier" },
    { id: "additional", title: "Additional pick" },
    { id: "duo", title: "Duo" },
    { id: "type1", title: "Type 1" },
    { id: "type2", title: "Type 2" },
    { id: "type3", title: "Type 3" },
    { id: "type4", title: "Type 4" },
    { id: "hp", title: "HP" },
    { id: "attack", title: "Attack" },
    { id: "def", title: "Defense" },
    { id: "spedef", title: "Special Defense" },
    { id: "range", title: "Attack Range" },
    { id: "mana", title: "Max Mana" },
    { id: "ability", title: "Ability" },
    { id: "family", title: "Family" },
    { id: "familyType1", title: "Family Type 1" },
    { id: "familyType2", title: "Family Type 2" },
    { id: "familyType3", title: "Family Type 3" },
    { id: "familyType4", title: "Family Type 4" }
  ]
})

interface PokemonData {
  index: string
  name: string
  category: string
  tier: number
  additional: boolean
  duo: boolean
  type1: string
  type2: string
  type3: string
  type4: string
  hp: number
  attack: number
  def: number
  spedef: number
  range: number
  mana: number
  ability: string
  family: string
  familyType1: string
  familyType2: string
  familyType3: string
  familyType4: string
}

const data: PokemonData[] = []

Object.values(Pkm)
  .sort((a, b) => PkmIndex[a].localeCompare(PkmIndex[b]))
  .forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    if (pokemon.skill != Ability.DEFAULT && pokemon.rarity !== Rarity.SPECIAL) {
      const family = Object.keys(PkmFamily).filter(
        (p) => PkmFamily[p] === PkmFamily[pkm]
      )
      const familyTypes = [
        ...new Set(
          family.flatMap((p) => [
            ...PokemonFactory.createPokemonFromName(p as Pkm).types
          ])
        )
      ]
      data.push({
        index: pokemon.index,
        name: pkm,
        category: pokemon.rarity,
        tier: pokemon.stars,
        additional: pokemon.additional,
        duo: Object.values(PkmDuos).some(duo => duo.includes(pkm)),
        type1: pokemon.types[0] ?? "",
        type2: pokemon.types[1] ?? "",
        type3: pokemon.types[2] ?? "",
        type4: pokemon.types[3] ?? "",
        hp: pokemon.hp,
        attack: pokemon.atk,
        def: pokemon.def,
        spedef: pokemon.speDef,
        range: pokemon.range,
        mana: pokemon.maxMana,
        ability: pokemon.skill,
        family: PkmFamily[pkm],
        familyType1: familyTypes[0] ?? "",
        familyType2: familyTypes[1] ?? "",
        familyType3: familyTypes[2] ?? "",
        familyType4: familyTypes[3] ?? ""
      })
    }
  })

csvWriter
  .writeRecords(data)
  .then(() => logger.info("CSV export done successfully"))
