import React from 'react'
import { useAppSelector } from '../../../hooks'
import GamePokemonPortrait from './game-pokemon-portrait'
import CSS from 'csstype'
import PokemonFactory from '../../../../../models/pokemon-factory'
import { Pkm } from '../../../../../types/enum/Pokemon'

const style: CSS.Properties = {
    display: 'flex',
    listStyleType: 'none',
    padding: '0px',
    margin:'5px',
    width:'50vw'
}

export default function GameStore() {
    const shop = useAppSelector(state=>state.game.shop)
    const pokemonCollection = useAppSelector(state=>state.game.pokemonCollection)
    console.log(shop)
    return <ul style={style}>
    {shop.map((pokemon,index)=>{
        if(pokemon != Pkm.DEFAULT){
            const p = PokemonFactory.createPokemonFromName(pokemon)
            return <GamePokemonPortrait key={index} index={index} pokemon={p} pokemonConfig={pokemonCollection.get(p.index)}/>
        }
        else{
            return <GamePokemonPortrait key={index} index={index} pokemon={undefined} pokemonConfig={undefined}/>
        }
    })}
</ul>
}