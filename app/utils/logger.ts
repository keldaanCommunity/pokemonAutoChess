export const logger = require("tracer").dailyfile({
    root: 'logs',
    maxLogFiles: 10,
    allLogsFileName: 'pac'
})