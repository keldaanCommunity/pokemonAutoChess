import React from "react"
import { useTranslation } from "react-i18next"
import { ARCEUS_RATE, BoosterRarityProbability, DITTO_RATE, ExpPlace, ExpTable, FishRarityProbability, KECLEON_RATE, PoolSize, RarityColor, RarityProbabilityPerLevel } from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import { getRankLabel } from "../../../../../types/strings/Strings"
import { FishingRods } from "../../../../../types/enum/Item"
import { addIconsToDescription } from "../../utils/descriptions"

export default function WikiData() {
  const { t } = useTranslation()
  const rarities = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.ULTRA]
  const rarities_with_special = rarities.concat([Rarity.SPECIAL])
  const rarities_all = rarities.concat([Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.HATCH, Rarity.SPECIAL])
  const percentage = new Intl.NumberFormat(navigator.language, { style: "percent", maximumSignificantDigits: 2 })

  return (
    <div id="wiki-data">
      <p>{t("wiki.data_description")}</p>

      <h2>{t("wiki.tiers_by_level_title")}</h2>
      <p>{t("wiki.tiers_by_level_description")}</p>
      <table id="wiki-data-tiers-by-level">
        <thead>
          <tr>
            <th>{t("level")}</th>
            <th>{t("xp")}</th>
            {rarities.map((r, i) => <th style={{ color: RarityColor[rarities[i]] }}>{t("rarity." + r)}</th>)}
          </tr>
        </thead>
        <tbody>
          {Object.entries(RarityProbabilityPerLevel).map(([level, odds], i) => <tr>
            <td>{level}</td>
            <td>{level == '9' ? '' : ExpTable[level]}</td>
            {Object.entries(odds).map(([rarity, probability], i) => (
              <td key={rarity} style={{ color: RarityColor[rarities[i]] }}>{percentage.format(probability)}</td>
            ))}
          </tr>)}
        </tbody>
      </table>

      <h2>{t("wiki.pool_size_per_category")}</h2>
      <p>{t("wiki.pool_size_per_category_description")}</p>
      <table id="wiki-data-pool-size-per-category">
        <thead>
          <tr>{rarities.map((r, i) => <th style={{ color: RarityColor[rarities[i]] }} colSpan={2}>{t("rarity." + r)}</th>)}</tr>
          <tr>{rarities.map((r, i) => <>
            <th>
              <img key={"2s1"} src="assets/ui/star_empty.svg" height="16"></img>
              <img key={"2s2"} src="assets/ui/star_empty.svg" height="16"></img>
            </th>
            <th>
              <img key={"3s1"} src="assets/ui/star_empty.svg" height="16"></img>
              <img key={"3s2"} src="assets/ui/star_empty.svg" height="16"></img>
              <img key={"3s3"} src="assets/ui/star_empty.svg" height="16"></img>
            </th>
          </>)}</tr>
        </thead>
        <tbody>
          <tr>
            {rarities.map((r, i) => (<>
              <td style={{ color: RarityColor[rarities[i]] }}>{PoolSize[r][1]}</td>
              <td style={{ color: RarityColor[rarities[i]] }}>{PoolSize[r][2]}</td>
            </>))}
          </tr>
        </tbody>
      </table>

      <h2>{t("wiki.experience_by_rank")}</h2>
      <p>{t("wiki.experience_by_rank_description")}</p>
      <table id="wiki-data-experience-by-rank">
        <thead>
          <tr>
            <th>{t("rank")}</th>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(rank => <th>{getRankLabel(rank)}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("experience")}</td>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((rank, i) => <th>{ExpPlace[i]}</th>)}
          </tr>
        </tbody>
      </table>

      <h2>{t("wiki.booster_rarity_probability")}</h2>
      <p>{t("wiki.booster_rarity_probability_description")}</p>
      <table id="wiki-data-booster-rarity-probability">
        <thead>
          <tr>
            {rarities_all.map((r, i) => <th style={{ color: RarityColor[rarities_all[i]] }}>{t("rarity." + r)}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {rarities_all.map((r, i) => <td style={{ color: RarityColor[rarities_all[i]] }}>{percentage.format(BoosterRarityProbability[r])}</td>)}
          </tr>
        </tbody>
      </table>

      <h2>{t("wiki.fishing_rarity_rate")}</h2>
      <p>{t("wiki.fishing_rarity_rate_description")}</p>
      <table id="wiki-data-fishing-rarity-rate">
        <thead>
          <tr>
            <th></th>
            {rarities_with_special.map((r, i) => <th style={{ color: RarityColor[rarities_with_special[i]] }}>{t("rarity." + r)}</th>)}
          </tr>
        </thead>
        <tbody>
          {[...FishingRods].reverse().map((rod, i) => <tr>
            <td>{t("item." + rod)}</td>
            {rarities_with_special.map((r, i) => <td style={{ color: RarityColor[rarities_with_special[i]] }}>{percentage.format(FishRarityProbability[rod][r] ?? 0)}</td>)}
          </tr>)}
        </tbody>
      </table>

      <h2>{t("wiki.defense_calculation")}</h2>
      <p>{addIconsToDescription(t("wiki.defense_calculation_description"))}</p>

      <h2>{t("wiki.round_damage_calculation")}</h2>
      <p>{t("wiki.round_damage_calculation_description")}</p>

      <h2>{t("wiki.special_pokemons_rate")}</h2>
      <p>{t("wiki.ditto_rate")}: {percentage.format(DITTO_RATE)}</p>
      <p>{t("wiki.kecleon_rate")}: {percentage.format(KECLEON_RATE)}</p>
      <p>{t("wiki.arceus_rate")}: {percentage.format(ARCEUS_RATE)}</p>
    </div>
  )
}