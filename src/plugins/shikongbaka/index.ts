import Plugin, { Rule } from '@baibai/core/Plugin'

export default class ShikongBaka extends Plugin {
  constructor() {
    const name = 'ShikongBaka'
    const rule = ['shikong', '时空']
    const type = 'object'
    super(name, rule, type);
  }
  entry(context: any) {
    return 'baka'
  }
}