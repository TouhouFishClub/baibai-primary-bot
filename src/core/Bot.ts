import WebSocket from 'ws';

interface BotConfig {
  endPoint: string,

}

class Bot {
  private config: BotConfig
  constructor(BotConfig: BotConfig) {
    this.config = BotConfig
  }
  init() {

  }
}

module.exports = { Bot };
