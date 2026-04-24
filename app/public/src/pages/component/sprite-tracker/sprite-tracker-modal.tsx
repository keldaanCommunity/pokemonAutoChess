import { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "../modal/modal"
import SpriteTracker from "./sprite-tracker"

export default function SpriteTrackerModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const { t } = useTranslation()

  return (
    <Modal
      show={props.show}
      onClose={props.handleClose}
      header={t("gadget.sprite_tracker")}
      className="sprite-tracker-modal"
    >
      <SpriteTracker />
    </Modal>
  )
}
