/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema(
    {
      cluster_id: {
        type: String
      },
      rank: {
        type: Number
      },
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      pokemons: Object
    }
);

const metaSchema = new Schema(
    {
      cluster_id: {
        type: String
      },
      count: {
        type: Number
      },
      ratio: {
        type: Number
      },
      winrate: {
        type: Number
      },
      mean_rank: {
        type: Number
      },
      types: Object,
      pokemons: Object,
      teams: [teamSchema]
    }
);


const Meta = mongoose.model('Meta', metaSchema, 'meta');
module.exports = Meta;
