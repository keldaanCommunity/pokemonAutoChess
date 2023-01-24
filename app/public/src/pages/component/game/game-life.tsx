import React from "react"
export default function GameLife(props: { life: number }) {
  return (
    <div className="nes-container life information">
      <div>
        <span>{props.life}</span>
        <img className="icon" src={"assets/ui/heart.png"} />
      </div>
    </div>
  )
}
