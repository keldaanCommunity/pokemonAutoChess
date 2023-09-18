import React, { useState } from "react"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"
import { setBotsList } from "../../../stores/PreparationStore"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { addBot } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import "./bot-select-modal.css"

export function BotSelectModal(props: { bots: IBot[] }) {
  const dispatch = useAppDispatch()

  const [sortBotsOrder, setSortBotsOrder] = useState<boolean>(false)
  const [sortBotsCriteria, setSortBotsCriteria] = useState<string>("name")
  const [queryBot, setQueryBot] = useState<string>("")
  const [botsSelection, setBotsSelection] = useState<Set<IBot>>(new Set())
  const { t } = useTranslation()

  function sortBy(criteria: string) {
    if (sortBotsCriteria === criteria) {
      setSortBotsOrder(!sortBotsOrder)
    } else {
      setSortBotsCriteria(criteria)
      setSortBotsOrder(false)
    }
  }

  const botsListSorted = [...props.bots]
    .filter((b) => b.name.includes(queryBot))
    .sort(
      (a, b) =>
        (a[sortBotsCriteria] < b[sortBotsCriteria] ? -1 : 1) *
        (sortBotsOrder ? -1 : 1)
    )

  return (
    <dialog open id="bot-select-modal" className="nes-container">
      <header>
        <h2>{t("select_bots_for_this_game")}</h2>
        <div className="spacer"></div>
        <input
          type="search"
          className="my-input"
          style={{ maxWidth: "20ch" }}
          placeholder="Search by name"
          value={queryBot}
          onInput={(e) => setQueryBot((e.target as HTMLInputElement).value)}
        />
        <button
          onClick={() => {
            sortBy("elo")
          }}
          className="bubbly pink"
        >
          {t("sort_by_elo")}
        </button>
        <button
          onClick={() => {
            sortBy("name")
          }}
          className="bubbly blue"
        >
          {t("sort_by_name")}
        </button>
      </header>
      <ul>
        {botsListSorted.map((bot) => (
          <li
            className={cc(
              "nes-container",
              "player-box",
              "preparation-menu-user",
              { selected: botsSelection.has(bot) }
            )}
            onClick={() => {
              if (botsSelection.has(bot)) {
                botsSelection.delete(bot)
              } else {
                botsSelection.add(bot)
              }
              setBotsSelection(new Set([...botsSelection]))
            }}
            key={"proposition-bot-" + bot.id}
          >
            <Elo elo={bot.elo} />
            <InlineAvatar avatar={bot.avatar} name={bot.name} />
          </li>
        ))}
      </ul>
      {botsListSorted.length === 0 && <p>No bots found !</p>}
      <footer className="actions">
        <button
          className="bubbly red"
          onClick={() => {
            dispatch(setBotsList(null))
          }}
        >
          {t("cancel")}
        </button>
        <button
          className="bubbly blue"
          onClick={() => {
            botsSelection.forEach((bot) => dispatch(addBot(bot)))
            dispatch(setBotsList(null))
          }}
        >
          {t("add")} {botsSelection.size} {t("bot")}
          {botsSelection.size === 1 ? "" : "s"}
        </button>
      </footer>
    </dialog>
  )
}
