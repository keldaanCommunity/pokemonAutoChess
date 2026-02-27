const fs = require('node:fs')
const path = require('node:path')

function getBaseDir() {
  if (process.env.POKECHESS_HOME) return process.env.POKECHESS_HOME
  if (process.pkg) return path.dirname(process.execPath)
  return process.cwd()
}

function getResultsDir(runId = 'latest') {
  const dir = path.join(getBaseDir(), 'results', runId)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function getDataDir() {
  if (process.env.POKECHESS_DATA) return process.env.POKECHESS_DATA
  return path.join(getBaseDir(), 'data')
}

module.exports = { getBaseDir, getResultsDir, getDataDir }
