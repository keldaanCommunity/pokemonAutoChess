import React, { useState } from "react"
import CSS from "csstype"
import ReactCardFlip from "react-card-flip"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { openBooster } from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"

const buttonStyle: CSS.Properties = {
  marginLeft: "10px",
  marginTop: "10px",
  marginRight: "10px"
}

export default function Booster(props: { toggle: () => void }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)
  const numberOfBooster = user ? user.booster : 0
  const boosterContent = useAppSelector((state) => state.lobby.boosterContent)
  const [flipArray, setFlipArray] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false
  ])
  return (
    <div>
      <button
        style={buttonStyle}
        onClick={() => {
          props.toggle()
        }}
        className="bubbly-primary"
      >
        Lobby
      </button>
      <div
        className="nes-container"
        style={{
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          flexFlow: "column",
          alignItems: "center",
          height: "90vh"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "30%"
          }}
        >
          <h1>{numberOfBooster}</h1>
          <i className="nes-pokeball"></i>
          <button
            onClick={() => {
              setFlipArray([false, false, false, false, false])
              dispatch(openBooster())
            }}
            className={
              numberOfBooster > 0 ? "bubbly-primary" : "bubbly-disabled"
            }
          >
            Open Booster !
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
            flexGrow: "8",
            alignItems: "center"
          }}
        >
          {boosterContent.map((i, index) => {
            return (
              <ReactCardFlip
                key={index}
                isFlipped={flipArray[index]}
                flipDirection="horizontal"
              >
                <div
                  className="nes-container"
                  onClick={() => {
                    handleClick(flipArray, setFlipArray, index)
                  }}
                  style={{
                    width: "188px",
                    height: "188px",
                    padding: "10px",
                    backgroundColor: "rgba(255,255,255,1)",
                    cursor: "var(--cursor-hover)"
                  }}
                >
                  <h1
                    style={{
                      fontSize: "100px",
                      position: "absolute",
                      left: "40px",
                      top: "30px"
                    }}
                  >
                    ?
                  </h1>
                </div>

                <div
                  className="nes-container"
                  onClick={() => {
                    handleClick(flipArray, setFlipArray, index)
                  }}
                  style={{
                    width: "188px",
                    height: "188px",
                    padding: "10px",
                    backgroundColor: "rgba(255,255,255,1)",
                    cursor: "var(--cursor-hover)"
                  }}
                >
                  <h2
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      backgroundColor: "#fff"
                    }}
                  >
                    40x
                  </h2>
                  <img
                    style={{
                      width: "160px",
                      height: "160px",
                      imageRendering: "pixelated"
                    }}
                    src={getPortraitSrc(i)}
                  />
                </div>
              </ReactCardFlip>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function handleClick(
  flipArray: boolean[],
  setFlipArray: React.Dispatch<React.SetStateAction<boolean[]>>,
  index: number
) {
  const actualFlipArray = [...flipArray]
  actualFlipArray[index] = !actualFlipArray[index]
  setFlipArray(actualFlipArray)
}
