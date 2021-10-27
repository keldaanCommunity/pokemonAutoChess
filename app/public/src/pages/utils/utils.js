 import { ORIENTATION } from "../../../../models/enum";
 
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjMpYJycJTjOsXPM1CJn8olntPQhpysOI",
  authDomain: "pokemonautochess-b18fb.firebaseapp.com",
  projectId: "pokemonautochess-b18fb",
  storageBucket: "pokemonautochess-b18fb.appspot.com",
  messagingSenderId: "448759785030",
  appId: "1:448759785030:web:bc2f21a25ab9e43a894c47"
};   

 export function transformCoordinate(x,y){
  return [28 * 24 + 96 * x, 808 - 120 * y];
 };

 export function transformAttackCoordinate(x,y){
  return [28 * 24 + 96 * x, 712 - 120 * y];
 }

 export function getOrientation(x1, y1, x2, y2){
  let angle = Math.atan2(y2 - y1, x2 - x1);
  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  const quarterPi = Math.PI / 4;
  // console.log(angle);
  if (angle < quarterPi) {
    return ORIENTATION.RIGHT;
  } else if (angle < 2 * quarterPi) {
    return ORIENTATION.DOWNRIGHT;
  } else if (angle < 3 * quarterPi) {
    return ORIENTATION.DOWN;
  } else if (angle < 4 * quarterPi) {
    return ORIENTATION.DOWNLEFT;
  } else if (angle < 5 * quarterPi) {
    return ORIENTATION.LEFT;
  } else if (angle < 6 * quarterPi) {
    return ORIENTATION.UPLEFT;
  } else if (angle < 7 * quarterPi) {
    return ORIENTATION.UP;
  } else if (angle < 8 * quarterPi) {
    return ORIENTATION.UPRIGHT;
  } else {
    return ORIENTATION.RIGHT;
  }
 }

 export function getAttackScale(attackSprite){
  switch (attackSprite) {
    case 'FLYING/range':
      return [1.5, 1.5];

    case 'FLYING/melee':
      return [1.5, 1.5];

    case 'BUG/melee':
      return [1.5, 1.5];

    case 'FAIRY/range':
      return [1.5, 1.5];

    case 'GRASS/range':
      return [3, 3];

    case 'GRASS/melee':
      return [2, 2];

    case 'POISON/range':
      return [1.5, 1.5];

    case 'POISON/melee':
      return [1, 1];

    case 'WATER/range':
      return [3, 3];

    case 'FIRE/melee':
      return [2, 2];

    case 'ROCK/melee':
      return [2, 2];

    case 'ELECTRIC/melee':
      return [2, 2];

    case 'PSYCHIC/range':
      return [2, 2];

    case 'DRAGON/melee':
      return [2, 2];

    default:
      return [2, 2];
  }
 }
