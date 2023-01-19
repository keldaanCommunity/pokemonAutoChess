import React, { useState } from "react"
import "./game-options-icon.css";
import GameOptionsModal from "./game-options-modal";

export default function GameOptionsIcon(props: { leave: () => void }){
    let [isOpen, setOpen] = useState<boolean>(false)
    return <>
    <div id="game-options-icon" className="nes-container clickable" onClick={() => { setOpen(true) }}>
        <img src="/assets/ui/options.svg" />
    </div>
    <GameOptionsModal show={isOpen} hideModal={() => { setOpen(false) }} leave={props.leave} />
    </>
}