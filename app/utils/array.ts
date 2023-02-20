export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    const k = key(item);
    if(!(k in groups)) groups[k] = [];
    groups[k].push(item);
    return groups;
  }, {} as Record<K, T[]>);

export function sum(arr: number[]): number {
  return arr.reduce((a,b) => a+b, 0)
}