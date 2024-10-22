import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../../app/models/mongo-models/bot-v2"
import DetailledStatistic from "../../app/models/mongo-models/detailled-statistic-v2"
import History from "../../app/models/mongo-models/history"
import Meta from "../../app/models/mongo-models/meta"
import { Pkm } from "../../app/types/enum/Pokemon"
import { logger } from "../../app/utils/logger"

async function main() {
  dotenv.config()

  await removePokemonFromGame("SILVALLY_FIRE", "0773-0009", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_FOSSIL",
    "0773-0015",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame(
    "SILVALLY_PSYCHIC",
    "0773-0013",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_WATER", "0773-0010", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_ELECTRIC",
    "0773-0012",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_FAIRY", "0773-0017", "SILVALLY", "0773")
  await removePokemonFromGame("SILVALLY_DARK", "0773-0016", "SILVALLY", "0773")
  await removePokemonFromGame("SILVALLY_GRASS", "0773-0011", "SILVALLY", "0773")
  await removePokemonFromGame("SILVALLY_ICE", "0773-0014", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_FIGHTING",
    "0773-0001",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_LIGHT", "0773-0006", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_POISON",
    "0773-0003",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_SOUND", "0773", "SILVALLY", "0773")
  await removePokemonFromGame("SILVALLY_STEEL", "0773-0008", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_FLYING",
    "0773-0002",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_ROCK", "0773-0005", "SILVALLY", "0773")
  await removePokemonFromGame(
    "SILVALLY_GROUND",
    "0773-0004",
    "SILVALLY",
    "0773"
  )
  await removePokemonFromGame("SILVALLY_GHOST", "0773-0007", "SILVALLY", "0773")
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
    const bots = await BotV2.find()
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
      }
    }

    // Histories
    console.log(
      `Replacing ${pokemonNameToRemove} by ${pokemonNameToReplace} in game histories`
    )
    const histories = await History.find({}, ["pokemons"])
    for (let i = 0; i < histories.length; i++) {
      const history = histories[i]
      let modified = false
      if (history.players) {
        history.players.forEach((player) => {
          if (player.pokemons) {
            player.pokemons.forEach((p) => {
              if (p.name === (pokemonNameToRemove as Pkm)) {
                p.name = pokemonNameToReplace
                if (p.avatar) {
                  p.avatar = p.avatar.replace(
                    pokemonIndexToRemove,
                    pokemonIndexToReplace
                  )
                }
                history.markModified("players.pokemons")
                modified = true
              }
            })
          }
        })
      }

      if (modified) {
        console.log(
          `Game history has been modified to replace ${pokemonNameToRemove} by ${pokemonIndexToReplace}`
        )
        await history.save()
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
