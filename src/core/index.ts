const fs = require('fs-extra')
const path = require('node:path')
import Bot, { BotConfig } from '@baibai/core/Bot'

const packageObj = fs.readJsonSync(path.join(__dirname, '../secrets/.servers.json'))

packageObj.forEach(config => {
  new Bot(config)
    .init()
})

