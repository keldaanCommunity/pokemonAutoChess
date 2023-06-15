import blacklist from "./profanity-blacklist.json";

const blacklistRegexs = blacklist.map((word) => new RegExp(`\\b${removeDiactrics(word).replace(/(\W)/g, '\\$1')}\\b`, 'gi'))
const splitRegex = /\b/ui; // NOTE: does not properly split strings with diacritics (éèà...)

function removeDiactrics(str: string){
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

export function cleanProfanity(string: string): string {
    return string.split(splitRegex).map((word) => {
        const normalizedWord = removeDiactrics(word);
        return blacklistRegexs.some(regex => regex.test(normalizedWord)) ? "koffing" : word;
    }).join(splitRegex.exec(string)![0]);
}