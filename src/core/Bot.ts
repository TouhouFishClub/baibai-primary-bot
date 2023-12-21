import WebSocket, { RawData } from 'ws'

export interface BotConfig {
  name?: string,
  endpoint: string
}

export default class Bot {
  private config: BotConfig
  private wsClient: WebSocket | null

  constructor(config: BotConfig) {
    this.config = config
    this.wsClient = null
  }

  init(): void {
    this.wsClient = new WebSocket(this.config.endpoint)

    this.wsClient.on('open', () => {
      console.log(`[${this.config.name || 'UNKNOWN'}] WebSocket connected ${this.config.endpoint}`)

      this.wsClient?.on('message', (data: RawData) => {
        console.log('Received message:', data.toString())
      })
    })

    this.wsClient.on('close', () => {
      console.log('WebSocket disconnected')
    })

    this.wsClient.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  stop(): void {
    if (this.wsClient) {
      this.wsClient.removeAllListeners()
      this.wsClient.close()
    }
  }
}
