import Plugin, { Rule } from '@baibai/core/Plugin'

export default class HelloWorld extends Plugin {
  constructor() {
    const name = 'HelloWorld'
    const rule = ['hello']
    super(name, rule);
  }
  entry(context: any) {
    if(context === 'hello') {
      return 'world'
    }
  }
}