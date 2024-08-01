import { Pkm, PkmIndex } from './Pokemon';

export const Starters: Pkm[] = [
    Pkm.BULBASAUR,
    Pkm.CHARMANDER,
    Pkm.SQUIRTLE,
    Pkm.PIKACHU,
    Pkm.MEOWTH,
    Pkm.PSYDUCK,
    Pkm.MACHOP,
    Pkm.CUBONE,
    Pkm.EEVEE,
    Pkm.CHIKORITA,
    Pkm.CYNDAQUIL,
    Pkm.TOTODILE,
    Pkm.TREECKO,
    Pkm.TORCHIC,
    Pkm.MUDKIP,
    Pkm.TURTWIG,
    Pkm.CHIMCHAR,
    Pkm.PIPLUP,
    Pkm.MUNCHLAX,
    Pkm.VULPIX,
    Pkm.PHANPY,
    Pkm.SHINX,
    Pkm.RIOLU
]

export const StarterAvatars:string[] = Starters.map(p => PkmIndex[p]+"/Normal")