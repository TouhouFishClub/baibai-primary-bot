import Plugin, { Rule } from '@baibai/core/Plugin'
import WebSocket, { RawData } from 'ws'

export default class ShikongBaka extends Plugin {
  constructor() {
    const name = 'ShikongBaka'
    const rule = ['shikong', '时空']
    const type = 'object'
    super(name, rule, type);
  }

  entry(context: string | MessageSegment[], ws: WebSocket): string | MessageSegment[] | Promise<string | MessageSegment[]> {
    return 'baka'
  }
}