export const TierListSymbols = [
  "SEPARATOR",
  "PLUS",
  "MINUS",
  "MULTIPLY",
  "SLASH",
  "FORBIDDEN",
  "QUESTIONMARK",
  "EXCLAMATIONMARK",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
] as const

export type TierListSymbol = typeof TierListSymbols[number]