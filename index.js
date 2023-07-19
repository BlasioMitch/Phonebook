const server = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

server.listen(config.PORT, () => {
    logger.info(`Welcome to this Server running at Port ${config.PORT}`)
})