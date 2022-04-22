import React, {useState} from 'react';
import PokemonFactory from '../../../../../models/pokemon-factory';
import {RARITY_COLOR, SPECIAL_SKILL_DESCRIPTION, CDN_PORTRAIT_URL, CDN_URL} from '../../../../../models/enum';
import { Emotion, ICreditNames } from '../../../../../types';
import {ITracker} from '../../../../../public/dist/client/assets/pokemons/ITracker';
import DataFrame from 'dataframe-js';
import Credits from './Credits';

export default function WikiPokemonDetail(props:{pokemon: string, m: ITracker}) {
    const pokemon = PokemonFactory.createPokemonFromName(props.pokemon);
    const [df, setDf] = useState<ICreditNames>();
    const [initialized, setInitialized] = useState<boolean>(false);
    if(!initialized){
        setInitialized(true);
        DataFrame.fromText(`${CDN_URL}/credit_names.txt`,'\t',true)
        .then(df=>{setDf(df.toDict())});
    }

    if(props.m){
        return (            
            <div style={{display: 'flex'}}>
                <div style={{width: '30%'}}>
                    <p>name:{pokemon.name}</p>
                    <p>Portrait Credit:</p>
                    <Credits df={df} primary={props.m.sprite_credit.primary} secondary={props.m.sprite_credit.secondary}/>
                    <p>Sprite Credit:</p>
                    <Credits df={df} primary={props.m.portrait_credit.primary} secondary={props.m.portrait_credit.secondary}/>
                    <p style={{color:RARITY_COLOR[pokemon.rarity]}}>rarity:{pokemon.rarity}</p>
                    <div>
                        types:{pokemon.types.map(type=>{
                            return <img key={'img'+type} src={'assets/types/'+type+'.png'}/>
                        })}
                    </div>
                    <div>evolution: {pokemon.evolution == ''? 'No evolution': <img src={`${CDN_PORTRAIT_URL}${PokemonFactory.createPokemonFromName(pokemon.evolution).index.replace('-','/')}/${Emotion.NORMAL}.png`}/>}</div>
                </div>
                <div style={{width: '30%'}}>
                    <p>Health: {pokemon.hp}</p>
                    <p>Attack: {pokemon.atk}</p>
                    <p>Defense: {pokemon.def}</p>
                    <p>Special Defense: {pokemon.speDef}</p>
                    <p>Range: {pokemon.range}</p>
                    <p>Mana: {pokemon.maxMana}</p>
                </div>
                <div style={{width: '30%'}}>
                    <p>Ability: {SPECIAL_SKILL_DESCRIPTION[pokemon.skill].title.eng}</p>
                    <p>Description:{SPECIAL_SKILL_DESCRIPTION[pokemon.skill].description.eng}</p>
                </div>
            </div>
        )
    }
    else{
        return null;
    }
}