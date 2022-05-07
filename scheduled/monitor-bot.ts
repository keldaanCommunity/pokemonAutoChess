import dotenv from 'dotenv';
import {connect, connection} from 'mongoose';
import BotV2 from '../app/models/mongo-models/bot-v2';
import BotMonitor from '../app/models/mongo-models/bot-monitoring';
dotenv.config();

console.log('connection to db...');
if(process.env.MONGO_URI){
    connect(process.env.MONGO_URI, async (err) => {
        console.log('loading bots ...');
        const bots = await BotV2.find({}, ['avatar', 'elo', 'name', 'author'], null);
        await Promise.all(bots.map(async bot=>{
            try{
                console.log(`finding bot ${bot.name}...`);
                const botMonitor = await BotMonitor.findOne({avatar: bot.avatar});
                console.log(`updating bot ${bot.name}...`);
                if(botMonitor){
                    botMonitor.data.push({time: Date.now(), elo: bot.elo});
                    await botMonitor.save();
                }
            }
            catch(err){
                console.log(`creating bot ${bot.name}...`);
                await BotMonitor.create({
                    avatar: bot.avatar,
                    author: bot.author,
                    name: bot.name,
                    data: [{time: Date.now(), elo: bot.elo}]
                });
            }
        }));
        console.log('closing connection ...');
        connection.close();
    });
    
}
