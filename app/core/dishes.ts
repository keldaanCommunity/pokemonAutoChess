import { Item } from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"

export const DishByPkm: { [pkm in Pkm]?: Item } = {
  [Pkm.LICKITUNG]: Item.RAGE_CANDY_BAR,
  [Pkm.LICKILICKY]: Item.RAGE_CANDY_BAR,
  [Pkm.SINISTEA]: Item.TEA,
  [Pkm.POLTEAGEIST]: Item.TEA,
  [Pkm.CAPSAKID]: Item.CURRY,
  [Pkm.SCOVILLAIN]: Item.CURRY,
  [Pkm.VANILLITE]: Item.CASTELIACONE,
  [Pkm.VANILLISH]: Item.CASTELIACONE,
  [Pkm.VANILLUXE]: Item.CASTELIACONE,
  [Pkm.SWIRLIX]: Item.WHIPPED_DREAM,
  [Pkm.SLURPUFF]: Item.WHIPPED_DREAM,
  [Pkm.APPLIN]: Item.TART_APPLE,
  [Pkm.CHERRUBI]: Item.SWEET_HERB,
  [Pkm.CHERRIM]: Item.SWEET_HERB,
  [Pkm.CHERRIM_SUNLIGHT]: Item.SWEET_HERB,
  [Pkm.TROPIUS]: Item.BERRIES,
  [Pkm.SHUCKLE]: Item.BERRY_JUICE,
  [Pkm.COMBEE]: Item.HONEY,
  [Pkm.VESPIQUEEN]: Item.HONEY,
  [Pkm.HAPPINY]: Item.NUTRITIOUS_EGG,
  [Pkm.CHANSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.BLISSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.NACLI]: Item.ROCK_SALT,
  [Pkm.NACLSTACK]: Item.ROCK_SALT,
  [Pkm.GARGANACL]: Item.ROCK_SALT,
  [Pkm.MUNCHLAX]: Item.LEFTOVERS,
  [Pkm.SNORLAX]: Item.LEFTOVERS
}
