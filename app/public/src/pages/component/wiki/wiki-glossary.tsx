import { useTranslation } from "react-i18next"
import { TechnicalTerms } from "../../../../../types/strings/TechnicalTerm"
import { addIconsToDescription } from "../../utils/descriptions"
import "./wiki-glossary.css"

export default function WikiGlossary() {
  const { t } = useTranslation()
  const itemCategories = [
    "components",
    "craftable_items",
    "consumable_item",
    "unholdable_item",
    "removable_item"
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
