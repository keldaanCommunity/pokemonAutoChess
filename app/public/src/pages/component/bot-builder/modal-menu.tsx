import React, { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { ModalMode } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { requestBotData } from "../../../stores/NetworkStore"
import { useTranslation } from "react-i18next"

export default function ModalMenu(props: {
  bot: IBot
  hideModal: () => void
  modalMode: ModalMode
  importBot: (text: string) => void
  pasteBinUrl: string
  createBot: () => void
  visible: boolean
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const botData: IBot = useAppSelector((state) => state.lobby.botData)
  useEffect(() => {
    if (botData?.avatar) {
      handleTextAreaChange(JSON.stringify(botData))
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
  const [textArea, handleTextAreaChange] = useState<string>("")
  if (props.modalMode == ModalMode.EXPORT) {
    return (
      <Modal show={props.visible} onHide={props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("export_hint")}</p>
          <textarea
            rows={10}
            className="nes-textarea"
            defaultValue={JSON.stringify(props.bot, null, 2)}
          ></textarea>
          <p>{t("bot_ready_submission")}</p>
          {url}
        </Modal.Body>
        <Modal.Footer>
          <button className="bubbly red" onClick={props.hideModal}>
            {t("cancel")}
          </button>
          <button
            className="bubbly green"
            onClick={() => {
              props.createBot()
            }}
          >
            {t("submit_your_bot")}
          </button>
        </Modal.Footer>
      </Modal>
    )
  } else if (props.modalMode == ModalMode.IMPORT) {
    return (
      <Modal show={props.visible} onHide={props.hideModal} size="lg">
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
            onChange={(e) => {
              handleTextAreaChange(e.target.value)
            }}
            className="nes-textarea"
          ></textarea>
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
