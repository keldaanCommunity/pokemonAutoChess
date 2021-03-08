/* eslint-disable max-len */

import {GameObjects} from 'phaser';
import {TYPE_DETAILS, TYPE_TRADUCTION, RARITY_HP_COST, RARITY, PKM} from '../../../../../app/models/enum';
import PokemonFactory from '../../../../../app/models/pokemon-factory';

export default class SynergyDetail extends GameObjects.Container {
  constructor(scene, x, y, type) {
    super(scene, x, y);

    this.fancyTextStyle = {
      fontSize: '35px',
      fontFamily: "'Press Start 2P'",
      color: 'white',
      align: 'left'
    };

    this.titleTextStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: '#06ec88',
      align: 'left'
    };

    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'left',
      wordWrap: {width: 610, useAdvancedWrap: true}
    };

    this.pokemons = new Map();

    this.add(new GameObjects.Image(scene, 0, 0, 'detail'));
    this.add(new GameObjects.Text(scene, -130, -165, TYPE_TRADUCTION[type][window.langage], this.fancyTextStyle));
    this.add(new GameObjects.Image(scene, -170, -150, 'types', type));

    for (let i = 0; i < TYPE_DETAILS[type].description[window.langage].length; i++) {
      const el = TYPE_DETAILS[type].description[window.langage][i];
      this.add(new GameObjects.Text(scene,-345, i * 70 - 130, el.title, this.titleTextStyle));
      this.add(new GameObjects.Text(scene,-345, i * 70 - 105, el.text, this.textStyle));
    }

    let pokemonCandidates = [];
    let mythicalPokemonCandidates = [];
    Object.values(PKM).forEach(pkm => {
      
      let pokemon = PokemonFactory.createPokemonFromName(pkm);
      let family = PokemonFactory.getPokemonFamily(pkm);
      if(pokemon.rarity != RARITY.NEUTRAL){
        if(pokemon.types.includes(type)){

          if(pokemon.rarity == RARITY.MYTHICAL){
            mythicalPokemonCandidates.push(pokemon);
          }
          else{
            let included = false;
            pokemonCandidates.forEach(candidate =>{
              if(PokemonFactory.getPokemonFamily(candidate.name) == family){
                included = true;
              }
            });
            if(!included){
              pokemonCandidates.push(pokemon);
            }
          }
        }
      }
    });
    pokemonCandidates.sort(function(a,b){
      return RARITY_HP_COST[a.rarity] - RARITY_HP_COST[b.rarity];
    });

    for (let i = 0; i < pokemonCandidates.length; i++) {
      this.add(new GameObjects.Image(scene, -330 + 40 * i, 110, pokemonCandidates[i].sheet, `${pokemonCandidates[i].index}/portrait`));
      let marker = new GameObjects.Rectangle(scene, -330 + 40 * i, 110, 39, 39, 0xffffff, 0);
      this.pokemons.set(pokemonCandidates[i].name, marker);
      this.add(marker); 
    }

    for (let i = 0; i < mythicalPokemonCandidates.length; i++) {
      this.add(new GameObjects.Image(scene, -330 + 40 * i, 150, mythicalPokemonCandidates[i].sheet, `${mythicalPokemonCandidates[i].index}/portrait`));
      let marker = new GameObjects.Rectangle(scene, -330 + 40 * i, 150, 39, 39, 0xffffff, 0);
      this.pokemons.set(mythicalPokemonCandidates[i].name, marker);
      this.add(marker); 
    }

    this.setScale(0, 0);
    scene.add.existing(this);
  }

  enablePokemon(pkm){
    let pokemon = PokemonFactory.getPokemonFamily(pkm);
    let marker = this.pokemons.get(pokemon);
    if(marker){
      marker.setStrokeStyle(3, 0x00ff00, 1);
    }
  }

  disablePokemon(pkm){
    let pokemon = PokemonFactory.getPokemonFamily(pkm);
    let marker = this.pokemons.get(pokemon);
    if(marker){
      marker.setStrokeStyle(0, 0x000000, 0);
    }
  }
}
