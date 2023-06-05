import dotenv from "dotenv"
import { connect } from "mongoose"
import UserMetadata, {
  IPokemonConfig,
  IUserMetadata
} from "../app/models/mongo-models/user-metadata"
import { logger } from "../app/utils/logger"

const tournamentNames = [
  "Keldaan",
  "PokemonFather",
  "froggydojo",
  "Zony11",
  "SmilingImp",
  "ChewT",
  "Pockels",
  "Batotsu",
  "BluntRaptor",
  "Radda",
  "PlatRyan",
  "Roi Tofu",
  "I am no Jedi",
  "The Sleepy Shaman",
  "No meta Player",
  "Draguin",
  "SaileYume",
  "Plagued",
  "Solede",
  "GGillou",
  "Tiger58",
  "Lockthia",
  "Xerion",
  "Pyrra",
  "Bonko",
  "ComeGoblin",
  "Xavrey",
  "GalaxyRider",
  "Irn0X",
  "Nafto",
  "iSeux",
  "DaffyDethklok",
  "Tigereye",
  "Spud",
  "Hiros",
  "throat",
  "Curry",
  "CrimsonNoble",
  "EssAater",
  "🍃💨AnitaDab🍃💨",
  "TheSadLittleChicken",
  "Starchon",
  "andyxd",
  "Da mite",
  "Azior",
  "Thoraque",
  "Constant",
  "Lidl",
  "J-Ray",
  "UnknownToasted",
  "Emeri",
  "Fall.-",
  "julie",
  "Giga",
  "Mrspooghetti",
  "isyshelly",
  "SCEPTILEAV52",
  "TeoSkrn",
  "Rabuuhs",
  "TuamaCrost",
  "Argros",
  "Felosion",
  "RegoBing",
  "Milenity",
  "stormo",
  "TheShadoWalker21",
  "Javiercillo16",
  "Ketzer",
  "Plushiant",
  "spyepic222",
  "Spicy",
  "Master9000dn",
  "BlueJellyO",
  "RGBill",
  "Smughtro",
  "XD737483"
]
const tournamentUsers: { displayName: string; elo: number; level: number }[] =
  []

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const db = await connect(process.env.MONGO_URI!)
    for (let i = 0; i < tournamentNames.length; i++) {
      const name = tournamentNames[i]
      const regExp = new RegExp(name)
      const users = await UserMetadata.find(
        { displayName: { $regex: regExp, $options: "i" } },
        ["displayName", "elo", "level"],
        { limit: 100, sort: { level: -1 } }
      )
      if (users && users.length > 0) {
        const user = users[0]
        tournamentUsers.push({
          displayName: name,
          elo: user.elo,
          level: user.level
        })
      } else {
        tournamentUsers.push({
          displayName: name,
          elo: 0,
          level: 0
        })
      }
    }
    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
  tournamentUsers.sort((a, b) => {
    return b.level - a.level
  })
  tournamentUsers.forEach((u) => {
    console.log(`${u.displayName} (Lvl${u.level}, Elo ${u.elo})`)
  })
}

main()
