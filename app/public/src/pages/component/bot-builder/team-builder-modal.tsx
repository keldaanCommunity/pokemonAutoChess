import { t } from "i18next"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import { localStore, LocalStoreKeys } from "../../utils/store"
import { BasicModal } from "../modal/modal"
import TeamBuilder from "./team-builder"

export default function TeamBuilderModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {

const [board, updateBoard] = useState<IDetailledPokemon[]>(localStore.get(LocalStoreKeys.TEAM_PLANNER))
useEffect(() => {
    localStore.set(LocalStoreKeys.TEAM_PLANNER, board)
}, [board])

  return (
    <BasicModal
      show={props.show}
      handleClose={props.handleClose}
      title={t("team_builder")}
      body={<TeamBuilder board={board} updateBoard={updateBoard} />}
    />
  )
}
