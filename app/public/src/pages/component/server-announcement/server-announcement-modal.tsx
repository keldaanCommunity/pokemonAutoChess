import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { makeServerAnnouncement } from "../../../stores/NetworkStore"
import { Modal } from "../modal/modal";

export function ServerAnnouncementModal({ onClose, show }: { onClose: () => void; show: boolean }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [postContent, setPostContent] = useState("")

  function submitAnnouncement() {
    dispatch(makeServerAnnouncement({ message: postContent }))
    setPostContent("")
  }

  return (
    <Modal onClose={onClose} show={show} className="server-announcement"
      header="Make a Server Announcement"
      body={<textarea
        cols={50}
        rows={5}
        placeholder={t("type_here")}
        autoFocus
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      ></textarea>}
      footer={<button
        onClick={() => {
          submitAnnouncement()
        }}
        className="bubbly green"
      >
        Submit
      </button>}
    />
  )
}
