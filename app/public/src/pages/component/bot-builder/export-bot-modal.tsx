import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { useAppSelector } from "../../../hooks"
import { Modal } from "../modal/modal"

export default function ExportBotModal(props: {
  bot: IBot
  hideModal: () => void
  visible: boolean
}) {
  const { t } = useTranslation()
  const displayName = useAppSelector((state) => state.network.profile?.displayName)
  const [pastebinUrl, setPastebinUrl] = useState<string>("")

  const url =
    pastebinUrl.length == 0 ? null : (
      <p>
        {t("url_created")}: <a href={pastebinUrl}>{pastebinUrl}</a>
      </p>
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

  async function exportBot() {
    try {
      const bot = JSON.parse(textArea)
      const pastebinUrl = await fetch("/bots", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          bot,
          author: displayName ?? "Anonymous"
        })
      }).then(r => r.text())
      if (!pastebinUrl) throw new Error("Error, no pastebin url")
      setPastebinUrl(pastebinUrl)
      //props.hideModal()
    } catch (error) {
      setJsonError(error.message)
    }
  }

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
          value={textArea}
          onChange={(e) => handleTextAreaChange(e.target.value)}
        ></textarea>
        {jsonError && <p className="error">{jsonError}</p>}
        <p>{t("bot_ready_submission")}</p>
      </>}
      footer={<>
        <button className="bubbly green" onClick={exportBot}>
          {t("submit_your_bot")}
        </button>
        {url}
      </>}
    />
  )
}
