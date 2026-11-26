import { useTranslation } from "react-i18next"
import { addIconsToDescription } from "../../utils/descriptions"
import { Atlas } from "../atlas/atlas"

export default function WikiAtlas() {
  const { t } = useTranslation()
  return (
    <div id="wiki-atlas">
      <div className="my-box" style={{ marginBottom: "0.5em" }}>
        <p>{addIconsToDescription(t("wiki.atlas.atlas_hint"))}</p>
      </div>
      <Atlas origin="wiki" />
    </div>
  )
}
