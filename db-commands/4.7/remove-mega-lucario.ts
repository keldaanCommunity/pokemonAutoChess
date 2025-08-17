import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../../app/models/mongo-models/bot-v2"
import DetailledStatistic from "../../app/models/mongo-models/detailled-statistic-v2"
import Meta from "../../app/models/mongo-models/meta"
import { Pkm } from "../../app/types/enum/Pokemon"
import { logger } from "../../app/utils/logger"

async function main() {
  dotenv.config()

  await removePokemonFromGame("MEGA_LUCARIO", "0448-0001", "LUCARIO", "0448")
}

async function removePokemonFromGame(
  pokemonNameToRemove: string,
  pokemonIndexToRemove: string,
  pokemonNameToReplace: string,
  pokemonIndexToReplace: string
) {
  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)

    // Bots
    console.log(
      `Replacing ${pokemonNameToRemove} by ${pokemonNameToReplace} in bots`
    )
    const bots = await BotV2.find().exec()
    for (let i = 0; i < bots.length; i++) {
      let modified = false
      const bot = bots[i]
      bot.steps.forEach((step) => {
        step.board.forEach((p) => {
          if (p.name === (pokemonNameToRemove as Pkm)) {
            p.name = pokemonNameToReplace as Pkm
            modified = true
          }
        })
      })
      if (modified) {
        console.log(
          `Bot ${bot.name} has been modified to replace ${pokemonNameToRemove} by ${pokemonNameToReplace}`
        )
        bot.markModified("steps")
        await bot.save()
      }
    }

    // DetailledStatistic
    console.log(
      `Replacing ${pokemonNameToRemove} by ${pokemonNameToReplace} in game detailled statistics`
    )
    const stats = await DetailledStatistic.find({}, ["pokemons"])
    for (let i = 0; i < stats.length; i++) {
      const record = stats[i]
      let modified = false
      record.pokemons.forEach((p) => {
        if (p.name === (pokemonNameToRemove as Pkm)) {
          p.name = pokemonIndexToReplace
          p.avatar = p.avatar.replace(
            pokemonIndexToRemove,
            pokemonIndexToReplace
          )
          record.markModified("pokemons")
          modified = true
        }
      })
      if (modified) {
        console.log(
          `DetailedStatistic has been modified to replace ${pokemonNameToRemove} by ${pokemonNameToReplace}`
        )
        await record.save()
      }
    }

    // Meta
    console.log(`Removing ${pokemonNameToRemove} from meta report`)

    const meta = await Meta.find({}, ["pokemons", "teams"])
    for (let i = 0; i < meta.length; i++) {
      const metarecord = meta[i]
      let modified = false
      if (pokemonNameToRemove in metarecord.pokemons) {
        metarecord.pokemons[pokemonNameToReplace] =
          metarecord.pokemons[pokemonNameToRemove]
        delete metarecord.pokemons[pokemonNameToRemove]
        metarecord.markModified("pokemons")
        modified = true
      }
      metarecord.teams.forEach((team) => {
        if (pokemonNameToRemove in team.pokemons) {
          team.pokemons[pokemonNameToReplace] =
            team.pokemons[pokemonNameToRemove]
          delete team.pokemons[pokemonNameToRemove]
          metarecord.markModified("teams")
          modified = true
        }
      })
      if (modified) {
        console.log(
          `Meta report has been modified to replace ${pokemonNameToRemove} by ${pokemonIndexToReplace}`
        )

        await metarecord.save()
      }
    }

    await db.disconnect()
  } catch (e) {
    logger.error("Error:", e)
  }
}

main()
