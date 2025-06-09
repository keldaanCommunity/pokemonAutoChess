import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { IBotLight } from "../../../../../models/mongo-models/bot-v2"
import PokemonPortrait from "../pokemon-portrait"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "../../utils/utils"
import { logIn } from "../../../stores/NetworkStore"
import { useAppDispatch } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./bot-manager-panel.css"

export function BotManagerPanel() {
  const [filterApproved, setFilterApproved] = useState<boolean | undefined>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div id="bot-manager-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Bot Management Panel</h1>
        <button onClick={() => navigate("/lobby")} className="bubbly blue">
          {t("back_to_lobby")}
        </button>
      </div>

      <div className="controls">
        <button className="bubbly blue" onClick={() => setFilterApproved(undefined)}>
          All Bots
        </button>
        <button className="bubbly green" onClick={() => setFilterApproved(true)}>
          Approved Bots
        </button>
        <button
          className="bubbly orange" onClick={() => setFilterApproved(false)}
        >
          Bots pending approval
        </button>
      </div>
      <BotsList approved={filterApproved} />
    </div>
  )
}

function BotsList(props: { approved?: boolean }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [bots, setBots] = useState<IBotLight[] | null>(null)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG)
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(logIn(user))
      }
    })

    fetch(`/bots?t=${Date.now()}`).then((res) => res.json()).then((data) => {
      setBots(data)
    })
  }, [])

  async function deleteBot(bot: IBotLight) {
    if (!confirm(`Are you sure you want to delete bot ${bot.name} of ${bot.author} ?`)) return
    const token = await firebase.auth().currentUser?.getIdToken()
    const res = await fetch(`/bots/${bot.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.ok) {
      setBots(bots => bots?.filter(b => b.id !== bot.id) ?? [])
    } else alert(res.statusText)
  }

  async function approveBot(botId: string, approved: boolean) {
    const token = await firebase.auth().currentUser?.getIdToken()
    const res = await fetch(`/bots/${botId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ approved })
    })
    if (res.ok) {
      setBots(bots => bots?.map(bot => bot.id === botId ? { ...bot, approved } : bot) ?? [])
    } else alert(res.statusText)
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  function getSortedBots(bots: IBotLight[]) {
    if (!sortColumn) return bots
    const sorted = [...bots].sort((a, b) => {
      let aValue = a[sortColumn as keyof IBotLight]
      let bValue = b[sortColumn as keyof IBotLight]
      // Special handling for name (translated), elo (number), and avatar (string)
      if (sortColumn === "name") {
        aValue = t(`pkm.${a.name}`)
        bValue = t(`pkm.${b.name}`)
      }
      if (sortColumn === "elo") {
        aValue = Number(a.elo)
        bValue = Number(b.elo)
      }
      if (aValue === undefined || bValue === undefined) return 0
      if (typeof aValue === "string" && typeof bValue === "string") {
        const cmp = aValue.localeCompare(bValue)
        return sortDirection === "asc" ? cmp : -cmp
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }

  return (
    <main id="bots-list" className="my-container">
      {bots === null ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("avatar")} style={{ cursor: "pointer" }}>
                Avatar {sortColumn === "avatar" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Name {sortColumn === "name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("author")} style={{ cursor: "pointer" }}>
                Author {sortColumn === "author" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("elo")} style={{ cursor: "pointer" }}>
                Elo {sortColumn === "elo" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                UID {sortColumn === "id" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("valid")} style={{ cursor: "pointer" }}>
                Validity {sortColumn === "valid" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("approved")} style={{ cursor: "pointer" }}>
                Approved {sortColumn === "approved" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedBots(
              bots.filter(b => props.approved === undefined || b.approved === props.approved)
            ).map((b) => (
              <tr key={b.id}>
                <td>
                  <PokemonPortrait avatar={b.avatar} />
                </td>
                <td>{t(`pkm.${b.name}`)}</td>
                <td>{b.author}</td>
                <td>{b.elo}</td>
                <td style={{ color: "#999", fontSize: "80%" }}>{b.id}</td>
                <td>
                  {b.valid
                    ? <span style={{ color: "lime" }}>{t("valid")}</span>
                    : <span style={{ color: "red" }}>{t("invalid")}</span>
                  }
                </td>
                <td>{b.approved
                  ? <span style={{ color: "lime" }}>{t("yes")}</span>
                  : <span style={{ color: "red" }}>{t("no")}</span>
                }</td>
                <td>
                  <button
                    onClick={() => navigate(`/bot-builder?bot=${b.id}`)}
                    className="bubbly blue"
                    style={{ fontSize: "80%" }}
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => approveBot(b.id, !b.approved)}
                    className={cc("bubbly", b.approved ? 'orange' : 'green')}
                    style={{ fontSize: "80%" }}
                  >
                    {b.approved ? t("disapprove") : t("approve")}
                  </button>
                  <button
                    onClick={() => deleteBot(b)}
                    className="bubbly red"
                    style={{ fontSize: "80%" }}
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
