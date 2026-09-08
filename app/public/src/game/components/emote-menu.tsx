import { GameObjects } from "phaser"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { getBaseAltForm } from "../../../../config"
import { getUnitScore } from "../../../../core/unit-score"
import { getAvailableEmotions } from "../../../../models/precomputed/precomputed-emotions"
import type { IPlayer } from "../../../../types"
import { AvatarEmotions, Emotion } from "../../../../types/enum/Emotion"
import { GameMode } from "../../../../types/enum/Game"
import { Item, ItemComponents } from "../../../../types/enum/Item"
import {
  type PlayerDialog,
  PlayerDialogs
} from "../../../../types/enum/PlayerDialog"
import { Pkm, PkmIndex } from "../../../../types/enum/Pokemon"
import { logger } from "../../../../utils/logger"
import { schemaValues } from "../../../../utils/schemas"
import PokemonPortrait from "../../pages/component/pokemon-portrait"
import { cc } from "../../pages/utils/jsx"
import store from "../../stores"
import type GameScene from "../scenes/game-scene"
import "./emote-menu.css"

export function EmoteMenuComponent(props: {
  player: IPlayer
  index: string
  shiny: boolean
  sendEmote: (emotion: Emotion | Item | Pkm | PlayerDialog) => void
}) {
  const { t } = useTranslation()
  const gameMode = store.getState().game.gameMode

  const availableEmotions = getAvailableEmotions(props.index, props.shiny)
  const emotions: Emotion[] = AvatarEmotions.filter((emotion) =>
    availableEmotions.includes(emotion)
  )

  const pkmEmotes = schemaValues(props.player.board)
    .filter((p) => !p.final)
    .sort((a, b) => getUnitScore(b) - getUnitScore(a))
    .map((p) => getBaseAltForm(p.name))
    .slice(0, 8)
    .concat(Pkm.DITTO)

  return (
    <div style={{ display: "flex", gap: "1em" }}>
      <div>
        {emotions.length === 0 ? (
          <div>{t("no_emotions_available")}</div>
        ) : (
          <ul className="emotions-emotes">
            {emotions.map((emotion, i) => {
              const unlocked = store
                .getState()
                .game.emotesUnlocked.includes(emotion)
              return (
                <li key={emotion}>
                  <PokemonPortrait
                    portrait={{
                      index: props.index,
                      shiny: props.shiny,
                      emotion
                    }}
                    title={emotion + (!unlocked ? " (locked)" : "")}
                    className={cc({ locked: !unlocked })}
                    onClick={() => unlocked && props.sendEmote(emotion)}
                  />
                  <span className="counter">{i + 1}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {gameMode === GameMode.DOUBLE_UP && (
        <div className="double-up-emotes">
          <ul className="pkm-emotes">
            {pkmEmotes.map((pkm) => (
              <li key={`pkm-emote-${pkm}`}>
                <PokemonPortrait
                  portrait={{
                    index: PkmIndex[pkm],
                    shiny: false,
                    emotion: Emotion.NORMAL
                  }}
                  title={t(`pkm.${pkm}`)}
                  onClick={() => props.sendEmote(pkm)}
                />
              </li>
            ))}
          </ul>

          <ul className="item-emotes">
            {ItemComponents.filter((item) => item !== Item.SILK_SCARF).map(
              (item) => (
                <li
                  key={`item-emote-${item}`}
                  onClick={() => props.sendEmote(item)}
                >
                  <img src={`assets/item/${item}.png`} title={item} />
                </li>
              )
            )}
          </ul>

          <ul className="text-emotes">
            {PlayerDialogs.map((dialog) => (
              <li
                key={`player-dialog-emote-${dialog}`}
                onClick={() => props.sendEmote(dialog)}
              >
                <span>{t(`player_dialog.${dialog}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default class EmoteMenu extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(
    scene: GameScene,
    avatarIndex: string,
    shiny: boolean,
    sendEmote: (emotion: Emotion | Item | Pkm | PlayerDialog) => void
  ) {
    super(scene, -350, -150)
    const state = store.getState()
    const player = state.game.players.find((p) => p.id === scene.uid)
    this.dom = document.createElement("div")
    this.dom.className = "my-container emote-menu"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    if (player) {
      root.render(
        <EmoteMenuComponent
          player={player}
          index={avatarIndex}
          shiny={shiny}
          sendEmote={sendEmote}
        />
      )
    } else {
      logger.error(`Cant' find player bound to EmoteMenu`)
    }
  }
}
