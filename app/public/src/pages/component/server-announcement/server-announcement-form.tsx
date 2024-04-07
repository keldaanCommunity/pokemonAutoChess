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
    <div className="my-container server-announcement">
      <h1>Make a Server Announcement</h1>
      <div className="content">
        <textarea
          cols={50}
          rows={5}
          placeholder={t("type_here")}
          autoFocus
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <div
          className="actions"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <button
            onClick={() => {
              submitAnnouncement()
            }}
            className="bubbly green"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
