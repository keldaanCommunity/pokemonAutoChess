import { Damage, Stat } from "../enum/Game";
import { Status } from "../enum/Status";
import { Synergy } from "../enum/Synergy";
import { Weather } from "../enum/Weather";

export const WeatherLabel: {
  [key in Weather]: string
} = {
  [Weather.NEUTRAL]: "Calm weather",
  [Weather.SUN]: "Zenith",
  [Weather.WINDY]: "Windy",
  [Weather.RAIN]: "Rain",
  [Weather.NIGHT]: "Night",
  [Weather.STORM]: "Storm",
  [Weather.MISTY]: "Misty",
  [Weather.SNOW]: "Snow",
  [Weather.SANDSTORM]: "Sandstorm"
}

export const WeatherDescription: {
  [key in Weather]: string
} = {
  [Weather.NEUTRAL]: ``,
  [Weather.SUN]: `${Status.BURN} damage +30%\n${Status.FREEZE} duration -30%`,
  [Weather.WINDY]: `+10% dodge chance (+20% if ${Synergy.FLYING})`,
  [Weather.RAIN]: `+3 ${Stat.MANA} per second\n-30% ${Status.BURN} and ${Status.POISON} damage`,
  [Weather.NIGHT]: `+10% ${Stat.CRIT_CHANCE}\n+30% ${Status.SLEEP} duration`,
  [Weather.STORM]: `Lightning randomly falls on the board, dealing 100 ${Damage.SPECIAL} (${Synergy.ELECTRIC} are immune)\n+30% ${Status.PARALYSIS} duration`,
  [Weather.MISTY]: `+20% ${Damage.SPECIAL}\n+30% ${Status.SILENCE} duration`,
  [Weather.SNOW]: `-25% base ${Stat.ATK_SPEED}\n+30% ${Status.FREEZE} duration`,
  [Weather.SANDSTORM]: `5 ${Damage.SPECIAL} per second (${Synergy.GROUND} are immune)\n${Status.CONFUSION} duration +30%`
}