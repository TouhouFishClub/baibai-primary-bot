import fs from 'fs-extra'
import path from 'node:path'
import { parse } from 'yaml'

import Bot, { BotConfig } from '@baibai/core/Bot'

const packageObj = parse(fs.readFileSync(path.join(__dirname, '../secrets/.servers.yaml'), 'utf8'))

packageObj.forEach((config: BotConfig) => {
  new Bot(config)
    .init()
})

