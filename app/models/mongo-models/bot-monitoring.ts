import {Schema, model} from 'mongoose'

export interface IBotMonitoring{
    avatar: string,
    name: string,
    author: string,
    data: IMonitoringData[]
}

export interface IMonitoringData{
    time: number,
    elo: number
}

const botMonitoring = new Schema({
    avatar: {type:String},
    name: {type:String},
    author: {type:String},
    data:[{
        time:{type:Number},
        elo:{type:Number}
    }]
})

export default model<IBotMonitoring>('BotMonitoring', botMonitoring)