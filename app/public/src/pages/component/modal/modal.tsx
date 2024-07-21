import React from "react"
import ReactDOM from "react-dom"

import "./modal.css"

interface BasicModalProps {
  show: boolean
  handleClose: () => void
  title?: string
  body: JSX.Element
  confirmText?: string
}

export function BasicModal(props: BasicModalProps) {
  const { show, handleClose, title, body, confirmText } = props

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleClose()
    }
  }

  return ReactDOM.createPortal(
    <dialog className="basic-modal" open={show} onKeyDown={handleKeyDown}>
      {title && <header className="basic-modal-header">{title}</header>}
      <div className="basic-modal-body">{body}</div>
      {confirmText && (
        <footer>
          <button className="secondary" onClick={handleClose}>
            Close
          </button>
          <button className="primary" onClick={handleClose}>
            {confirmText}
          </button>
        </footer>
      )}
    </dialog>,
    document.body
  )
}
