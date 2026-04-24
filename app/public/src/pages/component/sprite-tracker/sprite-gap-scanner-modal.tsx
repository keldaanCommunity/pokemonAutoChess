import { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "../modal/modal"
import SpriteGapScanner from "./sprite-gap-scanner"

export default function SpriteGapScannerModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const { t } = useTranslation()

  return (
    <Modal
      show={props.show}
      onClose={props.handleClose}
      header={t("gadget.sprite_gap_scanner")}
      className="sprite-gap-scanner-modal"
    >
      <SpriteGapScanner />
    </Modal>
  )
}
