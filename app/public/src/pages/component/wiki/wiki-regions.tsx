import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { PokemonClasses } from "../../../../../models/colyseus-models/pokemon"
import { PRECOMPUTED_REGIONAL_MONS } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { DungeonDetails, DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"

export default function WikiRegions() {
  const { t } = useTranslation()

  const [pokemonsPerRegion, setPokemonsPerRegion] = useState<{ [key in DungeonPMDO]?: Pkm[] }>({})
  useEffect(() => {
    const timer = setTimeout(() => {
      setPokemonsPerRegion(Object.keys(DungeonPMDO).reduce((o, dungeon) => {
        const regionalMons = PRECOMPUTED_REGIONAL_MONS.filter((p) =>
          PokemonClasses[p].prototype.isInRegion(p, dungeon)
        )
          .filter(
            (pkm, index, array) =>
              array.findIndex(
                (p) => PkmFamily[p] === PkmFamily[pkm]
              ) === index // dedup same family
          )
        o[dungeon as DungeonPMDO] = regionalMons
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
                />
                <div className="wiki-regional-mons">
                  {(pokemonsPerRegion[dungeon] ?? []).map((pkm) => (
                    <img
                      key={pkm}
                      className="pokemon-portrait"
                      loading="lazy"
                      src={getPortraitSrc(PkmIndex[pkm])}
                    ></img>
                  ))}
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
