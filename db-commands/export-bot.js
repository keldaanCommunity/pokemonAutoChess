require('dotenv').config();
const Mongoose = require('mongoose');
const BotV2 = require('../app/models/mongo-models/bot-v2');
const fs = require('fs');

try {
  console.log(`connect to db ...`);
  Mongoose.connect(process.env.MONGO_URI, (err) => {
    BotV2.find({},(err, docs)=>{
        if (err) {
            console.log(err);
          } else {
            const file = fs.createWriteStream(`db-commands/export.json`);
            file.on('error', function(err) {
              console.log(err);
            });
            file.write(JSON.stringify(docs));
            file.end();
          }
    });
  });
} catch (e) {
  console.error('Parsing error:', e);
}
