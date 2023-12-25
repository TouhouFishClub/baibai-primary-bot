const fs = require('fs-extra')
const path = require('node:path')
import Bot, { BotConfig } from '@baibai/core/Bot'

import { HelloWorld } from "@baibai/plugins/helloworld";

const packageObj = fs.readJsonSync(path.join(__dirname, '../secrets/.servers.json'))

packageObj.forEach(config => {
  new Bot(config)
    .installPlugins(
      new HelloWorld('hello', [{ type: "string", pattern: 'hello' }])
    )
    .init()
})

