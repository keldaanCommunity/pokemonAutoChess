import { useTranslation } from "react-i18next"

export default function PolicyButton() {
  const { t } = useTranslation()
  return (
    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
      <button type="button" className="bubbly dark">
        <img width={32} height={32} src={`assets/ui/meta.svg`} />
        {t("policy")}
      </button>
    </a>
  )
}
