import { useState } from "react"
import { useTranslation } from "react-i18next"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { AvatarEmotions, type Emotion } from "../../../../../types/enum/Emotion"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPokemonCustomFromAvatar } from "../../../../../utils/avatar"
import { useAppSelector } from "../../../hooks"
import { type ChatRoom, sendMessage } from "../../../network"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import ChatHistory from "./chat-history"
import "./chat.css"

const MAX_MESSAGE_LENGTH = 250

export default function Chat(props: { source: ChatRoom; canWrite: boolean }) {
  const { t } = useTranslation()
  const [currentText, setCurrentText] = useState<string>("")
  const [showEmotes, setShowEmotes] = useState<boolean>(false)
  const anonymous = useAppSelector((state) => !state.network.profile)
  const profile = useAppSelector((state) => state.network.profile)
  const messages = useAppSelector((state) =>
    props.source === "lobby" ? state.lobby.messages : state.preparation.messages
  )

  const { emotions, unlockedSet, avatarIndex, shiny } = (() => {
    if (!profile)
      return {
        emotions: [] as Emotion[],
        unlockedSet: new Set<Emotion>(),
        avatarIndex: "",
        shiny: false
      }
    const { name, shiny: isShiny } = getPokemonCustomFromAvatar(profile.avatar)
    const index = PkmIndex[name]
    const allEmotions = getAvailableEmotions(index, isShiny)
    const collectionItem = profile.pokemonCollection.get(index)
    const unlockedEmotions = isShiny
      ? (collectionItem?.shinyEmotions ?? [])
      : (collectionItem?.emotions ?? [])
    const emotions = AvatarEmotions.filter((emotion) =>
      allEmotions.includes(emotion)
    )
    return {
      emotions,
      unlockedSet: new Set(unlockedEmotions),
      avatarIndex: index,
      shiny: isShiny
    }
  })()

  const sendEmote = (emotion: Emotion) => {
    sendMessage(`${emotion}`, props.source)
    setShowEmotes(false)
  }

  return (
    <div className="user-chat">
      <ChatHistory messages={messages} source={props.source} />
      {props.canWrite && (
        <div className="chat-input-area">
          {showEmotes && emotions.length > 0 && (
            <div className="my-container emote-menu">
              <ul
                className="chat-emote-menu"
                onClick={() => setShowEmotes(false)}
              >
                {emotions.map((emotion, i) => {
                  const unlocked = unlockedSet.has(emotion)
                  return (
                    <li key={emotion}>
                      <PokemonPortrait
                        portrait={{ index: avatarIndex, shiny, emotion }}
                        title={emotion + (!unlocked ? " (locked)" : "")}
                        className={cc({ locked: !unlocked })}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (unlocked) sendEmote(emotion)
                        }}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <form
            onSubmit={(e) => {
              if (!anonymous) {
                e.preventDefault()
                sendMessage(currentText, props.source)
                setCurrentText("")
              }
            }}
          >
            <input
              placeholder={
                anonymous ? t("chat_disabled_anonymous") : t("type_here")
              }
              disabled={anonymous}
              type="text"
              title={anonymous ? t("chat_disabled_anonymous") : t("type_here")}
              onChange={(e) => {
                setCurrentText(e.target.value)
              }}
              value={currentText}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <button
              className="bubbly blue"
              disabled={anonymous}
              title={
                anonymous ? t("chat_disabled_anonymous") : t("send_message")
              }
            >
              {t("send")}
            </button>
            {!anonymous && (
              <button
                type="button"
                className="bubbly emote-button"
                title="Emotes"
                onClick={() => setShowEmotes(!showEmotes)}
              >
                😊
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
