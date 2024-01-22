// websocket-manager.ts
import WebSocket, { RawData } from 'ws';

export default class WebSocketManager {
  private wsClient: WebSocket;

  constructor() {
    this.wsClient = new WebSocket('your-websocket-url');
    // 可以在这里设置事件监听器等
  }

  sendMessage(message: string) {
    if (this.wsClient.readyState === WebSocket.OPEN) {
      this.wsClient.send(message);
    }
  }
}
