import Plugin, { Rule } from '@baibai/core/Plugin'
import WebSocket, { RawData } from 'ws'

export default class HelloWorld extends Plugin {
  constructor() {
    const name = 'HelloWorld'
    const rule: Rule[] = ['hello', /^He/]
    const type = 'string'
    super(name, rule, type)
    // this.setBlacklist([713377277])
    // this.setWhitelist([713377277])
  }

  entry(context: string | MessageSegment[], ws: WebSocket): string | MessageSegment[] | Promise<string | MessageSegment[]> {
    return 'world'
  }
}