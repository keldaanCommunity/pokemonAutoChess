import { useTranslation } from "react-i18next"
import { usePreferences } from "../../../preferences"
import { closeSiblingDetails } from "../../utils/toggle"
import { Checkbox } from "../checkbox/checkbox"
import "./pokemon-filters.css"

export function PokemonFilters() {
  const { t } = useTranslation()
  const [preferences, setPreferences] = usePreferences()
  const pools: (keyof typeof preferences)[] = [
    "showRegularPool",
    "showAdditionalPool",
    "showRegionalPool",
    "showSpecialPool"
  ]
  const isTheOnlyPoolSelected = (pool: keyof typeof preferences) => {
    const otherPools = pools.filter((p) => p !== pool)
    return (
      preferences[pool] === true &&
      otherPools.every((p) => preferences[p] === false)
    )
  }

  return (
    <details className="pokemon-filters" onToggle={closeSiblingDetails}>
      <summary>{t("filters")}</summary>
      <div>
        {pools.map((pool) => (
          <Checkbox
            key={pool}
            checked={preferences[pool] as boolean}
            disabled={isTheOnlyPoolSelected(pool)}
            onToggle={(checked) => {
              setPreferences({ [pool]: checked })
            }}
            label={t(
              `pool.${pool.replace("show", "").replace("Pool", "").toLowerCase()}`
            )}
            isDark
          />
        ))}
        <Checkbox
          checked={preferences.showEvolutions}
          onToggle={(checked) => {
            setPreferences({ showEvolutions: checked })
          }}
          label={t("show_evolutions")}
          isDark
        />
        <Checkbox
          checked={preferences.showAltForms}
          onToggle={(checked) => {
            setPreferences({ showAltForms: checked })
          }}
          label={t("show_alt_forms")}
          isDark
        />
      </div>
    </details>
  )
}
