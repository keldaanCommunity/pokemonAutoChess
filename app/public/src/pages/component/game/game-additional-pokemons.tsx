import React from "react"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import {useAppSelector} from "../../../hooks"
import CSS from 'csstype'
import { getPortraitSrc } from "../../../utils"

const style: CSS.Properties = {
    display: "flex",
    justifyContent: "space-between",
    flexFlow: "column wrap",
    overflow: "hidden",
    padding: "0px",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(97, 115, 138)",
    width:"178px"
}


export function GameAdditionalPokemons(){
    const additionalPokemons = useAppSelector(state=>state.game.additionalPokemons)
    if(!additionalPokemons || additionalPokemons.length === 0){
        return null
    }
    else{
        return <div className="nes-container" style={style}>
            {additionalPokemons.map(p=><img style={{width:'40px', height:'40px'}} key={p} src={getPortraitSrc(PkmIndex[p])}/>)}
        </div>
    }
}