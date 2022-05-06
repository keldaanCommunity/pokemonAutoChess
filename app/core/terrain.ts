/* eslint-disable no-var */
const F = (Math.sqrt(3) - 1) / 2;
const G = (3 - Math.sqrt(3)) / 6;
const GRAD = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

export default class Terrain {
  width: number;
  height: number;
  frequency: number;
  persistance: number;
  terrain: number[][];

  constructor(width: number, height: number, frequency: number, persistance: number) {
    this.width = width;
    this.height = height;
    this.frequency = frequency;
    this.persistance = persistance;
    this.terrain = this.create(this.width, this.height, {frequency: this.frequency, persistance: this.persistance});
  }

  newRandom(seed: number) {
    try {
      var s=seed.toString();
    } catch (_) {
      s = (new Date().getTime() + Math.random()).toString();
    }
    let k=2166136261; let t=0;
    while (t<s.length) {
      k^=s.charCodeAt(t++);
      k+=(k<<1)+(k<<4)+(k<<7)+(k<<8)+(k<<24);
    }
    function h() {
      k+=k<<13; k^=k>>7; k+=k<<3; k^=k>>17;
      return (k+=k<<5)>>>0;
    }
    let a=h(); let b=h(); let c=h(); let d=1;
    function r() {
      a|=0; b|=0; c|=0; d|=0;
      const e=(a+b|0)+d|0;
      d=d+1|0; a=b^(b>>>9); b=c+(c<<3)|0; c=((c<<21)|(c>>11))+e|0;
      return (e>>>0)/4294967296;
    }
    for (t=0; t<15; t++) r();
    return r;
  }

  simplexNoise(table: any, x: number, y: number) {
    const s = (x+y)*F; let a = Math.floor(x+s); let b = Math.floor(y+s);
    const x0 = x-a + (a+b)*G; const y0 = y-b + (a+b)*G;
    const c = x0>y0?1:0; const d = x0>y0?0:1;
    const x1 = x0-c+G; const y1 = y0-d+G; const x2 = x0-1+2*G; const y2 = y0-1+2*G;
    a &= 255; b &= 255;
    const t0 = 0.5-x0*x0-y0*y0; const t1 = 0.5-x1*x1-y1*y1; const t2 = 0.5-x2*x2-y2*y2;
    let n0 = 0; let n1 = 0; let n2 = 0; let g;
    if (t0>0) {
      g = GRAD[table[a+table[b]]&7]; n0 = t0*t0*t0*t0*(g[0]*x0+g[1]*y0);
    }
    if (t1>0) {
      g = GRAD[table[a+c+table[b+d]]&7]; n1 = t1*t1*t1*t1*(g[0]*x1+g[1]*y1);
    }
    if (t2>0) {
      g = GRAD[table[a+1+table[b+1]]&7]; n2 = t2*t2*t2*t2*(g[0]*x2+g[1]*y2);
    }
    return 70 * (n0 + n1 + n2);
  }

  createPermutationTable(seed: number) {
    const rng = this.newRandom(seed); const p = new Array<number>(); let i: number; let j: number; let k: number;
    for (i = 0; i < 256; i++) p.push(i);
    for (i = 255; i > 0; i--) {
      j = Math.floor(rng() * (i + 1));
      k = p[i]; p[i] = p[j]; p[i+256] = p[j]; p[j] = k; p[j+256] = k;
    }
    return p;
  }

  createNoiseMatrix(width: number, height: number, frequency: number, amplitude: number, lacunarity: number, persistance: number, table: any) {
    let y = 0; let x = 0; let min = 1; let max = -1; let a; let b; let n;
    const result = new Array(height);
    for (y = 0; y < height; y++) {
      result[y] = new Array(width);
      for (x = 0; x < width; x++) {
        a = frequency; b = amplitude; n = 0;
        while (b > 0.01) {
          n += this.simplexNoise(table, a * x / width, a * y / height) * b;
          a *= lacunarity; b *= persistance;
        }
        result[y][x] = n;
        if (n < min) min = n;
        if (n > max) max = n;
      }
    }
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        result[y][x] = (result[y][x] - min) / (max - min);
      }
    }
    return result;
  }

  create(width: number, height: number, params: any) {
    width = width || 0;
    height = height || 0;
    params = params || {};
    const frequency = parseFloat(params.frequency) || 1;
    const amplitude = parseFloat(params.amplitude) || 1;
    const persistance = parseFloat(params.persistance) || 0.5;
    const lacunarity = 1 / persistance;
    const table = this.createPermutationTable(params.seed);
    const noise = this.createNoiseMatrix(width, height, frequency, amplitude, lacunarity, persistance, table);
    return noise;
  }
}
