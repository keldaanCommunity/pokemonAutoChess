import { useTranslation } from "react-i18next"
import { PkmFamily } from "../../../../../types/enum/Pokemon"
import { Synergy, SynergyArray } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { cc } from "../../utils/jsx"
import { closeSiblingDetails } from "../../utils/toggle"
import SynergyIcon from "../icons/synergy-icon"
import "./synergy-overlaps.css"

export function SynergyOverlaps(props: {
  type: Synergy
  pokemons: IPokemonData[]
  overlap: Synergy | null
  setOverlap: (type: Synergy | null) => void
}) {
  const { t } = useTranslation()
  const overlapsMap = new Map(
    SynergyArray.filter((type) => type !== props.type).map((type) => [
      type,
      props.pokemons
        .filter((p) => p.types.includes(type))
        .filter(
          (p, i, list) =>
            list.findIndex((q) => PkmFamily[p.name] === PkmFamily[q.name]) === i
        ).length
    ])
  )

  const overlaps = [...overlapsMap.entries()]
    .filter(([type, nb]) => nb > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <details className="synergy-overlaps" onToggle={closeSiblingDetails}>
      <summary style={{ textAlign: "end" }}>{t("overlaps")}</summary>
      <div>
        <ul>
          {overlaps.map(([type, nb]) => {
            return (
              <li
                onClick={() =>
                  props.setOverlap(props.overlap === type ? null : type)
                }
                key={type}
                className={cc({ active: props.overlap === type })}
              >
                <SynergyIcon type={props.type} />
                <SynergyIcon type={type} />
                <span>{nb}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </details>
  )
}
