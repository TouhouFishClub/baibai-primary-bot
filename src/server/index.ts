const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

const port = 30072

router.get('/', (ctx, next) => {
  // ctx.router available
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})