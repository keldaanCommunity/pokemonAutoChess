export const Lobby = {
  PLACE: {
    eng: "place",
    esp: "lugar",
    fra: "place"
  },

  RANKING: {
    eng: "Ranking",
    esp: "Clasificación",
    fra: "Classement"
  },
}

export function getRankLabel(rank: number, lang="eng"){
  switch(rank){
    case 1: return {
      eng: "First place",
      esp: "Primer lugar",
      fra: "Première place"
    }[lang]
    case 2: return {
      eng: "Second place",
      esp: "Secondu lugar",
      fra: "Seconde place"
    }[lang]
    case 3: return {
      eng: "Third place",
      esp: "Tercer lugar",
      fra: "Troisième place"
    }[lang]
  }
  return {
    eng: `${rank}th place`,
    esp: `Lugar ${rank}`,
    fra: `${rank}ème place`
  }[lang]
}
