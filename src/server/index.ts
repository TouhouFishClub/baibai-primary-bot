import Koa, { DefaultState, DefaultContext, Context, Next } from "koa"
import Router from "@koa/router"

const app: Koa<DefaultState, DefaultContext> = new Koa()
const router: Router<DefaultState, DefaultContext> = new Router()

const port: number = 30072

router.get('/', (ctx: Context, next: Next) => {
  // ctx.router available
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})