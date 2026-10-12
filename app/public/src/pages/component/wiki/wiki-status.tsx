import { useTranslation } from "react-i18next"
import { BoardEffects } from "../../../../../types/enum/Effect"
import { DocumentedStatuses } from "../../../../../types/enum/Status"
import { addIconsToDescription } from "../../utils/descriptions"

export default function WikiStatus() {
  const { t } = useTranslation()

  return (
    <>
      <h3>{t("wiki.status.statuses")}</h3>
      <ul className="wiki-status">
        {DocumentedStatuses.map((status) => (
          <li key={status} className="my-box">
            <img src={`assets/status/demo/${status}.gif`} alt={status} />
            <h2>{addIconsToDescription(status)}</h2>
            <p className="description">
              {addIconsToDescription(t(`status_description.${status}`))}
            </p>
          </li>
        ))}
      </ul>

      <h3>{t("wiki.status.board_effects")}</h3>
      <dl className="wiki-board-effects">
        {BoardEffects.map((effect) => (
          <div key={effect} className="my-box">
            <dt>{addIconsToDescription(effect)}</dt>
            <dd>{addIconsToDescription(t(`effect_description.${effect}`))}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}
