import blacklist from "./profanity-blacklist.json"

// Word boundary that works with unicode, from: https://shiba1014.medium.com/regex-word-boundaries-with-unicode-207794f6e7ed
const WORD_BOUNDARY_BEFORE = `(?<=[\\s,.:;!?"']|^)`
const WORD_BOUNDARY_AFTER = `(?=[\\s,.:;!?"']|$)`

const blacklistRegex = new RegExp(
  `${WORD_BOUNDARY_BEFORE}(${blacklist.join("|")})${WORD_BOUNDARY_AFTER}`,
  "gim"
)

export function cleanProfanity(string: string): string {
  try {
    return string.replace(blacklistRegex, "koffing")
  } catch (error) {
    console.error(error)
    return "error"
  }
}
