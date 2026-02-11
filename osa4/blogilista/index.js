const app = require('./app.js') // the actual Express application
const logger = require('./utils/logger')
const { PORT } = require('./utils/config')

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
