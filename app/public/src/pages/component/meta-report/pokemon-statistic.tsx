import React from "react"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import CSS from "csstype"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import { useTranslation } from "react-i18next"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPortraitSrc } from "../../../utils"

const pStyle = {
  fontSize: "1.1vw"
}

export default function PokemonStatistic(props: {
  pokemons: IPokemonsStatistic[]
}) {
  const { t } = useTranslation()
  const imgStyle: CSS.Properties = {
    width: "15px",
    height: "15px",
    imageRendering: "pixelated"
  }

  const families = new Map<Pkm, IPokemonsStatistic[]>()
  props.pokemons.forEach((pokemon) => {
    const family = families.get(PkmFamily[pokemon.name])
    if (family) {
      family.push(pokemon)
    } else {
      families.set(PkmFamily[pokemon.name], [pokemon])
    }
  })
  families.forEach((family) => {
    family.sort(
      (a, b) =>
        PokemonFactory.createPokemonFromName(a.name).stars -
        PokemonFactory.createPokemonFromName(b.name).stars
    )
  })

  if (props.pokemons.length === 0) {
    return <p>No data available</p>
  }
  return (
    <div style={{ height: "70vh", overflowY: "scroll" }}>
      {Array.from(families).map(([pkm, pokemons], i) => (
        <div
          key={pkm}
          style={{ backgroundColor: "rgb(84, 89, 107)", margin: "10px" }}
          className="nes-container"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "2vw" }}>{i + 1}</span>
              <div style={{ display: "flex", flexFlow: "column" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  {pokemons.map((pokemon, i) => (
                    <p style={pStyle}>
                      {t(`pkm.${pokemon.name}`)}{" "}
                      {i !== pokemons.length - 1 ? "->" : ""}
                    </p>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {pokemons.map((pokemon) => (
                    <img
                      src={getPortraitSrc(
                        PkmIndex[pokemon.name] ?? PkmIndex[Pkm.MAGIKARP]
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexFlow: "column" }}>
              <span style={{ fontSize: "2vw" }}>
                {t("average_place")}{" "}
                {(
                  pokemons.reduce((prev, curr) => prev + curr.rank, 0) /
                  pokemons.length
                ).toFixed(1)}
              </span>
              <div style={{ display: "flex", gap: "5px" }}>
                {pokemons.map((pokemon) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      flexFlow: "column",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={getPortraitSrc(
                        PkmIndex[pokemon.name] ?? PkmIndex[Pkm.MAGIKARP]
                      )}
                    />
                    <span>{pokemon.rank.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexFlow: "column" }}>
              <span style={{ fontSize: "2vw" }}>
                {pokemons.reduce((prev, curr) => prev + curr.count, 0)}
              </span>
              <div style={{ display: "flex", gap: "5px" }}>
                {pokemons.map((pokemon) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      flexFlow: "column",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={getPortraitSrc(
                        PkmIndex[pokemon.name] ?? PkmIndex[Pkm.MAGIKARP]
                      )}
                    />
                    <span>{pokemon.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexFlow: "column", gap: "5px" }}>
              {pokemons.map((pokemon) => (
                <div key={pokemon.name} style={{ display: "flex", gap: "5px" }}>
                  <img
                    src={getPortraitSrc(
                      PkmIndex[pokemon.name] ?? PkmIndex[Pkm.MAGIKARP]
                    )}
                  />
                  {pokemon.items.map((item) => {
                    return (
                      <img
                        key={item}
                        style={imgStyle}
                        src={"assets/item/" + item + ".png"}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
