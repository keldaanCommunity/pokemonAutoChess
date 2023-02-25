import PokemonCollectionItem from "./pokemon-collection-item"
import React, { Dispatch, SetStateAction } from "react"
import { ITracker } from "../../../../../types/ITracker"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import "./unown-panel.css";

export default function PokemonCarousel(props: {
    setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
    metadata: { [key: string]: ITracker },
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
            {secretMessage.map(char => renderChar(char))}
        </div>
        <PokemonCollectionItem
            name={Pkm.UNOWN}
            index={Pkm.UNOWN}
            metadata={props.metadata[Pkm.UNOWN]}
            config={pokemonCollection.find((p) => p.id == Pkm.UNOWN)}
            setPokemon={props.setPokemon}
            filter="all"
        />
    </div>)
}

function renderChar(c: string){
    switch(c){
        case '\n': return <br />
        case ' ': return <span className="char space"></span>
        default: return <span className="char" style={{
            backgroundImage: `url(assets/unown/unown-${c.toLowerCase()}.png)`
        }}></span>
    }
}