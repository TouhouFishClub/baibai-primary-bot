import fs from 'node:fs'
import path from 'node:path'
import WebSocket, { RawData } from 'ws'
import Plugin from '@baibai/core/Plugin'

type BotMethodType = 'ws' | 'reverse_ws' | 'http'

interface CommunicationConfig {
  method: BotMethodType;  // 正向ws、反向ws或http
  url: string;     // 端点URL
}

export interface BotConfig {
  name?: string;
  receive: CommunicationConfig;  // 接收信息的配置
  send: CommunicationConfig;    // 发送信息的配置
}

export default class Bot {
  private config: BotConfig
  private wsClient: WebSocket | null
  private plugins: Plugin[] = []

  constructor(config: BotConfig) {
    this.config = config
    this.wsClient = null
  }

  get bot_name() {
    return this.config.name || "UNKNOWN"
  }

  installPlugins(...plugins: Plugin[]) {
    this.plugins = this.plugins.concat(...plugins)
    return this
  }

  private autoLoadPlugins() {
    const pluginsDir = path.join(__dirname, '../plugins')
    const pluginFolders = fs.readdirSync(pluginsDir);

    pluginFolders.forEach((folderName) => {
      const pluginPath = path.join(pluginsDir, folderName, 'index.ts')
      if(fs.existsSync(pluginPath)) {
        try {
          const Plugin = require(pluginPath).default
          const pluginInstance = new Plugin()
          this.installPlugins(pluginInstance)
        } catch (error) {
          console.error(`Error loading plugin from ${pluginPath}:`, error)
        }
      }
    })
  }

  // 正向WebSocket连接
  private setupWSClient() {
    this.wsClient = new WebSocket(this.config.receive.url)

    this.wsClient.on('open', () => {
      console.log(`[${this.bot_name}] ${this.config.receive.url} 开始接收消息`)
      this.wsClient?.on('message', (raw: RawData) => {
        // console.log('\n\nReceived message:', raw.toString())
        this.handleRawData(raw)
      })
    })

    this.wsClient.on('close', () => {
      console.log(`[${this.bot_name}] 会话停止`)
    })

    this.wsClient.on('error', (error) => {
      console.log(`[${this.bot_name}] ERROR: ${error}`)
    })
  }

  private handleRawData(raw: RawData) {
    const data = JSON.parse(raw.toString()), { post_type } = data;
    switch (post_type) {
      case "meta_event":
        // 暂时不处理 meta event
        break;
      case "message":
        this.handleMsg(data);
        break;
      default:
      // 可以添加一些默认的处理逻辑或日志记录
    }
  }

  private handleMsg(raw: any) {
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
          if(plugin.process(raw_message) && plugin.isAllowed(group_id)) {
            const res = await plugin.entry(raw_message)
            console.log(`[will send] ${res}`)
          }
        })
        break
    }
  }

  init() {
    this.autoLoadPlugins()
    // 根据不同的方法来初始化接收服务
    switch (this.config.receive.method) {
      case 'ws':
        // 正向WebSocket连接
        this.setupWSClient()
        break
      case 'reverse_ws':
        // 反向WebSocket连接
        //TODO: 你可能需要设置一个服务器来监听客户端的连接
        console.log(`[${this.bot_name}] 使用反向WebSocket (reverse ws) 尚未实现。`)
        break
      default:
        console.error(`[${this.bot_name}] 未知的接收方法: ${this.config.receive.method}`)
    }
  }

  stop() {
    if (this.wsClient) {
      this.wsClient.removeAllListeners()
      this.wsClient.close()
    }
  }
}
