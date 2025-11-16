// Player experience gains based on rank
export const ExpPlace = [700, 400, 350, 300, 250, 200, 200, 200]

export const MAX_LEVEL = 9

// Experience required to move from level n to level n+1
export const ExpTable: { [key: number]: number } = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 22,
  6: 34,
  7: 52,
  8: 72,
  9: 255
})
