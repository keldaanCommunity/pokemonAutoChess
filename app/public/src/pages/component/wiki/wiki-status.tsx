import { useTranslation } from "react-i18next"
import { DocumentedStatuses } from "../../../../../types/enum/Status"
import { addIconsToDescription } from "../../utils/descriptions"

export default function WikiStatus() {
  const { t } = useTranslation()

  return (
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
  )
}
