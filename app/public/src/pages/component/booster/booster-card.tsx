import React from "react"
import PokemonFactory from "../../../../../models/pokemon-factory";
import { RarityColor } from "../../../../../types/Config";
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon";
import { getPortraitSrc } from "../../../utils";
import { cc } from "../../utils/jsx"
import "./booster-card.css";

export function BoosterCard(props: {
    pkm: string,
    shards: number
}){
    const pkm: Pkm = (Object.keys(PkmIndex).find(p => PkmIndex[p] === props.pkm) ?? Pkm.DITTO) as Pkm;
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    const style = { "--rarity-color": RarityColor[pokemon.rarity] } as React.CSSProperties;

    return (
        <div className={cc("booster-card", "rarity-"+pokemon.rarity.toLowerCase())}
             style={style}
             onClick={e => e.currentTarget.classList.add('flipped')}>
            <div className="back">
                <img src="/assets/ui/pokecard.png" />
            </div>
            <div className="front">
                <img src={getPortraitSrc(props.pkm)}></img>
                <p className="name">{pokemon.name}</p>
                <p>{props.shards} shards</p>
            </div>
        </div>
    )
}