import { useTranslation } from "react-i18next"

export default function TermsButton() {
  const { t } = useTranslation()
  return (
    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
      <button type="button" className="bubbly dark">
        <img width={32} height={32} src={`assets/ui/meta.svg`} />
        {t("terms_of_service")}
      </button>
    </a>
  )
}
