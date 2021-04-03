const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eloBot = new Schema(
    {
      name: {
        type: String
      },
      elo: {
        type: Number
      }
    }
);

const EloBot = mongoose.model('EloBot', eloBot);
module.exports = EloBot;
