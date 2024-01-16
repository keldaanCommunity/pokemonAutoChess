import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { makeServerAnnouncement } from "../../../stores/NetworkStore"

export function ServerAnnouncementForm() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [postContent, setPostContent] = useState("")

  function submitAnnouncement() {
    dispatch(makeServerAnnouncement({ message: postContent }))
    setPostContent("")
  }

  return (
    <div className="nes-container server-announcement">
      <h1>Make a Server Announcement</h1>
      <div className="content">
        <textarea
          className="nes-textarea"
          cols={50}
          rows={5}
          placeholder={t("type_here")}
          autoFocus
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => {
            submitAnnouncement()
          }}
          className="bubbly blue"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
