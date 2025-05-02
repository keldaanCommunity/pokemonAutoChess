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
  return (
    <div id="bot-manager-panel">
      <h1>Bot Management Panel</h1>
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

  return (
    <main id="bots-list" className="my-container">
      {bots === null ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Author</th>
              <th>Elo</th>
              <th>UID</th>
              <th>Validity</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.filter(b => props.approved === undefined || b.approved === props.approved).map((b) => (
              <tr key={b.id}>
                <td style={{ paddingLeft: 0 }}>
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
