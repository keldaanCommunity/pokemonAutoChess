import React, { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { ModalMode } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { createBot, requestBotData } from "../../../stores/NetworkStore"
import { useTranslation } from "react-i18next"

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
        onHide={props.hideModal}
        size="lg"
        id="bot-export-modal"
      >
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("export_hint")}</p>
          <textarea
            rows={10}
            className="nes-textarea"
            defaultValue={JSON.stringify(props.bot, null, 2)}
            onChange={(e) => handleTextAreaChange(e.target.value)}
          ></textarea>
          {jsonError && <p className="error">{jsonError}</p>}
          <p>{t("bot_ready_submission")}</p>
          {url}
        </Modal.Body>
        <Modal.Footer>
          <button className="bubbly red" onClick={props.hideModal}>
            {t("cancel")}
          </button>
          <button className="bubbly green" onClick={exportBot}>
            {t("submit_your_bot")}
          </button>
        </Modal.Footer>
      </Modal>
    )
  } else if (props.modalMode == ModalMode.IMPORT) {
    return (
      <Modal
        show={props.visible}
        onHide={props.hideModal}
        size="lg"
        id="bot-import-modal"
      >
        <Modal.Header>
          <Modal.Title>{t("import")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("get_started_bot")}</p>
          <div className="nes-field is-inline" style={{ marginBottom: "1em" }}>
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
            className="nes-textarea"
          ></textarea>
          {jsonError && <p className="error">{jsonError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <button className="bubbly red" onClick={props.hideModal}>
            {t("cancel")}
          </button>
          <button
            className="bubbly green"
            onClick={() => {
              props.importBot(textArea)
            }}
          >
            {t("import")}
          </button>
        </Modal.Footer>
      </Modal>
    )
  } else {
    return null
  }
}
