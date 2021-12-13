require('dotenv').config();
const Mongoose = require('mongoose');
const Bot = require('../app/models/mongo-models/bot');
const args = process.argv.slice(2);
const PasteBinAPI = require('pastebin-ts');

const pastebin = new PasteBinAPI({
  'api_dev_key' : process.env.PASTEBIN_API_DEV_KEY,
  'api_user_name' : process.env.PASTEBIN_API_USERNAME,
  'api_user_password' : process.env.PASTEBIN_API_PASSWORD
});


let url = args[0];
let id = url.slice(21);
console.log(`retrieving id : ${id} ...`);

console.log(`retrieving data ...`);
pastebin.getPaste(id, false).then(data=>{
    console.log(`parsing JSON data ...`);
    try {
        let json = JSON.parse(data);
        console.log(`connect to db ...`);
        Mongoose.connect(process.env.MONGO_URI, (err) => {
          Bot.deleteMany({'avatar':json.avatar}, (err, result)=>{
            if(err){
              console.log(err);
            }
            else{
              console.log(result);
            }
            console.log(`creating bot ${json.avatar}...`);
            Bot.create({
              avatar: json.avatar,
              elo: 1000,
              author: json.author,
              steps: json.steps
            });
          });
      });
      } catch (e) {
        console.error("Parsing error:", e);
      }
});