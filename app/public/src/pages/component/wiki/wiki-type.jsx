import React, { Component } from 'react';
import { PRECOMPUTED_TYPE_POKEMONS_ALL, TYPE_DETAILS, TYPE_TRADUCTION } from '../../../../../models/enum';

class WikiType extends Component {
  render() {
    return <div>
        <div style={{display:'flex'}}>
            <img src={"assets/types/" + this.props.type + ".png"}></img>
            <p>{TYPE_TRADUCTION[this.props.type].eng}</p>
        </div>
        {TYPE_DETAILS[this.props.type].description.eng.map(info=>{
            return <div key={info.title} style={{display:'flex'}}>
                <p>
                    {info.title}: 
                </p>
                <p>
                    {info.text}
                </p>
            </div>
        })}
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {PRECOMPUTED_TYPE_POKEMONS_ALL[this.props.type].map(p=>{
                return <img key={p} src={"assets/avatar/" + p + ".png"}></img>
            })}
        </div>
    </div>;
  }
}
export default WikiType;
