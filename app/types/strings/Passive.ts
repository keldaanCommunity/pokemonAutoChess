import { Passive } from "../enum/Passive";

export const PassiveDescription: { [key in Passive]: string } = {
    [Passive.NONE]: "No passive",
    [Passive.TYROGUE]: "Will choose a combat discipline based on the first item given",
    [Passive.PROTEAN2]: `The pokemon acquires the typing of the 2 highest synergies on the team`,
    [Passive.PROTEAN3]: `The pokemon acquires the typing of the 3 highest synergies on the team`,
}
