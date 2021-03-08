/* eslint-disable max-len */

import {GameObjects} from 'phaser';
import {TYPE_DETAILS, TYPE_TRADUCTION} from '../../../../../app/models/enum';
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
    this.add(new GameObjects.Text(scene, -130, -145, TYPE_TRADUCTION[type][window.langage], this.fancyTextStyle));
    this.add(new GameObjects.Image(scene, -170, -130, 'types', type));

    for (let i = 0; i < TYPE_DETAILS[type].description[window.langage].length; i++) {
      const el = TYPE_DETAILS[type].description[window.langage][i];
      this.add(new GameObjects.Text(scene,-345, i * 70 - 110, el.title, this.titleTextStyle));
      this.add(new GameObjects.Text(scene,-345, i * 70 - 85, el.text, this.textStyle));
    }

    for (let i = 0; i < TYPE_DETAILS[type].pokemons.length; i++) {
      let pokemon = PokemonFactory.createPokemonFromName(TYPE_DETAILS[type].pokemons[i]);
      this.add(new GameObjects.Image(scene, -330 + 40 * i, 140, pokemon.sheet, `${pokemon.index}/portrait`));
      let marker = new GameObjects.Rectangle(scene, -330 + 40 * i, 140, 39, 39, 0xffffff, 0);
      this.pokemons.set(pokemon.name, marker);
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
