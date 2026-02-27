const fs = require('node:fs')

function seeded(seed) {
  let s = Number(seed) || 1
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function mean(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function bootstrapCI(samples, rounds, rand) {
  if (!samples.length) return [0, 0]
  const means = []
  for (let i = 0; i < rounds; i++) {
    let sum = 0
    for (let j = 0; j < samples.length; j++) {
      sum += samples[Math.floor(rand() * samples.length)]
    }
    means.push(sum / samples.length)
  }
  means.sort((a, b) => a - b)
  return [means[Math.floor(0.025 * means.length)], means[Math.floor(0.975 * means.length)]]
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2)
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
      args[key] = val
    }
  }
  return args
}

function writeJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2))
}

module.exports = { seeded, mean, bootstrapCI, parseArgs, writeJson }
