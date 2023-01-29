import dotenv from "dotenv"
import { connect } from "mongoose"
import BotV2 from "../app/models/mongo-models/bot-v2"
import { PastebinAPI } from "pastebin-ts/dist/api"
import { nanoid } from "nanoid"
const args = process.argv.slice(2)

async function main() {
  dotenv.config()

  const pastebin = new PastebinAPI({
    api_dev_key: process.env.PASTEBIN_API_DEV_KEY!,
    api_user_name: process.env.PASTEBIN_API_USERNAME!,
    api_user_password: process.env.PASTEBIN_API_PASSWORD!
  })

  const url = args[0]
  const id = url.slice(21)
  console.log(`retrieving id : ${id} ...`)

  console.log("retrieving data ...")
  const data = await pastebin.getPaste(id, false)
  console.log("parsing JSON data ...")
  try {
    const json = JSON.parse(data)
    console.log("connect to db ...")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const db = await connect(process.env.MONGO_URI!)
    const resultDelete = await BotV2.deleteMany({
      avatar: json.avatar,
      author: json.author
    })
    console.log(resultDelete)
    console.log(`creating BotV2 ${json.avatar} by ${json.author}...`)
    const resultCreate = await BotV2.create({
      name: json.name,
      avatar: json.avatar,
      elo: json.elo ? json.elo : 1200,
      author: json.author,
      steps: json.steps,
      id: nanoid()
    })
    console.log(
      resultCreate.id,
      resultCreate.name,
      resultCreate.avatar,
      resultCreate.author,
      resultCreate.elo
    )
    await db.disconnect()
  } catch (e) {
    console.error("Parsing error:", e)
  }
}

main()
