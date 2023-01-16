import { Orientation } from "../../../../types/enum/Game"
import { AttackSprite, IPokemon, IPokemonEntity } from "../../../../types"

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjMpYJycJTjOsXPM1CJn8olntPQhpysOI",
  authDomain: "pokemonautochess-b18fb.firebaseapp.com",
  projectId: "pokemonautochess-b18fb",
  storageBucket: "pokemonautochess-b18fb.appspot.com",
  messagingSenderId: "448759785030",
  appId: "1:448759785030:web:bc2f21a25ab9e43a894c47"
}

export function transformCoordinate(x: number, y: number) {
  if (y === 0) {
    return [28 * 24 + 96 * x, 808]
  } else {
    return [28 * 24 + 96 * x, 760 - 96 * y]
  }
}

export function transformAttackCoordinate(x: number, y: number) {
  return [28 * 24 + 96 * x, 664 - 96 * y]
}

export function getOrientation(x1: number, y1: number, x2: number, y2: number) {
  let angle = Math.atan2(y2 - y1, x2 - x1)
  if (angle < 0) {
    angle += 2 * Math.PI
  }
  const quarterPi = Math.PI / 4
  // console.log(angle);
  if (angle < quarterPi) {
    return Orientation.RIGHT
  } else if (angle < 2 * quarterPi) {
    return Orientation.DOWNRIGHT
  } else if (angle < 3 * quarterPi) {
    return Orientation.DOWN
  } else if (angle < 4 * quarterPi) {
    return Orientation.DOWNLEFT
  } else if (angle < 5 * quarterPi) {
    return Orientation.LEFT
  } else if (angle < 6 * quarterPi) {
    return Orientation.UPLEFT
  } else if (angle < 7 * quarterPi) {
    return Orientation.UP
  } else if (angle < 8 * quarterPi) {
    return Orientation.UPRIGHT
  } else {
    return Orientation.RIGHT
  }
}

export function getAttackScale(attackSprite: AttackSprite) {
  switch (attackSprite) {
    case AttackSprite.FLYING_RANGE:
      return [1.5, 1.5]

    case AttackSprite.FLYING_MELEE:
      return [1.5, 1.5]

    case AttackSprite.BUG_MELEE:
      return [1.5, 1.5]

    case AttackSprite.FAIRY_RANGE:
      return [1.5, 1.5]

    case AttackSprite.GRASS_RANGE:
      return [3, 3]

    case AttackSprite.GRASS_MELEE:
      return [1.5, 1.5]

    case AttackSprite.POISON_RANGE:
      return [1.5, 1.5]

    case AttackSprite.POISON_MELEE:
      return [1, 1]

    case AttackSprite.WATER_RANGE:
      return [3, 3]

    case AttackSprite.FIRE_MELEE:
      return [1.5, 1.5]

    case AttackSprite.ROCK_MELEE:
      return [1.5, 1.5]

    case AttackSprite.ELECTRIC_MELEE:
      return [1.5, 1.5]

    case AttackSprite.PSYCHIC_RANGE:
      return [2, 2]

    case AttackSprite.DRAGON_MELEE:
      return [2, 2]

    default:
      return [2, 2]
  }
}

export function getPath(pokemon: IPokemonEntity | IPokemon) {
  let pokemonPath = ""
  const index = pokemon.index
  pokemonPath += index + "/"

  if (pokemon.shiny) {
    pokemonPath += "0000/0001/"
  }
  pokemonPath += pokemon.emotion
  return pokemonPath
}
