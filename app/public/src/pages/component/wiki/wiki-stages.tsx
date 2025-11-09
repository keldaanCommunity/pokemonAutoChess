import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  AdditionalPicksStages,
  ItemCarouselStages,
  PortalCarouselStages
} from "../../../../../config"
import { TownEncountersByStage } from "../../../../../core/town-encounters"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PVEStages } from "../../../../../models/pve-stages"
import { getAdditionalsTier1 } from "../../../../../models/shop"
import { Emotion } from "../../../../../types"
import {
  CraftableItems,
  Item,
  ItemComponents
} from "../../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import PokemonPortrait from "../pokemon-portrait"
import "./wiki-stages.css"

type StageInfo = {
  level: number
  icon: string
  title?: string
  type: "pve" | "carousel" | "additional" | "portal" | "battle"
  stageData?: any
}

export default function WikiStages() {
  const { t } = useTranslation()
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [hoveredLegendType, setHoveredLegendType] = useState<string | null>(
    null
  )

  // Generate all stages from 0 to 40
  const generateStageInfo = (): StageInfo[] => {
    const stages: StageInfo[] = []

    for (let level = 0; level <= 40; level++) {
      // Check for carousel stages
      if (ItemCarouselStages.includes(level)) {
        stages.push({
          level,
          icon: "/assets/ui/carousel.svg",
          type: "carousel"
        })
      }

      // Check for portal carousel stages
      if (PortalCarouselStages.includes(level)) {
        stages.push({
          level,
          icon: "/assets/ui/mythical.svg",
          title:
            level === 0
              ? t("starter_pick")
              : level === 10
                ? t("unique_pick")
                : level === 20
                  ? t("legendary_pick")
                  : undefined,
          type: "portal"
        })
      } else if (AdditionalPicksStages.includes(level)) {
        // Check for additional pick stages
        stages.push({
          level,
          icon: "/assets/ui/additional-pick.svg",
          type: "additional",
          title:
            level === AdditionalPicksStages[0]
              ? t("rarity.UNCOMMON")
              : level === AdditionalPicksStages[1]
                ? t("rarity.RARE")
                : level === AdditionalPicksStages[2]
                  ? t("rarity.EPIC")
                  : undefined
        })
      }

      // Check for PvE stages
      const pveStage = PVEStages[level]
      if (pveStage) {
        stages.push({
          level,
          icon: getPortraitSrc(
            PkmIndex[pveStage.avatar],
            false,
            Emotion.NORMAL
          ),
          title: t(pveStage.name),
          type: "pve",
          stageData: pveStage
        })
      } else {
        // Regular battle stage
        stages.push({
          level,
          icon: "/assets/ui/battle.svg",
          type: "battle"
        })
      }
    }

    return stages
  }

  const allStages = generateStageInfo()
  const selectedStageInfo =
    selectedStage !== null
      ? allStages.find((s) => s.level === selectedStage)
      : null

  return (
    <div id="wiki-stages">
      <div className="wiki-stage-path-container my-box">
        <div className="stage-header">
          <h2>{t("stages")}</h2>
          <div className="stage-legend">
            <div
              className="legend-item pve"
              onMouseEnter={() => setHoveredLegendType("pve")}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <img
                src={getPortraitSrc(
                  PkmIndex[Pkm.MAGIKARP],
                  false,
                  Emotion.NORMAL
                )}
                alt="PvE"
              />
              <span>{t("stage_type.pve")}</span>
            </div>
            <div
              className="legend-item carousel"
              onMouseEnter={() => setHoveredLegendType("carousel")}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <img src="/assets/ui/carousel.svg" alt="Carousel" />
              <span>{t("stage_type.carousel")}</span>
            </div>
            <div
              className="legend-item portal"
              onMouseEnter={() => setHoveredLegendType("portal")}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <img src="/assets/ui/mythical.svg" alt="Portal" />
              <span>{t("stage_type.portal")}</span>
            </div>
            <div
              className="legend-item additional"
              onMouseEnter={() => setHoveredLegendType("additional")}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <img src="/assets/ui/additional-pick.svg" alt="Additional" />
              <span>{t("stage_type.additional")}</span>
            </div>
            <div
              className="legend-item battle"
              onMouseEnter={() => setHoveredLegendType("battle")}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <img src="/assets/ui/battle.svg" alt="Battle" />
              <span>{t("stage_type.battle")}</span>
            </div>
          </div>
        </div>
        <div className="wiki-stage-path">
          {allStages.map((stage) => (
            <React.Fragment key={`stage-${stage.level}`}>
              <div
                className={cc("wiki-stage-path-item", {
                  selected: selectedStage === stage.level,
                  highlighted: hoveredLegendType === stage.type,
                  pve: stage.type === "pve",
                  carousel: stage.type === "carousel",
                  portal: stage.type === "portal",
                  additional: stage.type === "additional",
                  battle: stage.type === "battle"
                })}
                onClick={() =>
                  setSelectedStage(
                    selectedStage === stage.level ? null : stage.level
                  )
                }
                title={`${t("stage")} ${stage.level}: ${stage.title}`}
              >
                <img src={stage.icon} alt={stage.title} />
                <span className="stage-number">{stage.level}</span>
              </div>
              {stage.level < 40 && <span className="stage-connector">―</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stage Detail Display */}
      {selectedStageInfo && <StageDetail stageInfo={selectedStageInfo} />}
    </div>
  )
}

function StageDetail({ stageInfo }: { stageInfo: StageInfo }) {
  const { t } = useTranslation()
  const [itemHovered, setItemHovered] = useState<Item>()
  const [pokemonHovered, setPokemonHovered] = useState<Pkm>()

  if (!stageInfo) return null

  const itemDetail = (item: Item) => (
    <img
      key={item}
      className="item"
      src={`assets/item/${item}.png`}
      alt={t(`item.${item}`)}
      title={t(`item.${item}`)}
      data-tooltip-id="item-detail"
      onMouseOver={() => setItemHovered(item)}
    />
  )

  const pokemonDetail = (pkm: Pkm) => (
    <PokemonPortrait
      portrait={{
        index: PkmIndex[pkm],
        emotion: Emotion.NORMAL,
        shiny: false
      }}
      data-tooltip-id="pokemon-detail"
      onMouseOver={() => setPokemonHovered(pkm)}
    />
  )

  return (
    <div className="stage-detail my-box">
      <header className="stage-detail-header">
        <div className="stage-detail-info">
          <h3>
            {t("stage")} {stageInfo.level} - {t(`stage_type.${stageInfo.type}`)}
            {stageInfo.title ? " : " : null}
            {stageInfo.title}
          </h3>
        </div>
        <div className="stage-detail-icon">
          <img src={stageInfo.icon} alt={stageInfo.title} />
        </div>
      </header>

      {stageInfo.type === "pve" && stageInfo.stageData && (
        <div className="pve-stage-details">
          <div className="stage-board">
            <h4>{t("enemy_team")}:</h4>
            <table>
              <thead>
                <tr>
                  <th>{t("pokemon")}</th>
                  {stageInfo.stageData.marowakItems && (
                    <th>{t("marowak_items")}</th>
                  )}
                  {stageInfo.stageData.statBoosts && (
                    <th>{t("stat_boosts")}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {stageInfo.stageData.board.map(([pkm, x, y], index) => (
                  <tr key={index}>
                    <td className="pokemon-cell">
                      {pokemonDetail(pkm)}
                      <span>{t(`pkm.${pkm}`)}</span>
                    </td>
                    {stageInfo.stageData.marowakItems && (
                      <td className="items-cell">
                        {stageInfo.stageData.marowakItems[index]?.map(
                          (item) => (
                            <React.Fragment key={item}>
                              {itemDetail(item)}
                            </React.Fragment>
                          )
                        )}
                      </td>
                    )}
                    {stageInfo.stageData.statBoosts && (
                      <td className="boosts-cell">
                        {Object.entries(stageInfo.stageData.statBoosts).map(
                          ([stat, boost]) => (
                            <div
                              key={stat}
                              className="boost-item"
                              title={t(`stat.${stat}`)}
                            >
                              <img
                                src={`assets/icons/${stat}.png`}
                                alt={stat}
                              />
                              <span>+{boost as number}</span>
                            </div>
                          )
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stageInfo.stageData.rewards && (
            <div className="stage-rewards">
              <h4>{t("rewards")}</h4>
              <ul>
                {stageInfo.stageData.rewards.map((item) => (
                  <li key={item}>{itemDetail(item)}</li>
                ))}
              </ul>
            </div>
          )}

          {stageInfo.stageData.shinyChance && (
            <div className="stage-shiny">
              <h4>
                {t("shiny_chance")}:{" "}
                <span>
                  {(stageInfo.stageData.shinyChance * 100).toFixed(2)}%
                </span>
              </h4>
              {stageInfo.level === 1 ? (
                <p>{addIconsToDescription(t("shiny_magikarp_description"))}</p>
              ) : (
                <p>{addIconsToDescription(t("shiny_pve_description"))}</p>
              )}
            </div>
          )}
        </div>
      )}

      {stageInfo.type === "carousel" && (
        <div className="carousel-stage-details">
          <p>{t("carousel_description")}</p>

          <h4>{t("item_pool")}</h4>
          <div className="stage-rewards">
            <ul className="">
              {(stageInfo.level >= 20 ? CraftableItems : ItemComponents).map(
                (item) => (
                  <li key={item}>{itemDetail(item)}</li>
                )
              )}
            </ul>
          </div>

          <h4>{t("town_encounters")}</h4>
          <div className="town-encounters">
            {TownEncountersByStage[stageInfo.level] && (
              <ul>
                {Object.entries(TownEncountersByStage[stageInfo.level]).map(
                  ([pkm, chance]) => (
                    <li key={pkm} className="town-encounter">
                      {pokemonDetail(pkm as Pkm)}
                      <span>{(chance * 100).toFixed(1)}%</span>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      )}

      {stageInfo.type === "portal" && (
        <div className="portal-stage-details">
          <p>{t("portal_description_1")}</p>
          <p>{t("portal_description_2")}</p>
          <p>{t("portal_description_3")}</p>
        </div>
      )}

      {stageInfo.type === "additional" && (
        <div className="additional-stage-details">
          <p>{t("additional_description")}</p>
          <h4>{t("additional_picks")}</h4>
          <ul>
            {getAdditionalsTier1(
              stageInfo.level === AdditionalPicksStages[0]
                ? PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON
                : stageInfo.level === AdditionalPicksStages[1]
                  ? PRECOMPUTED_POKEMONS_PER_RARITY.RARE
                  : stageInfo.level === AdditionalPicksStages[2]
                    ? PRECOMPUTED_POKEMONS_PER_RARITY.EPIC
                    : []
            ).map((pkm) => (
              <li key={pkm}>{pokemonDetail(pkm)}</li>
            ))}
          </ul>
        </div>
      )}

      {stageInfo.type === "battle" && (
        <div className="battle-stage-details">
          <p>{t("battle_description")}</p>
        </div>
      )}

      {itemHovered && (
        <Tooltip
          id="item-detail"
          className="custom-theme-tooltip item-detail-tooltip"
        >
          <ItemDetailTooltip item={itemHovered} />
        </Tooltip>
      )}

      {pokemonHovered && (
        <Tooltip
          id="pokemon-detail"
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          float
        >
          <GamePokemonDetail pokemon={pokemonHovered} origin="wiki" />
        </Tooltip>
      )}
    </div>
  )
}
