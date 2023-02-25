import PokemonCollectionItem from "./pokemon-collection-item"
import React, { Dispatch, SetStateAction } from "react"
import { ITracker } from "../../../../../types/ITracker"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import "./unown-panel.css";

export default function UnownPanel(props: {
    setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
    metadata: { [key: string]: ITracker },
    filter: string
}) {
    const pokemonCollection = useAppSelector(
        (state) => state.lobby.pokemonCollection
    )
    const secretMessage = `
    Max Groudon with Flame Orb
    Blue Jewel canalize Kyogre
    Delta Sphere over Rayquaza
    `.replace(/^\s+/gm, '').replace(/\s+$/gm, '').split('')

    return (<div>
        <div id="unown-panel">
            {secretMessage.map((char, i) => renderChar(char, i))}
        </div>
        <div className="pokemon-carousel">
            {unownFamily.map(pkm => (<PokemonCollectionItem
                key={PkmIndex[pkm]}
                name={pkm}
                index={PkmIndex[pkm]}
                metadata={props.metadata[PkmIndex[pkm]]}
                config={pokemonCollection.find((p) => p.id == pkm)}
                setPokemon={props.setPokemon}
                filter={props.filter}
            />))}
        </div>
    </div>)
}

function renderChar(c: string, index:number){
    switch(c){
        case '\n': return <br key={"char"+index} />
        case ' ': return <span key={"char"+index} className="char space"></span>
        default: return <span key={"char"+index} className="char" style={{
            backgroundImage: `url(assets/unown/unown-${c.toLowerCase()}.png)`
        }}></span>
    }
}

const unownFamily = [
    Pkm.UNOWN_A,
    Pkm.UNOWN_B,
    Pkm.UNOWN_C,
    Pkm.UNOWN_D,
    Pkm.UNOWN_E,
    Pkm.UNOWN_F,
    Pkm.UNOWN_G,
    Pkm.UNOWN_H,
    Pkm.UNOWN_I,
    Pkm.UNOWN_J,
    Pkm.UNOWN_K,
    Pkm.UNOWN_L,
    Pkm.UNOWN_M,
    Pkm.UNOWN_N,
    Pkm.UNOWN_O,
    Pkm.UNOWN_P,
    Pkm.UNOWN_Q,
    Pkm.UNOWN_R,
    Pkm.UNOWN_S,
    Pkm.UNOWN_T,
    Pkm.UNOWN_U,
    Pkm.UNOWN_V,
    Pkm.UNOWN_W,
    Pkm.UNOWN_X,
    Pkm.UNOWN_Y,
    Pkm.UNOWN_Z
]
