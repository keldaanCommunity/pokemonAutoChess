import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { useAppDispatch } from "../../../hooks"
import { addBot } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { EloBadge } from "../profile/elo-badge"
import { InlineAvatar } from "../profile/inline-avatar"
import "./bot-select-modal.css"

export function BotSelectModal(props: { botsSelected: string[], close: () => void }) {
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

  const [botsList, setBotsList] = useState<IBot[] | null>(null)
  useEffect(() => {
    if (botsList === null) {
      fetch("/bots").then((r) => r.json()).then((bots) => {
        setBotsList(bots)
      })
    }
  }, [])

  const botsListSorted = (botsList ?? [])
    .filter((bot) => !props.botsSelected || props.botsSelected.includes(bot.id) === false)
    .filter((bot) => bot.name.toLowerCase().includes(queryBot.toLowerCase()))
    .sort(
      (a, b) =>
        (a[sortBotsCriteria] < b[sortBotsCriteria] ? -1 : 1) *
        (sortBotsOrder ? -1 : 1)
    )

  return (
    <dialog open id="bot-select-modal" className="my-container">
      <header>
        <h2>{t("select_bots_for_this_game")}</h2>
        <div className="spacer"></div>
        <input
          type="search"
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
            className={cc("player", "my-box", "preparation-menu-user", {
              selected: botsSelection.has(bot)
            })}
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
            <EloBadge elo={bot.elo} />
            <InlineAvatar avatar={bot.avatar} name={bot.name} />
          </li>
        ))}
      </ul>
      {botsListSorted.length === 0 && <p>No bots found !</p>}
      <footer className="actions">
        <button
          className="bubbly red"
          onClick={() => { props.close() }}
        >
          {t("cancel")}
        </button>
        <button
          className="bubbly blue"
          onClick={() => {
            botsSelection.forEach((bot) => dispatch(addBot(bot)))
            props.close()
          }}
        >
          {t("add")} {botsSelection.size} {t("bot")}
          {botsSelection.size === 1 ? "" : "s"}
        </button>
      </footer>
    </dialog>
  )
}
