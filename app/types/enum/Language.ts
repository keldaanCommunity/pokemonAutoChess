export enum Language {
  en = "en",
  fr = "fr",
  pt = "pt",
  de = "de",
  es = "es",
  it = "it",
  ja = "ja",
  nl = "nl",
  bg = "bg"
}

export const LanguageFlag: { [key in Language]: string } = {
  [Language.en]: "🇬🇧",
  [Language.fr]: "🇫🇷",
  [Language.pt]: "🇵🇹",
  [Language.de]: "🇩🇪",
  [Language.es]: "🇪🇸",
  [Language.it]: "🇮🇹",
  [Language.ja]: "🇯🇵",
  [Language.nl]: "🇳🇱",
  [Language.bg]: "🇧🇬"
}
