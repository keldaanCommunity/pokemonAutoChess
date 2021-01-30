const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema(
    {
      payload: {
        type: String
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      time: {
        type: Number
      }
    }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
