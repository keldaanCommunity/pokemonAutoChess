import { t } from "i18next"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ITierList } from "../../../../../types/interfaces/TierList"
import { LocalStoreKeys, localStore } from "../../utils/store"
import { Modal } from "../modal/modal"
import TierListMaker from "./tier-list-maker"

export default function TierListMakerModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {

  return (
    <Modal
      show={props.show}
      onClose={props.handleClose}
      header={t("gadget.tier_list_maker")}
      className="tier-list-maker-modal"
    >
      <TierListMaker />
    </Modal>
  )
}
