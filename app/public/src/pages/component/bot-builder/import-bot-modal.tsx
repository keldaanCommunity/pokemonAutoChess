import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { Modal } from "../modal/modal"

export default function ImportBotModal(props: {
  bot: IBot
  hideModal: () => void
  importBot: (text: string) => void
  visible: boolean
}) {
  const { t } = useTranslation()

  const [botList, setBotList] = useState<IBot[]>([])
  useEffect(() => {
    fetch("/bots").then((res) => res.json()).then((data) => {
      setBotList(data)
    })
  }, [])


  const [textArea, setTextArea] = useState<string>("")
  const [jsonError, setJsonError] = useState<string>("")

  useEffect(() => {
    setTextArea(JSON.stringify(props.bot, null, 2))
  }, [props.bot])

  function handleTextAreaChange(newValue) {
    setJsonError("")
    try {
      setTextArea(JSON.stringify(JSON.parse(newValue), null, 2))
    } catch (e) {
      setJsonError(e.message)
    }
  }

  return (
    <Modal
      show={props.visible}
      onClose={props.hideModal}
      className="bot-import-modal"
      header={t("import")}
      body={<>
        <p>{t("get_started_bot")}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginBottom: "0.5em" }}>
          <label htmlFor="bot_select">{t("existing_bot")}</label>
          <select
            id="bot_select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value.length != 0) {
                fetch(`/bots/${e.target.value}`).then(r => r.json()).then(bot => {
                  setTextArea(JSON.stringify(bot, null, 2))
                })
              }
            }}
          >
            <option value="" hidden>
              {t("select")}
            </option>
            {botList.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name} {t("by")} {bot.author}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={10}
          value={textArea}
          onChange={(e) => handleTextAreaChange(e.target.value)}
        ></textarea>
        {jsonError && <p className="error">{jsonError}</p>}
      </>}
      footer={<>
        <button
          className="bubbly green"
          onClick={() => {
            props.importBot(textArea)
          }}
        >
          {t("import")}
        </button>
      </>}
    />
  )
}
