import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../../app/models/mongo-models/bot-v2"
import DetailledStatistic from "../../app/models/mongo-models/detailled-statistic-v2"
import Meta from "../../app/models/mongo-models/meta"
import type { Pkm } from "../../app/types/enum/Pokemon"
import { logger } from "../../app/utils/logger"

const PROGRESS_LOG_INTERVAL = 1000

function logProgress(
  label: string,
  processed: number,
  total: number,
  updated: number
) {
  const percent = total > 0 ? ((processed / total) * 100).toFixed(1) : "100.0"
  console.log(
    `[${label}] ${processed}/${total} (${percent}%) processed, ${updated} updated`
  )
}

function shouldLogProgress(processed: number, total: number) {
  return processed === 1 || processed % PROGRESS_LOG_INTERVAL === 0 || processed === total
}

async function main() {
  dotenv.config()

  await replacePokemonInGame("VESPIQUEEN", "0416", "VESPIQUEN", "0416")
}

async function replacePokemonInGame(
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
    const totalBots = await BotV2.countDocuments({})
    console.log(`[bots] total documents: ${totalBots}`)
    let processedBots = 0
    let botCount = 0
    const botCursor = BotV2.find({}, ["name", "steps"]).cursor({
      batchSize: 100
    })
    for await (const bot of botCursor) {
      processedBots += 1
      let modified = false
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
        botCount += 1
      }
      if (shouldLogProgress(processedBots, totalBots)) {
        logProgress("bots", processedBots, totalBots, botCount)
      }
    }
    console.log(`Updated ${botCount} bots`)

    // DetailledStatistic
    console.log(
      `Replacing ${pokemonNameToRemove} by ${pokemonNameToReplace} in game detailled statistics`
    )
    const totalStats = await DetailledStatistic.countDocuments({})
    console.log(`[detailled-statistics] total documents: ${totalStats}`)
    let processedStats = 0
    let statCount = 0
    const statCursor = DetailledStatistic.find({}, ["pokemons"]).cursor({
      batchSize: 250
    })
    for await (const record of statCursor) {
      processedStats += 1
      let modified = false
      record.pokemons.forEach((p) => {
        if (p.name === (pokemonNameToRemove as Pkm)) {
          p.name = pokemonNameToReplace
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
        statCount += 1
      }
      if (shouldLogProgress(processedStats, totalStats)) {
        logProgress("detailled-statistics", processedStats, totalStats, statCount)
      }
    }
    console.log(`Updated ${statCount} detailed statistics records`)

    // Meta
    console.log(`Removing ${pokemonNameToRemove} from meta report`)

    const totalMeta = await Meta.countDocuments({})
    console.log(`[meta] total documents: ${totalMeta}`)
    let processedMeta = 0
    let metaCount = 0
    const metaCursor = Meta.find({}, ["pokemons", "teams"]).cursor({
      batchSize: 250
    })
    for await (const metarecord of metaCursor) {
      processedMeta += 1
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
        metaCount += 1
      }
      if (shouldLogProgress(processedMeta, totalMeta)) {
        logProgress("meta", processedMeta, totalMeta, metaCount)
      }
    }
    console.log(`Updated ${metaCount} meta records`)

    await db.disconnect()
  } catch (e) {
    logger.error("Error:", e)
  }
}

main()
