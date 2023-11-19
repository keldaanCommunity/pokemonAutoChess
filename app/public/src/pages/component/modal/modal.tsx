import React from "react"
import { Button, Modal, ModalProps } from "react-bootstrap"

import "./modal.css"

interface BasicModalProps extends ModalProps {
  title?: string
  body: JSX.Element
  confirmText?: string
  centered?: boolean
}

export function BasicModal(props: BasicModalProps) {
  const { show, handleClose, title, body, confirmText, centered = true } = props

  return (
    <Modal
      contentClassName="hide-bg"
      dialogClassName="basic-modal"
      show={show}
      onHide={handleClose}
      centered={centered}
    >
      {title && (
        <Modal.Header closeButton className="basic-modal-header">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="basic-modal-body">{body}</Modal.Body>
      {confirmText && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {confirmText}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}
