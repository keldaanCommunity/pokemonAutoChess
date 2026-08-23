import { useTranslation } from "react-i18next"
import { DocumentedBoardEffects } from "../../../../../types/enum/Effect"
import { TechnicalTerms } from "../../../../../types/strings/TechnicalTerm"
import { addIconsToDescription } from "../../utils/descriptions"
import { BOARD_EFFECTS_IN_BATTLE_STATS } from "../game/board-effect-dps"
import "./wiki-glossary.css"

export default function WikiGlossary() {
  const { t } = useTranslation()
  const itemCategories = [
    "components",
    "craftable_items",
    "consumable_item",
    "unholdable_item",
    "removable_item",
    "gift"
  ] as const

  return (
    <div id="wiki-glossary">
      <h2>{t("wiki.nav.glossary_label")}</h2>
      <h3>{t("wiki.glossary.damage_types")}</h3>
      <dl>
        <div className="my-box glossary-term" key="physical">
          <dt>{addIconsToDescription("PHYSICAL")}</dt>
          <dd>{addIconsToDescription(t("wiki.glossary.PHYSICAL"))}</dd>
        </div>
        <div className="my-box glossary-term" key="special">
          <dt>{addIconsToDescription("SPECIAL")}</dt>
          <dd>{addIconsToDescription(t("wiki.glossary.SPECIAL"))}</dd>
        </div>
        <div className="my-box glossary-term" key="true">
          <dt>{addIconsToDescription("TRUE")}</dt>
          <dd>{addIconsToDescription(t("wiki.glossary.TRUE"))}</dd>
        </div>
      </dl>

      <h3>{t("wiki.glossary.board_effects")}</h3>
      <p className="glossary-note">{t("wiki.glossary.board_effects_note")}</p>
      <dl>
        {DocumentedBoardEffects.map((effect) => (
          <div key={effect} className="my-box glossary-term">
            <dt>
              {addIconsToDescription(effect)}
              {BOARD_EFFECTS_IN_BATTLE_STATS.has(effect) && (
                <span className="glossary-tag">
                  {t("wiki.glossary.battle_stats_tag")}
                </span>
              )}
            </dt>
            <dd>
              {addIconsToDescription(t(`effect_description.${effect}`))}
            </dd>
          </div>
        ))}
      </dl>

      <h3>{t("technical_terms.title")}</h3>
      <dl>
        {TechnicalTerms.map((term) => (
          <div key={term} className="my-box glossary-term">
            <dt>{addIconsToDescription(term)}</dt>
            <dd>
              {addIconsToDescription(t(`technical_terms_definitions.${term}`))}
            </dd>
          </div>
        ))}
      </dl>

      <h3>{t("wiki.glossary.item_categories")}</h3>
      <dl>
        {itemCategories.map((category) => (
          <div key={category} className="my-box glossary-term">
            <dt>{t(category)}</dt>
            <dd>{addIconsToDescription(t(`wiki.glossary.${category}`))}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
