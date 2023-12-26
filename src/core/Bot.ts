import fs from 'node:fs'
import path from 'node:path'
import WebSocket, { RawData } from 'ws'
import Plugin from '@baibai/core/Plugin'

export interface BotConfig {
  name?: string,
  endpoint: string
}

export default class Bot {
  private config: BotConfig
  private wsClient: WebSocket | null
  private plugins: Plugin[] | null = []

  constructor(config: BotConfig) {
    this.config = config
    this.wsClient = null
  }

  get bot_name() {
    return this.config.name || "UNKNOWN"
  }

  autoLoadPlugins() {
    const pluginsDir = path.join(__dirname, '../plugins')
    const pluginFolders = fs.readdirSync(pluginsDir);

    pluginFolders.forEach((folderName) => {
      const pluginPath = path.join(pluginsDir, folderName, 'index.ts');
      try {
        const Plugin = require(pluginPath).default
        const pluginInstance = new Plugin()
        this.installPlugins(pluginInstance)
      } catch (error) {
        console.error(`Error loading plugin from ${pluginPath}:`, error)
      }
    })
  }

  init() {
    this.autoLoadPlugins()

    this.wsClient = new WebSocket(this.config.endpoint)

    this.wsClient.on('open', () => {
      console.log(`[${this.bot_name}] ${this.config.endpoint} 开始接收消息`)
      this.wsClient?.on('message', (raw: RawData) => {
        // console.log('Received message:', raw.toString())
        const data = JSON.parse(raw.toString()), { post_type } = data
        switch(post_type) {
          case "meta_event":
            // 暂时不处理 meta event
            break
          case "message":
            this.handleMsg(data)
            break
          default:
        }
      })
    })

    this.wsClient.on('close', () => {
      console.log(`[${this.bot_name}] 会话停止`)
    })

    this.wsClient.on('error', (error) => {
      console.log(`[${this.bot_name}] ERROR: ${error}`)
    })
  }

  private handleMsg(raw) {
    const { message_type } = raw
    switch(message_type) {
      case "private":
        // 暂时不接入私聊
        break
      case "group":
        const {
          group_id,
          sender: { nickname, card, user_id },
          raw_message
        } = raw
        console.log(`[${this.bot_name}][${group_id}][${card || nickname}(${user_id})]: ${raw_message}`)
        this.plugins?.forEach(async plugin => {
          // console.log(plugin.name, plugin.process(raw_message))
          if(plugin.process(raw_message)) {
            const res = await plugin.entry(raw_message)
            console.log(`[will send] ${res}`)
          }
        })
        break
    }
  }

  installPlugins(...plugins: Plugin[]) {
    this.plugins = this.plugins.concat(...plugins)
    return this
  }

  stop() {
    if (this.wsClient) {
      this.wsClient.removeAllListeners()
      this.wsClient.close()
    }
  }
}
