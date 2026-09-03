import { useTranslation } from "react-i18next"
import { Language } from "../../../../types/enum/Language"
import { LanguageNames } from "../../../dist/client/locales"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { selectLanguage } from "../../stores/NetworkStore"

export default function LanguageSelect(props: { showLabel?: boolean }) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = useAppSelector(
    (state) => state.network.profile?.language ?? i18n.language
  )

  return (
    <label>
      {props.showLabel && <>{t("options.language")}:&nbsp;</>}
      <select
        className="is-light"
        value={language}
        onChange={(e) => {
          dispatch(selectLanguage(e.target.value as Language))
          i18n.changeLanguage(e.target.value as Language)
        }}
      >
        {Object.keys(Language).map((lng) => (
          <option key={lng} value={lng}>
            {LanguageNames[lng]}
          </option>
        ))}
      </select>
    </label>
  )
}
