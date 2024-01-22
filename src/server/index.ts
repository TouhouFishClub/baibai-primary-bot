import http from "http";
import url from "url";
import Koa, { DefaultState, DefaultContext, Context, Next } from "koa"
import Router from "@koa/router"
import WebSocket, {RawData, WebSocketServer} from "ws";
import Bot from "@baibai/core/Bot"

const app: Koa<DefaultState, DefaultContext> = new Koa()
const router: Router<DefaultState, DefaultContext> = new Router()

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });
const socketManager = new Map();

const port: number = 30072

wss.on('connection', (ws, request) => {
  // 解析 WebSocket 连接的 URL
  const parsedUrl = url.parse(request.url || '');
  const pathname = parsedUrl.pathname || '';
  const match = pathname.match(/^\/shamrock\/(.+)$/);

  if (match) {
    // 提取 bot_name
    const bot_name = match[1];
    console.log(`bot_name: ${bot_name}, headers: ${JSON.stringify(request.headers, null, 2)}`);
    const bot = new Bot({
      name: bot_name,
      receive: {
        method: 'reverse_ws',
        url: 'ws://'
      },
      send: {
        method: 'same'
      }
    });
    socketManager.set(bot_name, bot);
    bot.initReverseWS(ws)
    ws.on('message', (msg) => {
      bot.handleRawData(msg);
    });

    ws.on('close', () => {
      console.log('ws close');
      socketManager.delete(bot_name);
    });
  }
});

router.get('/', (ctx: Context, next: Next) => {
  // ctx.router available
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})