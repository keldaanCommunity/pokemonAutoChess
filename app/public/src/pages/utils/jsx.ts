/* conditional classes for JSX
see https://dev.to/victorocna/better-conditional-css-classes-in-react-2p8h
*/
export function cc(...classes: (string | Record<string, boolean>)[]): string {
    if(classes.length > 1) return classes.map(c => cc(c)).join(" ")
    else if(typeof classes[0] === "object") return Object.keys(classes[0]).filter(c => classes[0][c]).join(" ")
    else return classes[0].toString()
}