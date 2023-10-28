import React from "react"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { PrecomputedTypePokemon } from "../../../../../types"
import { Synergy, SynergyEffects } from "../../../../../types/enum/Synergy"
import PRECOMPUTED_TYPE_POKEMONS from "../../../../../models/precomputed/type-pokemons.json"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { SynergyTriggers, RarityColor } from "../../../../../types/Config"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { EffectDescriptionComponent } from "./effect-description"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"
import { cc } from "../../utils/jsx"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"

const precomputed = PRECOMPUTED_TYPE_POKEMONS as PrecomputedTypePokemon

export default function SynergyDetailComponent(props: {
  type: Synergy
  value: number
}) {
  const { t } = useTranslation()
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  if (SynergyTriggers.hasOwnProperty(props.type) === false) return null
  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)

  const additionals = precomputed[props.type].additionalPokemons
    .filter((p) => additionalPokemons.includes(PkmFamily[p]))
    .filter(
      // remove duplicates of same family
      (p, i, arr) => arr.findIndex((x) => PkmFamily[x] === PkmFamily[p]) === i
    )

  return (
    <div style={{ maxWidth: "480px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SynergyIcon type={props.type} size="40px" />
        <h3 style={{ margin: 0 }}>{t(`synergy.${props.type}`)}</h3>
      </div>
      <p>{addIconsToDescription(t(`synergy_description.${props.type}`))}</p>

      {SynergyEffects[props.type].map((d, i) => {
        return (
          <div
            key={d}
            style={{
              color:
                levelReached === SynergyTriggers[props.type][i]
                  ? "#fff"
                  : "#e8e8e8",
              backgroundColor:
                levelReached === SynergyTriggers[props.type][i]
                  ? "#54596b"
                  : "rgba(84, 89, 107,0)",
              border:
                levelReached === SynergyTriggers[props.type][i]
                  ? "4px solid black"
                  : "none",
              borderRadius: "12px",
              padding: "5px"
            }}
          >
            <h4 style={{ fontSize: "1.2em" }}>
              ({SynergyTriggers[props.type][i]}) {t(`effect.${d}`)}
            </h4>
            <EffectDescriptionComponent effect={d} />
          </div>
        )
      })}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {precomputed[props.type].pokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          return <PokemonPortrait p={pokemon} key={p} />
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {additionals.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          return <PokemonPortrait p={pokemon} key={p} />
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {precomputed[props.type].uniquePokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          return <PokemonPortrait p={pokemon} key={p} />
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {precomputed[props.type].legendaryPokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          return <PokemonPortrait p={pokemon} key={p} />
        })}
      </div>
      {/*<div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {precomputed[props.type].mythicalPokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          return <PokemonPortrait p={pokemon} />
        })}
      </div>*/}
    </div>
  )
}
function PokemonPortrait(props: { p: Pokemon }) {
  return (
    <div
      className={cc("pokemon-portrait", {
        additional: isAdditionalPick(props.p.name)
      })}
      key={props.p.name}
    >
      <img
        style={{ border: "3px solid " + RarityColor[props.p.rarity] }}
        src={getPortraitSrc(props.p.index)}
      />
    </div>
  )
}
