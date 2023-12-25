import Bot from '@baibai/core/Bot'

export interface Rule {
  type: 'string' | 'regex'
  pattern: string | RegExp
}

export default class Plugin {
  public name: string
  private rule: Rule[]

  constructor(name: string, rule: Rule[]) {
    this.name = name
    this.rule = rule
  }

  process(context: any) {
    return this.rule.find((r) => {
      if (r.type === 'string' && typeof r.pattern === 'string') {
        return context === r.pattern
      } else if (r.type === 'regex' && r.pattern instanceof RegExp) {
        return r.pattern.test(context)
      }
      return false
    })
  }

  customMethod(context: any) {

  }
}