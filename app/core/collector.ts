import DpsStatistic, {
  IDpsReport,
  IDpsStatistic
} from "../models/mongo-models/dps-statistic"
import { Pkm } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"
import Dps from "./dps"
import DpsHeal from "./dps-heal"
import Simulation from "./simulation"
import { MapSchema } from "@colyseus/schema"

interface ICollectorReport {
  pkm: Pkm
  stageLevel: number
  count: number
  heal: number
  shield: number
  physical: number
  special: number
  true: number
}
export class Collector {
  data: IDpsStatistic[]
  constructor() {
    this.data = new Array<IDpsStatistic>()
  }

  collect(simulation: Simulation) {
    const pokemonMap = new Map<string, ICollectorReport>()
    const dpsMeters = new Array<MapSchema<Dps> | MapSchema<DpsHeal>>()
    if (!simulation.bluePlayer?.isBot || process.env.MODE === "dev") {
      dpsMeters.push(simulation.blueDpsMeter)
      dpsMeters.push(simulation.blueHealDpsMeter)
    }
    if (!simulation.redPlayer?.isBot || process.env.MODE === "dev") {
      dpsMeters.push(simulation.redDpsMeter)
      dpsMeters.push(simulation.redHealDpsMeter)
    }
    dpsMeters.forEach((dpsMeter: MapSchema<Dps> | MapSchema<DpsHeal>) =>
      dpsMeter.forEach((dps: Dps | DpsHeal) => {
        const pokemon = pokemonMap.get(dps.id)
        if (pokemon) {
          if (dps instanceof Dps) {
            pokemon.physical = dps.physicalDamage
            pokemon.special = dps.specialDamage
            pokemon.true = dps.trueDamage
          }
          if (dps instanceof DpsHeal) {
            pokemon.heal = dps.heal
            pokemon.shield = dps.shield
          }
        } else {
          if (dps instanceof Dps) {
            pokemonMap.set(dps.id, {
              count: 0,
              stageLevel: 0,
              heal: 0,
              shield: 0,
              physical: dps.physicalDamage,
              special: dps.specialDamage,
              true: dps.trueDamage,
              pkm: dps.pkm
            })
          }
          if (dps instanceof DpsHeal) {
            pokemonMap.set(dps.id, {
              count: 0,
              stageLevel: 0,
              heal: dps.heal,
              shield: dps.shield,
              physical: 0,
              special: 0,
              true: 0,
              pkm: dps.pkm
            })
          }
        }
      })
    )

    pokemonMap.forEach((p) => {
      const statistic = this.data.find((stat) => stat.name === p.pkm)
      if (statistic) {
        const report = statistic.turns.find(
          (r) => r.stageLevel === simulation.stageLevel
        )
        if (report) {
          ;["physical", "special", "true", "heal", "shield"].forEach(
            (damageType) => {
              const dpsValue = p[damageType]
              report[damageType] =
                (report[damageType] * report.count + dpsValue) /
                (report.count + 1)
            }
          )
          report.count += 1
        } else {
          statistic.turns.push({
            stageLevel: simulation.stageLevel,
            count: 1,
            heal: p.heal,
            shield: p.shield,
            physical: p.physical,
            special: p.special,
            true: p.true
          })
        }
      } else {
        this.data.push({
          name: p.pkm,
          turns: [
            {
              stageLevel: simulation.stageLevel,
              count: 1,
              heal: p.heal,
              shield: p.shield,
              physical: p.physical,
              special: p.special,
              true: p.true
            }
          ]
        })
      }
    })
  }

  async save() {
    for (let i = 0; i < this.data.length; i++) {
      const pokemon = this.data[i]
      try {
        const dbPokemon = await DpsStatistic.findOne({ name: pokemon.name })
        if (dbPokemon) {
          for (let k = 0; k < pokemon.turns.length; k++) {
            const report = pokemon.turns[k]
            const dbReport = dbPokemon.turns.find(
              (r) => r.stageLevel === report.stageLevel
            )
            if (dbReport) {
              ;["physical", "special", "true", "heal", "shield"].forEach(
                (damageType) => {
                  dbReport[damageType] =
                    (dbReport[damageType] * dbReport.count +
                      report[damageType] * report.count) /
                    (dbReport.count + report.count)
                }
              )
              dbReport.count += report.count
            } else {
              dbPokemon.turns.push(report)
            }
            dbPokemon.markModified("turns")
            await dbPokemon.save()
          }
        } else {
          await DpsStatistic.create(pokemon)
        }
      } catch (error) {
        logger.error(error)
      }
    }
  }
}
