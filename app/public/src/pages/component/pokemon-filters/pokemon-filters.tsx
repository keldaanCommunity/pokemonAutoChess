import { useTranslation } from "react-i18next"
import { IPreferencesState, usePreferences } from "../../../preferences"
import { closeSiblingDetails } from "../../utils/toggle"
import { Checkbox } from "../checkbox/checkbox"
import "./pokemon-filters.css"
import { PkmAltForms } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import { NonPkm, Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"

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

export function filterPokemonsAccordingToPreferences(
  pokemons: Pkm[],
  preferences: IPreferencesState,
  includesNonPkm = false
) {
  const data = pokemons.map((p) => getPokemonData(p))
  return pokemons.filter((p) => {
    if (NonPkm.includes(p) && !includesNonPkm) return false
    const { additional, regional, rarity, skill, stars } = getPokemonData(p)
    if (skill === Ability.DEFAULT && !includesNonPkm) return false // pokemons with no ability are not ready
    const special = rarity === Rarity.SPECIAL
    if (!preferences.showAdditionalPool && additional) return false
    if (!preferences.showRegionalPool && regional) return false
    if (!preferences.showSpecialPool && special) return false
    if (!preferences.showRegularPool && !(additional || regional || special))
      return false

    if (PkmAltForms.includes(p) && !preferences.showAltForms) return false
    if (!preferences.showEvolutions) {
      const prevolution = data.find((p2) => {
        return (
          p2.evolution === p ||
          p2.evolutions.includes(p) ||
          (PkmFamily[p2.name] === PkmFamily[p] && p2.stars < stars) // for transformations
        )
      })

      // if show evolutions is unchecked, do not show a pokemon if it has a prevolution and that prevolution is in the same rarity category
      if (prevolution && prevolution.rarity === rarity) return false
    }

    return true
  })
}
