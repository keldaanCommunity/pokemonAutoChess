import { Stat } from "../enum/Game";
import { Passive } from "../enum/Passive";
import { Status } from "../enum/Status"

export const PassiveDescription: { [key in Passive]: string } = {
    [Passive.NONE]: "No passive",
    [Passive.TYROGUE]: "Will choose a combat discipline based on the first item given",
    [Passive.PROTEAN2]: `The pokemon acquires the typing of the 2 highest synergies on the team`,
    [Passive.PROTEAN3]: `The pokemon acquires the typing of the 3 highest synergies on the team`,
    [Passive.CASTFORM]: `Castform changes form depending on the weather`,
    [Passive.PHIONE]: `Phione is looking for an Aqua Egg`,
    [Passive.PRIMAL]: `Legend has it that you could unleash the ancient powers of these pokemons`,
    [Passive.WONDER_GUARD]: `Reduce received damage and received healing to 1`,
    [Passive.ELECTRIC_SURGE]: `Give ${Status.ELECTRIC_FIELD} to your Electric Pokemon, boosting their damage by 20%`,
    [Passive.GRASSY_SURGE]: `Give ${Status.GRASS_FIELD} to your Grass Pokemon, boosting their damage by 20%`,
    [Passive.MISTY_SURGE]: `Give ${Status.FAIRY_FIELD} to your Fairy Pokemon, boosting their damage by 20%`,
    [Passive.PSYCHIC_SURGE]: `Give ${Status.PSYCHIC_FIELD} to your Psychic Pokemon, boosting their damage by 20%`,
    [Passive.EEVEE]: `Eevee can evolve into one of the 8 Eeveelutions when given a synergy stone`,
    [Passive.TREE]: `Pretends to be a tree and does not attack but gain 2 ${Stat.ATK} per second instead (stackable).\nStarts attacking when ${Stat.MANA} bar is full.`,
    [Passive.DITTO]: `Ditto can't fight, but it can transform to create a copy of the basic form of one of your pokemons you drop it over (except Mythical and Hatch).`,
    [Passive.EGG]: `You can feel something moving inside.`
}
