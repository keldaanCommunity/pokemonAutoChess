import dotenv from 'dotenv';
import {connect} from 'mongoose';
import BotV2 from '../app/models/mongo-models/bot-v2';
import { PastebinAPI } from 'pastebin-ts/dist/api';
const args = process.argv.slice(2);
dotenv.config();

const pastebin = new PastebinAPI({
  'api_dev_key': process.env.PASTEBIN_API_DEV_KEY,
  'api_user_name': process.env.PASTEBIN_API_USERNAME,
  'api_user_password': process.env.PASTEBIN_API_PASSWORD
});

const url = args[0];
const id = url.slice(21);
console.log(`retrieving id : ${id} ...`);

console.log(`retrieving data ...`);
pastebin.getPaste(id, false).then((data)=>{
  console.log(`parsing JSON data ...`);
  try {
    const json = JSON.parse(data);
    console.log(`connect to db ...`);
    connect(process.env.MONGO_URI, (err) => {
      BotV2.deleteMany({'avatar': json.avatar}, (err, result)=>{
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
        console.log(`creating BotV2 ${json.avatar}...`);
        BotV2.create({
          name: json.name,
          avatar: json.avatar,
          elo: 1200,
          author: json.author,
          steps: json.steps
        }, (err, result)=>{
            if(err) {
                console.log(err);
            }
            else{
                // console.log(result);
            }
        });
      });
    });
  } catch (e) {
    console.error('Parsing error:', e);
  }
});
