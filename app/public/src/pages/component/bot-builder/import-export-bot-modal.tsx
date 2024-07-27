import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { ModalMode } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { createBot, requestBotData } from "../../../stores/NetworkStore"
import { Modal } from "../modal/modal"

export default function ImportExportBotModal(props: {
  bot: IBot
  hideModal: () => void
  modalMode: ModalMode
  importBot: (text: string) => void
  pasteBinUrl: string
  visible: boolean
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const botData: IBot = useAppSelector((state) => state.lobby.botData)
  useEffect(() => {
    if (botData?.avatar) {
      setJsonError("")
      setTextArea(JSON.stringify(botData))
    }
  }, [botData])

  const botList: {
    name: string
    avatar: string
    id: string
    author: string
  }[] = useAppSelector((state) => state.lobby.botList)
  const url =
    props.pasteBinUrl.length == 0 ? null : (
      <h5>
        {t("url_created")}:<a href={props.pasteBinUrl}>{props.pasteBinUrl}</a>
      </h5>
    )
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

  function exportBot() {
    try {
      const bot = JSON.parse(textArea)
      dispatch(createBot(bot))
    } catch (e) {
      setJsonError(e.message)
    }
  }

  if (props.modalMode == ModalMode.EXPORT) {
    return (
      <Modal
        show={props.visible}
        onClose={props.hideModal}
        className="bot-export-modal"
        header={t("export")}
        body={<>
          <p>{t("export_hint")}</p>
          <textarea
            rows={10}
            defaultValue={textArea}
            onChange={(e) => handleTextAreaChange(e.target.value)}
          ></textarea>
          {jsonError && <p className="error">{jsonError}</p>}
          <p>{t("bot_ready_submission")}</p>
          {url}
        </>}
        footer={<>
          <button className="bubbly green" onClick={exportBot}>
            {t("submit_your_bot")}
          </button>
        </>}
      />
    )
  } else if (props.modalMode == ModalMode.IMPORT) {
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
                  dispatch(requestBotData(e.target.value))
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
  } else {
    return null
  }
}
