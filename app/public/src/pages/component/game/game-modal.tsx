import React, { Dispatch, SetStateAction } from "react"
import Modal from "react-bootstrap/Modal"
import { useTranslation } from "react-i18next"

export default function GameModal(props: {
  modalInfo: string
  modalTitle: string
  modalBoolean: boolean
  hideModal: Dispatch<SetStateAction<boolean>>
  leave: () => void
}) {
  const { t } = useTranslation()
  return (
    <Modal
      show={props.modalBoolean}
      onHide={() => {
        props.hideModal(false)
      }}
    >
      <Modal.Header>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.modalInfo}</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="bubbly blue"
          onClick={() => {
            props.hideModal(false)
          }}
        >
          {t("close")}
        </button>
        <button className="bubbly red" onClick={props.leave}>
          {t("leave_game")}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
