import Plugin, { Rule } from '@baibai/core/Plugin'

export class HelloWorld extends Plugin {
  constructor(name: string, rule: Rule[]) {
    super(name, rule);
  }
  customMethod(context: any) {
    if(context === 'hello') {
      return 'world'
    }
  }
}