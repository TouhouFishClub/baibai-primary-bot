import WebSocket, { RawData } from 'ws'
import Plugin from '@baibai/core/Plugin'

export interface BotConfig {
  name?: string,
  endpoint: string
}

export default class Bot {
  private config: BotConfig
  private wsClient: WebSocket | null
  private plugins: Plugin[] | null

  constructor(config: BotConfig) {
    this.config = config
    this.wsClient = null
  }

  get bot_name() {
    return this.config.name || "UNKNOWN"
  }

  init() {
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
        this.plugins?.forEach(plugin => {
          console.log(plugin.name)
        })
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
        break
    }
  }

  installPlugin(plugins: Plugin[]) {
    this.plugins = plugins.map(plugin => {
      plugin.injectBot(this)
      return plugin
    })
  }

  stop() {
    if (this.wsClient) {
      this.wsClient.removeAllListeners()
      this.wsClient.close()
    }
  }
}
