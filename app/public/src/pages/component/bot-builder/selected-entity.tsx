import { useTranslation } from "react-i18next"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { Checkbox } from "../checkbox/checkbox"
import { GamePokemonDetail } from "../game/game-pokemon-detail"

export default function SelectedEntity(props: {
  entity: Item | PkmWithCustom
  onChange: (pkm: PkmWithCustom) => void
}) {
  const { t } = useTranslation()
  if (Object.keys(Item).includes(props.entity as Item)) {
    return (
      <div id="selected-entity" className="my-box">
        <ItemDetailTooltip item={props.entity as Item} />
      </div>
    )
  } else if (
    Object.values(Pkm).includes((props.entity as PkmWithCustom).name)
  ) {
    const pkm = props.entity as PkmWithCustom
    const index = PkmIndex[pkm.name]
    const shiny = pkm.shiny ?? false
    const availableEmotions = getAvailableEmotions(index, shiny)

    return (
      <div id="selected-entity" className="my-box">
        <fieldset>
          <Checkbox
            checked={shiny}
            onToggle={() => {
              props.onChange({
                ...pkm,
                shiny: !shiny
              })
            }}
            label={t("shiny")}
            isDark
          />
          <label>
            {t("emotion_label")}:&nbsp;
            <select
              value={pkm.emotion}
              onChange={(e) => {
                props.onChange({
                  ...pkm,
                  emotion: e.target.value as Emotion
                })
              }}
            >
              {availableEmotions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <GamePokemonDetail
          pokemon={pkm.name}
          emotion={pkm.emotion}
          shiny={shiny}
          origin="planner"
        />
      </div>
    )
  } else {
    return null
  }
}
