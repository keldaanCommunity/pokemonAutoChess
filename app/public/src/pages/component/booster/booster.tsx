import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setBoosterContent } from "../../../stores/LobbyStore"
import { openBooster } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { BoosterCard } from "./booster-card"
import "./booster.css"

export default function Booster(props: { toggle: () => void }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)
  const numberOfBooster = user ? user.booster : 0
  const boosterContent = useAppSelector((state) => state.lobby.boosterContent)

  return (
    <div id="boosters-page">
      <button
        onClick={() => { 
          dispatch(setBoosterContent([]))
          props.toggle() 
        }}
        className="bubbly blue"
      >
        Back to Lobby
      </button>
      <div className="nes-container">
        <p className="help">{numberOfBooster === 0 
          ? "Play more games to level up and earn new boosters." 
          : "Open boosters to unlock new avatars and complete your collection !"
          }</p>
        <div className="actions">
          <p>
            <span>{numberOfBooster}</span>
            <img src="/assets/ui/booster.png" alt="booster" />
          </p>
          <button
            onClick={() => {
              if(numberOfBooster > 0){
                dispatch(setBoosterContent([]))
                dispatch(openBooster())
              }
            }}
            className={cc("bubbly", { blue: numberOfBooster > 0 })}
            disabled={numberOfBooster <= 0}
          >
            Open a Booster
          </button>
        </div>
        <div className="boosters-content">
          {boosterContent.map((pkm,i) => (
            <BoosterCard key={"booster"+i} pkm={pkm} shards={50} />
          ))}
        </div>
      </div>
    </div>
  )
}