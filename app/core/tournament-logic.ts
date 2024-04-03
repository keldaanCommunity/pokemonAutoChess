import {
  ITournament,
  ITournamentBracket,
  ITournamentPlayer
} from "../types/interfaces/Tournament"

export function getTournamentStage(
  remainingPlayers: ITournamentPlayer[]
): string {
  if (remainingPlayers.length <= 8) return "FINALS"
  if (remainingPlayers.length <= 16) return "Semi-Finals"
  if (remainingPlayers.length <= 32) return "Quarter-Finals"
  else {
    let n = Math.floor(Math.log(remainingPlayers.length) / Math.log(2))
    return `Round of ${Math.pow(2, n)}`
  }
}

export function makeBrackets(tournament: ITournament): ITournamentBracket[] {
  const remainingPlayers: (ITournamentPlayer & { id: string })[] = []
  tournament.players.forEach((player, playerId) => {
    if (!player.eliminated)
      remainingPlayers.push({
        id: playerId,
        ...player
      })
  })

  remainingPlayers.sort((a, b) => b.elo - a.elo)

  let minDelta = 1
  let idealNbPerBracket = 8
  for (let nbPerBracket = 4; nbPerBracket <= 8; nbPerBracket++) {
    let delta = Math.abs(
      Math.round(remainingPlayers.length / nbPerBracket) -
        remainingPlayers.length / nbPerBracket
    )
    if (delta < minDelta) {
      minDelta = delta
      idealNbPerBracket = nbPerBracket
    }
  }

  let nbBrackets = Math.ceil(remainingPlayers.length / idealNbPerBracket)
  let nbPerBracket = Math.ceil(remainingPlayers.length / nbBrackets)
  const brackets: ITournamentBracket[] = []
  for (let i = 0; i < nbBrackets; i++) {
    const playersId: string[] = []
    while (playersId.length < nbPerBracket && remainingPlayers.length > 0) {
      if (remainingPlayers.length > 0)
        playersId.push(remainingPlayers.shift()!.id)
      if (remainingPlayers.length > 0)
        playersId.push(remainingPlayers.pop()!.id)
    }
    const bracket: ITournamentBracket = {
      name: `${getTournamentStage(remainingPlayers)} #${i + 1}`,
      playersId
    }
    brackets.push(bracket)
  }

  return brackets
}
