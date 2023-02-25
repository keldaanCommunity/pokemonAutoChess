import PokemonCollectionItem from "./pokemon-collection-item"
import React, { Dispatch, SetStateAction } from "react"
import { ITracker } from "../../../../../types/ITracker"
import { Pkm, PkmIndex, PkmFamily } from "../../../../../types/enum/Pokemon"
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
    To unleash ancient power ?
    Max Groudon with Flame Orb
    Delta Sphere over Rayquaza
    And blue Jewel for Kyogre!
    `.replace(/^\s+/gm, '').replace(/\s+$/gm, '').split('')

    return (<div>
        <div id="unown-panel">
            {secretMessage.map((char, i) => renderChar(char, i))}
        </div>
        <div className="pokemon-carousel">
            {unownFamily.map(pkm => {
                const pathIndex = PkmIndex[pkm].split("-")
                let metadata: ITracker | undefined = undefined
                if (pathIndex.length == 1) {
                    metadata = props.metadata[PkmIndex[pkm]]
                } else if (pathIndex.length == 2) {
                    metadata = props.metadata[pathIndex[0]].subgroups[pathIndex[1]]
                }
                if (metadata) {
                    return (<PokemonCollectionItem
                        key={PkmIndex[pkm]}
                        name={pkm}
                        index={PkmIndex[pkm]}
                        metadata={metadata}
                        config={pokemonCollection.find((p) => p.id === PkmIndex[pkm])}
                        setPokemon={props.setPokemon}
                        filter={props.filter}
                    />)
                } else {
                    return null
                }
            })}
        </div>
    </div>)
}

function renderChar(c: string, index: number) {
    switch (c) {
        case '\n': return <br key={"char" + index} />
        case ' ': return <span key={"char" + index} className="char space"></span>
        case '!': return <span key={"char" + index} className="char" style={{
            backgroundImage: `url(assets/unown/unown-em.png)`
        }}></span>
        case '?': return <span key={"char" + index} className="char" style={{
            backgroundImage: `url(assets/unown/unown-qm.png)`
        }}></span>
        default: return <span key={"char" + index} className="char" style={{
            backgroundImage: `url(assets/unown/unown-${c.toLowerCase()}.png)`
        }}></span>
    }
}

const unownFamily = Object.keys(PkmFamily).filter(pkm => PkmFamily[pkm] === Pkm.UNOWN_A)
