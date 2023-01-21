import React from "react"
export default function GameLife(props: { life: number }) {
  return (
    <div
      className="nes-container"
      style={{
        backgroundColor: "#54596b",
        padding: ".001px",
        display: "flex",
        width: "5vw",
        height: "100%",
        backgroundImage: 'url("assets/ui/heart-bg.png")',
        backgroundSize: "cover"
      }}
    >
      <div
        style={{
          background: "#54596b",
          display: "flex",
          alignItems: "center",
          borderRadius: "7px",
          height: "100%",
          padding: "0 0.5em"
        }}
      >
        <span style={{verticalAlign: "middle"}}>{props.life}</span>
        <img
          style={{ width: "1vw", height: "1vw" }}
          src={"assets/ui/heart.png"}
        />
      </div>
    </div>
  )
}
