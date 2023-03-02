import React, { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "../../../hooks"
import {
  CommonPoolSection,
  EpicPoolSection,
  LegendaryPoolSection,
  RarePoolSection,
  UncommonPoolSection
} from "./game-pool-section"

import "./game-pool.css"

export function GamePool(props: {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
  if (props.visible) {
    return (
      <div className="nes-container pool">
        <CommonPoolSection />
        <UncommonPoolSection />
        <RarePoolSection />
        <EpicPoolSection />
        <LegendaryPoolSection />
        <div className="pool-button">
          <button
            className="bubbly red"
            onClick={() => {
              props.setVisible(false)
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
  } else {
    return null
  }
}
