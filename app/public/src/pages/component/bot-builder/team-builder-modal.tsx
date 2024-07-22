import { t } from "i18next"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import { LocalStoreKeys, localStore } from "../../utils/store"
import { Modal } from "../modal/modal"
import TeamBuilder from "./team-builder"

export default function TeamBuilderModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const [board, updateBoard] = useState<IDetailledPokemon[]>(
    localStore.get(LocalStoreKeys.TEAM_PLANNER)
  )
  useEffect(() => {
    localStore.set(LocalStoreKeys.TEAM_PLANNER, board)
  }, [board])

  return (
    <Modal
      show={props.show}
      onClose={props.handleClose}
      header={t("team_builder")}>
      <TeamBuilder board={board} updateBoard={updateBoard} />
    </Modal>
  )
}
