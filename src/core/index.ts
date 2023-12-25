const fs = require('fs-extra')
const path = require('node:path')
import { parse } from 'yaml'

import Bot from '@baibai/core/Bot'
import { HelloWorld } from "@baibai/plugins/helloworld";

const packageObj = parse(fs.readFileSync(path.join(__dirname, '../secrets/.servers.yaml'), 'utf8'))

packageObj.forEach(config => {
  new Bot(config)
    .installPlugins(
      new HelloWorld()
    )
    .init()
})

