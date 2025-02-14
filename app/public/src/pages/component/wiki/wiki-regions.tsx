import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { PokemonClasses } from "../../../../../models/colyseus-models/pokemon"
import { getPokemonData, PRECOMPUTED_REGIONAL_MONS } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { DungeonDetails, DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import SynergyIcon from "../icons/synergy-icon"
import { cc } from "../../utils/jsx"
import { usePreference } from "../../../preferences"
import PokemonPortrait from "../pokemon-portrait"

export default function WikiRegions() {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()

  const [pokemonsPerRegion, setPokemonsPerRegion] = useState<{ [key in DungeonPMDO]?: Pkm[] }>({})
  useEffect(() => {
    const timer = setTimeout(() => {
      setPokemonsPerRegion(Object.keys(DungeonPMDO).reduce((o, region) => {
        const regionalMons = PRECOMPUTED_REGIONAL_MONS.filter((p) =>
          new PokemonClasses[p]().isInRegion(region as DungeonPMDO)
        ).filter(
          (p, index, array) => {
            const evolution = getPokemonData(PkmFamily[p]).evolution
            return array.findIndex((p2) => PkmFamily[p] === PkmFamily[p2]) === index && // dedup same family
              !(evolution === p || (evolution && getPokemonData(evolution).evolution === p)) // exclude non divergent evos
          }
        )
        o[region as DungeonPMDO] = regionalMons
        return o
      }, {}))
    }, 100)
    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [])

  return (
    <div id="wiki-regions">
      <div className="my-box" style={{ marginBottom: "0.5em" }}>
        <p>{t("region_hint1")}</p>
        <p>{t("region_hint2")}</p>
      </div>
      <ul>
        {(Object.keys(DungeonPMDO) as DungeonPMDO[])
          .sort((a, b) => t(`map.${a}`).localeCompare(t(`map.${b}`)))
          .map((dungeon) => {
            return (
              <li key={dungeon} className="my-box">
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <h2>{t(`map.${dungeon}`)}</h2>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {DungeonDetails[dungeon].synergies.map((synergy) => (
                      <SynergyIcon
                        type={synergy}
                        key={"map_synergy_" + synergy}
                      />
                    ))}
                  </div>
                </div>
                <img
                  src={`/assets/maps/${dungeon}-preview.png`}
                  loading="lazy"
                  alt={dungeon}
                  className={cc({ pixelated: !antialiasing })}
                />
                <div className="wiki-regional-mons">
                  {(pokemonsPerRegion[dungeon] ?? []).map((pkm) => (
                    <PokemonPortrait key={pkm} loading="lazy" portrait={PkmIndex[pkm]} />
                  ))}
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
