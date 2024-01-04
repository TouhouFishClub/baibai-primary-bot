import Plugin, { Rule } from '@baibai/core/Plugin'

export default class HelloWorld extends Plugin {
  constructor() {
    const name = 'HelloWorld'
    const rule: Rule[] = ['hello', /^He/]
    super(name, rule)
    this.setBlacklist([713377277])
    // this.setWhitelist([713377277])
  }
  entry(context: any) {
    return 'world'
  }
}