import React from "react"
import { useTranslation } from "react-i18next"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { addIconsToDescription } from "../../utils/descriptions"
import {
  TownEncounter,
  TownEncounters,
  TownEncountersByStage,
  TownEncounterSellPrice
} from "../../../../../core/town-encounters"
import PokemonPortrait from "../pokemon-portrait"

export default function WikiTown() {
  const { t } = useTranslation()
  return (
    <div id="wiki-town">
      <div className="my-box" style={{ marginBottom: "0.5em" }}>
        <p>{t("town_encounters_hint")}</p>
        <p>{t("town_encounters_hint2")}</p>
      </div>
      <ul>
        {Object.values(TownEncounters).map((encounter: TownEncounter) => (
          <li key={encounter} className="my-box">
            <header>
              <h2>
                <PokemonPortrait portrait={{ index: PkmIndex[encounter] }} />{" "}
                {t(`pkm.${encounter}`)}
              </h2>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  textAlign: "end"
                }}
              >
                {t("stages")}:<br />
                {Object.keys(TownEncountersByStage)
                  .filter((s) => encounter in TownEncountersByStage[s])
                  .map((s) => s)
                  .join(", ")}
              </span>
            </header>
            <p className="description">
              {addIconsToDescription(
                t(`town_encounter_description.${encounter}`, {
                  cost: TownEncounterSellPrice[encounter] ?? 0
                })
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
